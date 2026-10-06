import { Router, Request, Response } from 'express';
import { db } from '../db/database.js';
import { getAuthenticatedUserId } from './authRoutes.js';
import { generateChatbotResponse, ChatUserContext } from '../ai/geminiService.js';

const router = Router();

// POST /api/chat/message -> process chat message with Gemini AI and student personalization
router.post('/message', async (req: Request, res: Response) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'A message string is required.' });
    }

    // Check optional authentication context
    const userId = getAuthenticatedUserId(req);
    let userContext: ChatUserContext | undefined;

    if (userId) {
      const user = db.getUserById(userId);
      if (user) {
        if (user.role === 'student') {
          const profile = db.getStudentProfileByUserId(userId);
          const resumes = db.getResumesByStudentId(userId);
          const primaryResume = resumes.find((r) => r.isPrimary) || resumes[0];
          const applications = db.getApplicationsByStudentId(userId);
          const roadmap = db.getRoadmapByStudentId(userId);
          const interviewSessions = db.getInterviewSessionsByStudentId(userId);

          userContext = {
            userId: user.id,
            role: 'student',
            name: user.displayName || 'Candidate',
            email: user.email,
            headline: profile?.headline,
            skills: profile?.skills || primaryResume?.extractedData?.skills || [],
            education: profile?.education?.[0]
              ? `${profile.education[0].degree} in ${profile.education[0].field} (${profile.education[0].institution})`
              : 'Computer Science',
            primaryResume: primaryResume
              ? {
                  id: primaryResume.id,
                  filename: primaryResume.filename,
                  atsScore: primaryResume.atsScore,
                  keywordScore: primaryResume.scores?.keywordMatch,
                  formattingScore: primaryResume.scores?.formattingScore,
                  extractedSkills: primaryResume.extractedData?.skills,
                  missingSkills: primaryResume.recommendations?.missingSkills,
                  recommendations: primaryResume.recommendations?.resumeImprovements,
                  formattingIssues: primaryResume.extractedData?.formattingIssues,
                }
              : undefined,
            applicationsCount: applications.length,
            roadmapSummary:
              roadmap && roadmap.length > 0
                ? `${roadmap.length} active 30-60-90 milestone phases (${roadmap[0].phaseTitle})`
                : undefined,
            recentMockScore: interviewSessions[0]?.turns?.[0]?.score || 85,
          };
        } else if (user.role === 'recruiter') {
          const profile = db.getRecruiterProfileByUserId(userId);
          const jobs = db.getAllJobs();

          userContext = {
            userId: user.id,
            role: 'recruiter',
            name: user.displayName || 'Recruiter',
            email: user.email,
            companyName: profile?.company?.name || 'CareerPilot Demo Technologies',
            openJobsCount: jobs.filter((j) => j.status === 'published').length,
          };
        }
      }
    }

    const { reply, suggestions, source } = await generateChatbotResponse(
      message.trim(),
      Array.isArray(history) ? history : [],
      userContext
    );

    // Log AI telemetry
    if (userId) {
      db.logAiUsage({
        userId,
        feature: 'Career Copilot AI Chatbot',
        model: 'gemini-3.8-flash',
        inputTokens: 480,
        outputTokens: 380,
        status: source === 'gemini' ? 'success' : 'fallback',
      });
    }

    return res.json({
      reply,
      suggestions,
      source,
      userContextAttached: !!userContext,
    });
  } catch (err: any) {
    console.error('Chat error:', err);
    return res.status(500).json({
      error: err.message || 'Chatbot generation error',
    });
  }
});

// GET /api/chat/initial -> provide personalized greeting and dynamic starter prompts
router.get('/initial', (req: Request, res: Response) => {
  const userId = getAuthenticatedUserId(req);

  if (userId) {
    const user = db.getUserById(userId);
    if (user && user.role === 'student') {
      const profile = db.getStudentProfileByUserId(userId);
      const resumes = db.getResumesByStudentId(userId);
      const primaryResume = resumes.find((r) => r.isPrimary) || resumes[0];

      const atsScore = primaryResume?.atsScore || 88;
      const skills = profile?.skills || primaryResume?.extractedData?.skills || [];
      const missingSkills = primaryResume?.recommendations?.missingSkills || ['Docker', 'Redis', 'Kubernetes'];

      return res.json({
        greeting: `Hi **${user.displayName || 'there'}**! I'm your **CareerPilot Copilot**. I have access to your active profile (${skills.slice(0, 3).join(', ')}) and your primary resume (ATS score: **${atsScore}/100**). How can I assist your career progression today?`,
        suggestions: [
          'What should I learn to become a Data Scientist?',
          `How can I improve my ${atsScore}% ATS score?`,
          `How do I bridge gaps in ${missingSkills.slice(0, 2).join(' & ')}?`,
          'Give me 3 technical interview questions',
        ],
        personalized: true,
        studentName: user.displayName,
        atsScore,
      });
    } else if (user && user.role === 'recruiter') {
      return res.json({
        greeting: `Welcome, **${user.displayName || 'Recruiter'}**! I'm your CareerPilot Hiring Copilot. I can assist with writing compelling job descriptions, structuring interview rubrics, and evaluating candidate technical competencies.`,
        suggestions: [
          'Draft technical screening criteria for Senior React Engineer',
          'What are key resume indicators for production-ready full-stack talent?',
          'Generate behavioral interview questions for leadership roles',
        ],
        personalized: true,
      });
    }
  }

  // Unauthenticated / general visitor
  return res.json({
    greeting: `👋 Welcome to **CareerPilot AI**! I'm your AI Career Assistant. Whether you're aiming for software engineering, data science, or preparing for high-stakes technical interviews, I'm here to provide actionable guidance.`,
    suggestions: [
      'What should I learn to become a Data Scientist?',
      'How does the CareerPilot ATS simulator work?',
      'What are the most in-demand software skills in 2026?',
      'Help me structure a 30-60-90 day engineering study plan',
    ],
    personalized: false,
  });
});

export default router;
