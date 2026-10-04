import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { RecruiterProfile, User } from '../../types';
import { Building, MapPin, Globe, Phone, Mail, Edit, ExternalLink, Briefcase } from 'lucide-react';

export const RecruiterProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<RecruiterProfile | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getRecruiterProfile()
      .then((res) => {
        setProfile(res.profile);
        setUser(res.user);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-xs text-slate-500">Loading recruiter profile...</div>;
  }

  const comp = profile?.company;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Profile Card */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6">
          <Link
            to="/recruiter/profile/edit"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold transition-colors"
          >
            <Edit className="w-3.5 h-3.5" /> Edit Profile &amp; Company
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <img
            src={comp?.logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=150'}
            alt={comp?.name}
            className="w-20 h-20 rounded-2xl object-cover border border-slate-200 shadow-xs"
          />

          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-slate-900">{comp?.name || 'CareerPilot Demo Technologies'}</h1>
            <p className="text-xs font-semibold text-indigo-600">{profile?.designation} · {user?.displayName}</p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" /> {comp?.location || 'San Francisco, CA'}
              </span>
              <span className="flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-slate-400" /> {comp?.website || 'https://careerpilot.ai'}
              </span>
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" /> {user?.email}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Company Description */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">About Company &amp; Culture</h2>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          {comp?.description || 'Building next-generation intelligent applications and talent acceleration frameworks.'}
        </p>
      </div>

      {/* Firmographic Attributes */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-bold uppercase text-slate-400">Industry</span>
          <p className="text-sm font-bold text-slate-900 mt-1">{comp?.industry || 'Technology & SaaS'}</p>
        </div>
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-bold uppercase text-slate-400">Company Size</span>
          <p className="text-sm font-bold text-slate-900 mt-1">{comp?.size || '50-200 Employees'}</p>
        </div>
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-bold uppercase text-slate-400">Recruiting Contact</span>
          <p className="text-sm font-bold text-slate-900 mt-1">{profile?.phone || '+1 (555) 443-2211'}</p>
        </div>
      </div>
    </div>
  );
};
