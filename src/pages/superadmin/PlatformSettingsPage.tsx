import React, { useEffect, useState } from 'react';
import {
  Settings,
  Server,
  ShieldCheck,
  Database,
  RefreshCw,
  Building2,
  AlertTriangle,
  CheckCircle2,
  Globe,
  Image as ImageIcon,
  Save,
  RotateCcw,
  Sparkles,
  Layers,
  Upload,
  Link as LinkIcon,
  Laptop
} from 'lucide-react';
import { apiClient } from '../../services/apiClient';
import {
  getPlatformBranding,
  savePlatformBranding,
  resetPlatformBranding,
  PlatformBranding,
  DEFAULT_PLATFORM_BRANDING
} from '../../services/platformBranding';

interface DbRegistry {
  id: string | number;
  tenantId: string | number;
  tenantCode: string;
  tenantName: string;
  databaseName: string;
  host: string;
  port: number;
  dbUser: string;
  status: string;
  currentMigrationVersion: string;
  lastHealthCheckAt: string;
  createdAt: string;
}

const PRESET_LOGOS = [
  {
    name: 'Default Blue Cyber',
    url: '/assets/superadmin-logo.png',
  },
  {
    name: 'Royal University Crest',
    url: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=100&auto=format&fit=crop&q=80',
  },
  {
    name: 'Modern Tech Cloud',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
  },
  {
    name: 'Academic Shield Gold',
    url: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=100&auto=format&fit=crop&q=80',
  }
];

