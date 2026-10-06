import { Router, Request, Response } from 'express';
import { db } from '../db/database.js';
import { getAuthenticatedUserId } from './authRoutes.js';

const router = Router();

// GET /api/jobs -> list all jobs
router.get('/', (req: Request, res: Response) => {
  const jobs = db.getAllJobs();
  return res.json({ jobs });
});

// GET /api/jobs/:id
router.get('/:id', (req: Request, res: Response) => {
  const job = db.getJobById(req.params.id);
  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }
  return res.json({ job });
});

// POST /api/jobs -> create job
router.post('/', (req: Request, res: Response) => {
  try {
    const userId = getAuthenticatedUserId(req);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: Authentication required to create a job' });
    }
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

// POST /api/jobs/:id/publish
router.post('/:id/publish', (req: Request, res: Response) => {
  const updated = db.updateJob(req.params.id, { status: 'published' });
  if (!updated) {
    return res.status(404).json({ error: 'Job not found' });
  }
  return res.json({ message: 'Job published', job: updated });
});

// PUT /api/jobs/:id -> Edit Job
router.put('/:id', (req: Request, res: Response) => {
  try {
    const userId = getAuthenticatedUserId(req);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: Authentication required to edit job' });
    }
    const user = db.getUserById(userId);
    if (!user || (user.role !== 'recruiter' && user.role !== 'admin')) {
      return res.status(403).json({ error: 'Forbidden: Recruiter access required to edit job' });
    }
    const existingJob = db.getJobById(req.params.id);
    if (!existingJob) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const updated = db.updateJob(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Job not found' });
    }

    db.logAudit({
      userId,
      userName: user.displayName || 'Recruiter',
      role: 'recruiter',
      action: 'JOB_UPDATED',
      ipAddress: '127.0.0.1',
      timestamp: new Date().toISOString(),
      metadata: { jobId: req.params.id, title: updated.title },
    });

    return res.json({ message: 'Job updated successfully', job: updated });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Job update failed' });
  }
});

// DELETE /api/jobs/:id -> Delete Job
router.delete('/:id', (req: Request, res: Response) => {
  try {
    const userId = getAuthenticatedUserId(req);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: Authentication required to delete job' });
    }
    const user = db.getUserById(userId);
    if (!user || (user.role !== 'recruiter' && user.role !== 'admin')) {
      return res.status(403).json({ error: 'Forbidden: Recruiter access required to delete job' });
    }
    const existingJob = db.getJobById(req.params.id);
    if (!existingJob) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const success = db.deleteJob(req.params.id);

    db.logAudit({
      userId,
      userName: user.displayName || 'Recruiter',
      role: 'recruiter',
      action: 'JOB_DELETED',
      ipAddress: '127.0.0.1',
      timestamp: new Date().toISOString(),
      metadata: { jobId: req.params.id, title: existingJob.title },
    });

    return res.json({ message: 'Job deleted successfully', success });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Job deletion failed' });
  }
});

export default router;
