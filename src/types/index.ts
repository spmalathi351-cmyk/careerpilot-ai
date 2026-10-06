export type UserRole = 'student' | 'recruiter' | 'admin';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  displayName: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startYear: string;
  endYear: string;
  grade?: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  bulletPoints: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  link?: string;
  github?: string;
  impact?: string;
}

export interface StudentProfile {
  id: string;
  userId: string;
  headline: string;
  bio: string;
  avatar: string;
  phone: string;
  location: string;
  education: EducationItem[];
  skills: string[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  certifications: string[];
  targetRoles: string[];
  preferredLocations: string[];
  readinessScore: number;
  atsAverage: number;
  profileCompleteness: number;
}

export interface Company {
  id: string;
  name: string;
  domain: string;
  description: string;
  logo: string;
  industry: string;
  size: string;
  website: string;
  location: string;
}

export interface RecruiterProfile {
  id: string;
  userId: string;
  companyId: string;
  designation: string;
  phone: string;
  company?: Company;
}

export interface ExtractedResumeData {
  name: string;
  email: string;
  phone: string;
  headline: string;
  summary: string;
  skills: string[];
  education: EducationItem[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  certifications: string[];
  achievements: string[];
  strengths: string[];
  weaknesses: string[];
  formattingIssues: string[];
  actionVerbSuggestions: string[];
}

export interface ResumeVersion {
  id: string;
  versionNumber: number;
  label: string;
  createdAt: string;
  createdBy: string;
  changesSummary: string;
  atsScore: number;
  extractedData: ExtractedResumeData;
  scores: {
    overall: number;
    keywordMatch: number;
    skillsMatch: number;
    formattingScore: number;
    experienceRelevance: number;
    educationRelevance: number;
  };
}

export interface ResumeComparisonResult {
  versionA: ResumeVersion;
  versionB: ResumeVersion;
  scoreDelta: {
    overall: number;
    keywordMatch: number;
    skillsMatch: number;
    formattingScore: number;
    experienceRelevance: number;
    educationRelevance: number;
  };
  skillsDiff: {
    added: string[];
    removed: string[];
    retained: string[];
  };
  experienceDiff: {
    totalRolesA: number;
    totalRolesB: number;
    bulletsModifiedCount: number;
    roleComparisons: {
      roleTitle: string;
      company: string;
      bulletsA: string[];
      bulletsB: string[];
      addedBullets: string[];
      removedBullets: string[];
    }[];
  };
  projectsDiff: {
    addedProjects: string[];
    removedProjects: string[];
    retainedProjects: string[];
    techStackAdditions: string[];
  };
  formattingDiff: {
    resolvedIssues: string[];
    newIssues: string[];
    commonIssues: string[];
  };
}

export interface Resume {
  id: string;
  studentId: string;
  filename: string;
  fileSize: number;
  fileReference: string;
  isPrimary: boolean;
  atsScore: number;
  processingStatus: 'uploaded' | 'validating' | 'processing' | 'completed' | 'failed';
  currentVersion?: number;
  versions?: ResumeVersion[];
  extractedData: ExtractedResumeData;
  scores: {
    overall: number;
    keywordMatch: number;
    skillsMatch: number;
    formattingScore: number;
    experienceRelevance: number;
    educationRelevance: number;
  };
  recommendations: {
    resumeImprovements: string[];
    missingSkills: string[];
    suggestedProjects: {
      title: string;
      description: string;
      techStack: string[];
      careerImpact: string;
    }[];
    strengths: string[];
    weaknesses: string[];
    careerReadinessSuggestions: string[];
  };
  rawText?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Job {
  id: string;
  companyId: string;
  recruiterId: string;
  companyName: string;
  companyLogo: string;
  title: string;
  description: string;
  responsibilities: string[];
  requiredSkills: string[];
  preferredSkills: string[];
  experience: string;
  education: string;
  location: string;
  employmentType: 'Full-time' | 'Internship' | 'Contract' | 'Remote';
  salaryRange?: string;
  deadline?: string;
  status: 'draft' | 'published' | 'closed';
  applicantCount: number;
  createdAt: string;
}

export type ApplicationStage = 'Applied' | 'Screening' | 'Interview' | 'Offer' | 'Rejected';

export interface ApplicationTimelineEvent {
  id: string;
  stage: ApplicationStage;
  title: string;
  description: string;
  createdAt: string;
}

export interface Application {
  id: string;
  studentId: string;
  jobId: string;
  resumeId: string;
  jobTitle: string;
  companyName: string;
  companyLogo: string;
  jobLocation: string;
  stage: ApplicationStage;
  status: 'active' | 'archived' | 'rejected' | 'hired';
  matchScore: number;
  appliedAt: string;
  timeline: ApplicationTimelineEvent[];
  notes?: string;
  interviewScheduled?: string;
}

export interface InterviewTurn {
  id: string;
  sessionId: string;
  questionNumber: number;
  question: string;
  category: 'technical' | 'behavioral' | 'role-specific' | 'hr';
  studentAnswer: string;
  score: number;
  feedback: {
    relevance: number;
    clarity: number;
    structure: number;
    technicalDepth: number;
    communication: number;
    comments: string;
    strengths: string[];
    improvementAreas: string[];
  };
  audioUrl?: string;
  videoUrl?: string;
}

export interface InterviewSession {
  id: string;
  studentId: string;
  applicationId?: string;
  jobTitle: string;
  type: 'mock' | 'video' | 'technical' | 'behavioral';
  status: 'in-progress' | 'completed' | 'abandoned';
  score: number;
  summary: {
    overallVerdict: string;
    readinessRating: string;
    strengths: string[];
    areasForGrowth: string[];
    averageClarity: number;
    averageRelevance: number;
    averageTechnicalDepth: number;
  };
  turns: InterviewTurn[];
  createdAt: string;
  completedAt?: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'application_update' | 'interview_reminder' | 'resume_analysis' | 'career_recommendation' | 'recruiter_invitation' | 'system';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  role: UserRole;
  action: string;
  ipAddress: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface AIUsageLog {
  id: string;
  userId: string;
  feature: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  status: 'success' | 'fallback' | 'error';
  timestamp: string;
}

export interface CareerRoleRecommendation {
  roleId: string;
  roleTitle: string;
  fitPercentage: number;
  demandLevel: 'High' | 'Very High' | 'Moderate';
  averageSalary: string;
  description: string;
  currentSkills: string[];
  requiredSkills: string[];
  missingSkills: string[];
  learningPathRecommendations: string[];
}

export interface CareerRoadmapMilestone {
  id: string;
  dayBracket: '30-day' | '60-day' | '90-day';
  phaseTitle: string;
  objective: string;
  skills: string[];
  learningTopics: { title: string; source: string; estimatedHours: number }[];
  projects: { title: string; description: string; deliverable: string }[];
  practiceTasks: string[];
  completed: boolean;
  completedAt?: string;
}
