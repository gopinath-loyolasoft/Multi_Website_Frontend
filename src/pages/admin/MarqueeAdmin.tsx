import React, { useEffect, useState } from 'react';
import {
  Volume2,
  Plus,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Check,
  X,
  ExternalLink,
  Save,

  Globe,
  Sliders,
  Palette,
  Calendar,
  Clock,
  RefreshCw
} from 'lucide-react';
import { apiClient } from '../../services/apiClient';
import { MarqueeItem, MarqueeSettings, MarqueeData } from '../../types';
import { MarqueeBar } from '../../components/common/MarqueeBar';
import { FormDrawer, ConfirmDialog } from '../../UI_Componentes/ui';

export const MarqueeAdminPage: React.FC = () => {
  const [settings, setSettings] = useState<MarqueeSettings>({
    isActive: true,
    speed: 'medium',
    pauseOnHover: true,
    bgColor: '#0f172a',
    textColor: '#f8fafc',
    badgeBgColor: '#f59e0b',
  });

  const [items, setItems] = useState<MarqueeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MarqueeItem | null>(null);

  // Modal State for Item Create / Edit
  const [showItemModal, setShowItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MarqueeItem | null>(null);
  const [badgeText, setBadgeText] = useState('ANNOUNCEMENT');
  const [messageText, setMessageText] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Preset Color Palettes
  const colorThemes = [
    { name: 'Navy & Gold', bg: '#0f172a', text: '#f8fafc', badge: '#f59e0b' },
    { name: 'Royal Crimson', bg: '#881337', text: '#fff1f2', badge: '#fbbf24' },
    { name: 'Forest Emerald', bg: '#064e3b', text: '#ecfdf5', badge: '#34d399' },
    { name: 'Classic Blue', bg: '#1e3a8a', text: '#eff6ff', badge: '#60a5fa' },
    { name: 'Midnight Charcoal', bg: '#18181b', text: '#fafafa', badge: '#e11d48' },
    { name: 'Imperial Purple', bg: '#4c1d95', text: '#f5f3ff', badge: '#c084fc' },
  ];

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  };

  const fetchMarqueeData = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/admin/marquee');
      if (res.data.success && res.data.data) {
        const data: MarqueeData = res.data.data;
        if (data.settings) {
          setSettings(data.settings);
        }
        if (data.items) {
          setItems(data.items);
        }
      }
    } catch (err) {
      console.error('Failed to load marquee data', err);
      showNotification('Failed to load marquee settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarqueeData();
  }, []);

  // Save Bar Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingSettings(true);
      const res = await apiClient.put('/admin/marquee/settings', {
        isActive: settings.isActive,
        speed: settings.speed,
        pauseOnHover: settings.pauseOnHover,
        bgColor: settings.bgColor,
        textColor: settings.textColor,
        badgeBgColor: settings.badgeBgColor,
      });
      if (res.data.success) {
        showNotification('Marquee bar settings published successfully!');
      }
    } catch {
      showNotification('Failed to update marquee settings', 'error');
    } finally {
      setSavingSettings(false);
    }
  };

  // Toggle Announcement Status (Active / Inactive)
  const toggleItemStatus = async (item: MarqueeItem) => {
    const nextStatus = !item.isActive;
    try {
      setActionLoading(true);
      const res = await apiClient.patch(`/admin/marquee/items/${item.id}/status`, {
        isActive: nextStatus,
      });
      if (res.data.success) {
        showNotification(
          `Announcement is now ${nextStatus ? 'ACTIVE (Visible in marquee)' : 'INACTIVE (Hidden from marquee)'}`
        );
        fetchMarqueeData();
      }
    } catch {
      showNotification('Failed to update announcement status', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Announcement
  const handleDeleteItem = async () => {
    if (!deleteTarget) return;
    try {
      setActionLoading(true);
      await apiClient.delete(`/admin/marquee/items/${deleteTarget.id}`);
      showNotification('Announcement deleted');
      setDeleteTarget(null);
      fetchMarqueeData();
    } catch {
      showNotification('Failed to delete announcement', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Modal Openers
  const handleOpenCreateModal = () => {
    setEditingItem(null);
    setBadgeText('NEW');
    setMessageText('');
    setLinkUrl('');
    setStartDate('');
    setEndDate('');
    setShowItemModal(true);
  };

  // Helper to format ISO date string for datetime-local input using local timezone
  const formatForDateTimeInput = (dateStr?: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '';
    const pad = (n: number) => (n < 10 ? '0' + n : String(n));
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const handleOpenEditModal = (item: MarqueeItem) => {
    setEditingItem(item);
    setBadgeText(item.badgeText || '');
    setMessageText(item.message);
    setLinkUrl(item.linkUrl || '');
    setStartDate(formatForDateTimeInput(item.startDate));
    setEndDate(formatForDateTimeInput(item.endDate));
    setShowItemModal(true);
  };

  // Save Announcement
  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) {
      showNotification('Announcement message is required', 'error');
      return;
    }

    const payload = {
      badgeText,
      message: messageText,
      linkUrl,
      startDate: startDate ? new Date(startDate).toISOString() : null,
      endDate: endDate ? new Date(endDate).toISOString() : null,
      sortOrder: editingItem ? editingItem.sortOrder : items.length + 1,
      isActive: editingItem ? editingItem.isActive : true,
    };

    try {
      setActionLoading(true);
      if (editingItem) {
        await apiClient.put(`/admin/marquee/items/${editingItem.id}`, payload);
        showNotification('Announcement updated');
      } else {
        await apiClient.post('/admin/marquee/items', payload);
        showNotification('Announcement created');
      }
      setShowItemModal(false);
      fetchMarqueeData();
    } catch {
      showNotification('Failed to save announcement', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Move Announcement Up/Down
  const handleMoveOrder = async (item: MarqueeItem, direction: 'up' | 'down') => {
    const currentIndex = items.findIndex((i) => String(i.id) === String(item.id));
    if (currentIndex === -1) return;

    if (direction === 'up' && currentIndex === 0) return;
    if (direction === 'down' && currentIndex === items.length - 1) return;

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const targetItem = items[targetIndex];

    const updated = [...items];
    updated[currentIndex] = targetItem;
    updated[targetIndex] = item;

    const itemIds = updated.map((i) => String(i.id));
    try {
      setActionLoading(true);
      await apiClient.put('/admin/marquee/items/reorder', { itemIds });
      fetchMarqueeData();
    } catch {
      showNotification('Failed to reorder items', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Currently live items (excluding scheduled future or expired items)
  const now = new Date();
  const currentlyLiveItems = items.filter((i) => {
    if (!i.isActive) return false;
    if (i.startDate && new Date(i.startDate) > now) return false;
    if (i.endDate && new Date(i.endDate) < now) return false;
    return true;
  });

  // Active items for live preview
  const livePreviewData: MarqueeData = {
    settings,
    items: currentlyLiveItems,
  };

  return (
    <div className="space-y-6 font-sans text-slate-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Volume2 className="w-6 h-6 text-blue-600" />
            <span>Marquee Announcement Bar</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Display urgent college notifications, admission alerts, and news bulletins across the very top of the website.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchMarqueeData}
            disabled={loading}
            className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-xs font-semibold transition shadow-2xs cursor-pointer"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleOpenCreateModal}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs shadow-xs transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Announcement</span>
          </button>
        </div>
      </div>

      {/* Notification banner */}
      {message && (
        <div
          className={`p-3.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-all ${message.type === 'success'
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            : 'bg-red-50 text-red-800 border border-red-200'
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

      {/* LIVE PREVIEW BOX (LIGHT MODE) */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="p-4 flex items-center justify-between border-b border-slate-100 bg-slate-50/75">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 font-mono">
              Live Preview Monitor ({currentlyLiveItems.length} Active Bulletins)
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">
              Status: {settings.isActive ? '🟢 Active & Ticking' : '🔴 Inactive (Bar hidden)'}
            </span>
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs transition cursor-pointer"
            >
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </button>
          </div>
        </div>

        {showPreview && (
          <div className="p-5 bg-slate-50/50 space-y-3">
            {/* Embedded Marquee Component running live */}
            <div className="rounded-lg overflow-hidden border border-slate-200 shadow-2xs bg-white">
              <MarqueeBar marquee={livePreviewData} isPreview={true} />
            </div>

            <p className="text-[11px] text-slate-400 italic">
              * This live preview renders dynamically as you configure speed, colors, and announcements below.
            </p>
          </div>
        )}
      </div>

      {/* Grid: Settings on Left, Announcements on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Bar Settings */}
        <div className="lg:col-span-5 bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Sliders className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900">Marquee Bar Appearance</h2>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-4">
            {/* Master Toggle */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div>
                <label className="text-xs font-bold text-slate-900 dark:text-white block">
                  Enable Marquee Bar
                </label>
                <p className="text-[11px] text-slate-500">Show or hide the announcement bar globally</p>
              </div>
              <button
                type="button"
                onClick={() => setSettings((s) => ({ ...s, isActive: !s.isActive }))}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${settings.isActive ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${settings.isActive ? 'translate-x-5' : 'translate-x-0'
                    }`}
                />
              </button>
            </div>

            {/* Speed Selector */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1.5">
                Scroll Speed
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { key: 'slow', label: 'Slow (35s)' },
                  { key: 'medium', label: 'Medium (22s)' },
                  { key: 'fast', label: 'Fast (14s)' },
                ].map((sp) => (
                  <button
                    type="button"
                    key={sp.key}
                    onClick={() => setSettings((s) => ({ ...s, speed: sp.key }))}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition border ${settings.speed === sp.key
                      ? 'bg-primary text-white border-primary shadow-sm'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                      }`}
                  >
                    {sp.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Pause on Hover */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="pauseHover"
                checked={settings.pauseOnHover}
                onChange={(e) => setSettings((s) => ({ ...s, pauseOnHover: e.target.checked }))}
                className="w-4 h-4 rounded text-primary focus:ring-primary border-slate-300"
              />
              <label htmlFor="pauseHover" className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                Pause scrolling animation on mouse hover
              </label>
            </div>

            {/* Color Palettes */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-primary" />
                <label className="text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
                  Quick College Color Presets
                </label>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {colorThemes.map((pal) => (
                  <button
                    type="button"
                    key={pal.name}
                    onClick={() =>
                      setSettings((s) => ({
                        ...s,
                        bgColor: pal.bg,
                        textColor: pal.text,
                        badgeBgColor: pal.badge,
                      }))
                    }
                    className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-primary transition text-left"
                  >
                    <div className="w-5 h-5 rounded-lg shrink-0 border border-black/20" style={{ backgroundColor: pal.bg }} />
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate">{pal.name}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Hex Pickers */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Bar Background</label>
                <input
                  type="color"
                  value={settings.bgColor}
                  onChange={(e) => setSettings((s) => ({ ...s, bgColor: e.target.value }))}
                  className="w-full h-9 rounded-xl border border-slate-300 cursor-pointer p-0.5"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Text Color</label>
                <input
                  type="color"
                  value={settings.textColor}
                  onChange={(e) => setSettings((s) => ({ ...s, textColor: e.target.value }))}
                  className="w-full h-9 rounded-xl border border-slate-300 cursor-pointer p-0.5"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Badge Background</label>
                <input
                  type="color"
                  value={settings.badgeBgColor}
                  onChange={(e) => setSettings((s) => ({ ...s, badgeBgColor: e.target.value }))}
                  className="w-full h-9 rounded-xl border border-slate-300 cursor-pointer p-0.5"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={savingSettings}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white bg-primary hover:opacity-90 transition shadow-sm text-xs mt-2"
            >
              <Save className="w-4 h-4" />
              <span>{savingSettings ? 'Saving Settings...' : 'Publish Marquee Bar Settings'}</span>
            </button>
          </form>
        </div>

        {/* Right Column: Announcements List */}
        <div className="lg:col-span-7 bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Announcements Ticker Items ({items.length})
              </h2>
              <p className="text-xs text-slate-400">Manage, reorder, or pause individual news items</p>
            </div>
            <button
              onClick={handleOpenCreateModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold text-xs text-white bg-blue-600 hover:bg-blue-700 transition shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>

          {loading ? (
            <div className="p-8 text-center text-slate-400 font-semibold">Loading announcements...</div>
          ) : items.length === 0 ? (
            <div className="p-8 text-center text-slate-400 space-y-3">
              <p className="font-semibold text-sm text-slate-600">No announcements added yet.</p>
              <button
                onClick={handleOpenCreateModal}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add First Announcement</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item, idx) => {
                const now = new Date();
                const isExpired = item.endDate && new Date(item.endDate) < now;
                const isUpcoming = item.startDate && new Date(item.startDate) > now;
                const isLive = item.isActive && !isExpired && !isUpcoming;

                return (
                  <div
                    key={item.id}
                    className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-4 hover:shadow-xs ${isLive
                      ? 'bg-white border-slate-200 shadow-2xs'
                      : isExpired
                        ? 'bg-rose-50/40 border-rose-200 opacity-80'
                        : isUpcoming
                          ? 'bg-amber-50/40 border-amber-200'
                          : 'bg-slate-50 border-dashed border-slate-200 opacity-60'
                      }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Reorder buttons */}
                      <div className="flex flex-col">
                        <button
                          disabled={idx === 0 || actionLoading}
                          onClick={() => handleMoveOrder(item, 'up')}
                          className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          disabled={idx === items.length - 1 || actionLoading}
                          onClick={() => handleMoveOrder(item, 'down')}
                          className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          {item.badgeText && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900">
                              {item.badgeText}
                            </span>
                          )}
                          <h4 className={`text-xs font-bold truncate ${item.isActive && !isExpired ? 'text-slate-900 dark:text-white' : 'text-slate-500 line-through'}`}>
                            {item.message}
                          </h4>
                        </div>

                        <div className="flex items-center gap-3 text-[11px] text-slate-500 flex-wrap">
                          {item.linkUrl && (
                            <span className="font-mono truncate flex items-center gap-1">
                              <ExternalLink className="w-2.5 h-2.5" /> Link: {item.linkUrl}
                            </span>
                          )}
                          {(item.startDate || item.endDate) && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                              <Clock className="w-3 h-3 text-slate-400" />
                              <span>
                                {item.startDate ? new Date(item.startDate).toLocaleDateString() : 'Immediate'}
                                {' → '}
                                {item.endDate ? new Date(item.endDate).toLocaleDateString() : 'No Expiry'}
                              </span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {/* Schedule Status Badge */}
                      {isExpired ? (
                        <span className="px-2.5 py-1 rounded-xl text-[11px] font-extrabold bg-rose-100 text-rose-800 border border-rose-200">
                          Expired (Stopped)
                        </span>
                      ) : isUpcoming ? (
                        <span className="px-2.5 py-1 rounded-xl text-[11px] font-extrabold bg-amber-100 text-amber-800 border border-amber-200">
                          Scheduled
                        </span>
                      ) : (
                        <button
                          onClick={() => toggleItemStatus(item)}
                          disabled={actionLoading}
                          title={item.isActive ? 'Make Inactive' : 'Make Active'}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold transition ${item.isActive
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                        >
                          {item.isActive ? <Eye className="w-3 h-3 text-emerald-600" /> : <EyeOff className="w-3 h-3" />}
                          <span>{item.isActive ? 'Active' : 'Inactive'}</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleOpenEditModal(item)}
                        className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 transition"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setDeleteTarget(item)}
                        className="p-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* FormDrawer for Creating / Editing Announcement */}
      <FormDrawer
        isOpen={showItemModal}
        onClose={() => setShowItemModal(false)}
        title={editingItem ? 'Edit Announcement' : 'Add Announcement Item'}
        subtitle={editingItem ? 'Update announcement ticker message or date schedule' : 'Add new notification to top rolling ticker'}
        icon={<Volume2 className="w-5 h-5 text-primary" />}
        mode={editingItem ? 'edit' : 'create'}
        onSubmit={handleSaveItem}
        loading={actionLoading}
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
              Urgency Badge Tag (Optional)
            </label>
            <input
              type="text"
              value={badgeText}
              onChange={(e) => setBadgeText(e.target.value)}
              placeholder="e.g. NEW, ADMISSIONS 2026, URGENT, EXAM NOTICE"
              className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-xs font-bold uppercase"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
              Announcement Message *
            </label>
            <textarea
              rows={4}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="e.g. Applications are now open for the Academic Year 2026-27! Apply online today."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
              Destination Link URL (Optional)
            </label>
            <input
              type="text"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="e.g. /admissions, /news, https://external.edu"
              className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-xs font-mono"
            />
          </div>

          {/* Scheduled Date Range Picker (From / To Dates) */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-700 space-y-3">
            <h4 className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              <span>Schedule Display Validity (Optional Date Range)</span>
            </h4>
            <p className="text-[11px] text-slate-500">
              Set start & end dates. The marquee item automatically stops appearing when the end date passes.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  From Date (Starts Appearing)
                </label>
                <input
                  type="datetime-local"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  To Date (Auto-Expires & Stops)
                </label>
                <input
                  type="datetime-local"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-xs"
                />
              </div>
            </div>
          </div>
        </div>
      </FormDrawer>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteItem}
        title="Delete Announcement"
        message={`This permanently deletes "${deleteTarget?.message}". This action cannot be undone.`}
        confirmText="Delete"
        loading={actionLoading}
      />
    </div>
  );
};
