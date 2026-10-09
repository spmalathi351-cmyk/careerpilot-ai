import { Router, Request, Response } from 'express';
import { db } from '../db/database.js';
import { requireAuth } from './authRoutes.js';
import { calculateAtsScore } from '../ai/geminiService.js';

const router = Router();

// Apply authentication to all ATS endpoints
router.use(requireAuth);

// ATS Simulation on demand
router.post('/analyze', async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { resumeId, resumeText, jobDescription } = req.body;

    let targetText = resumeText || '';
    if (resumeId) {
      const resume = db.getResumeById(resumeId);
      if (!resume) {
        return res.status(404).json({ error: 'Resume not found' });
      }
      if (resume.studentId !== user.id) {
        return res.status(403).json({ error: "Forbidden: Access denied to another student's resume" });
      }
      targetText =
        resume.rawText ||
        `${resume.extractedData.name} ${resume.extractedData.headline} ${resume.extractedData.skills.join(
          ', '
        )} ${resume.extractedData.summary}`;
    }

    if (!targetText) {
      // Build text from student profile or default placeholder
      const studentProfile = db.getStudentProfileByUserId(user.id);
      targetText = `${user.displayName || 'Candidate'} ${studentProfile?.headline || 'Software Engineer'} ${(studentProfile?.skills || []).join(' ')} ${studentProfile?.bio || ''}`.trim();
    }

    if (!targetText || targetText.length < 10) {
      return res.status(400).json({
        error: 'No resume or profile content available. Upload your resume to unlock your ATS score and diagnostic analysis.',
      });
    }

    const defaultJd =
      jobDescription ||
      'Looking for a Full-Stack Engineer with experience in React, TypeScript, Node.js, REST APIs, PostgreSQL, Docker, and modern cloud technologies.';

    const result = await calculateAtsScore(targetText, defaultJd);

    db.logAiUsage({
      userId: user.id,
      feature: 'ATS Scoring & Match Simulator',
      model: 'gemini-3.8-flash',
      inputTokens: 900,
      outputTokens: 420,
      status: 'success',
    });

    return res.json({ result });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'ATS calculation failed' });
  }
});

// Compare against specific Job
router.post('/job-match', async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { resumeId, jobId } = req.body;

    const resume = db.getResumeById(resumeId);
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }
    if (resume.studentId !== user.id) {
      return res.status(403).json({ error: "Forbidden: Access denied to another student's resume" });
    }

    const job = db.getJobById(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const resumeText =
      resume.rawText ||
      `${resume.extractedData.name} ${resume.extractedData.headline} ${resume.extractedData.skills.join(', ')}`;

    const jobDescription = `${job.title} ${job.description} Required Skills: ${job.requiredSkills.join(
      ', '
    )} Preferred: ${job.preferredSkills.join(', ')}`;

    const result = await calculateAtsScore(resumeText, jobDescription);

    return res.json({
      job,
      resume,
      matchResult: result,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Job match calculation error' });
  }
});

// Get inspector details by resume ID
router.get('/inspector/:id', (req: Request, res: Response) => {
  const user = (req as any).user;
  const resume = db.getResumeById(req.params.id);
  if (!resume) {
    return res.status(404).json({ error: 'Resume not found' });
  }

  // Verify ownership (allow recruiter/admin to inspect candidate resumes)
  if (user.role !== 'recruiter' && user.role !== 'admin' && resume.studentId !== user.id) {
    return res.status(403).json({ error: "Forbidden: Access denied to another student's resume" });
  }

  // Generate line-by-line inspection analysis
  const lines = (resume.rawText || '').split('\n').filter((l) => l.trim().length > 0);
  const sampleLines = lines.length
    ? lines
    : [
        `${resume.extractedData.name || user.displayName || 'Candidate'} | ${user.email}`,
        resume.extractedData.headline || 'Full-Stack Software Engineer',
        `Skills: ${resume.extractedData.skills.join(', ')}`,
        'Nexus Software Labs - Software Engineering Intern',
        'Spearheaded development of high-throughput REST API servicing 45,000 daily requests',
        'Optimized PostgreSQL queries decreasing latency by 32%',
      ];

  return res.json({
    resume,
    lines: sampleLines.map((line, idx) => ({
      lineNumber: idx + 1,
      content: line,
      isHeader: idx < 2 || line.toLowerCase().includes('skills') || line.toLowerCase().includes('experience'),
      detectedKeywords: resume.extractedData.skills.filter((s) => line.toLowerCase().includes(s.toLowerCase())),
      warning: line.length > 120 ? 'Bullet exceeds optimal length; consider splitting for brevity.' : undefined,
    })),
    detectedKeywords: resume.extractedData.skills,
    missingKeywords: resume.recommendations.missingSkills,
    formattingWarnings: resume.extractedData.formattingIssues,
    suggestions: resume.recommendations.resumeImprovements,
  });
});

export default router;
