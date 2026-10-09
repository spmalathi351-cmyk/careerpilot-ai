import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { CareerRoadmapMilestone } from '../../types';
import { useNotifications } from '../../contexts/NotificationContext';
import {
  Layers,
  CheckCircle2,
  Clock,
  BookOpen,
  FolderGit2,
  Sparkles,
  ArrowRight,
  Target,
} from 'lucide-react';

export const CareerRoadmapPage: React.FC = () => {
  const [milestones, setMilestones] = useState<CareerRoadmapMilestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [targetRole, setTargetRole] = useState('Full-Stack Software Engineer');
  const [regenerating, setRegenerating] = useState(false);

  const { showToast } = useNotifications();

  const loadRoadmap = () => {
    api
      .getCareerRoadmap()
      .then((res) => setMilestones(res.roadmap))
      .catch((err) => console.warn(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadRoadmap();
  }, []);

  const handleToggle = async (milestoneId: string) => {
    try {
      const res = await api.toggleRoadmapMilestone(milestoneId);
      setMilestones(res.roadmap);
      showToast('Milestone progress updated', 'success');
    } catch (e: any) {
      showToast('Failed to update progress', 'warning');
    }
  };

  const handleRegenerate = async () => {
    setRegenerating(true);
    try {
      const res = await api.generateCustomRoadmap(targetRole);
      setMilestones(res.roadmap);
      showToast(res.message, 'success');
    } catch (e: any) {
      showToast('Could not regenerate roadmap', 'warning');
    } finally {
      setRegenerating(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-xs text-slate-500">Generating 30-60-90 Day career roadmap...</div>;
  }

  if (milestones.length === 0) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-3xl p-10 shadow-xs text-center space-y-4 max-w-2xl mx-auto my-8">
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto">
          <Layers className="w-7 h-7" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">No Career Roadmap Generated Yet</h2>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            Upload your resume to unlock your ATS score, profile insights, and career recommendations.
          </p>
        </div>
        <Link
          to="/student/resumes/upload"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Sparkles className="w-4 h-4" /> Upload Resume
        </Link>
      </div>
    );
  }

  const completedCount = milestones.filter((m) => m.completed).length;
  const progressPercent = Math.round((completedCount / Math.max(1, milestones.length)) * 100);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header & Role Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">30-60-90 Day Career Roadmap</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Structured milestone phases designed to bridge skill gaps and achieve top-tier interview readiness.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold"
          >
            <option value="Full-Stack Software Engineer">Full-Stack Software Engineer</option>
            <option value="Generative AI & LLM Solutions Engineer">Generative AI &amp; LLM Engineer</option>
            <option value="Backend Systems & Cloud Platform Engineer">Backend Systems Engineer</option>
            <option value="Machine Learning Platform Engineer">Machine Learning Engineer</option>
          </select>

          <button
            onClick={handleRegenerate}
            disabled={regenerating}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {regenerating ? 'Regenerating...' : 'Regenerate'}
          </button>
        </div>
      </div>

      {/* Progress Bar Header Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Roadmap Completion</span>
          <p className="text-lg font-extrabold text-slate-900">
            {completedCount} of {milestones.length} Phases Completed ({progressPercent}%)
          </p>
        </div>

        <div className="w-full sm:w-64 h-3 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-600 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Phased Milestones List */}
      <div className="space-y-6">
        {milestones.map((m) => (
          <div
            key={m.id}
            className={`bg-white border rounded-3xl p-6 sm:p-8 shadow-xs transition-all space-y-6 ${
              m.completed ? 'border-emerald-300 ring-2 ring-emerald-500/10' : 'border-slate-200/80'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 font-extrabold text-xs rounded-xl uppercase">
                  {m.dayBracket}
                </span>
                <h2 className="text-base font-bold text-slate-900">{m.phaseTitle}</h2>
              </div>

              <button
                onClick={() => handleToggle(m.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                  m.completed
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200'
                }`}
              >
                <CheckCircle2 className={`w-4 h-4 ${m.completed ? 'text-emerald-600' : 'text-slate-400'}`} />
                {m.completed ? 'Completed Milestone' : 'Mark Phase Complete'}
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">{m.objective}</p>

            {/* Target Skills in this bracket */}
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Core Technologies Focused in This Phase:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {m.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded-lg text-xs font-semibold border border-slate-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Structured Topics & Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Learning Topics */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <h3 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-600" /> Curated Learning Curriculum
                </h3>
                <div className="space-y-2 pt-1">
                  {m.learningTopics.map((top, idx) => (
                    <div key={idx} className="flex justify-between items-start text-xs">
                      <div>
                        <p className="font-semibold text-slate-800">{top.title}</p>
                        <p className="text-[11px] text-slate-500">{top.source}</p>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 flex-shrink-0 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {top.estimatedHours} hrs
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Capstone Project Deliverable */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <h3 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <FolderGit2 className="w-3.5 h-3.5 text-indigo-600" /> Phase Capstone Deliverable
                </h3>
                {m.projects.map((p, idx) => (
                  <div key={idx} className="space-y-1.5 pt-1 text-xs">
                    <p className="font-bold text-slate-900">{p.title}</p>
                    <p className="text-slate-600 leading-snug">{p.description}</p>
                    <div className="p-2 bg-white rounded-lg border border-slate-200 text-indigo-700 font-medium text-[11px]">
                      📦 Required Artifact: {p.deliverable}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Practice Tasks Checklist */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Verification &amp; Practice Tasks:
              </span>
              <div className="space-y-1.5">
                {m.practiceTasks.map((task, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                    <span>{task}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
