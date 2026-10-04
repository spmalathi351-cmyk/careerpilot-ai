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
} from 'lucide-react';

export const RecruiterDashboardPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const { showToast } = useNotifications();
  const navigate = useNavigate();

  useEffect(() => {
    api
      .getRecruiterDashboard()
      .then((res) => setData(res))
      .catch((err) => console.warn(err))
      .finally(() => setLoading(false));
  }, []);

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
    </div>
  );
};
