import React, { useState, useRef, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Lock,
  Globe2,
  ChevronDown,
  Menu as MenuIcon,
  X,
  Phone,
  Mail,

  MapPin,
  ArrowRight,
  ExternalLink,
  BookOpen,
  HeartPulse,
  Activity,
  Cpu,
  ShieldCheck,
  Landmark,
  PhoneCall,
  FileText,
  ArrowUp
} from 'lucide-react';
import { useTenant } from '../tenant/TenantContext';
import { useTheme } from '../themes/ThemeContext';
import { MarqueeBar } from '../components/common/MarqueeBar';

interface SubMenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ElementType;
}

export const WebsiteLayout: React.FC = () => {
  const { siteConfig, loading, error, tenantDomain } = useTenant();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<Record<string, boolean>>({});
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const dropdownTimeoutRef = useRef<any>(null);

  // Update browser document title dynamically
  useEffect(() => {
    if (siteConfig) {
      const siteName = siteConfig.settings?.siteName;
      const tenantName = siteConfig.tenant?.name;
      const titleName = (siteName && siteName !== 'KTS Institute of Technology & Management' && siteName !== 'College Dynamic Portal')
        ? siteName
        : (tenantName || siteName);
      if (titleName) {
        document.title = `${titleName} | Official Portal`;
      }
    }
  }, [siteConfig]);

  // Handle cross-page hash navigation & scroll restoration
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);

    if (location.hash) {
      const targetId = location.hash.replace('#', '');
      const scrollToTarget = () => {
        const el = document.getElementById(targetId) || document.querySelector(`[data-section-type="${targetId.toUpperCase()}"]`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      };

      scrollToTarget();
      const timer = setTimeout(scrollToTarget, 300);
      return () => clearTimeout(timer);
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.hash]);

  // Back to Top listener
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 350) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ScrollSpy observer on Home Page
  useEffect(() => {
    if (location.pathname !== '/') {
      setActiveSectionId(null);
      return;
    }

    const handleScrollSpy = () => {
      const sections = Array.from(document.querySelectorAll('section[id]'));
      if (sections.length === 0) return;

      const scrollPosition = window.scrollY + 120; // 120px offset for sticky header
      let currentSectionId: string | null = null;

      for (const sec of sections) {
        const el = sec as HTMLElement;
        const top = el.offsetTop;
        const height = el.offsetHeight;
        if (scrollPosition >= top && scrollPosition < top + height) {
          currentSectionId = el.id;
          break;
        }
      }

      if (!currentSectionId && window.scrollY < 200) {
        currentSectionId = 'hero';
      }

      if (currentSectionId) {
        setActiveSectionId(currentSectionId);
      }
    };

    window.addEventListener('scroll', handleScrollSpy, { passive: true });
    handleScrollSpy();
    return () => window.removeEventListener('scroll', handleScrollSpy);
  }, [location.pathname]);

  const handleAnchorClick = (targetUrl: string, e: React.MouseEvent) => {
    if (!targetUrl) return;

    // Check if it's an in-page anchor like "#departments" or "/#departments"
    if (targetUrl.includes('#')) {
      const [path, hash] = targetUrl.split('#');
      const isCurrentPage = !path || path === '/' ? location.pathname === '/' : location.pathname === path;

      if (isCurrentPage) {
        e.preventDefault();
        const el = document.getElementById(hash) || document.querySelector(`[data-section-type="${hash.toUpperCase()}"]`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          window.history.pushState(null, '', `/#${hash}`);
          setMobileMenuOpen(false);
          setActiveDropdown(null);
          return;
        }
      } else {
        // Navigate to the target page with hash
        setMobileMenuOpen(false);
        setActiveDropdown(null);
      }
    } else {
      setMobileMenuOpen(false);
      setActiveDropdown(null);
    }
  };

  const isMenuItemActive = (itemUrl?: string) => {
    if (!itemUrl) return false;
    if (location.pathname === '/') {
      if (itemUrl.includes('#')) {
        const hash = itemUrl.split('#')[1];
        return activeSectionId === hash;
      }
      if (itemUrl === '/') return !activeSectionId || activeSectionId === 'hero';
      return false;
    }
    return location.pathname === itemUrl || location.pathname.startsWith(itemUrl + '/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-600 font-medium">Resolving college platform & theme...</p>
      </div>
    );
  }

  if (error || !siteConfig) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <div className="max-w-md bg-white p-8 rounded-2xl shadow-xl border border-red-100">
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Globe2 className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">College Not Found</h2>
          <p className="text-slate-600 text-sm mb-6">
            Domain <strong>{tenantDomain}</strong> is not configured or backend is unavailable.
          </p>
          <div className="flex gap-2 justify-center">
            <a
              href="/"
              className="px-4 py-2 text-xs font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800"
            >
              Back to Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  const { tenant, theme, primaryMenu } = siteConfig;
  const themeConfig = theme?.configuration;
  const { isArtsAndScience, isMedical, isEngineering, isUniversity } = useTheme();

  const CrestIcon = isArtsAndScience ? BookOpen : isMedical ? Activity : isUniversity ? Landmark : Cpu;
  const crestBg = isArtsAndScience ? 'bg-emerald-700 shadow-emerald-800/25' : isMedical ? 'bg-cyan-700 shadow-cyan-800/25' : isUniversity ? 'bg-rose-900 shadow-rose-950/25' : 'bg-blue-800 shadow-blue-900/25';
  const nameFont = isArtsAndScience ? 'font-serif font-bold tracking-normal' : isMedical ? 'font-sans font-extrabold tracking-tight' : isUniversity ? 'font-serif font-black tracking-tight text-slate-900' : 'font-sans font-black tracking-tight uppercase';
  const badgeFont = isArtsAndScience ? 'font-serif italic text-emerald-700' : isMedical ? 'font-sans font-semibold text-cyan-700' : isUniversity ? 'font-sans font-extrabold uppercase text-rose-800 tracking-wider text-[10px]' : 'font-sans font-bold text-blue-800';
  const defaultBadge = isArtsAndScience ? 'UGC Autonomous • Heritage Institution' : isMedical ? 'NMC Recognized • 1200-Bed Teaching Hospital' : isUniversity ? 'Central Research University • Multi-Faculty' : 'AICTE Approved • NBA Tier-1';

  const handleMouseEnter = (key: string) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdown(key);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  const toggleMobileAccordion = (key: string) => {
    setMobileExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const visibleMenus = (primaryMenu || []).filter((item) => item.isVisible !== false);

  return (
    <div className="public-website min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">

      {/* 1. Dynamic Top Announcement Marquee Bar */}
      <MarqueeBar marquee={siteConfig?.marquee} />

      {/* 1b. Template-Specific Top Hotline Bar for Medical / Hospital */}
      {isMedical && (
        <div className="bg-teal-900 text-teal-100 text-xs py-1.5 px-6 sm:px-10 flex flex-wrap items-center justify-between gap-2 border-b border-teal-800 font-medium">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-teal-300 font-bold">
              <HeartPulse className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              <span>24/7 Casualty & Hospital Helpline: +91 98765 43210</span>
            </span>
            <span className="hidden md:inline text-teal-400">|</span>
            <span className="hidden md:inline text-teal-200 text-[11px]">NMC Recognized • 1200-Bed Teaching Hospital</span>
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <Link to="/contact" className="hover:underline text-teal-200">Patient Desk</Link>
            <span>•</span>
            <Link to="/admissions" className="hover:underline text-amber-300 font-bold">NEET Admissions 2026</Link>
          </div>
        </div>
      )}

      {/* 2. Main University Header with Dropdown Menus */}
      <header className={`sticky top-0 z-40 shadow-sm transition-colors backdrop-blur-md ${
        isUniversity 
          ? 'bg-slate-950/95 text-white border-b border-slate-800'
          : isArtsAndScience
          ? 'bg-amber-50/70 border-b border-amber-200/80 font-serif'
          : isMedical
          ? 'bg-white/95 border-b border-teal-100'
          : 'bg-white/95 border-b border-slate-200'
      }`}>
        <div className="max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-16 py-3.5 flex items-center justify-between">

          {/* College Crest & Name / Dynamic Logo */}
          <Link to="/" className="flex items-center gap-3.5 group">
            {siteConfig.settings?.logoUrl ? (
              <img
                src={siteConfig.settings.logoUrl}
                alt={siteConfig.settings?.siteName || tenant.name}
                className="h-11 max-w-[160px] object-contain group-hover:scale-105 transition duration-300 shrink-0"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-white ${crestBg} shadow-md group-hover:scale-105 transition duration-300 shrink-0`}>
                <CrestIcon className="w-6 h-6" />
              </div>
            )}
            <div>
              <span className={`text-xl leading-tight block ${isUniversity ? 'text-white' : 'text-slate-900'} ${nameFont}`}>
                {siteConfig.settings?.siteName || tenant.name}
              </span>
              <span className={`text-[11px] tracking-wide block ${badgeFont}`}>
                {siteConfig.settings?.tagline || themeConfig?.badgeText || defaultBadge}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation with Dropdowns */}
          <nav className="hidden lg:flex items-center gap-1">
            {visibleMenus.map((item, mIdx) => {
              const menuKey = item.title.toLowerCase().trim();
              const isRightAligned = mIdx >= Math.max(1, Math.floor(visibleMenus.length / 2));
              const subItems: (SubMenuItem & { openInNewTab?: boolean; targetType?: string })[] =
                item.children && item.children.length > 0
                  ? item.children
                    .filter((c) => c.isVisible !== false)
                    .map((c) => ({
                      title: c.title,
                      url: c.url || '#',
                      description: '',
                      icon: FileText,
                      openInNewTab: c.openInNewTab,
                      targetType: c.targetType,
                    }))
                  : [];
              const hasDropdown = subItems.length > 0;
              const isOpen = activeDropdown === menuKey;
              const isExternal = item.openInNewTab || item.targetType === 'EXTERNAL_LINK';

              const isActive = isMenuItemActive(item.url);
              const linkClass = isUniversity
                ? (isActive ? 'text-rose-400 bg-slate-900 font-bold shadow-xs' : isOpen ? 'text-rose-400 bg-slate-900' : 'text-slate-200 hover:text-white hover:bg-slate-900')
                : (isActive ? 'text-primary bg-primary/10 font-bold shadow-xs' : isOpen ? 'text-primary bg-slate-50' : 'text-slate-700 hover:text-primary hover:bg-slate-50');

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
                          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180 text-rose-400' : 'text-slate-400'}`} />
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
                          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180 text-rose-400' : 'text-slate-400'}`} />
                        )}
                      </Link>
                    )}
                  </div>

                  {/* Dropdown Sub-menu Container */}
                  {hasDropdown && isOpen && (
                    <div className={`absolute top-full ${isRightAligned ? 'right-0' : 'left-0'} mt-1 w-80 bg-white rounded-2xl shadow-xl border border-slate-200/80 p-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150`}>
                      <div className="px-3 py-1.5 mb-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                        {item.title} Links
                      </div>
                      <div className="space-y-1">
                        {subItems.map((sub, idx) => {
                          const SubIcon = sub.icon || FileText;
                          const isSubExternal = sub.openInNewTab || sub.targetType === 'EXTERNAL_LINK' || sub.url.startsWith('http');
                          const isSubActive = isMenuItemActive(sub.url);

                          if (isSubExternal) {
                            return (
                              <a
                                key={idx}
                                href={sub.url}
                                target="_blank"
                                rel="noreferrer"
                                className="group flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition"
                              >
                                <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-primary/10 flex items-center justify-center text-slate-500 group-hover:text-primary transition shrink-0 mt-0.5">
                                  <SubIcon className="w-4 h-4" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="text-xs font-bold text-slate-900 group-hover:text-primary transition flex items-center justify-between">
                                    <span>{sub.title}</span>
                                    <ExternalLink className="w-3 h-3 opacity-50 ml-1" />
                                  </div>
                                  {sub.description && (
                                    <p className="text-[11px] text-slate-500 leading-snug line-clamp-1 mt-0.5">
                                      {sub.description}
                                    </p>
                                  )}
                                </div>
                              </a>
                            );
                          }

                          return (
                            <Link
                              key={idx}
                              to={sub.url}
                              onClick={(e) => handleAnchorClick(sub.url, e)}
                              className={`group flex items-start gap-3 p-2.5 rounded-xl transition ${isSubActive ? 'bg-primary/10 text-primary font-bold' : 'hover:bg-slate-50 text-slate-700'}`}
                            >
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition shrink-0 mt-0.5 ${isSubActive ? 'bg-primary text-white' : 'bg-slate-100 group-hover:bg-primary/10 text-slate-500 group-hover:text-primary'}`}>
                                <SubIcon className="w-4 h-4" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className={`text-xs font-bold transition flex items-center justify-between ${isSubActive ? 'text-primary' : 'text-slate-900 group-hover:text-primary'}`}>
                                  <span>{sub.title}</span>
                                </div>
                                {sub.description && (
                                  <p className="text-[11px] text-slate-500 leading-snug line-clamp-1 mt-0.5">
                                    {sub.description}
                                  </p>
                                )}
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

            {/* Dynamic Header Accreditation Badge / Tagline Pill */}
            {Boolean(siteConfig.settings?.headerBadgeText) && (
              <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-blue-50 text-blue-900 border border-blue-200 shrink-0 ml-2">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
                <span>{siteConfig.settings.headerBadgeText}</span>
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

          {/* Mobile Hamburger Button */}
          <div className="lg:hidden flex items-center gap-2">
            <Link
              to={siteConfig.settings?.headerCtaUrl || "/admissions"}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-primary shadow-sm"
            >
              {siteConfig.settings?.headerCtaText || 'Apply'}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-down Accordion Menu */}
        {mobileMenuOpen && (
          <>
            <div
              className="lg:hidden fixed inset-0 top-[65px] bg-slate-950/40 backdrop-blur-xs z-30 animate-in fade-in duration-200"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="lg:hidden relative z-40 bg-white border-b border-slate-200 px-6 py-4 max-h-[80vh] overflow-y-auto shadow-xl animate-in fade-in slide-in-from-top duration-200">
              <div className="space-y-2">
                {visibleMenus.map((item) => {
                  const menuKey = item.title.toLowerCase().trim();
                  const subItems: (SubMenuItem & { openInNewTab?: boolean; targetType?: string })[] =
                    item.children && item.children.length > 0
                      ? item.children
                        .filter((c) => c.isVisible !== false)
                        .map((c) => ({
                          title: c.title,
                          url: c.url || '#',
                          description: '',
                          icon: FileText,
                          openInNewTab: c.openInNewTab,
                          targetType: c.targetType,
                        }))
                      : [];
                  const hasDropdown = subItems.length > 0;
                  const isExpanded = !!mobileExpanded[menuKey];
                  const isExternal = item.openInNewTab || item.targetType === 'EXTERNAL_LINK';
                  const isItemActive = isMenuItemActive(item.url);

                  return (
                    <div key={item.id} className="border-b border-slate-100 pb-2">
                      <div className="flex items-center justify-between">
                        {isExternal ? (
                          <a
                            href={item.url || '/'}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm font-bold text-slate-800 hover:text-primary py-1.5 flex items-center gap-1.5"
                          >
                            <span>{item.title}</span>
                            <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                          </a>
                        ) : (
                          <Link
                            to={item.url || '/'}
                            onClick={(e) => handleAnchorClick(item.url || '/', e)}
                            className={`text-sm font-bold py-1.5 ${isItemActive ? 'text-primary' : 'text-slate-800 hover:text-primary'}`}
                          >
                            {item.title}
                          </Link>
                        )}
                        {hasDropdown && (
                          <button
                            onClick={() => toggleMobileAccordion(menuKey)}
                            className="p-1 text-slate-400 hover:text-primary"
                          >
                            <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180 text-primary' : ''}`} />
                          </button>
                        )}
                      </div>

                      {hasDropdown && isExpanded && (
                        <div className="pl-3 mt-1.5 space-y-1.5 border-l-2 border-primary/20">
                          {subItems.map((sub, idx) => {
                            const isSubExternal = sub.openInNewTab || sub.targetType === 'EXTERNAL_LINK' || sub.url.startsWith('http');
                            const isSubActive = isMenuItemActive(sub.url);

                            if (isSubExternal) {
                              return (
                                <a
                                  key={idx}
                                  href={sub.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="py-1 text-xs font-semibold text-slate-600 hover:text-primary flex items-center justify-between"
                                >
                                  <span>{sub.title}</span>
                                  <ExternalLink className="w-3 h-3 opacity-50" />
                                </a>
                              );
                            }
                            return (
                              <Link
                                key={idx}
                                to={sub.url}
                                onClick={(e) => handleAnchorClick(sub.url, e)}
                                className={`block py-1 text-xs font-semibold ${isSubActive ? 'text-primary font-bold' : 'text-slate-600 hover:text-primary'}`}
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

                <div className="pt-3 flex flex-col gap-2">
                  <Link
                    to="/admissions"
                    className="w-full text-center py-2.5 rounded-xl font-bold text-xs text-white bg-primary shadow-md"
                  >
                    Online Admissions 2026
                  </Link>
                  <Link
                    to="/admin/login"
                    className="w-full text-center py-2 rounded-xl font-semibold text-xs text-slate-600 bg-slate-100 hover:bg-slate-200"
                  >
                    Admin CMS Login
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </header>

      {/* 3. Main Content Area */}
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>

      {/* 4. University Mega-Footer */}
      <footer className="bg-slate-950 text-slate-400 pt-16 pb-12 border-t border-slate-900">
        <div className="max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Col 1 & 2: College Identity & Accreditation */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${crestBg} shadow-md`}>
                <CrestIcon className="w-6 h-6" />
              </div>
              <div>
                <span className={`text-xl text-white block leading-tight ${nameFont}`}>{tenant.name}</span>
                {siteConfig.settings?.tagline ? (
                  <span className={`text-xs font-semibold block mt-0.5 ${isArtsAndScience ? 'text-emerald-400 font-serif' : isMedical ? 'text-cyan-400' : 'text-blue-400'}`}>
                    {siteConfig.settings.tagline}
                  </span>
                ) : (
                  <span className={`text-xs font-semibold block mt-0.5 ${isArtsAndScience ? 'text-emerald-400 font-serif' : isMedical ? 'text-cyan-400' : 'text-blue-400'}`}>
                    {defaultBadge}
                  </span>
                )}
              </div>
            </div>

            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              {themeConfig?.badgeText || (
                isArtsAndScience
                  ? 'Dedicated to the pursuit of classical scholarship, humanities, pure sciences, and holistic ethical character.'
                  : isMedical
                    ? 'Dedicated to high-standard medical training, patient care compassion, clinical research, and hospital service.'
                    : 'Dedicated to high-impact technical education, patent innovation, engineering research, and career placement.'
              )}
            </p>
          </div>

          {/* Col 3: Academic Schools */}
          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-wider mb-4 border-b border-slate-800/80 pb-2">
              Academic Schools
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/departments" className="hover:text-white transition">Departments Directory</Link></li>
              <li><Link to="/courses" className="text-primary font-bold hover:underline">Explore Degree Programs →</Link></li>
            </ul>
          </div>

          {/* Col 4: Quick Student Links */}
          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-wider mb-4 border-b border-slate-800/80 pb-2">
              Admissions & Campus
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/admissions" className="hover:text-white transition">Admissions</Link></li>
              <li><Link to="/events" className="hover:text-white transition">Events Calendar</Link></li>
              <li><Link to="/gallery" className="hover:text-white transition">Campus Gallery</Link></li>
              <li><Link to="/faculty" className="hover:text-white transition">Faculty Directory</Link></li>
              <li><Link to="/news" className="hover:text-white transition">Latest News</Link></li>
            </ul>
          </div>

          {/* Col 5: Campus Helpline & Contact */}
          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-wider mb-4 border-b border-slate-800/80 pb-2">
              Campus Office
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              {siteConfig.settings?.address && (
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>{siteConfig.settings.address}</span>
                </div>
              )}
              {siteConfig.settings?.contactPhone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary shrink-0" />
                  <span>{siteConfig.settings.contactPhone}</span>
                </div>
              )}
              {siteConfig.settings?.contactEmail && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary shrink-0" />
                  <span>{siteConfig.settings.contactEmail}</span>
                </div>
              )}
              <div className="pt-2">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 transition"
                >
                  <span>Contact Helpdesk</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Multi-Tenant Architecture Metadata */}
        <div className="max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-16 mt-12 pt-6 border-t border-slate-900 flex flex-wrap items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} {tenant.name}. All rights reserved. Powered by Institutional Dynamic CMS.
          </div>
          <div className="text-[11px] text-slate-500 flex items-center gap-3">
            <span>Portal: <strong className="text-emerald-400 font-semibold">Active & Certified</strong></span>
            <span>•</span>
            <span>Accredited Campus Network</span>
          </div>
        </div>
      </footer>

      {/* Floating Back to Top Button */}
      {showBackToTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to Top"
          className="fixed bottom-6 right-6 z-50 p-3 rounded-2xl bg-primary text-white shadow-xl shadow-primary/30 hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center cursor-pointer border border-white/20 group"
          title="Back to Top"
        >
          <ArrowUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      )}
    </div>
  );
};

