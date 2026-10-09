import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { InterviewSession, InterviewQuestionBankItem } from '../../types';
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
  BookOpen,
  Search,
  Filter,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  FileText,
  Send,
  RefreshCw,
  Check,
  Brain,
  SlidersHorizontal,
} from 'lucide-react';

export const InterviewPrepPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [activeTab, setActiveTab] = useState<'bank' | 'technical' | 'behavioral' | 'history'>('bank');

  // Question Bank State
  const [bankQuestions, setBankQuestions] = useState<any[]>([]);
  const [bankLoading, setBankLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSkill, setSelectedSkill] = useState<string>('All');
  const [selectedRole, setSelectedRole] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [personalizeByResume, setPersonalizeByResume] = useState<boolean>(true);

  // Individual practice state
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);
  const [showSampleAnswerMap, setShowSampleAnswerMap] = useState<Record<string, boolean>>({});
  const [showHintMap, setShowHintMap] = useState<Record<string, boolean>>({});
  const [practiceAnswerMap, setPracticeAnswerMap] = useState<Record<string, string>>({});
  const [evaluatingMap, setEvaluatingMap] = useState<Record<string, boolean>>({});
  const [evaluationResultMap, setEvaluationResultMap] = useState<Record<string, any>>({});

  const { showToast } = useNotifications();
  const navigate = useNavigate();

  useEffect(() => {
    api
      .getInterviewPrep()
      .then((res) => setData(res))
      .catch((err) => console.warn(err))
      .finally(() => setLoading(false));
  }, []);

  const fetchQuestionBank = () => {
    setBankLoading(true);
    api
      .getQuestionBank({
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
        skillOrTech: selectedSkill !== 'All' ? selectedSkill : undefined,
        role: selectedRole !== 'All' ? selectedRole : undefined,
        difficulty: selectedDifficulty !== 'All' ? selectedDifficulty : undefined,
        search: searchQuery.trim() ? searchQuery : undefined,
        personalized: personalizeByResume,
      })
      .then((res) => setBankQuestions(res.questions || []))
      .catch((err) => console.warn(err))
      .finally(() => setBankLoading(false));
  };

  useEffect(() => {
    fetchQuestionBank();
  }, [selectedCategory, selectedSkill, selectedRole, selectedDifficulty, personalizeByResume]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchQuestionBank();
  };

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

  const handlePracticeSubmit = async (q: any) => {
    const studentAnswer = practiceAnswerMap[q.id];
    if (!studentAnswer || studentAnswer.trim().length === 0) {
      showToast('Please type your response before requesting evaluation.', 'warning');
      return;
    }

    setEvaluatingMap((prev) => ({ ...prev, [q.id]: true }));
    try {
      const res = await api.practiceQuestionBank({
        questionId: q.id,
        questionText: q.question,
        studentAnswer,
        role: data?.targetRole || 'Software Engineer',
      });
      setEvaluationResultMap((prev) => ({ ...prev, [q.id]: res.evaluation }));
      showToast('Answer evaluated by Gemini AI with feedback!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Evaluation error', 'warning');
    } finally {
      setEvaluatingMap((prev) => ({ ...prev, [q.id]: false }));
    }
  };

  const toggleSampleAnswer = (qId: string) => {
    setShowSampleAnswerMap((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  const toggleHint = (qId: string) => {
    setShowHintMap((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  if (loading) {
    return <div className="p-8 text-center text-xs text-slate-500">Loading interview prep vault...</div>;
  }

  const hasResume = data?.hasResume !== false;
  const technical = data?.technicalQuestions || [];
  const behavioral = data?.behavioralQuestions || [];
  const pastSessions: InterviewSession[] = data?.pastSessions || [];
  const readiness = hasResume && typeof data?.readinessScore === 'number' && data.readinessScore > 0 ? data.readinessScore : null;

  const difficultyBadgeColor = (diff: string) => {
    switch (diff) {
      case 'Beginner':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Intermediate':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Advanced':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/30 border border-indigo-400/30 rounded-full text-indigo-200 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            Adaptive AI Interview Simulator &amp; Structured Question Bank
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">AI Interview Preparation</h1>
          <p className="text-xs sm:text-sm text-indigo-200 max-w-xl">
            Master technical topics, behavioral scenarios, and project defense rounds with reusable question bank benchmarks and real-time AI feedback.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleStartMock}
            disabled={starting}
            className="px-5 py-3 bg-white text-indigo-900 hover:bg-indigo-50 rounded-xl text-xs font-extrabold transition-all shadow-md flex items-center gap-2"
          >
            <Play className="w-4 h-4 text-indigo-600 fill-indigo-600" />
            {starting ? 'Initializing Session...' : 'Start Full Mock Interview'}
          </button>

          <Link
            to="/interviews/video/session-live"
            className="px-4 py-3 bg-indigo-600/80 hover:bg-indigo-600 border border-indigo-400/40 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2"
          >
            <Video className="w-4 h-4" />
            Video Mode
          </Link>
        </div>
      </div>

      {/* Readiness Snapshot */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Interview Readiness Score</span>
          <p className="text-3xl font-black text-slate-900 mt-1">
            {readiness !== null ? (
              <>
                {readiness} <span className="text-sm font-semibold text-slate-400">/ 100</span>
              </>
            ) : (
              <span className="text-base font-bold text-slate-500">Not Calibrated</span>
            )}
          </p>
          {readiness !== null ? (
            <span className="text-xs text-emerald-600 font-semibold inline-block mt-1">
              {readiness >= 85 ? 'Tier-1 Company Ready' : 'Competitive Candidate'}
            </span>
          ) : (
            <Link to="/student/resumes/upload" className="text-xs text-indigo-600 font-semibold inline-block mt-1 hover:underline">
              Upload resume to calibrate readiness
            </Link>
          )}
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

      {/* Main Tabs Container */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab('bank')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'bank' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Structured Question Bank ({bankQuestions.length})
          </button>
          <button
            onClick={() => setActiveTab('technical')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
              activeTab === 'technical' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Role Screening Simulation ({technical.length})
          </button>
          <button
            onClick={() => setActiveTab('behavioral')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
              activeTab === 'behavioral' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Behavioral Scenarios ({behavioral.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
              activeTab === 'history' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Past Sessions ({pastSessions.length})
          </button>
        </div>

        {/* Tab 0: Structured AI Interview Question Bank */}
        {activeTab === 'bank' && (
          <div className="space-y-6">
            {/* Filter & Search Bar */}
            <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-4">
              <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3 items-center">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="Search question keywords, topic, or model answers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors shadow-2xs"
                >
                  Search Bank
                </button>
              </form>

              {/* Multi-Filter Selectors */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl font-medium text-slate-700"
                  >
                    <option value="All">All Categories</option>
                    <option value="Technical">Technical</option>
                    <option value="HR">HR</option>
                    <option value="Behavioral">Behavioral</option>
                    <option value="Project-Based">Project-Based</option>
                    <option value="Scenario-Based">Scenario-Based</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Skill / Technology</label>
                  <select
                    value={selectedSkill}
                    onChange={(e) => setSelectedSkill(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl font-medium text-slate-700"
                  >
                    <option value="All">All Technologies</option>
                    <option value="Python">Python</option>
                    <option value="SQL">SQL</option>
                    <option value="Data Structures">Data Structures</option>
                    <option value="Machine Learning">Machine Learning</option>
                    <option value="Deep Learning">Deep Learning</option>
                    <option value="NLP">NLP</option>
                    <option value="Generative AI">Generative AI</option>
                    <option value="TypeScript">TypeScript</option>
                    <option value="System Design">System Design</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Target Role</label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl font-medium text-slate-700"
                  >
                    <option value="All">All Job Roles</option>
                    <option value="Full-Stack Software Engineer">Full-Stack Engineer</option>
                    <option value="Data Analyst">Data Analyst</option>
                    <option value="Data Scientist">Data Scientist</option>
                    <option value="ML Engineer">ML Engineer</option>
                    <option value="AI Engineer">AI Engineer</option>
                    <option value="GenAI Engineer">GenAI Engineer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Difficulty</label>
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl font-medium text-slate-700"
                  >
                    <option value="All">All Difficulties</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              {/* Personalize by Resume Toggle */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={personalizeByResume}
                    onChange={(e) => setPersonalizeByResume(e.target.checked)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                  />
                  <span>Personalize &amp; Prioritize with My Stored Resume Skills</span>
                </label>

                <span className="text-[11px] text-slate-400">
                  Showing {bankQuestions.length} curated questions
                </span>
              </div>
            </div>

            {/* Questions List */}
            {bankLoading ? (
              <div className="py-12 text-center text-xs text-slate-400">Filtering Question Bank...</div>
            ) : bankQuestions.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-500 bg-slate-50 rounded-2xl border border-slate-200/80">
                No questions match your current filter parameters. Try resetting your search filters.
              </div>
            ) : (
              <div className="space-y-4">
                {bankQuestions.map((q: any, idx: number) => {
                  const isExpanded = expandedQuestionId === q.id;
                  const showSample = !!showSampleAnswerMap[q.id];
                  const showHint = !!showHintMap[q.id];
                  const isEvaluating = !!evaluatingMap[q.id];
                  const evaluation = evaluationResultMap[q.id];

                  return (
                    <div
                      key={q.id}
                      className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-4 hover:border-slate-300 transition-all"
                    >
                      {/* Top Badges */}
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {q.isPredefined ? (
                            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md border border-slate-200">
                              Predefined Question Bank
                            </span>
                          ) : (
                            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md border border-indigo-200">
                              AI Generated
                            </span>
                          )}

                          <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md border border-indigo-100">
                            {q.category}
                          </span>

                          <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md border border-slate-200">
                            {q.skillOrTech}
                          </span>

                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${difficultyBadgeColor(q.difficulty)}`}>
                            {q.difficulty}
                          </span>

                          {q.isResumeSkillMatch && (
                            <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded-md border border-emerald-200 flex items-center gap-1">
                              <Check className="w-3 h-3 text-emerald-600" /> Resume Match
                            </span>
                          )}
                        </div>

                        <span className="text-[11px] text-slate-400 font-mono">Q#{idx + 1}</span>
                      </div>

                      {/* Question Text */}
                      <p className="text-sm font-bold text-slate-900 leading-relaxed">{q.question}</p>

                      {/* Supported Job Roles Tags */}
                      {q.jobRoles && q.jobRoles.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1 text-[11px] text-slate-500">
                          <span className="font-semibold text-slate-400">Target Roles:</span>
                          {q.jobRoles.map((r: string) => (
                            <span key={r} className="px-1.5 py-0.5 bg-slate-50 text-slate-600 rounded border border-slate-200 text-[10px]">
                              {r}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Action Bar */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                        <div className="flex items-center gap-2">
                          {q.hint && (
                            <button
                              type="button"
                              onClick={() => toggleHint(q.id)}
                              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
                            >
                              <Lightbulb className="w-3.5 h-3.5" />
                              {showHint ? 'Hide Hint' : 'View Interviewer Hint'}
                            </button>
                          )}

                          {q.sampleAnswer && (
                            <button
                              type="button"
                              onClick={() => toggleSampleAnswer(q.id)}
                              className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 transition-colors ml-2"
                            >
                              <BookOpen className="w-3.5 h-3.5" />
                              {showSample ? 'Hide Model Answer' : 'View Model Answer'}
                            </button>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                          className="px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                        >
                          {isExpanded ? 'Close Practice Mode' : 'Practice This Question'}
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      {/* Collapsible Interviewer Hint */}
                      {showHint && q.hint && (
                        <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs text-amber-900 space-y-1">
                          <div className="flex items-center gap-1.5 font-bold text-amber-900">
                            <Lightbulb className="w-3.5 h-3.5 text-amber-600" /> What Interviewers Evaluate:
                          </div>
                          <p className="leading-relaxed">{q.hint}</p>
                        </div>
                      )}

                      {/* Collapsible Sample Model Answer & Explanation */}
                      {showSample && q.sampleAnswer && (
                        <div className="p-4 bg-indigo-50/40 border border-indigo-100 rounded-2xl text-xs space-y-3">
                          <div>
                            <span className="font-bold text-indigo-950 uppercase tracking-wider text-[10px] block mb-1">
                              Exemplary Model Answer:
                            </span>
                            <p className="text-slate-800 leading-relaxed italic bg-white p-3 rounded-xl border border-indigo-100/80">
                              "{q.sampleAnswer}"
                            </p>
                          </div>

                          {q.explanation && (
                            <div>
                              <span className="font-bold text-indigo-950 uppercase tracking-wider text-[10px] block mb-1">
                                Technical Concept Deep-Dive:
                              </span>
                              <p className="text-slate-700 leading-relaxed">{q.explanation}</p>
                            </div>
                          )}

                          {q.keyEvaluationCriteria && q.keyEvaluationCriteria.length > 0 && (
                            <div>
                              <span className="font-bold text-indigo-950 uppercase tracking-wider text-[10px] block mb-1">
                                Key Grading Benchmarks:
                              </span>
                              <ul className="list-disc list-inside space-y-1 text-slate-700">
                                {q.keyEvaluationCriteria.map((c: string, cIdx: number) => (
                                  <li key={cIdx}>{c}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Practice One by One Mode Panel */}
                      {isExpanded && (
                        <div className="mt-4 p-4 bg-slate-50 border border-indigo-200/80 rounded-2xl space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                              <Brain className="w-4 h-4 text-indigo-600" /> Practice Your Response:
                            </span>
                            <span className="text-[11px] text-slate-400">Evaluated with Gemini AI</span>
                          </div>

                          <textarea
                            rows={4}
                            placeholder="Type your structured answer here (STAR format or technical architecture)..."
                            value={practiceAnswerMap[q.id] || ''}
                            onChange={(e) =>
                              setPracticeAnswerMap((prev) => ({ ...prev, [q.id]: e.target.value }))
                            }
                            className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                          />

                          <div className="flex items-center justify-end gap-3">
                            <button
                              type="button"
                              onClick={() => handlePracticeSubmit(q)}
                              disabled={isEvaluating}
                              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
                            >
                              {isEvaluating ? (
                                <>
                                  <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Evaluating...
                                </>
                              ) : (
                                <>
                                  <Send className="w-3.5 h-3.5" /> Submit for AI Feedback
                                </>
                              )}
                            </button>
                          </div>

                          {/* Instant AI Evaluation Result */}
                          {evaluation && (
                            <div className="p-4 bg-white border border-indigo-200 rounded-2xl space-y-3 shadow-2xs mt-3">
                              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                <span className="text-xs font-bold text-slate-900">AI Evaluation Report</span>
                                <div className="text-right">
                                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Score</span>
                                  <span className="text-base font-black text-indigo-600">{evaluation.score}/100</span>
                                </div>
                              </div>

                              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                                {evaluation.comments}
                              </p>

                              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                                <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                                  <span className="text-[10px] text-slate-400 block">Clarity</span>
                                  <span className="font-bold text-slate-800">{evaluation.clarity}/100</span>
                                </div>
                                <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                                  <span className="text-[10px] text-slate-400 block">Relevance</span>
                                  <span className="font-bold text-slate-800">{evaluation.relevance}/100</span>
                                </div>
                                <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                                  <span className="text-[10px] text-slate-400 block">Tech Depth</span>
                                  <span className="font-bold text-slate-800">{evaluation.technicalDepth}/100</span>
                                </div>
                              </div>

                              {evaluation.strengths && evaluation.strengths.length > 0 && (
                                <div className="space-y-1">
                                  <span className="text-[11px] font-bold text-emerald-700">Key Strengths:</span>
                                  <ul className="list-disc list-inside text-xs text-slate-600">
                                    {evaluation.strengths.map((s: string, sIdx: number) => (
                                      <li key={sIdx}>{s}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {evaluation.improvementAreas && evaluation.improvementAreas.length > 0 && (
                                <div className="space-y-1">
                                  <span className="text-[11px] font-bold text-amber-700">Growth Areas:</span>
                                  <ul className="list-disc list-inside text-xs text-slate-600">
                                    {evaluation.improvementAreas.map((a: string, aIdx: number) => (
                                      <li key={aIdx}>{a}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 1: Technical Questions */}
        {activeTab === 'technical' && (
          <div className="space-y-4">
            <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-xs text-indigo-900 flex items-center justify-between">
              <span>Dynamically tailored questions for {data?.targetRole || 'Software Engineer'}.</span>
              <span className="font-bold text-[11px] uppercase tracking-wider">Gemini Powered</span>
            </div>

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
