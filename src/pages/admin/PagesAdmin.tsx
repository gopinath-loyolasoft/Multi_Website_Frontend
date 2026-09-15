import React, { useEffect, useMemo, useState } from 'react';
import {
  FileText,
  Plus,
  RefreshCw,
  Search,
  Eye,
  Pencil,
  Trash2,
  EyeOff,
  Layers,
  Globe,
  Layers3,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  LayoutTemplate,
  ArrowUp,
  ArrowDown,
  Copy,
  Lock,
  Unlock,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { apiClient } from '../../services/apiClient';
import { useTenant } from '../../tenant/TenantContext';
import { PageSection, SectionSettings } from '../../types';
import { FormDrawer, Drawer, Input, Select, Switch, LivePreviewModal, ConfirmDialog } from '../../UI_Componentes/ui';
import { SectionContentEditor } from '../../components/admin/SectionContentEditor';
import { slugify, copyToClipboard } from '../../utils/helpers';

interface AdminPageItem {
  id: string | number;
  slug: string;
  title: string;
  metaDescription?: string;
  isPublished: boolean;
  currentVersion?: number;
  sections?: PageSection[];
  sectionCount?: number;
}

interface SectionTypeItem {
  code: string;
  name?: string;
  description?: string;
}

const SECTION_TYPE_CATALOG: SectionTypeItem[] = [
  { code: 'HERO', name: 'Hero Banner' },
  { code: 'HERO_SLIDER', name: 'Hero Slider' },
  { code: 'BANNERS', name: 'Banners (Slider)' },
  { code: 'QUOTE', name: 'Quote / Leadership Message' },
  { code: 'TEXT', name: 'Text Block / Overview' },
  { code: 'IMAGE', name: 'Image' },
  { code: 'IMAGE_TEXT', name: 'Image + Text' },
  { code: 'CARDS', name: 'Cards Grid' },
  { code: 'STATISTICS', name: 'Statistics' },
  { code: 'STATS', name: 'Stats (alias)' },
  { code: 'ICON_CARDS', name: 'Icon Cards' },
  { code: 'NEWS', name: 'News Feed' },
  { code: 'EVENTS', name: 'Events Feed' },
  { code: 'NOTICES', name: 'Notices' },
  { code: 'COURSES', name: 'Courses' },
  { code: 'DEPARTMENTS', name: 'Departments' },
  { code: 'FACULTY', name: 'Faculty' },
  { code: 'GALLERY', name: 'Gallery' },
  { code: 'TESTIMONIALS', name: 'Testimonials' },
  { code: 'CTA', name: 'Call to Action' },
  { code: 'CALL_TO_ACTION', name: 'Call to Action (alias)' },
  { code: 'VIDEO', name: 'Video' },
  { code: 'LOGO_GRID', name: 'Logo Grid' },
  { code: 'FAQ', name: 'FAQ' },
  { code: 'CONTACT', name: 'Contact Form' },
  { code: 'MAP', name: 'Map' },
];

const emptyPageDraft = { slug: '', title: '', metaDescription: '', isPublished: true };

export const PagesAdminPage: React.FC = () => {
  const { siteConfig, refreshConfig } = useTenant();

  const [pages, setPages] = useState<AdminPageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [search, setSearch] = useState('');

  const [pageDrawerOpen, setPageDrawerOpen] = useState(false);
  const [pageDrawerMode, setPageDrawerMode] = useState<'create' | 'edit'>('create');
  const [editingPageId, setEditingPageId] = useState<string | number | null>(null);
  const [pageDraft, setPageDraft] = useState(emptyPageDraft);
  const [pageSaving, setPageSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [autoSlug, setAutoSlug] = useState(true);

  const [sectionsPage, setSectionsPage] = useState<AdminPageItem | null>(null);
  const [sections, setSections] = useState<PageSection[]>([]);
  const [sectionsLoading, setSectionsLoading] = useState(false);
  const [sectionsError, setSectionsError] = useState<string | null>(null);

  const [sectionDrawerOpen, setSectionDrawerOpen] = useState(false);
  const [sectionDrawerMode, setSectionDrawerMode] = useState<'create' | 'edit'>('create');
  const [editingSectionId, setEditingSectionId] = useState<string | number | null>(null);
  const [sectionDraft, setSectionDraft] = useState<{
    sectionType: string;
    title: string;
    subtitle: string;
    content: Record<string, any>;
    settings: SectionSettings;
    isVisible: boolean;
  }>({
    sectionType: 'HERO',
    title: '',
    subtitle: '',
    content: {},
    settings: {
      columns: 3,
      cardVariant: 'standard',
      alignment: 'center',
      background: 'light',
      spacing: 'normal',
      containerWidth: 'standard',
    },
    isVisible: true,
  });
  const [sectionSaving, setSectionSaving] = useState(false);
  const [sectionError, setSectionError] = useState<string | null>(null);
  const [sectionTypes, setSectionTypes] = useState<SectionTypeItem[]>(SECTION_TYPE_CATALOG);

  const [busyId, setBusyId] = useState<string | number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminPageItem | null>(null);
  const [deleteSectionTarget, setDeleteSectionTarget] = useState<PageSection | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewTitle, setPreviewTitle] = useState('Website Live Preview');
  const [previewUrlPath, setPreviewUrlPath] = useState('/');

  const collegeName = siteConfig?.tenant?.name || 'College';

  const notify = (text: string, type: 'success' | 'error' = 'success') => {
    setNotice({ text, type });
    setTimeout(() => setNotice(null), 4000);
  };

  const openPreview = (title: string, path: string = '/') => {
    setPreviewTitle(title);
    setPreviewUrlPath(path);
    setPreviewOpen(true);
  };

  const openPreviewPage = async (page: AdminPageItem) => {
    try {
      const res = await apiClient.post('/admin/preview/session', {
        pageId: page.id,
        draftSectionIds: []
      });
      if (res.data?.success && res.data?.data?.previewToken) {
        const token = res.data.data.previewToken;
        openPreview(`Preview: ${page.title} (/${page.slug})`, `/${page.slug}?preview_token=${token}`);
        return;
      }
    } catch (err) {
      console.warn('Fallback to standard preview query:', err);
    }
    openPreview(`Preview: ${page.title} (/${page.slug})`, `/${page.slug}?preview=true`);
  };

  const fetchPages = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiClient.get('/admin/pages');
      const data = res.data?.data;
      const list = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : [];
      setPages(
        list.map((p: any) => ({
          ...p,
          sectionCount: p.sectionCount ?? p.sectionsCount ?? (p.sections?.length ?? 0),
          sections: p.sections || [],
        }))
      );
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to load pages');
    } finally {
      setLoading(false);
    }
  };

  const fetchSectionTypes = async () => {
    try {
      const res = await apiClient.get('/admin/section-types');
      const raw = res.data?.data;
      if (Array.isArray(raw) && raw.length > 0) {
        const mapped = raw
          .map((t: any) => ({ code: t.code, name: t.name, description: t.description }))
          .filter((t: any) => t.code);
        if (mapped.length > 0) {
          const codes = new Set(mapped.map((m) => m.code.toUpperCase()));
          setSectionTypes([...mapped, ...SECTION_TYPE_CATALOG.filter((c) => !codes.has(c.code))]);
        }
      }
    } catch {
      // fall back to catalog
    }
  };

  useEffect(() => {
    fetchPages();
    fetchSectionTypes();
  }, []);

  // ---------------- Page CRUD ----------------

  const openCreatePage = () => {
    setEditingPageId(null);
    setPageDraft(emptyPageDraft);
    setAutoSlug(true);
    setFormError(null);
    setPageDrawerMode('create');
    setPageDrawerOpen(true);
  };

  const openEditPage = (page: AdminPageItem) => {
    setEditingPageId(page.id);
    setPageDraft({
      slug: page.slug || '',
      title: page.title || '',
      metaDescription: page.metaDescription || '',
      isPublished: Boolean(page.isPublished),
    });
    setAutoSlug(false);
    setFormError(null);
    setPageDrawerMode('edit');
    setPageDrawerOpen(true);
  };

  const handleTitleChange = (newTitle: string) => {
    if (pageDrawerMode === 'create' || autoSlug) {
      setPageDraft({
        ...pageDraft,
        title: newTitle,
        slug: slugify(newTitle),
      });
    } else {
      setPageDraft({ ...pageDraft, title: newTitle });
    }
  };

  const handleSavePage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pageDraft.slug.trim() || !pageDraft.title.trim()) {
      setFormError('Slug and title are required.');
      return;
    }
    const payload = {
      slug: pageDraft.slug.trim().toLowerCase().replace(/^\/+|\/+$/g, ''),
      title: pageDraft.title.trim(),
      metaDescription: pageDraft.metaDescription.trim(),
      isPublished: pageDraft.isPublished,
    };
    try {
      setPageSaving(true);
      setFormError(null);
      if (pageDrawerMode === 'create') {
        const res = await apiClient.post('/admin/pages', payload);
        if (!res.data?.success) throw new Error(res.data?.message || 'Failed to create page');
        notify(`Page "${payload.title}" created successfully`);
      } else {
        const res = await apiClient.put(`/admin/pages/${editingPageId}`, payload);
        if (!res.data?.success) throw new Error(res.data?.message || 'Failed to update page');
        notify(`Page "${payload.title}" updated successfully`);
      }
      setPageDrawerOpen(false);
      refreshConfig?.();
      await fetchPages();
    } catch (err: any) {
      setFormError(err?.response?.data?.message || err?.message || 'Failed to save page');
    } finally {
      setPageSaving(false);
    }
  };

  const handleDeletePage = async () => {
    if (!deleteTarget) return;
    try {
      setBusyId(deleteTarget.id);
      const res = await apiClient.delete(`/admin/pages/${deleteTarget.id}`);
      if (!res.data?.success) throw new Error(res.data?.message || 'Failed to delete page');
      notify(`Page "${deleteTarget.title}" deleted`);
      setDeleteTarget(null);
      refreshConfig?.();
      await fetchPages();
    } catch (err: any) {
      notify(err?.response?.data?.message || err?.message || 'Failed to delete page', 'error');
      setDeleteTarget(null);
    } finally {
      setBusyId(null);
    }
  };

  const handleTogglePublish = async (page: AdminPageItem) => {
    try {
      setBusyId(page.id);
      const url =
        page.isPublished
          ? `/admin/pages/${page.id}/unpublish`
          : `/admin/pages/${page.id}/publish`;
      const res = await apiClient.post(url);
      if (!res.data?.success) throw new Error(res.data?.message || 'Publish action failed');
      notify(page.isPublished ? `Page "${page.title}" unpublished` : `Page "${page.title}" published`);
      refreshConfig?.();
      await fetchPages();
    } catch (err: any) {
      notify(err?.response?.data?.message || err?.message || 'Publish action failed', 'error');
    } finally {
      setBusyId(null);
    }
  };

  // ---------------- Sections ----------------

  const openSections = async (page: AdminPageItem) => {
    setSectionsPage(page);
    setSectionsLoading(true);
    setSectionsError(null);
    try {
      const res = await apiClient.get(`/admin/pages/${page.id}/sections`);
      const data = res.data?.data;
      const list = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : [];
      setSections(list);
      setPages((prev) =>
        prev.map((p) =>
          String(p.id) === String(page.id)
            ? { ...p, sections: list, sectionCount: list.length }
            : p
        )
      );
    } catch (err: any) {
      setSectionsError(err?.response?.data?.message || err?.message || 'Failed to load sections');
    } finally {
      setSectionsLoading(false);
    }
  };

  const closeSections = () => {
    setSectionsPage(null);
    setSections([]);
  };

  const openCreateSection = () => {
    setEditingSectionId(null);
    setSectionDraft({
      sectionType: 'HERO',
      title: '',
      subtitle: '',
      content: {},
      settings: {
        columns: 3,
        cardVariant: 'standard',
        alignment: 'center',
        background: 'light',
        spacing: 'normal',
        containerWidth: 'standard',
      },
      isVisible: true,
    });
    setSectionError(null);
    setSectionDrawerMode('create');
    setSectionDrawerOpen(true);
  };

  const openEditSection = (section: PageSection) => {
    setEditingSectionId(section.id);
    setSectionDraft({
      sectionType: section.sectionType || 'HERO',
      title: section.title || '',
      subtitle: section.subtitle || '',
      content: section.content || {},
      settings: section.settings || {
        columns: 3,
        cardVariant: 'standard',
        alignment: 'center',
        background: 'light',
        spacing: 'normal',
        containerWidth: 'standard',
      },
      isVisible: Boolean(section.isVisible),
    });
    setSectionError(null);
    setSectionDrawerMode('edit');
    setSectionDrawerOpen(true);
  };

  const handleSaveSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sectionsPage) return;
    if (!sectionDraft.sectionType) {
      setSectionError('Section type is required.');
      return;
    }
    const isEdit = sectionDrawerMode === 'edit';
    const existing = isEdit ? sections.find((s) => String(s.id) === String(editingSectionId)) : undefined;
    const payload = {
      sectionType: sectionDraft.sectionType,
      title: sectionDraft.title.trim(),
      subtitle: sectionDraft.subtitle.trim(),
      content: sectionDraft.content,
      settings: sectionDraft.settings,
      sortOrder: isEdit ? Number(existing?.sortOrder) || 1 : sections.length + 1,
      isVisible: sectionDraft.isVisible,
    };
    try {
      setSectionSaving(true);
      setSectionError(null);
      let succeeded = false;
      if (isEdit) {
        const res = await apiClient.put(
          `/admin/pages/${sectionsPage.id}/sections/${editingSectionId}`,
          payload
        );
        succeeded = Boolean(res.data?.success);
        if (!succeeded) throw new Error(res.data?.message || 'Failed to update section');
      } else {
        const res = await apiClient.post(`/admin/pages/${sectionsPage.id}/sections`, payload);
        succeeded = Boolean(res.data?.success);
        if (!succeeded) throw new Error(res.data?.message || 'Failed to add section');
      }
      notify(isEdit ? 'Section updated' : 'Section added');
      setSectionDrawerOpen(false);
      const fresh = await apiClient.get(`/admin/pages/${sectionsPage.id}/sections`);
      const data = fresh.data?.data;
      setSections(Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : []);
      refreshConfig?.();
      await fetchPages();
    } catch (err: any) {
      setSectionError(err?.response?.data?.message || err?.message || 'Failed to save section');
    } finally {
      setSectionSaving(false);
    }
  };

  const handleDeleteSection = async () => {
    if (!deleteSectionTarget || !sectionsPage) return;
    try {
      setBusyId(deleteSectionTarget.id);
      const res = await apiClient.delete(
        `/admin/pages/${sectionsPage.id}/sections/${deleteSectionTarget.id}`
      );
      if (!res.data?.success) throw new Error(res.data?.message || 'Failed to delete section');
      notify('Section deleted');
      setDeleteSectionTarget(null);
      setSections((prev) => prev.filter((s) => String(s.id) !== String(deleteSectionTarget.id)));
      refreshConfig?.();
      await fetchPages();
    } catch (err: any) {
      notify(err?.response?.data?.message || err?.message || 'Failed to delete section', 'error');
      setDeleteSectionTarget(null);
    } finally {
      setBusyId(null);
    }
  };

  const handleToggleSectionVisibility = async (section: PageSection) => {
    if (!sectionsPage) return;
    try {
      setBusyId(section.id);
      const res = await apiClient.put(
        `/admin/pages/${sectionsPage.id}/sections/${section.id}`,
        {
          sectionType: section.sectionType,
          title: section.title || '',
          subtitle: section.subtitle || '',
          content: section.content || {},
          sortOrder: Number(section.sortOrder) || 1,
          isVisible: !section.isVisible,
        }
      );
      if (!res.data?.success) throw new Error(res.data?.message || 'Visibility update failed');
      setSections((prev) =>
        prev.map((s) =>
          String(s.id) === String(section.id) ? { ...s, isVisible: !s.isVisible } : s
        )
      );
      notify('Section visibility updated');
      refreshConfig?.();
    } catch (err: any) {
      notify(err?.response?.data?.message || err?.message || 'Visibility update failed', 'error');
    } finally {
      setBusyId(null);
    }
  };

  const handleReorder = async (index: number, dir: -1 | 1) => {
    if (!sectionsPage) return;
    const target = index + dir;
    if (target < 0 || target >= sections.length) return;
    const next = [...sections];
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item);
    const ordered = next.map((s, i) => ({ ...s, sortOrder: i + 1 }));

    setSections(ordered.map((s, i) => ({ ...s, sortOrder: i + 1 })));
    setsectionIdOrderRunning(String(item.id));
    try {
      const res = await apiClient.put(`/admin/pages/${sectionsPage.id}/sections/reorder`, {
        sectionIds: ordered.map((s) => String(s.id)),
      });
      if (!res.data?.success) throw new Error(res.data?.message || 'Reorder failed');
      notify('Section order saved');
      refreshConfig?.();
    } catch (err: any) {
      notify(err?.response?.data?.message || err?.message || 'Reorder failed', 'error');
      await openSections(sectionsPage);
    } finally {
      setsectionIdOrderRunning(null);
    }
  };

  const [sectionIdOrderRunning, setsectionIdOrderRunning] = useState<string | number | null>(null);
  const [isSeedingSections, setIsSeedingSections] = useState(false);

  const handleSeedDefaultSections = async () => {
    if (!sectionsPage) return;
    setIsSeedingSections(true);
    try {
      // 1. Try dedicated backend seed endpoint
      try {
        const res = await apiClient.post(`/admin/pages/${sectionsPage.id}/sections/seed-default`);
        if (res.data?.success) {
          const list = res.data.data;
          setSections(Array.isArray(list) ? list : []);
          notify('All default college module sections synchronized successfully!');
          refreshConfig?.();
          await fetchPages();
          return;
        }
      } catch (e) {
        console.warn('Backend seed-default endpoint returned error, using direct API sync fallback...', e);
      }

      // 2. Fallback: Add missing sections via standard section POST API
      const existingTypes = new Set(sections.map((s) => s.sectionType?.toUpperCase()));
      const defaultBlueprint = [
        { type: 'HERO_SLIDER', title: 'Hero Slider & Highlights', subtitle: 'Campus showcase and online admissions call to action' },
        { type: 'STATISTICS', title: 'Key Statistics & Milestones', subtitle: 'Institutional track record, accreditations, and student excellence' },
        { type: 'QUOTE', title: 'Leadership & Vision', subtitle: 'Message from the Chancellor & Academic Directorate' },
        { type: 'DEPARTMENTS', title: 'Academic Departments', subtitle: 'Specialized schools offering cutting-edge undergraduate & postgraduate disciplines' },
        { type: 'COURSES', title: 'Degree Programs & Curricula', subtitle: 'Industry-aligned academic pathways and career-oriented certifications' },
        { type: 'FACULTY', title: 'Distinguished Faculty', subtitle: 'Renowned professors, doctorate researchers, and industry fellows' },
        { type: 'NEWS', title: 'Latest Campus News', subtitle: 'Campus events, research breakthroughs, honors, and press announcements' },
        { type: 'EVENTS', title: 'Upcoming Campus Events', subtitle: 'Academic conferences, symposiums, student fests, and cultural celebrations' },
        { type: 'NOTICES', title: 'Official Notice Board', subtitle: 'Important administrative updates, examination schedules, and circulars' },
        { type: 'GALLERY', title: 'Campus Photo Gallery', subtitle: 'A visual journey across our world-class laboratories, library, and campus architecture' },
        { type: 'TESTIMONIALS', title: 'Placement Records & Testimonials', subtitle: 'Top corporate recruiters and success stories from our graduates' },
        { type: 'CONTACT', title: 'Campus Helpdesk & Location', subtitle: 'Reach our admissions desk, administrative offices, and visit our campus' },
      ];

      let currentMaxSort = sections.length;
      for (const item of defaultBlueprint) {
        const hasHero = existingTypes.has('HERO') || existingTypes.has('HERO_SLIDER');
        if (item.type === 'HERO_SLIDER' && hasHero) continue;
        if (existingTypes.has(item.type)) continue;

        currentMaxSort++;
        await apiClient.post(`/admin/pages/${sectionsPage.id}/sections`, {
          sectionType: item.type,
          title: item.title,
          subtitle: item.subtitle,
          content: {},
          settings: {
            columns: 3,
            cardVariant: 'standard',
            alignment: 'center',
            background: 'light',
            spacing: 'normal',
            containerWidth: 'standard',
          },
          sortOrder: currentMaxSort,
          isVisible: true,
        });
      }

      const fresh = await apiClient.get(`/admin/pages/${sectionsPage.id}/sections`);
      const data = fresh.data?.data;
      const updatedList = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : [];
      setSections(updatedList);
      notify('All default college module sections populated successfully!');
      refreshConfig?.();
      await fetchPages();
    } catch (err: any) {
      notify(err?.response?.data?.message || err?.message || 'Failed to auto-seed sections', 'error');
    } finally {
      setIsSeedingSections(false);
    }
  };

  // ---------------- Render helpers ----------------

  const sectionTypeLabel = (code: string) => {
    const found = sectionTypes.find((t) => t.code.toUpperCase() === code?.toUpperCase());
    return found?.name || code;
  };

  const filteredPages = useMemo(() => {
    if (!search.trim()) return pages;
    const q = search.toLowerCase();
    return pages.filter(
      (p) => p.title?.toLowerCase().includes(q) || p.slug?.toLowerCase().includes(q)
    );
  }, [pages, search]);

  const enabledFeatures = siteConfig?.enabledFeatures || [];
  const featureSectionMapping: Record<string, string> = {
    NEWS: 'NEWS',
    EVENTS: 'EVENTS',
    DEPARTMENTS: 'DEPARTMENTS',
    COURSES: 'COURSES',
    FACULTY: 'FACULTY',
    GALLERY: 'GALLERY',
    STATISTICS: 'STATS',
    STATS: 'STATS',
    HERO_SLIDER: 'BANNERS',
    BANNERS: 'BANNERS',
  };

  const allSectionOptions = useMemo(() => {
    return sectionTypes
      .filter((t) => {
        const req = featureSectionMapping[t.code.toUpperCase()];
        if (!req) return true;
        return enabledFeatures.includes(req.toUpperCase());
      })
      .map((t) => ({ value: t.code, label: t.name || t.code }));
  }, [sectionTypes, enabledFeatures]);

  const sectionDraftTypeEditable = sectionDrawerOpen && sectionDrawerMode === 'create';

  return (
    <div className="space-y-6 font-sans text-slate-900 dark:text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-blue-600" />
            <span>Pages & Sections</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Build and customize every page of the website — hero banners, text blocks, CTAs, sliders and more — entirely from the CMS.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => openPreview('Full Website Preview')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition cursor-pointer shadow-2xs"
          >
            <Globe className="w-4 h-4 text-blue-600" />
            Preview Site
          </button>
          <button
            onClick={fetchPages}
            disabled={loading}
            className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-semibold transition shadow-2xs cursor-pointer"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={openCreatePage}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-primary hover:opacity-90 transition cursor-pointer shadow-sm shadow-primary/20"
          >
            <Plus className="w-4 h-4" />
            Create Page
          </button>
        </div>
      </div>

      {/* Notices */}
      {notice && (
        <div
          className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-semibold border ${
            notice.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300'
              : 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900 text-red-700 dark:text-red-300'
          }`}
        >
          {notice.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <XCircle className="w-4 h-4 shrink-0" />
          )}
          {notice.text}
        </div>
      )}

      {/* List Panel */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Layers3 className="w-4 h-4 text-primary" />
            <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
              Website Pages ({filteredPages.length})
            </span>
          </div>
          <div className="relative sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or slug..."
              className="w-full py-2 pl-9 pr-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          </div>
        ) : error ? (
          <div className="flex items-center gap-2.5 px-5 py-14 text-sm text-red-600 dark:text-red-400 justify-center">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        ) : filteredPages.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <FileText className="w-6 h-6 text-slate-400" />
            </div>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              {search ? 'No pages match your search' : 'No pages yet'}
            </p>
            {!search && (
              <button
                onClick={openCreatePage}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-primary hover:opacity-90 transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Create your first page
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40">
                  <th className="px-5 py-3 text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Page
                  </th>
                  <th className="px-4 py-3 text-[10px] font-black uppercase tracking-wider text-slate-400">
                    URL Slug
                  </th>
                  <th className="px-4 py-3 text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Status
                  </th>
                  <th className="px-4 py-3 text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Version
                  </th>
                  <th className="px-4 py-3 text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Sections
                  </th>
                  <th className="px-4 py-3 text-[10px] font-black uppercase tracking-wider text-slate-400 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPages.map((page) => (
                  <tr
                    key={page.id}
                    className="border-b border-slate-50 dark:border-slate-800/60 hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                          <Layers className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                            {page.title || '(Untitled)'}
                          </p>
                          {page.metaDescription && (
                            <p className="text-[10px] text-slate-400 truncate max-w-[280px]">
                              {page.metaDescription}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="inline-flex items-center gap-1.5 bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded border border-blue-100 dark:border-blue-900/50">
                        <code className="text-[11px] font-mono text-blue-600 dark:text-blue-400 font-semibold">
                          /{page.slug || '—'}
                        </code>
                        {page.slug && (
                          <button
                            type="button"
                            onClick={() => {
                              copyToClipboard(`/${page.slug}`);
                              notify(`Copied "/${page.slug}" to clipboard!`);
                            }}
                            className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-300 transition cursor-pointer p-0.5"
                            title="Copy URL slug"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${
                          page.isPublished
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            page.isPublished ? 'bg-emerald-500' : 'bg-slate-400'
                          }`}
                        />
                        {page.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs font-mono text-slate-600 dark:text-slate-300">
                        v{page.currentVersion ?? 1}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <button
                        onClick={() => openSections(page)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition cursor-pointer"
                      >
                        <Layers3 className="w-3.5 h-3.5" />
                        {page.sectionCount ?? page.sections?.length ?? 0}
                      </button>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleTogglePublish(page)}
                          disabled={busyId === page.id}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition cursor-pointer disabled:opacity-40"
                          title={page.isPublished ? 'Unpublish page' : 'Publish page'}
                        >
                          {busyId === page.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : page.isPublished ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => openPreviewPage(page)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition cursor-pointer"
                          title="Preview Live / Draft Page"
                        >
                          <Globe className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditPage(page)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition cursor-pointer"
                          title="Edit page details"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(page)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition cursor-pointer"
                          title="Delete page"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ---------- Page Create/Edit Drawer ---------- */}
      <FormDrawer
        isOpen={pageDrawerOpen}
        onClose={() => !pageSaving && setPageDrawerOpen(false)}
        title={pageDrawerMode === 'create' ? 'Create Page' : 'Edit Page'}
        subtitle="Configure the page slug, title and publish state"
        icon={<FileText className="w-4 h-4" />}
        mode={pageDrawerMode}
        loading={pageSaving}
        onSubmit={handleSavePage}
        size="md"
      >
        {formError && (
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-[11px] font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            {formError}
          </div>
        )}

        <Input
          label="Title"
          required
          value={pageDraft.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="e.g. Campus Life"
        />

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
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
                onClick={() => setPageDraft({ ...pageDraft, slug: slugify(pageDraft.title) })}
                className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200 dark:bg-slate-800 dark:text-slate-400 flex items-center gap-1 transition cursor-pointer"
                title="Regenerate slug from current title"
              >
                <RotateCcw className="w-2.5 h-2.5" />
                <span>Sync</span>
              </button>
            </div>
          </div>
          <Input
            value={pageDraft.slug}
            onChange={(e) => {
              setAutoSlug(false);
              setPageDraft({ ...pageDraft, slug: e.target.value.replace(/\s+/g, '-') });
            }}
            placeholder="e.g. campus-life"
            leftIcon={<Layers className="w-3.5 h-3.5" />}
            helperText="Used in the public URL: /campus-life"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Meta Description
          </label>
          <textarea
            rows={3}
            value={pageDraft.metaDescription}
            onChange={(e) => setPageDraft({ ...pageDraft, metaDescription: e.target.value })}
            placeholder="Short SEO description shown in search results"
            className="w-full py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 transition focus:outline-none focus:ring-2 focus:ring-blue-500 px-3"
          />
        </div>

        <Switch
          checked={pageDraft.isPublished}
          onChange={(v) => setPageDraft({ ...pageDraft, isPublished: v })}
          label="Publish immediately"
          description="When enabled the page is live on the public website."
        />
      </FormDrawer>

      {/* ---------- Sections Drawer ---------- */}
      <Drawer
        isOpen={Boolean(sectionsPage)}
        onClose={closeSections}
        title={sectionsPage ? `Sections — ${sectionsPage.title}` : 'Page Sections'}
        subtitle="Add, reorder, edit or hide content sections on this page"
        icon={<Layers3 className="w-4 h-4" />}
        size="xl"
        closeOnOutsideClick={false}
        footer={
          <div className="flex items-center justify-between gap-3 w-full">
            <button
              type="button"
              onClick={handleSeedDefaultSections}
              disabled={isSeedingSections || sectionsLoading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900 transition cursor-pointer shadow-xs disabled:opacity-50"
              title="Populate missing standard college module sections (Hero, Stats, Quote, Departments, Courses, Faculty, News, Events, Notices, Gallery, Placements, Contact)"
            >
              <Sparkles className={`w-4 h-4 ${isSeedingSections ? 'animate-spin' : 'text-indigo-600'}`} />
              <span>{isSeedingSections ? 'Syncing Sections...' : '⚡ Auto-Generate All Sections'}</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={closeSections}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={openCreateSection}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-primary hover:opacity-90 transition cursor-pointer shadow-sm shadow-primary/20"
              >
                <Plus className="w-4 h-4" />
                Add Custom Section
              </button>
            </div>
          </div>
        }
      >
        {sectionsLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          </div>
        ) : sectionsError ? (
          <div className="flex items-center gap-2.5 px-4 py-10 text-sm text-red-600 dark:text-red-400 justify-center">
            <AlertCircle className="w-5 h-5" />
            {sectionsError}
          </div>
        ) : sections.length === 0 ? (
          <div className="py-14 text-center space-y-4">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center shadow-xs">
              <Sparkles className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                This page has no sections configured yet
              </p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                You can auto-generate the complete suite of institutional sections with 1-click or add custom sections manually.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={handleSeedDefaultSections}
                disabled={isSeedingSections}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-md shadow-indigo-200 dark:shadow-none cursor-pointer"
              >
                <Sparkles className={`w-4 h-4 ${isSeedingSections ? 'animate-spin' : ''}`} />
                <span>{isSeedingSections ? 'Populating...' : '⚡ Auto-Generate All College Module Sections'}</span>
              </button>
              <button
                onClick={openCreateSection}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add Single Section
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Quick Setup Recommendation Banner when Home page has fewer than 6 sections */}
            {sectionsPage?.slug === 'home' && sections.length < 8 && (
              <div className="p-3.5 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-indigo-900 dark:text-indigo-200">
                      Home Page Quick-Setup Available
                    </p>
                    <p className="text-[11px] text-indigo-700/80 dark:text-indigo-300/80 leading-relaxed">
                      Your home page currently has {sections.length} section(s). Click to sync all 12 default modules (Hero, Stats, Quote, Departments, Courses, Faculty, News, Events, Notices, Gallery, Placements, Contact).
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleSeedDefaultSections}
                  disabled={isSeedingSections}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-xs shrink-0 self-end sm:self-auto cursor-pointer"
                >
                  {isSeedingSections ? 'Syncing...' : 'Sync All 12 Sections'}
                </button>
              </div>
            )}

            <div className="flex items-center justify-between px-1 text-[11px] text-slate-400 font-semibold">
              <div className="flex items-center gap-2">
                <LayoutTemplate className="w-3.5 h-3.5" />
                <span>
                  {sections.length} section{sections.length !== 1 ? 's' : ''} on page — use arrows (↑ ↓) to reorder scroll sequence
                </span>
              </div>
              <button
                type="button"
                onClick={handleSeedDefaultSections}
                disabled={isSeedingSections}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3 h-3" />
                <span>Sync Modules</span>
              </button>
            </div>

            {sections.map((section, index) => {
              const isModule = [
                'HERO', 'HERO_SLIDER', 'BANNERS', 'STATISTICS', 'STATS', 'QUOTE', 
                'DEPARTMENTS', 'COURSES', 'FACULTY', 'NEWS', 'EVENTS', 'NOTICES', 
                'GALLERY', 'TESTIMONIALS', 'PLACEMENTS', 'CONTACT', 'MAP'
              ].includes(section.sectionType?.toUpperCase());

              return (
                <div
                  key={section.id}
                  className={`p-3.5 rounded-2xl border transition shadow-2xs ${
                    !section.isVisible
                      ? 'border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950/40 opacity-70'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-[11px] font-black text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg min-w-[28px] text-center font-mono">
                        {index + 1}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                            {section.title || sectionTypeLabel(section.sectionType)}
                          </p>
                          {isModule && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900/50">
                              <Sparkles className="w-2.5 h-2.5 text-blue-600" />
                              <span>{section.sectionType.toUpperCase()}</span>
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">
                          {sectionTypeLabel(section.sectionType)}
                          {section.subtitle ? ` — ${section.subtitle}` : ''}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <span
                        className={`hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          section.isVisible
                            ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {section.isVisible ? 'Visible' : 'Hidden'}
                      </span>
                      <button
                        onClick={() => handleReorder(index, -1)}
                        disabled={index === 0 || sectionIdOrderRunning !== null}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition disabled:opacity-30 cursor-pointer"
                        title="Move up (scrolls earlier on homepage)"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleReorder(index, 1)}
                        disabled={index === sections.length - 1 || sectionIdOrderRunning !== null}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition disabled:opacity-30 cursor-pointer"
                        title="Move down (scrolls later on homepage)"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleToggleSectionVisibility(section)}
                        disabled={busyId === section.id}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition cursor-pointer disabled:opacity-40"
                        title={section.isVisible ? 'Hide from public site' : 'Make visible on public site'}
                      >
                        {busyId === section.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : section.isVisible ? (
                          <EyeOff className="w-3.5 h-3.5" />
                        ) : (
                          <Eye className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        onClick={() => openEditSection(section)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition cursor-pointer"
                        title="Edit section"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteSectionTarget(section)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition cursor-pointer"
                        title="Delete section"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Drawer>

      {/* ---------- Section Create/Edit Drawer ---------- */}
      <FormDrawer
        isOpen={sectionDrawerOpen}
        onClose={() => !sectionSaving && setSectionDrawerOpen(false)}
        title={sectionDrawerMode === 'create' ? 'Add Section' : 'Edit Section'}
        subtitle={
          sectionDrawerMode === 'create'
            ? 'Choose a section type and fill in its content'
            : 'Modify this section’s content, visibility or order'
        }
        icon={<LayoutTemplate className="w-4 h-4" />}
        mode={sectionDrawerMode}
        loading={sectionSaving}
        onSubmit={handleSaveSection}
        size="xl"
      >
        {sectionError && (
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-[11px] font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            {sectionError}
          </div>
        )}

        {sectionDraftTypeEditable && (
          <Select
            label="Section Type"
            required
            value={sectionDraft.sectionType}
            onChange={(e) =>
              setSectionDraft({ ...sectionDraft, sectionType: e.target.value, content: {} })
            }
            options={allSectionOptions}
            helperText="The section type determines how the content is rendered on the live site."
          />
        )}

        {!sectionDraftTypeEditable && (
          <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900">
            <div>
              <p className="text-[11px] font-bold text-blue-700 dark:text-blue-300">
                {sectionTypeLabel(sectionDraft.sectionType)}
              </p>
              <p className="text-[10px] text-blue-500 dark:text-blue-400">
                Section type is locked after creation
              </p>
            </div>
            <LayoutTemplate className="w-4 h-4 text-blue-400" />
          </div>
        )}

        <Input
          label="Section Title"
          value={sectionDraft.title}
          onChange={(e) => setSectionDraft({ ...sectionDraft, title: e.target.value })}
          placeholder="Visible heading for this section (optional)"
        />

        <Input
          label="Section Subtitle"
          value={sectionDraft.subtitle}
          onChange={(e) => setSectionDraft({ ...sectionDraft, subtitle: e.target.value })}
          placeholder="Short supporting line (optional)"
        />

        <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
          <p className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-3">
            Section Content
          </p>
          <SectionContentEditor
            sectionType={sectionDraft.sectionType}
            content={sectionDraft.content}
            onChange={(content) => setSectionDraft({ ...sectionDraft, content })}
          />
        </div>

        {/* Visual Design Settings Inspector Panel */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Visual Design & Layout Inspector
            </p>
            <span className="text-[10px] text-slate-400">Template-aware dynamic styles</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Layout Columns"
              value={String(sectionDraft.settings?.columns || 3)}
              onChange={(e) =>
                setSectionDraft({
                  ...sectionDraft,
                  settings: { ...sectionDraft.settings, columns: Number(e.target.value) || 3 },
                })
              }
              options={[
                { value: '1', label: '1 Column (Full Row)' },
                { value: '2', label: '2 Columns (Split)' },
                { value: '3', label: '3 Columns (Standard Grid)' },
                { value: '4', label: '4 Columns (Compact Grid)' },
              ]}
            />

            <Select
              label="Card Style Variant"
              value={sectionDraft.settings?.cardVariant || 'standard'}
              onChange={(e) =>
                setSectionDraft({
                  ...sectionDraft,
                  settings: { ...sectionDraft.settings, cardVariant: e.target.value as any },
                })
              }
              options={[
                { value: 'standard', label: 'Standard Flat' },
                { value: 'elevated', label: 'Elevated Shadow' },
                { value: 'bordered', label: 'Bordered Accent' },
                { value: 'minimal', label: 'Minimal Ghost' },
              ]}
            />

            <Select
              label="Content Alignment"
              value={sectionDraft.settings?.alignment || 'center'}
              onChange={(e) =>
                setSectionDraft({
                  ...sectionDraft,
                  settings: { ...sectionDraft.settings, alignment: e.target.value as any },
                })
              }
              options={[
                { value: 'left', label: 'Left Aligned' },
                { value: 'center', label: 'Center Aligned' },
              ]}
            />

            <Select
              label="Section Background"
              value={sectionDraft.settings?.background || 'light'}
              onChange={(e) =>
                setSectionDraft({
                  ...sectionDraft,
                  settings: { ...sectionDraft.settings, background: e.target.value as any },
                })
              }
              options={[
                { value: 'light', label: 'Light / Crisp White' },
                { value: 'muted', label: 'Muted Slate Gray' },
                { value: 'dark', label: 'Dark Navy Contrast' },
                { value: 'gradient', label: 'Theme Primary Gradient' },
              ]}
            />

            <Select
              label="Vertical Spacing (Padding)"
              value={sectionDraft.settings?.spacing || 'normal'}
              onChange={(e) =>
                setSectionDraft({
                  ...sectionDraft,
                  settings: { ...sectionDraft.settings, spacing: e.target.value as any },
                })
              }
              options={[
                { value: 'compact', label: 'Compact (Py-8)' },
                { value: 'normal', label: 'Normal (Py-16)' },
                { value: 'large', label: 'Spacious (Py-24)' },
              ]}
            />

            <Select
              label="Container Width"
              value={sectionDraft.settings?.containerWidth || 'standard'}
              onChange={(e) =>
                setSectionDraft({
                  ...sectionDraft,
                  settings: { ...sectionDraft.settings, containerWidth: e.target.value as any },
                })
              }
              options={[
                { value: 'narrow', label: 'Narrow (Max-W-4XL)' },
                { value: 'standard', label: 'Standard (Max-W-7XL)' },
                { value: 'full', label: 'Edge-to-Edge Fluid' },
              ]}
            />
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <Switch
            checked={sectionDraft.isVisible}
            onChange={(v) => setSectionDraft({ ...sectionDraft, isVisible: v })}
            label="Make this section visible"
            description="Hidden sections stay saved but are not rendered on the live page."
          />
        </div>
      </FormDrawer>

      {/* ---------- Delete Page Confirm ---------- */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeletePage}
        title="Delete page?"
        message={`This permanently deletes "${deleteTarget?.title}" and all of its sections. This action cannot be undone.`}
        confirmText="Delete page"
        variant="danger"
        loading={Boolean(deleteTarget?.id && busyId === deleteTarget.id)}
      />

      {/* ---------- Delete Section Confirm ---------- */}
      <ConfirmDialog
        isOpen={Boolean(deleteSectionTarget)}
        onClose={() => setDeleteSectionTarget(null)}
        onConfirm={handleDeleteSection}
        title="Delete section?"
        message="This permanently deletes this section. This action cannot be undone."
        confirmText="Delete section"
        variant="danger"
        loading={Boolean(deleteSectionTarget?.id && busyId === deleteSectionTarget.id)}
      />

      {/* Live preview modal */}
      <LivePreviewModal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        urlPath={previewUrlPath}
        title={previewTitle || `${collegeName} - Live Website Preview`}
      />
    </div>
  );
};