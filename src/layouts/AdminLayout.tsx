import React, { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Newspaper,
  CalendarDays,
  Globe,
  LogOut,
  GraduationCap,
  ShieldCheck,
  Building2,
  BookOpen,
  Users,
  Image,
  Sliders,
  UserCheck,
  Settings,
  Menu,
  Volume2,
  FileText,
  ChevronDown,
  ChevronRight,
  BarChart3,
  Quote,
  Award,
  Briefcase,
  Layers,
  Home,
  MessageSquare,
  MapPin,
  Bell
} from 'lucide-react';
import { useTenant } from '../tenant/TenantContext';
import { ThemeToggle } from '../components/common/ThemeToggle';
import { HeaderProfileDropdown } from '../components/common/HeaderProfileDropdown';
import { useLayoutContext } from '../context/useLayoutContext';
import { Customizer } from './components/Customizer';
import { LivePreviewModal } from '../UI_Componentes/ui';
import { CapabilityProvider, useCapabilities } from '../contexts/CapabilityContext';

const AdminLayoutContent: React.FC = () => {
  const { siteConfig } = useTenant();
  const { capabilities } = useCapabilities();
  const { toggleCustomizer, sidenavSize, updateSettings } = useLayoutContext();
  const navigate = useNavigate();
  const location = useLocation();

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('/');
  const [previewTitle, setPreviewTitle] = useState('Website Live Preview');

  React.useEffect(() => {
    const titleName = siteConfig?.settings?.siteName || siteConfig?.tenant.name;
    if (titleName) {
      document.title = `${titleName} Admin Portal`;
    }
  }, [siteConfig]);

  const toggleSidebar = () => {
    if (sidenavSize === 'on-hover' || sidenavSize === 'condensed') {
      updateSettings({ sidenavSize: 'default' });
    } else {
      updateSettings({ sidenavSize: 'on-hover' });
    }
  };

  const token = localStorage.getItem('college_auth_token');
  const userStr = localStorage.getItem('college_auth_user');
  const user = userStr ? JSON.parse(userStr) : null;

  const handleLogout = () => {
    localStorage.removeItem('college_auth_token');
    localStorage.removeItem('college_auth_user');
    navigate('/admin/login');
  };

  if (!token) {
    navigate('/admin/login');
    return null;
  }

  const openPreview = (url: string = '/', title: string = 'Website Live Preview') => {
    setPreviewUrl(url);
    setPreviewTitle(title);
    setPreviewOpen(true);
  };

  const getContextualPreview = (path: string) => {
    const collegeName = siteConfig?.tenant.name || 'College';
    if (path.startsWith('/admin/marquee')) {
      return { url: '/preview/module/marquee', title: `${collegeName} - Marquee Announcement Module` };
    }
    if (path.startsWith('/admin/menus')) {
      return { url: '/preview/module/header', title: `${collegeName} - Navigation Header Module` };
    }
    if (path.startsWith('/admin/banners')) {
      return { url: '/preview/module/banners', title: `${collegeName} - Hero Slider Module` };
    }
    if (path.startsWith('/admin/stats')) {
      return { url: '/preview/module/stats', title: `${collegeName} - Stats Counter Bar Module` };
    }
    if (path.startsWith('/admin/quote')) {
      return { url: '/preview/module/quote', title: `${collegeName} - Welcome Quote Module` };
    }
    if (path.startsWith('/admin/placements')) {
      return { url: '/preview/module/placements', title: `${collegeName} - Placements Module` };
    }
    if (path.startsWith('/admin/recruiters')) {
      return { url: '/preview/module/recruiters', title: `${collegeName} - Recruiters Module` };
    }
    if (path.startsWith('/admin/departments')) {
      return { url: '/preview/module/departments', title: `${collegeName} - Departments Module` };
    }
    if (path.startsWith('/admin/courses')) {
      return { url: '/preview/module/courses', title: `${collegeName} - Degree Courses Module` };
    }
    if (path.startsWith('/admin/faculty')) {
      return { url: '/preview/module/faculty', title: `${collegeName} - Faculty Directory Module` };
    }
    if (path.startsWith('/admin/news')) {
      return { url: '/preview/module/news', title: `${collegeName} - Campus News Module` };
    }
    if (path.startsWith('/admin/notices')) {
      return { url: '/notices', title: `${collegeName} - Notices & Circulars Module` };
    }
    if (path.startsWith('/admin/events')) {
      return { url: '/preview/module/events', title: `${collegeName} - College Events Module` };
    }
    if (path.startsWith('/admin/gallery')) {
      return { url: '/preview/module/gallery', title: `${collegeName} - Photo Gallery Module` };
    }
    if (path.startsWith('/admin/admissions')) {
      return { url: '/preview/module/admissions', title: `${collegeName} - Admissions Module` };
    }
    if (path.startsWith('/admin/settings')) {
      return { url: '/preview/module/footer', title: `${collegeName} - Footer & Helpdesk Module` };
    }
    return { url: '/', title: `${collegeName} - Full Website` };
  };

  const handleOpenCurrentModulePreview = () => {
    const { url, title } = getContextualPreview(location.pathname);
    openPreview(url, title);
  };

  const enabledFeatures = capabilities?.enabledFeatures?.length
    ? capabilities.enabledFeatures
    : siteConfig?.enabledFeatures || [];

  const isFeatureActive = (code: string) => {
    const target = code.toUpperCase();
    if (target === 'QUOTES') return enabledFeatures.some((f) => f === 'QUOTES' || f === 'QUOTE');
    if (target === 'STATISTICS') return enabledFeatures.some((f) => f === 'STATISTICS' || f === 'STATS');
    return enabledFeatures.some((f) => f.toUpperCase() === target);
  };

  // Dynamic Website -> Home Page Submodules
  const homeSubItems = [
    { label: 'Notifications Bar', path: '/admin/marquee', icon: Volume2, featureCode: 'MARQUEE' },
    { label: 'Hero Slider & Highlights', path: '/admin/banners', icon: Sliders, featureCode: 'BANNERS' },
    { label: 'Stats Counter Bar', path: '/admin/stats', icon: BarChart3, featureCode: 'STATS' },
    { label: 'Quote Management', path: '/admin/quote', icon: Quote, featureCode: 'QUOTES' },
    { label: 'Placements Records', path: '/admin/placements', icon: Award, featureCode: 'PLACEMENTS' },
    { label: 'Partner Recruiters', path: '/admin/recruiters', icon: Briefcase, featureCode: 'RECRUITERS' },
  ].filter((item) => isFeatureActive(item.featureCode));

  const isHomeSubActive = homeSubItems.some((item) => location.pathname.startsWith(item.path));
  const [homeAccordionOpen, setHomeAccordionOpen] = useState(true);

  // Contact sub-items accordion
  const contactSubItems = [
    { label: 'Contact Inquiries', path: '/admin/contact-submissions', icon: MessageSquare },
    { label: 'Contact Info Settings', path: '/admin/contact-info-settings', icon: MapPin },
  ];
  const isContactSubActive = contactSubItems.some((item) => location.pathname.startsWith(item.path));
  const [contactAccordionOpen, setContactAccordionOpen] = useState(isContactSubActive);

  const websiteCoreItems = [
    { label: 'Navigation Menus', path: '/admin/menus', icon: Menu, featureCode: 'MENUS' },
    { label: 'Pages & Sections', path: '/admin/pages', icon: FileText, featureCode: 'PAGES' },
  ].filter((item) => !item.featureCode || isFeatureActive(item.featureCode));

  const academicItems = [
    { label: 'Departments', path: '/admin/departments', icon: Building2, featureCode: 'DEPARTMENTS' },
    { label: 'Courses & Programs', path: '/admin/courses', icon: BookOpen, featureCode: 'COURSES' },
    { label: 'Faculty Directory', path: '/admin/faculty', icon: Users, featureCode: 'FACULTY' },
  ].filter((item) => isFeatureActive(item.featureCode));

  const campusItems = [
    { label: 'Campus News', path: '/admin/news', icon: Newspaper, featureCode: 'NEWS' },
    { label: 'College Events', path: '/admin/events', icon: CalendarDays, featureCode: 'EVENTS' },
    { label: 'Notices & Circulars', path: '/admin/notices', icon: Bell, featureCode: 'NOTICES' },
    { label: 'Photo Gallery', path: '/admin/gallery', icon: Image, featureCode: 'GALLERY' },
  ].filter((item) => !item.featureCode || isFeatureActive(item.featureCode));

  const tenantDbName = siteConfig?.tenant.databaseName || `college_${siteConfig?.tenant.tenantCode?.toLowerCase() || 'database'}`;

  return (
    <div className="admin-layout h-screen flex bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden">
      {/* Sidebar (Fixed position, non-scrolling container) */}
      <aside className="sticky top-0 h-screen w-64 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col justify-between shrink-0 overflow-hidden transition-all duration-300 z-30">
        <div className="flex flex-col flex-1 min-h-0">
          {/* Logo & Tenant badge */}
          <div className="sidebar-logo-container h-16 px-4 border-b border-slate-800/80 flex items-center shrink-0 bg-slate-900/90 backdrop-blur-xs">
            <div className="flex items-center gap-3 min-w-0 w-full">
              {siteConfig?.settings?.logoUrl ? (
                <div className="w-9 h-9 rounded-xl bg-white p-1 flex items-center justify-center shrink-0 shadow-xs border border-slate-700/50">
                  <img
                    src={siteConfig.settings.logoUrl}
                    alt="College Logo"
                    className="w-full h-full object-contain"
                    onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                  />
                </div>
              ) : (
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center shrink-0 shadow-xs border border-blue-500/30">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
              )}
              <div className="sidebar-brand-text min-w-0 flex-1 flex flex-col justify-center">
                <h1 className="font-extrabold text-white text-xs leading-snug tracking-tight truncate">
                  {siteConfig?.settings?.siteName || siteConfig?.tenant.name || 'College Admin'}
                </h1>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-800/90 text-amber-400 border border-slate-700/60 shrink-0">
                    <ShieldCheck className="w-3 h-3 text-amber-400 shrink-0" />
                    <span className="truncate">{siteConfig?.tenant.tenantCode || 'SHC'}</span>
                  </span>
                </div>
                {siteConfig?.settings?.tagline && (
                  <p className="text-[10px] text-blue-400 font-semibold truncate mt-0.5 leading-tight" title={siteConfig.settings.tagline}>
                    {siteConfig.settings.tagline}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Dynamic Scoped Navigation Links */}
          <nav className="p-3 space-y-3 overflow-y-auto flex-1 overflow-x-hidden">
            {/* 1. Main Dashboard */}
            <div>
              <Link
                to="/admin/dashboard"
                title="Dashboard"
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${location.pathname === '/admin/dashboard'
                  ? 'bg-primary text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
              >
                <LayoutDashboard className="w-4 h-4 shrink-0" />
                <span className="truncate">Dashboard</span>
              </Link>
            </div>

            {/* 2. Dynamic Website Group */}
            <div className="space-y-1">
              <div className="px-3 pb-1 text-[10px] font-black uppercase tracking-wider text-slate-500">
                Dynamic Website
              </div>

              {/* Home Page Accordion */}
              {homeSubItems.length > 0 && (
                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => setHomeAccordionOpen(!homeAccordionOpen)}
                    className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold transition ${isHomeSubActive
                      ? 'bg-slate-800 text-blue-400'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                      }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Home className="w-4 h-4 shrink-0" />
                      <span className="truncate font-bold">Home Page</span>
                    </div>
                    {homeAccordionOpen ? (
                      <ChevronDown className="w-3.5 h-3.5 shrink-0 opacity-70" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-70" />
                    )}
                  </button>

                  {/* Sub-modules List */}
                  {homeAccordionOpen && (
                    <div className="pl-6 pr-1 space-y-1 border-l-2 border-slate-800 ml-4 py-1">
                      {homeSubItems.map((sub) => {
                        const SubIcon = sub.icon;
                        const isSubActive = location.pathname.startsWith(sub.path);
                        return (
                          <Link
                            key={sub.path}
                            to={sub.path}
                            title={sub.label}
                            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition ${isSubActive
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'text-slate-400 hover:text-white hover:bg-slate-800'
                              }`}
                          >
                            <SubIcon className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{sub.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Other Core Web Modules */}
              {websiteCoreItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname.startsWith(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    title={item.label}
                    className={`flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${isActive
                      ? 'bg-primary text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* 3. Academics Group */}
            {academicItems.length > 0 && (
              <div className="space-y-1">
                <div className="px-3 pt-2 pb-1 text-[10px] font-black uppercase tracking-wider text-slate-500">
                  Academics
                </div>
                {academicItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname.startsWith(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      title={item.label}
                      className={`flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${isActive
                        ? 'bg-primary text-white shadow-md'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                        }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* 4. Campus Life & Admissions */}
            {(campusItems.length > 0 || true) && (
              <div className="space-y-1">
                <div className="px-3 pt-2 pb-1 text-[10px] font-black uppercase tracking-wider text-slate-500">
                  Campus Life
                </div>

                {campusItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname.startsWith(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      title={item.label}
                      className={`flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${isActive
                        ? 'bg-primary text-white shadow-md'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                        }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  );
                })}

                {/* Contact — collapsible accordion */}
                <div>
                  <button
                    type="button"
                    onClick={() => setContactAccordionOpen(!contactAccordionOpen)}
                    className={`w-full flex items-center justify-between gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${isContactSubActive
                      ? 'bg-primary/20 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <MessageSquare className="w-4 h-4 shrink-0" />
                      <span className="truncate font-bold">Contact</span>
                    </div>
                    {contactAccordionOpen ? (
                      <ChevronDown className="w-3.5 h-3.5 shrink-0 opacity-70" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-70" />
                    )}
                  </button>

                  {contactAccordionOpen && (
                    <div className="pl-6 pr-1 space-y-1 border-l-2 border-slate-800 ml-4 py-1">
                      {contactSubItems.map((sub) => {
                        const SubIcon = sub.icon;
                        const isSubActive = location.pathname.startsWith(sub.path);
                        return (
                          <Link
                            key={sub.path}
                            to={sub.path}
                            title={sub.label}
                            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition ${isSubActive
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'text-slate-400 hover:text-white hover:bg-slate-800'
                              }`}
                          >
                            <SubIcon className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{sub.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}


            {/* 5. Settings & Footer */}
            <div className="space-y-1 pt-1">
              <Link
                to="/admin/settings"
                title="Campus & Footer Settings"
                className={`flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${location.pathname.startsWith('/admin/settings')
                  ? 'bg-primary text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
              >
                <Settings className="w-4 h-4 shrink-0" />
                <span className="truncate">College Title & Logo Settings</span>
              </Link>
            </div>
          </nav>
        </div>

        {/* Footer info & Logout */}
        <div className="p-3 border-t border-slate-800 space-y-2 shrink-0 overflow-x-hidden">
          <div className="flex flex-col gap-1.5">


            <button
              onClick={handleLogout}
              title="Sign Out"
              className="sidebar-footer-link flex items-center gap-2.5 w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-950/40 transition"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span className="sidebar-footer-text truncate">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area (Canvas #F8FAFC, Header #FFFFFF) */}
      <div className="flex-1 h-screen flex flex-col min-w-0 bg-slate-50 dark:bg-slate-950 overflow-hidden">
        {/* Fixed Header (#FFFFFF / #0F172A, 64px) */}
        <header className="h-16 shrink-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs transition-colors">
          <div className="flex items-center gap-3">
            {/* Sidebar toggle button (Hamburger only) */}
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              title={sidenavSize === 'default' ? 'Collapse Sidebar (On-Hover)' : 'Expand Sidebar'}
            >
              <Menu className="w-4 h-4" />
            </button>

            <div className="hidden sm:block pl-2 border-l border-slate-200 dark:border-slate-700">
              <h2 className="text-xs font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
                {siteConfig?.settings?.siteName || siteConfig?.tenant.name || 'College Admin'} CMS
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-none mt-0.5">
                Managing isolated tenant database <strong className="text-blue-600 dark:text-blue-400 font-mono">{tenantDbName}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-2.5">
            <button
              type="button"
              onClick={handleOpenCurrentModulePreview}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
              title={`Preview ${getContextualPreview(location.pathname).title} Live`}
            >
              <Globe className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Preview Live Site</span>
            </button>
            <button
              onClick={toggleCustomizer}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
              title="Open Admin Customizer"
            >
              <Settings className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>Customize</span>
            </button>

            {/* 1-Click Theme Switcher Icon */}
            <ThemeToggle variant="admin" />



            {/* Direct Logout Button on Header */}
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-900/50 transition cursor-pointer shadow-2xs"
              title="Sign Out / Logout"
            >
              <LogOut className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden xs:inline sm:inline font-bold">Logout</span>
            </button>
          </div>
        </header>

        <main className="p-6 lg:p-8 flex-1 overflow-y-auto">
          <Outlet context={{ openPreview, getContextualPreview }} />
        </main>
      </div>

      {/* Admin Customizer Drawer */}
      <Customizer />

      {/* Live In-Page Preview Modal */}
      <LivePreviewModal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        urlPath={previewUrl}
        title={previewTitle}
      />
    </div>
  );
};

export const AdminLayout: React.FC = () => {
  return (
    <CapabilityProvider>
      <AdminLayoutContent />
    </CapabilityProvider>
  );
};
