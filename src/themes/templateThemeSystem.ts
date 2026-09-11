import React from 'react';

export type TemplateCode = 'ENGINEERING_MODERN' | 'ARTS_SCIENCE_MODERN' | 'MEDICAL_MODERN' | 'UNIVERSITY_MODERN' | string;

export interface ModuleThemeStyles {
  // Hero Single Banner
  hero: {
    overlayGradient: React.CSSProperties;
    vignetteStyle: React.CSSProperties;
    imageOpacity: string;
    badgeClass: string;
    badgeIconClass: string;
    headingClass: string;
    descriptionClass: string;
    primaryBtnClass: string;
    secondaryBtnClass: string;
    checkColor: string;
    rightCardBorder: string;
    cardIconClass: string;
    cardSubtitleColor: string;
  };
  // Hero Slider Banner
  heroSlider: {
    overlayStyle: React.CSSProperties;
    badgeClass: string;
    badgeIconClass: string;
    headlineClass: string;
    primaryBtnClass: string;
    dotActiveClass: string;
    rightCardBorder: string;
  };
  // Departments Section
  departments: {
    sectionHeaderBadge: string;
    headingFont: string;
    cardBorder: string;
    cardBg: string;
    cardHover: string;
    iconBg: string;
    accentText: string;
    tagBadge: string;
  };
  // Courses Section
  courses: {
    headingFont: string;
    cardBorder: string;
    badge: string;
    accentText: string;
    primaryBtn: string;
    iconColor: string;
  };
  // Cards Section
  cards: {
    headingFont: string;
    cardBorder: string;
    cardBg: string;
    badge: string;
  };
}

const ENGINEERING_THEME: ModuleThemeStyles = {
  hero: {
    overlayGradient: {
      backgroundImage: 'linear-gradient(to right, rgba(2,6,23,0.85) 0%, rgba(2,6,23,0.45) 50%, rgba(15,23,42,0.15) 100%)',
    },
    vignetteStyle: {
      backgroundImage: 'linear-gradient(to top, rgba(2,6,23,0.75) 0%, transparent 60%, rgba(2,6,23,0.35) 100%)',
    },
    imageOpacity: 'opacity-90 sm:opacity-95',
    badgeClass: 'bg-amber-400/20 text-amber-300 border-amber-400/40 font-sans',
    badgeIconClass: 'text-amber-400',
    headingClass: 'font-sans font-black uppercase tracking-tight text-white',
    descriptionClass: 'font-sans text-slate-200',
    primaryBtnClass: 'bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold shadow-amber-400/25',
    secondaryBtnClass: 'bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold',
    checkColor: 'text-amber-400',
    rightCardBorder: 'border-white/20 bg-slate-900/75 text-white',
    cardIconClass: 'bg-blue-500/20 border-blue-400/30 text-blue-300',
    cardSubtitleColor: 'text-amber-300 font-medium',
  },
  heroSlider: {
    overlayStyle: {
      backgroundImage: 'linear-gradient(to right, rgba(2,6,23,0.85) 0%, rgba(2,6,23,0.45) 50%, rgba(15,23,42,0.15) 100%)',
    },
    badgeClass: 'bg-amber-400/20 border-amber-400/40 text-amber-300',
    badgeIconClass: 'text-amber-300',
    headlineClass: 'font-sans font-black uppercase tracking-tight text-white',
    primaryBtnClass: 'bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold shadow-amber-400/25',
    dotActiveClass: 'w-8 bg-amber-400',
    rightCardBorder: 'bg-slate-900/80 border-white/20 text-white',
  },
  departments: {
    sectionHeaderBadge: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-900/50',
    headingFont: 'font-sans font-bold',
    cardBorder: 'border-slate-200 dark:border-slate-800',
    cardBg: 'bg-white dark:bg-slate-900',
    cardHover: 'hover:border-blue-500/40 hover:shadow-xl hover:shadow-blue-500/5',
    iconBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    accentText: 'text-blue-600 dark:text-blue-400',
    tagBadge: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300',
  },
  courses: {
    headingFont: 'font-sans font-bold',
    cardBorder: 'border-slate-200 dark:border-slate-800',
    badge: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300',
    accentText: 'text-blue-600 dark:text-blue-400',
    primaryBtn: 'bg-blue-600 hover:bg-blue-700 text-white font-bold',
    iconColor: 'text-blue-500',
  },
  cards: {
    headingFont: 'font-sans font-bold',
    cardBorder: 'border-slate-200 dark:border-slate-800',
    cardBg: 'bg-white dark:bg-slate-900',
    badge: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300',
  },
};

