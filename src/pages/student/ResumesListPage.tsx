import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { Resume, ResumeVersion } from '../../types';
import { useNotifications } from '../../contexts/NotificationContext';
import { ResumeVersionHistoryModal } from '../../components/student/ResumeVersionHistoryModal';
import { ResumeComparisonModal } from '../../components/student/ResumeComparisonModal';
import {
  FileText,
  Upload,
  Star,
  Trash2,
  Eye,
  Activity,
  Sparkles,
  CheckCircle2,
  Calendar,
  AlertCircle,
  History,
  GitCompare,
  RotateCcw,
  Layers,
} from 'lucide-react';

export const ResumesListPage: React.FC = () => {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);

  // Version History Modal state
  const [historyModalResume, setHistoryModalResume] = useState<Resume | null>(null);

  // Direct Comparison Modal state
  const [comparisonModalResume, setComparisonModalResume] = useState<Resume | null>(null);
  const [comparisonVersions, setComparisonVersions] = useState<{ vA: string; vB: string } | null>(null);

  const { showToast } = useNotifications();
  const navigate = useNavigate();

  const loadResumes = () => {
    api
      .getResumes()
      .then((res) => setResumes(res.resumes))
      .catch((err) => console.warn(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadResumes();
  }, []);

  const handleSetPrimary = async (id: string) => {
    try {
      await api.setPrimaryResume(id);
      showToast('Primary resume updated', 'success');
      loadResumes();
    } catch (err: any) {
      showToast('Failed to set primary resume', 'warning');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;
    try {
      await api.deleteResume(id);
      showToast('Resume removed', 'info');
      loadResumes();
    } catch (err: any) {
      showToast('Failed to delete resume', 'warning');
    }
  };

  const handleOpenDirectCompare = async (resume: Resume) => {
    try {
      const res = await api.getResumeVersions(resume.id);
      if (res.versions && res.versions.length >= 2) {
        setComparisonModalResume(resume);
        setComparisonVersions({
          vA: res.versions[1].id,
          vB: res.versions[0].id,
        });
      } else {
        // Only 1 version exists; open history modal to create a checkpoint
        showToast('Create another version checkpoint first to compare differences', 'info');
        setHistoryModalResume(resume);
      }
    } catch (err) {
      showToast('Could not load version comparison', 'warning');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Resume Management &amp; Version Control</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Track incremental edits, compare revisions side-by-side, and revert to previous parsed versions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/student/resumes/upload"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <Upload className="w-4 h-4" /> Upload New Resume
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-500">Loading resumes...</div>
      ) : resumes.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center max-w-lg mx-auto shadow-xs">
          <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-indigo-100">
            <FileText className="w-7 h-7" />
          </div>
          <h2 className="text-base font-bold text-slate-900">No resumes uploaded yet</h2>
          <p className="text-xs text-slate-500 mt-1 mb-6">
            Upload your PDF or DOCX resume to generate an instant ATS score and unlock customized career roadmaps.
          </p>
          <Link
            to="/student/resumes/upload"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors"
          >
            <Upload className="w-4 h-4" /> Upload Resume
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {resumes.map((resume) => {
            const versionCount = resume.versions?.length || 1;
            const currentVerNumber = resume.currentVersion || versionCount;

            return (
              <div
                key={resume.id}
                className={`bg-white border rounded-2xl p-5 shadow-xs transition-all flex flex-col justify-between space-y-4 ${
                  resume.isPrimary ? 'border-indigo-400 ring-2 ring-indigo-500/10' : 'border-slate-200/80 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0 border border-indigo-100">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-slate-900 truncate max-w-[200px]">
                            {resume.filename}
                          </h3>
                          {/* Version Badge */}
                          <button
                            type="button"
                            onClick={() => setHistoryModalResume(resume)}
                            className="px-2 py-0.5 bg-slate-100 hover:bg-indigo-100 text-slate-700 hover:text-indigo-800 rounded-md text-[10px] font-bold border border-slate-200 transition-colors flex items-center gap-1"
                            title="Inspect version history and audit trail"
                          >
                            <History className="w-3 h-3 text-indigo-600" />
                            v{currentVerNumber} ({versionCount} revs)
                          </button>
                        </div>

                        <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1.5">
                          <Calendar className="w-3 h-3" />
                          Uploaded {new Date(resume.createdAt).toLocaleDateString()} · {(resume.fileSize / 1024).toFixed(0)} KB
                        </p>
                      </div>
                    </div>

                    {resume.isPrimary ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full text-[11px] font-bold flex-shrink-0">
                        <Star className="w-3 h-3 fill-indigo-600" /> Primary
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSetPrimary(resume.id)}
                        className="text-[11px] text-slate-500 hover:text-indigo-600 font-medium flex-shrink-0"
                      >
                        Make Primary
                      </button>
                    )}
                  </div>

                  {/* ATS score overview */}
                  <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400">Estimated ATS Score</span>
                      <p className="text-xl font-extrabold text-slate-900 leading-tight">
                        {resume.atsScore} <span className="text-xs font-normal text-slate-400">/ 100</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold uppercase text-slate-400">Skills Detected</span>
                      <p className="text-sm font-bold text-indigo-600">
                        {resume.extractedData?.skills?.length || 0} skills
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs font-semibold">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Link
                      to={`/student/resumes/${resume.id}/diagnostic`}
                      className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg flex items-center gap-1 transition-colors"
                    >
                      <Activity className="w-3.5 h-3.5 text-indigo-600" /> Diagnostic
                    </Link>

                    <Link
                      to={`/student/resumes/${resume.id}/preview`}
                      className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg flex items-center gap-1 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" /> Preview
                    </Link>

                    {/* Version History Button */}
                    <button
                      type="button"
                      onClick={() => setHistoryModalResume(resume)}
                      className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg flex items-center gap-1 transition-colors"
                      title="View all versions, checkpoints, and revert"
                    >
                      <History className="w-3.5 h-3.5" /> History
                    </button>

                    {/* Side-by-Side Comparison Tool Button */}
                    <button
                      type="button"
                      onClick={() => handleOpenDirectCompare(resume)}
                      className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg flex items-center gap-1 transition-colors"
                      title="Compare versions side-by-side"
                    >
                      <GitCompare className="w-3.5 h-3.5 text-indigo-600" /> Compare
                    </button>
                  </div>

                  <button
                    onClick={() => handleDelete(resume.id, resume.filename)}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    title="Delete Resume"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Version History & Revert Modal */}
      {historyModalResume && (
        <ResumeVersionHistoryModal
          resumeId={historyModalResume.id}
          resumeFilename={historyModalResume.filename}
          onClose={() => setHistoryModalResume(null)}
          onVersionReverted={() => {
            loadResumes();
          }}
        />
      )}

      {/* Side-by-Side Comparison Modal */}
      {comparisonModalResume && comparisonVersions && (
        <ResumeComparisonModal
          resumeId={comparisonModalResume.id}
          versions={comparisonModalResume.versions || []}
          initialVersionAId={comparisonVersions.vA}
          initialVersionBId={comparisonVersions.vB}
          onClose={() => {
            setComparisonModalResume(null);
            setComparisonVersions(null);
          }}
          onRevertSuccess={() => {
            loadResumes();
          }}
        />
      )}
    </div>
  );
};
