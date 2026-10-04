import React from 'react';
import { ApplicationStage } from '../../types';

interface StatusBadgeProps {
  status: ApplicationStage | 'draft' | 'published' | 'closed' | 'completed' | 'in-progress' | string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const normalized = status.toLowerCase();

  let styles = 'bg-slate-100 text-slate-700 border-slate-200';
  let dotColor = 'bg-slate-400';

  if (normalized === 'applied' || normalized === 'draft') {
    styles = 'bg-blue-50 text-blue-700 border-blue-200';
    dotColor = 'bg-blue-500';
  } else if (normalized === 'screening' || normalized === 'in-progress') {
    styles = 'bg-amber-50 text-amber-700 border-amber-200';
    dotColor = 'bg-amber-500';
  } else if (normalized === 'interview' || normalized === 'published') {
    styles = 'bg-indigo-50 text-indigo-700 border-indigo-200';
    dotColor = 'bg-indigo-500';
  } else if (normalized === 'offer' || normalized === 'completed' || normalized === 'hired') {
    styles = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    dotColor = 'bg-emerald-500';
  } else if (normalized === 'rejected' || normalized === 'failed' || normalized === 'closed') {
    styles = 'bg-red-50 text-red-700 border-red-200';
    dotColor = 'bg-red-500';
  }

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full border ${styles} ${sizeClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      <span className="capitalize">{status}</span>
    </span>
  );
};
