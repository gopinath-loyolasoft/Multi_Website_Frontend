import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  Building2,
  Eye,
  EyeOff,
  Target,
  History,
  Award,
  Users,
  Star,
  Trophy,
  Plus,
  Trash2,
  Edit,
  Save,
  RefreshCw,
  Search,
  LayoutGrid,
  List,
  Mail,
  Calendar,
  CheckCircle2,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { apiClient } from '../../services/apiClient';
import { FormDrawer, DrawerMode, FileUploadInput, ConfirmDialog, useToast } from '../../UI_Componentes/ui';
import { ModulePageHeaderCustomizer } from '../../components/admin/ModulePageHeaderCustomizer';
import { useTenant } from '../../tenant/TenantContext';
import { useCapabilities } from '../../contexts/CapabilityContext';

// ─── Types ─────────────────────────────────────────────────────

interface AccreditationItem {
  body: string;
  grade?: string;
  year?: string;
  logoUrl?: string;
  description?: string;
}

interface AchievementItem {
  title: string;
  year?: string;
  description?: string;
  iconUrl?: string;
}

interface LeadershipMember {
  name: string;
  designation?: string;
  photoUrl?: string;
  message?: string;
  email?: string;
  sortOrder?: number;
}

interface CoreValueItem {
  title: string;
  description?: string;
  icon?: string;
  sortOrder?: number;
}

interface AboutModuleData {
  id?: string;
  historyTitle?: string;
  historyContent?: string;
  historyImageUrl?: string;
  establishedYear?: number | '';
  visionText?: string;
  missionText?: string;
  accreditations: AccreditationItem[];
  achievements: AchievementItem[];
  leadership: LeadershipMember[];
  coreValues: CoreValueItem[];
  isActive: boolean;
}

type ActiveTab = 'overview' | 'history' | 'vision' | 'leadership' | 'accreditations' | 'values' | 'achievements';