const ARTS_SCIENCE_THEME: ModuleThemeStyles = {
  hero: {
    overlayGradient: {
      backgroundImage: 'linear-gradient(to right, rgba(2,6,23,0.85) 0%, rgba(2,6,23,0.50) 50%, rgba(6,78,59,0.15) 100%)',
    },
    vignetteStyle: {
      backgroundImage: 'linear-gradient(to top, rgba(2,6,23,0.75) 0%, transparent 60%, rgba(2,6,23,0.35) 100%)',
    },
    imageOpacity: 'opacity-90 sm:opacity-95',
    badgeClass: 'bg-emerald-900/60 text-emerald-300 border-emerald-500/40 font-serif',
    badgeIconClass: 'text-emerald-300',
    headingClass: 'font-serif font-bold tracking-tight text-emerald-50',
    descriptionClass: 'font-serif text-slate-200',
    primaryBtnClass: 'bg-emerald-600 hover:bg-emerald-500 text-white font-serif shadow-emerald-900/40',
    secondaryBtnClass: 'bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/30 text-emerald-200 font-serif',
    checkColor: 'text-emerald-400',
    rightCardBorder: 'border-emerald-500/30 bg-slate-950/80 text-emerald-100',
    cardIconClass: 'bg-emerald-500/20 border-emerald-400/30 text-emerald-300',
    cardSubtitleColor: 'text-emerald-300 font-serif italic',
  },
  heroSlider: {
    overlayStyle: {
      backgroundImage: 'linear-gradient(to right, rgba(2,6,23,0.85) 0%, rgba(2,6,23,0.50) 50%, rgba(6,78,59,0.15) 100%)',
    },
    badgeClass: 'bg-emerald-900/60 border-emerald-500/40 text-emerald-300',
    badgeIconClass: 'text-emerald-300',
    headlineClass: 'font-serif font-bold tracking-tight text-emerald-50',
    primaryBtnClass: 'bg-emerald-600 hover:bg-emerald-500 text-white font-serif shadow-emerald-900/40',
    dotActiveClass: 'w-8 bg-emerald-400',
    rightCardBorder: 'bg-slate-950/80 border-emerald-500/30 text-emerald-100',
  },
  departments: {
    sectionHeaderBadge: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/50 font-serif',
    headingFont: 'font-serif font-bold',
    cardBorder: 'border-emerald-100 dark:border-emerald-900/50',
    cardBg: 'bg-emerald-50/20 dark:bg-slate-900',
    cardHover: 'hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-500/5',
    iconBg: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    accentText: 'text-emerald-700 dark:text-emerald-300 font-serif',
    tagBadge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 font-serif',
  },
  courses: {
    headingFont: 'font-serif font-bold',
    cardBorder: 'border-emerald-100 dark:border-emerald-900/50',
    badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 font-serif',
    accentText: 'text-emerald-700 dark:text-emerald-300 font-serif',
    primaryBtn: 'bg-emerald-700 hover:bg-emerald-600 text-white font-serif',
    iconColor: 'text-emerald-600',
  },
  cards: {
    headingFont: 'font-serif font-bold',
    cardBorder: 'border-emerald-100 dark:border-emerald-900/50',
    cardBg: 'bg-emerald-50/20 dark:bg-slate-900',
    badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 font-serif',
  },
};

