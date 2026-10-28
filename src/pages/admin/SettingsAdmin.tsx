import React, { useEffect, useState } from 'react';
import {
  Building,
  Save,
  Check,
  X,
  Sun,
  Moon,
  Sparkles,
  Image as ImageIcon,
  Globe,
  Mail,
  Phone,
  MapPin,
  Tag,
  Eye,
  Sliders,
  Type,
  ShieldCheck,
  RotateCcw,
  BookOpen,
  Activity,
  Cpu,
  Landmark,
  Clock,
  Compass,
  HeartPulse,
  Bell,
  AlertCircle,
  Megaphone,
  ExternalLink,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Layers,
  Power,
  Palette
} from 'lucide-react';
import { apiClient } from '../../services/apiClient';
import { FileUploadInput } from '../../UI_Componentes/ui/Form/FileUploadInput';
import { useToast } from '../../UI_Componentes/ui';
import { useTenant } from '../../tenant/TenantContext';
import { IconPicker, getLucideIcon } from '../../components/common/IconPicker';

// (rest of component)
import { useTheme } from '../../themes/ThemeContext';
import { 
  SkyBlueSlantedTemplate,
  RoyalGoldCurvedTemplate,
  EmeraldBotanicalTemplate,
  ModernTechPolygonTemplate
} from '../../components/auth/LoginTemplates';

