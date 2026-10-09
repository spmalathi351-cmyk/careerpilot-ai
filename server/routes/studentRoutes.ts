import { Router, Request, Response } from 'express';
import { db } from '../db/database.js';
import { requireAuth, requireRole } from './authRoutes.js';
import { polishTextWithAI, generateCareerGuidance } from '../ai/geminiService.js';

const router = Router();

// Apply auth and role protection to all student routes
router.use(requireAuth);
router.use(requireRole(['student', 'admin']));

// Student Profile
router.get('/profile', (req: Request, res: Response) => {
  const user = (req as any).user;
  const userId = user.id;
  let profile = db.getStudentProfileByUserId(userId);

  if (!profile) {
    // Generate empty profile for student
    profile = db.createOrUpdateStudentProfile(userId, {
      headline: '',
      bio: '',
      skills: [],
      education: [],
      experience: [],
      projects: [],
      certifications: [],
      targetRoles: [],
      readinessScore: 0,
      atsAverage: 0,
    });
  }

  // Calculate completeness
  let filled = 0;
  if (profile.headline) filled += 10;
  if (profile.bio) filled += 15;
  if (profile.skills.length >= 3) filled += 20;
  if (profile.education.length > 0) filled += 20;
  if (profile.experience.length > 0) filled += 15;
  if (profile.projects.length > 0) filled += 15;
  if (profile.certifications.length > 0) filled += 5;
  profile.profileCompleteness = Math.min(100, filled);

  return res.json({ profile, user });
});

// Update Profile
router.put('/profile', (req: Request, res: Response) => {
  const user = (req as any).user;
  const userId = user.id;
  const updates = req.body;

  const profile = db.createOrUpdateStudentProfile(userId, updates);

  // If user display name is updated
  if (updates.displayName) {
    const existingUser = db.getUserById(userId);
    if (existingUser) {
      existingUser.displayName = updates.displayName;
    }
  }

  db.logAudit({
    userId,
    userName: updates.displayName || user.displayName || 'Student',
    role: 'student',
    action: 'PROFILE_UPDATED',
    ipAddress: '127.0.0.1',
    timestamp: new Date().toISOString(),
  });

  return res.json({ profile, message: 'Profile updated successfully' });
});

// Student Dashboard Data
router.get('/dashboard', async (req: Request, res: Response) => {
  const user = (req as any).user;
  const userId = user.id;
  let profile = db.getStudentProfileByUserId(userId);

  if (!profile) {
    profile = db.createOrUpdateStudentProfile(userId, {});
  }

  const resumes = db.getResumesByStudentId(userId);
  const primaryResume = resumes.find((r) => r.isPrimary) || resumes[0];
  const applications = db.getApplicationsByStudentId(userId);
  const interviews = db.getInterviewSessionsByStudentId(userId);
  const notifications = db.getNotificationsByUserId(userId).slice(0, 5);

  const hasResume = !!primaryResume;

  // Recommended roles only if student has actual resume or profile skills
  let recommendations: any[] = [];
  if (hasResume || (profile.skills && profile.skills.length > 0)) {
    recommendations = await generateCareerGuidance(
      profile.skills,
      profile.education[0]?.field || 'Computer Science',
      profile.targetRoles
    );
  }

  return res.json({
    user,
    profile,
    resumesCount: resumes.length,
    primaryResume: primaryResume || null,
    hasResume,
    latestAtsScore: hasResume && typeof primaryResume.atsScore === 'number' ? primaryResume.atsScore : null,
    readinessScore: hasResume ? (profile.readinessScore || 0) : 0,
    profileCompleteness: profile.profileCompleteness || 0,
    applicationsSummary: {
      total: applications.length,
      applied: applications.filter((a) => a.stage === 'Applied').length,
      screening: applications.filter((a) => a.stage === 'Screening').length,
      interview: applications.filter((a) => a.stage === 'Interview').length,
      offer: applications.filter((a) => a.stage === 'Offer').length,
      rejected: applications.filter((a) => a.stage === 'Rejected').length,
    },
    upcomingInterviews: applications.filter((a) => !!a.interviewScheduled),
    recentApplications: applications.slice(0, 4),
    recentInterviews: interviews.slice(0, 3),
    notifications,
    recommendedRoles: recommendations.slice(0, 3),
    skillGaps: hasResume ? (primaryResume.recommendations?.missingSkills || []) : [],
  });
});

// Polish Bio with Gemini
router.post('/improve-bio', async (req: Request, res: Response) => {
  const user = (req as any).user;
  const userId = user.id;
  const { bio } = req.body;

  const improved = await polishTextWithAI(bio || '', 'student_bio');

  db.logAiUsage({
    userId,
    feature: 'Student Bio Polish',
    model: 'gemini-3.8-flash',
    inputTokens: 120,
    outputTokens: 90,
    status: 'success',
  });

  return res.json({ improvedBio: improved });
});

