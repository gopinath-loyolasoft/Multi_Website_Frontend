import React, { useEffect, useState } from 'react';
import {
  GraduationCap,
  Plus,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  Search,
  RefreshCw,
  LayoutGrid,
  List,
  Mail,
  Phone,
  Building2,
  MapPin,
  ExternalLink,
  Star,
  CheckCircle2,
  Award,
  Users
} from 'lucide-react';
import { apiClient } from '../../services/apiClient';
import { AlumniMember } from '../../types';
import { FormDrawer, DrawerMode, ConfirmDialog, useToast } from '../../UI_Componentes/ui';
import { ModulePageHeaderCustomizer } from '../../components/admin/ModulePageHeaderCustomizer';

export const AlumniAdminPage: React.FC = () => {
  const { toast } = useToast();
  const [alumni, setAlumni] = useState<AlumniMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'DISTINGUISHED' | 'PENDING'>('ALL');
  const [viewMode, setViewMode] = useState<'card' | 'list'>('list');
  const [showMonitor, setShowMonitor] = useState(true);

  // Drawer & Dialog State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<DrawerMode>('create');
  const [selectedMember, setSelectedMember] = useState<AlumniMember | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string | number; title: string } | null>(null);

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [graduationYear, setGraduationYear] = useState<number>(2022);
  const [degree, setDegree] = useState('B.Tech Computer Science');
  const [currentCompany, setCurrentCompany] = useState('');
  const [currentDesignation, setCurrentDesignation] = useState('');
  const [currentCity, setCurrentCity] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [testimonial, setTestimonial] = useState('');
  const [isFeatured, setIsFeatured] = useState(true);
  const [isApproved, setIsApproved] = useState(true);

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    if (type === 'success') {
      toast.success(text);
    } else {
      toast.error(text);
    }
  };

  const fetchAlumni = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/admin/alumni');
      if (res.data.success && Array.isArray(res.data.data)) {
        setAlumni(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load alumni', err);
      showNotification('Failed to load alumni members', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlumni();
  }, []);

  const handleOpenCreate = () => {
    setSelectedMember(null);
    setDrawerMode('create');
    setFullName('');
    setEmail('');
    setPhone('');
    setGraduationYear(2022);
    setDegree('B.Tech Computer Science');
    setCurrentCompany('');
    setCurrentDesignation('');
    setCurrentCity('');
    setLinkedinUrl('');
    setPhotoUrl('');
    setTestimonial('');
    setIsFeatured(true);
    setIsApproved(true);
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (m: AlumniMember) => {
    setSelectedMember(m);
    setDrawerMode('edit');
    setFullName(m.fullName);
    setEmail(m.email || '');
    setPhone(m.phone || '');
    setGraduationYear(m.graduationYear || 2020);
    setDegree(m.degree || '');
    setCurrentCompany(m.currentCompany || '');
    setCurrentDesignation(m.currentDesignation || '');
    setCurrentCity(m.currentCity || '');
    setLinkedinUrl(m.linkedinUrl || '');
    setPhotoUrl(m.photoUrl || '');
    setTestimonial(m.testimonial || '');
    setIsFeatured(m.isFeatured !== false);
    setIsApproved(m.isApproved !== false);
    setIsDrawerOpen(true);
  };

  const handleOpenView = (m: AlumniMember) => {
    setSelectedMember(m);
    setDrawerMode('view');
    setFullName(m.fullName);
    setEmail(m.email || '');
    setPhone(m.phone || '');
    setGraduationYear(m.graduationYear || 2020);
    setDegree(m.degree || '');
    setCurrentCompany(m.currentCompany || '');
    setCurrentDesignation(m.currentDesignation || '');
    setCurrentCity(m.currentCity || '');
    setLinkedinUrl(m.linkedinUrl || '');
    setPhotoUrl(m.photoUrl || '');
    setTestimonial(m.testimonial || '');
    setIsFeatured(m.isFeatured !== false);
    setIsApproved(m.isApproved !== false);
    setIsDrawerOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    const payload = {
      fullName,
      email,
      phone,
      graduationYear: Number(graduationYear),
      degree,
      currentCompany,
      currentDesignation,
      currentCity,
      linkedinUrl,
      photoUrl,
      testimonial,
      isFeatured,
      isApproved,
    };

    try {
      if (drawerMode === 'edit' && selectedMember) {
        await apiClient.put(`/admin/alumni/${selectedMember.id}`, payload);
        showNotification('Alumnus record updated successfully');
      } else {
        await apiClient.post('/admin/alumni', payload);
        showNotification('Alumnus profile added successfully');
      }
      setIsDrawerOpen(false);
      fetchAlumni();
    } catch (err) {
      console.error('Failed to save alumni member', err);
      showNotification('Error saving alumnus profile', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const toggleApproval = async (m: AlumniMember) => {
    const nextStatus = m.isApproved === false ? 'APPROVED' : 'PENDING';
    try {
      setActionLoading(true);
      await apiClient.patch(`/admin/alumni/${m.id}/status`, nextStatus);
      showNotification(`"${m.fullName}" registration is now ${nextStatus}`);
      fetchAlumni();
    } catch {
      showNotification('Failed to update status', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setActionLoading(true);
      await apiClient.delete(`/admin/alumni/${deleteTarget.id}`);
      showNotification('Alumnus record deleted successfully');
      setDeleteTarget(null);
      fetchAlumni();
    } catch (err) {
      console.error('Failed to delete alumni member', err);
      showNotification('Failed to delete alumnus record', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredAlumni = alumni.filter((m) => {
    const matchesFilter =
      selectedFilter === 'ALL' ||
      (selectedFilter === 'DISTINGUISHED' && m.isFeatured) ||
      (selectedFilter === 'PENDING' && m.isApproved === false);
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      m.fullName.toLowerCase().includes(query) ||
      (m.currentCompany && m.currentCompany.toLowerCase().includes(query)) ||
      (m.degree && m.degree.toLowerCase().includes(query)) ||
      (m.currentDesignation && m.currentDesignation.toLowerCase().includes(query)) ||
      (m.currentCity && m.currentCity.toLowerCase().includes(query));
    return matchesFilter && matchesSearch;
  });

  const distinguishedCount = alumni.filter((m) => m.isFeatured).length;
  const approvedCount = alumni.filter((m) => m.isApproved !== false).length;

  return (
    <div className="space-y-6 font-sans text-slate-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <GraduationCap className="w-6 h-6 text-indigo-700" />
            <span>Global Alumni Network & Directory</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage alumni directory, distinguished achiever spotlights, and verify online student self-registrations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchAlumni}
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
        moduleKey="alumni"
        moduleLabel="Global Alumni Association"
        defaultBadge="Global Alumni Association"
        defaultTitle="Alumni Network & Legacy"
        defaultSubtitle="Celebrating our distinguished alumni leading innovations, founding enterprises, and making a profound impact across the globe."
      />

      {/* ── LIVE ALUMNI MONITOR ── */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
        <div className="p-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/60">
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${approvedCount > 0 ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`} />
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 font-mono">
              Live Alumni Network Monitor
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {approvedCount} Verified Members · {distinguishedCount} Distinguished Spotlights
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
          <div className="p-5 bg-slate-100/90 dark:bg-slate-950/60">
            {loading ? (
              <div className="text-center text-slate-500 text-xs py-4">Loading alumni members...</div>
            ) : alumni.length === 0 ? (
              <div className="text-center text-slate-400 text-xs py-8 space-y-1">
                <GraduationCap className="w-8 h-8 text-slate-300 mx-auto" />
                <p>No alumni registered yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {alumni.slice(0, 4).map((m) => {
                  const isMemApproved = m.isApproved !== false;
                  return (
                    <div
                      key={m.id}
                      className={`rounded-xl p-3.5 space-y-2 border transition ${
                        isMemApproved
                          ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-2xs'
                          : 'bg-slate-100/70 dark:bg-slate-800/40 border-dashed border-slate-300 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase">
                          Class of {m.graduationYear}
                        </span>
                        <span className={`w-2 h-2 rounded-full ${isMemApproved ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                      </div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white leading-snug line-clamp-1">{m.fullName}</p>
                      <span className="text-[10px] text-slate-400 block truncate font-medium">
                        {m.currentDesignation ? `${m.currentDesignation} at ` : ''}{m.currentCompany || 'Alumnus'}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5">
        {[
          { key: 'ALL', label: `All Alumni (${alumni.length})` },
          { key: 'DISTINGUISHED', label: `Distinguished (${distinguishedCount})` },
          { key: 'PENDING', label: `Pending Approvals (${alumni.length - approvedCount})` },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setSelectedFilter(tab.key as any)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              selectedFilter === tab.key
                ? 'bg-indigo-700 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search Bar & View Mode Switcher */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search alumni by name, company, role, batch..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-xs"
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
            className="flex items-center gap-2 px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white font-semibold rounded-xl text-xs shadow-xs transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Alumnus Profile</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-500 font-semibold bg-white rounded-xl border border-slate-200 shadow-xs">
          Loading alumni directory...
        </div>
      ) : filteredAlumni.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
          <GraduationCap className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-sm font-bold text-slate-900">No Alumni Profiles Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Click "+ New Alumnus Profile" to add notable alumni or review student self-registrations.
          </p>
        </div>
      ) : viewMode === 'list' ? (
        /* TABLE VIEW */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase font-bold text-slate-500 tracking-wider">
                <tr>
                  <th className="py-3 px-4">Alumnus Name</th>
                  <th className="py-3 px-4">Current Company & Role</th>
                  <th className="py-3 px-4">Degree & Batch</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAlumni.map((m) => {
                  const isMemApproved = m.isApproved !== false;
                  return (
                    <tr key={m.id} className="hover:bg-slate-50/75 transition">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div>
                            <strong className="text-slate-900 font-bold block">{m.fullName}</strong>
                            {m.email && <span className="text-[11px] text-slate-400 font-mono">{m.email}</span>}
                          </div>
                          {m.isFeatured && (
                            <span className="p-1 rounded-full bg-amber-50 text-amber-600" title="Distinguished Alumnus">
                              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <strong className="text-slate-800 font-semibold block">{m.currentCompany || 'Independent'}</strong>
                        <span className="text-[11px] text-slate-500">{m.currentDesignation || 'Alumnus'}</span>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        <span className="font-medium">{m.degree || 'Degree'}</span>
                        <span className="block text-[11px] text-slate-400 font-mono">Class of {m.graduationYear}</span>
                      </td>
                      <td className="py-3 px-4 text-slate-500 font-medium">
                        {m.currentCity || <span className="text-slate-300 italic">—</span>}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => toggleApproval(m)}
                          disabled={actionLoading}
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition cursor-pointer ${
                            isMemApproved
                              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
                          }`}
                        >
                          {isMemApproved ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <EyeOff className="w-3 h-3 text-amber-500" />}
                          <span>{isMemApproved ? 'Approved' : 'Pending'}</span>
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenView(m)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                            title="View Alumnus Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(m)}
                            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                            title="Edit Profile"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget({ id: m.id, title: m.fullName })}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                            title="Delete Alumnus"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAlumni.map((m) => {
            const isMemApproved = m.isApproved !== false;
            return (
              <div
                key={m.id}
                className={`bg-white rounded-xl border p-5 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition ${
                  isMemApproved ? 'border-slate-200' : 'border-dashed border-amber-200 bg-amber-50/10'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-md font-mono text-[11px] font-bold bg-indigo-50 text-indigo-700 uppercase border border-indigo-100">
                      Class of {m.graduationYear}
                    </span>
                    <button
                      onClick={() => toggleApproval(m)}
                      disabled={actionLoading}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold transition cursor-pointer ${
                        isMemApproved
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-100'
                          : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-100'
                      }`}
                    >
                      {isMemApproved ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <EyeOff className="w-3 h-3 text-amber-500" />}
                      <span>{isMemApproved ? 'Approved' : 'Pending'}</span>
                    </button>
                  </div>

                  <div>
                    <h3 className="font-bold text-base leading-snug text-slate-900 flex items-center gap-1.5">
                      <span>{m.fullName}</span>
                      {m.isFeatured && <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 shrink-0" />}
                    </h3>
                    <p className="text-xs text-slate-600 font-medium mt-0.5">
                      {m.currentDesignation ? `${m.currentDesignation} at ` : ''}{m.currentCompany || 'Alumnus'}
                    </p>
                  </div>

                  <div className="text-xs text-slate-500">
                    <span>{m.degree || 'Alumnus'}</span>
                    {m.currentCity && <span className="block text-[11px] text-slate-400 mt-0.5">📍 {m.currentCity}</span>}
                  </div>

                  {m.testimonial && (
                    <blockquote className="text-xs text-slate-600 italic bg-slate-50 p-2.5 rounded-lg border border-slate-100 line-clamp-3">
                      "{m.testimonial}"
                    </blockquote>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end gap-1.5">
                  <button
                    onClick={() => handleOpenView(m)}
                    className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                    title="View Alumnus Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleOpenEdit(m)}
                    className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                    title="Edit Profile"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget({ id: m.id, title: m.fullName })}
                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition cursor-pointer"
                    title="Delete Alumnus"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Right-Side Drawer for Alumni Profile */}
      <FormDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Alumni Profile"
        subtitle={
          drawerMode === 'create'
            ? 'Add a notable alumnus profile to the institution directory'
            : drawerMode === 'edit'
              ? `Update alumni details for ${fullName || 'member'}`
              : `Overview of ${fullName || 'member'}`
        }
        icon={<GraduationCap className="w-5 h-5 text-indigo-700" />}
        mode={drawerMode}
        onSubmit={handleSave}
        onEditClick={() => setDrawerMode('edit')}
        loading={actionLoading}
        size="md"
      >
        {drawerMode === 'view' && selectedMember ? (
          <div className="space-y-5">
            <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-lg font-mono text-xs font-black bg-indigo-700 text-white uppercase">
                  Class of {selectedMember.graduationYear}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    selectedMember.isApproved !== false ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {selectedMember.isApproved !== false ? 'Verified Alumnus' : 'Pending Verification'}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>{selectedMember.fullName}</span>
                {selectedMember.isFeatured && <Star className="w-4 h-4 fill-amber-500 text-amber-500" />}
              </h3>
              <p className="text-xs font-semibold text-slate-600">
                {selectedMember.currentDesignation ? `${selectedMember.currentDesignation} at ` : ''}{selectedMember.currentCompany || ''}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Degree Program</span>
                <p className="text-sm font-bold text-slate-900 dark:text-white">{selectedMember.degree || 'Graduate'}</p>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Current Location</span>
                <p className="text-sm font-bold text-slate-900 dark:text-white">{selectedMember.currentCity || 'Global'}</p>
              </div>
            </div>

            {selectedMember.testimonial && (
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Alumni Story / Memories</span>
                <p className="text-xs text-slate-600 dark:text-slate-300 italic leading-relaxed">"{selectedMember.testimonial}"</p>
              </div>
            )}

            {selectedMember.linkedinUrl && (
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-between">
                <span className="text-xs font-bold text-blue-900">LinkedIn Profile</span>
                <a
                  href={selectedMember.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 flex items-center gap-1 shadow-2xs"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Connect</span>
                </a>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Full Name *</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Anand Kumar"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Graduation Year *</label>
                <input
                  type="number"
                  value={graduationYear}
                  onChange={(e) => setGraduationYear(Number(e.target.value) || 2022)}
                  placeholder="2022"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-600 focus:outline-none font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Degree & Branch</label>
                <input
                  type="text"
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  placeholder="e.g. B.Tech Mechanical"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Current Company</label>
                <input
                  type="text"
                  value={currentCompany}
                  onChange={(e) => setCurrentCompany(e.target.value)}
                  placeholder="e.g. Google / Tesla"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Current Role / Designation</label>
                <input
                  type="text"
                  value={currentDesignation}
                  onChange={(e) => setCurrentDesignation(e.target.value)}
                  placeholder="e.g. Staff Engineer"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Location (City, Country)</label>
                <input
                  type="text"
                  value={currentCity}
                  onChange={(e) => setCurrentCity(e.target.value)}
                  placeholder="e.g. Bangalore, India"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">LinkedIn Profile URL</label>
                <input
                  type="url"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-600 focus:outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Alumni Story / Quote</label>
              <textarea
                rows={3}
                value={testimonial}
                onChange={(e) => setTestimonial(e.target.value)}
                placeholder="My time at the college built my foundation in problem solving..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-600 focus:outline-none"
              />
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-xs font-bold text-slate-700">Mark as Distinguished Alumnus (Featured Spotlight)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isApproved}
                  onChange={(e) => setIsApproved(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-xs font-bold text-slate-700">Approve Profile (Published to Public Directory)</span>
              </label>
            </div>
          </div>
        )}
      </FormDrawer>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Alumnus Record"
        message={`This will permanently remove "${deleteTarget?.title}" from the alumni network.`}
        confirmText="Delete Alumnus"
        loading={actionLoading}
      />
    </div>
  );
};
