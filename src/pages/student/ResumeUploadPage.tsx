import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { useNotifications } from '../../contexts/NotificationContext';
import { Upload, FileText, CheckCircle2, AlertCircle, Sparkles, ArrowRight } from 'lucide-react';

export const ResumeUploadPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [customText, setCustomText] = useState('');
  const [useCustomText, setUseCustomText] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { showToast } = useNotifications();
  const navigate = useNavigate();

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

    try {
      const res = await api.uploadResume({
        filename,
        fileSize,
        rawText: useCustomText ? customText : undefined,
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
State University of Technology - B.S. in Computer Science (GPA 3.89)

Technical Skills:
TypeScript, React, Node.js, Python, PostgreSQL, Docker, Git, Tailwind CSS, REST APIs, System Design, Gemini API.

Experience:
Nexus Software Labs - Software Engineering Intern (May 2025 - Aug 2025)
- Spearheaded development of high-throughput REST API servicing 45,000 daily active requests.
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
          Supported formats: PDF, DOCX (Max 15MB). Our engine will parse your skills, formatting, and ATS score.
        </p>
      </div>

      {error && (
        <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Upload Zone */}
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

        {/* Demo Fast Fill Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={handleUseDemoResume}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" /> Or auto-fill demo engineering resume
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
    </div>
  );
};
