import { ModuleThemeStyles } from '../contracts/ThemeStyles';

export const THEME_3D_ISOMETRIC: ModuleThemeStyles = {
  // Hero Section
  hero: {
    overlayGradient: {
      backgroundImage: 'linear-gradient(135deg, rgba(15,23,42,0.92) 0%, rgba(30,41,59,0.85) 60%, rgba(245,158,11,0.18) 100%)',
    },
    vignetteStyle: {
      background: 'linear-gradient(to top, rgba(15, 23, 42, 0.95) 0%, transparent 60%, rgba(15, 23, 42, 0.4) 100%)',
    },
    imageOpacity: 'opacity-90',
    badgeClass: 'bg-amber-400 border-2 border-slate-900 text-slate-950 font-black shadow-[3px_3px_0px_0px_#0f172a] rounded-lg',
    badgeIconClass: 'text-slate-950',
    headingClass: 'font-sans font-black tracking-tight text-white drop-shadow-[0_4px_6px_rgba(0,0,0,0.6)]',
    descriptionClass: 'font-sans text-slate-200',
    primaryBtnClass: 'bg-amber-400 hover:bg-amber-300 text-slate-950 font-black uppercase tracking-wide border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all rounded-xl',
    secondaryBtnClass: 'bg-slate-800 hover:bg-slate-700 text-white font-bold border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] rounded-xl transition-all',
    checkColor: 'text-amber-400',
    rightCardBorder: 'border-2 border-slate-900 bg-white text-slate-900 shadow-[6px_6px_0px_0px_#0f172a] rounded-2xl',
    cardIconClass: 'bg-amber-400 border-2 border-slate-900 text-slate-950 shadow-[2px_2px_0px_0px_#0f172a]',
    cardSubtitleColor: 'text-amber-700 font-mono',
  },

  // Hero Slider
  heroSlider: {
    overlayStyle: {
      backgroundImage: 'linear-gradient(135deg, rgba(15,23,42,0.92) 0%, rgba(30,41,59,0.85) 60%, rgba(245,158,11,0.18) 100%)',
    },
    badgeClass: 'bg-amber-400 border-2 border-slate-900 text-slate-950 font-black shadow-[3px_3px_0px_0px_#0f172a] rounded-lg',
    badgeIconClass: 'text-slate-950',
    headlineClass: 'font-sans font-black tracking-tight text-white',
    primaryBtnClass: 'bg-amber-400 hover:bg-amber-300 text-slate-950 font-black border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] rounded-xl',
    dotActiveClass: 'w-8 bg-amber-400 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] rounded-md',
    rightCardBorder: 'bg-white border-2 border-slate-900 text-slate-900 shadow-[6px_6px_0px_0px_#0f172a] rounded-2xl',
    defaultBgImage: '',
  },

  // Statistics Section (Isometric Chunky Elevation)
  statistics: {
    sectionBg: 'bg-amber-50/50 text-slate-900 border-y-2 border-slate-900 relative',
    bgPatternOverlay: {
      backgroundImage: 'radial-gradient(#cbd5e1 1.5px, transparent 1.5px)',
      backgroundSize: '20px 20px',
      opacity: 0.6,
    },
    headerAlignment: 'text-center max-w-2xl mx-auto',
    headerBadge: 'bg-amber-400 border-2 border-slate-900 text-slate-950 font-black shadow-[2px_2px_0px_0px_#0f172a] rounded-lg',
    headerTitleFont: 'font-sans font-black text-slate-900',
    headerSubtitleFont: 'font-sans text-slate-600',
    cardContainer: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6',
    cardBg: 'bg-white border-2 border-slate-900 p-6 rounded-2xl shadow-[5px_5px_0px_0px_#0f172a] hover:shadow-[8px_8px_0px_0px_#0f172a] hover:-translate-y-1 transition-all duration-200 text-slate-900 relative',
    cardTopAccent: 'h-2 bg-amber-400 border-b-2 border-slate-900 w-full rounded-t-xl',
    iconBox: 'w-10 h-10 rounded-xl bg-amber-400 border-2 border-slate-900 text-slate-950 flex items-center justify-center mb-3 shadow-[2px_2px_0px_0px_#0f172a]',
    valueFont: 'font-sans font-black text-slate-900 text-3xl tracking-tight leading-none',
    suffixFont: 'font-sans text-amber-600 font-black',
    labelFont: 'font-sans text-xs font-black text-slate-700 uppercase tracking-wider mt-1',
    tagBadge: 'text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-100 text-slate-900 border border-slate-900 font-bold',
  },

  // Quote / Leadership Section
  quote: {
    sectionBg: 'bg-white',
    isCentered: false,
    layoutContainer: 'max-w-7xl mx-auto px-6 py-16',
    photoContainer: 'relative max-w-md mx-auto',
    photoFrame: 'relative z-10 border-2 border-slate-900 rounded-2xl shadow-[6px_6px_0px_0px_#0f172a] bg-amber-400 p-2',
    quoteBox: 'relative z-10 bg-slate-50 p-8 rounded-2xl border-2 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a]',
    quoteTextFont: 'font-sans text-base text-slate-800 leading-relaxed font-bold',
    authorNameFont: 'font-sans font-black text-2xl text-slate-900',
    authorTitleFont: 'font-sans font-black text-xs uppercase tracking-wider text-amber-700',
    subTextFont: 'font-sans text-xs text-slate-500',
    badgeClass: 'bg-amber-400 border-2 border-slate-900 text-slate-950 font-black text-xs uppercase rounded-lg px-3 py-1 shadow-[2px_2px_0px_0px_#0f172a]',
    iconColor: 'text-amber-500',
    cardBg: 'bg-slate-50',
    cardBorder: 'border-2 border-slate-900',
    cardTopAccent: 'bg-amber-400',
  },

  // Departments Section
  departments: {
    sectionBg: 'bg-slate-100 text-slate-900',
    sectionHeaderBadge: 'bg-amber-400 border-2 border-slate-900 text-slate-950 font-black shadow-[2px_2px_0px_0px_#0f172a] rounded-lg',
    headingFont: 'font-sans font-black text-slate-900 text-3xl sm:text-4xl',
    subtitleFont: 'font-sans text-slate-600',
    cardBorder: 'border-2 border-slate-900',
    cardBg: 'bg-white rounded-2xl shadow-[4px_4px_0px_0px_#0f172a] hover:shadow-[7px_7px_0px_0px_#0f172a]',
    cardHover: 'hover:-translate-y-1.5 transition-all duration-200',
    iconBg: 'bg-amber-400 border-2 border-slate-900 text-slate-950 rounded-xl shadow-[2px_2px_0px_0px_#0f172a]',
    accentText: 'text-slate-900 font-black',
    tagBadge: 'bg-amber-100 text-slate-900 border border-slate-900 font-mono text-xs rounded font-bold',
    cardTopAccent: 'h-1.5 bg-amber-400 border-b-2 border-slate-900',
  },

  // Courses Section
  courses: {
    sectionBg: 'bg-white',
    sectionHeaderBadge: 'bg-amber-400 border-2 border-slate-900 text-slate-950 font-black shadow-[2px_2px_0px_0px_#0f172a] rounded-lg',
    headingFont: 'font-sans font-black text-slate-900 text-3xl sm:text-4xl',
    subtitleFont: 'font-sans text-slate-600',
    cardBorder: 'border-2 border-slate-900',
    cardBg: 'bg-white rounded-2xl shadow-[4px_4px_0px_0px_#0f172a] hover:shadow-[7px_7px_0px_0px_#0f172a] hover:-translate-y-1 transition-all',
    badge: 'bg-amber-400 border-2 border-slate-900 text-slate-950 text-xs font-black rounded-lg',
    accentText: 'text-amber-700 font-black',
    primaryBtn: 'bg-amber-400 hover:bg-amber-300 text-slate-950 font-black border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 rounded-xl',
    iconColor: 'text-amber-600',
  },

  // Faculty Section
  faculty: {
    layoutVariant: 'grid',
    sectionBg: 'bg-amber-50/40',
    sectionHeaderBadge: 'bg-amber-400 border-2 border-slate-900 text-slate-950 font-black shadow-[2px_2px_0px_0px_#0f172a] rounded-lg',
    headingFont: 'font-sans font-black text-slate-900 text-3xl sm:text-4xl',
    subtitleFont: 'font-sans text-slate-600',
    cardBg: 'bg-white border-2 border-slate-900 rounded-2xl shadow-[5px_5px_0px_0px_#0f172a] hover:shadow-[8px_8px_0px_0px_#0f172a]',
    cardBorder: 'border-2 border-slate-900',
    cardHover: 'hover:-translate-y-1.5 transition-all',
    avatarBorder: 'border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]',
    roleFont: 'font-sans font-black text-xs uppercase tracking-wider text-amber-700',
    accentText: 'text-slate-900',
    cardTopAccent: 'h-2 w-full bg-amber-400 border-b-2 border-slate-900 rounded-t-xl',
    primaryBtn: 'bg-amber-400 hover:bg-amber-300 text-slate-950 font-black border-2 border-slate-900 rounded-xl shadow-[3px_3px_0px_0px_#0f172a]',
    defaultBadgeText: 'Distinguished Faculty',
    defaultTitle: 'World-Class Faculty & Academic Mentors',
  },

  // Events Section
  events: {
    layoutVariant: 'cards',
    sectionBg: 'bg-white',
    sectionHeaderBadge: 'bg-amber-400 border-2 border-slate-900 text-slate-950 font-black shadow-[2px_2px_0px_0px_#0f172a] rounded-lg',
    headingFont: 'font-sans font-black text-slate-900 text-3xl sm:text-4xl',
    subtitleFont: 'font-sans text-slate-600',
    cardBg: 'bg-white border-2 border-slate-900 rounded-2xl shadow-[5px_5px_0px_0px_#0f172a] hover:shadow-[8px_8px_0px_0px_#0f172a] transition-all',
    cardBorder: 'border-2 border-slate-900',
    cardHover: 'hover:-translate-y-1.5',
    dateBadge: 'bg-amber-400 border-2 border-slate-900 text-slate-950 font-mono font-black rounded-xl px-3 py-1.5 shadow-[2px_2px_0px_0px_#0f172a]',
    accentText: 'text-slate-900',
    defaultBadgeText: 'Academic Calendar & Summits',
    defaultTitle: 'Upcoming Events & Conferences',
  },

  // News Section
  news: {
    layoutVariant: 'cards',
    sectionBg: 'bg-slate-100',
    sectionHeaderBadge: 'bg-amber-400 border-2 border-slate-900 text-slate-950 font-black shadow-[2px_2px_0px_0px_#0f172a] rounded-lg',
    headingFont: 'font-sans font-black text-slate-900 text-3xl sm:text-4xl',
    subtitleFont: 'font-sans text-slate-600',
    cardBg: 'bg-white border-2 border-slate-900 rounded-2xl shadow-[5px_5px_0px_0px_#0f172a] hover:shadow-[8px_8px_0px_0px_#0f172a] transition-all',
    cardBorder: 'border-2 border-slate-900',
    cardHover: 'hover:-translate-y-1.5',
    datePill: 'text-xs text-amber-700 font-black',
    tagBadge: 'bg-amber-400 border border-slate-900 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded',
    accentText: 'text-slate-900',
    defaultBadgeText: 'Campus Bulletin & Press',
    defaultTitle: 'Campus News & Press Releases',
  },

  // Notices Section
  notices: {
    sectionBg: 'bg-white',
    sectionHeaderBadge: 'bg-amber-400 border-2 border-slate-900 text-slate-950 font-black shadow-[2px_2px_0px_0px_#0f172a] rounded-lg',
    headingFont: 'font-sans font-black text-slate-900 text-3xl sm:text-4xl',
    subtitleFont: 'font-sans text-slate-600',
    cardBg: 'bg-white border-2 border-slate-900 rounded-2xl shadow-[4px_4px_0px_0px_#0f172a]',
    cardBorder: 'border-2 border-slate-900',
    noticeItemBg: 'bg-slate-50 hover:bg-amber-50 transition-colors',
    noticeItemBorder: 'border-b-2 border-slate-200',
    dateBadge: 'bg-amber-400 border border-slate-900 text-slate-950 font-mono font-bold text-xs rounded px-2 py-0.5',
    accentText: 'text-slate-900',
  },

  // Gallery Section
  gallery: {
    sectionBg: 'bg-amber-50/40',
    sectionHeaderBadge: 'bg-amber-400 border-2 border-slate-900 text-slate-950 font-black shadow-[2px_2px_0px_0px_#0f172a] rounded-lg',
    headingFont: 'font-sans font-black text-slate-900 text-3xl sm:text-4xl',
    subtitleFont: 'font-sans text-slate-600',
    tabActive: 'bg-amber-400 border-2 border-slate-900 text-slate-950 font-black rounded-xl shadow-[3px_3px_0px_0px_#0f172a]',
    tabInactive: 'bg-white hover:bg-slate-100 text-slate-800 font-bold rounded-xl border-2 border-slate-900',
    imageBorder: 'border-2 border-slate-900 rounded-2xl shadow-[4px_4px_0px_0px_#0f172a] hover:shadow-[7px_7px_0px_0px_#0f172a] transition-all',
    overlayGradient: 'from-slate-950/90 via-slate-950/30 to-transparent',
    accentText: 'text-amber-500',
  },

  // FAQ Section
  faq: {
    sectionBg: 'bg-white',
    sectionHeaderBadge: 'bg-amber-400 border-2 border-slate-900 text-slate-950 font-black shadow-[2px_2px_0px_0px_#0f172a] rounded-lg',
    headingFont: 'font-sans font-black text-slate-900 text-3xl sm:text-4xl',
    subtitleFont: 'font-sans text-slate-600',
    itemBg: 'bg-slate-50 rounded-2xl shadow-[3px_3px_0px_0px_#0f172a]',
    itemBorder: 'border-2 border-slate-900',
    itemHover: 'hover:border-amber-500',
    questionFont: 'font-sans font-black text-slate-900',
    answerFont: 'font-sans text-slate-700 leading-relaxed font-medium',
    accentColor: 'text-amber-500',
  },

  // Contact Section
  contact: {
    sectionBg: 'bg-slate-100',
    sectionHeaderBadge: 'bg-amber-400 border-2 border-slate-900 text-slate-950 font-black shadow-[2px_2px_0px_0px_#0f172a] rounded-lg',
    headingFont: 'font-sans font-black text-slate-900 text-3xl sm:text-4xl',
    subtitleFont: 'font-sans text-slate-600',
    cardBg: 'bg-white border-2 border-slate-900 rounded-2xl shadow-[6px_6px_0px_0px_#0f172a]',
    cardBorder: 'border-2 border-slate-900',
    inputBg: 'bg-slate-50 border-2 border-slate-900 focus:bg-white text-slate-900 rounded-xl',
    inputBorder: 'border-2 border-slate-900',
    submitBtn: 'bg-amber-400 hover:bg-amber-300 text-slate-950 font-black uppercase rounded-xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] active:shadow-none active:translate-x-0.5 active:translate-y-0.5',
    infoIconBg: 'bg-amber-400 border-2 border-slate-900 text-slate-950 rounded-xl shadow-[2px_2px_0px_0px_#0f172a]',
    accentText: 'text-slate-900',
  },

  // Call to Action (CTA) Section
  cta: {
    sectionBg: 'bg-amber-400 border-t-2 border-slate-900 text-slate-950 relative overflow-hidden',
    badgeClass: 'bg-white border-2 border-slate-900 text-slate-950 font-black rounded-lg shadow-[2px_2px_0px_0px_#0f172a]',
    headlineFont: 'font-sans font-black text-3xl sm:text-4xl lg:text-5xl tracking-tight text-slate-950',
    subheadlineFont: 'font-sans text-slate-900 text-base max-w-2xl mx-auto font-bold',
    primaryBtnClass: 'bg-slate-950 hover:bg-slate-900 text-amber-300 font-black uppercase rounded-xl border-2 border-slate-950 shadow-[4px_4px_0px_0px_#ffffff] active:shadow-none active:translate-x-0.5 active:translate-y-0.5',
    secondaryBtnClass: 'bg-white hover:bg-slate-100 border-2 border-slate-900 text-slate-950 font-black rounded-xl shadow-[4px_4px_0px_0px_#0f172a]',
  },

  // Cards Section
  cards: {
    headingFont: 'font-sans font-black text-slate-900',
    cardBorder: 'border-2 border-slate-900',
    cardBg: 'bg-white rounded-2xl shadow-[4px_4px_0px_0px_#0f172a] hover:shadow-[7px_7px_0px_0px_#0f172a]',
    badge: 'bg-amber-400 border-2 border-slate-900 text-slate-950 rounded-lg font-black',
  },

  // Icon Cards Section
  iconCards: {
    sectionBg: 'bg-white',
    sectionHeaderBadge: 'bg-amber-400 border-2 border-slate-900 text-slate-950 font-black shadow-[2px_2px_0px_0px_#0f172a] rounded-lg',
    headingFont: 'font-sans font-black text-slate-900',
    subtitleFont: 'font-sans text-slate-600',
    cardBg: 'bg-white rounded-2xl shadow-[4px_4px_0px_0px_#0f172a]',
    cardBorder: 'border-2 border-slate-900',
    iconBox: 'w-12 h-12 bg-amber-400 border-2 border-slate-900 text-slate-950 rounded-xl flex items-center justify-center shadow-[2px_2px_0px_0px_#0f172a]',
  },

  // Image & Text Section
  imageText: {
    sectionBg: 'bg-slate-100',
    badgeClass: 'bg-amber-400 border-2 border-slate-900 text-slate-950 font-black shadow-[2px_2px_0px_0px_#0f172a] rounded-lg',
    headingFont: 'font-sans font-black text-slate-900 text-3xl sm:text-4xl',
    bodyFont: 'font-sans text-slate-700 leading-relaxed font-medium',
    primaryBtnClass: 'bg-amber-400 hover:bg-amber-300 text-slate-950 font-black border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] rounded-xl',
    secondaryBtnClass: 'bg-white hover:bg-slate-50 border-2 border-slate-900 text-slate-950 font-black rounded-xl shadow-[4px_4px_0px_0px_#0f172a]',
    imageBorder: 'border-2 border-slate-900 rounded-2xl shadow-[6px_6px_0px_0px_#0f172a]',
  },

  // Logo Grid Section
  logoGrid: {
    sectionBg: 'bg-white',
    headingFont: 'font-sans font-black text-slate-900',
    subtitleFont: 'font-sans text-slate-600',
    cardBg: 'bg-slate-50 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]',
    cardBorder: 'border-2 border-slate-900',
  },
};
