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

  // Statistics Section (Crisp Sterile Clinical Light Theme)
  statistics: {
    sectionBg: 'bg-slate-50 text-slate-900 border-y border-cyan-100',
    bgPatternOverlay: {
      backgroundImage: 'linear-gradient(rgba(6, 182, 212, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.08) 1px, transparent 1px)',
      backgroundSize: '36px 36px',
      opacity: 1,
    },
    headerAlignment: 'text-left max-w-3xl',
    headerBadge: 'bg-cyan-100 border-cyan-300 text-cyan-800 font-sans font-bold',
    headerTitleFont: 'font-sans font-extrabold tracking-tight text-slate-900 text-2xl sm:text-4xl',
    headerSubtitleFont: 'font-sans text-slate-600 text-xs sm:text-sm',
    cardContainer: 'bg-white border border-cyan-200 rounded-3xl p-6 sm:p-8 shadow-xl shadow-cyan-900/5 grid grid-cols-2 lg:grid-cols-4 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-cyan-100',
    cardBg: 'flex items-center gap-4',
    cardTopAccent: 'bg-cyan-500',
    iconBox: 'w-13 h-13 rounded-2xl bg-cyan-50 border border-cyan-200 text-cyan-700 shrink-0 p-3 shadow-sm flex items-center justify-center',
    valueFont: 'font-sans font-black text-cyan-950 text-2xl sm:text-3xl lg:text-4xl tracking-tight leading-none',
    suffixFont: 'font-sans text-cyan-600 font-bold',
    labelFont: 'font-sans text-xs font-bold text-slate-700 mt-1 uppercase tracking-wide',
    tagBadge: 'text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-cyan-100 text-cyan-800 border border-cyan-200',
  },

  // Quote / Leadership Section (Medical Director Clinical Station)
  quote: {
    sectionBg: 'bg-white text-slate-900 border-y border-cyan-100',
    isCentered: false,
    layoutContainer: 'grid grid-cols-1 lg:grid-cols-12 gap-8 items-center',
    photoContainer: 'lg:col-span-4 bg-slate-50 border border-cyan-200 rounded-3xl p-6 sm:p-7 shadow-lg space-y-4',
    photoFrame: 'aspect-square rounded-2xl overflow-hidden border-2 border-cyan-200 bg-white',
    quoteBox: 'lg:col-span-8 bg-cyan-50/50 border border-cyan-200/80 rounded-3xl p-8 sm:p-10 shadow-lg space-y-5',
    quoteTextFont: 'font-sans font-semibold text-slate-900 text-lg sm:text-xl lg:text-2xl leading-relaxed',
    authorNameFont: 'font-sans font-extrabold text-cyan-950 text-lg',
    authorTitleFont: 'font-sans text-xs font-bold text-cyan-700 mt-0.5',
    subTextFont: 'font-sans text-[11px] text-slate-500 mt-1',
    badgeClass: 'text-xs uppercase font-bold text-cyan-800 bg-cyan-100 px-3 py-1 rounded-full border border-cyan-300',
    iconColor: 'text-cyan-400',
  },

  // Departments Section (Hospital Specialty Wings)
  departments: {
    sectionBg: 'py-16 bg-slate-50 text-slate-900 border-y border-cyan-100',
    sectionHeaderBadge: 'bg-cyan-100 text-cyan-800 border border-cyan-300 text-xs font-sans font-bold uppercase',
    headingFont: 'font-sans font-extrabold tracking-tight text-slate-900 text-3xl sm:text-4xl',
    subtitleFont: 'font-sans text-slate-600 text-sm',
    cardBorder: 'border border-cyan-200 hover:border-cyan-500',
    cardBg: 'bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition duration-300 border text-slate-900',
    cardHover: 'hover:-translate-y-1',
    iconBg: 'bg-cyan-100 text-cyan-700 border border-cyan-200',
    accentText: 'text-cyan-700 hover:text-cyan-900 font-bold',
    tagBadge: 'bg-cyan-50 text-cyan-800 border border-cyan-200 font-sans text-[10px] uppercase font-bold',
  },

  // Courses Section (Clinical Degree Programs)
  courses: {
    sectionBg: 'py-16 bg-white text-slate-900 border-y border-cyan-100',
    sectionHeaderBadge: 'bg-cyan-100 text-cyan-800 border border-cyan-300 text-xs font-sans font-bold uppercase',
    headingFont: 'font-sans font-extrabold tracking-tight text-slate-900 text-3xl sm:text-4xl',
    subtitleFont: 'font-sans text-slate-600 text-sm',
    cardBorder: 'border border-cyan-200 hover:border-cyan-500',
    cardBg: 'bg-slate-50/70 rounded-2xl p-6 shadow-md hover:shadow-xl transition duration-300 border text-slate-900',
    badge: 'bg-cyan-100 text-cyan-800 border border-cyan-200 font-sans text-[10px] uppercase font-bold',
    accentText: 'text-cyan-700 hover:text-cyan-900 font-bold',
    primaryBtn: 'bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs shadow-md shadow-cyan-900/20',
    iconColor: 'text-cyan-600',
  },

  // Call to Action (CTA)
  cta: {
    sectionBg: 'py-16 sm:py-20 bg-gradient-to-r from-cyan-600 via-teal-600 to-cyan-700 text-white relative overflow-hidden shadow-2xl',
    badgeClass: 'bg-cyan-950/40 border-white/40 text-cyan-100 font-sans font-bold uppercase',
    headlineFont: 'font-sans font-extrabold tracking-tight leading-tight text-white text-3xl sm:text-4xl lg:text-5xl',
    subheadlineFont: 'font-sans text-cyan-50 text-sm sm:text-base',
    primaryBtnClass: 'bg-white hover:bg-cyan-50 text-cyan-950 font-bold shadow-xl shadow-cyan-900/30',
    secondaryBtnClass: 'bg-rose-600 hover:bg-rose-500 border border-rose-400 text-white font-bold shadow-xl',
  },

  // Cards Section
  cards: {
    headingFont: 'font-sans font-extrabold text-slate-900',
    cardBorder: 'border border-cyan-200 hover:border-cyan-400',
    cardBg: 'bg-white text-slate-900 shadow-md',
    badge: 'bg-cyan-100 text-cyan-800 border border-cyan-200 font-sans text-xs',
  },
};
