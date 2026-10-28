import { ModuleThemeStyles } from '../contracts/ThemeStyles';

export const THEME_3D_GLASS: ModuleThemeStyles = {
  // Hero Section
  hero: {
    overlayGradient: {
      backgroundImage: 'linear-gradient(135deg, rgba(8,15,30,0.92) 0%, rgba(15,23,42,0.85) 50%, rgba(6,182,212,0.18) 100%)',
    },
    vignetteStyle: {
      background: 'radial-gradient(ellipse at center, transparent 0%, rgba(8,15,30,0.8) 100%)',
    },
    imageOpacity: 'opacity-90',
    badgeClass: 'bg-white/10 backdrop-blur-xl border border-cyan-400/40 text-cyan-300 font-sans shadow-[0_0_15px_rgba(6,182,212,0.3)]',
    badgeIconClass: 'text-cyan-400',
    headingClass: 'font-sans font-black tracking-tight text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]',
    descriptionClass: 'font-sans text-slate-200',
    primaryBtnClass: 'bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white font-black uppercase tracking-wide hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] backdrop-blur-md transition-all',
    secondaryBtnClass: 'bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold backdrop-blur-xl transition-all',
    checkColor: 'text-cyan-400',
    rightCardBorder: 'border-white/20 bg-slate-900/70 backdrop-blur-2xl text-white shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]',
    cardIconClass: 'bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.4)]',
    cardSubtitleColor: 'text-cyan-300 font-mono',
  },

  // Hero Slider
  heroSlider: {
    overlayStyle: {
      backgroundImage: 'linear-gradient(135deg, rgba(8,15,30,0.92) 0%, rgba(15,23,42,0.85) 50%, rgba(6,182,212,0.18) 100%)',
    },
    badgeClass: 'bg-white/10 backdrop-blur-xl border border-cyan-400/40 text-cyan-300 font-sans shadow-[0_0_15px_rgba(6,182,212,0.3)]',
    badgeIconClass: 'text-cyan-300',
    headlineClass: 'font-sans font-black tracking-tight text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]',
    primaryBtnClass: 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] transition-all',
    dotActiveClass: 'w-8 bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.8)]',
    rightCardBorder: 'bg-slate-900/70 backdrop-blur-2xl border-white/20 text-white shadow-[0_8px_32px_rgba(0,0,0,0.5)]',
    defaultBgImage: '',
  },

  // Statistics Section
  statistics: {
    sectionBg: 'bg-slate-950 text-white border-y border-white/10 relative overflow-hidden',
    bgPatternOverlay: {
      backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(6,182,212,0.08) 0%, transparent 70%)',
      opacity: 1,
    },
    headerAlignment: 'text-center max-w-2xl mx-auto',
    headerBadge: 'bg-white/10 border-cyan-400/30 text-cyan-300 font-mono font-bold uppercase backdrop-blur-md rounded-full shadow-[0_0_12px_rgba(6,182,212,0.2)]',
    headerTitleFont: 'font-sans font-extrabold text-white',
    headerSubtitleFont: 'font-sans text-slate-300',
    cardContainer: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6',
    cardBg: 'bg-white/5 border border-white/15 p-6 backdrop-blur-2xl hover:bg-white/10 hover:border-cyan-400/40 hover:shadow-[0_0_30px_rgba(6,182,212,0.25)] hover:-translate-y-1.5 transition-all duration-300 text-white rounded-2xl relative',
    cardTopAccent: 'h-1 bg-gradient-to-r from-cyan-400 to-indigo-500 w-full rounded-t-2xl',
    iconBox: 'w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 flex items-center justify-center mb-3 shadow-[0_0_12px_rgba(6,182,212,0.3)]',
    valueFont: 'font-sans font-black text-white text-3xl tracking-tight leading-none',
    suffixFont: 'font-sans text-cyan-400 font-black',
    labelFont: 'font-sans text-xs font-bold text-slate-300 uppercase tracking-wider mt-1',
    tagBadge: 'text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30',
  },

  // Quote / Leadership Section
  quote: {
    sectionBg: 'bg-slate-900 text-white relative',
    isCentered: false,
    layoutContainer: 'max-w-7xl mx-auto px-6 py-16',
    photoContainer: 'relative max-w-md mx-auto',
    photoFrame: 'relative z-10 shadow-[0_0_40px_rgba(6,182,212,0.3)] border-2 border-white/20 rounded-2xl backdrop-blur-md',
    quoteBox: 'relative z-10 bg-white/10 backdrop-blur-2xl p-8 shadow-2xl border border-white/20 rounded-2xl',
    quoteTextFont: 'font-sans text-base text-slate-200 leading-relaxed italic',
    authorNameFont: 'font-sans font-black text-2xl text-white',
    authorTitleFont: 'font-sans font-bold text-xs uppercase tracking-wider text-cyan-400',
    subTextFont: 'font-sans text-xs text-slate-400',
    badgeClass: 'bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 font-mono text-xs font-bold uppercase rounded-full px-3 py-1',
    iconColor: 'text-cyan-400',
    cardBg: 'bg-white/5 backdrop-blur-xl',
    cardBorder: 'border-white/15',
    cardTopAccent: 'bg-gradient-to-r from-cyan-400 to-blue-500',
  },

  // Departments Section
  departments: {
    sectionBg: 'bg-slate-950 text-white',
    sectionHeaderBadge: 'bg-white/10 text-cyan-300 border border-cyan-400/30 backdrop-blur-md rounded-full',
    headingFont: 'font-sans font-black text-white text-3xl sm:text-4xl',
    subtitleFont: 'font-sans text-slate-300',
    cardBorder: 'border-white/15',
    cardBg: 'bg-white/5 backdrop-blur-xl hover:bg-white/10 hover:border-cyan-400/40',
    cardHover: 'hover:shadow-[0_0_30px_rgba(6,182,212,0.25)] hover:-translate-y-2',
    iconBg: 'bg-cyan-500/20 text-cyan-300 rounded-xl shadow-[0_0_12px_rgba(6,182,212,0.3)]',
    accentText: 'text-cyan-400 font-bold',
    tagBadge: 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-mono text-xs rounded-full',
    cardTopAccent: 'h-1 bg-gradient-to-r from-cyan-400 to-purple-500',
  },

  // Courses Section
  courses: {
    sectionBg: 'bg-slate-900/80 text-white',
    sectionHeaderBadge: 'bg-white/10 text-cyan-300 border border-cyan-400/30 backdrop-blur-md rounded-full',
    headingFont: 'font-sans font-black text-white text-3xl sm:text-4xl',
    subtitleFont: 'font-sans text-slate-300',
    cardBorder: 'border-white/15',
    cardBg: 'bg-white/5 backdrop-blur-xl shadow-lg hover:shadow-[0_0_30px_rgba(99,102,241,0.3)] hover:border-indigo-400/50 hover:-translate-y-1.5 transition-all rounded-2xl',
    badge: 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 text-xs font-bold rounded-full',
    accentText: 'text-cyan-400 font-extrabold',
    primaryBtn: 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/20',
    iconColor: 'text-cyan-400',
  },

  // Faculty Section
  faculty: {
    layoutVariant: 'grid',
    sectionBg: 'bg-slate-950 text-white',
    sectionHeaderBadge: 'bg-white/10 text-cyan-300 border border-cyan-400/30 backdrop-blur-md rounded-full',
    headingFont: 'font-sans font-black text-white text-3xl sm:text-4xl',
    subtitleFont: 'font-sans text-slate-300',
    cardBg: 'bg-white/5 backdrop-blur-xl border border-white/15 rounded-2xl shadow-lg hover:shadow-[0_0_30px_rgba(6,182,212,0.25)]',
    cardBorder: 'border-white/15',
    cardHover: 'hover:-translate-y-2 transition-all',
    avatarBorder: 'border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.3)]',
    roleFont: 'font-sans font-bold text-xs uppercase tracking-wider text-cyan-400',
    accentText: 'text-cyan-400',
    cardTopAccent: 'h-1.5 w-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 rounded-t-2xl',
    primaryBtn: 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl',
    defaultBadgeText: 'Distinguished Faculty',
    defaultTitle: 'World-Class Faculty & Academic Mentors',
  },

  // Events Section
  events: {
    layoutVariant: 'cards',
    sectionBg: 'bg-slate-900/80 text-white',
    sectionHeaderBadge: 'bg-white/10 text-cyan-300 border border-cyan-400/30 backdrop-blur-md rounded-full',
    headingFont: 'font-sans font-black text-white text-3xl sm:text-4xl',
    subtitleFont: 'font-sans text-slate-300',
    cardBg: 'bg-white/5 backdrop-blur-xl border border-white/15 rounded-2xl shadow-lg hover:shadow-[0_0_30px_rgba(99,102,241,0.3)] transition-all',
    cardBorder: 'border-white/15',
    cardHover: 'hover:-translate-y-2',
    dateBadge: 'bg-gradient-to-b from-cyan-500 to-blue-600 text-white font-mono font-bold rounded-xl px-3 py-1.5 shadow-lg',
    accentText: 'text-cyan-400',
    defaultBadgeText: 'Academic Calendar & Summits',
    defaultTitle: 'Upcoming Events & Conferences',
  },

  // News Section
  news: {
    layoutVariant: 'cards',
    sectionBg: 'bg-slate-950 text-white',
    sectionHeaderBadge: 'bg-white/10 text-cyan-300 border border-cyan-400/30 backdrop-blur-md rounded-full',
    headingFont: 'font-sans font-black text-white text-3xl sm:text-4xl',
    subtitleFont: 'font-sans text-slate-300',
    cardBg: 'bg-white/5 backdrop-blur-xl border border-white/15 rounded-2xl shadow-lg hover:shadow-[0_0_30px_rgba(6,182,212,0.25)] transition-all',
    cardBorder: 'border-white/15',
    cardHover: 'hover:-translate-y-2',
    datePill: 'text-xs text-cyan-300 font-semibold italic',
    tagBadge: 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 text-[10px] font-bold px-2 py-0.5 rounded-full',
    accentText: 'text-cyan-400',
    defaultBadgeText: 'Campus Bulletin & Press',
    defaultTitle: 'Campus News & Press Releases',
  },

  // Notices Section
  notices: {
    sectionBg: 'bg-slate-900/80 text-white',
    sectionHeaderBadge: 'bg-white/10 text-cyan-300 border border-cyan-400/30 backdrop-blur-md rounded-full',
    headingFont: 'font-sans font-black text-white text-3xl sm:text-4xl',
    subtitleFont: 'font-sans text-slate-300',
    cardBg: 'bg-white/5 backdrop-blur-xl border border-white/15 rounded-2xl shadow-lg',
    cardBorder: 'border-white/15',
    noticeItemBg: 'bg-white/5 hover:bg-cyan-500/10 transition-colors',
    noticeItemBorder: 'border-b border-white/10',
    dateBadge: 'bg-cyan-500/20 text-cyan-300 font-mono font-bold text-xs rounded-full px-2 py-0.5',
    accentText: 'text-cyan-400',
  },

  // Gallery Section
  gallery: {
    sectionBg: 'bg-slate-950 text-white',
    sectionHeaderBadge: 'bg-white/10 text-cyan-300 border border-cyan-400/30 backdrop-blur-md rounded-full',
    headingFont: 'font-sans font-black text-white text-3xl sm:text-4xl',
    subtitleFont: 'font-sans text-slate-300',
    tabActive: 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.4)]',
    tabInactive: 'bg-white/5 hover:bg-white/10 text-slate-300 font-semibold rounded-xl border border-white/10',
    imageBorder: 'border-2 border-white/20 rounded-2xl shadow-lg hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] transition-all',
    overlayGradient: 'from-slate-950/90 via-slate-950/30 to-transparent',
    accentText: 'text-cyan-400',
  },

  // FAQ Section
  faq: {
    sectionBg: 'bg-slate-900/80 text-white',
    sectionHeaderBadge: 'bg-white/10 text-cyan-300 border border-cyan-400/30 backdrop-blur-md rounded-full',
    headingFont: 'font-sans font-black text-white text-3xl sm:text-4xl',
    subtitleFont: 'font-sans text-slate-300',
    itemBg: 'bg-white/5 backdrop-blur-xl rounded-2xl shadow-md',
    itemBorder: 'border border-white/15',
    itemHover: 'hover:border-cyan-400/50',
    questionFont: 'font-sans font-bold text-white',
    answerFont: 'font-sans text-slate-300 leading-relaxed',
    accentColor: 'text-cyan-400',
  },

  // Contact Section
  contact: {
    sectionBg: 'bg-slate-950 text-white',
    sectionHeaderBadge: 'bg-white/10 text-cyan-300 border border-cyan-400/30 backdrop-blur-md rounded-full',
    headingFont: 'font-sans font-black text-white text-3xl sm:text-4xl',
    subtitleFont: 'font-sans text-slate-300',
    cardBg: 'bg-white/5 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-2xl',
    cardBorder: 'border-white/15',
    inputBg: 'bg-white/10 border-white/20 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-white',
    inputBorder: 'border-white/20',
    submitBtn: 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black uppercase rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.4)]',
    infoIconBg: 'bg-cyan-500/20 text-cyan-300 rounded-xl shadow-[0_0_12px_rgba(6,182,212,0.3)]',
    accentText: 'text-cyan-400',
  },

  // Call to Action (CTA) Section
  cta: {
    sectionBg: 'bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white relative overflow-hidden border-t border-white/10',
    badgeClass: 'bg-white/10 border border-cyan-400/40 text-cyan-300 rounded-full',
    headlineFont: 'font-sans font-black text-3xl sm:text-4xl lg:text-5xl tracking-tight text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]',
    subheadlineFont: 'font-sans text-slate-300 text-base max-w-2xl mx-auto',
    primaryBtnClass: 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black uppercase rounded-xl shadow-[0_0_30px_rgba(6,182,212,0.5)]',
    secondaryBtnClass: 'bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold rounded-xl backdrop-blur-xl',
  },

  // Cards Section
  cards: {
    headingFont: 'font-sans font-black text-white',
    cardBorder: 'border-white/15',
    cardBg: 'bg-white/5 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-[0_0_25px_rgba(6,182,212,0.25)]',
    badge: 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 rounded-full',
  },

  // Icon Cards Section
  iconCards: {
    sectionBg: 'bg-slate-900/80 text-white',
    sectionHeaderBadge: 'bg-white/10 text-cyan-300 border border-cyan-400/30 backdrop-blur-md rounded-full',
    headingFont: 'font-sans font-black text-white',
    subtitleFont: 'font-sans text-slate-300',
    cardBg: 'bg-white/5 backdrop-blur-xl rounded-2xl',
    cardBorder: 'border-white/15',
    iconBox: 'w-12 h-12 bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.3)]',
  },

  // Image & Text Section
  imageText: {
    sectionBg: 'bg-slate-950 text-white',
    badgeClass: 'bg-white/10 text-cyan-300 border border-cyan-400/30 backdrop-blur-md rounded-full',
    headingFont: 'font-sans font-black text-white text-3xl sm:text-4xl',
    bodyFont: 'font-sans text-slate-300 leading-relaxed',
    primaryBtnClass: 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black shadow-[0_0_20px_rgba(6,182,212,0.4)] rounded-xl',
    secondaryBtnClass: 'bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold backdrop-blur-xl rounded-xl',
    imageBorder: 'border-2 border-white/20 rounded-2xl shadow-[0_0_40px_rgba(6,182,212,0.25)] backdrop-blur-md',
  },

  // Logo Grid Section
  logoGrid: {
    sectionBg: 'bg-slate-900/60 text-white',
    headingFont: 'font-sans font-black text-white',
    subtitleFont: 'font-sans text-slate-300',
    cardBg: 'bg-white/5 backdrop-blur-xl rounded-xl',
    cardBorder: 'border-white/10',
  },
};
