import React, { useEffect, useState } from 'react';
import { 
  LayoutTemplate, 
  RefreshCw, 
  Plus, 
  Eye, 
  Building2, 
  Palette, 
  Sliders, 
  CheckCircle2, 
  X, 
  Pencil, 
  Trash2, 
  BookOpen, 
  Menu as MenuIcon,
  Search,
  Check,
  AlertCircle
} from 'lucide-react';
import { TemplateItem, Theme, Tenant, CreateTemplatePayload, UpdateTemplatePayload } from '../../types';
import { apiClient } from '../../services/apiClient';
import { FormDrawer, Drawer, ConfirmDialog, Input, Select, Switch } from '../../UI_Componentes/ui';

export const TemplatesPage: React.FC = () => {
  const [templates, setTemplates] = useState<TemplateItem[]>([]);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [colleges, setColleges] = useState<Tenant[]>([]);
  const [features, setFeatures] = useState<{ code: string; name: string; category?: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Blueprint Preview Drawer
  const [blueprintTemplate, setBlueprintTemplate] = useState<TemplateItem | null>(null);
  const [blueprintDrawerOpen, setBlueprintDrawerOpen] = useState(false);
  const [blueprintTab, setBlueprintTab] = useState<'pages' | 'menus' | 'features' | 'theme'>('pages');

  // Create / Edit Drawer
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    category: 'Engineering & Technology',
    description: '',
    defaultThemeId: '',
    supportedThemes: [] as string[],
    recommendedFeatures: [] as string[],
    starterPagesJson: '[]',
    starterMenusJson: '[]',
    isActive: true
  });
  const [formSaving, setFormSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Assign Modal
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [assigningTemplate, setAssigningTemplate] = useState<TemplateItem | null>(null);
  const [selectedCollegeId, setSelectedCollegeId] = useState<string>('');
  const [seedData, setSeedData] = useState(true);
  const [assigning, setAssigning] = useState(false);

  // Delete Dialog
  const [deleteTarget, setDeleteTarget] = useState<TemplateItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const showNotification = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [tmplRes, themeRes, colRes, featRes] = await Promise.all([
        apiClient.get('/superadmin/templates'),
        apiClient.get('/superadmin/themes'),
        apiClient.get('/superadmin/colleges'),
        apiClient.get('/superadmin/features')
      ]);

      if (tmplRes.data.success) {
        setTemplates(tmplRes.data.data || []);
      } else {
        setError(tmplRes.data.message || 'Failed to load templates');
      }

      if (themeRes.data.success) {
        setThemes(themeRes.data.data || []);
      }

      if (colRes.data.success) {
        const cols = colRes.data.data || [];
        setColleges(cols);
        if (cols.length > 0 && !selectedCollegeId) {
          setSelectedCollegeId(String(cols[0].id));
        }
      }

      if (featRes.data.success) {
        setFeatures(featRes.data.data || []);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Failed to load platform data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreateDrawer = () => {
    setFormMode('create');
    setEditingId(null);
    setFormError(null);
    setFormData({
      code: '',
      name: '',
      category: 'Engineering & Technology',
      description: '',
      defaultThemeId: themes[0]?.id ? String(themes[0].id) : '',
      supportedThemes: themes.map(t => t.code),
      recommendedFeatures: ['PAGES', 'MENUS', 'BANNERS', 'NEWS', 'EVENTS', 'DEPARTMENTS', 'COURSES', 'FACULTY', 'CONTACT'],
      starterPagesJson: '[\n  {"slug": "home", "title": "Home", "isPublished": true},\n  {"slug": "about", "title": "About Us", "isPublished": true}\n]',
      starterMenusJson: '[\n  {"title": "Home", "url": "/"},\n  {"title": "About", "url": "/about"}\n]',
      isActive: true
    });
    setIsFormOpen(true);
  };

  const openEditDrawer = (tmpl: TemplateItem) => {
    setFormMode('edit');
    setEditingId(tmpl.id);
    setFormError(null);
    setFormData({
      code: tmpl.code,
      name: tmpl.name,
      category: tmpl.category || 'General',
      description: tmpl.description || '',
      defaultThemeId: tmpl.defaultThemeId ? String(tmpl.defaultThemeId) : '',
      supportedThemes: tmpl.supportedThemes || [],
      recommendedFeatures: tmpl.recommendedFeatures || [],
      starterPagesJson: JSON.stringify(tmpl.starterPages || [], null, 2),
      starterMenusJson: JSON.stringify(tmpl.starterMenus || [], null, 2),
      isActive: tmpl.isActive
    });
    setIsFormOpen(true);
  };

  const handleSaveTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError('Template name is required');
      return;
    }
    if (formMode === 'create' && !formData.code.trim()) {
      setFormError('Template code is required');
      return;
    }

    try {
      setFormSaving(true);
      setFormError(null);

      try {
        if (formData.starterPagesJson) JSON.parse(formData.starterPagesJson);
      } catch {
        setFormError('Starter Pages JSON is not valid JSON format');
        setFormSaving(false);
        return;
      }
      try {
        if (formData.starterMenusJson) JSON.parse(formData.starterMenusJson);
      } catch {
        setFormError('Starter Menus JSON is not valid JSON format');
        setFormSaving(false);
        return;
      }

      if (formMode === 'create') {
        const payload: CreateTemplatePayload = {
          code: formData.code.trim().toUpperCase(),
          name: formData.name.trim(),
          category: formData.category.trim(),
          description: formData.description.trim(),
          defaultThemeId: formData.defaultThemeId ? formData.defaultThemeId : undefined,
          supportedThemes: formData.supportedThemes,
          recommendedFeatures: formData.recommendedFeatures,
          starterPagesJson: formData.starterPagesJson,
          starterMenusJson: formData.starterMenusJson,
          isActive: formData.isActive
        };

        const res = await apiClient.post('/superadmin/templates', payload);
        if (res.data.success) {
          setIsFormOpen(false);
          showNotification(`Template "${payload.name}" created successfully!`);
          await fetchData();
        } else {
          setFormError(res.data.message || 'Failed to create template');
        }
      } else {
        const payload: UpdateTemplatePayload = {
          name: formData.name.trim(),
          category: formData.category.trim(),
          description: formData.description.trim(),
          defaultThemeId: formData.defaultThemeId ? formData.defaultThemeId : undefined,
          supportedThemes: formData.supportedThemes,
          recommendedFeatures: formData.recommendedFeatures,
          starterPagesJson: formData.starterPagesJson,
          starterMenusJson: formData.starterMenusJson,
          isActive: formData.isActive
        };

        const res = await apiClient.put(`/superadmin/templates/${editingId}`, payload);
        if (res.data.success) {
          setIsFormOpen(false);
          showNotification(`Template "${payload.name}" updated successfully!`);
          await fetchData();
        } else {
          setFormError(res.data.message || 'Failed to update template');
        }
      }
    } catch (err: any) {
      setFormError(err.response?.data?.message || err.message || 'Failed to save template');
    } finally {
      setFormSaving(false);
    }
  };

  const handleDeleteTemplate = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      const res = await apiClient.delete(`/superadmin/templates/${deleteTarget.id}`);
      if (res.data.success) {
        showNotification(`Template "${deleteTarget.name}" deleted.`);
        setDeleteTarget(null);
        await fetchData();
      } else {
        setError(res.data.message || 'Failed to delete template');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to delete template');
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  const handleAssignTemplate = async () => {
    if (!assigningTemplate || !selectedCollegeId) return;
    try {
      setAssigning(true);
      const res = await apiClient.post(`/superadmin/templates/${assigningTemplate.id}/assign`, {
        tenantId: selectedCollegeId,
        seedStarterData: seedData
      });
      if (res.data.success) {
        showNotification(`Template assigned successfully! ${seedData ? 'Starter blueprints seeded into college database.' : ''}`);
        setAssignModalOpen(false);
        await fetchData();
      } else {
        setError(res.data.message || 'Failed to assign template');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to assign template');
    } finally {
      setAssigning(false);
    }
  };

  const openBlueprint = (tmpl: TemplateItem) => {
    setBlueprintTemplate(tmpl);
    setBlueprintTab('pages');
    setBlueprintDrawerOpen(true);
  };

  const toggleFormFeature = (fCode: string) => {
    setFormData(prev => ({
      ...prev,
      recommendedFeatures: prev.recommendedFeatures.includes(fCode)
        ? prev.recommendedFeatures.filter(c => c !== fCode)
        : [...prev.recommendedFeatures, fCode]
    }));
  };

  const categories = ['ALL', 'Engineering & Technology', 'Arts & Science', 'Medical & Healthcare', 'University'];

  const filteredTemplates = templates.filter(t => {
    const matchesCategory = selectedCategory === 'ALL' || t.category === selectedCategory;
    const matchesSearch = 
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const totalTemplates = templates.length;
  const activeTemplates = templates.filter(t => t.isActive).length;
  const totalCollegesUsing = templates.reduce((acc, t) => acc + (t.collegesCount || 0), 0);

  return (
    <div className="space-y-6 text-slate-900 font-sans pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 mb-2">
            <LayoutTemplate className="w-3.5 h-3.5" />
            <span>Platform Design System</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            College Website Templates & Blueprints
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage industry-specific website templates connected with default theme styles, recommended feature modules, and starter blueprints.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold transition"
            title="Refresh templates"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={openCreateDrawer}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Template</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Templates</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-black text-slate-900">{totalTemplates}</span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              {activeTemplates} Active
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Colleges Using</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-black text-blue-600">{totalCollegesUsing}</span>
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
              Live Sites
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Available Themes</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-black text-slate-900">{themes.length}</span>
            <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
              Connected
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Feature Modules</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-black text-slate-900">{features.length || 18}</span>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              Selectable
            </span>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg(null)}>
            <X className="w-4 h-4 text-emerald-600" />
          </button>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search templates by code, name, or description..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 bg-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-sm"
            />
          </div>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-500 font-semibold">Loading templates catalog...</p>
        </div>
      ) : filteredTemplates.length === 0 ? (
        <div className="py-16 text-center bg-white border border-slate-200 rounded-3xl">
          <p className="text-slate-500 text-sm font-semibold">No templates match your search criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTemplates.map((tmpl) => {
            const defaultTheme = themes.find(t => String(t.id) === String(tmpl.defaultThemeId)) || 
                                 themes.find(t => t.code === tmpl.defaultThemeCode);
            const primaryColor = defaultTheme?.configuration?.primaryColor || tmpl.themeConfiguration?.primaryColor || '#1e40af';
            const secondaryColor = defaultTheme?.configuration?.secondaryColor || tmpl.themeConfiguration?.secondaryColor || '#f59e0b';

            return (
              <div
                key={tmpl.id}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between space-y-5 hover:shadow-md transition"
              >
                <div className="space-y-4">
                  {/* Top Bar: Code Badge + Active Pill */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-xl font-mono text-xs font-black bg-blue-50 text-blue-700 border border-blue-200">
                        {tmpl.code}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                        {tmpl.category}
                      </span>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        tmpl.isActive
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${tmpl.isActive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                      {tmpl.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{tmpl.name}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed mt-1">{tmpl.description}</p>
                  </div>

                  {/* Connected Theme Swatch */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <Palette className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-bold text-slate-700">Connected Default Theme:</span>
                      </div>
                      <span className="font-mono text-[11px] font-bold text-slate-600">
                        {defaultTheme?.name || tmpl.defaultThemeName || tmpl.defaultThemeCode || 'Default Theme'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div 
                        className="w-5 h-5 rounded-md border border-slate-300 shadow-2xs" 
                        style={{ backgroundColor: primaryColor }} 
                        title={`Primary: ${primaryColor}`} 
                      />
                      <div 
                        className="w-5 h-5 rounded-md border border-slate-300 shadow-2xs" 
                        style={{ backgroundColor: secondaryColor }} 
                        title={`Secondary: ${secondaryColor}`} 
                      />
                      <span className="text-[11px] font-mono text-slate-400">
                        Primary: {primaryColor} | Secondary: {secondaryColor}
                      </span>
                    </div>
                  </div>

                  {/* Recommended Features Tags */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-bold text-slate-600 flex items-center gap-1.5">
                        <Sliders className="w-3 h-3 text-blue-600" />
                        Recommended Features ({tmpl.recommendedFeatures?.length || 0})
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {(tmpl.recommendedFeatures || []).slice(0, 8).map((fCode) => (
                        <span
                          key={fCode}
                          className="px-2 py-0.5 rounded-md text-[10px] font-bold font-mono bg-slate-100 text-slate-700 border border-slate-200"
                        >
                          {fCode}
                        </span>
                      ))}
                      {(tmpl.recommendedFeatures?.length || 0) > 8 && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold text-slate-400 bg-slate-50 border border-slate-200">
                          +{(tmpl.recommendedFeatures?.length || 0) - 8} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Starter Blueprints Info */}
                  <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                    <span className="flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                      Starter Pages: <strong className="text-slate-800 font-bold">{tmpl.starterPages?.length || 2}</strong>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MenuIcon className="w-3.5 h-3.5 text-slate-400" />
                      Starter Menus: <strong className="text-slate-800 font-bold">{tmpl.starterMenus?.length || 4}</strong>
                    </span>
                    <span className="flex items-center gap-1.5 ml-auto text-blue-600 font-semibold">
                      <Building2 className="w-3.5 h-3.5" />
                      Colleges: <strong className="text-blue-700 font-bold">{tmpl.collegesCount || 0}</strong>
                    </span>
                  </div>
                </div>

                {/* Bottom Action Bar */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openBlueprint(tmpl)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition cursor-pointer"
                      title="Inspect blueprint pages, menus and sections"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Blueprint</span>
                    </button>

                    <button
                      onClick={() => {
                        setAssigningTemplate(tmpl);
                        setAssignModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition cursor-pointer"
                      title="Assign this template to an active college tenant"
                    >
                      <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Assign to College</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditDrawer(tmpl)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition cursor-pointer"
                      title="Edit template configuration"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(tmpl)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                      title="Delete template"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Blueprint Viewer Drawer */}
      <Drawer
        isOpen={blueprintDrawerOpen}
        onClose={() => setBlueprintDrawerOpen(false)}
        title={blueprintTemplate ? `${blueprintTemplate.name} — Blueprint Inspector` : 'Blueprint'}
        subtitle={`Template Code: ${blueprintTemplate?.code} | Category: ${blueprintTemplate?.category}`}
        size="lg"
      >
        {blueprintTemplate && (
          <div className="space-y-6">
            {/* Tabs */}
            <div className="flex items-center gap-1 border-b border-slate-200 pb-2">
              <button
                onClick={() => setBlueprintTab('pages')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                  blueprintTab === 'pages' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Starter Pages ({blueprintTemplate.starterPages?.length || 0})
              </button>
              <button
                onClick={() => setBlueprintTab('menus')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                  blueprintTab === 'menus' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Starter Menus ({blueprintTemplate.starterMenus?.length || 0})
              </button>
              <button
                onClick={() => setBlueprintTab('features')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                  blueprintTab === 'features' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Recommended Features ({blueprintTemplate.recommendedFeatures?.length || 0})
              </button>
              <button
                onClick={() => setBlueprintTab('theme')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                  blueprintTab === 'theme' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Connected Theme
              </button>
            </div>

            {/* Tab 1: Pages */}
            {blueprintTab === 'pages' && (
              <div className="space-y-3">
                <p className="text-xs text-slate-500">
                  These starter pages are auto-seeded into the college database upon onboarding:
                </p>
                {(blueprintTemplate.starterPages || []).map((p: any, idx: number) => (
                  <div key={idx} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-800">{p.title}</span>
                      <span className="font-mono text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                        /{p.slug}
                      </span>
                    </div>
                    {p.sections && Array.isArray(p.sections) && (
                      <div className="mt-2 space-y-1">
                        <span className="text-[10px] font-bold uppercase text-slate-400">Sections ({p.sections.length}):</span>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {p.sections.map((s: any, sIdx: number) => (
                            <span key={sIdx} className="px-2 py-0.5 rounded text-[10px] font-mono bg-white border border-slate-200 text-slate-700">
                              {s.sectionType || s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Tab 2: Menus */}
            {blueprintTab === 'menus' && (
              <div className="space-y-3">
                <p className="text-xs text-slate-500">
                  Starter navigation menu hierarchy configured for this template:
                </p>
                {(blueprintTemplate.starterMenus || []).map((m: any, idx: number) => (
                  <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MenuIcon className="w-4 h-4 text-slate-400" />
                      <span className="font-bold text-xs text-slate-800">{m.title}</span>
                    </div>
                    <span className="font-mono text-[11px] text-slate-500">{m.url}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 3: Features */}
            {blueprintTab === 'features' && (
              <div className="space-y-3">
                <p className="text-xs text-slate-500">
                  Features that will be auto-checked when this template is selected during college onboarding:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {(blueprintTemplate.recommendedFeatures || []).map((fCode) => (
                    <div key={fCode} className="p-2.5 rounded-xl border border-slate-200 bg-white flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="font-mono text-xs font-bold text-slate-800">{fCode}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 4: Theme */}
            {blueprintTab === 'theme' && (
              <div className="space-y-4">
                <p className="text-xs text-slate-500">
                  Theme palette and typography bound to this template:
                </p>
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">Theme Name:</span>
                    <span className="text-xs font-bold text-slate-900">{blueprintTemplate.defaultThemeName || 'Standard Theme'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">Theme Code:</span>
                    <span className="font-mono text-xs text-blue-700">{blueprintTemplate.defaultThemeCode || 'THEME_DEFAULT'}</span>
                  </div>
                  {blueprintTemplate.themeConfiguration && (
                    <div className="pt-2 border-t border-slate-200 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-600">Primary Color:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-slate-800">{blueprintTemplate.themeConfiguration.primaryColor}</span>
                          <div className="w-4 h-4 rounded border" style={{ backgroundColor: blueprintTemplate.themeConfiguration.primaryColor }} />
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-600">Secondary Color:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-slate-800">{blueprintTemplate.themeConfiguration.secondaryColor}</span>
                          <div className="w-4 h-4 rounded border" style={{ backgroundColor: blueprintTemplate.themeConfiguration.secondaryColor }} />
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-600">Font Family:</span>
                        <span className="font-mono text-slate-800">{blueprintTemplate.themeConfiguration.fontFamily || 'Inter, sans-serif'}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </Drawer>

      {/* Create / Edit Template Drawer */}
      <FormDrawer
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={formMode === 'create' ? 'Create Website Template' : 'Edit Website Template'}
        subtitle={formMode === 'create' ? 'Define a new industry layout template with default theme and features' : `Updating ${formData.code}`}
        icon={<LayoutTemplate className="w-4 h-4 text-blue-600" />}
        mode={formMode}
        loading={formSaving}
        onSubmit={handleSaveTemplate}
        size="lg"
      >
        <div className="space-y-4">
          {formError && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {formMode === 'create' && (
            <Input
              label="Template Code"
              required
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              placeholder="e.g. POLYTECHNIC_MODERN"
              helperText="Unique uppercase identifier for this template."
            />
          )}

          <Input
            label="Template Name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Polytechnic & Diploma Modern"
          />

          <Select
            label="Category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            options={[
              { value: 'Engineering & Technology', label: 'Engineering & Technology' },
              { value: 'Arts & Science', label: 'Arts & Science' },
              { value: 'Medical & Healthcare', label: 'Medical & Healthcare' },
              { value: 'University', label: 'University' },
              { value: 'General', label: 'General Higher Education' },
            ]}
          />

          <Input
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe the target audience, aesthetic tone, and key focus of this template."
          />

          <Select
            label="Connected Default Theme"
            value={formData.defaultThemeId}
            onChange={(e) => setFormData({ ...formData, defaultThemeId: e.target.value })}
            options={themes.map(t => ({
              value: String(t.id),
              label: `${t.name} (${t.code})`
            }))}
            helperText="When this template is selected during college onboarding, this theme is automatically assigned."
          />

          {/* Recommended Features Selection Grid */}
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <span className="text-xs font-bold text-slate-700 block">
              Recommended Features for this Template ({formData.recommendedFeatures.length} selected)
            </span>
            <p className="text-[11px] text-slate-500">
              Check all modules that should be enabled by default when this template is picked:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-2 border border-slate-200 rounded-xl bg-slate-50/50">
              {features.map((f) => {
                const isChecked = formData.recommendedFeatures.includes(f.code);
                return (
                  <button
                    type="button"
                    key={f.code}
                    onClick={() => toggleFormFeature(f.code)}
                    className={`p-2 rounded-lg text-left text-xs font-medium border transition cursor-pointer flex items-center justify-between ${
                      isChecked
                        ? 'bg-blue-50 border-blue-300 text-blue-800 font-bold'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="truncate">{f.name || f.code}</span>
                    {isChecked && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Starter Blueprints JSON */}
          <div className="space-y-3 pt-2 border-t border-slate-200">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Starter Pages (JSON)
              </label>
              <textarea
                rows={4}
                value={formData.starterPagesJson}
                onChange={(e) => setFormData({ ...formData, starterPagesJson: e.target.value })}
                className="w-full p-3 rounded-xl border border-slate-200 font-mono text-[11px] bg-slate-900 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder='[{"slug": "home", "title": "Home"}]'
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Starter Menus (JSON)
              </label>
              <textarea
                rows={3}
                value={formData.starterMenusJson}
                onChange={(e) => setFormData({ ...formData, starterMenusJson: e.target.value })}
                className="w-full p-3 rounded-xl border border-slate-200 font-mono text-[11px] bg-slate-900 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder='[{"title": "Home", "url": "/"}]'
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200">
            <Switch
              label="Template Active"
              description="Inactive templates are hidden from the college creation wizard."
              checked={formData.isActive}
              onChange={(val) => setFormData({ ...formData, isActive: val })}
            />
          </div>
        </div>
      </FormDrawer>

      {/* Assign Template Modal */}
      {assignModalOpen && assigningTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                <h2 className="text-base font-bold text-slate-900">Assign Template to College</h2>
              </div>
              <button onClick={() => setAssignModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Assign <strong>{assigningTemplate.name}</strong> ({assigningTemplate.code}) to a college tenant.
            </p>

            <div className="space-y-3">
              <Select
                label="Target College Tenant"
                value={selectedCollegeId}
                onChange={(e) => setSelectedCollegeId(e.target.value)}
                options={colleges.map(c => ({
                  value: String(c.id),
                  label: `${c.name} (${c.tenantCode})`
                }))}
              />

              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 space-y-1 text-xs">
                <span className="font-bold text-blue-800">Connected Theme Assignment:</span>
                <p className="text-blue-600 text-[11px]">
                  College will automatically be assigned <strong>{assigningTemplate.defaultThemeName || 'default theme'}</strong>.
                </p>
              </div>

              <Switch
                label="Seed Starter Blueprint Data"
                description="Populate default pages, navigation menus and sections into this college's database."
                checked={seedData}
                onChange={setSeedData}
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setAssignModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={assigning}
                onClick={handleAssignTemplate}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition shadow-sm"
              >
                {assigning ? 'Assigning...' : 'Confirm Assignment'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteTemplate}
        title="Delete Template?"
        message={`Are you sure you want to delete "${deleteTarget?.name}" (${deleteTarget?.code})? Colleges currently using this template will continue using their seeded data, but this template will no longer be available.`}
        confirmText={deleting ? 'Deleting...' : 'Delete Template'}
        variant="danger"
      />
    </div>
  );
};
