import { ModuleThemeStyles } from '../contracts/ThemeStyles';

export const THEME_3D_DESIGN: ModuleThemeStyles = {
  // Hero Section
  hero: {
    overlayGradient: {
      backgroundImage: 'linear-gradient(115deg, rgba(11,51,83,0.92) 0%, rgba(19,73,117,0.75) 45%, rgba(229,169,18,0.20) 100%)',
    },
    vignetteStyle: {
      background: 'linear-gradient(to top, rgba(11, 51, 83, 0.90) 0%, transparent 60%, rgba(11, 51, 83, 0.35) 100%)',
    },
    imageOpacity: 'opacity-90',
    badgeClass: 'bg-[#0b3353] border border-amber-400/50 text-amber-300 font-sans -skew-x-12',
    badgeIconClass: 'text-amber-400 skew-x-12',
    headingClass: 'font-sans font-black tracking-tight text-white',
    descriptionClass: 'font-sans text-slate-100',
    primaryBtnClass: 'bg-[#e5a912] hover:bg-[#d49a0d] text-slate-950 font-black uppercase tracking-wide -skew-x-12 shadow-lg shadow-amber-500/30',
    secondaryBtnClass: 'bg-[#0b3353] hover:bg-[#134975] border border-amber-400/40 text-white font-bold -skew-x-12',
    checkColor: 'text-amber-400',
    rightCardBorder: 'border-amber-400/40 bg-[#0b3353]/95 text-white shadow-2xl',
    cardIconClass: 'bg-amber-400/20 border border-amber-400/50 text-amber-300',
    cardSubtitleColor: 'text-amber-300 font-mono',
  },

  // Hero Slider
  heroSlider: {
    overlayStyle: {
      backgroundImage: 'linear-gradient(115deg, rgba(11,51,83,0.92) 0%, rgba(19,73,117,0.75) 45%, rgba(229,169,18,0.20) 100%)',
    },
    badgeClass: 'bg-[#0b3353] border border-amber-400/50 text-amber-300 font-sans -skew-x-12',
    badgeIconClass: 'text-amber-300 skew-x-12',
    headlineClass: 'font-sans font-black tracking-tight text-white',
    primaryBtnClass: 'bg-[#e5a912] hover:bg-[#d49a0d] text-slate-950 font-black -skew-x-12 shadow-md shadow-amber-500/25',
    dotActiveClass: 'w-8 bg-[#e5a912] -skew-x-12 shadow-md shadow-amber-400/50',
    rightCardBorder: 'bg-[#0b3353]/95 border-amber-400/40 text-white shadow-2xl',
    defaultBgImage: '',
  },

  // Statistics Section (3D Slanted Metrics)
  statistics: {
    sectionBg: 'bg-white text-slate-900 border-y border-slate-200/80',
    bgPatternOverlay: {
      backgroundImage: 'linear-gradient(135deg, rgba(229,169,18,0.04) 25%, transparent 25%), linear-gradient(225deg, rgba(229,169,18,0.04) 25%, transparent 25%)',
      backgroundSize: '30px 30px',
      opacity: 1,
    },
    headerAlignment: 'text-center max-w-2xl mx-auto',
    headerBadge: 'bg-sky-50 border-sky-200 text-[#134975] font-mono font-bold uppercase -skew-x-12',
    headerTitleFont: 'font-sans font-extrabold text-slate-900',
    headerSubtitleFont: 'font-sans text-slate-600',
    cardContainer: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6',
    cardBg: 'bg-white border border-slate-200 p-6 shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 text-slate-900 relative',
    cardTopAccent: 'h-1.5 bg-[#e5a912] w-full',
    iconBox: 'w-10 h-10 -skew-x-12 bg-[#134975] text-amber-300 flex items-center justify-center mb-3 shadow-sm',
    valueFont: 'font-sans font-black text-slate-900 text-3xl tracking-tight leading-none',
    suffixFont: 'font-sans text-[#e5a912] font-black',
    labelFont: 'font-sans text-xs font-bold text-slate-600 uppercase tracking-wider mt-1',
    tagBadge: 'text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-sky-50 text-[#134975] border border-sky-200 -skew-x-6',
  },

  // Quote / Leadership Section
  quote: {
    sectionBg: 'bg-slate-50',
    isCentered: false,
    layoutContainer: 'max-w-7xl mx-auto px-6 py-16',
    photoContainer: 'relative max-w-md mx-auto',
    photoFrame: 'relative z-10 shadow-2xl border-4 border-white',
    quoteBox: 'relative z-10 bg-white/95 p-8 shadow-xl border-l-4 border-[#e5a912]',
    quoteTextFont: 'font-sans text-base text-slate-700 leading-relaxed italic',
    authorNameFont: 'font-sans font-black text-2xl text-slate-900',
    authorTitleFont: 'font-sans font-bold text-xs uppercase tracking-wider text-[#134975]',
    subTextFont: 'font-sans text-xs text-slate-500',
    badgeClass: 'bg-[#134975] text-amber-300 font-mono text-xs font-bold uppercase -skew-x-12 px-3 py-1',
    iconColor: 'text-[#e5a912]',
    cardBg: 'bg-white',
    cardBorder: 'border-slate-200',
    cardTopAccent: 'bg-[#e5a912]',
  },

  // Departments Section
  departments: {
    sectionBg: 'bg-white text-slate-900 border-y border-slate-200/80',
    bgPatternOverlay: {
      backgroundImage: 'linear-gradient(135deg, rgba(229,169,18,0.04) 25%, transparent 25%), linear-gradient(225deg, rgba(229,169,18,0.04) 25%, transparent 25%)',
      backgroundSize: '30px 30px',
      opacity: 1,
    },
    sectionHeaderBadge: 'bg-sky-50 text-[#134975] border-sky-200 -skew-x-12',
    headingFont: 'font-sans font-black text-slate-900 text-3xl sm:text-4xl',
    subtitleFont: 'font-sans text-slate-600',
    cardBorder: 'border-slate-200/80',
    cardBg: 'bg-white/95 dark:bg-slate-900/95 shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300',
    cardHover: 'hover:shadow-xl hover:-translate-y-2',
    iconBg: 'bg-[#134975] text-amber-400 -skew-x-12',
    accentText: 'text-[#134975] font-bold',
    tagBadge: 'bg-amber-100 text-amber-900 border-amber-300 -skew-x-6 font-mono text-xs',
    cardTopAccent: 'h-1 bg-[#e5a912]',
  },

  // Courses Section
  courses: {
    sectionBg: 'bg-slate-50',
    sectionHeaderBadge: 'bg-amber-100 text-amber-950 border-amber-300 -skew-x-12',
    headingFont: 'font-sans font-black text-slate-900 text-3xl sm:text-4xl',
    subtitleFont: 'font-sans text-slate-600',
    cardBorder: 'border-slate-200',
    cardBg: 'bg-white shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all',
    badge: 'bg-[#134975] text-white -skew-x-12 text-xs font-bold',
    accentText: 'text-[#134975] font-extrabold',
    primaryBtn: 'bg-[#e5a912] hover:bg-[#d49a0d] text-slate-950 font-bold -skew-x-12',
    iconColor: 'text-[#e5a912]',
  },

  // Faculty Section
  faculty: {
    layoutVariant: 'slanted',
    sectionBg: 'bg-white',
    sectionHeaderBadge: 'bg-sky-50 text-[#134975] border-sky-200 -skew-x-12',
    headingFont: 'font-sans font-black text-slate-900 text-3xl sm:text-4xl',
    subtitleFont: 'font-sans text-slate-600',
    cardBg: 'bg-white border border-slate-200 shadow-sm hover:shadow-2xl',
    cardBorder: 'border-slate-200',
    cardHover: 'hover:-translate-y-2 transition-all',
    avatarBorder: 'border-amber-400/50',
    roleFont: 'font-sans font-bold text-xs uppercase tracking-wider text-[#134975]',
    accentText: 'text-[#134975]',
    cardTopAccent: 'h-1.5 w-full bg-[#e5a912]',
    primaryBtn: 'bg-[#134975] hover:bg-[#0b3353] text-amber-300 font-bold -skew-x-12',
    defaultBadgeText: 'Distinguished Faculty',
    defaultTitle: 'World-Class Faculty & Academic Mentors',
  },

  // Events Section
  events: {
    layoutVariant: 'slanted',
    sectionBg: 'bg-slate-50',
    sectionHeaderBadge: 'bg-amber-100 text-amber-950 border-amber-300 -skew-x-12',
    headingFont: 'font-sans font-black text-slate-900 text-3xl sm:text-4xl',
    subtitleFont: 'font-sans text-slate-600',
    cardBg: 'bg-white shadow-sm hover:shadow-2xl transition-all',
    cardBorder: 'border-slate-200',
    cardHover: 'hover:-translate-y-2',
    dateBadge: 'bg-[#134975] text-amber-300 font-mono font-bold -skew-x-12 px-3 py-1.5',
    accentText: 'text-[#134975]',
    defaultBadgeText: 'Academic Calendar & Summits',
    defaultTitle: 'Upcoming Events & Conferences',
  },

  // News Section
  news: {
    layoutVariant: 'slanted',
    sectionBg: 'bg-white',
    sectionHeaderBadge: 'bg-sky-50 text-[#134975] border-sky-200 -skew-x-12',
    headingFont: 'font-sans font-black text-slate-900 text-3xl sm:text-4xl',
    subtitleFont: 'font-sans text-slate-600',
    cardBg: 'bg-white shadow-md hover:shadow-2xl transition-all',
    cardBorder: 'border-slate-200',
    cardHover: 'hover:-translate-y-2',
    datePill: 'text-xs text-red-600 font-semibold italic',
    tagBadge: 'bg-[#134975] text-amber-300 -skew-x-6 text-[10px] font-bold px-2 py-0.5',
    accentText: 'text-[#134975]',
    defaultBadgeText: 'Campus Bulletin & Press',
    defaultTitle: 'Campus News & Press Releases',
  },

  // Notices Section
  notices: {
    sectionBg: 'bg-slate-50',
    sectionHeaderBadge: 'bg-amber-100 text-amber-950 border-amber-300 -skew-x-12',
    headingFont: 'font-sans font-black text-slate-900 text-3xl sm:text-4xl',
    subtitleFont: 'font-sans text-slate-600',
    cardBg: 'bg-white shadow-sm',
    cardBorder: 'border-slate-200',
    noticeItemBg: 'bg-slate-50 hover:bg-amber-50/50 transition-colors',
    noticeItemBorder: 'border-b border-slate-200',
    dateBadge: 'bg-[#134975] text-amber-300 font-mono font-bold -skew-x-12 text-xs',
    accentText: 'text-[#134975]',
  },

  // Gallery Section
  gallery: {
    sectionBg: 'bg-white',
    sectionHeaderBadge: 'bg-sky-50 text-[#134975] border-sky-200 -skew-x-12',
    headingFont: 'font-sans font-black text-slate-900 text-3xl sm:text-4xl',
    subtitleFont: 'font-sans text-slate-600',
    tabActive: 'bg-[#134975] text-amber-400 font-bold -skew-x-12 shadow-sm',
    tabInactive: 'bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold -skew-x-12',
    imageBorder: 'border-2 border-slate-200 shadow-sm hover:shadow-xl transition-all',
    overlayGradient: 'from-black/80 via-black/20 to-transparent',
    accentText: 'text-[#e5a912]',
  },

  // FAQ Section
  faq: {
    sectionBg: 'bg-slate-50',
    sectionHeaderBadge: 'bg-amber-100 text-amber-950 border-amber-300 -skew-x-12',
    headingFont: 'font-sans font-black text-slate-900 text-3xl sm:text-4xl',
    subtitleFont: 'font-sans text-slate-600',
    itemBg: 'bg-white shadow-sm',
    itemBorder: 'border border-slate-200',
    itemHover: 'hover:border-amber-400/50',
    questionFont: 'font-sans font-bold text-slate-900',
    answerFont: 'font-sans text-slate-600 leading-relaxed',
    accentColor: 'text-[#e5a912]',
  },

  // Contact Section
  contact: {
    sectionBg: 'bg-white',
    sectionHeaderBadge: 'bg-sky-50 text-[#134975] border-sky-200 -skew-x-12',
    headingFont: 'font-sans font-black text-slate-900 text-3xl sm:text-4xl',
    subtitleFont: 'font-sans text-slate-600',
    cardBg: 'bg-slate-50 border border-slate-200 shadow-sm',
    cardBorder: 'border-slate-200',
    inputBg: 'bg-white border-slate-300 focus:border-[#134975] focus:ring-1 focus:ring-[#134975]',
    inputBorder: 'border-slate-300',
    submitBtn: 'bg-[#e5a912] hover:bg-[#d49a0d] text-slate-950 font-black uppercase -skew-x-12 shadow-md',
    infoIconBg: 'bg-[#134975] text-amber-300 -skew-x-12',
    accentText: 'text-[#134975]',
  },

  // Call to Action (CTA) Section
  cta: {
    sectionBg: 'bg-[#134975] text-white relative overflow-hidden',
    badgeClass: 'bg-[#0b3353] border border-amber-400/50 text-amber-300 -skew-x-12',
    headlineFont: 'font-sans font-black text-3xl sm:text-4xl lg:text-5xl tracking-tight text-white',
    subheadlineFont: 'font-sans text-slate-200 text-base max-w-2xl mx-auto',
    primaryBtnClass: 'bg-[#e5a912] hover:bg-[#d49a0d] text-slate-950 font-black uppercase -skew-x-12 shadow-xl shadow-amber-500/30',
    secondaryBtnClass: 'bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold -skew-x-12',
  },

  // Cards Section
  cards: {
    headingFont: 'font-sans font-black text-slate-900',
    cardBorder: 'border-slate-200',
    cardBg: 'bg-white shadow-sm hover:shadow-lg',
    badge: 'bg-[#134975] text-amber-300 -skew-x-12',
  },

  // Icon Cards Section
  iconCards: {
    sectionBg: 'bg-slate-50',
    sectionHeaderBadge: 'bg-sky-50 text-[#134975] border-sky-200 -skew-x-12',
    headingFont: 'font-sans font-black text-slate-900',
    subtitleFont: 'font-sans text-slate-600',
    cardBg: 'bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all',
    cardBorder: 'border-slate-200',
    iconBox: 'w-12 h-12 bg-[#134975] text-amber-400 -skew-x-12 flex items-center justify-center shadow-md',
  },

  // Image & Text Section
  imageText: {
    sectionBg: 'bg-white',
    badgeClass: 'bg-amber-100 text-amber-950 border-amber-300 -skew-x-12',
    headingFont: 'font-sans font-black text-slate-900 text-3xl sm:text-4xl',
    bodyFont: 'font-sans text-slate-600 leading-relaxed',
    primaryBtnClass: 'bg-[#e5a912] hover:bg-[#d49a0d] text-slate-950 font-black -skew-x-12',
    secondaryBtnClass: 'bg-[#134975] hover:bg-[#0b3353] text-white font-bold -skew-x-12',
    imageBorder: 'border-4 border-white shadow-2xl',
  },

  // Logo Grid Section
  logoGrid: {
    sectionBg: 'bg-slate-50',
    headingFont: 'font-sans font-black text-slate-900',
    subtitleFont: 'font-sans text-slate-600',
    cardBg: 'bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow',
    cardBorder: 'border-slate-200',
  },
};

export const SALESIAN_THEME = THEME_3D_DESIGN;
export const theme3DDesign = THEME_3D_DESIGN;
