import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { MetricCard } from '../../components/common/MetricCard';
import { ScoreGauge } from '../../components/common/ScoreGauge';
import { StatusBadge } from '../../components/common/StatusBadge';
import { JobRecommendationEngine } from '../../components/student/JobRecommendationEngine';
import {
  FileText,
  Target,
  Briefcase,
  Sparkles,
  ArrowRight,
  Compass,
  Calendar,
  Layers,
  ChevronRight,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Clock,
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getStudentDashboard()
      .then((res) => setData(res))
      .catch((err) => console.warn('Dashboard fetch warning:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-28 bg-slate-200 rounded-3xl" />
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-slate-200 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const primaryResume = data?.primaryResume;
  const hasResume = !!primaryResume && data?.hasResume !== false;
  const atsScore = hasResume && typeof data?.latestAtsScore === 'number' ? data.latestAtsScore : null;
  const readiness = hasResume ? (data?.readinessScore || 0) : 0;
  const completeness = data?.profileCompleteness || 0;
  const appsSummary = data?.applicationsSummary || { total: 0, applied: 0, screening: 0, interview: 0, offer: 0 };
  const recommendedRoles = data?.recommendedRoles || [];
  const skillGaps = data?.skillGaps || [];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/30 border border-indigo-400/30 rounded-full text-indigo-200 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              AI Career Copilot Active
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.displayName || 'Student'}!
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200 max-w-xl">
              {hasResume && atsScore !== null ? (
                <>
                  Your profile is {completeness}% complete. Your primary resume is calibrated with an ATS score of{' '}
                  <span className="font-bold text-white">{atsScore}/100</span>.
                </>
              ) : (
                'Upload your resume to unlock your ATS score, profile insights, and career recommendations.'
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/student/resumes/upload"
              className="px-4 py-2.5 bg-white text-indigo-900 hover:bg-indigo-50 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
            >
              <FileText className="w-4 h-4 text-indigo-600" /> Upload Resume
            </Link>
            <Link
              to="/student/interview-prep"
              className="px-4 py-2.5 bg-indigo-600/80 hover:bg-indigo-600 border border-indigo-400/40 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" /> Practice Interview
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="ATS Compatibility"
          value={hasResume && atsScore !== null ? `${atsScore}%` : 'Not Calibrated'}
          subtitle={hasResume ? (primaryResume?.filename || 'Primary Resume Analyzed') : 'Upload resume to calculate'}
          icon={Target}
          trend={hasResume && atsScore !== null ? { value: `Score: ${atsScore}/100`, positive: atsScore >= 80 } : undefined}
          accentColor={hasResume ? 'emerald' : 'slate'}
          onClick={() => navigate(hasResume ? '/student/ats-simulator' : '/student/resumes/upload')}
        />

        <MetricCard
          title="Career Readiness"
          value={hasResume ? `${readiness}/100` : 'Not Available'}
          subtitle={hasResume ? 'Profile & Resume Analyzed' : 'Upload resume to calculate'}
          icon={TrendingUp}
          accentColor={hasResume ? 'indigo' : 'slate'}
          onClick={() => navigate(hasResume ? '/student/career-guidance' : '/student/resumes/upload')}
        />

        <MetricCard
          title="Active Applications"
          value={appsSummary.total}
          subtitle={`${appsSummary.interview || 0} Interview, ${appsSummary.screening || 0} Screening`}
          icon={Briefcase}
          accentColor="blue"
          onClick={() => navigate('/student/applications')}
        />

        <MetricCard
          title="Profile Health"
          value={`${completeness}%`}
          subtitle="Education, Experience & Projects verified"
          icon={CheckCircle2}
          accentColor="violet"
          onClick={() => navigate('/student/profile')}
        />
      </div>

      {/* Quick Action Navigation Buttons */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
          Quick Actions &amp; Guided Workflows
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <Link
            to="/student/resumes/upload"
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 hover:bg-indigo-50/60 border border-slate-200/70 hover:border-indigo-200 text-center transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <FileText className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-slate-800">Upload Resume</span>
          </Link>

          <Link
            to="/student/resume-analysis"
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 hover:bg-indigo-50/60 border border-slate-200/70 hover:border-indigo-200 text-center transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-slate-800">AI Analysis</span>
          </Link>

          <Link
            to="/student/ats-simulator"
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 hover:bg-indigo-50/60 border border-slate-200/70 hover:border-indigo-200 text-center transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Target className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-slate-800">Check ATS</span>
          </Link>

          <Link
            to="/student/career-guidance"
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 hover:bg-indigo-50/60 border border-slate-200/70 hover:border-indigo-200 text-center transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-violet-100 text-violet-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Compass className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-slate-800">Career Paths</span>
          </Link>

          <Link
            to="/student/career-guidance/roadmap"
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 hover:bg-indigo-50/60 border border-slate-200/70 hover:border-indigo-200 text-center transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Layers className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-slate-800">Roadmap (90D)</span>
          </Link>

          <Link
            to="/student/interview-prep"
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 hover:bg-indigo-50/60 border border-slate-200/70 hover:border-indigo-200 text-center transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-slate-800">Mock Interview</span>
          </Link>
        </div>
      </div>

      {/* AI Job Recommendation & Match Engine */}
      <JobRecommendationEngine />

      {/* Main Grid: ATS Diagnostic & Recommended Career Paths */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): ATS Diagnostic Snapshot + Recent Applications */}
        <div className="lg:col-span-2 space-y-6">
          {/* ATS Gauge Card */}
          {hasResume && atsScore !== null && primaryResume ? (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-base text-slate-900">ATS Resume Diagnostic</h3>
                  <p className="text-xs text-slate-500">{primaryResume.filename}</p>
                </div>
                <Link
                  to={`/student/resumes/${primaryResume.id}/diagnostic`}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                >
                  Full Diagnostic Report <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
                <div className="flex justify-center sm:justify-start">
                  <ScoreGauge score={atsScore} label="Overall Match" size="md" />
                </div>

                <div className="sm:col-span-2 space-y-3">
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                      <span>Keyword Density</span>
                      <span className="text-indigo-600 font-bold">{primaryResume.scores?.keywordMatch || 0}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 rounded-full"
                        style={{ width: `${primaryResume.scores?.keywordMatch || 0}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                      <span>Formatting &amp; Parseability</span>
                      <span className="text-emerald-600 font-bold">{primaryResume.scores?.formattingScore || 0}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${primaryResume.scores?.formattingScore || 0}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                      <span>Experience Relevance</span>
                      <span className="text-blue-600 font-bold">{primaryResume.scores?.experienceRelevance || 0}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${primaryResume.scores?.experienceRelevance || 0}%` }}
                      />
                    </div>
                  </div>

                  {skillGaps.length > 0 && (
                    <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
                      <span className="text-slate-500 font-medium">Recommended Additions:</span>
                      {skillGaps.slice(0, 3).map((skill: string) => (
                        <span key={skill} className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-md text-[11px] font-semibold">
                          +{skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-8 shadow-xs text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">No ATS Score Available</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
                  Upload your resume to unlock your ATS score, profile insights, and career recommendations.
                </p>
              </div>
              <Link
                to="/student/resumes/upload"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors shadow-sm"
              >
                <FileText className="w-4 h-4" /> Upload Resume
              </Link>
            </div>
          )}

          {/* Recent Applications Pipeline */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">Application Pipeline Status</h3>
              <Link to="/student/applications" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                View All ({appsSummary.total}) <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {(data?.recentApplications || []).map((app: any) => (
                <div
                  key={app.id}
                  onClick={() => navigate(`/student/applications/${app.id}`)}
                  className="py-3 flex items-center justify-between hover:bg-slate-50 -mx-2 px-2 rounded-xl cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={app.companyLogo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=150'}
                      alt={app.companyName}
                      className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-900">{app.jobTitle}</p>
                      <p className="text-[11px] text-slate-500">{app.companyName} · {app.jobLocation}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <StatusBadge status={app.stage} size="sm" />
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: AI Recommendations & Upcoming Interviews */}
        <div className="space-y-6">
          {/* Upcoming Interview Card */}
          <div className="bg-indigo-900 text-white rounded-2xl p-5 shadow-xs border border-indigo-800">
            <div className="flex items-center gap-2 mb-3 text-indigo-300 text-xs font-bold uppercase tracking-wider">
              <Calendar className="w-4 h-4" />
              Next Scheduled Round
            </div>
            <p className="text-base font-bold">Technical Interview Panel</p>
            <p className="text-xs text-indigo-200 mt-0.5">CareerPilot Demo Technologies</p>

            <div className="mt-4 p-3 bg-indigo-950/60 rounded-xl border border-indigo-700/50 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-indigo-200">
                <Clock className="w-4 h-4 text-indigo-400" />
                <span>Oct 10, 2026 · 3:00 PM PST</span>
              </div>
              <span className="font-semibold text-emerald-400">Confirmed</span>
            </div>

            <Link
              to="/student/interview-prep"
              className="mt-4 w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              Start Prep Mode <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Recommended Career Roles */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">Recommended Roles</h3>
              <Link to="/student/career-guidance" className="text-xs text-indigo-600 font-semibold hover:underline">
                Explore All
              </Link>
            </div>

            <div className="space-y-3">
              {recommendedRoles.slice(0, 3).map((roleItem: any) => (
                <div
                  key={roleItem.roleId}
                  onClick={() => navigate('/student/career-guidance')}
                  className="p-3 bg-slate-50 hover:bg-indigo-50/50 border border-slate-200/70 rounded-xl cursor-pointer transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-900">{roleItem.roleTitle}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{roleItem.averageSalary}</p>
                    </div>
                    <span className="text-xs font-extrabold text-indigo-600 bg-white px-2 py-0.5 rounded-md border border-slate-200 shadow-2xs">
                      {roleItem.fitPercentage}% Fit
                    </span>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-1">
                    {roleItem.requiredSkills.slice(0, 3).map((sk: string) => (
                      <span key={sk} className="text-[10px] text-slate-600 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
