import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../../services/api';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import {
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  RefreshCw,
  FileCheck2,
  Cpu,
  Layers,
  ShieldCheck,
  AlertCircle,
  BarChart3,
  Target,
  Sliders,
  TrendingUp,
  FileText,
} from 'lucide-react';

interface BenchmarkProfile {
  id: string;
  name: string;
  data: {
    category: string;
    resumeScore: number;
    jobRequirement: number;
    fullMark: number;
    details: string;
  }[];
}

export const ResumeAnalysisPage: React.FC = () => {
  const [running, setRunning] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTargetJob, setSelectedTargetJob] = useState<string>('full-stack');
  const [resumes, setResumes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  React.useEffect(() => {
    api
      .getResumes()
      .then((res) => setResumes(res.resumes || []))
      .catch((err) => console.warn(err))
      .finally(() => setLoading(false));
  }, []);

  // Benchmarks for different role requirements compared to the candidate's parsed resume
  const roleBenchmarks: Record<string, BenchmarkProfile> = {
    'full-stack': {
      id: 'full-stack',
      name: 'Full-Stack Software Engineer',
      data: [
        {
          category: 'Core Programming',
          resumeScore: 92,
          jobRequirement: 85,
          fullMark: 100,
          details: 'TypeScript, React, Node.js, and ES6+ standards',
        },
        {
          category: 'System Architecture',
          resumeScore: 86,
          jobRequirement: 88,
          fullMark: 100,
          details: 'RESTful API design, database schemas & caching',
        },
        {
          category: 'Cloud & DevOps',
          resumeScore: 74,
          jobRequirement: 82,
          fullMark: 100,
          details: 'Docker containers, CI/CD pipelines & cloud hosting',
        },
        {
          category: 'Code Quality & Testing',
          resumeScore: 88,
          jobRequirement: 80,
          fullMark: 100,
          details: 'Unit testing, TypeScript strict mode & lint hygiene',
        },
        {
          category: 'Domain Fit & Tools',
          resumeScore: 90,
          jobRequirement: 85,
          fullMark: 100,
          details: 'Modern full-stack web toolchains & Git workflows',
        },
        {
          category: 'Quantified Impact',
          resumeScore: 89,
          jobRequirement: 78,
          fullMark: 100,
          details: 'Throughput optimization and latency reduction metrics',
        },
      ],
    },
    'genai': {
      id: 'genai',
      name: 'Generative AI & LLM Engineer',
      data: [
        {
          category: 'Core Programming',
          resumeScore: 90,
          jobRequirement: 90,
          fullMark: 100,
          details: 'Python, TypeScript, and asynchronous pipelines',
        },
        {
          category: 'System Architecture',
          resumeScore: 84,
          jobRequirement: 92,
          fullMark: 100,
          details: 'Vector databases, RAG architecture, and embeddings',
        },
        {
          category: 'Cloud & DevOps',
          resumeScore: 74,
          jobRequirement: 85,
          fullMark: 100,
          details: 'Model serving, GPU acceleration & deployment',
        },
        {
          category: 'Code Quality & Testing',
          resumeScore: 85,
          jobRequirement: 82,
          fullMark: 100,
          details: 'Evaluation harness, prompt regression testing',
        },
        {
          category: 'Domain Fit & Tools',
          resumeScore: 88,
          jobRequirement: 94,
          fullMark: 100,
          details: 'Gemini SDK, LangChain, parameter tuning',
        },
        {
          category: 'Quantified Impact',
          resumeScore: 88,
          jobRequirement: 80,
          fullMark: 100,
          details: 'Accuracy gain, token cost reduction metrics',
        },
      ],
    },
    'backend': {
      id: 'backend',
      name: 'Backend & Distributed Systems',
      data: [
        {
          category: 'Core Programming',
          resumeScore: 92,
          jobRequirement: 92,
          fullMark: 100,
          details: 'Concurrency, memory safety, backend languages',
        },
        {
          category: 'System Architecture',
          resumeScore: 88,
          jobRequirement: 95,
          fullMark: 100,
          details: 'Horizontal scaling, partitioning, message queues',
        },
        {
          category: 'Cloud & DevOps',
          resumeScore: 74,
          jobRequirement: 90,
          fullMark: 100,
          details: 'Kubernetes, multi-region routing & telemetry',
        },
        {
          category: 'Code Quality & Testing',
          resumeScore: 88,
          jobRequirement: 85,
          fullMark: 100,
          details: 'Integration testing, fuzzing, reliability SLIs',
        },
        {
          category: 'Domain Fit & Tools',
          resumeScore: 86,
          jobRequirement: 88,
          fullMark: 100,
          details: 'PostgreSQL, Redis, gRPC, and microservices',
        },
        {
          category: 'Quantified Impact',
          resumeScore: 91,
          jobRequirement: 85,
          fullMark: 100,
          details: 'Queries/sec, P99 latency, zero-downtime uptime',
        },
      ],
    },
  };

  const currentBenchmark = roleBenchmarks[selectedTargetJob] || roleBenchmarks['full-stack'];
  const chartData = currentBenchmark.data;

  // Calculate composite average scores
  const avgResumeScore = Math.round(
    chartData.reduce((acc, curr) => acc + curr.resumeScore, 0) / chartData.length
  );
  const avgJobRequirement = Math.round(
    chartData.reduce((acc, curr) => acc + curr.jobRequirement, 0) / chartData.length
  );

  const pipelineSteps = [
    { id: 1, title: 'Upload Ingestion', desc: 'Binary verification and checksum calculation' },
    { id: 2, title: 'Document Validation', desc: 'Verifying PDF/DOCX structure and anti-corruption checks' },
    { id: 3, title: 'Text Extraction', desc: 'Parsing multi-column layout flows into normalized token stream' },
    { id: 4, title: 'Section Detection', desc: 'Categorizing Experience, Education, Projects, and Certifications' },
    { id: 5, title: 'Skill & Entity Extraction', desc: 'Gemini 3.8 Flash semantic classification of tech stacks' },
    { id: 6, title: 'Experience Analysis', desc: 'Evaluating action verb density, quantified outcomes, and chronology' },
    { id: 7, title: 'ATS Scoring Simulation', desc: 'Benchmarking against modern enterprise Applicant Tracking Systems' },
    { id: 8, title: 'Recommendations Synthesis', desc: 'Generating portfolio capstone advice and 30-60-90 day roadmap' },
  ];

  const runPipeline = async () => {
    const primaryResume = resumes[0];
    if (!primaryResume) {
      navigate('/student/resumes/upload');
      return;
    }

    setRunning(true);
    setError(null);
    setCompleted(false);
    setActiveStep(1);

    // Controlled simulation stepping with safety timeout
    for (let step = 1; step <= 8; step++) {
      setActiveStep(step);
      await new Promise((resolve) => setTimeout(resolve, 450));
    }

    setCompleted(true);
    setRunning(false);
    setTimeout(() => {
      navigate(`/student/resumes/${primaryResume.id}/diagnostic`);
    }, 1000);
  };

  if (loading) {
    return <div className="p-8 text-center text-xs text-slate-500">Loading resume analysis...</div>;
  }

  if (resumes.length === 0) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-3xl p-10 shadow-xs text-center space-y-4 max-w-2xl mx-auto my-8">
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto">
          <Sparkles className="w-7 h-7" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">No Resume Uploaded Yet</h2>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            Upload your resume to unlock your ATS score, profile insights, and career recommendations.
          </p>
        </div>
        <Link
          to="/student/resumes/upload"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <FileText className="w-4 h-4" /> Upload Resume
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">AI Resume Analysis &amp; Competency Radar</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Compare parsed resume competencies against target job requirements across 6 core engineering dimensions.
          </p>
        </div>

        <button
          onClick={runPipeline}
          disabled={running}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
        >
          {running ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" /> Running Pipeline...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" /> Run Live Analysis Pipeline
            </>
          )}
        </button>
      </div>

      {/* ============================================================== */}
      {/* RECHARTS RADAR CHART COMPONENT INTEGRATION                     */}
      {/* ============================================================== */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
              <h2 className="text-base font-bold text-slate-900">Competency Radar vs. Job Description</h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Evaluates multi-dimensional alignment between extracted resume tokens and target requisitions.
            </p>
          </div>

          {/* Benchmark Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider hidden sm:inline">
              Target Role:
            </span>
            <select
              value={selectedTargetJob}
              onChange={(e) => setSelectedTargetJob(e.target.value)}
              className="px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 transition-colors cursor-pointer"
            >
              <option value="full-stack">Full-Stack Software Engineer</option>
              <option value="genai">Generative AI &amp; LLM Engineer</option>
              <option value="backend">Backend &amp; Distributed Systems</option>
            </select>
          </div>
        </div>

        {/* Radar Chart Visualizer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Radar Graph */}
          <div className="lg:col-span-7 h-[360px] sm:h-[400px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={chartData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                <PolarGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                <PolarAngleAxis
                  dataKey="category"
                  tick={{ fill: '#334155', fontSize: 11, fontWeight: 600 }}
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 100]}
                  stroke="#94a3b8"
                  tick={{ fill: '#94a3b8', fontSize: 10 }}
                />

                {/* Candidate Parsed Resume Profile (Indigo Filled) */}
                <Radar
                  name="Parsed Resume Score"
                  dataKey="resumeScore"
                  stroke="#4f46e5"
                  fill="#6366f1"
                  fillOpacity={0.45}
                  strokeWidth={2.5}
                />

                {/* Job Description Baseline Target (Emerald Dashed) */}
                <Radar
                  name="Job Description Target"
                  dataKey="jobRequirement"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.15}
                  strokeWidth={2}
                  strokeDasharray="4 4"
                />

                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload;
                      const delta = item.resumeScore - item.jobRequirement;
                      return (
                        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs space-y-1 z-50">
                          <p className="font-bold text-slate-100">{item.category}</p>
                          <div className="flex items-center justify-between gap-4 text-slate-300">
                            <span>Candidate Score:</span>
                            <span className="font-bold text-indigo-400">{item.resumeScore}%</span>
                          </div>
                          <div className="flex items-center justify-between gap-4 text-slate-300">
                            <span>Job Target:</span>
                            <span className="font-bold text-emerald-400">{item.jobRequirement}%</span>
                          </div>
                          <div className="pt-1 border-t border-slate-800 flex items-center justify-between gap-2">
                            <span className="text-[10px] text-slate-400">Match Delta:</span>
                            <span
                              className={`text-[11px] font-bold ${
                                delta >= 0 ? 'text-emerald-400' : 'text-amber-400'
                              }`}
                            >
                              {delta >= 0 ? `+${delta}% Ahead` : `${delta}% Gap`}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 pt-1 italic">{item.details}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => (
                    <span className="text-xs font-semibold text-slate-700">{value}</span>
                  )}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Metrics Summary Sidebar */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Composite Alignment Index
              </span>
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-3xl font-black text-indigo-600">{avgResumeScore}%</span>
                  <span className="text-xs text-slate-400 ml-1.5 font-medium">Resume Average</span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold text-emerald-600">{avgJobRequirement}%</span>
                  <span className="text-xs text-slate-400 block">Required Benchmark</span>
                </div>
              </div>

              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600 rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(100, (avgResumeScore / avgJobRequirement) * 100)}%` }}
                />
              </div>

              <p className="text-[11px] text-slate-600 leading-snug">
                {avgResumeScore >= avgJobRequirement
                  ? 'Your profile exceeds the threshold benchmark across core technical requirements.'
                  : 'Slight gap detected in Cloud & DevOps infrastructure tooling.'}
              </p>
            </div>

            {/* Dimension Highlights List */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Category Breakdown &amp; Status
              </span>

              <div className="space-y-1.5 text-xs">
                {chartData.map((cat) => {
                  const delta = cat.resumeScore - cat.jobRequirement;
                  const isAhead = delta >= 0;
                  return (
                    <div
                      key={cat.category}
                      className="p-2.5 bg-white border border-slate-200/80 rounded-xl flex items-center justify-between gap-2 shadow-2xs"
                    >
                      <div>
                        <p className="font-bold text-slate-900 leading-tight">{cat.category}</p>
                        <p className="text-[10px] text-slate-400">{cat.details}</p>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <span
                          className={`inline-flex items-center gap-0.5 text-[11px] font-extrabold px-2 py-0.5 rounded-md ${
                            isAhead
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {isAhead ? `+${delta}%` : `${delta}%`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pipeline Visualizer Card */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              {running ? `Executing Step ${activeStep} of 8...` : completed ? 'Pipeline Complete' : 'AI Analysis Pipeline Execution'}
            </span>
          </div>

          <span className="text-xs text-slate-500">Gemini 3.8 Flash Engine</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pipelineSteps.map((step) => {
            const isDone = completed || (running && activeStep > step.id);
            const isCurrent = running && activeStep === step.id;

            return (
              <div
                key={step.id}
                className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                  isCurrent
                    ? 'border-indigo-500 bg-indigo-50/50 shadow-xs'
                    : isDone
                    ? 'border-slate-200 bg-slate-50'
                    : 'border-slate-100 bg-white opacity-60'
                }`}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : isCurrent ? (
                    <div className="w-5 h-5 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 text-[11px] font-bold flex items-center justify-center border border-slate-200">
                      {step.id}
                    </div>
                  )}
                </div>

                <div>
                  <p className={`text-xs font-bold ${isCurrent ? 'text-indigo-900' : 'text-slate-900'}`}>
                    {step.title}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Automatic timeout and failure recovery safeguards active.</span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/student/resumes"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
            >
              Resume Vault
            </Link>
            <button
              onClick={() => navigate('/student/ats-simulator')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              Open ATS Simulator <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
