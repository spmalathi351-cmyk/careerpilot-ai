import { Router, Request, Response } from 'express';
import { db } from '../db/database.js';
import { requireAuth } from './authRoutes.js';

const router = Router();

// Require authentication for all application operations
router.use(requireAuth);

// List Applications for Current User (Student or Recruiter)
router.get('/', (req: Request, res: Response) => {
  const user = (req as any).user;

  if (user.role === 'recruiter' || user.role === 'admin') {
    // Return all applications for recruiter overview
    const apps = db.getAllApplications();
    return res.json({ applications: apps });
  }

  // Student view: strictly scoped to authenticated student
  const apps = db.getApplicationsByStudentId(user.id);
  return res.json({ applications: apps });
});

// Single Application Detail (Owner student or recruiter/admin only)
router.get('/:id', (req: Request, res: Response) => {
  const user = (req as any).user;
  const app = db.getApplicationById(req.params.id);
  if (!app) {
    return res.status(404).json({ error: 'Application not found' });
  }

  // Verify ownership: student must own the application unless caller is a recruiter/admin
  if (user.role !== 'recruiter' && user.role !== 'admin' && app.studentId !== user.id) {
    return res.status(403).json({ error: "Forbidden: Access denied to another student's application" });
  }

  const job = db.getJobById(app.jobId);
  const resume = db.getResumeById(app.resumeId);

  return res.json({ application: app, job, resume });
});

// Create Application (Submit for job)
router.post('/', (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { jobId, resumeId, matchScore } = req.body;

    if (!jobId) {
      return res.status(400).json({ error: 'Job ID is required' });
    }

    let targetResumeId = resumeId;
    if (!targetResumeId) {
      const studentResumes = db.getResumesByStudentId(user.id);
      targetResumeId = studentResumes.find((r) => r.isPrimary)?.id || studentResumes[0]?.id;
    }

    if (!targetResumeId) {
      return res.status(400).json({
        error: 'A valid resume is required to apply. Please upload a resume first.',
      });
    }

    // Verify resume belongs to the applicant
    const verifiedResume = db.getResumeById(targetResumeId);
    if (!verifiedResume || verifiedResume.studentId !== user.id) {
      return res.status(403).json({ error: 'The selected resume does not belong to your account.' });
    }

    const application = db.createApplication({
      studentId: user.id,
      jobId,
      resumeId: targetResumeId,
      matchScore: matchScore || 88,
    });

    db.logAudit({
      userId: user.id,
      userName: user.displayName || 'Candidate',
      role: 'student',
      action: 'APPLICATION_SUBMITTED',
      ipAddress: '127.0.0.1',
      timestamp: new Date().toISOString(),
      metadata: { applicationId: application.id, jobId },
    });

    return res.status(201).json({
      message: 'Application submitted successfully',
      application,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Application failed' });
  }
});

// Update Application Stage / Status (Recruiter or Admin only)
router.patch('/:id', (req: Request, res: Response) => {
  const user = (req as any).user;
  if (user.role !== 'recruiter' && user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: Only recruiters can update application stages.' });
  }

  const { stage, note } = req.body;
  if (!stage) {
    return res.status(400).json({ error: 'Stage is required' });
  }

  const updated = db.updateApplicationStage(req.params.id, stage, note);
  if (!updated) {
    return res.status(404).json({ error: 'Application not found' });
  }

  return res.json({ message: 'Application stage updated', application: updated });
});

export default router;
