import React, { useState, useEffect, useRef } from 'react';
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
  ExternalLink,
  Lock
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
import { 
  resolveTenantPortalUrl, 
  formatDisplayDomain, 
  getPlatformBaseDomain, 
  getPlatformRootHost, 
  isLocalEnvironment 
} from '../../utils/domainUtils';

export interface LoginTemplateOption {
  code: string;
  number: string;
  category: string;
  icon: string;
  name: string;
  style: string;
  bg: string;
  badgeBg: string;
}

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
    'PAGES', 'MENUS', 'THEMES', 'BANNERS', 'MARQUEE', 'STATS', 'NEWS', 'EVENTS', 'GALLERY', 'DEPARTMENTS', 'COURSES', 'FACULTY', 'ADMISSIONS'
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

  const isDomainTouchedRef = useRef(false);
  const isDbTouchedRef = useRef(false);
  const isUserTouchedRef = useRef(false);
  const isEmailTouchedRef = useRef(false);
  const isFullNameTouchedRef = useRef(false);

  useEffect(() => {
    if (isOpen) {
      setName('');
      setTenantCode('');
      setSlug('');
      setPrimaryDomain('');
      setDatabaseName('');
      setAdminUsername('');
      setAdminEmail('');
      setAdminFullName('');
      setError(null);
      setCreatedSuccess(null);
      isDomainTouchedRef.current = false;
      isDbTouchedRef.current = false;
      isUserTouchedRef.current = false;
      isEmailTouchedRef.current = false;
      isFullNameTouchedRef.current = false;
    }
  }, [isOpen]);

  const designPacksList = [
    {
      id: 'pack1',
      templateCode: 'ENGINEERING_MODERN',
      loginTemplate: 'template1',
      themeCandidates: ['THEME_BLUE', 'ENG_ROYAL', 'BLUE'],
      number: 'PACK 1',
      category: 'Engineering & Technology',
      icon: '⚙️',
      name: 'Engineering & High-Tech Blueprint Suite',
      loginStyleName: 'SHC Modern Polygon (Tech Blue)',
      description: 'Cyber grid blueprint layout, technical metric counters, laboratory showcases, and structured engineering departments with matching polygon login.',
      bg: 'from-blue-600 to-indigo-900',
      badgeBg: 'bg-indigo-100 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-200 border-indigo-200 dark:border-indigo-800',
      recommended: [
        'PAGES', 'MENUS', 'THEMES', 'BANNERS', 'MARQUEE', 'STATS', 'NEWS', 'EVENTS', 'GALLERY',
        'DEPARTMENTS', 'COURSES', 'FACULTY', 'ADMISSIONS', 'NOTICES', 'CONTACT', 'MEDIA',
        'PLACEMENTS', 'COMPLIANCE', 'TRANSPORT', 'HOSTELS', 'LIBRARY', 'ALUMNI'
      ]
    },
    {
      id: 'pack2',
      templateCode: 'ARTS_SCIENCE_MODERN',
      loginTemplate: 'template2',
      themeCandidates: ['THEME_GOLD', 'ARTS_GREEN', 'THEME_EMERALD'],
      number: 'PACK 2',
      category: 'Arts & Science',
      icon: '🎨',
      name: 'Arts & Science Modern Suite',
      loginStyleName: 'RCM Gold & Maroon (Curved Ribbon)',
      description: '3D slanted parallelogram layout with deep gold & maroon accents, gyro tilt cards, and diagonal hero slice with matching curved gold login.',
      bg: 'from-amber-600 to-amber-800',
      badgeBg: 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 border-amber-200 dark:border-amber-800',
      recommended: [
        'PAGES', 'MENUS', 'THEMES', 'BANNERS', 'MARQUEE', 'STATS', 'QUOTE', 'NEWS', 'EVENTS', 'GALLERY',
        'DEPARTMENTS', 'COURSES', 'FACULTY', 'ADMISSIONS', 'NOTICES', 'CONTACT', 'MEDIA',
        'PLACEMENTS', 'COMPLIANCE', 'TRANSPORT', 'HOSTELS', 'LIBRARY', 'ALUMNI'
      ]
    },
    {
      id: 'pack3',
      templateCode: 'MEDICAL_MODERN',
      loginTemplate: 'template3',
      themeCandidates: ['THEME_TEAL', 'NURSING_CARE', 'THEME_EMERALD'],
      number: 'PACK 3',
      category: 'Medical & Healthcare',
      icon: '⚕️',
      name: 'Medical & Healthcare Institute Suite',
      loginStyleName: 'GP College Emerald (Botanical)',
      description: 'Clinical trust layout, emergency OPD announcement ticker, bed & doctor stats counter, and clinical department cards with matching emerald login.',
      bg: 'from-emerald-600 to-teal-800',
      badgeBg: 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800',
      recommended: [
        'PAGES', 'MENUS', 'THEMES', 'BANNERS', 'MARQUEE', 'STATS', 'NEWS', 'EVENTS', 'GALLERY',
        'DEPARTMENTS', 'COURSES', 'FACULTY', 'ADMISSIONS', 'NOTICES', 'CONTACT', 'MEDIA',
        'PLACEMENTS', 'COMPLIANCE', 'TRANSPORT', 'HOSTELS', 'LIBRARY', 'ALUMNI'
      ]
    },
    {
      id: 'pack4',
      templateCode: 'UNIVERSITY_MODERN',
      loginTemplate: 'template4',
      themeCandidates: ['THEME_CRIMSON', 'UNIV_CRIMSON', 'THEME_BLUE'],
      number: 'PACK 4',
      category: 'University & Multi-Faculty',
      icon: '🎓',
      name: 'University & Multi-Faculty Suite',
      loginStyleName: 'CMS360 Sky Blue (Prestige Split)',
      description: 'Prestigious collegiate aesthetic with rich header, chancellor leadership showcase, and research gateway with matching sky blue collegiate login.',
      bg: 'from-sky-500 to-blue-600',
      badgeBg: 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-200 border-blue-200 dark:border-blue-800',
      recommended: [
        'PAGES', 'MENUS', 'THEMES', 'BANNERS', 'MARQUEE', 'STATS', 'QUOTE', 'NEWS', 'EVENTS', 'GALLERY',
        'DEPARTMENTS', 'COURSES', 'FACULTY', 'ADMISSIONS', 'NOTICES', 'CONTACT', 'MEDIA',
        'PLACEMENTS', 'COMPLIANCE', 'TRANSPORT', 'HOSTELS', 'LIBRARY', 'ALUMNI'
      ]
    },
    {
      id: 'pack5',
      templateCode: 'SALESIAN_SLANTED',
      loginTemplate: 'template5',
      themeCandidates: ['THEME_SLANTED_NAVY', 'THEME_BLUE', 'ENG_ROYAL'],
      number: 'PACK 5',
      category: '3D Slanted Design',
      icon: '⚡',
      name: '3D Slanted Navy & Gold Suite',
      loginStyleName: '3D Slanted Navy & Gold (Perspective)',
      description: 'Dedicated 3D perspective tilt cards, polygon media articles, diagonal badges, gold stripe headers, and matching slanted 3D login.',
      bg: 'from-[#134975] to-[#e5a912]',
      badgeBg: 'bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-700',
      recommended: [
        'PAGES', 'MENUS', 'THEMES', 'BANNERS', 'MARQUEE', 'STATS', 'QUOTE', 'NEWS', 'EVENTS', 'GALLERY',
        'DEPARTMENTS', 'COURSES', 'FACULTY', 'ADMISSIONS', 'NOTICES', 'CONTACT', 'MEDIA',
        'PLACEMENTS', 'COMPLIANCE', 'TRANSPORT', 'HOSTELS', 'LIBRARY', 'ALUMNI'
      ]
    },
    {
      id: 'pack6',
      templateCode: 'DESIGN_3D_GLASS',
      loginTemplate: 'template6',
      themeCandidates: ['THEME_CYBER_GLASS', 'THEME_TEAL', 'THEME_BLUE'],
      number: 'PACK 6',
      category: '3D Glassmorphism',
      icon: '💎',
      name: '3D Holographic Glassmorphism Suite',
      loginStyleName: 'Cyber Aurora Glass (Holographic)',
      description: 'Ultra-modern frosted glass panels, chromatic prism neon glow, floating bokeh spheres, and translucent cards with frosted holographic login.',
      bg: 'from-cyan-500 to-blue-600',
      badgeBg: 'bg-cyan-900/60 text-cyan-200 border-cyan-500/50',
      recommended: [
        'PAGES', 'MENUS', 'THEMES', 'BANNERS', 'MARQUEE', 'STATS', 'QUOTE', 'NEWS', 'EVENTS', 'GALLERY',
        'DEPARTMENTS', 'COURSES', 'FACULTY', 'ADMISSIONS', 'NOTICES', 'CONTACT', 'MEDIA',
        'PLACEMENTS', 'COMPLIANCE', 'TRANSPORT', 'HOSTELS', 'LIBRARY', 'ALUMNI'
      ]
    },
    {
      id: 'pack7',
      templateCode: 'DESIGN_3D_ISOMETRIC',
      loginTemplate: 'template7',
      themeCandidates: ['THEME_TACTILE_VOXEL', 'THEME_GOLD', 'THEME_BLUE'],
      number: 'PACK 7',
      category: '3D Isometric',
      icon: '🧊',
      name: '3D Isometric Tactile Elevation Suite',
      loginStyleName: 'Tactile Shadow Bevel (Voxel)',
      description: 'Chunky 3D voxel blocks, physical push-buttons with compression feedback, thick shadow bevels, and tactile cards with matching voxel login.',
      bg: 'from-amber-400 to-slate-900',
      badgeBg: 'bg-amber-100 text-slate-900 border-slate-900',
      recommended: [
        'PAGES', 'MENUS', 'THEMES', 'BANNERS', 'MARQUEE', 'STATS', 'QUOTE', 'NEWS', 'EVENTS', 'GALLERY',
        'DEPARTMENTS', 'COURSES', 'FACULTY', 'ADMISSIONS', 'NOTICES', 'CONTACT', 'MEDIA',
        'PLACEMENTS', 'COMPLIANCE', 'TRANSPORT', 'HOSTELS', 'LIBRARY', 'ALUMNI'
      ]
    },
    {
      id: 'pack8',
      templateCode: 'DESIGN_3D_KINETIC',
      loginTemplate: 'template8',
      themeCandidates: ['THEME_KINETIC_NEON', 'THEME_CRIMSON', 'THEME_BLUE'],
      number: 'PACK 8',
      category: '3D Kinetic Flip',
      icon: '⚡',
      name: '3D Kinetic Perspective & Flip Suite',
      loginStyleName: 'Neon Flip Perspective (Kinetic 3D)',
      description: 'True 3D card flips (180° rotation on hover), gyroscopic cursor parallax, kinetic neon ribbon buttons with matching kinetic flip login.',
      bg: 'from-rose-500 via-purple-600 to-indigo-600',
      badgeBg: 'bg-rose-900/60 text-rose-200 border-rose-500/50',
      recommended: [
        'PAGES', 'MENUS', 'THEMES', 'BANNERS', 'MARQUEE', 'STATS', 'QUOTE', 'NEWS', 'EVENTS', 'GALLERY',
        'DEPARTMENTS', 'COURSES', 'FACULTY', 'ADMISSIONS', 'NOTICES', 'CONTACT', 'MEDIA',
        'PLACEMENTS', 'COMPLIANCE', 'TRANSPORT', 'HOSTELS', 'LIBRARY', 'ALUMNI'
      ]
    },
    {
      id: 'pack9',
      templateCode: 'DESIGN_3D_NEUMORPHIC',
      loginTemplate: 'template9',
      themeCandidates: ['THEME_SOFT_NEUMORPHIC', 'THEME_TEAL', 'THEME_BLUE'],
      number: 'PACK 9',
      category: '3D Neumorphic',
      icon: '🛡️',
      name: '3D Neumorphic Soft Depth Suite',
      loginStyleName: 'Embossed Soft Depth (Neumorphic)',
      description: 'Sculpted soft-surface cards, dual-light embossing, debossed pill tags, and soft pillow push-buttons with matching neumorphic embossed login.',
      bg: 'from-teal-600 to-slate-700',
      badgeBg: 'bg-teal-100 text-teal-900 border-teal-300',
      recommended: [
        'PAGES', 'MENUS', 'THEMES', 'BANNERS', 'MARQUEE', 'STATS', 'QUOTE', 'NEWS', 'EVENTS', 'GALLERY',
        'DEPARTMENTS', 'COURSES', 'FACULTY', 'ADMISSIONS', 'NOTICES', 'CONTACT', 'MEDIA',
        'PLACEMENTS', 'COMPLIANCE', 'TRANSPORT', 'HOSTELS', 'LIBRARY', 'ALUMNI'
      ]
    }
  ];

  const handleSelectDesignPack = (packId: string) => {
    const pack = designPacksList.find(p => p.id === packId || p.templateCode === packId);
    if (!pack) return;
    setTemplateCode(pack.templateCode);
    setLoginTemplate(pack.loginTemplate);
    setEnabledFeatures(pack.recommended);

    const matchingTheme = themes.find(t => pack.themeCandidates.includes(t.code)) || themes[0];
    if (matchingTheme) {
      setDefaultThemeId(matchingTheme.id);
    }
  };

  const handleResetFeatures = () => {
    const pack = designPacksList.find(p => p.templateCode === templateCode);
    if (pack) {
      setEnabledFeatures(pack.recommended);
    }
  };

  const updateDerivedFields = (currentName: string, currentCode: string) => {
    const cleanSlug = currentName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const codeKey = currentCode.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    const prefix = codeKey || cleanSlug;
    const base = getPlatformBaseDomain();

    if (!isDomainTouchedRef.current) {
      setPrimaryDomain(prefix ? `${prefix}.${base}` : '');
    }
    if (!isDbTouchedRef.current) {
      setDatabaseName(prefix ? `college_${prefix.replace(/-/g, '_')}_database` : '');
    }
    if (!isUserTouchedRef.current) {
      setAdminUsername(prefix ? `${prefix}-admin` : '');
    }
    if (!isEmailTouchedRef.current) {
      setAdminEmail(prefix ? `admin@${prefix}.edu` : '');
    }
    if (!isFullNameTouchedRef.current) {
      setAdminFullName(currentName.trim() ? `${currentName.trim()} Administrator` : '');
    }
  };

  const handleNameChange = (val: string) => {
    setName(val);
    const cleanSlug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setSlug(cleanSlug);
    updateDerivedFields(val, tenantCode);
  };

  const handleCodeChange = (val: string) => {
    const upper = val.toUpperCase();
    setTenantCode(upper);
    updateDerivedFields(name, upper);
  };

  const handleSuggestDefaults = () => {
    const code = (tenantCode || name.replace(/[^a-zA-Z]/g, '').slice(0, 5)).toUpperCase();
    const generatedSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const prefix = (code || generatedSlug || 'college').toLowerCase().replace(/[^a-z0-9]/g, '');
    const base = getPlatformBaseDomain();

    if (!tenantCode && code) setTenantCode(code);
    if (!slug && generatedSlug) setSlug(generatedSlug);
    setPrimaryDomain(`${prefix}.${base}`);
    setDatabaseName(`college_${prefix}_database`);
    setAdminUsername(`${prefix}-admin`);
    setAdminEmail(`admin@${prefix}.edu`);
    if (name) setAdminFullName(`${name} Administrator`);

    isDomainTouchedRef.current = false;
    isDbTouchedRef.current = false;
    isUserTouchedRef.current = false;
    isEmailTouchedRef.current = false;
    isFullNameTouchedRef.current = false;
  };

  const sanitizeDomain = (raw: string): string => {
    let clean = raw
      .trim()
      .toLowerCase()
      .replace(/^https?:\/\//, '')
      .replace(/\/.*$/, '')
      .split(':')[0];

    if (clean && !clean.includes('.')) {
      const isLocal = isLocalEnvironment();
      const base = getPlatformBaseDomain();
      clean = isLocal ? `${clean}.localhost` : `${clean}.${base}`;
    }

    return clean;
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

      const fallbackDomain = slug.trim() || tenantCode.trim().toLowerCase();
      const cleanPrimaryDomain = sanitizeDomain(primaryDomain || fallbackDomain);
      const resolvedDbName = databaseName.trim() || `college_${tenantCode.toLowerCase()}_database`;
      const resolvedSlug = slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || tenantCode.toLowerCase();

      const payload: CreateCollegeWorkflowRequest = {
        name: name.trim(),
        tenantCode: tenantCode.trim().toUpperCase(),
        slug: resolvedSlug.toLowerCase(),
        primaryDomain: cleanPrimaryDomain,
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
          domain: cleanPrimaryDomain,
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
    const portalUrl = resolveTenantPortalUrl(createdSuccess.domain, createdSuccess.code);
    const displayDomain = formatDisplayDomain(createdSuccess.domain, createdSuccess.code);
    navigator.clipboard.writeText(
      `College: ${createdSuccess.name} (${createdSuccess.code})\nOfficial Domain: ${displayDomain}\nPortal URL: ${portalUrl}\nAdmin User: ${createdSuccess.adminUser}\nPassword: ${createdSuccess.adminPass}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const featureCategories = [
    {
      name: 'Core CMS & Layout',
      features: [
        { code: 'PAGES', label: 'Dynamic Pages Builder' },
        { code: 'MENUS', label: 'Navigation Menus' },
        { code: 'THEMES', label: 'Branding & Theme Colors' },
        { code: 'ABOUT', label: 'About College Module' },
      ]
    },
    {
      name: 'Dynamic Home Sections',
      features: [
        { code: 'BANNERS', label: 'Hero Promotional Slider' },
        { code: 'MARQUEE', label: 'Flash News / Marquee Ticker' },
        { code: 'STATS', label: 'Key Metrics & Stats Counter' },
        { code: 'QUOTE', label: 'Leadership Quote & Message' },
      ]
    },
    {
      name: 'Academics & Faculty',
      features: [
        { code: 'DEPARTMENTS', label: 'Academic Departments' },
        { code: 'COURSES', label: 'Courses & Degree Programs' },
        { code: 'FACULTY', label: 'Faculty & Staff Directory' },
      ]
    },
    {
      name: 'Campus Life & Logistics',
      features: [
        { code: 'NEWS', label: 'Campus News & Press' },
        { code: 'EVENTS', label: 'College Events & Calendar' },
        { code: 'GALLERY', label: 'Photo & Media Gallery' },
        { code: 'MEDIA', label: 'Central Media Library' },
        { code: 'TRANSPORT', label: 'Bus Transport & GPS Routes' },
        { code: 'HOSTELS', label: 'Hostel & Residential Facilities' },
      ]
    },
    {
      name: 'Statutory & Corporate Portals',
      features: [
        { code: 'PLACEMENTS', label: 'Training & Placements (CTC)' },
        { code: 'COMPLIANCE', label: 'Mandatory Disclosures (AICTE/NIRF)' },
        { code: 'LIBRARY', label: 'Central Digital Library & Archives' },
        { code: 'ALUMNI', label: 'Alumni Network Association' },
      ]
    },
    {
      name: 'Admissions & Communication',
      features: [
        { code: 'ADMISSIONS', label: 'Online Admission Portal' },
        { code: 'NOTICES', label: 'Circulars & Exam Notices' },
        { code: 'CONTACT', label: 'Contact & Visitor Inquiries' },
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
              <span className="text-slate-500">Official Domain:</span>
              <span className="text-indigo-600 font-bold">{formatDisplayDomain(createdSuccess.domain, createdSuccess.code)}</span>
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

          {createdSuccess.domain && !createdSuccess.domain.endsWith('.localhost') && !createdSuccess.domain.endsWith('.loyolasoft.com') && (
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-blue-900 dark:text-blue-200 text-left text-[11px] font-sans space-y-1">
              <span className="font-bold flex items-center gap-1"><Globe2 className="w-3.5 h-3.5 text-blue-600" /> Custom Domain DNS Setup:</span>
              <p>Add CNAME <code className="bg-blue-100 dark:bg-blue-900 px-1 py-0.5 rounded font-mono">www</code> ➔ <code className="bg-blue-100 dark:bg-blue-900 px-1 py-0.5 rounded font-mono">{getPlatformRootHost()}</code> in GoDaddy/Namecheap to go live.</p>
            </div>
          )}

          <div className="flex items-center justify-center gap-3 pt-2">
            <a
              href={resolveTenantPortalUrl(createdSuccess.domain, createdSuccess.code)}
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

            <div className="space-y-3.5">
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
                  onChange={(e) => handleCodeChange(e.target.value)}
                  required
                />
              </div>

              <Input
                label="Official College Domain / Subdomain"
                placeholder={`e.g. rcm.${getPlatformBaseDomain()} or custom college domain`}
                value={primaryDomain}
                onChange={(e) => {
                  isDomainTouchedRef.current = e.target.value.trim().length > 0;
                  setPrimaryDomain(e.target.value);
                }}
                helperText={`Auto-suggested subdomain (e.g. shc.${getPlatformBaseDomain()}) or enter a custom domain (e.g. rcmcollege.com)`}
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
              onChange={(e) => {
                isDbTouchedRef.current = e.target.value.trim().length > 0;
                setDatabaseName(e.target.value);
              }}
              helperText="PostgreSQL will automatically run CREATE DATABASE and 17 schema tables"
              required
            />
          </div>

          {/* Section 3: Unified College Design & Experience Pack */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-blue-600" />
                3. Unified College Design & Experience Pack
              </span>
              <button
                type="button"
                onClick={handleResetFeatures}
                className="text-[11px] font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3 h-3" />
                Reset Features to Pack Defaults
              </button>
            </div>

            {/* Single Unified 3-in-1 Design Pack Dropdown */}
            {(() => {
              const currentActivePack = designPacksList.find(p => p.templateCode === templateCode) || designPacksList[0];
              const assignedTheme = themes.find(t => String(t.id) === String(defaultThemeId)) || themes[0];

              return (
                <div className="space-y-3">
                  <Select
                    label="Unified Design & Theme Pack (Website Blueprint + Admin Login + Color Palette)"
                    value={currentActivePack.id}
                    onChange={(e) => handleSelectDesignPack(e.target.value)}
                    options={designPacksList.map((pack) => ({
                      value: pack.id,
                      label: `${pack.number}: ${pack.icon} ${pack.name}`
                    }))}
                  />

                  {/* Unified 3-in-1 Design Suite Preview Card */}
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50/80 via-slate-50 to-indigo-50/50 dark:from-blue-950/30 dark:via-slate-900/60 dark:to-indigo-950/30 border border-blue-200/80 dark:border-blue-800/60 space-y-3 shadow-xs">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-xl shadow-md shrink-0">
                          {currentActivePack.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap mb-0.5">
                            <span className="text-[10px] font-black uppercase tracking-tight px-2 py-0.5 rounded-md bg-blue-600 text-white shadow-2xs">
                              {currentActivePack.number}
                            </span>
                            <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md border ${currentActivePack.badgeBg}`}>
                              {currentActivePack.category}
                            </span>
                          </div>
                          <h4 className="text-xs font-black text-slate-900 dark:text-white">
                            {currentActivePack.name}
                          </h4>
                        </div>
                      </div>
                      <div className={`h-7 px-3 rounded-lg bg-gradient-to-r ${currentActivePack.bg} shrink-0 shadow-xs border border-white/20 flex items-center justify-center text-[10px] font-mono font-black text-white uppercase`}>
                        {currentActivePack.icon} {currentActivePack.number}
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                      {currentActivePack.description}
                    </p>

                    {/* 3 Unified Spec Badges (Website Layout, Color Palette, Admin Login Screen) */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 border-t border-slate-200/80 dark:border-slate-800 text-[11px]">
                      <div className="p-2.5 rounded-xl bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700">
                        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block uppercase">🌐 Website Layout</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200 truncate block mt-0.5">{currentActivePack.category}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700">
                        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block uppercase">🎨 Color Palette</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200 truncate block mt-0.5">
                          {assignedTheme?.name || 'Default Palette'}
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700">
                        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block uppercase">🔐 Admin Login</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200 truncate block mt-0.5">{currentActivePack.loginStyleName}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

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
                onChange={(e) => {
                  isUserTouchedRef.current = e.target.value.trim().length > 0;
                  setAdminUsername(e.target.value);
                }}
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
                onChange={(e) => {
                  isEmailTouchedRef.current = e.target.value.trim().length > 0;
                  setAdminEmail(e.target.value);
                }}
                required
              />
              <Input
                label="Admin Full Name"
                value={adminFullName}
                onChange={(e) => {
                  isFullNameTouchedRef.current = e.target.value.trim().length > 0;
                  setAdminFullName(e.target.value);
                }}
                required
              />
            </div>
          </div>
        </form>
      )}
    </Drawer>
  );
};
