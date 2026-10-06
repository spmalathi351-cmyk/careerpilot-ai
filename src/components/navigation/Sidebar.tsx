import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { BrandLogo } from '../common/BrandLogo';
import {
  LayoutDashboard,
  User,
  FileText,
  Target,
  Sparkles,
  Briefcase,
  Compass,
  Video,
  Bell,
  Users,
  PlusCircle,
  Table,
  Activity,
  Shield,
  Layers,
  FileSpreadsheet,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { role, user } = useAuth();

  const studentLinks = [
    { to: '/student/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/student/profile', icon: User, label: 'My Profile' },
    { to: '/student/resumes', icon: FileText, label: 'Resume Management' },
    { to: '/student/resume-analysis', icon: Sparkles, label: 'AI Analysis Pipeline' },
    { to: '/student/ats-simulator', icon: Target, label: 'ATS Simulator' },
    { to: '/student/career-guidance', icon: Compass, label: 'Career Guidance' },
    { to: '/student/career-guidance/roadmap', icon: Layers, label: '30-60-90 Roadmap' },
    { to: '/student/applications', icon: Briefcase, label: 'Job Applications' },
    { to: '/student/interview-prep', icon: Sparkles, label: 'AI Interview Prep' },
    { to: '/interviews/video/demo', icon: Video, label: 'Video Interview Simulator' },
    { to: '/notifications', icon: Bell, label: 'Notifications' },
  ];

  const recruiterLinks = [
    { to: '/recruiter/dashboard', icon: LayoutDashboard, label: 'Dashboard & Pipeline' },
    { to: '/recruiter/overview', icon: Activity, label: 'Recruitment Overview' },
    { to: '/recruiter/jobs/create', icon: PlusCircle, label: 'Create & Post Job' },
    { to: '/recruiter/candidates/search', icon: Users, label: 'Candidate Search' },
    { to: '/recruiter/candidates/table', icon: Table, label: 'Candidate Roster' },
    { to: '/recruiter/profile', icon: Briefcase, label: 'Company Profile' },
    { to: '/notifications', icon: Bell, label: 'Notifications' },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', icon: Shield, label: 'Platform Telemetry' },
    { to: '/notifications', icon: Bell, label: 'System Alerts' },
  ];

  const links = role === 'recruiter' ? recruiterLinks : role === 'admin' ? adminLinks : studentLinks;

  const content = (
    <div className="h-full flex flex-col justify-between py-6 px-4 bg-slate-900 text-slate-300">
      <div>
        {/* Brand Logo at the top of the sidebar */}
        <div className="px-2 mb-5 pb-4 border-b border-slate-800/80">
          <BrandLogo variant="sidebar" />
        </div>

        <div className="px-3 mb-6">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            {role === 'recruiter' ? 'Recruiter Portal' : role === 'admin' ? 'Admin Portal' : 'Student Portal'}
          </p>
          <div className="mt-2 flex items-center gap-2.5 bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
              alt={user?.displayName || 'User'}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500/40"
            />
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">{user?.displayName || 'User'}</p>
              <p className="text-[10px] text-slate-400 truncate">{user?.email || 'Logged in'}</p>
            </div>
          </div>
        </div>

        <nav className="space-y-1">
          {links.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`
                }
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="px-3 pt-4 border-t border-slate-800 text-[11px] text-slate-500">
        <p className="font-semibold text-slate-400">CareerPilot AI Platform</p>
        <p className="mt-0.5">Gemini 3.8 Flash Engine · v2.4</p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="no-print hidden lg:block w-64 flex-shrink-0 border-r border-slate-800 min-h-[calc(100vh-6rem)]">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={onClose} />
          <div className="relative w-72 max-w-[80vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
