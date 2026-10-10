import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import { db } from '../db/database.js';
import { requireAuth } from './authRoutes.js';
import { parseResumeWithAI, polishTextWithAI } from '../ai/geminiService.js';
import { Resume } from '../types.js';
import {
  validateResumeFile,
  extractTextFromFileBuffer,
  MAX_RESUME_SIZE,
} from '../utils/resumeParser.js';

const router = Router();

// Configure multer memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_RESUME_SIZE,
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === '.pdf' || ext === '.docx' || ext === '.txt') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file format. Please upload a PDF or DOCX file (up to 15MB).'));
    }
  },
});

// Middleware to handle both multipart/form-data and application/json requests
const flexibleUpload = (req: Request, res: Response, next: NextFunction) => {
  const contentType = req.headers['content-type'] || '';
  if (contentType.includes('multipart/form-data')) {
    upload.any()(req, res, (err: any) => {
      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            error: 'File size exceeds the 15 MB limit. Please upload a smaller file.',
          });
        }
        return res.status(400).json({ error: err.message || 'File upload error.' });
      }
      next();
    });
  } else {
    next();
  }
};

// Apply requireAuth to all resume operations
router.use(requireAuth);

function checkResumeOwnership(
  req: Request,
  res: Response,
  resume: Resume | undefined,
  allowRecruiterRead = false
): resume is Resume {
  if (!resume) {
    res.status(404).json({ error: 'Resume not found' });
    return false;
  }
  const user = (req as any).user;
  if (allowRecruiterRead && (user.role === 'recruiter' || user.role === 'admin')) {
    return true;
  }
  if (resume.studentId !== user.id) {
    res.status(403).json({ error: "Forbidden: Access denied to another student's resume" });
    return false;
  }
  return true;
}

// List Resumes (scoped to authenticated student)
router.get('/', (req: Request, res: Response) => {
  const user = (req as any).user;
  const list = db.getResumesByStudentId(user.id);
  return res.json({ resumes: list });
});

// Single Resume Detail
router.get('/:id', (req: Request, res: Response) => {
  const resume = db.getResumeById(req.params.id);
  if (!checkResumeOwnership(req, res, resume, true)) return;
  return res.json({ resume });
});

