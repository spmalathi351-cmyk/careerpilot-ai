import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { MetricCard } from '../../components/common/MetricCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useNotifications } from '../../contexts/NotificationContext';
import {
  Users,
  Briefcase,
  Layers,
  Sparkles,
  PlusCircle,
  Search,
  ChevronRight,
  TrendingUp,
  UserCheck,
  Calendar,
  Edit3,
  Trash2,
  X,
  Check,
} from 'lucide-react';

export const RecruiterDashboardPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editingJob, setEditingJob] = useState<any | null>(null);
  const [editForm, setEditForm] = useState({
    title: '',
    location: '',
    employmentType: 'Full-time',
    salaryRange: '',
    status: 'published',
  });
  const [savingEdit, setSavingEdit] = useState(false);

  const { showToast } = useNotifications();
  const navigate = useNavigate();

  const loadDashboard = () => {
    api
      .getRecruiterDashboard()
      .then((res) => setData(res))
      .catch((err) => console.warn(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleOpenEdit = (job: any) => {
    setEditingJob(job);
    setEditForm({
      title: job.title || '',
      location: job.location || '',
      employmentType: job.employmentType || 'Full-time',
      salaryRange: job.salaryRange || '',
      status: job.status || 'published',
    });
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingJob || !editForm.title.trim()) return;

    setSavingEdit(true);
    try {
      await api.updateJob(editingJob.id, editForm);
      showToast('Job posting updated successfully', 'success');
      setEditingJob(null);
      loadDashboard();
    } catch (err: any) {
      showToast('Failed to update job posting', 'warning');
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDeleteJob = async (jobId: string, jobTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${jobTitle}"?`)) return;

    try {
      await api.deleteJob(jobId);
      showToast(`Job "${jobTitle}" removed`, 'info');
      loadDashboard();
    } catch (err: any) {
      showToast('Could not delete job', 'warning');
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-xs text-slate-500">Loading recruiter telemetry...</div>;
  }

  const kpis = data?.kpis || {
    activeJobsCount: 3,
    totalCandidatesCount: 12,
    pipelineTotal: 8,
    shortlistedCount: 4,
    interviewsScheduled: 2,
  };

  const pipeline = data?.pipeline || {
    screening: 2,
    interview: 2,
    offer: 1,
    hired: 1,
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 border border-indigo-400/30 rounded-full text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            Recruiter Intelligence Active
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {data?.profile?.company?.name || 'CareerPilot Demo Technologies'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Talent pipeline is healthy. {kpis.activeJobsCount} active openings currently receiving applicants.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/recruiter/jobs/create"
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" /> Create New Job
          </Link>
          <Link
            to="/recruiter/candidates/search"
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <Search className="w-4 h-4" /> Find Candidates
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Active Job Postings"
          value={kpis.activeJobsCount}
          subtitle="All live on job board"
          icon={Briefcase}
          accentColor="indigo"
          onClick={() => navigate('/recruiter/overview')}
        />
        <MetricCard
          title="Total Pipeline Candidates"
          value={kpis.pipelineTotal}
          subtitle="Reviewed across roles"
          icon={Users}
          accentColor="emerald"
          onClick={() => navigate('/recruiter/candidates/search')}
        />
        <MetricCard
          title="Shortlisted Profiles"
          value={kpis.shortlistedCount}
          subtitle="Top candidates flagged"
          icon={UserCheck}
          accentColor="violet"
          onClick={() => navigate('/recruiter/candidates/table')}
        />
        <MetricCard
          title="Interviews Scheduled"
          value={kpis.interviewsScheduled}
          subtitle="Technical & behavioral panels"
          icon={Calendar}
          accentColor="blue"
        />
      </div>

      {/* Pipeline Status Breakdown */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
          Recruitment Pipeline Stages
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 text-center">
            <span className="text-[11px] font-bold uppercase text-amber-800">Screening</span>
            <p className="text-2xl font-black text-amber-900 mt-1">{pipeline.screening}</p>
          </div>
          <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 text-center">
            <span className="text-[11px] font-bold uppercase text-indigo-800">Interviewing</span>
            <p className="text-2xl font-black text-indigo-900 mt-1">{pipeline.interview}</p>
          </div>
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-center">
            <span className="text-[11px] font-bold uppercase text-emerald-800">Offers Extended</span>
            <p className="text-2xl font-black text-emerald-900 mt-1">{pipeline.offer}</p>
          </div>
          <div className="p-4 bg-slate-100 rounded-2xl border border-slate-200 text-center">
            <span className="text-[11px] font-bold uppercase text-slate-700">Hired</span>
            <p className="text-2xl font-black text-slate-900 mt-1">{pipeline.hired}</p>
          </div>
        </div>
      </div>

      {/* Grid: Active Jobs & Top Candidates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Jobs */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Active Job Postings</h3>
            <Link to="/recruiter/jobs/create" className="text-xs font-semibold text-indigo-600 hover:text-indigo-800">
              + Post New
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {(data?.activeJobs || []).map((job: any) => (
              <div key={job.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900">{job.title}</p>
                  <p className="text-[11px] text-slate-500">
                    {job.location} · {job.employmentType} · {job.salaryRange}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">
                    {job.applicantCount} applicants
                  </span>
                  <button
                    onClick={() => handleOpenEdit(job)}
                    title="Edit job posting"
                    className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteJob(job.id, job.title)}
                    title="Delete job posting"
                    className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Candidates */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Candidate Pipeline Spotlight</h3>
            <Link to="/recruiter/candidates/search" className="text-xs font-semibold text-indigo-600 hover:text-indigo-800">
              View All Candidates
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {(data?.topCandidates || []).map((c: any) => (
              <div
                key={c.id}
                onClick={() => navigate(`/recruiter/candidates/${c.id}`)}
                className="py-3 flex items-center justify-between hover:bg-slate-50 -mx-2 px-2 rounded-xl cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={c.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
                    alt={c.user?.displayName}
                    className="w-10 h-10 rounded-xl object-cover"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-900">{c.user?.displayName || 'Candidate'}</p>
                    <p className="text-[11px] text-slate-500 truncate max-w-[200px]">{c.headline}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[11px] font-bold text-indigo-600 block">
                      {c.primaryResume?.atsScore || 90}% ATS
                    </span>
                    <span className="text-[10px] text-slate-400">Readiness: {c.readinessScore}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Job Modal */}
      {editingJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Edit Job Posting</h3>
                <p className="text-xs text-slate-500">Update listing details for prospective candidates</p>
              </div>
              <button
                onClick={() => setEditingJob(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Job Title *</label>
                <input
                  type="text"
                  required
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={editForm.location}
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Employment Type</label>
                  <select
                    value={editForm.employmentType}
                    onChange={(e) => setEditForm({ ...editForm, employmentType: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Internship">Internship</option>
                    <option value="Contract">Contract</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Salary Range</label>
                  <input
                    type="text"
                    value={editForm.salaryRange}
                    onChange={(e) => setEditForm({ ...editForm, salaryRange: e.target.value })}
                    placeholder="$120k - $150k"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingJob(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  {savingEdit ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
