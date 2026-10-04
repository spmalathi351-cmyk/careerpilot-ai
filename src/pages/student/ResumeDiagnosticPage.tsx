import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Resume } from '../../types';
import { ScoreGauge } from '../../components/common/ScoreGauge';
import { useNotifications } from '../../contexts/NotificationContext';
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Save,
  Eye,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Target,
  Edit2,
} from 'lucide-react';

export const ResumeDiagnosticPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const { showToast } = useNotifications();

  useEffect(() => {
    if (id) {
      api
        .getResumeDiagnostic(id)
        .then((res) => {
          setResume(res.resume);
          setExtractedData(res.resume.extractedData);
        })
        .catch((err) => console.warn(err))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleSaveEdits = async () => {
    if (!id || !extractedData) return;
    setSaving(true);
    try {
      await api.updateExtractedResumeData(id, extractedData);
      showToast('Extracted diagnostic data updated', 'success');
      setEditing(false);
    } catch (e: any) {
      showToast('Failed to save updates', 'warning');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-xs text-slate-500">Loading diagnostic analysis...</div>;
  }

  if (!resume) {
    return <div className="p-8 text-center text-xs text-red-500">Resume not found</div>;
  }

  const scores = resume.scores || {
    overall: 88,
    keywordMatch: 90,
    skillsMatch: 89,
    formattingScore: 94,
    experienceRelevance: 87,
    educationRelevance: 90,
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">AI Resume Diagnostic</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              Completed
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            File: <span className="font-semibold text-slate-800">{resume.filename}</span> · Parsed with Gemini 3.8 Flash
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={`/student/resumes/${resume.id}/preview`}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Eye className="w-4 h-4" /> Visual Preview
          </Link>

          <Link
            to={`/student/resumes/${resume.id}/recommendations`}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Sparkles className="w-4 h-4" /> Next Steps &amp; Advice
          </Link>
        </div>
      </div>

      {/* Primary Diagnostic Gauge & Breakdown */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="flex justify-center border-b md:border-b-0 md:border-r border-slate-100 pb-6 md:pb-0 md:pr-8">
            <ScoreGauge score={scores.overall} label="Overall ATS Health" size="lg" />
          </div>

          <div className="md:col-span-2 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Diagnostic Dimension Breakdown
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Keyword Compatibility</span>
                  <span className="text-indigo-600">{scores.keywordMatch}%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${scores.keywordMatch}%` }} />
                </div>
                <p className="text-[10px] text-slate-400 mt-1.5">Direct technical keyword hits across headers</p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Formatting &amp; Parseability</span>
                  <span className="text-emerald-600">{scores.formattingScore}%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${scores.formattingScore}%` }} />
                </div>
                <p className="text-[10px] text-slate-400 mt-1.5">Single-column layout with standard headers</p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Experience Relevance</span>
                  <span className="text-blue-600">{scores.experienceRelevance}%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${scores.experienceRelevance}%` }} />
                </div>
                <p className="text-[10px] text-slate-400 mt-1.5">Internship and production system alignment</p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Education Relevance</span>
                  <span className="text-violet-600">{scores.educationRelevance}%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-violet-500 rounded-full" style={{ width: `${scores.educationRelevance}%` }} />
                </div>
                <p className="text-[10px] text-slate-400 mt-1.5">Accredited degree in Computer Science</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Strengths & Weaknesses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Key Resume Strengths
          </div>
          <ul className="space-y-2">
            {(extractedData?.strengths || [
              'Action verbs at the beginning of each professional bullet point',
              'Explicit mention of core full-stack languages (TypeScript, React, Python)',
              'Quantifiable latency and throughput impact metrics',
            ]).map((str: string, i: number) => (
              <li key={i} className="flex items-start gap-2.5 text-xs text-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0 mt-1.5" />
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses / Improvements */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-amber-700 text-xs font-bold uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-amber-600" /> Areas to Strengthen
          </div>
          <ul className="space-y-2">
            {(extractedData?.weaknesses || [
              'Could expand on distributed cloud infrastructure tooling (Docker, Kubernetes)',
              'Summary section could emphasize commercial business velocity rather than academic projects',
            ]).map((wk: string, i: number) => (
              <li key={i} className="flex items-start gap-2.5 text-xs text-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0 mt-1.5" />
                <span>{wk}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Action Verb Suggestions */}
      {extractedData?.actionVerbSuggestions && (
        <div className="bg-indigo-50/60 border border-indigo-100 rounded-2xl p-5 space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-indigo-600" /> Recommended Action Verb Upgrades
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-indigo-950 pt-1">
            {extractedData.actionVerbSuggestions.map((verb: string, idx: number) => (
              <div key={idx} className="p-2 bg-white rounded-lg border border-indigo-100/80 flex items-center gap-2">
                <span className="font-semibold text-indigo-700">💡</span>
                <span>{verb}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Extracted Profile Sections (Editable before saving) */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">Extracted Structured Profile</h2>
            <p className="text-xs text-slate-500">
              Verify or fine-tune information extracted by the parser before saving to your profile.
            </p>
          </div>
          {editing ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setEditing(false)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdits}
                disabled={saving}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" /> {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              <Edit2 className="w-3.5 h-3.5" /> Edit Extracted Data
            </button>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Candidate Name</label>
            <input
              type="text"
              disabled={!editing}
              value={extractedData?.name || ''}
              onChange={(e) => setExtractedData({ ...extractedData, name: e.target.value })}
              className="w-full max-w-md px-3 py-2 bg-slate-50 disabled:bg-slate-100 border border-slate-200 rounded-xl text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Headline</label>
            <input
              type="text"
              disabled={!editing}
              value={extractedData?.headline || ''}
              onChange={(e) => setExtractedData({ ...extractedData, headline: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 disabled:bg-slate-100 border border-slate-200 rounded-xl text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Professional Summary</label>
            <textarea
              rows={3}
              disabled={!editing}
              value={extractedData?.summary || ''}
              onChange={(e) => setExtractedData({ ...extractedData, summary: e.target.value })}
              className="w-full p-3 bg-slate-50 disabled:bg-slate-100 border border-slate-200 rounded-xl text-xs leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Extracted Technical Skills</label>
            <div className="flex flex-wrap gap-1.5">
              {(extractedData?.skills || []).map((skill: string, idx: number) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded-lg text-xs font-semibold border border-slate-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
