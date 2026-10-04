import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { GraduationCap, ArrowRight, Lock, Mail, AlertCircle, Sparkles } from 'lucide-react';

export const StudentLoginPage: React.FC = () => {
  const [email, setEmail] = useState('student@careerpilot.ai');
  const [password, setPassword] = useState('student123');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const { loginStudent, switchDemoRole } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setLoading(true);

    try {
      await loginStudent(email, password);
      navigate('/student/dashboard');
    } catch (err: any) {
      setLocalError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleInstantDemo = async () => {
    setLoading(true);
    await switchDemoRole('student');
    navigate('/student/dashboard');
  };

  return (
    <div className="max-w-md mx-auto my-8">
      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-3">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Student Portal Sign In</h1>
          <p className="text-xs text-slate-500 mt-1">Access your AI resume analysis, ATS simulator &amp; roadmaps</p>
        </div>

        {localError && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{localError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@university.edu"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">Password</label>
              <button
                type="button"
                onClick={() => alert('Demo password is: student123')}
                className="text-[11px] text-indigo-600 hover:underline"
              >
                Forgot?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 mt-2"
          >
            {loading ? 'Signing In...' : 'Sign In as Student'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-100 space-y-3">
          <button
            type="button"
            onClick={handleInstantDemo}
            className="w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            1-Click Demo Sign In (Alex Johnson)
          </button>

          <p className="text-center text-xs text-slate-500">
            Don't have an account?{' '}
            <Link to="/auth/student/register" className="text-indigo-600 font-bold hover:underline">
              Register here
            </Link>
          </p>

          <p className="text-center text-[11px] text-slate-400">
            Are you a recruiter?{' '}
            <Link to="/auth/recruiter/login" className="text-slate-600 font-semibold hover:underline">
              Switch to Recruiter Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
