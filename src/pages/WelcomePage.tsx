import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileCheck2,
  Sparkles,
  Target,
  Users,
  Video,
  ArrowRight,
  Shield,
  Layers,
  Briefcase,
  GraduationCap,
} from 'lucide-react';

export const WelcomePage: React.FC = () => {
  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-900 via-slate-900 to-slate-950 text-white rounded-3xl p-8 sm:p-12 lg:p-16 border border-indigo-900/50 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-80 h-80 bg-violet-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-semibold mb-6">
              <img src="/careerpilot-mark.png" alt="CareerPilot" className="w-4 h-4 rounded-full object-contain" />
              <span>Official CareerPilot AI Intelligence Platform</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-white mb-6">
              Intelligent Career Guidance &amp; Modern Recruitment
            </h1>

            <p className="text-base sm:text-lg text-slate-300 mb-10 leading-relaxed">
              CareerPilot AI bridges the divide between aspiring candidates and enterprise hiring teams.
              Harness real-time ATS diagnostic scoring, custom 30-60-90 career roadmaps, interactive AI mock
              interviews, and structured candidate discovery pipelines.
            </p>

            {/* Clean Role Choice Cards */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-indigo-300 mb-4">
                Select Your Role to Continue
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
                <Link
                  to="/auth/student/login"
                  className="group flex items-center justify-between p-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold text-sm transition-all shadow-lg shadow-indigo-600/30"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="font-extrabold text-base leading-tight">Student / Candidate</p>
                      <p className="text-xs text-indigo-200 font-normal mt-0.5">Sign in to Student Portal</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                </Link>

                <Link
                  to="/auth/recruiter/login"
                  className="group flex items-center justify-between p-5 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-white rounded-2xl font-bold text-sm transition-all shadow-md"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-slate-700 flex items-center justify-center text-indigo-400 flex-shrink-0">
                      <Briefcase className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                      <p className="font-extrabold text-base leading-tight">Recruiter</p>
                      <p className="text-xs text-slate-400 font-normal mt-0.5">Sign in to Recruiter Portal</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                </Link>
              </div>
            </div>
          </div>

          {/* Official Brand Showcase Card */}
          <div className="hidden lg:flex flex-col items-center justify-center p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl shadow-xl flex-shrink-0 select-none">
            <div className="w-40 h-40 rounded-2xl bg-white p-3 shadow-lg flex items-center justify-center ring-4 ring-indigo-500/20">
              <img
                src="/careerpilot-logo-full.png"
                alt="CareerPilot AI Official Brand"
                className="w-full h-full object-contain rounded-xl"
              />
            </div>
            <p className="mt-3.5 text-sm font-extrabold text-white tracking-wide">CareerPilot AI</p>
            <p className="text-[10px] text-indigo-300 font-semibold tracking-widest uppercase mt-0.5">
              Guide · Match · Grow
            </p>
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
            Every screen, algorithm, and server endpoint is actively functional with deep AI integration and persistent data models.
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
              structured schemas with version history tracking.
            </p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">ATS Simulator &amp; Line Inspector</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Simulates modern Applicant Tracking Systems. Calculates keyword match density, section formatting scores, and
              line-by-line inspection with target job requirements.
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
            <h3 className="text-base font-bold text-slate-900 mb-2">Secure Role-Based Architecture</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Complete data isolation between candidate and recruiter domains with server-side ownership verification and audit logging.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
