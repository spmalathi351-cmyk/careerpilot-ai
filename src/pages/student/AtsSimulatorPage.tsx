import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { Resume, Job } from '../../types';
import { ScoreGauge } from '../../components/common/ScoreGauge';
import { useNotifications } from '../../contexts/NotificationContext';
import {
  Target,
  Sparkles,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  FileText,
  Briefcase,
  Layers,
  Search,
} from 'lucide-react';

export const AtsSimulatorPage: React.FC = () => {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string>('');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>('');
  const [jobDescription, setJobDescription] = useState(
    'Looking for a Full-Stack Software Engineer with strong proficiency in React, TypeScript, Node.js, PostgreSQL, Docker, REST APIs, Git, and Gemini AI integration.'
  );
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);

  const [loading, setLoading] = useState(true);
  const { showToast } = useNotifications();
  const navigate = useNavigate();

  useEffect(() => {
    // Load student resumes and active jobs
    Promise.all([api.getResumes(), api.getJobs()])
      .then(([resRes, jobsRes]) => {
        setResumes(resRes.resumes);
        if (resRes.resumes.length > 0) {
          setSelectedResumeId(resRes.resumes[0].id);
          // Initial ATS analysis only if resume exists
          handleAnalyze(resRes.resumes[0].id);
        }
        setJobs(jobsRes.jobs);
        if (jobsRes.jobs.length > 0) {
          setSelectedJobId(jobsRes.jobs[0].id);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleJobSelect = (jobId: string) => {
    setSelectedJobId(jobId);
    const target = jobs.find((j) => j.id === jobId);
    if (target) {
      setJobDescription(
        `${target.title} - ${target.companyName}\n\n${target.description}\n\nRequired Skills: ${target.requiredSkills.join(
          ', '
        )}\nPreferred: ${target.preferredSkills.join(', ')}`
      );
    }
  };

  const handleAnalyze = async (overrideResumeId?: string) => {
    setAnalyzing(true);
    try {
      const res = await api.analyzeAts({
        resumeId: overrideResumeId || selectedResumeId,
        jobDescription,
      });
      setResults(res.result);
      showToast('ATS compatibility recalculated', 'success');
    } catch (err: any) {
      showToast('ATS scoring notice: using baseline metrics', 'warning');
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-xs text-slate-500">Loading ATS Simulator...</div>;
  }

  if (resumes.length === 0) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-3xl p-10 shadow-xs text-center space-y-4 max-w-2xl mx-auto my-8">
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
          <Target className="w-7 h-7" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">No Resume to Simulate</h2>
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
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">ATS Compatibility Simulator</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Simulate how enterprise Applicant Tracking Systems evaluate your resume against targeted job descriptions.
          </p>
        </div>

        {selectedResumeId && (
          <Link
            to={`/student/ats-simulator/inspector/${selectedResumeId}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold transition-colors"
          >
            <Search className="w-3.5 h-3.5" /> Line Inspector Mode
          </Link>
        )}
      </div>

      {/* Mandatory Disclaimer Box */}
      <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl text-xs text-amber-900 flex items-start gap-3">
        <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Estimated Compatibility Benchmark:</span> This score represents an estimated
          algorithmic simulation calibrated to enterprise parsing heuristics. It does not reflect an internal proprietary
          ranking of any specific external employer.
        </div>
      </div>

      {/* Target Resume & Job Selector Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Select Resume to Test</label>
          <select
            value={selectedResumeId}
            onChange={(e) => setSelectedResumeId(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
          >
            {resumes.map((r) => (
              <option key={r.id} value={r.id}>
                {r.filename} {r.isPrimary ? '(Primary)' : ''}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Preset Job Description</label>
          <select
            value={selectedJobId}
            onChange={(e) => handleJobSelect(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
          >
            <option value="">-- Custom Job Description --</option>
            {jobs.map((j) => (
              <option key={j.id} value={j.id}>
                {j.title} · {j.companyName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Job Description Textarea */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-700">Target Job Description (JD)</label>
          <button
            onClick={() => handleAnalyze()}
            disabled={analyzing}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {analyzing ? 'Recalculating...' : 'Recalculate ATS Match'}
          </button>
        </div>

        <textarea
          rows={4}
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste full job description or requirements here..."
          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs leading-relaxed"
        />
      </div>

      {/* Results Section */}
      {results && (
        <div className="space-y-6">
          {/* Main Scorecard */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              <div className="flex justify-center border-b md:border-b-0 md:border-r border-slate-100 pb-6 md:pb-0 md:pr-8">
                <ScoreGauge score={results.overall} label="ATS Match Rating" size="lg" />
              </div>

              <div className="md:col-span-2 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Detailed Compatibility Metrics
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                      <span>Keyword Match</span>
                      <span className="text-indigo-600 font-extrabold">{results.keywordMatch}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${results.keywordMatch}%` }} />
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                      <span>Skills Match</span>
                      <span className="text-emerald-600 font-extrabold">{results.skillsMatch}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${results.skillsMatch}%` }} />
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                      <span>Formatting Score</span>
                      <span className="text-blue-600 font-extrabold">{results.formattingScore}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${results.formattingScore}%` }} />
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                      <span>Experience Relevance</span>
                      <span className="text-violet-600 font-extrabold">{results.experienceRelevance}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-violet-500 rounded-full" style={{ width: `${results.experienceRelevance}%` }} />
                    </div>
                  </div>
                </div>

                {results.semanticInsight && (
                  <p className="text-xs text-slate-600 italic bg-slate-50 p-3 rounded-xl border border-slate-100">
                    💡 <span className="font-semibold text-slate-800">Semantic Insight:</span> {results.semanticInsight}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Keywords Match & Missing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Detected Keywords in Resume
              </h3>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {(results.detectedKeywords || []).map((kw: string) => (
                  <span
                    key={kw}
                    className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold"
                  >
                    ✓ {kw}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-600" /> Missing High-Leverage Keywords
              </h3>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {(results.missingKeywords || []).map((kw: string) => (
                  <span
                    key={kw}
                    className="px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-lg text-xs font-semibold"
                  >
                    + {kw}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Actionable Suggestions */}
          {results.suggestions && (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Actionable Recommendations to Elevate Pass Rate
              </h3>
              <ul className="space-y-2 text-xs text-slate-700">
                {results.suggestions.map((sug: string, i: number) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 flex-shrink-0 mt-1.5" />
                    <span>{sug}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
