import { Router, Request, Response } from 'express';
import { db } from '../db/database.js';
import { getAuthenticatedUserId } from './authRoutes.js';
import { generateJobDescriptionWithAI, evaluateCandidateForRecruiter, polishTextWithAI } from '../ai/geminiService.js';

const router = Router();

// Recruiter Profile
router.get('/profile', (req: Request, res: Response) => {
  const userId = getAuthenticatedUserId(req);
  let profile = db.getRecruiterProfileByUserId(userId);
  const user = db.getUserById(userId);

  if (!profile) {
    profile = db.createOrUpdateRecruiterProfile(
      userId,
      { designation: 'Lead Technical Recruiter' },
      { name: 'CareerPilot Demo Technologies' }
    );
  }

  return res.json({ profile, user });
});

// Update Recruiter Profile
router.put('/profile', (req: Request, res: Response) => {
  const userId = getAuthenticatedUserId(req);
  const { designation, phone, companyName, companyDescription, companyDomain, companyLocation, industry, size } =
    req.body;

  const profile = db.createOrUpdateRecruiterProfile(
    userId,
    { designation, phone },
    {
      name: companyName,
      description: companyDescription,
      domain: companyDomain,
      location: companyLocation,
      industry,
      size,
    }
  );

  return res.json({ profile, message: 'Recruiter profile updated' });
});

// Recruiter Dashboard KPIs & Pipeline
router.get('/dashboard', (req: Request, res: Response) => {
  const userId = getAuthenticatedUserId(req);
  const user = db.getUserById(userId);
  const profile = db.getRecruiterProfileByUserId(userId);
  const allJobs = db.getAllJobs();
  const allCandidates = db.getAllStudentCandidates();
  const allApps = db.getAllApplications();

  const activeJobs = allJobs.filter((j) => j.status === 'published');
  const pipeline = {
    totalApplications: allApps.length,
    screening: allApps.filter((a) => a.stage === 'Screening').length,
    interview: allApps.filter((a) => a.stage === 'Interview').length,
    offer: allApps.filter((a) => a.stage === 'Offer').length,
    hired: allApps.filter((a) => a.status === 'hired').length,
  };

  return res.json({
    user,
    profile,
    kpis: {
      activeJobsCount: activeJobs.length,
      totalCandidatesCount: allCandidates.length,
      pipelineTotal: allApps.length,
      shortlistedCount: allApps.filter((a) => a.stage === 'Interview' || a.stage === 'Offer').length,
      interviewsScheduled: allApps.filter((a) => !!a.interviewScheduled).length,
    },
    pipeline,
    recentApplications: allApps.slice(0, 5),
    activeJobs: activeJobs.slice(0, 4),
    topCandidates: allCandidates.slice(0, 4),
  });
});

// Recruiter Overview
router.get('/overview', (req: Request, res: Response) => {
  const allJobs = db.getAllJobs();
  const allCandidates = db.getAllStudentCandidates();
  const allApps = db.getAllApplications();

  return res.json({
    activeJobs: allJobs.filter((j) => j.status === 'published'),
    allApplications: allApps,
    candidates: allCandidates,
    interviewsCount: allApps.filter((a) => a.stage === 'Interview').length,
  });
});

// Jobs List
router.get('/jobs', (req: Request, res: Response) => {
  const jobs = db.getAllJobs();
  return res.json({ jobs });
});

