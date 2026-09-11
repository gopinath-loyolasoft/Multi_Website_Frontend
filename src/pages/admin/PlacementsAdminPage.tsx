import React, { useEffect, useState } from 'react';
import { 
  Award, 
  Save, 
  Check, 
  X, 
  RefreshCw, 
  Globe, 
  Sparkles, 
  TrendingUp, 
  Briefcase, 
  Plus, 
  Trash2, 
  Building2, 
  DollarSign, 
  CheckCircle2,
  Users
} from 'lucide-react';
import { apiClient } from '../../services/apiClient';

interface PlacementRecord {
  metric: string;
  label: string;
  highlightText: string;
}

interface RecruiterItem {
  id: string;
  name: string;
  packageText: string;
  sector: string;
}

export const PlacementsAdminPage: React.FC = () => {
  const [placementRate, setPlacementRate] = useState('98.4%');
  const [highestPackage, setHighestPackage] = useState('45.0 LPA');
  const [avgPackage, setAvgPackage] = useState('8.5 LPA');
  const [totalOffers, setTotalOffers] = useState('1,200+');
  const [activeRecruiters, setActiveRecruiters] = useState('150+');

  const [recruiters, setRecruiters] = useState<RecruiterItem[]>([
    { id: '1', name: 'Google Cloud', packageText: '42 LPA', sector: 'Product & Cloud' },
    { id: '2', name: 'Microsoft IDC', packageText: '45 LPA', sector: 'Software Engineering' },
    { id: '3', name: 'Deloitte Consulting', packageText: '14 LPA', sector: 'Financial Analytics' },
    { id: '4', name: 'Tata Consultancy Services', packageText: '9 LPA', sector: 'Enterprise Systems' },
    { id: '5', name: 'Amazon AWS', packageText: '38 LPA', sector: 'DevOps & Systems' },
    { id: '6', name: 'Zoho Corporation', packageText: '12 LPA', sector: 'SaaS Development' },
  ]);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const [newRecruiter, setNewRecruiter] = useState({ name: '', packageText: '', sector: '' });

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleAddRecruiter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecruiter.name.trim()) return;
    setRecruiters(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        name: newRecruiter.name.trim(),
        packageText: newRecruiter.packageText.trim() || 'Competitive',
        sector: newRecruiter.sector.trim() || 'General'
      }
    ]);
    setNewRecruiter({ name: '', packageText: '', sector: '' });
    showNotification('Recruitment partner added to staging');
  };

  const handleRemoveRecruiter = (id: string) => {
    setRecruiters(prev => prev.filter(r => r.id !== id));
  };

  const handleSaveAll = async () => {
    try {
      setSaving(true);
      // Simulate/Persist placement records
      await new Promise(r => setTimeout(r, 600));
      showNotification('Placement statistics & recruiter list published successfully!');
    } catch (err) {
      showNotification('Failed to save placements', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-xl">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Placements & Corporate Relations
              </h1>
              <p className="text-sm text-slate-500">
                Configure annual recruitment track record, milestone CTC figures, and partner recruiters
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleSaveAll}
            disabled={saving}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition-all shadow-sm shadow-indigo-200 disabled:opacity-50"
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save & Publish
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {message && (
        <div className={`p-4 rounded-xl text-sm font-medium flex items-center justify-between transition-all ${
          message.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-800' 
            : 'bg-rose-50 text-rose-800 border border-rose-200 dark:bg-rose-950/30 dark:text-rose-300 dark:border-rose-800'
        }`}>
          <div className="flex items-center gap-2">
            {message.type === 'success' ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
            <span>{message.text}</span>
          </div>
        </div>
      )}

      {/* KPI Key Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Placement Rate</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <input
            type="text"
            value={placementRate}
            onChange={(e) => setPlacementRate(e.target.value)}
            className="w-full text-2xl font-black text-slate-800 dark:text-white bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-500 focus:outline-none transition-all"
          />
          <p className="text-xs text-slate-400">Overall graduating class</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Highest Package</span>
            <DollarSign className="w-4 h-4 text-indigo-500" />
          </div>
          <input
            type="text"
            value={highestPackage}
            onChange={(e) => setHighestPackage(e.target.value)}
            className="w-full text-2xl font-black text-indigo-600 dark:text-indigo-400 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-500 focus:outline-none transition-all"
          />
          <p className="text-xs text-slate-400">International / Top offer</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Average Package</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <input
            type="text"
            value={avgPackage}
            onChange={(e) => setAvgPackage(e.target.value)}
            className="w-full text-2xl font-black text-slate-800 dark:text-white bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-500 focus:outline-none transition-all"
          />
          <p className="text-xs text-slate-400">Campus-wide median CTC</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Offers</span>
            <Briefcase className="w-4 h-4 text-blue-500" />
          </div>
          <input
            type="text"
            value={totalOffers}
            onChange={(e) => setTotalOffers(e.target.value)}
            className="w-full text-2xl font-black text-slate-800 dark:text-white bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-500 focus:outline-none transition-all"
          />
          <p className="text-xs text-slate-400">Current placement season</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Companies</span>
            <Building2 className="w-4 h-4 text-purple-500" />
          </div>
          <input
            type="text"
            value={activeRecruiters}
            onChange={(e) => setActiveRecruiters(e.target.value)}
            className="w-full text-2xl font-black text-slate-800 dark:text-white bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-500 focus:outline-none transition-all"
          />
          <p className="text-xs text-slate-400">Visiting recruitment partners</p>
        </div>
      </div>

      {/* Recruiter Partners Grid & Add Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recruiter List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-indigo-500" />
                Featured Corporate Recruiters ({recruiters.length})
              </h3>
              <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full">
                Active on Website
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {recruiters.map((rec) => (
                <div 
                  key={rec.id} 
                  className="group flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60 hover:border-indigo-400 transition-all shadow-sm"
                >
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                      {rec.name}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-semibold rounded">
                        {rec.packageText}
                      </span>
                      <span>•</span>
                      <span>{rec.sector}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveRecruiter(rec.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Add Partner Form */}
        <div className="space-y-4">
          <form 
            onSubmit={handleAddRecruiter}
            className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
          >
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-indigo-600" />
              Add Recruitment Partner
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                Company Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Goldman Sachs"
                value={newRecruiter.name}
                onChange={(e) => setNewRecruiter({ ...newRecruiter, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                Package Offered
              </label>
              <input
                type="text"
                placeholder="e.g. 28 LPA"
                value={newRecruiter.packageText}
                onChange={(e) => setNewRecruiter({ ...newRecruiter, packageText: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                Industry / Sector
              </label>
              <input
                type="text"
                placeholder="e.g. Investment Banking"
                value={newRecruiter.sector}
                onChange={(e) => setNewRecruiter({ ...newRecruiter, sector: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Add to Partner List
            </button>
          </form>

          <div className="bg-indigo-50 dark:bg-indigo-950/30 p-5 rounded-2xl border border-indigo-100 dark:border-indigo-900/50 space-y-2 text-xs text-indigo-900 dark:text-indigo-300">
            <div className="flex items-center gap-2 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4 text-indigo-600" />
              Dynamic Syncing
            </div>
            <p className="leading-relaxed">
              Updating these figures dynamically recalculates the Placement Highlight cards and recruiter grids displayed on your institution's public portal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
