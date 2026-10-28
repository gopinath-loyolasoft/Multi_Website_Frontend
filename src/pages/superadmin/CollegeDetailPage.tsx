import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Globe2, 
  Database, 
  Palette, 
  Sliders, 
  Users, 
  Plus,
  RefreshCw,
  Power,
  Trash2,
  CheckCircle2,
  XCircle,
  LayoutTemplate,
  Sparkles,
  Check
} from 'lucide-react';
import { CollegeDetails, Theme } from '../../types';
import { apiClient } from '../../services/apiClient';
import { DeleteCollegeModal } from './DeleteCollegeModal';
import { ConfirmDialog } from '../../UI_Componentes/ui';
import { formatDisplayDomain } from '../../utils/domainUtils';

const TEMPLATE_OPTIONS = [
  { code: 'ENGINEERING_MODERN', number: 'PACK 1', name: 'Engineering & High-Tech Blueprint Suite', icon: '⚙️', defaultTheme: 'THEME_BLUE' },
  { code: 'ARTS_SCIENCE_MODERN', number: 'PACK 2', name: 'Arts & Science Modern Suite', icon: '🎨', defaultTheme: 'THEME_GOLD' },
  { code: 'MEDICAL_MODERN', number: 'PACK 3', name: 'Medical & Healthcare Institute Suite', icon: '⚕️', defaultTheme: 'THEME_TEAL' },
  { code: 'UNIVERSITY_MODERN', number: 'PACK 4', name: 'University & Multi-Faculty Suite', icon: '🎓', defaultTheme: 'THEME_CRIMSON' },
  { code: 'SALESIAN_SLANTED', number: 'PACK 5', name: '3D Slanted Navy & Gold Suite', icon: '⚡', defaultTheme: 'THEME_BLUE' },
  { code: 'DESIGN_3D_GLASS', number: 'PACK 6', name: '3D Holographic Glassmorphism Suite', icon: '💎', defaultTheme: 'THEME_TEAL' },
  { code: 'DESIGN_3D_ISOMETRIC', number: 'PACK 7', name: '3D Isometric Tactile Elevation Suite', icon: '🧊', defaultTheme: 'THEME_GOLD' },
  { code: 'DESIGN_3D_KINETIC', number: 'PACK 8', name: '3D Kinetic Perspective & Flip Suite', icon: '⚡', defaultTheme: 'THEME_CRIMSON' },
  { code: 'DESIGN_3D_NEUMORPHIC', number: 'PACK 9', name: '3D Neumorphic Soft Depth Suite', icon: '🛡️', defaultTheme: 'THEME_TEAL' },
];

const FEATURE_LABEL_MAP: Record<string, string> = {
  PAGES: 'Custom Pages Builder',
  SECTIONS: 'Dynamic Home Sections',
  MENUS: 'Navigation Header/Footer',
  THEMES: 'Theme Customizer',
  ABOUT: 'About Institution',
  BANNERS: 'Hero Slider Banners',
  MARQUEE: 'Announcement Ticker',
  STATS: 'Counters & Stats Bar',
  STATISTICS: 'Counters & Stats Bar',
  QUOTE: 'Leadership Quote',
  QUOTES: 'Leadership Quote',
  DEPARTMENTS: 'Academic Departments',
  COURSES: 'Course Catalog & Syllabus',
  FACULTY: 'Faculty Directory',
  NEWS: 'Campus News & Press',
  EVENTS: 'Events Calendar',
  NOTICES: 'Circulars & Notices',
  GALLERY: 'Photo & Video Gallery',
  MEDIA: 'Media Library',
  PLACEMENTS: 'Placements & Recruiters',
  COMPLIANCE: 'Mandatory Compliance',
  TRANSPORT: 'Campus Transport Network',
  HOSTELS: 'Hostels & Residence',
  LIBRARY: 'Digital Library',
  ALUMNI: 'Alumni Network',
  ADMISSIONS: 'Admissions Portal',
  CONTACT: 'Contact & Campus Map',
  POPUPS: 'Popup Lightbox Alerts',
  POPUP: 'Popup Lightbox Alerts'
};

