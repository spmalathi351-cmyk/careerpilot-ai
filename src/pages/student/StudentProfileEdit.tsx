import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { useNotifications } from '../../contexts/NotificationContext';
import { StudentProfile } from '../../types';
import { Sparkles, Save, X, Plus, Trash2, ArrowLeft } from 'lucide-react';

export const StudentProfileEditPage: React.FC = () => {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [targetRoles, setTargetRoles] = useState<string[]>([]);
  const [newRole, setNewRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [improvingBio, setImprovingBio] = useState(false);

  const { showToast } = useNotifications();
  const navigate = useNavigate();

  useEffect(() => {
    api
      .getStudentProfile()
      .then((res) => {
        setProfile(res.profile);
        setHeadline(res.profile.headline || '');
        setBio(res.profile.bio || '');
        setLocation(res.profile.location || '');
        setPhone(res.profile.phone || '');
        setSkills(res.profile.skills || []);
        setTargetRoles(res.profile.targetRoles || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleAddRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRole.trim() && !targetRoles.includes(newRole.trim())) {
      setTargetRoles([...targetRoles, newRole.trim()]);
      setNewRole('');
    }
  };

  const handleRemoveRole = (roleToRemove: string) => {
    setTargetRoles(targetRoles.filter((r) => r !== roleToRemove));
  };

  const handlePolishBio = async () => {
    if (!bio.trim()) return;
    setImprovingBio(true);
    try {
      const res = await api.improveBio(bio);
      if (res.improvedBio) {
        setBio(res.improvedBio);
        showToast('Bio polished with Gemini 3.8 Flash', 'success');
      }
    } catch (err: any) {
      showToast('Could not optimize bio; retained current copy', 'warning');
    } finally {
      setImprovingBio(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updateStudentProfile({
        headline,
        bio,
        location,
        phone,
        skills,
        targetRoles,
      });
      showToast('Profile updated successfully', 'success');
      navigate('/student/profile');
    } catch (err: any) {
      showToast('Failed to save profile updates', 'warning');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-xs text-slate-500">Loading editor...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/student/profile')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" /> Cancel &amp; Back to Profile
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
        >
          <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <h1 className="text-xl font-bold text-slate-900">Edit Student Profile</h1>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Headline</label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="e.g. Full-Stack Software Engineer & Applied AI Enthusiast"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="San Francisco, CA"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 234-5678"
              className="w-full max-w-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            />
          </div>

          {/* Bio with Gemini Polish */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700">Executive Bio &amp; Summary</label>
              <button
                type="button"
                onClick={handlePolishBio}
                disabled={improvingBio || !bio}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-violet-50 hover:bg-violet-100 text-violet-700 border border-violet-200 rounded-lg text-xs font-semibold transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-violet-600" />
                {improvingBio ? 'Refining with Gemini...' : 'Polish with Gemini AI'}
              </button>
            </div>
            <textarea
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Describe your engineering passions, key capstone projects, and primary career objectives..."
              className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs leading-relaxed"
            />
          </div>

          {/* Skills Management */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">Technical Skills</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 text-slate-800 text-xs font-semibold rounded-xl border border-slate-200"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-slate-400 hover:text-red-600 p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2 max-w-md">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add skill (e.g. Docker, GraphQL)"
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-3 py-2 bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
          </div>

          {/* Target Roles */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">Target Roles</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {targetRoles.map((role) => (
                <span
                  key={role}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-50 text-indigo-800 text-xs font-semibold rounded-xl border border-indigo-200"
                >
                  {role}
                  <button
                    type="button"
                    onClick={() => handleRemoveRole(role)}
                    className="text-indigo-400 hover:text-red-600 p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2 max-w-md">
              <input
                type="text"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                placeholder="e.g. GenAI Solutions Engineer"
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
              <button
                type="button"
                onClick={handleAddRole}
                className="px-3 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
