import React, { useEffect, useState } from 'react';
import {
  Megaphone,
  Save,
  Power,
  HeartPulse,
  Phone,
  Bell,
  AlertCircle,
  Sparkles,
  Layers,
  AlignCenter,
  AlignLeft,
  AlignRight,
  ExternalLink,
  RotateCcw,
  CheckCircle2,
  RefreshCw,
  Eye,
  Info,
  Palette
} from 'lucide-react';
import { apiClient } from '../../services/apiClient';
import { useToast } from '../../UI_Componentes/ui';
import { useTenant } from '../../tenant/TenantContext';
import { useTheme } from '../../themes/ThemeContext';
import { IconPicker, getLucideIcon } from '../../components/common/IconPicker';

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

export const TopbarCardAdminPage: React.FC = () => {
  const { siteConfig, refreshConfig } = useTenant();
  const { isArtsAndScience, isMedical, isEngineering, isUniversity } = useTheme();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Topbar Form State
  const [isActive, setIsActive] = useState(false);
  const [position, setPosition] = useState<'split' | 'center' | 'left' | 'right'>('split');
  const [icon, setIcon] = useState('HeartPulse');
  const [headline, setHeadline] = useState('');
  const [badgeText, setBadgeText] = useState('');
  const [link1Text, setLink1Text] = useState('');
  const [link1Url, setLink1Url] = useState('');
  const [link2Text, setLink2Text] = useState('');
  const [link2Url, setLink2Url] = useState('');
  const [link2Highlight, setLink2Highlight] = useState(true);
  const [bgColor, setBgColor] = useState('#042f2e');
  const [textColor, setTextColor] = useState('#ffffff');

  const defaultThemeHex = isMedical
    ? '#042f2e'
    : isArtsAndScience
    ? '#78350f'
    : isUniversity
    ? '#881337'
    : isEngineering
    ? '#1e1b4b'
    : '#0f172a';

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    if (type === 'success') {
      toast.success(text);
    } else {
      toast.error(text);
    }
  };

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/admin/profile/settings');
      if (res.data.success && res.data.data) {
        const d = res.data.data;
        const topbar = d.socialLinks?.topbar;
        if (topbar) {
          setIsActive(Boolean(topbar.isActive));
          setPosition(topbar.position || 'split');
          setIcon(topbar.icon || (isMedical ? 'HeartPulse' : 'Phone'));
          setHeadline(topbar.headline || '');
          setBadgeText(topbar.badgeText || '');
          setLink1Text(topbar.link1Text || '');
          setLink1Url(topbar.link1Url || '');
          setLink2Text(topbar.link2Text || '');
          setLink2Url(topbar.link2Url || '');
          setLink2Highlight(topbar.link2Highlight !== false);
          setBgColor(topbar.bgColor || getLegacyHex(topbar.colorScheme) || defaultThemeHex);
          setTextColor(topbar.textColor || '#ffffff');
        } else {
          setIsActive(false);
          setPosition('split');
          setIcon(isMedical ? 'HeartPulse' : 'Phone');
          setHeadline('');
          setBadgeText('');
          setLink1Text('');
          setLink1Url('');
          setLink2Text('');
          setLink2Url('');
          setLink2Highlight(true);
          setBgColor(defaultThemeHex);
          setTextColor('#ffffff');
        }
      }
    } catch (err) {
      console.error('Failed to load topbar settings', err);
      showNotification('Failed to load topbar card settings', 'error');
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
      const currentRes = await apiClient.get('/admin/profile/settings');
      const currentSettings = currentRes.data?.data || {};

      const payload = {
        siteName: currentSettings.siteName || siteConfig?.tenant.name || '',
        tagline: currentSettings.tagline || '',
        logoUrl: currentSettings.logoUrl || '',
        contactEmail: currentSettings.contactEmail || '',
        contactPhone: currentSettings.contactPhone || '',
        address: currentSettings.address || '',
        officeHours: currentSettings.officeHours || '',
        googleMapsUrl: currentSettings.googleMapsUrl || '',
        loginBgImageUrl: currentSettings.loginBgImageUrl || '',
        socialLinks: {
          ...(currentSettings.socialLinks || {}),
          topbar: {
            isActive,
            position,
            icon,
            headline: headline.trim(),
            badgeText: badgeText.trim(),
            link1Text: link1Text.trim(),
            link1Url: link1Url.trim(),
            link2Text: link2Text.trim(),
            link2Url: link2Url.trim(),
            link2Highlight,
            bgColor,
            textColor,
          },
        },
      };

      const res = await apiClient.put('/admin/profile/settings', payload);
      if (res.data.success) {
        showNotification('Topbar Announcement Card settings saved successfully!');
        await refreshConfig();
      } else {
        showNotification(res.data.message || 'Failed to save settings', 'error');
      }
    } catch (err: any) {
      console.error(err);
      showNotification('Error saving topbar settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handlePopulateSample = (sampleType: 'medical' | 'engineering' | 'arts' | 'general') => {
    setIsActive(true);
    setPosition('split');
    if (sampleType === 'medical') {
      setIcon('HeartPulse');
      setHeadline('24/7 Casualty & Hospital Helpline: +91 98765 43210');
      setBadgeText('NMC Recognized · 1200-Bed Teaching Hospital');
      setLink1Text('Patient Desk');
      setLink1Url('/contact');
      setLink2Text('NEET Admissions 2026');
      setLink2Url('/admissions');
      setLink2Highlight(true);
      setBgColor('#042f2e');
      setTextColor('#ffffff');
    } else if (sampleType === 'engineering') {
      setIcon('Phone');
      setHeadline('Admission & Counseling Helpline: 1800-425-8899');
      setBadgeText('AICTE Approved · NBA Accredited Tier-1');
      setLink1Text('Placement Stats');
      setLink1Url('/placements');
      setLink2Text('B.Tech Admissions 2026');
      setLink2Url('/admissions');
      setLink2Highlight(true);
      setBgColor('#1e1b4b');
      setTextColor('#ffffff');
    } else if (sampleType === 'arts') {
      setIcon('Sparkles');
      setHeadline('Admissions Open for Academic Year 2026-27');
      setBadgeText('NAAC A++ Grade (CGPA 3.78) · Autonomous College');
      setLink1Text('Fee Structure');
      setLink1Url('/admissions');
      setLink2Text('Apply Online Now');
      setLink2Url('/admissions');
      setLink2Highlight(true);
      setBgColor('#78350f');
      setTextColor('#ffffff');
    } else {
      setIcon('Bell');
      setHeadline('Campus Information Hotline: +91 44 2817 8200');
      setBadgeText('UGC Autonomous · Affiliated to State University');
      setLink1Text('Campus Map');
      setLink1Url('/contact');
      setLink2Text('Student Portal');
      setLink2Url('/admin/login');
      setLink2Highlight(false);
      setBgColor('#0f172a');
      setTextColor('#ffffff');
    }
    showNotification(`Populated ${sampleType.toUpperCase()} sample values. Click "Save Changes" to publish.`);
  };

  const handleClear = () => {
    setIsActive(false);
    setHeadline('');
    setBadgeText('');
    setLink1Text('');
    setLink1Url('');
    setLink2Text('');
    setLink2Url('');
    showNotification('Cleared topbar fields and set to Inactive.');
  };

  const getContainerStyle = () => {
    return {
      backgroundColor: bgColor,
      color: textColor,
      borderColor: 'rgba(255, 255, 255, 0.15)',
    };
  };

  return (
    <div className="space-y-6 font-sans text-slate-900 dark:text-slate-100">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Megaphone className="w-6 h-6 text-blue-600" />
            <span>Topbar Announcement Card</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage topbar emergency hotline, accreditation highlights, notification ticker, and action links.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={fetchSettings}
            disabled={loading}
            className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-semibold transition shadow-xs cursor-pointer"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            type="button"
            onClick={() => handleSave()}
            disabled={saving || loading}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-xl text-xs shadow-sm transition flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-500 font-semibold bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          Loading topbar settings...
        </div>
      ) : (
        <div className="space-y-6">
          {/* Status & Live Preview Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`} />
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Status: {isActive ? 'ACTIVE & VISIBLE' : 'INACTIVE (Hidden)'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {isActive
                      ? 'Renders at the very top of all website pages above the header.'
                      : 'Hidden from public visitors. Zero dummy text renders.'}
                  </p>
                </div>
              </div>

              {/* Active Toggle */}
              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer shadow-xs ${
                  isActive
                    ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300'
                }`}
              >
                <Power className="w-4 h-4" />
                <span>{isActive ? 'Active (Turn OFF)' : 'Inactive (Turn ON)'}</span>
              </button>
            </div>

            {/* Live Interactive Preview Box */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-blue-600" />
                  Live Website Header Preview
                </span>
                <span className="text-[11px] text-slate-400">
                  Position: <strong className="uppercase font-mono text-blue-600">{position}</strong>
                </span>
              </div>

              <div
                style={isActive ? getContainerStyle() : undefined}
                className={`p-3.5 rounded-xl border overflow-hidden transition shadow-sm ${
                  isActive ? '' : 'bg-slate-100/90 dark:bg-slate-800/40 border-dashed border-slate-300 dark:border-slate-700 text-slate-400'
                }`}
              >
                {isActive ? (
                  <div className={`flex flex-wrap items-center gap-2 text-xs font-medium ${
                    position === 'center' ? 'justify-center text-center' :
                    position === 'left' ? 'justify-start text-left' :
                    position === 'right' ? 'justify-end text-right' :
                    'justify-between'
                  }`}>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="flex items-center gap-1.5 font-bold">
                        {icon && icon !== 'None' && icon !== 'none' && (() => {
                          const LiveIcon = getLucideIcon(icon);
                          const isPulse = icon === 'HeartPulse' || icon === 'Activity';
                          return <LiveIcon className={`w-3.5 h-3.5 shrink-0 ${isPulse ? 'animate-pulse text-rose-400' : ''}`} />;
                        })()}
                        <span>{headline || 'Enter primary headline / helpline text below...'}</span>
                      </span>

                      {badgeText && (
                        <>
                          <span className="opacity-40">|</span>
                          <span className="opacity-80 text-[11px] font-normal">{badgeText}</span>
                        </>
                      )}
                    </div>

                    {(link1Text || link2Text) && (
                      <div className="flex items-center gap-2 text-[11px]">
                        {link1Text && <span className="underline opacity-90">{link1Text}</span>}
                        {link1Text && link2Text && <span className="opacity-40">•</span>}
                        {link2Text && (
                          <span className={link2Highlight ? 'bg-amber-400 text-slate-950 font-bold px-2 py-0.5 rounded shadow-2xs' : 'underline'}>
                            {link2Text}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="py-3 text-center text-xs space-y-1">
                    <p className="font-semibold text-slate-500">Topbar Card is currently INACTIVE.</p>
                    <p className="text-[11px]">Toggle the switch above to activate and display it on your public website.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Populate Presets */}
            <div className="pt-2 flex items-center justify-between flex-wrap gap-2 text-xs border-t border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 font-semibold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Quick Preset Templates:
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => handlePopulateSample('medical')}
                  className="px-2.5 py-1 bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200 rounded-lg text-[11px] font-bold transition cursor-pointer"
                >
                  Medical Casualty
                </button>
                <button
                  type="button"
                  onClick={() => handlePopulateSample('engineering')}
                  className="px-2.5 py-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 rounded-lg text-[11px] font-bold transition cursor-pointer"
                >
                  Tech / B.Tech Admissions
                </button>
                <button
                  type="button"
                  onClick={() => handlePopulateSample('arts')}
                  className="px-2.5 py-1 bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 rounded-lg text-[11px] font-bold transition cursor-pointer"
                >
                  Arts NAAC A++
                </button>
                <button
                  type="button"
                  onClick={() => handlePopulateSample('general')}
                  className="px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-lg text-[11px] font-bold transition cursor-pointer"
                >
                  General University
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-2.5 py-1 bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200 rounded-lg text-[11px] font-bold transition cursor-pointer"
                >
                  Reset / Clear
                </button>
              </div>
            </div>
          </div>

          {/* Form Configuration Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>Layout, Alignment &amp; Styling</span>
            </h3>

            {/* Row 1: Position Alignment & Icon */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1.5">
                  Content Alignment / Position *
                </label>
                <div className="grid grid-cols-4 gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                  {[
                    { key: 'split', label: 'Split', icon: <Layers className="w-3.5 h-3.5" /> },
                    { key: 'center', label: 'Center', icon: <AlignCenter className="w-3.5 h-3.5" /> },
                    { key: 'left', label: 'Left', icon: <AlignLeft className="w-3.5 h-3.5" /> },
                    { key: 'right', label: 'Right', icon: <AlignRight className="w-3.5 h-3.5" /> },
                  ].map((p) => (
                    <button
                      key={p.key}
                      type="button"
                      onClick={() => setPosition(p.key as any)}
                      className={`py-2 rounded-lg text-xs font-semibold flex flex-col items-center gap-1 transition cursor-pointer ${
                        position === p.key
                          ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs font-bold'
                          : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                      }`}
                    >
                      {p.icon}
                      <span className="text-[10px]">{p.label}</span>
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  {position === 'split' && 'Headline on Left, Quick Action Links on Right.'}
                  {position === 'center' && 'All content centered in a unified row.'}
                  {position === 'left' && 'Compact alignment to the left side.'}
                  {position === 'right' && 'Compact alignment to the right side.'}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1.5 flex items-center justify-between">
                  <span>Helpline / Alert Icon</span>
                  {icon && <span className="font-mono text-[10px] text-blue-600 dark:text-blue-400 font-bold">{icon}</span>}
                </label>
                <IconPicker
                  value={icon}
                  onChange={(newIcon) => setIcon(newIcon)}
                  placeholder="Search & choose any icon..."
                />
              </div>
            </div>

            {/* Custom Color Pickers Section */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Palette className="w-4 h-4 text-blue-600" />
                  Custom Color Customizer
                </span>
                <span className="text-[11px] text-slate-400">Pick any custom color for background &amp; text</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Background Color Picker */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1.5 flex items-center justify-between">
                    <span>Background Color</span>
                    <span className="font-mono text-[11px] text-blue-600 dark:text-blue-400 font-bold">{bgColor}</span>
                  </label>
                  <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-2 shadow-2xs">
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-9 h-9 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer p-0.5 bg-transparent shrink-0"
                      title="Choose Custom Background Color"
                    />
                    <input
                      type="text"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      placeholder="#042f2e"
                      className="flex-1 bg-transparent text-xs font-mono font-bold uppercase text-slate-900 dark:text-slate-100 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Text / Content Color Picker */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1.5 flex items-center justify-between">
                    <span>Text &amp; Link Color</span>
                    <span className="font-mono text-[11px] text-blue-600 dark:text-blue-400 font-bold">{textColor}</span>
                  </label>
                  <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-2 shadow-2xs">
                    <input
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="w-9 h-9 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer p-0.5 bg-transparent shrink-0"
                      title="Choose Custom Text Color"
                    />
                    <input
                      type="text"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      placeholder="#ffffff"
                      className="flex-1 bg-transparent text-xs font-mono font-bold uppercase text-slate-900 dark:text-slate-100 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Quick Preset Color Swatches */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60 flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold text-slate-500 uppercase shrink-0">Popular Palettes:</span>
                {[
                  { label: 'Dark Teal', bg: '#042f2e', text: '#ffffff' },
                  { label: 'Deep Blue', bg: '#0f172a', text: '#ffffff' },
                  { label: 'Royal Indigo', bg: '#1e1b4b', text: '#ffffff' },
                  { label: 'Emerald', bg: '#064e3b', text: '#ffffff' },
                  { label: 'Crimson Rose', bg: '#881337', text: '#ffffff' },
                  { label: 'Warm Amber', bg: '#78350f', text: '#ffffff' },
                  { label: 'Slate Black', bg: '#020617', text: '#ffffff' },
                  { label: 'Dark Purple', bg: '#4a044e', text: '#ffffff' },
                  { label: 'Forest Green', bg: '#14532d', text: '#ffffff' },
                  { label: 'Clean White', bg: '#ffffff', text: '#0f172a' },
                ].map((swatch) => (
                  <button
                    key={swatch.bg}
                    type="button"
                    onClick={() => {
                      setBgColor(swatch.bg);
                      setTextColor(swatch.text);
                    }}
                    className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-bold border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-blue-500 transition cursor-pointer shadow-2xs"
                    title={`Apply ${swatch.label} (${swatch.bg})`}
                  >
                    <span className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0" style={{ backgroundColor: swatch.bg }} />
                    <span className="text-slate-700 dark:text-slate-300">{swatch.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Row 2: Headline & Secondary Badge */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                  Primary Headline / Helpline Text
                </label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. 24/7 Casualty & Hospital Helpline: +91 98765 43210"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-semibold focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                  Secondary Accreditation / Subtitle Text
                </label>
                <input
                  type="text"
                  value={badgeText}
                  onChange={(e) => setBadgeText(e.target.value)}
                  placeholder="e.g. NMC Recognized · 1200-Bed Teaching Hospital"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Row 3: Action Links 1 & 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                <span className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300 block">
                  Action Link 1 (Standard Link)
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase font-bold mb-0.5">Label</label>
                    <input
                      type="text"
                      placeholder="e.g. Patient Desk"
                      value={link1Text}
                      onChange={(e) => setLink1Text(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-xs dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase font-bold mb-0.5">URL / Route</label>
                    <input
                      type="text"
                      placeholder="e.g. /contact"
                      value={link1Url}
                      onChange={(e) => setLink1Url(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-xs dark:bg-slate-800 dark:text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300 block">
                    Action Link 2 (Highlighted CTA)
                  </span>
                  <label className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={link2Highlight}
                      onChange={(e) => setLink2Highlight(e.target.checked)}
                      className="rounded text-amber-500"
                    />
                    <span>Gold Badge Style</span>
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase font-bold mb-0.5">Label</label>
                    <input
                      type="text"
                      placeholder="e.g. NEET Admissions 2026"
                      value={link2Text}
                      onChange={(e) => setLink2Text(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-xs dark:bg-slate-800 dark:text-white font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase font-bold mb-0.5">URL / Route</label>
                    <input
                      type="text"
                      placeholder="e.g. /admissions"
                      value={link2Url}
                      onChange={(e) => setLink2Url(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-xs dark:bg-slate-800 dark:text-white font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Save Bar */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Changes will take effect across all visitor pages upon saving.
              </span>
              <button
                type="button"
                onClick={() => handleSave()}
                disabled={saving}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-xl text-xs shadow-sm transition flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save & Publish Topbar'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