export const SettingsAdminPage: React.FC = () => {
  const { siteConfig, refreshConfig } = useTenant();
  const { isArtsAndScience, isMedical, isEngineering, isUniversity } = useTheme();

  const [siteName, setSiteName] = useState('');
  const [tagline, setTagline] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [address, setAddress] = useState('');
  const [officeHours, setOfficeHours] = useState('');
  const [googleMapsUrl, setGoogleMapsUrl] = useState('');
  const [loginBgImageUrl, setLoginBgImageUrl] = useState('');
  const [previewTheme, setPreviewTheme] = useState<'light' | 'dark'>('light');

  // Topbar Announcement & Helpline Card State
  const [topbarActive, setTopbarActive] = useState(false);
  const [topbarPosition, setTopbarPosition] = useState<'split' | 'center' | 'left' | 'right'>('split');
  const [topbarIcon, setTopbarIcon] = useState('HeartPulse');
  const [topbarHeadline, setTopbarHeadline] = useState('');
  const [topbarBadgeText, setTopbarBadgeText] = useState('');
  const [topbarLink1Text, setTopbarLink1Text] = useState('');
  const [topbarLink1Url, setTopbarLink1Url] = useState('');
  const [topbarLink2Text, setTopbarLink2Text] = useState('');
  const [topbarLink2Url, setTopbarLink2Url] = useState('');
  const [topbarLink2Highlight, setTopbarLink2Highlight] = useState(true);
  const [topbarBgColor, setTopbarBgColor] = useState('#042f2e');
  const [topbarTextColor, setTopbarTextColor] = useState('#ffffff');

  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    if (type === 'success') {
      toast.success(text);
    } else {
      toast.error(text);
    }
  };

  const getLegacyHex = (scheme?: string) => {
    switch (scheme) {
      case 'blue': return '#0f172a';
      case 'indigo': return '#1e1b4b';
      case 'emerald': return '#064e3b';
      case 'crimson': return '#881337';
      case 'amber': return '#78350f';
      case 'dark': return '#020617';
      case 'teal':
      default: return '#042f2e';
    }
  };

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/admin/profile/settings');
      if (res.data.success && res.data.data) {
        const d = res.data.data;
        setSiteName(d.siteName || siteConfig?.tenant?.name || '');
        setTagline(d.tagline || 'Century of Global Academic Distinction');
        setLogoUrl(d.logoUrl || '');
        setContactEmail(d.contactEmail || '');
        setContactPhone(d.contactPhone || '');
        setAddress(d.address || '');
        setOfficeHours(d.officeHours || d.socialLinks?.officeHours || 'Monday - Saturday: 9:00 AM - 5:00 PM');
        setGoogleMapsUrl(d.googleMapsUrl || d.socialLinks?.googleMapsUrl || '');
        setLoginBgImageUrl(d.loginBgImageUrl || '');

        const topbar = d.socialLinks?.topbar;
        const defaultHex = isMedical ? '#042f2e' : isArtsAndScience ? '#78350f' : isUniversity ? '#881337' : '#0f172a';
        if (topbar) {
          setTopbarActive(Boolean(topbar.isActive));
          setTopbarPosition(topbar.position || 'split');
          setTopbarIcon(topbar.icon || 'HeartPulse');
          setTopbarHeadline(topbar.headline || '');
          setTopbarBadgeText(topbar.badgeText || '');
          setTopbarLink1Text(topbar.link1Text || '');
          setTopbarLink1Url(topbar.link1Url || '');
          setTopbarLink2Text(topbar.link2Text || '');
          setTopbarLink2Url(topbar.link2Url || '');
          setTopbarLink2Highlight(topbar.link2Highlight !== false);
          setTopbarBgColor(topbar.bgColor || getLegacyHex(topbar.colorScheme) || defaultHex);
          setTopbarTextColor(topbar.textColor || '#ffffff');
        } else {
          setTopbarActive(false);
          setTopbarPosition('split');
          setTopbarIcon(isMedical ? 'HeartPulse' : 'Phone');
          setTopbarHeadline('');
          setTopbarBadgeText('');
          setTopbarLink1Text('');
          setTopbarLink1Url('');
          setTopbarLink2Text('');
          setTopbarLink2Url('');
          setTopbarLink2Highlight(true);
          setTopbarBgColor(defaultHex);
          setTopbarTextColor('#ffffff');
        }
      }
    } catch (err) {
      console.error('Failed to load settings', err);
      showNotification('Failed to load campus settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      setSaving(true);
      const payload = {
        siteName: siteName.trim(),
        tagline: tagline.trim(),
        logoUrl: logoUrl.trim(),
        contactEmail: contactEmail.trim(),
        contactPhone: contactPhone.trim(),
        address: address.trim(),
        officeHours: officeHours.trim(),
        googleMapsUrl: googleMapsUrl.trim(),
        loginBgImageUrl: loginBgImageUrl.trim(),
        socialLinks: {
          ...(siteConfig?.settings?.socialLinks || {}),
          officeHours: officeHours.trim(),
          googleMapsUrl: googleMapsUrl.trim(),
          topbar: {
            isActive: topbarActive,
            position: topbarPosition,
            icon: topbarIcon,
            headline: topbarHeadline.trim(),
            badgeText: topbarBadgeText.trim(),
            link1Text: topbarLink1Text.trim(),
            link1Url: topbarLink1Url.trim(),
            link2Text: topbarLink2Text.trim(),
            link2Url: topbarLink2Url.trim(),
            link2Highlight: topbarLink2Highlight,
            bgColor: topbarBgColor,
            textColor: topbarTextColor,
          }
        }
      };

      const res = await apiClient.put('/admin/profile/settings', payload);
      if (res.data.success) {
        showNotification('College branding, topbar & header settings successfully updated!');
        await refreshConfig();
      } else {
        showNotification(res.data.message || 'Failed to update settings', 'error');
      }
    } catch (err: any) {
      console.error(err);
      showNotification('Error updating college settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const CrestIcon = isArtsAndScience ? BookOpen : isMedical ? Activity : isUniversity ? Landmark : Cpu;

  const defaultCampusPhoto = isArtsAndScience
    ? 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?q=80&w=1600&auto=format&fit=crop'
    : isMedical
      ? 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1600&auto=format&fit=crop'
      : isUniversity
        ? 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?q=80&w=1600&auto=format&fit=crop'
        : 'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1600&auto=format&fit=crop';

  const effectiveCampusImage = loginBgImageUrl || defaultCampusPhoto;

  const activeTemplateCode = (
    siteConfig?.settings?.loginTemplate || 
    siteConfig?.theme?.configuration?.loginTemplate || 
    siteConfig?.tenant?.loginTemplate || 
    'template2'
  ).toLowerCase();

  const dummyTemplateProps = {
    collegeName: siteName || siteConfig?.tenant?.name || 'GP College',
    tagline: tagline || 'Century of Global Academic Distinction',
    campusImage: effectiveCampusImage,
    tenantDomain: siteConfig?.tenant?.primaryDomain || 'gpcollege.localhost',
    siteConfig: {
      ...siteConfig,
      settings: {
        ...siteConfig?.settings,
        logoUrl: logoUrl,
        siteName: siteName,
        tagline: tagline
      }
    },
    CrestIcon,
    username: 'admin@college.edu',
    setUsername: () => {},
    password: '••••••••',
    setPassword: () => {},
    showPassword: false,
    setShowPassword: () => {},
    rememberMe: true,
    setRememberMe: () => {},
    loading: false,
    error: null,
    setError: () => {},
    handleLogin: (e: any) => e.preventDefault()
  };

  const renderActiveLoginTemplatePreview = () => {
    switch (activeTemplateCode) {
      case 'template1':
        return <SkyBlueSlantedTemplate {...dummyTemplateProps} />;
      case 'template3':
        return <EmeraldBotanicalTemplate {...dummyTemplateProps} />;
      case 'template4':
        return <ModernTechPolygonTemplate {...dummyTemplateProps} />;
      case 'template2':
      default:
        return <RoyalGoldCurvedTemplate {...dummyTemplateProps} />;
    }
  };

  const tenantCodePrefix = (siteConfig?.tenant?.tenantCode || siteName.split(' ')[0] || 'SHC').toUpperCase();

  return (
    <div className="space-y-6 font-sans text-slate-900 dark:text-slate-100 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Building className="w-6 h-6 text-blue-600" />
            <span>College Branding & Header Settings</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Customize institutional identity, tagline presentation, logo, and header appearance.
          </p>
        </div>
        <button
          type="button"
          onClick={() => handleSave()}
          disabled={saving}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-xl text-xs shadow-sm transition flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save All Changes'}</span>
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-500 font-semibold bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          Loading college branding & presentation settings...
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-6">
          {/* Card 1: Institutional Name & Identity */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>1. Institutional Name & Identity</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1.5">
                  College Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  placeholder="e.g. Sacred Heart College (Autonomous)"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-sm text-slate-900 dark:text-white font-semibold focus:ring-2 focus:ring-blue-600 focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1.5">
                  Institutional Subtitle / Tagline *
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="e.g. Century of Global Academic Distinction"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-sm text-slate-900 dark:text-white font-semibold focus:ring-2 focus:ring-blue-600 focus:outline-none transition"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Official College Brand Logo */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-blue-600" />
              <span>2. Official College Brand Logo</span>
            </h3>

            <FileUploadInput
              label="Select or upload logo file"
              value={logoUrl}
              onChange={(val) => setLogoUrl(val)}
              placeholder="Click to choose a local logo file..."
              accept="image/*"
            />
          </div>

          {/* Card 3: Sidebar Header & Tenant Badge Presentation (EDITABLE) */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-blue-600" />
                <span>3. Sidebar Header & Tenant Badge Presentation</span>
              </h3>
              <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                Live Editable
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Customize how your college logo, badge title, and tagline render in the Admin Sidebar header and top toolbar.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
              {/* Editable Field 1 */}
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                  Sidebar Tagline / Badge Text
                </label>
                <div className="relative">
                  <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="e.g. Century of Global Academic Distinction"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Editable Field 2 */}
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                  Tenant Code Label
                </label>
                <div className="relative">
                  <Type className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={siteName}
                    onChange={(e) => setSiteName(e.target.value)}
                    placeholder="e.g. SHC"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Live View Preview Box */}
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                  Sidebar Header UI Live View
                </label>
                <div className="p-3 bg-slate-900 text-white rounded-xl border border-slate-800 flex items-center gap-3 shadow-sm">
                  {logoUrl ? (
                    <div className="w-9 h-9 rounded-xl bg-white p-1 flex items-center justify-center shrink-0 shadow-xs border border-slate-700/50">
                      <img
                        src={logoUrl}
                        alt="Sidebar Brand Logo"
                        className="w-full h-full object-contain"
                        onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                      />
                    </div>
                  ) : (
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-2xs">
                      {(siteName || 'S').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0 flex-1 flex flex-col justify-center">
                    <h4 className="font-extrabold text-white text-xs leading-snug tracking-tight truncate">
                      {siteName || 'College Name'}
                    </h4>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-800/90 text-amber-400 border border-slate-700/60 shrink-0">
                        <ShieldCheck className="w-3 h-3 text-amber-400 shrink-0" />
                        <span className="truncate">{tenantCodePrefix}</span>
                      </span>
                    </div>
                    {tagline && (
                      <p className="text-[10px] text-blue-400 font-semibold truncate mt-0.5">
                        {tagline}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 4: Topbar Announcement & Helpline Bar (DYNAMIC & EDITABLE) */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Megaphone className="w-4 h-4 text-blue-600" />
                  <span>4. Topbar Announcement &amp; Helpline Card</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configure topbar emergency helplines, urgent notices, accreditation highlights, and action links.
                </p>
              </div>

              {/* Active / Inactive Switch */}
              <button
                type="button"
                onClick={() => setTopbarActive(!topbarActive)}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shadow-2xs ${
                  topbarActive
                    ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300'
                }`}
              >
                <Power className="w-3.5 h-3.5" />
                <span>{topbarActive ? 'ACTIVE (Visible on Site)' : 'INACTIVE (Hidden)'}</span>
              </button>
            </div>

            {/* Live Interactive Preview */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-bold uppercase text-slate-600 dark:text-slate-400">
                  Topbar Live Preview
                </label>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md ${
                  topbarActive ? 'bg-emerald-100 text-emerald-800 font-bold' : 'bg-slate-100 text-slate-500'
                }`}>
                  {topbarActive ? '● Currently Enabled' : '○ Disabled (Hidden from visitors)'}
                </span>
              </div>

              <div
                style={topbarActive ? { backgroundColor: topbarBgColor, color: topbarTextColor, borderColor: 'rgba(255,255,255,0.15)' } : undefined}
                className={`p-3 rounded-xl border overflow-hidden transition ${
                  topbarActive 
                    ? 'shadow-sm' 
                    : 'bg-slate-100/80 dark:bg-slate-800/40 border-dashed border-slate-300 dark:border-slate-700 text-slate-400'
                }`}
              >
                {topbarActive ? (
                  <div className={`flex flex-wrap items-center gap-2 text-xs font-medium ${
                    topbarPosition === 'center' ? 'justify-center text-center' :
                    topbarPosition === 'left' ? 'justify-start text-left' :
                    topbarPosition === 'right' ? 'justify-end text-right' :
                    'justify-between'
                  }`}>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="flex items-center gap-1.5 font-bold">
                        {topbarIcon && topbarIcon !== 'None' && topbarIcon !== 'none' && (() => {
                          const LiveIcon = getLucideIcon(topbarIcon);
                          const isPulse = topbarIcon === 'HeartPulse' || topbarIcon === 'Activity';
                          return <LiveIcon className={`w-3.5 h-3.5 shrink-0 ${isPulse ? 'animate-pulse text-rose-400' : ''}`} />;
                        })()}
                        <span>{topbarHeadline || 'Enter headline / emergency helpline text below...'}</span>
                      </span>
                      {topbarBadgeText && (
                        <>
                          <span className="opacity-40">|</span>
                          <span className="opacity-80 text-[11px] font-normal">{topbarBadgeText}</span>
                        </>
                      )}
                    </div>
                    {(topbarLink1Text || topbarLink2Text) && (
                      <div className="flex items-center gap-2 text-[11px]">
                        {topbarLink1Text && <span className="underline opacity-90">{topbarLink1Text}</span>}
                        {topbarLink1Text && topbarLink2Text && <span className="opacity-40">•</span>}
                        {topbarLink2Text && (
                          <span className={topbarLink2Highlight ? 'bg-amber-400 text-slate-950 font-bold px-1.5 py-0.5 rounded text-[10px]' : 'underline'}>
                            {topbarLink2Text}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="py-2 text-center text-xs space-y-1">
                    <p className="font-semibold text-slate-500">Topbar is currently turned OFF.</p>
                    <p className="text-[11px]">Toggle the switch above to activate and display it on your public website.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Topbar Layout & Content Configuration */}
            <div className="space-y-4 pt-2">
              {/* Row 1: Position Alignment & Icon */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 dark:text-slate-400 mb-1.5">
                    Layout Alignment / Position
                  </label>
                  <div className="grid grid-cols-4 gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                    {[
                      { key: 'split', label: 'Split', icon: <Layers className="w-3 h-3" /> },
                      { key: 'center', label: 'Center', icon: <AlignCenter className="w-3 h-3" /> },
                      { key: 'left', label: 'Left', icon: <AlignLeft className="w-3 h-3" /> },
                      { key: 'right', label: 'Right', icon: <AlignRight className="w-3 h-3" /> },
                    ].map((p) => (
                      <button
                        key={p.key}
                        type="button"
                        onClick={() => setTopbarPosition(p.key as any)}
                        className={`py-1.5 rounded-lg text-xs font-semibold flex flex-col items-center gap-1 transition cursor-pointer ${
                          topbarPosition === p.key
                            ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs'
                            : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                        }`}
                      >
                        {p.icon}
                        <span className="text-[10px]">{p.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 dark:text-slate-400 mb-1.5 flex items-center justify-between">
                    <span>Helpline / Alert Icon</span>
                    {topbarIcon && <span className="font-mono text-[10px] text-blue-600 dark:text-blue-400 font-bold">{topbarIcon}</span>}
                  </label>
                  <IconPicker
                    value={topbarIcon}
                    onChange={(newIcon) => setTopbarIcon(newIcon)}
                    placeholder="Search & choose any icon..."
                  />
                </div>
              </div>

              {/* Color Customizer */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-blue-600" />
                    Topbar Color Customizer
                  </span>
                  <span className="text-[10px] text-slate-400">Custom background and text colors</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-600 dark:text-slate-400 mb-1 flex items-center justify-between">
                      <span>Background Color</span>
                      <span className="font-mono text-blue-600">{topbarBgColor}</span>
                    </label>
                    <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-1.5 shadow-2xs">
                      <input
                        type="color"
                        value={topbarBgColor}
                        onChange={(e) => setTopbarBgColor(e.target.value)}
                        className="w-7 h-7 rounded border-0 cursor-pointer p-0 bg-transparent shrink-0"
                      />
                      <input
                        type="text"
                        value={topbarBgColor}
                        onChange={(e) => setTopbarBgColor(e.target.value)}
                        placeholder="#042f2e"
                        className="w-full bg-transparent text-xs font-mono font-bold uppercase text-slate-800 dark:text-slate-100 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-600 dark:text-slate-400 mb-1 flex items-center justify-between">
                      <span>Text &amp; Link Color</span>
                      <span className="font-mono text-blue-600">{topbarTextColor}</span>
                    </label>
                    <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-1.5 shadow-2xs">
                      <input
                        type="color"
                        value={topbarTextColor}
                        onChange={(e) => setTopbarTextColor(e.target.value)}
                        className="w-7 h-7 rounded border-0 cursor-pointer p-0 bg-transparent shrink-0"
                      />
                      <input
                        type="text"
                        value={topbarTextColor}
                        onChange={(e) => setTopbarTextColor(e.target.value)}
                        placeholder="#ffffff"
                        className="w-full bg-transparent text-xs font-mono font-bold uppercase text-slate-800 dark:text-slate-100 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-1.5 border-t border-slate-200 dark:border-slate-700 flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Presets:</span>
                  {[
                    { label: 'Dark Teal', bg: '#042f2e', text: '#ffffff' },
                    { label: 'Deep Blue', bg: '#0f172a', text: '#ffffff' },
                    { label: 'Royal Indigo', bg: '#1e1b4b', text: '#ffffff' },
                    { label: 'Emerald', bg: '#064e3b', text: '#ffffff' },
                    { label: 'Crimson', bg: '#881337', text: '#ffffff' },
                    { label: 'Warm Amber', bg: '#78350f', text: '#ffffff' },
                    { label: 'Slate Dark', bg: '#020617', text: '#ffffff' },
                  ].map((s) => (
                    <button
                      key={s.bg}
                      type="button"
                      onClick={() => {
                        setTopbarBgColor(s.bg);
                        setTopbarTextColor(s.text);
                      }}
                      className="px-2 py-0.5 rounded text-[10px] font-semibold border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-blue-500 cursor-pointer transition flex items-center gap-1"
                    >
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.bg }} />
                      <span>{s.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Row 2: Headline & Secondary Badge Text */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                    Primary Headline / Emergency Helpline Text
                  </label>
                  <input
                    type="text"
                    value={topbarHeadline}
                    onChange={(e) => setTopbarHeadline(e.target.value)}
                    placeholder="e.g. 24/7 Casualty & Hospital Helpline: +91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                    Secondary Accreditation / Highlight Text
                  </label>
                  <input
                    type="text"
                    value={topbarBadgeText}
                    onChange={(e) => setTopbarBadgeText(e.target.value)}
                    placeholder="e.g. NMC Recognized · 1200-Bed Teaching Hospital"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Row 3: Action Links 1 & 2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <div className="space-y-2">
                  <span className="text-[11px] font-bold uppercase text-slate-700 dark:text-slate-300 block">
                    Action Link 1 (Standard Link)
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Label (e.g. Patient Desk)"
                      value={topbarLink1Text}
                      onChange={(e) => setTopbarLink1Text(e.target.value)}
                      className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-xs dark:bg-slate-800 dark:text-white"
                    />
                    <input
                      type="text"
                      placeholder="URL (e.g. /contact)"
                      value={topbarLink1Url}
                      onChange={(e) => setTopbarLink1Url(e.target.value)}
                      className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-xs dark:bg-slate-800 dark:text-white font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase text-slate-700 dark:text-slate-300 block">
                      Action Link 2 (Highlighted Admission CTA)
                    </span>
                    <label className="flex items-center gap-1.5 text-[10px] font-semibold text-amber-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={topbarLink2Highlight}
                        onChange={(e) => setTopbarLink2Highlight(e.target.checked)}
                        className="rounded"
                      />
                      <span>Gold Highlight Badge</span>
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Label (e.g. NEET Admissions 2026)"
                      value={topbarLink2Text}
                      onChange={(e) => setTopbarLink2Text(e.target.value)}
                      className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-xs dark:bg-slate-800 dark:text-white"
                    />
                    <input
                      type="text"
                      placeholder="URL (e.g. /admissions)"
                      value={topbarLink2Url}
                      onChange={(e) => setTopbarLink2Url(e.target.value)}
                      className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-xs dark:bg-slate-800 dark:text-white font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 5: Website Header Live Preview & Interactive Controls (EDITABLE) */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-600" />
                  <span>5. Website Header Live Preview &amp; Layout Controls</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Interactive real-time preview of how the header appears to public visitors.
                </p>
              </div>

              {/* Theme Mode Toggle Pill for Preview */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setPreviewTheme('light')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold transition cursor-pointer ${previewTheme === 'light'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                >
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span>Light Header</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewTheme('dark')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold transition cursor-pointer ${previewTheme === 'dark'
                      ? 'bg-slate-950 text-white shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                >
                  <Moon className="w-3.5 h-3.5 text-blue-400" />
                  <span>Dark Header</span>
                </button>
              </div>
            </div>

            {/* Editable Header Customization Controls inside Section 4 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                  Header Display Name
                </label>
                <input
                  type="text"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  placeholder="e.g. SHC"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                  Header Subtitle / Tagline
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="e.g. Century of Global Academic Distinction"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-semibold text-blue-600 dark:text-blue-400 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Full Public Website Header Live Preview UI Box */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-md">
              {/* Topbar Announcement Simulation (Dynamic based on topbarActive) */}
              {topbarActive && (
                <div
                  style={{ backgroundColor: topbarBgColor, color: topbarTextColor, borderColor: 'rgba(255,255,255,0.15)' }}
                  className={`px-4 py-1.5 text-[11px] font-medium flex items-center gap-2 border-b ${
                    topbarPosition === 'center' ? 'justify-center text-center' :
                    topbarPosition === 'left' ? 'justify-start text-left' :
                    topbarPosition === 'right' ? 'justify-end text-right' :
                    'justify-between'
                  }`}
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="flex items-center gap-1.5 font-bold">
                      {topbarIcon === 'HeartPulse' && <HeartPulse className="w-3.5 h-3.5 text-rose-400 animate-pulse" />}
                      {topbarIcon === 'Phone' && <Phone className="w-3.5 h-3.5 text-emerald-400" />}
                      {topbarIcon === 'Bell' && <Bell className="w-3.5 h-3.5 text-amber-400" />}
                      {topbarIcon === 'AlertCircle' && <AlertCircle className="w-3.5 h-3.5 text-red-400" />}
                      {topbarIcon === 'Sparkles' && <Sparkles className="w-3.5 h-3.5 text-yellow-400" />}
                      {topbarIcon === 'Megaphone' && <Megaphone className="w-3.5 h-3.5 text-cyan-400" />}
                      <span>{topbarHeadline || '24/7 Casualty & Helpline / Announcement'}</span>
                    </span>
                    {topbarBadgeText && (
                      <>
                        <span className="opacity-40">|</span>
                        <span className="opacity-80 text-[10px]">{topbarBadgeText}</span>
                      </>
                    )}
                  </div>
                  {(topbarLink1Text || topbarLink2Text) && (
                    <div className="flex items-center gap-2 text-[10px]">
                      {topbarLink1Text && <span className="underline opacity-90">{topbarLink1Text}</span>}
                      {topbarLink1Text && topbarLink2Text && <span className="opacity-40">•</span>}
                      {topbarLink2Text && (
                        <span className={topbarLink2Highlight ? 'bg-amber-400 text-slate-950 font-bold px-1.5 py-0.5 rounded' : 'underline'}>
                          {topbarLink2Text}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Main Header Container Simulation */}
              <div
                className={`p-4 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${previewTheme === 'dark'
                    ? 'bg-slate-950 text-white'
                    : 'bg-white text-slate-900 border-t border-slate-100'
                  }`}
              >
                {/* Brand & Crest */}
                <div className="flex items-center gap-3.5">
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt="College Logo Preview"
                      className="h-11 max-w-[160px] object-contain shrink-0"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-lg shrink-0 shadow-sm">
                      {(siteName || 'S').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className="text-lg font-black tracking-tight leading-tight">
                      {siteName || 'College Name'}
                    </div>
                    <div
                      className={`text-xs font-semibold leading-tight ${previewTheme === 'dark' ? 'text-blue-400' : 'text-blue-700'
                        }`}
                    >
                      {tagline || 'Century of Global Academic Distinction'}
                    </div>
                  </div>
                </div>

                {/* Simulated Header Nav Links & CTA */}
                <div className="flex items-center gap-4 text-xs font-bold text-slate-500 dark:text-slate-400 shrink-0">
                  <span className="hidden md:inline hover:text-blue-600 transition cursor-pointer">Home</span>
                  <span className="hidden md:inline hover:text-blue-600 transition cursor-pointer">Academics</span>
                  <span className="hidden md:inline hover:text-blue-600 transition cursor-pointer">Departments</span>
                  <div className="px-3 py-1.5 rounded-xl bg-blue-600 text-white font-extrabold text-xs shadow-xs">
                    Apply Now
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 5: Website Mega-Footer & Campus Contact Office Info (EDITABLE + LIVE PREVIEW) */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-600" />
                  <span>5. Website Mega-Footer & Campus Office Info</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Update contact helpline details and preview the live public website mega-footer presentation.
                </p>
              </div>
              <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 self-start sm:self-auto">
                Live Preview & Editable
              </span>
            </div>

            {/* Editable Contact Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1.5">
                  Helpline Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="contact@college.edu"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1.5">
                  Helpline Phone
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+91 (044) 2834-9100"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1.5">
                  Campus Address
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="104 University Enclave, Chennai, TN"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1.5">
                  Office Working Hours / Timings
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={officeHours}
                    onChange={(e) => setOfficeHours(e.target.value)}
                    placeholder="Mon - Sat: 9:00 AM - 5:00 PM"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1.5">
                  Google Maps Embed / Location Link
                </label>
                <div className="relative">
                  <Compass className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={googleMapsUrl}
                    onChange={(e) => setGoogleMapsUrl(e.target.value)}
                    placeholder="https://maps.google.com/?q=..."
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Live Mega-Footer Preview UI Box */}
            <div className="pt-2">
              <label className="block text-[11px] font-bold uppercase text-slate-600 dark:text-slate-400 mb-1.5">
                Public Website Mega-Footer Live View
              </label>
              <div className="bg-slate-950 text-slate-400 rounded-xl p-6 border border-slate-800 space-y-6 shadow-md text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                  {/* Col 1 & 2: Branding & Tagline */}
                  <div className="lg:col-span-2 space-y-3">
                    <div className="flex items-center gap-3">
                      {logoUrl ? (
                        <div className="w-9 h-9 rounded-xl bg-white p-1 flex items-center justify-center shrink-0 shadow-xs border border-slate-700">
                          <img src={logoUrl} alt="Footer Logo" className="w-full h-full object-contain" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
                        </div>
                      ) : (
                        <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                          {(siteName || 'S').charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <span className="text-base font-black text-white block leading-tight">
                          {siteName || 'College Full Name'}
                        </span>
                        <span className="text-[11px] font-bold text-blue-400 block mt-0.5">
                          AICTE Approved • NBA Tier-1
                        </span>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed max-w-xs">
                      {tagline || 'Century of Global Academic Distinction'}
                    </p>
                  </div>

                  {/* Col 3: Academic Schools */}
                  <div>
                    <h4 className="text-[10px] font-black text-white uppercase tracking-wider mb-2.5 border-b border-slate-800 pb-1">
                      Academic Schools
                    </h4>
                    <ul className="space-y-1.5 text-[11px]">
                      <li className="hover:text-white transition">Departments Directory</li>
                      <li className="text-blue-400 font-bold">Explore Degree Programs →</li>
                    </ul>
                  </div>

                  {/* Col 4: Admissions & Campus */}
                  <div>
                    <h4 className="text-[10px] font-black text-white uppercase tracking-wider mb-2.5 border-b border-slate-800 pb-1">
                      Admissions & Campus
                    </h4>
                    <ul className="space-y-1 text-[11px]">
                      <li>Admissions</li>
                      <li>Events Calendar</li>
                      <li>Campus Gallery</li>
                      <li>Faculty Directory</li>
                      <li>Latest News</li>
                    </ul>
                  </div>

                  {/* Col 5: Campus Office Live View */}
                  <div>
                    <h4 className="text-[10px] font-black text-white uppercase tracking-wider mb-2.5 border-b border-slate-800 pb-1">
                      Campus Office
                    </h4>
                    <div className="space-y-2 text-[11px] text-slate-300">
                      {address ? (
                        <div className="flex items-start gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                          <span className="leading-snug">{address}</span>
                        </div>
                      ) : (
                        <div className="flex items-start gap-1.5 text-slate-500 italic">
                          <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                          <span>Address not specified</span>
                        </div>
                      )}
                      {contactPhone ? (
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                          <span>{contactPhone}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-slate-500 italic">
                          <Phone className="w-3.5 h-3.5 shrink-0" />
                          <span>Phone not specified</span>
                        </div>
                      )}
                      {contactEmail ? (
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                          <span>{contactEmail}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-slate-500 italic">
                          <Mail className="w-3.5 h-3.5 shrink-0" />
                          <span>Email not specified</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer Copyright Bottom Bar */}
                <div className="pt-4 border-t border-slate-900 flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-500">
                  <div>
                    © {new Date().getFullYear()} {siteName || 'College'}. All rights reserved. Powered by Institutional Dynamic CMS.
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 font-semibold">Portal: Active & Certified</span>
                    <span>•</span>
                    <span>Accredited Campus Network</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 6: Dynamic Login Page Left Background Photography & Live Preview */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-blue-600" />
                  <span>6. Dynamic Login Page Left Background Photography & Artwork</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Upload a custom campus photo or pick a high-resolution preset to customize the left-side artwork on your college login portal.
                </p>
              </div>
              {loginBgImageUrl && (
                <button
                  type="button"
                  onClick={() => setLoginBgImageUrl('')}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset to Default</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Upload (6 cols) */}
              <div className="lg:col-span-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1.5">
                    Upload Custom Login Background Image
                  </label>
                  <FileUploadInput
                    label="Select or upload login background file"
                    value={loginBgImageUrl}
                    onChange={(val) => setLoginBgImageUrl(val)}
                    placeholder="Click to choose a local campus photo or paste image URL..."
                    accept="image/*"
                  />
                </div>
              </div>

              {/* Right Column: Authentic Live View of Assigned College Login Page (6 cols) */}
              <div className="lg:col-span-6 space-y-3 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-extrabold uppercase text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-blue-600" />
                    <span>Live Assigned Login Portal Preview</span>
                  </label>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-600 text-white px-2.5 py-0.5 rounded-full shadow-2xs">
                    {activeTemplateCode.toUpperCase()}
                  </span>
                </div>

                {/* Scaled Real Login Component Canvas */}
                <div className="relative w-full h-[320px] rounded-2xl overflow-hidden border border-slate-300 dark:border-slate-700 bg-slate-950 shadow-md">
                  <div className="w-[1280px] h-[850px] origin-top-left scale-[0.38] pointer-events-none select-none overflow-hidden">
                    {renderActiveLoginTemplatePreview()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Primary Save Button */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-xl text-xs shadow-sm transition flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save All Changes'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};




