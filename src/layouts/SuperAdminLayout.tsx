import React from 'react';
import { Link, Outlet, useNavigate, useLocation, Navigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Users,
  Globe2,
  Database,
  Palette,
  Sliders,
  GitBranch,
  FileClock,
  Settings,
  LogOut,

  ShieldCheck,
  Server,
  Menu,
  LayoutTemplate
} from 'lucide-react';
import { ThemeToggle } from '../components/common/ThemeToggle';
import { HeaderProfileDropdown } from '../components/common/HeaderProfileDropdown';
import { useLayoutContext } from '../context/useLayoutContext';
import { Customizer } from './components/Customizer';
import { getPlatformBranding, applyBrowserBranding, PlatformBranding } from '../services/platformBranding';

interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const SuperAdminLayout: React.FC = () => {
  const { toggleCustomizer, sidenavSize, updateSettings } = useLayoutContext();
  const navigate = useNavigate();
  const location = useLocation();

  const [branding, setBranding] = React.useState<PlatformBranding>(getPlatformBranding());

  React.useEffect(() => {
    // Apply current branding on mount & route changes
    applyBrowserBranding(branding.platformName, branding.faviconUrl);

    // Listen for real-time branding updates across components/settings
    const handleBrandingUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<PlatformBranding>;
      if (customEvent.detail) {
        setBranding(customEvent.detail);
        applyBrowserBranding(customEvent.detail.platformName, customEvent.detail.faviconUrl);
      }
    };

    window.addEventListener('platform-branding-updated', handleBrandingUpdate);
    return () => {
      window.removeEventListener('platform-branding-updated', handleBrandingUpdate);
    };
  }, [location.pathname, branding.platformName, branding.faviconUrl]);

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
    navigate('/superadmin/login');
  };

  if (!token || user?.role !== 'SuperAdmin') {
    // Declarative redirect to avoid side-effects during render pass
    return <Navigate to="/superadmin/login" replace />;
  }

  const navSections: NavSection[] = [
    {
      title: 'OVERVIEW',
      items: [
        { label: 'Dashboard', path: '/superadmin/dashboard', icon: LayoutDashboard },
      ],
    },
    {
      title: 'TENANT MANAGEMENT',
      items: [
        { label: 'Colleges', path: '/superadmin/colleges', icon: Building2 },
        { label: 'College Admins', path: '/superadmin/admins', icon: Users },
        { label: 'Domains', path: '/superadmin/domains', icon: Globe2 },
      ],
    },
    {
      title: 'PLATFORM',
      items: [
        { label: 'Templates', path: '/superadmin/templates', icon: LayoutTemplate },
        { label: 'Databases', path: '/superadmin/databases', icon: Database },
        { label: 'Themes', path: '/superadmin/themes', icon: Palette },
        { label: 'Features', path: '/superadmin/features', icon: Sliders },
      ],
    },
    {
      title: 'SECURITY & OPERATIONS',
      items: [
        { label: 'Roles & Access', path: '/superadmin/roles', icon: ShieldCheck },
        { label: 'Migrations', path: '/superadmin/migrations', icon: GitBranch },
        { label: 'Audit Logs', path: '/superadmin/audit-logs', icon: FileClock },
      ],
    },
    {
      title: 'SYSTEM',
      items: [
        { label: 'Settings', path: '/superadmin/settings', icon: Settings },
      ],
    },
  ];

  return (
    <div className="superadmin-layout h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased overflow-hidden">
      {/* SuperAdmin Sidebar (Deep Navy #0F172A, Fixed position, compact container) */}
      <aside className="sticky top-0 h-screen w-64 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col justify-between shrink-0 transition-all duration-300 overflow-hidden z-30">
        <div className="flex flex-col flex-1 min-h-0">
          {/* Logo & SuperAdmin Title (h-16 aligns with header) */}
          <div className="sidebar-logo-container h-16 px-4 border-b border-slate-800/80 flex items-center shrink-0 transition-all">
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={branding.logoUrl || '/assets/superadmin-logo.png'}
                alt={`${branding.platformName} Logo`}
                className="w-8 h-8 object-contain shrink-0 rounded-lg bg-slate-800 border border-slate-700/80 p-0.5"
                onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
              />
              <div className="sidebar-brand-text min-w-0">
                <div className="flex items-center gap-1.5">
                  <h1 className="font-bold text-white text-sm tracking-tight truncate whitespace-nowrap" title={branding.platformName}>
                    {branding.platformName}
                  </h1>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-600 text-white shadow-2xs">
                    SuperAdmin
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                  <span className="text-[10px] font-mono text-slate-400 font-medium tracking-wide truncate" title={branding.platformSubtitle}>
                    {branding.platformSubtitle || 'Control Plane'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Links Grouped by Section */}
          <nav className="p-3 space-y-4 overflow-y-auto flex-1 overflow-x-hidden">
            {navSections.map((section) => (
              <div key={section.title} className="space-y-1">
                <div className="sidebar-section-title px-3 pt-1 pb-0.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase select-none">
                  {section.title}
                </div>
                <div className="space-y-0.5">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname.startsWith(item.path);
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        title={item.label}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition duration-150 ${isActive
                          ? 'bg-blue-600 text-white font-semibold shadow-sm'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
                          }`}
                      >
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                        <span className="sidebar-nav-text truncate">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Footer Info & Sign Out */}
        <div className="p-3 border-t border-slate-800/80 space-y-2 shrink-0 overflow-x-hidden">
          <div className="sidebar-footer-info px-3 py-2 rounded-lg bg-slate-800/60 text-xs border border-slate-700/50">
            <div className="flex items-center gap-2 mb-0.5">
              <Server className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span className="font-semibold text-slate-200 text-[11px] truncate">
                {user?.fullName || 'Super Administrator'}
              </span>
            </div>
            <p className="text-[10px] font-mono text-slate-400 truncate">
              DB: <span className="text-blue-300 font-semibold">dinamic_college_website</span>
            </p>
          </div>

          <div className="flex flex-col gap-0.5">
            <Link
              to="/"
              target="_blank"
              title="Open Public Gateway"
              className="sidebar-footer-link flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/70 transition"
            >
              <Globe2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="sidebar-footer-text truncate">Public Gateway ↗</span>
            </Link>

            <button
              onClick={handleLogout}
              title="Sign Out SuperAdmin"
              className="sidebar-footer-link flex items-center gap-2.5 w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-950/40 transition"
            >
              <LogOut className="w-3.5 h-3.5 shrink-0" />
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
            {/* Sidebar toggle button (Hamburger) */}
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              title={sidenavSize === 'default' ? 'Collapse Sidebar' : 'Expand Sidebar'}
            >
              <Menu className="w-4 h-4" />
            </button>

            <div className="hidden sm:flex items-center gap-2.5 pl-2 border-l border-slate-200 dark:border-slate-700">
              <div>
                <h2 className="text-xs font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
                  {branding.platformName}
                </h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-none mt-0.5">
                  {branding.platformSubtitle || 'Enterprise Multi-Tenant Infrastructure & Database Control Plane'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-300 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>PostgreSQL :5433 (Active)</span>
            </div>

            <button
              onClick={toggleCustomizer}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
              title="Open Display Preferences"
            >
              <Settings className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>Preferences</span>
            </button>

            {/* 1-Click Theme Switcher Icon */}
            <ThemeToggle variant="superadmin" />




            {/* Direct Logout Button on Header */}
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-900/50 transition cursor-pointer shadow-2xs"
              title="Sign Out SuperAdmin"
            >
              <LogOut className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden xs:inline sm:inline font-bold">Logout</span>
            </button>
          </div>
        </header>

        <main className="p-6 lg:p-8 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Admin Customizer Drawer */}
      <Customizer />
    </div>
  );
};
