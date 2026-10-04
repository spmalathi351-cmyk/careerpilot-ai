import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { Application, Job, Resume } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { JobRecommendationEngine } from '../../components/student/JobRecommendationEngine';
import { useNotifications } from '../../contexts/NotificationContext';
import {
  Briefcase,
  Plus,
  Search,
  ExternalLink,
  Calendar,
  Building,
  Target,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export const ApplicationsListPage: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'applications' | 'recommendations'>('applications');
  const [filterStage, setFilterStage] = useState('All');
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { showToast } = useNotifications();
  const navigate = useNavigate();

  const loadData = () => {
    Promise.all([api.getApplications(), api.getJobs(), api.getResumes()])
      .then(([appsRes, jobsRes, resumesRes]) => {
        setApplications(appsRes.applications);
        setJobs(jobsRes.jobs);
        if (jobsRes.jobs.length > 0) setSelectedJobId(jobsRes.jobs[0].id);
        setResumes(resumesRes.resumes);
        if (resumesRes.resumes.length > 0) setSelectedResumeId(resumesRes.resumes[0].id);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJobId) return;

    setSubmitting(true);
    try {
      const res = await api.createApplication({
        jobId: selectedJobId,
        resumeId: selectedResumeId,
        matchScore: Math.floor(85 + Math.random() * 9),
      });
      showToast('Application successfully submitted!', 'success');
      setShowApplyModal(false);
      loadData();
    } catch (err: any) {
      showToast('Failed to submit application', 'warning');
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = applications.filter((app) => {
    if (filterStage === 'All') return true;
    return app.stage.toLowerCase() === filterStage.toLowerCase();
  });

  const stages = ['All', 'Applied', 'Screening', 'Interview', 'Offer', 'Rejected'];

  if (loading) {
    return <div className="p-8 text-center text-xs text-slate-500">Loading job applications...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Job Applications Tracker</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Track your recruitment stages, interview schedules, and feedback across active submissions.
          </p>
        </div>

        <button
          onClick={() => setShowApplyModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" /> Apply to Open Job
        </button>
      </div>

      {/* Top Level View Selector */}
      <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('applications')}
          className={`pb-1 text-xs font-bold transition-all relative ${
            activeTab === 'applications'
              ? 'text-indigo-600 after:absolute after:bottom-[-13px] after:left-0 after:right-0 after:h-0.5 after:bg-indigo-600'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          My Applications ({applications.length})
        </button>

        <button
          onClick={() => setActiveTab('recommendations')}
          className={`pb-1 text-xs font-bold transition-all flex items-center gap-1.5 relative ${
            activeTab === 'recommendations'
              ? 'text-indigo-600 after:absolute after:bottom-[-13px] after:left-0 after:right-0 after:h-0.5 after:bg-indigo-600'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          AI Matched Recommendations
        </button>
      </div>

      {activeTab === 'recommendations' ? (
        <JobRecommendationEngine />
      ) : (
        <>
          {/* Stage Breakdown Filter Chips */}
          <div className="flex flex-wrap items-center gap-2">
        {stages.map((st) => {
          const count =
            st === 'All'
              ? applications.length
              : applications.filter((a) => a.stage.toLowerCase() === st.toLowerCase()).length;

          return (
            <button
              key={st}
              onClick={() => setFilterStage(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                filterStage === st
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              <span>{st}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${filterStage === st ? 'bg-indigo-800' : 'bg-slate-100'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Applications Cards */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center max-w-md mx-auto shadow-xs">
          <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No applications in this stage</h3>
          <p className="text-xs text-slate-500 mt-1 mb-4">Explore published positions to submit your tailored resume.</p>
          <button
            onClick={() => setShowApplyModal(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold"
          >
            Apply to a Role
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((app) => (
            <div
              key={app.id}
              onClick={() => navigate(`/student/applications/${app.id}`)}
              className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start sm:items-center gap-4">
                <img
                  src={app.companyLogo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=150'}
                  alt={app.companyName}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                />

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">{app.jobTitle}</h3>
                    <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                      {app.matchScore}% Match
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 flex items-center gap-2">
                    <span>{app.companyName}</span>
                    <span>·</span>
                    <span>{app.jobLocation}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 self-end sm:self-center">
                <div className="text-right hidden sm:block">
                  <span className="text-[10px] text-slate-400 block">Applied</span>
                  <span className="text-xs text-slate-600 font-medium">
                    {new Date(app.appliedAt).toLocaleDateString()}
                  </span>
                </div>

                <StatusBadge status={app.stage} />

                <ChevronRight className="w-5 h-5 text-slate-400" />
              </div>
            </div>
          ))}
        </div>
      )}
      </>
      )}

      {/* Manual Application Modal for Testing */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Apply to Open Position</h2>
            <p className="text-xs text-slate-500">
              Submit your calibrated resume to kick off recruiter review and AI screening.
            </p>

            <form onSubmit={handleCreateApplication} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Target Job</label>
                <select
                  value={selectedJobId}
                  onChange={(e) => setSelectedJobId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                >
                  {jobs.map((job) => (
                    <option key={job.id} value={job.id}>
                      {job.title} — {job.companyName} ({job.location})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Attached Resume</label>
                <select
                  value={selectedResumeId}
                  onChange={(e) => setSelectedResumeId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                >
                  {resumes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.filename} (ATS: {r.atsScore}%)
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold"
                >
                  {submitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
