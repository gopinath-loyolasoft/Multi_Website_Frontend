import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ExternalLink, FileText, Lock, Menu, X, ShieldCheck } from 'lucide-react';
import { MenuItem, SiteConfig } from '../../types';

interface NavigationMenuRendererProps {
  siteConfig: SiteConfig;
  visibleMenus: MenuItem[];
  activeDropdown: string | null;
  setActiveDropdown: (k: string | null) => void;
  mobileOpen: boolean;
  setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
  mobileExpanded: Record<string, boolean>;
  toggleMobileAccordion: (k: string) => void;
  handleMouseEnter: (k: string) => void;
  handleMouseLeave: () => void;
  isUniversity?: boolean;
  isArtsAndScience?: boolean;
}

export const NavigationMenuRenderer: React.FC<NavigationMenuRendererProps> = ({
  siteConfig,
  visibleMenus,
  activeDropdown,
  mobileOpen,
  setMobileOpen,
  mobileExpanded,
  toggleMobileAccordion,
  handleMouseEnter,
  handleMouseLeave,
  isUniversity,
  isArtsAndScience,
}) => {
  const location = useLocation();

  const handleAnchorClick = (url: string, e: React.MouseEvent) => {
    if (url.startsWith('/#')) {
      const targetId = url.replace('/#', '');
      if (location.pathname === '/' || location.pathname === '/site') {
        e.preventDefault();
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  const isMenuItemActive = (url?: string) => {
    if (!url) return false;
    if (url === '/' || url === '/site') {
      return location.pathname === '/' || location.pathname === '/site';
    }
    return location.pathname.startsWith(url);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:flex items-center gap-1">
        {visibleMenus.map((item, mIdx) => {
          const menuKey = item.title.toLowerCase().trim();
          const isRightAligned = mIdx >= Math.max(1, Math.floor(visibleMenus.length / 2));
          const subItems = (item.children && item.children.length > 0)
            ? item.children.filter((c) => c.isVisible !== false)
            : [];
          const hasDropdown = subItems.length > 0;
          const isOpen = activeDropdown === menuKey;
          const isExternal = item.openInNewTab || item.targetType === 'EXTERNAL_LINK';
          const isActive = isMenuItemActive(item.url);

          const linkClass = isUniversity
            ? (isActive ? 'text-rose-400 bg-slate-900 font-bold shadow-xs' : isOpen ? 'text-rose-400 bg-slate-900' : 'text-slate-200 hover:text-white hover:bg-slate-900')
            : (isActive ? 'text-primary bg-primary/10 font-bold shadow-xs' : isOpen ? 'text-primary bg-slate-50' : isArtsAndScience ? 'text-slate-800 hover:text-emerald-800 hover:bg-amber-100/50' : 'text-slate-700 hover:text-primary hover:bg-slate-50');

          return (
            <div
              key={item.id}
              className="relative"
              onMouseEnter={() => hasDropdown && handleMouseEnter(menuKey)}
              onMouseLeave={() => hasDropdown && handleMouseLeave()}
            >
              <div className="flex items-center">
                {isExternal ? (
                  <a
                    href={item.url || '/'}
                    target="_blank"
                    rel="noreferrer"
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition ${linkClass}`}
                  >
                    <span>{item.title}</span>
                    <ExternalLink className="w-3 h-3 opacity-60 ml-0.5" />
                    {hasDropdown && (
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180 text-primary' : 'text-slate-400'}`} />
                    )}
                  </a>
                ) : (
                  <Link
                    to={item.url || '/'}
                    onClick={(e) => handleAnchorClick(item.url || '/', e)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition ${linkClass}`}
                  >
                    <span>{item.title}</span>
                    {hasDropdown && (
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180 text-primary' : 'text-slate-400'}`} />
                    )}
                  </Link>
                )}
              </div>

              {/* Dropdown Sub-menu Container */}
              {hasDropdown && isOpen && (
                <div className={`absolute top-full ${isRightAligned ? 'right-0' : 'left-0'} mt-1 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-800 p-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150`}>
                  <div className="px-3 py-1.5 mb-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800">
                    {item.title} Links
                  </div>
                  <div className="space-y-1">
                    {subItems.map((sub, idx) => {
                      const isSubExternal = sub.openInNewTab || sub.targetType === 'EXTERNAL_LINK' || (sub.url && sub.url.startsWith('http'));
                      const isSubActive = isMenuItemActive(sub.url);

                      if (isSubExternal) {
                        return (
                          <a
                            key={idx}
                            href={sub.url || '#'}
                            target="_blank"
                            rel="noreferrer"
                            className="group flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                          >
                            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-primary/10 flex items-center justify-center text-slate-500 group-hover:text-primary transition shrink-0 mt-0.5">
                              <FileText className="w-4 h-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-primary transition flex items-center justify-between">
                                <span>{sub.title}</span>
                                <ExternalLink className="w-3 h-3 opacity-50 ml-1" />
                              </div>
                            </div>
                          </a>
                        );
                      }

                      return (
                        <Link
                          key={idx}
                          to={sub.url || '#'}
                          onClick={(e) => handleAnchorClick(sub.url || '#', e)}
                          className={`group flex items-start gap-3 p-2.5 rounded-xl transition ${isSubActive ? 'bg-primary/10 text-primary font-bold' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'}`}
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition shrink-0 mt-0.5 ${isSubActive ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 group-hover:bg-primary/10 text-slate-500 group-hover:text-primary'}`}>
                            <FileText className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className={`text-xs font-bold transition flex items-center justify-between ${isSubActive ? 'text-primary' : 'text-slate-900 dark:text-white group-hover:text-primary'}`}>
                              <span>{sub.title}</span>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Header Badge */}
        {Boolean(siteConfig.settings?.headerBadgeText) && (
          <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-900 dark:text-blue-200 border border-blue-200 dark:border-blue-900 shrink-0 ml-2">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
            <span>{siteConfig.settings?.headerBadgeText}</span>
          </div>
        )}

        {/* Admin Login Portal */}
        {(siteConfig.settings?.showAdminLink !== false) && (
          <Link
            to="/admin/login"
            className="ml-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold text-white bg-primary hover:opacity-90 shadow-md shadow-primary/20 transition hover:scale-105"
            title="Campus CMS Admin Login"
          >
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>{siteConfig.settings?.adminLinkText || 'Admin'}</span>
          </Link>
        )}
      </nav>

      {/* Mobile Hamburger Toggle Button */}
      <div className="flex items-center gap-2 lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Close Menu' : 'Open Menu'}
          className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Slide-Down Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[65px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 shadow-2xl p-6 z-40 max-h-[calc(100vh-80px)] overflow-y-auto animate-in slide-in-from-top-4 duration-200">
          <nav className="space-y-2">
            {visibleMenus.map((item) => {
              const menuKey = item.title.toLowerCase().trim();
              const subItems = (item.children && item.children.length > 0)
                ? item.children.filter((c) => c.isVisible !== false)
                : [];
              const hasDropdown = subItems.length > 0;
              const isExpanded = mobileExpanded[menuKey];
              const isExternal = item.openInNewTab || item.targetType === 'EXTERNAL_LINK';

              return (
                <div key={item.id} className="border-b border-slate-100 dark:border-slate-800 pb-2">
                  <div className="flex items-center justify-between">
                    {isExternal ? (
                      <a
                        href={item.url || '/'}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => setMobileOpen(false)}
                        className="flex-1 py-2 font-bold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-2"
                      >
                        <span>{item.title}</span>
                        <ExternalLink className="w-3.5 h-3.5 opacity-50" />
                      </a>
                    ) : (
                      <Link
                        to={item.url || '/'}
                        onClick={(e) => {
                          handleAnchorClick(item.url || '/', e);
                          setMobileOpen(false);
                        }}
                        className="flex-1 py-2 font-bold text-slate-800 dark:text-slate-100 text-sm"
                      >
                        {item.title}
                      </Link>
                    )}
                    {hasDropdown && (
                      <button
                        type="button"
                        onClick={() => toggleMobileAccordion(menuKey)}
                        className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                      >
                        <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>
                    )}
                  </div>

                  {hasDropdown && isExpanded && (
                    <div className="pl-4 pt-2 space-y-1.5">
                      {subItems.map((sub, sIdx) => {
                        const isSubExternal = sub.openInNewTab || sub.targetType === 'EXTERNAL_LINK' || (sub.url && sub.url.startsWith('http'));
                        return isSubExternal ? (
                          <a
                            key={sIdx}
                            href={sub.url || '#'}
                            target="_blank"
                            rel="noreferrer"
                            onClick={() => setMobileOpen(false)}
                            className="block py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-primary"
                          >
                            {sub.title} ↗
                          </a>
                        ) : (
                          <Link
                            key={sIdx}
                            to={sub.url || '#'}
                            onClick={(e) => {
                              handleAnchorClick(sub.url || '#', e);
                              setMobileOpen(false);
                            }}
                            className="block py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-primary"
                          >
                            {sub.title}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            <div className="pt-4 space-y-2">
              <Link
                to="/admin/login"
                onClick={() => setMobileOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs bg-slate-900 text-white shadow-sm"
              >
                <Lock className="w-4 h-4" />
                <span>Admin Login Portal</span>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </>
  );
};
