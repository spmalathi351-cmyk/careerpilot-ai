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

    const currentSkills = profile?.skills || primaryResume?.extractedData?.skills || [
      'TypeScript',
      'React',
      'Python',
    ];
    const targetRoles = profile?.targetRoles || ['Full-Stack Software Engineer'];
    const education = profile?.education[0]?.field || 'Computer Science';

    const recommendations = await generateCareerGuidance(currentSkills, education, targetRoles);

    db.logAiUsage({
      userId,
      feature: 'Career Guidance Roles & Skill Gaps',
      model: 'gemini-3.8-flash',
      inputTokens: 800,
      outputTokens: 600,
      status: 'success',
    });

    return res.json({
      recommendations,
      currentSkills,
      readinessScore: profile?.readinessScore || 85,
      marketContext:
        'Estimates calibrated using industry engineering benchmarks (simulated reference dataset). No guarantees of employment are implied.',
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
    let roadmap = db.getRoadmapByStudentId(userId);

    if (!roadmap) {
      const profile = db.getStudentProfileByUserId(userId);
      const targetRole = profile?.targetRoles[0] || 'Full-Stack Software Engineer';
      const skills = profile?.skills || ['React', 'TypeScript', 'Node.js'];

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
    }

    return res.json({ roadmap });
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
    const skills = profile?.skills || ['TypeScript', 'React'];

    const newRoadmap = await generateCareerRoadmap(targetRole || 'Full-Stack Software Engineer', skills);
    db.setRoadmapForStudent(userId, newRoadmap);

    return res.json({ roadmap: newRoadmap, message: `Roadmap regenerated for ${targetRole}` });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Roadmap generation failed' });
  }
});

export default router;
