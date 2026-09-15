import React from 'react';
import { ModuleThemeStyles } from '../templateThemeSystem';

export const UNIVERSITY_THEME: ModuleThemeStyles = {
  // Hero Section
  hero: {
    overlayGradient: {
      backgroundImage: 'linear-gradient(to right, rgba(2,6,23,0.96) 0%, rgba(136,19,55,0.45) 55%, rgba(15,23,42,0.30) 100%)',
    },
    vignetteStyle: {
      background: 'linear-gradient(to top, rgba(2, 6, 23, 0.90) 0%, transparent 55%, rgba(2, 6, 23, 0.45) 100%)',
    },
    imageOpacity: 'opacity-85',
    badgeClass: 'bg-rose-950/80 border-amber-400/40 text-amber-200 font-serif',
    badgeIconClass: 'text-amber-400',
    headingClass: 'font-serif font-bold tracking-normal text-amber-50',
    descriptionClass: 'font-serif text-slate-200',
    primaryBtnClass: 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-serif font-bold border border-amber-300/50 shadow-amber-950/50',
    secondaryBtnClass: 'bg-rose-950/60 hover:bg-rose-900/60 border-amber-400/30 text-amber-200 font-serif font-semibold',
    checkColor: 'text-amber-400',
    rightCardBorder: 'border-amber-500/30 bg-slate-950/90 text-amber-100 shadow-2xl shadow-rose-950/50',
    cardIconClass: 'bg-rose-900/40 border-amber-400/40 text-amber-300',
    cardSubtitleColor: 'text-amber-300/80 font-serif italic',
  },

  // Hero Slider
  heroSlider: {
    overlayStyle: {
      backgroundImage: 'linear-gradient(to right, rgba(2,6,23,0.96) 0%, rgba(136,19,55,0.45) 55%, rgba(15,23,42,0.30) 100%)',
    },
    badgeClass: 'bg-rose-950/80 border-amber-400/40 text-amber-200 font-serif',
    badgeIconClass: 'text-amber-400',
    headlineClass: 'font-serif font-bold tracking-normal text-amber-50',
    primaryBtnClass: 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-serif font-bold border border-amber-300/50 shadow-amber-950/50',
    dotActiveClass: 'w-8 bg-amber-400 shadow-md shadow-amber-400/60',
    rightCardBorder: 'bg-slate-950/90 border-amber-500/30 text-amber-100 shadow-2xl shadow-rose-950/50',
  },

  // Statistics Section
  statistics: {
    sectionBg: 'bg-slate-950 text-amber-100 border-y border-rose-900/50',
    bgPatternOverlay: {
      backgroundImage: 'radial-gradient(circle at 50% 30%, rgba(136,19,55,0.4) 0%, transparent 70%)',
      opacity: 0.25,
    },
    headerBadge: 'bg-rose-950/80 border-amber-400/40 text-amber-200 font-serif',
    headerTitleFont: 'font-serif font-bold text-amber-50 text-2xl sm:text-4xl tracking-normal drop-shadow-lg',
    headerSubtitleFont: 'font-serif text-slate-300 text-sm',
    cardContainer: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5',
    cardBg: 'bg-slate-900/90 backdrop-blur-xl border border-amber-500/30 hover:border-amber-400 rounded-2xl p-6 shadow-2xl text-center space-y-3 transition transform hover:-translate-y-1',
    cardTopAccent: 'bg-gradient-to-r from-amber-400 to-rose-500',
    iconBox: 'w-12 h-12 rounded-xl bg-rose-900/40 border border-amber-400/40 text-amber-300 mx-auto shadow-inner flex items-center justify-center',
    valueFont: 'font-serif font-bold text-amber-100 text-3xl sm:text-4xl tracking-tight leading-none justify-center',
    suffixFont: 'font-serif text-rose-400 ml-0.5',
    labelFont: 'font-serif text-xs font-semibold text-slate-300 uppercase tracking-wider',
    tagBadge: 'font-serif text-[10px] uppercase px-2 py-0.5 rounded bg-rose-950 text-amber-300 border border-amber-500/40',
  },

  // Quote / Leadership Section
  quote: {
    sectionBg: 'bg-slate-950 text-amber-100 border-y border-amber-500/40',
    photoContainer: 'max-w-5xl mx-auto text-center space-y-8',
    photoFrame: 'w-14 h-14 rounded-full overflow-hidden border-2 border-amber-400/60 shrink-0',
    quoteBox: 'relative text-center',
    quoteTextFont: 'font-serif font-bold text-amber-50 text-xl sm:text-2xl lg:text-3xl leading-relaxed drop-shadow-xl max-w-4xl mx-auto',
    authorNameFont: 'font-serif font-bold text-base text-amber-100',
    authorTitleFont: 'font-serif text-xs text-amber-300/90',
    subTextFont: 'font-serif text-[11px] text-slate-400',
    badgeClass: 'text-xs font-serif font-bold uppercase tracking-wider bg-rose-950/80 border border-amber-400/40 text-amber-200',
    iconColor: 'text-amber-400',
  },

  // Departments Section
  departments: {
    sectionBg: 'py-16 bg-slate-950 text-amber-50 border-y border-rose-950',
    sectionHeaderBadge: 'bg-rose-950/90 text-amber-300 border border-amber-400/40 text-xs font-serif font-bold uppercase',
    headingFont: 'font-serif font-bold tracking-normal text-amber-50 text-3xl sm:text-4xl',
    subtitleFont: 'font-serif text-slate-300 text-sm',
    cardBorder: 'border-amber-500/30 hover:border-amber-400/70',
    cardBg: 'bg-slate-900/90 backdrop-blur-md rounded-2xl p-6 shadow-xl hover:shadow-2xl transition duration-300 border',
    cardHover: 'hover:-translate-y-1',
    iconBg: 'bg-rose-900/40 text-amber-300 border border-amber-400/40',
    accentText: 'text-amber-300 hover:text-amber-200 font-serif font-semibold',
    tagBadge: 'bg-rose-950 text-amber-300 border border-amber-500/40 font-serif text-[10px] uppercase font-bold',
  },

  // Courses Section
  courses: {
    sectionBg: 'py-16 bg-slate-950 text-amber-50 border-y border-rose-950',
    sectionHeaderBadge: 'bg-rose-950/90 text-amber-300 border border-amber-400/40 text-xs font-serif font-bold uppercase',
    headingFont: 'font-serif font-bold tracking-normal text-amber-50 text-3xl sm:text-4xl',
    subtitleFont: 'font-serif text-slate-300 text-sm',
    cardBorder: 'border-amber-500/30 hover:border-rose-400/60',
    cardBg: 'bg-slate-900/90 backdrop-blur-md rounded-2xl p-6 shadow-xl hover:shadow-2xl transition duration-300 border',
    badge: 'bg-rose-950/80 text-amber-200 border border-amber-400/40 font-serif text-[10px] uppercase font-bold',
    accentText: 'text-amber-300 hover:text-amber-200 font-serif font-semibold',
    primaryBtn: 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-serif font-bold text-xs shadow-md shadow-amber-950/40',
    iconColor: 'text-amber-400',
  },

  // Call to Action (CTA)
  cta: {
    sectionBg: 'py-16 sm:py-20 bg-slate-950 text-amber-100 relative overflow-hidden border-y border-amber-500/40',
    badgeClass: 'bg-rose-950/80 border-amber-400/40 text-amber-200 font-serif font-bold uppercase',
    headlineFont: 'font-serif font-bold tracking-normal leading-tight max-w-3xl mx-auto text-amber-50 text-3xl sm:text-4xl lg:text-5xl',
    subheadlineFont: 'font-serif text-slate-200 text-sm sm:text-base',
    primaryBtnClass: 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 border border-amber-300/50 shadow-xl shadow-amber-950/50 font-serif font-bold',
    secondaryBtnClass: 'bg-rose-950/60 hover:bg-rose-900/60 border border-amber-400/30 text-amber-200 font-serif font-semibold',
  },

  // Cards Section
  cards: {
    headingFont: 'font-serif font-bold text-amber-50',
    cardBorder: 'border-amber-500/30 hover:border-amber-400',
    cardBg: 'bg-slate-900/90 backdrop-blur-md text-amber-100',
    badge: 'bg-rose-950 text-amber-300 border border-amber-500/40 font-serif text-xs',
  },
};
