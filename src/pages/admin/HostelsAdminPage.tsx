import React, { useEffect, useState } from 'react';
import {
  Home,
  Plus,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  Search,
  RefreshCw,
  LayoutGrid,
  List,
  Phone,
  Mail,
  Utensils,
  CheckCircle2,
  FileText,
  Users,
  Building
} from 'lucide-react';
import { apiClient } from '../../services/apiClient';
import { HostelFacility } from '../../types';
import { FormDrawer, DrawerMode, ConfirmDialog, useToast } from '../../UI_Componentes/ui';
import { ModulePageHeaderCustomizer } from '../../components/admin/ModulePageHeaderCustomizer';

export const HostelsAdminPage: React.FC = () => {
  const { toast } = useToast();
  const [hostels, setHostels] = useState<HostelFacility[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'card' | 'list'>('list');
  const [showMonitor, setShowMonitor] = useState(true);

  // Drawer & Dialog State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<DrawerMode>('create');
  const [selectedHostel, setSelectedHostel] = useState<HostelFacility | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string | number; title: string } | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [type, setType] = useState('BOYS');
  const [capacity, setCapacity] = useState<number>(350);
  const [totalRooms, setTotalRooms] = useState<number>(120);
  const [wardenName, setWardenName] = useState('');
  const [wardenPhone, setWardenPhone] = useState('');
  const [wardenEmail, setWardenEmail] = useState('');
  const [messMenuPdfUrl, setMessMenuPdfUrl] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [description, setDescription] = useState('');
  const [amenitiesInput, setAmenitiesInput] = useState('');
  const [isActive, setIsActive] = useState(true);

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    if (type === 'success') {
      toast.success(text);
    } else {
      toast.error(text);
    }
  };

  const fetchHostels = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/admin/hostels');
      if (res.data.success && Array.isArray(res.data.data)) {
        setHostels(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load hostels', err);
      showNotification('Failed to load hostels', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHostels();
  }, []);

  const handleOpenCreate = () => {
    setSelectedHostel(null);
    setDrawerMode('create');
    setName('');
    setType('BOYS');
    setCapacity(350);
    setTotalRooms(120);
    setWardenName('');
    setWardenPhone('');
    setWardenEmail('');
    setMessMenuPdfUrl('');
    setPhotoUrl('');
    setDescription('');
    setAmenitiesInput('High-Speed Wi-Fi, 24/7 Power Backup, RO Water, Gymnasium, Study Hall, CCTV Security');
    setIsActive(true);
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (h: HostelFacility) => {
    setSelectedHostel(h);
    setDrawerMode('edit');
    setName(h.name);
    setType(h.type || h.genderType || 'BOYS');
    setCapacity(h.capacity || 300);
    setTotalRooms(h.totalRooms || 100);
    setWardenName(h.wardenName || '');
    setWardenPhone(h.wardenPhone || '');
    setWardenEmail(h.wardenEmail || '');
    setMessMenuPdfUrl(h.messMenuPdfUrl || '');
    setPhotoUrl(h.photoUrl || '');
    setDescription(h.description || '');
    setAmenitiesInput((h.amenities || []).join(', '));
    setIsActive(h.isActive !== false);
    setIsDrawerOpen(true);
  };

  const handleOpenView = (h: HostelFacility) => {
    setSelectedHostel(h);
    setDrawerMode('view');
    setName(h.name);
    setType(h.type || h.genderType || 'BOYS');
    setCapacity(h.capacity || 300);
    setTotalRooms(h.totalRooms || 100);
    setWardenName(h.wardenName || '');
    setWardenPhone(h.wardenPhone || '');
    setWardenEmail(h.wardenEmail || '');
    setMessMenuPdfUrl(h.messMenuPdfUrl || '');
    setPhotoUrl(h.photoUrl || '');
    setDescription(h.description || '');
    setAmenitiesInput((h.amenities || []).join(', '));
    setIsActive(h.isActive !== false);
    setIsDrawerOpen(true);
  };

  const handleSaveHostel = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    const amenitiesArray = amenitiesInput
      .split(',')
      .map((a) => a.trim())
      .filter(Boolean);

    const payload = {
      name,
      type,
      genderType: type,
      capacity: Number(capacity),
      totalRooms: Number(totalRooms),
      wardenName,
      wardenPhone,
      wardenEmail,
      messMenuPdfUrl,
      photoUrl,
      description,
      amenities: amenitiesArray,
      isActive,
    };

    try {
      if (drawerMode === 'edit' && selectedHostel) {
        await apiClient.put(`/admin/hostels/${selectedHostel.id}`, payload);
        showNotification('Hostel facility updated successfully');
      } else {
        await apiClient.post('/admin/hostels', payload);
        showNotification('Hostel facility registered successfully');
      }
      setIsDrawerOpen(false);
      fetchHostels();
    } catch (err) {
      console.error('Failed to save hostel', err);
      showNotification('Error saving hostel facility', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const toggleStatus = async (h: HostelFacility) => {
    const nextStatus = h.isActive === false ? true : false;
    try {
      setActionLoading(true);
      await apiClient.put(`/admin/hostels/${h.id}`, {
        ...h,
        type: h.type || h.genderType,
        genderType: h.type || h.genderType,
        isActive: nextStatus,
      });
      showNotification(`"${h.name}" is now ${nextStatus ? 'ACTIVE' : 'INACTIVE'}`);
      fetchHostels();
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
      await apiClient.delete(`/admin/hostels/${deleteTarget.id}`);
      showNotification('Hostel facility deleted successfully');
      setDeleteTarget(null);
      fetchHostels();
    } catch (err) {
      console.error('Failed to delete hostel', err);
      showNotification('Failed to delete hostel facility', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredHostels = hostels.filter((h) => {
    const query = searchQuery.toLowerCase();
    const hType = (h.type || h.genderType || '').toLowerCase();
    return (
      h.name.toLowerCase().includes(query) ||
      hType.includes(query) ||
      (h.wardenName && h.wardenName.toLowerCase().includes(query)) ||
      (h.description && h.description.toLowerCase().includes(query))
    );
  });

  const activeHostels = hostels.filter((h) => h.isActive !== false);
  const totalBeds = hostels.reduce((sum, h) => sum + (h.capacity || 0), 0);

  return (
    <div className="space-y-6 font-sans text-slate-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Home className="w-6 h-6 text-teal-600" />
            <span>Campus Hostels & Residence Management</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage student hostels, room and bed capacities, resident wardens, amenities, and mess dining menus.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchHostels}
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
        moduleKey="hostels"
        moduleLabel="Hostels & Residential Living"
        defaultBadge="Residential Life & Accommodation"
        defaultTitle="Hostels & Campus Living"
        defaultSubtitle="A secure, comfortable home away from home with hygienic multi-cuisine dining, high-speed Wi-Fi, and 24/7 surveillance."
      />

      {/* ── LIVE HOSTELS MONITOR ── */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
        <div className="p-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/60">
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${activeHostels.length > 0 ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`} />
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 font-mono">
              Live Hostel Living Monitor
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {activeHostels.length} Active Blocks · {totalBeds} Total Beds Capacity
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
              <div className="text-center text-slate-500 text-xs py-4">Loading hostels...</div>
            ) : hostels.length === 0 ? (
              <div className="text-center text-slate-400 text-xs py-8 space-y-1">
                <Home className="w-8 h-8 text-slate-300 mx-auto" />
                <p>No hostel blocks registered yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {hostels.slice(0, 4).map((h) => {
                  const isHostelActive = h.isActive !== false;
                  return (
                    <div
                      key={h.id}
                      className={`rounded-xl p-3.5 space-y-2 border transition ${
                        isHostelActive
                          ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-2xs'
                          : 'bg-slate-100/70 dark:bg-slate-800/40 border-dashed border-slate-300 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-teal-50 text-teal-700 border border-teal-200 uppercase">
                          {h.type || h.genderType || 'Hostel'}
                        </span>
                        <span className={`w-2 h-2 rounded-full ${isHostelActive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                      </div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white leading-snug line-clamp-1">{h.name}</p>
                      <span className="text-[10px] text-slate-400 block truncate font-medium">
                        {h.capacity || 0} Beds · {h.totalRooms || 0} Rooms
                      </span>
                    </div>
                  );
                })}
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
            placeholder="Search hostels by block name, type, warden..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-teal-600 shadow-xs"
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
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl text-xs shadow-xs transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Hostel Block</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-500 font-semibold bg-white rounded-xl border border-slate-200 shadow-xs">
          Loading hostel facilities...
        </div>
      ) : filteredHostels.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
          <Home className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-sm font-bold text-slate-900">No Hostels Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Click "+ New Hostel Block" to register Boys, Girls, or Executive residence halls.
          </p>
        </div>
      ) : viewMode === 'list' ? (
        /* TABLE VIEW */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase font-bold text-slate-500 tracking-wider">
                <tr>
                  <th className="py-3 px-4">Hostel Name & Type</th>
                  <th className="py-3 px-4">Capacity & Rooms</th>
                  <th className="py-3 px-4">Resident Warden</th>
                  <th className="py-3 px-4">Dining Menu</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredHostels.map((h) => {
                  const isHostelActive = h.isActive !== false;
                  return (
                    <tr key={h.id} className="hover:bg-slate-50/75 transition">
                      <td className="py-3 px-4">
                        <strong className="text-slate-900 font-bold block">{h.name}</strong>
                        <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-teal-50 text-teal-700 border border-teal-200 uppercase inline-block mt-0.5">
                          {h.type || h.genderType || 'BOYS'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-700">
                        <span className="font-bold">{h.capacity || 0} Beds</span>
                        <span className="block text-[11px] text-slate-400">{h.totalRooms || 0} Rooms</span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-medium">
                        {h.wardenName ? (
                          <div>
                            <span className="font-semibold block">{h.wardenName}</span>
                            {h.wardenPhone && (
                              <a href={`tel:${h.wardenPhone}`} className="text-blue-600 font-mono text-[11px] flex items-center gap-1 hover:underline">
                                <Phone className="w-3 h-3" />
                                <span>{h.wardenPhone}</span>
                              </a>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-300 italic">Not appointed</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {h.messMenuPdfUrl ? (
                          <a
                            href={h.messMenuPdfUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-teal-600 hover:underline font-semibold text-xs"
                          >
                            <Utensils className="w-3.5 h-3.5" />
                            <span>Mess Menu</span>
                          </a>
                        ) : (
                          <span className="text-slate-300 italic">Standard Mess</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => toggleStatus(h)}
                          disabled={actionLoading}
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition cursor-pointer ${
                            isHostelActive
                              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                              : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                          }`}
                        >
                          {isHostelActive ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          <span>{isHostelActive ? 'Active' : 'Inactive'}</span>
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenView(h)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                            title="View Hostel Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(h)}
                            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                            title="Edit Hostel"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget({ id: h.id, title: h.name })}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                            title="Delete Hostel"
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
          {filteredHostels.map((h) => {
            const isHostelActive = h.isActive !== false;
            return (
              <div
                key={h.id}
                className={`bg-white rounded-xl border p-5 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition ${
                  isHostelActive ? 'border-slate-200' : 'border-dashed border-red-200 bg-red-50/10 opacity-75'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-md font-mono text-[11px] font-bold bg-teal-50 text-teal-700 uppercase border border-teal-100">
                      {h.type || h.genderType || 'HOSTEL'}
                    </span>
                    <button
                      onClick={() => toggleStatus(h)}
                      disabled={actionLoading}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold transition cursor-pointer ${
                        isHostelActive
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-100'
                          : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-100'
                      }`}
                    >
                      {isHostelActive ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      <span>{isHostelActive ? 'Active' : 'Inactive'}</span>
                    </button>
                  </div>

                  <h3 className={`font-bold text-base leading-snug ${isHostelActive ? 'text-slate-900' : 'text-slate-400 line-through'}`}>
                    {h.name}
                  </h3>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-50 p-2 rounded-lg">
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Capacity</span>
                      <strong className="text-slate-800">{h.capacity || 0} Beds</strong>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-lg">
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Rooms</span>
                      <strong className="text-slate-800">{h.totalRooms || 0} Rooms</strong>
                    </div>
                  </div>

                  {h.wardenName && (
                    <div className="text-xs text-slate-500 pt-1">
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Warden</span>
                      <span className="font-semibold text-slate-700">{h.wardenName}</span>
                      {h.wardenPhone && <span className="block font-mono text-[11px] text-blue-600">{h.wardenPhone}</span>}
                    </div>
                  )}

                  {h.amenities && h.amenities.length > 0 && (
                    <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-1">
                      {h.amenities.slice(0, 3).map((amenity, i) => (
                        <span key={i} className="px-2 py-0.5 bg-slate-100 rounded text-[10px] text-slate-700">
                          {amenity}
                        </span>
                      ))}
                      {h.amenities.length > 3 && (
                        <span className="px-1.5 py-0.5 bg-slate-100 rounded text-[10px] text-slate-400 font-bold">
                          +{h.amenities.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end gap-1.5">
                  <button
                    onClick={() => handleOpenView(h)}
                    className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                    title="View Hostel Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleOpenEdit(h)}
                    className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                    title="Edit Hostel"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget({ id: h.id, title: h.name })}
                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition cursor-pointer"
                    title="Delete Hostel"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Right-Side Drawer for Hostel Block */}
      <FormDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Hostel Facility"
        subtitle={
          drawerMode === 'create'
            ? 'Add a new residence block, room capacity, and warden contact'
            : drawerMode === 'edit'
              ? `Update hostel details for ${name || 'hostel'}`
              : `Overview of ${name || 'hostel'}`
        }
        icon={<Home className="w-5 h-5 text-teal-600" />}
        mode={drawerMode}
        onSubmit={handleSaveHostel}
        onEditClick={() => setDrawerMode('edit')}
        loading={actionLoading}
        size="md"
      >
        {drawerMode === 'view' && selectedHostel ? (
          <div className="space-y-5">
            <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-lg font-mono text-xs font-black bg-teal-600 text-white uppercase">
                  {selectedHostel.type || selectedHostel.genderType || 'RESIDENCE'}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    selectedHostel.isActive !== false ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  {selectedHostel.isActive !== false ? 'Active Block' : 'Inactive'}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{selectedHostel.name}</h3>
              <p className="text-xs font-semibold text-slate-600">
                Capacity: {selectedHostel.capacity || 0} Beds · {selectedHostel.totalRooms || 0} Rooms
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Resident Warden</span>
                <p className="text-sm font-bold text-slate-900 dark:text-white">{selectedHostel.wardenName || 'Not Appointed'}</p>
                {selectedHostel.wardenPhone && <p className="text-xs text-blue-600 font-mono">{selectedHostel.wardenPhone}</p>}
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Dining & Mess</span>
                {selectedHostel.messMenuPdfUrl ? (
                  <a href={selectedHostel.messMenuPdfUrl} target="_blank" rel="noreferrer" className="text-xs font-bold text-teal-600 hover:underline block pt-1">
                    Download Mess Menu (PDF) →
                  </a>
                ) : (
                  <p className="text-xs text-slate-500">Standard Dining Menu</p>
                )}
              </div>
            </div>

            {selectedHostel.description && (
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Description & Rules</span>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{selectedHostel.description}</p>
              </div>
            )}

            {selectedHostel.amenities && selectedHostel.amenities.length > 0 && (
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Campus Facilities & Amenities ({selectedHostel.amenities.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedHostel.amenities.map((amenity, i) => (
                    <span key={i} className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-medium text-slate-800 dark:text-slate-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-teal-600" />
                      <span>{amenity}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Hostel Block Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. APJ Abdul Kalam Boys Residence"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-600 focus:outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Hostel Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-600 focus:outline-none"
                >
                  <option value="BOYS">Boys Hostel</option>
                  <option value="GIRLS">Girls Hostel</option>
                  <option value="CO-ED">Co-Ed / PG</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Total Beds</label>
                <input
                  type="number"
                  value={capacity}
                  onChange={(e) => setCapacity(Number(e.target.value) || 0)}
                  placeholder="350"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Total Rooms</label>
                <input
                  type="number"
                  value={totalRooms}
                  onChange={(e) => setTotalRooms(Number(e.target.value) || 0)}
                  placeholder="120"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Warden Full Name</label>
                <input
                  type="text"
                  value={wardenName}
                  onChange={(e) => setWardenName(e.target.value)}
                  placeholder="e.g. Dr. K. Ramanathan"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Warden Phone Contact</label>
                <input
                  type="tel"
                  value={wardenPhone}
                  onChange={(e) => setWardenPhone(e.target.value)}
                  placeholder="e.g. +91 98401 23456"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-600 focus:outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Weekly Dining Mess Menu PDF URL</label>
              <input
                type="url"
                value={messMenuPdfUrl}
                onChange={(e) => setMessMenuPdfUrl(e.target.value)}
                placeholder="https://.../hostel_mess_menu_2026.pdf"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-600 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Amenities & Features (Comma Separated)</label>
              <textarea
                rows={2}
                value={amenitiesInput}
                onChange={(e) => setAmenitiesInput(e.target.value)}
                placeholder="High-Speed Wi-Fi, 24/7 Power, RO Drinking Water, Modern Gym..."
                className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Description & Guidelines</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Hostel admission guidelines, visiting hours, quiet hours..."
                className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-600 focus:outline-none"
              />
            </div>
          </div>
        )}
      </FormDrawer>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Hostel Facility"
        message={`This will permanently remove the hostel block "${deleteTarget?.title}".`}
        confirmText="Delete Hostel"
        loading={actionLoading}
      />
    </div>
  );
};
