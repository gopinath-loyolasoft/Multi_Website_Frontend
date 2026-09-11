import React, { useEffect, useMemo, useState } from 'react';
import { 
  Sliders, 
  RefreshCw, 
  CheckCircle2, 
  Building2, 
  X, 
  Search, 
  ShieldCheck, 
  CheckCheck, 
  XCircle, 
  Globe, 
  ExternalLink, 
  Eye, 
  Plus, 
  Pencil, 
  Layers, 
  Check, 
  AlertCircle, 
  Sparkles,
  Users,
  Box,
  FileText,
  LayoutGrid,
  List,
  Menu as MenuIcon,
  Image as ImageIcon,
  Megaphone,
  Newspaper,
  Calendar,
  GraduationCap,
  Briefcase,
  MessageSquare,
  Mail,
  Award,
  HelpCircle
} from 'lucide-react';
import { 
  FeatureItem, 
  FeatureSummary, 
  FeatureCollegeUsage, 
  Tenant, 
  TenantFeatureItem, 
  CreateFeaturePayload, 
  UpdateFeaturePayload 
} from '../../types';
import { apiClient } from '../../services/apiClient';
import { FormDrawer, Drawer, LivePreviewModal, Input, Select, Switch } from '../../UI_Componentes/ui';

const FEATURE_ROUTES: Record<string, { path: string; label: string }> = {
  NEWS: { path: '/news', label: '/news' },
  EVENTS: { path: '/events', label: '/events' },
  GALLERY: { path: '/gallery', label: '/gallery' },
  COURSES: { path: '/courses', label: '/courses' },
  DEPARTMENTS: { path: '/departments', label: '/departments' },
  FACULTY: { path: '/faculty', label: '/faculty' },
  ADMISSIONS: { path: '/admissions', label: '/admissions' },
  BANNERS: { path: '/', label: 'Home Slider' },
  MARQUEE: { path: '/', label: 'Top Ticker' },
  MENUS: { path: '/', label: 'Header Menu' },
  PAGES: { path: '/admin/pages', label: 'Pages CMS' },
  STATS: { path: '/', label: 'Counters Bar' },
  STATISTICS: { path: '/', label: 'Counters Bar' },
  QUOTES: { path: '/', label: 'Welcome Quote' },
  QUOTE: { path: '/', label: 'Welcome Quote' },
  PLACEMENTS: { path: '/', label: 'Placements' },
  RECRUITERS: { path: '/', label: 'Recruiters' },
  TESTIMONIALS: { path: '/', label: 'Testimonials' },
  CONTACT: { path: '/contact', label: '/contact' },
  NOTICES: { path: '/notices', label: '/notices' },
  MEDIA: { path: '/gallery', label: 'Media' },
};

const getIconComponent = (iconName: string) => {
  const normalized = (iconName || '').toLowerCase().trim();
  switch (normalized) {
    case 'cube':
    case 'box':
    case 'admissions':
      return Box;
    case 'filetext':
    case 'file-text':
    case 'page':
    case 'pages':
      return FileText;
    case 'layout':
    case 'layoutgrid':
    case 'section':
    case 'sections':
      return LayoutGrid;
    case 'menu':
    case 'menus':
    case 'navigation':
      return MenuIcon;
    case 'image':
    case 'images':
    case 'banner':
    case 'banners':
      return ImageIcon;
    case 'megaphone':
    case 'ticker':
    case 'marquee':
    case 'announcement':
      return Megaphone;
    case 'newspaper':
    case 'news':
      return Newspaper;
    case 'event':
    case 'events':
    case 'calendar':
      return Calendar;
    case 'course':
    case 'courses':
    case 'academic':
    case 'academics':
      return GraduationCap;
    case 'faculty':
    case 'staff':
      return Briefcase;
    case 'quote':
    case 'quotes':
    case 'testimonial':
    case 'testimonials':
      return MessageSquare;
    case 'contact':
    case 'mail':
    case 'inquiry':
      return Mail;
    case 'stat':
    case 'stats':
    case 'statistics':
    case 'counter':
      return Award;
    default:
      return Sparkles;
  }
};

