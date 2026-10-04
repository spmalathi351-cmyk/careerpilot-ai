import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { useNotifications } from '../../contexts/NotificationContext';
import { Sparkles, Save, ArrowLeft } from 'lucide-react';

export const RecruiterProfileEditPage: React.FC = () => {
  const [designation, setDesignation] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyDescription, setCompanyDescription] = useState('');
  const [companyDomain, setCompanyDomain] = useState('');
  const [companyLocation, setCompanyLocation] = useState('');
  const [industry, setIndustry] = useState('');
  const [size, setSize] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [polishing, setPolishing] = useState(false);

  const { showToast } = useNotifications();
  const navigate = useNavigate();

  useEffect(() => {
    api
      .getRecruiterProfile()
      .then((res) => {
        const p = res.profile;
        const c = p.company;
        setDesignation(p.designation || '');
        setPhone(p.phone || '');
        if (c) {
          setCompanyName(c.name || '');
          setCompanyDescription(c.description || '');
          setCompanyDomain(c.domain || '');
          setCompanyLocation(c.location || '');
          setIndustry(c.industry || '');
          setSize(c.size || '');
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handlePolishDescription = async () => {
    if (!companyDescription.trim()) return;
    setPolishing(true);
    try {
      const res = await api.improveCompanyText(companyDescription);
      if (res.improvedText) {
        setCompanyDescription(res.improvedText);
        showToast('Company description polished with Gemini AI', 'success');
      }
    } catch (e: any) {
      showToast('Could not improve description', 'warning');
    } finally {
      setPolishing(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updateRecruiterProfile({
        designation,
        phone,
        companyName,
        companyDescription,
        companyDomain,
        companyLocation,
        industry,
        size,
      });
      showToast('Recruiter profile updated', 'success');
      navigate('/recruiter/profile');
    } catch (err: any) {
      showToast('Failed to save profile changes', 'warning');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-xs text-slate-500">Loading recruiter settings...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/recruiter/profile')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" /> Cancel &amp; Back
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
        <h1 className="text-xl font-bold text-slate-900">Edit Company &amp; Recruiter Profile</h1>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Company Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Domain</label>
              <input
                type="text"
                value={companyDomain}
                onChange={(e) => setCompanyDomain(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Your Designation</label>
              <input
                type="text"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Work Contact Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Industry</label>
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Company Size</label>
              <input
                type="text"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Location</label>
              <input
                type="text"
                value={companyLocation}
                onChange={(e) => setCompanyLocation(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700">Company Mission &amp; Overview</label>
              <button
                type="button"
                onClick={handlePolishDescription}
                disabled={polishing || !companyDescription}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-violet-50 hover:bg-violet-100 text-violet-700 border border-violet-200 rounded-lg text-xs font-semibold"
              >
                <Sparkles className="w-3.5 h-3.5 text-violet-600" />
                {polishing ? 'Polishing...' : 'Polish with Gemini AI'}
              </button>
            </div>
            <textarea
              rows={4}
              value={companyDescription}
              onChange={(e) => setCompanyDescription(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs leading-relaxed"
            />
          </div>
        </form>
      </div>
    </div>
  );
};
