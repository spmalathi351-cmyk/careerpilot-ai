import React from 'react';

interface ScoreGaugeProps {
  score: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  sublabel?: string;
  showStatus?: boolean;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  score,
  label = 'ATS Score',
  size = 'md',
  sublabel,
  showStatus = true,
}) => {
  const clamped = Math.max(0, Math.min(100, score || 0));

  // Determine color theme
  let strokeColor = '#10b981'; // emerald
  let statusText = 'Excellent Match';
  let badgeBg = 'bg-emerald-50 text-emerald-700 border-emerald-200';

  if (clamped < 60) {
    strokeColor = '#ef4444'; // red
    statusText = 'Needs Work';
    badgeBg = 'bg-red-50 text-red-700 border-red-200';
  } else if (clamped < 75) {
    strokeColor = '#f59e0b'; // amber
    statusText = 'Moderate Compatibility';
    badgeBg = 'bg-amber-50 text-amber-700 border-amber-200';
  } else if (clamped < 88) {
    strokeColor = '#6366f1'; // indigo
    statusText = 'Strong Alignment';
    badgeBg = 'bg-indigo-50 text-indigo-700 border-indigo-200';
  }

  const dimensions = {
    sm: { size: 84, stroke: 7, text: 'text-xl', labelText: 'text-xs' },
    md: { size: 120, stroke: 9, text: 'text-3xl', labelText: 'text-xs' },
    lg: { size: 160, stroke: 12, text: 'text-4xl', labelText: 'text-sm' },
  }[size];

  const radius = (dimensions.size - dimensions.stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clamped / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="relative inline-flex items-center justify-center">
        <svg
          width={dimensions.size}
          height={dimensions.size}
          className="transform -rotate-90 drop-shadow-sm"
        >
          {/* Background circle */}
          <circle
            cx={dimensions.size / 2}
            cy={dimensions.size / 2}
            r={radius}
            stroke="#e2e8f0"
            strokeWidth={dimensions.stroke}
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx={dimensions.size / 2}
            cy={dimensions.size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={dimensions.stroke}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className={`font-extrabold tracking-tight text-slate-900 ${dimensions.text}`}>
            {clamped}
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            / 100
          </span>
        </div>
      </div>

      {label && <div className={`font-semibold text-slate-800 mt-2 ${dimensions.labelText}`}>{label}</div>}

      {showStatus && (
        <div className={`mt-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${badgeBg}`}>
          {statusText}
        </div>
      )}

      {sublabel && <div className="text-[11px] text-slate-500 mt-1 max-w-[180px]">{sublabel}</div>}
    </div>
  );
};
