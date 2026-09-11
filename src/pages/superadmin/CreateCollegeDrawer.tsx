import React, { useState } from 'react';
import {
  Building2,
  Sparkles,
  Globe2,
  Database,
  Sliders,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink
} from 'lucide-react';
import {
  Drawer,
  Button,
  Input,
  Select,
  Alert
} from '../../UI_Componentes/ui';
import { CreateCollegeWorkflowRequest, Theme } from '../../types';
import { apiClient } from '../../services/apiClient';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  themes: Theme[];
}

export const CreateCollegeDrawer: React.FC<Props> = ({
  isOpen,
  onClose,
  onSuccess,
  themes,
}) => {
  const [name, setName] = useState('');
  const [tenantCode, setTenantCode] = useState('');
  const [slug, setSlug] = useState('');
  const [primaryDomain, setPrimaryDomain] = useState('');
  const [databaseName, setDatabaseName] = useState('');
  const [templateCode, setTemplateCode] = useState<string>('ENGINEERING_MODERN');
  const [loginTemplate, setLoginTemplate] = useState<string>('template2');
  const [defaultThemeId, setDefaultThemeId] = useState<string | number>(themes[0]?.id || 1);
  const [enabledFeatures, setEnabledFeatures] = useState<string[]>([
    'PAGES', 'MENUS', 'THEMES', 'BANNERS', 'MARQUEE', 'STATS', 'NEWS', 'EVENTS', 'GALLERY', 'DEPARTMENTS', 'COURSES', 'FACULTY', 'ADMISSIONS', 'PLACEMENTS', 'RECRUITERS'
  ]);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminFullName, setAdminFullName] = useState('');
  const [adminPassword, setAdminPassword] = useState('Admin@123');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdSuccess, setCreatedSuccess] = useState<{
    name: string;
    code: string;
    domain: string;
    database: string;
    adminUser: string;
    adminPass: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const templatesList = [
    {
      code: 'ENGINEERING_MODERN',
      tag: 'Engineering / Poly',
      defaultLoginTemplate: 'template4',
      description: 'Bold high-tech design, split stats counter (patents, placements), dynamic tech departments, recruiter marquee.',
      accent: 'border-blue-500 text-blue-600 bg-blue-50/40 dark:bg-blue-950/20',
      recommended: [
        'PAGES', 'MENUS', 'THEMES', 'BANNERS', 'MARQUEE', 'STATS', 'NEWS', 'EVENTS', 'GALLERY',
        'DEPARTMENTS', 'COURSES', 'FACULTY', 'ADMISSIONS', 'PLACEMENTS', 'RECRUITERS'
      ]
    },
    {
      code: 'ARTS_SCIENCE_MODERN',
      tag: 'Arts & Science / Univ',
      defaultLoginTemplate: 'template2',
      description: 'Academic elegance, split-screen hero with Chancellor quote banner, cultural events & arts gallery.',
      accent: 'border-emerald-500 text-emerald-600 bg-emerald-50/40 dark:bg-emerald-950/20',
      recommended: [
        'PAGES', 'MENUS', 'THEMES', 'BANNERS', 'MARQUEE', 'STATS', 'QUOTES', 'NEWS', 'EVENTS', 'GALLERY',
        'DEPARTMENTS', 'COURSES', 'FACULTY', 'ADMISSIONS'
      ]
    },
    {
      code: 'MEDICAL_MODERN',
      tag: 'Medical / Healthcare',
      defaultLoginTemplate: 'template3',
      description: 'Clinical trust layout, emergency OPD announcement ticker, bed & doctor stats counter, clinical departments.',
      accent: 'border-cyan-500 text-cyan-600 bg-cyan-50/40 dark:bg-cyan-950/20',
      recommended: [
        'PAGES', 'MENUS', 'THEMES', 'BANNERS', 'MARQUEE', 'STATS', 'NEWS', 'EVENTS', 'GALLERY',
        'DEPARTMENTS', 'COURSES', 'FACULTY', 'ADMISSIONS'
      ]
    },
    {
      code: 'UNIVERSITY_MODERN',
      tag: 'University / Multi-Faculty',
      defaultLoginTemplate: 'template1',
      description: 'Prestigious collegiate aesthetic with rich crimson header, research departments, admissions gateway, placement marquee.',
      accent: 'border-rose-500 text-rose-600 bg-rose-50/40 dark:bg-rose-950/20',
      recommended: [
        'PAGES', 'MENUS', 'MEDIA', 'CONTACT', 'NEWS', 'EVENTS', 'NOTICES', 'DEPARTMENTS', 'COURSES', 'FACULTY', 'ADMISSIONS', 'BANNERS', 'MARQUEE', 'STATS', 'TESTIMONIALS', 'PLACEMENTS'
      ]
    }
  ];

  const loginTemplatesList = [
    { code: 'template1', name: 'Sky Blue & Slanted Angle Wave', style: 'CMS360 Sky Blue', bg: 'from-sky-500 to-blue-600' },
    { code: 'template2', name: 'Royal Gold & Curved Ribbon', style: 'RCM Gold & Maroon', bg: 'from-amber-600 to-amber-800' },
    { code: 'template3', name: 'Emerald Botanical Wave', style: 'GP College Emerald', bg: 'from-emerald-600 to-teal-800' },
    { code: 'template4', name: 'Modern Tech Blue Polygon', style: 'SHC Modern Polygon', bg: 'from-blue-600 to-indigo-900' },
  ];

  const handleSelectTemplate = (code: string) => {
    setTemplateCode(code);
    const tmpl = templatesList.find(t => t.code === code);
    if (tmpl) {
      setEnabledFeatures(tmpl.recommended);
      if (tmpl.defaultLoginTemplate) {
        setLoginTemplate(tmpl.defaultLoginTemplate);
      }
    }
    const matchingThemeCodes: Record<string, string[]> = {
      ARTS_SCIENCE_MODERN: ['THEME_EMERALD', 'ARTS_GREEN'],
      MEDICAL_MODERN: ['THEME_TEAL', 'NURSING_CARE'],
      UNIVERSITY_MODERN: ['THEME_CRIMSON', 'UNIV_CRIMSON'],
      ENGINEERING_MODERN: ['THEME_BLUE', 'ENG_ROYAL']
    };
    const candidates = matchingThemeCodes[code] || ['THEME_BLUE'];
    const matchingTheme = themes.find(t => candidates.includes(t.code)) || themes[0];
    if (matchingTheme) {
      setDefaultThemeId(matchingTheme.id);
    }
  };

  const handleResetFeatures = () => {
    const tmpl = templatesList.find(t => t.code === templateCode);
    if (tmpl) {
      setEnabledFeatures(tmpl.recommended);
    }
  };

  const handleNameChange = (val: string) => {
    setName(val);
    const cleanSlug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    if (!slug) setSlug(cleanSlug);
  };

  const handleSuggestDefaults = () => {
    const code = (tenantCode || name.replace(/[^a-zA-Z]/g, '').slice(0, 5)).toUpperCase();
    if (!tenantCode && code) setTenantCode(code);
    if (!slug) setSlug(name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    if (!primaryDomain && code) setPrimaryDomain(`${code.toLowerCase()}.localhost`);
    if (!databaseName && code) setDatabaseName(`college_${code.toLowerCase()}_database`);
    if (!adminUsername && code) setAdminUsername(`${code.toLowerCase()}-admin`);
    if (!adminEmail && code) setAdminEmail(`admin@${code.toLowerCase()}.edu`);
    if (!adminFullName && name) setAdminFullName(`${name} Administrator`);
  };

  const toggleFeature = (code: string) => {
    setEnabledFeatures((prev) =>
      prev.includes(code) ? prev.filter((f) => f !== code) : [...prev, code]
    );
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const resolvedDbName = databaseName.trim() || `college_${tenantCode.toLowerCase()}_database`;

      const payload: CreateCollegeWorkflowRequest = {
        name,
        tenantCode: tenantCode.toUpperCase(),
        slug: slug.toLowerCase(),
        primaryDomain: primaryDomain.trim().toLowerCase(),
        databaseName: resolvedDbName,
        defaultThemeId: defaultThemeId ? defaultThemeId : undefined,
        templateCode,
        loginTemplate,
        enabledFeatures,
        adminUsername,
        adminEmail,
        adminFullName,
        adminPassword,
      };

      const res = await apiClient.post('/superadmin/colleges', payload);
      if (res.data.success) {
        setCreatedSuccess({
          name,
          code: tenantCode.toUpperCase(),
          domain: primaryDomain.trim().toLowerCase(),
          database: resolvedDbName,
          adminUser: adminUsername,
          adminPass: adminPassword,
        });
        onSuccess();
      } else {
        setError(res.data.message || 'Failed to provision college');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Provisioning workflow failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCredentials = () => {
    if (!createdSuccess) return;
    navigator.clipboard.writeText(
      `College: ${createdSuccess.name} (${createdSuccess.code})\nDomain: http://${createdSuccess.domain}:${window.location.port || '3000'}\nAdmin User: ${createdSuccess.adminUser}\nPassword: ${createdSuccess.adminPass}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const featureCategories = [
    {
      name: 'Core System',
      features: [
        { code: 'PAGES', label: 'Dynamic Pages' },
        { code: 'MENUS', label: 'Navigation Menus' },
        { code: 'THEMES', label: 'Custom Themes & Colors' },
      ]
    },
    {
      name: 'Dynamic Home Page Modules',
      features: [
        { code: 'BANNERS', label: 'Hero Banner Slider' },
        { code: 'MARQUEE', label: 'Notification Bar' },
        { code: 'STATS', label: 'Stats Counter Bar' },
        { code: 'QUOTES', label: 'President Quote Banner' },
      ]
    },
    {
      name: 'Academics',
      features: [
        { code: 'DEPARTMENTS', label: 'Academic Departments' },
        { code: 'COURSES', label: 'Courses & Curriculum' },
        { code: 'FACULTY', label: 'Faculty & Staff Directory' },
      ]
    },
    {
      name: 'Campus Life & Career',
      features: [
        { code: 'ADMISSIONS', label: 'Online Admission Portal' },
        { code: 'PLACEMENTS', label: 'Placements Records' },
        { code: 'RECRUITERS', label: 'Top Recruiters' },
        { code: 'NEWS', label: 'Campus News & Press' },
        { code: 'EVENTS', label: 'Campus Events Calendar' },
        { code: 'GALLERY', label: 'Media & Photo Gallery' },
      ]
    }
  ];

  const currentPort = window.location.port ? `:${window.location.port}` : '';

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Provision New College"
      subtitle="Atomic creation of dedicated PostgreSQL DB, domain routes & admin user"
      size="lg"
      icon={<Building2 className="w-5 h-5 text-blue-600" />}
      footer={
        createdSuccess ? (
          <Button variant="secondary" onClick={onClose}>
            Done
          </Button>
        ) : (
          <>
            <Button variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              variant="primary"
              loading={loading}
              onClick={() => handleSubmit()}
              icon={<Sparkles className="w-4 h-4" />}
            >
              {loading ? 'Provisioning DB & Schema...' : 'Execute Full Provisioning'}
            </Button>
          </>
        )
      }
    >
      {createdSuccess ? (
        <div className="space-y-6 text-center py-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-7 h-7" />
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              College Successfully Provisioned!
            </h3>
            <p className="text-xs text-slate-500">
              PostgreSQL database <strong className="text-blue-600 font-mono">{createdSuccess.database}</strong> and all 17 schema tables are live.
            </p>
          </div>

          {/* Details Card */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-left text-xs font-mono space-y-2">
            <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
              <span className="text-slate-500">College:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{createdSuccess.name} ({createdSuccess.code})</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
              <span className="text-slate-500">Dedicated Database:</span>
              <span className="text-blue-600 font-bold">{createdSuccess.database}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
              <span className="text-slate-500">Domain URL:</span>
              <span className="text-indigo-600 font-bold">http://{createdSuccess.domain}{currentPort}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
              <span className="text-slate-500">Admin Username:</span>
              <span className="text-emerald-600 font-bold">{createdSuccess.adminUser}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Password:</span>
              <span className="text-amber-600 font-bold">{createdSuccess.adminPass}</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <a
              href={`http://${createdSuccess.domain}${currentPort}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition"
            >
              <span>Open College Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyCredentials}
              icon={copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            >
              {copied ? 'Copied Details!' : 'Copy Credentials'}
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <Alert variant="error">{error}</Alert>}

          {/* Section 1: College Identity */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Globe2 className="w-4 h-4 text-blue-600" />
                1. College Identity & Domain
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleSuggestDefaults}
                icon={<Sparkles className="w-3.5 h-3.5 text-amber-500" />}
              >
                Auto-Suggest Defaults
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <Input
                label="College Full Name"
                placeholder="e.g. RCM Arts & Science College"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                required
              />
              <Input
                label="College Code (Unique)"
                placeholder="e.g. RCM"
                value={tenantCode}
                onChange={(e) => setTenantCode(e.target.value.toUpperCase())}
                required
              />
              <Input
                label="URL Slug"
                placeholder="e.g. rcm-college"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
              />
              <Input
                label="Primary Routing Domain"
                placeholder="e.g. rcm.localhost or rcmcollege.com"
                value={primaryDomain}
                onChange={(e) => setPrimaryDomain(e.target.value)}
                helperText="Local dev (rcm.localhost) or Live domain"
                required
              />
            </div>
          </div>

          {/* Section 2: PostgreSQL Database */}
          <div className="space-y-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Database className="w-4 h-4 text-emerald-600" />
              2. Dedicated PostgreSQL Database
            </span>
            <Input
              label="Database Name"
              placeholder="e.g. college_rcm_database"
              value={databaseName}
              onChange={(e) => setDatabaseName(e.target.value)}
              helperText="PostgreSQL will automatically run CREATE DATABASE and 17 schema tables"
              required
            />
          </div>

          {/* Section 3: Template & Categorized Features */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-blue-600" />
                3. Website Template & Dynamic Modules
              </span>
              <button
                type="button"
                onClick={handleResetFeatures}
                className="text-[11px] font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                Reset Features to Template Defaults
              </button>
            </div>

            {/* Template Selection Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {templatesList.map((tmpl) => {
                const isSelected = templateCode === tmpl.code;
                return (
                  <div
                    key={tmpl.code}
                    onClick={() => handleSelectTemplate(tmpl.code)}
                    className={`relative p-3 rounded-xl border-2 cursor-pointer transition-all ${isSelected
                      ? `${tmpl.accent} ring-2 ring-blue-500/20 shadow-xs`
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-900/40'
                      }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {tmpl.tag}
                      </span>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      )}
                    </div>
                    {/* <div className="font-semibold text-xs text-slate-900 dark:text-slate-100 mb-1">
                      {tmpl.name}
                    </div> */}
                    <div className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                      {tmpl.description}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Color Theme Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              <Select
                label="Base Color Palette / Theme"
                value={defaultThemeId}
                onChange={(e) => setDefaultThemeId(e.target.value)}
                options={themes.map((t) => ({ value: t.id, label: `${t.name} (${t.code})` }))}
              />
              <div className="flex items-center text-xs text-slate-500 pt-5">
                <span>Selected template auto-provisions default hero layout, counters & banner presets.</span>
              </div>
            </div>

            {/* Admin Login Screen Template Selector */}
            <div className="space-y-2 pt-2 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Admin Login Screen Design (Select College Admin Login Template)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {loginTemplatesList.map((lt) => {
                  const isSelected = loginTemplate === lt.code;
                  return (
                    <div
                      key={lt.code}
                      onClick={() => setLoginTemplate(lt.code)}
                      className={`p-2.5 rounded-xl border-2 cursor-pointer transition text-xs relative overflow-hidden ${
                        isSelected
                          ? 'border-blue-600 dark:border-blue-500 bg-blue-50/80 dark:bg-blue-950/40 font-bold text-blue-900 dark:text-blue-100 shadow-2xs ring-2 ring-blue-500/20'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                      }`}
                    >
                      <div className={`h-2.5 rounded-full w-full bg-gradient-to-r ${lt.bg} mb-1.5`} />
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-tight">{lt.code}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />}
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-tight mt-0.5 truncate">{lt.style}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Categorized Features Matrix */}
            <div className="space-y-3 pt-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Authorized College Admin Modules ({enabledFeatures.length} Enabled)
              </label>
              <div className="space-y-2.5">
                {featureCategories.map((category) => (
                  <div key={category.name} className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      {category.name}
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                      {category.features.map((f) => (
                        <label
                          key={f.code}
                          className="flex items-center gap-2 p-1.5 rounded-md border border-slate-200/80 dark:border-slate-700/80 hover:bg-white dark:hover:bg-slate-800 cursor-pointer text-[11px] bg-white/70 dark:bg-slate-900/60"
                        >
                          <input
                            type="checkbox"
                            checked={enabledFeatures.includes(f.code)}
                            onChange={() => toggleFeature(f.code)}
                            className="rounded text-blue-600 focus:ring-0 w-3.5 h-3.5"
                          />
                          <span className="truncate font-medium text-slate-700 dark:text-slate-300">{f.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 4: CollegeAdmin Credentials */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              4. Initial CollegeAdmin Credentials
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <Input
                label="Admin Username"
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                required
              />
              <Input
                label="Admin Password"
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                required
              />
              <Input
                label="Admin Email"
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                required
              />
              <Input
                label="Admin Full Name"
                value={adminFullName}
                onChange={(e) => setAdminFullName(e.target.value)}
                required
              />
            </div>
          </div>
        </form>
      )}
    </Drawer>
  );
};