export const PlatformSettingsPage: React.FC = () => {
  const [databases, setDatabases] = useState<DbRegistry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Platform Branding State
  const [branding, setBranding] = useState<PlatformBranding>(getPlatformBranding());
  const [platformName, setPlatformName] = useState(branding.platformName);
  const [platformSubtitle, setPlatformSubtitle] = useState(branding.platformSubtitle);
  const [logoUrl, setLogoUrl] = useState(branding.logoUrl);
  const [faviconUrl, setFaviconUrl] = useState(branding.faviconUrl);
  const [logoInputMode, setLogoInputMode] = useState<'upload' | 'url'>('upload');
  const [isSavingBranding, setIsSavingBranding] = useState(false);
  const [brandingNotice, setBrandingNotice] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [previewTabTheme, setPreviewTabTheme] = useState<'dark' | 'light'>('dark');

  const showBrandingNotification = (text: string, type: 'success' | 'error' = 'success') => {
    setBrandingNotice({ text, type });
    setTimeout(() => setBrandingNotice(null), 4000);
  };

  const fetchDatabases = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiClient.get('/superadmin/databases');
      if (res.data.success) {
        setDatabases(res.data.data || []);
      }
    } catch (err: any) {
      console.error('Failed to load database registry', err);
      setError(err.response?.data?.message || 'Failed to load platform database registry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDatabases();
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size < 2MB
    if (file.size > 2 * 1024 * 1024) {
      showBrandingNotification('Logo image size must be under 2MB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUri = event.target?.result as string;
      if (dataUri) {
        setLogoUrl(dataUri);
        setFaviconUrl(dataUri);
        showBrandingNotification('Custom logo & favicon loaded into preview! Click Save to apply.', 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveBranding = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      setIsSavingBranding(true);
      const updated = savePlatformBranding({
        platformName: platformName.trim(),
        platformSubtitle: platformSubtitle.trim(),
        logoUrl: logoUrl.trim(),
        faviconUrl: (faviconUrl || logoUrl).trim(),
      });
      setBranding(updated);
      showBrandingNotification('Platform branding & browser tab updated successfully!', 'success');
    } catch (err) {
      console.error('Failed to save branding', err);
      showBrandingNotification('Failed to save platform branding.', 'error');
    } finally {
      setIsSavingBranding(false);
    }
  };

  const handleResetBranding = () => {
    if (window.confirm('Reset platform title, logo, and favicon to default settings?')) {
      const restored = resetPlatformBranding();
      setBranding(restored);
      setPlatformName(restored.platformName);
      setPlatformSubtitle(restored.platformSubtitle);
      setLogoUrl(restored.logoUrl);
      setFaviconUrl(restored.faviconUrl);
      showBrandingNotification('Platform branding reset to default values.', 'success');
    }
  };

  const healthyCount = databases.filter((d) => d.status === 'HEALTHY' || d.status === 'VERIFIED' || d.status === 'PROVISIONED').length;
  const uniqueDbs = new Set(databases.map((d) => d.tenantCode)).size;

  return (
    <div className="space-y-8 text-slate-900 dark:text-slate-100 font-sans max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Settings className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <span>Platform Global Settings</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Customize SuperAdmin browser tab branding, platform titles, and view live database registries.
          </p>
        </div>

        <button
          onClick={fetchDatabases}
          disabled={loading}
          className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold transition flex items-center gap-2 shadow-2xs cursor-pointer"
          title="Refresh database registry"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh DBs</span>
        </button>
      </div>

      {/* SECTION 1: EDITABLE PLATFORM BRANDING & BROWSER TAB SETTINGS */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                Browser Tab & Platform Branding
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Edit the title and logo (favicon) displayed on the browser tab, header, and sidebar.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetBranding}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
              title="Reset to default title and logo"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>
            <button
              type="button"
              onClick={() => handleSaveBranding()}
              disabled={isSavingBranding}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition shadow-xs cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSavingBranding ? 'Saving...' : 'Save Branding'}</span>
            </button>
          </div>
        </div>

        {/* Notifications */}
        {brandingNotice && (
          <div
            className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all ${
              brandingNotice.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-300'
                : 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900/50 text-red-800 dark:text-red-300'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{brandingNotice.text}</span>
          </div>
        )}

        {/* LIVE BROWSER TAB SIMULATOR */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Laptop className="w-3.5 h-3.5 text-blue-500" />
              <span>Live Browser Tab Preview</span>
            </label>
            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <span>Theme:</span>
              <button
                type="button"
                onClick={() => setPreviewTabTheme(previewTabTheme === 'dark' ? 'light' : 'dark')}
                className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 cursor-pointer"
              >
                {previewTabTheme === 'dark' ? '🌙 Dark Tab' : '☀️ Light Tab'}
              </button>
            </div>
          </div>

          {/* Realistic Chrome/Edge Browser Tab Simulation */}
          <div
            className={`rounded-xl border p-3 shadow-inner transition-colors ${
              previewTabTheme === 'dark'
                ? 'bg-slate-950 border-slate-800 text-slate-200'
                : 'bg-slate-200 border-slate-300 text-slate-800'
            }`}
          >
            {/* Tab Strip */}
            <div className="flex items-end gap-1 px-1">
              <div
                className={`relative flex items-center gap-2 px-4 py-2 rounded-t-xl text-xs font-semibold max-w-[240px] shadow-sm transition-all border-t border-x ${
                  previewTabTheme === 'dark'
                    ? 'bg-slate-900 border-slate-700/80 text-white'
                    : 'bg-white border-slate-300 text-slate-900'
                }`}
              >
                {/* Favicon in Tab */}
                <div className="w-4 h-4 rounded shrink-0 overflow-hidden flex items-center justify-center bg-black/10">
                  <img
                    src={faviconUrl || logoUrl || '/assets/superadmin-logo.png'}
                    alt="Favicon"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>

                {/* Title in Tab */}
                <span className="truncate flex-1 font-medium tracking-tight">
                  {platformName || 'Multi Website'}
                </span>

                {/* Close Tab X */}
                <span className="text-slate-400 hover:text-slate-200 text-xs font-bold shrink-0 ml-1">
                  ×
                </span>
              </div>

              <span className="text-slate-500 px-2 py-1 text-xs font-mono select-none">+</span>
            </div>

            {/* Address Bar Simulation */}
            <div
              className={`mt-1.5 px-3 py-1.5 rounded-lg text-[11px] font-mono flex items-center gap-2 border ${
                previewTabTheme === 'dark'
                  ? 'bg-slate-900 border-slate-800 text-slate-400'
                  : 'bg-white border-slate-300 text-slate-600'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">https://</span>
              <span>controlplane.yourplatform.edu/superadmin</span>
            </div>
          </div>
        </div>

        {/* INPUT FIELDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
          {/* 1. Platform Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <span>Browser Tab Title & Platform Name</span>
              <span className="text-rose-500 font-bold">*</span>
            </label>
            <input
              type="text"
              value={platformName}
              onChange={(e) => setPlatformName(e.target.value)}
              placeholder="e.g., Multi Website Platform, Campus Admin"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-hidden transition font-medium"
            />
            <p className="text-[11px] text-slate-400">
              Appears directly on the browser window tab (<code className="font-mono text-blue-500">document.title</code>) and sidebar top.
            </p>
          </div>

          {/* 2. Platform Subtitle */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <span>Platform Subtitle / Control Plane Label</span>
            </label>
            <input
              type="text"
              value={platformSubtitle}
              onChange={(e) => setPlatformSubtitle(e.target.value)}
              placeholder="e.g., SuperAdmin Control Plane, Multi-Tenant Infrastructure"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-hidden transition font-medium"
            />
            <p className="text-[11px] text-slate-400">
              Shown under the header title and in the sidebar brand box.
            </p>
          </div>
        </div>

        {/* LOGO & FAVICON CONFIGURATION */}
        <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-blue-500" />
                <span>Platform Logo & Tab Favicon</span>
              </label>
              <p className="text-[11px] text-slate-400">
                Upload a custom logo (.png, .svg, .ico, .jpg) or enter an external image URL.
              </p>
            </div>

            {/* Input Mode Toggle */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setLogoInputMode('upload')}
                className={`px-3 py-1 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                  logoInputMode === 'upload'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-2xs font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Upload className="w-3 h-3" />
                <span>Upload File</span>
              </button>
              <button
                type="button"
                onClick={() => setLogoInputMode('url')}
                className={`px-3 py-1 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                  logoInputMode === 'url'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-2xs font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <LinkIcon className="w-3 h-3" />
                <span>Image URL</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            {/* Logo Preview Avatar */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center p-1.5 shrink-0 shadow-sm overflow-hidden">
                <img
                  src={logoUrl || '/assets/superadmin-logo.png'}
                  alt="Logo Preview"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">Active Logo</p>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
                  Live in tab & sidebar
                </p>
              </div>
            </div>

            {/* Input by Mode */}
            <div className="md:col-span-2 space-y-2">
              {logoInputMode === 'upload' ? (
                <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-4 text-center hover:border-blue-500 dark:hover:border-blue-500 transition bg-slate-50/50 dark:bg-slate-800/30">
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/svg+xml, image/x-icon, image/webp"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    title="Choose a logo or favicon file"
                  />
                  <div className="flex flex-col items-center justify-center gap-1 pointer-events-none">
                    <Upload className="w-5 h-5 text-blue-500" />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Click to choose image file or drag here
                    </span>
                    <span className="text-[10px] text-slate-400">
                      PNG, SVG, ICO, JPG, WEBP (Max 2MB)
                    </span>
                  </div>
                </div>
              ) : (
                <input
                  type="text"
                  value={logoUrl}
                  onChange={(e) => {
                    setLogoUrl(e.target.value);
                    setFaviconUrl(e.target.value);
                  }}
                  placeholder="https://yourdomain.com/logo.png"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-hidden transition font-mono"
                />
              )}
            </div>
          </div>

          {/* Quick Presets */}
          <div className="pt-2">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">
              Or Choose a Preset Logo:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {PRESET_LOGOS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => {
                    setLogoUrl(preset.url);
                    setFaviconUrl(preset.url);
                  }}
                  className={`p-2 rounded-xl border flex items-center gap-2.5 text-left transition cursor-pointer ${
                    logoUrl === preset.url
                      ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 dark:border-blue-500 text-blue-700 dark:text-blue-300 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-700 p-1 flex items-center justify-center shrink-0">
                    <img src={preset.url} alt={preset.name} className="w-full h-full object-contain" />
                  </div>
                  <span className="text-xs font-semibold truncate">{preset.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Save Footer Button */}
        <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={handleResetBranding}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
          >
            Reset Defaults
          </button>
          <button
            type="button"
            onClick={() => handleSaveBranding()}
            disabled={isSavingBranding}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isSavingBranding ? 'Saving...' : 'Save Platform Branding'}</span>
          </button>
        </div>
      </div>

      {/* SECTION 2: PLATFORM OVERVIEW & LIVE TENANT DATABASES */}
      <div className="space-y-5">
        <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-base border-b border-slate-200 dark:border-slate-800 pb-2">
          <Server className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <span>Tenant Database Registry & Operational Health</span>
        </div>

        {error && (
          <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="p-12 text-center text-slate-500 font-semibold bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
            Loading platform database registry...
          </div>
        ) : databases.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <Database className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">No Tenant Databases Provisioned</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              No college databases have been provisioned yet. Create a college from the Colleges page to provision its isolated database.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Platform Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5" /> Tenant Databases
                </span>
                <span className="text-2xl font-black text-slate-900 dark:text-white block mt-1">{databases.length}</span>
              </div>
              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" /> Unique Tenants
                </span>
                <span className="text-2xl font-black text-slate-900 dark:text-white block mt-1">{uniqueDbs}</span>
              </div>
              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Provisioned & Healthy
                </span>
                <span className="text-2xl font-black text-slate-900 dark:text-white block mt-1">{healthyCount}</span>
              </div>
            </div>

            {/* Database Registry Table */}
            <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm border-b border-slate-100 dark:border-slate-800 pb-3">
                <Server className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Live Tenant Database Registry</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/70 dark:bg-slate-800/70 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700 font-semibold">
                    <tr>
                      <th className="py-2.5 px-4">Tenant</th>
                      <th className="py-2.5 px-4">Database Name</th>
                      <th className="py-2.5 px-4">Host:Port</th>
                      <th className="py-2.5 px-4">Migration</th>
                      <th className="py-2.5 px-4">Status</th>
                      <th className="py-2.5 px-4">Last Health Check</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                    {databases.map((db) => (
                      <tr key={db.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/60 transition">
                        <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                          {db.tenantName}
                          <span className="block text-[10px] font-mono text-slate-400">{db.tenantCode}</span>
                        </td>
                        <td className="py-3 px-4 font-mono text-blue-600 dark:text-blue-400 whitespace-nowrap">{db.databaseName}</td>
                        <td className="py-3 px-4 font-mono text-slate-500 dark:text-slate-400 whitespace-nowrap">
                          {db.host}:{db.port}
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-mono text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded">
                            {db.currentMigrationVersion || '—'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              db.status === 'HEALTHY' || db.status === 'VERIFIED' || db.status === 'PROVISIONED'
                                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50'
                                : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50'
                            }`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            {db.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-400 whitespace-nowrap">
                          {db.lastHealthCheckAt ? new Date(db.lastHealthCheckAt).toLocaleString() : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
