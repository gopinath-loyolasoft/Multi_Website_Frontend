import React from 'react';
import { ModuleThemeStyles } from '../templateThemeSystem';

export const ENGINEERING_THEME: ModuleThemeStyles = {
  // Hero Section
  hero: {
    overlayGradient: {
      backgroundImage: 'linear-gradient(to right, rgba(2,6,23,0.95) 0%, rgba(2,6,23,0.70) 55%, rgba(15,23,42,0.30) 100%)',
    },
    vignetteStyle: {
      background: 'linear-gradient(to top, rgba(2, 6, 23, 0.85) 0%, transparent 50%, rgba(2, 6, 23, 0.40) 100%)',
    },
    imageOpacity: 'opacity-85',
    badgeClass: 'bg-slate-900/90 border-amber-400/40 text-amber-300 font-sans',
    badgeIconClass: 'text-amber-400',
    headingClass: 'font-sans font-black uppercase tracking-tight text-white',
    descriptionClass: 'font-sans text-slate-200',
    primaryBtnClass: 'bg-amber-400 hover:bg-amber-300 text-slate-950 font-black uppercase tracking-wide shadow-amber-500/25',
    secondaryBtnClass: 'bg-slate-900/80 hover:bg-slate-800 border-cyan-400/30 text-white font-bold',
    checkColor: 'text-amber-400',
    rightCardBorder: 'border-amber-400/30 bg-slate-900/90 text-white shadow-2xl',
    cardIconClass: 'bg-amber-400/15 border-amber-400/40 text-amber-300',
    cardSubtitleColor: 'text-amber-300/90 font-mono',
  },

  // Hero Slider
  heroSlider: {
    overlayStyle: {
      backgroundImage: 'linear-gradient(to right, rgba(2,6,23,0.95) 0%, rgba(2,6,23,0.70) 55%, rgba(15,23,42,0.30) 100%)',
    },
    badgeClass: 'bg-slate-900/90 border-amber-400/40 text-amber-300 font-sans',
    badgeIconClass: 'text-amber-300',
    headlineClass: 'font-sans font-black uppercase tracking-tight text-white',
    primaryBtnClass: 'bg-amber-400 hover:bg-amber-300 text-slate-950 font-black uppercase shadow-amber-500/25',
    dotActiveClass: 'w-8 bg-amber-400 shadow-md shadow-amber-400/50',
    rightCardBorder: 'bg-slate-900/90 border-amber-400/30 text-white shadow-2xl',
  },

  // Statistics Section (Clean High-Tech Precision Light Theme)
  statistics: {
    sectionBg: 'bg-slate-50 text-slate-900 border-y border-slate-200',
    bgPatternOverlay: {
      backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(30, 64, 175, 0.08) 1px, transparent 0)',
      backgroundSize: '28px 28px',
      opacity: 1,
    },
    headerAlignment: 'text-left max-w-3xl',
    headerBadge: 'bg-blue-100 border-blue-300 text-blue-800 font-mono font-bold',
    headerTitleFont: 'font-sans font-black uppercase tracking-tight text-slate-900',
    headerSubtitleFont: 'font-sans text-slate-600',
    cardContainer: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6',
    cardBg: 'bg-white border border-slate-200 hover:border-blue-500 rounded-2xl p-6 shadow-sm hover:shadow-xl relative overflow-hidden group transition-all duration-300 transform hover:-translate-y-1 text-slate-900',
    cardTopAccent: 'bg-gradient-to-r from-blue-600 to-cyan-500',
    iconBox: 'w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm flex items-center justify-center',
    valueFont: 'font-mono font-black text-slate-900 text-3xl sm:text-4xl tracking-tight leading-none',
    suffixFont: 'font-mono text-blue-600 font-black',
    labelFont: 'font-sans text-xs font-bold text-slate-600 uppercase tracking-wider',
    tagBadge: 'text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200',
  },

  // Quote / Leadership Section (Dean's High-Tech Research Suite - Light)
  quote: {
    sectionBg: 'bg-white text-slate-900 border-y border-slate-200',
    isCentered: false,
    layoutContainer: 'grid grid-cols-1 lg:grid-cols-12 gap-8 items-center',
    photoContainer: 'lg:col-span-4 bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-sm space-y-4',
    photoFrame: 'aspect-square rounded-2xl overflow-hidden border border-slate-200 bg-white',
    quoteBox: 'lg:col-span-8 bg-slate-50/70 border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-sm space-y-5',
    quoteTextFont: 'font-sans font-medium text-slate-800 text-lg sm:text-xl lg:text-2xl leading-relaxed',
    authorNameFont: 'font-sans font-black uppercase text-slate-900 text-lg tracking-wide',
    authorTitleFont: 'font-mono text-xs text-blue-700 font-bold',
    subTextFont: 'font-mono text-[11px] text-slate-500',
    badgeClass: 'text-xs font-mono uppercase font-bold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full',
    iconColor: 'text-blue-500',
  },

  // Departments Section (Academic Divisions - Clean Light)
  departments: {
    sectionBg: 'py-16 bg-slate-50 text-slate-900 border-y border-slate-200',
    sectionHeaderBadge: 'bg-blue-100 text-blue-800 border border-blue-300 text-xs font-mono font-bold uppercase',
    headingFont: 'font-sans font-black uppercase tracking-tight text-slate-900 text-3xl sm:text-4xl',
    subtitleFont: 'font-sans text-slate-600 text-sm',
    cardBorder: 'border border-slate-200 hover:border-blue-500',
    cardBg: 'bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition duration-300 border text-slate-900',
    cardHover: 'hover:-translate-y-1',
    iconBg: 'bg-blue-50 text-blue-600 border border-blue-200',
    accentText: 'text-blue-600 hover:text-blue-800 font-bold',
    tagBadge: 'bg-slate-100 text-slate-700 border border-slate-200 font-mono text-[10px] uppercase font-bold',
  },

  // Courses Section (Degree Programs - Clean Light)
  courses: {
    sectionBg: 'py-16 bg-white text-slate-900 border-y border-slate-100',
    sectionHeaderBadge: 'bg-cyan-100 text-cyan-800 border border-cyan-300 text-xs font-mono font-bold uppercase',
    headingFont: 'font-sans font-black uppercase tracking-tight text-slate-900 text-3xl sm:text-4xl',
    subtitleFont: 'font-sans text-slate-600 text-sm',
    cardBorder: 'border border-slate-200 hover:border-cyan-500',
    cardBg: 'bg-slate-50/70 rounded-2xl p-6 shadow-sm hover:shadow-xl transition duration-300 border text-slate-900',
    badge: 'bg-cyan-50 text-cyan-800 border border-cyan-200 font-mono text-[10px] uppercase font-bold',
    accentText: 'text-cyan-700 hover:text-cyan-900 font-bold',
    primaryBtn: 'bg-blue-600 hover:bg-blue-700 text-white font-black uppercase text-xs shadow-md shadow-blue-500/20',
    iconColor: 'text-cyan-600',
  },

  // Call to Action (CTA)
  cta: {
    sectionBg: 'py-16 sm:py-20 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white relative overflow-hidden shadow-2xl',
    badgeClass: 'bg-blue-950/80 border-cyan-400/50 text-cyan-300 font-mono font-bold uppercase',
    headlineFont: 'font-sans font-black uppercase tracking-tight text-white text-3xl sm:text-4xl lg:text-5xl',
    subheadlineFont: 'font-mono text-slate-200 text-sm sm:text-base',
    primaryBtnClass: 'bg-amber-400 hover:bg-amber-300 text-slate-950 font-black uppercase tracking-wide shadow-xl shadow-amber-500/25',
    secondaryBtnClass: 'bg-slate-900/80 hover:bg-slate-800 border-cyan-400/40 text-white font-bold',
  },

  // Cards Section
  cards: {
    headingFont: 'font-sans font-black uppercase text-slate-900',
    cardBorder: 'border border-slate-200 hover:border-blue-500',
    cardBg: 'bg-white text-slate-900 shadow-sm',
    badge: 'bg-blue-50 text-blue-700 border border-blue-200 font-mono text-xs',
  },
};
