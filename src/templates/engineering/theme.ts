import { ModuleThemeStyles } from '../contracts/ThemeStyles';

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
    defaultBgImage: '/assets/templates/engineering/banner1.svg',
  },

  // Statistics Section (High-Tech Metrics Bar - Clean Light)
  statistics: {
    sectionBg: 'bg-slate-50/70 text-slate-900 border-y border-slate-200',
    bgPatternOverlay: {
      backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(37, 99, 235, 0.08) 1px, transparent 0)',
      backgroundSize: '24px 24px',
      opacity: 1,
    },
    headerAlignment: 'text-center max-w-2xl mx-auto',
    headerBadge: 'bg-blue-100/80 border-blue-300 text-blue-900 font-mono font-bold uppercase',
    headerTitleFont: 'font-sans font-extrabold text-slate-900',
    headerSubtitleFont: 'font-sans text-slate-600',
    cardContainer: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5',
    cardBg: 'bg-white border border-blue-100 hover:border-blue-400 border-t-[3px] border-t-blue-600 rounded-[14px] p-5 shadow-[0_6px_18px_rgba(15,23,42,0.05)] hover:shadow-[0_12px_28px_rgba(15,23,42,0.09)] transition-all duration-200 transform hover:-translate-y-1 text-slate-900',
    cardTopAccent: '',
    iconBox: 'w-[38px] h-[38px] rounded-[10px] bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mb-2.5',
    valueFont: 'font-sans font-extrabold text-[#0f172a] text-[28px] tracking-tight leading-none',
    suffixFont: 'font-sans text-blue-600 font-bold',
    labelFont: 'font-sans text-[11px] font-bold text-[#64748b] uppercase tracking-[0.08em]',
    tagBadge: 'text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200',
  },

  // Quote / Leadership Section (Dean's High-Tech Research Suite - Light)
  quote: {
    sectionBg: 'bg-slate-50/60 text-slate-900 border-y border-slate-200',
    isCentered: false,
    layoutContainer: 'max-w-5xl mx-auto',
    photoContainer: 'w-full md:w-64 bg-slate-50 border border-slate-200 rounded-xl p-5',
    photoFrame: 'w-[86px] h-[86px] rounded-full overflow-hidden border-[3px] border-white shadow-md bg-white',
    quoteBox: 'flex-1',
    cardBg: 'bg-white border border-slate-200 rounded-2xl shadow-[0_8px_24px_rgba(15,23,42,0.06)]',
    cardTopAccent: 'bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700',
    profileBg: 'bg-gradient-to-b from-blue-50/70 to-slate-50/50 border border-blue-100',
    avatarRing: 'ring-blue-400/40',
    footerLabel: 'Office of Engineering Dean',
    quoteTextFont: 'font-serif font-medium text-slate-900 text-lg sm:text-[19px] leading-[1.6]',
    authorNameFont: 'font-sans font-bold text-slate-900 text-[15px] sm:text-[16px] tracking-tight',
    authorTitleFont: 'font-mono text-xs text-blue-700 font-bold',
    subTextFont: 'font-mono text-[11px] text-slate-500',
    badgeClass: 'text-[11px] font-mono uppercase font-bold tracking-wider text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full',
    iconColor: 'text-blue-500',
  },

  // Departments Section (Academic Divisions - Clean Light)
  departments: {
    sectionBg: 'py-8 sm:py-10 bg-slate-50 text-slate-900 border-y border-slate-200',
    sectionHeaderBadge: 'bg-blue-100 text-blue-800 border border-blue-300 text-xs font-mono font-bold uppercase',
    headingFont: 'font-sans font-black uppercase tracking-tight text-slate-900 text-2xl sm:text-3xl',
    subtitleFont: 'font-sans text-slate-600 text-xs sm:text-sm',
    cardBorder: 'border border-slate-200 hover:border-blue-500',
    cardBg: 'bg-white rounded-xl p-4 sm:p-5 shadow-xs hover:shadow-lg transition duration-300 border text-slate-900',
    cardHover: 'hover:-translate-y-1',
    iconBg: 'bg-blue-50 text-blue-600 border border-blue-200',
    accentText: 'text-blue-600 hover:text-blue-800 font-bold',
    tagBadge: 'bg-slate-100 text-slate-700 border border-slate-200 font-mono text-[10px] uppercase font-bold',
    isCentered: false,
    defaultBadgeText: 'Academic Divisions',
    defaultTitle: 'Departments & Academic Schools',
    defaultSubtitle: 'Cutting-edge departments driving technical proficiency, engineering leadership, and innovation.',
    showBottomCta: false,
  },

  // Courses Section (Degree Programs - Clean Light)
  courses: {
    sectionBg: 'py-8 sm:py-10 bg-white text-slate-900 border-y border-slate-100',
    sectionHeaderBadge: 'bg-cyan-100 text-cyan-800 border border-cyan-300 text-xs font-mono font-bold uppercase',
    headingFont: 'font-sans font-black uppercase tracking-tight text-slate-900 text-2xl sm:text-3xl',
    subtitleFont: 'font-sans text-slate-600 text-xs sm:text-sm',
    cardBorder: 'border border-slate-200 hover:border-cyan-500',
    cardBg: 'bg-slate-50/70 rounded-xl p-4 sm:p-5 shadow-xs hover:shadow-lg transition duration-300 border text-slate-900',
    badge: 'bg-cyan-50 text-cyan-800 border border-cyan-200 font-mono text-[10px] uppercase font-bold',
    accentText: 'text-cyan-700 hover:text-cyan-900 font-bold',
    primaryBtn: 'bg-blue-600 hover:bg-blue-700 text-white font-black uppercase text-xs shadow-sm',
    iconColor: 'text-cyan-600',
    isCentered: false,
    defaultBadgeText: 'Degree Programs',
    defaultTitle: 'Explore Academic Programs',
    cardHover: 'hover:-translate-y-1',
  },

  // Faculty Section
  faculty: {
    sectionBg: 'py-8 sm:py-10 bg-slate-50 text-slate-900 border-y border-slate-200',
    sectionHeaderBadge: 'bg-blue-100 text-blue-800 border border-blue-300 text-xs font-mono font-bold uppercase',
    headingFont: 'font-sans font-black uppercase tracking-tight text-slate-900 text-2xl sm:text-3xl',
    subtitleFont: 'font-sans text-slate-600 text-xs sm:text-sm',
    cardBg: 'bg-white rounded-[14px] border border-blue-100/90 hover:border-blue-400 border-t-[3px] border-t-blue-600 shadow-xs hover:shadow-lg transition duration-300 text-slate-900',
    cardBorder: '',
    cardHover: 'hover:-translate-y-1',
    avatarBorder: 'border-b border-blue-100',
    roleFont: 'font-mono text-xs text-blue-600 font-semibold',
    accentText: 'text-blue-600 hover:text-blue-800 font-bold',
    isCentered: false,
    layoutVariant: 'grid',
    defaultBadgeText: 'Distinguished Faculty',
    defaultTitle: 'Meet Our Academic Leaders & Researchers',
    primaryBtn: 'bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-sm',
  },

  // Events Section
  events: {
    sectionBg: 'py-8 sm:py-10 bg-white text-slate-900 border-y border-slate-100',
    sectionHeaderBadge: 'bg-cyan-100 text-cyan-800 border border-cyan-300 text-xs font-mono font-bold uppercase',
    headingFont: 'font-sans font-black uppercase tracking-tight text-slate-900 text-2xl sm:text-3xl',
    subtitleFont: 'font-sans text-slate-600 text-xs sm:text-sm',
    cardBg: 'bg-slate-50/70 rounded-[14px] p-4 sm:p-5 shadow-xs hover:shadow-lg transition duration-300 border border-slate-200 text-slate-900',
    cardBorder: 'border-slate-200 hover:border-cyan-500',
    cardHover: 'hover:-translate-y-1',
    dateBadge: 'bg-blue-600 text-white font-mono font-bold',
    accentText: 'text-blue-600 hover:text-blue-800 font-bold',
    isCentered: false,
    layoutVariant: 'cards',
    defaultBadgeText: 'Upcoming Seminars & Hackathons',
    defaultTitle: 'Campus Events & Technical Symposia',
  },

  // News Section (High-Tech Bulletins)
  news: {
    sectionBg: 'py-8 sm:py-10 bg-slate-50 text-slate-900 border-y border-slate-200',
    sectionHeaderBadge: 'bg-blue-100 text-blue-800 border border-blue-300 text-xs font-mono font-bold uppercase',
    headingFont: 'font-sans font-black uppercase tracking-tight text-slate-900 text-2xl sm:text-3xl',
    subtitleFont: 'font-sans text-slate-600 text-xs sm:text-sm',
    cardBg: 'bg-white rounded-[14px] overflow-hidden shadow-xs hover:shadow-lg transition duration-300 border border-blue-100/90 text-slate-900',
    cardBorder: 'border-blue-100/90 hover:border-blue-400',
    cardHover: 'hover:-translate-y-1',
    cardTopAccent: 'bg-blue-600',
    datePill: 'bg-blue-50 text-blue-700 text-[11px] font-mono font-bold px-2 py-0.5 rounded',
    tagBadge: 'bg-slate-100 text-slate-700 border border-slate-200 font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded',
    accentText: 'text-blue-600 hover:text-blue-800 font-bold',
    isCentered: false,
    layoutVariant: 'cards',
    defaultBadgeText: 'Technical Bulletins',
    defaultTitle: 'Research & Innovation News',
    primaryBtn: 'bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs',
  },

  // Notices Section
  notices: {
    sectionBg: 'py-8 sm:py-10 bg-white text-slate-900 border-y border-slate-100',
    sectionHeaderBadge: 'bg-amber-100 text-amber-800 border border-amber-300 text-xs font-mono font-bold uppercase',
    headingFont: 'font-sans font-black uppercase tracking-tight text-slate-900 text-2xl sm:text-3xl',
    subtitleFont: 'font-sans text-slate-600 text-xs sm:text-sm',
    cardBg: 'bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5',
    cardBorder: 'border-slate-200',
    noticeItemBg: 'bg-white hover:bg-blue-50/50 transition border border-slate-200 rounded-lg p-3.5 sm:p-4',
    noticeItemBorder: 'border-slate-200 hover:border-blue-400',
    dateBadge: 'bg-blue-50 text-blue-700 font-mono text-xs font-bold px-2 py-0.5 rounded-md border border-blue-200',
    accentText: 'text-blue-600 hover:text-blue-800 font-bold',
    isCentered: false,
    defaultBadgeText: 'Official Circulars',
    defaultTitle: 'Administrative & Academic Notices',
  },

  // Gallery Section
  gallery: {
    sectionBg: 'py-8 sm:py-10 bg-slate-900 text-white',
    sectionHeaderBadge: 'bg-blue-900/60 text-blue-300 border border-blue-700 text-xs font-mono font-bold uppercase',
    headingFont: 'font-sans font-black uppercase tracking-tight text-white text-2xl sm:text-3xl',
    subtitleFont: 'font-sans text-slate-300 text-xs sm:text-sm',
    tabActive: 'bg-blue-600 text-white font-mono font-bold',
    tabInactive: 'bg-slate-800 text-slate-300 hover:bg-slate-700 font-mono',
    imageBorder: 'border border-slate-800 rounded-xl overflow-hidden',
    overlayGradient: 'bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent',
    accentText: 'text-blue-400 font-bold',
    isCentered: false,
    defaultBadgeText: 'Campus In Pictures',
    defaultTitle: 'State-of-the-Art Labs & Campus Life',
  },

  // FAQ Section
  faq: {
    sectionBg: 'py-8 sm:py-10 bg-slate-50 text-slate-900 border-y border-slate-200',
    sectionHeaderBadge: 'bg-blue-100 text-blue-800 border border-blue-300 text-xs font-mono font-bold uppercase',
    headingFont: 'font-sans font-black uppercase tracking-tight text-slate-900 text-2xl sm:text-3xl',
    subtitleFont: 'font-sans text-slate-600 text-xs sm:text-sm',
    itemBg: 'bg-white border border-slate-200 rounded-xl',
    itemBorder: 'border-slate-200',
    itemHover: 'hover:border-blue-400',
    questionFont: 'font-sans font-bold text-slate-900 text-sm sm:text-base',
    answerFont: 'font-sans text-slate-600 text-xs sm:text-sm leading-relaxed',
    accentColor: 'text-blue-600',
    isCentered: false,
    defaultBadgeText: 'Admissions & Queries',
    defaultTitle: 'Frequently Asked Questions',
  },

  // Contact Section
  contact: {
    sectionBg: 'py-8 sm:py-10 bg-white text-slate-900 border-y border-slate-200',
    sectionHeaderBadge: 'bg-blue-100 text-blue-800 border border-blue-300 text-xs font-mono font-bold uppercase',
    headingFont: 'font-sans font-black uppercase tracking-tight text-slate-900 text-2xl sm:text-3xl',
    subtitleFont: 'font-sans text-slate-600 text-xs sm:text-sm',
    cardBg: 'bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-6',
    cardBorder: 'border-slate-200',
    inputBg: 'bg-white',
    inputBorder: 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/20',
    submitBtn: 'bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-wider text-xs py-2.5 px-5 rounded-lg shadow-sm',
    infoIconBg: 'bg-blue-50 text-blue-600 border border-blue-200',
    accentText: 'text-blue-600 font-bold',
    isCentered: false,
    defaultBadgeText: 'Connect With Us',
    defaultTitle: 'Get In Touch With Engineering Admissions',
  },

  // Call to Action (CTA)
  cta: {
    sectionBg: 'py-10 sm:py-14 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white relative overflow-hidden shadow-xl',
    badgeClass: 'bg-blue-950/80 border-cyan-400/50 text-cyan-300 font-mono font-bold uppercase text-xs',
    headlineFont: 'font-sans font-black uppercase tracking-tight text-white text-2xl sm:text-3xl lg:text-4xl',
    subheadlineFont: 'font-mono text-slate-200 text-xs sm:text-sm',
    primaryBtnClass: 'bg-amber-400 hover:bg-amber-300 text-slate-950 font-black uppercase tracking-wide shadow-md text-xs px-5 py-2.5 rounded-lg',
    secondaryBtnClass: 'bg-slate-900/80 hover:bg-slate-800 border-cyan-400/40 text-white font-bold text-xs px-5 py-2.5 rounded-lg',
  },

  // Cards Section
  cards: {
    headingFont: 'font-sans font-black uppercase text-slate-900 text-2xl sm:text-3xl',
    cardBorder: 'border border-slate-200 hover:border-blue-500',
    cardBg: 'bg-white text-slate-900 shadow-xs rounded-xl p-4 sm:p-5',
    badge: 'bg-blue-50 text-blue-700 border border-blue-200 font-mono text-xs',
    isCentered: false,
  },

  // Icon Cards Section
  iconCards: {
    sectionBg: 'py-16 bg-slate-50 text-slate-900 border-y border-slate-200',
    sectionHeaderBadge: 'bg-blue-100 text-blue-800 border border-blue-300 text-xs font-mono font-bold uppercase',
    headingFont: 'font-sans font-black uppercase tracking-tight text-slate-900 text-3xl sm:text-4xl',
    subtitleFont: 'font-sans text-slate-600 text-sm',
    cardBg: 'bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl border border-slate-200 text-slate-900',
    cardBorder: 'border-slate-200 hover:border-blue-500',
    iconBox: 'w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center',
    isCentered: false,
  },

  // Image & Text Section
  imageText: {
    sectionBg: 'py-16 bg-white text-slate-900 border-y border-slate-100',
    badgeClass: 'bg-blue-100 text-blue-800 border border-blue-300 text-xs font-mono font-bold uppercase',
    headingFont: 'font-sans font-black uppercase tracking-tight text-slate-900 text-3xl sm:text-4xl',
    bodyFont: 'font-sans text-slate-600 leading-relaxed text-sm sm:text-base',
    primaryBtnClass: 'bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm',
    secondaryBtnClass: 'bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-5 py-2.5 rounded-xl',
    imageBorder: 'rounded-2xl border border-slate-200 shadow-lg overflow-hidden',
  },

  // Logo Grid Section
  logoGrid: {
    sectionBg: 'py-12 bg-slate-50 border-y border-slate-200',
    headingFont: 'font-mono text-xs uppercase font-bold text-slate-500 tracking-wider text-center',
    subtitleFont: 'font-sans text-xs text-slate-400 text-center',
    cardBg: 'bg-white rounded-xl p-4 shadow-2xs border border-slate-200 flex items-center justify-center grayscale hover:grayscale-0 transition',
    cardBorder: 'border-slate-200 hover:border-blue-400',
  },
};
