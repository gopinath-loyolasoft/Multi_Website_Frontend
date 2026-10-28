import React, { useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ExternalLink,
  GraduationCap,
  BookOpen,
  FileText,
  Layers,
  Globe,
  Sparkles,
  Compass,
  Award,
  Building2,
  Newspaper,
  Calendar,
  Image as ImageIcon,
  HeartPulse,
  Cpu,
  Bookmark,
  ChevronRight,
  FolderOpen
} from 'lucide-react';
import { MenuItem, SiteConfig } from '../../types';
import { useActiveTemplate } from '../templateRegistry';

interface MegaMenuDrawerProps {
  parentItem: MenuItem;
  subItems: MenuItem[];
  isOpen: boolean;
  onClose: () => void;
  isUniversity?: boolean;
  isArtsAndScience?: boolean;
  isEngineering?: boolean;
  isMedical?: boolean;
  siteConfig?: SiteConfig | null;
  alignment?: 'left' | 'center' | 'right';
  onAnchorClick?: (url: string, e: React.MouseEvent) => void;
}

// Helper to pick contextual icon if custom icon is not set
const getMenuItemIcon = (sub: MenuItem) => {
  const title = (sub.title || '').toLowerCase();

  if (title.includes('ug') || title.includes('undergraduate') || title.includes('bachelor') || title.includes('b.')) return GraduationCap;
  if (title.includes('pg') || title.includes('postgraduate') || title.includes('master') || title.includes('m.')) return BookOpen;
  if (title.includes('research') || title.includes('ph.d') || title.includes('doctoral')) return Sparkles;
  if (title.includes('cert') || title.includes('diploma') || title.includes('award')) return Award;
  if (title.includes('dept') || title.includes('department') || title.includes('school') || title.includes('faculty')) return Building2;
  if (title.includes('cal') || title.includes('event') || title.includes('sched')) return Calendar;
  if (title.includes('news') || title.includes('press') || title.includes('media')) return Newspaper;
  if (title.includes('gallery') || title.includes('photo')) return ImageIcon;
  if (title.includes('admiss') || title.includes('apply') || title.includes('portal') || title.includes('enquiry')) return Compass;
  if (title.includes('regulat') || title.includes('syllabus') || title.includes('report') || title.includes('nacc') || title.includes('naac') || title.includes('nirf')) return FileText;
  if (title.includes('health') || title.includes('medic') || title.includes('clinic') || title.includes('hospital')) return HeartPulse;
  if (title.includes('tech') || title.includes('lab') || title.includes('engineer') || title.includes('code')) return Cpu;

  switch (sub.targetType) {
    case 'INTERNAL_PAGE':
      return Layers;
    case 'SECTION_ANCHOR':
      return Bookmark;
    case 'EXTERNAL_LINK':
      return Globe;
    case 'FILE_DOWNLOAD':
      return FileText;
    default:
      return Layers;
  }
};

