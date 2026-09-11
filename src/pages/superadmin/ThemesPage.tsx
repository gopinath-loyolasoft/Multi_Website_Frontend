import React, { useEffect, useState } from 'react';
import { Palette, RefreshCw, Plus, Sparkles, Eye } from 'lucide-react';
import { Theme, CreateThemePayload } from '../../types';
import { apiClient } from '../../services/apiClient';
import { FormDrawer, DrawerMode } from '../../UI_Componentes/ui';

export const ThemesPage: React.FC = () => {
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

  const fetchThemes = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiClient.get('/superadmin/themes');
      if (res.data.success) {
        setThemes(res.data.data || []);
      } else {
        setError(res.data.message || 'Failed to fetch themes');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Failed to load themes');
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

                <div className="pt-2 border-t border-slate-100 flex justify-end">
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
    </div>
  );
};