// Job Recommendation Engine: Match parsed resume against active job postings
router.get('/job-recommendations', (req: Request, res: Response) => {
  const user = (req as any).user;
  const userId = user.id;
  const profile = db.getStudentProfileByUserId(userId);
  const resumes = db.getResumesByStudentId(userId);

  // Active or primary resume
  const activeResume = resumes.find((r) => r.isPrimary) || resumes[0];
  const allJobs = db.getAllJobs().filter((j) => j.status === 'published');

  // If no resume and no manually entered profile skills, return clean empty state
  if (!activeResume && (!profile || !profile.skills || profile.skills.length === 0)) {
    return res.json({
      recommendations: [],
      resumeUsed: null,
      totalPublishedJobs: allJobs.length,
      hasResume: false,
    });
  }

  // Extracted skills strictly from actual resume or profile
  const resumeSkills: string[] = activeResume?.extractedData?.skills || profile?.skills || [];
  const resumeExperience = activeResume?.extractedData?.experience || profile?.experience || [];
  const resumeEducation = activeResume?.extractedData?.education || profile?.education || [];

  const recommendations = allJobs.map((job) => {
    // 1. Skill overlap calculation
    const reqSkills = job.requiredSkills || [];
    const prefSkills = job.preferredSkills || [];

    const lowerResumeSkills = resumeSkills.map((s) => s.toLowerCase());

    const matchedRequired = reqSkills.filter((rs) =>
      lowerResumeSkills.some((candSkill) => candSkill.includes(rs.toLowerCase()) || rs.toLowerCase().includes(candSkill))
    );
    const missingRequired = reqSkills.filter((rs) => !matchedRequired.includes(rs));

    const matchedPreferred = prefSkills.filter((ps) =>
      lowerResumeSkills.some((candSkill) => candSkill.includes(ps.toLowerCase()) || ps.toLowerCase().includes(candSkill))
    );

    const totalRequiredWeight = Math.max(1, reqSkills.length * 1.5);
    const totalPrefWeight = prefSkills.length * 1.0;
    const earnedWeight = matchedRequired.length * 1.5 + matchedPreferred.length * 1.0;

    const skillsScore = Math.min(
      98,
      Math.max(45, Math.round((earnedWeight / (totalRequiredWeight + totalPrefWeight)) * 100))
    );

    // 2. Experience alignment
    let experienceScore = 80;
    if (job.experience.toLowerCase().includes('entry') || job.experience.toLowerCase().includes('0-1')) {
      experienceScore = 95;
    } else if (job.experience.toLowerCase().includes('1-3') || job.experience.toLowerCase().includes('mid')) {
      experienceScore = resumeExperience.length >= 1 ? 92 : 76;
    } else {
      experienceScore = resumeExperience.length >= 2 ? 88 : 70;
    }

    // 3. Education alignment
    let educationScore = 85;
    const candDegree = (resumeEducation[0]?.field || '').toLowerCase();
    if (
      candDegree.includes('computer') ||
      candDegree.includes('software') ||
      candDegree.includes('engineering') ||
      candDegree.includes('data')
    ) {
      educationScore = 96;
    }

    // Composite overall match score
    const overallScore = Math.min(
      99,
      Math.max(50, Math.round(skillsScore * 0.6 + experienceScore * 0.25 + educationScore * 0.15))
    );

    // Qualitative verdict
    let fitVerdict = 'Moderate Alignment';
    if (overallScore >= 88) fitVerdict = 'Exceptional Match';
    else if (overallScore >= 78) fitVerdict = 'Strong Match';
    else if (overallScore >= 65) fitVerdict = 'Good Potential';

    const recommendationReason =
      matchedRequired.length > 0
        ? `Matches ${matchedRequired.length}/${reqSkills.length} core requirements (${matchedRequired
            .slice(0, 3)
            .join(', ')}).`
        : 'Solid foundational software engineering alignment.';

    return {
      job,
      matchScore: overallScore,
      skillsScore,
      experienceScore,
      educationScore,
      fitVerdict,
      matchedSkills: [...matchedRequired, ...matchedPreferred],
      missingSkills: missingRequired,
      recommendationReason,
    };
  });

  recommendations.sort((a, b) => b.matchScore - a.matchScore);

  return res.json({
    recommendations,
    resumeUsed: activeResume
      ? {
          id: activeResume.id,
          filename: activeResume.filename,
          atsScore: activeResume.atsScore,
          skillsDetectedCount: resumeSkills.length,
          sampleSkills: resumeSkills.slice(0, 8),
        }
      : {
          id: 'profile',
          filename: 'Profile Competencies',
          atsScore: 0,
          skillsDetectedCount: resumeSkills.length,
          sampleSkills: resumeSkills.slice(0, 8),
        },
    totalPublishedJobs: allJobs.length,
    hasResume: !!activeResume,
  });
});

export default router;
