import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { useNotifications } from '../../contexts/NotificationContext';
import { Users, UserCheck, Send, Eye, Search, ArrowLeft } from 'lucide-react';

export const CandidateTablePage: React.FC = () => {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useNotifications();
  const navigate = useNavigate();

  useEffect(() => {
    api
      .searchCandidates({})
      .then((res) => setCandidates(res.candidates))
      .finally(() => setLoading(false));
  }, []);

  const handleShortlist = async (id: string, name: string) => {
    try {
      await api.shortlistCandidate(id);
      showToast(`${name} added to shortlist`, 'success');
    } catch (e) {
      showToast('Could not shortlist candidate', 'warning');
    }
  };

  const handleInvite = async (id: string, name: string) => {
    try {
      await api.inviteCandidate(id, { jobId: 'job-1' });
      showToast(`Interview invitation dispatched to ${name}`, 'success');
    } catch (e) {
      showToast('Could not send invitation', 'warning');
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-xs text-slate-500">Loading candidate roster...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            to="/recruiter/candidates/search"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 mb-1"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Candidate Cards
          </Link>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Candidate Roster Table</h1>
        </div>

        <span className="text-xs font-semibold text-slate-500">
          Showing {candidates.length} vetted candidates
        </span>
      </div>

      {/* Table Container */}
      <div className="bg-white border border-slate-200/80 rounded-3xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-5">Candidate</th>
                <th className="py-3.5 px-4">Primary Skills</th>
                <th className="py-3.5 px-4">Experience</th>
                <th className="py-3.5 px-4">ATS Compatibility</th>
                <th className="py-3.5 px-4">Readiness</th>
                <th className="py-3.5 px-5 text-right">Recruiter Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {candidates.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <img
                        src={c.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
                        alt={c.user?.displayName}
                        className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-200"
                      />
                      <div>
                        <p className="font-bold text-slate-900">{c.user?.displayName || 'Candidate'}</p>
                        <p className="text-[11px] text-slate-500 truncate max-w-[180px]">{c.location}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {c.skills.slice(0, 3).map((sk: string) => (
                        <span key={sk} className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="py-4 px-4 text-slate-600">
                    {c.experience[0]?.company ? `${c.experience[0]?.role} @ ${c.experience[0]?.company}` : 'Senior Student'}
                  </td>

                  <td className="py-4 px-4">
                    <span className="font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
                      {c.primaryResume?.atsScore || 90}%
                    </span>
                  </td>

                  <td className="py-4 px-4 text-slate-700 font-semibold">
                    {c.readinessScore}/100
                  </td>

                  <td className="py-4 px-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => navigate(`/recruiter/candidates/${c.id}`)}
                        className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
                        title="View Dossier"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleShortlist(c.id, c.user?.displayName || 'Candidate')}
                        className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Shortlist"
                      >
                        <UserCheck className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleInvite(c.id, c.user?.displayName || 'Candidate')}
                        className="p-1.5 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Invite to Interview"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
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