const renderFeatureIconBadge = (iconName: string) => {
  const IconComp = getIconComponent(iconName);
  return (
    <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0 shadow-2xs">
      <IconComp className="w-4.5 h-4.5" />
    </div>
  );
};

export const FeaturesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'catalog' | 'assignments'>('catalog');
  const [features, setFeatures] = useState<FeatureItem[]>([]);
  const [summary, setSummary] = useState<FeatureSummary | null>(null);
  const [colleges, setColleges] = useState<Tenant[]>([]);
  const [selectedTenantId, setSelectedTenantId] = useState<string>('');
  const [tenantFeatures, setTenantFeatures] = useState<{ [key: string]: boolean }>({});
  
  const [loading, setLoading] = useState(true);
  const [tenantLoading, setTenantLoading] = useState(false);
  const [savingFeature, setSavingFeature] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  
  // Live Preview Modal
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [previewTitle, setPreviewTitle] = useState('Website Live Preview');

  // Create / Edit Feature Drawer
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    category: 'CORE PAGES & LAYOUT',
    icon: 'box',
    sortOrder: 1,
    isActive: true
  });
  const [formSaving, setFormSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Feature College Usage Modal
  const [usageModalOpen, setUsageModalOpen] = useState(false);
  const [usageData, setUsageData] = useState<FeatureCollegeUsage | null>(null);
  const [usageLoading, setUsageLoading] = useState(false);

  const showNotification = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  const openPreview = (url: string, title: string) => {
    setPreviewUrl(url);
    setPreviewTitle(title);
    setPreviewOpen(true);
  };

  const fetchCatalogAndColleges = async () => {
    try {
      setLoading(true);
      setError(null);
      const [featRes, summaryRes, colRes] = await Promise.all([
        apiClient.get('/superadmin/features'),
        apiClient.get('/superadmin/features/summary'),
        apiClient.get('/superadmin/colleges')
      ]);

      if (featRes.data?.success) {
        setFeatures(featRes.data.data || []);
      } else {
        setError(featRes.data?.message || 'Failed to load feature catalog');
      }

      if (summaryRes.data?.success) {
        setSummary(summaryRes.data.data || null);
      }

      if (colRes.data?.success) {
        const cols: Tenant[] = colRes.data.data || [];
        setColleges(cols);
        if (cols.length > 0 && !selectedTenantId) {
          setSelectedTenantId(cols[0].id.toString());
          fetchTenantFeatures(cols[0].id.toString());
        }
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Failed to load feature modules');
    } finally {
      setLoading(false);
    }
  };

  const fetchTenantFeatures = async (tId: string) => {
    if (!tId) return;
    try {
      setTenantLoading(true);
      const res = await apiClient.get(`/superadmin/colleges/${tId}/features`);
      if (res.data?.success) {
        const featMap: { [key: string]: boolean } = {};
        (res.data.data as TenantFeatureItem[]).forEach((f) => {
          featMap[f.featureCode] = f.isEnabled;
        });
        setTenantFeatures(featMap);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setTenantLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalogAndColleges();
  }, []);

  const handleSelectTenant = (tId: string) => {
    setSelectedTenantId(tId);
    fetchTenantFeatures(tId);
  };

  const handleToggleTenantFeature = async (code: string, currentVal: boolean) => {
    if (!selectedTenantId) return;

    const newVal = !currentVal;
    const updatedMap = { ...tenantFeatures, [code]: newVal };
    setTenantFeatures(updatedMap);

    try {
      setSavingFeature(code);
      const res = await apiClient.put(`/superadmin/colleges/${selectedTenantId}/features`, updatedMap);
      if (res.data?.success) {
        showNotification(`Updated "${code}" module entitlement for selected college.`);
      }
    } catch (err: any) {
      setTenantFeatures({ ...tenantFeatures, [code]: currentVal });
      setError(err.response?.data?.message || 'Failed to update feature');
    } finally {
      setSavingFeature(null);
    }
  };

  const handleBulkToggle = async (enableAll: boolean) => {
    if (!selectedTenantId) return;
    const updatedMap: { [key: string]: boolean } = {};
    features.forEach((f) => {
      updatedMap[f.code] = enableAll;
    });
    setTenantFeatures(updatedMap);

    try {
      setTenantLoading(true);
      const res = await apiClient.put(`/superadmin/colleges/${selectedTenantId}/features`, updatedMap);
      if (res.data?.success) {
        showNotification(enableAll ? 'All feature modules enabled!' : 'All feature modules disabled.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update features');
      fetchTenantFeatures(selectedTenantId);
    } finally {
      setTenantLoading(false);
    }
  };

  const handleToggleFeatureActive = async (feat: FeatureItem) => {
    try {
      const res = await apiClient.post(`/superadmin/features/${feat.id}/toggle`);
      if (res.data?.success) {
        setFeatures(prev => prev.map(f => f.id === feat.id ? { ...f, isActive: !f.isActive } : f));
        showNotification(`Feature "${feat.name}" is now ${!feat.isActive ? 'Active' : 'Inactive'}.`);
      } else {
        setError(res.data?.message || 'Failed to toggle status');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to toggle status');
    }
  };

  const openCreateDrawer = () => {
    setFormMode('create');
    setEditingId(null);
    setFormError(null);
    setFormData({
      code: '',
      name: '',
      description: '',
      category: 'CORE PAGES & LAYOUT',
      icon: 'box',
      sortOrder: (features.length || 0) + 1,
      isActive: true
    });
    setIsFormOpen(true);
  };

  const openEditDrawer = (feat: FeatureItem) => {
    setFormMode('edit');
    setEditingId(feat.id);
    setFormError(null);
    setFormData({
      code: feat.code,
      name: feat.name,
      description: feat.description || '',
      category: feat.category || 'CORE PAGES & LAYOUT',
      icon: feat.icon || 'box',
      sortOrder: feat.sortOrder || 1,
      isActive: feat.isActive
    });
    setIsFormOpen(true);
  };

  const handleSaveFeature = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError('Feature name is required');
      return;
    }
    if (formMode === 'create' && !formData.code.trim()) {
      setFormError('Feature code is required');
      return;
    }

    try {
      setFormSaving(true);
      setFormError(null);

      if (formMode === 'create') {
        const payload: CreateFeaturePayload = {
          code: formData.code.trim().toUpperCase(),
          name: formData.name.trim(),
          description: formData.description.trim(),
          category: formData.category.trim(),
          icon: formData.icon.trim(),
          sortOrder: Number(formData.sortOrder) || 1,
          isActive: formData.isActive
        };

        const res = await apiClient.post('/superadmin/features', payload);
        if (res.data?.success) {
          setIsFormOpen(false);
          showNotification(`Feature "${payload.name}" created successfully!`);
          await fetchCatalogAndColleges();
        } else {
          setFormError(res.data?.message || 'Failed to create feature');
        }
      } else {
        const payload: UpdateFeaturePayload = {
          name: formData.name.trim(),
          description: formData.description.trim(),
          category: formData.category.trim(),
          icon: formData.icon.trim(),
          sortOrder: Number(formData.sortOrder) || 1,
          isActive: formData.isActive
        };

        const res = await apiClient.put(`/superadmin/features/${editingId}`, payload);
        if (res.data?.success) {
          setIsFormOpen(false);
          showNotification(`Feature "${payload.name}" updated successfully!`);
          await fetchCatalogAndColleges();
        } else {
          setFormError(res.data?.message || 'Failed to update feature');
        }
      }
    } catch (err: any) {
      setFormError(err.response?.data?.message || err.message || 'Failed to save feature');
    } finally {
      setFormSaving(false);
    }
  };

  const openUsageModal = async (feat: FeatureItem) => {
    try {
      setUsageLoading(true);
      setUsageModalOpen(true);
      const res = await apiClient.get(`/superadmin/features/${feat.id}/colleges`);
      if (res.data?.success) {
        setUsageData(res.data.data);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setUsageLoading(false);
    }
  };

  const selectedCollege = colleges.find((c) => String(c.id) === String(selectedTenantId));

  const categories = [
    'ALL',
    'NAVIGATION & ANNOUNCEMENTS',
    'CORE PAGES & LAYOUT',
    'ACADEMICS & FACULTY',
    'CAMPUS LIFE & MEDIA',
    'STUDENT CONVERSION'
  ];

  const CATEGORY_ORDER: Record<string, number> = {
    'CMS': 1,
    'CORE PAGES & LAYOUT': 1,
    'NAVIGATION & ANNOUNCEMENTS': 2,
    'CONTENT': 3,
    'CAMPUS LIFE & MEDIA': 4,
    'ACADEMIC': 5,
    'ACADEMICS & FACULTY': 5,
    'STUDENT CONVERSION': 6,
  };

  const sortedFeatures = useMemo(() => {
    return [...features].sort((a, b) => {
      const catA = (a.category || 'CMS').toUpperCase();
      const catB = (b.category || 'CMS').toUpperCase();
      const rankA = CATEGORY_ORDER[catA] ?? 50;
      const rankB = CATEGORY_ORDER[catB] ?? 50;
      if (rankA !== rankB) return rankA - rankB;
      return (a.sortOrder || 0) - (b.sortOrder || 0) || a.name.localeCompare(b.name);
    });
  }, [features]);

  const filteredFeatures = useMemo(() => {
    return sortedFeatures.filter((f) => {
      const featCategory = f.category || 'CORE PAGES & LAYOUT';
      const matchesCategory = selectedCategory === 'ALL' || featCategory === selectedCategory;
      const matchesSearch = 
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (f.description && f.description.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesStatus = 
        statusFilter === 'ALL' || 
        (statusFilter === 'ACTIVE' && f.isActive) || 
        (statusFilter === 'INACTIVE' && !f.isActive);
      return matchesCategory && matchesSearch && matchesStatus;
    });
  }, [sortedFeatures, selectedCategory, searchQuery, statusFilter]);

  const enabledCount = Object.values(tenantFeatures).filter(Boolean).length;

  return (
    <div className="space-y-6 text-slate-900 dark:text-slate-100 font-sans pb-16">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900 mb-2">
            <Sliders className="w-3.5 h-3.5" />
            <span>Platform Feature Control Plane</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Platform Feature Catalog & Tenant Entitlements
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Centrally govern feature entitlements and modular capabilities. Modifying access immediately controls tenant sidebar navigation and API endpoints.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchCatalogAndColleges}
            disabled={loading}
            className="p-2.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-semibold transition cursor-pointer shadow-2xs"
            title="Refresh features"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={openCreateDrawer}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-sm shadow-blue-600/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Feature</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Features</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">{summary?.totalFeatures ?? features.length}</span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-900">
              {summary?.activeFeatures ?? features.filter(f => f.isActive).length} Active
            </span>
          </div>
        </div>

        <div className="p-4.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">College Assignments</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-black text-blue-600 dark:text-blue-400">{summary?.totalAssignments ?? 0}</span>
            <span className="text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-900">
              Active Entitlements
            </span>
          </div>
        </div>

        <div className="p-4.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Categories</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">{summary?.categoriesCount ?? 5}</span>
            <span className="text-xs font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded-full border border-purple-200 dark:border-purple-900">
              Categorized
            </span>
          </div>
        </div>

        <div className="p-4.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Managed Colleges</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">{colleges.length}</span>
            <span className="text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-900">
              Tenants
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'catalog'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>All Features Catalog ({features.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('assignments')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'assignments'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>College Entitlements Matrix</span>
          </button>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shrink-0">
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              viewMode === 'list'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="Switch to List / Table View"
          >
            <List className="w-3.5 h-3.5" />
            <span>List View</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="Switch to Card / Grid View"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Card View</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg(null)}>
            <X className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </button>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs font-medium flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Tab 1: All Features Catalog */}
      {activeTab === 'catalog' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search features by name, code or description..."
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active Only</option>
              <option value="INACTIVE">Inactive Only</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Features Table / Grid Switch */}
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-3">
              <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Loading platform feature catalog...</p>
            </div>
          ) : filteredFeatures.length === 0 ? (
            <div className="py-16 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold">No feature modules match your criteria.</p>
            </div>
          ) : viewMode === 'list' ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 text-slate-400 font-black uppercase tracking-wider text-[10px]">
                      <th className="py-3.5 px-5">Feature Code & Name</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Colleges Using</th>
                      <th className="py-3.5 px-4">Platform Status</th>
                      <th className="py-3.5 px-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {filteredFeatures.map((feat) => (
                      <tr key={feat.id || feat.code} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition">
                        <td className="py-3.5 px-5">
                          <div className="flex items-center gap-3">
                            {renderFeatureIconBadge(feat.icon || 'box')}
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 rounded-md font-mono text-[11px] font-extrabold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/70 dark:border-blue-900 shrink-0">
                                  {feat.code}
                                </span>
                                <span className="font-bold text-slate-900 dark:text-white text-xs truncate">{feat.name}</span>
                              </div>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5 leading-snug">{feat.description}</p>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60 whitespace-nowrap">
                            {feat.category || 'CORE PAGES & LAYOUT'}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <button
                            onClick={() => openUsageModal(feat)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/40 border border-blue-200/70 dark:border-blue-900 transition cursor-pointer whitespace-nowrap"
                            title="View which colleges have this feature enabled"
                          >
                            <Users className="w-3.5 h-3.5" />
                            <span>{feat.collegesUsingCount ?? 0} Colleges</span>
                          </button>
                        </td>

                        <td className="py-3.5 px-4">
                          <button
                            type="button"
                            onClick={() => handleToggleFeatureActive(feat)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold transition cursor-pointer whitespace-nowrap ${
                              feat.isActive
                                ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-900'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/60'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${feat.isActive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                            <span>{feat.isActive ? 'Active' : 'Inactive'}</span>
                          </button>
                        </td>

                        <td className="py-3.5 px-5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => openEditDrawer(feat)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition cursor-pointer"
                              title="Edit feature properties"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredFeatures.map((feat) => (
                <div
                  key={feat.id || feat.code}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-2xs flex flex-col justify-between space-y-4 hover:border-blue-300 dark:hover:border-blue-800 transition"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        {renderFeatureIconBadge(feat.icon || 'box')}
                        <span className="px-2.5 py-0.5 rounded-md font-mono text-xs font-extrabold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/70 dark:border-blue-900">
                          {feat.code}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleToggleFeatureActive(feat)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold transition cursor-pointer ${
                          feat.isActive
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-900'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/60'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${feat.isActive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                        <span>{feat.isActive ? 'Active' : 'Inactive'}</span>
                      </button>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">{feat.name}</h3>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mt-0.5">
                        {feat.category || 'CORE PAGES & LAYOUT'}
                      </span>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-1.5 line-clamp-2">{feat.description}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <button
                      onClick={() => openUsageModal(feat)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/40 border border-blue-200/70 dark:border-blue-900 transition cursor-pointer"
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>{feat.collegesUsingCount ?? 0} Colleges</span>
                    </button>

                    <button
                      onClick={() => openEditDrawer(feat)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition cursor-pointer"
                      title="Edit feature properties"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: College Entitlements Matrix */}
      {activeTab === 'assignments' && (
        <div className="space-y-6">
          {/* College Tenant Selector Card */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xs">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <Building2 className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                  Active College Tenant
                </span>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white truncate">
                  {selectedCollege ? `${selectedCollege.name} (${selectedCollege.tenantCode})` : 'Select College'}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                  Database: {selectedCollege?.databaseName || 'college_tenant'} | Domain: {selectedCollege?.primaryDomain || 'tenant.localhost'}
                </p>

              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <select
                value={selectedTenantId}
                onChange={(e) => handleSelectTenant(e.target.value)}
                className="px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-bold text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[240px] cursor-pointer"
              >
                {colleges.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.tenantCode})
                  </option>
                ))}
              </select>

              <button
                onClick={() => handleBulkToggle(true)}
                disabled={tenantLoading}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-900 transition cursor-pointer"
                title="Enable all modules for this college"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Enable All</span>
              </button>

              <button
                onClick={() => handleBulkToggle(false)}
                disabled={tenantLoading}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition cursor-pointer"
                title="Disable all modules for this college"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Disable All</span>
              </button>
            </div>
          </div>

          {/* Entitlement Status Bar */}
          <div className="px-5 py-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-2xs text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Entitled: {enabledCount} / {features.length} Modules Active for {selectedCollege?.name || 'Selected College'}</span>
            </div>
            <span className="text-[11px] text-slate-400 font-normal">
              Toggle any module to immediately update tenant entitlement access.
            </span>
          </div>

          {/* Feature Grid vs List View */}
          {viewMode === 'list' ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 text-slate-400 font-black uppercase tracking-wider text-[10px]">
                      <th className="py-3.5 px-5">Feature Code & Name</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Tenant Entitlement Status</th>
                      <th className="py-3.5 px-5 text-right">Module Switch</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {sortedFeatures.map((feat) => {
                      const isEnabled = tenantFeatures[feat.code] ?? true;
                      const isToggling = savingFeature === feat.code;

                      return (
                        <tr key={feat.id || feat.code} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition">
                          <td className="py-3.5 px-5">
                            <div className="flex items-center gap-3">
                              {renderFeatureIconBadge(feat.icon || 'box')}
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="px-2 py-0.5 rounded-md font-mono text-[11px] font-extrabold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/70 dark:border-blue-900 shrink-0">
                                    {feat.code}
                                  </span>
                                  <span className="font-bold text-slate-900 dark:text-white text-xs truncate">{feat.name}</span>
                                </div>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5 leading-snug">{feat.description}</p>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60 whitespace-nowrap">
                              {feat.category || 'CORE PAGES & LAYOUT'}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold font-mono ${
                              isEnabled 
                                ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-900' 
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/60'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${isEnabled ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                              <span>{isEnabled ? '✓ ENABLED' : '✗ DISABLED'}</span>
                            </span>
                          </td>

                          <td className="py-3.5 px-5 text-right">
                            <div className="flex items-center justify-end">
                              <button
                                type="button"
                                disabled={isToggling}
                                onClick={() => handleToggleTenantFeature(feat.code, isEnabled)}
                                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                  isEnabled ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
                                }`}
                                title={isEnabled ? `Disable ${feat.name}` : `Enable ${feat.name}`}
                              >
                                <span
                                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                                    isEnabled ? 'translate-x-5' : 'translate-x-0'
                                  }`}
                                />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedFeatures.map((feat) => {
                const isEnabled = tenantFeatures[feat.code] ?? true;
                const isToggling = savingFeature === feat.code;

                return (
                  <div
                    key={feat.id || feat.code}
                    className={`p-5 rounded-2xl border space-y-4 shadow-2xs flex flex-col justify-between transition-all ${
                      isEnabled 
                        ? 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800' 
                        : 'bg-slate-50/70 dark:bg-slate-950/40 border-dashed border-slate-300 dark:border-slate-800 opacity-70'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          {renderFeatureIconBadge(feat.icon || 'box')}
                          <span className="px-2.5 py-0.5 rounded-md font-mono text-xs font-extrabold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/70 dark:border-blue-900">
                            {feat.code}
                          </span>
                        </div>

                        {/* Master Switch */}
                        <button
                          type="button"
                          disabled={isToggling}
                          onClick={() => handleToggleTenantFeature(feat.code, isEnabled)}
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            isEnabled ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
                          }`}
                          title={isEnabled ? `Disable ${feat.name}` : `Enable ${feat.name}`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                              isEnabled ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>

                      <div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">{feat.name}</h3>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mt-0.5">
                          {feat.category || 'CORE PAGES & LAYOUT'}
                        </span>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-1.5">{feat.description}</p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs flex items-center justify-between">
                      <span className="text-slate-400 font-medium">Tenant Access:</span>
                      <span className={`font-bold font-mono text-xs ${isEnabled ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                        {isEnabled ? '✓ ENABLED' : '✗ DISABLED'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Create / Edit Feature FormDrawer */}
      <FormDrawer
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={formMode === 'create' ? 'Create Feature Module' : 'Edit Feature Module'}
        subtitle={formMode === 'create' ? 'Register a new modular capability for the platform' : `Updating ${formData.code}`}
        icon={<Sliders className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
        mode={formMode}
        loading={formSaving}
        onSubmit={handleSaveFeature}
        size="md"
      >
        <div className="space-y-4">
          {formError && (
            <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {formMode === 'create' && (
            <Input
              label="Feature Code"
              required
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              placeholder="e.g. RESEARCH_PAPERS"
              helperText="Unique uppercase system code for access checks."
            />
          )}

          <Input
            label="Feature Name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Research & Publications"
          />

          <Select
            label="Category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            options={[
              { value: 'CORE PAGES & LAYOUT', label: 'CORE PAGES & LAYOUT' },
              { value: 'NAVIGATION & ANNOUNCEMENTS', label: 'NAVIGATION & ANNOUNCEMENTS' },
              { value: 'ACADEMICS & FACULTY', label: 'ACADEMICS & FACULTY' },
              { value: 'CAMPUS LIFE & MEDIA', label: 'CAMPUS LIFE & MEDIA' },
              { value: 'STUDENT CONVERSION', label: 'STUDENT CONVERSION' },
              { value: 'GENERAL', label: 'GENERAL' },
            ]}
          />

          <Input
            label="Display Icon Key"
            value={formData.icon}
            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
            placeholder="e.g. box, filetext, layout, menu, image, megaphone, newspaper, calendar"
            helperText="Icon key maps automatically to SVG icons (e.g. box, filetext, layout, menu, image, megaphone, newspaper)"
          />

          <Input
            label="Sort Order"
            type="number"
            value={String(formData.sortOrder)}
            onChange={(e) => setFormData({ ...formData, sortOrder: Number(e.target.value) || 1 })}
          />

          <Input
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe what this module provides to colleges."
          />

          <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
            <Switch
              label="Feature Active"
              description="Inactive features cannot be enabled for college tenants."
              checked={formData.isActive}
              onChange={(val) => setFormData({ ...formData, isActive: val })}
            />
          </div>
        </div>
      </FormDrawer>

      {/* Feature College Usage Modal */}
      {usageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  College Usage: {usageData?.featureCode || 'Feature'}
                </h2>
              </div>
              <button onClick={() => setUsageModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 shrink-0">
              Colleges that currently have the <strong>{usageData?.featureName || usageData?.featureCode}</strong> module enabled or disabled:
            </p>

            {usageLoading ? (
              <div className="py-12 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="space-y-2 overflow-y-auto flex-1 pr-1">
                {(usageData?.colleges || []).map((col) => (
                  <div
                    key={col.tenantId}
                    className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block">{col.collegeName}</span>
                      <span className="font-mono text-[10px] text-slate-400">{col.tenantCode} • {col.primaryDomain || 'tenant.localhost'}</span>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        col.isEnabled
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {col.isEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end shrink-0">
              <button
                onClick={() => setUsageModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live Preview Modal */}
      <LivePreviewModal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        urlPath={previewUrl}
        title={previewTitle}
      />
    </div>
  );
};
