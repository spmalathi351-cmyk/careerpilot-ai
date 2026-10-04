import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Briefcase, ArrowRight, Lock, Mail, AlertCircle, Sparkles } from 'lucide-react';

export const RecruiterLoginPage: React.FC = () => {
  const [email, setEmail] = useState('recruiter@careerpilot.ai');
  const [password, setPassword] = useState('recruiter123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { loginRecruiter, switchDemoRole } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await loginRecruiter(email, password);
      navigate('/recruiter/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid recruiter credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleInstantDemo = async () => {
    setLoading(true);
    await switchDemoRole('recruiter');
    navigate('/recruiter/dashboard');
  };

  return (
    <div className="max-w-md mx-auto my-8">
      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-3">
            <Briefcase className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Recruiter Portal Sign In</h1>
          <p className="text-xs text-slate-500 mt-1">Manage talent pipelines, candidate dossiers &amp; jobs</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Work Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="recruiter@company.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">Password</label>
              <button
                type="button"
                onClick={() => alert('Demo password is: recruiter123')}
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
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 mt-2"
          >
            {loading ? 'Authenticating...' : 'Sign In as Recruiter'}
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
            1-Click Demo Sign In (Sarah Lin - Recruiter)
          </button>

          <p className="text-center text-xs text-slate-500">
            Need to register your hiring team?{' '}
            <Link to="/auth/recruiter/register" className="text-indigo-600 font-bold hover:underline">
              Create Company Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
