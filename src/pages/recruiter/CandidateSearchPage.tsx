import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { useNotifications } from '../../contexts/NotificationContext';
import {
  Search,
  Filter,
  UserCheck,
  Star,
  MapPin,
  CheckCircle2,
  Table,
  ArrowRight,
} from 'lucide-react';

export const CandidateSearchPage: React.FC = () => {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [query, setQuery] = useState('');
  const [skill, setSkill] = useState('');
  const [location, setLocation] = useState('');
  const [minReadiness, setMinReadiness] = useState('0');
  const [loading, setLoading] = useState(true);

  const { showToast } = useNotifications();
  const navigate = useNavigate();

  const searchCandidates = (filters = {}) => {
    setLoading(true);
    api
      .searchCandidates({
        query,
        skill,
        location,
        minReadiness: minReadiness !== '0' ? minReadiness : undefined,
        ...filters,
      })
      .then((res) => setCandidates(res.candidates))
      .catch((err) => console.warn(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    searchCandidates();
  }, [minReadiness]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchCandidates();
  };

  const handleShortlist = async (e: React.MouseEvent, candidateId: string, name: string) => {
    e.stopPropagation();
    try {
      await api.shortlistCandidate(candidateId);
      showToast(`${name} added to shortlist and notified!`, 'success');
    } catch (err: any) {
      showToast('Could not shortlist candidate', 'warning');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Candidate Discovery &amp; Search</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Search vetted talent by verified technical skills, ATS benchmark scores, and readiness indices.
          </p>
        </div>

        <Link
          to="/recruiter/candidates/table"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
        >
          <Table className="w-4 h-4" /> View Table Roster
        </Link>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search candidate name, headline, or keywords..."
              className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            />
          </div>

          <div>
            <input
              type="text"
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
              placeholder="Filter by skill (e.g. React)"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Search className="w-3.5 h-3.5" /> Search
            </button>
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setSkill('');
                setLocation('');
                setMinReadiness('0');
                searchCandidates({ query: '', skill: '', location: '', minReadiness: undefined });
              }}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-semibold"
            >
              Reset
            </button>
          </div>
        </form>

        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-500 font-medium">Minimum Readiness Score:</span>
          {['0', '75', '85', '90'].map((val) => (
            <button
              key={val}
              onClick={() => setMinReadiness(val)}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                minReadiness === val
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {val === '0' ? 'Any' : `${val}+`}
            </button>
          ))}
        </div>
      </div>

      {/* Candidate Cards Grid */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-500">Searching candidate registry...</div>
      ) : candidates.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center max-w-md mx-auto">
          <p className="text-sm font-bold text-slate-800">No candidates found matching criteria</p>
          <p className="text-xs text-slate-500 mt-1">Try broadening your search query or reset filter thresholds.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {candidates.map((c) => (
            <div
              key={c.id}
              onClick={() => navigate(`/recruiter/candidates/${c.id}`)}
              className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={c.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
                      alt={c.user?.displayName}
                      className="w-12 h-12 rounded-2xl object-cover ring-2 ring-indigo-500/10"
                    />
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{c.user?.displayName || 'Candidate'}</h3>
                      <p className="text-xs text-indigo-600 font-medium truncate max-w-[200px]">{c.headline}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-black text-indigo-600 block">
                      {c.primaryResume?.atsScore || 90}% ATS
                    </span>
                    <span className="text-[10px] text-slate-400">Readiness: {c.readinessScore}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> {c.location}
                  </span>
                  <span>·</span>
                  <span>{c.education[0]?.degree || 'B.S. Computer Science'}</span>
                </div>

                <div className="flex flex-wrap gap-1 pt-1">
                  {c.skills.slice(0, 5).map((sk: string) => (
                    <span key={sk} className="text-[11px] px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-medium">
                      {sk}
                    </span>
                  ))}
                  {c.skills.length > 5 && (
                    <span className="text-[10px] px-1.5 py-0.5 text-slate-400">
                      +{c.skills.length - 5} more
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={(e) => handleShortlist(e, c.id, c.user?.displayName || 'Candidate')}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition-colors"
                >
                  <UserCheck className="w-3.5 h-3.5" /> Shortlist
                </button>

                <span className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                  View Dossier <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
