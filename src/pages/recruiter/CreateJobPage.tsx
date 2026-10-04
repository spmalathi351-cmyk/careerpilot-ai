import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { useNotifications } from '../../contexts/NotificationContext';
import { Sparkles, PlusCircle, ArrowLeft, Plus, X, Eye, CheckCircle2 } from 'lucide-react';

export const CreateJobPage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('San Francisco, CA (Hybrid)');
  const [employmentType, setEmploymentType] = useState<'Full-time' | 'Internship' | 'Contract' | 'Remote'>('Full-time');
  const [experience, setExperience] = useState('1-3 Years');
  const [education, setEducation] = useState('B.S. in Computer Science or related STEM degree');
  const [salaryRange, setSalaryRange] = useState('$115,000 - $145,000');
  const [deadline, setDeadline] = useState('2026-12-31');
  const [description, setDescription] = useState('');

  const [requiredSkills, setRequiredSkills] = useState<string[]>(['TypeScript', 'React', 'Node.js', 'PostgreSQL']);
  const [newReqSkill, setNewReqSkill] = useState('');

  const [preferredSkills, setPreferredSkills] = useState<string[]>(['Docker', 'Gemini AI', 'Tailwind CSS']);
  const [newPrefSkill, setNewPrefSkill] = useState('');

  const [responsibilities, setResponsibilities] = useState<string[]>([
    'Design and build high-performance full-stack web applications and microservices.',
    'Integrate modern Generative AI models into production workflows with structured outputs.',
    'Optimize database queries and API endpoints for sub-100ms response targets.',
  ]);
  const [newResp, setNewResp] = useState('');

  const [loading, setLoading] = useState(false);
  const [generatingDesc, setGeneratingDesc] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const { showToast } = useNotifications();
  const navigate = useNavigate();

  const handleAddReqSkill = () => {
    if (newReqSkill.trim() && !requiredSkills.includes(newReqSkill.trim())) {
      setRequiredSkills([...requiredSkills, newReqSkill.trim()]);
      setNewReqSkill('');
    }
  };

  const handleAddPrefSkill = () => {
    if (newPrefSkill.trim() && !preferredSkills.includes(newPrefSkill.trim())) {
      setPreferredSkills([...preferredSkills, newPrefSkill.trim()]);
      setNewPrefSkill('');
    }
  };

  const handleAddResp = () => {
    if (newResp.trim()) {
      setResponsibilities([...responsibilities, newResp.trim()]);
      setNewResp('');
    }
  };

  const handleGenerateAI = async () => {
    if (!title) {
      showToast('Please specify a Job Title first', 'warning');
      return;
    }
    setGeneratingDesc(true);
    try {
      const res = await api.generateJobDescription({
        title,
        skills: requiredSkills,
        experienceLevel: experience,
      });
      if (res.result) {
        setDescription(res.result.description);
        if (res.result.responsibilities) setResponsibilities(res.result.responsibilities);
        if (res.result.requiredSkills) setRequiredSkills(res.result.requiredSkills);
        if (res.result.preferredSkills) setPreferredSkills(res.result.preferredSkills);
        showToast('Job description synthesized with Gemini AI', 'success');
      }
    } catch (err: any) {
      showToast('Could not generate description', 'warning');
    } finally {
      setGeneratingDesc(false);
    }
  };

  const handleSave = async (status: 'draft' | 'published') => {
    if (!title || !description) {
      showToast('Title and Description are required', 'warning');
      return;
    }

    setLoading(true);
    try {
      const res = await api.createJob({
        title,
        description,
        responsibilities,
        requiredSkills,
        preferredSkills,
        experience,
        education,
        location,
        employmentType,
        salaryRange,
        deadline,
        status,
      });
      showToast(status === 'published' ? 'Job published successfully!' : 'Draft saved', 'success');
      navigate('/recruiter/dashboard');
    } catch (err: any) {
      showToast('Failed to create job posting', 'warning');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => navigate('/recruiter/dashboard')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 mb-1"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Create &amp; Publish Job Opening</h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPreviewMode(!previewMode)}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" /> {previewMode ? 'Edit Mode' : 'Preview Posting'}
          </button>
          <button
            type="button"
            onClick={() => handleSave('draft')}
            disabled={loading}
            className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold"
          >
            Save Draft
          </button>
          <button
            type="button"
            onClick={() => handleSave('published')}
            disabled={loading}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" /> {loading ? 'Publishing...' : 'Publish Job'}
          </button>
        </div>
      </div>

      {!previewMode ? (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Core Position Details</h2>
            <button
              type="button"
              onClick={handleGenerateAI}
              disabled={generatingDesc}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-violet-50 hover:bg-violet-100 text-violet-700 border border-violet-200 rounded-lg text-xs font-bold"
            >
              <Sparkles className="w-3.5 h-3.5 text-violet-600" />
              {generatingDesc ? 'Synthesizing...' : 'Generate with Gemini AI'}
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Job Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Full-Stack AI Solutions Engineer"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Employment Type</label>
                <select
                  value={employmentType}
                  onChange={(e) => setEmploymentType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Internship">Internship</option>
                  <option value="Contract">Contract</option>
                  <option value="Remote">Remote</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Salary Range</label>
                <input
                  type="text"
                  value={salaryRange}
                  onChange={(e) => setSalaryRange(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Job Overview &amp; Mission *</label>
              <textarea
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the team mission, product focus, and candidate impact..."
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs leading-relaxed"
              />
            </div>

            {/* Required Skills */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Required Technical Skills</label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {requiredSkills.map((sk) => (
                  <span
                    key={sk}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-800 rounded-lg text-xs font-semibold border border-slate-200"
                  >
                    {sk}
                    <button
                      type="button"
                      onClick={() => setRequiredSkills(requiredSkills.filter((s) => s !== sk))}
                      className="text-slate-400 hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2 max-w-sm">
                <input
                  type="text"
                  value={newReqSkill}
                  onChange={(e) => setNewReqSkill(e.target.value)}
                  placeholder="Add required skill"
                  className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddReqSkill}
                  className="px-3 py-1.5 bg-slate-800 text-white rounded-xl text-xs font-semibold"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Responsibilities */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Key Responsibilities</label>
              <ul className="space-y-1.5 mb-2 text-xs">
                {responsibilities.map((r, i) => (
                  <li key={i} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-200/80">
                    <span>{r}</span>
                    <button
                      type="button"
                      onClick={() => setResponsibilities(responsibilities.filter((_, idx) => idx !== i))}
                      className="text-slate-400 hover:text-red-600 ml-2"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </li>
                ))}
              </ul>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newResp}
                  onChange={(e) => setNewResp(e.target.value)}
                  placeholder="Add responsibility bullet"
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddResp}
                  className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-semibold"
                >
                  Add Bullet
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Preview Card */
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-bold text-indigo-600 uppercase">{employmentType} · {location}</span>
            <h2 className="text-2xl font-extrabold text-slate-900 mt-1">{title || 'Untitled Opening'}</h2>
            <p className="text-xs text-slate-500 mt-0.5">Compensation: {salaryRange}</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Position Overview</h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{description || 'No description provided.'}</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Required Competencies</h3>
            <div className="flex flex-wrap gap-1.5">
              {requiredSkills.map((sk) => (
                <span key={sk} className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-semibold">
                  {sk}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Responsibilities</h3>
            <ul className="list-disc list-inside text-xs text-slate-700 space-y-1">
              {responsibilities.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
