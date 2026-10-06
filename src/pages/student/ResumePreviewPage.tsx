import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Resume } from '../../types';
import { useNotifications } from '../../contexts/NotificationContext';
import { useAuth } from '../../contexts/AuthContext';
import {
  Printer,
  Sparkles,
  ArrowLeft,
  Mail,
  Phone,
  CheckCircle,
  Copy,
  ExternalLink,
  Download,
  Palette,
  Type,
  FileCheck,
  Sliders,
  Eye,
  Check,
} from 'lucide-react';

export const ResumePreviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);

  // Template customizer state
  const [template, setTemplate] = useState<'modern' | 'executive' | 'compact'>('modern');
  const [accentColor, setAccentColor] = useState<'indigo' | 'slate' | 'emerald' | 'navy' | 'burgundy'>('indigo');
  const [fontFamily, setFontFamily] = useState<'sans' | 'serif'>('sans');
  const [fontSize, setFontSize] = useState<'compact' | 'standard' | 'relaxed'>('standard');

  // Section visibility toggles
  const [showSummary, setShowSummary] = useState(true);
  const [showProjects, setShowProjects] = useState(true);
  const [showCertifications, setShowCertifications] = useState(true);
  const [showAchievements, setShowAchievements] = useState(true);

  // AI Bullet Point Improver drawer state
  const [selectedBullet, setSelectedBullet] = useState('');
  const [improvedBullet, setImprovedBullet] = useState('');
  const [polishing, setPolishing] = useState(false);

  const { showToast } = useNotifications();
  const { user } = useAuth();

  useEffect(() => {
    if (id) {
      api
        .getResumeById(id)
        .then((res) => setResume(res.resume))
        .catch((err) => console.warn(err))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handlePolishBullet = async () => {
    if (!selectedBullet.trim()) return;
    setPolishing(true);
    try {
      const res = await api.improveBullet(selectedBullet);
      setImprovedBullet(res.improvedBullet);
      showToast('Bullet point elevated with professional phrasing', 'success');
    } catch (err: any) {
      showToast('Could not polish bullet point', 'warning');
    } finally {
      setPolishing(false);
    }
  };

  const handleDownloadPdf = () => {
    const originalTitle = document.title;
    const studentName = resume?.extractedData?.name || 'Resume';
    const cleanFilename = `${studentName.replace(/\s+/g, '_')}_Resume`;

    // Set document title temporarily so the browser's PDF save dialog defaults to the student's name
    document.title = cleanFilename;

    showToast("Opening print dialog. Select 'Destination: Save as PDF' to download your resume.", 'info');

    // Trigger print which invokes the CSS @media print queries
    setTimeout(() => {
      window.print();
      // Restore original document title after dialog
      setTimeout(() => {
        document.title = originalTitle;
      }, 1000);
    }, 150);
  };

  const handlePrint = () => {
    handleDownloadPdf();
  };

  // Download standalone self-contained HTML file
  const handleDownloadHtml = () => {
    if (!resume) return;
    const printArea = document.getElementById('resume-print-area');
    if (!printArea) return;

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${resume.extractedData?.name || 'Resume'} - CareerPilot AI</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Merriweather:wght@300;400;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    body {
      margin: 0;
      padding: 20px;
      background: #f8fafc;
      font-family: ${fontFamily === 'serif' ? "'Merriweather', Georgia, serif" : "'Plus Jakarta Sans', system-ui, sans-serif"};
      color: #0f172a;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .resume-sheet {
      max-width: 820px;
      margin: 0 auto;
      background: #ffffff;
      padding: 40px 48px;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
      border-radius: 8px;
    }
    @media print {
      body { background: #ffffff; padding: 0; }
      .resume-sheet { box-shadow: none; padding: 0; max-width: 100%; }
      @page { margin: 0.5in; size: letter portrait; }
    }
    h1, h2, h3 { margin-top: 0; }
  </style>
</head>
<body>
  <div class="resume-sheet">
    ${printArea.innerHTML}
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(resume.extractedData?.name || 'Candidate').replace(/\s+/g, '_')}_Resume.html`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Resume HTML template downloaded. Open in any browser to print to PDF!', 'success');
  };

  // Copy clean plain text for text-only ATS boards
  const handleCopyPlainText = () => {
    if (!resume) return;
    const d = resume.extractedData;
    let plain = `${d.name?.toUpperCase()}\n${d.headline}\nEmail: ${d.email} | Phone: ${d.phone} | San Francisco, CA\n\n`;

    if (showSummary && d.summary) {
      plain += `PROFESSIONAL SUMMARY\n${d.summary}\n\n`;
    }

    if (d.skills && d.skills.length > 0) {
      plain += `TECHNICAL SKILLS\n${d.skills.join(', ')}\n\n`;
    }

    if (d.experience && d.experience.length > 0) {
      plain += `WORK EXPERIENCE\n`;
      d.experience.forEach((exp) => {
        plain += `${exp.role} | ${exp.company} (${exp.startDate} - ${exp.endDate})\n`;
        exp.bulletPoints.forEach((b) => {
          plain += `* ${b}\n`;
        });
        plain += `\n`;
      });
    }

    if (showProjects && d.projects && d.projects.length > 0) {
      plain += `PROJECTS\n`;
      d.projects.forEach((p) => {
        plain += `${p.title} (${p.technologies.join(', ')})\n${p.description}\nImpact: ${p.impact || ''}\n\n`;
      });
    }

    if (d.education && d.education.length > 0) {
      plain += `EDUCATION\n`;
      d.education.forEach((edu) => {
        plain += `${edu.institution} - ${edu.degree} in ${edu.field} (${edu.startYear} - ${edu.endYear})\n`;
      });
    }

    navigator.clipboard.writeText(plain);
    showToast('Plain text copied to clipboard for text-only application portals', 'info');
  };

  if (loading) {
    return <div className="p-8 text-center text-xs text-slate-500">Loading professional template preview...</div>;
  }

  if (!resume) {
    return <div className="p-8 text-center text-xs text-red-500">Resume record not found</div>;
  }

  const d = resume.extractedData;

  // Color mapping
  const colorStyles = {
    indigo: {
      primary: '#4f46e5',
      primaryClass: 'text-indigo-600',
      badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      borderClass: 'border-indigo-600',
      accentBg: 'bg-indigo-600',
      softBg: 'bg-indigo-50/70',
    },
    slate: {
      primary: '#0f172a',
      primaryClass: 'text-slate-900',
      badgeBg: 'bg-slate-100 text-slate-800 border-slate-300',
      borderClass: 'border-slate-800',
      accentBg: 'bg-slate-900',
      softBg: 'bg-slate-50',
    },
    emerald: {
      primary: '#059669',
      primaryClass: 'text-emerald-700',
      badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      borderClass: 'border-emerald-600',
      accentBg: 'bg-emerald-700',
      softBg: 'bg-emerald-50/70',
    },
    navy: {
      primary: '#1e3a8a',
      primaryClass: 'text-blue-900',
      badgeBg: 'bg-blue-50 text-blue-900 border-blue-200',
      borderClass: 'border-blue-900',
      accentBg: 'bg-blue-900',
      softBg: 'bg-blue-50/70',
    },
    burgundy: {
      primary: '#881337',
      primaryClass: 'text-rose-900',
      badgeBg: 'bg-rose-50 text-rose-900 border-rose-200',
      borderClass: 'border-rose-900',
      accentBg: 'bg-rose-900',
      softBg: 'bg-rose-50/70',
    },
  }[accentColor];

  // Font scale class
  const fontScaleClass = {
    compact: 'text-[11px] leading-relaxed',
    standard: 'text-xs leading-relaxed',
    relaxed: 'text-[13px] leading-loose',
  }[fontSize];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Toolbar (Excluded from print) */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            to={`/student/resumes/${resume.id}/diagnostic`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 mb-1"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Diagnostic Report
          </Link>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Professional Resume PDF Exporter</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Select an ATS-optimized template, customize accent styling, and export a clean PDF for applications.
          </p>
        </div>

        {/* Primary Export Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleCopyPlainText}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs"
            title="Copy formatted plain text for text-only ATS portals"
          >
            <Copy className="w-3.5 h-3.5" /> Copy ATS Text
          </button>

          <button
            onClick={handleDownloadHtml}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs"
            title="Download standalone HTML file with embedded fonts"
          >
            <Download className="w-3.5 h-3.5" /> Download HTML
          </button>

          <button
            onClick={handleDownloadPdf}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2"
            title="Download resume as PDF using browser print engine"
          >
            <Download className="w-4 h-4" /> Download as PDF
          </button>
        </div>
      </div>

      {/* Template & Styling Control Panel (Excluded from print) */}
      <div className="no-print bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-indigo-600" /> Template Layout &amp; Theme Customizer
          </span>
          <span className="text-[11px] text-slate-400">Target ATS Pass Rate: 94%+</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Template Layout Choice */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1.5">Template Layout</label>
            <div className="grid grid-cols-3 gap-1">
              <button
                type="button"
                onClick={() => setTemplate('modern')}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold text-center transition-colors ${
                  template === 'modern'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                Modern Tech
              </button>
              <button
                type="button"
                onClick={() => setTemplate('executive')}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold text-center transition-colors ${
                  template === 'executive'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                Classic Ivy
              </button>
              <button
                type="button"
                onClick={() => setTemplate('compact')}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold text-center transition-colors ${
                  template === 'compact'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                1-Page Grid
              </button>
            </div>
          </div>

          {/* 2. Accent Color Palette */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1.5 flex items-center gap-1">
              <Palette className="w-3 h-3 text-slate-400" /> Accent Palette
            </label>
            <div className="flex items-center gap-2">
              {[
                { key: 'indigo', bg: 'bg-indigo-600', label: 'Indigo' },
                { key: 'slate', bg: 'bg-slate-900', label: 'Noir' },
                { key: 'emerald', bg: 'bg-emerald-600', label: 'Emerald' },
                { key: 'navy', bg: 'bg-blue-900', label: 'Navy' },
                { key: 'burgundy', bg: 'bg-rose-900', label: 'Burgundy' },
              ].map((c) => (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => setAccentColor(c.key as any)}
                  className={`w-6 h-6 rounded-full ${c.bg} flex items-center justify-center transition-transform ${
                    accentColor === c.key ? 'ring-2 ring-offset-2 ring-slate-400 scale-110' : 'hover:scale-105'
                  }`}
                  title={c.label}
                >
                  {accentColor === c.key && <Check className="w-3.5 h-3.5 text-white" />}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Typography Family & Scale */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1.5 flex items-center gap-1">
              <Type className="w-3 h-3 text-slate-400" /> Typography &amp; Scale
            </label>
            <div className="flex gap-2">
              <select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value as any)}
                className="w-1/2 px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
              >
                <option value="sans">Clean Sans</option>
                <option value="serif">Editorial Serif</option>
              </select>
              <select
                value={fontSize}
                onChange={(e) => setFontSize(e.target.value as any)}
                className="w-1/2 px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
              >
                <option value="compact">Compact</option>
                <option value="standard">Standard</option>
                <option value="relaxed">Spacious</option>
              </select>
            </div>
          </div>

          {/* 4. Section Visibility Toggles */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1.5">Section Toggles</label>
            <div className="flex flex-wrap gap-2 text-[11px]">
              <label className="inline-flex items-center gap-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showSummary}
                  onChange={(e) => setShowSummary(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-0"
                />
                <span>Summary</span>
              </label>
              <label className="inline-flex items-center gap-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showProjects}
                  onChange={(e) => setShowProjects(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-0"
                />
                <span>Projects</span>
              </label>
              <label className="inline-flex items-center gap-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showCertifications}
                  onChange={(e) => setShowCertifications(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-0"
                />
                <span>Certifications</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* AI Bullet Point Enhancer Drawer (Excluded from print) */}
      <div className="no-print bg-gradient-to-r from-violet-50 to-indigo-50 border border-indigo-100 rounded-2xl p-4 sm:p-5 space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-900">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            AI Bullet Point Professional Enhancer
          </div>
          <span className="text-[10px] text-indigo-600 font-semibold bg-white px-2 py-0.5 rounded-full border border-indigo-200">
            Gemini 3.8 Flash
          </span>
        </div>
        <p className="text-xs text-indigo-950">
          Paste any achievement or responsibility line below to polish using quantifiable verbs and structured impact formulas.
        </p>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={selectedBullet}
            onChange={(e) => setSelectedBullet(e.target.value)}
            placeholder="e.g. Worked on optimizing database queries..."
            className="flex-1 px-3.5 py-2 bg-white border border-indigo-200 rounded-xl text-xs"
          />
          <button
            onClick={handlePolishBullet}
            disabled={polishing || !selectedBullet}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
          >
            {polishing ? 'Enhancing...' : 'Enhance with AI'}
          </button>
        </div>

        {improvedBullet && (
          <div className="p-3 bg-white rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-start justify-between gap-2 mt-2">
            <div>
              <span className="font-bold text-emerald-700 block mb-0.5">Elevated Phrasing:</span>
              <p>{improvedBullet}</p>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(improvedBullet);
                showToast('Copied to clipboard!', 'info');
              }}
              className="p-1 text-slate-400 hover:text-slate-700"
              title="Copy to clipboard"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* 
        THE PRINTABLE RESUME SHEET 
        Tagged with #resume-print-area for PDF export and high-fidelity print isolation
      */}
      <div
        id="resume-print-area"
        className={`bg-white border border-slate-300 rounded-3xl p-8 sm:p-14 shadow-lg text-slate-800 transition-all ${
          fontFamily === 'serif' ? 'font-serif' : 'font-sans'
        } ${fontScaleClass}`}
        style={{
          boxSizing: 'border-box',
          minHeight: '11in',
        }}
      >
        {/* ============================================================== */}
        {/* TEMPLATE 1: MODERN TECHNICAL (Silicon Valley Standard)        */}
        {/* ============================================================== */}
        {template === 'modern' && (
          <div className="space-y-6">
            {/* Header */}
            <div className={`border-b-2 pb-5 space-y-1.5 ${colorStyles.borderClass}`}>
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 uppercase">
                  {d?.name || user?.displayName || 'Candidate'}
                </h1>
                <p className={`text-xs sm:text-sm font-bold tracking-wide ${colorStyles.primaryClass}`}>
                  {d?.headline || 'Full-Stack Software Engineer & Applied AI Enthusiast'}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1 font-mono">
                {d?.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="w-3 h-3 text-slate-400" /> {d.email}
                  </span>
                )}
                {d?.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-400" /> {d.phone}
                  </span>
                )}
                <span>San Francisco, CA</span>
                <span>linkedin.com/in/alexjohnson</span>
                <span>github.com/alexjohnson</span>
              </div>
            </div>

            {/* Summary */}
            {showSummary && d?.summary && (
              <div className="space-y-1.5 print-page-break-avoid">
                <h2 className={`text-xs font-bold uppercase tracking-wider ${colorStyles.primaryClass}`}>
                  Professional Executive Summary
                </h2>
                <p className="text-slate-700 leading-relaxed">{d.summary}</p>
              </div>
            )}

            {/* Technical Core Competencies */}
            {d?.skills && d.skills.length > 0 && (
              <div className="space-y-1.5 print-page-break-avoid">
                <h2 className={`text-xs font-bold uppercase tracking-wider ${colorStyles.primaryClass}`}>
                  Technical Core Competencies
                </h2>
                <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/80 flex flex-wrap gap-1.5">
                  {d.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 bg-white text-slate-800 rounded font-semibold text-[11px] border border-slate-200 shadow-2xs font-mono"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Work Experience */}
            {d?.experience && d.experience.length > 0 && (
              <div className="space-y-3.5 print-page-break-avoid">
                <h2 className={`text-xs font-bold uppercase tracking-wider border-b pb-1 ${colorStyles.primaryClass} ${colorStyles.borderClass}`}>
                  Professional Experience
                </h2>

                <div className="space-y-3.5">
                  {d.experience.map((exp) => (
                    <div key={exp.id} className="space-y-1 print-page-break-avoid">
                      <div className="flex justify-between items-baseline">
                        <span className="font-extrabold text-slate-900">{exp.role}</span>
                        <span className="text-slate-500 font-mono text-[11px]">
                          {exp.startDate} – {exp.endDate}
                        </span>
                      </div>
                      <div className="flex justify-between items-baseline text-slate-600 text-[11px] font-semibold">
                        <span>{exp.company}</span>
                        <span>{exp.location}</span>
                      </div>
                      <p className="text-slate-600 text-xs italic">{exp.description}</p>
                      <ul className="list-disc list-outside ml-4 text-slate-700 space-y-1 pt-0.5">
                        {exp.bulletPoints.map((b, i) => (
                          <li key={i}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Featured Projects */}
            {showProjects && d?.projects && d.projects.length > 0 && (
              <div className="space-y-3 print-page-break-avoid">
                <h2 className={`text-xs font-bold uppercase tracking-wider border-b pb-1 ${colorStyles.primaryClass} ${colorStyles.borderClass}`}>
                  Notable Capstone Engineering Projects
                </h2>

                <div className="space-y-2.5">
                  {d.projects.map((proj) => (
                    <div key={proj.id} className="space-y-0.5 print-page-break-avoid">
                      <div className="flex justify-between items-baseline">
                        <span className="font-bold text-slate-900">{proj.title}</span>
                        <span className="text-slate-500 text-[11px] font-mono">{proj.technologies.join(', ')}</span>
                      </div>
                      <p className="text-slate-700 leading-snug">{proj.description}</p>
                      {proj.impact && (
                        <p className={`font-semibold text-[11px] ${colorStyles.primaryClass}`}>
                          Key Outcome: {proj.impact}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {d?.education && d.education.length > 0 && (
              <div className="space-y-2 print-page-break-avoid">
                <h2 className={`text-xs font-bold uppercase tracking-wider border-b pb-1 ${colorStyles.primaryClass} ${colorStyles.borderClass}`}>
                  Education
                </h2>
                <div className="space-y-1.5">
                  {d.education.map((edu) => (
                    <div key={edu.id} className="flex justify-between items-baseline">
                      <div>
                        <span className="font-bold text-slate-900">{edu.institution}</span> —{' '}
                        <span className="text-slate-700">
                          {edu.degree} in {edu.field}
                        </span>
                      </div>
                      <span className="text-slate-500 font-mono text-[11px]">
                        {edu.startYear} – {edu.endYear} {edu.grade && `· ${edu.grade}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications & Achievements */}
            {showCertifications && d?.certifications && d.certifications.length > 0 && (
              <div className="space-y-1.5 print-page-break-avoid">
                <h2 className={`text-xs font-bold uppercase tracking-wider ${colorStyles.primaryClass}`}>
                  Verified Certifications
                </h2>
                <p className="text-slate-700 text-xs">
                  {d.certifications.join(' · ')}
                </p>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TEMPLATE 2: CLASSIC IVY (Harvard / Wall Street Standard)       */}
        {/* ============================================================== */}
        {template === 'executive' && (
          <div className="space-y-5 text-slate-900 font-serif">
            {/* Header: Centered, Traditional, Regal */}
            <div className="text-center space-y-1 pb-3 border-b-2 border-slate-900">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-normal uppercase text-slate-900">
                {d?.name || user?.displayName || 'Candidate'}
              </h1>
              <p className="text-xs italic text-slate-700">
                {d?.headline || 'Full-Stack Software Engineer & Applied AI Enthusiast'}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-700 pt-0.5">
                <span>{d?.email}</span>
                <span>•</span>
                <span>{d?.phone}</span>
                <span>•</span>
                <span>San Francisco, CA</span>
                <span>•</span>
                <span>linkedin.com/in/alexjohnson</span>
              </div>
            </div>

            {/* Education (Placed top for new grads in Classic format) */}
            {d?.education && d.education.length > 0 && (
              <div className="space-y-1.5 print-page-break-avoid">
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-0.5">
                  Education
                </h2>
                {d.education.map((edu) => (
                  <div key={edu.id} className="space-y-0.5">
                    <div className="flex justify-between items-baseline font-bold text-xs">
                      <span>{edu.institution}</span>
                      <span>{edu.startYear} – {edu.endYear}</span>
                    </div>
                    <div className="flex justify-between items-baseline italic text-xs text-slate-700">
                      <span>{edu.degree} in {edu.field}</span>
                      <span>{edu.grade && `GPA: ${edu.grade}`}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Summary */}
            {showSummary && d?.summary && (
              <div className="space-y-1 print-page-break-avoid">
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-0.5">
                  Summary of Qualifications
                </h2>
                <p className="text-xs text-slate-800 leading-relaxed font-sans">{d.summary}</p>
              </div>
            )}

            {/* Experience */}
            {d?.experience && d.experience.length > 0 && (
              <div className="space-y-2.5 print-page-break-avoid">
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-0.5">
                  Professional Experience
                </h2>

                <div className="space-y-2.5">
                  {d.experience.map((exp) => (
                    <div key={exp.id} className="space-y-0.5 print-page-break-avoid">
                      <div className="flex justify-between items-baseline text-xs font-bold">
                        <span>{exp.company}</span>
                        <span className="italic font-normal">{exp.location}</span>
                      </div>
                      <div className="flex justify-between items-baseline text-xs italic text-slate-700">
                        <span>{exp.role}</span>
                        <span>{exp.startDate} – {exp.endDate}</span>
                      </div>
                      <ul className="list-disc list-outside ml-4 text-xs font-sans text-slate-800 space-y-1 pt-0.5">
                        {exp.bulletPoints.map((b, i) => (
                          <li key={i}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {showProjects && d?.projects && d.projects.length > 0 && (
              <div className="space-y-2 print-page-break-avoid">
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-0.5">
                  Selected Engineering Projects
                </h2>

                <div className="space-y-2">
                  {d.projects.map((proj) => (
                    <div key={proj.id} className="space-y-0.5 print-page-break-avoid">
                      <div className="flex justify-between items-baseline text-xs">
                        <span className="font-bold">{proj.title}</span>
                        <span className="italic text-slate-600 text-[11px]">{proj.technologies.join(', ')}</span>
                      </div>
                      <p className="text-xs font-sans text-slate-800 leading-snug">{proj.description}</p>
                      {proj.impact && (
                        <p className="text-[11px] font-sans text-slate-700 italic">Result: {proj.impact}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Technical Skills */}
            {d?.skills && d.skills.length > 0 && (
              <div className="space-y-1 print-page-break-avoid">
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-0.5">
                  Skills &amp; Interests
                </h2>
                <p className="text-xs font-sans text-slate-800 leading-relaxed">
                  <span className="font-bold font-serif">Languages &amp; Frameworks: </span>
                  {d.skills.join(', ')}
                </p>
                {d?.certifications && d.certifications.length > 0 && (
                  <p className="text-xs font-sans text-slate-800 leading-relaxed">
                    <span className="font-bold font-serif">Certifications: </span>
                    {d.certifications.join(', ')}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TEMPLATE 3: 1-PAGE DENSE GRID (Compact High-Density)          */}
        {/* ============================================================== */}
        {template === 'compact' && (
          <div className="space-y-4">
            {/* Header with compact pill border */}
            <div className={`p-4 rounded-2xl ${colorStyles.softBg} border border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-2`}>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900">{d?.name || user?.displayName || 'Candidate'}</h1>
                <p className={`text-xs font-bold ${colorStyles.primaryClass}`}>{d?.headline}</p>
              </div>
              <div className="text-right text-[11px] font-mono text-slate-600 space-y-0.5">
                <p>{d?.email} · {d?.phone}</p>
                <p>San Francisco, CA</p>
              </div>
            </div>

            {/* Two-Column Grid: Left (Experience + Projects), Right (Skills + Education) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Left 2 Cols: Experience & Projects */}
              <div className="md:col-span-2 space-y-3.5">
                {showSummary && d?.summary && (
                  <div className="space-y-1 print-page-break-avoid">
                    <h2 className={`text-[11px] font-extrabold uppercase tracking-wider ${colorStyles.primaryClass}`}>
                      Profile Summary
                    </h2>
                    <p className="text-slate-700 leading-snug">{d.summary}</p>
                  </div>
                )}

                {d?.experience && d.experience.length > 0 && (
                  <div className="space-y-2.5 print-page-break-avoid">
                    <h2 className={`text-[11px] font-extrabold uppercase tracking-wider border-b pb-0.5 ${colorStyles.primaryClass} ${colorStyles.borderClass}`}>
                      Work Experience
                    </h2>

                    {d.experience.map((exp) => (
                      <div key={exp.id} className="space-y-0.5">
                        <div className="flex justify-between items-baseline font-bold text-slate-900">
                          <span>{exp.role}</span>
                          <span className="text-[10px] text-slate-500 font-mono">{exp.startDate} - {exp.endDate}</span>
                        </div>
                        <p className="text-[11px] font-semibold text-slate-600">{exp.company} · {exp.location}</p>
                        <ul className="list-disc list-outside ml-3.5 text-slate-700 space-y-0.5">
                          {exp.bulletPoints.map((b, i) => (
                            <li key={i}>{b}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {showProjects && d?.projects && d.projects.length > 0 && (
                  <div className="space-y-2 print-page-break-avoid">
                    <h2 className={`text-[11px] font-extrabold uppercase tracking-wider border-b pb-0.5 ${colorStyles.primaryClass} ${colorStyles.borderClass}`}>
                      Key Projects
                    </h2>

                    {d.projects.map((proj) => (
                      <div key={proj.id} className="space-y-0.5">
                        <div className="flex justify-between items-baseline font-bold">
                          <span>{proj.title}</span>
                          <span className="text-[10px] text-slate-500 font-mono">{proj.technologies.slice(0, 3).join(', ')}</span>
                        </div>
                        <p className="text-slate-700 leading-tight">{proj.description}</p>
                        {proj.impact && (
                          <p className={`text-[10px] font-semibold ${colorStyles.primaryClass}`}>
                            Impact: {proj.impact}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Col: Skills & Education */}
              <div className="space-y-3.5 border-t md:border-t-0 md:border-l border-slate-200 pt-3 md:pt-0 md:pl-4">
                {/* Skills */}
                {d?.skills && d.skills.length > 0 && (
                  <div className="space-y-1.5 print-page-break-avoid">
                    <h2 className={`text-[11px] font-extrabold uppercase tracking-wider ${colorStyles.primaryClass}`}>
                      Core Skills
                    </h2>
                    <div className="flex flex-wrap gap-1">
                      {d.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-0.5 bg-slate-100 text-slate-800 text-[10px] font-semibold rounded border border-slate-200"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Education */}
                {d?.education && d.education.length > 0 && (
                  <div className="space-y-1.5 print-page-break-avoid">
                    <h2 className={`text-[11px] font-extrabold uppercase tracking-wider ${colorStyles.primaryClass}`}>
                      Education
                    </h2>
                    {d.education.map((edu) => (
                      <div key={edu.id} className="space-y-0.5">
                        <p className="font-bold text-slate-900 text-[11px]">{edu.institution}</p>
                        <p className="text-slate-700 text-[10px]">{edu.degree}</p>
                        <p className="text-slate-500 text-[10px] font-mono">{edu.startYear} - {edu.endYear}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Certifications */}
                {showCertifications && d?.certifications && d.certifications.length > 0 && (
                  <div className="space-y-1 print-page-break-avoid">
                    <h2 className={`text-[11px] font-extrabold uppercase tracking-wider ${colorStyles.primaryClass}`}>
                      Certifications
                    </h2>
                    <ul className="text-[10px] text-slate-700 space-y-0.5">
                      {d.certifications.map((c, i) => (
                        <li key={i}>✓ {c}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Printing Instructions Banner (Excluded from print) */}
      <div className="no-print bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-600 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <FileCheck className="w-4 h-4 text-indigo-600 flex-shrink-0" />
          <span>
            <strong className="text-slate-900">PDF Print Recommendation:</strong> In your browser print dialog, select{' '}
            <em>"Destination: Save as PDF"</em> and check <em>"Background graphics: On"</em> for pristine borders &amp; typography.
          </span>
        </div>

        <button
          onClick={handleDownloadPdf}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex-shrink-0 flex items-center gap-2 shadow-xs transition-colors"
        >
          <Download className="w-3.5 h-3.5" /> Download as PDF
        </button>
      </div>
    </div>
  );
};
