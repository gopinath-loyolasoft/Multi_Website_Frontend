import React, { useEffect, useState } from 'react';
import { 
  Newspaper, 
  CalendarDays, 
  Plus, 
  Trash2, 
  Edit, 
  Eye, 
  EyeOff, 
  Search, 
  Check, 
  X, 
  Calendar, 
  MapPin, 
  RefreshCw,
  LayoutGrid,
  List,
  Copy,
  Lock,
  Unlock,
  RotateCcw,
  Clock
} from 'lucide-react';
import { apiClient } from '../../services/apiClient';
import { NewsItem, EventItem } from '../../types';
import { FormDrawer, DrawerMode, FileUploadInput, ConfirmDialog } from '../../UI_Componentes/ui';
import { slugify, copyToClipboard } from '../../utils/helpers';

export const NewsManagementPage: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string | number; title: string } | null>(null);
  const [viewMode, setViewMode] = useState<'card' | 'list'>('list');

  // Drawer State (Add, Edit, View)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<DrawerMode>('create');
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [autoSlug, setAutoSlug] = useState(true);

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  };

  const fetchNews = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/admin/news');
      if (res.data.success) {
        setNews(res.data.data?.items || res.data.data || []);
      }
    } catch (err) {
      console.error(err);
      showNotification('Failed to load news articles', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleOpenCreate = () => {
    setSelectedNews(null);
    setDrawerMode('create');
    setTitle('');
    setSlug('');
    setAutoSlug(true);
    setSummary('');
    setContent('');
    setImageUrl('');
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (n: NewsItem) => {
    setSelectedNews(n);
    setDrawerMode('edit');
    setTitle(n.title);
    setSlug(n.slug);
    setAutoSlug(false);
    setSummary(n.summary || '');
    setContent(n.content || '');
    setImageUrl(n.imageUrl || '');
    setIsDrawerOpen(true);
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (drawerMode === 'create' || autoSlug) {
      setSlug(slugify(val));
    }
  };

  const handleOpenView = (n: NewsItem) => {
    setSelectedNews(n);
    setDrawerMode('view');
    setTitle(n.title);
    setSlug(n.slug);
    setSummary(n.summary || '');
    setContent(n.content || '');
    setImageUrl(n.imageUrl || '');
    setIsDrawerOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      if (drawerMode === 'edit' && selectedNews) {
        await apiClient.put(`/admin/news/${selectedNews.id}`, {
          title,
          slug,
          summary,
          content,
          imageUrl,
          isPublished: selectedNews.isPublished !== false,
        });
        showNotification('News article updated successfully');
      } else {
        await apiClient.post('/admin/news', {
          title,
          slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          summary,
          content,
          imageUrl,
          isPublished: true,
        });
        showNotification('News article published successfully');
      }
      setIsDrawerOpen(false);
      fetchNews();
    } catch {
      showNotification('Failed to save news article', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const toggleStatus = async (n: NewsItem) => {
    const nextStatus = !n.isPublished;
    try {
      setActionLoading(true);
      if (nextStatus) {
        await apiClient.post(`/admin/news/${n.id}/publish`);
      } else {
        await apiClient.post(`/admin/news/${n.id}/unpublish`);
      }
      showNotification(`"${n.title}" is now ${nextStatus ? 'PUBLISHED' : 'DRAFT (Hidden from visitors)'}`);
      fetchNews();
    } catch {
      showNotification('Failed to update article status', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setActionLoading(true);
      await apiClient.delete(`/admin/news/${deleteTarget.id}`);
      showNotification('Article deleted');
      setDeleteTarget(null);
      fetchNews();
    } catch {
      showNotification('Failed to delete', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredNews = news.filter((n) =>
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (n.summary && n.summary.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const publishedNews = news.filter((n) => n.isPublished !== false);
  const [showNewsMonitor, setShowNewsMonitor] = React.useState(true);

  return (
    <div className="space-y-6 font-sans text-slate-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Newspaper className="w-6 h-6 text-blue-600" />
            <span>Campus News Management</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Publish press announcements, academic achievements, research breakthroughs, and guest lectures.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchNews}
            disabled={loading}
            className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-xs font-semibold transition shadow-sm cursor-pointer"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Notification banner */}
      {message && (
        <div
          className={`p-3.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-all ${
            message.type === 'success'
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

      {/* ── LIVE CAMPUS NEWS MONITOR (LIGHT MODE) ── */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="p-4 flex items-center justify-between border-b border-slate-100 bg-slate-50/75">
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${publishedNews.length > 0 ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`} />
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 font-mono">
              Live Campus News Monitor
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-500">
              {publishedNews.length} Published · {news.length - publishedNews.length} Draft
            </span>
            <button
              type="button"
              onClick={() => setShowNewsMonitor(!showNewsMonitor)}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs transition cursor-pointer"
            >
              {showNewsMonitor ? 'Hide Preview' : 'Show Preview'}
            </button>
          </div>
        </div>
        {showNewsMonitor && (
          <div className="p-5 bg-slate-50/50">
            {loading ? (
              <div className="text-center text-slate-500 text-xs py-4">Loading news data...</div>
            ) : news.length === 0 ? (
              <div className="text-center text-slate-400 text-xs py-8 space-y-1">
                <Newspaper className="w-8 h-8 text-slate-300 mx-auto" />
                <p>No news articles yet. Create your first article to see it here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {news.slice(0, 3).map((n) => {
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
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                            isPub
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}
                        >
                          {isPub ? 'Published' : 'Draft'}
                        </span>
                        <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                          <Clock className="w-3 h-3" />
                          <span>{n.publishedDate ? new Date(n.publishedDate).toLocaleDateString() : 'No date'}</span>
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
              * Renders dynamically on your campus news feed. Showing latest {Math.min(news.length, 3)} of {news.length} articles.
            </p>
          </div>
        )}
      </div>

      {/* Search & View Switcher */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search news articles by title or keyword..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-sm"
          />
        </div>

        <div className="flex items-center gap-2.5 self-end sm:self-auto">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-2xs">
            <button
              type="button"
              onClick={() => setViewMode('card')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                viewMode === 'card'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-700'
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
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-700'
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
            <span>Post News Article</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-500 font-semibold bg-white rounded-xl border border-slate-200 shadow-xs">
          Loading news articles...
        </div>
      ) : filteredNews.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
          <Newspaper className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-sm font-bold text-slate-900">No News Articles Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">Publish press releases and student achievements to display on the campus news feed.</p>
        </div>
      ) : viewMode === 'list' ? (
        /* TABLE / LIST VIEW */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase font-bold text-slate-500 tracking-wider">
                <tr>
                  <th className="py-3 px-4">Headline / Title</th>
                  <th className="py-3 px-4">Summary</th>
                  <th className="py-3 px-4">Published Date</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredNews.map((n) => {
                  const isPub = n.isPublished !== false;
                  return (
                    <tr key={n.id} className="hover:bg-slate-50/75 transition">
                      <td className="py-3 px-4 max-w-xs">
                        <div className="space-y-1">
                          <span className="font-bold text-slate-900 line-clamp-2">{n.title}</span>
                          {n.slug && (
                            <div className="inline-flex items-center gap-1 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">
                              <span className="font-mono text-[10px] text-blue-600 font-medium">/news/{n.slug}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  copyToClipboard(`/news/${n.slug}`);
                                  showNotification(`Copied "/news/${n.slug}" to clipboard!`);
                                }}
                                className="text-slate-400 hover:text-blue-600 transition cursor-pointer"
                                title="Copy URL"
                              >
                                <Copy className="w-2.5 h-2.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-500 max-w-sm">
                        <p className="line-clamp-1">{n.summary || <span className="text-slate-300 italic">No summary</span>}</p>
                      </td>
                      <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                        {n.publishedDate ? new Date(n.publishedDate).toLocaleDateString() : '—'}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => toggleStatus(n)}
                          disabled={actionLoading}
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition cursor-pointer ${
                            isPub ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200' : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
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
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                            title="View News"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(n)}
                            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                            title="Edit News"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget({ id: n.id, title: n.title })}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                            title="Delete News"
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

          {filteredNews.map((n) => {
            const isPub = n.isPublished !== false;
            return (
              <div
                key={n.id}
                className={`bg-white rounded-xl border p-5 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition ${
                  isPub ? 'border-slate-200' : 'border-dashed border-red-200 bg-red-50/10 opacity-75'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{n.publishedDate ? new Date(n.publishedDate).toLocaleDateString() : 'Draft'}</span>
                    </span>

                    <button
                      onClick={() => toggleStatus(n)}
                      disabled={actionLoading}
                      title={isPub ? 'Click to Unpublish (Draft)' : 'Click to Publish'}
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold transition cursor-pointer ${
                        isPub ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-100' : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-100'
                      }`}
                    >
                      {isPub ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      <span>{isPub ? 'Published' : 'Draft'}</span>
                    </button>
                  </div>

                  <h3 className={`font-bold text-base leading-snug ${isPub ? 'text-slate-900' : 'text-slate-400 line-through'}`}>
                    {n.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {n.summary || 'No summary provided.'}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  {n.slug ? (
                    <button
                      type="button"
                      onClick={() => {
                        copyToClipboard(`/news/${n.slug}`);
                        showNotification(`Copied "/news/${n.slug}" to clipboard!`);
                      }}
                      className="inline-flex items-center gap-1 text-[11px] font-mono text-blue-600 hover:text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 transition cursor-pointer"
                      title="Copy Public URL"
                    >
                      <Copy className="w-3 h-3" />
                      <span>/news/{n.slug}</span>
                    </button>
                  ) : <span />}

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenView(n)}
                      className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                      title="View Article"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleOpenEdit(n)}
                      className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                      title="Edit Article"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget({ id: n.id, title: n.title })}
                      className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition cursor-pointer"
                      title="Delete Article"
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

      {/* FormDrawer for Creating / Editing / Viewing News */}
      <FormDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={
          drawerMode === 'create'
            ? 'Publish News Article'
            : drawerMode === 'edit'
            ? 'Edit News Article'
            : selectedNews?.title || 'Article Details'
        }
        subtitle={
          drawerMode === 'create'
            ? 'Compose a new press announcement or highlight'
            : drawerMode === 'edit'
            ? 'Update headline, summary, or content body'
            : 'Read news article preview and details'
        }
        icon={<Newspaper className="w-5 h-5 text-primary" />}
        mode={drawerMode}
        onSubmit={handleSave}
        onEditClick={() => setDrawerMode('edit')}
        loading={actionLoading}
        size="lg"
      >
        {drawerMode === 'view' && selectedNews ? (
          <div className="space-y-6">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status</span>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                    selectedNews.isPublished !== false
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400'
                      : 'bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-400'
                  }`}
                >
                  {selectedNews.isPublished !== false ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  {selectedNews.isPublished !== false ? 'Published' : 'Draft'}
                </span>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Headline</span>
                <p className="text-xl font-black text-slate-900 dark:text-white">{selectedNews.title}</p>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span className="font-mono bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded">/{selectedNews.slug}</span>
                {selectedNews.publishedDate && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(selectedNews.publishedDate).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>

            {selectedNews.summary && (
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Summary</span>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 italic bg-primary/5 p-4 rounded-2xl border border-primary/10">
                  {selectedNews.summary}
                </p>
              </div>
            )}

            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Article Body</span>
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                {selectedNews.content || 'No body content.'}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                Article Headline *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. College Secures Top 10 NIRF Ranking for Research"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-sm"
                required
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                  URL Slug *
                </label>
                <div className="flex items-center gap-1.5 mb-1">
                  <button
                    type="button"
                    onClick={() => setAutoSlug(!autoSlug)}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 transition cursor-pointer ${
                      autoSlug
                        ? 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/60 dark:text-blue-300'
                        : 'bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                    title={autoSlug ? 'Auto-Sync is ON: typing headline updates slug' : 'Auto-Sync is OFF: custom edit'}
                  >
                    {autoSlug ? <Lock className="w-2.5 h-2.5" /> : <Unlock className="w-2.5 h-2.5" />}
                    <span>{autoSlug ? 'Auto-Sync' : 'Custom'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSlug(slugify(title))}
                    className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200 dark:bg-slate-800 dark:text-slate-400 flex items-center gap-1 transition cursor-pointer"
                    title="Regenerate slug from current headline"
                  >
                    <RotateCcw className="w-2.5 h-2.5" />
                    <span>Sync</span>
                  </button>
                </div>
              </div>
              <input
                type="text"
                value={slug}
                onChange={(e) => {
                  setAutoSlug(false);
                  setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                }}
                placeholder="e.g. top-10-nirf-ranking"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-xs font-mono"
                required
              />
              <p className="text-[11px] text-slate-400">Public Route: <span className="font-mono text-blue-600">/news/{slug || '...'}</span></p>
            </div>

            <FileUploadInput
              label="FEATURED ARTICLE IMAGE"
              value={imageUrl}
              onChange={setImageUrl}
              placeholder="/assets/templates/... or upload local image"
              helpText="Upload a news image file or paste image URL."
            />

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                Summary / Excerpt
              </label>
              <textarea
                rows={3}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Short introductory teaser displayed on cards..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                Article Content (Body)
              </label>
              <textarea
                rows={8}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Full article content, quotes, achievements..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-sm"
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
        title="Delete News Article"
        message={`This permanently deletes "${deleteTarget?.title}". This action cannot be undone.`}
        confirmText="Delete"
        loading={actionLoading}
      />
    </div>
  );
};

export const EventsManagementPage: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string | number; title: string } | null>(null);
  const [viewMode, setViewMode] = useState<'card' | 'list'>('list');

  // Drawer State (Add, Edit, View)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<DrawerMode>('create');
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [location, setLocation] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/admin/events');
      if (res.data.success) {
        setEvents(res.data.data?.items || res.data.data || []);
      }
    } catch (err) {
      console.error(err);
      showNotification('Failed to load events', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleOpenCreate = () => {
    setSelectedEvent(null);
    setDrawerMode('create');
    setTitle('');
    setDescription('');
    setEventDate(new Date().toISOString().split('T')[0]);
    setLocation('Main Auditorium');
    setImageUrl('');
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (evt: EventItem) => {
    setSelectedEvent(evt);
    setDrawerMode('edit');
    setTitle(evt.title);
    setDescription(evt.description || '');
    setEventDate(evt.eventDate ? evt.eventDate.split('T')[0] : '');
    setLocation(evt.location || '');
    setImageUrl(evt.imageUrl || '');
    setIsDrawerOpen(true);
  };

  const handleOpenView = (evt: EventItem) => {
    setSelectedEvent(evt);
    setDrawerMode('view');
    setTitle(evt.title);
    setDescription(evt.description || '');
    setEventDate(evt.eventDate ? evt.eventDate.split('T')[0] : '');
    setLocation(evt.location || '');
    setImageUrl(evt.imageUrl || '');
    setIsDrawerOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      if (drawerMode === 'edit' && selectedEvent) {
        await apiClient.put(`/admin/events/${selectedEvent.id}`, {
          title,
          description,
          eventDate: new Date(eventDate).toISOString(),
          location,
          imageUrl,
          isPublished: selectedEvent.isPublished !== false,
        });
        showNotification('Event updated successfully');
      } else {
        await apiClient.post('/admin/events', {
          title,
          description,
          eventDate: new Date(eventDate).toISOString(),
          location,
          imageUrl,
          isPublished: true,
        });
        showNotification('Event scheduled successfully');
      }
      setIsDrawerOpen(false);
      fetchEvents();
    } catch {
      showNotification('Failed to save event', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const toggleStatus = async (evt: EventItem) => {
    const nextStatus = !evt.isPublished;
    try {
      setActionLoading(true);
      if (nextStatus) {
        await apiClient.post(`/admin/events/${evt.id}/publish`);
      } else {
        await apiClient.post(`/admin/events/${evt.id}/unpublish`);
      }
      showNotification(`"${evt.title}" is now ${nextStatus ? 'PUBLISHED' : 'DRAFT'}`);
      fetchEvents();
    } catch {
      showNotification('Failed to update event status', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setActionLoading(true);
      await apiClient.delete(`/admin/events/${deleteTarget.id}`);
      showNotification('Event deleted');
      setDeleteTarget(null);
      fetchEvents();
    } catch {
      showNotification('Failed to delete event', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredEvents = events.filter((e) =>
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (e.location && e.location.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const publishedEvents = events.filter((e) => e.isPublished !== false);
  const [showEventsMonitor, setShowEventsMonitor] = React.useState(true);

  return (
    <div className="space-y-6 font-sans text-slate-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <CalendarDays className="w-6 h-6 text-blue-600" />
            <span>College Events Calendar</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Schedule workshops, technical symposiums, alumni meets, and athletic tournaments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchEvents}
            disabled={loading}
            className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-xs font-semibold transition shadow-sm cursor-pointer"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Notification banner */}
      {message && (
        <div
          className={`p-3.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-all ${
            message.type === 'success'
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

      {/* ── LIVE COLLEGE EVENTS MONITOR (LIGHT MODE) ── */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="p-4 flex items-center justify-between border-b border-slate-100 bg-slate-50/75">
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${publishedEvents.length > 0 ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`} />
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 font-mono">
              Live College Events Monitor
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-500">
              {publishedEvents.length} Published · {events.length - publishedEvents.length} Draft
            </span>
            <button
              type="button"
              onClick={() => setShowEventsMonitor(!showEventsMonitor)}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs transition cursor-pointer"
            >
              {showEventsMonitor ? 'Hide Preview' : 'Show Preview'}
            </button>
          </div>
        </div>
        {showEventsMonitor && (
          <div className="p-5 bg-slate-50/50">
            {loading ? (
              <div className="text-center text-slate-500 text-xs py-4">Loading events data...</div>
            ) : events.length === 0 ? (
              <div className="text-center text-slate-400 text-xs py-8 space-y-1">
                <CalendarDays className="w-8 h-8 text-slate-300 mx-auto" />
                <p>No events scheduled yet. Add your first event to see it here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {events.slice(0, 3).map((evt) => {
                  const isPub = evt.isPublished !== false;
                  return (
                    <div
                      key={evt.id}
                      className={`rounded-xl p-3.5 space-y-2 border transition ${
                        isPub
                          ? 'bg-white border-slate-200 shadow-2xs'
                          : 'bg-slate-100/70 border-dashed border-slate-300 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                            isPub
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}
                        >
                          {isPub ? 'Published' : 'Draft'}
                        </span>
                        <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                          <Calendar className="w-3 h-3" />
                          <span>{evt.eventDate ? new Date(evt.eventDate).toLocaleDateString() : 'TBD'}</span>
                        </div>
                      </div>
                      <p className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">{evt.title}</p>
                      {evt.location && (
                        <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{evt.location}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            <p className="text-[11px] text-slate-400 italic text-center pt-4">
              * Renders dynamically on your college events calendar. Showing {Math.min(events.length, 3)} of {events.length} events.
            </p>
          </div>
        )}
      </div>

      {/* Search & View Switcher */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events by title or venue location..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-sm"
          />
        </div>

        <div className="flex items-center gap-2.5 self-end sm:self-auto">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-2xs">
            <button
              type="button"
              onClick={() => setViewMode('card')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                viewMode === 'card'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-700'
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
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-700'
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
            <span>New Event</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-500 font-semibold bg-white rounded-xl border border-slate-200 shadow-xs">
          Loading events...
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
          <CalendarDays className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-sm font-bold text-slate-900">No Upcoming Events</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">Schedule campus seminars, cultural festivals, and sports tournaments.</p>
        </div>
      ) : viewMode === 'list' ? (
        /* TABLE / LIST VIEW */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase font-bold text-slate-500 tracking-wider">
                <tr>
                  <th className="py-3 px-4">Event Date</th>
                  <th className="py-3 px-4">Event Title</th>
                  <th className="py-3 px-4">Venue / Location</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEvents.map((evt) => {
                  const isPub = evt.isPublished !== false;
                  return (
                    <tr key={evt.id} className="hover:bg-slate-50/75 transition">
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-100 whitespace-nowrap">
                          <Calendar className="w-3.5 h-3.5 text-blue-600" />
                          <span>{evt.eventDate ? new Date(evt.eventDate).toLocaleDateString() : 'TBD'}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900 max-w-xs">
                        <span className="line-clamp-2">{evt.title}</span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-medium">
                        {evt.location ? (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{evt.location}</span>
                          </div>
                        ) : (
                          <span className="text-slate-300 italic">No venue set</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-500 max-w-sm">
                        <p className="line-clamp-1">{evt.description || <span className="text-slate-300 italic">No description</span>}</p>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => toggleStatus(evt)}
                          disabled={actionLoading}
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition cursor-pointer ${
                            isPub ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200' : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                          }`}
                        >
                          {isPub ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          <span>{isPub ? 'Published' : 'Draft'}</span>
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenView(evt)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                            title="View Event"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(evt)}
                            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                            title="Edit Event"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget({ id: evt.id, title: evt.title })}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                            title="Delete Event"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

          {filteredEvents.map((evt) => {
            const isPub = evt.isPublished !== false;
            return (
              <div
                key={evt.id}
                className={`bg-white rounded-xl border p-5 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition ${
                  isPub ? 'border-slate-200' : 'border-dashed border-red-200 bg-red-50/10 opacity-75'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                      <Calendar className="w-3.5 h-3.5 text-blue-600" />
                      <span>{evt.eventDate ? new Date(evt.eventDate).toLocaleDateString() : 'TBD'}</span>
                    </span>

                    <button
                      onClick={() => toggleStatus(evt)}
                      disabled={actionLoading}
                      title={isPub ? 'Click to Unpublish (Draft)' : 'Click to Publish'}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold transition cursor-pointer ${
                        isPub ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-100' : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-100'
                      }`}
                    >
                      {isPub ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      <span>{isPub ? 'Published' : 'Draft'}</span>
                    </button>
                  </div>

                  <h3 className={`font-bold text-base leading-snug ${isPub ? 'text-slate-900' : 'text-slate-400 line-through'}`}>
                    {evt.title}
                  </h3>

                  {evt.location && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{evt.location}</span>
                    </div>
                  )}

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {evt.description || 'No description provided.'}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenView(evt)}
                      className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                      title="View Event"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleOpenEdit(evt)}
                      className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                      title="Edit Event"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget({ id: evt.id, title: evt.title })}
                      className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition cursor-pointer"
                      title="Delete Event"
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

      {/* FormDrawer for Creating / Editing / Viewing Event */}
      <FormDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={
          drawerMode === 'create'
            ? 'Schedule New Event'
            : drawerMode === 'edit'
            ? 'Edit Event'
            : selectedEvent?.title || 'Event Details'
        }
        subtitle={
          drawerMode === 'create'
            ? 'Add a workshop, festival, or seminar to the college calendar'
            : drawerMode === 'edit'
            ? 'Update event date, location, or agenda'
            : 'Preview event schedule and details'
        }
        icon={<CalendarDays className="w-5 h-5 text-primary" />}
        mode={drawerMode}
        onSubmit={handleSave}
        onEditClick={() => setDrawerMode('edit')}
        loading={actionLoading}
        size="md"
      >
        {drawerMode === 'view' && selectedEvent ? (
          <div className="space-y-6">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status</span>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                    selectedEvent.isPublished !== false
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400'
                      : 'bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-400'
                  }`}
                >
                  {selectedEvent.isPublished !== false ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  {selectedEvent.isPublished !== false ? 'Published' : 'Draft'}
                </span>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Event Title</span>
                <p className="text-xl font-black text-slate-900 dark:text-white">{selectedEvent.title}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200 dark:border-slate-700/60">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Date</span>
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-800 dark:text-slate-200">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span>{selectedEvent.eventDate ? new Date(selectedEvent.eventDate).toLocaleDateString() : 'TBD'}</span>
                  </div>
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Venue</span>
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-800 dark:text-slate-200">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>{selectedEvent.location || 'Campus Main'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Event Description & Agenda</span>
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                {selectedEvent.description || 'No event description provided.'}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <FileUploadInput
              label="EVENT BANNER IMAGE"
              value={imageUrl}
              onChange={setImageUrl}
              placeholder="/assets/templates/... or upload local file"
              helpText="Upload an event poster or promotional banner image."
            />

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                Event Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. National Robotics Symposium 2026"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-sm"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                  Event Date *
                </label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                  Venue Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Seminar Hall A"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                Event Details
              </label>
              <textarea
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Speaker bios, registration requirements, schedule..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-sm"
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
        title="Delete Event"
        message={`This permanently deletes "${deleteTarget?.title}". This action cannot be undone.`}
        confirmText="Delete"
        loading={actionLoading}
      />
    </div>
  );
};
