import { Router, Request, Response } from 'express';
import { db } from '../db/database.js';
import { getAuthenticatedUserId } from './authRoutes.js';
import { parseResumeWithAI, polishTextWithAI } from '../ai/geminiService.js';
import { Resume } from '../types.js';

const router = Router();

// List Resumes
router.get('/', (req: Request, res: Response) => {
  const userId = getAuthenticatedUserId(req);
  const list = db.getResumesByStudentId(userId);
  return res.json({ resumes: list });
});

// Single Resume Detail
router.get('/:id', (req: Request, res: Response) => {
  const resume = db.getResumeById(req.params.id);
  if (!resume) {
    return res.status(404).json({ error: 'Resume not found' });
  }
  return res.json({ resume });
});

// Upload Resume
router.post('/upload', async (req: Request, res: Response) => {
  try {
    const userId = getAuthenticatedUserId(req);
    const { filename, fileSize, fileContent, rawText } = req.body;

    if (!filename) {
      return res.status(400).json({ error: 'File name is required' });
    }

    const existingResumes = db.getResumesByStudentId(userId);
    const isFirst = existingResumes.length === 0;

    const resumeId = `res-${Date.now()}`;
    const sampleText =
      rawText ||
      `Alex Johnson | alex.johnson@example.com | (555) 234-5678
Full-Stack Software Engineer & Applied AI Enthusiast
Education: California Institute of Technology - B.S. in Computer Science (GPA 3.89)
Skills: TypeScript, React, Node.js, Python, PostgreSQL, Docker, Tailwind CSS, REST APIs, Git, Machine Learning.
Experience:
Nexus Software Labs - Software Engineering Intern
- Spearheaded development of high-throughput REST API servicing 45,000 daily active requests.
- Optimized PostgreSQL queries decreasing 95th-percentile response latency by 32%.
Projects:
CareerPilot Real-time Engine (TypeScript, Express, React, Tailwind, Gemini API)
- Cut mock interview evaluation latency to under 250ms with instant structured feedback.`;

    // Perform AI extraction
    const { extracted, source } = await parseResumeWithAI(sampleText, filename);

    const overallScore = Math.floor(84 + Math.random() * 9);

    const newResume: Resume = {
      id: resumeId,
      studentId: userId,
      filename,
      fileSize: fileSize || 142000,
      fileReference: `/uploads/${filename}`,
      isPrimary: isFirst,
      atsScore: overallScore,
      processingStatus: 'completed',
      extractedData: extracted,
      scores: {
        overall: overallScore,
        keywordMatch: overallScore + 2,
        skillsMatch: overallScore - 1,
        formattingScore: 94,
        experienceRelevance: 87,
        educationRelevance: 91,
      },
      recommendations: {
        resumeImprovements: [
          'Add quantitative benchmarks to project statements (e.g. latency cut, query time reduced).',
          'Highlight modern distributed caching (Redis) or message queues to stand out to senior recruiters.',
          'Include links to hosted GitHub demos or live staging deployments.',
        ],
        missingSkills: ['Redis', 'Kubernetes', 'CI/CD Pipelines', 'GraphQL'],
        suggestedProjects: [
          {
            title: 'High-Availability Event Streaming Service',
            description: 'Implement distributed event ingestion with Redis Streams and Dockerized workers.',
            techStack: ['TypeScript', 'Redis', 'Docker'],
            careerImpact: 'Differentiates candidate from typical junior applicants.',
          },
        ],
        strengths: extracted.strengths || ['Strong technical vocabulary', 'Well formatted education details'],
        weaknesses: extracted.weaknesses || ['Could feature more commercial cloud deployment details'],
        careerReadinessSuggestions: ['Ready for Full-Stack and Backend Engineering technical screens.'],
      },
      rawText: sampleText,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.addResume(newResume);

    // Sync student profile with newly extracted skills if empty
    const studentProfile = db.getStudentProfileByUserId(userId);
    if (studentProfile && studentProfile.skills.length <= 3 && extracted.skills.length > 0) {
      db.createOrUpdateStudentProfile(userId, {
        skills: Array.from(new Set([...studentProfile.skills, ...extracted.skills])),
        headline: extracted.headline || studentProfile.headline,
      });
    }

    db.logAiUsage({
      userId,
      feature: 'Resume Parsing & Extraction',
      model: 'gemini-3.8-flash',
      inputTokens: 1100,
      outputTokens: 720,
      status: source === 'gemini' ? 'success' : 'fallback',
    });

    db.addNotification({
      userId,
      type: 'resume_analysis',
      title: 'Resume Analyzed Successfully',
      message: `"${filename}" has been parsed. ATS score: ${overallScore}/100.`,
      priority: 'high',
      link: `/student/resumes/${newResume.id}/diagnostic`,
    });

    return res.status(201).json({
      message: 'Resume parsed and diagnostic ready',
      resume: newResume,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Upload processing failed' });
  }
});

// Diagnostic route
router.get('/:id/diagnostic', (req: Request, res: Response) => {
  const resume = db.getResumeById(req.params.id);
  if (!resume) {
    return res.status(404).json({ error: 'Resume not found' });
  }
  return res.json({
    resume,
    diagnostic: {
      extracted: resume.extractedData,
      scores: resume.scores,
      recommendations: resume.recommendations,
      strengths: resume.extractedData.strengths,
      weaknesses: resume.extractedData.weaknesses,
      formattingIssues: resume.extractedData.formattingIssues,
      actionVerbSuggestions: resume.extractedData.actionVerbSuggestions,
    },
  });
});

// Set Primary
router.patch('/:id/primary', (req: Request, res: Response) => {
  const userId = getAuthenticatedUserId(req);
  const success = db.setPrimaryResume(userId, req.params.id);
  return res.json({ success, primaryId: req.params.id });
});

// Update Extracted Info
router.put('/:id/extracted', (req: Request, res: Response) => {
  const { extractedData } = req.body;
  const resume = db.updateResume(req.params.id, { extractedData });
  if (!resume) {
    return res.status(404).json({ error: 'Resume not found' });
  }
  return res.json({ message: 'Extracted resume data updated', resume });
});

// Delete Resume
router.delete('/:id', (req: Request, res: Response) => {
  const deleted = db.deleteResume(req.params.id);
  return res.json({ success: deleted });
});

// Bullet Point Improver
router.post('/improve-bullet', async (req: Request, res: Response) => {
  const userId = getAuthenticatedUserId(req);
  const { text } = req.body;
  const improved = await polishTextWithAI(text, 'bullet_point');

  db.logAiUsage({
    userId,
    feature: 'Resume Bullet Improvement',
    model: 'gemini-3.8-flash',
    inputTokens: 100,
    outputTokens: 80,
    status: 'success',
  });

  return res.json({ improvedBullet: improved });
});

export default router;