const FEATURE_GROUPS = [
  {
    category: 'Core CMS & Layout',
    icon: '📄',
    codes: ['PAGES', 'SECTIONS', 'MENUS', 'THEMES']
  },
  {
    category: 'Dynamic Home Sections',
    icon: '⚡',
    codes: ['BANNERS', 'MARQUEE', 'STATS', 'QUOTE', 'POPUPS']
  },
  {
    category: 'Academics & Faculty',
    icon: '🎓',
    codes: ['DEPARTMENTS', 'COURSES', 'FACULTY']
  },
  {
    category: 'Campus Life & Logistics',
    icon: '🏛️',
    codes: ['NEWS', 'EVENTS', 'NOTICES', 'GALLERY', 'MEDIA', 'TRANSPORT', 'HOSTELS', 'LIBRARY']
  },
  {
    category: 'Statutory & Careers',
    icon: '💼',
    codes: ['COMPLIANCE', 'PLACEMENTS', 'ALUMNI']
  },
  {
    category: 'Admissions & Communication',
    icon: '📬',
    codes: ['ADMISSIONS', 'CONTACT', 'ABOUT']
  }
];

export const CollegeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [details, setDetails] = useState<CollegeDetails | null>(null);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [deleteDomainTarget, setDeleteDomainTarget] = useState<{ id: string | number; domain: string } | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const showNotice = (msg: string) => {
    setNotice(msg);
    setActionError(null);
    setTimeout(() => setNotice(null), 4000);
  };

  const showActionError = (msg: string) => {
    setActionError(msg);
    setNotice(null);
  };

  const [newDomain, setNewDomain] = useState('');
  const [isAddingDomain, setIsAddingDomain] = useState(false);
  const [selectedThemeId, setSelectedThemeId] = useState<string | number>('');
  const [selectedTemplateCode, setSelectedTemplateCode] = useState<string>('ENGINEERING_MODERN');
  const [featuresState, setFeaturesState] = useState<{ [key: string]: boolean }>({});
  const [savingFeatures, setSavingFeatures] = useState(false);
  const [dbHealthLoading, setDbHealthLoading] = useState(false);

  const [collegeSettings, setCollegeSettings] = useState<{
    siteName: string;
    tagline: string;
    logoUrl: string;
    faviconUrl: string;
    contactEmail: string;
    contactPhone: string;
    address: string;
  }>({
    siteName: '',
    tagline: '',
    logoUrl: '',
    faviconUrl: '',
    contactEmail: '',
    contactPhone: '',
    address: ''
  });
  const [savingSettings, setSavingSettings] = useState(false);

  const fetchCollegeDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const [colRes, themesRes, settingsRes] = await Promise.all([
        apiClient.get(`/superadmin/colleges/${id}`),
        apiClient.get('/superadmin/themes'),
        apiClient.get(`/superadmin/colleges/${id}/settings`).catch(() => ({ data: { success: false, data: null } }))
      ]);

      if (colRes.data.success) {
        const data: CollegeDetails = colRes.data.data;
        setDetails(data);
        setSelectedThemeId(data.tenant.defaultThemeId || data.theme?.id || '');
        setSelectedTemplateCode(data.tenant.templateCode || 'ENGINEERING_MODERN');

        const featMap: { [key: string]: boolean } = {};
        data.features.forEach(f => {
          featMap[f.featureCode] = f.isEnabled;
        });
        setFeaturesState(featMap);
      } else {
        setError(colRes.data.message || 'College not found');
      }

      if (themesRes.data.success) {
        setThemes(themesRes.data.data);
      }

      if (settingsRes.data?.success && settingsRes.data?.data) {
        const s = settingsRes.data.data;
        setCollegeSettings({
          siteName: s.siteName || colRes.data?.data?.tenant?.name || '',
          tagline: s.tagline || '',
          logoUrl: s.logoUrl || '',
          faviconUrl: s.faviconUrl || '',
          contactEmail: s.contactEmail || '',
          contactPhone: s.contactPhone || '',
          address: s.address || ''
        });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to load college details');
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateChange = async (newCode: string) => {
    if (!details) return;
    try {
      setSelectedTemplateCode(newCode);
      await apiClient.put(`/superadmin/colleges/${details.tenant.id}`, {
        templateCode: newCode
      });
      showNotice(`Website template package switched to ${newCode}.`);
      await fetchCollegeDetails();
    } catch (err: any) {
      console.error(err);
      showActionError(err.response?.data?.message || 'Failed to update website template.');
    }
  };

  const handleEnableAllFeatures = () => {
    const next: { [key: string]: boolean } = {};
    if (details) {
      details.features.forEach(f => {
        next[f.featureCode] = true;
      });
    }
    // Also include all standard 22 codes if not already present
    Object.keys(FEATURE_LABEL_MAP).forEach(code => {
      next[code] = true;
    });
    setFeaturesState(next);
  };

  const handleDisableAllFeatures = () => {
    const next: { [key: string]: boolean } = {};
    if (details) {
      details.features.forEach(f => {
        next[f.featureCode] = false;
      });
    }
    setFeaturesState(next);
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!details) return;
    try {
      setSavingSettings(true);
      await apiClient.put(`/superadmin/colleges/${details.tenant.id}/settings`, collegeSettings);
      showNotice('College Title, Logo & Branding settings updated successfully.');
    } catch (err: any) {
      console.error(err);
      showActionError(err.response?.data?.message || 'Failed to update college branding settings.');
    } finally {
      setSavingSettings(false);
    }
  };

  useEffect(() => {
    fetchCollegeDetails();
  }, [id]);

  const handleToggleStatus = async () => {
    if (!details) return;
    try {
      const endpoint = details.tenant.status === 'ACTIVE' ? 'suspend' : 'activate';
      await apiClient.post(`/superadmin/colleges/${details.tenant.id}/${endpoint}`);
      showNotice(`College ${endpoint === 'suspend' ? 'suspended' : 'activated'} successfully.`);
      await fetchCollegeDetails();
    } catch (err: any) {
      console.error(err);
      showActionError(err.response?.data?.message || 'Failed to update college status.');
    }
  };

  const handleAddDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDomain.trim() || !details) return;
    try {
      await apiClient.post('/superadmin/domains', {
        tenantId: details.tenant.id,
        domain: newDomain.trim().toLowerCase(),
        domainType: 'SECONDARY',
        isPrimary: false
      });
      setNewDomain('');
      setIsAddingDomain(false);
      showNotice(`Domain '${newDomain.trim().toLowerCase()}' mapped successfully.`);
      await fetchCollegeDetails();
    } catch (err: any) {
      console.error(err);
      showActionError(err.response?.data?.message || 'Failed to add domain.');
    }
  };

  const handleDeleteDomain = async () => {
    if (!deleteDomainTarget) return;
    try {
      await apiClient.delete(`/superadmin/domains/${deleteDomainTarget.id}`);
      showNotice('Domain mapping removed.');
      setDeleteDomainTarget(null);
      await fetchCollegeDetails();
    } catch (err: any) {
      console.error(err);
      showActionError(err.response?.data?.message || 'Failed to remove domain.');
    }
  };

  const handleThemeChange = async (themeId: string | number) => {
    if (!details) return;
    try {
      setSelectedThemeId(themeId);
      await apiClient.put(`/superadmin/colleges/${details.tenant.id}/theme`, { themeId });
      showNotice('Theme assignment updated.');
      await fetchCollegeDetails();
    } catch (err: any) {
      console.error(err);
      showActionError(err.response?.data?.message || 'Failed to update theme.');
    }
  };

  const handleSaveFeatures = async () => {
    if (!details) return;
    try {
      setSavingFeatures(true);
      await apiClient.put(`/superadmin/colleges/${details.tenant.id}/features`, featuresState);
      showNotice('Feature toggles applied.');
      await fetchCollegeDetails();
    } catch (err: any) {
      console.error(err);
      showActionError(err.response?.data?.message || 'Failed to save feature flags.');
    } finally {
      setSavingFeatures(false);
    }
  };

  const handleVerifyDatabase = async () => {
    if (!details) return;
    try {
      setDbHealthLoading(true);
      await apiClient.post(`/superadmin/databases/${details.tenant.id}/verify`);
      showNotice('Database health verification completed.');
      await fetchCollegeDetails();
    } catch (err: any) {
      console.error(err);
      showActionError(err.response?.data?.message || 'Database verification failed.');
    } finally {
      setDbHealthLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center space-y-4 font-sans text-slate-600">
        <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 text-sm">Loading college infrastructure aggregate...</p>
      </div>
    );
  }

  if (error || !details) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-red-700 space-y-3 font-sans">
        <h3 className="font-bold text-base">College Not Found</h3>
        <p className="text-sm">{error}</p>
        <Link to="/superadmin/colleges" className="text-blue-600 font-semibold text-xs hover:underline inline-block">
          ← Back to Colleges List
        </Link>
      </div>
    );
  }

  const { tenant, domains, database, features, admins } = details;

  return (
    <div className="space-y-6 text-slate-900 font-sans max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            to="/superadmin/colleges"
            className="p-2 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition shadow-2xs"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900">{tenant.name}</h1>
              <span className="px-2.5 py-0.5 rounded-md font-mono text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                {tenant.tenantCode}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  tenant.status === 'ACTIVE'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${tenant.status === 'ACTIVE' ? 'bg-emerald-600' : 'bg-red-600'}`} />
                <span>{tenant.status}</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-mono">Slug: {tenant.slug} | Tenant ID: #{tenant.id}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleStatus}
            className="px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 shadow-2xs transition"
          >
            <Power className="w-3.5 h-3.5 text-slate-500" />
            <span>{tenant.status === 'ACTIVE' ? 'Suspend College' : 'Activate College'}</span>
          </button>

          <button
            onClick={() => setIsDeleteOpen(true)}
            className="px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition shadow-2xs"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete College</span>
          </button>
        </div>
      </div>

      {notice && (
        <div className="p-3.5 rounded-xl flex items-center gap-2 text-xs font-semibold bg-emerald-50 border border-emerald-200 text-emerald-700">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{notice}</span>
        </div>
      )}
      {actionError && (
        <div className="p-3.5 rounded-xl flex items-center gap-2 text-xs font-semibold bg-red-50 border border-red-200 text-red-700">
          <XCircle className="w-4 h-4 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Grid: Domain, Database, Theme, Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Domain Information */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Globe2 className="w-4 h-4 text-blue-600" />
              <span>Routing Domains</span>
            </div>
            <button
              onClick={() => setIsAddingDomain(!isAddingDomain)}
              className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Domain</span>
            </button>
          </div>

          {isAddingDomain && (
            <form onSubmit={handleAddDomain} className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
              <input
                type="text"
                placeholder="e.g. portal.college.edu or custom.localhost"
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
                className="w-full px-3 py-1.5 rounded-md bg-white border border-slate-300 text-slate-900 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingDomain(false)}
                  className="px-2.5 py-1 bg-white border border-slate-200 text-slate-600 rounded-md text-xs hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md text-xs shadow-2xs"
                >
                  Save Domain
                </button>
              </div>
            </form>
          )}

          <div className="space-y-2">
            {domains.map((dom) => (
              <div
                key={dom.id}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200"
              >
                <div>
                  <div className="font-mono text-xs font-bold text-slate-900">{dom.domain}</div>
                  <div className="text-[11px] text-slate-500">
                    Type: <strong className="text-slate-700 font-medium">{dom.domainType}</strong> {dom.isPrimary && '• Primary Route'}
                  </div>
                </div>
                {!dom.isPrimary && (
                  <button
                    onClick={() => setDeleteDomainTarget({ id: dom.id, domain: dom.domain })}
                    className="p-1.5 text-slate-400 hover:text-red-600 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Card 2: Isolated Database Control */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Database className="w-4 h-4 text-blue-600" />
              <span>Tenant Database Isolation</span>
            </div>
            <button
              onClick={handleVerifyDatabase}
              disabled={dbHealthLoading}
              className="px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shadow-2xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${dbHealthLoading ? 'animate-spin' : ''}`} />
              <span>Verify Health</span>
            </button>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-500">Database Name:</span>
              <span className="font-mono font-bold text-blue-600">{database?.databaseName || 'Not provisioned'}</span>
            </div>
            <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-500">PostgreSQL Host:</span>
              <span className="font-mono text-slate-800">
                {database ? `${database.host}:${database.port}` : 'Not provisioned'}
              </span>
            </div>
            <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-500">Health Status:</span>
              <span className={`font-mono font-semibold ${
                database && database.status !== 'UNKNOWN' ? 'text-emerald-600' : 'text-slate-500'
              }`}>
                {database?.status || 'UNREGISTERED'}
              </span>
            </div>
            <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-500">Schema Migration:</span>
              <span className="font-mono font-semibold text-indigo-600">
                {database?.currentMigrationVersion || 'Not provisioned'}
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Theme & Template Configuration */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Palette className="w-4 h-4 text-blue-600" />
              <span>Theme & Template Architecture</span>
            </div>
            {Boolean(tenant.templateCode) && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-800 border border-blue-200">
                <span>⚡</span>
                <span>{tenant.templateCode}</span>
              </span>
            )}
          </div>

          <div className="space-y-4 text-xs">
            {/* Template Package Switcher */}
            <div className="space-y-1.5">
              <label className="block font-bold text-slate-700">
                1. Website Template Package (Packs 1–9)
              </label>
              <select
                value={selectedTemplateCode}
                onChange={(e) => handleTemplateChange(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                {TEMPLATE_OPTIONS.map((opt) => (
                  <option key={opt.code} value={opt.code}>
                    {opt.icon} {opt.number}: {opt.name} ({opt.code})
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-500">
                Switches the frontend visual archetype, banner stylings, and component animations immediately.
              </p>
            </div>

            {/* Theme Color Palette */}
            <div className="space-y-1.5">
              <label className="block font-bold text-slate-700">
                2. Active Color Palette & Typography
              </label>
              <select
                value={selectedThemeId}
                onChange={(e) => handleThemeChange(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                {themes.map((t) => (
                  <option key={t.id} value={t.id}>
                    🎨 {t.name} ({t.code})
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Live URL: <code className="text-blue-600 font-mono">{formatDisplayDomain(tenant.primaryDomain, tenant.tenantCode, tenant.slug)}</code>
              </p>
            </div>
          </div>
        </div>

        {/* Card 4: Categorized Feature Flags (22 Modules) */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Sliders className="w-4 h-4 text-blue-600" />
              <span>Platform Modules & Feature Matrix</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleEnableAllFeatures}
                className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-[10px] font-bold transition cursor-pointer"
              >
                Enable All
              </button>
              <button
                type="button"
                onClick={handleDisableAllFeatures}
                className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-[10px] font-bold transition cursor-pointer"
              >
                Disable All
              </button>
              <button
                onClick={handleSaveFeatures}
                disabled={savingFeatures}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs shadow-2xs transition cursor-pointer"
              >
                {savingFeatures ? 'Saving...' : 'Apply Flags'}
              </button>
            </div>
          </div>

          {/* Grouped Feature Matrix */}
          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {FEATURE_GROUPS.map((group) => {
              // Find matching features for this group from tenant's feature list or standard list
              const groupFeatures = group.codes.map((code) => {
                const existing = features.find(f => f.featureCode.toUpperCase() === code.toUpperCase());
                return {
                  code,
                  name: FEATURE_LABEL_MAP[code] || code,
                  isEnabled: featuresState[code] ?? (existing ? existing.isEnabled : true)
                };
              });

              return (
                <div key={group.category} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                    <span className="flex items-center gap-1.5">
                      <span>{group.icon}</span>
                      <span>{group.category}</span>
                    </span>
                    <span className="text-slate-400 font-normal">
                      {groupFeatures.filter(f => f.isEnabled).length}/{groupFeatures.length} enabled
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
                    {groupFeatures.map((f) => (
                      <label
                        key={f.code}
                        className={`flex items-center justify-between p-2 rounded-md border text-slate-700 cursor-pointer transition ${
                          f.isEnabled
                            ? 'bg-blue-50/60 border-blue-200 text-blue-900 font-semibold'
                            : 'bg-white border-slate-200 text-slate-500'
                        }`}
                      >
                        <span className="truncate text-[11px]">{f.name}</span>
                        <input
                          type="checkbox"
                          checked={f.isEnabled}
                          onChange={(e) => setFeaturesState({ ...featuresState, [f.code]: e.target.checked })}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 shrink-0"
                        />
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Card 5: College Identity, Title & Logo Settings (SuperAdmin Control) */}
      <form onSubmit={handleSaveSettings} className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <Globe2 className="w-4 h-4 text-blue-600" />
            <span>College Identity, Title & Logo Settings (SuperAdmin Editable)</span>
          </div>
          <button
            type="submit"
            disabled={savingSettings}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs shadow-2xs transition"
          >
            {savingSettings ? 'Saving...' : 'Save Branding Settings'}
          </button>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-1">
              1. Official College Title / Site Name *
            </label>
            <input
              type="text"
              required
              value={collegeSettings.siteName}
              onChange={(e) => setCollegeSettings({ ...collegeSettings, siteName: e.target.value })}
              placeholder="e.g. Royal National College of Engineering"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-900 font-semibold focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Controls the browser tab title and website/admin header title for this tenant.
            </p>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-1">
              2. Official College Title Logo Image *
            </label>
            <input
              type="text"
              value={collegeSettings.logoUrl}
              onChange={(e) => setCollegeSettings({ ...collegeSettings, logoUrl: e.target.value })}
              placeholder="e.g. /uploads/logo.png or uploaded image URL"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-900 font-mono focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Displayed alongside the college title in header bars across the site and admin portal.
            </p>
          </div>
        </div>
      </form>

      {/* College Admins Table */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 text-slate-900 font-bold text-sm">
          <Users className="w-4 h-4 text-blue-600" />
          <span>College Administrators (Scoped to {tenant.tenantCode})</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-slate-500 border-b border-slate-200 bg-slate-50/50">
              <tr>
                <th className="py-2.5 px-3 font-semibold">Username</th>
                <th className="py-2.5 px-3 font-semibold">Full Name</th>
                <th className="py-2.5 px-3 font-semibold">Email</th>
                <th className="py-2.5 px-3 font-semibold">Role</th>
                <th className="py-2.5 px-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {admins.map((adm) => (
                <tr key={adm.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-2.5 px-3 font-mono font-semibold text-slate-900">{adm.username}</td>
                  <td className="py-2.5 px-3 font-medium text-slate-900">{adm.fullName}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-500">{adm.email}</td>
                  <td className="py-2.5 px-3 font-mono text-blue-600 font-medium">{adm.role}</td>
                  <td className="py-2.5 px-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border ${
                      adm.isActive
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-red-50 text-red-700 border-red-200'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${adm.isActive ? 'bg-emerald-600' : 'bg-red-600'}`} />
                      {adm.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete College Modal */}
      <DeleteCollegeModal
        isOpen={isDeleteOpen}
        college={details.tenant}
        onClose={() => setIsDeleteOpen(false)}
        onSuccess={() => navigate('/superadmin/colleges')}
      />

      {/* Delete Domain Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteDomainTarget)}
        onClose={() => setDeleteDomainTarget(null)}
        onConfirm={handleDeleteDomain}
        title="Remove Domain Mapping"
        message={`This permanently removes routing for "${deleteDomainTarget?.domain}". This action cannot be undone.`}
        confirmText="Remove"
      />
    </div>
  );
};
