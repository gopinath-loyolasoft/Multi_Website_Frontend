import React, { useEffect, useState } from 'react';
import {
  Bus,
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
  Clock,
  MapPin,
  FileText,
  Navigation,
  CheckCircle2
} from 'lucide-react';
import { apiClient } from '../../services/apiClient';
import { TransportRoute } from '../../types';
import { FormDrawer, DrawerMode, ConfirmDialog, useToast } from '../../UI_Componentes/ui';
import { ModulePageHeaderCustomizer } from '../../components/admin/ModulePageHeaderCustomizer';

export const TransportAdminPage: React.FC = () => {
  const { toast } = useToast();
  const [routes, setRoutes] = useState<TransportRoute[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'card' | 'list'>('list');
  const [showMonitor, setShowMonitor] = useState(true);

  // Drawer & Dialog State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<DrawerMode>('create');
  const [selectedRoute, setSelectedRoute] = useState<TransportRoute | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string | number; title: string } | null>(null);

  // Form State
  const [routeNumber, setRouteNumber] = useState('1');
  const [routeName, setRouteName] = useState('');
  const [startPoint, setStartPoint] = useState('');
  const [endPoint, setEndPoint] = useState('Campus Central');
  const [viaStopsInput, setViaStopsInput] = useState('');
  const [morningPickupTime, setMorningPickupTime] = useState('07:30 AM');
  const [eveningDropTime, setEveningDropTime] = useState('05:00 PM');
  const [driverName, setDriverName] = useState('');
  const [driverPhone, setDriverPhone] = useState('');
  const [timingPdfUrl, setTimingPdfUrl] = useState('');
  const [isActive, setIsActive] = useState(true);

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    if (type === 'success') {
      toast.success(text);
    } else {
      toast.error(text);
    }
  };

  const fetchRoutes = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/admin/transport');
      if (res.data.success && Array.isArray(res.data.data)) {
        setRoutes(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load transport routes', err);
      showNotification('Failed to load transport routes', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  const handleOpenCreate = () => {
    setSelectedRoute(null);
    setDrawerMode('create');
    setRouteNumber(`ROUTE ${(routes.length + 1).toString().padStart(2, '0')}`);
    setRouteName('');
    setStartPoint('');
    setEndPoint('Campus Central');
    setViaStopsInput('');
    setMorningPickupTime('07:30 AM');
    setEveningDropTime('05:00 PM');
    setDriverName('');
    setDriverPhone('');
    setTimingPdfUrl('');
    setIsActive(true);
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (r: TransportRoute) => {
    setSelectedRoute(r);
    setDrawerMode('edit');
    setRouteNumber(r.routeNumber);
    setRouteName(r.routeName);
    setStartPoint(r.startPoint || r.startingPoint || '');
    setEndPoint(r.endPoint || r.destination || 'Campus Central');
    setViaStopsInput((r.viaStops || []).join(', '));
    setMorningPickupTime(r.morningPickupTime || '07:30 AM');
    setEveningDropTime(r.eveningDropTime || '05:00 PM');
    setDriverName(r.driverName || '');
    setDriverPhone(r.driverPhone || '');
    setTimingPdfUrl(r.timingPdfUrl || '');
    setIsActive(r.isActive !== false);
    setIsDrawerOpen(true);
  };

  const handleOpenView = (r: TransportRoute) => {
    setSelectedRoute(r);
    setDrawerMode('view');
    setRouteNumber(r.routeNumber);
    setRouteName(r.routeName);
    setStartPoint(r.startPoint || r.startingPoint || '');
    setEndPoint(r.endPoint || r.destination || 'Campus Central');
    setViaStopsInput((r.viaStops || []).join(', '));
    setMorningPickupTime(r.morningPickupTime || '07:30 AM');
    setEveningDropTime(r.eveningDropTime || '05:00 PM');
    setDriverName(r.driverName || '');
    setDriverPhone(r.driverPhone || '');
    setTimingPdfUrl(r.timingPdfUrl || '');
    setIsActive(r.isActive !== false);
    setIsDrawerOpen(true);
  };

  const handleSaveRoute = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    const stopsArray = viaStopsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      routeNumber,
      routeName,
      startPoint,
      startingPoint: startPoint,
      endPoint,
      destination: endPoint,
      viaStops: stopsArray,
      morningPickupTime,
      eveningDropTime,
      driverName,
      driverPhone,
      timingPdfUrl,
      isActive,
    };

    try {
      if (drawerMode === 'edit' && selectedRoute) {
        await apiClient.put(`/admin/transport/${selectedRoute.id}`, payload);
        showNotification('Transport route updated successfully');
      } else {
        await apiClient.post('/admin/transport', payload);
        showNotification('Transport route registered successfully');
      }
      setIsDrawerOpen(false);
      fetchRoutes();
    } catch (err) {
      console.error('Failed to save route', err);
      showNotification('Error saving transport route', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const toggleStatus = async (route: TransportRoute) => {
    const nextStatus = route.isActive === false ? true : false;
    try {
      setActionLoading(true);
      await apiClient.put(`/admin/transport/${route.id}`, {
        ...route,
        startPoint: route.startPoint || route.startingPoint,
        endPoint: route.endPoint || route.destination,
        isActive: nextStatus,
      });
      showNotification(`"${route.routeName || route.routeNumber}" is now ${nextStatus ? 'ACTIVE' : 'INACTIVE'}`);
      fetchRoutes();
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
      await apiClient.delete(`/admin/transport/${deleteTarget.id}`);
      showNotification('Transport route deleted successfully');
      setDeleteTarget(null);
      fetchRoutes();
    } catch (err) {
      console.error('Failed to delete route', err);
      showNotification('Failed to delete transport route', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredRoutes = routes.filter((r) => {
    const query = searchQuery.toLowerCase();
    const stPoint = (r.startPoint || r.startingPoint || '').toLowerCase();
    const endP = (r.endPoint || r.destination || '').toLowerCase();
    const stops = (r.viaStops || []).join(' ').toLowerCase();
    return (
      r.routeNumber.toLowerCase().includes(query) ||
      r.routeName.toLowerCase().includes(query) ||
      stPoint.includes(query) ||
      endP.includes(query) ||
      stops.includes(query) ||
      (r.driverName && r.driverName.toLowerCase().includes(query))
    );
  });

  const activeRoutes = routes.filter((r) => r.isActive !== false);

  return (
    <div className="space-y-6 font-sans text-slate-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Bus className="w-6 h-6 text-amber-500" />
            <span>Campus Transport & Bus Routes</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage college bus fleet, morning pickup points, boarding stops, timings, driver phone contacts, and schedule PDFs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchRoutes}
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
        moduleKey="transport"
        moduleLabel="Campus Transport & Bus Services"
        defaultBadge="Campus Fleet & Logistics"
        defaultTitle="Bus Transport & Route Network"
        defaultSubtitle="Safe, GPS-enabled fleet connecting all prime city hubs, suburban stations, and transit corridors to the campus."
      />

      {/* ── LIVE TRANSPORT MONITOR ── */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
        <div className="p-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/60">
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${activeRoutes.length > 0 ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`} />
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 font-mono">
              Live Fleet Transport Monitor
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {activeRoutes.length} Active Routes · {routes.length - activeRoutes.length} Inactive
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
              <div className="text-center text-slate-500 text-xs py-4">Loading bus fleet...</div>
            ) : routes.length === 0 ? (
              <div className="text-center text-slate-400 text-xs py-8 space-y-1">
                <Bus className="w-8 h-8 text-slate-300 mx-auto" />
                <p>No bus routes configured yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {routes.slice(0, 4).map((r) => {
                  const isRouteActive = r.isActive !== false;
                  return (
                    <div
                      key={r.id}
                      className={`rounded-xl p-3.5 space-y-2 border transition ${
                        isRouteActive
                          ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-2xs'
                          : 'bg-slate-100/70 dark:bg-slate-800/40 border-dashed border-slate-300 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-amber-50 text-amber-700 border border-amber-200 uppercase">
                          {r.routeNumber}
                        </span>
                        <span className={`w-2 h-2 rounded-full ${isRouteActive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                      </div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white leading-snug line-clamp-1">{r.routeName || r.startPoint}</p>
                      <span className="text-[10px] text-slate-400 block truncate">
                        {r.morningPickupTime} → {r.eveningDropTime}
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
            placeholder="Search routes by number, area, stop, driver..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs"
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
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl text-xs shadow-xs transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Bus Route</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-500 font-semibold bg-white rounded-xl border border-slate-200 shadow-xs">
          Loading bus transport routes...
        </div>
      ) : filteredRoutes.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
          <Bus className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-sm font-bold text-slate-900">No Bus Routes Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Click "+ New Bus Route" to add college transport routes, stops, and driver contacts.
          </p>
        </div>
      ) : viewMode === 'list' ? (
        /* TABLE VIEW */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase font-bold text-slate-500 tracking-wider">
                <tr>
                  <th className="py-3 px-4">Route #</th>
                  <th className="py-3 px-4">Route Name & Destination</th>
                  <th className="py-3 px-4">Schedule Timings</th>
                  <th className="py-3 px-4">Driver Contact</th>
                  <th className="py-3 px-4">Boarding Stops</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRoutes.map((r) => {
                  const isRouteActive = r.isActive !== false;
                  const stPoint = r.startPoint || r.startingPoint || 'Starting Point';
                  const endP = r.endPoint || r.destination || 'Campus';
                  return (
                    <tr key={r.id} className="hover:bg-slate-50/75 transition">
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-amber-50 text-amber-700 border border-amber-200 uppercase">
                          {r.routeNumber}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <strong className="text-slate-900 font-bold block">{r.routeName || `${stPoint} → ${endP}`}</strong>
                        <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{stPoint} to {endP}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        <span className="font-semibold text-slate-800">{r.morningPickupTime}</span> (Morning)
                        <span className="block text-[11px] text-slate-400">{r.eveningDropTime} (Evening Return)</span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-medium">
                        {r.driverName ? (
                          <div>
                            <span className="font-semibold block">{r.driverName}</span>
                            {r.driverPhone && (
                              <a href={`tel:${r.driverPhone}`} className="text-blue-600 font-mono text-[11px] flex items-center gap-1 hover:underline">
                                <Phone className="w-3 h-3" />
                                <span>{r.driverPhone}</span>
                              </a>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-300 italic">Not assigned</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {r.viaStops && r.viaStops.length > 0 ? (
                          <span className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-medium">
                            {r.viaStops.length} Stops
                          </span>
                        ) : (
                          <span className="text-slate-300 italic">Direct</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => toggleStatus(r)}
                          disabled={actionLoading}
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition cursor-pointer ${
                            isRouteActive
                              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                              : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                          }`}
                        >
                          {isRouteActive ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          <span>{isRouteActive ? 'Active' : 'Inactive'}</span>
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenView(r)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                            title="View Route Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(r)}
                            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                            title="Edit Route"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget({ id: r.id, title: `${r.routeNumber} - ${r.routeName || stPoint}` })}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                            title="Delete Route"
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
          {filteredRoutes.map((r) => {
            const isRouteActive = r.isActive !== false;
            const stPoint = r.startPoint || r.startingPoint || 'Start';
            const endP = r.endPoint || r.destination || 'Campus';
            return (
              <div
                key={r.id}
                className={`bg-white rounded-xl border p-5 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition ${
                  isRouteActive ? 'border-slate-200' : 'border-dashed border-red-200 bg-red-50/10 opacity-75'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-md font-mono text-[11px] font-bold bg-amber-50 text-amber-700 uppercase border border-amber-100">
                      {r.routeNumber}
                    </span>
                    <button
                      onClick={() => toggleStatus(r)}
                      disabled={actionLoading}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold transition cursor-pointer ${
                        isRouteActive
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-100'
                          : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-100'
                      }`}
                    >
                      {isRouteActive ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      <span>{isRouteActive ? 'Active' : 'Inactive'}</span>
                    </button>
                  </div>

                  <h3 className={`font-bold text-base leading-snug ${isRouteActive ? 'text-slate-900' : 'text-slate-400 line-through'}`}>
                    {r.routeName || `${stPoint} → ${endP}`}
                  </h3>

                  <div className="space-y-1 text-xs text-slate-500">
                    <div className="flex items-center gap-1.5 font-medium text-slate-700">
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      <span>{r.morningPickupTime} Pickup • {r.eveningDropTime} Return</span>
                    </div>
                    {r.driverName && (
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>Driver: {r.driverName} ({r.driverPhone || '—'})</span>
                      </div>
                    )}
                  </div>

                  {r.viaStops && r.viaStops.length > 0 && (
                    <div className="pt-2 border-t border-slate-100">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Boarding Stops</span>
                      <div className="flex flex-wrap gap-1">
                        {r.viaStops.slice(0, 4).map((stop, i) => (
                          <span key={i} className="px-2 py-0.5 bg-slate-100 rounded text-[10px] text-slate-700">
                            {stop}
                          </span>
                        ))}
                        {r.viaStops.length > 4 && (
                          <span className="px-1.5 py-0.5 bg-slate-100 rounded text-[10px] text-slate-400 font-bold">
                            +{r.viaStops.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end gap-1.5">
                  <button
                    onClick={() => handleOpenView(r)}
                    className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                    title="View Route Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleOpenEdit(r)}
                    className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                    title="Edit Route"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget({ id: r.id, title: `${r.routeNumber} (${r.routeName || stPoint})` })}
                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition cursor-pointer"
                    title="Delete Route"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Right-Side Drawer for Bus Route */}
      <FormDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Campus Bus Route"
        subtitle={
          drawerMode === 'create'
            ? 'Register a new college transit route, pickup points, and coordinator'
            : drawerMode === 'edit'
              ? `Update route details for ${routeNumber}`
              : `Overview of ${routeNumber}`
        }
        icon={<Bus className="w-5 h-5 text-amber-500" />}
        mode={drawerMode}
        onSubmit={handleSaveRoute}
        onEditClick={() => setDrawerMode('edit')}
        loading={actionLoading}
        size="md"
      >
        {drawerMode === 'view' && selectedRoute ? (
          <div className="space-y-5">
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-lg font-mono text-xs font-black bg-amber-500 text-white uppercase">
                  {selectedRoute.routeNumber}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    selectedRoute.isActive !== false ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  {selectedRoute.isActive !== false ? 'Active Fleet Route' : 'Inactive'}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{selectedRoute.routeName || 'Transit Route'}</h3>
              <p className="text-xs font-semibold text-slate-600">
                {selectedRoute.startPoint || selectedRoute.startingPoint} → {selectedRoute.endPoint || selectedRoute.destination}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Morning Pickup Time</span>
                <p className="text-sm font-bold text-slate-900 dark:text-white">{selectedRoute.morningPickupTime || '07:30 AM'}</p>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Evening Drop Time</span>
                <p className="text-sm font-bold text-slate-900 dark:text-white">{selectedRoute.eveningDropTime || '05:00 PM'}</p>
              </div>
            </div>

            {selectedRoute.driverName && (
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Driver & Vehicle Coordinator</span>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{selectedRoute.driverName}</span>
                  {selectedRoute.driverPhone && (
                    <a
                      href={`tel:${selectedRoute.driverPhone}`}
                      className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 flex items-center gap-1 shadow-2xs"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{selectedRoute.driverPhone}</span>
                    </a>
                  )}
                </div>
              </div>
            )}

            {selectedRoute.viaStops && selectedRoute.viaStops.length > 0 && (
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Boarding Stops Sequence ({selectedRoute.viaStops.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedRoute.viaStops.map((stop, i) => (
                    <span key={i} className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-medium text-slate-800 dark:text-slate-200">
                      {i + 1}. {stop}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Route Number *</label>
                <input
                  type="text"
                  value={routeNumber}
                  onChange={(e) => setRouteNumber(e.target.value)}
                  placeholder="e.g. ROUTE 08"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm uppercase font-mono focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Route Name *</label>
                <input
                  type="text"
                  value={routeName}
                  onChange={(e) => setRouteName(e.target.value)}
                  placeholder="e.g. Anna Nagar Express"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Starting Point *</label>
                <input
                  type="text"
                  value={startPoint}
                  onChange={(e) => setStartPoint(e.target.value)}
                  placeholder="e.g. Tambaram Bus Stand"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Destination *</label>
                <input
                  type="text"
                  value={endPoint}
                  onChange={(e) => setEndPoint(e.target.value)}
                  placeholder="e.g. Main Campus"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Morning Departure Time</label>
                <input
                  type="text"
                  value={morningPickupTime}
                  onChange={(e) => setMorningPickupTime(e.target.value)}
                  placeholder="07:30 AM"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Evening Return Time</label>
                <input
                  type="text"
                  value={eveningDropTime}
                  onChange={(e) => setEveningDropTime(e.target.value)}
                  placeholder="05:00 PM"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Driver / Incharge Name</label>
                <input
                  type="text"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  placeholder="e.g. M. Murugan"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Driver Phone Contact</label>
                <input
                  type="tel"
                  value={driverPhone}
                  onChange={(e) => setDriverPhone(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Boarding Stops (Comma Separated)</label>
              <textarea
                rows={3}
                value={viaStopsInput}
                onChange={(e) => setViaStopsInput(e.target.value)}
                placeholder="Tambaram (07:15 AM), Chromepet (07:25 AM), Guindy (07:45 AM)..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
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
        title="Delete Transport Route"
        message={`This will permanently remove "${deleteTarget?.title}".`}
        confirmText="Delete Route"
        loading={actionLoading}
      />
    </div>
  );
};
