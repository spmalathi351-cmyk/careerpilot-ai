import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    positive: boolean;
  };
  accentColor?: 'indigo' | 'emerald' | 'violet' | 'amber' | 'blue';
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  accentColor = 'indigo',
  onClick,
}) => {
  const colorMap = {
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    violet: 'bg-violet-50 text-violet-600 border-violet-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
  }[accentColor];

  return (
    <div
      onClick={onClick}
      className={`bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs transition-all duration-200 hover:shadow-md hover:border-slate-300 ${
        onClick ? 'cursor-pointer hover:-translate-y-0.5' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{title}</p>
          <p className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">{value}</p>
        </div>
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${colorMap}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {(subtitle || trend) && (
        <div className="mt-4 flex items-center justify-between text-xs pt-3 border-t border-slate-100">
          {subtitle && <span className="text-slate-500 font-normal truncate max-w-[200px]">{subtitle}</span>}
          {trend && (
            <span
              className={`font-semibold inline-flex items-center gap-0.5 ${
                trend.positive ? 'text-emerald-600' : 'text-slate-500'
              }`}
            >
              {trend.positive ? '↑' : '→'} {trend.value}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
