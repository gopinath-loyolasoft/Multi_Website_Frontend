import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ExternalLink, Lock, Menu, X, ShieldCheck, Sparkles, Box, Zap, Shield, HeartPulse, GraduationCap, Building2 } from 'lucide-react';
import { MenuItem, SiteConfig } from '../../types';
import { MegaMenuDrawer } from './MegaMenuDrawer';
import { useActiveTemplate } from '../templateRegistry';

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
  isEngineering?: boolean;
  isMedical?: boolean;
  isSalesian?: boolean;
  is3DDesign?: boolean;
}

export const NavigationMenuRenderer: React.FC<NavigationMenuRendererProps> = ({
  siteConfig,
  visibleMenus,
  activeDropdown,
  setActiveDropdown,
  mobileOpen,
  setMobileOpen,
  mobileExpanded,
  toggleMobileAccordion,
  handleMouseEnter,
  handleMouseLeave,
  isUniversity,
  isArtsAndScience,
  isEngineering,
  isMedical,
  isSalesian,
  is3DDesign,
}) => {
  const location = useLocation();
  const Template = useActiveTemplate();
  const rawCode = Template?.config?.code || '';
  const code = rawCode.trim().toUpperCase();

  const isSlantedPack =
    is3DDesign ||
    isSalesian ||
    code === 'SALESIAN_SLANTED' ||
    code === 'SALESIAN' ||
    code === 'DESIGN_3D_MODERN' ||
    code === '3D_DESIGN' ||
    code === 'TEMPLATE5' ||
    code === 'TEMPLATE_5';

  const isGlassPack =
    code === 'DESIGN_3D_GLASS' ||
    code === 'GLASS_3D' ||
    code === 'TEMPLATE6' ||
    code === 'TEMPLATE_6';

  const isIsometricPack =
    code === 'DESIGN_3D_ISOMETRIC' ||
    code === 'ISOMETRIC_3D' ||
    code === 'TEMPLATE7' ||
    code === 'TEMPLATE_7';

  const isKineticPack =
    code === 'DESIGN_3D_KINETIC' ||
    code === 'KINETIC_3D' ||
    code === 'TEMPLATE8' ||
    code === 'TEMPLATE_8';

  const isNeumorphicPack =
    code === 'DESIGN_3D_NEUMORPHIC' ||
    code === 'NEUMORPHIC_3D' ||
    code === 'TEMPLATE9' ||
    code === 'TEMPLATE_9';

  const isEngineeringPack =
    isEngineering ||
    code === 'ENGINEERING_MODERN' ||
    code === 'ENGINEERING' ||
    code === 'TEMPLATE1' ||
    code === 'TEMPLATE_1';

  const isArtsPack =
    isArtsAndScience ||
    code === 'ARTS_SCIENCE_MODERN' ||
    code === 'ARTS_SCIENCE' ||
    code === 'TEMPLATE2' ||
    code === 'TEMPLATE_2';

  const isMedicalPack =
    isMedical ||
    code === 'MEDICAL_MODERN' ||
    code === 'MEDICAL' ||
    code === 'TEMPLATE3' ||
    code === 'TEMPLATE_3';

  const isUniversityPack =
    isUniversity ||
    code === 'UNIVERSITY_MODERN' ||
    code === 'UNIVERSITY' ||
    code === 'TEMPLATE4' ||
    code === 'TEMPLATE_4';

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
      <nav className="hidden lg:flex items-center gap-1.5">
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

          // 9 Distinct Top-Level Navigation Link Styles
          const linkClass = isSlantedPack
            ? (isActive
                ? 'text-[#e5a912] bg-[#0b2b46] font-black -skew-x-12 border-b-2 border-[#e5a912] shadow-sm'
                : isOpen
                ? 'text-amber-300 bg-[#0b2b46] -skew-x-12'
                : 'text-white hover:text-amber-300 hover:bg-[#0b2b46] -skew-x-12 font-bold')
            : isGlassPack
            ? (isActive
                ? 'text-cyan-300 backdrop-blur-xl bg-cyan-950/60 border border-cyan-400/60 rounded-2xl font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                : isOpen
                ? 'text-cyan-300 backdrop-blur-xl bg-cyan-950/40 border border-cyan-400/40 rounded-2xl'
                : 'text-slate-200 hover:text-cyan-300 backdrop-blur-md hover:bg-white/10 rounded-2xl border border-transparent hover:border-cyan-400/30 font-semibold')
            : isIsometricPack
            ? (isActive
                ? 'text-slate-950 bg-amber-300 font-black border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a]'
                : isOpen
                ? 'text-slate-950 bg-amber-200 font-black border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]'
                : 'text-slate-900 dark:text-white bg-white dark:bg-slate-800 hover:bg-amber-300 dark:hover:bg-slate-700 font-black border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] hover:shadow-[4px_4px_0px_0px_#0f172a] hover:-translate-y-0.5 transition-all')
            : isKineticPack
            ? (isActive
                ? 'text-rose-400 bg-rose-950/60 border border-rose-500 font-black rounded-xl shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                : isOpen
                ? 'text-rose-300 bg-purple-950/40 border border-purple-500/50 rounded-xl'
                : 'text-slate-200 hover:text-rose-400 hover:bg-slate-900 rounded-xl border border-transparent hover:border-rose-500/40 font-bold transition-all')
            : isNeumorphicPack
            ? (isActive
                ? 'text-teal-800 dark:text-teal-300 bg-[#eef2f6] dark:bg-slate-800 shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] rounded-2xl font-black'
                : isOpen
                ? 'text-teal-700 dark:text-teal-300 bg-[#eef2f6] dark:bg-slate-800 shadow-[inset_1px_1px_3px_#d1d9e6,inset_-1px_-1px_3px_#ffffff] rounded-2xl'
                : 'text-slate-700 dark:text-slate-200 bg-[#eef2f6] dark:bg-slate-800 shadow-[3px_3px_6px_#d1d9e6,-3px_-3px_6px_#ffffff] hover:shadow-[1px_1px_3px_#d1d9e6,-1px_-1px_3px_#ffffff] rounded-2xl font-bold transition-all')
            : isArtsPack
            ? (isActive
                ? 'text-emerald-950 dark:text-amber-300 bg-amber-100/90 dark:bg-stone-800 font-serif font-black shadow-xs border-b-2 border-amber-500 rounded-xl'
                : isOpen
                ? 'text-emerald-900 dark:text-amber-300 bg-amber-100/60 dark:bg-stone-800 font-serif rounded-xl'
                : 'text-stone-800 dark:text-stone-200 hover:text-emerald-900 dark:hover:text-amber-300 hover:bg-amber-50 dark:hover:bg-stone-800 font-serif font-bold rounded-xl transition')
            : isMedicalPack
            ? (isActive
                ? 'text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 font-bold shadow-xs border border-teal-300 rounded-full'
                : isOpen
                ? 'text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 rounded-full'
                : 'text-slate-800 dark:text-slate-200 hover:text-teal-700 dark:hover:text-teal-400 hover:bg-teal-50/80 rounded-full font-semibold')
            : isUniversityPack
            ? (isActive
                ? 'text-amber-300 bg-slate-900 font-serif font-bold shadow-xs rounded-lg border-b-2 border-amber-400'
                : isOpen
                ? 'text-amber-300 bg-slate-900 font-serif rounded-lg'
                : 'text-stone-200 hover:text-white hover:bg-slate-900 font-serif font-semibold rounded-lg')
            : (isActive
                ? 'text-blue-700 dark:text-cyan-400 bg-blue-50 dark:bg-slate-800 font-mono font-bold shadow-xs border border-blue-400 rounded-md'
                : isOpen
                ? 'text-blue-700 dark:text-cyan-400 bg-blue-50 dark:bg-slate-800 font-mono rounded-md'
                : 'text-slate-800 dark:text-slate-200 hover:text-blue-700 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-mono font-medium rounded-md');

          const innerSpanClass = isSlantedPack ? 'skew-x-12 inline-block' : '';

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
                    className={`flex items-center gap-1.5 px-3.5 py-2 text-sm transition cursor-pointer ${linkClass}`}
                  >
                    <span className={innerSpanClass}>{item.title}</span>
                    <ExternalLink className={`w-3 h-3 opacity-60 ml-0.5 ${innerSpanClass}`} />
                    {hasDropdown && (
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${innerSpanClass} ${isOpen ? 'rotate-180 text-amber-300' : 'opacity-70'}`} />
                    )}
                  </a>
                ) : hasDropdown ? (
                  <button
                    type="button"
                    onClick={() => setActiveDropdown(isOpen ? null : menuKey)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 text-sm transition cursor-pointer ${linkClass}`}
                  >
                    <span className={innerSpanClass}>{item.title}</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${innerSpanClass} ${isOpen ? 'rotate-180 text-amber-300' : 'opacity-70'}`} />
                  </button>
                ) : (
                  <Link
                    to={item.url || '/'}
                    onClick={(e) => handleAnchorClick(item.url || '/', e)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 text-sm transition ${linkClass}`}
                  >
                    <span className={innerSpanClass}>{item.title}</span>
                  </Link>
                )}
              </div>

              {/* Dynamic Mega Menu Drawer */}
              {hasDropdown && (
                <MegaMenuDrawer
                  parentItem={item}
                  subItems={subItems}
                  isOpen={isOpen}
                  onClose={() => setActiveDropdown(null)}
                  isUniversity={isUniversityPack}
                  isArtsAndScience={isArtsPack}
                  isEngineering={isEngineeringPack}
                  isMedical={isMedicalPack}
                  siteConfig={siteConfig}
                  alignment={isRightAligned ? 'right' : 'left'}
                  onAnchorClick={handleAnchorClick}
                />
              )}
            </div>
          );
        })}

        {/* Header Badge */}
        {Boolean(siteConfig.settings?.headerBadgeText) && (
          <div
            className={
              isSlantedPack
                ? 'hidden xl:flex items-center gap-1.5 px-3 py-1.5 text-xs font-black shrink-0 ml-2 -skew-x-12 bg-[#0b3353] border border-amber-400/50 text-amber-300 shadow-sm'
                : isGlassPack
                ? 'hidden xl:flex items-center gap-1.5 px-3.5 py-1 text-xs font-bold shrink-0 ml-2 rounded-full backdrop-blur-md bg-cyan-950/80 border border-cyan-400/50 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                : isIsometricPack
                ? 'hidden xl:flex items-center gap-1.5 px-3 py-1 text-xs font-black shrink-0 ml-2 bg-amber-300 text-slate-950 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]'
                : isKineticPack
                ? 'hidden xl:flex items-center gap-1.5 px-3 py-1 text-xs font-black shrink-0 ml-2 rounded-md bg-rose-600 text-white shadow-md'
                : isNeumorphicPack
                ? 'hidden xl:flex items-center gap-1.5 px-3.5 py-1 text-xs font-bold shrink-0 ml-2 rounded-full bg-[#eef2f6] dark:bg-slate-800 text-teal-800 dark:text-teal-300 shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#ffffff]'
                : isArtsPack
                ? 'hidden xl:flex items-center gap-1.5 px-3 py-1 text-xs font-serif font-bold shrink-0 ml-2 rounded-full bg-amber-100 dark:bg-stone-800 text-amber-900 dark:text-amber-200 border border-amber-300'
                : isMedicalPack
                ? 'hidden xl:flex items-center gap-1.5 px-3 py-1 text-xs font-bold shrink-0 ml-2 rounded-full bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-200 border border-teal-200'
                : isUniversityPack
                ? 'hidden xl:flex items-center gap-1.5 px-3 py-1 text-xs font-serif font-bold shrink-0 ml-2 rounded-lg bg-amber-950/60 text-amber-300 border border-amber-400/40'
                : 'hidden xl:flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold shrink-0 ml-2 rounded-md bg-blue-50 dark:bg-slate-800 text-blue-900 dark:text-cyan-300 border border-blue-200 dark:border-slate-700'
            }
          >
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            <span className={isSlantedPack ? 'skew-x-12 inline-block' : ''}>{siteConfig.settings?.headerBadgeText}</span>
          </div>
        )}

        {/* Admin Login Portal */}
        {siteConfig.settings?.showAdminLink !== false && (
          <Link
            to="/admin/login"
            className={
              isSlantedPack
                ? 'ml-2 inline-flex items-center gap-1.5 px-4 py-2 -skew-x-12 text-xs font-black text-slate-950 bg-[#e5a912] hover:bg-[#d49a0d] shadow-md transition hover:scale-105'
                : isGlassPack
                ? 'ml-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-extrabold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/25 transition hover:scale-105'
                : isIsometricPack
                ? 'ml-2 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-black text-white bg-slate-900 hover:bg-amber-400 hover:text-slate-950 border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] hover:shadow-[5px_5px_0px_0px_#0f172a] transition hover:-translate-y-0.5'
                : isKineticPack
                ? 'ml-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black text-white bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 shadow-lg shadow-rose-500/30 transition hover:scale-105'
                : isNeumorphicPack
                ? 'ml-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-black text-teal-800 dark:text-teal-300 bg-[#eef2f6] dark:bg-slate-800 shadow-[4px_4px_8px_#d1d9e6,-4px_-4px_8px_#ffffff] hover:shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#ffffff] transition active:scale-95'
                : isArtsPack
                ? 'ml-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-serif font-black text-slate-950 bg-amber-400 hover:bg-amber-500 shadow-md transition hover:scale-105'
                : isMedicalPack
                ? 'ml-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-md shadow-teal-600/25 transition hover:scale-105'
                : isUniversityPack
                ? 'ml-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-serif font-black text-slate-950 bg-amber-400 hover:bg-amber-500 shadow-md transition hover:scale-105'
                : 'ml-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-mono font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/20 transition hover:scale-105'
            }
            title="Campus CMS Admin Login"
          >
            <Lock className={`w-3.5 h-3.5 ${isSlantedPack ? 'skew-x-12 text-slate-950' : 'opacity-80'}`} />
            <span className={isSlantedPack ? 'skew-x-12 inline-block' : ''}>{siteConfig.settings?.adminLinkText || 'Admin'}</span>
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
        <div className={`lg:hidden fixed inset-x-0 top-[65px] backdrop-blur-xl border-b shadow-2xl p-6 z-40 max-h-[calc(100vh-80px)] overflow-y-auto animate-in slide-in-from-top-4 duration-200 ${
          isSlantedPack
            ? 'bg-[#134975]/95 text-white border-[#e5a912]'
            : isGlassPack
            ? 'bg-slate-950/95 text-white border-cyan-500/40'
            : isIsometricPack
            ? 'bg-amber-50 dark:bg-slate-900 text-slate-950 dark:text-white border-slate-950'
            : isKineticPack
            ? 'bg-slate-950/95 text-white border-rose-500/40'
            : isNeumorphicPack
            ? 'bg-[#eef2f6]/95 dark:bg-slate-900/95 text-slate-800 dark:text-white border-slate-200 dark:border-slate-800'
            : isArtsPack
            ? 'bg-[#fdfbf7]/98 dark:bg-stone-950/98 text-stone-900 dark:text-stone-100 border-amber-200 font-serif'
            : isMedicalPack
            ? 'bg-white/98 dark:bg-slate-950/98 text-slate-900 dark:text-white border-teal-200'
            : isUniversityPack
            ? 'bg-slate-950/98 text-white border-amber-500/40 font-serif'
            : 'bg-white/95 dark:bg-slate-900/95 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-800 font-mono'
        }`}>
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
                <div key={item.id} className="border-b border-slate-100/40 dark:border-slate-800/40 pb-2">
                  <div className="flex items-center justify-between">
                    {isExternal ? (
                      <a
                        href={item.url || '/'}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => setMobileOpen(false)}
                        className="flex-1 py-2 font-bold text-sm flex items-center gap-2"
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
                        className="flex-1 py-2 font-bold text-sm"
                      >
                        {item.title}
                      </Link>
                    )}
                    {hasDropdown && (
                      <button
                        type="button"
                        onClick={() => toggleMobileAccordion(menuKey)}
                        className="p-2 opacity-70 hover:opacity-100 cursor-pointer"
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
                            className="block py-1.5 text-xs font-semibold opacity-80 hover:opacity-100"
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
                            className="block py-1.5 text-xs font-semibold opacity-80 hover:opacity-100"
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
