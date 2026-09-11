import React, { useEffect, useState } from 'react';
import {
  Bell,
  Plus,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  Search,
  Check,
  X,
  Calendar,
  Clock,
  RefreshCw,
  AlertTriangle,
  Download,
  FileText,
  LayoutGrid,
  List,
  Copy,
  Lock,
  Unlock,
  RotateCcw,
} from 'lucide-react';
import { apiClient } from '../../services/apiClient';
import { NoticeItem } from '../../types';
import { FormDrawer, DrawerMode, FileUploadInput, ConfirmDialog, Input, Select, Switch } from '../../UI_Componentes/ui';
import { slugify, copyToClipboard } from '../../utils/helpers';

const CATEGORY_OPTIONS = [
  { value: 'GENERAL', label: 'General' },
  { value: 'ACADEMIC', label: 'Academic' },
  { value: 'EXAMINATION', label: 'Examination' },
  { value: 'ADMISSION', label: 'Admission' },
  { value: 'EVENT', label: 'Event' },
  { value: 'OTHER', label: 'Other' },
];

export const NoticesAdminPage: React.FC = () => {
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'card' | 'list'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PUBLISHED' | 'DRAFT'>('ALL');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string | number; title: string } | null>(null);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<DrawerMode>('create');
  const [selectedNotice, setSelectedNotice] = useState<NoticeItem | null>(null);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('GENERAL');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [publishDate, setPublishDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [isImportant, setIsImportant] = useState(false);

  const [showMonitor, setShowMonitor] = useState(true);
  const [autoSlug, setAutoSlug] = useState(true);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'No date';
    try {
      const d = new Date(dateStr);
      return isNaN(d.getTime()) ? 'No date' : d.toLocaleDateString();
    } catch {
      return 'No date';
    }
  };

  const toDateInputString = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return isNaN(d.getTime()) ? '' : d.toISOString().split('T')[0];
    } catch {
      return '';
    }
  };

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  };

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/admin/notices');
      if (res.data.success) {
        setNotices(res.data.data?.items || res.data.data || []);
      }
    } catch (err) {
      console.error(err);
      showNotification('Failed to load notices', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleOpenCreate = () => {
    setSelectedNotice(null);
    setDrawerMode('create');
    setTitle('');
    setSlug('');
    setAutoSlug(true);
    setCategory('GENERAL');
    setSummary('');
    setContent('');
    setPdfUrl('');
    setPublishDate(new Date().toISOString().split('T')[0]);
    setExpiryDate('');
    setIsImportant(false);
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (n: NoticeItem) => {
    setSelectedNotice(n);
    setDrawerMode('edit');
    setTitle(n.title);
    setSlug(n.slug);
    setAutoSlug(false);
    setCategory(n.category || 'GENERAL');
    setSummary(n.summary || '');
    setContent(n.content || '');
    setPdfUrl(n.pdfUrl || '');
    setPublishDate(toDateInputString(n.publishDate));
    setExpiryDate(toDateInputString(n.expiryDate));
    setIsImportant(n.isImportant || false);
    setIsDrawerOpen(true);
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (drawerMode === 'create' || autoSlug) {
      setSlug(slugify(val));
    }
  };

  const handleOpenView = (n: NoticeItem) => {
    setSelectedNotice(n);
    setDrawerMode('view');
    setTitle(n.title);
    setSlug(n.slug);
    setCategory(n.category || 'GENERAL');
    setSummary(n.summary || '');
    setContent(n.content || '');
    setPdfUrl(n.pdfUrl || '');
    setPublishDate(toDateInputString(n.publishDate));
    setExpiryDate(toDateInputString(n.expiryDate));
    setIsImportant(n.isImportant || false);
    setIsDrawerOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      const payload = {
        title,
        slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category,
        summary,
        content,
        pdfUrl: pdfUrl || undefined,
        publishDate: publishDate || new Date().toISOString(),
        expiryDate: expiryDate || undefined,
        isImportant,
      };

      if (drawerMode === 'edit' && selectedNotice) {
        await apiClient.put(`/admin/notices/${selectedNotice.id}`, payload);
        showNotification('Notice updated successfully');
      } else {
        await apiClient.post('/admin/notices', payload);
        showNotification('Notice created as draft');
      }
      setIsDrawerOpen(false);
      fetchNotices();
    } catch {
      showNotification('Failed to save notice', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const toggleStatus = async (n: NoticeItem) => {
    const nextStatus = !n.isPublished;
    try {
      setActionLoading(true);
      if (nextStatus) {
        await apiClient.post(`/admin/notices/${n.id}/publish`);
      } else {
        await apiClient.post(`/admin/notices/${n.id}/unpublish`);
      }
      showNotification(`"${n.title}" is now ${nextStatus ? 'PUBLISHED' : 'DRAFT'}`);
      fetchNotices();
    } catch {
      showNotification('Failed to update notice status', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setActionLoading(true);
      await apiClient.delete(`/admin/notices/${deleteTarget.id}`);
      showNotification('Notice deleted');
      setDeleteTarget(null);
      fetchNotices();
    } catch {
      showNotification('Failed to delete notice', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredNotices = notices.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (n.summary && n.summary.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = categoryFilter === 'ALL' || n.category === categoryFilter;
    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'PUBLISHED' && n.isPublished !== false) ||
      (statusFilter === 'DRAFT' && n.isPublished === false);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const publishedNotices = notices.filter((n) => n.isPublished !== false);
  const importantNotices = notices.filter((n) => n.isImportant);

  return (
    <div className="space-y-6 font-sans text-slate-900 dark:text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Bell className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <span>Notices & Circulars Management</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Publish official circulars, examination schedules, admission updates, and institutional directives.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchNotices}
            disabled={loading}
            className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-semibold transition shadow-sm cursor-pointer"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Notification */}
      {message && (
        <div
          className={`p-3.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-all ${
            message.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900'
              : 'bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-900'
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === 'success' ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
            <span>{message.text}</span>
          </div>
          <button onClick={() => setMessage(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Live Notices Monitor (LIGHT MODE) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 flex items-center justify-between border-b border-slate-100 bg-slate-50/75">
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${publishedNotices.length > 0 ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`} />
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 font-mono">
              Live Notices Monitor (Light Mode)
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-semibold text-slate-500">
              {publishedNotices.length} Published · {notices.length - publishedNotices.length} Draft · {importantNotices.length} Important
            </span>
            <button
              type="button"
              onClick={() => setShowMonitor(!showMonitor)}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs transition cursor-pointer"
            >
              {showMonitor ? 'Hide Preview' : 'Show Preview'}
            </button>
          </div>
        </div>
        {showMonitor && (
          <div className="p-5 bg-slate-50/50">
            {loading ? (
              <div className="text-center text-slate-500 text-xs py-4">Loading notices data...</div>
            ) : notices.length === 0 ? (
              <div className="text-center text-slate-500 text-xs py-8 space-y-1">
                <Bell className="w-8 h-8 text-slate-400 mx-auto" />
                <p>No notices yet. Create your first notice to see it here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {notices.slice(0, 3).map((n) => {
                  const isPub = n.isPublished !== false;
                  return (
                    <div
                      key={n.id}
                      className={`rounded-xl p-3.5 space-y-2 border transition ${
                        isPub
                          ? 'bg-white border-slate-200 shadow-2xs'
                          : 'bg-slate-100/70 border-dashed border-slate-300 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                              isPub
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-slate-100 text-slate-600 border-slate-200'
                            }`}
                          >
                            {isPub ? 'Published' : 'Draft'}
                          </span>
                          {n.isImportant && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-red-100 text-red-700 border border-red-200">
                              Important
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                          <Clock className="w-3 h-3" />
                          <span>{formatDate(n.publishDate)}</span>
                        </div>
                      </div>
                      <p className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">{n.title}</p>
                      {n.summary && (
                        <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{n.summary}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            <p className="text-[11px] text-slate-400 italic text-center pt-4">
              * Renders dynamically on your campus notices feed. Showing latest {Math.min(notices.length, 3)} of {notices.length} notices.
            </p>
          </div>
        )}
      </div>

      {/* Search & Filters & View Switcher & Post Notice */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notices by title or keyword..."
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-sm"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm cursor-pointer"
          >
            <option value="ALL">All Categories</option>
            {CATEGORY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="PUBLISHED">Published Only</option>
            <option value="DRAFT">Draft Only</option>
          </select>
        </div>

        <div className="flex items-center gap-2.5 self-end sm:self-auto">
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
            <button
              type="button"
              onClick={() => setViewMode('card')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                viewMode === 'card'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
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
                viewMode === 'list'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
              title="Table / List View"
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">List</span>
            </button>
          </div>

          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs shadow-sm transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Post Notice</span>
          </button>
        </div>
      </div>

      {/* Notices Data View */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 dark:text-slate-400 font-semibold bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          Loading notices...
        </div>
      ) : filteredNotices.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <Bell className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">No Notices Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Publish official circulars and announcements to display on the campus notices feed.
          </p>
        </div>
      ) : viewMode === 'list' ? (
        /* TABLE / LIST VIEW */
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4">Title & Details</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Publish Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {filteredNotices.map((n) => {
                  const isPub = n.isPublished !== false;
                  return (
                    <tr key={n.id} className="hover:bg-slate-50/75 dark:hover:bg-slate-800/40 transition">
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            {n.isImportant && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900">
                                <AlertTriangle className="w-2.5 h-2.5" />
                                Important
                              </span>
                            )}
                            <span className="font-bold text-slate-900 dark:text-white text-xs">{n.title}</span>
                          </div>
                          {n.slug && (
                            <div className="inline-flex items-center gap-1 bg-slate-50 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                              <span className="font-mono text-[10px] text-blue-600 dark:text-blue-400 font-medium">/notices/{n.slug}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  copyToClipboard(`/notices/${n.slug}`);
                                  showNotification(`Copied "/notices/${n.slug}" to clipboard!`);
                                }}
                                className="text-slate-400 hover:text-blue-600 transition cursor-pointer"
                                title="Copy URL"
                              >
                                <Copy className="w-2.5 h-2.5" />
                              </button>
                            </div>
                          )}
                          {n.summary && (
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 max-w-md">{n.summary}</p>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                          {n.category || 'GENERAL'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>{formatDate(n.publishDate)}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => toggleStatus(n)}
                          disabled={actionLoading}
                          title={isPub ? 'Click to Unpublish (Draft)' : 'Click to Publish'}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold transition cursor-pointer ${
                            isPub
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 border border-emerald-100'
                              : 'bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-400 hover:bg-red-100 border border-red-100'
                          }`}
                        >
                          {isPub ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          <span>{isPub ? 'Published' : 'Draft'}</span>
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenView(n)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition cursor-pointer"
                            title="View Notice"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(n)}
                            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition cursor-pointer"
                            title="Edit Notice"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget({ id: n.id, title: n.title })}
                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition cursor-pointer"
                            title="Delete Notice"
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
        /* CARD GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredNotices.map((n) => {
            const isPub = n.isPublished !== false;
            return (
              <div
                key={n.id}
                className={`bg-white dark:bg-slate-900 rounded-xl border p-5 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition ${
                  isPub ? 'border-slate-200 dark:border-slate-800' : 'border-dashed border-red-200 dark:border-red-900 bg-red-50/10 dark:bg-red-950/10 opacity-75'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {n.isImportant && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900">
                          <AlertTriangle className="w-3 h-3" />
                          Important
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                        {n.category || 'GENERAL'}
                      </span>
                    </div>
                    <button
                      onClick={() => toggleStatus(n)}
                      disabled={actionLoading}
                      title={isPub ? 'Click to Unpublish (Draft)' : 'Click to Publish'}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold transition cursor-pointer ${
                        isPub
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 border border-emerald-100 dark:border-emerald-900'
                          : 'bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 border border-red-100 dark:border-red-900'
                      }`}
                    >
                      {isPub ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      <span>{isPub ? 'Published' : 'Draft'}</span>
                    </button>
                  </div>

                  <h3 className={`font-bold text-base leading-snug ${isPub ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500 line-through'}`}>
                    {n.title}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {n.summary || 'No summary provided.'}
                  </p>

                  <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(n.publishDate)}
                    </span>
                    {n.expiryDate && (
                      <span className="flex items-center gap-1 text-amber-500">
                        <Clock className="w-3 h-3" />
                        Expires {formatDate(n.expiryDate)}
                      </span>
                    )}
                    {n.pdfUrl && (
                      <span className="flex items-center gap-1 text-blue-500">
                        <FileText className="w-3 h-3" />
                        PDF attached
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  {n.slug ? (
                    <button
                      type="button"
                      onClick={() => {
                        copyToClipboard(`/notices/${n.slug}`);
                        showNotification(`Copied "/notices/${n.slug}" to clipboard!`);
                      }}
                      className="inline-flex items-center gap-1 text-[11px] font-mono text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded border border-blue-100 dark:border-blue-900/50 hover:underline transition cursor-pointer"
                      title="Copy Public URL"
                    >
                      <Copy className="w-3 h-3" />
                      <span>/notices/{n.slug}</span>
                    </button>
                  ) : <span />}

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenView(n)}
                      className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition cursor-pointer"
                      title="View Notice"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleOpenEdit(n)}
                      className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition cursor-pointer"
                      title="Edit Notice"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget({ id: n.id, title: n.title })}
                      className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition cursor-pointer"
                      title="Delete Notice"
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

      {/* FormDrawer */}
      <FormDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={
          drawerMode === 'create'
            ? 'Post Official Notice'
            : drawerMode === 'edit'
            ? 'Edit Notice'
            : selectedNotice?.title || 'Notice Details'
        }
        subtitle={
          drawerMode === 'create'
            ? 'Create a new official circular or announcement'
            : drawerMode === 'edit'
            ? 'Update notice details, category, or content'
            : 'Read notice preview and details'
        }
        icon={<Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
        mode={drawerMode}
        onSubmit={handleSave}
        onEditClick={() => setDrawerMode('edit')}
        loading={actionLoading}
        size="lg"
      >
        {drawerMode === 'view' && selectedNotice ? (
          <div className="space-y-6">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status</span>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                    selectedNotice.isPublished !== false
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400'
                      : 'bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-400'
                  }`}
                >
                  {selectedNotice.isPublished !== false ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  {selectedNotice.isPublished !== false ? 'Published' : 'Draft'}
                </span>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Title</span>
                <p className="text-xl font-black text-slate-900 dark:text-white">{selectedNotice.title}</p>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span className="font-mono bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded">/{selectedNotice.slug}</span>
                <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-bold uppercase tracking-wider">
                  {selectedNotice.category}
                </span>
                {selectedNotice.isImportant && (
                  <span className="px-2 py-0.5 rounded bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400 font-bold uppercase tracking-wider">
                    Important
                  </span>
                )}
              </div>
            </div>

            {selectedNotice.summary && (
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Summary</span>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 italic bg-primary/5 p-4 rounded-2xl border border-primary/10">
                  {selectedNotice.summary}
                </p>
              </div>
            )}

            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Full Content</span>
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                {selectedNotice.content || 'No content.'}
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-500">
              {selectedNotice.publishDate && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Published: {new Date(selectedNotice.publishDate).toLocaleDateString()}
                </span>
              )}
              {selectedNotice.expiryDate && (
                <span className="flex items-center gap-1 text-amber-500">
                  <Clock className="w-3.5 h-3.5" />
                  Expires: {new Date(selectedNotice.expiryDate).toLocaleDateString()}
                </span>
              )}
            </div>

            {selectedNotice.pdfUrl && (
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Attached PDF</span>
                <a
                  href={selectedNotice.pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-xl text-xs font-bold text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF Attachment</span>
                </a>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <Input
              label="Notice Title"
              required
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. Examination Schedule - September 2026"
            />

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  URL Slug <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setAutoSlug(!autoSlug)}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 transition cursor-pointer ${
                      autoSlug
                        ? 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/60 dark:text-blue-300'
                        : 'bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                    title={autoSlug ? 'Auto-Sync is ON: typing title updates slug' : 'Auto-Sync is OFF: custom edit'}
                  >
                    {autoSlug ? <Lock className="w-2.5 h-2.5" /> : <Unlock className="w-2.5 h-2.5" />}
                    <span>{autoSlug ? 'Auto-Sync' : 'Custom'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSlug(slugify(title))}
                    className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200 dark:bg-slate-800 dark:text-slate-400 flex items-center gap-1 transition cursor-pointer"
                    title="Regenerate slug from current title"
                  >
                    <RotateCcw className="w-2.5 h-2.5" />
                    <span>Sync</span>
                  </button>
                </div>
              </div>
              <Input
                value={slug}
                onChange={(e) => {
                  setAutoSlug(false);
                  setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                }}
                placeholder="e.g. exam-schedule-september-2026"
                helperText="Used in the public URL: /notices/exam-schedule-september-2026"
              />
            </div>

            <Select
              label="Category"
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              options={CATEGORY_OPTIONS}
            />

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                Summary <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Brief description displayed in the notices list..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                Full Content <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={8}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Detailed notice content, instructions, policies..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-sm"
                required
              />
            </div>

            <FileUploadInput
              label="PDF ATTACHMENT"
              value={pdfUrl}
              onChange={setPdfUrl}
              accept=".pdf"
              placeholder="Upload a PDF file or enter URL"
              helpText="Optional. Attach an official PDF document for download."
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                  Publish Date
                </label>
                <input
                  type="date"
                  value={publishDate}
                  onChange={(e) => setPublishDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                  Expiry Date (optional)
                </label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-sm"
                />
              </div>
            </div>

            <Switch
              checked={isImportant}
              onChange={setIsImportant}
              label="Mark as Important"
              description="Shows a red 'Important' badge on the website notices feed"
            />
          </div>
        )}
      </FormDrawer>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Notice"
        message={`This permanently deletes "${deleteTarget?.title}". This action cannot be undone.`}
        confirmText="Delete"
        loading={actionLoading}
      />
    </div>
  );
};
