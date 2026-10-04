import { Router, Request, Response } from 'express';
import { db } from '../db/database.js';
import { getAuthenticatedUserId } from './authRoutes.js';
import { calculateAtsScore } from '../ai/geminiService.js';

const router = Router();

// ATS Simulation on demand
router.post('/analyze', async (req: Request, res: Response) => {
  try {
    const userId = getAuthenticatedUserId(req);
    const { resumeId, resumeText, jobDescription } = req.body;

    let targetText = resumeText || '';
    if (resumeId) {
      const resume = db.getResumeById(resumeId);
      if (resume) {
        targetText =
          resume.rawText ||
          `${resume.extractedData.name} ${resume.extractedData.headline} ${resume.extractedData.skills.join(
            ', '
          )} ${resume.extractedData.summary}`;
      }
    }

    if (!targetText) {
      // Default to demo resume text
      targetText =
        'Alex Johnson Full-Stack Software Engineer React TypeScript Node.js Python PostgreSQL Docker Git Gemini AI REST APIs System Design';
    }

    const defaultJd =
      jobDescription ||
      'Looking for a Full-Stack Engineer with experience in React, TypeScript, Node.js, REST APIs, PostgreSQL, Docker, and modern AI SDKs.';

    const result = await calculateAtsScore(targetText, defaultJd);

    db.logAiUsage({
      userId,
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
    const userId = getAuthenticatedUserId(req);
    const { resumeId, jobId } = req.body;

    const resume = db.getResumeById(resumeId);
    const job = db.getJobById(jobId);

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const resumeText =
      resume?.rawText ||
      (resume
        ? `${resume.extractedData.name} ${resume.extractedData.headline} ${resume.extractedData.skills.join(', ')}`
        : 'Full stack developer');

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
  const resume = db.getResumeById(req.params.id);
  if (!resume) {
    return res.status(404).json({ error: 'Resume not found' });
  }

  // Generate line-by-line inspection analysis
  const lines = (resume.rawText || '').split('\n').filter((l) => l.trim().length > 0);
  const sampleLines = lines.length
    ? lines
    : [
        'Alex Johnson | alex.johnson@example.com | (555) 234-5678',
        'Full-Stack Software Engineer & Applied AI Enthusiast',
        'Education: California Institute of Technology - B.S. in Computer Science',
        'Skills: TypeScript, React, Node.js, Python, PostgreSQL, Docker, Git',
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
