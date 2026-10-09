import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { useNotifications } from '../../contexts/NotificationContext';
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Eye,
  RefreshCw,
  Clock,
  ShieldCheck,
} from 'lucide-react';

export const ResumeUploadPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [customText, setCustomText] = useState('');
  const [useCustomText, setUseCustomText] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Existing Stored Resumes
  const [existingResumes, setExistingResumes] = useState<any[]>([]);
  const [loadingExisting, setLoadingExisting] = useState(true);
  const [isReplacing, setIsReplacing] = useState(false);

  const { showToast } = useNotifications();
  const navigate = useNavigate();

  useEffect(() => {
    api
      .getResumes()
      .then((res) => setExistingResumes(res.resumes || []))
      .catch((err) => console.warn(err))
      .finally(() => setLoadingExisting(false));
  }, []);

  const primaryResume = existingResumes.find((r) => r.isPrimary) || existingResumes[0];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    // Validate extension
    const allowed = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const ext = selected.name.split('.').pop()?.toLowerCase();

    if (!['pdf', 'docx'].includes(ext || '')) {
      setError('Please upload a valid PDF or DOCX file.');
      setFile(null);
      return;
    }

    if (selected.size > 15 * 1024 * 1024) {
      setError('File size exceeds the 15MB limit.');
      setFile(null);
      return;
    }

    setError(null);
    setFile(selected);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if (dropped) {
      const ext = dropped.name.split('.').pop()?.toLowerCase();
      if (!['pdf', 'docx'].includes(ext || '')) {
        setError('Please drop a valid PDF or DOCX file.');
        return;
      }
      setError(null);
      setFile(dropped);
    }
  };

  const handleUpload = async () => {
    if (!file && !useCustomText) {
      setError('Please select a resume file or input resume text.');
      return;
    }

    setUploading(true);
    setError(null);

    const filename = file ? file.name : 'Candidate_Resume_Draft.pdf';
    const fileSize = file ? file.size : 165000;

    let fileTextToSubmit: string | undefined = useCustomText ? customText : undefined;
    if (file && !useCustomText) {
      try {
        const readText = await file.text();
        if (readText && readText.trim().length > 10) {
          fileTextToSubmit = readText;
        }
      } catch {
        // Non-plaintext binary
      }
    }

    try {
      const res = await api.uploadResume({
        filename,
        fileSize,
        rawText: fileTextToSubmit,
      });

      showToast(`Resume "${filename}" uploaded and parsed!`, 'success');
      navigate(`/student/resumes/processing/${res.resume.id}`);
    } catch (err: any) {
      setError(err.message || 'Upload processing error');
    } finally {
      setUploading(false);
    }
  };

  const handleUseDemoResume = () => {
    setUseCustomText(true);
    setCustomText(
      `Alex Johnson | alex.johnson@example.com | (555) 234-5678
Full-Stack Software Engineer & Applied AI Enthusiast
State University of California, Berkeley - B.S. in Computer Science (GPA 3.89)

Technical Skills:
TypeScript, React, Node.js, Python, PostgreSQL, Docker, Git, Tailwind CSS, REST APIs, System Design, Gemini API.

Experience:
Nexus Software Labs - Software Engineering Intern (May 2025 - Aug 2025)
- Developed high-throughput REST API endpoints servicing 45,000 daily active requests with Express & TypeScript.
- Optimized PostgreSQL queries decreasing 95th-percentile response latency by 32%.
- Integrated automated CI/CD unit testing matrix across microservice deployments.

Projects:
CareerPilot AI Engine
- Real-time intelligent career platform with ATS compatibility scoring and sub-200ms evaluation latency.
CloudVision Telemetry System
- Anomaly detection dashboard utilizing PyTorch and FastAPI with Dockerized deployment.`
    );
    setFile(null);
    setError(null);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Upload Resume for AI Parsing</h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Supported formats: PDF, DOCX (Max 15MB). Your uploaded resume is securely stored and parsed once to power all AI career tools.
        </p>
      </div>

      {/* Existing Active Resume Banner */}
      {!loadingExisting && primaryResume && !isReplacing && (
        <div className="p-6 bg-gradient-to-r from-emerald-50 to-indigo-50/50 border border-emerald-200 rounded-3xl shadow-xs space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                    Active Stored Resume
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-200 text-emerald-900 rounded-full">
                    Primary
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mt-0.5">{primaryResume.filename}</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  ATS Score: <span className="font-bold text-slate-900">{primaryResume.atsScore}/100</span> · Uploaded{' '}
                  {new Date(primaryResume.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <Link
              to={`/student/resumes/${primaryResume.id}/diagnostic`}
              className="px-3.5 py-2 bg-white text-indigo-700 hover:bg-indigo-50 border border-slate-200 rounded-xl text-xs font-bold transition-colors shadow-2xs flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" /> View Diagnostic
            </Link>
          </div>

          <div className="p-3 bg-white/80 rounded-xl border border-emerald-100 text-xs text-slate-600 space-y-1">
            <p className="font-semibold text-slate-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Reusable Data Pipeline Active
            </p>
            <p className="text-[11px] leading-relaxed">
              This stored resume is automatically connected to your ATS Simulator, 90-Day Career Roadmap, Job Applications, and AI Interview Prep. You do not need to re-upload for individual features.
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-emerald-100">
            <button
              type="button"
              onClick={() => setIsReplacing(true)}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Replace With A New Resume
            </button>

            <Link
              to="/student/resumes"
              className="text-xs text-slate-500 hover:text-slate-800 font-medium"
            >
              View Version History ({existingResumes.length})
            </Link>
          </div>
        </div>
      )}

      {/* Replacement Mode Header Banner */}
      {isReplacing && (
        <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl flex items-center justify-between text-xs text-indigo-900">
          <div>
            <p className="font-bold">Replace Active Resume</p>
            <p className="text-slate-600 text-[11px]">
              Uploading a new file will update your profile skills and ATS scoring without affecting other users.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsReplacing(false)}
            className="px-3 py-1.5 bg-white text-slate-700 hover:bg-slate-50 rounded-lg font-bold border border-slate-200"
          >
            Cancel Replacement
          </button>
        </div>
      )}

      {error && (
        <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Upload Zone (shown for first-time students or when explicit replacement is active) */}
      {(existingResumes.length === 0 || isReplacing) && (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          {!useCustomText ? (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all ${
                file ? 'border-indigo-500 bg-indigo-50/20' : 'border-slate-300 hover:border-indigo-400 bg-slate-50/50'
              }`}
            >
              <input
                type="file"
                id="resume-file-input"
                accept=".pdf,.docx"
                onChange={handleFileChange}
                className="hidden"
              />

              {file ? (
                <div className="space-y-3">
                  <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto">
                    <FileText className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{file.name}</p>
                    <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB · Ready to parse</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="text-xs text-red-600 hover:underline font-semibold"
                  >
                    Choose a different file
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto border border-indigo-100">
                    <Upload className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Drag and drop your resume file here</p>
                    <p className="text-xs text-slate-500 mt-1">PDF or DOCX documents up to 15MB</p>
                  </div>
                  <label
                    htmlFor="resume-file-input"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-xs"
                  >
                    Browse Files
                  </label>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700">Resume Plaintext Content</label>
                <button
                  onClick={() => setUseCustomText(false)}
                  className="text-xs text-indigo-600 hover:underline font-medium"
                >
                  Switch to File Upload
                </button>
              </div>
              <textarea
                rows={12}
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono leading-relaxed"
              />
            </div>
          )}

          {/* Demo Fast Fill Button & Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={handleUseDemoResume}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" /> Or auto-fill engineering template
            </button>

            <button
              type="button"
              onClick={handleUpload}
              disabled={uploading || (!file && !customText)}
              className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              {uploading ? (
                'Analyzing with Gemini AI...'
              ) : (
                <>
                  Start AI Analysis Pipeline <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
