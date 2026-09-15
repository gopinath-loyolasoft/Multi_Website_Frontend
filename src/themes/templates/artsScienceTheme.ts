import React from 'react';
import { ModuleThemeStyles } from '../templateThemeSystem';

export const ARTS_SCIENCE_THEME: ModuleThemeStyles = {
  // Hero Section
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

  // Statistics Section
  statistics: {
    sectionBg: 'bg-slate-950 text-emerald-100 border-y-2 border-emerald-500/30',
    bgPatternOverlay: {
      backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(6,78,59,0.5) 0%, transparent 70%)',
      opacity: 0.2,
    },
    headerBadge: 'bg-emerald-950/80 border-emerald-500/40 text-amber-300 font-serif',
    headerTitleFont: 'font-serif font-bold text-emerald-50 text-2xl sm:text-4xl tracking-normal drop-shadow-md',
    headerSubtitleFont: 'font-serif text-slate-300 italic text-sm',
    cardContainer: 'bg-slate-900/80 backdrop-blur-xl border border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl grid grid-cols-2 lg:grid-cols-4 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-emerald-500/20',
    cardBg: 'flex flex-col items-center text-center',
    cardTopAccent: 'bg-emerald-500',
    iconBox: 'w-13 h-13 rounded-full bg-emerald-950 border-2 border-amber-400/40 text-amber-300 mb-3 shadow-lg shadow-emerald-950/60 p-3',
    valueFont: 'font-serif font-bold text-amber-200 text-3xl sm:text-4xl tracking-normal leading-none',
    suffixFont: 'font-serif text-emerald-400 font-bold',
    labelFont: 'font-serif text-xs font-semibold text-emerald-100/90 mt-2 max-w-[180px]',
    tagBadge: 'font-serif text-[10px] uppercase px-2 py-0.5 rounded bg-emerald-950 text-emerald-200 border border-emerald-500/40',
  },

  // Quote / Leadership Section
  quote: {
    sectionBg: 'bg-slate-950 text-emerald-100 border-y-2 border-emerald-500/30',
    photoContainer: 'max-w-4xl mx-auto text-center space-y-8',
    photoFrame: 'w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-3 border-amber-400/50 shadow-2xl shadow-emerald-950/80 p-1 bg-emerald-950 mx-auto',
    quoteBox: 'relative text-center',
    quoteTextFont: 'font-serif italic text-emerald-50 text-xl sm:text-2xl lg:text-3xl leading-relaxed drop-shadow-xl max-w-3xl mx-auto',
    authorNameFont: 'font-serif font-bold text-lg sm:text-xl text-amber-100',
    authorTitleFont: 'font-serif text-xs sm:text-sm text-emerald-300 italic mt-0.5',
    subTextFont: 'font-serif text-xs text-slate-400 mt-1',
    badgeClass: 'text-xs font-serif font-bold uppercase tracking-widest bg-emerald-950/80 border border-emerald-500/40 text-amber-300',
    iconColor: 'text-emerald-500/30',
  },

  // Departments Section
  departments: {
    sectionBg: 'py-16 bg-slate-950 text-emerald-50 border-y border-emerald-950',
    sectionHeaderBadge: 'bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 text-xs font-serif font-bold uppercase',
    headingFont: 'font-serif font-bold tracking-normal text-emerald-50 text-3xl sm:text-4xl',
    subtitleFont: 'font-serif text-slate-300 text-sm italic',
    cardBorder: 'border-emerald-500/30 hover:border-emerald-400/70',
    cardBg: 'bg-slate-900/85 backdrop-blur-md rounded-2xl p-6 shadow-xl hover:shadow-2xl transition duration-300 border',
    cardHover: 'hover:-translate-y-1',
    iconBg: 'bg-emerald-500/15 text-emerald-300 border border-emerald-400/30',
    accentText: 'text-emerald-300 hover:text-amber-300 font-serif font-semibold',
    tagBadge: 'bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-serif text-[10px] uppercase font-bold',
  },

  // Courses Section
  courses: {
    sectionBg: 'py-16 bg-slate-950 text-emerald-50 border-y border-emerald-950',
    sectionHeaderBadge: 'bg-emerald-950/90 text-amber-300 border border-amber-400/40 text-xs font-serif font-bold uppercase',
    headingFont: 'font-serif font-bold tracking-normal text-emerald-50 text-3xl sm:text-4xl',
    subtitleFont: 'font-serif text-slate-300 text-sm italic',
    cardBorder: 'border-emerald-500/30 hover:border-amber-400/60',
    cardBg: 'bg-slate-900/85 backdrop-blur-md rounded-2xl p-6 shadow-xl hover:shadow-2xl transition duration-300 border',
    badge: 'bg-emerald-950/80 text-emerald-200 border border-emerald-500/40 font-serif text-[10px] uppercase font-bold',
    accentText: 'text-amber-300 hover:text-amber-200 font-serif font-semibold',
    primaryBtn: 'bg-emerald-600 hover:bg-emerald-500 text-white font-serif font-bold text-xs shadow-md shadow-emerald-950/40',
    iconColor: 'text-emerald-400',
  },

  // Call to Action (CTA)
  cta: {
    sectionBg: 'py-16 sm:py-20 bg-slate-950 text-emerald-100 relative overflow-hidden border-y-2 border-emerald-500/30',
    badgeClass: 'bg-emerald-950/90 border-emerald-500/40 text-amber-300 font-serif font-bold uppercase',
    headlineFont: 'font-serif font-bold tracking-normal text-emerald-50 text-3xl sm:text-4xl lg:text-5xl',
    subheadlineFont: 'font-serif text-slate-200 text-sm sm:text-base italic',
    primaryBtnClass: 'bg-emerald-600 hover:bg-emerald-500 text-white font-serif font-bold shadow-xl shadow-emerald-950/80 border border-emerald-400/40',
    secondaryBtnClass: 'bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/40 text-amber-200 font-serif font-semibold',
  },

  // Cards Section
  cards: {
    headingFont: 'font-serif font-bold text-emerald-50',
    cardBorder: 'border-emerald-500/30 hover:border-emerald-400',
    cardBg: 'bg-slate-900/85 backdrop-blur-md text-emerald-100',
    badge: 'bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-serif text-xs',
  },
};
