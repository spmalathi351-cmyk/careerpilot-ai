import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { Resume } from '../../types';
import { useNotifications } from '../../contexts/NotificationContext';
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
} from 'lucide-react';

export const ResumesListPage: React.FC = () => {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Resume Management</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Manage your resumes, run AI diagnostic parsing, and inspect ATS keyword compatibility.
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
          {resumes.map((resume) => (
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
                      <h3 className="text-sm font-bold text-slate-900 truncate max-w-[220px]">
                        {resume.filename}
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1.5">
                        <Calendar className="w-3 h-3" />
                        Uploaded {new Date(resume.createdAt).toLocaleDateString()} · {(resume.fileSize / 1024).toFixed(0)} KB
                      </p>
                    </div>
                  </div>

                  {resume.isPrimary ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full text-[11px] font-bold">
                      <Star className="w-3 h-3 fill-indigo-600" /> Primary
                    </span>
                  ) : (
                    <button
                      onClick={() => handleSetPrimary(resume.id)}
                      className="text-[11px] text-slate-500 hover:text-indigo-600 font-medium"
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
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs font-semibold">
                <div className="flex items-center gap-2">
                  <Link
                    to={`/student/resumes/${resume.id}/diagnostic`}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg flex items-center gap-1 transition-colors"
                  >
                    <Activity className="w-3.5 h-3.5 text-indigo-600" /> Diagnostic
                  </Link>

                  <Link
                    to={`/student/resumes/${resume.id}/preview`}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg flex items-center gap-1 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" /> Preview
                  </Link>

                  <Link
                    to={`/student/resumes/${resume.id}/recommendations`}
                    className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg flex items-center gap-1 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> AI Advice
                  </Link>
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
          ))}
        </div>
      )}
    </div>
  );
};
