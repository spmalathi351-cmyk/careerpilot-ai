import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { Application, Job, Resume, ApplicationStage } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useNotifications } from '../../contexts/NotificationContext';
import {
  ArrowLeft,
  Building,
  MapPin,
  Calendar,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Video,
  ChevronRight,
} from 'lucide-react';

export const ApplicationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [app, setApp] = useState<Application | null>(null);
  const [job, setJob] = useState<Job | null>(null);
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);

  const { showToast } = useNotifications();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      api
        .getApplicationById(id)
        .then((res) => {
          setApp(res.application);
          if (res.job) setJob(res.job);
          if (res.resume) setResume(res.resume);
        })
        .catch((err) => console.warn(err))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleAdvanceStage = async (newStage: ApplicationStage) => {
    if (!id) return;
    try {
      const res = await api.updateApplicationStage(id, newStage, `Candidate stage advanced to ${newStage}`);
      setApp(res.application);
      showToast(`Status updated to ${newStage}`, 'success');
    } catch (e: any) {
      showToast('Could not update stage', 'warning');
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-xs text-slate-500">Loading application details...</div>;
  }

  if (!app) {
    return <div className="p-8 text-center text-xs text-red-500">Application not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link
        to="/student/applications"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Applications List
      </Link>

      {/* Main Header Card */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <img
            src={app.companyLogo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=150'}
            alt={app.companyName}
            className="w-16 h-16 rounded-2xl object-cover border border-slate-200"
          />

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">{app.jobTitle}</h1>
              <StatusBadge status={app.stage} />
            </div>

            <p className="text-xs text-slate-600 flex items-center gap-2">
              <span className="font-semibold text-slate-900">{app.companyName}</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" /> {app.jobLocation}
              </span>
            </p>

            <p className="text-[11px] text-slate-400">
              Submitted on {new Date(app.appliedAt).toLocaleDateString()} · Estimated Match: {app.matchScore}%
            </p>
          </div>
        </div>

        {/* Quick actions for testing stages */}
        <div className="flex flex-col gap-2">
          <span className="text-[10px] uppercase font-bold text-slate-400">Advance Stage (Demo):</span>
          <div className="flex flex-wrap gap-1.5">
            {(['Applied', 'Screening', 'Interview', 'Offer', 'Rejected'] as ApplicationStage[]).map((stage) => (
              <button
                key={stage}
                onClick={() => handleAdvanceStage(stage)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                  app.stage === stage
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {stage}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Interview Schedule Callout */}
      {app.interviewScheduled && (
        <div className="bg-indigo-900 text-white rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] uppercase tracking-wider font-bold text-indigo-300 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> Scheduled Interview
            </span>
            <p className="text-sm font-bold">Technical Engineering Panel</p>
            <p className="text-xs text-indigo-200">
              Confirmed for {new Date(app.interviewScheduled).toLocaleString()}
            </p>
          </div>

          <Link
            to="/student/interview-prep"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5 self-start sm:self-auto"
          >
            Launch Interview Prep Simulator <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Timeline & Progress History */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Application Progression Timeline</h2>

        <div className="relative pl-6 border-l-2 border-indigo-200 space-y-6 pt-2">
          {app.timeline.map((event) => (
            <div key={event.id} className="relative">
              <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-indigo-600 ring-4 ring-white" />
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-900">{event.title}</p>
                  <span className="text-[10px] text-slate-400">
                    {new Date(event.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-slate-600">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Target Job Details */}
      {job && (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Target Role Requirements</h2>

          <div className="space-y-3 text-xs text-slate-700">
            <p className="leading-relaxed">{job.description}</p>

            <div>
              <span className="font-bold text-slate-900 block mb-1.5">Required Skills:</span>
              <div className="flex flex-wrap gap-1.5">
                {job.requiredSkills.map((sk) => (
                  <span key={sk} className="px-2.5 py-1 bg-slate-100 rounded-lg font-semibold text-slate-800">
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="font-bold text-slate-900 block mb-1.5">Key Responsibilities:</span>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                {job.responsibilities.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
