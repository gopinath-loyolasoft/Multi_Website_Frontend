import React, { useState, useEffect, useRef } from 'react';
import {
  Layers, Plus, Edit2, Trash2, Eye, ExternalLink, Image as ImageIcon,
  Calendar, Clock, CheckCircle2, XCircle, AlertCircle, RefreshCw,
  Sparkles, Video, MessageSquare, ArrowRight, X, Sliders, Upload,
  Link as LinkIcon, FolderOpen, Check, FileImage, ShieldCheck, Globe
} from 'lucide-react';
import { apiClient } from '../../services/apiClient';
import { PageUrlPicker } from '../../components/common/PageUrlPicker';
import { PopupAnnouncement } from '../../components/common/SitePopupModal';
import { FormDrawer, ConfirmDialog, useToast } from '../../UI_Componentes/ui';

export const PopupAnnouncementsAdmin: React.FC = () => {
  const [popups, setPopups] = useState<PopupAnnouncement[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<PopupAnnouncement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // FormDrawer State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingPopup, setEditingPopup] = useState<PopupAnnouncement | null>(null);

  // Image Upload / Source Mode State
  const [imageTab, setImageTab] = useState<'upload' | 'url' | 'library'>('upload');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [mediaLoading, setMediaLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Form State (Blank by default for new creations)
  const [formData, setFormData] = useState<Partial<PopupAnnouncement>>({
    title: '',
    popupType: 'IMAGE_POSTER',
    imageUrl: '',
    badgeText: '',
    heading: '',
    description: '',
    videoUrl: '',
    targetUrl: '',
    ctaText: '',
    secondaryCtaText: '',
    secondaryTargetUrl: '',
    openInNewTab: false,
    delaySeconds: 1,
    displayFrequency: 'ONCE_PER_DAY',
    targetPages: 'HOMEPAGE_ONLY',
    customTargetSlugs: '',
    startDate: new Date().toISOString().slice(0, 16),
    endDate: '',
    isActive: true
  });

  // Live Preview Modal State
  const [previewPopup, setPreviewPopup] = useState<PopupAnnouncement | null>(null);

  useEffect(() => {
    fetchPopups();
  }, []);

  const fetchPopups = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get<{ success: boolean; data: PopupAnnouncement[] }>('/admin/popups');
      if (res.data?.success) {
        setPopups(res.data.data || []);
      }
    } catch (err: any) {
      console.error('Failed to load popups', err);
      setError(err.response?.data?.message || 'Failed to fetch popup announcements');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (PNG, JPG, JPEG, WEBP, GIF, SVG)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Image file size must be less than 10MB');
      return;
    }

    setUploadingImage(true);
    setError(null);

    try {
      const uploadData = new FormData();
      uploadData.append('file', file);
      uploadData.append('altText', formData.title || 'Announcement Poster');

      const res = await apiClient.post<{ success: boolean; data: any }>('/admin/media', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data?.success && res.data.data) {
        const serverPath = res.data.data.filePath || res.data.data.url;
        setFormData(prev => ({ ...prev, imageUrl: serverPath }));
        showToast('Poster image uploaded successfully!');
      } else {
        // Fallback to local Data URL
        const reader = new FileReader();
        reader.onload = () => {
          setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
          showToast('Local image loaded successfully!');
        };
        reader.readAsDataURL(file);
      }
    } catch (err: any) {
      console.warn('Server media upload fallback to data URL', err);
      const reader = new FileReader();
      reader.onload = () => {
        setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
        showToast('Local image loaded successfully!');
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const fetchMediaLibrary = async () => {
    setMediaLoading(true);
    try {
      const res = await apiClient.get<{ success: boolean; data: any }>('/admin/media', { params: { pageSize: 36 } });
      if (res.data?.success) {
        const items = res.data.data?.items || res.data.data || [];
        setMediaList(Array.isArray(items) ? items : []);
      }
    } catch (err) {
      console.error('Failed to load media library', err);
    } finally {
      setMediaLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingPopup(null);
    setImageTab('upload');
    // Open completely BLANK form
    setFormData({
      title: '',
      popupType: 'IMAGE_POSTER',
      imageUrl: '',
      badgeText: '',
      heading: '',
      description: '',
      videoUrl: '',
      targetUrl: '',
      ctaText: '',
      secondaryCtaText: '',
      secondaryTargetUrl: '',
      openInNewTab: false,
      delaySeconds: 1,
      displayFrequency: 'ONCE_PER_DAY',
      targetPages: 'HOMEPAGE_ONLY',
      customTargetSlugs: '',
      startDate: new Date().toISOString().slice(0, 16),
      endDate: '',
      isActive: true
    });
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (p: PopupAnnouncement) => {
    setEditingPopup(p);
    setImageTab(p.imageUrl?.startsWith('http') ? 'url' : 'upload');
    setFormData({
      ...p,
      startDate: p.startDate ? new Date(p.startDate).toISOString().slice(0, 16) : '',
      endDate: p.endDate ? new Date(p.endDate).toISOString().slice(0, 16) : ''
    });
    setIsDrawerOpen(true);
  };

  const handleToggleStatus = async (id: string) => {
    try {
      const res = await apiClient.put<{ success: boolean; data: boolean; message: string }>(`/admin/popups/${id}/toggle`);
      if (res.data?.success) {
        setPopups(prev =>
          prev.map(p => (p.id === id ? { ...p, isActive: res.data.data } : p))
        );
        showToast(res.data.message || 'Status updated successfully');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to toggle status');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await apiClient.delete(`/admin/popups/${deleteTarget.id}`);
      if (res.data?.success) {
        setPopups(prev => prev.filter(p => p.id !== deleteTarget.id));
        showToast('Popup announcement deleted successfully');
        setDeleteTarget(null);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete popup');
    } finally {
      setDeleting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim()) {
      setError('Title is required');
      return;
    }

    setSaving(true);
    setError(null);

    const payload = {
      ...formData,
      startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
      endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null
    };

    try {
      if (editingPopup) {
        await apiClient.put(`/admin/popups/${editingPopup.id}`, payload);
        showToast('Popup announcement updated successfully!');
      } else {
        await apiClient.post('/admin/popups', payload);
        showToast('Popup announcement created successfully!');
      }
      setIsDrawerOpen(false);
      fetchPopups();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save popup announcement');
    } finally {
      setSaving(false);
    }
  };

  const showToast = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-indigo-50 dark:bg-indigo-950/60 rounded-2xl text-indigo-600 dark:text-indigo-400">
            <Layers className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Modal Popup & Lightbox Announcements
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Configure automatic entry popups, admission posters, emergency alerts, or video spotlights.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchPopups}
            className="p-2.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleOpenCreate}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md hover:shadow-indigo-500/25 flex items-center gap-2 transition-all"
          >
            <Plus className="w-5 h-5" />
            Create Popup
          </button>
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 rounded-xl border border-emerald-200 dark:border-emerald-800 flex items-center gap-3 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span className="text-sm font-medium">{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 rounded-xl border border-rose-200 dark:border-rose-800 flex items-center gap-3 animate-fade-in">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {/* Popup List */}
      {loading ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center text-slate-500">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-indigo-600 mb-3" />
          <p>Loading popup announcements...</p>
        </div>
      ) : popups.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center">
          <Layers className="w-12 h-12 mx-auto text-slate-400 mb-3" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">No popup announcements yet</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1 mb-6">
            Create an entry popup or lightbox banner to welcome visitors, announce admissions, or highlight college events.
          </p>
          <button
            onClick={handleOpenCreate}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md transition-all inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Create First Popup
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popups.map((p) => (
            <div
              key={p.id}
              className={`bg-white dark:bg-slate-900 rounded-2xl border ${
                p.isActive
                  ? 'border-indigo-200 dark:border-indigo-900/60 shadow-md shadow-indigo-500/5'
                  : 'border-slate-200 dark:border-slate-800 opacity-75'
              } overflow-hidden flex flex-col transition-all hover:shadow-lg`}
            >
              {/* Poster Thumbnail / Header */}
              <div className="relative h-44 bg-slate-950 flex items-center justify-center overflow-hidden">
                {p.imageUrl ? (
                  <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover object-center" />
                ) : p.popupType === 'VIDEO' ? (
                  <Video className="w-12 h-12 text-slate-600" />
                ) : (
                  <MessageSquare className="w-12 h-12 text-slate-600" />
                )}

                {/* Badges overlay */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-black/60 text-white backdrop-blur-md border border-white/20">
                    {p.popupType}
                  </span>
                  {p.badgeText && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-600 text-white shadow-sm">
                      {p.badgeText}
                    </span>
                  )}
                </div>

                {/* Active Toggle Top Right */}
                <button
                  type="button"
                  onClick={() => handleToggleStatus(p.id)}
                  className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all shadow-md backdrop-blur-md ${
                    p.isActive
                      ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                  title="Click to toggle active status"
                >
                  <span className={`w-2 h-2 rounded-full ${p.isActive ? 'bg-white animate-pulse' : 'bg-slate-400'}`} />
                  {p.isActive ? 'Active' : 'Inactive'}
                </button>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1">
                    {p.title}
                  </h3>
                  {p.heading && (
                    <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400 mt-0.5 line-clamp-1">
                      {p.heading}
                    </p>
                  )}
                  {p.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
                      {p.description}
                    </p>
                  )}
                </div>

                {/* Info Pills */}
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Delay: {p.delaySeconds ?? 1}s</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <Sliders className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{p.displayFrequency || 'ONCE_PER_DAY'}</span>
                  </div>
                  <div className="col-span-2 flex items-center gap-1.5 truncate">
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate font-mono text-[11px]">
                      {p.targetUrl ? `Target: ${p.targetUrl}` : 'No redirect link (pure poster)'}
                    </span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setPreviewPopup(p)}
                    className="px-3 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" /> Preview
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(p)}
                      className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(p)}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── STANDARDIZED RIGHT-SIDE FORM DRAWER ─── */}
      <FormDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        mode={editingPopup ? 'edit' : 'create'}
        title={editingPopup ? 'Edit Popup Announcement' : 'Add Popup Announcement'}
        subtitle={
          editingPopup
            ? 'Update announcement content, link, and display rules'
            : 'Configure a new entry popup, admission poster, or video lightbox'
        }
        icon={<Sparkles className="w-5 h-5 text-indigo-600" />}
        onSubmit={handleSubmit}
        loading={saving}
        size="lg"
        submitText={editingPopup ? 'Save Changes' : 'Create Popup Announcement'}
        customFooter={
          <div className="flex items-center justify-between w-full">
            <button
              type="button"
              onClick={() => setPreviewPopup(formData as PopupAnnouncement)}
              className="px-3.5 py-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" /> Live Preview
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                disabled={saving}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="drawer-active-form"
                disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition cursor-pointer disabled:opacity-60 shadow-sm shadow-indigo-600/20"
              >
                {saving ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>{editingPopup ? 'Save Announcement Changes' : 'Create Popup Announcement'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        }
      >
        <div className="space-y-6 pt-1">
          {/* 1. Type & Title */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Internal Campaign Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Admissions 2026 Poster Lightbox"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Popup Format
              </label>
              <select
                value={formData.popupType || 'IMAGE_POSTER'}
                onChange={(e) => setFormData({ ...formData, popupType: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="IMAGE_POSTER">Image Poster Banner</option>
                <option value="RICH_CONTENT">Rich Card Alert</option>
                <option value="VIDEO">Video Spotlight</option>
              </select>
            </div>
          </div>

          {/* 2. Poster Image / Media (Local Upload, Live URL, or Media Library) */}
          <div className="space-y-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                {formData.popupType === 'VIDEO' ? 'Video URL (YouTube/MP4)' : 'Poster Image / Banner'}
              </label>
              {formData.popupType !== 'VIDEO' && (
                <div className="flex items-center gap-1 bg-white dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
                  <button
                    type="button"
                    onClick={() => setImageTab('upload')}
                    className={`px-2.5 py-1 rounded-md font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      imageTab === 'upload'
                        ? 'bg-indigo-600 text-white shadow-2xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" /> Upload Local
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageTab('url')}
                    className={`px-2.5 py-1 rounded-md font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      imageTab === 'url'
                        ? 'bg-indigo-600 text-white shadow-2xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    <LinkIcon className="w-3.5 h-3.5" /> Live URL
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setImageTab('library');
                      fetchMediaLibrary();
                    }}
                    className={`px-2.5 py-1 rounded-md font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      imageTab === 'library'
                        ? 'bg-indigo-600 text-white shadow-2xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    <FolderOpen className="w-3.5 h-3.5" /> Library
                  </button>
                </div>
              )}
            </div>
            
            {formData.popupType === 'VIDEO' ? (
              <input
                type="text"
                value={formData.videoUrl || ''}
                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                placeholder="https://www.youtube.com/watch?v=... or .mp4 URL"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            ) : (
              <div className="space-y-3">
                {/* Tab 1: Local File Uploader */}
                {imageTab === 'upload' && (
                  <div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/png, image/jpeg, image/jpg, image/webp, image/gif, image/svg+xml"
                      className="hidden"
                    />
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-indigo-200 dark:border-indigo-900/60 hover:border-indigo-500 dark:hover:border-indigo-500 bg-white dark:bg-slate-800/80 rounded-xl p-6 text-center cursor-pointer transition-all hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 group"
                    >
                      {uploadingImage ? (
                        <div className="flex flex-col items-center justify-center space-y-2">
                          <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
                          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Uploading poster image to server...
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center space-y-2">
                          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/60 rounded-xl text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                            <Upload className="w-6 h-6" />
                          </div>
                          <div>
                            <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
                              Click to choose local image file
                            </span>
                            <span className="text-xs text-slate-500 dark:text-slate-400 block mt-0.5">
                              or drag & drop your banner/poster here
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400">
                            Supports PNG, JPG, WEBP, SVG (Up to 10MB)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Tab 2: Direct Live Web URL */}
                {imageTab === 'url' && (
                  <div className="space-y-1.5">
                    <input
                      type="text"
                      value={formData.imageUrl || ''}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      placeholder="https://example.com/poster.jpg or /uploads/media/poster.jpg"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    <p className="text-[11px] text-slate-400">
                      Paste any live URL or public CDN link for the announcement poster.
                    </p>
                  </div>
                )}

                {/* Tab 3: Media Library Grid */}
                {imageTab === 'library' && (
                  <div className="space-y-2">
                    {mediaLoading ? (
                      <div className="p-8 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin" /> Loading media library...
                      </div>
                    ) : mediaList.length === 0 ? (
                      <div className="p-6 text-center text-slate-400 text-xs bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                        <FileImage className="w-8 h-8 mx-auto text-slate-300 mb-1" />
                        No images found in Media Library. Use the "Upload Local" tab to upload one!
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-48 overflow-y-auto p-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                        {mediaList.map((m) => {
                          const mUrl = m.filePath || m.url || m.file_path;
                          const isSelected = formData.imageUrl === mUrl;
                          return (
                            <div
                              key={m.id || mUrl}
                              onClick={() => setFormData({ ...formData, imageUrl: mUrl })}
                              className={`relative rounded-lg overflow-hidden border-2 cursor-pointer aspect-video bg-slate-950 group transition-all ${
                                isSelected
                                  ? 'border-indigo-600 ring-2 ring-indigo-500/50'
                                  : 'border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                              }`}
                              title={m.fileName || 'Media Asset'}
                            >
                              <img src={mUrl} alt={m.altText || 'Media'} className="w-full h-full object-cover" />
                              {isSelected && (
                                <div className="absolute inset-0 bg-indigo-600/30 flex items-center justify-center">
                                  <div className="p-1 rounded-full bg-indigo-600 text-white">
                                    <Check className="w-3.5 h-3.5" />
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Universal Poster Preview Box */}
                {formData.imageUrl && (
                  <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 p-2 group">
                    <div className="relative flex items-center justify-center max-h-52">
                      <img
                        src={formData.imageUrl}
                        alt="Poster Preview"
                        className="max-h-48 object-contain rounded-lg shadow-sm mx-auto"
                        onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                      />
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 px-1">
                      <span className="truncate font-mono text-[11px] max-w-[280px]">
                        {formData.imageUrl.startsWith('data:') ? 'Local file uploaded' : formData.imageUrl}
                      </span>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, imageUrl: '' })}
                        className="px-2 py-0.5 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded transition-colors cursor-pointer"
                      >
                        Remove Image
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 3. Target Page Link (Smart Page Picker) */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Target Page Link (Optional)
              </label>
              <span className="text-[11px] text-slate-500">
                If set, clicking poster/button opens this page
              </span>
            </div>

            <PageUrlPicker
              value={formData.targetUrl || ''}
              onChange={(val) => setFormData({ ...formData, targetUrl: val })}
              placeholder="Select any page/slug or enter URL"
              label=""
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Primary CTA Button Text
                </label>
                <input
                  type="text"
                  value={formData.ctaText || ''}
                  onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                  placeholder="e.g., Apply Online"
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id="openInNewTab"
                  checked={formData.openInNewTab || false}
                  onChange={(e) => setFormData({ ...formData, openInNewTab: e.target.checked })}
                  className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500 cursor-pointer"
                />
                <label htmlFor="openInNewTab" className="text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                  Open link in a new browser tab
                </label>
              </div>
            </div>
          </div>

          {/* 4. Optional Text Content (Badge, Heading, Description) */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Badge Text (Optional)
                </label>
                <input
                  type="text"
                  value={formData.badgeText || ''}
                  onChange={(e) => setFormData({ ...formData, badgeText: e.target.value })}
                  placeholder="e.g., ADMISSIONS 2026"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Modal Heading (Optional)
                </label>
                <input
                  type="text"
                  value={formData.heading || ''}
                  onChange={(e) => setFormData({ ...formData, heading: e.target.value })}
                  placeholder="e.g., Entrance Exam Dates Announced"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Announcement Description (Optional)
              </label>
              <textarea
                rows={3}
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Provide brief details or instructions..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* 5. Timing & Target Display Rules */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Target Pages
              </label>
              <select
                value={formData.targetPages || 'HOMEPAGE_ONLY'}
                onChange={(e) => setFormData({ ...formData, targetPages: e.target.value })}
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="HOMEPAGE_ONLY">Homepage Only</option>
                <option value="ALL_PAGES">All Pages</option>
                <option value="CUSTOM_SLUGS">Custom Page Slugs</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Frequency
              </label>
              <select
                value={formData.displayFrequency || 'ONCE_PER_DAY'}
                onChange={(e) => setFormData({ ...formData, displayFrequency: e.target.value })}
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="ONCE_PER_DAY">Once Per Day (Recommended)</option>
                <option value="ONCE_PER_SESSION">Once Per Browser Session</option>
                <option value="EVERY_VISIT">Every Page Visit / Refresh</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Entrance Delay: {formData.delaySeconds ?? 1}s
              </label>
              <input
                type="range"
                min="0"
                max="10"
                step="1"
                value={formData.delaySeconds ?? 1}
                onChange={(e) => setFormData({ ...formData, delaySeconds: parseInt(e.target.value, 10) })}
                className="w-full mt-2 accent-indigo-600 cursor-pointer"
              />
            </div>
          </div>

          {/* 6. Status & Lifecycle Scheduling */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Start Date
              </label>
              <input
                type="datetime-local"
                value={formData.startDate || ''}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                End Date (Optional)
              </label>
              <input
                type="datetime-local"
                value={formData.endDate || ''}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-3 pt-6">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive || false}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500 cursor-pointer"
              />
              <label htmlFor="isActive" className="text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                Publish / Active Immediately
              </label>
            </div>
          </div>
        </div>
      </FormDrawer>

      {/* ─── LIVE INTERACTIVE PREVIEW MODAL ─── */}
      {previewPopup && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setPreviewPopup(null);
          }}
        >
          <div className="relative w-full max-w-lg md:max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-scale-up">
            <button
              onClick={() => setPreviewPopup(null)}
              className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md transition-transform hover:scale-110 shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>

            {previewPopup.imageUrl && (
              <div className="relative bg-slate-950">
                <img
                  src={previewPopup.imageUrl}
                  alt={previewPopup.title}
                  className="w-full h-auto max-h-[70vh] object-contain mx-auto"
                />
              </div>
            )}

            <div className="p-5 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
              {previewPopup.badgeText && (
                <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 mb-2">
                  {previewPopup.badgeText}
                </span>
              )}
              {previewPopup.heading && (
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                  {previewPopup.heading}
                </h3>
              )}
              {previewPopup.description && (
                <p className="text-xs text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
                  {previewPopup.description}
                </p>
              )}

              <div className="flex items-center justify-between gap-3 pt-2">
                <span className="text-xs text-slate-400">
                  Target: <code className="text-indigo-600 dark:text-indigo-400">{previewPopup.targetUrl || 'None'}</code>
                </span>
                {previewPopup.targetUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      alert(`In public mode, this will open: ${previewPopup.targetUrl}`);
                      setPreviewPopup(null);
                    }}
                    className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-md transition-all flex items-center gap-1.5"
                  >
                    {previewPopup.ctaText || 'Learn More'}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── DELETE CONFIRMATION DIALOG ─── */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        loading={deleting}
        title="Delete Popup Announcement?"
        message={
          <span>
            Are you sure you want to delete <strong className="text-slate-900 dark:text-white font-semibold">"{deleteTarget?.title}"</strong>? This will permanently remove the popup and disable it across all website pages.
          </span>
        }
        confirmText="Delete Announcement"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
};
