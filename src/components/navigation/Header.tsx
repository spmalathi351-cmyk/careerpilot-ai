import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import {
  Compass,
  Bell,
  Menu,
  X,
  LogOut,
  User,
  Briefcase,
  Shield,
  CheckCheck,
  ChevronDown,
} from 'lucide-react';

interface HeaderProps {
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { user, role, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="no-print sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand + Hamburger */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-tight tracking-tight text-slate-900 flex items-center gap-1.5">
                CareerPilot <span className="text-indigo-600 font-extrabold text-sm uppercase px-1.5 py-0.2 bg-indigo-50 rounded border border-indigo-100">AI</span>
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Contextual Quick Links */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-600">
          {role === 'student' && (
            <>
              <Link to="/student/dashboard" className="px-3 py-2 rounded-lg hover:text-indigo-600 hover:bg-slate-50 transition-colors">
                Dashboard
              </Link>
              <Link to="/student/resumes" className="px-3 py-2 rounded-lg hover:text-indigo-600 hover:bg-slate-50 transition-colors">
                Resumes &amp; ATS
              </Link>
              <Link to="/student/career-guidance" className="px-3 py-2 rounded-lg hover:text-indigo-600 hover:bg-slate-50 transition-colors">
                Career Guidance
              </Link>
              <Link to="/student/interview-prep" className="px-3 py-2 rounded-lg hover:text-indigo-600 hover:bg-slate-50 transition-colors">
                Mock Interview
              </Link>
              <Link to="/student/applications" className="px-3 py-2 rounded-lg hover:text-indigo-600 hover:bg-slate-50 transition-colors">
                Applications
              </Link>
            </>
          )}
          {role === 'recruiter' && (
            <>
              <Link to="/recruiter/dashboard" className="px-3 py-2 rounded-lg hover:text-indigo-600 hover:bg-slate-50 transition-colors">
                Dashboard
              </Link>
              <Link to="/recruiter/candidates/search" className="px-3 py-2 rounded-lg hover:text-indigo-600 hover:bg-slate-50 transition-colors">
                Find Candidates
              </Link>
              <Link to="/recruiter/jobs/create" className="px-3 py-2 rounded-lg hover:text-indigo-600 hover:bg-slate-50 transition-colors">
                Post Job
              </Link>
              <Link to="/recruiter/overview" className="px-3 py-2 rounded-lg hover:text-indigo-600 hover:bg-slate-50 transition-colors">
                Overview
              </Link>
            </>
          )}
          {role === 'admin' && (
            <>
              <Link to="/admin/dashboard" className="px-3 py-2 rounded-lg hover:text-indigo-600 hover:bg-slate-50 transition-colors">
                Admin Console
              </Link>
            </>
          )}
        </nav>

        {/* Right: Notifications & User profile */}
        <div className="flex items-center gap-3">
          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowUserMenu(false);
              }}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl relative transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Dropdown Card */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-xl py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="bg-indigo-50 text-indigo-700 text-xs px-2 py-0.5 rounded-full font-semibold">
                        {unreadCount} unread
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={() => markAllAsRead()}
                      className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
                    >
                      <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-400">
                      No notifications at this time
                    </div>
                  ) : (
                    notifications.slice(0, 6).map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          markAsRead(notif.id);
                          if (notif.link) {
                            navigate(notif.link);
                            setShowNotifications(false);
                          }
                        }}
                        className={`p-3.5 hover:bg-slate-50 cursor-pointer transition-colors ${
                          !notif.read ? 'bg-indigo-50/40' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-semibold text-slate-900 leading-snug">{notif.title}</p>
                          {!notif.read && <span className="w-2 h-2 rounded-full bg-indigo-600 flex-shrink-0 mt-1" />}
                        </div>
                        <p className="text-xs text-slate-600 mt-1 line-clamp-2">{notif.message}</p>
                        <span className="text-[10px] text-slate-400 mt-1.5 block">
                          {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))
                  )}
                </div>

                <div className="px-4 pt-2 border-t border-slate-100 text-center">
                  <Link
                    to="/notifications"
                    onClick={() => setShowNotifications(false)}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 block py-1"
                  >
                    View All Notifications →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => {
                  setShowUserMenu(!showUserMenu);
                  setShowNotifications(false);
                }}
                className="flex items-center gap-2 p-1.5 hover:bg-slate-100 rounded-xl transition-colors border border-transparent hover:border-slate-200"
              >
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
                  alt={user.displayName}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/20"
                />
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-900 leading-none">{user.displayName}</span>
                  <span className="text-[11px] text-slate-500 capitalize">{role}</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900">{user.displayName}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                  </div>

                  <div className="py-1 text-xs text-slate-700">
                    {role === 'student' && (
                      <>
                        <Link
                          to="/student/profile"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50"
                        >
                          <User className="w-4 h-4 text-slate-400" /> My Profile
                        </Link>
                        <Link
                          to="/student/resumes"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50"
                        >
                          <Compass className="w-4 h-4 text-slate-400" /> My Resumes &amp; ATS
                        </Link>
                      </>
                    )}

                    {role === 'recruiter' && (
                      <>
                        <Link
                          to="/recruiter/profile"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50"
                        >
                          <Briefcase className="w-4 h-4 text-slate-400" /> Company Profile
                        </Link>
                        <Link
                          to="/recruiter/dashboard"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50"
                        >
                          <Shield className="w-4 h-4 text-slate-400" /> Recruiter Pipeline
                        </Link>
                      </>
                    )}

                    {role === 'admin' && (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50"
                      >
                        <Shield className="w-4 h-4 text-slate-400" /> Admin Console
                      </Link>
                    )}
                  </div>

                  <div className="border-t border-slate-100 pt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs text-red-600 hover:bg-red-50 font-medium"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/auth/student/login"
                className="text-xs font-semibold text-slate-700 hover:text-indigo-600 px-3 py-2 rounded-lg"
              >
                Sign In
              </Link>
              <Link
                to="/auth/student/register"
                className="text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2 rounded-xl shadow-xs"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
