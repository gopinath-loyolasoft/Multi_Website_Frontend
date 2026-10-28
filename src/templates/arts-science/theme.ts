import { ModuleThemeStyles } from '../contracts/ThemeStyles';

export const ARTS_SCIENCE_THEME: ModuleThemeStyles = {
  // Hero Section
  hero: {
    overlayGradient: {
      backgroundImage: 'linear-gradient(to right, rgba(6, 78, 59, 0.96) 0%, rgba(6, 78, 59, 0.85) 45%, rgba(15, 23, 42, 0.60) 100%)',
    },
    vignetteStyle: {
      background: 'radial-gradient(circle at center, transparent 30%, rgba(4, 47, 36, 0.85) 100%)',
    },
    imageOpacity: 'opacity-80',
    badgeClass: 'bg-emerald-950/90 border-amber-400/50 text-amber-300 font-serif tracking-widest',
    badgeIconClass: 'text-amber-400',
    headingClass: 'font-serif text-white tracking-normal',
    descriptionClass: 'font-serif text-emerald-100/90 font-light',
    primaryBtnClass: 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-serif font-bold shadow-amber-900/30',
    secondaryBtnClass: 'bg-emerald-950/80 hover:bg-emerald-900 border-amber-400/40 text-amber-200 font-serif',
    checkColor: 'text-amber-400',
    rightCardBorder: 'border-amber-400/40 bg-slate-950/90 shadow-2xl shadow-emerald-950/50 text-white',
    cardIconClass: 'bg-amber-400/10 border-amber-400/40 text-amber-300',
    cardSubtitleColor: 'text-amber-300/80 font-serif italic',
  },

  // Hero Slider
  heroSlider: {
    overlayStyle: {
      backgroundImage: 'linear-gradient(to right, rgba(6, 78, 59, 0.95) 0%, rgba(6, 78, 59, 0.80) 50%, rgba(4, 47, 36, 0.40) 100%)',
    },
    badgeClass: 'bg-emerald-950/90 border-amber-400/50 text-amber-300 font-serif',
    badgeIconClass: 'text-amber-400',
    headlineClass: 'font-serif text-white tracking-normal',
    primaryBtnClass: 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-serif font-bold shadow-amber-900/30',
    dotActiveClass: 'w-8 bg-amber-400 shadow-md shadow-amber-400/50',
    rightCardBorder: 'bg-slate-950/90 border-amber-400/40 shadow-2xl shadow-emerald-950/50 text-white',
    defaultBgImage: '/assets/templates/arts/banner1.svg',
  },

  // Statistics Section (Heritage Classical Parchment & Ivy Motif)
  statistics: {
    sectionBg: 'bg-[#fbf9f4] dark:bg-stone-950 text-stone-900 dark:text-stone-100 border-y border-stone-200 dark:border-stone-800',
    bgPatternOverlay: {
      backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(21, 128, 61, 0.09) 1px, transparent 0)',
      backgroundSize: '32px 32px',
      opacity: 1,
    },
    headerAlignment: 'text-center max-w-2xl mx-auto',
    headerBadge: 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-serif italic text-xs',
    headerTitleFont: 'font-serif font-bold tracking-normal text-stone-900 dark:text-white',
    headerSubtitleFont: 'font-serif italic text-stone-600 dark:text-stone-400',
    cardContainer: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5',
    cardBg: 'bg-white dark:bg-stone-900 border-b-2 border-b-emerald-700 dark:border-b-emerald-500 rounded-sm p-6 shadow-[0_4px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] transition-all duration-200 transform hover:-translate-y-1 text-stone-900 dark:text-stone-100',
    cardTopAccent: '',
    iconBox: 'w-[36px] h-[36px] rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 flex items-center justify-center mb-2',
    valueFont: 'font-serif font-bold text-[#064e3b] dark:text-emerald-400 text-[32px] sm:text-[34px] tracking-tight leading-tight',
    suffixFont: 'font-serif text-emerald-700 dark:text-emerald-400 font-bold ml-0.5',
    labelFont: 'font-sans text-[10px] font-bold text-[#64748b] dark:text-stone-400 tracking-[.14em] uppercase mt-1.5',
    tagBadge: 'text-[10px] font-serif uppercase px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200',
  },

  // Quote / Leadership Section (Heritage Principal's Address)
  quote: {
    sectionBg: 'bg-[#f5f2eb] text-stone-900 border-y border-stone-300/80',
    isCentered: true,
    layoutContainer: 'max-w-4xl mx-auto text-center space-y-4',
    photoContainer: 'flex flex-col items-center space-y-2 mt-3',
    photoFrame: 'w-[86px] h-[86px] rounded-full overflow-hidden border-[3px] border-white shadow-md mx-auto bg-stone-100',
    quoteBox: 'flex-1',
    cardBg: 'bg-white border border-stone-200 rounded-2xl shadow-[0_8px_24px_rgba(15,23,42,0.06)]',
    cardTopAccent: 'bg-gradient-to-r from-emerald-700 via-amber-400 to-emerald-800',
    avatarRing: 'ring-amber-400/60',
    footerLabel: 'Office of the Principal',
    quoteTextFont: 'font-serif italic text-stone-800 text-lg sm:text-[19px] leading-[1.6]',
    authorNameFont: 'font-serif font-bold text-stone-900 text-[16px] tracking-normal',
    authorTitleFont: 'font-serif italic text-xs text-emerald-800 font-semibold',
    subTextFont: 'font-serif text-[11px] text-stone-500',
    badgeClass: 'text-[11px] font-serif uppercase tracking-widest text-emerald-800 bg-emerald-50 border border-emerald-200 px-3.5 py-1 rounded-full inline-block font-bold',
    iconColor: 'text-amber-500',
  },

  // Departments Section (Humanities & Pure Sciences)
  departments: {
    sectionBg: 'py-8 sm:py-10 bg-[#faf8f5] dark:bg-stone-950 text-stone-900 dark:text-stone-100 border-y border-stone-200 dark:border-stone-800 relative overflow-hidden',
    bgPatternOverlay: {
      backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(21, 128, 61, 0.07) 1px, transparent 0)',
      backgroundSize: '32px 32px',
      opacity: 1,
    },
    sectionHeaderBadge: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 font-serif italic text-xs tracking-wider uppercase shadow-2xs',
    headingFont: 'font-serif font-bold text-stone-900 dark:text-white text-2xl sm:text-3xl tracking-normal drop-shadow-xs',
    subtitleFont: 'font-serif italic text-stone-600 dark:text-stone-400 text-xs sm:text-sm',
    cardBorder: 'border border-stone-200/90 dark:border-stone-800 hover:border-emerald-600 dark:hover:border-emerald-500',
    cardBg: 'bg-white dark:bg-stone-900 rounded-xl p-4 sm:p-5 shadow-xs hover:shadow-lg transition-all duration-300 border text-stone-900 dark:text-stone-100 relative overflow-hidden group flex flex-col justify-between',
    cardTopAccent: 'bg-gradient-to-r from-emerald-700 via-amber-400 to-emerald-800',
    cardHover: 'hover:-translate-y-1',
    iconBg: 'w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform duration-300',
    accentText: 'text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 font-serif font-bold text-xs',
    tagBadge: 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800 font-serif text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full',
    primaryBtn: 'inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-emerald-800 to-emerald-900 hover:from-emerald-700 hover:to-emerald-800 text-amber-300 font-serif font-bold text-xs tracking-wider uppercase shadow-xs transition-all duration-200 border border-amber-400/30',
    isCentered: true,
    defaultBadgeText: 'Arts, Science & Humanities',
    defaultTitle: 'Departments & Academic Schools',
    defaultSubtitle: 'Dedicated to cultivating scholarly inquiry, critical thinking, and intellectual excellence across liberal arts, humanities, and pure sciences.',
    showBottomCta: true,
    bottomCtaText: 'View All Academic Departments',
    cardTitleFont: 'font-serif text-stone-900 dark:text-white group-hover:text-emerald-800 dark:group-hover:text-emerald-400 transition-colors',
    cardDescFont: 'text-stone-600 dark:text-stone-300 font-serif',
  },

  // Courses Section (Liberal Arts & Sciences)
  courses: {
    sectionBg: 'py-8 sm:py-10 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 border-y border-stone-100 dark:border-stone-800',
    sectionHeaderBadge: 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-serif italic text-xs px-3 py-0.5 rounded-full',
    headingFont: 'font-serif font-bold text-stone-900 dark:text-white text-2xl sm:text-3xl',
    subtitleFont: 'font-serif italic text-stone-600 dark:text-stone-400 text-xs sm:text-sm',
    cardBorder: 'border border-stone-200/90 dark:border-stone-800 hover:border-amber-500',
    cardBg: 'bg-[#faf8f5] dark:bg-stone-950/70 rounded-xl p-4 sm:p-5 shadow-xs hover:shadow-lg transition duration-300 border text-stone-900 dark:text-stone-100 relative overflow-hidden flex flex-col justify-between',
    badge: 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-serif text-[10px] uppercase font-bold px-2 py-0.5 rounded-full',
    accentText: 'text-amber-800 dark:text-amber-400 hover:text-amber-950 font-serif font-bold text-xs',
    primaryBtn: 'bg-emerald-800 hover:bg-emerald-900 text-amber-300 font-serif font-bold text-xs shadow-xs px-4 py-2 rounded-lg border border-amber-400/30',
    iconColor: 'text-amber-600',
    isCentered: true,
    defaultBadgeText: 'Humanities & Pure Science Programs',
    defaultTitle: 'Explore Academic Disciplines & Degrees',
    cardHover: 'hover:-translate-y-1',
  },

  // Faculty Section (Scholars & Department Heads)
  faculty: {
    sectionBg: 'py-8 sm:py-10 bg-[#faf8f5] dark:bg-stone-950 text-stone-900 dark:text-stone-100 border-y border-stone-200 dark:border-stone-800',
    sectionHeaderBadge: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 font-serif italic text-xs tracking-wider uppercase',
    headingFont: 'font-serif font-bold text-stone-900 dark:text-white text-2xl sm:text-3xl tracking-normal drop-shadow-xs',
    subtitleFont: 'font-serif italic text-stone-600 dark:text-stone-400 text-xs sm:text-sm',
    cardBg: 'bg-white dark:bg-stone-900 rounded-xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-all duration-300 border border-stone-200/90 dark:border-stone-800 text-stone-900 dark:text-stone-100',
    cardBorder: 'border-stone-200/90 dark:border-stone-800 hover:border-emerald-600 dark:hover:border-emerald-500',
    cardHover: 'hover:-translate-y-0.5',
    avatarBorder: 'border-2 border-emerald-500/20',
    roleFont: 'font-serif italic text-xs sm:text-sm text-emerald-800 dark:text-emerald-400 font-medium',
    accentText: 'text-emerald-700 hover:text-emerald-900 font-serif italic font-bold',
    isCentered: true,
    layoutVariant: 'editorial',
    defaultBadgeText: 'Scholars • Researchers • Academic Leaders',
    defaultTitle: 'Distinguished Faculty',
    primaryBtn: 'bg-emerald-800 hover:bg-emerald-900 text-amber-300 font-serif font-bold text-xs px-6 py-2.5 rounded-xl border border-amber-400/30 shadow-sm',
  },

  // Events Section (Academic Convocations & Cultural Fetes)
  events: {
    sectionBg: 'py-8 sm:py-10 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 border-y border-stone-200 dark:border-stone-800',
    sectionHeaderBadge: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 font-serif italic text-xs tracking-wider uppercase',
    headingFont: 'font-serif font-bold text-stone-900 dark:text-white text-2xl sm:text-3xl tracking-normal drop-shadow-xs',
    subtitleFont: 'font-serif italic text-stone-600 dark:text-stone-400 text-xs sm:text-sm',
    cardBg: 'bg-[#faf8f5] dark:bg-stone-950 rounded-xl p-4 sm:p-5 shadow-xs hover:shadow-lg transition duration-300 border border-stone-200/90 dark:border-stone-800 text-stone-900 dark:text-stone-100',
    cardBorder: 'border-stone-200/90 dark:border-stone-800 hover:border-emerald-600 dark:hover:border-emerald-500',
    cardHover: 'hover:-translate-y-1',
    dateBadge: 'bg-emerald-800 dark:bg-emerald-700 text-white font-serif font-bold',
    accentText: 'text-emerald-800 dark:text-emerald-400 hover:text-emerald-950 font-serif font-bold',
    isCentered: false,
    layoutVariant: 'split',
    defaultBadgeText: 'Cultural Calendar & Convocations',
    defaultTitle: 'Upcoming Events & Literary Symposia',
    primaryBtn: 'bg-emerald-800 hover:bg-emerald-900 text-amber-300 font-serif font-bold text-xs',
  },

  // News Section (Campus Chronicles & Research Gazettes)
  news: {
    sectionBg: 'bg-[#fcfaf7] dark:bg-stone-950',
    sectionHeaderBadge: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 font-serif italic text-xs tracking-wider uppercase shadow-2xs',
    headingFont: 'font-serif font-bold text-stone-900 dark:text-white text-2xl sm:text-3xl tracking-tight sm:tracking-normal drop-shadow-xs',
    subtitleFont: 'font-serif italic text-stone-600 dark:text-stone-400 text-xs sm:text-sm',
    cardBg: 'bg-white dark:bg-stone-900 rounded-xl p-3.5 sm:p-4 shadow-xs hover:shadow-lg transition-all duration-300 border text-stone-900 dark:text-stone-100 relative overflow-hidden group flex flex-col justify-between',
    cardBorder: 'border border-stone-200/90 dark:border-stone-800 hover:border-emerald-600 dark:hover:border-emerald-500',
    cardTopAccent: 'bg-gradient-to-r from-emerald-700 via-amber-400 to-emerald-800',
    cardHover: 'hover:-translate-y-1',
    datePill: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800 font-serif font-bold text-[10px] px-2 py-0.5 rounded-full',
    tagBadge: 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800 font-serif text-[9px] uppercase font-bold px-2 py-0.5 rounded-full',
    accentText: 'text-emerald-800 dark:text-emerald-400 hover:text-emerald-950 dark:hover:text-emerald-300 font-serif font-bold text-xs',
    cardTitleFont: 'font-serif font-bold text-stone-900 dark:text-white group-hover:text-emerald-800 dark:group-hover:text-emerald-400 transition-colors text-sm sm:text-base leading-snug',
    cardDescFont: 'text-stone-600 dark:text-stone-300 font-serif text-xs line-clamp-2 leading-relaxed',
    isCentered: false,
    layoutVariant: 'split',
    defaultBadgeText: 'Campus Chronicles',
    defaultTitle: 'Latest News',
    defaultSubtitle: 'Latest happenings, scholarly achievements, and dispatches across our vibrant community.',
    showBottomCta: false,
    bottomCtaText: 'View All News & Dispatches',
    primaryBtn: 'inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-emerald-800 to-emerald-900 hover:from-emerald-700 hover:to-emerald-800 text-amber-300 font-serif font-bold text-xs tracking-wider uppercase shadow-xs transition-all duration-200 border border-amber-400/30',
  },

  // Notices Section (Official Gazettes & Bulletins)
  notices: {
    sectionBg: 'py-8 sm:py-10 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 border-y border-stone-100 dark:border-stone-800',
    sectionHeaderBadge: 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-serif italic text-xs px-3 py-0.5 rounded-full',
    headingFont: 'font-serif font-bold text-stone-900 dark:text-white text-2xl sm:text-3xl',
    subtitleFont: 'font-serif italic text-stone-600 dark:text-stone-400 text-xs sm:text-sm',
    cardBg: 'bg-[#faf8f5] dark:bg-stone-950/80 border border-stone-200 dark:border-stone-800 rounded-xl p-4 sm:p-5',
    cardBorder: 'border-stone-200',
    noticeItemBg: 'bg-white dark:bg-stone-900 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 transition border border-stone-200 dark:border-stone-800 rounded-lg p-3.5 sm:p-4',
    noticeItemBorder: 'border-stone-200 hover:border-emerald-600',
    dateBadge: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-serif text-xs font-bold px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800',
    accentText: 'text-emerald-800 dark:text-emerald-400 hover:text-emerald-950 font-serif font-bold',
    isCentered: true,
    defaultBadgeText: 'Academic Gazette',
    defaultTitle: 'Official College Circulars & Notifications',
  },

  // Gallery Section (Heritage Gallery)
  gallery: {
    sectionBg: 'py-8 sm:py-10 bg-stone-950 text-stone-100',
    sectionHeaderBadge: 'bg-emerald-950/80 text-amber-300 border border-amber-400/40 text-xs font-serif uppercase tracking-widest',
    headingFont: 'font-serif font-bold text-white text-2xl sm:text-3xl',
    subtitleFont: 'font-serif italic text-stone-300 text-xs sm:text-sm',
    tabActive: 'bg-gradient-to-r from-emerald-800 to-emerald-900 text-amber-300 font-serif font-bold border border-amber-400/40',
    tabInactive: 'bg-stone-900 text-stone-300 hover:bg-stone-800 font-serif',
    imageBorder: 'border border-stone-800 rounded-xl overflow-hidden',
    overlayGradient: 'bg-gradient-to-t from-stone-950 via-stone-950/60 to-transparent',
    accentText: 'text-amber-400 font-serif font-bold',
    isCentered: true,
    defaultBadgeText: 'Institutional Heritage',
    defaultTitle: 'Campus Grounds & Historic Archives',
  },

  // FAQ Section
  faq: {
    sectionBg: 'py-8 sm:py-10 bg-[#faf8f5] dark:bg-stone-950 text-stone-900 dark:text-stone-100 border-y border-stone-200 dark:border-stone-800',
    sectionHeaderBadge: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-serif italic text-xs px-3 py-0.5 rounded-full',
    headingFont: 'font-serif font-bold text-stone-900 dark:text-white text-2xl sm:text-3xl',
    subtitleFont: 'font-serif italic text-stone-600 dark:text-stone-400 text-xs sm:text-sm',
    itemBg: 'bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl',
    itemBorder: 'border-stone-200',
    itemHover: 'hover:border-emerald-600',
    questionFont: 'font-serif font-bold text-stone-900 dark:text-white text-sm sm:text-base',
    answerFont: 'font-serif text-stone-600 dark:text-stone-300 text-xs sm:text-sm leading-relaxed',
    accentColor: 'text-emerald-700',
    isCentered: true,
    defaultBadgeText: 'Scholastic Guidance',
    defaultTitle: 'Frequently Asked Inquiries',
  },

  // Contact Section
  contact: {
    sectionBg: 'py-8 sm:py-10 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 border-y border-stone-200 dark:border-stone-800',
    sectionHeaderBadge: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-serif italic text-xs px-3 py-0.5 rounded-full',
    headingFont: 'font-serif font-bold text-stone-900 dark:text-white text-2xl sm:text-3xl',
    subtitleFont: 'font-serif italic text-stone-600 dark:text-stone-400 text-xs sm:text-sm',
    cardBg: 'bg-[#faf8f5] dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl p-4 sm:p-6',
    cardBorder: 'border-stone-200',
    inputBg: 'bg-white dark:bg-stone-900',
    inputBorder: 'border-stone-200 dark:border-stone-700 focus:border-emerald-600 focus:ring-emerald-600/20',
    submitBtn: 'bg-emerald-800 hover:bg-emerald-900 text-amber-300 font-serif font-bold uppercase tracking-wider text-xs py-2.5 px-5 rounded-lg shadow-sm border border-amber-400/30',
    infoIconBg: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800',
    accentText: 'text-emerald-800 dark:text-emerald-400 font-serif font-bold',
    isCentered: true,
    defaultBadgeText: 'Admissions & Secretariat',
    defaultTitle: 'Connect With the Academic Registry',
  },

  // Call to Action (CTA)
  cta: {
    sectionBg: 'py-16 sm:py-20 bg-gradient-to-br from-emerald-900 via-emerald-950 to-stone-900 text-white relative overflow-hidden shadow-2xl',
    badgeClass: 'bg-emerald-900/80 border-amber-400/40 text-amber-300 font-serif uppercase tracking-widest',
    headlineFont: 'font-serif font-bold text-white text-3xl sm:text-4xl lg:text-5xl',
    subheadlineFont: 'font-serif italic text-emerald-100 text-base sm:text-lg',
    primaryBtnClass: 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-serif font-bold shadow-xl shadow-amber-950/40',
    secondaryBtnClass: 'bg-emerald-950/80 hover:bg-emerald-900 border-amber-400/40 text-amber-200 font-serif',
  },

  // Cards Section
  cards: {
    headingFont: 'font-serif font-bold text-stone-900 dark:text-white',
    cardBorder: 'border border-stone-200 hover:border-emerald-600',
    cardBg: 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-sm',
    badge: 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-serif text-xs',
    isCentered: true,
  },

  // Icon Cards Section
  iconCards: {
    sectionBg: 'py-16 bg-[#faf8f5] dark:bg-stone-950 text-stone-900 dark:text-stone-100 border-y border-stone-200 dark:border-stone-800',
    sectionHeaderBadge: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 font-serif italic text-xs px-3.5 py-1 rounded-full',
    headingFont: 'font-serif font-bold text-stone-900 dark:text-white text-3xl sm:text-4xl',
    subtitleFont: 'font-serif italic text-stone-600 dark:text-stone-400 text-base',
    cardBg: 'bg-white dark:bg-stone-900 rounded-2xl p-6 shadow-xs hover:shadow-xl border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100 text-center',
    cardBorder: 'border-stone-200 hover:border-emerald-600',
    iconBox: 'w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 flex items-center justify-center mx-auto',
    isCentered: true,
  },

  // Image & Text Section
  imageText: {
    sectionBg: 'py-16 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 border-y border-stone-100 dark:border-stone-800',
    badgeClass: 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-serif italic text-xs px-3 py-1 rounded-full',
    headingFont: 'font-serif font-bold text-stone-900 dark:text-white text-3xl sm:text-4xl',
    bodyFont: 'font-serif text-stone-600 dark:text-stone-300 leading-relaxed text-sm sm:text-base',
    primaryBtnClass: 'bg-emerald-800 hover:bg-emerald-900 text-amber-300 font-serif font-bold text-xs px-5 py-2.5 rounded-xl border border-amber-400/30 shadow-sm',
    secondaryBtnClass: 'bg-stone-100 hover:bg-stone-200 text-stone-800 font-serif font-bold text-xs px-5 py-2.5 rounded-xl',
    imageBorder: 'rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xl overflow-hidden',
  },

  // Logo Grid Section
  logoGrid: {
    sectionBg: 'py-12 bg-[#faf8f5] dark:bg-stone-950 border-y border-stone-200 dark:border-stone-800',
    headingFont: 'font-serif text-xs uppercase font-bold text-stone-500 tracking-wider text-center',
    subtitleFont: 'font-serif italic text-xs text-stone-400 text-center',
    cardBg: 'bg-white dark:bg-stone-900 rounded-xl p-4 shadow-2xs border border-stone-200 dark:border-stone-800 flex items-center justify-center grayscale hover:grayscale-0 transition',
    cardBorder: 'border-stone-200 hover:border-emerald-600',
  },
};
