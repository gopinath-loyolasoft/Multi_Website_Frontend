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

  // Statistics Section (Ivy-League Warm Classical Stone & Crimson Theme)
  statistics: {
    sectionBg: 'bg-[#fcfaf7] text-slate-900 border-y border-stone-200',
    bgPatternOverlay: {
      backgroundImage: 'radial-gradient(circle at 50% 30%, rgba(136,19,55,0.05) 0%, transparent 70%)',
      opacity: 1,
    },
    headerAlignment: 'text-center max-w-3xl mx-auto',
    headerBadge: 'bg-rose-100 border-rose-300 text-rose-900 font-serif font-bold',
    headerTitleFont: 'font-serif font-bold text-rose-950 text-2xl sm:text-4xl tracking-normal drop-shadow-sm',
    headerSubtitleFont: 'font-serif text-slate-600 text-sm',
    cardContainer: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5',
    cardBg: 'bg-white border-t-4 border-t-rose-900 border-x border-b border-stone-200 rounded-2xl p-6 shadow-xl shadow-rose-950/5 text-center space-y-3 transition transform hover:-translate-y-1',
    cardTopAccent: 'bg-rose-900',
    iconBox: 'w-12 h-12 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 mx-auto shadow-sm flex items-center justify-center',
    valueFont: 'font-serif font-black text-rose-950 text-3xl sm:text-4xl tracking-tight leading-none justify-center',
    suffixFont: 'font-serif text-amber-600 ml-0.5',
    labelFont: 'font-serif text-xs font-bold text-slate-700 uppercase tracking-wider',
    tagBadge: 'font-serif text-[10px] uppercase px-2 py-0.5 rounded bg-rose-100 text-rose-900 border border-rose-200',
  },

  // Quote / Leadership Section (Chancellor's Grand Archival Chamber - Centered)
  quote: {
    sectionBg: 'bg-[#f7f4ee] text-slate-900 border-y border-stone-200',
    isCentered: true,
    layoutContainer: 'max-w-4xl mx-auto text-center space-y-8',
    photoContainer: 'pt-4 flex items-center justify-center gap-4 max-w-md mx-auto p-4 rounded-2xl bg-white border border-stone-200 shadow-md',
    photoFrame: 'w-16 h-16 rounded-full overflow-hidden border-2 border-rose-900 shadow-sm shrink-0',
    quoteBox: 'relative text-center',
    quoteTextFont: 'font-serif font-bold text-rose-950 text-xl sm:text-2xl lg:text-3xl leading-relaxed max-w-3xl mx-auto',
    authorNameFont: 'font-serif font-bold text-base text-rose-900',
    authorTitleFont: 'font-serif text-xs text-amber-700',
    subTextFont: 'font-serif text-[11px] text-slate-500',
    badgeClass: 'text-xs font-serif font-bold uppercase tracking-wider bg-rose-100 border border-rose-300 text-rose-900 px-3 py-1 rounded-full',
    iconColor: 'text-rose-400',
  },

  // Departments Section (Monumental Faculty Quadrangles)
  departments: {
    sectionBg: 'py-16 bg-[#fcfaf7] text-slate-900 border-y border-stone-200',
    sectionHeaderBadge: 'bg-rose-100 text-rose-900 border border-rose-300 text-xs font-serif font-bold uppercase',
    headingFont: 'font-serif font-bold tracking-normal text-rose-950 text-3xl sm:text-4xl',
    subtitleFont: 'font-serif text-slate-600 text-sm',
    cardBorder: 'border-t-4 border-t-rose-900 border-x border-b border-stone-200 hover:border-rose-700',
    cardBg: 'bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition duration-300 border text-slate-900',
    cardHover: 'hover:-translate-y-1',
    iconBg: 'bg-rose-100 text-rose-900 border border-rose-200',
    accentText: 'text-rose-900 hover:text-amber-700 font-serif font-bold',
    tagBadge: 'bg-rose-50 text-rose-900 border border-rose-200 font-serif text-[10px] uppercase font-bold',
  },

  // Courses Section (University Multi-Faculty Degree Portal)
  courses: {
    sectionBg: 'py-16 bg-[#f7f4ee] text-slate-900 border-y border-stone-200',
    sectionHeaderBadge: 'bg-rose-100 text-rose-900 border border-rose-300 text-xs font-serif font-bold uppercase',
    headingFont: 'font-serif font-bold tracking-normal text-rose-950 text-3xl sm:text-4xl',
    subtitleFont: 'font-serif text-slate-600 text-sm',
    cardBorder: 'border-t-4 border-t-rose-900 border-x border-b border-stone-200 hover:border-amber-500',
    cardBg: 'bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition duration-300 border text-slate-900',
    badge: 'bg-rose-100 text-rose-900 border border-rose-200 font-serif text-[10px] uppercase font-bold',
    accentText: 'text-rose-900 hover:text-amber-700 font-serif font-bold',
    primaryBtn: 'bg-rose-900 hover:bg-rose-950 text-amber-100 font-serif font-bold text-xs shadow-md shadow-rose-950/20',
    iconColor: 'text-rose-800',
  },

  // Call to Action (CTA)
  cta: {
    sectionBg: 'py-16 sm:py-20 bg-gradient-to-r from-rose-950 via-slate-950 to-rose-950 text-amber-100 relative overflow-hidden border-y border-amber-500/40',
    badgeClass: 'bg-rose-950/80 border-amber-400/40 text-amber-200 font-serif font-bold uppercase',
    headlineFont: 'font-serif font-bold tracking-normal leading-tight max-w-3xl mx-auto text-amber-50 text-3xl sm:text-4xl lg:text-5xl',
    subheadlineFont: 'font-serif text-slate-200 text-sm sm:text-base',
    primaryBtnClass: 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 border border-amber-300/50 shadow-xl shadow-amber-950/50 font-serif font-bold',
    secondaryBtnClass: 'bg-rose-950/60 hover:bg-rose-900/60 border border-amber-400/30 text-amber-200 font-serif font-semibold',
  },

  // Cards Section
  cards: {
    headingFont: 'font-serif font-bold text-rose-950',
    cardBorder: 'border-t-4 border-t-rose-900 border-x border-b border-stone-200',
    cardBg: 'bg-white text-slate-900 shadow-md',
    badge: 'bg-rose-100 text-rose-900 border border-rose-200 font-serif text-xs',
  },
};
