import { Router, Request, Response } from 'express';
import { db } from '../db/database.js';
import { requireAuth } from './authRoutes.js';
import { generateInterviewQuestions, evaluateInterviewAnswer } from '../ai/geminiService.js';
import { InterviewTurn } from '../types.js';

const router = Router();

// Apply authentication to all interview endpoints
router.use(requireAuth);

// Interview Prep Overview & Question Banks
router.get('/prep', async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const userId = user.id;
    const profile = db.getStudentProfileByUserId(userId);
    const targetRole = profile?.targetRoles[0] || 'Full-Stack Software Engineer';

    const technicalQuestions = await generateInterviewQuestions(targetRole, 'Mid', 'technical');
    const behavioralQuestions = await generateInterviewQuestions(targetRole, 'Mid', 'behavioral');

    const pastSessions = db.getInterviewSessionsByStudentId(userId);

    const resumes = db.getResumesByStudentId(userId);
    const hasResume = resumes.length > 0;
    const allBankQuestions = db.getQuestionBank();

    return res.json({
      targetRole,
      readinessScore: hasResume ? (profile?.readinessScore || 0) : 0,
      hasResume,
      technicalQuestions,
      behavioralQuestions,
      pastSessions,
      questionBankStats: {
        totalQuestions: allBankQuestions.length,
        categories: Array.from(new Set(allBankQuestions.map((q) => q.category))),
        skills: Array.from(new Set(allBankQuestions.map((q) => q.skillOrTech))),
      },
      suggestedPrepAreas: [
        'Practice STAR method with quantifiable business impact numbers',
        'Review database indexing fundamentals and caching invalidation patterns',
        'Prepare 2-minute elevator pitch detailing your capstone projects',
        'Conduct interactive AI mock sessions to evaluate clarity and structure',
      ],
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Prep data fetch failed' });
  }
});

