import React, { useEffect, useState } from 'react';
import {
  Briefcase,
  Plus,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  Search,
  RefreshCw,
  LayoutGrid,
  List,
  Globe,
  ExternalLink,
  Save,
  CheckCircle2,
  Building2
} from 'lucide-react';
import { apiClient } from '../../services/apiClient';
import { FormDrawer, DrawerMode, FileUploadInput, ConfirmDialog, useToast } from '../../UI_Componentes/ui';
import { ModulePageHeaderCustomizer } from '../../components/admin/ModulePageHeaderCustomizer';

export interface PlacementCompany {
  id: string;
  companyName: string;
  companyLogoUrl: string;
  companyWebsite?: string;
  displayOrder: number;
  isActive: boolean;
  createdAt?: string;
}

export const PlacementsAdminPage: React.FC = () => {
  const { toast } = useToast();
  const [companies, setCompanies] = useState<PlacementCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  const [showMonitor, setShowMonitor] = useState(true);

  // Drawer State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<DrawerMode>('create');
  const [selectedCompany, setSelectedCompany] = useState<PlacementCompany | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  // Form State
  const [companyName, setCompanyName] = useState('');
  const [companyLogoUrl, setCompanyLogoUrl] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [displayOrder, setDisplayOrder] = useState<number>(1);
  const [isActive, setIsActive] = useState<boolean>(true);

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    if (type === 'success') {
      toast.success(text);
    } else {
      toast.error(text);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/admin/placement-companies');
      if (res.data.success) {
        const list = res.data.data.items || res.data.data || [];
        setCompanies(list);
      }
    } catch (err) {
      console.error('Failed to load placement companies', err);
      showNotification('Failed to load placement companies', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenCreate = () => {
    setSelectedCompany(null);
    setDrawerMode('create');
    setCompanyName('');
    setCompanyLogoUrl('');
    setCompanyWebsite('');
    setDisplayOrder(companies.length + 1);
    setIsActive(true);
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (comp: PlacementCompany) => {
    setSelectedCompany(comp);
    setDrawerMode('edit');
    setCompanyName(comp.companyName);
    setCompanyLogoUrl(comp.companyLogoUrl);
    setCompanyWebsite(comp.companyWebsite || '');
    setDisplayOrder(comp.displayOrder || 1);
    setIsActive(comp.isActive !== false);
    setIsDrawerOpen(true);
  };

  const handleOpenView = (comp: PlacementCompany) => {
    setSelectedCompany(comp);
    setDrawerMode('view');
    setCompanyName(comp.companyName);
    setCompanyLogoUrl(comp.companyLogoUrl);
    setCompanyWebsite(comp.companyWebsite || '');
    setDisplayOrder(comp.displayOrder || 1);
    setIsActive(comp.isActive !== false);
    setIsDrawerOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      const payload = {
        companyName,
        companyLogoUrl,
        companyWebsite: companyWebsite.trim() || null,
        displayOrder: Number(displayOrder) || 1,
        isActive,
      };

      if (drawerMode === 'edit' && selectedCompany) {
        await apiClient.put(`/admin/placement-companies/${selectedCompany.id}`, payload);
        showNotification('Placement partner updated successfully');
      } else {
        await apiClient.post('/admin/placement-companies', payload);
        showNotification('Placement partner added successfully');
      }
      setIsDrawerOpen(false);
      fetchData();
    } catch (err) {
      console.error('Failed to save placement company', err);
      showNotification('Error saving placement partner', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const toggleStatus = async (comp: PlacementCompany) => {
    const nextStatus = comp.isActive === false ? true : false;
    try {
      setActionLoading(true);
      await apiClient.put(`/admin/placement-companies/${comp.id}`, {
        companyName: comp.companyName,
        companyLogoUrl: comp.companyLogoUrl,
        companyWebsite: comp.companyWebsite,
        displayOrder: comp.displayOrder,
        isActive: nextStatus,
      });
      showNotification(`"${comp.companyName}" is now ${nextStatus ? 'ACTIVE' : 'INACTIVE'}`);
      fetchData();
    } catch {
      showNotification('Failed to update company status', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setActionLoading(true);
      await apiClient.delete(`/admin/placement-companies/${deleteTarget.id}`);
      showNotification('Placement partner deleted');
      setDeleteTarget(null);
      fetchData();
    } catch {
      showNotification('Failed to delete company', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredCompanies = companies.filter((c) =>
    c.companyName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCompanies = companies.filter((c) => c.isActive !== false);

  return (
    <div className="space-y-6 font-sans text-slate-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Briefcase className="w-6 h-6 text-emerald-600" />
            <span>Placement Companies</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage corporate recruiters and placement partners rendered in the continuous right-to-left logo marquee.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            disabled={loading}
            className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-xs font-semibold transition shadow-xs cursor-pointer"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Public Page Banner Customizer */}
      <ModulePageHeaderCustomizer
        moduleKey="placements"
        moduleLabel="Placement Partners"
        defaultBadge="Institutional Placements"
        defaultTitle="Building Careers Beyond Campus"
        defaultSubtitle="Connecting our talented graduates with top-tier global organizations and industry leaders."
      />

      {/* ── LIVE RIGHT-TO-LEFT MARQUEE PREVIEW MONITOR ── */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
        <div className="p-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/60">
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${activeCompanies.length > 0 ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`} />
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-mono">
              Live Right-to-Left Marquee Preview
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {activeCompanies.length} Active Partners · Infinite Loop
            </span>
            <button
              type="button"
              onClick={() => setShowMonitor(!showMonitor)}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-2xs transition cursor-pointer"
            >
              {showMonitor ? 'Hide Preview' : 'Show Preview'}
            </button>
          </div>
        </div>

        {showMonitor && (
          <div className="p-6 bg-slate-900 text-white overflow-hidden relative group">
            <p className="text-[10px] font-bold uppercase tracking-wider text-blue-400 text-center mb-3">
              ← Continuous Right-to-Left Logo Animation (Hover to Pause) ←
            </p>
            {activeCompanies.length === 0 ? (
              <div className="text-center text-slate-400 text-xs py-6">
                No active placement companies found. Add your first partner company to start the marquee animation.
              </div>
            ) : (
              <div className="flex items-center space-x-6 overflow-x-auto py-2 no-scrollbar">
                {activeCompanies.map((c) => (
                  <div
                    key={c.id}
                    className="flex-none bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 flex items-center gap-3 shadow-md hover:bg-white/20 transition cursor-pointer"
                  >
                    {c.companyLogoUrl ? (
                      <img src={c.companyLogoUrl} alt={c.companyName} className="h-8 object-contain" />
                    ) : (
                      <Building2 className="w-6 h-6 text-amber-400" />
                    )}
                    <span className="text-xs font-bold text-white">{c.companyName}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Search Bar & View Mode Switcher */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search company name..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600 shadow-xs"
          />
        </div>

        <div className="flex items-center gap-2.5 self-end sm:self-auto">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-2xs">
            <button
              type="button"
              onClick={() => setViewMode('card')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                viewMode === 'card' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-700'
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cards</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                viewMode === 'list' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-700'
              }`}
              title="Table / List View"
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">List</span>
            </button>
          </div>

          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs shadow-xs transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Placement Company</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-500 font-semibold bg-white rounded-xl border border-slate-200 shadow-xs">
          Loading placement companies...
        </div>
      ) : filteredCompanies.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
          <Briefcase className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-sm font-bold text-slate-900">No Placement Companies Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Click "+ Add Placement Company" to upload partner logos for the website marquee.
          </p>
        </div>
      ) : viewMode === 'list' ? (
        /* TABLE VIEW */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase font-bold text-slate-500 tracking-wider">
                <tr>
                  <th className="py-3 px-4">Company Logo</th>
                  <th className="py-3 px-4">Company Name</th>
                  <th className="py-3 px-4">Website</th>
                  <th className="py-3 px-4 text-center">Display Order</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCompanies.map((c) => {
                  const isCompActive = c.isActive !== false;
                  return (
                    <tr key={c.id} className="hover:bg-slate-50/75 transition">
                      <td className="py-3 px-4">
                        <div className="w-16 h-10 bg-slate-50 rounded-lg border border-slate-200 p-1 flex items-center justify-center">
                          {c.companyLogoUrl ? (
                            <img src={c.companyLogoUrl} alt={c.companyName} className="max-h-full max-w-full object-contain" />
                          ) : (
                            <Building2 className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900 text-sm">
                        {c.companyName}
                      </td>
                      <td className="py-3 px-4">
                        {c.companyWebsite ? (
                          <a
                            href={c.companyWebsite}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline inline-flex items-center gap-1 font-mono text-[11px]"
                          >
                            <span>{c.companyWebsite.replace(/^https?:\/\//, '')}</span>
                            <ExternalLink className="w-3 h-3 shrink-0" />
                          </a>
                        ) : (
                          <span className="text-slate-300 italic">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-slate-700">
                        #{c.displayOrder}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => toggleStatus(c)}
                          disabled={actionLoading}
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition cursor-pointer ${
                            isCompActive
                              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                              : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                          }`}
                        >
                          {isCompActive ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          <span>{isCompActive ? 'Active' : 'Inactive'}</span>
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenView(c)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(c)}
                            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                            title="Edit Company"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget({ id: c.id, name: c.companyName })}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                            title="Delete Company"
                          >
                            <Trash2 className="w-4 h-4" />
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
        /* CARDS GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredCompanies.map((c) => {
            const isCompActive = c.isActive !== false;
            return (
              <div
                key={c.id}
                className={`bg-white rounded-2xl border p-4 shadow-xs flex flex-col justify-between space-y-3 transition ${
                  isCompActive ? 'border-slate-200' : 'border-dashed border-slate-300 opacity-60'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-slate-100 text-slate-700">
                      Order #{c.displayOrder}
                    </span>
                    <button
                      onClick={() => toggleStatus(c)}
                      disabled={actionLoading}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold transition cursor-pointer ${
                        isCompActive
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                          : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                      }`}
                    >
                      {isCompActive ? 'Active' : 'Inactive'}
                    </button>
                  </div>

                  <div className="h-20 bg-slate-50 rounded-xl border border-slate-100 p-2 flex items-center justify-center">
                    {c.companyLogoUrl ? (
                      <img src={c.companyLogoUrl} alt={c.companyName} className="max-h-full max-w-full object-contain" />
                    ) : (
                      <Building2 className="w-8 h-8 text-slate-300" />
                    )}
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-slate-900 leading-snug">{c.companyName}</h3>
                    {c.companyWebsite && (
                      <a
                        href={c.companyWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline inline-flex items-center gap-1 font-mono text-[10px] mt-0.5"
                      >
                        <Globe className="w-3 h-3 shrink-0" />
                        <span className="truncate">{c.companyWebsite.replace(/^https?:\/\//, '')}</span>
                      </a>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex justify-end gap-1.5">
                  <button
                    onClick={() => handleOpenView(c)}
                    className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleOpenEdit(c)}
                    className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                    title="Edit Company"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget({ id: c.id, name: c.companyName })}
                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition cursor-pointer"
                    title="Delete Company"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* FormDrawer for Placement Company */}
      <FormDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={
          drawerMode === 'create'
            ? 'Add Placement Company'
            : drawerMode === 'edit'
            ? 'Edit Placement Partner'
            : selectedCompany?.companyName || 'Placement Company'
        }
        subtitle={
          drawerMode === 'create'
            ? 'Add a corporate recruiter and logo for the website marquee'
            : drawerMode === 'edit'
            ? 'Update company logo or website URL'
            : 'Corporate recruiter details'
        }
        icon={<Briefcase className="w-5 h-5 text-emerald-600" />}
        mode={drawerMode}
        onSubmit={handleSave}
        onEditClick={() => setDrawerMode('edit')}
        loading={actionLoading}
        size="md"
      >
        {drawerMode === 'view' && selectedCompany ? (
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-3">
              {selectedCompany.companyLogoUrl ? (
                <img src={selectedCompany.companyLogoUrl} alt={selectedCompany.companyName} className="h-16 mx-auto object-contain" />
              ) : (
                <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
              )}
              <h3 className="text-lg font-bold text-slate-900">{selectedCompany.companyName}</h3>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2 text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Website URL</span>
                <p className="font-mono text-slate-800 mt-0.5">{selectedCompany.companyWebsite || 'None specified'}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Marquee Display Order</span>
                <p className="font-semibold text-slate-800 mt-0.5">#{selectedCompany.displayOrder}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Status</span>
                <p className={`font-semibold mt-0.5 ${selectedCompany.isActive !== false ? 'text-emerald-600' : 'text-red-600'}`}>
                  {selectedCompany.isActive !== false ? 'Active (Visible in Marquee)' : 'Inactive'}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Company Name *</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Infosys / TCS / Wipro / Accenture"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                required
              />
            </div>

            <FileUploadInput
              label="Company Logo *"
              value={companyLogoUrl}
              onChange={setCompanyLogoUrl}
              placeholder="https://upload.wikimedia.org/wikipedia/commons/..."
            />

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Company Website URL</label>
              <input
                type="url"
                value={companyWebsite}
                onChange={(e) => setCompanyWebsite(e.target.value)}
                placeholder="https://www.infosys.com"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Display Order</label>
                <input
                  type="number"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 1)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Status</label>
                <button
                  type="button"
                  onClick={() => setIsActive(!isActive)}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition cursor-pointer ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                      : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                  }`}
                >
                  {isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  <span>{isActive ? 'Active' : 'Inactive'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </FormDrawer>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Placement Company"
        message={`Are you sure you want to delete "${deleteTarget?.name}" from placement partners?`}
        confirmText="Delete Partner"
        loading={actionLoading}
      />
    </div>
  );
};