const MEDICAL_THEME: ModuleThemeStyles = {
  hero: {
    overlayGradient: {
      backgroundImage: 'linear-gradient(to right, rgba(2,6,23,0.85) 0%, rgba(2,6,23,0.50) 50%, rgba(8,51,68,0.15) 100%)',
    },
    vignetteStyle: {
      backgroundImage: 'linear-gradient(to top, rgba(2,6,23,0.75) 0%, transparent 60%, rgba(2,6,23,0.35) 100%)',
    },
    imageOpacity: 'opacity-90 sm:opacity-95',
    badgeClass: 'bg-cyan-500/20 text-cyan-200 border-cyan-400/40 font-sans',
    badgeIconClass: 'text-cyan-300',
    headingClass: 'font-sans font-extrabold tracking-tight text-white',
    descriptionClass: 'font-sans text-slate-200',
    primaryBtnClass: 'bg-cyan-600 hover:bg-cyan-500 text-white font-bold shadow-cyan-900/40',
    secondaryBtnClass: 'bg-rose-600 hover:bg-rose-500 border border-rose-500/40 text-white font-bold shadow-xl',
    checkColor: 'text-cyan-400',
    rightCardBorder: 'border-cyan-500/30 bg-slate-950/80 text-cyan-100',
    cardIconClass: 'bg-cyan-500/20 border-cyan-400/30 text-cyan-300',
    cardSubtitleColor: 'text-cyan-300 font-medium',
  },
  heroSlider: {
    overlayStyle: {
      backgroundImage: 'linear-gradient(to right, rgba(2,6,23,0.85) 0%, rgba(2,6,23,0.50) 50%, rgba(8,51,68,0.15) 100%)',
    },
    badgeClass: 'bg-cyan-500/20 border-cyan-400/40 text-cyan-200',
    badgeIconClass: 'text-cyan-300',
    headlineClass: 'font-sans font-extrabold tracking-tight text-white',
    primaryBtnClass: 'bg-cyan-600 hover:bg-cyan-500 text-white font-bold shadow-cyan-900/40',
    dotActiveClass: 'w-8 bg-cyan-400',
    rightCardBorder: 'bg-slate-950/80 border-cyan-500/30 text-cyan-100',
  },
  departments: {
    sectionHeaderBadge: 'bg-cyan-50 text-cyan-800 dark:bg-cyan-950/60 dark:text-cyan-300 border-cyan-200 dark:border-cyan-900/50',
    headingFont: 'font-sans font-extrabold',
    cardBorder: 'border-cyan-100 dark:border-cyan-900/50',
    cardBg: 'bg-cyan-50/20 dark:bg-slate-900',
    cardHover: 'hover:border-cyan-500/40 hover:shadow-xl hover:shadow-cyan-500/5',
    iconBg: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300',
    accentText: 'text-cyan-700 dark:text-cyan-300',
    tagBadge: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950/60 dark:text-cyan-300',
  },
  courses: {
    headingFont: 'font-sans font-extrabold',
    cardBorder: 'border-cyan-100 dark:border-cyan-900/50',
    badge: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950/60 dark:text-cyan-300',
    accentText: 'text-cyan-700 dark:text-cyan-300',
    primaryBtn: 'bg-cyan-600 hover:bg-cyan-500 text-white font-bold',
    iconColor: 'text-cyan-500',
  },
  cards: {
    headingFont: 'font-sans font-extrabold',
    cardBorder: 'border-cyan-100 dark:border-cyan-900/50',
    cardBg: 'bg-cyan-50/20 dark:bg-slate-900',
    badge: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950/60 dark:text-cyan-300',
  },
};

