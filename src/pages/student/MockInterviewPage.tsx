import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { InterviewSession, InterviewTurn } from '../../types';
import { useNotifications } from '../../contexts/NotificationContext';
import {
  Sparkles,
  ArrowLeft,
  Send,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  RefreshCw,
  Trophy,
  ArrowRight,
} from 'lucide-react';

export const MockInterviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [studentAnswer, setStudentAnswer] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);

  const { showToast } = useNotifications();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      api
        .getInterviewSession(id)
        .then((res) => {
          setSession(res.session);
          // If already completed or has turns, initialize questions
          if (res.session.turns.length > 0) {
            setCurrentQuestionIndex(res.session.turns.length);
          }
        })
        .catch(() => {
          // If not found, fetch prep questions
          api.getInterviewPrep().then((prep) => {
            setQuestions([...prep.technicalQuestions, ...prep.behavioralQuestions]);
          });
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const defaultQuestions = [
    {
      question:
        'Walk through how you design a scalable RESTful API with idempotency and rate limiting for mission-critical client operations.',
      category: 'technical',
    },
    {
      question:
        'Tell me about a high-pressure situation where a production bug or unexpected requirement threatened a project deadline. How did you handle it?',
      category: 'behavioral',
    },
    {
      question:
        'How do you identify and mitigate data leakage between training and validation splits in machine learning pipelines?',
      category: 'technical',
    },
  ];

  const activeQuestions = questions.length > 0 ? questions : defaultQuestions;
  const currentQ = activeQuestions[currentQuestionIndex] || activeQuestions[0];
  const isCompleted = session?.status === 'completed' || currentQuestionIndex >= activeQuestions.length;

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentAnswer.trim() || !id) return;

    setEvaluating(true);
    try {
      const res = await api.submitInterviewAnswer(id, {
        questionNumber: currentQuestionIndex + 1,
        question: currentQ.question,
        category: currentQ.category,
        studentAnswer,
        role: session?.jobTitle || 'Software Engineer',
      });

      setSession(res.session);
      setStudentAnswer('');
      showToast('Answer evaluated by Gemini AI', 'success');

      if (currentQuestionIndex + 1 >= activeQuestions.length) {
        // Complete session
        const completedRes = await api.completeInterviewSession(id);
        setSession(completedRes.session);
      } else {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }
    } catch (err: any) {
      showToast('Failed to evaluate answer', 'warning');
    } finally {
      setEvaluating(false);
    }
  };

  const handleFinishEarly = async () => {
    if (!id) return;
    try {
      const res = await api.completeInterviewSession(id);
      setSession(res.session);
      showToast('Interview session concluded', 'info');
    } catch (e) {
      showToast('Could not complete session', 'warning');
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-xs text-slate-500">Connecting to AI Interview Engine...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Link
          to="/student/interview-prep"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Prep Vault
        </Link>

        {!isCompleted && (
          <button
            onClick={handleFinishEarly}
            className="text-xs text-slate-500 hover:text-indigo-600 font-semibold"
          >
            Finish Interview Early
          </button>
        )}
      </div>

      {/* Main View: In Progress or Completed Report */}
      {!isCompleted ? (
        <div className="space-y-6">
          {/* Question Prompt Card */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold rounded-xl uppercase">
                Question {currentQuestionIndex + 1} of {activeQuestions.length} ({currentQ.category})
              </span>
              <span className="text-xs font-bold text-slate-400">Target: {session?.jobTitle || 'Software Engineer'}</span>
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">{currentQ.question}</h2>

            <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100">
              💡 <span className="font-semibold text-slate-700">Interview Tip:</span> Structure your answer clearly.
              State your architectural thesis, trade-offs, and concrete metrics.
            </p>
          </div>

          {/* Answer Form */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
            <form onSubmit={handleSubmitAnswer} className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">Your Response</label>
                <span className="text-[11px] text-slate-400">
                  {studentAnswer.trim().split(/\s+/).filter(Boolean).length} words
                </span>
              </div>

              <textarea
                rows={6}
                required
                value={studentAnswer}
                onChange={(e) => setStudentAnswer(e.target.value)}
                placeholder="Type your structured answer here. Speak to the technical trade-offs, technologies, and measurable outcomes..."
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs leading-relaxed focus:bg-white"
              />

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() =>
                    setStudentAnswer(
                      'When designing a high-throughput REST API with idempotency, I enforce unique client-generated Idempotency-Keys cached in Redis for 24 hours. For rate limiting, I utilize a sliding window counter with Token Bucket semantics, responding with standard 429 Too Many Requests headers.'
                    )
                  }
                  className="text-xs text-indigo-600 hover:underline font-semibold"
                >
                  Fill Sample Answer
                </button>

                <button
                  type="submit"
                  disabled={evaluating || !studentAnswer.trim()}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2"
                >
                  {evaluating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Evaluating with Gemini...
                    </>
                  ) : (
                    <>
                      Submit Answer <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Past Turns in this session */}
          {session?.turns && session.turns.length > 0 && (
            <div className="space-y-4 pt-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Previous Turns Feedback</h3>
              {session.turns.map((turn) => (
                <div key={turn.id} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
                  <div className="flex items-start justify-between">
                    <p className="text-xs font-bold text-slate-900">{turn.question}</p>
                    <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 font-extrabold text-xs rounded-lg border border-indigo-100">
                      {turn.score}/100
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 italic bg-slate-50 p-2.5 rounded-xl">"{turn.studentAnswer}"</p>
                  <p className="text-xs text-slate-700">
                    <span className="font-semibold text-slate-900">AI Feedback: </span>
                    {turn.feedback.comments}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Final Interview Evaluation Report */
        <div className="space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 shadow-xs text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto border border-indigo-100">
              <Trophy className="w-8 h-8" />
            </div>

            <h1 className="text-2xl font-extrabold text-slate-900">Interview Session Completed</h1>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Evaluation synthesis compiled from Gemini 3.8 Flash analysis across clarity, relevance, and technical depth.
            </p>

            <div className="inline-block p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-xs uppercase font-bold text-slate-400 block">Overall Session Score</span>
              <span className="text-4xl font-black text-indigo-600 mt-1 block">
                {session?.score || 87} <span className="text-sm font-semibold text-slate-400">/ 100</span>
              </span>
              <span className="text-xs font-semibold text-emerald-600 mt-1 block">
                {session?.summary?.readinessRating || 'High Readiness'}
              </span>
            </div>
          </div>

          {/* Strengths & Growth Areas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Observed Candidate Strengths
              </h3>
              <ul className="space-y-2 text-xs text-slate-700">
                {(session?.summary?.strengths || ['Clear communication and structure', 'Solid grasp of API concepts']).map(
                  (s, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0 mt-1.5" />
                      <span>{s}</span>
                    </li>
                  )
                )}
              </ul>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-600" /> Strategic Areas for Growth
              </h3>
              <ul className="space-y-2 text-xs text-slate-700">
                {(session?.summary?.areasForGrowth || [
                  'Elaborate more on caching invalidation protocols',
                  'Incorporate metrics into system design trade-offs',
                ]).map((g, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0 mt-1.5" />
                    <span>{g}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="text-center pt-2">
            <Link
              to="/student/interview-prep"
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm"
            >
              Return to Interview Prep Vault <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
