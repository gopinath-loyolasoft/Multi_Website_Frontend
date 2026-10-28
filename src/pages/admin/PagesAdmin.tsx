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
  ClipboardCopy,
  ClipboardPaste,
  FolderDown,
  Download,
  Files,
  ExternalLink,
} from 'lucide-react';
import { apiClient } from '../../services/apiClient';
import { useTenant } from '../../tenant/TenantContext';
import { PageSection, SectionSettings } from '../../types';
import { FormDrawer, Drawer, Input, Select, Switch, LivePreviewModal, ConfirmDialog } from '../../UI_Componentes/ui';
import { SectionContentEditor } from '../../components/admin/SectionContentEditor';
import { SectionWizardDrawer } from '../../components/admin/SectionWizardDrawer';
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
  { code: 'CUSTOM_CANVAS', name: 'Visual Drag & Drop Canvas' },
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
  { code: 'DOCUMENTS', name: 'Document / PDF Downloads' },
  { code: 'TABLE', name: 'Data Table / Matrix' },
  { code: 'TIMELINE', name: 'Timeline / Milestones' },
  { code: 'TABS', name: 'Tabs / Switchable Content' },
  { code: 'TESTIMONIALS', name: 'Testimonials / Stories' },
  { code: 'EMBED', name: 'Embed / Virtual Tour' },
  { code: 'NEWS', name: 'News Feed' },
  { code: 'EVENTS', name: 'Events Feed' },
  { code: 'NOTICES', name: 'Notices' },
  { code: 'COURSES', name: 'Courses & Programs' },
  { code: 'DEPARTMENTS', name: 'Departments' },
  { code: 'FACULTY', name: 'Faculty' },
  { code: 'PLACEMENTS', name: 'Placement Partners (Logo Marquee)' },
  { code: 'COMPLIANCE', name: 'Mandatory Disclosures & Statutory Compliance' },
  { code: 'HOSTELS', name: 'Hostel & Mess Facilities' },
  { code: 'TRANSPORT', name: 'Transport & Bus Routes' },
  { code: 'LIBRARY', name: 'Library & E-Resources' },
  { code: 'ALUMNI', name: 'Alumni Network & Spotlight' },
  { code: 'GALLERY', name: 'Gallery' },
  { code: 'CTA', name: 'Call to Action' },
  { code: 'CALL_TO_ACTION', name: 'Call to Action (alias)' },
  { code: 'VIDEO', name: 'Video' },
  { code: 'LOGO_GRID', name: 'Logo Grid' },
  { code: 'FAQ', name: 'FAQ' },
  { code: 'CONTACT', name: 'Contact Form' },
  { code: 'MAP', name: 'Map' },
];

export interface SystemModulePreset {
  type: string;
  name: string;
  category: 'ACADEMICS' | 'FACILITIES' | 'COMPLIANCE_PLACEMENTS' | 'MEDIA_NEWS' | 'CONTENT';
  categoryLabel: string;
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
}

