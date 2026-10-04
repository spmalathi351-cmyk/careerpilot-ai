import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../contexts/NotificationContext';
import {
  Bell,
  CheckCheck,
  CheckCircle2,
  Calendar,
  FileCheck2,
  Briefcase,
  AlertTriangle,
  Info,
  Clock,
  ArrowRight,
} from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, loading } = useNotifications();
  const [filterType, setFilterType] = useState('all');
  const navigate = useNavigate();

  const filtered = notifications.filter((n) => {
    if (filterType === 'all') return true;
    if (filterType === 'unread') return !n.read;
    return n.type === filterType;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'interview_reminder':
        return <Calendar className="w-5 h-5 text-indigo-600" />;
      case 'resume_analysis':
        return <FileCheck2 className="w-5 h-5 text-emerald-600" />;
      case 'recruiter_invitation':
        return <Briefcase className="w-5 h-5 text-violet-600" />;
      case 'application_update':
        return <CheckCircle2 className="w-5 h-5 text-blue-600" />;
      default:
        return <Info className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">System &amp; Pipeline Notifications</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Real-time notifications across application stages, interview invitations, and resume diagnostics.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={() => markAllAsRead()}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold transition-colors"
          >
            <CheckCheck className="w-4 h-4" /> Mark All as Read
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { key: 'all', label: 'All Notifications' },
          { key: 'unread', label: `Unread (${unreadCount})` },
          { key: 'interview_reminder', label: 'Interviews' },
          { key: 'application_update', label: 'Applications' },
          { key: 'resume_analysis', label: 'Resume ATS' },
          { key: 'recruiter_invitation', label: 'Invitations' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilterType(tab.key)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              filterType === tab.key
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="bg-white border border-slate-200/80 rounded-3xl shadow-xs overflow-hidden divide-y divide-slate-100">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">
            No notifications matching current filter.
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                markAsRead(item.id);
                if (item.link) navigate(item.link);
              }}
              className={`p-5 hover:bg-slate-50 transition-colors cursor-pointer flex items-start justify-between gap-4 ${
                !item.read ? 'bg-indigo-50/30' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 shadow-2xs">
                  {getIcon(item.type)}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                    {!item.read && <span className="w-2 h-2 rounded-full bg-indigo-600 flex-shrink-0" />}
                    <span
                      className={`text-[10px] uppercase font-bold px-1.5 py-0.2 rounded ${
                        item.priority === 'high'
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.priority}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{item.message}</p>

                  <span className="text-[10px] text-slate-400 block pt-0.5">
                    {new Date(item.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-center flex-shrink-0">
                {item.link && <ArrowRight className="w-4 h-4 text-slate-400" />}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
