import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { InterviewSession } from '../../types';
import { useNotifications } from '../../contexts/NotificationContext';
import {
  Sparkles,
  Video,
  Play,
  CheckCircle2,
  Calendar,
  HelpCircle,
  TrendingUp,
  ArrowRight,
  Clock,
  Award,
} from 'lucide-react';

export const InterviewPrepPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [activeTab, setActiveTab] = useState<'technical' | 'behavioral' | 'history'>('technical');

  const { showToast } = useNotifications();
  const navigate = useNavigate();

  useEffect(() => {
    api
      .getInterviewPrep()
      .then((res) => setData(res))
      .catch((err) => console.warn(err))
      .finally(() => setLoading(false));
  }, []);

  const handleStartMock = async () => {
    setStarting(true);
    try {
      const res = await api.startMockInterview({
        roleTitle: data?.targetRole || 'Full-Stack Software Engineer',
        type: 'mock',
      });
      showToast('Interview session initialized with Gemini AI', 'success');
      navigate(`/student/interview-prep/mock/${res.session.id}`);
    } catch (e: any) {
      showToast('Failed to start interview session', 'warning');
    } finally {
      setStarting(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-xs text-slate-500">Loading interview prep vault...</div>;
  }

  const technical = data?.technicalQuestions || [];
  const behavioral = data?.behavioralQuestions || [];
  const pastSessions: InterviewSession[] = data?.pastSessions || [];
  const readiness = data?.readinessScore || 85;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/30 border border-indigo-400/30 rounded-full text-indigo-200 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            Adaptive AI Interview Simulator
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">AI Interview Preparation</h1>
          <p className="text-xs sm:text-sm text-indigo-200 max-w-lg">
            Master behavioral rounds, system design challenges, and technical coding scenarios with real-time feedback.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleStartMock}
            disabled={starting}
            className="px-5 py-3 bg-white text-indigo-900 hover:bg-indigo-50 rounded-xl text-xs font-extrabold transition-all shadow-md flex items-center gap-2"
          >
            <Play className="w-4 h-4 text-indigo-600 fill-indigo-600" />
            {starting ? 'Initializing Session...' : 'Start Mock Interview (Text)'}
          </button>

          <Link
            to="/interviews/video/session-live"
            className="px-4 py-3 bg-indigo-600/80 hover:bg-indigo-600 border border-indigo-400/40 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2"
          >
            <Video className="w-4 h-4" />
            Video Interview Mode
          </Link>
        </div>
      </div>

      {/* Readiness Snapshot */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Interview Readiness Score</span>
          <p className="text-3xl font-black text-slate-900 mt-1">
            {readiness} <span className="text-sm font-semibold text-slate-400">/ 100</span>
          </p>
          <span className="text-xs text-emerald-600 font-semibold inline-block mt-1">
            Tier-1 Company Ready
          </span>
        </div>

        <div className="sm:col-span-2 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Priority Practice Areas</span>
          <div className="space-y-1.5 text-xs text-slate-700">
            {(data?.suggestedPrepAreas || []).map((area: string, idx: number) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                <span>{area}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs: Technical, Behavioral, Past Sessions */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <button
            onClick={() => setActiveTab('technical')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'technical' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Technical Questions ({technical.length})
          </button>
          <button
            onClick={() => setActiveTab('behavioral')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'behavioral' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Behavioral Scenarios ({behavioral.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'history' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Past Sessions ({pastSessions.length})
          </button>
        </div>

        {/* Tab 1: Technical Questions */}
        {activeTab === 'technical' && (
          <div className="space-y-4">
            {technical.map((q: any, i: number) => (
              <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-xs font-bold text-slate-900 leading-relaxed">
                    Q{i + 1}: {q.question}
                  </p>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded border border-indigo-100 flex-shrink-0">
                    {q.category}
                  </span>
                </div>
                {q.hint && (
                  <p className="text-xs text-slate-500 bg-white p-2.5 rounded-xl border border-slate-200/80">
                    💡 <span className="font-semibold text-slate-700">What interviewers evaluate:</span> {q.hint}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Behavioral Questions */}
        {activeTab === 'behavioral' && (
          <div className="space-y-4">
            {behavioral.map((q: any, i: number) => (
              <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-xs font-bold text-slate-900 leading-relaxed">
                    Q{i + 1}: {q.question}
                  </p>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-violet-50 text-violet-700 rounded border border-violet-100 flex-shrink-0">
                    Behavioral
                  </span>
                </div>
                {q.hint && (
                  <p className="text-xs text-slate-500 bg-white p-2.5 rounded-xl border border-slate-200/80">
                    🎯 <span className="font-semibold text-slate-700">STAR Strategy Tip:</span> {q.hint}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Past Sessions */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            {pastSessions.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">No past mock sessions recorded yet.</p>
            ) : (
              pastSessions.map((session) => (
                <div
                  key={session.id}
                  onClick={() => navigate(`/student/interview-prep/mock/${session.id}`)}
                  className="p-5 bg-slate-50 hover:bg-indigo-50/50 rounded-2xl border border-slate-200/80 cursor-pointer transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-slate-900">{session.jobTitle}</p>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase bg-slate-200 text-slate-700">
                        {session.type}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      {new Date(session.createdAt).toLocaleDateString()} · {session.turns.length} Question Turns
                    </p>
                    <p className="text-xs text-slate-700 italic mt-1 line-clamp-1">
                      "{session.summary?.overallVerdict}"
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Score</span>
                      <span className="text-xl font-black text-indigo-600">{session.score}/100</span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-400" />
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