// Create Job
router.post('/jobs', (req: Request, res: Response) => {
  try {
    const userId = getAuthenticatedUserId(req);
    const profile = db.getRecruiterProfileByUserId(userId);
    const {
      title,
      description,
      responsibilities,
      requiredSkills,
      preferredSkills,
      experience,
      education,
      location,
      employmentType,
      salaryRange,
      deadline,
      status,
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    const newJob = db.createJob({
      companyId: profile?.companyId || 'comp-1',
      recruiterId: userId,
      companyName: profile?.company?.name || 'CareerPilot Demo Technologies',
      companyLogo: profile?.company?.logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=150',
      title,
      description,
      responsibilities: responsibilities || [],
      requiredSkills: requiredSkills || [],
      preferredSkills: preferredSkills || [],
      experience: experience || '1-3 Years',
      education: education || 'B.S. in Computer Science',
      location: location || 'San Francisco, CA',
      employmentType: employmentType || 'Full-time',
      salaryRange: salaryRange || '$100k - $140k',
      deadline: deadline || '2026-12-31',
      status: status || 'published',
    });

    db.logAudit({
      userId,
      userName: db.getUserById(userId)?.displayName || 'Recruiter',
      role: 'recruiter',
      action: 'JOB_CREATED',
      ipAddress: '127.0.0.1',
      timestamp: new Date().toISOString(),
      metadata: { jobId: newJob.id, title },
    });

    return res.status(201).json({ message: 'Job created successfully', job: newJob });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Job creation failed' });
  }
});

// Publish Job
router.post('/jobs/:id/publish', (req: Request, res: Response) => {
  const updated = db.updateJob(req.params.id, { status: 'published' });
  if (!updated) {
    return res.status(404).json({ error: 'Job not found' });
  }
  return res.json({ message: 'Job published', job: updated });
});

// Generate Job Description with Gemini
router.post('/generate-job-desc', async (req: Request, res: Response) => {
  try {
    const userId = getAuthenticatedUserId(req);
    const { title, skills, experienceLevel, companyName } = req.body;

    const result = await generateJobDescriptionWithAI({
      title: title || 'Software Engineer',
      skills: skills || ['TypeScript', 'React', 'Node.js'],
      experienceLevel: experienceLevel || 'Mid-Level',
      companyName: companyName || 'CareerPilot Demo Technologies',
    });

    db.logAiUsage({
      userId,
      feature: 'Recruiter Job Description Generator',
      model: 'gemini-3.8-flash',
      inputTokens: 580,
      outputTokens: 420,
      status: 'success',
    });

    return res.json({ result });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Job description generation failed' });
  }
});

// Polish Company Description with Gemini
router.post('/improve-text', async (req: Request, res: Response) => {
  const userId = getAuthenticatedUserId(req);
  const { text } = req.body;
  const improved = await polishTextWithAI(text, 'company_description');
  return res.json({ improvedText: improved });
});

// Candidate Search & Filtering
router.post('/candidates/search', (req: Request, res: Response) => {
  const { query, skill, location, minReadiness, minAts } = req.body;
  let candidates = db.getAllStudentCandidates();

  if (query) {
    const q = query.toLowerCase();
    candidates = candidates.filter(
      (c) =>
        c.user?.displayName.toLowerCase().includes(q) ||
        c.headline.toLowerCase().includes(q) ||
        c.skills.some((s) => s.toLowerCase().includes(q))
    );
  }

  if (skill) {
    const s = skill.toLowerCase();
    candidates = candidates.filter((c) => c.skills.some((sk) => sk.toLowerCase().includes(s)));
  }

  if (location) {
    const loc = location.toLowerCase();
    candidates = candidates.filter((c) => c.location.toLowerCase().includes(loc));
  }

  if (minReadiness) {
    candidates = candidates.filter((c) => c.readinessScore >= parseInt(minReadiness));
  }

  if (minAts) {
    candidates = candidates.filter((c) => (c.primaryResume?.atsScore || 80) >= parseInt(minAts));
  }

  return res.json({ candidates });
});

// Candidate Dossier Detail
router.get('/candidates/:id', async (req: Request, res: Response) => {
  try {
    const userId = getAuthenticatedUserId(req);
    const candidateProfile = db.getStudentProfileById(req.params.id);

    if (!candidateProfile) {
      return res.status(404).json({ error: 'Candidate profile not found' });
    }

    const user = db.getUserById(candidateProfile.userId);
    const resumes = db.getResumesByStudentId(candidateProfile.userId);
    const primaryResume = resumes.find((r) => r.isPrimary) || resumes[0];
    const pastInterviews = db.getInterviewSessionsByStudentId(candidateProfile.userId);

    // AI Evaluation of Candidate
    const activeJobs = db.getAllJobs();
    const primaryJob = activeJobs[0];
    const aiEvaluation = await evaluateCandidateForRecruiter(candidateProfile, primaryJob);

    return res.json({
      candidate: {
        ...candidateProfile,
        user,
        primaryResume,
      },
      pastInterviews,
      aiEvaluation,
      targetJob: primaryJob,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Candidate dossier fetch error' });
  }
});

// Shortlist Candidate
router.post('/candidates/:id/shortlist', (req: Request, res: Response) => {
  const userId = getAuthenticatedUserId(req);
  const candidate = db.getStudentProfileById(req.params.id);

  if (!candidate) {
    return res.status(404).json({ error: 'Candidate not found' });
  }

  db.addNotification({
    userId: candidate.userId,
    type: 'recruiter_invitation',
    title: 'Profile Shortlisted!',
    message: `A hiring team at CareerPilot Demo Technologies reviewed your profile and added you to their priority candidate shortlist.`,
    priority: 'high',
    link: '/student/applications',
  });

  db.logAudit({
    userId,
    userName: db.getUserById(userId)?.displayName || 'Recruiter',
    role: 'recruiter',
    action: 'CANDIDATE_SHORTLISTED',
    ipAddress: '127.0.0.1',
    timestamp: new Date().toISOString(),
    metadata: { candidateId: candidate.id, studentUserId: candidate.userId },
  });

  return res.json({ message: 'Candidate added to recruiter shortlist and notified', success: true });
});

// Invite Candidate to Apply / Interview
router.post('/candidates/:id/invite', (req: Request, res: Response) => {
  const userId = getAuthenticatedUserId(req);
  const { jobId, message } = req.body;
  const candidate = db.getStudentProfileById(req.params.id);

  if (!candidate) {
    return res.status(404).json({ error: 'Candidate not found' });
  }

  const job = db.getJobById(jobId || 'job-1');

  db.addNotification({
    userId: candidate.userId,
    type: 'recruiter_invitation',
    title: `Recruiter Invitation: ${job?.title || 'Open Position'}`,
    message:
      message ||
      `You have been invited to interview for ${job?.title || 'Engineering position'} at ${job?.companyName || 'our company'}.`,
    priority: 'high',
    link: `/student/applications`,
  });

  return res.json({ message: 'Invitation dispatched to candidate', success: true });
});

export default router;