export const AboutAdminPage: React.FC = () => {
  const { toast } = useToast();
  const { siteConfig } = useTenant();
  const { capabilities } = useCapabilities();

  const enabledFeatures = capabilities?.enabledFeatures?.length
    ? capabilities.enabledFeatures
    : siteConfig?.enabledFeatures || [];
  const isAboutFeatureEnabled = enabledFeatures.some(
    (f) => f.toUpperCase() === 'ABOUT' || f.toUpperCase() === 'ABOUT_MODULE'
  );

  const [data, setData] = useState<AboutModuleData>({
    historyTitle: '',
    historyContent: '',
    historyImageUrl: '',
    establishedYear: '',
    visionText: '',
    missionText: '',
    accreditations: [],
    achievements: [],
    leadership: [],
    coreValues: [],
    isActive: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [showMonitor, setShowMonitor] = useState(true);

  // Search queries & View modes for sub-lists
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'card' | 'list'>('list');

  // Universal FormDrawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<DrawerMode>('create');
  const [drawerType, setDrawerType] = useState<'leader' | 'accreditation' | 'value' | 'achievement'>('leader');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Delete dialog state
  const [deleteTarget, setDeleteTarget] = useState<{
    type: 'leader' | 'accreditation' | 'value' | 'achievement';
    index: number;
    title: string;
  } | null>(null);

  // Sub-form state fields
  const [formLeader, setFormLeader] = useState<LeadershipMember>({ name: '', designation: '', photoUrl: '', message: '', email: '', sortOrder: 0 });
  const [formAccreditation, setFormAccreditation] = useState<AccreditationItem>({ body: '', grade: '', year: '', logoUrl: '', description: '' });
  const [formValue, setFormValue] = useState<CoreValueItem>({ title: '', description: '', icon: 'star', sortOrder: 0 });
  const [formAchievement, setFormAchievement] = useState<AchievementItem>({ title: '', year: '', description: '', iconUrl: '' });

  const fetchAbout = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/admin/about');
      if (res.data.success && res.data.data) {
        const raw = res.data.data;
        setData({
          id: raw.id,
          historyTitle: raw.historyTitle ?? '',
          historyContent: raw.historyContent ?? '',
          historyImageUrl: raw.historyImageUrl ?? '',
          establishedYear: raw.establishedYear ?? '',
          visionText: raw.visionText ?? '',
          missionText: raw.missionText ?? '',
          accreditations: Array.isArray(raw.accreditations) ? raw.accreditations : [],
          achievements: Array.isArray(raw.achievements) ? raw.achievements : [],
          leadership: Array.isArray(raw.leadership) ? raw.leadership : [],
          coreValues: Array.isArray(raw.coreValues) ? raw.coreValues : [],
          isActive: raw.isActive !== false,
        });
      }
    } catch (err) {
      console.error('Failed to load about module', err);
      toast.error('Failed to load About module data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAbout();
  }, [fetchAbout]);

  const saveAll = async (patch?: Partial<AboutModuleData>) => {
    const merged = { ...data, ...patch };
    try {
      setSaving(true);
      await apiClient.put('/admin/about', {
        historyTitle: merged.historyTitle || null,
        historyContent: merged.historyContent || null,
        historyImageUrl: merged.historyImageUrl || null,
        establishedYear: merged.establishedYear ? Number(merged.establishedYear) : null,
        visionText: merged.visionText || null,
        missionText: merged.missionText || null,
        accreditationsJson: JSON.stringify(merged.accreditations),
        achievementsJson: JSON.stringify(merged.achievements),
        leadershipJson: JSON.stringify(merged.leadership),
        coreValuesJson: JSON.stringify(merged.coreValues),
        isActive: merged.isActive,
      });
      if (patch) setData(merged);
      toast.success('About module configuration saved!');
    } catch (err) {
      console.error('Save failed', err);
      toast.error('Failed to save About module');
    } finally {
      setSaving(false);
    }
  };

  // ─── Drawer Handlers ──────────────────────────────────────────

  const openCreateDrawer = (type: 'leader' | 'accreditation' | 'value' | 'achievement') => {
    setDrawerType(type);
    setDrawerMode('create');
    setEditingIndex(null);

    if (type === 'leader') {
      setFormLeader({ name: '', designation: '', photoUrl: '', message: '', email: '', sortOrder: data.leadership.length });
    } else if (type === 'accreditation') {
      setFormAccreditation({ body: '', grade: '', year: String(new Date().getFullYear()), logoUrl: '', description: '' });
    } else if (type === 'value') {
      setFormValue({ title: '', description: '', icon: 'star', sortOrder: data.coreValues.length });
    } else if (type === 'achievement') {
      setFormAchievement({ title: '', year: String(new Date().getFullYear()), description: '', iconUrl: '' });
    }
    setDrawerOpen(true);
  };

  const openEditDrawer = (type: 'leader' | 'accreditation' | 'value' | 'achievement', index: number) => {
    setDrawerType(type);
    setDrawerMode('edit');
    setEditingIndex(index);

    if (type === 'leader') {
      setFormLeader({ ...data.leadership[index] });
    } else if (type === 'accreditation') {
      setFormAccreditation({ ...data.accreditations[index] });
    } else if (type === 'value') {
      setFormValue({ ...data.coreValues[index] });
    } else if (type === 'achievement') {
      setFormAchievement({ ...data.achievements[index] });
    }
    setDrawerOpen(true);
  };

  const openViewDrawer = (type: 'leader' | 'accreditation' | 'value' | 'achievement', index: number) => {
    setDrawerType(type);
    setDrawerMode('view');
    setEditingIndex(index);

    if (type === 'leader') {
      setFormLeader({ ...data.leadership[index] });
    } else if (type === 'accreditation') {
      setFormAccreditation({ ...data.accreditations[index] });
    } else if (type === 'value') {
      setFormValue({ ...data.coreValues[index] });
    } else if (type === 'achievement') {
      setFormAchievement({ ...data.achievements[index] });
    }
    setDrawerOpen(true);
  };

  const handleDrawerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (drawerMode === 'view') {
      setDrawerOpen(false);
      return;
    }

    let nextData = { ...data };

    if (drawerType === 'leader') {
      if (!formLeader.name.trim()) {
        toast.error('Leader name is required');
        return;
      }
      const updated = [...data.leadership];
      if (drawerMode === 'edit' && editingIndex !== null) {
        updated[editingIndex] = formLeader;
      } else {
        updated.push(formLeader);
      }
      nextData.leadership = updated;
    } else if (drawerType === 'accreditation') {
      if (!formAccreditation.body.trim()) {
        toast.error('Accreditation body name is required');
        return;
      }
      const updated = [...data.accreditations];
      if (drawerMode === 'edit' && editingIndex !== null) {
        updated[editingIndex] = formAccreditation;
      } else {
        updated.push(formAccreditation);
      }
      nextData.accreditations = updated;
    } else if (drawerType === 'value') {
      if (!formValue.title.trim()) {
        toast.error('Core value title is required');
        return;
      }
      const updated = [...data.coreValues];
      if (drawerMode === 'edit' && editingIndex !== null) {
        updated[editingIndex] = formValue;
      } else {
        updated.push(formValue);
      }
      nextData.coreValues = updated;
    } else if (drawerType === 'achievement') {
      if (!formAchievement.title.trim()) {
        toast.error('Milestone title is required');
        return;
      }
      const updated = [...data.achievements];
      if (drawerMode === 'edit' && editingIndex !== null) {
        updated[editingIndex] = formAchievement;
      } else {
        updated.push(formAchievement);
      }
      nextData.achievements = updated;
    }

    setData(nextData);
    await saveAll(nextData);
    setDrawerOpen(false);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    const { type, index } = deleteTarget;
    let nextData = { ...data };

    if (type === 'leader') {
      nextData.leadership = data.leadership.filter((_, i) => i !== index);
    } else if (type === 'accreditation') {
      nextData.accreditations = data.accreditations.filter((_, i) => i !== index);
    } else if (type === 'value') {
      nextData.coreValues = data.coreValues.filter((_, i) => i !== index);
    } else if (type === 'achievement') {
      nextData.achievements = data.achievements.filter((_, i) => i !== index);
    }

    setData(nextData);
    saveAll(nextData);
    setDeleteTarget(null);
  };

  // ─── Filtered Items based on search ───────────────────────────
  const filteredLeaders = useMemo(() => {
    return data.leadership.filter(
      (l) =>
        l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (l.designation && l.designation.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (l.email && l.email.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [data.leadership, searchQuery]);

  const filteredAccreditations = useMemo(() => {
    return data.accreditations.filter(
      (a) =>
        a.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (a.grade && a.grade.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (a.year && a.year.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [data.accreditations, searchQuery]);

  const filteredValues = useMemo(() => {
    return data.coreValues.filter(
      (v) =>
        v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (v.description && v.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [data.coreValues, searchQuery]);

  const filteredAchievements = useMemo(() => {
    return data.achievements.filter(
      (ach) =>
        ach.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (ach.year && ach.year.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (ach.description && ach.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [data.achievements, searchQuery]);

  // Tab definitions
  const tabs: { key: ActiveTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { key: 'overview', label: 'Overview', icon: <Building2 className="w-4 h-4" /> },
    { key: 'history', label: 'Story & History', icon: <History className="w-4 h-4" /> },
    { key: 'vision', label: 'Vision & Mission', icon: <Target className="w-4 h-4" /> },
    { key: 'leadership', label: 'Leadership Team', icon: <Users className="w-4 h-4" />, badge: data.leadership.length },
    { key: 'accreditations', label: 'Accreditations', icon: <Award className="w-4 h-4" />, badge: data.accreditations.length },
    { key: 'values', label: 'Core Values', icon: <Star className="w-4 h-4" />, badge: data.coreValues.length },
    { key: 'achievements', label: 'Achievements', icon: <Trophy className="w-4 h-4" />, badge: data.achievements.length },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 space-x-3 text-slate-500 text-sm font-medium">
        <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
        <span>Loading About module...</span>
      </div>
    );
  }

  if (!isAboutFeatureEnabled) {
    return (
      <div className="p-8 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-3xl text-center space-y-4 max-w-2xl mx-auto my-12 shadow-sm">
        <div className="w-14 h-14 bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center mx-auto">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-amber-900 dark:text-amber-200">About Module Disabled</h2>
        <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
          The <strong>ABOUT</strong> feature module is currently disabled for <strong>{siteConfig?.tenant?.name || 'this college'}</strong> by the Platform SuperAdmin. Contact SuperAdmin to enable the About Page module entitlement.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans text-slate-900 dark:text-white">
      
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Building2 className="w-6 h-6 text-blue-600" />
            <span>Institutional Profile & About Module</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Configure campus history, vision & mission, leadership team, accreditations, and core values.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchAbout}
            disabled={loading}
            className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-semibold transition shadow-xs cursor-pointer"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => saveAll()}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold rounded-xl text-xs shadow-xs transition cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving…' : 'Save All Changes'}</span>
          </button>
        </div>
      </div>

      {/* Public Page Banner Customizer */}
      <ModulePageHeaderCustomizer
        moduleKey="about"
        moduleLabel="About Us & Institutional Heritage"
        defaultBadge="Institutional Legacy & Vision"
        defaultTitle="About Our Institution"
        defaultSubtitle="Committed to academic rigor, pioneering research, inclusive values, and transformative global education."
      />

      {/* ── LIVE ABOUT US MONITOR (DARK & LIGHT MODE) ─────────── */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
        <div className="p-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/60">
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${data.isActive ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`} />
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-mono">
              Live About Us Monitor
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {data.isActive ? 'Active on Website' : 'Inactive'} · {data.leadership.length} Leaders · {data.accreditations.length} Accreditations
            </span>
            <button
              type="button"
              onClick={() => setShowMonitor(!showMonitor)}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-2xs transition cursor-pointer"
            >
              {showMonitor ? 'Hide Preview' : 'Show Preview'}
            </button>
          </div>
        </div>

        {showMonitor && (
          <div className="p-5 bg-slate-100/90 dark:bg-slate-950/60">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { label: 'Story & History', filled: !!(data.historyTitle || data.historyContent), count: data.establishedYear ? `Est. ${data.establishedYear}` : undefined, icon: <History className="w-4 h-4 text-blue-600" /> },
                { label: 'Vision & Mission', filled: !!(data.visionText || data.missionText), count: (data.visionText ? 1 : 0) + (data.missionText ? 1 : 0) + ' Statements', icon: <Target className="w-4 h-4 text-amber-500" /> },
                { label: 'Leadership', filled: data.leadership.length > 0, count: `${data.leadership.length} Leaders`, icon: <Users className="w-4 h-4 text-emerald-600" /> },
                { label: 'Accreditations', filled: data.accreditations.length > 0, count: `${data.accreditations.length} Bodies`, icon: <Award className="w-4 h-4 text-purple-600" /> },
                { label: 'Core Values', filled: data.coreValues.length > 0, count: `${data.coreValues.length} Values`, icon: <Star className="w-4 h-4 text-amber-600" /> },
                { label: 'Achievements', filled: data.achievements.length > 0, count: `${data.achievements.length} Milestones`, icon: <Trophy className="w-4 h-4 text-rose-600" /> },
              ].map((item, i) => (
                <div
                  key={i}
                  className={`rounded-xl p-3.5 space-y-2 border transition ${
                    item.filled
                      ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-2xs'
                      : 'bg-slate-100/70 dark:bg-slate-800/40 border-dashed border-slate-300 dark:border-slate-700 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="p-1 rounded bg-slate-50 dark:bg-slate-800">{item.icon}</div>
                    <span className={`w-2 h-2 rounded-full ${item.filled ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight truncate">{item.label}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">{item.count || (item.filled ? 'Configured' : 'Empty')}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 italic text-center pt-3">
              * Renders dynamically on your institutional about page.
            </p>
          </div>
        )}
      </div>

      {/* ── Sub-Module Tabs ───────────────────────────────────────── */}
      <div className="flex flex-wrap gap-1.5 border-b border-slate-200 dark:border-slate-800 pb-3">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveTab(tab.key);
              setSearchQuery('');
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              activeTab === tab.key
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {typeof tab.badge === 'number' && tab.badge > 0 && (
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                  activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                }`}
              >
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ════════════════════════════════════════════════════════
          TAB: OVERVIEW
      ════════════════════════════════════════════════════════ */}
      {activeTab === 'overview' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-6 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                <span>Basic Institutional Profile Settings</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Control the visibility and primary profile parameters for your institutional About page.
              </p>
            </div>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                data.isActive
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${data.isActive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
              {data.isActive ? 'Module Enabled' : 'Module Hidden'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1.5">
                Institution Name (from Tenant Config)
              </label>
              <input
                type="text"
                value={siteConfig?.tenant?.name || 'Your Institution'}
                disabled
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 text-sm font-semibold"
              />
              <p className="text-[11px] text-slate-400 mt-1">Configured in Platform Tenant Settings.</p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1.5">
                Year of Establishment
              </label>
              <input
                type="number"
                value={data.establishedYear}
                onChange={(e) => setData({ ...data, establishedYear: e.target.value ? Number(e.target.value) : '' })}
                placeholder="e.g. 1994"
                min={1800}
                max={new Date().getFullYear()}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none font-mono"
              />
              <p className="text-[11px] text-slate-400 mt-1">Shows established badge on history & about sections.</p>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-blue-100 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/20 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Live Public Website Visibility</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                When enabled, the About page is accessible publicly and linked in the navigation menus.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={data.isActive}
                onChange={(e) => setData({ ...data, isActive: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="pt-2">
            <button
              onClick={() => saveAll()}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold rounded-xl text-xs shadow-xs transition cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving…' : 'Save Overview Settings'}</span>
            </button>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════
          TAB: STORY & HISTORY
      ════════════════════════════════════════════════════════ */}
      {activeTab === 'history' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-6 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <History className="w-5 h-5 text-blue-600" />
                <span>Institution Heritage & Story</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Describe the founding history, growth milestones, and historical journey of the college.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1.5">
                Story / History Section Title
              </label>
              <input
                type="text"
                value={data.historyTitle ?? ''}
                onChange={(e) => setData({ ...data, historyTitle: e.target.value })}
                placeholder="e.g. A Legacy of Academic Eminence"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1.5">
                Detailed History Narrative
              </label>
              <textarea
                value={data.historyContent ?? ''}
                onChange={(e) => setData({ ...data, historyContent: e.target.value })}
                rows={8}
                placeholder="Write the complete institutional background story. Use line breaks to separate paragraphs..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
              <p className="text-[11px] text-slate-400 mt-1">Each paragraph is automatically formatted on your live website.</p>
            </div>

            <div>
              <FileUploadInput
                label="History / Campus Heritage Photo (Local Upload / Live URL)"
                value={data.historyImageUrl ?? ''}
                onChange={(val) => setData({ ...data, historyImageUrl: val })}
                placeholder="Upload local image or paste live CDN URL"
                helpText="Supported formats: JPG, PNG, WebP. Recommended ratio: 16:9."
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => saveAll()}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold rounded-xl text-xs shadow-xs transition cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving…' : 'Save Story & History'}</span>
            </button>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════
          TAB: VISION & MISSION
      ════════════════════════════════════════════════════════ */}
      {activeTab === 'vision' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-6 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600" />
                <span>Institutional Vision & Mission Statements</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Articulate the strategic vision, institutional mission, and founding philosophy.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold uppercase text-slate-700 dark:text-slate-300">
                <Eye className="w-4 h-4 text-blue-600" />
                <span>Vision Statement</span>
              </label>
              <textarea
                value={data.visionText ?? ''}
                onChange={(e) => setData({ ...data, visionText: e.target.value })}
                rows={7}
                placeholder="To be a globally recognized institution fostering academic brilliance, transformative research, and societal empowerment..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold uppercase text-slate-700 dark:text-slate-300">
                <Target className="w-4 h-4 text-amber-500" />
                <span>Mission Statement</span>
              </label>
              <textarea
                value={data.missionText ?? ''}
                onChange={(e) => setData({ ...data, missionText: e.target.value })}
                rows={7}
                placeholder="To deliver quality holistic education, nurture ethical leadership, cultivate cutting-edge laboratories, and expand industry partnerships..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => saveAll()}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold rounded-xl text-xs shadow-xs transition cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving…' : 'Save Vision & Mission'}</span>
            </button>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════
          TAB: LEADERSHIP TEAM (CARDS / LIST + DRAWER)
      ════════════════════════════════════════════════════════ */}
      {activeTab === 'leadership' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search leaders by name, designation, email..."
                className="w-full pl-9 pr-4 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-xs"
              />
            </div>

            <div className="flex items-center gap-2.5 self-end sm:self-auto">
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setViewMode('card')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                    viewMode === 'card'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Cards</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                    viewMode === 'list'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">List</span>
                </button>
              </div>

              <button
                onClick={() => openCreateDrawer('leader')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs shadow-xs transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>New Leader</span>
              </button>
            </div>
          </div>

          {filteredLeaders.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 mx-auto flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">No Leadership Members Found</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                {searchQuery ? 'No members match your search criteria.' : 'Add your Chancellor, Principal, Dean, or Directors to showcase leadership on the website.'}
              </p>
              {!searchQuery && (
                <button
                  onClick={() => openCreateDrawer('leader')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  <Plus className="w-4 h-4" /> Add First Leader
                </button>
              )}
            </div>
          ) : viewMode === 'list' ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/80 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                    <tr>
                      <th className="p-4">Leader Profile</th>
                      <th className="p-4">Designation</th>
                      <th className="p-4">Contact Email</th>
                      <th className="p-4">Quote / Message</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredLeaders.map((leader, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            {leader.photoUrl ? (
                              <img src={leader.photoUrl} alt={leader.name} className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center font-bold text-sm">
                                {leader.name.charAt(0)}
                              </div>
                            )}
                            <div>
                              <span className="font-bold text-slate-900 dark:text-white block text-sm">{leader.name}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-slate-600 dark:text-slate-300 font-medium">{leader.designation || '—'}</td>
                        <td className="p-4 text-slate-500 dark:text-slate-400">
                          {leader.email ? (
                            <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                              <Mail className="w-3.5 h-3.5" />
                              {leader.email}
                            </span>
                          ) : (
                            '—'
                          )}
                        </td>
                        <td className="p-4 text-slate-500 dark:text-slate-400 max-w-xs truncate italic">
                          {leader.message ? `"${leader.message}"` : '—'}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => openViewDrawer('leader', idx)}
                              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300 transition"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => openEditDrawer('leader', idx)}
                              className="p-1.5 hover:bg-blue-50 dark:hover:bg-blue-950/60 rounded-lg text-blue-600 dark:text-blue-400 transition"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteTarget({ type: 'leader', index: idx, title: leader.name })}
                              className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950/60 rounded-lg text-red-600 dark:text-red-400 transition"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredLeaders.map((leader, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4"
                >
                  <div className="flex items-start gap-3.5">
                    {leader.photoUrl ? (
                      <img src={leader.photoUrl} alt={leader.name} className="w-14 h-14 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shrink-0" />
                    ) : (
                      <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center font-bold text-lg shrink-0">
                        {leader.name.charAt(0)}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">{leader.name}</h3>
                      {leader.designation && (
                        <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold truncate">{leader.designation}</p>
                      )}
                      {leader.email && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-1 flex items-center gap-1">
                          <Mail className="w-3 h-3" /> {leader.email}
                        </p>
                      )}
                    </div>
                  </div>

                  {leader.message && (
                    <blockquote className="text-xs text-slate-600 dark:text-slate-300 italic border-l-2 border-blue-500 pl-3 line-clamp-3">
                      "{leader.message}"
                    </blockquote>
                  )}

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                    <button
                      onClick={() => openViewDrawer('leader', idx)}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition"
                    >
                      View
                    </button>
                    <button
                      onClick={() => openEditDrawer('leader', idx)}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 hover:bg-blue-100 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteTarget({ type: 'leader', index: idx, title: leader.name })}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-400 hover:bg-red-100 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ════════════════════════════════════════════════════════
          TAB: ACCREDITATIONS & RANKINGS
      ════════════════════════════════════════════════════════ */}
      {activeTab === 'accreditations' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search accreditations by body, grade, year..."
                className="w-full pl-9 pr-4 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-xs"
              />
            </div>

            <div className="flex items-center gap-2.5 self-end sm:self-auto">
              <button
                onClick={() => openCreateDrawer('accreditation')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs shadow-xs transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>New Accreditation</span>
              </button>
            </div>
          </div>

          {filteredAccreditations.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 mx-auto flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">No Accreditations Configured</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Add NAAC, NBA, NIRF, ISO, UGC, or affiliated university recognitions to showcase excellence.
              </p>
              {!searchQuery && (
                <button
                  onClick={() => openCreateDrawer('accreditation')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  <Plus className="w-4 h-4" /> Add Accreditation
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredAccreditations.map((acc, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-start gap-3.5">
                    {acc.logoUrl ? (
                      <img src={acc.logoUrl} alt={acc.body} className="w-12 h-12 rounded-xl object-contain border border-slate-200 dark:border-slate-700 p-1 shrink-0" />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 flex items-center justify-center font-bold text-lg shrink-0">
                        <Award className="w-6 h-6" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">{acc.body}</h3>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {acc.grade && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900">
                            Grade: {acc.grade}
                          </span>
                        )}
                        {acc.year && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                            Year: {acc.year}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {acc.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{acc.description}</p>
                  )}

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                    <button
                      onClick={() => openViewDrawer('accreditation', idx)}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition"
                    >
                      View
                    </button>
                    <button
                      onClick={() => openEditDrawer('accreditation', idx)}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 hover:bg-blue-100 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteTarget({ type: 'accreditation', index: idx, title: acc.body })}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-400 hover:bg-red-100 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ════════════════════════════════════════════════════════
          TAB: CORE VALUES
      ════════════════════════════════════════════════════════ */}
      {activeTab === 'values' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search core values..."
                className="w-full pl-9 pr-4 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-xs"
              />
            </div>

            <div className="flex items-center gap-2.5 self-end sm:self-auto">
              <button
                onClick={() => openCreateDrawer('value')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs shadow-xs transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>New Core Value</span>
              </button>
            </div>
          </div>

          {filteredValues.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 mx-auto flex items-center justify-center">
                <Star className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">No Core Values Defined</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Define institutional values like Integrity, Innovation, Discipline, Social Commitment.
              </p>
              {!searchQuery && (
                <button
                  onClick={() => openCreateDrawer('value')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  <Plus className="w-4 h-4" /> Add Core Value
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredValues.map((val, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-3 text-center"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 mx-auto flex items-center justify-center">
                    <Star className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{val.title}</h4>
                    {val.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-3 leading-relaxed">{val.description}</p>
                    )}
                  </div>
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-2">
                    <button
                      onClick={() => openEditDrawer('value', idx)}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 hover:bg-blue-100 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteTarget({ type: 'value', index: idx, title: val.title })}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-400 hover:bg-red-100 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ════════════════════════════════════════════════════════
          TAB: ACHIEVEMENTS & MILESTONES
      ════════════════════════════════════════════════════════ */}
      {activeTab === 'achievements' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search milestones..."
                className="w-full pl-9 pr-4 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-xs"
              />
            </div>

            <div className="flex items-center gap-2.5 self-end sm:self-auto">
              <button
                onClick={() => openCreateDrawer('achievement')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs shadow-xs transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>New Milestone</span>
              </button>
            </div>
          </div>

          {filteredAchievements.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 mx-auto flex items-center justify-center">
                <Trophy className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">No Milestones Recorded</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Record major campus achievements, university ranks, patent grants, and national accolades.
              </p>
              {!searchQuery && (
                <button
                  onClick={() => openCreateDrawer('achievement')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  <Plus className="w-4 h-4" /> Add Milestone
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredAchievements.map((ach, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-600 flex items-center justify-center">
                        <Trophy className="w-4 h-4" />
                      </div>
                      {ach.year && (
                        <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {ach.year}
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">{ach.title}</h4>
                    {ach.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3">{ach.description}</p>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                    <button
                      onClick={() => openEditDrawer('achievement', idx)}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 hover:bg-blue-100 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteTarget({ type: 'achievement', index: idx, title: ach.title })}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-400 hover:bg-red-100 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ════════════════════════════════════════════════════════
          UNIVERSAL FORM DRAWER (RIGHT-SIDE STANDARD)
      ════════════════════════════════════════════════════════ */}
      <FormDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        mode={drawerMode}
        title={
          drawerType === 'leader'
            ? drawerMode === 'create' ? 'Add Leadership Member' : drawerMode === 'edit' ? 'Edit Leadership Member' : 'Leadership Profile'
            : drawerType === 'accreditation'
            ? drawerMode === 'create' ? 'Add Accreditation' : drawerMode === 'edit' ? 'Edit Accreditation' : 'Accreditation Details'
            : drawerType === 'value'
            ? drawerMode === 'create' ? 'Add Core Value' : drawerMode === 'edit' ? 'Edit Core Value' : 'Core Value'
            : drawerMode === 'create' ? 'Add Milestone' : drawerMode === 'edit' ? 'Edit Milestone' : 'Milestone Details'
        }
        subtitle="Configure structured fields for your dynamic public about page."
        icon={
          drawerType === 'leader' ? <Users className="w-5 h-5 text-blue-600" /> :
          drawerType === 'accreditation' ? <Award className="w-5 h-5 text-purple-600" /> :
          drawerType === 'value' ? <Star className="w-5 h-5 text-amber-500" /> :
          <Trophy className="w-5 h-5 text-rose-600" />
        }
        onSubmit={handleDrawerSubmit}
        onEditClick={drawerMode === 'view' && editingIndex !== null ? () => openEditDrawer(drawerType, editingIndex) : undefined}
        submitText={drawerMode === 'create' ? 'Create Record' : 'Save Changes'}
      >
        {/* LEADER FORM */}
        {drawerType === 'leader' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                value={formLeader.name}
                onChange={(e) => setFormLeader({ ...formLeader, name: e.target.value })}
                disabled={drawerMode === 'view'}
                placeholder="e.g. Dr. K. Soundararajan, Ph.D"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Designation / Title
              </label>
              <input
                type="text"
                value={formLeader.designation ?? ''}
                onChange={(e) => setFormLeader({ ...formLeader, designation: e.target.value })}
                disabled={drawerMode === 'view'}
                placeholder="e.g. Principal & Professor of Mechanical Engineering"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Official Email Address
              </label>
              <input
                type="email"
                value={formLeader.email ?? ''}
                onChange={(e) => setFormLeader({ ...formLeader, email: e.target.value })}
                disabled={drawerMode === 'view'}
                placeholder="principal@college.edu"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Leader Quote / Message
              </label>
              <textarea
                value={formLeader.message ?? ''}
                onChange={(e) => setFormLeader({ ...formLeader, message: e.target.value })}
                disabled={drawerMode === 'view'}
                rows={4}
                placeholder="Our mission is to ignite visionary thinking and equip learners with technical prowess..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <FileUploadInput
                label="Profile Photo (Local File / Live URL)"
                value={formLeader.photoUrl ?? ''}
                onChange={(val) => setFormLeader({ ...formLeader, photoUrl: val })}
                placeholder="Upload photo or paste image URL"
                helpText="Square portrait photo (1:1 aspect ratio recommended)."
              />
            </div>
          </div>
        )}

        {/* ACCREDITATION FORM */}
        {drawerType === 'accreditation' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Accreditation Body Name *
              </label>
              <input
                type="text"
                value={formAccreditation.body}
                onChange={(e) => setFormAccreditation({ ...formAccreditation, body: e.target.value })}
                disabled={drawerMode === 'view'}
                placeholder="e.g. NAAC, NBA, NIRF, ISO 9001:2015"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                  Grade / Score / Rank
                </label>
                <input
                  type="text"
                  value={formAccreditation.grade ?? ''}
                  onChange={(e) => setFormAccreditation({ ...formAccreditation, grade: e.target.value })}
                  disabled={drawerMode === 'view'}
                  placeholder="e.g. A++ Grade (CGPA 3.72)"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                  Year / Cycle
                </label>
                <input
                  type="text"
                  value={formAccreditation.year ?? ''}
                  onChange={(e) => setFormAccreditation({ ...formAccreditation, year: e.target.value })}
                  disabled={drawerMode === 'view'}
                  placeholder="e.g. 2024-2029"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Description / Scope
              </label>
              <textarea
                value={formAccreditation.description ?? ''}
                onChange={(e) => setFormAccreditation({ ...formAccreditation, description: e.target.value })}
                disabled={drawerMode === 'view'}
                rows={3}
                placeholder="Accredited for all UG programs under Tier-1 Washington Accord..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <FileUploadInput
                label="Accreditation Seal / Logo"
                value={formAccreditation.logoUrl ?? ''}
                onChange={(val) => setFormAccreditation({ ...formAccreditation, logoUrl: val })}
                placeholder="Upload official logo or paste image URL"
              />
            </div>
          </div>
        )}

        {/* CORE VALUE FORM */}
        {drawerType === 'value' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Value Title *
              </label>
              <input
                type="text"
                value={formValue.title}
                onChange={(e) => setFormValue({ ...formValue, title: e.target.value })}
                disabled={drawerMode === 'view'}
                placeholder="e.g. Academic Integrity & Ethics"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Description
              </label>
              <textarea
                value={formValue.description ?? ''}
                onChange={(e) => setFormValue({ ...formValue, description: e.target.value })}
                disabled={drawerMode === 'view'}
                rows={4}
                placeholder="We uphold honest intellectual pursuit, uncompromising moral principles, and transparent stewardship..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* ACHIEVEMENT FORM */}
        {drawerType === 'achievement' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Milestone Title *
              </label>
              <input
                type="text"
                value={formAchievement.title}
                onChange={(e) => setFormAchievement({ ...formAchievement, title: e.target.value })}
                disabled={drawerMode === 'view'}
                placeholder="e.g. Ranked in Top 50 Engineering Institutions in India"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Year
              </label>
              <input
                type="text"
                value={formAchievement.year ?? ''}
                onChange={(e) => setFormAchievement({ ...formAchievement, year: e.target.value })}
                disabled={drawerMode === 'view'}
                placeholder="e.g. 2025"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Description
              </label>
              <textarea
                value={formAchievement.description ?? ''}
                onChange={(e) => setFormAchievement({ ...formAchievement, description: e.target.value })}
                disabled={drawerMode === 'view'}
                rows={4}
                placeholder="Awarded first-place research grant under the National Innovation Council..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
          </div>
        )}
      </FormDrawer>

      {/* ── Confirm Delete Dialog ─────────────────────────────── */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title={`Delete ${deleteTarget?.type === 'leader' ? 'Leader' : deleteTarget?.type === 'accreditation' ? 'Accreditation' : deleteTarget?.type === 'value' ? 'Core Value' : 'Milestone'}?`}
        message={`Are you sure you want to remove "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />

    </div>
  );
};
