import React, { useEffect, useState } from 'react';
import { Palette, RefreshCw, Plus, Sparkles, Eye, Pencil, Trash2 } from 'lucide-react';
import { Theme, CreateThemePayload } from '../../types';
import { apiClient } from '../../services/apiClient';
import { FormDrawer, DrawerMode, ConfirmDialog, useToast } from '../../UI_Componentes/ui';

import { SYSTEM_THEMES_SEED_LIST } from './TemplatesPage';

export const ThemesPage: React.FC = () => {
  const { toast } = useToast();
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Drawer State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<DrawerMode>('create');
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#1e40af');
  const [secondaryColor, setSecondaryColor] = useState('#f59e0b');
  const [accentColor, setAccentColor] = useState('#3b82f6');
  const [fontFamily, setFontFamily] = useState('Inter, sans-serif');
  const [badgeText, setBadgeText] = useState('Excellence in Higher Education');
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // Edit & delete state
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Theme | null>(null);
  const [editName, setEditName] = useState('');
  const [editPrimaryColor, setEditPrimaryColor] = useState('#1e40af');
  const [editSecondaryColor, setEditSecondaryColor] = useState('#f59e0b');
  const [editAccentColor, setEditAccentColor] = useState('#3b82f6');
  const [editFontFamily, setEditFontFamily] = useState('Inter, sans-serif');
  const [editBadgeText, setEditBadgeText] = useState('Excellence in Higher Education');
  const [editIsActive, setEditIsActive] = useState(true);
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Theme | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  const fetchThemes = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiClient.get('/superadmin/themes');
      const rawThemes: Theme[] = res.data.success ? (res.data.data || []) : [];
      
      const themeMap = new Map<string, Theme>();
      SYSTEM_THEMES_SEED_LIST.forEach(seed => {
        themeMap.set(seed.code, { ...seed });
      });

      rawThemes.forEach(dbTheme => {
        const c = dbTheme.code?.toUpperCase();
        if (c && themeMap.has(c)) {
          const current = themeMap.get(c)!;
          themeMap.set(c, {
            ...current,
            id: dbTheme.id || current.id,
            isActive: dbTheme.isActive ?? current.isActive,
            configuration: dbTheme.configuration || current.configuration
          });
        } else if (c) {
          themeMap.set(c, dbTheme);
        }
      });

      setThemes(Array.from(themeMap.values()));
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Failed to load themes');
      setThemes(SYSTEM_THEMES_SEED_LIST);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThemes();
  }, []);

  const handleCreateTheme = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) return;

    try {
      setSaving(true);
      setModalError(null);

      const payload: CreateThemePayload = {
        name: name.trim(),
        code: code.trim().toUpperCase(),
        configuration: {
          themeName: name.trim(),
          primaryColor,
          secondaryColor,
          accentColor,
          fontFamily,
          headerStyle: 'solid',
          badgeText: badgeText.trim() || 'Official College Portal'
        }
      };

      const res = await apiClient.post('/superadmin/themes', payload);
      if (res.data.success) {
        setIsDrawerOpen(false);
        setName('');
        setCode('');
        setPrimaryColor('#1e40af');
        setSecondaryColor('#f59e0b');
        setAccentColor('#3b82f6');
        await fetchThemes();
      } else {
        setModalError(res.data.message || 'Failed to register theme');
      }
    } catch (err: any) {
      setModalError(err.response?.data?.message || err.message || 'Failed to create theme');
    } finally {
      setSaving(false);
    }
  };

  const parseConfig = (cfgObj: any) => {
    if (!cfgObj) return {};
    if (typeof cfgObj === 'string') {
      try { return JSON.parse(cfgObj); } catch { return {}; }
    }
    return cfgObj;
  };

  // ─── Edit & delete handlers ───────────────────────────────────────
  const openEditDrawer = (theme: Theme) => {
    const cfg = parseConfig(theme.configuration);
    setEditTarget(theme);
    setEditName(theme.name);
    setEditPrimaryColor(cfg?.primaryColor || '#1e40af');
    setEditSecondaryColor(cfg?.secondaryColor || '#f59e0b');
    setEditAccentColor(cfg?.accentColor || '#3b82f6');
    setEditFontFamily(cfg?.fontFamily || 'Inter, sans-serif');
    setEditBadgeText(cfg?.badgeText || 'Official College Portal');
    setEditIsActive(theme.isActive);
    setEditError(null);
    setIsEditDrawerOpen(true);
  };

  const handleUpdateTheme = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTarget || !editName.trim()) return;
    try {
      setEditSaving(true);
      setEditError(null);

      const res = await apiClient.put(`/superadmin/themes/${editTarget.id}`, {
        name: editName.trim(),
        isActive: editIsActive,
        configuration: {
          themeName: editName.trim(),
          primaryColor: editPrimaryColor,
          secondaryColor: editSecondaryColor,
          accentColor: editAccentColor,
          fontFamily: editFontFamily,
          headerStyle: 'solid',
          badgeText: editBadgeText.trim() || 'Official College Portal'
        }
      });

      if (res.data?.success) {
        toast.success(`Theme '${editName.trim()}' updated successfully`);
        setIsEditDrawerOpen(false);
        setEditTarget(null);
        await fetchThemes();
      } else {
        setEditError(res.data?.message || 'Failed to update theme');
      }
    } catch (err: any) {
      setEditError(err.response?.data?.message || err.message || 'Failed to update theme');
    } finally {
      setEditSaving(false);
    }
  };

  const handleDeleteTheme = async () => {
    if (!deleteTarget) return;
    try {
      setDeleteBusy(true);
      const res = await apiClient.delete(`/superadmin/themes/${deleteTarget.id}`);
      if (res.data?.success) {
        toast.success(`Theme '${deleteTarget.name}' deleted`);
        setDeleteTarget(null);
        await fetchThemes();
      } else {
        toast.error(res.data?.message || 'Failed to delete theme');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Failed to delete theme');
    } finally {
      setDeleteBusy(false);
    }
  };

  return (
    <div className="space-y-6 text-slate-900 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Palette className="w-6 h-6 text-blue-600" />
            <span>Theme Configurations & CSS Variables</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Global theme palettes with CSS variables that dynamically style college frontends.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchThemes}
            className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-xs font-semibold transition shadow-2xs"
            title="Refresh themes"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => {
              setDrawerMode('create');
              setSelectedTheme(null);
              setName('');
              setCode('');
              setPrimaryColor('#1e40af');
              setSecondaryColor('#f59e0b');
              setAccentColor('#3b82f6');
              setFontFamily('Inter, sans-serif');
              setBadgeText('Excellence in Higher Education');
              setModalError(null);
              setIsDrawerOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>+ Register New Theme</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center justify-between">
          <span>{error}</span>
          <button onClick={fetchThemes} className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md text-xs font-semibold">
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center space-y-3">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-500">Loading themes catalog...</p>
        </div>
      ) : themes.length === 0 ? (
        <div className="py-20 text-center bg-white border border-slate-200 rounded-xl">
          <p className="text-slate-500 text-sm">No themes available in platform registry.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {themes.map((theme) => {
            const cfg = parseConfig(theme.configuration);
            return (
              <div
                key={theme.id}
                className="p-5 rounded-xl bg-white border border-slate-200 space-y-4 shadow-xs"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{theme.name}</h3>
                    <span className="font-mono text-xs font-semibold text-blue-600">{theme.code}</span>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${
                    theme.isActive
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-slate-50 text-slate-500 border-slate-200'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${theme.isActive ? 'bg-emerald-600' : 'bg-slate-400'}`} />
                    {theme.isActive ? 'Active Theme' : 'Inactive'}
                  </span>
                </div>

                {/* Color Swatches */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                    <div className="w-full h-8 rounded-md mb-1.5 shadow-2xs" style={{ backgroundColor: cfg?.primaryColor || '#1e40af' }} />
                    <span className="text-[10px] text-slate-500 block font-medium">Primary</span>
                    <span className="font-mono text-xs text-slate-900 font-semibold">{cfg?.primaryColor || '#1e40af'}</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                    <div className="w-full h-8 rounded-md mb-1.5 shadow-2xs" style={{ backgroundColor: cfg?.secondaryColor || '#f59e0b' }} />
                    <span className="text-[10px] text-slate-500 block font-medium">Secondary</span>
                    <span className="font-mono text-xs text-slate-900 font-semibold">{cfg?.secondaryColor || '#f59e0b'}</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                    <div className="w-full h-8 rounded-md mb-1.5 shadow-2xs" style={{ backgroundColor: cfg?.accentColor || '#3b82f6' }} />
                    <span className="text-[10px] text-slate-500 block font-medium">Accent</span>
                    <span className="font-mono text-xs text-slate-900 font-semibold">{cfg?.accentColor || '#3b82f6'}</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Font Family:</span>
                    <span className="font-mono text-slate-800 font-medium">{cfg?.fontFamily || 'Inter, sans-serif'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Badge Text:</span>
                    <span className="text-blue-600 font-medium">{cfg?.badgeText || 'Official College Portal'}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedTheme(theme);
                      setDrawerMode('view');
                      setIsDrawerOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Palette & Tokens</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => openEditDrawer(theme)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                      title="Edit theme colors, typography and status"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(theme)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Delete theme from platform registry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE & VIEW THEME DRAWER */}
      <FormDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={drawerMode === 'view' ? (selectedTheme?.name || 'Theme Palette Details') : 'Register College Theme Palette'}
        subtitle={drawerMode === 'view' ? `Theme Code: ${selectedTheme?.code || ''}` : 'Define branding colors, dynamic CSS variables, and typography'}
        icon={<Palette className="w-5 h-5 text-blue-600" />}
        mode={drawerMode}
        size="lg"
        loading={saving}
        onSubmit={drawerMode !== 'view' ? handleCreateTheme : undefined}
        submitText="Save Theme to Platform"
      >
        {drawerMode === 'view' && selectedTheme ? (
          (() => {
            const cfg = parseConfig(selectedTheme.configuration);
            return (
              <div className="space-y-6 text-slate-900 text-xs">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{selectedTheme.name}</h4>
                      <p className="font-mono text-xs text-blue-600 font-semibold">{selectedTheme.code}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${
                      selectedTheme.isActive
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-slate-50 text-slate-500 border-slate-200'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${selectedTheme.isActive ? 'bg-emerald-600' : 'bg-slate-400'}`} />
                      {selectedTheme.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h5 className="font-semibold text-slate-800">Color Palette & Hex Values</h5>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 rounded-lg bg-white border border-slate-200 space-y-1.5 shadow-2xs">
                      <div className="w-full h-10 rounded-md shadow-inner" style={{ backgroundColor: cfg?.primaryColor || '#1e40af' }} />
                      <span className="text-[10px] text-slate-500 font-medium block">Primary Color</span>
                      <span className="font-mono text-xs font-bold text-slate-900">{cfg?.primaryColor || '#1e40af'}</span>
                    </div>

                    <div className="p-3 rounded-lg bg-white border border-slate-200 space-y-1.5 shadow-2xs">
                      <div className="w-full h-10 rounded-md shadow-inner" style={{ backgroundColor: cfg?.secondaryColor || '#f59e0b' }} />
                      <span className="text-[10px] text-slate-500 font-medium block">Secondary Color</span>
                      <span className="font-mono text-xs font-bold text-slate-900">{cfg?.secondaryColor || '#f59e0b'}</span>
                    </div>

                    <div className="p-3 rounded-lg bg-white border border-slate-200 space-y-1.5 shadow-2xs">
                      <div className="w-full h-10 rounded-md shadow-inner" style={{ backgroundColor: cfg?.accentColor || '#3b82f6' }} />
                      <span className="text-[10px] text-slate-500 font-medium block">Accent Color</span>
                      <span className="font-mono text-xs font-bold text-slate-900">{cfg?.accentColor || '#3b82f6'}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
                  <h5 className="font-semibold text-slate-800">Typography & Badge Settings</h5>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-slate-500 block text-[11px]">Font Family</span>
                      <span className="font-medium text-slate-900 font-mono text-xs">{cfg?.fontFamily || 'Inter, sans-serif'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Header Badge Text</span>
                      <span className="font-medium text-blue-600 text-xs">{cfg?.badgeText || 'Official College Portal'}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-center gap-1.5 text-slate-600 font-semibold text-[11px]">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    <span>Live Theme Preview</span>
                  </div>
                  <div className="p-4 rounded-lg border border-slate-200 bg-white text-slate-900 flex items-center justify-between shadow-2xs">
                    <div>
                      <div className="font-bold text-slate-900 text-sm" style={{ fontFamily: cfg?.fontFamily || 'Inter, sans-serif' }}>
                        {selectedTheme.name}
                      </div>
                      <span className="text-[11px] font-semibold block mt-0.5" style={{ color: cfg?.accentColor || '#3b82f6' }}>
                        {cfg?.badgeText || 'Official College Portal'}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="px-3 py-1 rounded-md text-[11px] font-bold text-white shadow-xs" style={{ backgroundColor: cfg?.primaryColor || '#1e40af' }}>
                        Primary
                      </span>
                      <span className="px-3 py-1 rounded-md text-[11px] font-bold text-slate-950 shadow-xs" style={{ backgroundColor: cfg?.secondaryColor || '#f59e0b' }}>
                        Secondary
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()
        ) : (
          <div className="space-y-4 text-xs">
            {modalError && (
              <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                {modalError}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Theme Name</label>
                <input
                  type="text"
                  placeholder="e.g. Royal Crimson & Gold"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!code) setCode(`THEME_${e.target.value.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`);
                  }}
                  className="w-full px-3.5 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Theme Code (Uppercase)</label>
                <input
                  type="text"
                  placeholder="e.g. THEME_CRIMSON"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full px-3.5 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 font-mono uppercase placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>
            </div>

            {/* 9 Template Theme Preset Quick-Load Buttons */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-bold text-slate-700 block">
                Quick Preset: Match Template Suite
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { name: 'Blueprint Navy', code: 'THEME_BLUE', p: '#1e40af', s: '#f59e0b', a: '#3b82f6', tag: 'T1' },
                  { name: 'Gold & Maroon', code: 'THEME_GOLD', p: '#991b1b', s: '#d97706', a: '#b45309', tag: 'T2' },
                  { name: 'Clinical Teal', code: 'THEME_TEAL', p: '#0f766e', s: '#06b6d4', a: '#14b8a6', tag: 'T3' },
                  { name: 'Oxford Crimson', code: 'THEME_CRIMSON', p: '#881337', s: '#1e3a8a', a: '#be123c', tag: 'T4' },
                  { name: 'Slanted Navy & Gold', code: 'THEME_SLANTED_NAVY', p: '#134975', s: '#e5a912', a: '#3b82f6', tag: 'T5' },
                  { name: 'Cyber Glass Aurora', code: 'THEME_CYBER_GLASS', p: '#0891b2', s: '#8b5cf6', a: '#06b6d4', tag: 'T6' },
                  { name: 'Tactile Isometric', code: 'THEME_TACTILE_VOXEL', p: '#d97706', s: '#0f172a', a: '#f59e0b', tag: 'T7' },
                  { name: 'Kinetic Neon Flip', code: 'THEME_KINETIC_NEON', p: '#e11d48', s: '#7c3aed', a: '#f43f5e', tag: 'T8' },
                  { name: 'Soft Neumorphic', code: 'THEME_SOFT_NEUMORPHIC', p: '#0d9488', s: '#334155', a: '#14b8a6', tag: 'T9' },
                ].map((pre) => (
                  <button
                    key={pre.tag}
                    type="button"
                    onClick={() => {
                      setName(pre.name);
                      setCode(pre.code);
                      setPrimaryColor(pre.p);
                      setSecondaryColor(pre.s);
                      setAccentColor(pre.a);
                    }}
                    className="px-2 py-1 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-md text-[10px] font-semibold text-slate-700 hover:text-blue-700 transition cursor-pointer flex items-center gap-1 shadow-2xs"
                  >
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: pre.p }} />
                    <span>{pre.tag}: {pre.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Color Pickers Grid */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <span className="font-semibold text-slate-800 block text-xs">Dynamic CSS Color Palette</span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Primary Color</label>
                  <div className="flex items-center gap-2 p-1.5 rounded-lg bg-white border border-slate-300">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-7 h-7 rounded cursor-pointer bg-transparent border-0"
                    />
                    <input
                      type="text"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-full bg-transparent font-mono text-xs text-slate-900 focus:outline-none font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">Secondary Color</label>
                  <div className="flex items-center gap-2 p-1.5 rounded-lg bg-white border border-slate-300">
                    <input
                      type="color"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="w-7 h-7 rounded cursor-pointer bg-transparent border-0"
                    />
                    <input
                      type="text"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="w-full bg-transparent font-mono text-xs text-slate-900 focus:outline-none font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">Accent Color</label>
                  <div className="flex items-center gap-2 p-1.5 rounded-lg bg-white border border-slate-300">
                    <input
                      type="color"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="w-7 h-7 rounded cursor-pointer bg-transparent border-0"
                    />
                    <input
                      type="text"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="w-full bg-transparent font-mono text-xs text-slate-900 focus:outline-none font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Typography & Badge */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Font Family</label>
                <select
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="Inter, sans-serif">Inter (Modern Clean Sans)</option>
                  <option value="Merriweather, serif">Merriweather (Classic Academic Serif)</option>
                  <option value="'Roboto', sans-serif">Roboto (Tech & Modern)</option>
                  <option value="'Playfair Display', serif">Playfair Display (Prestigious Heritage)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Default Header Badge Text</label>
                <input
                  type="text"
                  placeholder="e.g. Center of Excellence"
                  value={badgeText}
                  onChange={(e) => setBadgeText(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
                />
              </div>
            </div>

            {/* Live Preview Card */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="flex items-center gap-1.5 text-slate-600 font-semibold text-[11px]">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Live Theme Preview</span>
              </div>
              <div className="p-3.5 rounded-lg border border-slate-200 bg-white text-slate-900 flex items-center justify-between shadow-2xs">
                <div>
                  <div className="font-bold text-slate-900 text-sm" style={{ fontFamily }}>
                    {name || 'Sample College Title'}
                  </div>
                  <span className="text-[11px] font-semibold block mt-0.5" style={{ color: accentColor }}>
                    {badgeText || 'Official College Portal'}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="px-3 py-1 rounded-md text-[11px] font-bold text-white shadow-xs" style={{ backgroundColor: primaryColor }}>
                    Primary
                  </span>
                  <span className="px-3 py-1 rounded-md text-[11px] font-bold text-slate-950 shadow-xs" style={{ backgroundColor: secondaryColor }}>
                    Secondary
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </FormDrawer>

      {/* EDIT THEME DRAWER — colors, typography, activation */}
      <FormDrawer
        isOpen={isEditDrawerOpen}
        onClose={() => {
          setIsEditDrawerOpen(false);
          setEditTarget(null);
        }}
        title={`Edit Theme — '${editTarget?.name || ''}'`}
        subtitle={`Theme Code: ${editTarget?.code || ''} (immutable)`}
        icon={<Pencil className="w-5 h-5 text-indigo-600" />}
        mode="edit"
        size="lg"
        loading={editSaving}
        onSubmit={handleUpdateTheme}
        submitText="Save Theme Changes"
      >
        <div className="space-y-4 text-xs">
          {editError && (
            <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
              {editError}
            </div>
          )}

          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 font-medium">
            Colleges currently assigned to this theme will pick up the new colors on their next page load.
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-1">Theme Name</label>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
              required
            />
          </div>

          {/* Color Pickers Grid */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <span className="font-semibold text-slate-800 block text-xs">Dynamic CSS Color Palette</span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Primary Color</label>
                <div className="flex items-center gap-2 p-1.5 rounded-lg bg-white border border-slate-300">
                  <input
                    type="color"
                    value={editPrimaryColor}
                    onChange={(e) => setEditPrimaryColor(e.target.value)}
                    className="w-7 h-7 rounded cursor-pointer bg-transparent border-0"
                  />
                  <input
                    type="text"
                    value={editPrimaryColor}
                    onChange={(e) => setEditPrimaryColor(e.target.value)}
                    className="w-full bg-transparent font-mono text-xs text-slate-900 focus:outline-none font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Secondary Color</label>
                <div className="flex items-center gap-2 p-1.5 rounded-lg bg-white border border-slate-300">
                  <input
                    type="color"
                    value={editSecondaryColor}
                    onChange={(e) => setEditSecondaryColor(e.target.value)}
                    className="w-7 h-7 rounded cursor-pointer bg-transparent border-0"
                  />
                  <input
                    type="text"
                    value={editSecondaryColor}
                    onChange={(e) => setEditSecondaryColor(e.target.value)}
                    className="w-full bg-transparent font-mono text-xs text-slate-900 focus:outline-none font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Accent Color</label>
                <div className="flex items-center gap-2 p-1.5 rounded-lg bg-white border border-slate-300">
                  <input
                    type="color"
                    value={editAccentColor}
                    onChange={(e) => setEditAccentColor(e.target.value)}
                    className="w-7 h-7 rounded cursor-pointer bg-transparent border-0"
                  />
                  <input
                    type="text"
                    value={editAccentColor}
                    onChange={(e) => setEditAccentColor(e.target.value)}
                    className="w-full bg-transparent font-mono text-xs text-slate-900 focus:outline-none font-medium"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Typography & Badge */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-medium mb-1">Font Family</label>
              <select
                value={editFontFamily}
                onChange={(e) => setEditFontFamily(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="Inter, sans-serif">Inter (Modern Clean Sans)</option>
                <option value="Merriweather, serif">Merriweather (Classic Academic Serif)</option>
                <option value="'Roboto', sans-serif">Roboto (Tech & Modern)</option>
                <option value="'Playfair Display', serif">Playfair Display (Prestigious Heritage)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">Default Header Badge Text</label>
              <input
                type="text"
                value={editBadgeText}
                onChange={(e) => setEditBadgeText(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
              />
            </div>
          </div>

          <label className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
            <input
              type="checkbox"
              checked={editIsActive}
              onChange={(e) => setEditIsActive(e.target.checked)}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 shrink-0"
            />
            <div>
              <span className="font-semibold text-slate-900 block">Theme Active</span>
              <span className="text-[11px] text-slate-500 block">
                Inactive themes cannot be assigned to new colleges.
              </span>
            </div>
          </label>

          {/* Live Preview Card */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
            <div className="flex items-center gap-1.5 text-slate-600 font-semibold text-[11px]">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Live Theme Preview</span>
            </div>
            <div className="p-3.5 rounded-lg border border-slate-200 bg-white text-slate-900 flex items-center justify-between shadow-2xs">
              <div>
                <div className="font-bold text-slate-900 text-sm" style={{ fontFamily: editFontFamily }}>
                  {editName || 'Sample College Title'}
                </div>
                <span className="text-[11px] font-semibold block mt-0.5" style={{ color: editAccentColor }}>
                  {editBadgeText || 'Official College Portal'}
                </span>
              </div>
              <div className="flex gap-2">
                <span className="px-3 py-1 rounded-md text-[11px] font-bold text-white shadow-xs" style={{ backgroundColor: editPrimaryColor }}>
                  Primary
                </span>
                <span className="px-3 py-1 rounded-md text-[11px] font-bold text-slate-950 shadow-xs" style={{ backgroundColor: editSecondaryColor }}>
                  Secondary
                </span>
              </div>
            </div>
          </div>
        </div>
      </FormDrawer>

      {/* DELETE THEME CONFIRMATION */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteTheme}
        title={`Delete Theme "${deleteTarget?.name}"?`}
        message="Colleges currently assigned to this theme will fall back to the platform default. This action is recorded in the audit trail."
        confirmText="Delete Theme"
        cancelText="Cancel"
        variant="danger"
        loading={deleteBusy}
      />
    </div>
  );
};
