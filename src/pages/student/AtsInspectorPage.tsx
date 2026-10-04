import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { useNotifications } from '../../contexts/NotificationContext';
import {
  ArrowLeft,
  Search,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Copy,
} from 'lucide-react';

export const AtsInspectorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeLine, setActiveLine] = useState<string>('');
  const [improvedLine, setImprovedLine] = useState<string>('');
  const [polishing, setPolishing] = useState(false);

  const { showToast } = useNotifications();

  useEffect(() => {
    if (id) {
      api
        .getAtsInspector(id)
        .then((res) => setData(res))
        .catch((err) => console.warn(err))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleImproveLine = async () => {
    if (!activeLine) return;
    setPolishing(true);
    try {
      const res = await api.improveBullet(activeLine);
      setImprovedLine(res.improvedBullet);
      showToast('Line enhanced with action metrics', 'success');
    } catch (e: any) {
      showToast('Could not enhance line', 'warning');
    } finally {
      setPolishing(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-xs text-slate-500">Loading line inspector...</div>;
  }

  if (!data) {
    return <div className="p-8 text-center text-xs text-red-500">Inspector data not found</div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            to="/student/ats-simulator"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 mb-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to ATS Simulator
          </Link>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Line-by-Line ATS Inspector</h1>
          <p className="text-xs text-slate-500 mt-1">
            Analyze each parsed resume line for keyword recognition, character limits, and bullet point quality.
          </p>
        </div>

        <Link
          to={`/student/resumes/${id}/diagnostic`}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-bold border border-indigo-200"
        >
          View Diagnostic Overview
        </Link>
      </div>

      {/* Inspector Sandbox Drawer */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Interactive Bullet Point Sandbox
        </h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={activeLine}
            onChange={(e) => setActiveLine(e.target.value)}
            placeholder="Click any line below or type a line to inspect and improve..."
            className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
          />
          <button
            onClick={handleImproveLine}
            disabled={polishing || !activeLine}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {polishing ? 'Optimizing...' : 'Elevate Line with AI'}
          </button>
        </div>

        {improvedLine && (
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 flex items-start justify-between gap-3">
            <div>
              <span className="font-bold text-emerald-800 block mb-0.5">Optimized Phrasing:</span>
              <p>{improvedLine}</p>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(improvedLine);
                showToast('Copied to clipboard', 'info');
              }}
              className="p-1 text-emerald-700 hover:text-emerald-900"
              title="Copy"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Line By Line Inspection View */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h2 className="text-sm font-bold text-slate-900">Parsed Document Tokens ({data.lines?.length || 0} Lines)</h2>
          <span className="text-[11px] text-slate-400">Click a line to load into sandbox</span>
        </div>

        <div className="divide-y divide-slate-100 font-mono text-xs">
          {(data.lines || []).map((lineItem: any) => (
            <div
              key={lineItem.lineNumber}
              onClick={() => setActiveLine(lineItem.content)}
              className="py-3 px-2 hover:bg-indigo-50/40 rounded-xl cursor-pointer transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div className="flex items-start gap-3">
                <span className="text-slate-400 text-[10px] w-6 flex-shrink-0 pt-0.5">
                  #{lineItem.lineNumber}
                </span>
                <span className={`font-sans ${lineItem.isHeader ? 'font-bold text-slate-900' : 'text-slate-700'}`}>
                  {lineItem.content}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 flex-shrink-0">
                {lineItem.detectedKeywords && lineItem.detectedKeywords.length > 0 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md">
                    +{lineItem.detectedKeywords.length} kw
                  </span>
                )}
                {lineItem.warning && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-md flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Long
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
