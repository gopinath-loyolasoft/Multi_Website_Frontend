import { ModuleThemeStyles } from '../contracts/ThemeStyles';

export const MEDICAL_THEME: ModuleThemeStyles = {
  // Hero Section
  hero: {
    overlayGradient: {
      backgroundImage: 'linear-gradient(to right, rgba(17, 24, 39, 0.94) 0%, rgba(15, 23, 42, 0.80) 45%, rgba(13, 148, 136, 0.25) 100%)',
    },
    vignetteStyle: {
      background: 'linear-gradient(to top, rgba(15, 23, 42, 0.85) 0%, transparent 40%, rgba(15, 23, 42, 0.30) 100%)',
    },
    imageOpacity: 'opacity-85',
    badgeClass: 'bg-teal-950/90 border-teal-400/50 text-teal-300 font-sans tracking-wide',
    badgeIconClass: 'text-teal-400',
    headingClass: 'font-sans font-bold text-white tracking-tight',
    descriptionClass: 'font-sans text-teal-100/90 font-normal',
    primaryBtnClass: 'bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold shadow-teal-900/30',
    secondaryBtnClass: 'bg-slate-900/80 hover:bg-slate-800 border-teal-400/40 text-teal-200 font-bold',
    checkColor: 'text-teal-400',
    rightCardBorder: 'border-teal-400/40 bg-slate-900/90 shadow-2xl text-white',
    cardIconClass: 'bg-teal-400/15 border-teal-400/40 text-teal-300',
    cardSubtitleColor: 'text-teal-300/90 font-sans',
  },

  // Hero Slider
  heroSlider: {
    overlayStyle: {
      backgroundImage: 'linear-gradient(to right, rgba(15, 23, 42, 0.94) 0%, rgba(13, 148, 136, 0.70) 50%, rgba(15, 23, 42, 0.35) 100%)',
    },
    badgeClass: 'bg-teal-950/90 border-teal-400/50 text-teal-300 font-sans',
    badgeIconClass: 'text-teal-400',
    headlineClass: 'font-sans font-bold text-white tracking-tight',
    primaryBtnClass: 'bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold shadow-teal-900/30',
    dotActiveClass: 'w-8 bg-teal-400 shadow-md shadow-teal-400/50',
    rightCardBorder: 'bg-slate-900/90 border-teal-400/40 shadow-2xl text-white',
    defaultBgImage: '/assets/templates/medical/banner1.svg',
  },

  // Statistics Section (Clinical High-Precision & Vitality Motif)
  statistics: {
    sectionBg: 'bg-teal-50/40 text-slate-900 border-y border-teal-100',
    bgPatternOverlay: {
      backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(13, 148, 136, 0.08) 1px, transparent 0)',
      backgroundSize: '24px 24px',
      opacity: 1,
    },
    headerAlignment: 'text-center max-w-2xl mx-auto',
    headerBadge: 'bg-teal-100/80 border-teal-300 text-teal-900 font-sans font-bold',
    headerTitleFont: 'font-sans font-extrabold text-slate-900',
    headerSubtitleFont: 'font-sans text-slate-600',
    cardContainer: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5',
    cardBg: 'bg-[#f8fffe] border border-[#ccfbf1] hover:border-teal-400 rounded-[16px] p-5 shadow-[0_5px_18px_rgba(15,118,110,0.06)] hover:shadow-[0_10px_24px_rgba(15,118,110,0.12)] transition-all duration-200 transform hover:-translate-y-1 text-slate-900',
    cardTopAccent: '',
    iconBox: 'w-[38px] h-[38px] rounded-[10px] bg-[#ecfeff] border border-[#a5f3fc] text-[#0891b2] flex items-center justify-center mb-2.5',
    valueFont: 'font-sans font-extrabold text-[#134e4a] text-[27px] tracking-tight leading-none',
    suffixFont: 'font-sans text-teal-600 font-bold',
    labelFont: 'font-sans text-[10px] font-bold text-[#64748b] uppercase tracking-[0.08em]',
    tagBadge: 'text-[10px] font-sans uppercase px-2 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200',
  },

  // Quote / Leadership Section (Chief Medical Officer / Dean's Suite)
  quote: {
    sectionBg: 'bg-teal-50/20 text-slate-900 border-y border-teal-100',
    isCentered: false,
    layoutContainer: 'max-w-5xl mx-auto',
    photoContainer: 'w-full md:w-64 bg-teal-50/70 border border-teal-200/80 rounded-xl p-5',
    photoFrame: 'w-[86px] h-[86px] rounded-full overflow-hidden border-[3px] border-white shadow-md bg-white',
    quoteBox: 'flex-1',
    cardBg: 'bg-white border border-teal-200/80 rounded-2xl shadow-[0_8px_24px_rgba(13,148,136,0.06)]',
    cardTopAccent: 'bg-gradient-to-r from-teal-500 via-cyan-400 to-teal-600',
    profileBg: 'bg-gradient-to-b from-teal-50/80 to-slate-50/60 border border-teal-100/90',
    avatarRing: 'ring-teal-400/40',
    footerLabel: 'Office of Medical Dean',
    quoteTextFont: 'font-serif font-medium text-slate-900 text-lg sm:text-[19px] leading-[1.6]',
    authorNameFont: 'font-sans font-bold text-slate-900 text-[15px] sm:text-[16px] tracking-tight',
    authorTitleFont: 'font-sans text-xs text-teal-700 font-bold',
    subTextFont: 'font-sans text-[11px] text-slate-500',
    badgeClass: 'text-[11px] font-sans uppercase font-bold tracking-wider text-teal-800 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full',
    iconColor: 'text-teal-500',
  },

  // Departments Section (Clinical Specialties & Super-Specialty Divisions)
  departments: {
    sectionBg: 'py-8 sm:py-10 bg-slate-50 text-slate-900 border-y border-slate-200',
    sectionHeaderBadge: 'bg-teal-100 text-teal-800 border border-teal-300 text-xs font-sans font-bold uppercase',
    headingFont: 'font-sans font-bold tracking-tight text-slate-900 text-2xl sm:text-3xl',
    subtitleFont: 'font-sans text-slate-600 text-xs sm:text-sm',
    cardBorder: 'border border-slate-200 hover:border-teal-500',
    cardBg: 'bg-white rounded-xl p-4 sm:p-5 shadow-xs hover:shadow-lg transition duration-300 border text-slate-900',
    cardHover: 'hover:-translate-y-1',
    iconBg: 'bg-teal-50 text-teal-600 border border-teal-200',
    accentText: 'text-teal-600 hover:text-teal-800 font-bold',
    tagBadge: 'bg-slate-100 text-slate-700 border border-slate-200 font-sans text-[10px] uppercase font-bold',
    isCentered: false,
    defaultBadgeText: 'Medical & Clinical Faculties',
    defaultTitle: 'Clinical Departments & Specialty Wings',
    defaultSubtitle: 'Comprehensive specialty wings, clinical clerkships, and advanced healthcare training facilities.',
    showBottomCta: false,
  },

  // Courses Section (Medical Programs & Residencies)
  courses: {
    sectionBg: 'py-8 sm:py-10 bg-white text-slate-900 border-y border-slate-100',
    sectionHeaderBadge: 'bg-rose-100 text-rose-800 border border-rose-300 text-xs font-sans font-bold uppercase',
    headingFont: 'font-sans font-bold tracking-tight text-slate-900 text-2xl sm:text-3xl',
    subtitleFont: 'font-sans text-slate-600 text-xs sm:text-sm',
    cardBorder: 'border border-slate-200 hover:border-rose-400',
    cardBg: 'bg-slate-50/70 rounded-xl p-4 sm:p-5 shadow-xs hover:shadow-lg transition duration-300 border text-slate-900',
    badge: 'bg-rose-50 text-rose-800 border border-rose-200 font-sans text-[10px] uppercase font-bold',
    accentText: 'text-rose-700 hover:text-rose-900 font-bold',
    primaryBtn: 'bg-teal-600 hover:bg-teal-700 text-white font-bold uppercase text-xs shadow-sm',
    iconColor: 'text-rose-600',
    isCentered: false,
    defaultBadgeText: 'Medical & Health Degree Programs',
    defaultTitle: 'Clinical & Medical Degrees',
    cardHover: 'hover:-translate-y-1',
  },

  // Faculty Section (Clinical Consultants & Chief Surgeons)
  faculty: {
    sectionBg: 'py-8 sm:py-10 bg-teal-50/30 text-slate-900 border-y border-teal-100',
    sectionHeaderBadge: 'bg-teal-100 text-teal-800 border border-teal-300 text-xs font-sans font-bold uppercase',
    headingFont: 'font-sans font-bold tracking-tight text-slate-900 text-2xl sm:text-3xl',
    subtitleFont: 'font-sans text-slate-600 text-xs sm:text-sm',
    cardBg: 'bg-[#f8fffe] rounded-2xl p-5 shadow-xs hover:shadow-lg transition duration-300 border border-[#ccfbf1] hover:border-teal-400 text-slate-900',
    cardBorder: 'border-[#ccfbf1] hover:border-teal-400',
    cardHover: 'hover:-translate-y-1',
    avatarBorder: 'border-2 border-teal-500/30',
    roleFont: 'font-sans text-xs text-teal-700 font-bold',
    accentText: 'text-teal-600 hover:text-teal-800 font-bold',
    isCentered: false,
    layoutVariant: 'clinical',
    defaultBadgeText: 'Senior Consultants & Medical Faculty',
    defaultTitle: 'Clinical Faculty & Specialists',
    primaryBtn: 'bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-sm',
  },

  // Events Section (Medical CMEs & Clinical Workshops)
  events: {
    sectionBg: 'py-8 sm:py-10 bg-white text-slate-900 border-y border-slate-100',
    sectionHeaderBadge: 'bg-rose-100 text-rose-800 border border-rose-300 text-xs font-sans font-bold uppercase',
    headingFont: 'font-sans font-bold tracking-tight text-slate-900 text-2xl sm:text-3xl',
    subtitleFont: 'font-sans text-slate-600 text-xs sm:text-sm',
    cardBg: 'bg-[#f8fffe] rounded-xl p-4 sm:p-5 shadow-xs hover:shadow-lg transition duration-300 border border-[#ccfbf1] text-slate-900',
    cardBorder: 'border-[#ccfbf1] hover:border-teal-400',
    cardHover: 'hover:-translate-y-1',
    dateBadge: 'bg-teal-700 text-white font-bold',
    accentText: 'text-teal-600 hover:text-teal-800 font-bold',
    isCentered: false,
    layoutVariant: 'clinical',
    defaultBadgeText: 'CME & Clinical Conferences',
    defaultTitle: 'Upcoming Medical Seminars & Surgical Workshops',
    primaryBtn: 'bg-teal-600 hover:bg-teal-700 text-white font-bold uppercase text-xs',
  },

  // News Section (Clinical Research & Hospital Dispatches)
  news: {
    sectionBg: 'py-8 sm:py-10 bg-slate-50 text-slate-900 border-y border-slate-200',
    sectionHeaderBadge: 'bg-teal-100 text-teal-800 border border-teal-300 text-xs font-sans font-bold uppercase',
    headingFont: 'font-sans font-bold tracking-tight text-slate-900 text-2xl sm:text-3xl',
    subtitleFont: 'font-sans text-slate-600 text-xs sm:text-sm',
    cardBg: 'bg-white rounded-xl p-4 shadow-xs hover:shadow-md transition duration-300 border border-slate-200 text-slate-900',
    cardBorder: 'border-slate-200 hover:border-teal-400',
    cardHover: 'hover:-translate-y-0.5',
    datePill: 'bg-slate-100 text-slate-600 text-[11px]',
    tagBadge: 'bg-teal-50 text-teal-700 border border-teal-200 text-[10px] uppercase font-bold',
    accentText: 'text-teal-600 hover:text-teal-800 font-bold',
    isCentered: false,
    layoutVariant: 'clinical',
    defaultBadgeText: 'Medical Bulletins',
    defaultTitle: 'Clinical Advances & Health Science News',
    primaryBtn: 'bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs',
  },

  // Notices Section (Clinical Circulars & Hospital Guidelines)
  notices: {
    sectionBg: 'py-8 sm:py-10 bg-white text-slate-900 border-y border-slate-100',
    sectionHeaderBadge: 'bg-rose-100 text-rose-800 border border-rose-300 text-xs font-sans font-bold uppercase',
    headingFont: 'font-sans font-bold tracking-tight text-slate-900 text-2xl sm:text-3xl',
    subtitleFont: 'font-sans text-slate-600 text-xs sm:text-sm',
    cardBg: 'bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5',
    cardBorder: 'border-slate-200',
    noticeItemBg: 'bg-white hover:bg-teal-50/50 transition border border-slate-200 rounded-lg p-3.5 sm:p-4',
    noticeItemBorder: 'border-slate-200 hover:border-teal-400',
    dateBadge: 'bg-rose-50 text-rose-700 text-xs font-bold px-2 py-0.5 rounded-md border border-rose-200',
    accentText: 'text-rose-600 hover:text-rose-800 font-bold',
    isCentered: false,
    defaultBadgeText: 'Hospital & Academic Protocols',
    defaultTitle: 'Clinical Protocols & Student Circulars',
  },

  // Gallery Section (Clinical Facilities & Simulation Labs)
  gallery: {
    sectionBg: 'py-8 sm:py-10 bg-slate-900 text-white',
    sectionHeaderBadge: 'bg-teal-900/60 text-teal-300 border border-teal-700 text-xs font-sans font-bold uppercase',
    headingFont: 'font-sans font-bold tracking-tight text-white text-2xl sm:text-3xl',
    subtitleFont: 'font-sans text-slate-300 text-xs sm:text-sm',
    tabActive: 'bg-teal-600 text-white font-bold',
    tabInactive: 'bg-slate-800 text-slate-300 hover:bg-slate-700',
    imageBorder: 'border border-slate-800 rounded-xl overflow-hidden',
    overlayGradient: 'bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent',
    accentText: 'text-teal-400 font-bold',
    isCentered: false,
    defaultBadgeText: 'Hospital & Campus Infrastructure',
    defaultTitle: 'State-of-the-Art OTs & Diagnostic Centers',
  },

  // FAQ Section
  faq: {
    sectionBg: 'py-8 sm:py-10 bg-slate-50 text-slate-900 border-y border-slate-200',
    sectionHeaderBadge: 'bg-teal-100 text-teal-800 border border-teal-300 text-xs font-sans font-bold uppercase',
    headingFont: 'font-sans font-bold tracking-tight text-slate-900 text-2xl sm:text-3xl',
    subtitleFont: 'font-sans text-slate-600 text-xs sm:text-sm',
    itemBg: 'bg-white border border-slate-200 rounded-xl',
    itemBorder: 'border-slate-200',
    itemHover: 'hover:border-teal-400',
    questionFont: 'font-sans font-bold text-slate-900 text-sm sm:text-base',
    answerFont: 'font-sans text-slate-600 text-xs sm:text-sm leading-relaxed',
    accentColor: 'text-teal-600',
    isCentered: false,
    defaultBadgeText: 'Medical Admissions & FAQs',
    defaultTitle: 'Frequently Asked Questions',
  },

  // Contact Section
  contact: {
    sectionBg: 'py-8 sm:py-10 bg-white text-slate-900 border-y border-slate-200',
    sectionHeaderBadge: 'bg-teal-100 text-teal-800 border border-teal-300 text-xs font-sans font-bold uppercase',
    headingFont: 'font-sans font-bold tracking-tight text-slate-900 text-2xl sm:text-3xl',
    subtitleFont: 'font-sans text-slate-600 text-xs sm:text-sm',
    cardBg: 'bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-6',
    cardBorder: 'border-slate-200',
    inputBg: 'bg-white',
    inputBorder: 'border-slate-200 focus:border-teal-500 focus:ring-teal-500/20',
    submitBtn: 'bg-teal-600 hover:bg-teal-700 text-white font-bold uppercase tracking-wider text-xs py-2.5 px-5 rounded-lg shadow-sm',
    infoIconBg: 'bg-teal-50 text-teal-600 border border-teal-200',
    accentText: 'text-teal-600 font-bold',
    isCentered: false,
    defaultBadgeText: 'Patient Care & Admissions Helpdesk',
    defaultTitle: 'Contact Our Medical Campus & Hospital Wing',
  },

  // Call to Action (CTA)
  cta: {
    sectionBg: 'py-10 sm:py-14 bg-gradient-to-r from-teal-900 via-cyan-950 to-slate-900 text-white relative overflow-hidden shadow-xl',
    badgeClass: 'bg-teal-950/80 border-teal-400/50 text-teal-300 font-sans font-bold uppercase text-xs',
    headlineFont: 'font-sans font-bold tracking-tight text-white text-2xl sm:text-3xl lg:text-4xl',
    subheadlineFont: 'font-sans text-teal-100 text-xs sm:text-sm',
    primaryBtnClass: 'bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold uppercase tracking-wide shadow-md text-xs px-5 py-2.5 rounded-lg',
    secondaryBtnClass: 'bg-slate-900/80 hover:bg-slate-800 border-teal-400/40 text-white font-bold text-xs px-5 py-2.5 rounded-lg',
  },

  // Cards Section
  cards: {
    headingFont: 'font-sans font-bold uppercase text-slate-900 text-2xl sm:text-3xl',
    cardBorder: 'border border-slate-200 hover:border-teal-500',
    cardBg: 'bg-white text-slate-900 shadow-xs rounded-xl p-4 sm:p-5',
    badge: 'bg-teal-50 text-teal-700 border border-teal-200 font-sans text-xs',
    isCentered: false,
  },

  // Icon Cards Section
  iconCards: {
    sectionBg: 'py-16 bg-slate-50 text-slate-900 border-y border-slate-200',
    sectionHeaderBadge: 'bg-teal-100 text-teal-800 border border-teal-300 text-xs font-sans font-bold uppercase',
    headingFont: 'font-sans font-bold tracking-tight text-slate-900 text-3xl sm:text-4xl',
    subtitleFont: 'font-sans text-slate-600 text-sm',
    cardBg: 'bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl border border-slate-200 text-slate-900',
    cardBorder: 'border-slate-200 hover:border-teal-500',
    iconBox: 'w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 text-teal-600 flex items-center justify-center',
    isCentered: false,
  },

  // Image & Text Section
  imageText: {
    sectionBg: 'py-16 bg-white text-slate-900 border-y border-slate-100',
    badgeClass: 'bg-teal-100 text-teal-800 border border-teal-300 text-xs font-sans font-bold uppercase',
    headingFont: 'font-sans font-bold tracking-tight text-slate-900 text-3xl sm:text-4xl',
    bodyFont: 'font-sans text-slate-600 leading-relaxed text-sm sm:text-base',
    primaryBtnClass: 'bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm',
    secondaryBtnClass: 'bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-5 py-2.5 rounded-xl',
    imageBorder: 'rounded-2xl border border-slate-200 shadow-lg overflow-hidden',
  },

  // Logo Grid Section
  logoGrid: {
    sectionBg: 'py-12 bg-slate-50 border-y border-slate-200',
    headingFont: 'font-sans text-xs uppercase font-bold text-slate-500 tracking-wider text-center',
    subtitleFont: 'font-sans text-xs text-slate-400 text-center',
    cardBg: 'bg-white rounded-xl p-4 shadow-2xs border border-slate-200 flex items-center justify-center grayscale hover:grayscale-0 transition',
    cardBorder: 'border-slate-200 hover:border-teal-400',
  },
};
