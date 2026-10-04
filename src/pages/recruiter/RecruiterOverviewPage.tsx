import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  Activity,
  Briefcase,
  Users,
  Video,
  PlusCircle,
  Search,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

export const RecruiterOverviewPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .getRecruiterOverview()
      .then((res) => setData(res))
      .catch((err) => console.warn(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-xs text-slate-500">Loading overview...</div>;
  }

  const activeJobs = data?.activeJobs || [];
  const applications = data?.allApplications || [];
  const candidates = data?.candidates || [];
  const interviewsCount = data?.interviewsCount || 0;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Recruitment Pipeline Overview</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Global metrics across open requisitions, candidate evaluation funnels, and scheduled panels.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/recruiter/jobs/create"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs"
          >
            <PlusCircle className="w-4 h-4" /> Create Opening
          </Link>
          <Link
            to="/recruiter/candidates/search"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
          >
            <Search className="w-4 h-4" /> Candidate Search
          </Link>
        </div>
      </div>

      {/* Overview Stat Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-bold uppercase text-slate-400">Published Jobs</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{activeJobs.length}</p>
        </div>
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-bold uppercase text-slate-400">Total Applicants</span>
          <p className="text-2xl font-black text-indigo-600 mt-1">{applications.length}</p>
        </div>
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-bold uppercase text-slate-400">Active Candidates</span>
          <p className="text-2xl font-black text-emerald-600 mt-1">{candidates.length}</p>
        </div>
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-bold uppercase text-slate-400">Interview Stage</span>
          <p className="text-2xl font-black text-violet-600 mt-1">{interviewsCount}</p>
        </div>
      </div>

      {/* Applications Pipeline Table */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Recent Applications Funnel</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-y border-slate-100">
              <tr>
                <th className="py-3 px-4">Job Title</th>
                <th className="py-3 px-4">Candidate Stage</th>
                <th className="py-3 px-4">ATS Match</th>
                <th className="py-3 px-4">Applied Date</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {applications.map((app: any) => (
                <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{app.jobTitle}</td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={app.stage} size="sm" />
                  </td>
                  <td className="py-3.5 px-4 text-indigo-600 font-bold">{app.matchScore}%</td>
                  <td className="py-3.5 px-4 text-slate-500">
                    {new Date(app.appliedAt).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => navigate(`/student/applications/${app.id}`)}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
                    >
                      Inspect →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
