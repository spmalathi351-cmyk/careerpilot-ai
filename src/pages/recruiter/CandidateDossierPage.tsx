import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { useNotifications } from '../../contexts/NotificationContext';
import {
  ArrowLeft,
  UserCheck,
  Send,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  FileText,
  MapPin,
  Mail,
  Phone,
  HelpCircle,
  GraduationCap,
  Briefcase,
  Layers,
} from 'lucide-react';

export const CandidateDossierPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [shortlisted, setShortlisted] = useState(false);
  const [invited, setInvited] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteMsg, setInviteMsg] = useState(
    'Hi! Our team at CareerPilot Demo Technologies reviewed your profile and we would love to invite you for a 30-minute technical interview.'
  );

  const { showToast } = useNotifications();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      api
        .getCandidateDossier(id)
        .then((res) => setData(res))
        .catch((err) => console.warn(err))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleShortlist = async () => {
    if (!id) return;
    try {
      await api.shortlistCandidate(id);
      setShortlisted(true);
      showToast('Candidate shortlisted and added to priority pipeline', 'success');
    } catch (e) {
      showToast('Could not shortlist', 'warning');
    }
  };

  const handleSendInvite = async () => {
    if (!id) return;
    try {
      await api.inviteCandidate(id, { jobId: 'job-1', message: inviteMsg });
      setInvited(true);
      setInviteModalOpen(false);
      showToast('Interview invitation dispatched to candidate!', 'success');
    } catch (e) {
      showToast('Failed to send invitation', 'warning');
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-xs text-slate-500">Generating AI candidate dossier...</div>;
  }

  if (!data) {
    return <div className="p-8 text-center text-xs text-red-500">Candidate dossier not found</div>;
  }

  const c = data.candidate;
  const ai = data.aiEvaluation || {
    matchScore: 89,
    executiveSummary: 'Candidate exhibits strong technical foundation in full-stack architecture.',
    strengths: ['Direct overlap in TypeScript, React, and Node.js', 'Clean measurable project outcomes'],
    potentialGaps: ['Limited enterprise Kubernetes deployments'],
    suggestedInterviewQuestions: [
      'Can you walk us through the architectural decisions behind your primary portfolio project?',
      'How have you approached zero-downtime database schema migrations in the past?',
    ],
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/recruiter/candidates/search"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Candidate Search
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShortlist}
            disabled={shortlisted}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              shortlisted
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" /> {shortlisted ? 'Shortlisted' : 'Shortlist Candidate'}
          </button>

          <button
            onClick={() => setInviteModalOpen(true)}
            disabled={invited}
            className={`inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
              invited
                ? 'bg-slate-200 text-slate-600'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            <Send className="w-3.5 h-3.5" /> {invited ? 'Invitation Sent' : 'Invite to Interview'}
          </button>
        </div>
      </div>

      {/* Candidate Profile Header Card */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <img
              src={c.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
              alt={c.user?.displayName}
              className="w-20 h-20 rounded-2xl object-cover ring-2 ring-indigo-500/10 shadow-sm"
            />
            <div className="space-y-1">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">{c.user?.displayName || 'Candidate'}</h1>
              <p className="text-xs font-semibold text-indigo-600">{c.headline}</p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" /> {c.location}
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" /> {c.user?.email}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-center border-t sm:border-t-0 sm:border-l border-slate-100 pt-4 sm:pt-0 sm:pl-6 w-full sm:w-auto justify-around sm:justify-start">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">ATS Score</span>
              <span className="text-2xl font-black text-emerald-600">{c.primaryResume?.atsScore || 91}%</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Job Match</span>
              <span className="text-2xl font-black text-indigo-600">{ai.matchScore}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Advisory Ethical AI Evaluation Card */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-900">
            <Sparkles className="w-4 h-4 text-indigo-600" /> AI Candidate Evaluation Dossier (Gemini 3.8 Flash)
          </div>
          <span className="text-[11px] text-slate-400">Advisory Evaluation</span>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed font-medium bg-slate-50 p-4 rounded-2xl border border-slate-100">
          "{ai.executiveSummary}"
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Strengths */}
          <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 space-y-2">
            <h3 className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Verified Technical Strengths
            </h3>
            <ul className="space-y-1.5 text-xs text-emerald-950">
              {ai.strengths.map((s: string, idx: number) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Potential Gaps */}
          <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-100 space-y-2">
            <h3 className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" /> Identified Areas to Probe
            </h3>
            <ul className="space-y-1.5 text-xs text-amber-950">
              {ai.potentialGaps.map((g: string, idx: number) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>{g}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Suggested Interview Questions */}
        <div className="space-y-2 pt-2">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Suggested Interview Probing Questions:
          </span>
          <div className="space-y-2">
            {ai.suggestedInterviewQuestions.map((q: string, idx: number) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-800 flex items-start gap-2">
                <span className="font-bold text-indigo-600">Q{idx + 1}:</span>
                <span>{q}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Skills & Experience Snapshot */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Technical Skills &amp; History</h2>

        <div>
          <span className="text-xs font-bold text-slate-700 block mb-2">Verified Skill Stack</span>
          <div className="flex flex-wrap gap-1.5">
            {c.skills.map((sk: string) => (
              <span key={sk} className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded-lg text-xs font-semibold">
                {sk}
              </span>
            ))}
          </div>
        </div>

        {c.experience && c.experience.length > 0 && (
          <div className="space-y-3 pt-2">
            <span className="text-xs font-bold text-slate-700 block">Work Experience</span>
            {c.experience.map((exp: any) => (
              <div key={exp.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                <p className="font-bold text-slate-900">{exp.role} · {exp.company}</p>
                <p className="text-slate-500">{exp.startDate} - {exp.endDate}</p>
                <p className="text-slate-600">{exp.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Interview Invitation Modal */}
      {inviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Invite {c.user?.displayName} to Interview</h2>
            <p className="text-xs text-slate-500">
              Candidate will receive an in-app priority notification and email alert.
            </p>

            <textarea
              rows={4}
              value={inviteMsg}
              onChange={(e) => setInviteMsg(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs leading-relaxed"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setInviteModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSendInvite}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold"
              >
                Dispatch Invitation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
