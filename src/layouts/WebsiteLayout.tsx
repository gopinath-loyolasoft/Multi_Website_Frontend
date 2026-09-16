import React, { useState, useRef, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Globe2, ArrowUp } from 'lucide-react';
import { useTenant } from '../tenant/TenantContext';
import { MarqueeBar } from '../components/common/MarqueeBar';
import { useActiveTemplate } from '../templates/templateRegistry';

export const WebsiteLayout: React.FC = () => {
  const { siteConfig, loading, error, tenantDomain } = useTenant();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<Record<string, boolean>>({});
  const [showBackToTop, setShowBackToTop] = useState(false);
  const dropdownTimeoutRef = useRef<any>(null);

  const Template = useActiveTemplate();

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

  const visibleMenus = (siteConfig.primaryMenu || []).filter((item) => item.isVisible !== false);

  return (
    <div className={Template.config.pageContainerClass}>
      {/* 1. Dynamic Top Announcement Marquee Bar */}
      <MarqueeBar marquee={siteConfig?.marquee} />

      {/* 2. Template-Specific Modular Header */}
      <Template.Header
        siteConfig={siteConfig}
        activeDropdown={activeDropdown}
        setActiveDropdown={setActiveDropdown}
        mobileOpen={mobileMenuOpen}
        setMobileOpen={setMobileMenuOpen}
        mobileExpanded={mobileExpanded}
        toggleMobileAccordion={toggleMobileAccordion}
        handleMouseEnter={handleMouseEnter}
        handleMouseLeave={handleMouseLeave}
        visibleMenus={visibleMenus}
      />

      {/* 3. Page Body Route Outlet */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* 4. Template-Specific Modular Mega-Footer */}
      <Template.Footer siteConfig={siteConfig} />

      {/* 5. Floating Back to Top Button */}
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
