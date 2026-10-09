import { Router, Request, Response } from 'express';
import { db } from '../db/database.js';
import { getAuthenticatedUserId } from './authRoutes.js';
import { generateChatbotResponse, ChatUserContext } from '../ai/geminiService.js';

const router = Router();

// POST /api/chat/message -> process chat message with Gemini AI and strict student personalization
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

          // Extract purely verified, actual student data (Zero hallucinated or fake fallbacks)
          const profileSkills = Array.isArray(profile?.skills) ? profile.skills : [];
          const resumeSkills = Array.isArray(primaryResume?.extractedData?.skills) ? primaryResume.extractedData.skills : [];
          const combinedSkills = Array.from(new Set([...profileSkills, ...resumeSkills]));

          const educationItems = (profile?.education && profile.education.length > 0)
            ? profile.education
            : (primaryResume?.extractedData?.education || []);

          const experienceItems = (profile?.experience && profile.experience.length > 0)
            ? profile.experience
            : (primaryResume?.extractedData?.experience || []);

          const projectItems = (profile?.projects && profile.projects.length > 0)
            ? profile.projects
            : (primaryResume?.extractedData?.projects || []);

          const certItems = (profile?.certifications && profile.certifications.length > 0)
            ? profile.certifications
            : (primaryResume?.extractedData?.certifications || []);

          const targetRoles = Array.isArray(profile?.targetRoles) ? profile.targetRoles : [];

          userContext = {
            userId: user.id,
            role: 'student',
            name: user.displayName || 'Candidate',
            email: user.email,
            headline: profile?.headline,
            bio: profile?.bio,
            hasResume: !!primaryResume,
            skills: combinedSkills,
            education: educationItems,
            experience: experienceItems,
            projects: projectItems,
            certifications: certItems,
            targetRoles: targetRoles,
            careerInterests: targetRoles,
            primaryResume: primaryResume
              ? {
                  id: primaryResume.id,
                  filename: primaryResume.filename,
                  hasAtsScore: typeof primaryResume.atsScore === 'number',
                  atsScore: primaryResume.atsScore,
                  keywordScore: primaryResume.scores?.keywordMatch,
                  formattingScore: primaryResume.scores?.formattingScore,
                  experienceScore: primaryResume.scores?.experienceRelevance,
                  educationScore: primaryResume.scores?.educationRelevance,
                  extractedSkills: primaryResume.extractedData?.skills || [],
                  missingSkills: primaryResume.recommendations?.missingSkills || [],
                  recommendations: primaryResume.recommendations?.resumeImprovements || [],
                  formattingIssues: primaryResume.extractedData?.formattingIssues || [],
                  actionVerbSuggestions: primaryResume.extractedData?.actionVerbSuggestions || [],
                }
              : undefined,
            applicationsCount: applications.length,
            roadmapSummary:
              roadmap && roadmap.length > 0
                ? `${roadmap.length} active 30-60-90 milestone phases (${roadmap[0].phaseTitle})`
                : undefined,
            recentMockScore: interviewSessions[0]?.turns?.[0]?.score,
          };
        } else if (user.role === 'recruiter') {
          const profile = db.getRecruiterProfileByUserId(userId);
          const jobs = db.getAllJobs();

          userContext = {
            userId: user.id,
            role: 'recruiter',
            name: user.displayName || 'Recruiter',
            email: user.email,
            companyName: profile?.company?.name || 'Recruiter Company',
            openJobsCount: jobs.filter((j) => j.status === 'published').length,
            hasResume: false,
            skills: [],
            education: [],
            experience: [],
            projects: [],
            certifications: [],
            targetRoles: [],
            careerInterests: [],
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

      const profileSkills = Array.isArray(profile?.skills) ? profile.skills : [];
      const resumeSkills = Array.isArray(primaryResume?.extractedData?.skills) ? primaryResume.extractedData.skills : [];
      const skills = Array.from(new Set([...profileSkills, ...resumeSkills]));

      // Check if student has actual resume and ATS score
      if (primaryResume && typeof primaryResume.atsScore === 'number') {
        const atsScore = primaryResume.atsScore;
        const missingSkills = primaryResume.recommendations?.missingSkills || [];

        return res.json({
          greeting: `Hi **${user.displayName || 'Candidate'}**! I'm your **CareerPilot AI Assistant**. I have access to your CareerPilot AI profile (${skills.length > 0 ? skills.slice(0, 3).join(', ') : 'Profile created'}) and your primary resume (ATS score: **${atsScore}/100**). How can I assist your career progression today?`,
          suggestions: [
            'What should I learn to become a Data Scientist?',
            `How can I improve my ${atsScore}% ATS score?`,
            missingSkills.length > 0
              ? `How do I bridge gaps in ${missingSkills.slice(0, 2).join(' & ')}?`
              : 'What skills should I learn next?',
            'Give me 3 technical interview questions',
          ],
          personalized: true,
          studentName: user.displayName,
          atsScore,
        });
      } else {
        // First-time user / no resume uploaded yet: strictly NO fake ATS score or fake resume info
        return res.json({
          greeting: `Hi **${user.displayName || 'Candidate'}**! I'm your **CareerPilot AI Assistant**. You haven't uploaded a resume to CareerPilot AI yet. Upload your resume in **Resume Management** to get instant ATS scoring, keyword match diagnostics, and personalized role readiness! How can I assist you today?`,
          suggestions: [
            'How do I build an ATS-friendly resume from scratch?',
            'What skills should I add to my profile for Software Engineering?',
            'What projects stand out to tech recruiters?',
            'Give me a 30-day technical interview prep plan',
          ],
          personalized: true,
          studentName: user.displayName,
          atsScore: undefined,
        });
      }
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
