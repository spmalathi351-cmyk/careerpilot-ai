import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { UserCheck, Sparkles, Shield, ArrowRightLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DemoRoleBar: React.FC = () => {
  const { user, role, switchDemoRole, loading } = useAuth();
  const navigate = useNavigate();

  const handleRoleSwitch = async (newRole: 'student' | 'recruiter' | 'admin') => {
    await switchDemoRole(newRole);
    if (newRole === 'student') navigate('/student/dashboard');
    else if (newRole === 'recruiter') navigate('/recruiter/dashboard');
    else if (newRole === 'admin') navigate('/admin/dashboard');
  };

  return (
    <div
      id="demo-role-bar"
      className="no-print bg-slate-900 text-slate-200 text-xs px-4 py-2 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 shadow-inner z-50"
    >
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1.5 font-semibold text-indigo-300">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          CareerPilot AI Active Persona:
        </span>
        <span className="font-medium text-white bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700">
          {user?.displayName || 'Guest'} ({role ? role.toUpperCase() : 'GUEST'})
        </span>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-slate-400 hidden sm:inline flex items-center gap-1">
          <ArrowRightLeft className="w-3 h-3" /> Quick Demo Switch:
        </span>

        <button
          onClick={() => handleRoleSwitch('student')}
          disabled={loading || role === 'student'}
          className={`px-2.5 py-1 rounded-md font-medium transition-all ${
            role === 'student'
              ? 'bg-indigo-600 text-white font-bold cursor-default'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
          }`}
        >
          🎓 Student (Alex)
        </button>

        <button
          onClick={() => handleRoleSwitch('recruiter')}
          disabled={loading || role === 'recruiter'}
          className={`px-2.5 py-1 rounded-md font-medium transition-all ${
            role === 'recruiter'
              ? 'bg-indigo-600 text-white font-bold cursor-default'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
          }`}
        >
          💼 Recruiter (Sarah)
        </button>

        <button
          onClick={() => handleRoleSwitch('admin')}
          disabled={loading || role === 'admin'}
          className={`px-2.5 py-1 rounded-md font-medium transition-all flex items-center gap-1 ${
            role === 'admin'
              ? 'bg-indigo-600 text-white font-bold cursor-default'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
          }`}
        >
          <Shield className="w-3 h-3" /> Admin
        </button>
      </div>
    </div>
  );
};
