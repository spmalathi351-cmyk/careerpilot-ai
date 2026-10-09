import {
  User,
  StudentProfile,
  RecruiterProfile,
  Company,
  Resume,
  ResumeVersion,
  ResumeComparisonResult,
  Job,
  Application,
  InterviewSession,
  InterviewTurn,
  Notification,
  AuditLog,
  AIUsageLog,
  CareerRoleRecommendation,
  CareerRoadmapMilestone,
  InterviewQuestionBankItem,
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
  questionBank: Map<string, InterviewQuestionBankItem> = new Map();

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

    // 4. Demo Student Profile (Pre-seeded demo user for college expo demonstrations)
    const studentProfile: StudentProfile = {
      id: 'profile-student-1',
      userId: studentUser.id,
      headline: 'Full-Stack Software Engineer & Applied AI Enthusiast',
      bio: 'Computer Science senior with extensive hands-on experience developing high-throughput web applications, REST microservices, and AI integrations. Proven track record improving endpoint latency and leading agile product sprints.',
      avatar: studentUser.avatar!,
      phone: '+1 (555) 234-5678',
      location: 'San Francisco, CA',
      education: [
        {
          id: 'edu-1',
          institution: 'State University of California, Berkeley',
          degree: 'Bachelor of Science',
          field: 'Computer Science',
          startYear: '2023',
          endYear: '2027',
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
        'Git',
        'Tailwind CSS',
        'REST APIs',
        'Gemini API / LLMs',
        'System Design',
      ],
      experience: [
        {
          id: 'exp-1',
          company: 'Nexus Software Labs',
          role: 'Software Engineering Intern',
          location: 'San Francisco, CA',
          startDate: 'May 2025',
          endDate: 'Aug 2025',
          current: false,
          description: 'Engineered high-throughput REST APIs and database query optimization.',
          bulletPoints: [
            'Developed high-throughput REST API endpoints servicing 45,000 daily requests with Express & TypeScript.',
            'Optimized PostgreSQL queries decreasing 95th-percentile response latency by 32%.',
            'Integrated automated CI/CD unit testing matrix across containerized microservices.',
          ],
        },
      ],
      projects: [
        {
          id: 'proj-1',
          title: 'CareerPilot AI Engine',
          description: 'Real-time intelligent career platform with ATS compatibility scoring and sub-200ms evaluation latency.',
          technologies: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Gemini API'],
          impact: 'Cut resume analysis turnaround time from 2 hours to 4 seconds.',
        },
        {
          id: 'proj-2',
          title: 'CloudVision Telemetry System',
          description: 'Anomaly detection dashboard utilizing PyTorch and FastAPI with Dockerized deployment.',
          technologies: ['Python', 'FastAPI', 'Docker', 'PostgreSQL'],
          impact: 'Detected staging regressions 40% faster in automated testing environments.',
        },
      ],
      certifications: ['AWS Certified Cloud Practitioner', 'Google Cloud Certified Professional'],
      targetRoles: ['Full-Stack Software Engineer', 'AI Solutions Engineer', 'Backend Systems Engineer'],
      preferredLocations: ['San Francisco, CA', 'New York, NY', 'Remote'],
      readinessScore: 88,
      atsAverage: 91,
      profileCompleteness: 95,
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

    // 6. Resumes (Demo Student Resume for Expo + Candidate Resumes for Recruiter Search)
    const resume1: Resume = {
      id: 'res-alex-1',
      studentId: studentUser.id,
      filename: 'Alex_Johnson_Software_Engineer_Resume.pdf',
      fileSize: 172000,
      fileReference: '/uploads/Alex_Johnson_Software_Engineer_Resume.pdf',
      isPrimary: true,
      atsScore: 91,
      processingStatus: 'completed',
      extractedData: {
        name: 'Alex Johnson',
        email: 'student@careerpilot.ai',
        phone: '+1 (555) 234-5678',
        headline: 'Full-Stack Software Engineer & Applied AI Enthusiast',
        summary:
          'Computer Science senior with extensive hands-on experience developing high-throughput web applications, REST microservices, and AI integrations. Proven track record improving endpoint latency and leading agile product sprints.',
        skills: studentProfile.skills,
        education: studentProfile.education,
        experience: studentProfile.experience,
        projects: studentProfile.projects,
        certifications: studentProfile.certifications,
        achievements: [
          "Dean's Honor List (Fall 2024, Spring 2025)",
          '1st Place at CalHacks AI Innovation Track 2025',
        ],
        strengths: [
          'High technical keyword density without spamming',
          'Well articulated internship bullet points with verifiable outcomes',
          'Modern tech stack directly aligned with top engineering teams',
        ],
        weaknesses: [
          'Could benefit from more enterprise infrastructure tooling mentions like Kubernetes and Redis',
        ],
        formattingIssues: [
          'Standard ATS-compliant layout detected; 0 critical column rendering warnings',
        ],
        actionVerbSuggestions: [
          'Highlight quantitative system scale in introductory summary',
          'Mention automated unit testing coverage percentages',
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
      updatedAt: '2026-10-01T16:45:00Z',
    };

    const v1: ResumeVersion = {
      id: 'ver-res-1',
      versionNumber: 1,
      label: 'v1 - Initial Raw Ingestion',
      createdAt: '2026-09-15T10:30:00Z',
      createdBy: 'Alex Johnson (PDF Upload)',
      changesSummary: 'Initial document parse from PDF upload. Raw bullets and baseline skills.',
      atsScore: 81,
      scores: {
        overall: 81,
        keywordMatch: 79,
        skillsMatch: 82,
        formattingScore: 88,
        experienceRelevance: 78,
        educationRelevance: 88,
      },
      extractedData: {
        ...resume1.extractedData,
        skills: ['TypeScript', 'React', 'Node.js', 'Python', 'PostgreSQL', 'Git'],
        experience: [
          {
            id: 'exp-1',
            company: 'Nexus Software Labs',
            role: 'Software Engineering Intern',
            location: 'San Francisco, CA',
            startDate: 'Jun 2025',
            endDate: 'Sep 2025',
            current: false,
            description: 'Worked on web features and backend API maintenance.',
            bulletPoints: [
              'Assisted team with writing API endpoints and fixing bug tickets.',
              'Maintained PostgreSQL database tables and updated queries.',
              'Participated in daily standups and bi-weekly sprint planning.',
            ],
          },
        ],
        projects: [
          {
            id: 'proj-1',
            title: 'CareerPilot Real-time Engine',
            description: 'Mock interview prep application with reactive feedback.',
            technologies: ['TypeScript', 'React'],
            impact: 'Enabled practice interviews for students.',
          },
        ],
        formattingIssues: [
          'Table headers caused 2 column alignment ambiguities in legacy ATS parser.',
          'Missing explicit bullet formatting on project summary lines.',
        ],
      },
    };

    const v2: ResumeVersion = {
      id: 'ver-res-2',
      versionNumber: 2,
      label: 'v2 - Action Verbs & DevOps Additions',
      createdAt: '2026-09-24T14:15:00Z',
      createdBy: 'Alex Johnson (Gemini AI Polish)',
      changesSummary: 'Added Docker, REST APIs, Tailwind CSS; Rewrote bullet points with quantifiable latency metrics; Fixed table layout.',
      atsScore: 87,
      scores: {
        overall: 87,
        keywordMatch: 89,
        skillsMatch: 88,
        formattingScore: 92,
        experienceRelevance: 85,
        educationRelevance: 90,
      },
      extractedData: {
        ...resume1.extractedData,
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
        ],
        experience: [
          {
            id: 'exp-1',
            company: 'Nexus Software Labs',
            role: 'Software Engineering Intern',
            location: 'San Francisco, CA',
            startDate: 'Jun 2025',
            endDate: 'Sep 2025',
            current: false,
            description: 'Engineered high-throughput REST APIs and database query optimization.',
            bulletPoints: [
              'Developed high-throughput REST API endpoints servicing 20,000 daily requests with Express.',
              'Optimized PostgreSQL queries decreasing 95th-percentile response latency by 20%.',
              'Contributed to reusable UI component library using React and Tailwind CSS.',
            ],
          },
        ],
        projects: [
          {
            id: 'proj-1',
            title: 'CareerPilot Real-time Engine',
            description: 'Simulated technical screening platform with reactive WebSocket telemetry.',
            technologies: ['TypeScript', 'Express', 'React', 'Tailwind CSS'],
            impact: 'Cut mock interview evaluation latency to under 350ms with instant feedback.',
          },
        ],
        formattingIssues: ['Resolved table layout issues; Single minor font consistency suggestion remaining.'],
      },
    };

    const v3: ResumeVersion = {
      id: 'ver-res-3',
      versionNumber: 3,
      label: 'v3 - Applied AI & Systems Architecture Refinement',
      createdAt: '2026-10-01T16:45:00Z',
      createdBy: 'Alex Johnson (Current Active)',
      changesSummary: 'Added Gemini API & System Design; Scaled request impact to 45k/day; Integrated CloudVision telemetry capstone; Zero ATS formatting warnings.',
      atsScore: 91,
      scores: {
        overall: 91,
        keywordMatch: 93,
        skillsMatch: 92,
        formattingScore: 95,
        experienceRelevance: 89,
        educationRelevance: 90,
      },
      extractedData: resume1.extractedData,
    };

    resume1.currentVersion = 3;
    resume1.versions = [v3, v2, v1];
    this.resumes.set(resume1.id, resume1);

    // Candidate 2 Resume for Recruiter Demonstration
    const resumeMaya: Resume = {
      id: 'res-maya-1',
      studentId: candidate2User.id,
      filename: 'Maya_Patel_ML_Engineer_2026.pdf',
      fileSize: 184500,
      fileReference: '/uploads/Maya_Patel_ML_Engineer_2026.pdf',
      isPrimary: true,
      atsScore: 93,
      processingStatus: 'completed',
      extractedData: {
        name: 'Maya Patel',
        email: 'maya.patel@example.com',
        phone: '+1 (555) 345-6789',
        headline: 'Machine Learning & Applied AI Engineer',
        summary: candidate2Profile.bio,
        skills: candidate2Profile.skills,
        education: candidate2Profile.education,
        experience: candidate2Profile.experience,
        projects: candidate2Profile.projects,
        certifications: candidate2Profile.certifications,
        achievements: [
          'Published paper in NeurIPS Workshop 2024',
          'Graduate Fellowship Recipient',
        ],
        strengths: [
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
        overall: 93,
        keywordMatch: 94,
        skillsMatch: 93,
        formattingScore: 96,
        experienceRelevance: 91,
        educationRelevance: 92,
      },
      recommendations: {
        resumeImprovements: [
          'Add links to open-source model weights or huggingface spaces.',
        ],
        missingSkills: ['Rust', 'Triton Inference Server', 'Ray'],
        suggestedProjects: [
          {
            title: 'Distributed Model Registry',
            description: 'Custom model registry with automated latency profiling and drift detection.',
            techStack: ['Python', 'Docker', 'Kubernetes', 'FastAPI'],
            careerImpact: 'Demonstrates deep MLOps maturity.',
          },
        ],
        strengths: ['High mathematical rigor and machine learning foundation'],
        weaknesses: ['Could emphasize more frontend integration familiarity'],
        careerReadinessSuggestions: ['Ready for ML Engineer and Applied AI Scientist loops.'],
      },
      createdAt: '2026-08-25T11:00:00Z',
      updatedAt: '2026-09-10T14:30:00Z',
    };
    this.resumes.set(resumeMaya.id, resumeMaya);

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

    // 8. Applications (Associated with Demo Student and Recruiter Candidates)
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
          description: 'Submitted resume "Alex_Johnson_Software_Engineer_Resume.pdf" for Full-Stack AI Solutions Engineer.',
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
      studentId: candidate2User.id,
      jobId: job2.id,
      resumeId: resumeMaya.id,
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
      studentId: candidate3User.id,
      jobId: job3.id,
      resumeId: resumeMaya.id,
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

    // 9. Interview Session (Demo Student Interview Session)
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
        message: 'We generated personalized 30-60-90 day learning milestones for Full-Stack Software Engineer.',
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

    // 10b. Seeded 30-60-90 Day Career Roadmap for Demo Student
    const demoRoadmap: CareerRoadmapMilestone[] = [
      {
        id: 'milestone-30d',
        dayBracket: '30-day',
        phaseTitle: 'Phase 1: Foundation Solidification & Core Optimization',
        objective: 'Master distributed rate limiting, Redis caching tiers, and complete end-to-end containerized deployments.',
        skills: ['TypeScript', 'Express', 'Redis', 'Docker', 'PostgreSQL'],
        learningTopics: [
          { title: 'Advanced Redis Cache Invalidation & TTL Semantics', source: 'Redis University & System Design Primer', estimatedHours: 8 },
          { title: 'PostgreSQL Index Optimization & Execution Plans (EXPLAIN ANALYZE)', source: 'PostgreSQL Documentation', estimatedHours: 10 },
          { title: 'Docker Multi-stage Builds for Lean Production Images', source: 'Docker Official Guides', estimatedHours: 6 },
        ],
        projects: [
          {
            title: 'Distributed Sliding-Window Rate Limiter Service',
            description: 'Build an Express middleware backed by Redis cluster for token bucket rate limiting with 10k ops/sec.',
            deliverable: 'Containerized GitHub repository with automated k6 load testing suite.',
          },
        ],
        practiceTasks: [
          'Implement idempotency middleware using UUID v4 tokens',
          'Optimize database queries to achieve <5ms median response time',
          'Write comprehensive Jest unit tests covering edge cases',
        ],
        completed: true,
        completedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      },
      {
        id: 'milestone-60d',
        dayBracket: '60-day',
        phaseTitle: 'Phase 2: Enterprise Systems, Cloud Architecture & Scalability',
        objective: 'Implement event-driven streaming, Kafka or RabbitMQ patterns, and Kubernetes orchestration.',
        skills: ['System Design', 'Kafka', 'Kubernetes', 'REST APIs', 'Monitoring'],
        learningTopics: [
          { title: 'Event-Driven Architectures and Idempotent Consumers', source: 'Designing Data-Intensive Applications', estimatedHours: 14 },
          { title: 'Kubernetes Pod Deployment, Ingress, and Autoscaling (HPA)', source: 'Cloud Native Computing Foundation', estimatedHours: 12 },
          { title: 'Observability & Distributed Tracing with OpenTelemetry', source: 'OpenTelemetry Standards', estimatedHours: 8 },
        ],
        projects: [
          {
            title: 'Asynchronous Job Processing Pipeline',
            description: 'Event-driven job ingestion engine with dead-letter queue recovery and Prometheus metric exporter.',
            deliverable: 'Live deployed microservice with Grafana dashboard telemetry.',
          },
        ],
        practiceTasks: [
          'Design URL Shortener and Notification System on whiteboard',
          'Simulate database failover and handle reconnect backoff',
          'Conduct 3 timed mock system design interviews',
        ],
        completed: false,
      },
      {
        id: 'milestone-90d',
        dayBracket: '90-day',
        phaseTitle: 'Phase 3: Production AI Integration & Elite Interview Readiness',
        objective: 'Integrate production Generative AI pipelines, multimodal embeddings, and execute senior interview loops.',
        skills: ['Gemini API', 'Vector Search', 'System Design', 'Behavioral STAR', 'Algorithms'],
        learningTopics: [
          { title: 'Retrieval Augmented Generation (RAG) Architecture & Hybrid Reranking', source: 'Google Cloud GenAI Guides', estimatedHours: 12 },
          { title: 'Behavioral Leadership & High-Pressure Incident Storytelling', source: 'Cracking the Coding Interview', estimatedHours: 10 },
          { title: 'Advanced Dynamic Programming & Graph Algorithmic Patterns', source: 'LeetCode Hard Study Plan', estimatedHours: 16 },
        ],
        projects: [
          {
            title: 'Enterprise Multi-Tenant Knowledge Copilot',
            description: 'Hybrid search RAG assistant utilizing Gemini API with function calling and strict schema output.',
            deliverable: 'Production web app with full CI/CD pipeline and automated security audit.',
          },
        ],
        practiceTasks: [
          'Conduct 5 full mock interviews on AI Simulator',
          'Prepare 6 detailed STAR behavioral scenario stories',
          'Refine resume with verified latency metrics and open-source links',
        ],
        completed: false,
      },
    ];
    this.roadmaps.set(studentUser.id, demoRoadmap);

    // 10c. Seeded Structured AI Interview Question Bank
    this.seedQuestionBank();

    // 11. Audit Logs
    this.auditLogs = [
      {
        id: 'audit-1',
        userId: candidate2User.id,
        userName: candidate2User.displayName,
        role: 'student',
        action: 'RESUME_UPLOAD',
        ipAddress: '192.168.1.42',
        timestamp: '2026-09-15T10:30:00Z',
        metadata: { filename: 'Maya_Patel_ML_Engineer_2026.pdf', size: 184500 },
      },
      {
        id: 'audit-2',
        userId: candidate2User.id,
        userName: candidate2User.displayName,
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
        metadata: { candidateId: 'profile-student-2', matchScore: 92 },
      },
      {
        id: 'audit-4',
        userId: candidate2User.id,
        userName: candidate2User.displayName,
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
        userId: candidate2User.id,
        feature: 'Resume Parsing & Extraction',
        model: 'gemini-3.8-flash',
        inputTokens: 1420,
        outputTokens: 760,
        status: 'success',
        timestamp: '2026-09-15T10:30:15Z',
      },
      {
        id: 'ai-log-2',
        userId: candidate2User.id,
        feature: 'ATS Semantic Compatibility Scoring',
        model: 'gemini-3.8-flash',
        inputTokens: 980,
        outputTokens: 410,
        status: 'success',
        timestamp: '2026-09-15T10:32:00Z',
      },
      {
        id: 'ai-log-3',
        userId: candidate2User.id,
        feature: 'Career Guidance Roadmap (30-60-90)',
        model: 'gemini-3.8-flash',
        inputTokens: 1120,
        outputTokens: 890,
        status: 'success',
        timestamp: '2026-09-20T09:15:00Z',
      },
      {
        id: 'ai-log-4',
        userId: candidate2User.id,
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

  seedQuestionBank() {
    const questions: InterviewQuestionBankItem[] = [
      // HR Category
      {
        id: 'qb-hr-1',
        category: 'HR',
        skillOrTech: 'Career Storytelling',
        jobRoles: ['Full-Stack Software Engineer', 'Data Analyst', 'Data Scientist', 'ML Engineer', 'AI Engineer', 'GenAI Engineer'],
        difficulty: 'Beginner',
        question: 'Tell me about yourself, your educational background, and what inspired you to pursue software and data engineering.',
        hint: 'Structure your response into 3 phases: Past (education & foundational spark), Present (current technical projects & key skills), and Future (why this role excites you). Keep it under 2 minutes.',
        sampleAnswer:
          'I am a senior computer science student with a passion for building scalable web platforms and intelligent systems. Over the past two years, I completed an internship where I optimized REST API endpoints servicing 45k daily requests and built real-time capstones leveraging TypeScript, Python, and modern cloud technologies. I enjoy solving distributed systems challenges and translating complex user needs into robust engineering solutions. I am excited about this opportunity because your team works at the intersection of high-scale infrastructure and modern developer tooling.',
        explanation: 'Interviewers use this opener to assess verbal communication, conciseness, enthusiasm, and how clearly you synthesize your technical career trajectory.',
        keyEvaluationCriteria: [
          'Concise chronological structure (Past, Present, Future)',
          'Clear articulation of genuine technical passion and achievements',
          'Avoidance of reciting line-by-line resume bullet points',
          'Professional demeanor and energy alignment with the company',
        ],
        isPredefined: true,
      },
      {
        id: 'qb-hr-2',
        category: 'HR',
        skillOrTech: 'Career Objectives',
        jobRoles: ['Full-Stack Software Engineer', 'AI Engineer', 'ML Engineer'],
        difficulty: 'Beginner',
        question: 'Where do you see yourself in 3 to 5 years, and what engineering milestones are you aiming to achieve?',
        hint: 'Demonstrate ambition for technical depth, mentorship, and ownership without overcommitting to rigid managerial titles.',
        sampleAnswer:
          'In the next 3 to 5 years, my goal is to develop deep domain expertise in systems architecture and applied AI engineering. In the first 1-2 years, I want to master your production codebases, deliver high-impact features independently, and contribute to architectural reviews. As I progress, I aim to take ownership of complex cross-functional initiatives, mentor incoming junior engineers, and champion engineering best practices like automated testing and observability.',
        explanation: 'Evaluates long-term commitment, self-awareness, desire for continuous learning, and realistic expectations about professional progression.',
        keyEvaluationCriteria: [
          'Demonstrates technical growth mindset',
          'Realistic alignment with typical engineering career ladders',
          'Emphasis on team impact, mentorship, and system ownership',
        ],
        isPredefined: true,
      },
      {
        id: 'qb-hr-3',
        category: 'HR',
        skillOrTech: 'Collaboration',
        jobRoles: ['Data Analyst', 'Data Scientist', 'Full-Stack Software Engineer', 'AI Engineer'],
        difficulty: 'Intermediate',
        question: 'How do you handle ambiguous requirements when product managers or clients provide high-level goals without technical specifications?',
        hint: 'Highlight proactive discovery, iterative prototyping, requirement documentation, and continuous stakeholder feedback loops.',
        sampleAnswer:
          'When faced with ambiguous goals, I start by identifying the core business outcome: What user problem are we solving, and how will success be measured? I write a brief technical design document outlining proposed API contracts, edge cases, and architectural trade-offs. I then schedule a 15-minute alignment sync with product stakeholders to validate assumptions before writing production code. Building a fast low-fidelity prototype early also uncovers implicit expectations before committing engineering resources.',
        explanation: 'Senior and junior engineering loops evaluate autonomy, proactive communication, and ability to reduce uncertainty.',
        keyEvaluationCriteria: [
          'Proactive stakeholder engagement rather than passive waiting',
          'Written architectural design proposal or RFC approach',
          'Focus on user value and quantifiable acceptance criteria',
        ],
        isPredefined: true,
      },

      // Behavioral Category
      {
        id: 'qb-beh-1',
        category: 'Behavioral',
        skillOrTech: 'Conflict Resolution',
        jobRoles: ['Full-Stack Software Engineer', 'ML Engineer', 'Data Scientist'],
        difficulty: 'Intermediate',
        question: 'Describe a situation where you had a strong technical disagreement with a teammate or lead. How did you handle it and what was the outcome?',
        hint: 'Use the STAR format (Situation, Task, Action, Result). Focus on objective criteria (benchmarks, trade-offs, maintainability) rather than personal ego.',
        sampleAnswer:
          'During our capstone project, a teammate wanted to use a NoSQL document database for an application with complex relational transactions, while I recommended PostgreSQL. Rather than debating opinions, I proposed creating a matrix comparing our access patterns: 80% of our queries required strict ACID consistency and multi-table joins. I built a small benchmark script demonstrating query complexity in both options. After reviewing the benchmark data together, we unanimously agreed on PostgreSQL with JSONB columns for flexible attributes. The decision prevented query latency issues down the road.',
        explanation: 'Evaluators look for emotional intelligence, data-driven reasoning, respect for peers, and constructive conflict resolution.',
        keyEvaluationCriteria: [
          'Structured STAR story format',
          'Reliance on data, benchmarks, and objective architectural criteria',
          'Active listening and respectful collaboration',
          'Positive project outcome and preserved team trust',
        ],
        isPredefined: true,
      },
      {
        id: 'qb-beh-2',
        category: 'Behavioral',
        skillOrTech: 'Incident Management',
        jobRoles: ['Full-Stack Software Engineer', 'ML Engineer', 'AI Engineer'],
        difficulty: 'Advanced',
        question: 'Tell me about a time a production bug, memory leak, or deployment failure occurred on your watch. How did you react under pressure?',
        hint: 'Focus on containment first (mitigating customer impact), then root-cause diagnosis, resolution, and post-mortem prevention.',
        sampleAnswer:
          'During our staging release at Nexus Labs, a database migration triggered connection pool exhaustion, causing 504 timeouts across our internal services. I immediately alerted the team in our engineering channel, joined the triage call, and rolled back the schema migration within 12 minutes to restore availability. Once stable, I analyzed the query telemetry and identified an unindexed foreign key that had caused a full table lock. I added the index, tested migration execution time in a staging replica, and introduced automated slow-query regression tests to our CI pipeline.',
        explanation: 'Tests composure under stress, customer-first mitigation instinct, and blameless post-mortem culture.',
        keyEvaluationCriteria: [
          'Immediate focus on incident containment and rollback',
          'Clear timeline and quantifiable recovery metrics',
          'Thorough root-cause analysis without blaming others',
          'Systemic preventative measures added to prevent recurrence',
        ],
        isPredefined: true,
      },

      // Technical - Python
      {
        id: 'qb-tech-py-1',
        category: 'Technical',
        skillOrTech: 'Python',
        jobRoles: ['Data Scientist', 'ML Engineer', 'AI Engineer', 'Data Analyst', 'Full-Stack Software Engineer'],
        difficulty: 'Intermediate',
        question: 'Explain how Python memory management and the Global Interpreter Lock (GIL) work. How do you bypass the GIL for CPU-bound versus I/O-bound tasks?',
        hint: 'Cover reference counting, generational cyclic garbage collection, bytecode execution constraints in CPython, multiprocessing vs asyncio/threading.',
        sampleAnswer:
          'CPython uses reference counting as its primary memory management mechanism, supplemented by a 3-generation cyclic garbage collector to detect circular references. The GIL is a mutex protecting access to Python objects, preventing multiple native threads from executing Python bytecodes simultaneously. For I/O-bound tasks (like web scraping or database calls), standard threading or asyncio works well because the GIL is released during system calls. For CPU-bound tasks (like image processing or model training), we bypass the GIL using multiprocessing to spawn separate OS processes with dedicated interpreters, or by delegating heavy computation to C/C++/Rust extensions (like NumPy or PyTorch) that release the GIL.',
        explanation: 'Fundamental knowledge for data and backend engineers building high-throughput Python pipelines.',
        keyEvaluationCriteria: [
          'Reference counting + generational GC explanation',
          'Clear description of GIL purpose and limitation',
          'Correct distinction between I/O-bound (async/threading) and CPU-bound (multiprocessing/C extensions)',
        ],
        isPredefined: true,
      },
      {
        id: 'qb-tech-py-2',
        category: 'Technical',
        skillOrTech: 'Python',
        jobRoles: ['Data Analyst', 'Data Scientist', 'ML Engineer'],
        difficulty: 'Beginner',
        question: 'What are Python generators and iterators? How do they differ from regular lists in terms of memory efficiency?',
        hint: 'Explain lazy evaluation (`yield` keyword), generator expressions, `__iter__` and `__next__` protocols, and why they prevent OOM when parsing large datasets.',
        sampleAnswer:
          'Lists allocate all elements in memory up front, with memory footprint growing linearly O(N). Generators implement the iterator protocol (`__iter__` and `__next__`) and evaluate lazily using the `yield` keyword, producing one item on demand. This allows processing multi-gigabyte CSVs or continuous event streams in O(1) auxiliary memory because only the current record is resident in RAM.',
        explanation: 'Essential for data processing pipelines that handle larger-than-memory datasets without crashes.',
        keyEvaluationCriteria: [
          'Eager vs lazy evaluation distinction',
          'Memory complexity contrast: O(N) vs O(1)',
          'Understanding of `yield` keyword and practical use in streaming data',
        ],
        isPredefined: true,
      },

      // Technical - SQL
      {
        id: 'qb-tech-sql-1',
        category: 'Technical',
        skillOrTech: 'SQL',
        jobRoles: ['Data Analyst', 'Data Scientist', 'Full-Stack Software Engineer'],
        difficulty: 'Beginner',
        question: 'Explain the fundamental differences between WHERE and HAVING clauses in SQL. Provide an example of when HAVING is mandatory.',
        hint: 'WHERE filters rows before aggregation; HAVING filters groups after GROUP BY aggregation.',
        sampleAnswer:
          'The `WHERE` clause filters individual rows before any aggregation operations take place, and cannot reference aggregate functions like `COUNT()` or `AVG()`. The `HAVING` clause filters aggregated groups after the `GROUP BY` clause has been executed. For example, to find all departments with more than 5 employees: `SELECT department_id, COUNT(*) FROM employees GROUP BY department_id HAVING COUNT(*) > 5;`. Here, `HAVING` is mandatory because the condition depends on the aggregated count.',
        explanation: 'Tests basic SQL execution pipeline order: FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY.',
        keyEvaluationCriteria: [
          'Execution order understanding (row filtering vs group filtering)',
          'Inability to use aggregates in WHERE',
          'Accurate syntax and practical aggregation example',
        ],
        isPredefined: true,
      },
      {
        id: 'qb-tech-sql-2',
        category: 'Technical',
        skillOrTech: 'SQL',
        jobRoles: ['Data Analyst', 'Data Scientist', 'ML Engineer'],
        difficulty: 'Intermediate',
        question: 'Explain SQL Window Functions. How do ROW_NUMBER(), RANK(), and DENSE_RANK() differ when handling ties?',
        hint: 'Window functions compute calculations across a set of rows related to the current row without collapsing the rows like GROUP BY does.',
        sampleAnswer:
          'Window functions perform calculations across a specified window of rows defined by `OVER (PARTITION BY ... ORDER BY ...)` without collapsing the result set into single rows. When handling ties in order: `ROW_NUMBER()` assigns distinct consecutive integers (e.g. 1, 2, 3) arbitrarily breaking ties; `RANK()` assigns identical ranks to ties and skips subsequent ranks (e.g. 1, 2, 2, 4); `DENSE_RANK()` assigns identical ranks to ties without skipping subsequent ranks (e.g. 1, 2, 2, 3).',
        explanation: 'Commonly tested in data analyst and data science interviews for calculating rolling averages, running totals, and top-N ranks.',
        keyEvaluationCriteria: [
          'Understanding that window functions preserve row cardinality',
          'Exact difference between ROW_NUMBER, RANK, and DENSE_RANK on duplicate values',
          'PARTITION BY and ORDER BY clause usage',
        ],
        isPredefined: true,
      },

      // Technical - Data Structures & Algorithms
      {
        id: 'qb-tech-dsa-1',
        category: 'Technical',
        skillOrTech: 'Data Structures',
        jobRoles: ['Full-Stack Software Engineer', 'ML Engineer', 'AI Engineer'],
        difficulty: 'Intermediate',
        question: 'How does a Hash Map work internally? How does it resolve collisions, and what is its amortized vs worst-case time complexity?',
        hint: 'Discuss hash functions, bucket arrays, separate chaining vs open addressing (linear/quadratic probing), load factors, rehashing, and why worst-case is O(N) or O(log N).',
        sampleAnswer:
          'A Hash Map converts keys into integer array indices using a hash function modulo the bucket array size. Collisions (when multiple keys hash to the same bucket) are typically resolved via Separate Chaining (linked lists or balanced Red-Black trees in Java/Python) or Open Addressing (probing). Lookup, insertion, and deletion operate in O(1) amortized time. If all keys hash to the same bucket or the load factor exceeds capacity without resizing, worst-case time degrades to O(N) (or O(log N) if bucket chains convert to balanced trees). Re-hashing doubles bucket capacity when load factor exceeds a threshold (typically 0.75).',
        explanation: 'Core computer science foundational question appearing in virtually every technical screening.',
        keyEvaluationCriteria: [
          'Hash function + modulo bucket array indexing',
          'Collision resolution mechanisms (Chaining vs Open Addressing)',
          'Amortized O(1) vs worst-case O(N) explanation',
          'Load factor and dynamic resizing concepts',
        ],
        isPredefined: true,
      },
      {
        id: 'qb-tech-dsa-2',
        category: 'Technical',
        skillOrTech: 'Data Structures',
        jobRoles: ['Full-Stack Software Engineer', 'AI Engineer', 'ML Engineer'],
        difficulty: 'Advanced',
        question: 'How do you design and implement a Least Recently Used (LRU) Cache with O(1) time complexity for both get() and put() operations?',
        hint: 'Combine a Hash Map for O(1) key lookups with a Doubly Linked List for O(1) node insertion and deletion.',
        sampleAnswer:
          'An LRU Cache requires two data structures: A Hash Map mapping keys to Doubly Linked List nodes, and a Doubly Linked List maintaining access recency with sentinel head and tail nodes. On `get(key)`, we check the Hash Map in O(1). If present, we detach the node and move it to the head (most recently used) in O(1). On `put(key, value)`, if key exists, we update value and move to head. If new, we insert a node at the head and add to the map. If capacity is exceeded, we evict the tail node (least recently used) and delete its entry from the map in O(1).',
        explanation: 'Classic Tier-1 interview question testing composite data structure design and pointer manipulation.',
        keyEvaluationCriteria: [
          'Hash Map + Doubly Linked List composite pattern',
          'Sentinel head and tail nodes for edge-case safety',
          'Rigorous proof that both get and put remain strictly O(1)',
        ],
        isPredefined: true,
      },

      // Technical - Machine Learning
      {
        id: 'qb-tech-ml-1',
        category: 'Technical',
        skillOrTech: 'Machine Learning',
        jobRoles: ['Data Scientist', 'ML Engineer', 'AI Engineer'],
        difficulty: 'Intermediate',
        question: 'Explain the Bias-Variance tradeoff. What practical techniques do you employ to diagnose and remedy high bias versus high variance?',
        hint: 'High bias = underfitting; high variance = overfitting. Contrast model complexity, regularization, feature engineering, and cross-validation.',
        sampleAnswer:
          'The Bias-Variance tradeoff balances two sources of generalization error: Bias measures error from erroneous model assumptions (underfitting, model too simple to capture patterns), while Variance measures error from sensitivity to training data fluctuations (overfitting, model memorizes noise). To diagnose, we inspect training vs validation loss curves: If both training and validation errors are high, we have high bias; if training error is low but validation error is high, we have high variance. Remedies for high bias include increasing model capacity, adding polynomial/interaction features, and decreasing regularization. Remedies for high variance include collecting more data, L1/L2 weight regularization, dropout, feature selection, and ensemble bagging.',
        explanation: 'Core theoretical foundation for evaluating model diagnostics and tuning methodology.',
        keyEvaluationCriteria: [
          'Clear definition of bias (underfitting) and variance (overfitting)',
          'Loss curve diagnostic interpretation',
          'Specific, appropriate remediations tailored to each error type',
        ],
        isPredefined: true,
      },
      {
        id: 'qb-tech-ml-2',
        category: 'Technical',
        skillOrTech: 'Machine Learning',
        jobRoles: ['Data Scientist', 'ML Engineer', 'Data Analyst'],
        difficulty: 'Intermediate',
        question: 'When evaluating a binary classifier on an imbalanced dataset (e.g., 99% negative, 1% positive), why is Accuracy misleading? What metrics should you use instead?',
        hint: 'Discuss Precision, Recall, F1-Score, PR-AUC, ROC-AUC, and cost-matrix considerations (e.g. fraud or disease detection).',
        sampleAnswer:
          'Accuracy is misleading because a naive classifier predicting the majority class 100% of the time achieves 99% accuracy while catching zero positive cases. For imbalanced classification, we evaluate Precision (TP / (TP + FP)), Recall (TP / (TP + FN)), and F1-Score (harmonic mean of precision and recall). For ranking models, Precision-Recall AUC (PR-AUC) is preferred over ROC-AUC when the positive class is rare because ROC-AUC can remain artificially inflated by true negatives. We also tune probability thresholds according to business costs: in fraud or cancer detection, false negatives are vastly more costly than false positives, so we optimize for high Recall.',
        explanation: 'Standard applied ML scenario reflecting real-world tabular and business data challenges.',
        keyEvaluationCriteria: [
          'Flaw of raw accuracy on class imbalance explained',
          'Definitions and trade-offs of Precision vs Recall',
          'PR-AUC preference over ROC-AUC in extreme skew',
          'Decision threshold calibration aligned with business costs',
        ],
        isPredefined: true,
      },

      // Technical - Deep Learning & NLP
      {
        id: 'qb-tech-dl-1',
        category: 'Technical',
        skillOrTech: 'Deep Learning',
        jobRoles: ['ML Engineer', 'AI Engineer', 'Data Scientist'],
        difficulty: 'Advanced',
        question: 'Explain the vanishing and exploding gradient problem in deep neural networks. How do residual connections and normalization layers solve it?',
        hint: 'Chain rule multiplication of gradients across deep layers, saturating activations (sigmoid/tanh), He/Xavier weight initialization, ResNet identity shortcuts, LayerNorm.',
        sampleAnswer:
          'During backpropagation, gradients are multiplied backwards through layers via the chain rule. If weight matrices or activation derivatives are less than 1 (like sigmoid/tanh with max derivative 0.25), gradients decay exponentially to zero in early layers (vanishing gradients), halting weight updates. If greater than 1, gradients explode causing NaN overflow. Residual connections (y = F(x) + x) provide direct identity skip connections where gradients can flow directly backwards without attenuation (d(y)/dx = dF/dx + 1), enabling 100+ layer architectures. Modern architectures also use non-saturating activations (ReLU, GELU, SwiGLU), careful weight initialization (He/Xavier), and LayerNorm/RMSNorm to stabilize activation distributions.',
        explanation: 'Deep learning interview cornerstone explaining why modern deep architectures train stably.',
        keyEvaluationCriteria: [
          'Mathematical intuition of gradient decay/explosion via chain rule',
          'Residual skip connection identity gradient flow (dF/dx + 1)',
          'Normalization layers (LayerNorm/RMSNorm) and modern activations (GELU/SwiGLU)',
        ],
        isPredefined: true,
      },
      {
        id: 'qb-tech-nlp-1',
        category: 'Technical',
        skillOrTech: 'NLP',
        jobRoles: ['AI Engineer', 'ML Engineer', 'GenAI Engineer'],
        difficulty: 'Advanced',
        question: 'How does the Multi-Head Self-Attention mechanism in the Transformer work mathematically? Why did it replace Recurrent Neural Networks (RNNs)?',
        hint: 'Q, K, V projections, scaled dot-product attention formula Attention(Q,K,V) = softmax(QK^T / sqrt(d_k)) * V, multi-head parallel subspaces, and O(1) sequential path length enabling full GPU parallelization.',
        sampleAnswer:
          'For each token embedding, linear projections compute Query (Q), Key (K), and Value (V) vectors. Scaled dot-product attention computes compatibility between queries and keys: Attention(Q,K,V) = softmax(Q * K^T / sqrt(d_k)) * V. The scaling factor sqrt(d_k) prevents dot products from growing excessively large, which would push softmax into regions with vanishing gradients. Multi-head attention splits projections into h separate subspaces, allowing tokens to attend to information from different representation positions simultaneously. Transformers replaced RNNs because RNNs enforce sequential processing O(N) hidden state recurrence, preventing GPU parallelization during training and suffering from catastrophic forgetting over long context windows. Transformers compute self-attention across all tokens in parallel.',
        explanation: 'Core theoretical foundation for modern LLMs, foundation models, and NLP architectures.',
        keyEvaluationCriteria: [
          'Accurate formula and explanation of Q, K, V roles',
          'Purpose of the sqrt(d_k) scaling factor',
          'Multi-head parallel subspace intuition',
          'Parallel training advantage over sequential recurrence in RNNs',
        ],
        isPredefined: true,
      },

      // Technical - Generative AI
      {
        id: 'qb-tech-genai-1',
        category: 'Technical',
        skillOrTech: 'Generative AI',
        jobRoles: ['GenAI Engineer', 'AI Engineer', 'Full-Stack Software Engineer'],
        difficulty: 'Advanced',
        question: 'Describe the complete architecture of a production-grade Retrieval-Augmented Generation (RAG) system. How do you prevent hallucinations and optimize retrieval accuracy?',
        hint: 'Ingestion pipeline (chunking, metadata, embeddings, vector DB), hybrid search (dense semantic + sparse BM25), reranking, context compression, strict schema output, prompt guardrails.',
        sampleAnswer:
          'A production RAG system comprises two pipelines: Ingestion and Inference. In Ingestion, documents are parsed, semantically chunked (e.g. 512 tokens with 10% overlap), enriched with document metadata, and encoded into dense vector embeddings stored in a vector index with HNSW indexing. In Inference: 1) Query expansion reformulates ambiguous user questions. 2) Hybrid search combines dense vector retrieval with sparse lexical BM25 search via Reciprocal Rank Fusion (RRF). 3) A cross-encoder reranker scores the top 20 candidates down to the top 5 most relevant chunks. 4) The LLM prompt enforces strict system instructions ("Answer ONLY using provided context; cite sources; return I do not know if absent"). 5) Grounding evaluation frameworks (like RAGAS) evaluate faithfulness and context recall.',
        explanation: 'Top-tier question for modern GenAI roles testing practical production deployment experience.',
        keyEvaluationCriteria: [
          'Two-tier pipeline: Ingestion vs Inference flow',
          'Hybrid search (Dense + Sparse/BM25) and Cross-Encoder Reranking',
          'Semantic chunking with contextual metadata',
          'Faithfulness verification and prompt guardrail techniques',
        ],
        isPredefined: true,
      },
      {
        id: 'qb-tech-genai-2',
        category: 'Technical',
        skillOrTech: 'Generative AI',
        jobRoles: ['GenAI Engineer', 'AI Engineer', 'Full-Stack Software Engineer'],
        difficulty: 'Advanced',
        question: 'How do you enforce structured JSON outputs from LLMs in production, and how do you protect against prompt injection and jailbreak attacks?',
        hint: 'Constrained decoding (JSON Schema grammars), Function calling, input sanitization, separate privilege tiers, output validation with Pydantic/Zod.',
        sampleAnswer:
          'To guarantee valid JSON outputs, we use constrained decoding provided by modern APIs (like Gemini structured outputs with responseSchema or function calling), which restricts token sampling probabilities strictly to tokens that conform to the target JSON schema grammar. We validate runtime responses with schema validators like Zod or Pydantic with automated retry logic. For prompt injection defense: We enforce strict separation between system instructions and untrusted user input using delimiters; we employ input sanitization guardrails to detect adversarial keywords; we apply least privilege principles ensuring the LLM cannot execute destructive actions without explicit user confirmation; and we evaluate outputs with secondary guardrail models.',
        explanation: 'Critical security and reliability engineering question for real-world enterprise LLM deployments.',
        keyEvaluationCriteria: [
          'Grammar-constrained token decoding vs naive prompt instruction',
          'Runtime schema validation with Zod/Pydantic and auto-retry',
          'Delimited input/instruction separation against indirect injection',
          'Least-privilege tool execution and human-in-the-loop safeguards',
        ],
        isPredefined: true,
      },

      // Technical - TypeScript & Full-Stack
      {
        id: 'qb-tech-ts-1',
        category: 'Technical',
        skillOrTech: 'TypeScript',
        jobRoles: ['Full-Stack Software Engineer', 'AI Engineer'],
        difficulty: 'Intermediate',
        question: 'Explain TypeScript Discriminated Unions and Type Narrowing. How do they eliminate runtime bugs when handling asynchronous API response states?',
        hint: 'Shared literal property (discriminant), switch/if guards, exhaustive checking with `never` type.',
        sampleAnswer:
          'A Discriminated Union is a union type where each member shares a common literal property (the discriminant). For example, `type ApiResponse = { status: "loading" } | { status: "success"; data: User } | { status: "error"; error: string }`. In TypeScript, when you write `if (res.status === "success")`, the compiler automatically narrows the type inside that block, guaranteeing that `res.data` exists and eliminating runtime `undefined` property crashes. Furthermore, we can use an exhaustive check in the `default` case of a switch statement with a function accepting the `never` type, ensuring compilation fails if a new status state is added without being handled.',
        explanation: 'Differentiates proficient TypeScript developers from JavaScript developers using `any`.',
        keyEvaluationCriteria: [
          'Clear explanation of the common discriminant property',
          'Type narrowing mechanics within conditional blocks',
          'Exhaustive pattern matching using the `never` type',
          'Elimination of common runtime null-pointer crashes',
        ],
        isPredefined: true,
      },

      // Project-Based Category
      {
        id: 'qb-proj-1',
        category: 'Project-Based',
        skillOrTech: 'System Design',
        jobRoles: ['Full-Stack Software Engineer', 'ML Engineer', 'AI Engineer'],
        difficulty: 'Intermediate',
        question: 'Walk me through the architectural trade-offs of your most complex software project. What technical decisions would you revisit with what you know today?',
        hint: 'Structure: High-level architecture, key trade-off (e.g. latency vs consistency, build vs buy, SQL vs NoSQL), lessons learned, and specific improvements.',
        sampleAnswer:
          'In our AI Career platform, our key architectural challenge was minimizing resume parsing and ATS calculation latency while maintaining high scoring accuracy. We chose an asynchronous streaming pipeline with Redis caching. The trade-off was operational complexity: managing worker queues, handling cache invalidation when users edited resume sections, and graceful fallback when third-party model quotas were reached. If building it today, I would implement WebSockets for proactive job progress events rather than polling, and utilize a vector database for semantic skill cluster matching instead of keyword regexes.',
        explanation: 'Evaluates architectural maturity, honest self-critique, and ability to articulate trade-offs without defensive posturing.',
        keyEvaluationCriteria: [
          'Honest reflection on trade-offs (no system is perfect)',
          'Clear explanation of latency, consistency, or scalability constraints',
          'Concrete architectural improvements based on lessons learned',
        ],
        isPredefined: true,
      },
      {
        id: 'qb-proj-2',
        category: 'Project-Based',
        skillOrTech: 'Testing & DevOps',
        jobRoles: ['Full-Stack Software Engineer', 'AI Engineer', 'ML Engineer'],
        difficulty: 'Intermediate',
        question: 'How do you ensure test coverage and build pipeline hygiene in projects with external AI APIs or third-party dependencies?',
        hint: 'Unit testing with mocks/stubs, integration testing with recorded fixtures/cassettes, automated CI matrices, contract testing.',
        sampleAnswer:
          'For fast, deterministic CI pipelines, unit tests mock external AI API clients using predefined JSON fixtures, ensuring test runs complete in seconds with zero network dependency or API token cost. For integration tests, we use contract testing and recorded response cassettes that run nightly against staging sandbox endpoints. We enforce strict linting, type-checking, and unit test pass thresholds in GitHub Actions before pull requests can merge.',
        explanation: 'Demonstrates professional software engineering standards and automated testing maturity.',
        keyEvaluationCriteria: [
          'Mocking third-party APIs for deterministic unit tests',
          'Contract/integration testing on staging environments',
          'Automated CI/CD validation gates',
        ],
        isPredefined: true,
      },

      // Scenario-Based Category
      {
        id: 'qb-scen-1',
        category: 'Scenario-Based',
        skillOrTech: 'System Design',
        jobRoles: ['Full-Stack Software Engineer', 'AI Engineer', 'ML Engineer'],
        difficulty: 'Advanced',
        question: 'Your production database is experiencing 98% CPU utilization and query timeouts during flash traffic. Walk me step-by-step through your mitigation strategy.',
        hint: 'Step 1: Immediate triage & load shedding. Step 2: Query diagnostics (slow query log, EXPLAIN ANALYZE, missing indexes). Step 3: Caching & read replicas. Step 4: Long-term sharding/partitioning.',
        sampleAnswer:
          '1. Immediate triage: Enable aggressive HTTP rate limiting and cache headers at the CDN/load balancer tier. If connection pool is exhausted, temporarily increase pool limits or route read traffic to read replicas. 2. Diagnostics: Inspect `pg_stat_activity` to find long-running or blocking queries. Terminate rogue deadlocks. Run `EXPLAIN ANALYZE` on the top offending queries to identify table scans caused by missing indexes. 3. Short-term fix: Add missing composite indexes concurrently (`CREATE INDEX CONCURRENTLY`) to avoid table locks. Place Redis caching in front of top repeated read queries. 4. Long-term remedy: Implement connection pooling (PgBouncer), read-replica load balancing, and table partitioning for high-growth transaction tables.',
        explanation: 'High-level architectural problem-solving test for backend and full-stack engineering candidates.',
        keyEvaluationCriteria: [
          'Stepwise triage from immediate stabilization to root-cause fix',
          'Knowledge of database diagnostic tools (`EXPLAIN ANALYZE`, slow logs)',
          'Non-blocking index creation (`CONCURRENTLY`) and connection pooling awareness',
          'Architectural scaling techniques (Caching, Read Replicas, Partitioning)',
        ],
        isPredefined: true,
      },
      {
        id: 'qb-scen-2',
        category: 'Scenario-Based',
        skillOrTech: 'Reliability Engineering',
        jobRoles: ['Full-Stack Software Engineer', 'AI Engineer'],
        difficulty: 'Advanced',
        question: 'An external downstream microservice starts intermittently timing out with 504 errors. How do you design your service to fail gracefully without crashing user workflows?',
        hint: 'Circuit Breaker pattern, exponential backoff with jitter, asynchronous retries, fallback responses, bulkhead isolation.',
        sampleAnswer:
          'I implement the Circuit Breaker pattern (e.g. using cockatiel or resilience4j). If error rates exceed 50% in a 10-second window, the circuit opens, failing fast immediately without holding server connections open and exhausting thread pools. For transient retries, we use exponential backoff with full jitter to avoid the thundering herd problem. We implement bulkhead isolation to ensure failures in that external service cannot starve threads needed by unrelated endpoints. Finally, we provide meaningful fallback behavior: returning cached stale data, an informative degraded user experience, or queuing the request for background processing.',
        explanation: 'Critical distributed systems concept to prevent cascading failures across microservices.',
        keyEvaluationCriteria: [
          'Circuit Breaker pattern mechanics (Closed, Open, Half-Open)',
          'Exponential backoff with jitter against thundering herds',
          'Bulkhead resource isolation',
          'Graceful fallback and user experience degradation',
        ],
        isPredefined: true,
      },
    ];

    for (const q of questions) {
      this.questionBank.set(q.id, q);
    }
  }

  // --- Question Bank Methods ---
  getQuestionBank(filters?: {
    role?: string;
    skillOrTech?: string;
    category?: string;
    difficulty?: string;
    search?: string;
  }): InterviewQuestionBankItem[] {
    let list = Array.from(this.questionBank.values());

    if (filters?.category && filters.category !== 'All') {
      list = list.filter((q) => q.category.toLowerCase() === filters.category!.toLowerCase());
    }

    if (filters?.difficulty && filters.difficulty !== 'All') {
      list = list.filter((q) => q.difficulty.toLowerCase() === filters.difficulty!.toLowerCase());
    }

    if (filters?.skillOrTech && filters.skillOrTech !== 'All') {
      const targetSkill = filters.skillOrTech.toLowerCase();
      list = list.filter((q) => q.skillOrTech.toLowerCase().includes(targetSkill));
    }

    if (filters?.role && filters.role !== 'All') {
      const targetRole = filters.role.toLowerCase();
      list = list.filter((q) => q.jobRoles.some((r) => r.toLowerCase().includes(targetRole)));
    }

    if (filters?.search && filters.search.trim().length > 0) {
      const term = filters.search.toLowerCase().trim();
      list = list.filter(
        (q) =>
          q.question.toLowerCase().includes(term) ||
          q.skillOrTech.toLowerCase().includes(term) ||
          q.sampleAnswer.toLowerCase().includes(term) ||
          q.explanation.toLowerCase().includes(term)
      );
    }

    return list;
  }

  getQuestionById(id: string): InterviewQuestionBankItem | undefined {
    return this.questionBank.get(id);
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
      headline: data.headline || '',
      bio: data.bio || '',
      avatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      phone: data.phone || '',
      location: data.location || '',
      education: data.education || [],
      skills: data.skills || [],
      experience: data.experience || [],
      projects: data.projects || [],
      certifications: data.certifications || [],
      targetRoles: data.targetRoles || [],
      preferredLocations: data.preferredLocations || [],
      readinessScore: data.readinessScore || 0,
      atsAverage: data.atsAverage || 0,
      profileCompleteness: data.profileCompleteness || 0,
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

  // --- Resume Version History & Comparison ---
  getResumeVersions(resumeId: string): ResumeVersion[] {
    const resume = this.resumes.get(resumeId);
    if (!resume) return [];
    if (!resume.versions || resume.versions.length === 0) {
      const initialVer: ResumeVersion = {
        id: `ver-${resumeId}-1`,
        versionNumber: 1,
        label: 'v1 - Initial Extraction',
        createdAt: resume.createdAt,
        createdBy: resume.extractedData?.name || 'Candidate',
        changesSummary: 'Initial document parsed baseline.',
        atsScore: resume.atsScore,
        scores: resume.scores,
        extractedData: resume.extractedData,
      };
      resume.versions = [initialVer];
      resume.currentVersion = 1;
      this.resumes.set(resumeId, resume);
    }
    return resume.versions;
  }

  addResumeVersion(
    resumeId: string,
    label: string,
    changesSummary: string,
    author?: string
  ): ResumeVersion | undefined {
    const resume = this.resumes.get(resumeId);
    if (!resume) return undefined;
    const versions = this.getResumeVersions(resumeId);
    const nextVerNum = (resume.currentVersion || versions.length) + 1;
    const newVer: ResumeVersion = {
      id: `ver-${resumeId}-${Date.now()}`,
      versionNumber: nextVerNum,
      label: label || `v${nextVerNum} - Checkpoint`,
      createdAt: new Date().toISOString(),
      createdBy: author || resume.extractedData?.name || 'Student',
      changesSummary: changesSummary || 'Incremental edits and ATS optimization.',
      atsScore: resume.atsScore,
      scores: resume.scores,
      extractedData: JSON.parse(JSON.stringify(resume.extractedData)),
    };
    resume.versions = [newVer, ...versions];
    resume.currentVersion = nextVerNum;
    resume.updatedAt = new Date().toISOString();
    this.resumes.set(resumeId, resume);
    return newVer;
  }

  revertResumeVersion(resumeId: string, versionId: string): Resume | undefined {
    const resume = this.resumes.get(resumeId);
    if (!resume) return undefined;
    const versions = this.getResumeVersions(resumeId);
    const targetVer = versions.find((v) => v.id === versionId);
    if (!targetVer) return undefined;

    resume.extractedData = JSON.parse(JSON.stringify(targetVer.extractedData));
    resume.atsScore = targetVer.atsScore;
    resume.scores = JSON.parse(JSON.stringify(targetVer.scores));
    resume.currentVersion = targetVer.versionNumber;
    resume.updatedAt = new Date().toISOString();
    this.resumes.set(resumeId, resume);
    return resume;
  }

  compareResumeVersions(
    resumeId: string,
    v1Id: string,
    v2Id: string
  ): ResumeComparisonResult | undefined {
    const resume = this.resumes.get(resumeId);
    if (!resume) return undefined;
    const versions = this.getResumeVersions(resumeId);
    const versionA = versions.find((v) => v.id === v1Id);
    const versionB = versions.find((v) => v.id === v2Id);
    if (!versionA || !versionB) return undefined;

    const scoreDelta = {
      overall: versionB.scores.overall - versionA.scores.overall,
      keywordMatch: versionB.scores.keywordMatch - versionA.scores.keywordMatch,
      skillsMatch: versionB.scores.skillsMatch - versionA.scores.skillsMatch,
      formattingScore: versionB.scores.formattingScore - versionA.scores.formattingScore,
      experienceRelevance: versionB.scores.experienceRelevance - versionA.scores.experienceRelevance,
      educationRelevance: versionB.scores.educationRelevance - versionA.scores.educationRelevance,
    };

    const skillsA = versionA.extractedData.skills || [];
    const skillsB = versionB.extractedData.skills || [];
    const addedSkills = skillsB.filter(
      (b) => !skillsA.some((a) => a.toLowerCase().trim() === b.toLowerCase().trim())
    );
    const removedSkills = skillsA.filter(
      (a) => !skillsB.some((b) => b.toLowerCase().trim() === a.toLowerCase().trim())
    );
    const retainedSkills = skillsB.filter((b) =>
      skillsA.some((a) => a.toLowerCase().trim() === b.toLowerCase().trim())
    );

    const expA = versionA.extractedData.experience || [];
    const expB = versionB.extractedData.experience || [];
    let bulletsModifiedCount = 0;

    const roleComparisons = expB.map((roleB) => {
      const matchedRoleA = expA.find(
        (r) =>
          r.company.toLowerCase() === roleB.company.toLowerCase() ||
          r.role.toLowerCase() === roleB.role.toLowerCase()
      );
      const bulletsA = matchedRoleA?.bulletPoints || [];
      const bulletsB = roleB.bulletPoints || [];

      const addedBullets = bulletsB.filter((b) => !bulletsA.includes(b));
      const removedBullets = bulletsA.filter((a) => !bulletsB.includes(a));
      bulletsModifiedCount += addedBullets.length + removedBullets.length;

      return {
        roleTitle: roleB.role,
        company: roleB.company,
        bulletsA,
        bulletsB,
        addedBullets,
        removedBullets,
      };
    });

    const projA = (versionA.extractedData.projects || []).map((p) => p.title);
    const projB = (versionB.extractedData.projects || []).map((p) => p.title);
    const addedProjects = projB.filter((p) => !projA.includes(p));
    const removedProjects = projA.filter((p) => !projB.includes(p));
    const retainedProjects = projB.filter((p) => projA.includes(p));

    const techA = (versionA.extractedData.projects || []).flatMap((p) => p.technologies || []);
    const techB = (versionB.extractedData.projects || []).flatMap((p) => p.technologies || []);
    const techStackAdditions = Array.from(new Set(techB.filter((t) => !techA.includes(t))));

    const fmtA = versionA.extractedData.formattingIssues || [];
    const fmtB = versionB.extractedData.formattingIssues || [];
    const resolvedIssues = fmtA.filter((issue) => !fmtB.includes(issue));
    const newIssues = fmtB.filter((issue) => !fmtA.includes(issue));
    const commonIssues = fmtB.filter((issue) => fmtA.includes(issue));

    return {
      versionA,
      versionB,
      scoreDelta,
      skillsDiff: {
        added: addedSkills,
        removed: removedSkills,
        retained: retainedSkills,
      },
      experienceDiff: {
        totalRolesA: expA.length,
        totalRolesB: expB.length,
        bulletsModifiedCount,
        roleComparisons,
      },
      projectsDiff: {
        addedProjects,
        removedProjects,
        retainedProjects,
        techStackAdditions,
      },
      formattingDiff: {
        resolvedIssues,
        newIssues,
        commonIssues,
      },
    };
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

  deleteJob(id: string): boolean {
    return this.jobs.delete(id);
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

  getNotificationById(id: string): Notification | undefined {
    return this.notifications.get(id);
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
