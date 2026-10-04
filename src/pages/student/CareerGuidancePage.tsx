import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { CareerRoleRecommendation } from '../../types';
import {
  Compass,
  Sparkles,
  TrendingUp,
  Layers,
  ArrowRight,
  Code2,
  AlertCircle,
  Briefcase,
  CheckCircle2,
} from 'lucide-react';

export const CareerGuidancePage: React.FC = () => {
  const [recommendations, setRecommendations] = useState<CareerRoleRecommendation[]>([]);
  const [currentSkills, setCurrentSkills] = useState<string[]>([]);
  const [readinessScore, setReadinessScore] = useState(85);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .getCareerGuidance()
      .then((res) => {
        setRecommendations(res.recommendations);
        setCurrentSkills(res.currentSkills);
        setReadinessScore(res.readinessScore);
      })
      .catch((err) => console.warn(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-xs text-slate-500">Synthesizing career recommendations...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">AI Career Guidance &amp; Role Fit</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Personalized role alignment calculated from your verified skills, projects, and target engineering disciplines.
          </p>
        </div>

        <Link
          to="/student/career-guidance/roadmap"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
        >
          <Layers className="w-4 h-4" /> Open 30-60-90 Day Roadmap
        </Link>
      </div>

      {/* Advisory Banner */}
      <div className="p-4 bg-slate-100 border border-slate-200 rounded-2xl text-xs text-slate-700 flex items-start gap-3">
        <AlertCircle className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
        <p>
          <span className="font-bold text-slate-900">Reference Benchmark Notice:</span> Career alignment percentages and
          salary compensation bands are derived from simulated industry benchmark datasets. Employment offers are dependent
          on formal company interviews.
        </p>
      </div>

      {/* Career Snapshot Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Current Validated Skills</span>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {currentSkills.map((s) => (
              <span key={s} className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded-lg text-xs font-semibold border border-slate-200">
                {s}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4 flex-shrink-0 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
          <div className="text-right">
            <span className="text-xs text-slate-400 font-semibold block">Composite Readiness</span>
            <span className="text-2xl font-black text-indigo-600">{readinessScore}/100</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Role Recommendation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recommendations.map((role) => (
          <div
            key={role.roleId}
            className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-5 hover:shadow-md transition-shadow"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">{role.roleTitle}</h3>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 font-medium">
                    <span>{role.averageSalary}</span>
                    <span>·</span>
                    <span className="text-emerald-600 font-bold">{role.demandLevel} Demand</span>
                  </div>
                </div>

                <div className="px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 font-black text-sm">
                  {role.fitPercentage}% Fit
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{role.description}</p>

              {/* Skills Overlap */}
              <div className="space-y-2">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Matching Skills Detected:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {role.currentSkills.map((sk) => (
                      <span key={sk} className="text-[11px] font-semibold px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md">
                        ✓ {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block mb-1">
                    Target Skill Gaps:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {role.missingSkills.map((sk) => (
                      <span key={sk} className="text-[11px] font-semibold px-2 py-0.5 bg-amber-50 text-amber-900 border border-amber-200 rounded-md">
                        + {sk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Suggested Learning Areas */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                <span className="text-[11px] font-bold text-slate-700 block">Recommended Next Steps:</span>
                <ul className="text-xs text-slate-600 space-y-1">
                  {role.learningPathRecommendations.map((lp, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-indigo-600 font-bold">•</span>
                      <span>{lp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => navigate('/student/career-guidance/roadmap')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                Generate Custom Roadmap for {role.roleTitle} <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
