import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Compass,
  FileCheck2,
  Sparkles,
  Target,
  Users,
  Video,
  ArrowRight,
  Shield,
  Layers,
  CheckCircle,
  Briefcase,
  GraduationCap,
} from 'lucide-react';

export const WelcomePage: React.FC = () => {
  const { switchDemoRole, user } = useAuth();
  const navigate = useNavigate();

  const handleQuickDemo = async (role: 'student' | 'recruiter' | 'admin') => {
    await switchDemoRole(role);
    if (role === 'student') navigate('/student/dashboard');
    else if (role === 'recruiter') navigate('/recruiter/dashboard');
    else navigate('/admin/dashboard');
  };

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-900 via-slate-900 to-slate-950 text-white rounded-3xl p-8 sm:p-12 lg:p-16 border border-indigo-900/50 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-80 h-80 bg-violet-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Empowered by Gemini 3.8 Flash AI
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-white mb-6">
            Intelligent Career Guidance &amp; Modern Recruitment
          </h1>

          <p className="text-base sm:text-lg text-slate-300 mb-8 leading-relaxed">
            CareerPilot AI bridges the divide between aspiring candidates and enterprise hiring teams.
            Harness real-time ATS diagnostic scoring, custom 30-60-90 career roadmaps, interactive AI mock
            video interviews, and intelligent candidate talent pipelines.
          </p>

          {/* Primary Action Choice */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
            <button
              onClick={() => handleQuickDemo('student')}
              className="group flex items-center justify-between p-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold text-sm transition-all shadow-lg shadow-indigo-600/30"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-extrabold text-base">Candidate Portal</p>
                  <p className="text-xs text-indigo-200 font-normal">Explore as Demo Student</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => handleQuickDemo('recruiter')}
              className="group flex items-center justify-between p-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-2xl font-bold text-sm transition-all shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center text-indigo-400">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="font-extrabold text-base">Recruiter Portal</p>
                  <p className="text-xs text-slate-400 font-normal">Explore as Talent Lead</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Direct Auth Links */}
          <div className="mt-8 flex flex-wrap items-center gap-4 text-xs text-slate-400">
            <span>Or authenticate manually:</span>
            <Link to="/auth/student/login" className="text-indigo-400 hover:text-indigo-300 font-semibold underline">
              Student Sign In
            </Link>
            <span>•</span>
            <Link to="/auth/recruiter/login" className="text-indigo-400 hover:text-indigo-300 font-semibold underline">
              Recruiter Sign In
            </Link>
            <span>•</span>
            <button
              onClick={() => handleQuickDemo('admin')}
              className="text-slate-400 hover:text-white font-semibold flex items-center gap-1"
            >
              <Shield className="w-3.5 h-3.5" /> Admin Console
            </button>
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Complete End-to-End Career Acceleration Architecture
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Every screen, algorithm, and server endpoint is actively functional with Gemini 3.8 Flash AI and local fallbacks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">AI Resume Parsing &amp; Extraction</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Upload PDF or DOCX resumes. Extracts work experience, education, validated skills, and project metrics into
              structured JSON schemas.
            </p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">ATS Simulator &amp; Line Inspector</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Simulates modern Applicant Tracking Systems. Calculates keyword match density, section formatting scores, and
              line-by-line inspection with job descriptions.
            </p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-violet-50 border border-violet-100 text-violet-600 flex items-center justify-center mb-4">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">30-60-90 Day Career Roadmaps</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Personalized phased milestones detailing curated study topics, production-grade capstone project blueprints,
              and interactive completion tracking.
            </p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center mb-4">
              <Video className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Interactive AI Mock &amp; Video Interview</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Real-time conversational mock technical and behavioral rounds. Instant evaluation on relevance, clarity, structure,
              and technical depth with camera/microphone recording.
            </p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center mb-4">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Recruiter Talent Pipeline &amp; Dossiers</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Multi-parameter candidate search, AI-assisted job description generator, automated candidate shortlisting, and
              stage progression pipeline.
            </p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center mb-4">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Admin Telemetry &amp; Audit Logs</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Live system health telemetry, AI token consumption logs, latency benchmarks, and immutable platform audit tracking.
            </p>
          </div>
        </div>
      </section>

      {/* Demo Credentials Helper Box */}
      <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Pre-Configured Test &amp; Demo Accounts</h3>
            <p className="text-xs text-slate-600 mt-1">
              Test accounts come pre-loaded with realistic resumes, ATS scores, job postings, and active interview sessions.
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
            Database Seeded &amp; Active
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <p className="text-xs font-bold text-indigo-700 uppercase tracking-wider">Candidate / Student</p>
            <p className="text-sm font-semibold text-slate-900 mt-1">Alex Johnson</p>
            <p className="text-xs text-slate-600 font-mono mt-1">student@careerpilot.ai</p>
            <p className="text-xs text-slate-400 font-mono">Password: student123</p>
            <button
              onClick={() => handleQuickDemo('student')}
              className="mt-3 w-full py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-colors"
            >
              Enter as Student
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <p className="text-xs font-bold text-indigo-700 uppercase tracking-wider">Technical Recruiter</p>
            <p className="text-sm font-semibold text-slate-900 mt-1">Sarah Lin</p>
            <p className="text-xs text-slate-600 font-mono mt-1">recruiter@careerpilot.ai</p>
            <p className="text-xs text-slate-400 font-mono">Password: recruiter123</p>
            <button
              onClick={() => handleQuickDemo('recruiter')}
              className="mt-3 w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition-colors"
            >
              Enter as Recruiter
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <p className="text-xs font-bold text-indigo-700 uppercase tracking-wider">Platform Admin</p>
            <p className="text-sm font-semibold text-slate-900 mt-1">System Administrator</p>
            <p className="text-xs text-slate-600 font-mono mt-1">admin@careerpilot.ai</p>
            <p className="text-xs text-slate-400 font-mono">Password: admin123</p>
            <button
              onClick={() => handleQuickDemo('admin')}
              className="mt-3 w-full py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-semibold transition-colors"
            >
              Enter as Admin
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
