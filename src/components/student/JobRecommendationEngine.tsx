import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Job } from '../../types';
import { useNotifications } from '../../contexts/NotificationContext';
import {
  Sparkles,
  Briefcase,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Send,
  Building,
  MapPin,
  Clock,
  DollarSign,
  TrendingUp,
  FileText,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

interface JobRecommendation {
  job: Job;
  matchScore: number;
  skillsScore: number;
  experienceScore: number;
  educationScore: number;
  fitVerdict: string;
  matchedSkills: string[];
  missingSkills: string[];
  recommendationReason: string;
}

interface RecommendationResponse {
  recommendations: JobRecommendation[];
  resumeUsed: {
    id: string;
    filename: string;
    atsScore: number;
    skillsDetectedCount: number;
    sampleSkills: string[];
  };
  totalPublishedJobs: number;
}

export const JobRecommendationEngine: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const [data, setData] = useState<RecommendationResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [applyingJobId, setApplyingJobId] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<JobRecommendation | null>(null);
  const { showToast } = useNotifications();
  const navigate = useNavigate();

  const loadRecommendations = () => {
    setLoading(true);
    api
      .getJobRecommendations()
      .then((res) => {
        setData(res);
        if (res.recommendations.length > 0) {
          setSelectedJob(res.recommendations[0]);
        }
      })
      .catch((err) => console.warn('Recommendation fetch failed:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadRecommendations();
  }, []);

  const handle1ClickApply = async (jobId: string, matchScore: number) => {
    if (!data?.resumeUsed?.id) {
      showToast('Please upload a resume first to apply', 'warning');
      return;
    }

    setApplyingJobId(jobId);
    try {
      await api.createApplication({
        jobId,
        resumeId: data.resumeUsed.id,
        matchScore,
      });
      showToast('Application submitted with your calibrated resume!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to submit application', 'warning');
    } finally {
      setApplyingJobId(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span>Calibrating active job postings against your parsed resume...</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-slate-100 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!data?.resumeUsed || data.recommendations.length === 0) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-3xl p-8 shadow-xs text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto">
          <Briefcase className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-bold text-base text-slate-900">AI Job Recommendation &amp; Match Engine</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
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

  const { recommendations, resumeUsed } = data;

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              AI Job Recommendation &amp; Match Engine
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Calibrated against{' '}
            <strong className="text-slate-800 font-semibold">{resumeUsed.filename}</strong> (
            {resumeUsed.skillsDetectedCount} extracted competencies · ATS Score {resumeUsed.atsScore}%)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/student/resumes"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <FileText className="w-3.5 h-3.5" /> Switch Resume
          </Link>
          <button
            onClick={loadRecommendations}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            title="Refresh match scores"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Recommendations Cards Grid */}
      <div className={`grid grid-cols-1 ${compact ? 'gap-4' : 'lg:grid-cols-3 gap-5'}`}>
        {recommendations.slice(0, compact ? 3 : 6).map((rec) => {
          const { job, matchScore, fitVerdict, matchedSkills, missingSkills, recommendationReason } = rec;
          const isApplying = applyingJobId === job.id;

          const badgeColor =
            matchScore >= 88
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : matchScore >= 75
              ? 'bg-indigo-50 text-indigo-800 border-indigo-200'
              : 'bg-amber-50 text-amber-800 border-amber-200';

          return (
            <div
              key={job.id}
              className="bg-slate-50/60 hover:bg-white border border-slate-200/80 hover:border-indigo-300 rounded-2xl p-5 transition-all shadow-2xs hover:shadow-md flex flex-col justify-between space-y-4 group"
            >
              {/* Card Top: Company & Title */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={job.companyLogo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=150'}
                      alt={job.companyName}
                      className="w-10 h-10 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                    />
                    <div>
                      <h3 className="text-xs font-bold text-slate-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                        {job.title}
                      </h3>
                      <p className="text-[11px] text-slate-500 font-medium">{job.companyName}</p>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className={`inline-block px-2.5 py-1 rounded-xl text-xs font-black border ${badgeColor}`}>
                      {matchScore}%
                    </span>
                    <span className="block text-[10px] text-slate-400 font-semibold mt-0.5">{fitVerdict}</span>
                  </div>
                </div>

                {/* Match Reason Banner */}
                <div className="p-2.5 bg-white rounded-xl border border-slate-200/80 text-[11px] text-slate-700 leading-snug space-y-1">
                  <p className="font-semibold text-indigo-900 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-indigo-600" /> Match Analysis:
                  </p>
                  <p className="text-slate-600">{recommendationReason}</p>
                </div>

                {/* Meta details */}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" /> {job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-3 h-3 text-slate-400" /> {job.salaryRange}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" /> {job.employmentType}
                  </span>
                </div>

                {/* Overlapping & Missing Competencies */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    <span>Matched Skills ({matchedSkills.length})</span>
                    <span>Gap ({missingSkills.length})</span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {matchedSkills.slice(0, 4).map((sk) => (
                      <span
                        key={sk}
                        className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-semibold rounded border border-emerald-200"
                      >
                        ✓ {sk}
                      </span>
                    ))}
                    {missingSkills.slice(0, 2).map((sk) => (
                      <span
                        key={sk}
                        className="px-1.5 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-semibold rounded border border-slate-200 line-through opacity-75"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-200/70 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handle1ClickApply(job.id, matchScore)}
                  disabled={isApplying}
                  className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  {isApplying ? (
                    'Submitting...'
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" /> 1-Click Apply
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/student/ats-simulator')}
                  className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold transition-colors"
                  title="Inspect ATS Alignment"
                >
                  Simulate
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
