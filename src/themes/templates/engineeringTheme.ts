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

  // Statistics Section
  statistics: {
    sectionBg: 'bg-slate-950 text-white border-y border-slate-800/80',
    bgPatternOverlay: {
      backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(56, 189, 248, 0.4) 1px, transparent 0)',
      backgroundSize: '28px 28px',
      opacity: 0.1,
    },
    headerBadge: 'bg-slate-900 border-amber-400/40 text-amber-300',
    headerTitleFont: 'font-sans font-black uppercase tracking-tight text-white',
    headerSubtitleFont: 'font-mono text-slate-400',
    cardContainer: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6',
    cardBg: 'bg-slate-900/90 backdrop-blur-md border border-slate-800 hover:border-amber-400/60 rounded-2xl p-6 shadow-xl relative overflow-hidden group transition-all duration-300 transform hover:-translate-y-1',
    cardTopAccent: 'bg-gradient-to-r from-amber-400 to-cyan-400',
    iconBox: 'w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-300 group-hover:bg-amber-400 group-hover:text-slate-950 transition-all shadow-inner',
    valueFont: 'font-mono font-black text-white text-3xl sm:text-4xl tracking-tight leading-none',
    suffixFont: 'font-mono text-amber-400 font-black',
    labelFont: 'font-sans text-xs font-bold text-slate-300 uppercase tracking-wider',
    tagBadge: 'text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700',
  },

  // Quote / Leadership Section
  quote: {
    sectionBg: 'bg-slate-950 text-white border-y border-slate-800',
    photoContainer: 'lg:col-span-4 bg-slate-900/90 backdrop-blur-xl border border-amber-400/30 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-4',
    photoFrame: 'aspect-square rounded-2xl overflow-hidden border border-slate-700 bg-slate-800',
    quoteBox: 'lg:col-span-8 bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-5',
    quoteTextFont: 'font-sans font-medium text-slate-100 text-lg sm:text-xl lg:text-2xl leading-relaxed',
    authorNameFont: 'font-sans font-black uppercase text-white text-lg tracking-wide',
    authorTitleFont: 'font-mono text-xs text-amber-300',
    subTextFont: 'font-mono text-[11px] text-slate-400',
    badgeClass: 'text-xs font-mono uppercase font-bold text-amber-300',
    iconColor: 'text-cyan-400',
  },

  // Departments Section
  departments: {
    sectionBg: 'py-16 bg-slate-950 text-white border-y border-slate-900',
    sectionHeaderBadge: 'bg-slate-900 text-amber-300 border border-amber-400/40 text-xs font-mono font-bold uppercase',
    headingFont: 'font-sans font-black uppercase tracking-tight text-white text-3xl sm:text-4xl',
    subtitleFont: 'font-sans text-slate-400 text-sm',
    cardBorder: 'border-slate-800 hover:border-amber-400/60',
    cardBg: 'bg-slate-900/90 backdrop-blur-md rounded-2xl p-6 shadow-xl hover:shadow-2xl transition duration-300',
    cardHover: 'hover:-translate-y-1',
    iconBg: 'bg-amber-400/15 text-amber-300 border border-amber-400/30',
    accentText: 'text-amber-400 hover:text-amber-300 font-bold',
    tagBadge: 'bg-slate-800 text-slate-300 border border-slate-700 font-mono text-[10px] uppercase font-bold',
  },

  // Courses Section
  courses: {
    sectionBg: 'py-16 bg-slate-950 text-white border-y border-slate-900',
    sectionHeaderBadge: 'bg-slate-900 text-cyan-300 border border-cyan-400/40 text-xs font-mono font-bold uppercase',
    headingFont: 'font-sans font-black uppercase tracking-tight text-white text-3xl sm:text-4xl',
    subtitleFont: 'font-sans text-slate-400 text-sm',
    cardBorder: 'border-slate-800 hover:border-cyan-400/60',
    cardBg: 'bg-slate-900/90 backdrop-blur-md rounded-2xl p-6 shadow-xl hover:shadow-2xl transition duration-300',
    badge: 'bg-cyan-950/80 text-cyan-300 border border-cyan-400/40 font-mono text-[10px] uppercase font-bold',
    accentText: 'text-cyan-400 hover:text-cyan-300 font-bold',
    primaryBtn: 'bg-amber-400 hover:bg-amber-300 text-slate-950 font-black uppercase text-xs shadow-md shadow-amber-500/20',
    iconColor: 'text-cyan-400',
  },

  // Call to Action (CTA)
  cta: {
    sectionBg: 'py-16 sm:py-20 bg-slate-950 text-white relative overflow-hidden border-y border-amber-500/30',
    badgeClass: 'bg-slate-900 border-amber-400/50 text-amber-300 font-mono font-bold uppercase',
    headlineFont: 'font-sans font-black uppercase tracking-tight text-white text-3xl sm:text-4xl lg:text-5xl',
    subheadlineFont: 'font-mono text-slate-300 text-sm sm:text-base',
    primaryBtnClass: 'bg-amber-400 hover:bg-amber-300 text-slate-950 font-black uppercase tracking-wide shadow-xl shadow-amber-500/25',
    secondaryBtnClass: 'bg-slate-900/80 hover:bg-slate-800 border-cyan-400/40 text-white font-bold',
  },

  // Cards Section
  cards: {
    headingFont: 'font-sans font-black uppercase text-white',
    cardBorder: 'border-slate-800 hover:border-amber-400/60',
    cardBg: 'bg-slate-900/90 backdrop-blur-md text-white',
    badge: 'bg-slate-800 text-amber-300 border border-slate-700 font-mono text-xs',
  },
};
