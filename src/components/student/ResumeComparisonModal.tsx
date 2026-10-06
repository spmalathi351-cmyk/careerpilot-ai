import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { ResumeVersion, ResumeComparisonResult } from '../../types';
import { useNotifications } from '../../contexts/NotificationContext';
import {
  X,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle2,
  AlertTriangle,
  History,
  RotateCcw,
  Sparkles,
  GitCompare,
  Code,
  Briefcase,
  Layers,
  FileCheck2,
  Plus,
  RefreshCw,
} from 'lucide-react';

interface ResumeComparisonModalProps {
  resumeId: string;
  versions: ResumeVersion[];
  initialVersionAId: string;
  initialVersionBId: string;
  onClose: () => void;
  onRevertSuccess?: () => void;
}

export const ResumeComparisonModal: React.FC<ResumeComparisonModalProps> = ({
  resumeId,
  versions,
  initialVersionAId,
  initialVersionBId,
  onClose,
  onRevertSuccess,
}) => {
  const [versionAId, setVersionAId] = useState(initialVersionAId);
  const [versionBId, setVersionBId] = useState(initialVersionBId);
  const [comparison, setComparison] = useState<ResumeComparisonResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [reverting, setReverting] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'skills' | 'experience' | 'projects' | 'formatting'>('all');
  const { showToast } = useNotifications();

  const loadComparison = (vA: string, vB: string) => {
    setLoading(true);
    api
      .compareResumeVersions(resumeId, vA, vB)
      .then((res) => setComparison(res.comparison))
      .catch((err) => {
        console.warn('Comparison fetch failed:', err);
        showToast('Failed to compare versions', 'warning');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadComparison(versionAId, versionBId);
  }, [versionAId, versionBId]);

  const handleRevert = async (targetVer: ResumeVersion) => {
    if (!confirm(`Are you sure you want to revert your active resume to "${targetVer.label}"?`)) return;
    setReverting(true);
    try {
      await api.revertResumeVersion(resumeId, targetVer.id);
      showToast(`Resume restored to ${targetVer.label}`, 'success');
      if (onRevertSuccess) onRevertSuccess();
      onClose();
    } catch (err: any) {
      showToast('Failed to revert version', 'warning');
    } finally {
      setReverting(false);
    }
  };

  const getDeltaBadge = (delta: number) => {
    if (delta > 0) {
      return (
        <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-600" /> +{delta} pts
        </span>
      );
    }
    if (delta < 0) {
      return (
        <span className="inline-flex items-center gap-0.5 text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
          <TrendingDown className="w-3.5 h-3.5 text-rose-600" /> {delta} pts
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
        <Minus className="w-3.5 h-3.5" /> No change
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-5xl h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Top Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between gap-4 bg-slate-50/80 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center border border-indigo-200">
              <GitCompare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                Resume Version Comparison Engine
              </h2>
              <p className="text-xs text-slate-500">
                Side-by-side diff of skills, quantified bullet points, and ATS score trajectory.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Version Pickers & Score Evolution Header Bar */}
        <div className="p-4 sm:p-5 bg-white border-b border-slate-200 flex-shrink-0 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            {/* Left: Version A (Baseline) */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Baseline (Version A)
                </span>
                <select
                  value={versionAId}
                  onChange={(e) => setVersionAId(e.target.value)}
                  className="px-2.5 py-1 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-800"
                >
                  {versions.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.label} (ATS: {v.atsScore}%)
                    </option>
                  ))}
                </select>
              </div>

              {comparison && (
                <div className="text-right">
                  <span className="text-lg font-black text-slate-800">{comparison.versionA.atsScore}%</span>
                  <span className="text-[10px] text-slate-400 block">ATS Score</span>
                </div>
              )}
            </div>

            {/* Right: Version B (Comparison Target) */}
            <div className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-200 flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 block mb-1">
                  Comparison (Version B)
                </span>
                <select
                  value={versionBId}
                  onChange={(e) => setVersionBId(e.target.value)}
                  className="px-2.5 py-1 bg-white border border-indigo-300 rounded-lg text-xs font-bold text-indigo-900"
                >
                  {versions.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.label} (ATS: {v.atsScore}%)
                    </option>
                  ))}
                </select>
              </div>

              {comparison && (
                <div className="text-right flex items-center gap-2">
                  <div>
                    <span className="text-lg font-black text-indigo-700">{comparison.versionB.atsScore}%</span>
                    <span className="text-[10px] text-indigo-500 block">ATS Score</span>
                  </div>
                  {getDeltaBadge(comparison.scoreDelta.overall)}
                </div>
              )}
            </div>
          </div>

          {/* Quick Metrics Delta Row */}
          {comparison && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
              <div className="p-2 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Keywords:</span>
                <span className="font-bold">{getDeltaBadge(comparison.scoreDelta.keywordMatch)}</span>
              </div>
              <div className="p-2 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Skills Match:</span>
                <span className="font-bold">{getDeltaBadge(comparison.scoreDelta.skillsMatch)}</span>
              </div>
              <div className="p-2 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Formatting:</span>
                <span className="font-bold">{getDeltaBadge(comparison.scoreDelta.formattingScore)}</span>
              </div>
              <div className="p-2 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Experience:</span>
                <span className="font-bold">{getDeltaBadge(comparison.scoreDelta.experienceRelevance)}</span>
              </div>
            </div>
          )}

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {[
              { id: 'all', label: 'All Changes', icon: Layers },
              { id: 'skills', label: 'Skills Diff', icon: Code },
              { id: 'experience', label: 'Experience & Bullets', icon: Briefcase },
              { id: 'projects', label: 'Projects & Tech', icon: Sparkles },
              { id: 'formatting', label: 'Formatting & ATS Warnings', icon: FileCheck2 },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                    activeTab === tab.id
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Comparison Body Scrollable */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {loading ? (
            <div className="p-16 text-center text-xs text-slate-500 flex flex-col items-center justify-center gap-2">
              <RefreshCw className="w-6 h-6 animate-spin text-indigo-600" />
              <span>Analyzing version differences and semantic changes...</span>
            </div>
          ) : !comparison ? (
            <div className="p-12 text-center text-xs text-red-500">Failed to load comparison data.</div>
          ) : (
            <>
              {/* 1. SKILLS DIFF SECTION */}
              {(activeTab === 'all' || activeTab === 'skills') && (
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                      <Code className="w-4 h-4 text-indigo-600" /> Skills Evolution
                    </h3>
                    <div className="flex items-center gap-3 text-xs font-medium">
                      <span className="text-emerald-700">+{comparison.skillsDiff.added.length} added</span>
                      <span className="text-rose-700">-{comparison.skillsDiff.removed.length} removed</span>
                      <span className="text-slate-500">{comparison.skillsDiff.retained.length} preserved</span>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    {/* Added in Version B */}
                    {comparison.skillsDiff.added.length > 0 && (
                      <div>
                        <span className="text-[11px] font-bold text-emerald-800 block mb-1">
                          Skills Added in Version B:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {comparison.skillsDiff.added.map((sk) => (
                            <span
                              key={sk}
                              className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-bold flex items-center gap-1 shadow-2xs"
                            >
                              <Plus className="w-3 h-3 text-emerald-600" /> {sk}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Removed in Version B */}
                    {comparison.skillsDiff.removed.length > 0 && (
                      <div>
                        <span className="text-[11px] font-bold text-rose-800 block mb-1">
                          Skills Removed from Version B:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {comparison.skillsDiff.removed.map((sk) => (
                            <span
                              key={sk}
                              className="px-2.5 py-1 bg-rose-50 text-rose-800 border border-rose-300 rounded-lg text-xs font-semibold flex items-center gap-1 line-through"
                            >
                              <Minus className="w-3 h-3 text-rose-500" /> {sk}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Common preserved skills */}
                    <div>
                      <span className="text-[11px] font-bold text-slate-500 block mb-1">Common Retained Skills:</span>
                      <div className="flex flex-wrap gap-1">
                        {comparison.skillsDiff.retained.map((sk) => (
                          <span
                            key={sk}
                            className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px] font-medium"
                          >
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. EXPERIENCE & BULLET POINTS DIFF */}
              {(activeTab === 'all' || activeTab === 'experience') && (
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4 text-indigo-600" /> Work Experience &amp; Action Verb Phrasing
                    </h3>
                    <span className="text-xs text-slate-500">
                      {comparison.experienceDiff.bulletsModifiedCount} bullet points modified or elevated
                    </span>
                  </div>

                  <div className="space-y-4">
                    {comparison.experienceDiff.roleComparisons.map((role, idx) => (
                      <div key={idx} className="p-4 bg-slate-50/70 border border-slate-200 rounded-xl space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-xs font-extrabold text-slate-900">{role.roleTitle}</span>
                            <span className="text-xs text-slate-500 ml-2">@ {role.company}</span>
                          </div>
                        </div>

                        {/* Side by Side Bullet Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                          {/* Left: Version A Bullets */}
                          <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1.5">
                            <span className="text-[10px] font-bold uppercase text-slate-400 block pb-1 border-b border-slate-100">
                              Version A Phrasing
                            </span>
                            <ul className="list-disc list-outside ml-3.5 text-xs text-slate-700 space-y-1">
                              {role.bulletsA.map((b, i) => {
                                const isRemoved = role.removedBullets.includes(b);
                                return (
                                  <li
                                    key={i}
                                    className={isRemoved ? 'text-rose-700 bg-rose-50/80 px-1 rounded' : ''}
                                  >
                                    {b}
                                  </li>
                                );
                              })}
                            </ul>
                          </div>

                          {/* Right: Version B Bullets */}
                          <div className="p-3 bg-white border border-indigo-100 rounded-xl space-y-1.5">
                            <span className="text-[10px] font-bold uppercase text-indigo-600 block pb-1 border-b border-indigo-50">
                              Version B (Elevated Phrasing)
                            </span>
                            <ul className="list-disc list-outside ml-3.5 text-xs text-slate-800 space-y-1">
                              {role.bulletsB.map((b, i) => {
                                const isAdded = role.addedBullets.includes(b);
                                return (
                                  <li
                                    key={i}
                                    className={
                                      isAdded ? 'text-emerald-900 font-semibold bg-emerald-50 px-1 rounded' : ''
                                    }
                                  >
                                    {b}
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. PROJECTS DIFF */}
              {(activeTab === 'all' || activeTab === 'projects') && (
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-indigo-600" /> Projects &amp; Tech Stack Additions
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Version A Projects */}
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Version A Projects</span>
                      {(comparison.versionA.extractedData.projects || []).map((p, idx) => (
                        <div key={idx} className="p-2.5 bg-white rounded-lg border border-slate-200 text-xs space-y-0.5">
                          <p className="font-bold text-slate-900">{p.title}</p>
                          <p className="text-[11px] text-slate-500 font-mono">{p.technologies.join(', ')}</p>
                          {p.impact && <p className="text-[11px] text-slate-600 italic">{p.impact}</p>}
                        </div>
                      ))}
                    </div>

                    {/* Version B Projects */}
                    <div className="p-4 bg-indigo-50/50 border border-indigo-200 rounded-xl space-y-2">
                      <span className="text-[10px] font-bold uppercase text-indigo-600 block">
                        Version B Projects (Enhanced)
                      </span>
                      {(comparison.versionB.extractedData.projects || []).map((p, idx) => (
                        <div key={idx} className="p-2.5 bg-white rounded-lg border border-indigo-100 text-xs space-y-0.5">
                          <p className="font-bold text-slate-900">{p.title}</p>
                          <p className="text-[11px] text-indigo-600 font-mono font-semibold">{p.technologies.join(', ')}</p>
                          {p.impact && <p className="text-[11px] text-emerald-800 font-medium">Outcome: {p.impact}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 4. FORMATTING & ATS DIAGNOSTICS */}
              {(activeTab === 'all' || activeTab === 'formatting') && (
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                      <FileCheck2 className="w-4 h-4 text-indigo-600" /> ATS Formatting Diagnostics &amp; Warnings
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Version A Warnings</span>
                      {(comparison.versionA.extractedData.formattingIssues || []).length === 0 ? (
                        <p className="text-emerald-700 flex items-center gap-1 font-semibold">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 0 layout warnings detected
                        </p>
                      ) : (
                        (comparison.versionA.extractedData.formattingIssues || []).map((issue, idx) => (
                          <p key={idx} className="text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200 flex items-start gap-1.5">
                            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" /> {issue}
                          </p>
                        ))
                      )}
                    </div>

                    <div className="p-3 bg-indigo-50/50 border border-indigo-200 rounded-xl space-y-1.5">
                      <span className="text-[10px] font-bold uppercase text-indigo-600 block">Version B Warnings</span>
                      {(comparison.versionB.extractedData.formattingIssues || []).length === 0 ? (
                        <p className="text-emerald-700 flex items-center gap-1 font-semibold">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Clean ATS parseability; 0 column warnings
                        </p>
                      ) : (
                        (comparison.versionB.extractedData.formattingIssues || []).map((issue, idx) => (
                          <p key={idx} className="text-slate-700 bg-white p-2 rounded-lg border border-slate-200 flex items-start gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" /> {issue}
                          </p>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Bottom Footer Actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3 flex-shrink-0">
          <div className="text-xs text-slate-500">
            Comparing <strong className="text-slate-800">{comparison?.versionA.label}</strong> against{' '}
            <strong className="text-indigo-700">{comparison?.versionB.label}</strong>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold transition-colors"
            >
              Close Comparison
            </button>

            {comparison && (
              <button
                type="button"
                disabled={reverting}
                onClick={() => handleRevert(comparison.versionA)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                title="Restore active resume to Version A"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Revert to Version A
              </button>
            )}

            {comparison && (
              <button
                type="button"
                disabled={reverting}
                onClick={() => handleRevert(comparison.versionB)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
                title="Restore active resume to Version B"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Revert to Version B
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
