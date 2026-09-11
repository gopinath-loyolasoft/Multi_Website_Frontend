import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Building2, 
  Globe2, 
  ShieldCheck, 
  Database, 
  Sliders, 
  ExternalLink, 
  CheckCircle2, 
  Copy, 
  Check,
  Eye,
  EyeOff
} from 'lucide-react';
import { CreateCollegeWorkflowRequest, Theme } from '../../types';
import { apiClient } from '../../services/apiClient';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  themes: Theme[];
}

export const CreateCollegeModal: React.FC<Props> = ({ isOpen, onClose, onSuccess, themes }) => {
  const [name, setName] = useState('');
  const [tenantCode, setTenantCode] = useState('');
  const [slug, setSlug] = useState('');
  const [primaryDomain, setPrimaryDomain] = useState('');
  const [databaseName, setDatabaseName] = useState('');
  const [templateCode, setTemplateCode] = useState<string>('ENGINEERING_MODERN');
  const [loginTemplate, setLoginTemplate] = useState<string>('template2');
  const [defaultThemeId, setDefaultThemeId] = useState<string | number>(themes[0]?.id || 1);
  const [enabledFeatures, setEnabledFeatures] = useState<string[]>([
    'PAGES', 'MENUS', 'BANNERS', 'NEWS', 'EVENTS', 'NOTICES', 'DEPARTMENTS', 'COURSES', 'FACULTY', 'GALLERY', 'MEDIA', 'CONTACT', 'PLACEMENTS', 'STATS', 'MARQUEE'
  ]);

  const templatesList = [
    {
      code: 'ENGINEERING_MODERN',
      name: 'Engineering & Technology Modern',
      tag: 'Engineering / Poly',
      themeCode: 'THEME_BLUE',
      defaultLoginTemplate: 'template4',
      recommended: [
        'PAGES', 'MENUS', 'BANNERS', 'NEWS', 'EVENTS', 'NOTICES', 'DEPARTMENTS', 'COURSES', 'FACULTY', 'GALLERY', 'MEDIA', 'CONTACT', 'PLACEMENTS', 'STATS', 'MARQUEE'
      ]
    },
    {
      code: 'ARTS_SCIENCE_MODERN',
      name: 'Arts & Science Modern',
      tag: 'Arts & Science / Univ',
      themeCode: 'THEME_EMERALD',
      defaultLoginTemplate: 'template2',
      recommended: [
        'PAGES', 'MENUS', 'BANNERS', 'NEWS', 'EVENTS', 'NOTICES', 'DEPARTMENTS', 'COURSES', 'FACULTY', 'GALLERY', 'MEDIA', 'TESTIMONIALS', 'CONTACT', 'QUOTE', 'MARQUEE'
      ]
    },
    {
      code: 'MEDICAL_MODERN',
      name: 'Medical & Healthcare Modern',
      tag: 'Medical / Healthcare',
      themeCode: 'THEME_TEAL',
      defaultLoginTemplate: 'template3',
      recommended: [
        'PAGES', 'MENUS', 'BANNERS', 'NEWS', 'EVENTS', 'NOTICES', 'DEPARTMENTS', 'COURSES', 'FACULTY', 'MEDIA', 'CONTACT', 'STATS'
      ]
    },
    {
      code: 'UNIVERSITY_MODERN',
      name: 'University & Research Institute',
      tag: 'University / Multi-Faculty',
      themeCode: 'THEME_CRIMSON',
      defaultLoginTemplate: 'template1',
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
      const matchingTheme = themes.find(t => t.code === tmpl.themeCode) || themes[0];
      if (matchingTheme) {
        setDefaultThemeId(matchingTheme.id);
      }
    }
  };
  const [adminUsername, setAdminUsername] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminFullName, setAdminFullName] = useState('');
  const [adminPassword, setAdminPassword] = useState('Admin@123');
  const [showPassword, setShowPassword] = useState(false);

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

  if (!isOpen) return null;

  const handleNameChange = (val: string) => {
    setName(val);
    const cleanSlug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    if (!slug) setSlug(cleanSlug);
  };

  const handleCodeChange = (val: string) => {
    setTenantCode(val.toUpperCase());
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
    setEnabledFeatures(prev => 
      prev.includes(code) ? prev.filter(f => f !== code) : [...prev, code]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        templateCode: templateCode,
        loginTemplate: loginTemplate,
        enabledFeatures,
        adminUsername,
        adminEmail,
        adminFullName,
        adminPassword
      };

      const res = await apiClient.post('/superadmin/colleges', payload);
      if (res.data.success) {
        setCreatedSuccess({
          name,
          code: tenantCode.toUpperCase(),
          domain: primaryDomain.trim().toLowerCase(),
          database: resolvedDbName,
          adminUser: adminUsername,
          adminPass: adminPassword
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

  const featureOptions = [
    { code: 'PAGES', label: 'Custom Dynamic Pages' },
    { code: 'NEWS', label: 'Campus News & Announcements' },
    { code: 'EVENTS', label: 'Campus Events Calendar' },
    { code: 'GALLERY', label: 'Media & Photo Gallery' },
    { code: 'DEPARTMENTS', label: 'Academic Departments' },
    { code: 'COURSES', label: 'Courses & Curriculum' },
    { code: 'FACULTY', label: 'Faculty & Staff Directory' },
    { code: 'ADMISSIONS', label: 'Online Admission Portal' },
  ];

  const currentPort = window.location.port ? `:${window.location.port}` : '';

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto font-sans">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-8 shadow-2xl space-y-6 my-8 text-slate-900">
        
        {/* SUCCESS STATE SCREEN */}
        {createdSuccess ? (
          <div className="space-y-6 text-center py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-slate-900">College Successfully Provisioned!</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                PostgreSQL database <strong className="text-blue-600 font-mono">{createdSuccess.database}</strong> and all 17 schema tables have been created and migrated.
              </p>
            </div>

            {/* Summary Details Box */}
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs font-mono space-y-2.5">
              <div className="flex justify-between items-center py-1 border-b border-slate-200">
                <span className="text-slate-500 font-sans">College Name:</span>
                <span className="text-slate-900 font-bold font-sans">{createdSuccess.name} ({createdSuccess.code})</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200">
                <span className="text-slate-500 font-sans">Dedicated Database:</span>
                <span className="text-blue-600 font-bold">{createdSuccess.database} (:5433)</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200">
                <span className="text-slate-500 font-sans">Primary Domain (Production):</span>
                <span className="text-indigo-600 font-bold">http://{createdSuccess.domain}</span>
              </div>
              {!createdSuccess.domain.endsWith('.localhost') && (
                <div className="flex justify-between items-center py-1 border-b border-slate-200">
                  <span className="text-slate-500 font-sans">Local Dev Test URL:</span>
                  <span className="text-emerald-600 font-bold">http://{createdSuccess.code.toLowerCase()}.localhost{currentPort}</span>
                </div>
              )}
              <div className="flex justify-between items-center py-1 border-b border-slate-200">
                <span className="text-slate-500 font-sans">College Admin Login:</span>
                <span className="text-emerald-600 font-bold">{createdSuccess.adminUser}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500 font-sans">Temporary Password:</span>
                <span className="text-amber-600 font-bold">{createdSuccess.adminPass}</span>
              </div>
            </div>

            {/* Big Action Buttons */}
            {(() => {
              const isLocalhostDomain = createdSuccess.domain.endsWith('.localhost');
              const localDevUrl = `http://${createdSuccess.code.toLowerCase()}.localhost${currentPort}`;
              const prodUrl = `http://${createdSuccess.domain}${currentPort}`;
              const targetUrl = isLocalhostDomain ? prodUrl : localDevUrl;

              return (
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <a
                    href={targetUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition"
                  >
                    <span>Open College Website ({isLocalhostDomain ? targetUrl : `${createdSuccess.code.toLowerCase()}.localhost`})</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  <button
                    onClick={handleCopyCredentials}
                    className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 font-medium text-xs border border-slate-300 transition"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
                    <span>{copied ? 'Copied Details!' : 'Copy Credentials'}</span>
                  </button>

                  <button
                    onClick={onClose}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs transition"
                  >
                    Done
                  </button>
                </div>
              );
            })()}
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center font-bold">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Provision New College</h3>
                  <p className="text-xs text-slate-500">Atomic setup of College, Dedicated Database, Domain & Admin User</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5 text-xs">
              {/* Section 1: Basic & Domain Info */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-800 font-bold uppercase tracking-wider text-[11px]">
                    <Globe2 className="w-4 h-4 text-blue-600" />
                    <span>1. College Identity & Domain</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleSuggestDefaults}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-[10px] font-semibold transition"
                    title="Auto-fill recommended defaults based on college name"
                  >
                    <Sparkles className="w-3 h-3 text-blue-600" />
                    <span>Suggest Defaults</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">College Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. RCM Arts and Science College"
                      value={name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-1">College Code (Unique)</label>
                    <input
                      type="text"
                      placeholder="e.g. RCM"
                      value={tenantCode}
                      onChange={(e) => handleCodeChange(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 font-mono uppercase placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-1">URL Slug</label>
                    <input
                      type="text"
                      placeholder="e.g. rcm-college"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-1">
                      Primary Routing Domain <span className="text-slate-400 font-normal">(Local or Live)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. rcmcollege.com or rcm.localhost"
                      value={primaryDomain}
                      onChange={(e) => setPrimaryDomain(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 font-mono placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                      required
                    />
                    <p className="text-slate-500 text-[10px] mt-1">
                      Production (e.g. <code className="text-blue-600 font-mono">rcmcollege.com</code>) or local test (e.g. <code className="text-blue-600 font-mono">rcm.localhost</code>).
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 2: Dedicated Database Target Field */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-800 font-bold text-[11px] uppercase tracking-wider">
                    <Database className="w-4 h-4 text-blue-600" />
                    <span>2. Dedicated PostgreSQL Database</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                    Port 5433
                  </span>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Database Name</label>
                  <input
                    type="text"
                    placeholder="e.g. college_rcm_database"
                    value={databaseName}
                    onChange={(e) => setDatabaseName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    required
                  />
                  <p className="text-slate-500 text-[11px] mt-1">
                    PostgreSQL: <code className="text-blue-600 font-mono">CREATE DATABASE {databaseName || 'college_code_database'};</code> with isolated tables.
                  </p>
                </div>
              </div>

              {/* Template Selection */}
              <div className="space-y-2">
                <label className="block text-slate-700 font-bold text-xs uppercase tracking-wider">
                  Website Template (Auto-Selects Theme & Recommended Features)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {templatesList.map(tmpl => {
                    const isSelected = templateCode === tmpl.code;
                    return (
                      <div
                        key={tmpl.code}
                        onClick={() => handleSelectTemplate(tmpl.code)}
                        className={`p-2.5 rounded-xl border-2 cursor-pointer transition text-xs ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/60 font-bold text-blue-900 shadow-2xs'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase font-bold text-slate-400">{tmpl.tag}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-blue-600" />}
                        </div>
                        <p className="font-bold text-slate-800 text-xs mt-0.5">{tmpl.name}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Login Screen Template Selection */}
              <div className="space-y-2 pt-1">
                <label className="block text-slate-700 font-bold text-xs uppercase tracking-wider">
                  Admin Login Screen Design (4 Dynamic Templates)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {loginTemplatesList.map(lt => {
                    const isSelected = loginTemplate === lt.code;
                    return (
                      <div
                        key={lt.code}
                        onClick={() => setLoginTemplate(lt.code)}
                        className={`p-2.5 rounded-xl border-2 cursor-pointer transition text-xs relative overflow-hidden ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/80 font-bold text-blue-900 shadow-2xs'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <div className={`h-2.5 rounded-full w-full bg-gradient-to-r ${lt.bg} mb-1.5`} />
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-800 uppercase tracking-tight">{lt.code}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                        </div>
                        <p className="text-[10px] text-slate-500 font-medium leading-tight mt-0.5 truncate">{lt.style}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Section 3: Theme & Features */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-slate-800 font-bold uppercase tracking-wider text-[11px]">
                  <Sliders className="w-4 h-4 text-blue-600" />
                  <span>3. Theme & Feature Selection</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Default Theme</label>
                    <select
                      value={defaultThemeId}
                      onChange={(e) => setDefaultThemeId(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    >
                      {themes.map(t => (
                        <option key={t.id} value={t.id}>{t.name} ({t.code})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Enabled Features ({enabledFeatures.length} Active)</label>
                    <div className="grid grid-cols-2 gap-1.5 max-h-28 overflow-y-auto pr-1">
                      {featureOptions.map(f => (
                        <label
                          key={f.code}
                          className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 cursor-pointer hover:bg-slate-100 transition"
                        >
                          <input
                            type="checkbox"
                            checked={enabledFeatures.includes(f.code)}
                            onChange={() => toggleFeature(f.code)}
                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-[10px] font-medium truncate">{f.code}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 4: Scoped CollegeAdmin User */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-slate-800 font-bold uppercase tracking-wider text-[11px]">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>4. Initial CollegeAdmin Credentials</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Admin Username</label>
                    <input
                      type="text"
                      value={adminUsername}
                      onChange={(e) => setAdminUsername(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Admin Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        className="w-full px-3 py-2 pr-10 rounded-lg bg-white border border-slate-300 text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition cursor-pointer rounded focus:outline-none"
                        title={showPassword ? 'Hide password' : 'Show password'}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4 text-slate-500" />
                        ) : (
                          <Eye className="w-4 h-4 text-slate-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Admin Email</label>
                    <input
                      type="email"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Admin Full Name</label>
                    <input
                      type="text"
                      value={adminFullName}
                      onChange={(e) => setAdminFullName(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-xs transition flex items-center gap-2 text-xs"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{loading ? 'Provisioning DB & Schema...' : 'Execute Full Provisioning'}</span>
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
