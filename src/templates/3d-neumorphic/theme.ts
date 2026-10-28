import { ModuleThemeStyles } from '../contracts/ThemeStyles';

export const THEME_3D_NEUMORPHIC: ModuleThemeStyles = {
  // Hero Section
  hero: {
    overlayGradient: {
      backgroundImage: 'linear-gradient(135deg, rgba(226,232,240,0.95) 0%, rgba(241,245,249,0.85) 50%, rgba(20,184,166,0.2) 100%)',
    },
    vignetteStyle: {
      background: 'radial-gradient(circle at center, transparent 0%, rgba(203,213,225,0.7) 100%)',
    },
    imageOpacity: 'opacity-85',
    badgeClass: 'bg-slate-200 text-teal-800 font-sans shadow-[inset_2px_2px_4px_#cbd5e1,inset_-2px_-2px_4px_#ffffff]',
    badgeIconClass: 'text-teal-600',
    headingClass: 'font-sans font-black tracking-tight text-slate-900 drop-shadow-[0_2px_4px_rgba(255,255,255,0.8)]',
    descriptionClass: 'font-sans text-slate-600',
    primaryBtnClass: 'bg-slate-200 hover:bg-slate-100 text-teal-900 font-black uppercase tracking-wide shadow-[6px_6px_12px_#cbd5e1,-6px_-6px_12px_#ffffff] active:shadow-[inset_3px_3px_6px_#cbd5e1,inset_-3px_-3px_6px_#ffffff] transition-all rounded-2xl',
    secondaryBtnClass: 'bg-slate-200 hover:bg-slate-100 text-slate-800 font-bold shadow-[4px_4px_8px_#cbd5e1,-4px_-4px_8px_#ffffff] transition-all rounded-2xl',
    checkColor: 'text-teal-600',
    rightCardBorder: 'border-0 bg-slate-200 text-slate-900 shadow-[10px_10px_20px_#cbd5e1,-10px_-10px_20px_#ffffff] rounded-3xl',
    cardIconClass: 'bg-slate-200 text-teal-700 shadow-[inset_3px_3px_6px_#cbd5e1,inset_-3px_-3px_6px_#ffffff]',
    cardSubtitleColor: 'text-teal-700 font-mono',
  },

  // Hero Slider
  heroSlider: {
    overlayStyle: {
      backgroundImage: 'linear-gradient(135deg, rgba(226,232,240,0.95) 0%, rgba(241,245,249,0.85) 50%, rgba(20,184,166,0.2) 100%)',
    },
    badgeClass: 'bg-slate-200 text-teal-800 font-sans shadow-[inset_2px_2px_4px_#cbd5e1,inset_-2px_-2px_4px_#ffffff]',
    badgeIconClass: 'text-teal-600',
    headlineClass: 'font-sans font-black tracking-tight text-slate-900',
    primaryBtnClass: 'bg-slate-200 hover:bg-slate-100 text-teal-900 font-black shadow-[6px_6px_12px_#cbd5e1,-6px_-6px_12px_#ffffff] active:shadow-[inset_3px_3px_6px_#cbd5e1,inset_-3px_-3px_6px_#ffffff] transition-all rounded-2xl',
    dotActiveClass: 'w-8 bg-teal-600 shadow-[inset_1px_1px_3px_#0f766e]',
    rightCardBorder: 'bg-slate-200 text-slate-900 shadow-[10px_10px_20px_#cbd5e1,-10px_-10px_20px_#ffffff] rounded-3xl',
    defaultBgImage: '',
  },

  // Statistics Section (Neumorphic Soft Spheres)
  statistics: {
    sectionBg: 'bg-slate-200 text-slate-900 border-y border-slate-300 relative',
    bgPatternOverlay: {
      backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)',
      backgroundSize: '24px 24px',
      opacity: 0.3,
    },
    headerAlignment: 'text-center max-w-2xl mx-auto',
    headerBadge: 'bg-slate-200 text-teal-800 font-mono font-bold uppercase rounded-full shadow-[inset_3px_3px_6px_#cbd5e1,inset_-3px_-3px_6px_#ffffff]',
    headerTitleFont: 'font-sans font-black text-slate-900',
    headerSubtitleFont: 'font-sans text-slate-600',
    cardContainer: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6',
    cardBg: 'bg-slate-200 p-6 rounded-3xl shadow-[8px_8px_16px_#cbd5e1,-8px_-8px_16px_#ffffff] hover:shadow-[12px_12px_24px_#cbd5e1,-12px_-12px_24px_#ffffff] hover:-translate-y-1 transition-all duration-300 text-slate-900 relative',
    cardTopAccent: 'h-1.5 bg-gradient-to-r from-teal-500 to-slate-400 w-full rounded-t-3xl',
    iconBox: 'w-12 h-12 rounded-2xl bg-slate-200 text-teal-700 flex items-center justify-center mb-3 shadow-[inset_3px_3px_6px_#cbd5e1,inset_-3px_-3px_6px_#ffffff]',
    valueFont: 'font-sans font-black text-slate-900 text-3xl tracking-tight leading-none',
    suffixFont: 'font-sans text-teal-600 font-black',
    labelFont: 'font-sans text-xs font-bold text-slate-600 uppercase tracking-wider mt-1',
    tagBadge: 'text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-slate-200 text-teal-800 shadow-[inset_2px_2px_4px_#cbd5e1,inset_-2px_-2px_4px_#ffffff]',
  },

  // Quote / Leadership Section
  quote: {
    sectionBg: 'bg-slate-200',
    isCentered: false,
    layoutContainer: 'max-w-7xl mx-auto px-6 py-16',
    photoContainer: 'relative max-w-md mx-auto',
    photoFrame: 'relative z-10 bg-slate-200 p-3 rounded-3xl shadow-[10px_10px_20px_#cbd5e1,-10px_-10px_20px_#ffffff]',
    quoteBox: 'relative z-10 bg-slate-200 p-8 rounded-3xl shadow-[10px_10px_20px_#cbd5e1,-10px_-10px_20px_#ffffff]',
    quoteTextFont: 'font-sans text-base text-slate-700 leading-relaxed italic',
    authorNameFont: 'font-sans font-black text-2xl text-slate-900',
    authorTitleFont: 'font-sans font-bold text-xs uppercase tracking-wider text-teal-700',
    subTextFont: 'font-sans text-xs text-slate-500',
    badgeClass: 'bg-slate-200 text-teal-800 font-mono text-xs font-bold uppercase rounded-full px-3 py-1 shadow-[inset_2px_2px_4px_#cbd5e1,inset_-2px_-2px_4px_#ffffff]',
    iconColor: 'text-teal-600',
    cardBg: 'bg-slate-200',
    cardBorder: 'border-0',
    cardTopAccent: 'bg-teal-500',
  },

  // Departments Section
  departments: {
    sectionBg: 'bg-slate-200 text-slate-900',
    sectionHeaderBadge: 'bg-slate-200 text-teal-800 rounded-full shadow-[inset_3px_3px_6px_#cbd5e1,inset_-3px_-3px_6px_#ffffff]',
    headingFont: 'font-sans font-black text-slate-900 text-3xl sm:text-4xl',
    subtitleFont: 'font-sans text-slate-600',
    cardBorder: 'border-0',
    cardBg: 'bg-slate-200 rounded-3xl shadow-[8px_8px_16px_#cbd5e1,-8px_-8px_16px_#ffffff] hover:shadow-[12px_12px_24px_#cbd5e1,-12px_-12px_24px_#ffffff]',
    cardHover: 'hover:-translate-y-2 transition-all',
    iconBg: 'bg-slate-200 text-teal-700 rounded-2xl shadow-[inset_3px_3px_6px_#cbd5e1,inset_-3px_-3px_6px_#ffffff]',
    accentText: 'text-teal-800 font-bold',
    tagBadge: 'bg-slate-200 text-teal-800 shadow-[inset_2px_2px_4px_#cbd5e1,inset_-2px_-2px_4px_#ffffff] font-mono text-xs rounded-full',
    cardTopAccent: 'h-1.5 bg-gradient-to-r from-teal-500 to-slate-400 rounded-t-3xl',
  },

  // Courses Section
  courses: {
    sectionBg: 'bg-slate-200',
    sectionHeaderBadge: 'bg-slate-200 text-teal-800 rounded-full shadow-[inset_3px_3px_6px_#cbd5e1,inset_-3px_-3px_6px_#ffffff]',
    headingFont: 'font-sans font-black text-slate-900 text-3xl sm:text-4xl',
    subtitleFont: 'font-sans text-slate-600',
    cardBorder: 'border-0',
    cardBg: 'bg-slate-200 rounded-3xl shadow-[8px_8px_16px_#cbd5e1,-8px_-8px_16px_#ffffff] hover:shadow-[12px_12px_24px_#cbd5e1,-12px_-12px_24px_#ffffff] hover:-translate-y-1.5 transition-all',
    badge: 'bg-slate-200 text-teal-800 text-xs font-bold rounded-full shadow-[inset_2px_2px_4px_#cbd5e1,inset_-2px_-2px_4px_#ffffff]',
    accentText: 'text-teal-800 font-extrabold',
    primaryBtn: 'bg-slate-200 hover:bg-slate-100 text-teal-900 font-black shadow-[4px_4px_8px_#cbd5e1,-4px_-4px_8px_#ffffff] active:shadow-[inset_2px_2px_4px_#cbd5e1,inset_-2px_-2px_4px_#ffffff] rounded-2xl',
    iconColor: 'text-teal-600',
  },

  // Faculty Section
  faculty: {
    layoutVariant: 'grid',
    sectionBg: 'bg-slate-200',
    sectionHeaderBadge: 'bg-slate-200 text-teal-800 rounded-full shadow-[inset_3px_3px_6px_#cbd5e1,inset_-3px_-3px_6px_#ffffff]',
    headingFont: 'font-sans font-black text-slate-900 text-3xl sm:text-4xl',
    subtitleFont: 'font-sans text-slate-600',
    cardBg: 'bg-slate-200 rounded-3xl shadow-[8px_8px_16px_#cbd5e1,-8px_-8px_16px_#ffffff] hover:shadow-[12px_12px_24px_#cbd5e1,-12px_-12px_24px_#ffffff]',
    cardBorder: 'border-0',
    cardHover: 'hover:-translate-y-2 transition-all',
    avatarBorder: 'border-4 border-slate-200 shadow-[inset_2px_2px_4px_#cbd5e1,inset_-2px_-2px_4px_#ffffff]',
    roleFont: 'font-sans font-bold text-xs uppercase tracking-wider text-teal-700',
    accentText: 'text-slate-800',
    cardTopAccent: 'h-2 w-full bg-gradient-to-r from-teal-500 to-slate-400 rounded-t-3xl',
    primaryBtn: 'bg-slate-200 hover:bg-slate-100 text-teal-900 font-bold shadow-[4px_4px_8px_#cbd5e1,-4px_-4px_8px_#ffffff] rounded-2xl',
    defaultBadgeText: 'Distinguished Faculty',
    defaultTitle: 'World-Class Faculty & Academic Mentors',
  },

  // Events Section
  events: {
    layoutVariant: 'cards',
    sectionBg: 'bg-slate-200',
    sectionHeaderBadge: 'bg-slate-200 text-teal-800 rounded-full shadow-[inset_3px_3px_6px_#cbd5e1,inset_-3px_-3px_6px_#ffffff]',
    headingFont: 'font-sans font-black text-slate-900 text-3xl sm:text-4xl',
    subtitleFont: 'font-sans text-slate-600',
    cardBg: 'bg-slate-200 rounded-3xl shadow-[8px_8px_16px_#cbd5e1,-8px_-8px_16px_#ffffff] hover:shadow-[12px_12px_24px_#cbd5e1,-12px_-12px_24px_#ffffff] transition-all',
    cardBorder: 'border-0',
    cardHover: 'hover:-translate-y-2',
    dateBadge: 'bg-slate-200 text-teal-900 font-mono font-black rounded-2xl px-3 py-1.5 shadow-[inset_3px_3px_6px_#cbd5e1,inset_-3px_-3px_6px_#ffffff]',
    accentText: 'text-slate-800',
    defaultBadgeText: 'Academic Calendar & Summits',
    defaultTitle: 'Upcoming Events & Conferences',
  },

  // News Section
  news: {
    layoutVariant: 'cards',
    sectionBg: 'bg-slate-200',
    sectionHeaderBadge: 'bg-slate-200 text-teal-800 rounded-full shadow-[inset_3px_3px_6px_#cbd5e1,inset_-3px_-3px_6px_#ffffff]',
    headingFont: 'font-sans font-black text-slate-900 text-3xl sm:text-4xl',
    subtitleFont: 'font-sans text-slate-600',
    cardBg: 'bg-slate-200 rounded-3xl shadow-[8px_8px_16px_#cbd5e1,-8px_-8px_16px_#ffffff] hover:shadow-[12px_12px_24px_#cbd5e1,-12px_-12px_24px_#ffffff] transition-all',
    cardBorder: 'border-0',
    cardHover: 'hover:-translate-y-2',
    datePill: 'text-xs text-teal-700 font-semibold italic',
    tagBadge: 'bg-slate-200 text-teal-800 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-[inset_2px_2px_4px_#cbd5e1,inset_-2px_-2px_4px_#ffffff]',
    accentText: 'text-slate-800',
    defaultBadgeText: 'Campus Bulletin & Press',
    defaultTitle: 'Campus News & Press Releases',
  },

  // Notices Section
  notices: {
    sectionBg: 'bg-slate-200',
    sectionHeaderBadge: 'bg-slate-200 text-teal-800 rounded-full shadow-[inset_3px_3px_6px_#cbd5e1,inset_-3px_-3px_6px_#ffffff]',
    headingFont: 'font-sans font-black text-slate-900 text-3xl sm:text-4xl',
    subtitleFont: 'font-sans text-slate-600',
    cardBg: 'bg-slate-200 rounded-3xl shadow-[8px_8px_16px_#cbd5e1,-8px_-8px_16px_#ffffff]',
    cardBorder: 'border-0',
    noticeItemBg: 'hover:bg-slate-100 transition-colors',
    noticeItemBorder: 'border-b border-slate-300',
    dateBadge: 'bg-slate-200 text-teal-800 font-mono font-bold text-xs rounded-full px-2 py-0.5 shadow-[inset_2px_2px_4px_#cbd5e1,inset_-2px_-2px_4px_#ffffff]',
    accentText: 'text-slate-800',
  },

  // Gallery Section
  gallery: {
    sectionBg: 'bg-slate-200',
    sectionHeaderBadge: 'bg-slate-200 text-teal-800 rounded-full shadow-[inset_3px_3px_6px_#cbd5e1,inset_-3px_-3px_6px_#ffffff]',
    headingFont: 'font-sans font-black text-slate-900 text-3xl sm:text-4xl',
    subtitleFont: 'font-sans text-slate-600',
    tabActive: 'bg-slate-200 text-teal-900 font-bold rounded-2xl shadow-[inset_3px_3px_6px_#cbd5e1,inset_-3px_-3px_6px_#ffffff]',
    tabInactive: 'bg-slate-200 text-slate-700 font-semibold rounded-2xl shadow-[4px_4px_8px_#cbd5e1,-4px_-4px_8px_#ffffff]',
    imageBorder: 'border-4 border-slate-200 rounded-3xl shadow-[8px_8px_16px_#cbd5e1,-8px_-8px_16px_#ffffff] hover:shadow-[12px_12px_24px_#cbd5e1,-12px_-12px_24px_#ffffff] transition-all',
    overlayGradient: 'from-slate-900/90 via-slate-900/30 to-transparent',
    accentText: 'text-teal-600',
  },

  // FAQ Section
  faq: {
    sectionBg: 'bg-slate-200',
    sectionHeaderBadge: 'bg-slate-200 text-teal-800 rounded-full shadow-[inset_3px_3px_6px_#cbd5e1,inset_-3px_-3px_6px_#ffffff]',
    headingFont: 'font-sans font-black text-slate-900 text-3xl sm:text-4xl',
    subtitleFont: 'font-sans text-slate-600',
    itemBg: 'bg-slate-200 rounded-3xl shadow-[6px_6px_12px_#cbd5e1,-6px_-6px_12px_#ffffff]',
    itemBorder: 'border-0',
    itemHover: 'hover:shadow-[8px_8px_16px_#cbd5e1,-8px_-8px_16px_#ffffff]',
    questionFont: 'font-sans font-black text-slate-900',
    answerFont: 'font-sans text-slate-700 leading-relaxed font-medium',
    accentColor: 'text-teal-600',
  },

  // Contact Section
  contact: {
    sectionBg: 'bg-slate-200',
    sectionHeaderBadge: 'bg-slate-200 text-teal-800 rounded-full shadow-[inset_3px_3px_6px_#cbd5e1,inset_-3px_-3px_6px_#ffffff]',
    headingFont: 'font-sans font-black text-slate-900 text-3xl sm:text-4xl',
    subtitleFont: 'font-sans text-slate-600',
    cardBg: 'bg-slate-200 rounded-3xl shadow-[10px_10px_20px_#cbd5e1,-10px_-10px_20px_#ffffff]',
    cardBorder: 'border-0',
    inputBg: 'bg-slate-200 shadow-[inset_3px_3px_6px_#cbd5e1,inset_-3px_-3px_6px_#ffffff] text-slate-900 rounded-2xl',
    inputBorder: 'border-0',
    submitBtn: 'bg-slate-200 hover:bg-slate-100 text-teal-900 font-black uppercase rounded-2xl shadow-[6px_6px_12px_#cbd5e1,-6px_-6px_12px_#ffffff] active:shadow-[inset_3px_3px_6px_#cbd5e1,inset_-3px_-3px_6px_#ffffff]',
    infoIconBg: 'bg-slate-200 text-teal-700 rounded-2xl shadow-[inset_3px_3px_6px_#cbd5e1,inset_-3px_-3px_6px_#ffffff]',
    accentText: 'text-teal-800',
  },

  // Call to Action (CTA) Section
  cta: {
    sectionBg: 'bg-slate-200 border-t border-slate-300 text-slate-900 relative overflow-hidden',
    badgeClass: 'bg-slate-200 text-teal-800 rounded-full shadow-[inset_2px_2px_4px_#cbd5e1,inset_-2px_-2px_4px_#ffffff]',
    headlineFont: 'font-sans font-black text-3xl sm:text-4xl lg:text-5xl tracking-tight text-slate-900',
    subheadlineFont: 'font-sans text-slate-600 text-base max-w-2xl mx-auto font-medium',
    primaryBtnClass: 'bg-slate-200 hover:bg-slate-100 text-teal-900 font-black uppercase rounded-2xl shadow-[8px_8px_16px_#cbd5e1,-8px_-8px_16px_#ffffff] active:shadow-[inset_3px_3px_6px_#cbd5e1,inset_-3px_-3px_6px_#ffffff]',
    secondaryBtnClass: 'bg-slate-200 hover:bg-slate-100 text-slate-800 font-bold rounded-2xl shadow-[4px_4px_8px_#cbd5e1,-4px_-4px_8px_#ffffff]',
  },

  // Cards Section
  cards: {
    headingFont: 'font-sans font-black text-slate-900',
    cardBorder: 'border-0',
    cardBg: 'bg-slate-200 rounded-3xl shadow-[6px_6px_12px_#cbd5e1,-6px_-6px_12px_#ffffff] hover:shadow-[10px_10px_20px_#cbd5e1,-10px_-10px_20px_#ffffff]',
    badge: 'bg-slate-200 text-teal-800 rounded-full shadow-[inset_2px_2px_4px_#cbd5e1,inset_-2px_-2px_4px_#ffffff]',
  },

  // Icon Cards Section
  iconCards: {
    sectionBg: 'bg-slate-200',
    sectionHeaderBadge: 'bg-slate-200 text-teal-800 rounded-full shadow-[inset_3px_3px_6px_#cbd5e1,inset_-3px_-3px_6px_#ffffff]',
    headingFont: 'font-sans font-black text-slate-900',
    subtitleFont: 'font-sans text-slate-600',
    cardBg: 'bg-slate-200 rounded-3xl shadow-[6px_6px_12px_#cbd5e1,-6px_-6px_12px_#ffffff]',
    cardBorder: 'border-0',
    iconBox: 'w-12 h-12 bg-slate-200 text-teal-700 rounded-2xl flex items-center justify-center shadow-[inset_3px_3px_6px_#cbd5e1,inset_-3px_-3px_6px_#ffffff]',
  },

  // Image & Text Section
  imageText: {
    sectionBg: 'bg-slate-200',
    badgeClass: 'bg-slate-200 text-teal-800 rounded-full shadow-[inset_2px_2px_4px_#cbd5e1,inset_-2px_-2px_4px_#ffffff]',
    headingFont: 'font-sans font-black text-slate-900 text-3xl sm:text-4xl',
    bodyFont: 'font-sans text-slate-600 leading-relaxed',
    primaryBtnClass: 'bg-slate-200 hover:bg-slate-100 text-teal-900 font-black shadow-[6px_6px_12px_#cbd5e1,-6px_-6px_12px_#ffffff] rounded-2xl',
    secondaryBtnClass: 'bg-slate-200 hover:bg-slate-100 text-slate-800 font-bold shadow-[4px_4px_8px_#cbd5e1,-4px_-4px_8px_#ffffff] rounded-2xl',
    imageBorder: 'border-4 border-slate-200 rounded-3xl shadow-[10px_10px_20px_#cbd5e1,-10px_-10px_20px_#ffffff]',
  },

  // Logo Grid Section
  logoGrid: {
    sectionBg: 'bg-slate-200',
    headingFont: 'font-sans font-black text-slate-900',
    subtitleFont: 'font-sans text-slate-600',
    cardBg: 'bg-slate-200 rounded-2xl shadow-[4px_4px_8px_#cbd5e1,-4px_-4px_8px_#ffffff]',
    cardBorder: 'border-0',
  },
};
