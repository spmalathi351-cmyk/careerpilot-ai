import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Resume, ResumeVersion } from '../../types';
import { useNotifications } from '../../contexts/NotificationContext';
import { ResumeComparisonModal } from './ResumeComparisonModal';
import {
  X,
  History,
  RotateCcw,
  GitCompare,
  Plus,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
  TrendingUp,
  FileText,
  Clock,
  Tag,
  ShieldCheck,
} from 'lucide-react';

interface ResumeVersionHistoryModalProps {
  resumeId: string;
  resumeFilename: string;
  onClose: () => void;
  onVersionReverted?: () => void;
}

export const ResumeVersionHistoryModal: React.FC<ResumeVersionHistoryModalProps> = ({
  resumeId,
  resumeFilename,
  onClose,
  onVersionReverted,
}) => {
  const [versions, setVersions] = useState<ResumeVersion[]>([]);
  const [currentVersionNum, setCurrentVersionNum] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [revertingId, setRevertingId] = useState<string | null>(null);

  // New Checkpoint creation state
  const [showCreateCheckpoint, setShowCreateCheckpoint] = useState(false);
  const [checkpointLabel, setCheckpointLabel] = useState('');
  const [checkpointSummary, setCheckpointSummary] = useState('');
  const [creatingCheckpoint, setCreatingCheckpoint] = useState(false);

  // Side-by-side comparison state
  const [showComparison, setShowComparison] = useState(false);
  const [compareVersionAId, setCompareVersionAId] = useState<string>('');
  const [compareVersionBId, setCompareVersionBId] = useState<string>('');

  const { showToast } = useNotifications();

  const loadVersions = () => {
    setLoading(true);
    api
      .getResumeVersions(resumeId)
      .then((res) => {
        setVersions(res.versions);
        setCurrentVersionNum(res.currentVersion);
        if (res.versions.length >= 2) {
          setCompareVersionAId(res.versions[1].id);
          setCompareVersionBId(res.versions[0].id);
        } else if (res.versions.length === 1) {
          setCompareVersionAId(res.versions[0].id);
          setCompareVersionBId(res.versions[0].id);
        }
      })
      .catch((err) => {
        console.warn('Failed to load resume versions:', err);
        showToast('Failed to load version history', 'warning');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadVersions();
  }, [resumeId]);

  const handleRevert = async (ver: ResumeVersion) => {
    if (!confirm(`Are you sure you want to revert your parsed resume to "${ver.label}"?`)) return;
    setRevertingId(ver.id);
    try {
      await api.revertResumeVersion(resumeId, ver.id);
      showToast(`Resume reverted to ${ver.label}`, 'success');
      loadVersions();
      if (onVersionReverted) onVersionReverted();
    } catch (err: any) {
      showToast('Could not revert to version', 'warning');
    } finally {
      setRevertingId(null);
    }
  };

  const handleCreateCheckpoint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkpointLabel.trim()) return;

    setCreatingCheckpoint(true);
    try {
      await api.createResumeVersion(resumeId, checkpointLabel, checkpointSummary);
      showToast('New version checkpoint saved', 'success');
      setCheckpointLabel('');
      setCheckpointSummary('');
      setShowCreateCheckpoint(false);
      loadVersions();
      if (onVersionReverted) onVersionReverted();
    } catch (err: any) {
      showToast('Failed to create version checkpoint', 'warning');
    } finally {
      setCreatingCheckpoint(false);
    }
  };

  const handleTriggerCompare = (vAId: string, vBId: string) => {
    setCompareVersionAId(vAId);
    setCompareVersionBId(vBId);
    setShowComparison(true);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
        <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
          {/* Top Header */}
          <div className="p-5 border-b border-slate-200 flex items-center justify-between gap-4 bg-slate-50/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 flex-shrink-0">
                <History className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                  Version History &amp; Audit Trail
                </h2>
                <p className="text-xs text-slate-500 truncate max-w-sm sm:max-w-md">
                  {resumeFilename} · Track incremental AI updates and revert anytime
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowCreateCheckpoint(!showCreateCheckpoint)}
                className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Checkpoint
              </button>

              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* New Checkpoint Form Drawer */}
          {showCreateCheckpoint && (
            <form onSubmit={handleCreateCheckpoint} className="p-4 bg-indigo-50/60 border-b border-indigo-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Save Current Snapshot as New Version
                </span>
                <button
                  type="button"
                  onClick={() => setShowCreateCheckpoint(false)}
                  className="text-xs text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  value={checkpointLabel}
                  onChange={(e) => setCheckpointLabel(e.target.value)}
                  placeholder="e.g. v4 - Added Docker & Microservices"
                  className="px-3 py-2 bg-white border border-indigo-200 rounded-xl text-xs font-semibold"
                />
                <input
                  type="text"
                  value={checkpointSummary}
                  onChange={(e) => setCheckpointSummary(e.target.value)}
                  placeholder="e.g. Optimized Nexus Labs bullet metrics and added 2 cloud skills"
                  className="px-3 py-2 bg-white border border-indigo-200 rounded-xl text-xs"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={creatingCheckpoint || !checkpointLabel.trim()}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                >
                  {creatingCheckpoint ? 'Saving...' : 'Save Version Checkpoint'}
                </button>
              </div>
            </form>
          )}

          {/* Compare Toolbar Bar */}
          {versions.length >= 2 && (
            <div className="px-5 py-3 bg-slate-50 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-600">
                <GitCompare className="w-4 h-4 text-indigo-600" />
                <span>Quick Compare:</span>
                <span className="font-semibold text-slate-800">{versions[1]?.label}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-semibold text-indigo-700">{versions[0]?.label}</span>
              </div>

              <button
                onClick={() => handleTriggerCompare(versions[1].id, versions[0].id)}
                className="px-3 py-1.5 bg-white hover:bg-slate-100 text-indigo-600 border border-indigo-200 rounded-xl font-bold shadow-2xs flex items-center gap-1.5 transition-colors"
              >
                <GitCompare className="w-3.5 h-3.5" /> Launch Side-by-Side Comparison
              </button>
            </div>
          )}

          {/* Versions List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {loading ? (
              <div className="p-12 text-center text-xs text-slate-500">Loading version checkpoints...</div>
            ) : versions.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">No versions tracked yet.</div>
            ) : (
              versions.map((ver, idx) => {
                const isActive = ver.versionNumber === currentVersionNum;
                const isLatest = idx === 0;

                return (
                  <div
                    key={ver.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      isActive
                        ? 'border-indigo-400 bg-indigo-50/40 ring-2 ring-indigo-500/10 shadow-xs'
                        : 'border-slate-200/80 bg-white hover:border-slate-300'
                    }`}
                  >
                    {/* Left: Version Info */}
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`px-2.5 py-0.5 rounded-lg text-xs font-black ${
                            isActive
                              ? 'bg-indigo-600 text-white'
                              : 'bg-slate-100 text-slate-800 border border-slate-200'
                          }`}
                        >
                          v{ver.versionNumber}
                        </span>

                        <h3 className="text-xs sm:text-sm font-bold text-slate-900">{ver.label}</h3>

                        {isActive && (
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md text-[10px] font-extrabold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Active Version
                          </span>
                        )}

                        {isLatest && !isActive && (
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[10px] font-semibold">
                            Latest
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-600 leading-snug">{ver.changesSummary}</p>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-400 font-medium pt-0.5">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(ver.createdAt).toLocaleDateString()} at{' '}
                          {new Date(ver.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span>·</span>
                        <span>Author: {ver.createdBy}</span>
                        <span>·</span>
                        <span>{ver.extractedData?.skills?.length || 0} skills</span>
                      </div>
                    </div>

                    {/* Right: ATS Score & Actions */}
                    <div className="flex items-center gap-3 self-end sm:self-center flex-shrink-0">
                      <div className="text-right">
                        <span className="text-[10px] font-bold uppercase text-slate-400 block">ATS Score</span>
                        <span className="text-base font-black text-slate-900">{ver.atsScore}%</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Compare button with active */}
                        {!isActive && (
                          <button
                            type="button"
                            onClick={() => handleTriggerCompare(ver.id, versions[0].id)}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1"
                            title="Compare this version with active"
                          >
                            <GitCompare className="w-3.5 h-3.5" /> Compare
                          </button>
                        )}

                        {/* Revert Action */}
                        {!isActive ? (
                          <button
                            type="button"
                            disabled={revertingId === ver.id}
                            onClick={() => handleRevert(ver)}
                            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            {revertingId === ver.id ? 'Reverting...' : 'Revert to This'}
                          </button>
                        ) : (
                          <span className="text-xs text-indigo-600 font-bold px-3 py-1 bg-white rounded-xl border border-indigo-200">
                            Current
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer info */}
          <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>All versions are stored with immutable change histories.</span>
            </div>

            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl font-semibold"
            >
              Done
            </button>
          </div>
        </div>
      </div>

      {/* Side-by-Side Comparison Sub-Modal */}
      {showComparison && compareVersionAId && compareVersionBId && (
        <ResumeComparisonModal
          resumeId={resumeId}
          versions={versions}
          initialVersionAId={compareVersionAId}
          initialVersionBId={compareVersionBId}
          onClose={() => setShowComparison(false)}
          onRevertSuccess={() => {
            loadVersions();
            if (onVersionReverted) onVersionReverted();
          }}
        />
      )}
    </>
  );
};
