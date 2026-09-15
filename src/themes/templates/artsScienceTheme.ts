import React from 'react';
import { ModuleThemeStyles } from '../templateThemeSystem';

export const ARTS_SCIENCE_THEME: ModuleThemeStyles = {
  // Hero Section (Retains atmospheric classical backdrop with emerald/gold overlay)
  hero: {
    overlayGradient: {
      backgroundImage: 'radial-gradient(ellipse at center, rgba(6,78,59,0.30) 0%, rgba(2,6,23,0.92) 85%)',
    },
    vignetteStyle: {
      background: 'linear-gradient(to top, rgba(2, 6, 23, 0.95) 0%, transparent 60%, rgba(2, 6, 23, 0.50) 100%)',
    },
    imageOpacity: 'opacity-85',
    badgeClass: 'bg-emerald-950/80 border-emerald-500/40 text-emerald-200 font-serif',
    badgeIconClass: 'text-amber-300',
    headingClass: 'font-serif font-bold tracking-normal text-emerald-50',
    descriptionClass: 'font-serif text-slate-200/90',
    primaryBtnClass: 'bg-emerald-600 hover:bg-emerald-500 text-white font-serif font-bold shadow-emerald-950/60 border border-emerald-400/40',
    secondaryBtnClass: 'bg-amber-500/15 hover:bg-amber-500/25 border-amber-400/40 text-amber-200 font-serif font-semibold',
    checkColor: 'text-emerald-400',
    rightCardBorder: 'border-emerald-500/30 bg-slate-950/90 text-emerald-100 shadow-2xl',
    cardIconClass: 'bg-emerald-500/15 border-emerald-400/30 text-emerald-300',
    cardSubtitleColor: 'text-emerald-300 font-serif italic',
  },

  // Hero Slider
  heroSlider: {
    overlayStyle: {
      backgroundImage: 'radial-gradient(ellipse at center, rgba(6,78,59,0.30) 0%, rgba(2,6,23,0.92) 85%)',
    },
    badgeClass: 'bg-emerald-950/80 border-emerald-500/40 text-emerald-200 font-serif',
    badgeIconClass: 'text-amber-300',
    headlineClass: 'font-serif font-bold tracking-normal text-emerald-50',
    primaryBtnClass: 'bg-emerald-600 hover:bg-emerald-500 text-white font-serif font-bold shadow-emerald-950/60 border border-emerald-400/40',
    dotActiveClass: 'w-8 bg-emerald-400 shadow-md shadow-emerald-400/50',
    rightCardBorder: 'bg-slate-950/90 border-emerald-500/30 text-emerald-100 shadow-2xl',
  },

  // Statistics Section (Warm Classical Heritage Parchment Theme)
  statistics: {
    sectionBg: 'bg-[#fbf9f4] text-slate-900 border-y border-emerald-900/10',
    bgPatternOverlay: {
      backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.05) 0%, transparent 70%)',
      opacity: 1,
    },
    headerBadge: 'bg-emerald-100 text-emerald-800 border border-emerald-300 font-serif font-bold',
    headerTitleFont: 'font-serif font-bold text-emerald-950 text-2xl sm:text-4xl tracking-normal',
    headerSubtitleFont: 'font-serif text-slate-600 italic text-sm',
    cardContainer: 'bg-white border-2 border-emerald-800/15 rounded-3xl p-6 sm:p-8 shadow-xl shadow-emerald-950/5 grid grid-cols-2 lg:grid-cols-4 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-emerald-100',
    cardBg: 'flex flex-col items-center text-center',
    cardTopAccent: 'bg-emerald-600',
    iconBox: 'w-13 h-13 rounded-full bg-emerald-50 border-2 border-emerald-300 text-emerald-700 mb-3 shadow-md p-3 flex items-center justify-center',
    valueFont: 'font-serif font-bold text-emerald-900 text-3xl sm:text-4xl tracking-normal leading-none',
    suffixFont: 'font-serif text-amber-600 font-bold',
    labelFont: 'font-serif text-xs font-semibold text-slate-700 mt-2 max-w-[180px]',
    tagBadge: 'font-serif text-[10px] uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200',
  },

  // Quote / Leadership Section (Classical Editorial Plaque)
  quote: {
    sectionBg: 'bg-[#f5f2eb] text-slate-900 border-y border-emerald-900/10',
    photoContainer: 'max-w-4xl mx-auto text-center space-y-8',
    photoFrame: 'w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-3 border-emerald-600 shadow-xl p-1 bg-white mx-auto',
    quoteBox: 'relative text-center',
    quoteTextFont: 'font-serif italic text-emerald-950 text-xl sm:text-2xl lg:text-3xl leading-relaxed max-w-3xl mx-auto',
    authorNameFont: 'font-serif font-bold text-lg sm:text-xl text-emerald-900',
    authorTitleFont: 'font-serif text-xs sm:text-sm text-emerald-700 italic mt-0.5',
    subTextFont: 'font-serif text-xs text-slate-500 mt-1',
    badgeClass: 'text-xs font-serif font-bold uppercase tracking-widest bg-emerald-100 border border-emerald-300 text-emerald-800',
    iconColor: 'text-emerald-400',
  },

  // Departments Section (Archival Parchment Cards)
  departments: {
    sectionBg: 'py-16 bg-[#fbf9f4] text-slate-900 border-y border-emerald-900/10',
    sectionHeaderBadge: 'bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-serif font-bold uppercase',
    headingFont: 'font-serif font-bold tracking-normal text-emerald-950 text-3xl sm:text-4xl',
    subtitleFont: 'font-serif text-slate-600 text-sm italic',
    cardBorder: 'border-2 border-emerald-800/15 hover:border-emerald-600',
    cardBg: 'bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition duration-300 border text-slate-900',
    cardHover: 'hover:-translate-y-1',
    iconBg: 'bg-emerald-100 text-emerald-800 border border-emerald-300',
    accentText: 'text-emerald-700 hover:text-emerald-900 font-serif font-bold',
    tagBadge: 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-serif text-[10px] uppercase font-bold',
  },

  // Courses Section (Archival Catalog Cards)
  courses: {
    sectionBg: 'py-16 bg-[#f5f2eb] text-slate-900 border-y border-emerald-900/10',
    sectionHeaderBadge: 'bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-serif font-bold uppercase',
    headingFont: 'font-serif font-bold tracking-normal text-emerald-950 text-3xl sm:text-4xl',
    subtitleFont: 'font-serif text-slate-600 text-sm italic',
    cardBorder: 'border-2 border-emerald-800/15 hover:border-emerald-600',
    cardBg: 'bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition duration-300 border text-slate-900',
    badge: 'bg-emerald-100 text-emerald-800 border border-emerald-300 font-serif text-[10px] uppercase font-bold',
    accentText: 'text-emerald-700 hover:text-emerald-900 font-serif font-bold',
    primaryBtn: 'bg-emerald-700 hover:bg-emerald-800 text-white font-serif font-bold text-xs shadow-md shadow-emerald-900/20',
    iconColor: 'text-emerald-600',
  },

  // Call to Action (CTA)
  cta: {
    sectionBg: 'py-16 sm:py-20 bg-gradient-to-br from-emerald-900 to-emerald-950 text-emerald-50 relative overflow-hidden border-y-2 border-emerald-500/40',
    badgeClass: 'bg-emerald-950/90 border-emerald-400/50 text-amber-300 font-serif font-bold uppercase',
    headlineFont: 'font-serif font-bold tracking-normal text-emerald-50 text-3xl sm:text-4xl lg:text-5xl',
    subheadlineFont: 'font-serif text-emerald-100/90 text-sm sm:text-base italic',
    primaryBtnClass: 'bg-amber-400 hover:bg-amber-300 text-slate-950 font-serif font-bold shadow-xl shadow-emerald-950/80 border border-amber-300/40',
    secondaryBtnClass: 'bg-emerald-800/60 hover:bg-emerald-800 border border-emerald-400/40 text-emerald-100 font-serif font-semibold',
  },

  // Cards Section
  cards: {
    headingFont: 'font-serif font-bold text-emerald-950',
    cardBorder: 'border-2 border-emerald-800/15 hover:border-emerald-600',
    cardBg: 'bg-white text-slate-900 shadow-md',
    badge: 'bg-emerald-100 text-emerald-800 border border-emerald-300 font-serif text-xs',
  },
};
