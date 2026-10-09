import { Router, Request, Response } from 'express';
import { db } from '../db/database.js';
import { requireAuth, requireRole } from './authRoutes.js';
import { generateCareerGuidance, generateCareerRoadmap } from '../ai/geminiService.js';

const router = Router();

// Apply auth and role protection
router.use(requireAuth);
router.use(requireRole(['student', 'admin']));

// Career Guidance Recommendations
router.get('/guidance', async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const userId = user.id;
    const profile = db.getStudentProfileByUserId(userId);
    const resumes = db.getResumesByStudentId(userId);
    const primaryResume = resumes.find((r) => r.isPrimary) || resumes[0];

    const currentSkills = profile?.skills?.length
      ? profile.skills
      : (primaryResume?.extractedData?.skills || []);
    const targetRoles = profile?.targetRoles || [];
    const education = profile?.education[0]?.field || '';

    const hasResume = !!primaryResume;
    const recommendations = (hasResume && currentSkills.length > 0)
      ? await generateCareerGuidance(currentSkills, education, targetRoles)
      : [];

    if (recommendations.length > 0) {
      db.logAiUsage({
        userId,
        feature: 'Career Guidance Roles & Skill Gaps',
        model: 'gemini-3.8-flash',
        inputTokens: 800,
        outputTokens: 600,
        status: 'success',
      });
    }

    return res.json({
      recommendations,
      currentSkills: hasResume ? currentSkills : [],
      readinessScore: hasResume ? (profile?.readinessScore || 0) : 0,
      hasResume,
      marketContext: hasResume
        ? 'Estimates calibrated using industry engineering benchmarks (simulated reference dataset). No guarantees of employment are implied.'
        : 'Upload your resume to unlock your ATS score, profile insights, and career recommendations.',
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to fetch career guidance' });
  }
});

// Career Roadmap
router.get('/roadmap', async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const userId = user.id;
    const resumes = db.getResumesByStudentId(userId);
    const primaryResume = resumes.find((r) => r.isPrimary) || resumes[0];

    if (!primaryResume) {
      return res.json({ roadmap: [], hasResume: false });
    }

    let roadmap = db.getRoadmapByStudentId(userId);

    if (!roadmap) {
      const profile = db.getStudentProfileByUserId(userId);
      const targetRole = profile?.targetRoles?.[0] || 'Software Engineer';
      const skills = profile?.skills?.length ? profile.skills : (primaryResume.extractedData?.skills || []);

      if (skills.length > 0) {
        roadmap = await generateCareerRoadmap(targetRole, skills);
        db.setRoadmapForStudent(userId, roadmap);

        db.logAiUsage({
          userId,
          feature: 'Career Roadmap 30-60-90 Generation',
          model: 'gemini-3.8-flash',
          inputTokens: 950,
          outputTokens: 750,
          status: 'success',
        });
      } else {
        return res.json({ roadmap: [], hasResume: false });
      }
    }

    return res.json({ roadmap, hasResume: true });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to generate roadmap' });
  }
});

// Toggle milestone complete
router.patch('/roadmap/:id', (req: Request, res: Response) => {
  const user = (req as any).user;
  const userId = user.id;
  const updatedRoadmap = db.toggleRoadmapMilestone(userId, req.params.id);
  if (!updatedRoadmap) {
    return res.status(404).json({ error: 'Milestone or roadmap not found' });
  }
  return res.json({ roadmap: updatedRoadmap });
});

// Regenerate Custom Roadmap
router.post('/generate-custom-roadmap', async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const userId = user.id;
    const { targetRole } = req.body;
    const profile = db.getStudentProfileByUserId(userId);
    const resumes = db.getResumesByStudentId(userId);
    const primaryResume = resumes.find((r) => r.isPrimary) || resumes[0];

    if (!primaryResume && (!profile?.skills || profile.skills.length === 0)) {
      return res.status(400).json({ error: 'Upload your resume to unlock your ATS score, profile insights, and career recommendations.' });
    }

    const skills = profile?.skills?.length ? profile.skills : (primaryResume?.extractedData?.skills || []);
    const newRoadmap = await generateCareerRoadmap(targetRole || 'Full-Stack Software Engineer', skills);
    db.setRoadmapForStudent(userId, newRoadmap);

    return res.json({ roadmap: newRoadmap, message: `Roadmap regenerated for ${targetRole}` });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Roadmap generation failed' });
  }
});

export default router;
