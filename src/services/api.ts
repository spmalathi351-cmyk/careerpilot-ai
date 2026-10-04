import {
  User,
  StudentProfile,
  RecruiterProfile,
  Resume,
  Job,
  Application,
  InterviewSession,
  Notification,
  CareerRoleRecommendation,
  CareerRoadmapMilestone,
} from '../types';

const TOKEN_KEY = 'careerpilot_auth_token';

export const api = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  },

  clearToken() {
    localStorage.removeItem(TOKEN_KEY);
  },

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(endpoint, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || 'An error occurred during API request');
    }

    return data as T;
  },

  // --- Auth ---
  registerStudent(body: any) {
    return this.request<{ user: User; token: string }>('/api/auth/register/student', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  loginStudent(body: any) {
    return this.request<{ user: User; token: string }>('/api/auth/login/student', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  registerRecruiter(body: any) {
    return this.request<{ user: User; token: string }>('/api/auth/register/recruiter', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  loginRecruiter(body: any) {
    return this.request<{ user: User; token: string }>('/api/auth/login/recruiter', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  loginAdmin(body: any) {
    return this.request<{ user: User; token: string }>('/api/auth/login/admin', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  getCurrentUser() {
    return this.request<{ user: User }>('/api/auth/me');
  },

  logout() {
    this.clearToken();
    return this.request<{ message: string }>('/api/auth/logout', { method: 'POST' });
  },

  // --- Student ---
  getStudentProfile() {
    return this.request<{ profile: StudentProfile; user: User }>('/api/student/profile');
  },

  updateStudentProfile(profileData: Partial<StudentProfile> & { displayName?: string }) {
    return this.request<{ profile: StudentProfile; message: string }>('/api/student/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  getStudentDashboard() {
    return this.request<{
      user: User;
      profile: StudentProfile;
      resumesCount: number;
      primaryResume?: Resume;
      latestAtsScore: number;
      readinessScore: number;
      profileCompleteness: number;
      applicationsSummary: {
        total: number;
        applied: number;
        screening: number;
        interview: number;
        offer: number;
        rejected: number;
      };
      upcomingInterviews: Application[];
      recentApplications: Application[];
      recentInterviews: InterviewSession[];
      notifications: Notification[];
      recommendedRoles: CareerRoleRecommendation[];
      skillGaps: string[];
    }>('/api/student/dashboard');
  },

  improveBio(bio: string) {
    return this.request<{ improvedBio: string }>('/api/student/improve-bio', {
      method: 'POST',
      body: JSON.stringify({ bio }),
    });
  },

  getJobRecommendations() {
    return this.request<{
      recommendations: {
        job: Job;
        matchScore: number;
        skillsScore: number;
        experienceScore: number;
        educationScore: number;
        fitVerdict: string;
        matchedSkills: string[];
        missingSkills: string[];
        recommendationReason: string;
      }[];
      resumeUsed: {
        id: string;
        filename: string;
        atsScore: number;
        skillsDetectedCount: number;
        sampleSkills: string[];
      };
      totalPublishedJobs: number;
    }>('/api/student/job-recommendations');
  },

  // --- Resumes ---
  getResumes() {
    return this.request<{ resumes: Resume[] }>('/api/resumes');
  },

  getResumeById(id: string) {
    return this.request<{ resume: Resume }>(`/api/resumes/${id}`);
  },

  uploadResume(data: { filename: string; fileSize?: number; rawText?: string }) {
    return this.request<{ message: string; resume: Resume }>('/api/resumes/upload', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getResumeDiagnostic(id: string) {
    return this.request<{ resume: Resume; diagnostic: any }>(`/api/resumes/${id}/diagnostic`);
  },

  setPrimaryResume(id: string) {
    return this.request<{ success: boolean; primaryId: string }>(`/api/resumes/${id}/primary`, {
      method: 'PATCH',
    });
  },

  updateExtractedResumeData(id: string, extractedData: any) {
    return this.request<{ message: string; resume: Resume }>(`/api/resumes/${id}/extracted`, {
      method: 'PUT',
      body: JSON.stringify({ extractedData }),
    });
  },

  deleteResume(id: string) {
    return this.request<{ success: boolean }>(`/api/resumes/${id}`, {
      method: 'DELETE',
    });
  },

  improveBullet(text: string) {
    return this.request<{ improvedBullet: string }>('/api/resumes/improve-bullet', {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  },

  // --- ATS Simulator ---
  analyzeAts(data: { resumeId?: string; resumeText?: string; jobDescription?: string }) {
    return this.request<{ result: any }>('/api/ats/analyze', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  matchJobWithResume(resumeId: string, jobId: string) {
    return this.request<{ job: Job; resume: Resume; matchResult: any }>('/api/ats/job-match', {
      method: 'POST',
      body: JSON.stringify({ resumeId, jobId }),
    });
  },

  getAtsInspector(resumeId: string) {
    return this.request<any>(`/api/ats/inspector/${resumeId}`);
  },

  // --- Career Guidance & Roadmap ---
  getCareerGuidance() {
    return this.request<{
      recommendations: CareerRoleRecommendation[];
      currentSkills: string[];
      readinessScore: number;
      marketContext: string;
    }>('/api/career/guidance');
  },

  getCareerRoadmap() {
    return this.request<{ roadmap: CareerRoadmapMilestone[] }>('/api/career/roadmap');
  },

  toggleRoadmapMilestone(milestoneId: string) {
    return this.request<{ roadmap: CareerRoadmapMilestone[] }>(`/api/career/roadmap/${milestoneId}`, {
      method: 'PATCH',
    });
  },

  generateCustomRoadmap(targetRole: string) {
    return this.request<{ roadmap: CareerRoadmapMilestone[]; message: string }>(
      '/api/career/generate-custom-roadmap',
      {
        method: 'POST',
        body: JSON.stringify({ targetRole }),
      }
    );
  },

  // --- Applications ---
  getApplications() {
    return this.request<{ applications: Application[] }>('/api/applications');
  },

  getApplicationById(id: string) {
    return this.request<{ application: Application; job?: Job; resume?: Resume }>(`/api/applications/${id}`);
  },

  createApplication(data: { jobId: string; resumeId?: string; matchScore?: number }) {
    return this.request<{ message: string; application: Application }>('/api/applications', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateApplicationStage(id: string, stage: Application['stage'], note?: string) {
    return this.request<{ message: string; application: Application }>(`/api/applications/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ stage, note }),
    });
  },

  // --- Interviews ---
  getInterviewPrep() {
    return this.request<{
      targetRole: string;
      readinessScore: number;
      technicalQuestions: any[];
      behavioralQuestions: any[];
      pastSessions: InterviewSession[];
      suggestedPrepAreas: string[];
    }>('/api/interviews/prep');
  },

  startMockInterview(data: { roleTitle?: string; type?: string; applicationId?: string }) {
    return this.request<{
      session: InterviewSession;
      questions: any[];
      firstQuestion: any;
      totalQuestions: number;
    }>('/api/interviews/mock/start', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  submitInterviewAnswer(
    sessionId: string,
    data: {
      questionNumber: number;
      question: string;
      category: string;
      studentAnswer: string;
      role?: string;
    }
  ) {
    return this.request<{ turn: any; session: InterviewSession }>(`/api/interviews/mock/${sessionId}/answer`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  completeInterviewSession(sessionId: string) {
    return this.request<{ message: string; session: InterviewSession }>(
      `/api/interviews/mock/${sessionId}/complete`,
      { method: 'POST' }
    );
  },

  getInterviewSession(sessionId: string) {
    return this.request<{ session: InterviewSession }>(`/api/interviews/mock/${sessionId}`);
  },

  submitVideoInterview(data: any) {
    return this.request<any>('/api/interviews/video/submit', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // --- Recruiter ---
  getRecruiterProfile() {
    return this.request<{ profile: RecruiterProfile; user: User }>('/api/recruiter/profile');
  },

  updateRecruiterProfile(data: any) {
    return this.request<{ profile: RecruiterProfile; message: string }>('/api/recruiter/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  getRecruiterDashboard() {
    return this.request<any>('/api/recruiter/dashboard');
  },

  getRecruiterOverview() {
    return this.request<any>('/api/recruiter/overview');
  },

  getJobs() {
    return this.request<{ jobs: Job[] }>('/api/jobs');
  },

  createJob(jobData: any) {
    return this.request<{ message: string; job: Job }>('/api/jobs', {
      method: 'POST',
      body: JSON.stringify(jobData),
    });
  },

  publishJob(jobId: string) {
    return this.request<{ message: string; job: Job }>(`/api/jobs/${jobId}/publish`, {
      method: 'POST',
    });
  },

  generateJobDescription(params: any) {
    return this.request<{ result: any }>('/api/recruiter/generate-job-desc', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },

  searchCandidates(filters: any) {
    return this.request<{ candidates: any[] }>('/api/recruiter/candidates/search', {
      method: 'POST',
      body: JSON.stringify(filters),
    });
  },

  getCandidateDossier(id: string) {
    return this.request<{
      candidate: any;
      pastInterviews: any[];
      aiEvaluation: any;
      targetJob?: Job;
    }>(`/api/recruiter/candidates/${id}`);
  },

  shortlistCandidate(id: string) {
    return this.request<{ message: string; success: boolean }>(`/api/recruiter/candidates/${id}/shortlist`, {
      method: 'POST',
    });
  },

  inviteCandidate(id: string, data: { jobId: string; message?: string }) {
    return this.request<{ message: string; success: boolean }>(`/api/recruiter/candidates/${id}/invite`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  improveCompanyText(text: string) {
    return this.request<{ improvedText: string }>('/api/recruiter/improve-text', {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  },

  // --- Notifications ---
  getNotifications() {
    return this.request<{ notifications: Notification[]; unreadCount: number }>('/api/notifications');
  },

  markNotificationRead(id: string) {
    return this.request<{ success: boolean }>(`/api/notifications/${id}/read`, {
      method: 'PATCH',
    });
  },

  markAllNotificationsRead() {
    return this.request<{ success: boolean }>('/api/notifications/read-all', {
      method: 'PATCH',
    });
  },

  // --- Admin ---
  getAdminDashboard() {
    return this.request<any>('/api/admin/dashboard');
  },

  getAdminTelemetry() {
    return this.request<any>('/api/admin/telemetry');
  },

  getAdminAiUsage() {
    return this.request<{ logs: any[] }>('/api/admin/ai-usage');
  },

  getAdminAuditLogs() {
    return this.request<{ logs: any[] }>('/api/admin/audit-logs');
  },
};
