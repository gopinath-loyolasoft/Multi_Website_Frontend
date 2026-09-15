import React from 'react';
import { ModuleThemeStyles } from '../templateThemeSystem';

export const MEDICAL_THEME: ModuleThemeStyles = {
  // Hero Section
  hero: {
    overlayGradient: {
      backgroundImage: 'linear-gradient(to right, rgba(2,6,23,0.96) 0%, rgba(8,51,68,0.70) 55%, rgba(2,6,23,0.30) 100%)',
    },
    vignetteStyle: {
      background: 'linear-gradient(to top, rgba(2, 6, 23, 0.85) 0%, transparent 50%, rgba(2, 6, 23, 0.40) 100%)',
    },
    imageOpacity: 'opacity-85',
    badgeClass: 'bg-cyan-950/80 border-cyan-400/40 text-cyan-200 font-sans',
    badgeIconClass: 'text-cyan-300',
    headingClass: 'font-sans font-extrabold tracking-tight text-white',
    descriptionClass: 'font-sans text-cyan-100/90',
    primaryBtnClass: 'bg-cyan-600 hover:bg-cyan-500 text-white font-bold shadow-cyan-900/40',
    secondaryBtnClass: 'bg-rose-600 hover:bg-rose-500 border border-rose-500/40 text-white font-bold shadow-xl shadow-rose-950/50',
    checkColor: 'text-cyan-400',
    rightCardBorder: 'border-cyan-500/30 bg-slate-950/90 text-white shadow-2xl shadow-cyan-950/60',
    cardIconClass: 'bg-cyan-500/15 border-cyan-400/30 text-cyan-300',
    cardSubtitleColor: 'text-cyan-300/90 font-medium',
  },

  // Hero Slider
  heroSlider: {
    overlayStyle: {
      backgroundImage: 'linear-gradient(to right, rgba(2,6,23,0.96) 0%, rgba(8,51,68,0.70) 55%, rgba(2,6,23,0.30) 100%)',
    },
    badgeClass: 'bg-cyan-950/80 border-cyan-400/40 text-cyan-200 font-sans',
    badgeIconClass: 'text-cyan-300',
    headlineClass: 'font-sans font-extrabold tracking-tight text-white',
    primaryBtnClass: 'bg-cyan-600 hover:bg-cyan-500 text-white font-bold shadow-cyan-900/40',
    dotActiveClass: 'w-8 bg-cyan-400 shadow-md shadow-cyan-400/50',
    rightCardBorder: 'bg-slate-950/90 border-cyan-500/30 text-white shadow-2xl shadow-cyan-950/60',
  },

  // Statistics Section
  statistics: {
    sectionBg: 'bg-slate-950 text-white border-y border-cyan-900/60',
    bgPatternOverlay: {
      backgroundImage: 'linear-gradient(rgba(6, 182, 212, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.3) 1px, transparent 1px)',
      backgroundSize: '36px 36px',
      opacity: 0.1,
    },
    headerBadge: 'bg-cyan-950/80 border-cyan-400/40 text-cyan-200',
    headerTitleFont: 'font-sans font-extrabold tracking-tight text-white text-2xl sm:text-4xl',
    headerSubtitleFont: 'font-sans text-cyan-100/80 text-xs sm:text-sm',
    cardContainer: 'bg-slate-900/90 backdrop-blur-xl border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl grid grid-cols-2 lg:grid-cols-4 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-cyan-900/50',
    cardBg: 'flex items-center gap-4',
    cardTopAccent: 'bg-cyan-400',
    iconBox: 'w-13 h-13 rounded-2xl bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 shrink-0 p-3 shadow-inner',
    valueFont: 'font-sans font-black text-white text-2xl sm:text-3xl lg:text-4xl tracking-tight leading-none',
    suffixFont: 'font-sans text-cyan-400 font-bold',
    labelFont: 'font-sans text-xs font-bold text-cyan-100/80 mt-1 uppercase tracking-wide',
    tagBadge: 'text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-cyan-950 text-cyan-200 border border-cyan-400/40',
  },

  // Quote / Leadership Section
  quote: {
    sectionBg: 'bg-slate-950 text-white border-y border-cyan-900/60',
    photoContainer: 'lg:col-span-4 bg-slate-900/90 backdrop-blur-xl border border-cyan-500/30 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-4',
    photoFrame: 'aspect-square rounded-2xl overflow-hidden border border-cyan-900/80 bg-slate-800',
    quoteBox: 'lg:col-span-8 bg-slate-900/70 backdrop-blur-xl border border-cyan-500/30 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-5',
    quoteTextFont: 'font-sans font-semibold text-white text-lg sm:text-xl lg:text-2xl leading-relaxed',
    authorNameFont: 'font-sans font-extrabold text-white text-lg',
    authorTitleFont: 'font-sans text-xs font-medium text-cyan-300 mt-0.5',
    subTextFont: 'font-sans text-[11px] text-cyan-100/70 mt-1',
    badgeClass: 'text-xs uppercase font-bold text-cyan-200',
    iconColor: 'text-cyan-500/40',
  },

  // Departments Section
  departments: {
    sectionBg: 'py-16 bg-slate-950 text-cyan-50 border-y border-cyan-950',
    sectionHeaderBadge: 'bg-cyan-950/90 text-cyan-300 border border-cyan-400/40 text-xs font-sans font-bold uppercase',
    headingFont: 'font-sans font-extrabold tracking-tight text-white text-3xl sm:text-4xl',
    subtitleFont: 'font-sans text-cyan-100/70 text-sm',
    cardBorder: 'border-cyan-500/30 hover:border-cyan-400/70',
    cardBg: 'bg-slate-900/90 backdrop-blur-md rounded-2xl p-6 shadow-xl hover:shadow-2xl transition duration-300 border',
    cardHover: 'hover:-translate-y-1',
    iconBg: 'bg-cyan-500/15 text-cyan-300 border border-cyan-400/30',
    accentText: 'text-cyan-300 hover:text-cyan-200 font-bold',
    tagBadge: 'bg-cyan-950 text-cyan-300 border border-cyan-400/40 font-sans text-[10px] uppercase font-bold',
  },

  // Courses Section
  courses: {
    sectionBg: 'py-16 bg-slate-950 text-cyan-50 border-y border-cyan-950',
    sectionHeaderBadge: 'bg-cyan-950/90 text-cyan-300 border border-cyan-400/40 text-xs font-sans font-bold uppercase',
    headingFont: 'font-sans font-extrabold tracking-tight text-white text-3xl sm:text-4xl',
    subtitleFont: 'font-sans text-cyan-100/70 text-sm',
    cardBorder: 'border-cyan-500/30 hover:border-cyan-400/60',
    cardBg: 'bg-slate-900/90 backdrop-blur-md rounded-2xl p-6 shadow-xl hover:shadow-2xl transition duration-300 border',
    badge: 'bg-cyan-950/80 text-cyan-200 border border-cyan-400/40 font-sans text-[10px] uppercase font-bold',
    accentText: 'text-cyan-300 hover:text-cyan-200 font-bold',
    primaryBtn: 'bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md shadow-cyan-900/40',
    iconColor: 'text-cyan-400',
  },

  // Call to Action (CTA)
  cta: {
    sectionBg: 'py-16 sm:py-20 bg-slate-950 text-white relative overflow-hidden border-y border-cyan-900/60',
    badgeClass: 'bg-cyan-950/80 border-cyan-400/40 text-cyan-200 font-sans font-bold uppercase',
    headlineFont: 'font-sans font-extrabold tracking-tight leading-tight text-white text-3xl sm:text-4xl lg:text-5xl',
    subheadlineFont: 'font-sans text-cyan-100/90 text-sm sm:text-base',
    primaryBtnClass: 'bg-cyan-600 hover:bg-cyan-500 text-white font-bold shadow-xl shadow-cyan-900/50',
    secondaryBtnClass: 'bg-rose-600 hover:bg-rose-500 border border-rose-500/40 text-white font-bold shadow-xl shadow-rose-950/50',
  },

  // Cards Section
  cards: {
    headingFont: 'font-sans font-extrabold text-white',
    cardBorder: 'border-cyan-500/30 hover:border-cyan-400',
    cardBg: 'bg-slate-900/90 backdrop-blur-md text-cyan-50',
    badge: 'bg-cyan-950 text-cyan-300 border border-cyan-400/40 font-sans text-xs',
  },
};
