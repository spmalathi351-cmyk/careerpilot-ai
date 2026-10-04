import {
  User,
  StudentProfile,
  RecruiterProfile,
  Company,
  Resume,
  Job,
  Application,
  InterviewSession,
  InterviewTurn,
  Notification,
  AuditLog,
  AIUsageLog,
  CareerRoleRecommendation,
  CareerRoadmapMilestone,
} from '../types.js';

class InMemoryDatabase {
  users: Map<string, User> = new Map();
  userPasswords: Map<string, string> = new Map(); // demo plain / hashed passwords
  studentProfiles: Map<string, StudentProfile> = new Map();
  recruiterProfiles: Map<string, RecruiterProfile> = new Map();
  companies: Map<string, Company> = new Map();
  resumes: Map<string, Resume> = new Map();
  jobs: Map<string, Job> = new Map();
  applications: Map<string, Application> = new Map();
  interviewSessions: Map<string, InterviewSession> = new Map();
  notifications: Map<string, Notification> = new Map();
  auditLogs: AuditLog[] = [];
  aiUsageLogs: AIUsageLog[] = [];
  roadmaps: Map<string, CareerRoadmapMilestone[]> = new Map();

  constructor() {
    this.seedInitialData();
  }

  seedInitialData() {
    // 1. Users
    const studentUser: User = {
      id: 'user-student-1',
      email: 'student@careerpilot.ai',
      role: 'student',
      displayName: 'Alex Johnson',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      createdAt: new Date('2026-08-15T09:00:00Z').toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.users.set(studentUser.id, studentUser);
    this.userPasswords.set(studentUser.email.toLowerCase(), 'student123');

    const recruiterUser: User = {
      id: 'user-recruiter-1',
      email: 'recruiter@careerpilot.ai',
      role: 'recruiter',
      displayName: 'Sarah Lin',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
      createdAt: new Date('2026-08-10T10:00:00Z').toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.users.set(recruiterUser.id, recruiterUser);
    this.userPasswords.set(recruiterUser.email.toLowerCase(), 'recruiter123');

    const adminUser: User = {
      id: 'user-admin-1',
      email: 'admin@careerpilot.ai',
      role: 'admin',
      displayName: 'Platform Admin',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
      createdAt: new Date('2026-08-01T08:00:00Z').toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.users.set(adminUser.id, adminUser);
    this.userPasswords.set(adminUser.email.toLowerCase(), 'admin123');

    // 2. Companies
    const company1: Company = {
      id: 'comp-1',
      name: 'CareerPilot Demo Technologies',
      domain: 'careerpilot.ai',
      description:
        'A next-generation enterprise AI software studio pioneering modern intelligence tools, distributed platforms, and developer tooling.',
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=150',
      industry: 'Artificial Intelligence & SaaS',
      size: '50-200 Employees',
      website: 'https://careerpilot.ai',
      location: 'San Francisco, CA (Hybrid)',
    };
    this.companies.set(company1.id, company1);

    const company2: Company = {
      id: 'comp-2',
      name: 'PulseCloud Systems',
      domain: 'pulsecloud.io',
      description: 'Global cloud infrastructure platform automating multi-region orchestration and telemetry.',
      logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=150',
      industry: 'Cloud Infrastructure',
      size: '500+ Employees',
      website: 'https://pulsecloud.io',
      location: 'Austin, TX (Remote)',
    };
    this.companies.set(company2.id, company2);

    // 3. Recruiter Profile
    const recruiterProfile: RecruiterProfile = {
      id: 'profile-recruiter-1',
      userId: recruiterUser.id,
      companyId: company1.id,
      designation: 'Lead Technical Recruiter & Talent Partner',
      phone: '+1 (555) 443-2211',
      company: company1,
    };
    this.recruiterProfiles.set(recruiterProfile.id, recruiterProfile);

    // 4. Student Profile
    const studentProfile: StudentProfile = {
      id: 'profile-student-1',
      userId: studentUser.id,
      headline: 'Full-Stack Software Engineer & Applied AI Enthusiast',
      bio: 'Final-year Computer Science senior with strong foundational expertise across React, TypeScript, Node.js, and Gemini AI. Passionate about architecting scalable full-stack applications with clean code and high performance.',
      avatar: studentUser.avatar!,
      phone: '+1 (555) 234-5678',
      location: 'San Francisco, CA',
      education: [
        {
          id: 'edu-1',
          institution: 'California Institute of Technology',
          degree: 'Bachelor of Science',
          field: 'Computer Science',
          startYear: '2022',
          endYear: '2026',
          grade: '3.89 GPA',
        },
      ],
      skills: [
        'TypeScript',
        'React',
        'Node.js',
        'Python',
        'PostgreSQL',
        'Docker',
        'Tailwind CSS',
        'REST APIs',
        'Gemini API',
        'Git',
        'System Design',
      ],
      experience: [
        {
          id: 'exp-1',
          company: 'Nexus Software Labs',
          role: 'Software Engineering Intern',
          location: 'San Francisco, CA',
          startDate: 'May 2025',
          endDate: 'August 2025',
          current: false,
          description: 'Engineered high-throughput REST APIs and client-facing web modules.',
          bulletPoints: [
            'Spearheaded development of high-throughput REST API servicing 45,000 daily active requests.',
            'Optimized PostgreSQL queries decreasing 95th-percentile response latency by 32%.',
            'Implemented automated end-to-end testing pipeline improving release confidence across teams.',
          ],
        },
      ],
      projects: [
        {
          id: 'proj-1',
          title: 'CareerPilot Real-time Engine',
          description: 'Intelligent career acceleration tool with automated resume ranking and semantic search.',
          technologies: ['TypeScript', 'Express', 'React', 'Tailwind', 'AI API'],
          link: 'https://careerpilot.ai',
          impact: 'Cut mock interview evaluation latency to under 250ms with instant structured feedback.',
        },
        {
          id: 'proj-2',
          title: 'CloudVision Predictive Pipeline',
          description: 'End-to-end telemetry anomaly detection dashboard with continuous batch evaluation.',
          technologies: ['Python', 'PyTorch', 'Docker', 'FastAPI'],
          github: 'https://github.com/alexj/cloudvision',
          impact: 'Detected 94% of synthetic system outliers during stress evaluations.',
        },
      ],
      certifications: ['AWS Certified Cloud Practitioner', 'DeepLearning.AI Generative AI Specialist'],
      targetRoles: ['Full-Stack Software Engineer', 'Generative AI Engineer', 'Backend Engineer'],
      preferredLocations: ['San Francisco, CA', 'Remote', 'Seattle, WA'],
      readinessScore: 88,
      atsAverage: 91,
      profileCompleteness: 94,
    };
    this.studentProfiles.set(studentProfile.id, studentProfile);

    // 5. Sample Additional Candidate Profiles for Recruiter Search
    const candidate2User: User = {
      id: 'user-student-2',
      email: 'maya.patel@example.com',
      role: 'student',
      displayName: 'Maya Patel',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250',
      createdAt: '2026-08-20T09:00:00Z',
      updatedAt: '2026-08-20T09:00:00Z',
    };
    this.users.set(candidate2User.id, candidate2User);
    const candidate2Profile: StudentProfile = {
      id: 'profile-student-2',
      userId: candidate2User.id,
      headline: 'Machine Learning Engineer & Data Systems Architect',
      bio: 'Specialized in building scalable data pipelines, deep learning evaluation frameworks, and model serving infrastructure.',
      avatar: candidate2User.avatar!,
      phone: '+1 (555) 321-9988',
      location: 'Seattle, WA (Open to Remote)',
      education: [
        {
          id: 'edu-2',
          institution: 'University of Washington',
          degree: 'Master of Science',
          field: 'Data Science & Machine Learning',
          startYear: '2024',
          endYear: '2026',
          grade: '3.94 GPA',
        },
      ],
      skills: ['Python', 'PyTorch', 'TensorFlow', 'PostgreSQL', 'Docker', 'Kubernetes', 'FastAPI', 'MLflow', 'AWS'],
      experience: [
        {
          id: 'exp-2',
          company: 'DataStream Analytics',
          role: 'Machine Learning Co-op',
          location: 'Seattle, WA',
          startDate: 'Jan 2025',
          endDate: 'Jul 2025',
          current: false,
          description: 'Deployed fraud detection inference pipelines with sub-50ms SLA.',
          bulletPoints: [
            'Trained XGBoost and transformer models on 10M+ transaction logs.',
            'Reduced false positive flagging by 18% saving $400k in manual audits.',
          ],
        },
      ],
      projects: [
        {
          id: 'proj-2-1',
          title: 'Distributed Model Registry',
          description: 'Custom model registry with automated latency profiling and drift detection.',
          technologies: ['Python', 'Docker', 'Kubernetes', 'FastAPI'],
        },
      ],
      certifications: ['TensorFlow Certified Developer', 'AWS Machine Learning Specialty'],
      targetRoles: ['Machine Learning Engineer', 'AI Research Engineer', 'Data Scientist'],
      preferredLocations: ['Seattle, WA', 'San Francisco, CA', 'Remote'],
      readinessScore: 92,
      atsAverage: 93,
      profileCompleteness: 98,
    };
    this.studentProfiles.set(candidate2Profile.id, candidate2Profile);

    const candidate3User: User = {
      id: 'user-student-3',
      email: 'david.chen@example.com',
      role: 'student',
      displayName: 'David Chen',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
      createdAt: '2026-08-25T11:00:00Z',
      updatedAt: '2026-08-25T11:00:00Z',
    };
    this.users.set(candidate3User.id, candidate3User);
    const candidate3Profile: StudentProfile = {
      id: 'profile-student-3',
      userId: candidate3User.id,
      headline: 'Frontend & UI/UX Systems Specialist',
      bio: 'Passionate about design systems, web accessibility (WCAG AA), micro-frontends, and sub-second web performance.',
      avatar: candidate3User.avatar!,
      phone: '+1 (555) 778-9900',
      location: 'New York, NY',
      education: [
        {
          id: 'edu-3',
          institution: 'New York University',
          degree: 'Bachelor of Science',
          field: 'Interactive Media & Computer Science',
          startYear: '2022',
          endYear: '2026',
          grade: '3.82 GPA',
        },
      ],
      skills: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js', 'GraphQL', 'Figma', 'Jest', 'Vite'],
      experience: [
        {
          id: 'exp-3',
          company: 'Apex Digital Creative',
          role: 'Frontend Engineering Intern',
          location: 'New York, NY',
          startDate: 'May 2025',
          endDate: 'Aug 2025',
          current: false,
          description: 'Built customer portals and design system component libraries.',
          bulletPoints: [
            'Engineered 40+ accessible UI components compliant with WCAG 2.1 AA standards.',
            'Reduced bundle sizes by 28% through tree-shaking and dynamic code-splitting.',
          ],
        },
      ],
      projects: [
        {
          id: 'proj-3-1',
          title: 'PaletteUI Design System',
          description: 'Zero-runtime CSS component library with accessible keyboard navigation.',
          technologies: ['TypeScript', 'React', 'Tailwind CSS'],
        },
      ],
      certifications: ['Meta Front-End Developer Professional Certificate'],
      targetRoles: ['Frontend Engineer', 'UI/UX Developer', 'Full-Stack Software Engineer'],
      preferredLocations: ['New York, NY', 'Remote'],
      readinessScore: 86,
      atsAverage: 88,
      profileCompleteness: 90,
    };
    this.studentProfiles.set(candidate3Profile.id, candidate3Profile);

    // 6. Resumes
    const resume1: Resume = {
      id: 'res-alex-1',
      studentId: studentUser.id,
      filename: 'Alex_Johnson_Software_Engineer_2026.pdf',
      fileSize: 184500,
      fileReference: '/uploads/Alex_Johnson_Software_Engineer_2026.pdf',
      isPrimary: true,
      atsScore: 91,
      processingStatus: 'completed',
      extractedData: {
        name: 'Alex Johnson',
        email: 'alex.johnson@example.com',
        phone: '+1 (555) 234-5678',
        headline: 'Full-Stack Software Engineer & Applied AI Enthusiast',
        summary:
          'Passionate computer science graduate with deep experience building resilient web applications, machine learning pipelines, and cloud APIs. Proven track record in rapid prototyping and full-stack software development.',
        skills: [
          'TypeScript',
          'React',
          'Node.js',
          'Python',
          'PostgreSQL',
          'Docker',
          'Git',
          'Tailwind CSS',
          'REST APIs',
          'Gemini API',
          'System Design',
        ],
        education: studentProfile.education,
        experience: studentProfile.experience,
        projects: studentProfile.projects,
        certifications: studentProfile.certifications,
        achievements: [
          'First place in University Hackathon 2024 out of 68 teams',
          'Dean’s Honor List (6 consecutive semesters)',
        ],
        strengths: [
          'Consistent metric-driven bullet points across professional experiences',
          'Strong core stack compatibility with modern cloud SaaS standards',
          'Clear layout and ATS-compliant typography formatting',
        ],
        weaknesses: [
          'Could highlight more unit testing coverage numbers and automated CI/CD pipeline specifics',
        ],
        formattingIssues: [
          'Standard ATS-compliant layout detected; 0 critical column rendering warnings',
        ],
        actionVerbSuggestions: [
          'Change "Assisted with API" to "Architected high-throughput REST API"',
          'Change "Worked on database" to "Optimized complex query execution plans"',
        ],
      },
      scores: {
        overall: 91,
        keywordMatch: 93,
        skillsMatch: 92,
        formattingScore: 95,
        experienceRelevance: 89,
        educationRelevance: 90,
      },
      recommendations: {
        resumeImprovements: [
          'Incorporate more quantitative impact metrics in the summary section.',
          'Add a section dedicated to container orchestration and automated testing methodologies.',
          'Link live deployments or architecture design artifacts directly in project entries.',
        ],
        missingSkills: ['Kubernetes', 'Redis Caching', 'GraphQL', 'AWS Lambda'],
        suggestedProjects: [
          {
            title: 'High-Throughput Distributed Rate Limiter',
            description: 'Build a distributed sliding-window rate limiter using Redis and Express.',
            techStack: ['TypeScript', 'Redis', 'Express', 'Docker'],
            careerImpact: 'Demonstrates deep systems knowledge highly valued by Tier-1 backend recruiters.',
          },
          {
            title: 'Multimodal AI RAG Pipeline',
            description: 'Ingest enterprise documentation and query with hybrid search and Gemini re-ranking.',
            techStack: ['Python', 'Gemini API', 'Vector DB', 'FastAPI'],
            careerImpact: 'Positions you at the forefront of the Generative AI engineering boom.',
          },
        ],
        strengths: [
          'High technical keyword density without spamming',
          'Well articulated internship bullet points with verifiable outcomes',
        ],
        weaknesses: ['Could benefit from more enterprise infrastructure tooling mentions'],
        careerReadinessSuggestions: [
          'Ready for Mid-Level Full-Stack and Junior-to-Mid AI Solutions Engineering interviews.',
        ],
      },
      createdAt: '2026-09-15T10:30:00Z',
      updatedAt: '2026-09-15T10:30:00Z',
    };
    this.resumes.set(resume1.id, resume1);

    // 7. Jobs
    const job1: Job = {
      id: 'job-1',
      companyId: company1.id,
      recruiterId: recruiterUser.id,
      companyName: company1.name,
      companyLogo: company1.logo,
      title: 'Full-Stack AI Solutions Engineer',
      description:
        'We are seeking an ambitious Full-Stack AI Engineer to build cutting-edge intelligent applications and client dashboards. You will work on real-time LLM integration, reactive UI components, and scalable backend services.',
      responsibilities: [
        'Design, develop, and deploy full-stack applications utilizing React, TypeScript, and Node.js.',
        'Integrate modern Generative AI models (Gemini) into production workflows with structured outputs.',
        'Optimize database queries and REST APIs for sub-100ms response targets.',
        'Collaborate closely with product and UX design leaders to iterate rapidly on user feedback.',
      ],
      requiredSkills: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'REST APIs', 'Git'],
      preferredSkills: ['Docker', 'Gemini API / LLMs', 'Tailwind CSS', 'System Design'],
      experience: '0-2 Years (Fresh grads welcome)',
      education: 'B.S. in Computer Science or related STEM field',
      location: 'San Francisco, CA (Hybrid / Flexible)',
      employmentType: 'Full-time',
      salaryRange: '$115,000 - $145,000 + Equity',
      deadline: '2026-11-30',
      status: 'published',
      applicantCount: 14,
      createdAt: '2026-09-01T08:00:00Z',
    };
    this.jobs.set(job1.id, job1);

    const job2: Job = {
      id: 'job-2',
      companyId: company1.id,
      recruiterId: recruiterUser.id,
      companyName: company1.name,
      companyLogo: company1.logo,
      title: 'Backend Systems & Cloud Platform Engineer',
      description:
        'Join our core platform team building fault-tolerant microservices, high-throughput data processing pipelines, and cloud native architectures.',
      responsibilities: [
        'Develop mission-critical RESTful microservices in Node.js / Go.',
        'Manage cloud infrastructure, container orchestration, and CI/CD pipelines.',
        'Implement robust caching, rate-limiting, and distributed telemetry.',
      ],
      requiredSkills: ['Node.js', 'PostgreSQL', 'Docker', 'System Design', 'Git'],
      preferredSkills: ['Kubernetes', 'Redis', 'AWS', 'GraphQL'],
      experience: '1-3 Years',
      education: 'B.S. in Computer Science or Software Engineering',
      location: 'San Francisco, CA (or Remote)',
      employmentType: 'Full-time',
      salaryRange: '$120,000 - $155,000',
      deadline: '2026-12-15',
      status: 'published',
      applicantCount: 22,
      createdAt: '2026-09-05T09:00:00Z',
    };
    this.jobs.set(job2.id, job2);

    const job3: Job = {
      id: 'job-3',
      companyId: company2.id,
      recruiterId: 'recruiter-external',
      companyName: company2.name,
      companyLogo: company2.logo,
      title: 'Cloud Infrastructure & DevOps Engineer',
      description:
        'Help automate cloud orchestration across multiple cloud providers with zero-downtime reliability and enterprise security standards.',
      responsibilities: [
        'Maintain Terraform infrastructure-as-code scripts and multi-region Kubernetes clusters.',
        'Automate deployment pipelines and disaster recovery playbooks.',
      ],
      requiredSkills: ['Docker', 'Kubernetes', 'Python', 'AWS', 'Linux'],
      preferredSkills: ['Terraform', 'Prometheus', 'Grafana'],
      experience: '2+ Years',
      education: 'B.S. in Computer Science or equivalent',
      location: 'Austin, TX (Remote)',
      employmentType: 'Full-time',
      salaryRange: '$130,000 - $165,000',
      deadline: '2026-12-01',
      status: 'published',
      applicantCount: 31,
      createdAt: '2026-09-10T11:00:00Z',
    };
    this.jobs.set(job3.id, job3);

    // 8. Applications
    const app1: Application = {
      id: 'app-1',
      studentId: studentUser.id,
      jobId: job1.id,
      resumeId: resume1.id,
      jobTitle: job1.title,
      companyName: job1.companyName,
      companyLogo: job1.companyLogo,
      jobLocation: job1.location,
      stage: 'Interview',
      status: 'active',
      matchScore: 92,
      appliedAt: '2026-09-16T14:20:00Z',
      interviewScheduled: '2026-10-10T15:00:00Z',
      notes: 'Passed initial resume screening and asynchronous code test. Scheduled for technical panel.',
      timeline: [
        {
          id: 'tl-1',
          stage: 'Applied',
          title: 'Application Submitted',
          description: 'Submitted resume "Alex_Johnson_Software_Engineer_2026.pdf" for Full-Stack AI Solutions Engineer.',
          createdAt: '2026-09-16T14:20:00Z',
        },
        {
          id: 'tl-2',
          stage: 'Screening',
          title: 'Resume Screening Cleared',
          description: 'Recruiter reviewed application and assigned 92% match rating.',
          createdAt: '2026-09-18T10:15:00Z',
        },
        {
          id: 'tl-3',
          stage: 'Interview',
          title: 'Interview Round Scheduled',
          description: 'Technical and architectural deep-dive scheduled for Oct 10, 2026.',
          createdAt: '2026-09-22T16:00:00Z',
        },
      ],
    };
    this.applications.set(app1.id, app1);

    const app2: Application = {
      id: 'app-2',
      studentId: studentUser.id,
      jobId: job2.id,
      resumeId: resume1.id,
      jobTitle: job2.title,
      companyName: job2.companyName,
      companyLogo: job2.companyLogo,
      jobLocation: job2.location,
      stage: 'Screening',
      status: 'active',
      matchScore: 88,
      appliedAt: '2026-09-20T11:45:00Z',
      notes: 'Application in recruiter review queue.',
      timeline: [
        {
          id: 'tl-4',
          stage: 'Applied',
          title: 'Application Submitted',
          description: 'Submitted resume for Backend Systems & Cloud Platform Engineer.',
          createdAt: '2026-09-20T11:45:00Z',
        },
      ],
    };
    this.applications.set(app2.id, app2);

    const app3: Application = {
      id: 'app-3',
      studentId: studentUser.id,
      jobId: job3.id,
      resumeId: resume1.id,
      jobTitle: job3.title,
      companyName: job3.companyName,
      companyLogo: job3.companyLogo,
      jobLocation: job3.location,
      stage: 'Applied',
      status: 'active',
      matchScore: 81,
      appliedAt: '2026-09-25T16:00:00Z',
      timeline: [
        {
          id: 'tl-5',
          stage: 'Applied',
          title: 'Application Submitted',
          description: 'Application received by PulseCloud Systems recruitment portal.',
          createdAt: '2026-09-25T16:00:00Z',
        },
      ],
    };
    this.applications.set(app3.id, app3);

    // 9. Interview Session
    const interviewSession1: InterviewSession = {
      id: 'mock-session-1',
      studentId: studentUser.id,
      applicationId: app1.id,
      jobTitle: 'Full-Stack Software Engineer',
      type: 'mock',
      status: 'completed',
      score: 87,
      summary: {
        overallVerdict:
          'Strong candidate with high technical proficiency and clear articulation of system architecture concepts.',
        readinessRating: 'High - Ready for Final Technical Rounds',
        strengths: [
          'Clear explanation of REST principles, idempotency, and database transaction boundaries.',
          'Articulate communication with structured STAR format during behavioral scenario questions.',
        ],
        areasForGrowth: [
          'Dive deeper into caching invalidation strategies when discussing high-volume endpoints.',
          'Incorporate more concrete quantitative metrics into architectural trade-off comparisons.',
        ],
        averageClarity: 90,
        averageRelevance: 88,
        averageTechnicalDepth: 84,
      },
      turns: [
        {
          id: 'turn-1',
          sessionId: 'mock-session-1',
          questionNumber: 1,
          question:
            'Walk through how you design a scalable RESTful API with idempotency and rate limiting for mission-critical client operations.',
          category: 'technical',
          studentAnswer:
            'When designing a mission-critical RESTful API, I implement idempotency using unique client-generated Idempotency-Keys cached in Redis for 24 hours. For rate limiting, I utilize a sliding window counter in Redis with Token Bucket semantics, responding with standard 429 Too Many Requests and Retry-After headers. Database mutations are wrapped in atomic transactions with optimistic concurrency controls.',
          score: 89,
          feedback: {
            relevance: 95,
            clarity: 92,
            structure: 90,
            technicalDepth: 88,
            communication: 91,
            comments:
              'Excellent, precise technical response covering redis caching, atomicity, and standard HTTP protocols.',
            strengths: ['Identified sliding window token bucket algorithm', 'Highlighted Idempotency-Key headers'],
            improvementAreas: ['Could touch on distributed lock timeouts and edge-case database deadlocks.'],
          },
        },
        {
          id: 'turn-2',
          sessionId: 'mock-session-1',
          questionNumber: 2,
          question:
            'Tell me about a high-pressure situation where a production bug or unexpected requirement threatened a project deadline. How did you handle it?',
          category: 'behavioral',
          studentAnswer:
            'During my internship at Nexus Labs, a database migration caused connection pool exhaustion right before a staging release. I immediately notified the team on Slack, established a dedicated war room, analyzed query telemetry, and rolled back the problematic schema change within 12 minutes. We subsequently added automated slow query regression tests before redeploying successfully.',
          score: 86,
          feedback: {
            relevance: 90,
            clarity: 88,
            structure: 88,
            technicalDepth: 82,
            communication: 89,
            comments: 'Well structured STAR answer demonstrating calm composure and clear communication.',
            strengths: ['Clear timeline and quantifiable recovery metrics (12 minutes)'],
            improvementAreas: ['Explain how you followed up with a formal post-mortem to prevent recurrence.'],
          },
        },
      ],
      createdAt: '2026-09-24T14:00:00Z',
      completedAt: '2026-09-24T14:28:00Z',
    };
    this.interviewSessions.set(interviewSession1.id, interviewSession1);

    // 10. Notifications
    const notifs: Notification[] = [
      {
        id: 'notif-1',
        userId: studentUser.id,
        type: 'interview_reminder',
        title: 'Upcoming Technical Interview',
        message: 'Your interview with CareerPilot Demo Technologies is confirmed for Oct 10 at 3:00 PM PST.',
        priority: 'high',
        read: false,
        link: '/student/applications/app-1',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: 'notif-2',
        userId: studentUser.id,
        type: 'resume_analysis',
        title: 'Resume ATS Analysis Complete',
        message: 'Your primary resume achieved an ATS Compatibility Score of 91/100.',
        priority: 'medium',
        read: false,
        link: '/student/resumes/res-alex-1/diagnostic',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: 'notif-3',
        userId: studentUser.id,
        type: 'career_recommendation',
        title: 'New Career Roadmap Milestones',
        message: 'We generated personalized 30-60-90 day learning milestones for Full-Stack AI Engineer.',
        priority: 'medium',
        read: true,
        link: '/student/career-guidance/roadmap',
        createdAt: new Date(Date.now() - 172800000).toISOString(),
      },
      {
        id: 'notif-4',
        userId: recruiterUser.id,
        type: 'application_update',
        title: 'New Applicant Match (92%)',
        message: 'Candidate Alex Johnson applied for Full-Stack AI Solutions Engineer.',
        priority: 'high',
        read: false,
        link: '/recruiter/candidates/profile-student-1',
        createdAt: new Date(Date.now() - 7200000).toISOString(),
      },
      {
        id: 'notif-5',
        userId: adminUser.id,
        type: 'system',
        title: 'AI Processing Health Optimal',
        message: 'Gemini 3.8 Flash latency average is 242ms across 1,480 evaluation requests.',
        priority: 'low',
        read: false,
        link: '/admin/dashboard',
        createdAt: new Date(Date.now() - 14400000).toISOString(),
      },
    ];
    for (const n of notifs) {
      this.notifications.set(n.id, n);
    }

    // 11. Audit Logs
    this.auditLogs = [
      {
        id: 'audit-1',
        userId: studentUser.id,
        userName: studentUser.displayName,
        role: 'student',
        action: 'RESUME_UPLOAD',
        ipAddress: '192.168.1.42',
        timestamp: '2026-09-15T10:30:00Z',
        metadata: { filename: 'Alex_Johnson_Software_Engineer_2026.pdf', size: 184500 },
      },
      {
        id: 'audit-2',
        userId: studentUser.id,
        userName: studentUser.displayName,
        role: 'student',
        action: 'APPLICATION_SUBMIT',
        ipAddress: '192.168.1.42',
        timestamp: '2026-09-16T14:20:00Z',
        metadata: { jobId: 'job-1', company: 'CareerPilot Demo Technologies' },
      },
      {
        id: 'audit-3',
        userId: recruiterUser.id,
        userName: recruiterUser.displayName,
        role: 'recruiter',
        action: 'CANDIDATE_SHORTLIST',
        ipAddress: '10.0.4.15',
        timestamp: '2026-09-18T10:15:00Z',
        metadata: { candidateId: 'profile-student-1', matchScore: 92 },
      },
      {
        id: 'audit-4',
        userId: studentUser.id,
        userName: studentUser.displayName,
        role: 'student',
        action: 'MOCK_INTERVIEW_COMPLETED',
        ipAddress: '192.168.1.42',
        timestamp: '2026-09-24T14:28:00Z',
        metadata: { score: 87, turns: 2 },
      },
      {
        id: 'audit-5',
        userId: adminUser.id,
        userName: adminUser.displayName,
        role: 'admin',
        action: 'SYSTEM_SETTINGS_AUDIT',
        ipAddress: '127.0.0.1',
        timestamp: '2026-10-01T08:00:00Z',
        metadata: { status: 'healthy', activeSessions: 42 },
      },
    ];

    // 12. AI Usage Logs
    this.aiUsageLogs = [
      {
        id: 'ai-log-1',
        userId: studentUser.id,
        feature: 'Resume Parsing & Extraction',
        model: 'gemini-3.8-flash',
        inputTokens: 1420,
        outputTokens: 760,
        status: 'success',
        timestamp: '2026-09-15T10:30:15Z',
      },
      {
        id: 'ai-log-2',
        userId: studentUser.id,
        feature: 'ATS Semantic Compatibility Scoring',
        model: 'gemini-3.8-flash',
        inputTokens: 980,
        outputTokens: 410,
        status: 'success',
        timestamp: '2026-09-15T10:32:00Z',
      },
      {
        id: 'ai-log-3',
        userId: studentUser.id,
        feature: 'Career Guidance Roadmap (30-60-90)',
        model: 'gemini-3.8-flash',
        inputTokens: 1120,
        outputTokens: 890,
        status: 'success',
        timestamp: '2026-09-20T09:15:00Z',
      },
      {
        id: 'ai-log-4',
        userId: studentUser.id,
        feature: 'Mock Interview Turn Evaluation',
        model: 'gemini-3.8-flash',
        inputTokens: 640,
        outputTokens: 380,
        status: 'success',
        timestamp: '2026-09-24T14:12:00Z',
      },
      {
        id: 'ai-log-5',
        userId: recruiterUser.id,
        feature: 'Candidate Dossier Evaluation',
        model: 'gemini-3.8-flash',
        inputTokens: 890,
        outputTokens: 480,
        status: 'success',
        timestamp: '2026-09-25T11:00:00Z',
      },
    ];
  }

  // --- Auth & Users ---
  getUserById(id: string): User | undefined {
    return this.users.get(id);
  }

  getUserByEmail(email: string): User | undefined {
    const target = email.toLowerCase().trim();
    for (const user of this.users.values()) {
      if (user.email.toLowerCase() === target) {
        return user;
      }
    }
    return undefined;
  }

  createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>, password: string): User {
    const id = `user-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const now = new Date().toISOString();
    const newUser: User = {
      ...userData,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.users.set(id, newUser);
    this.userPasswords.set(userData.email.toLowerCase(), password);

    // Log audit
    this.logAudit({
      userId: id,
      userName: newUser.displayName,
      role: newUser.role,
      action: 'USER_REGISTERED',
      ipAddress: '127.0.0.1',
      timestamp: now,
    });

    return newUser;
  }

  verifyPassword(email: string, pass: string): boolean {
    const stored = this.userPasswords.get(email.toLowerCase().trim());
    return stored === pass;
  }

  // --- Student Profiles ---
  getStudentProfileByUserId(userId: string): StudentProfile | undefined {
    for (const p of this.studentProfiles.values()) {
      if (p.userId === userId) {
        return p;
      }
    }
    return undefined;
  }

  getStudentProfileById(id: string): StudentProfile | undefined {
    return this.studentProfiles.get(id);
  }

  createOrUpdateStudentProfile(userId: string, data: Partial<StudentProfile>): StudentProfile {
    let existing = this.getStudentProfileByUserId(userId);
    const user = this.getUserById(userId);

    if (existing) {
      const updated = { ...existing, ...data };
      this.studentProfiles.set(existing.id, updated);
      return updated;
    }

    const id = `profile-${Date.now()}`;
    const newProfile: StudentProfile = {
      id,
      userId,
      headline: data.headline || 'Aspiring Software Engineer',
      bio: data.bio || '',
      avatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      phone: data.phone || '',
      location: data.location || 'San Francisco, CA',
      education: data.education || [],
      skills: data.skills || ['TypeScript', 'JavaScript', 'React'],
      experience: data.experience || [],
      projects: data.projects || [],
      certifications: data.certifications || [],
      targetRoles: data.targetRoles || ['Full-Stack Software Engineer'],
      preferredLocations: data.preferredLocations || ['Remote'],
      readinessScore: data.readinessScore || 75,
      atsAverage: data.atsAverage || 80,
      profileCompleteness: data.profileCompleteness || 70,
    };
    this.studentProfiles.set(id, newProfile);
    return newProfile;
  }

  getAllStudentCandidates(): (StudentProfile & { user?: User; primaryResume?: Resume })[] {
    const list: (StudentProfile & { user?: User; primaryResume?: Resume })[] = [];
    for (const prof of this.studentProfiles.values()) {
      const user = this.getUserById(prof.userId);
      const userResumes = this.getResumesByStudentId(prof.userId);
      const primaryResume = userResumes.find((r) => r.isPrimary) || userResumes[0];
      list.push({
        ...prof,
        user,
        primaryResume,
      });
    }
    return list;
  }

  // --- Recruiter Profiles & Companies ---
  getRecruiterProfileByUserId(userId: string): RecruiterProfile | undefined {
    for (const r of this.recruiterProfiles.values()) {
      if (r.userId === userId) {
        const company = this.companies.get(r.companyId);
        return { ...r, company };
      }
    }
    return undefined;
  }

  createOrUpdateRecruiterProfile(
    userId: string,
    data: Partial<RecruiterProfile>,
    companyData?: Partial<Company>
  ): RecruiterProfile {
    let company: Company | undefined;
    if (companyData && companyData.name) {
      const companyId = `comp-${Date.now()}`;
      company = {
        id: companyId,
        name: companyData.name,
        domain: companyData.domain || 'example.com',
        description: companyData.description || 'Innovative technology company.',
        logo: companyData.logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=150',
        industry: companyData.industry || 'Technology',
        size: companyData.size || '10-50 Employees',
        website: companyData.website || 'https://example.com',
        location: companyData.location || 'San Francisco, CA',
      };
      this.companies.set(companyId, company);
    }

    let existing = this.getRecruiterProfileByUserId(userId);
    if (existing) {
      const updated: RecruiterProfile = {
        ...existing,
        ...data,
        companyId: company?.id || existing.companyId,
        company: company || this.companies.get(existing.companyId),
      };
      this.recruiterProfiles.set(existing.id, updated);
      return updated;
    }

    const id = `profile-recruiter-${Date.now()}`;
    const newProfile: RecruiterProfile = {
      id,
      userId,
      companyId: company?.id || 'comp-1',
      designation: data.designation || 'Technical Recruiter',
      phone: data.phone || '',
      company: company || this.companies.get('comp-1'),
    };
    this.recruiterProfiles.set(id, newProfile);
    return newProfile;
  }

  // --- Resumes ---
  getResumesByStudentId(studentId: string): Resume[] {
    const list: Resume[] = [];
    for (const r of this.resumes.values()) {
      if (r.studentId === studentId) {
        list.push(r);
      }
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getResumeById(id: string): Resume | undefined {
    return this.resumes.get(id);
  }

  addResume(resume: Resume): Resume {
    this.resumes.set(resume.id, resume);
    return resume;
  }

  updateResume(id: string, updates: Partial<Resume>): Resume | undefined {
    const existing = this.resumes.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...updates, updatedAt: new Date().toISOString() };
    this.resumes.set(id, updated);
    return updated;
  }

  setPrimaryResume(studentId: string, resumeId: string): boolean {
    for (const r of this.resumes.values()) {
      if (r.studentId === studentId) {
        r.isPrimary = r.id === resumeId;
        this.resumes.set(r.id, r);
      }
    }
    return true;
  }

  deleteResume(id: string): boolean {
    return this.resumes.delete(id);
  }

  // --- Jobs ---
  getAllJobs(): Job[] {
    return Array.from(this.jobs.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  getJobById(id: string): Job | undefined {
    return this.jobs.get(id);
  }

  createJob(jobData: Omit<Job, 'id' | 'createdAt' | 'applicantCount'>): Job {
    const id = `job-${Date.now()}`;
    const newJob: Job = {
      ...jobData,
      id,
      applicantCount: 0,
      createdAt: new Date().toISOString(),
    };
    this.jobs.set(id, newJob);
    return newJob;
  }

  updateJob(id: string, updates: Partial<Job>): Job | undefined {
    const existing = this.jobs.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...updates };
    this.jobs.set(id, updated);
    return updated;
  }

  // --- Applications ---
  getApplicationsByStudentId(studentId: string): Application[] {
    const list: Application[] = [];
    for (const a of this.applications.values()) {
      if (a.studentId === studentId) {
        list.push(a);
      }
    }
    return list.sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime());
  }

  getApplicationsByJobId(jobId: string): Application[] {
    const list: Application[] = [];
    for (const a of this.applications.values()) {
      if (a.jobId === jobId) {
        list.push(a);
      }
    }
    return list;
  }

  getAllApplications(): Application[] {
    return Array.from(this.applications.values());
  }

  getApplicationById(id: string): Application | undefined {
    return this.applications.get(id);
  }

  createApplication(data: {
    studentId: string;
    jobId: string;
    resumeId: string;
    matchScore?: number;
  }): Application {
    const job = this.jobs.get(data.jobId);
    const id = `app-${Date.now()}`;
    const now = new Date().toISOString();

    const newApp: Application = {
      id,
      studentId: data.studentId,
      jobId: data.jobId,
      resumeId: data.resumeId,
      jobTitle: job?.title || 'Applied Position',
      companyName: job?.companyName || 'Target Company',
      companyLogo: job?.companyLogo || '',
      jobLocation: job?.location || 'Remote',
      stage: 'Applied',
      status: 'active',
      matchScore: data.matchScore || 85,
      appliedAt: now,
      timeline: [
        {
          id: `tl-${Date.now()}`,
          stage: 'Applied',
          title: 'Application Submitted',
          description: `Application submitted for ${job?.title || 'position'}.`,
          createdAt: now,
        },
      ],
    };

    this.applications.set(id, newApp);

    // increment job applicant count
    if (job) {
      job.applicantCount += 1;
      this.jobs.set(job.id, job);
    }

    // create notification for student
    this.addNotification({
      userId: data.studentId,
      type: 'application_update',
      title: 'Application Submitted',
      message: `Your application to ${job?.companyName || 'Company'} for "${job?.title}" was successfully submitted.`,
      priority: 'medium',
      link: `/student/applications/${id}`,
    });

    return newApp;
  }

  updateApplicationStage(
    appId: string,
    newStage: Application['stage'],
    note?: string
  ): Application | undefined {
    const app = this.applications.get(appId);
    if (!app) return undefined;

    app.stage = newStage;
    if (newStage === 'Rejected') {
      app.status = 'rejected';
    } else if (newStage === 'Offer') {
      app.status = 'hired';
    }

    app.timeline.push({
      id: `tl-${Date.now()}`,
      stage: newStage,
      title: `Status moved to ${newStage}`,
      description: note || `Candidate application status advanced to ${newStage}.`,
      createdAt: new Date().toISOString(),
    });

    this.applications.set(appId, app);

    // Notify student
    this.addNotification({
      userId: app.studentId,
      type: 'application_update',
      title: `Application Update: ${newStage}`,
      message: `Your application for "${app.jobTitle}" at ${app.companyName} has moved to "${newStage}".`,
      priority: 'high',
      link: `/student/applications/${app.id}`,
    });

    return app;
  }

  // --- Interview Sessions ---
  getInterviewSessionById(id: string): InterviewSession | undefined {
    return this.interviewSessions.get(id);
  }

  getInterviewSessionsByStudentId(studentId: string): InterviewSession[] {
    const list: InterviewSession[] = [];
    for (const s of this.interviewSessions.values()) {
      if (s.studentId === studentId) {
        list.push(s);
      }
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  createInterviewSession(data: {
    studentId: string;
    jobTitle: string;
    type: 'mock' | 'video' | 'technical' | 'behavioral';
    applicationId?: string;
  }): InterviewSession {
    const id = `session-${Date.now()}`;
    const newSession: InterviewSession = {
      id,
      studentId: data.studentId,
      applicationId: data.applicationId,
      jobTitle: data.jobTitle,
      type: data.type,
      status: 'in-progress',
      score: 0,
      summary: {
        overallVerdict: 'Interview session currently in progress.',
        readinessRating: 'Pending completion',
        strengths: [],
        areasForGrowth: [],
        averageClarity: 0,
        averageRelevance: 0,
        averageTechnicalDepth: 0,
      },
      turns: [],
      createdAt: new Date().toISOString(),
    };
    this.interviewSessions.set(id, newSession);
    return newSession;
  }

  addInterviewTurn(sessionId: string, turn: InterviewTurn): InterviewSession | undefined {
    const session = this.interviewSessions.get(sessionId);
    if (!session) return undefined;
    session.turns.push(turn);

    // Recalculate average session score
    const totalScore = session.turns.reduce((acc, t) => acc + t.score, 0);
    session.score = Math.round(totalScore / session.turns.length);

    this.interviewSessions.set(sessionId, session);
    return session;
  }

  completeInterviewSession(sessionId: string): InterviewSession | undefined {
    const session = this.interviewSessions.get(sessionId);
    if (!session) return undefined;
    session.status = 'completed';
    session.completedAt = new Date().toISOString();

    const turns = session.turns;
    if (turns.length > 0) {
      const avgClarity = Math.round(turns.reduce((a, b) => a + b.feedback.clarity, 0) / turns.length);
      const avgRelevance = Math.round(turns.reduce((a, b) => a + b.feedback.relevance, 0) / turns.length);
      const avgDepth = Math.round(turns.reduce((a, b) => a + b.feedback.technicalDepth, 0) / turns.length);
      const allStrengths = turns.flatMap((t) => t.feedback.strengths).slice(0, 3);
      const allGrowth = turns.flatMap((t) => t.feedback.improvementAreas).slice(0, 3);

      session.summary = {
        overallVerdict:
          session.score >= 80
            ? 'Candidate presented articulate, well-structured arguments with solid engineering accuracy.'
            : 'Candidate demonstrated foundational capability; needs further elaboration on architectural metrics.',
        readinessRating: session.score >= 85 ? 'High Readiness (Top Tier)' : 'Moderate Readiness (Requires Practice)',
        strengths: allStrengths,
        areasForGrowth: allGrowth,
        averageClarity: avgClarity,
        averageRelevance: avgRelevance,
        averageTechnicalDepth: avgDepth,
      };
    }

    this.interviewSessions.set(sessionId, session);

    // Notify student
    this.addNotification({
      userId: session.studentId,
      type: 'interview_reminder',
      title: 'Interview Evaluation Ready',
      message: `Your ${session.jobTitle} mock interview report is generated. Final score: ${session.score}/100.`,
      priority: 'high',
      link: `/student/interview-prep`,
    });

    return session;
  }

  // --- Notifications ---
  getNotificationsByUserId(userId: string): Notification[] {
    const list: Notification[] = [];
    for (const n of this.notifications.values()) {
      if (n.userId === userId) {
        list.push(n);
      }
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  addNotification(data: Omit<Notification, 'id' | 'read' | 'createdAt'>): Notification {
    const id = `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const newNotif: Notification = {
      ...data,
      id,
      read: false,
      createdAt: new Date().toISOString(),
    };
    this.notifications.set(id, newNotif);
    return newNotif;
  }

  markNotificationAsRead(id: string): boolean {
    const n = this.notifications.get(id);
    if (!n) return false;
    n.read = true;
    this.notifications.set(id, n);
    return true;
  }

  markAllNotificationsAsRead(userId: string): boolean {
    for (const n of this.notifications.values()) {
      if (n.userId === userId) {
        n.read = true;
        this.notifications.set(n.id, n);
      }
    }
    return true;
  }

  // --- Roadmaps ---
  getRoadmapByStudentId(studentId: string): CareerRoadmapMilestone[] | undefined {
    return this.roadmaps.get(studentId);
  }

  setRoadmapForStudent(studentId: string, milestones: CareerRoadmapMilestone[]): CareerRoadmapMilestone[] {
    this.roadmaps.set(studentId, milestones);
    return milestones;
  }

  toggleRoadmapMilestone(studentId: string, milestoneId: string): CareerRoadmapMilestone[] | undefined {
    const list = this.roadmaps.get(studentId);
    if (!list) return undefined;
    const item = list.find((m) => m.id === milestoneId);
    if (item) {
      item.completed = !item.completed;
      item.completedAt = item.completed ? new Date().toISOString() : undefined;
    }
    this.roadmaps.set(studentId, [...list]);
    return list;
  }

  // --- Audit & AI Logs ---
  logAudit(log: Omit<AuditLog, 'id'>) {
    const entry: AuditLog = {
      ...log,
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };
    this.auditLogs.unshift(entry);
    if (this.auditLogs.length > 500) {
      this.auditLogs.pop();
    }
  }

  logAiUsage(log: Omit<AIUsageLog, 'id' | 'timestamp'>) {
    const entry: AIUsageLog = {
      ...log,
      id: `ai-log-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    this.aiUsageLogs.unshift(entry);
    if (this.aiUsageLogs.length > 500) {
      this.aiUsageLogs.pop();
    }
  }

  getAuditLogs(): AuditLog[] {
    return this.auditLogs.slice(0, 100);
  }

  getAiUsageLogs(): AIUsageLog[] {
    return this.aiUsageLogs.slice(0, 100);
  }

  // --- Admin Stats ---
  getAdminStats() {
    let studentCount = 0;
    let recruiterCount = 0;
    for (const u of this.users.values()) {
      if (u.role === 'student') studentCount++;
      if (u.role === 'recruiter') recruiterCount++;
    }

    const totalAiTokens = this.aiUsageLogs.reduce((acc, l) => acc + l.inputTokens + l.outputTokens, 0);

    return {
      totalUsers: this.users.size,
      studentCount,
      recruiterCount,
      activeJobs: Array.from(this.jobs.values()).filter((j) => j.status === 'published').length,
      totalApplications: this.applications.size,
      completedInterviews: Array.from(this.interviewSessions.values()).filter((s) => s.status === 'completed').length,
      totalAiRequests: this.aiUsageLogs.length,
      totalAiTokens,
      systemHealth: '100% Operational',
      uptime: '99.98%',
      avgAiLatencyMs: 245,
    };
  }
}

export const db = new InMemoryDatabase();