export const SYSTEM_MODULE_PRESETS: SystemModulePreset[] = [
  {
    type: 'PLACEMENTS',
    name: 'Placement Partners (Logo Marquee & CTC)',
    category: 'COMPLIANCE_PLACEMENTS',
    categoryLabel: 'Corporate & Placements',
    icon: '🏢',
    title: 'Placement Partners',
    subtitle: 'Our students are placed in leading global organizations',
    description: 'Continuous animated right-to-left logo marquee of corporate recruiters, hiring companies, and CTC salary highlights.',
    badge: 'Corporate',
  },
  {
    type: 'COMPLIANCE',
    name: 'Mandatory Disclosures & Statutory Compliance',
    category: 'COMPLIANCE_PLACEMENTS',
    categoryLabel: 'Corporate & Compliance',
    icon: '📄',
    title: 'Mandatory Disclosures & Statutory Compliance',
    subtitle: 'Official statutory compliance documents and AICTE regulatory disclosures',
    description: 'AICTE, UGC, NAAC, NIRF approval letters, anti-ragging policies, and searchable PDF circulars.',
    badge: 'Compliance',
  },
  {
    type: 'TRANSPORT',
    name: 'Campus Transport & Bus Services',
    category: 'FACILITIES',
    categoryLabel: 'Campus Facilities',
    icon: '🚌',
    title: 'Campus Transport & Bus Services',
    subtitle: 'Comprehensive fleet connecting major transit hubs to campus',
    description: 'College bus route schedules, pickup stops, departure timings, bus numbers, and driver contact cards.',
    badge: 'Transit',
  },
  {
    type: 'HOSTELS',
    name: 'Hostels & Residential Living',
    category: 'FACILITIES',
    categoryLabel: 'Campus Facilities',
    icon: '🏠',
    title: 'Hostels & Residential Facilities',
    subtitle: 'Safe, comfortable, and modern campus housing for students',
    description: 'Boys & Girls hostel capacity, room types (AC/Non-AC), amenities, mess menu, and warden contacts.',
    badge: 'Living',
  },
  {
    type: 'LIBRARY',
    name: 'Central Library & E-Resources',
    category: 'FACILITIES',
    categoryLabel: 'Campus Facilities',
    icon: '📚',
    title: 'Central Library & Learning Resources',
    subtitle: 'Access e-journals, previous question papers, and academic repositories',
    description: 'Digital library catalog, previous question papers, IEEE e-journals, and departmental book archives.',
    badge: 'Library',
  },
  {
    type: 'ALUMNI',
    name: 'Alumni Network & Spotlight',
    category: 'COMPLIANCE_PLACEMENTS',
    categoryLabel: 'Corporate & Placements',
    icon: '🎓',
    title: 'Distinguished Alumni',
    subtitle: 'Celebrating our graduates leading industries around the globe',
    description: 'Distinguished alumni career stories, graduation batch years, designations, and global company spotlights.',
    badge: 'Alumni',
  },
  {
    type: 'DEPARTMENTS',
    name: 'Academic Departments & Schools',
    category: 'ACADEMICS',
    categoryLabel: 'Academics & Degrees',
    icon: '🏛️',
    title: 'Academic Departments',
    subtitle: 'Specialized schools offering cutting-edge undergraduate & postgraduate disciplines',
    description: 'Specialized engineering, science, arts, management, and medical school profiles with lab specifications.',
    badge: 'Academics',
  },
  {
    type: 'COURSES',
    name: 'Courses & Degree Programs',
    category: 'ACADEMICS',
    categoryLabel: 'Academics & Degrees',
    icon: '🎓',
    title: 'Courses & Programs',
    subtitle: 'Industry-aligned degree tracks designed for professional success',
    description: 'Undergraduate, Postgraduate, Diploma, and Ph.D. program cards with duration and eligibility badges.',
    badge: 'Degrees',
  },
  {
    type: 'FACULTY',
    name: 'Distinguished Faculty Directory',
    category: 'ACADEMICS',
    categoryLabel: 'Academics & Degrees',
    icon: '👨‍🏫',
    title: 'Distinguished Faculty',
    subtitle: 'Renowned researchers, doctorate scholars, and industry fellows',
    description: 'Professor headshots, academic designations, department affiliations, and research areas.',
    badge: 'Faculty',
  },
  {
    type: 'NEWS',
    name: 'Campus News & Publications',
    category: 'MEDIA_NEWS',
    categoryLabel: 'Media & Updates',
    icon: '📰',
    title: 'Latest Campus News',
    subtitle: 'Discover research breakthroughs, honors, and campus updates',
    description: 'Dynamic news articles, press releases, research publications, and campus milestones with date tags.',
    badge: 'News',
  },
  {
    type: 'EVENTS',
    name: 'Upcoming Campus Events & Fests',
    category: 'MEDIA_NEWS',
    categoryLabel: 'Media & Updates',
    icon: '📅',
    title: 'Upcoming Campus Events',
    subtitle: 'Academic conferences, symposiums, student fests, and cultural celebrations',
    description: 'Interactive events cards with calendar badges, venue details, and registration links.',
    badge: 'Events',
  },
  {
    type: 'NOTICES',
    name: 'Official Notice Board',
    category: 'MEDIA_NEWS',
    categoryLabel: 'Media & Updates',
    icon: '📢',
    title: 'Official Notice Board',
    subtitle: 'Important administrative updates, examination schedules, and circulars',
    description: 'Pinned administrative circulars, exam notifications, and downloadable notices.',
    badge: 'Notices',
  },
  {
    type: 'GALLERY',
    name: 'Campus Photo Gallery',
    category: 'MEDIA_NEWS',
    categoryLabel: 'Media & Updates',
    icon: '🖼️',
    title: 'Campus Photo Gallery',
    subtitle: 'A visual journey across our world-class facilities',
    description: 'Curated photo grid showcasing campus architecture, labs, library, auditoriums, and sports grounds.',
    badge: 'Gallery',
  },
  {
    type: 'TESTIMONIALS',
    name: 'Student & Alumni Testimonials',
    category: 'CONTENT',
    categoryLabel: 'Content & Impact',
    icon: '💬',
    title: 'Voices of Our Achievers',
    subtitle: 'Read authentic reflections from graduates shaping global industries',
    description: 'Student quotes, star ratings, career reflections, and recruiter testimonials.',
    badge: 'Stories',
  },
  {
    type: 'STATISTICS',
    name: 'Statistics & Milestone Counters',
    category: 'CONTENT',
    categoryLabel: 'Content & Impact',
    icon: '📊',
    title: 'Campus at a Glance',
    subtitle: 'Excellence in numbers — ranking, placements, research & community',
    description: 'Animated counters for student enrollment, placement percentage, campus acres, and NIRF rank.',
    badge: 'Stats',
  },
  {
    type: 'QUOTE',
    name: 'Leadership & Vision Message',
    category: 'CONTENT',
    categoryLabel: 'Content & Impact',
    icon: '✍️',
    title: 'Leadership & Vision',
    subtitle: 'Message from the Chancellor & Academic Directorate',
    description: 'Chancellor, President, or Dean portrait photo, inspiring vision quote, and governance title.',
    badge: 'Leadership',
  },
  {
    type: 'FAQ',
    name: 'Frequently Asked Questions',
    category: 'CONTENT',
    categoryLabel: 'Content & Impact',
    icon: '❓',
    title: 'Frequently Asked Questions',
    subtitle: 'Clear answers to common questions about admissions, fees, hostel, and academics',
    description: 'Accordion FAQ items addressing admissions criteria, hostel rules, scholarship options, and fees.',
    badge: 'FAQ',
  },
  {
    type: 'CONTACT',
    name: 'Campus Helpdesk & Location Map',
    category: 'CONTENT',
    categoryLabel: 'Content & Impact',
    icon: '📍',
    title: 'Campus Helpdesk & Location',
    subtitle: 'Reach our admissions desk, administrative offices, and visit our campus',
    description: 'Interactive contact form, admissions hotline, email address, and Google Maps location.',
    badge: 'Contact',
  },
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
  const [editingSectionObj, setEditingSectionObj] = useState<PageSection | null>(null);
  const [sectionSaving, setSectionSaving] = useState(false);
  const [sectionError, setSectionError] = useState<string | null>(null);
  const [sectionTypes, setSectionTypes] = useState<SectionTypeItem[]>(SECTION_TYPE_CATALOG);

  const [busyId, setBusyId] = useState<string | number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminPageItem | null>(null);
  const [deleteSectionTarget, setDeleteSectionTarget] = useState<PageSection | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewTitle, setPreviewTitle] = useState('Website Live Preview');
  const [previewUrlPath, setPreviewUrlPath] = useState('/');

  // Copy / Paste & Cross-Page Import State
  const [copiedSection, setCopiedSection] = useState<{
    sectionType: string;
    title?: string;
    subtitle?: string;
    content?: any;
    settings?: any;
    sourcePageTitle?: string;
  } | null>(() => {
    try {
      const saved = localStorage.getItem('cms_copied_section');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importActiveTab, setImportActiveTab] = useState<'MODULES' | 'PAGES'>('MODULES');
  const [importCategoryFilter, setImportCategoryFilter] = useState<string>('ALL');
  const [importCombinedSections, setImportCombinedSections] = useState<{
    pageId: string | number;
    pageTitle: string;
    pageSlug: string;
    section: PageSection;
  }[]>([]);
  const [importFilterPageId, setImportFilterPageId] = useState<string | number | 'ALL'>('ALL');
  const [importFilterType, setImportFilterType] = useState<string>('ALL');
  const [importLoading, setImportLoading] = useState(false);
  const [importActionLoading, setImportActionLoading] = useState<string | number | null>(null);
  const [importSearch, setImportSearch] = useState('');

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
    setEditingSectionObj(null);
    setSectionError(null);
    setSectionDrawerMode('create');
    setSectionDrawerOpen(true);
  };

  const openEditSection = (section: PageSection) => {
    setEditingSectionId(section.id);
    setEditingSectionObj(section);
    setSectionError(null);
    setSectionDrawerMode('edit');
    setSectionDrawerOpen(true);
  };

  const handleSaveSectionWizard = async (draftData: {
    sectionType: string;
    title: string;
    subtitle: string;
    content: Record<string, any>;
    settings: SectionSettings;
    sortOrder: number;
    isVisible: boolean;
  }) => {
    if (!sectionsPage) return;
    if (!draftData.sectionType) {
      setSectionError('Section type is required.');
      return;
    }
    const isEdit = sectionDrawerMode === 'edit';
    const existing = isEdit ? sections.find((s) => String(s.id) === String(editingSectionId)) : undefined;
    const payload = {
      sectionType: draftData.sectionType,
      title: draftData.title.trim(),
      subtitle: draftData.subtitle.trim(),
      content: draftData.content,
      settings: draftData.settings,
      sortOrder: isEdit ? Number(existing?.sortOrder) || draftData.sortOrder : draftData.sortOrder || sections.length + 1,
      isVisible: draftData.isVisible,
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
      throw err;
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
        { type: 'PLACEMENTS', title: 'Placement Partners', subtitle: 'Our students are placed in leading global organizations' },
        { type: 'COMPLIANCE', title: 'Mandatory Disclosures & Compliance', subtitle: 'Official statutory compliance documents and AICTE regulatory disclosures' },
        { type: 'TRANSPORT', title: 'Campus Transport & Bus Services', subtitle: 'Comprehensive fleet connecting major transit hubs to campus' },
        { type: 'HOSTELS', title: 'Hostels & Residential Facilities', subtitle: 'Safe, comfortable, and modern campus housing for students' },
        { type: 'LIBRARY', title: 'Central Library & Learning Resources', subtitle: 'Access e-journals, previous question papers, and academic repositories' },
        { type: 'ALUMNI', title: 'Distinguished Alumni', subtitle: 'Celebrating our graduates leading industries around the globe' },
        { type: 'NEWS', title: 'Latest Campus News', subtitle: 'Campus events, research breakthroughs, honors, and press announcements' },
        { type: 'EVENTS', title: 'Upcoming Campus Events', subtitle: 'Academic conferences, symposiums, student fests, and cultural celebrations' },
        { type: 'NOTICES', title: 'Official Notice Board', subtitle: 'Important administrative updates, examination schedules, and circulars' },
        { type: 'GALLERY', title: 'Campus Photo Gallery', subtitle: 'A visual journey across our world-class laboratories, library, and campus architecture' },
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

  const handleQuickAddSingleModule = async (mod: { type: string; title: string; subtitle: string }) => {
    if (!sectionsPage) return;
    const existing = sections.find((s) => s.sectionType?.toUpperCase() === mod.type.toUpperCase());
    if (existing) {
      notify(`"${existing.title || mod.title}" is already on this page (Position #${existing.sortOrder || '?'}).`, 'error');
      return;
    }

    try {
      setBusyId(`quick-${mod.type}`);
      const payload = {
        sectionType: mod.type,
        title: mod.title,
        subtitle: mod.subtitle,
        content: {},
        settings: {
          columns: 3,
          cardVariant: 'standard',
          alignment: 'center',
          background: 'light',
          spacing: 'normal',
          containerWidth: 'standard',
        },
        sortOrder: sections.length + 1,
        isVisible: true,
      };

      const res = await apiClient.post(`/admin/pages/${sectionsPage.id}/sections`, payload);
      if (!res.data?.success) throw new Error(res.data?.message || 'Failed to add section');
      notify(`Added "${mod.title}" to page successfully!`);
      const fresh = await apiClient.get(`/admin/pages/${sectionsPage.id}/sections`);
      const data = fresh.data?.data;
      setSections(Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : []);
      refreshConfig?.();
      await fetchPages();
    } catch (err: any) {
      notify(err?.response?.data?.message || err?.message || 'Failed to add module section', 'error');
    } finally {
      setBusyId(null);
    }
  };

  // ---------------- Cross-Page Section Copy / Paste / Duplicate / Import ----------------

  const handleCopySection = (section: PageSection) => {
    const payload = {
      sectionType: section.sectionType,
      title: section.title || '',
      subtitle: section.subtitle || '',
      content: section.content || {},
      settings: section.settings || {},
      sourcePageTitle: sectionsPage?.title || 'Unknown Page',
    };
    setCopiedSection(payload);
    try {
      localStorage.setItem('cms_copied_section', JSON.stringify(payload));
    } catch {
      // ignore
    }
    notify(`Section "${section.title || section.sectionType}" copied! Ready to paste into any page.`);
  };

  const handleDuplicateSection = async (section: PageSection) => {
    if (!sectionsPage) return;
    try {
      setBusyId(section.id);
      const payload = {
        sectionType: section.sectionType,
        title: section.title ? `${section.title} (Copy)` : `${section.sectionType} (Copy)`,
        subtitle: section.subtitle || '',
        content: section.content || {},
        settings: section.settings || {},
        sortOrder: sections.length + 1,
        isVisible: true,
      };
      const res = await apiClient.post(`/admin/pages/${sectionsPage.id}/sections`, payload);
      if (!res.data?.success) throw new Error(res.data?.message || 'Failed to duplicate section');
      notify(`Section duplicated as "${payload.title}"`);
      const fresh = await apiClient.get(`/admin/pages/${sectionsPage.id}/sections`);
      const data = fresh.data?.data;
      setSections(Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : []);
      refreshConfig?.();
      await fetchPages();
    } catch (err: any) {
      notify(err?.response?.data?.message || err?.message || 'Failed to duplicate section', 'error');
    } finally {
      setBusyId(null);
    }
  };

  const handlePasteSection = async () => {
    if (!sectionsPage || !copiedSection) return;
    try {
      setBusyId('paste');
      const payload = {
        sectionType: copiedSection.sectionType,
        title: copiedSection.title || '',
        subtitle: copiedSection.subtitle || '',
        content: copiedSection.content || {},
        settings: copiedSection.settings || {},
        sortOrder: sections.length + 1,
        isVisible: true,
      };
      const res = await apiClient.post(`/admin/pages/${sectionsPage.id}/sections`, payload);
      if (!res.data?.success) throw new Error(res.data?.message || 'Failed to paste section');
      notify(`Pasted "${copiedSection.title || copiedSection.sectionType}" into "${sectionsPage.title}"!`);
      const fresh = await apiClient.get(`/admin/pages/${sectionsPage.id}/sections`);
      const data = fresh.data?.data;
      setSections(Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : []);
      refreshConfig?.();
      await fetchPages();
    } catch (err: any) {
      notify(err?.response?.data?.message || err?.message || 'Failed to paste section', 'error');
    } finally {
      setBusyId(null);
    }
  };

  const handleOpenImportModal = async () => {
    setImportFilterPageId('ALL');
    setImportFilterType('ALL');
    setImportSearch('');
    setImportModalOpen(true);
    setImportLoading(true);

    try {
      const otherPages = pages.filter((p) => String(p.id) !== String(sectionsPage?.id));
      const promises = otherPages.map(async (p) => {
        try {
          const res = await apiClient.get(`/admin/pages/${p.id}/sections`);
          const data = res.data?.data;
          const list = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : [];
          return list.map((sec: PageSection) => ({
            pageId: p.id,
            pageTitle: p.title,
            pageSlug: p.slug,
            section: sec,
          }));
        } catch {
          return [];
        }
      });

      const results = await Promise.allSettled(promises);
      const combined: { pageId: string | number; pageTitle: string; pageSlug: string; section: PageSection }[] = [];
      results.forEach((r) => {
        if (r.status === 'fulfilled' && Array.isArray(r.value)) {
          combined.push(...r.value);
        }
      });

      setImportCombinedSections(combined);
    } catch {
      notify('Failed to load sections across pages', 'error');
      setImportCombinedSections([]);
    } finally {
      setImportLoading(false);
    }
  };

  const handleImportSectionToCurrentPage = async (section: PageSection) => {
    if (!sectionsPage) return;
    setImportActionLoading(section.id);
    try {
      const payload = {
        sectionType: section.sectionType,
        title: section.title || '',
        subtitle: section.subtitle || '',
        content: section.content || {},
        settings: section.settings || {},
        sortOrder: sections.length + 1,
        isVisible: true,
      };
      const res = await apiClient.post(`/admin/pages/${sectionsPage.id}/sections`, payload);
      if (!res.data?.success) throw new Error(res.data?.message || 'Failed to import section');
      notify(`Imported "${section.title || section.sectionType}" into "${sectionsPage.title}" successfully!`);
      const fresh = await apiClient.get(`/admin/pages/${sectionsPage.id}/sections`);
      const data = fresh.data?.data;
      setSections(Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : []);
      refreshConfig?.();
      await fetchPages();
    } catch (err: any) {
      notify(err?.response?.data?.message || err?.message || 'Failed to import section', 'error');
    } finally {
      setImportActionLoading(null);
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
          className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-semibold border ${notice.type === 'success'
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
                        className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${page.isPublished
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                          }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${page.isPublished ? 'bg-emerald-500' : 'bg-slate-400'
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
                className={`text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 transition cursor-pointer ${autoSlug
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
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 w-full">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={handleSeedDefaultSections}
                disabled={isSeedingSections || sectionsLoading}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900 transition cursor-pointer shadow-xs disabled:opacity-50"
                title="Populate missing standard college module sections (Hero, Stats, Quote, Departments, Courses, Faculty, News, Events, Notices, Gallery, Contact)"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isSeedingSections ? 'animate-spin' : 'text-indigo-600'}`} />
                <span>{isSeedingSections ? 'Syncing...' : '⚡ Auto-Generate'}</span>
              </button>

              <button
                type="button"
                onClick={handleOpenImportModal}
                disabled={sectionsLoading}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900 transition cursor-pointer shadow-xs"
                title="Import/Copy an existing section from any other page into this page"
              >
                <FolderDown className="w-3.5 h-3.5 text-emerald-600" />
                <span>Import from Another Page</span>
              </button>

              {copiedSection && (
                <button
                  type="button"
                  onClick={handlePasteSection}
                  disabled={busyId === 'paste' || sectionsLoading}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900 transition cursor-pointer shadow-xs"
                  title={`Paste copied section: "${copiedSection.title || copiedSection.sectionType}" (from ${copiedSection.sourcePageTitle || 'page'})`}
                >
                  <ClipboardPaste className="w-3.5 h-3.5 text-amber-600" />
                  <span className="truncate max-w-[150px]">Paste: {copiedSection.title || copiedSection.sectionType}</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2.5 justify-end">
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
                You can import sections from any existing page, auto-generate the complete suite of institutional sections, or create custom sections manually.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleOpenImportModal}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-emerald-200 bg-emerald-50/80 dark:bg-emerald-950/60 text-xs font-bold text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 transition cursor-pointer"
              >
                <FolderDown className="w-4 h-4 text-emerald-600" />
                <span>Import from Another Page</span>
              </button>
              <button
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                onClick={handleSeedDefaultSections}
                disabled={isSeedingSections}
              >
                <Sparkles
                  className={`w-4 h-4 ${isSeedingSections ? 'animate-spin' : ''}`}
                />
                <span>
                  {isSeedingSections
                    ? 'Populating...'
                    : '⚡ Auto-Generate College Modules'}
                </span>
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
            {/* Dynamic Module Presets & Quick-Sync Toolbar */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-indigo-50/90 via-blue-50/70 to-purple-50/90 dark:from-indigo-950/50 dark:via-slate-900 dark:to-purple-950/50 border border-indigo-200/80 dark:border-indigo-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-start gap-2.5 min-w-0">
                <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-xs font-bold text-indigo-900 dark:text-indigo-200">
                      Module Section Engine & Presets
                    </p>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900/80 dark:text-indigo-200">
                      18+ System Modules Active
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed mt-0.5">
                    Sync or browse pre-built institutional modules (Placements, Compliance, Hostels, Transport, Library, Alumni, Departments, etc.) onto this page.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    setImportActiveTab('MODULES');
                    handleOpenImportModal();
                  }}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-emerald-800 dark:text-emerald-200 bg-emerald-100/90 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-200/90 transition shadow-2xs flex items-center gap-1.5 cursor-pointer"
                  title="Open the visual module picker & cross-page import catalog"
                >
                  <FolderDown className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Browse / Import Modules</span>
                </button>
                <button
                  type="button"
                  onClick={handleSeedDefaultSections}
                  disabled={isSeedingSections}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  title="Populate missing institutional modules automatically"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isSeedingSections ? 'animate-spin' : ''}`} />
                  <span>{isSeedingSections ? 'Syncing...' : 'Auto-Sync All Modules'}</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between px-1 text-[11px] text-slate-400 font-semibold">
              <div className="flex items-center gap-2">
                <LayoutTemplate className="w-3.5 h-3.5" />
                <span>
                  {sections.length} section{sections.length !== 1 ? 's' : ''} on page — use arrows (↑ ↓) to reorder scroll sequence
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleOpenImportModal}
                  className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <FolderDown className="w-3 h-3" />
                  <span>Import Section</span>
                </button>
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
            </div>

            {sections.map((section, index) => {
              const isModule = [
                'HERO', 'HERO_SLIDER', 'BANNERS', 'STATISTICS', 'STATS', 'QUOTE',
                'DEPARTMENTS', 'COURSES', 'FACULTY', 'NEWS', 'EVENTS', 'NOTICES',
                'GALLERY', 'CONTACT', 'MAP'
              ].includes(section.sectionType?.toUpperCase());

              return (
                <div
                  key={section.id}
                  className={`p-3.5 rounded-2xl border transition shadow-2xs ${!section.isVisible
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
                        className={`hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${section.isVisible
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

                      {/* Copy to Clipboard (for Cross-Page Paste) */}
                      <button
                        onClick={() => handleCopySection(section)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition cursor-pointer"
                        title="Copy section (ready to paste into any page)"
                      >
                        <ClipboardCopy className="w-3.5 h-3.5" />
                      </button>

                      {/* Duplicate on this page */}
                      <button
                        onClick={() => handleDuplicateSection(section)}
                        disabled={busyId === section.id}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition cursor-pointer disabled:opacity-40"
                        title="Duplicate section on this page"
                      >
                        <Copy className="w-3.5 h-3.5" />
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

      {/* ---------- 3-Step Progressive Disclosure Section Wizard Drawer ---------- */}
      <SectionWizardDrawer
        isOpen={sectionDrawerOpen}
        mode={sectionDrawerMode}
        editingSection={editingSectionObj}
        onClose={() => !sectionSaving && setSectionDrawerOpen(false)}
        onSave={handleSaveSectionWizard}
        isSaving={sectionSaving}
        serverError={sectionError}
        defaultSortOrder={sections.length + 1}
        availablePages={pages}
        currentPageId={sectionsPage?.id}
        targetPageTitle={sectionsPage?.title}
      />

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

      {/* ---------- Import & Add Module Sections Hub Drawer ---------- */}
      <Drawer
        isOpen={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        title="Import & Add Module Sections"
        subtitle={sectionsPage ? `Add pre-built institutional modules or clone sections into "${sectionsPage.title}"` : 'Add or clone sections'}
        icon={<FolderDown className="w-4 h-4 text-emerald-600" />}
        size="xl"
      >
        <div className="space-y-4">
          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60">
            <button
              type="button"
              onClick={() => setImportActiveTab('MODULES')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                importActiveTab === 'MODULES'
                  ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-300 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>System Module Presets ({SYSTEM_MODULE_PRESETS.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setImportActiveTab('PAGES')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                importActiveTab === 'PAGES'
                  ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-300 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <FolderDown className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Clone from Other Pages ({importCombinedSections.length})</span>
            </button>
          </div>

          {/* TAB 1: SYSTEM MODULE PRESETS */}
          {importActiveTab === 'MODULES' && (
            <div className="space-y-4">
              {/* Category & Search Filter */}
              <div className="bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                    Filter Institutional Modules:
                  </label>
                  <span className="text-[11px] font-semibold text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">
                    18+ Available Modules
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                  <div className="sm:col-span-7">
                    <Input
                      placeholder="Search module (e.g. placements, compliance, transport, hostel, library)..."
                      value={importSearch}
                      onChange={(e) => setImportSearch(e.target.value)}
                      leftIcon={<Search className="w-3.5 h-3.5" />}
                    />
                  </div>
                  <div className="sm:col-span-5">
                    <select
                      value={importCategoryFilter}
                      onChange={(e) => setImportCategoryFilter(e.target.value)}
                      className="w-full py-2.5 px-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-slate-100 shadow-2xs focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                    >
                      <option value="ALL">🌐 All Module Categories (18)</option>
                      <option value="COMPLIANCE_PLACEMENTS">🏢 Corporate, Placements & Compliance</option>
                      <option value="FACILITIES">🏠 Campus Facilities, Hostels & Transport</option>
                      <option value="ACADEMICS">🏛️ Academics, Degrees & Faculty</option>
                      <option value="MEDIA_NEWS">📰 News, Events, Notices & Gallery</option>
                      <option value="CONTENT">✍️ Content, Quotes & FAQs</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Modules Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[480px] overflow-y-auto pr-1">
                {SYSTEM_MODULE_PRESETS
                  .filter((mod) => {
                    if (importCategoryFilter !== 'ALL' && mod.category !== importCategoryFilter) {
                      return false;
                    }
                    if (!importSearch.trim()) return true;
                    const q = importSearch.toLowerCase();
                    return (
                      mod.name.toLowerCase().includes(q) ||
                      mod.title.toLowerCase().includes(q) ||
                      mod.subtitle.toLowerCase().includes(q) ||
                      mod.description.toLowerCase().includes(q) ||
                      mod.type.toLowerCase().includes(q) ||
                      mod.categoryLabel.toLowerCase().includes(q)
                    );
                  })
                  .map((mod) => {
                    const isAdded = sections.some((s) => s.sectionType?.toUpperCase() === mod.type.toUpperCase());
                    const isBusy = busyId === `quick-${mod.type}`;

                    return (
                      <div
                        key={mod.type}
                        className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                          isAdded
                            ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/60'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-2xs hover:border-indigo-300 dark:hover:border-indigo-700'
                        }`}
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="text-xl shrink-0">{mod.icon}</span>
                              <div className="min-w-0">
                                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                                  {mod.title}
                                </h4>
                                <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 font-semibold">
                                  #{mod.type}
                                </span>
                              </div>
                            </div>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 shrink-0">
                              {mod.badge}
                            </span>
                          </div>

                          <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
                            {mod.description}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                          <span className="text-[10px] font-medium text-slate-400 truncate">
                            {mod.categoryLabel}
                          </span>

                          <button
                            type="button"
                            onClick={() => handleQuickAddSingleModule(mod)}
                            disabled={isBusy || isAdded}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shrink-0 shadow-xs ${
                              isAdded
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 cursor-default opacity-90'
                                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                            }`}
                          >
                            {isBusy ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                <span>Adding...</span>
                              </>
                            ) : isAdded ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                <span>Already on Page</span>
                              </>
                            ) : (
                              <>
                                <Plus className="w-3.5 h-3.5" />
                                <span>Add to Page</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* TAB 2: CLONE FROM OTHER PAGES */}
          {importActiveTab === 'PAGES' && (
            <div className="space-y-4">
              {/* Header Filter Bar */}
              <div className="bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                    Browse Sections on Other Pages:
                  </label>
                  <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                    {importCombinedSections.length} section{importCombinedSections.length !== 1 ? 's' : ''} available
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                  <div className="sm:col-span-7">
                    <Input
                      placeholder="Search by title, keywords or type (e.g. quote, faculty, stats)..."
                      value={importSearch}
                      onChange={(e) => setImportSearch(e.target.value)}
                      leftIcon={<Search className="w-3.5 h-3.5" />}
                    />
                  </div>
                  <div className="sm:col-span-5">
                    <select
                      value={String(importFilterPageId)}
                      onChange={(e) => setImportFilterPageId(e.target.value)}
                      className="w-full py-2.5 px-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-slate-100 shadow-2xs focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                    >
                      <option value="ALL">📂 All Other Pages (Combined)</option>
                      {pages
                        .filter((p) => String(p.id) !== String(sectionsPage?.id))
                        .map((p) => (
                          <option key={p.id} value={String(p.id)}>
                            {p.title} (/{p.slug})
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Combined Sections List */}
              <div className="space-y-2 pt-1">
                {importLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
                  </div>
                ) : importCombinedSections.length === 0 ? (
                  <div className="py-10 text-center text-xs text-slate-400 border border-dashed rounded-xl border-slate-200 dark:border-slate-800 space-y-2">
                    <p className="font-semibold text-slate-600 dark:text-slate-300">No sections found on other pages.</p>
                    <p className="text-slate-400">You can use the <strong>System Module Presets</strong> tab above to add any standard college module directly!</p>
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
                    {importCombinedSections
                      .filter((entry) => {
                        if (importFilterPageId !== 'ALL' && String(entry.pageId) !== String(importFilterPageId)) {
                          return false;
                        }
                        if (!importSearch.trim()) return true;
                        const q = importSearch.toLowerCase();
                        return (
                          entry.section.title?.toLowerCase().includes(q) ||
                          entry.section.subtitle?.toLowerCase().includes(q) ||
                          entry.section.sectionType?.toLowerCase().includes(q) ||
                          entry.pageTitle?.toLowerCase().includes(q)
                        );
                      })
                      .map((entry, sIdx) => {
                        const sec = entry.section;
                        const isImporting = importActionLoading === sec.id;
                        return (
                          <div
                            key={`${entry.pageId}_${sec.id}`}
                            className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs hover:border-emerald-300 dark:hover:border-emerald-700 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                          >
                            <div className="min-w-0 space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-[10px] font-black text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono">
                                  #{sIdx + 1}
                                </span>
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/50">
                                  <Sparkles className="w-2.5 h-2.5" />
                                  <span>{sec.sectionType.toUpperCase()}</span>
                                </span>
                                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                                  {sec.title || sectionTypeLabel(sec.sectionType)}
                                </h4>
                              </div>

                              {sec.subtitle && (
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                                  {sec.subtitle}
                                </p>
                              )}

                              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                                <span>📁 From:</span>
                                <span className="font-semibold text-slate-600 dark:text-slate-300">{entry.pageTitle}</span>
                                <span className="font-mono">({entry.pageSlug})</span>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleImportSectionToCurrentPage(sec)}
                              disabled={isImporting}
                              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition cursor-pointer shadow-xs shrink-0 disabled:opacity-50"
                            >
                              {isImporting ? (
                                <>
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  <span>Importing...</span>
                                </>
                              ) : (
                                <>
                                  <Download className="w-3.5 h-3.5" />
                                  <span>Import to {sectionsPage?.title ? `"${sectionsPage.title.slice(0, 14)}..."` : 'This Page'}</span>
                                </>
                              )}
                            </button>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </Drawer>

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