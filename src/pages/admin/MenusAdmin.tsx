import React, { useEffect, useState } from 'react';
import {
  Menu as MenuIcon,
  Plus,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  Clock,
  ChevronRight,
  ChevronDown,
  Globe,
  GraduationCap,
  ExternalLink,
  ArrowUp,
  ArrowDown,
  Layers,
  Check,
  X,
  Link2,
  Sparkles,
  RefreshCw,
  Search,
  Copy,
  Building2,
  Newspaper,
  Bell,
  Image as ImageIcon,
  FileText,
  Filter
} from 'lucide-react';
import { apiClient } from '../../services/apiClient';
import { MenuItem } from '../../types';
import { useTenant } from '../../tenant/TenantContext';
import { FormDrawer, ConfirmDialog } from '../../UI_Componentes/ui';
import { copyToClipboard } from '../../utils/helpers';

interface MenuRecord {
  id: string;
  code?: string;
  title?: string;
  name?: string;
  location?: string;
}

export const MenusAdminPage: React.FC = () => {
  const { siteConfig, refreshConfig } = useTenant();
  const [menus, setMenus] = useState<MenuRecord[]>([]);
  const [selectedMenuId, setSelectedMenuId] = useState<string>('');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [customPages, setCustomPages] = useState<{ id: string | number; title: string; slug: string; isPublished: boolean }[]>([]);
  const [departments, setDepartments] = useState<{ id: string; name: string; code: string }[]>([]);
  const [newsList, setNewsList] = useState<{ id: string; title: string; slug: string }[]>([]);
  const [noticesList, setNoticesList] = useState<{ id: string; title: string; slug: string }[]>([]);
  const [galleryList, setGalleryList] = useState<{ id: string; title: string; slug: string }[]>([]);
  const [pickerCategory, setPickerCategory] = useState<'ALL' | 'CORE' | 'PAGES' | 'DEPARTMENTS' | 'NEWS' | 'NOTICES' | 'GALLERY'>('ALL');
  const [pickerSearch, setPickerSearch] = useState('');
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string | number; title: string } | null>(null);
  const [showPreview, setShowPreview] = useState(true);
  const [activeDropdownId, setActiveDropdownId] = useState<string | number | null>(null);

  // Modal State
  const [showItemModal, setShowItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [title, setTitle] = useState('');
  const [parentId, setParentId] = useState<string>('');
  const [targetType, setTargetType] = useState('DYNAMIC_MODULE');
  const [url, setUrl] = useState('');
  const [openInNewTab, setOpenInNewTab] = useState(false);
  const [icon, setIcon] = useState('FileText');

  // Predefined Module Destinations
  const predefinedModules = [
    { label: 'Home Page', url: '/' },
    { label: 'About College', url: '/about' },
    { label: 'Academic Departments', url: '/departments' },
    { label: 'Courses & Programs', url: '/courses' },
    { label: 'Faculty & Staff', url: '/faculty' },
    { label: 'Campus News', url: '/news' },
    { label: 'Events Calendar', url: '/events' },
    { label: 'Photo Gallery', url: '/gallery' },
    { label: 'Notice Board', url: '/notices' },
    { label: 'Admissions & Apply', url: '/admissions' },
    { label: 'Contact Us', url: '/contact' },
  ];

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleCopy = (text: string) => {
    copyToClipboard(text);
    setCopiedUrl(text);
    showNotification(`Copied URL "${text}" to clipboard!`);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const fetchMenus = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/admin/menus');
      const data = res.data?.data;
      const list = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : [];
      setMenus(list);
      if (list.length > 0 && !selectedMenuId) {
        setSelectedMenuId(list[0].id);
      }
    } catch (err) {
      console.error('Failed to fetch menus', err);
      showNotification('Failed to load menus', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchMenuItems = async (menuId: string) => {
    if (!menuId) return;
    try {
      const res = await apiClient.get(`/admin/menus/${menuId}/items`);
      const data = res.data?.data;
      const list = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : [];
      setMenuItems(list);
    } catch (err) {
      console.error('Failed to load menu items', err);
      showNotification('Failed to load menu items', 'error');
    }
  };

  const fetchDirectoryData = async () => {
    try {
      const [pagesRes, deptRes, newsRes, notRes, galRes] = await Promise.allSettled([
        apiClient.get('/admin/pages'),
        apiClient.get('/admin/departments'),
        apiClient.get('/admin/news'),
        apiClient.get('/admin/notices'),
        apiClient.get('/admin/gallery')
      ]);

      if (pagesRes.status === 'fulfilled') {
        const data = pagesRes.value.data?.data;
        setCustomPages(Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : []);
      }
      if (deptRes.status === 'fulfilled') {
        const data = deptRes.value.data?.data;
        setDepartments(Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : []);
      }
      if (newsRes.status === 'fulfilled') {
        const data = newsRes.value.data?.data;
        setNewsList(Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : []);
      }
      if (notRes.status === 'fulfilled') {
        const data = notRes.value.data?.data;
        setNoticesList(Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : []);
      }
      if (galRes.status === 'fulfilled') {
        const data = galRes.value.data?.data;
        setGalleryList(Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : []);
      }
    } catch (e) {
      console.error('Error fetching directory data for route picker', e);
    }
  };

  useEffect(() => {
    fetchMenus();
    fetchDirectoryData();
  }, []);

  useEffect(() => {
    if (selectedMenuId) {
      fetchMenuItems(selectedMenuId);
    }
  }, [selectedMenuId]);

  // Toggle Item Active/Inactive (Visibility)
  const toggleVisibility = async (item: MenuItem) => {
    const nextStatus = item.isVisible === false ? true : false;
    try {
      setActionLoading(true);
      const res = await apiClient.patch(`/admin/menus/${selectedMenuId}/items/${item.id}/visibility`, {
        isVisible: nextStatus,
      });
      if (res.data.success) {
        showNotification(
          `"${item.title}" is now ${nextStatus ? 'ACTIVE (Visible on public site)' : 'INACTIVE (Hidden from public site)'}`
        );
        fetchMenuItems(selectedMenuId);
        try {
          await refreshConfig();
        } catch {
          // ignore background refresh
        }
      }
    } catch {
      showNotification('Failed to update visibility', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteItem = async () => {
    if (!deleteTarget) return;
    try {
      setActionLoading(true);
      await apiClient.delete(`/admin/menus/${selectedMenuId}/items/${deleteTarget.id}`);
      showNotification('Menu item deleted successfully');
      setDeleteTarget(null);
      fetchMenuItems(selectedMenuId);
      try {
        await refreshConfig();
      } catch {
        // ignore background refresh
      }
    } catch {
      showNotification('Failed to delete menu item', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenCreateModal = (parent?: MenuItem) => {
    setEditingItem(null);
    setTitle('');
    setParentId(parent ? String(parent.id) : '');
    setTargetType('DYNAMIC_MODULE');
    setUrl(parent ? '' : '/');
    setOpenInNewTab(false);
    setIcon('FileText');
    setShowItemModal(true);
  };

  const handleOpenEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setParentId(item.parentId ? String(item.parentId) : '');
    setTargetType(item.targetType || 'DYNAMIC_MODULE');
    setUrl(item.url || '');
    setOpenInNewTab(item.openInNewTab || false);
    setIcon(item.icon || 'FileText');
    setShowItemModal(true);
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showNotification('Title is required', 'error');
      return;
    }

    try {
      setActionLoading(true);
      if (editingItem) {
        await apiClient.put(`/admin/menus/${selectedMenuId}/items/${editingItem.id}`, {
          title,
          parentId: parentId ? parentId : null,
          targetType,
          url,
          openInNewTab,
          icon,
          sortOrder: editingItem.sortOrder,
          isVisible: editingItem.isVisible !== false,
        });
        showNotification('Menu item updated successfully');
      } else {
        await apiClient.post(`/admin/menus/${selectedMenuId}/items`, {
          title,
          parentId: parentId ? parentId : null,
          targetType,
          url,
          openInNewTab,
          icon,
          sortOrder: menuItems.length + 1,
        });
        showNotification('Menu item created successfully');
      }
      setShowItemModal(false);
      fetchMenuItems(selectedMenuId);
      try {
        await refreshConfig();
      } catch {
        // ignore background refresh
      }
    } catch {
      showNotification('Failed to save menu item', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleMoveOrder = async (item: MenuItem, direction: 'up' | 'down') => {
    let siblings: MenuItem[] = [];
    if (!item.parentId) {
      siblings = menuItems.filter((i) => !i.parentId);
    } else {
      const parent = menuItems.find((i) => String(i.id) === String(item.parentId));
      siblings = (parent && parent.children && parent.children.length > 0)
        ? parent.children
        : menuItems.filter((i) => String(i.parentId) === String(item.parentId));
    }

    const currentIndex = siblings.findIndex((i) => String(i.id) === String(item.id));
    if (currentIndex === -1) return;

    if (direction === 'up' && currentIndex === 0) return;
    if (direction === 'down' && currentIndex === siblings.length - 1) return;

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const targetItem = siblings[targetIndex];

    const updatedSiblings = [...siblings];
    updatedSiblings[currentIndex] = targetItem;
    updatedSiblings[targetIndex] = item;

    const reorderedIds = updatedSiblings.map((s) => String(s.id));
    try {
      setActionLoading(true);
      await apiClient.put(`/admin/menus/${selectedMenuId}/items/reorder`, {
        itemIds: reorderedIds,
      });
      fetchMenuItems(selectedMenuId);
      try {
        await refreshConfig();
      } catch {
        // ignore background refresh
      }
    } catch {
      showNotification('Failed to reorder items', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const allAvailableRoutes = [
    ...predefinedModules.map((m) => ({
      category: 'CORE' as const,
      label: m.label,
      url: m.url,
      badge: 'Core Module',
      color: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800',
      icon: Globe
    })),
    ...customPages.map((p) => ({
      category: 'PAGES' as const,
      label: p.title,
      url: `/${p.slug}`,
      badge: 'CMS Page',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800',
      icon: FileText
    })),
    ...departments.map((d) => ({
      category: 'DEPARTMENTS' as const,
      label: d.name,
      url: `/departments/${(d.code || d.id).toLowerCase()}`,
      badge: `Dept (${d.code || 'DEPT'})`,
      color: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800',
      icon: Building2
    })),
    ...newsList.map((n) => ({
      category: 'NEWS' as const,
      label: n.title,
      url: `/news/${n.slug}`,
      badge: 'News',
      color: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800',
      icon: Newspaper
    })),
    ...noticesList.map((n) => ({
      category: 'NOTICES' as const,
      label: n.title,
      url: `/notices/${n.slug}`,
      badge: 'Notice',
      color: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/50 dark:text-orange-300 dark:border-orange-800',
      icon: Bell
    })),
    ...galleryList.map((g) => ({
      category: 'GALLERY' as const,
      label: g.title,
      url: `/gallery/${g.slug}`,
      badge: 'Gallery',
      color: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800',
      icon: ImageIcon
    }))
  ];

  const filteredRoutes = allAvailableRoutes.filter((r) => {
    const matchesCategory = pickerCategory === 'ALL' || r.category === pickerCategory;
    const matchesSearch = !pickerSearch.trim() || 
      r.label.toLowerCase().includes(pickerSearch.toLowerCase()) || 
      r.url.toLowerCase().includes(pickerSearch.toLowerCase()) ||
      r.badge.toLowerCase().includes(pickerSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const rootItems = menuItems.filter((item) => !item.parentId);
  const getSubItems = (root: MenuItem): MenuItem[] => {
    if (root.children && root.children.length > 0) {
      return root.children;
    }
    return menuItems.filter((item) => String(item.parentId) === String(root.id));
  };

  const activeRootItems = rootItems.filter((i) => i.isVisible !== false && i.isActive !== false);
  const activeSubItemsCount = rootItems.reduce((acc, root) => {
    return acc + getSubItems(root).filter((sub) => sub.isVisible !== false && sub.isActive !== false).length;
  }, 0);

  const renderTargetBadge = (targetType?: string) => {
    switch (targetType) {
      case 'DYNAMIC_MODULE':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-900/50">
            <Sparkles className="w-2.5 h-2.5" /> Dynamic Module
          </span>
        );
      case 'INTERNAL_PAGE':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/50">
            <Layers className="w-2.5 h-2.5" /> CMS Page
          </span>
        );
      case 'SECTION_ANCHOR':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-900/50">
            <Link2 className="w-2.5 h-2.5" /> Section Scroll
          </span>
        );
      case 'EXTERNAL_LINK':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-900/50">
            <ExternalLink className="w-2.5 h-2.5" /> External Link
          </span>
        );
      case 'FILE_DOWNLOAD':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50">
            <Globe className="w-2.5 h-2.5" /> File Download
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            {targetType || 'Dynamic Module'}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 font-sans text-slate-900 dark:text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <MenuIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <span>Navigation Menus & Submenus</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Control which links appear in your website header and footer. Toggle items active or inactive in real-time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              fetchMenus();
              if (selectedMenuId) fetchMenuItems(selectedMenuId);
            }}
            disabled={loading}
            className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-semibold transition shadow-2xs cursor-pointer"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
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

      {/* Top Collapsible Visual Live Preview Monitor (LIGHT MODE) */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/75">
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 font-mono">
                Live Header Navigation Monitor (Light Mode)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                {activeRootItems.length} Active Top Items
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                {activeSubItemsCount} Active Submenus
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
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
          <div className="p-4 sm:p-6 bg-slate-50/60 border-b border-slate-100 space-y-3">
            {/* Simulated Browser Bar */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100/90 rounded-lg text-[11px] text-slate-500 font-mono border border-slate-200">
              <Globe className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <span className="truncate">
                https://campus-portal.edu{activeDropdownId ? ` → ${rootItems.find(r => String(r.id) === String(activeDropdownId))?.title || 'Dropdown Menu'}` : ''}
              </span>
              <span className="ml-auto text-[10px] text-slate-400 font-sans hidden sm:inline">
                Interactive Preview (Hover/Click Menus)
              </span>
            </div>

            {/* Simulated Live Navbar Container */}
            <div className="relative bg-white rounded-xl border border-slate-200 shadow-sm p-4 min-h-[72px]">
              <div className="flex items-center justify-between gap-4 flex-wrap">

                {/* College Branding */}
                <div className="flex items-center gap-3 shrink-0">
                  {siteConfig?.settings?.logoUrl || siteConfig?.settings?.collegeLogoUrl ? (
                    <img
                      src={siteConfig?.settings?.logoUrl || siteConfig?.settings?.collegeLogoUrl}
                      alt="College Logo"
                      className="w-9 h-9 object-contain rounded-lg"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                  )}
                  <div>
                    <div className="font-bold text-sm text-slate-900 leading-tight">
                      {siteConfig?.settings?.siteName || siteConfig?.tenant?.name || 'College of Excellence'}
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium">
                      {siteConfig?.settings?.tagline || 'Autonomous & Accredited Institution'}
                    </div>
                  </div>
                </div>

                {/* Simulated Menu Items */}
                <div className="flex items-center gap-1 sm:gap-2 flex-wrap relative">
                  {rootItems.length === 0 ? (
                    <span className="text-xs text-slate-400 italic">No menu items configured yet</span>
                  ) : (
                    rootItems.map((item) => {
                      const subItems = getSubItems(item);
                      const hasSub = subItems.length > 0;
                      const isItemActive = item.isVisible !== false && item.isActive !== false;
                      const isDropdownOpen = String(activeDropdownId) === String(item.id);

                      return (
                        <div
                          key={item.id}
                          className="relative"
                          onMouseEnter={() => hasSub && setActiveDropdownId(item.id)}
                          onMouseLeave={() => hasSub && setActiveDropdownId(null)}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              if (hasSub) {
                                setActiveDropdownId(isDropdownOpen ? null : item.id);
                              }
                            }}
                            className={`px-3 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ${!isItemActive
                                ? 'opacity-40 text-slate-400 line-through bg-slate-50 border border-dashed border-slate-200'
                                : isDropdownOpen
                                  ? 'bg-blue-50 text-blue-700 font-bold'
                                  : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'
                              }`}
                            title={!isItemActive ? 'Inactive item (hidden on public site)' : item.url || item.title}
                          >
                            <span>{item.title}</span>
                            {hasSub && (
                              <ChevronDown
                                className={`w-3.5 h-3.5 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 text-blue-600' : 'text-slate-400'
                                  }`}
                              />
                            )}
                          </button>

                          {/* Interactive Dropdown Menu */}
                          {hasSub && isDropdownOpen && (
                            <div className="absolute left-0 top-full mt-1.5 w-56 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50 space-y-1 animate-in fade-in duration-150">
                              <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 flex items-center justify-between">
                                <span>{item.title} Submenus</span>
                                <span className="text-blue-600 font-mono">{subItems.length} items</span>
                              </div>
                              <div className="max-h-60 overflow-y-auto space-y-0.5 pt-1">
                                {subItems.map((sub) => {
                                  const isSubActive = sub.isVisible !== false && sub.isActive !== false;
                                  return (
                                    <div
                                      key={sub.id}
                                      className={`px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition ${isSubActive
                                          ? 'text-slate-700 hover:bg-blue-50 hover:text-blue-700'
                                          : 'text-slate-400 line-through opacity-50 bg-slate-50'
                                        }`}
                                    >
                                      <span className="font-medium truncate">{sub.title}</span>
                                      <span className="text-[10px] text-slate-400 font-mono shrink-0 ml-2">
                                        {sub.url || '#'}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Right Call-To-Action Button */}
                <div className="hidden lg:flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition cursor-default"
                  >
                    {siteConfig?.settings?.headerCtaText || 'Apply Now'}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 px-1 pt-1">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Hover or click menu items above with dropdown arrows (▾) to test submenus in real-time.</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                Real-time Sync
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Menu Selector Tabs & Add Menu Item */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-2">
        <div className="flex items-center gap-2 overflow-x-auto">
          {menus.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedMenuId(m.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-2 cursor-pointer ${selectedMenuId === m.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-2xs'
                }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{m.title || m.name || 'Navigation Bar'} ({m.code || m.location || 'MAIN_NAV'})</span>
            </button>
          ))}
        </div>

        <button
          onClick={() => handleOpenCreateModal()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs shadow-sm transition cursor-pointer self-end sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Menu Item</span>
        </button>
      </div>

      {/* Quick Action Hint */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-amber-800">
        <Sparkles className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
        <div>
          <span className="font-bold">Admin Tip:</span> When you toggle an item to <strong>Inactive</strong>, it and all of its submenus will immediately disappear from the public website visitors, but stay right here for you to reactivate anytime!
        </div>
      </div>

      {/* Menu Items Hierarchy */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 font-semibold bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          Loading menu structure...
        </div>
      ) : rootItems.length === 0 ? (
        <div className="p-12 text-center text-slate-500 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
          <p className="font-semibold">No menu items found for this navigation bar.</p>
          <button
            onClick={() => handleOpenCreateModal()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-primary"
          >
            <Plus className="w-4 h-4" />
            <span>Create First Menu Item</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {rootItems.map((root, idx) => {
            const subItems = getSubItems(root);
            const isVisible = root.isVisible !== false;

            return (
              <div
                key={root.id}
                className={`bg-white dark:bg-slate-900 rounded-2xl border transition-all ${isVisible
                    ? 'border-slate-200 dark:border-slate-800 shadow-sm'
                    : 'border-dashed border-red-300 dark:border-red-900/60 bg-red-50/20 opacity-80'
                  }`}
              >
                {/* Parent Row */}
                <div className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Index & Reorder Controls */}
                    <div className="flex items-center gap-1 shrink-0">
                      <div className="flex flex-col">
                        <button
                          disabled={idx === 0 || actionLoading}
                          onClick={() => handleMoveOrder(root, 'up')}
                          className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          disabled={idx === rootItems.length - 1 || actionLoading}
                          onClick={() => handleMoveOrder(root, 'down')}
                          className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-mono font-bold text-slate-600 dark:text-slate-300">
                        {idx + 1}
                      </span>
                    </div>

                    {/* Title & Path */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className={`font-bold text-sm truncate ${isVisible ? 'text-slate-900 dark:text-white' : 'text-slate-500 line-through'}`}>
                          {root.title}
                        </h3>
                        {/* Target badge */}
                        {renderTargetBadge(root.targetType)}
                        {root.openInNewTab && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] bg-blue-50 text-blue-700 font-semibold">
                            <ExternalLink className="w-2.5 h-2.5" /> New Tab
                          </span>
                        )}
                        {/* Submenu count badge */}
                        {subItems.length > 0 && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
                            {subItems.length} submenu{subItems.length > 1 ? 's' : ''}
                          </span>
                        )}
                      </div>

                      {/* Copy URL Badge */}
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <button
                          type="button"
                          onClick={() => handleCopy(root.url || '/')}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono transition border ${copiedUrl === (root.url || '/')
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                              : 'bg-slate-50 text-slate-500 border-slate-200 hover:text-primary hover:border-primary/30 dark:bg-slate-800/80 dark:text-slate-400 dark:border-slate-700'
                            }`}
                          title="Click to copy destination URL"
                        >
                          {copiedUrl === (root.url || '/') ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-400" />}
                          <span className="truncate max-w-[200px] sm:max-w-[300px]">{root.url || '/'}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Active/Inactive Switch */}
                  <div className="flex items-center gap-2 shrink-0">
                    {/* Active/Inactive Toggle Button */}
                    <button
                      onClick={() => toggleVisibility(root)}
                      disabled={actionLoading}
                      title={isVisible ? 'Click to make INACTIVE (hide from public site)' : 'Click to make ACTIVE (show on public site)'}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-sm ${isVisible
                          ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : 'bg-red-100 hover:bg-red-200 text-red-800 dark:bg-red-950/60 dark:text-red-300'
                        }`}
                    >
                      {isVisible ? (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          <span>Active</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          <span>Inactive</span>
                        </>
                      )}
                    </button>

                    {/* Add Submenu Button */}
                    <button
                      onClick={() => handleOpenCreateModal(root)}
                      title="Add Submenu Item under this parent"
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Submenu</span>
                    </button>

                    {/* Edit Button */}
                    <button
                      onClick={() => handleOpenEditModal(root)}
                      title="Edit Item"
                      className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 transition"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => setDeleteTarget({ id: root.id, title: root.title })}
                      title="Delete Item"
                      className="p-1.5 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/40 text-red-600 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Nested Submenus Render */}
                {subItems.length > 0 && (
                  <div className="bg-slate-50/80 dark:bg-slate-950/50 p-3 rounded-b-2xl border-t border-slate-100 dark:border-slate-800/80 space-y-2">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 flex items-center gap-1">
                      <ChevronRight className="w-3 h-3" /> Submenus for {root.title}
                    </div>

                    {subItems.map((sub, sIdx) => {
                      const isSubVisible = sub.isVisible !== false;
                      return (
                        <div
                          key={sub.id}
                          className={`ml-6 p-3 rounded-xl border flex items-center justify-between gap-4 transition ${isSubVisible
                              ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                              : 'bg-red-50/30 border-dashed border-red-200 text-slate-400'
                            }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {/* Reorder submenus */}
                            <div className="flex items-center gap-1 shrink-0">
                              <div className="flex flex-col">
                                <button
                                  disabled={sIdx === 0 || actionLoading}
                                  onClick={() => handleMoveOrder(sub, 'up')}
                                  className="p-0.5 text-slate-400 hover:text-slate-700 disabled:opacity-20"
                                >
                                  <ArrowUp className="w-3 h-3" />
                                </button>
                                <button
                                  disabled={sIdx === subItems.length - 1 || actionLoading}
                                  onClick={() => handleMoveOrder(sub, 'down')}
                                  className="p-0.5 text-slate-400 hover:text-slate-700 disabled:opacity-20"
                                >
                                  <ArrowDown className="w-3 h-3" />
                                </button>
                              </div>
                              <span className="text-[10px] font-mono text-slate-400">
                                {idx + 1}.{sIdx + 1}
                              </span>
                            </div>

                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className={`text-xs font-bold truncate ${isSubVisible ? 'text-slate-800 dark:text-slate-200' : 'line-through text-slate-400'}`}>
                                  {sub.title}
                                </span>
                                {renderTargetBadge(sub.targetType)}
                                {sub.openInNewTab && (
                                  <ExternalLink className="w-2.5 h-2.5 text-blue-500" />
                                )}
                              </div>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <button
                                  type="button"
                                  onClick={() => handleCopy(sub.url || '/')}
                                  className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono transition border ${copiedUrl === (sub.url || '/')
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                                      : 'bg-slate-50 text-slate-500 border-slate-200 hover:text-primary hover:border-primary/30 dark:bg-slate-800/80 dark:text-slate-400 dark:border-slate-700'
                                    }`}
                                  title="Click to copy destination URL"
                                >
                                  {copiedUrl === (sub.url || '/') ? <Check className="w-2.5 h-2.5 text-emerald-600" /> : <Copy className="w-2.5 h-2.5 text-slate-400" />}
                                  <span className="truncate max-w-[180px]">{sub.url}</span>
                                </button>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {/* Submenu Active/Inactive Toggle */}
                            <button
                              onClick={() => toggleVisibility(sub)}
                              disabled={actionLoading}
                              className={`px-2 py-1 rounded-lg text-[10px] font-bold transition ${isSubVisible
                                  ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                  : 'bg-red-50 text-red-700 hover:bg-red-100'
                                }`}
                            >
                              {isSubVisible ? 'Active' : 'Inactive'}
                            </button>

                            <button
                              onClick={() => handleOpenEditModal(sub)}
                              className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 transition"
                            >
                              <Edit className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => setDeleteTarget({ id: sub.id, title: sub.title })}
                              className="p-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* FormDrawer for Creating / Editing Menu & Submenu */}
      <FormDrawer
        isOpen={showItemModal}
        onClose={() => setShowItemModal(false)}
        title={editingItem ? 'Edit Menu Item' : parentId ? 'Add Submenu Item' : 'Add Top-Level Menu'}
        subtitle={editingItem ? 'Modify menu title, URL, or target action' : 'Create navigation link for website visitors'}
        icon={<MenuIcon className="w-5 h-5 text-primary" />}
        mode={editingItem ? 'edit' : 'create'}
        onSubmit={handleSaveItem}
        loading={actionLoading}
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
              Menu Display Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Campus News, Research, Academic Calendar"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
              Menu Level / Parent
            </label>
            <select
              value={parentId}
              onChange={(e) => setParentId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-sm"
            >
              <option value="">[ Top-Level Menu Item ]</option>
              {rootItems
                .filter((item) => !editingItem || String(item.id) !== String(editingItem.id))
                .map((item) => (
                  <option key={item.id} value={String(item.id)}>
                    Submenu under: {item.title}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
              What Happens When Clicked? (Target Type)
            </label>
            <select
              value={targetType}
              onChange={(e) => {
                const newType = e.target.value;
                setTargetType(newType);
                if (newType === 'DYNAMIC_MODULE' && !url) {
                  setUrl('/about');
                } else if (newType === 'EXTERNAL_LINK' && (!url || url.startsWith('/'))) {
                  setUrl('https://');
                }
              }}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-sm font-semibold"
            >
              <option value="DYNAMIC_MODULE">Dynamic College Module (Courses, Faculty, News, etc.)</option>
              <option value="INTERNAL_PAGE">Internal Dynamic Page (Slug Route)</option>
              <option value="SECTION_ANCHOR">Section Anchor (Scrolls down, e.g. #departments)</option>
              <option value="EXTERNAL_LINK">External Website Link</option>
              <option value="FILE_DOWNLOAD">Brochure or Document Download</option>
            </select>
          </div>

          {/* Categorized Route & Slug Directory Picker */}
          {(targetType === 'DYNAMIC_MODULE' || targetType === 'INTERNAL_PAGE') && (
            <div className="space-y-2 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  <span>1-Click Route & Slug Picker</span>
                </label>
                <span className="text-[11px] text-slate-400 font-medium">
                  {filteredRoutes.length} available
                </span>
              </div>

              {/* Category Filter Chips */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[11px]">
                {[
                  { key: 'ALL', label: 'All' },
                  { key: 'CORE', label: 'Core Modules' },
                  { key: 'PAGES', label: 'CMS Pages' },
                  { key: 'DEPARTMENTS', label: 'Departments' },
                  { key: 'NEWS', label: 'News' },
                  { key: 'NOTICES', label: 'Notices' },
                  { key: 'GALLERY', label: 'Gallery' },
                ].map((tab) => (
                  <button
                    type="button"
                    key={tab.key}
                    onClick={() => setPickerCategory(tab.key as any)}
                    className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition ${pickerCategory === tab.key
                        ? 'bg-primary text-white shadow-sm'
                        : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                      }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Search input */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={pickerSearch}
                  onChange={(e) => setPickerSearch(e.target.value)}
                  placeholder="Filter routes by title or slug..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white text-xs"
                />
              </div>

              {/* Routes List */}
              <div className="max-h-40 overflow-y-auto space-y-1 p-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                {filteredRoutes.length === 0 ? (
                  <div className="p-3 text-center text-xs text-slate-400">
                    No routes found matching your filter.
                  </div>
                ) : (
                  filteredRoutes.map((r, rIdx) => {
                    const isSelected = url === r.url;
                    const IconComp = r.icon;
                    return (
                      <button
                        type="button"
                        key={`${r.url}-${rIdx}`}
                        onClick={() => {
                          setUrl(r.url);
                          if (!title.trim()) setTitle(r.label);
                        }}
                        className={`w-full p-2 rounded-lg text-left flex items-center justify-between gap-2 transition text-xs ${isSelected
                            ? 'bg-primary/10 border border-primary/40 text-primary font-bold'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
                          }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <IconComp className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                          <span className="truncate">{r.label}</span>
                          <span className={`px-1.5 py-0.2 rounded text-[10px] border ${r.color}`}>
                            {r.badge}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 font-mono text-[10px] text-slate-400 shrink-0">
                          <span>{r.url}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-primary ml-1" />}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
              Destination URL / Route *
            </label>
            <div className="relative">
              <Link2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="e.g. /news, /departments/cse, /about, #admission, https://example.edu"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white font-mono text-xs focus:ring-2 focus:ring-primary focus:outline-none"
                required
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Selected destination: <span className="font-mono text-primary font-medium">{url || '(None)'}</span>
            </p>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <input
              type="checkbox"
              id="openInNewTab"
              checked={openInNewTab}
              onChange={(e) => setOpenInNewTab(e.target.checked)}
              className="w-4 h-4 rounded text-primary focus:ring-primary border-slate-300"
            />
            <label htmlFor="openInNewTab" className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
              Open link in a new browser tab
            </label>
          </div>
        </div>
      </FormDrawer>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteItem}
        title="Delete Menu Item"
        message={`This permanently deletes "${deleteTarget?.title}" and any nested submenus. This action cannot be undone.`}
        confirmText="Delete"
        loading={actionLoading}
      />
    </div>
  );
};