export const MegaMenuDrawer: React.FC<MegaMenuDrawerProps> = ({
  parentItem,
  subItems,
  isOpen,
  onClose,
  isUniversity,
  isArtsAndScience,
  isEngineering,
  isMedical,
  alignment = 'left',
  onAnchorClick,
}) => {
  const drawerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Close on outside click or Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || subItems.length === 0) return null;

  const isMenuItemActive = (url?: string) => {
    if (!url) return false;
    if (url === '/' || url === '/site') {
      return location.pathname === '/' || location.pathname === '/site';
    }
    return location.pathname.startsWith(url);
  };

  // Check if any sub-item has configured sub-children (real categories configured in DB)
  const hasNestedCategories = subItems.some((s) => s.children && s.children.length > 0);

  // Template archetype determination
  const Template = useActiveTemplate();
  const rawCode = Template?.config?.code || '';
  const code = rawCode.trim().toUpperCase();

  const isSlantedPack =
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

  // Alignment positioning
  const alignmentClass =
    alignment === 'right'
      ? 'right-0'
      : alignment === 'center'
      ? 'left-1/2 -translate-x-1/2'
      : 'left-0';

  // Grid columns based on item count
  let gridClass = 'grid-cols-1';
  let containerWidth = 'min-w-[220px] max-w-[300px]';

  if (hasNestedCategories) {
    const categoryCount = subItems.length;
    if (categoryCount === 2) {
      gridClass = 'grid-cols-1 sm:grid-cols-2';
      containerWidth = 'min-w-[460px] max-w-[560px]';
    } else if (categoryCount >= 3) {
      gridClass = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
      containerWidth = 'min-w-[660px] max-w-[800px]';
    }
  } else {
    const total = subItems.length;
    if (total >= 9) {
      gridClass = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
      containerWidth = 'min-w-[660px] max-w-[800px]';
    } else if (total >= 5) {
      gridClass = 'grid-cols-1 sm:grid-cols-2';
      containerWidth = 'min-w-[460px] max-w-[560px]';
    } else if (total >= 2) {
      gridClass = 'grid-cols-1 sm:grid-cols-2';
      containerWidth = 'min-w-[380px] max-w-[460px]';
    } else {
      gridClass = 'grid-cols-1';
      containerWidth = 'min-w-[220px] max-w-[280px]';
    }
  }

  // 9 DISTINCT CARD RENDERERS (NO NUMBERS, NO EXTRA TEXT)
  const renderCard = (sub: MenuItem, keyIdx: string | number) => {
    const IconComp = getMenuItemIcon(sub);
    const isSubExternal = sub.openInNewTab || sub.targetType === 'EXTERNAL_LINK' || (sub.url && sub.url.startsWith('http'));
    const isSubActive = isMenuItemActive(sub.url);

    const handleClick = (e: React.MouseEvent) => {
      if (!isSubExternal && onAnchorClick) {
        onAnchorClick(sub.url || '#', e);
      }
      onClose();
    };

    // =========================================================================
    // 1. TEMPLATE 1: Engineering & Tech Blueprint -> Cyber CLI Prompt Bar
    // =========================================================================
    if (isEngineeringPack) {
      const content = (
        <div className={`group flex items-center justify-between gap-3 px-3 py-2 border transition-all duration-150 font-mono text-xs cursor-pointer ${
          isSubActive
            ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
            : 'bg-slate-900/90 hover:bg-cyan-950/40 text-slate-300 hover:text-cyan-300 border-slate-800 hover:border-cyan-500/70'
        }`}>
          <div className="flex items-center gap-2 truncate">
            <span className="text-cyan-400 font-bold">&gt;</span>
            <span className="font-semibold truncate">{sub.title}</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-cyan-500 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0" />
        </div>
      );

      return isSubExternal ? (
        <a key={keyIdx} href={sub.url || '#'} target="_blank" rel="noreferrer" onClick={handleClick}>{content}</a>
      ) : (
        <Link key={keyIdx} to={sub.url || '#'} onClick={handleClick}>{content}</Link>
      );
    }

    // =========================================================================
    // 2. TEMPLATE 2: Arts & Science -> Classical Academic Manuscript Entry
    // =========================================================================
    if (isArtsPack) {
      const content = (
        <div className={`group flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl border transition-all duration-200 font-serif text-xs cursor-pointer ${
          isSubActive
            ? 'bg-amber-200/90 dark:bg-stone-800 text-emerald-950 dark:text-amber-200 font-bold border-amber-500 shadow-sm'
            : 'bg-amber-50/70 hover:bg-amber-100/90 dark:bg-stone-900/80 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 hover:text-emerald-950 dark:hover:text-amber-200 border-amber-200/70 dark:border-stone-800 hover:border-amber-400'
        }`}>
          <div className="flex items-center gap-2.5 truncate">
            <span className="text-amber-700 dark:text-amber-400 font-serif text-xs opacity-70 group-hover:opacity-100">
              ❧
            </span>
            <span className="font-semibold truncate tracking-tight">{sub.title}</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0" />
        </div>
      );

      return isSubExternal ? (
        <a key={keyIdx} href={sub.url || '#'} target="_blank" rel="noreferrer" onClick={handleClick}>{content}</a>
      ) : (
        <Link key={keyIdx} to={sub.url || '#'} onClick={handleClick}>{content}</Link>
      );
    }

    // =========================================================================
    // 3. TEMPLATE 3: Medical & Healthcare -> Clinical OPD Capsule Badge
    // =========================================================================
    if (isMedicalPack) {
      const content = (
        <div className={`group flex items-center justify-between gap-3 px-3.5 py-2 rounded-full border transition-all duration-200 font-sans text-xs cursor-pointer ${
          isSubActive
            ? 'bg-teal-100 dark:bg-teal-950 text-teal-900 dark:text-teal-200 font-bold border-teal-400 shadow-sm'
            : 'bg-teal-50/40 hover:bg-teal-100/70 dark:bg-slate-900/80 dark:hover:bg-teal-950/70 text-slate-800 dark:text-slate-200 hover:text-teal-800 dark:hover:text-teal-300 border-teal-100 dark:border-slate-800 hover:border-teal-300'
        }`}>
          <div className="flex items-center gap-2 truncate">
            <div className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <IconComp className="w-3 h-3" />
            </div>
            <span className="font-semibold truncate">{sub.title}</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-teal-600 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0" />
        </div>
      );

      return isSubExternal ? (
        <a key={keyIdx} href={sub.url || '#'} target="_blank" rel="noreferrer" onClick={handleClick}>{content}</a>
      ) : (
        <Link key={keyIdx} to={sub.url || '#'} onClick={handleClick}>{content}</Link>
      );
    }

    // =========================================================================
    // 4. TEMPLATE 4: University Prestige -> Collegiate Crest Ribbon
    // =========================================================================
    if (isUniversityPack) {
      const content = (
        <div className={`group flex items-center justify-between gap-3 px-3 py-2 rounded-lg border transition-all duration-200 font-serif text-xs cursor-pointer ${
          isSubActive
            ? 'bg-amber-500/20 text-amber-300 font-bold border-amber-400/80 shadow-xs'
            : 'bg-stone-900/80 hover:bg-stone-800 text-stone-200 hover:text-amber-200 border-stone-800 hover:border-amber-400/50'
        }`}>
          <div className="flex items-center gap-2.5 truncate">
            <div className="w-6 h-6 rounded-md bg-amber-400/15 text-amber-300 border border-amber-400/30 flex items-center justify-center shrink-0">
              <IconComp className="w-3.5 h-3.5" />
            </div>
            <span className="font-medium truncate tracking-normal">{sub.title}</span>
          </div>
          <span className="text-amber-400/70 font-serif text-xs group-hover:text-amber-300 group-hover:translate-x-0.5 transition-all">
            ⚜
          </span>
        </div>
      );

      return isSubExternal ? (
        <a key={keyIdx} href={sub.url || '#'} target="_blank" rel="noreferrer" onClick={handleClick}>{content}</a>
      ) : (
        <Link key={keyIdx} to={sub.url || '#'} onClick={handleClick}>{content}</Link>
      );
    }

    // =========================================================================
    // 5. TEMPLATE 5: 3D Slanted Navy & Gold -> Angled Parallelogram Blade
    // =========================================================================
    if (isSlantedPack) {
      const content = (
        <div className={`group flex items-center justify-between gap-3 px-3.5 py-2 -skew-x-6 border transition-all duration-200 font-sans text-xs cursor-pointer ${
          isSubActive
            ? 'bg-amber-500/30 text-amber-300 font-bold border-2 border-[#e5a912] shadow-md'
            : 'bg-[#0d3454] hover:bg-[#0b2942] text-white hover:text-amber-300 border border-amber-400/30 hover:border-[#e5a912]'
        }`}>
          <div className="flex items-center gap-2 truncate skew-x-6">
            <span className="w-1.5 h-3 bg-[#e5a912] rounded-none shrink-0" />
            <span className="font-bold truncate">{sub.title}</span>
          </div>
          <span className="text-amber-400 font-black text-xs skew-x-6 group-hover:translate-x-1 transition-transform">
            »
          </span>
        </div>
      );

      return isSubExternal ? (
        <a key={keyIdx} href={sub.url || '#'} target="_blank" rel="noreferrer" onClick={handleClick}>{content}</a>
      ) : (
        <Link key={keyIdx} to={sub.url || '#'} onClick={handleClick}>{content}</Link>
      );
    }

    // =========================================================================
    // 6. TEMPLATE 6: 3D Holographic Glassmorphism -> Floating Glass Capsule
    // =========================================================================
    if (isGlassPack) {
      const content = (
        <div className={`group flex items-center justify-between gap-3 px-3.5 py-2 rounded-2xl border transition-all duration-200 font-sans text-xs cursor-pointer backdrop-blur-xl hover:scale-[1.02] ${
          isSubActive
            ? 'bg-cyan-500/30 text-cyan-200 font-bold border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
            : 'bg-white/5 hover:bg-cyan-500/20 text-slate-200 hover:text-cyan-200 border-white/10 hover:border-cyan-400/70 shadow-[0_0_10px_rgba(6,182,212,0.1)]'
        }`}>
          <div className="flex items-center gap-2.5 truncate">
            <div className="w-6 h-6 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 flex items-center justify-center shrink-0 shadow-[0_0_8px_rgba(6,182,212,0.3)]">
              <IconComp className="w-3 h-3" />
            </div>
            <span className="font-medium truncate tracking-wide">{sub.title}</span>
          </div>
          <span className="text-cyan-400 text-xs opacity-60 group-hover:opacity-100 transition-opacity">
            ✦
          </span>
        </div>
      );

      return isSubExternal ? (
        <a key={keyIdx} href={sub.url || '#'} target="_blank" rel="noreferrer" onClick={handleClick}>{content}</a>
      ) : (
        <Link key={keyIdx} to={sub.url || '#'} onClick={handleClick}>{content}</Link>
      );
    }

    // =========================================================================
    // 7. TEMPLATE 7: 3D Isometric Tactile -> Chunky Mechanical Push Button
    // =========================================================================
    if (isIsometricPack) {
      const content = (
        <div className={`group flex items-center justify-between gap-3 px-3.5 py-2 border-2 border-slate-950 font-sans text-xs font-black transition-all duration-150 cursor-pointer ${
          isSubActive
            ? 'bg-amber-300 text-slate-950 shadow-none translate-x-0.5 translate-y-0.5'
            : 'bg-white dark:bg-slate-800 hover:bg-amber-300 dark:hover:bg-amber-400 text-slate-950 dark:text-white dark:hover:text-slate-950 shadow-[3px_3px_0px_0px_#0f172a] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5'
        }`}>
          <div className="flex items-center gap-2 truncate">
            <IconComp className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{sub.title}</span>
          </div>
          <span className="text-slate-950 font-black text-xs">
            ■
          </span>
        </div>
      );

      return isSubExternal ? (
        <a key={keyIdx} href={sub.url || '#'} target="_blank" rel="noreferrer" onClick={handleClick}>{content}</a>
      ) : (
        <Link key={keyIdx} to={sub.url || '#'} onClick={handleClick}>{content}</Link>
      );
    }

    // =========================================================================
    // 8. TEMPLATE 8: 3D Kinetic Perspective -> 180° Velocity Speed Tile
    // =========================================================================
    if (isKineticPack) {
      const content = (
        <div className={`group flex items-center justify-between gap-3 px-3.5 py-2 rounded-xl border transition-all duration-200 font-sans text-xs cursor-pointer hover:-translate-y-0.5 ${
          isSubActive
            ? 'bg-rose-950/90 text-rose-200 font-black border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.4)]'
            : 'bg-slate-900/90 hover:bg-gradient-to-r hover:from-rose-950/90 hover:to-purple-950/90 text-slate-200 hover:text-white border border-slate-800 hover:border-rose-400 hover:shadow-[0_0_15px_rgba(244,63,94,0.3)]'
        }`}>
          <div className="flex items-center gap-2.5 truncate">
            <div className="w-6 h-6 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center justify-center shrink-0">
              <IconComp className="w-3 h-3" />
            </div>
            <span className="font-bold truncate">{sub.title}</span>
          </div>
          <span className="text-rose-400 font-black text-xs group-hover:translate-x-1 transition-transform">
            ➔
          </span>
        </div>
      );

      return isSubExternal ? (
        <a key={keyIdx} href={sub.url || '#'} target="_blank" rel="noreferrer" onClick={handleClick}>{content}</a>
      ) : (
        <Link key={keyIdx} to={sub.url || '#'} onClick={handleClick}>{content}</Link>
      );
    }

    // =========================================================================
    // 9. TEMPLATE 9: 3D Neumorphic Soft Depth -> Sculpted Clay Pill Button
    // =========================================================================
    const neumorphicContent = (
      <div className={`group flex items-center justify-between gap-3 px-3.5 py-2 rounded-2xl border border-transparent transition-all duration-200 font-sans text-xs cursor-pointer ${
        isSubActive
          ? 'bg-[#eef2f6] dark:bg-slate-800 text-teal-800 dark:text-teal-200 font-bold shadow-[inset_3px_3px_6px_#d1d9e6,inset_-3px_-3px_6px_#ffffff]'
          : 'bg-[#eef2f6] dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-teal-700 dark:hover:text-teal-300 shadow-[3px_3px_6px_#d1d9e6,-3px_-3px_6px_#ffffff] dark:shadow-[2px_2px_4px_#0b1329,-2px_-2px_4px_#1e293b] hover:shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#ffffff]'
      }`}>
        <div className="flex items-center gap-2.5 truncate">
          <div className="w-6 h-6 rounded-xl bg-[#eef2f6] dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-[inset_1px_1px_3px_#d1d9e6,inset_-1px_-1px_3px_#ffffff] flex items-center justify-center shrink-0">
            <IconComp className="w-3 h-3" />
          </div>
          <span className="font-medium truncate">{sub.title}</span>
        </div>
        <div className="w-2 h-2 rounded-full bg-teal-500 shadow-xs group-hover:scale-125 transition-transform" />
      </div>
    );

    return isSubExternal ? (
      <a key={keyIdx} href={sub.url || '#'} target="_blank" rel="noreferrer" onClick={handleClick}>{neumorphicContent}</a>
    ) : (
      <Link key={keyIdx} to={sub.url || '#'} onClick={handleClick}>{neumorphicContent}</Link>
    );
  };

  // Outer container styling per archetype
  const containerStyle = isSlantedPack
    ? 'bg-[#134975] text-white border-2 border-[#e5a912] shadow-2xl shadow-black/80 rounded-none [clip-path:polygon(0_0,97%_0,100%_100%,0_100%)] animate-in fade-in slide-in-from-top-3 -rotate-1 duration-200'
    : isGlassPack
    ? 'backdrop-blur-3xl bg-slate-950/85 text-white border border-cyan-400/50 shadow-[0_20px_60px_rgba(6,182,212,0.3)] rounded-3xl animate-in fade-in zoom-in-90 duration-300'
    : isIsometricPack
    ? 'bg-amber-50 dark:bg-slate-900 text-slate-950 dark:text-white border-2 border-slate-950 shadow-[6px_6px_0px_0px_#0f172a] rounded-none animate-in fade-in slide-in-from-top-2 duration-150'
    : isKineticPack
    ? 'bg-slate-950 text-white border border-rose-500/50 shadow-[0_0_35px_rgba(244,63,94,0.3)] rounded-2xl animate-in fade-in zoom-in-95 duration-200'
    : isNeumorphicPack
    ? 'bg-[#eef2f6] dark:bg-slate-900 text-slate-800 dark:text-white shadow-[14px_14px_28px_#d1d9e6,-14px_-14px_28px_#ffffff] dark:shadow-[10px_10px_20px_#0b1329,-10px_-10px_20px_#1e293b] border border-slate-200/60 dark:border-slate-800 rounded-3xl animate-in fade-in zoom-in-95 duration-250'
    : isArtsPack
    ? 'bg-[#fdfbf7] dark:bg-stone-950 text-stone-900 dark:text-stone-100 border-2 border-amber-500/50 shadow-2xl shadow-stone-900/30 rounded-2xl animate-in fade-in slide-in-from-top-3 duration-300'
    : isMedicalPack
    ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-white border border-teal-200 dark:border-teal-800/80 shadow-2xl shadow-teal-950/15 rounded-2xl animate-in fade-in zoom-in-95 duration-200'
    : isUniversityPack
    ? 'bg-slate-950/98 text-white border-2 border-amber-500/40 shadow-2xl shadow-black/80 rounded-xl animate-in fade-in slide-in-from-top-4 duration-250'
    : 'bg-slate-950 text-slate-100 border border-cyan-500/40 shadow-2xl shadow-cyan-950/30 rounded-lg animate-in fade-in zoom-in-95 duration-200';

  return (
    <div
      ref={drawerRef}
      className={`absolute top-full ${alignmentClass} mt-1.5 z-50`}
      style={{ maxWidth: '94vw' }}
    >
      <div className={`p-2.5 sm:p-3 ${containerStyle} ${containerWidth}`}>
        {hasNestedCategories ? (
          <div className={`grid ${gridClass} gap-3`}>
            {subItems.map((cat, cIdx) => {
              const childrenList = (cat.children && cat.children.length > 0)
                ? cat.children.filter((c) => c.isVisible !== false)
                : [cat];

              return (
                <div key={cIdx} className="space-y-1.5">
                  <div className="text-[11px] font-bold opacity-80 flex items-center gap-1.5 pb-1 border-b border-current/20">
                    <FolderOpen className="w-3.5 h-3.5 opacity-70" />
                    <span className="truncate">{cat.title}</span>
                  </div>
                  <div className="space-y-1">
                    {childrenList.map((child, chIdx) => renderCard(child, `${cIdx}-${chIdx}`))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className={`grid ${gridClass} gap-1.5`}>
            {subItems.map((sub, sIdx) => renderCard(sub, sIdx))}
          </div>
        )}
      </div>
    </div>
  );
};
