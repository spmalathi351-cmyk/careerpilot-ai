import { Router, Request, Response } from 'express';
import { db } from '../db/database.js';
import { getAuthenticatedUserId } from './authRoutes.js';

const router = Router();

// List Applications for Current User (Student or Recruiter)
router.get('/', (req: Request, res: Response) => {
  const userId = getAuthenticatedUserId(req);
  const user = db.getUserById(userId);

  if (user?.role === 'recruiter') {
    // Return all applications for recruiter overview
    const apps = db.getAllApplications();
    return res.json({ applications: apps });
  }

  // Student view
  const apps = db.getApplicationsByStudentId(userId);
  return res.json({ applications: apps });
});

// Single Application Detail
router.get('/:id', (req: Request, res: Response) => {
  const app = db.getApplicationById(req.params.id);
  if (!app) {
    return res.status(404).json({ error: 'Application not found' });
  }
  const job = db.getJobById(app.jobId);
  const resume = db.getResumeById(app.resumeId);

  return res.json({ application: app, job, resume });
});

// Create Application (Submit for job)
router.post('/', (req: Request, res: Response) => {
  try {
    const userId = getAuthenticatedUserId(req);
    const { jobId, resumeId, matchScore } = req.body;

    if (!jobId) {
      return res.status(400).json({ error: 'Job ID is required' });
    }

    let targetResumeId = resumeId;
    if (!targetResumeId) {
      const studentResumes = db.getResumesByStudentId(userId);
      targetResumeId = studentResumes[0]?.id || 'res-alex-1';
    }

    const application = db.createApplication({
      studentId: userId,
      jobId,
      resumeId: targetResumeId,
      matchScore: matchScore || 88,
    });

    db.logAudit({
      userId,
      userName: db.getUserById(userId)?.displayName || 'Candidate',
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

// Update Application Stage / Status
router.patch('/:id', (req: Request, res: Response) => {
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
