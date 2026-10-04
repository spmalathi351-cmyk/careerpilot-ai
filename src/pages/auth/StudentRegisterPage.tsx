import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { GraduationCap, ArrowRight, Lock, Mail, User, School, AlertCircle } from 'lucide-react';

export const StudentRegisterPage: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [college, setCollege] = useState('');
  const [degree, setDegree] = useState('Bachelor of Science');
  const [department, setDepartment] = useState('Computer Science');
  const [graduationYear, setGraduationYear] = useState('2026');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { registerStudent } = useAuth();
  const navigate = useNavigate();

  // Password strength check
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { label: 'Empty', color: 'bg-slate-200', score: 0 };
    if (pass.length < 6) return { label: 'Weak', color: 'bg-red-500', score: 33 };
    if (pass.length < 10) return { label: 'Moderate', color: 'bg-amber-500', score: 66 };
    return { label: 'Strong', color: 'bg-emerald-500', score: 100 };
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await registerStudent({
        fullName,
        email,
        password,
        phone,
        college,
        degree,
        department,
        graduationYear,
      });
      navigate('/student/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to create student account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto my-8">
      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-3">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Create Candidate Account</h1>
          <p className="text-xs text-slate-500 mt-1">Join CareerPilot AI for personalized guidance and job matching</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Jordan Lee"
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jordan.lee@university.edu"
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
              </div>
              {password && (
                <div className="mt-1 flex items-center justify-between text-[10px] text-slate-500">
                  <span>Strength: {strength.label}</span>
                  <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${strength.color}`} style={{ width: `${strength.score}%` }} />
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">College / University *</label>
            <div className="relative">
              <School className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                placeholder="e.g. State University of Technology"
                className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Degree</label>
              <input
                type="text"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Graduation Year</label>
              <input
                type="text"
                value={graduationYear}
                onChange={(e) => setGraduationYear(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 mt-4"
          >
            {loading ? 'Creating Account...' : 'Complete Registration & Continue'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-100 text-center text-xs text-slate-500">
          Already registered?{' '}
          <Link to="/auth/student/login" className="text-indigo-600 font-bold hover:underline">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
};
