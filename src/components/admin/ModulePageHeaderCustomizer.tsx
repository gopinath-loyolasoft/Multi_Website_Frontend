import React, { useState, useEffect } from 'react';
import { Sparkles, Save, ChevronDown, ChevronUp, Eye, Sliders, Globe } from 'lucide-react';
import { useTenant } from '../../tenant/TenantContext';
import { useTemplateTheme } from '../../themes/ThemeContext';
import { apiClient } from '../../services/apiClient';
import { useToast } from '../../UI_Componentes/ui';

export interface ModuleHeaderData {
  badge?: string;
  title?: string;
  subtitle?: string;
}

interface ModulePageHeaderCustomizerProps {
  moduleKey: string; // e.g. 'departments', 'courses', 'faculty', 'news', 'events', 'notices', etc.
  moduleLabel: string; // e.g. 'Departments & Schools', 'Courses & Programs'
  defaultBadge: string;
  defaultTitle: string;
  defaultSubtitle: string;
}

export const ModulePageHeaderCustomizer: React.FC<ModulePageHeaderCustomizerProps> = ({
  moduleKey,
  moduleLabel,
  defaultBadge,
  defaultTitle,
  defaultSubtitle,
}) => {
  const { siteConfig, refreshConfig } = useTenant();
  const { toast } = useToast();
  const { styles } = useTemplateTheme();

  const [isOpen, setIsOpen] = useState(false);
  const [badge, setBadge] = useState(defaultBadge);
  const [title, setTitle] = useState(defaultTitle);
  const [subtitle, setSubtitle] = useState(defaultSubtitle);
  const [saving, setSaving] = useState(false);

  // Extract existing header data from siteConfig (supports both socialLinks.pageHeaders and pageHeaders)
  const existingHeaders =
    siteConfig?.settings?.socialLinks?.pageHeaders?.[moduleKey] ||
    siteConfig?.settings?.pageHeaders?.[moduleKey];

  // Initialize/sync local input values from siteConfig when present
  useEffect(() => {
    if (existingHeaders) {
      if (existingHeaders.badge !== undefined) setBadge(existingHeaders.badge);
      if (existingHeaders.title !== undefined) setTitle(existingHeaders.title);
      if (existingHeaders.subtitle !== undefined) setSubtitle(existingHeaders.subtitle);
    } else {
      setBadge(defaultBadge);
      setTitle(defaultTitle);
      setSubtitle(defaultSubtitle);
    }
  }, [
    existingHeaders?.badge,
    existingHeaders?.title,
    existingHeaders?.subtitle,
    moduleKey,
    defaultBadge,
    defaultTitle,
    defaultSubtitle,
  ]);

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Fetch latest profile settings to avoid overwriting concurrent tenant settings
      const currentRes = await apiClient.get('/admin/profile/settings');
      const currentSettings = currentRes.data?.data || siteConfig?.settings || {};
      const currentSocialLinks = currentSettings.socialLinks || {};
      const existingHeadersDict = currentSocialLinks.pageHeaders || currentSettings.pageHeaders || {};

      const updatedPageHeaders = {
        ...existingHeadersDict,
        [moduleKey]: {
          badge: badge.trim(),
          title: title.trim(),
          subtitle: subtitle.trim(),
        },
      };

      const payload = {
        siteName: currentSettings.siteName || siteConfig?.tenant?.name || '',
        tagline: currentSettings.tagline || '',
        logoUrl: currentSettings.logoUrl || '',
        contactEmail: currentSettings.contactEmail || '',
        contactPhone: currentSettings.contactPhone || '',
        address: currentSettings.address || '',
        loginBgImageUrl: currentSettings.loginBgImageUrl || '',
        socialLinks: {
          ...currentSocialLinks,
          pageHeaders: updatedPageHeaders,
        },
        pageHeaders: updatedPageHeaders,
      };

      const res = await apiClient.put('/admin/profile/settings', payload);
      if (res.data.success) {
        toast.success(`Public header settings for ${moduleLabel} saved successfully!`);
        await refreshConfig();
      } else {
        toast.error(res.data.message || 'Failed to save header settings');
      }
    } catch (err) {
      console.error('Failed to save header settings', err);
      toast.error('Error updating page header settings');
    } finally {
      setSaving(false);
    }
  };

  const handleResetToDefault = () => {
    setBadge(defaultBadge);
    setTitle(defaultTitle);
    setSubtitle(defaultSubtitle);
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden transition-all duration-300">
      {/* Header Bar / Toggle Header */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 bg-gradient-to-r from-slate-50 via-blue-50/30 to-slate-50 dark:from-slate-800/80 dark:via-slate-800/40 dark:to-slate-800/80 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between cursor-pointer select-none hover:bg-slate-100/80 transition"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200 dark:border-blue-900/50">
            <Globe className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Public Website Page Banner &amp; Header
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                /{moduleKey}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Customize hero badge, headline title, and subtitle description for visitor pages.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 hidden sm:inline">
            {isOpen ? 'Collapse' : 'Customize Header'}
          </span>
          <button
            type="button"
            className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 shadow-2xs"
          >
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expandable Form Body */}
      {isOpen && (
        <div className="p-5 space-y-5 bg-slate-50/50 dark:bg-slate-950/40">
          
          {/* Live Hero Banner Preview Box */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-blue-600" />
                <span>Live Hero Banner Preview (Public Page)</span>
              </span>
              <span className="font-mono text-[10px] opacity-75">Theme Auto-Applied</span>
            </div>

            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#0b3353] via-[#134975] to-[#0b3353] p-5 text-white shadow-md border border-amber-400/30">
              {/* Slanted Accent Stripe */}
              <div 
                className="absolute top-0 right-0 bottom-0 w-5/12 bg-gradient-to-br from-[#134975]/85 via-[#0b3353]/90 to-[#134975]/80 pointer-events-none hidden md:block z-0 opacity-80"
                style={{ clipPath: 'polygon(50% 0, 100% 0, 50% 100%, 0% 100%)' }}
              >
                <div className="absolute inset-0 border-l-2 border-amber-400/60" style={{ clipPath: 'polygon(50% 0, 51% 0, 1% 100%, 0% 100%)' }} />
              </div>

              <div className="relative z-10 space-y-2 max-w-2xl">
                {badge && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-sky-950/80 text-amber-300 border border-amber-400/40 -skew-x-6">
                    <Sparkles className="w-3 h-3 text-amber-400 skew-x-6" />
                    <span className="skew-x-6">{badge}</span>
                  </div>
                )}
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white leading-tight">
                  {title || defaultTitle}
                </h2>
                {subtitle && (
                  <p className="text-xs text-slate-200 font-normal leading-relaxed line-clamp-2">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Form Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
            {/* Field 1: Badge Tag */}
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                Badge Tag Text
              </label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="e.g. Academic Divisions"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            {/* Field 2: Headline Title */}
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                Hero Headline Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Departments & Academic Schools"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            {/* Field 3: Subtitle Description */}
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                Intro Subtitle / Description
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="e.g. Explore our faculties and research labs."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={handleResetToDefault}
              className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition cursor-pointer"
            >
              Reset to Template Default
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'Saving...' : 'Save Public Page Header'}</span>
            </button>
          </div>

        </div>
      )}
    </div>
  );
};