const UNIVERSITY_THEME: ModuleThemeStyles = {
  hero: {
    overlayGradient: {
      backgroundImage: 'linear-gradient(to right, rgba(2,6,23,0.88) 0%, rgba(15,23,42,0.55) 50%, rgba(136,19,55,0.2) 100%)',
    },
    vignetteStyle: {
      backgroundImage: 'linear-gradient(to top, rgba(2,6,23,0.75) 0%, transparent 60%, rgba(2,6,23,0.35) 100%)',
    },
    imageOpacity: 'opacity-90 sm:opacity-95',
    badgeClass: 'bg-rose-900/50 text-amber-300 border-amber-400/50 font-serif',
    badgeIconClass: 'text-amber-400',
    headingClass: 'font-serif font-bold tracking-normal text-amber-100',
    descriptionClass: 'font-serif text-slate-200',
    primaryBtnClass: 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold shadow-amber-900/50 font-serif',
    secondaryBtnClass: 'bg-rose-900/40 hover:bg-rose-900/60 border border-amber-400/30 text-amber-200 font-serif',
    checkColor: 'text-amber-400',
    rightCardBorder: 'border-amber-500/40 bg-slate-950/90 text-amber-100 shadow-rose-950/40',
    cardIconClass: 'bg-rose-800/40 border-amber-400/40 text-amber-300',
    cardSubtitleColor: 'text-amber-300 font-serif italic',
  },
  heroSlider: {
    overlayStyle: {
      backgroundImage: 'linear-gradient(to right, rgba(2,6,23,0.88) 0%, rgba(15,23,42,0.55) 50%, rgba(136,19,55,0.2) 100%)',
    },
    badgeClass: 'bg-rose-900/50 border-amber-400/50 text-amber-300',
    badgeIconClass: 'text-amber-400',
    headlineClass: 'font-serif font-bold tracking-normal text-amber-100',
    primaryBtnClass: 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold shadow-amber-900/50 font-serif',
    dotActiveClass: 'w-8 bg-amber-400',
    rightCardBorder: 'bg-slate-950/90 border-amber-500/40 text-amber-100',
  },
  departments: {
    sectionHeaderBadge: 'bg-rose-50 text-rose-900 dark:bg-rose-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-900/50 font-serif',
    headingFont: 'font-serif font-bold',
    cardBorder: 'border-rose-100 dark:border-rose-950/50',
    cardBg: 'bg-rose-50/20 dark:bg-slate-900',
    cardHover: 'hover:border-amber-500/40 hover:shadow-xl hover:shadow-rose-950/10',
    iconBg: 'bg-rose-900/10 text-rose-800 dark:text-amber-300',
    accentText: 'text-rose-900 dark:text-amber-300 font-serif',
    tagBadge: 'bg-rose-100 text-rose-900 dark:bg-rose-950/60 dark:text-amber-300 font-serif',
  },
  courses: {
    headingFont: 'font-serif font-bold',
    cardBorder: 'border-rose-100 dark:border-rose-950/50',
    badge: 'bg-rose-100 text-rose-900 dark:bg-rose-950/60 dark:text-amber-300 font-serif',
    accentText: 'text-rose-900 dark:text-amber-300 font-serif',
    primaryBtn: 'bg-rose-800 hover:bg-rose-700 text-amber-100 font-serif',
    iconColor: 'text-rose-700 dark:text-amber-400',
  },
  cards: {
    headingFont: 'font-serif font-bold',
    cardBorder: 'border-rose-100 dark:border-rose-950/50',
    cardBg: 'bg-rose-50/20 dark:bg-slate-900',
    badge: 'bg-rose-100 text-rose-900 dark:bg-rose-950/60 dark:text-amber-300 font-serif',
  },
};

export const getTemplateModuleStyles = (code: TemplateCode): ModuleThemeStyles => {
  switch (code) {
    case 'ARTS_SCIENCE_MODERN':
      return ARTS_SCIENCE_THEME;
    case 'MEDICAL_MODERN':
      return MEDICAL_THEME;
    case 'UNIVERSITY_MODERN':
      return UNIVERSITY_THEME;
    case 'ENGINEERING_MODERN':
    default:
      return ENGINEERING_THEME;
  }
};
