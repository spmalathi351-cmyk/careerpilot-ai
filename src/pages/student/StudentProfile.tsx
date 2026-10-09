import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { StudentProfile as IStudentProfile, User } from '../../types';
import {
  User as UserIcon,
  MapPin,
  Mail,
  Phone,
  GraduationCap,
  Briefcase,
  Code2,
  Award,
  Edit,
  ExternalLink,
  Target,
  Sparkles,
} from 'lucide-react';

export const StudentProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<IStudentProfile | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .getStudentProfile()
      .then((res) => {
        setProfile(res.profile);
        setUser(res.user);
      })
      .catch((err) => console.warn(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-xs text-slate-500">Loading student profile...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Profile Header Card */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6">
          <Link
            to="/student/profile/edit"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold transition-colors"
          >
            <Edit className="w-3.5 h-3.5" /> Edit Profile
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
            alt={user?.displayName}
            className="w-24 h-24 rounded-2xl object-cover ring-4 ring-indigo-500/10 shadow-sm"
          />

          <div className="space-y-1 max-w-xl">
            <h1 className="text-2xl font-extrabold text-slate-900">{user?.displayName || 'Candidate'}</h1>
            <p className="text-sm font-semibold text-indigo-600">{profile?.headline}</p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-2">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" /> {profile?.location || 'San Francisco, CA'}
              </span>
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" /> {user?.email}
              </span>
              {profile?.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" /> {profile.phone}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Readiness and ATS indicators */}
        <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-[10px] font-bold uppercase text-slate-400">Profile Completeness</span>
            <p className="text-lg font-extrabold text-slate-900 mt-0.5">{profile?.profileCompleteness || 0}%</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-[10px] font-bold uppercase text-slate-400">Career Readiness</span>
            <p className="text-lg font-extrabold text-indigo-600 mt-0.5">
              {profile?.readinessScore && profile.readinessScore > 0 ? `${profile.readinessScore}/100` : 'Not available'}
            </p>
          </div>
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-[10px] font-bold uppercase text-slate-400">Average ATS Score</span>
            <p className="text-lg font-extrabold text-emerald-600 mt-0.5">
              {profile?.atsAverage && profile.atsAverage > 0 ? `${profile.atsAverage}%` : 'Not available'}
            </p>
          </div>
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-[10px] font-bold uppercase text-slate-400">Target Roles</span>
            <p className="text-xs font-bold text-slate-800 truncate mt-1">
              {profile?.targetRoles && profile.targetRoles.length > 0 ? profile.targetRoles[0] : 'Not specified'}
            </p>
          </div>
        </div>
      </div>

      {/* Bio / Summary */}
      {profile?.bio && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Executive Bio &amp; Career Objective</h2>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{profile.bio}</p>
        </div>
      )}

      {/* Skills Grid */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Code2 className="w-4 h-4 text-indigo-600" /> Technical &amp; Professional Skills
          </h2>
          <span className="text-xs text-slate-400">{(profile?.skills || []).length} skills listed</span>
        </div>
        {profile?.skills && profile.skills.length > 0 ? (
          <div className="flex flex-wrap gap-2 pt-1">
            {profile.skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl border border-slate-200/80 transition-colors"
              >
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 py-1">No skills added yet. Upload your resume or add skills in Edit Profile.</p>
        )}
      </div>

      {/* Experience Section */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Briefcase className="w-4 h-4 text-indigo-600" /> Work &amp; Internship Experience
        </h2>

        {profile?.experience && profile.experience.length > 0 ? (
          <div className="space-y-4">
            {profile.experience.map((exp) => (
              <div key={exp.id} className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/70 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{exp.role}</h3>
                    <p className="text-xs font-semibold text-indigo-600">{exp.company} · {exp.location}</p>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {exp.startDate} - {exp.endDate}
                  </span>
                </div>
                <p className="text-xs text-slate-600">{exp.description}</p>
                {exp.bulletPoints && exp.bulletPoints.length > 0 && (
                  <ul className="list-disc list-inside text-xs text-slate-700 space-y-1 pt-1">
                    {exp.bulletPoints.map((pt, i) => (
                      <li key={i}>{pt}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 py-1">No work experience recorded yet.</p>
        )}
      </div>

      {/* Projects Section */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Target className="w-4 h-4 text-indigo-600" /> Featured Projects
        </h2>

        {profile?.projects && profile.projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profile.projects.map((proj) => (
              <div key={proj.id} className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/70 flex flex-col justify-between space-y-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{proj.title}</h3>
                  <p className="text-xs text-slate-600 mt-1">{proj.description}</p>
                  {proj.impact && (
                    <p className="text-xs text-indigo-700 font-medium mt-2 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100">
                      💡 Impact: {proj.impact}
                    </p>
                  )}
                </div>

                <div className="pt-2 flex flex-wrap gap-1">
                  {proj.technologies.map((t) => (
                    <span key={t} className="text-[10px] bg-white px-2 py-0.5 rounded-md border border-slate-200 text-slate-600">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 py-1">No projects documented yet. Upload your resume or add projects in Edit Profile.</p>
        )}
      </div>

      {/* Education & Certifications */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-indigo-600" /> Education
          </h2>
          {profile?.education && profile.education.length > 0 ? (
            profile.education.map((edu) => (
              <div key={edu.id} className="text-xs space-y-1">
                <p className="font-bold text-slate-900">{edu.institution}</p>
                <p className="text-slate-600">{edu.degree} in {edu.field}</p>
                <p className="text-slate-400">{edu.startYear} - {edu.endYear} {edu.grade && `· ${edu.grade}`}</p>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-400 py-1">No education details recorded yet.</p>
          )}
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-indigo-600" /> Verified Certifications
          </h2>
          {profile?.certifications && profile.certifications.length > 0 ? (
            <div className="space-y-2">
              {profile.certifications.map((cert) => (
                <div key={cert} className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-slate-50 p-2 rounded-xl border border-slate-100">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  {cert}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 py-1">No certifications recorded yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};