// Structured Question Bank: Search, Filter, Personalize by Resume
router.get('/question-bank', (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const userId = user.id;
    const { role, skillOrTech, category, difficulty, search, personalized } = req.query;

    let questions = db.getQuestionBank({
      role: role as string,
      skillOrTech: skillOrTech as string,
      category: category as string,
      difficulty: difficulty as string,
      search: search as string,
    });

    const resumes = db.getResumesByStudentId(userId);
    const primaryResume = resumes.find((r) => r.isPrimary) || resumes[0];
    const profile = db.getStudentProfileByUserId(userId);
    const studentSkills = (primaryResume?.extractedData?.skills || profile?.skills || []).map((s) =>
      s.toLowerCase()
    );

    // Annotate whether question matches the student's actual resume competencies
    const enriched = questions.map((q) => {
      const isSkillMatch = studentSkills.some(
        (sk) => q.skillOrTech.toLowerCase().includes(sk) || sk.includes(q.skillOrTech.toLowerCase())
      );
      return {
        ...q,
        isResumeSkillMatch: isSkillMatch,
      };
    });

    if (personalized === 'true' && studentSkills.length > 0) {
      // Prioritize questions matching student's verified resume skills
      enriched.sort((a, b) => {
        if (a.isResumeSkillMatch && !b.isResumeSkillMatch) return -1;
        if (!a.isResumeSkillMatch && b.isResumeSkillMatch) return 1;
        return 0;
      });
    }

    return res.json({
      questions: enriched,
      total: enriched.length,
      studentSkillsDetected: studentSkills,
      hasResume: resumes.length > 0,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to fetch question bank' });
  }
});

// Practice Question Bank Item: Submit answer and receive AI evaluation + sample answer
router.post('/question-bank/practice', async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { questionId, studentAnswer, role } = req.body;

    if (!studentAnswer || studentAnswer.trim().length === 0) {
      return res.status(400).json({ error: 'Please provide your answer before submitting.' });
    }

    const questionItem = questionId ? db.getQuestionById(questionId) : undefined;
    const questionText = questionItem?.question || req.body.questionText || 'Technical Interview Question';

    const evaluation = await evaluateInterviewAnswer(
      questionText,
      studentAnswer,
      role || 'Software Engineer'
    );

    db.logAiUsage({
      userId: user.id,
      feature: 'Question Bank Answer Practice Evaluation',
      model: 'gemini-3.8-flash',
      inputTokens: 620,
      outputTokens: 380,
      status: 'success',
    });

    return res.json({
      question: questionItem || null,
      evaluation,
      sampleAnswer: questionItem?.sampleAnswer || null,
      explanation: questionItem?.explanation || null,
      keyEvaluationCriteria: questionItem?.keyEvaluationCriteria || [],
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Practice answer evaluation failed' });
  }
});

// Start Mock Session
router.post('/mock/start', async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const userId = user.id;
    const { roleTitle, type, applicationId } = req.body;

    const targetRole = roleTitle || 'Full-Stack Software Engineer';
    const questions = await generateInterviewQuestions(targetRole, 'Mid', 'technical');
    const behavioral = await generateInterviewQuestions(targetRole, 'Mid', 'behavioral');
    const allQuestions = [...questions.slice(0, 2), ...behavioral.slice(0, 2)];

    const session = db.createInterviewSession({
      studentId: userId,
      jobTitle: targetRole,
      type: type || 'mock',
      applicationId,
    });

    db.logAudit({
      userId,
      userName: user.displayName || 'Candidate',
      role: 'student',
      action: 'MOCK_INTERVIEW_STARTED',
      ipAddress: '127.0.0.1',
      timestamp: new Date().toISOString(),
      metadata: { sessionId: session.id, roleTitle: targetRole },
    });

    return res.status(201).json({
      session,
      questions: allQuestions,
      firstQuestion: allQuestions[0],
      totalQuestions: allQuestions.length,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to start interview session' });
  }
});

// Submit Answer for a Turn
router.post('/mock/:id/answer', async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const session = db.getInterviewSessionById(req.params.id);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    if (session.studentId !== user.id) {
      return res.status(403).json({ error: "Forbidden: Access denied to another student's interview session" });
    }

    const { questionNumber, question, category, studentAnswer, role } = req.body;

    if (!question || !studentAnswer) {
      return res.status(400).json({ error: 'Question and answer are required' });
    }

    const evaluation = await evaluateInterviewAnswer(question, studentAnswer, role || 'Software Engineer');

    const turn: InterviewTurn = {
      id: `turn-${Date.now()}`,
      sessionId: req.params.id,
      questionNumber: questionNumber || 1,
      question,
      category: category || 'technical',
      studentAnswer,
      score: evaluation.score,
      feedback: evaluation,
    };

    const updatedSession = db.addInterviewTurn(req.params.id, turn);

    db.logAiUsage({
      userId: user.id,
      feature: 'Mock Interview Turn Evaluation',
      model: 'gemini-3.8-flash',
      inputTokens: 520,
      outputTokens: 320,
      status: 'success',
    });

    return res.json({
      turn,
      session: updatedSession,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Answer evaluation failed' });
  }
});

// Complete Session
router.post('/mock/:id/complete', (req: Request, res: Response) => {
  const user = (req as any).user;
  const existingSession = db.getInterviewSessionById(req.params.id);
  if (!existingSession) {
    return res.status(404).json({ error: 'Session not found' });
  }
  if (existingSession.studentId !== user.id) {
    return res.status(403).json({ error: "Forbidden: Access denied to another student's interview session" });
  }

  const session = db.completeInterviewSession(req.params.id);
  return res.json({
    message: 'Interview session completed and evaluated',
    session,
  });
});

// Single Session Detail
router.get('/mock/:id', (req: Request, res: Response) => {
  const user = (req as any).user;
  const session = db.getInterviewSessionById(req.params.id);
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }
  if (user.role !== 'recruiter' && user.role !== 'admin' && session.studentId !== user.id) {
    return res.status(403).json({ error: "Forbidden: Access denied to another student's interview session" });
  }
  return res.json({ session });
});

// Video Interview Answer Submission (Camera/Mic or Text Fallback)
router.post('/video/submit', async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { sessionId, question, answerText, videoBlobPresent, recordingDurationSeconds } = req.body;

    const evaluation = await evaluateInterviewAnswer(
      question || 'General technical inquiry',
      answerText || 'Video answer recorded by candidate',
      'Software Engineer'
    );

    db.logAiUsage({
      userId: user.id,
      feature: 'Video Interview Analysis',
      model: 'gemini-3.8-flash',
      inputTokens: 600,
      outputTokens: 350,
      status: 'success',
    });

    return res.json({
      message: 'Video response successfully received and processed',
      evaluation,
      mode: videoBlobPresent ? 'video_recorded' : 'text_fallback',
      duration: recordingDurationSeconds || 45,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Video submission error' });
  }
});

export default router;
