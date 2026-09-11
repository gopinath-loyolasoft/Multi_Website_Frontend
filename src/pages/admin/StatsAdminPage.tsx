import React, { useEffect, useState } from 'react';
import { 
  BarChart3, 
  Plus, 
  Trash2, 
  Edit, 
  Eye, 
  EyeOff, 
  Check, 
  X, 
  RefreshCw, 
  GraduationCap, 
  Users, 
  Award, 
  BookOpen, 
  Building2, 
  Trophy, 
  Briefcase, 
  FileCheck,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { apiClient } from '../../services/apiClient';
import { StatItem } from '../../types';
import { FormDrawer, ConfirmDialog } from '../../UI_Componentes/ui';

// Icon mapping helper for visual cards
const getStatIcon = (iconName?: string) => {
  switch ((iconName || '').toLowerCase()) {
    case 'users':
      return Users;
    case 'award':
      return Award;
    case 'bookopen':
      return BookOpen;
    case 'building2':
      return Building2;
    case 'trophy':
      return Trophy;
    case 'briefcase':
      return Briefcase;
    case 'filecheck':
      return FileCheck;
    case 'trendingup':
      return TrendingUp;
    case 'graduationcap':
    default:
      return GraduationCap;
  }
};

export const StatsAdminPage: React.FC = () => {
  const [stats, setStats] = useState<StatItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<StatItem | null>(null);

  // Drawer state for Add/Edit
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
  const [selectedStat, setSelectedStat] = useState<StatItem | null>(null);

  // Form Fields
  const [label, setLabel] = useState('');
  const [value, setValue] = useState('');
  const [prefix, setPrefix] = useState('');
  const [suffix, setSuffix] = useState('+');
  const [iconName, setIconName] = useState('GraduationCap');
  const [sortOrder, setSortOrder] = useState<number>(1);
  const [isActive, setIsActive] = useState(true);

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  };

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/admin/stats');
      if (res.data.success) {
        const rawList = res.data.data || [];
        const normalized: StatItem[] = rawList.map((st: any) => ({
          id: st.id,
          label: st.label || '',
          value: st.value !== undefined ? st.value : (st.metric || ''),
          prefix: st.prefix || '',
          suffix: st.suffix || '',
          iconName: st.iconName || st.icon || 'GraduationCap',
          sortOrder: st.sortOrder ?? 0,
          isActive: st.isActive !== false,
        }));
        setStats(normalized);
      }
    } catch (err) {
      console.error('Failed to load stats', err);
      showNotification('Failed to load stats items', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleOpenCreate = () => {
    setSelectedStat(null);
    setDrawerMode('create');
    setLabel('');
    setValue('');
    setPrefix('');
    setSuffix('+');
    setIconName('GraduationCap');
    setSortOrder(stats.length + 1);
    setIsActive(true);
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (stat: StatItem) => {
    setSelectedStat(stat);
    setDrawerMode('edit');
    setLabel(stat.label);
    setValue(stat.value || (stat as any).metric || '');
    setPrefix(stat.prefix || '');
    setSuffix(stat.suffix || '');
    setIconName(stat.iconName || (stat as any).icon || 'GraduationCap');
    setSortOrder(stat.sortOrder);
    setIsActive(stat.isActive);
    setIsDrawerOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim() || !value.trim()) {
      showNotification('Label and value are required', 'error');
      return;
    }

    const payload = {
      label: label.trim(),
      value: value.trim(),
      prefix: prefix.trim(),
      suffix: suffix.trim(),
      metric: `${prefix.trim()}${value.trim()}${suffix.trim()}`,
      iconName,
      icon: iconName,
      sortOrder: Number(sortOrder) || 1,
      isActive,
    };

    try {
      setActionLoading(true);
      if (drawerMode === 'edit' && selectedStat) {
        await apiClient.put(`/admin/stats/${selectedStat.id}`, payload);
        showNotification('Stat counter card updated');
      } else {
        await apiClient.post('/admin/stats', payload);
        showNotification('Stat counter card created');
      }
      setIsDrawerOpen(false);
      fetchStats();
    } catch {
      showNotification('Failed to save stat item', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const toggleStatStatus = async (stat: StatItem) => {
    try {
      setActionLoading(true);
      await apiClient.patch(`/admin/stats/${stat.id}/visibility`, {
        isActive: !stat.isActive,
        isVisible: !stat.isActive,
      });
      showNotification(`Stat card is now ${!stat.isActive ? 'Active' : 'Hidden'}`);
      fetchStats();
    } catch {
      showNotification('Failed to toggle stat visibility', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setActionLoading(true);
      await apiClient.delete(`/admin/stats/${deleteTarget.id}`);
      showNotification('Stat card deleted');
      setDeleteTarget(null);
      fetchStats();
    } catch {
      showNotification('Failed to delete stat item', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const activeStats = stats.filter((s) => s.isActive);

  const availableIcons = [
    { name: 'GraduationCap', label: 'Students / Graduation', icon: GraduationCap },
    { name: 'Users', label: 'Faculty / Community', icon: Users },
    { name: 'Award', label: 'Accreditation / Honors', icon: Award },
    { name: 'BookOpen', label: 'Research / Courses', icon: BookOpen },
    { name: 'Building2', label: 'Campuses / Facilities', icon: Building2 },
    { name: 'Trophy', label: 'Sports & Awards', icon: Trophy },
    { name: 'Briefcase', label: 'Placements & Jobs', icon: Briefcase },
    { name: 'FileCheck', label: 'Patents & Papers', icon: FileCheck },
    { name: 'TrendingUp', label: 'Growth / Success Rate', icon: TrendingUp },
  ];

  return (
    <div className="space-y-6 font-sans text-slate-900 dark:text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2.5">
            <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <span>Stats Counter Bar</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Display live achievements, student body size, placement rates, and faculty metrics across your homepage.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchStats}
            disabled={loading}
            className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 text-slate-600 dark:text-slate-400 rounded-lg text-xs font-semibold transition shadow-2xs cursor-pointer"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Notification Banner */}
      {message && (
        <div
          className={`p-3.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-all ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
              : 'bg-red-50 text-red-800 border border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === 'success' ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
            <span>{message.text}</span>
          </div>
          <button onClick={() => setMessage(null)} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Collapsible Visual Live Preview Monitor */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-md overflow-hidden">
        <div className="p-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 font-mono">
              Live Stats Counter Monitor ({activeStats.length} Active Cards)
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="text-xs font-semibold px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
          >
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </button>
        </div>

        {showPreview && (
          <div className="p-6 bg-slate-950/90">
            {activeStats.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-xs">
                No active stats cards to preview. Activate or add cards below to display them here.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {activeStats.map((st) => {
                  const Icon = getStatIcon(st.iconName);
                  return (
                    <div
                      key={st.id}
                      className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-lg hover:border-blue-500/50 transition-all flex items-center gap-4 group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-blue-600/10 text-blue-400 border border-blue-500/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-2xl font-black text-white tracking-tight flex items-baseline gap-0.5">
                          {st.prefix && <span className="text-blue-400 text-lg">{st.prefix}</span>}
                          <span>{st.value}</span>
                          {st.suffix && <span className="text-blue-400 text-lg">{st.suffix}</span>}
                        </div>
                        <div className="text-xs text-slate-400 font-medium truncate mt-0.5">
                          {st.label}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            <p className="text-[11px] text-slate-400 italic pt-3">
              * This visual bar renders automatically on your college home page with animated counters.
            </p>
          </div>
        )}
      </div>

      {/* Cards Table / Management Grid */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Configured Stat Metric Cards ({stats.length})
            </h2>
          </div>

          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs shadow-sm transition cursor-pointer self-end sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>New Counter Card</span>
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-500 font-semibold">
            Loading metric cards...
          </div>
        ) : stats.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <BarChart3 className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">No Stat Cards Configured</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Add your first counter card (e.g. 1,800+ Students, 98% Placement Rate) to build trust with visitors.
            </p>
            <button
              onClick={handleOpenCreate}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs shadow-xs transition"
            >
              Add First Stat Card
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Order</th>
                  <th className="py-3 px-4">Icon</th>
                  <th className="py-3 px-4">Metric Label</th>
                  <th className="py-3 px-4">Formatted Value</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {stats.map((st) => {
                  const Icon = getStatIcon(st.iconName);
                  return (
                    <tr key={st.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                      <td className="py-3 px-4 font-mono font-bold text-slate-500">{st.sortOrder}</td>
                      <td className="py-3 px-4">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 flex items-center justify-center">
                          <Icon className="w-4 h-4" />
                        </div>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">
                        {st.label}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-800 dark:text-slate-200">
                        {st.prefix}
                        {st.value}
                        {st.suffix}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => toggleStatStatus(st)}
                          disabled={actionLoading}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer transition ${
                            st.isActive
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300'
                              : 'bg-slate-100 text-slate-500 border border-slate-200 dark:bg-slate-800 dark:text-slate-400'
                          }`}
                        >
                          {st.isActive ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          <span>{st.isActive ? 'Active' : 'Hidden'}</span>
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(st)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-md transition"
                            title="Edit"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(st)}
                            className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-slate-800 rounded-md transition"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Drawer */}
      <FormDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={drawerMode === 'create' ? 'Add Counter Metric Card' : 'Edit Counter Metric Card'}
        subtitle="Configure the number, prefix/suffix and icon for this home page card"
        icon={<BarChart3 className="w-5 h-5 text-blue-600" />}
        mode={drawerMode}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Metric Label *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Graduated Students"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-hidden"
            />
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Prefix
              </label>
              <input
                type="text"
                placeholder="e.g. $"
                value={prefix}
                onChange={(e) => setPrefix(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Value *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 1,800"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Suffix
              </label>
              <input
                type="text"
                placeholder="e.g. +"
                value={suffix}
                onChange={(e) => setSuffix(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
            </div>
          </div>

          {/* Icon Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Card Icon
            </label>
            <div className="grid grid-cols-3 gap-2">
              {availableIcons.map((item) => {
                const ItemIcon = item.icon;
                const isSelected = iconName === item.name;
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setIconName(item.name)}
                    className={`p-2.5 rounded-lg border flex flex-col items-center gap-1.5 text-center transition cursor-pointer ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    <ItemIcon className="w-5 h-5" />
                    <span className="text-[10px] truncate max-w-full">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Sort Display Order
              </label>
              <input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
            </div>
            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-0 w-4 h-4"
                />
                <span>Card is Active</span>
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsDrawerOpen(false)}
              className="px-4 py-2 text-xs font-semibold border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition shadow-xs disabled:opacity-50"
            >
              {actionLoading ? 'Saving...' : 'Save Stat Card'}
            </button>
          </div>
        </form>
      </FormDrawer>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Stat Card?"
        message={`Are you sure you want to delete "${deleteTarget?.label}"? This will remove it from the homepage counters.`}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
};