// Upload / Replace Resume
router.post('/upload', flexibleUpload, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const userId = user.id;

    // Detect file from multipart or JSON payload
    const uploadedFile = (req.files && (req.files as Express.Multer.File[])[0]) || (req as any).file;
    let filename = uploadedFile?.originalname || req.body?.filename;
    let fileSize = uploadedFile?.size || Number(req.body?.fileSize) || 0;
    let buffer: Buffer | null = uploadedFile?.buffer || null;

    // Handle base64 payload if sent via JSON
    if (!buffer && req.body?.fileBase64) {
      buffer = Buffer.from(req.body.fileBase64, 'base64');
      fileSize = buffer.length;
    }

    // Handle binary string sent in rawText or fileContent
    const incomingRaw = req.body?.rawText || req.body?.fileContent;
    if (!buffer && incomingRaw && typeof incomingRaw === 'string') {
      const isZipHeader = incomingRaw.startsWith('PK\x03\x04');
      const isPdfHeader = incomingRaw.startsWith('%PDF');
      if (isZipHeader || isPdfHeader) {
        buffer = Buffer.from(incomingRaw, 'binary');
        fileSize = buffer.length;
      }
    }

    if (!filename && buffer) {
      filename = 'Uploaded_Resume.docx';
    }

    if (!filename) {
      return res.status(400).json({ error: 'File name is required. Please select a resume file.' });
    }

    // Validate file type and size
    const validation = validateResumeFile(filename, fileSize, buffer || undefined);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    // Extract text from buffer or use provided plain text
    let resumeText = '';
    if (buffer) {
      resumeText = await extractTextFromFileBuffer(buffer, filename);
    } else if (incomingRaw && typeof incomingRaw === 'string') {
      resumeText = incomingRaw.trim();
    }

    // If text could not be extracted
    if (!resumeText || resumeText.length < 5) {
      return res.status(400).json({
        error: `Could not extract text from "${filename}". Please make sure the file contains readable text and is not empty or password-protected.`,
      });
    }

    const existingResumes = db.getResumesByStudentId(userId);
    const isFirst = existingResumes.length === 0;
    const isExplicitReplace = req.body?.replace === true || req.body?.replace === 'true' || req.query?.replace === 'true';

    // If replacing, demote previous primary resumes for this student
    if (isExplicitReplace || isFirst) {
      for (const r of existingResumes) {
        if (r.isPrimary) {
          db.updateResume(r.id, { isPrimary: false });
        }
      }
    }

    const resumeId = `res-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

    // Perform AI parsing
    const { extracted, source } = await parseResumeWithAI(resumeText, filename);

    // Calculate ATS score from detected resume competencies
    const detectedSkillCount = extracted.skills?.length || 0;
    const hasEducation = (extracted.education?.length || 0) > 0;
    const hasExperience = (extracted.experience?.length || 0) > 0;
    const hasProjects = (extracted.projects?.length || 0) > 0;

    let calculatedAts = 45;
    calculatedAts += Math.min(30, detectedSkillCount * 5);
    if (hasEducation) calculatedAts += 9;
    if (hasExperience) calculatedAts += 8;
    if (hasProjects) calculatedAts += 6;
    const overallScore = Math.min(96, Math.max(40, calculatedAts));

    const newResume: Resume = {
      id: resumeId,
      studentId: userId,
      filename,
      fileSize: fileSize || 142000,
      fileReference: `/uploads/${filename}`,
      isPrimary: isFirst || isExplicitReplace,
      atsScore: overallScore,
      processingStatus: 'completed',
      extractedData: extracted,
      scores: {
        overall: overallScore,
        keywordMatch: Math.min(96, overallScore + 2),
        skillsMatch: Math.max(40, overallScore - 1),
        formattingScore: 92,
        experienceRelevance: hasExperience ? 88 : 60,
        educationRelevance: hasEducation ? 90 : 65,
      },
      recommendations: {
        resumeImprovements: [
          'Add quantitative benchmarks to project statements (e.g. latency cut, query time reduced).',
          'Include links to hosted GitHub demos or live staging deployments.',
        ],
        missingSkills: ['Redis', 'Kubernetes', 'CI/CD Pipelines', 'GraphQL'],
        suggestedProjects: [
          {
            title: 'High-Availability Distributed Service',
            description: 'Implement distributed event ingestion and caching mechanism.',
            techStack: extracted.skills.slice(0, 3),
            careerImpact: 'Differentiates candidate from typical junior applicants.',
          },
        ],
        strengths: extracted.strengths || ['Demonstrated relevant technical competencies'],
        weaknesses: extracted.weaknesses || ['Could feature more commercial cloud deployment details'],
        careerReadinessSuggestions: ['Ready for technical phone screens and foundational software engineering rounds.'],
      },
      rawText: resumeText,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.addResume(newResume);

    // Sync student profile dynamically with genuine extracted resume data
    const studentProfile = db.getStudentProfileByUserId(userId);
    if (studentProfile) {
      const mergedSkills = extracted.skills && extracted.skills.length > 0
        ? Array.from(new Set([...studentProfile.skills, ...extracted.skills]))
        : studentProfile.skills;

      const updatedEducation = (studentProfile.education.length === 0 && extracted.education && extracted.education.length > 0)
        ? extracted.education
        : studentProfile.education;

      const updatedExperience = (studentProfile.experience.length === 0 && extracted.experience && extracted.experience.length > 0)
        ? extracted.experience
        : studentProfile.experience;

      const updatedProjects = (studentProfile.projects.length === 0 && extracted.projects && extracted.projects.length > 0)
        ? extracted.projects
        : studentProfile.projects;

      const updatedCerts = (studentProfile.certifications.length === 0 && extracted.certifications && extracted.certifications.length > 0)
        ? extracted.certifications
        : studentProfile.certifications;

      let filled = 10;
      if (extracted.headline || studentProfile.headline) filled += 15;
      if (mergedSkills.length >= 3) filled += 20;
      if (updatedEducation.length > 0) filled += 20;
      if (updatedExperience.length > 0) filled += 15;
      if (updatedProjects.length > 0) filled += 15;
      if (updatedCerts.length > 0) filled += 5;

      db.createOrUpdateStudentProfile(userId, {
        skills: mergedSkills,
        headline: extracted.headline || studentProfile.headline || (mergedSkills.length ? `${mergedSkills.slice(0, 2).join(' & ')} Developer` : 'Software Engineer'),
        education: updatedEducation,
        experience: updatedExperience,
        projects: updatedProjects,
        certifications: updatedCerts,
        atsAverage: overallScore,
        readinessScore: Math.min(96, Math.max(65, Math.round(overallScore * 0.9 + (mergedSkills.length > 5 ? 8 : 0)))),
        profileCompleteness: Math.min(100, filled),
      });
    }

    db.logAiUsage({
      userId,
      feature: 'Resume Parsing & Extraction',
      model: 'gemini-2.5-flash',
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
    console.error('Resume upload error:', err?.message || err);
    return res.status(400).json({ error: err.message || 'Failed to process resume file.' });
  }
});

// Diagnostic route
router.get('/:id/diagnostic', (req: Request, res: Response) => {
  const resume = db.getResumeById(req.params.id);
  if (!checkResumeOwnership(req, res, resume, true)) return;
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
  const user = (req as any).user;
  const resume = db.getResumeById(req.params.id);
  if (!checkResumeOwnership(req, res, resume, false)) return;
  const success = db.setPrimaryResume(user.id, req.params.id);
  return res.json({ success, primaryId: req.params.id });
});

// Update Extracted Info
router.put('/:id/extracted', (req: Request, res: Response) => {
  const resume = db.getResumeById(req.params.id);
  if (!checkResumeOwnership(req, res, resume, false)) return;
  const { extractedData } = req.body;
  const updatedResume = db.updateResume(req.params.id, { extractedData });
  return res.json({ message: 'Extracted resume data updated', resume: updatedResume });
});

// Delete Resume (with protection for demo account)
router.delete('/:id', (req: Request, res: Response) => {
  const resume = db.getResumeById(req.params.id);
  if (!checkResumeOwnership(req, res, resume, false)) return;
  if (resume.id === 'res-alex-1' || resume.studentId === 'user-student-1') {
    return res.status(403).json({ error: 'The demo student resume is protected and cannot be deleted.' });
  }
  const deleted = db.deleteResume(req.params.id);
  return res.json({ success: deleted });
});

// Version History: Get all versions for a resume
router.get('/:id/versions', (req: Request, res: Response) => {
  const resume = db.getResumeById(req.params.id);
  if (!checkResumeOwnership(req, res, resume, false)) return;
  const versions = db.getResumeVersions(req.params.id);
  return res.json({
    versions,
    currentVersion: resume.currentVersion || 1,
    resumeId: resume.id,
    filename: resume.filename,
  });
});

// Version History: Create a new manual checkpoint version
router.post('/:id/versions', (req: Request, res: Response) => {
  const user = (req as any).user;
  const resume = db.getResumeById(req.params.id);
  if (!checkResumeOwnership(req, res, resume, false)) return;
  const { label, changesSummary } = req.body;
  const newVer = db.addResumeVersion(
    req.params.id,
    label,
    changesSummary,
    user.displayName || 'Student'
  );
  if (!newVer) {
    return res.status(404).json({ error: 'Resume not found' });
  }
  return res.status(201).json({
    message: 'New version checkpoint created successfully',
    version: newVer,
  });
});

// Version History: Revert to previous parsed version
router.post('/:id/revert/:versionId', (req: Request, res: Response) => {
  const user = (req as any).user;
  const resume = db.getResumeById(req.params.id);
  if (!checkResumeOwnership(req, res, resume, false)) return;

  const revertedResume = db.revertResumeVersion(req.params.id, req.params.versionId);
  if (!revertedResume) {
    return res.status(404).json({ error: 'Resume or version not found' });
  }

  db.addNotification({
    userId: user.id,
    type: 'resume_analysis',
    title: 'Resume Reverted to Previous Version',
    message: `Resume "${revertedResume.filename}" successfully restored to version ${revertedResume.currentVersion}.`,
    priority: 'medium',
    link: `/student/resumes/${revertedResume.id}/diagnostic`,
  });

  return res.json({
    message: `Successfully reverted to version ${revertedResume.currentVersion}`,
    resume: revertedResume,
  });
});

// Version History: Compare two versions side-by-side
router.get('/:id/compare', (req: Request, res: Response) => {
  const resume = db.getResumeById(req.params.id);
  if (!checkResumeOwnership(req, res, resume, false)) return;

  const { v1, v2 } = req.query;
  if (!v1 || !v2) {
    return res.status(400).json({ error: 'Both v1 and v2 version IDs are required for comparison' });
  }

  const comparison = db.compareResumeVersions(req.params.id, String(v1), String(v2));
  if (!comparison) {
    return res.status(404).json({ error: 'Resume or specified versions not found' });
  }

  return res.json({ comparison });
});

// Bullet Point Improver
router.post('/improve-bullet', async (req: Request, res: Response) => {
  const user = (req as any).user;
  const userId = user.id;
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
