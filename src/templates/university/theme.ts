import { ModuleThemeStyles } from '../contracts/ThemeStyles';

export const UNIVERSITY_THEME: ModuleThemeStyles = {
  // Hero Section
  hero: {
    overlayGradient: {
      backgroundImage: 'linear-gradient(to right, rgba(136, 19, 55, 0.95) 0%, rgba(30, 58, 138, 0.85) 55%, rgba(15, 23, 42, 0.50) 100%)',
    },
    vignetteStyle: {
      background: 'linear-gradient(to top, rgba(15, 23, 42, 0.85) 0%, transparent 45%, rgba(136, 19, 55, 0.40) 100%)',
    },
    imageOpacity: 'opacity-85',
    badgeClass: 'bg-rose-950/90 border-amber-400/50 text-amber-300 font-serif tracking-widest',
    badgeIconClass: 'text-amber-400',
    headingClass: 'font-serif text-white tracking-normal',
    descriptionClass: 'font-sans text-rose-100/90 font-light',
    primaryBtnClass: 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-serif font-bold shadow-amber-950/40',
    secondaryBtnClass: 'bg-rose-950/80 hover:bg-rose-900 border-amber-400/40 text-amber-200 font-serif',
    checkColor: 'text-amber-400',
    rightCardBorder: 'border-amber-400/40 bg-slate-950/90 shadow-2xl text-white',
    cardIconClass: 'bg-amber-400/10 border-amber-400/40 text-amber-300',
    cardSubtitleColor: 'text-amber-300/80 font-serif italic',
  },

  // Hero Slider
  heroSlider: {
    overlayStyle: {
      backgroundImage: 'linear-gradient(to right, rgba(136, 19, 55, 0.95) 0%, rgba(30, 58, 138, 0.80) 50%, rgba(15, 23, 42, 0.40) 100%)',
    },
    badgeClass: 'bg-rose-950/90 border-amber-400/50 text-amber-300 font-serif',
    badgeIconClass: 'text-amber-400',
    headlineClass: 'font-serif text-white tracking-normal',
    primaryBtnClass: 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-serif font-bold shadow-amber-950/40',
    dotActiveClass: 'w-8 bg-amber-400 shadow-md shadow-amber-400/50',
    rightCardBorder: 'bg-slate-950/90 border-amber-400/40 shadow-2xl text-white',
    defaultBgImage: '/assets/templates/university/banner1.svg',
  },

  // Statistics Section (Collegiate Research Authority & Distinction)
  statistics: {
    sectionBg: 'bg-stone-50 text-slate-900 border-y border-stone-200',
    bgPatternOverlay: {
      backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(136, 19, 55, 0.08) 1px, transparent 0)',
      backgroundSize: '28px 28px',
      opacity: 1,
    },
    headerAlignment: 'text-center max-w-2xl mx-auto',
    headerBadge: 'bg-rose-50 border-rose-200 text-rose-900 font-serif italic text-xs',
    headerTitleFont: 'font-serif font-bold text-slate-900',
    headerSubtitleFont: 'font-sans text-slate-600',
    cardContainer: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5',
    cardBg: 'bg-gradient-to-br from-[#111827] to-[#172554] border border-[#d4af37]/40 hover:border-[#d4af37]/80 rounded-[12px] p-[22px_18px] shadow-[0_12px_30px_rgba(15,23,42,0.18)] hover:shadow-[0_16px_36px_rgba(15,23,42,0.25)] transition-all duration-200 transform hover:-translate-y-1 text-white',
    cardTopAccent: '',
    iconBox: 'w-[38px] h-[38px] rounded-lg bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#d4af37] flex items-center justify-center mb-2.5',
    valueFont: 'font-sans font-extrabold text-[#f8fafc] text-[30px] tracking-tight leading-none',
    suffixFont: 'font-sans text-[#d4af37] font-bold',
    labelFont: 'font-sans text-[10px] font-bold text-[#d4af37] uppercase tracking-[.12em] mt-1',
    tagBadge: 'text-[10px] font-serif uppercase px-2 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200',
  },

  // Quote / Leadership Section (Vice-Chancellor / President's Office)
  quote: {
    sectionBg: 'bg-[#faf8f6] text-slate-900 border-y border-stone-200',
    isCentered: true,
    layoutContainer: 'max-w-4xl mx-auto text-center space-y-4',
    photoContainer: 'flex flex-col items-center space-y-2 mt-3',
    photoFrame: 'w-[86px] h-[86px] rounded-full overflow-hidden border-[3px] border-white shadow-md mx-auto bg-stone-100',
    quoteBox: 'flex-1',
    cardBg: 'bg-white border border-stone-200 rounded-2xl shadow-[0_8px_24px_rgba(15,23,42,0.06)]',
    cardTopAccent: 'bg-gradient-to-r from-rose-700 via-amber-500 to-rose-800',
    avatarRing: 'ring-rose-900/30',
    footerLabel: 'Office of the Vice-Chancellor',
    quoteTextFont: 'font-serif italic text-slate-800 text-lg sm:text-[19px] leading-[1.6]',
    authorNameFont: 'font-serif font-bold text-slate-900 text-[16px] tracking-wide',
    authorTitleFont: 'font-sans text-xs text-rose-900 font-bold',
    subTextFont: 'font-sans text-[11px] text-slate-500',
    badgeClass: 'text-[11px] font-serif uppercase tracking-widest text-rose-900 bg-rose-50 border border-rose-200 px-3.5 py-1 rounded-full inline-block font-bold',
    iconColor: 'text-amber-500',
  },

  // Departments Section (University Faculties & Institutes)
  departments: {
    sectionBg: 'py-8 sm:py-10 bg-stone-50 text-slate-900 border-y border-stone-200',
    sectionHeaderBadge: 'bg-rose-50 text-rose-900 border border-rose-200 text-xs font-serif italic',
    headingFont: 'font-serif font-bold tracking-tight text-slate-900 text-2xl sm:text-3xl',
    subtitleFont: 'font-sans text-slate-600 text-xs sm:text-sm',
    cardBorder: 'border border-stone-200 hover:border-rose-700',
    cardBg: 'bg-white rounded-xl p-4 sm:p-5 shadow-xs hover:shadow-lg transition duration-300 border text-slate-900',
    cardHover: 'hover:-translate-y-1',
    iconBg: 'bg-rose-50 text-rose-800 border border-rose-200',
    accentText: 'text-rose-800 hover:text-rose-950 font-serif font-bold',
    tagBadge: 'bg-stone-100 text-stone-700 border border-stone-200 font-sans text-[10px] uppercase font-bold',
    isCentered: true,
    defaultBadgeText: 'University Schools & Colleges',
    defaultTitle: 'Faculties & Research Schools',
    defaultSubtitle: 'World-class academic divisions spanning humanities, sciences, law, and doctoral institutes.',
    showBottomCta: false,
    cardTitleFont: 'font-serif text-slate-900',
    cardDescFont: 'text-slate-600 font-sans',
  },

  // Courses Section (Undergraduate, Postgraduate & Doctoral Degrees)
  courses: {
    sectionBg: 'py-8 sm:py-10 bg-white text-slate-900 border-y border-stone-100',
    sectionHeaderBadge: 'bg-amber-50 text-amber-900 border border-amber-200 text-xs font-serif italic',
    headingFont: 'font-serif font-bold tracking-tight text-slate-900 text-2xl sm:text-3xl',
    subtitleFont: 'font-sans text-slate-600 text-xs sm:text-sm',
    cardBorder: 'border border-stone-200 hover:border-amber-500',
    cardBg: 'bg-stone-50/70 rounded-xl p-4 sm:p-5 shadow-xs hover:shadow-lg transition duration-300 border text-slate-900',
    badge: 'bg-amber-50 text-amber-900 border border-amber-200 font-serif text-[10px] uppercase font-bold',
    accentText: 'text-amber-900 hover:text-amber-950 font-serif font-bold',
    primaryBtn: 'bg-rose-900 hover:bg-rose-950 text-white font-serif font-bold text-xs shadow-xs',
    iconColor: 'text-amber-600',
    isCentered: true,
    defaultBadgeText: 'Faculties & Degree Programs',
    defaultTitle: 'University Curricula & Degrees',
    cardHover: 'hover:-translate-y-1',
  },

  // Faculty Section (University Chairs & Distinguished Scholars)
  faculty: {
    sectionBg: 'py-8 sm:py-10 bg-stone-50 text-slate-900 border-y border-stone-200',
    sectionHeaderBadge: 'bg-rose-50 text-rose-900 border border-rose-200 text-xs font-serif uppercase tracking-widest',
    headingFont: 'font-serif font-bold tracking-tight text-slate-900 text-2xl sm:text-3xl',
    subtitleFont: 'font-sans text-slate-600 text-xs sm:text-sm',
    cardBg: 'bg-gradient-to-br from-[#111827] to-[#172554] rounded-2xl p-6 sm:p-8 shadow-xl border border-[#d4af37]/40 text-white',
    cardBorder: 'border-[#d4af37]/40',
    cardHover: 'hover:-translate-y-0.5',
    avatarBorder: 'border-2 border-[#d4af37]',
    roleFont: 'font-serif text-sm text-[#d4af37] font-semibold',
    accentText: 'text-[#d4af37] hover:text-amber-300 font-serif font-bold',
    isCentered: true,
    layoutVariant: 'showcase',
    defaultBadgeText: 'LEADERS • SCHOLARS • RESEARCHERS',
    defaultTitle: 'Distinguished Faculty',
    primaryBtn: 'bg-[#d4af37] hover:bg-amber-400 text-slate-950 font-bold text-xs px-6 py-2.5 rounded-xl shadow-sm',
  },

  // Events Section (University Symposia & Convocations)
  events: {
    sectionBg: 'py-8 sm:py-10 bg-[#faf8f6] text-slate-900 border-y border-stone-200',
    sectionHeaderBadge: 'bg-rose-50 text-rose-900 border border-rose-200 text-xs font-serif uppercase tracking-widest',
    headingFont: 'font-serif font-bold tracking-tight text-slate-900 text-2xl sm:text-3xl',
    subtitleFont: 'font-sans text-slate-600 text-xs sm:text-sm',
    cardBg: 'bg-white rounded-xl p-4 sm:p-5 shadow-xs hover:shadow-lg transition duration-300 border border-stone-200 text-slate-900',
    cardBorder: 'border-stone-200 hover:border-[#d4af37]',
    cardHover: 'hover:-translate-y-1',
    dateBadge: 'bg-rose-950 text-[#d4af37] font-serif font-bold border border-[#d4af37]/40',
    accentText: 'text-[#d4af37] hover:text-rose-900 font-serif font-bold',
    isCentered: true,
    layoutVariant: 'timeline',
    defaultBadgeText: 'University Calendar',
    defaultTitle: 'Convocations & Research Symposia',
    primaryBtn: 'bg-rose-900 hover:bg-rose-950 text-white font-serif font-bold text-xs',
  },

  // News Section (University Gazette & Press Dispatches)
  news: {
    sectionBg: 'py-8 sm:py-10 bg-white text-slate-900 border-y border-slate-100',
    sectionHeaderBadge: 'bg-rose-50 text-rose-900 border border-rose-200 text-xs font-serif uppercase tracking-widest',
    headingFont: 'font-serif font-bold tracking-tight text-slate-900 text-2xl sm:text-3xl',
    subtitleFont: 'font-sans text-slate-600 text-xs sm:text-sm',
    cardBg: 'bg-gradient-to-br from-[#111827] to-[#172554] rounded-2xl overflow-hidden shadow-xl border border-[#d4af37]/40 text-white',
    cardBorder: 'border-[#d4af37]/40',
    cardHover: 'hover:-translate-y-0.5',
    datePill: 'text-[#d4af37] font-serif text-xs font-bold uppercase tracking-wider',
    tagBadge: 'bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/40 font-serif text-[10px] uppercase font-bold px-2 py-0.5 rounded',
    accentText: 'text-[#d4af37] hover:text-amber-300 font-serif font-bold',
    isCentered: true,
    layoutVariant: 'featured',
    defaultBadgeText: 'SCHOLARSHIP • RESEARCH • CAMPUS LIFE',
    defaultTitle: 'News & Events',
    primaryBtn: 'bg-[#d4af37] hover:bg-amber-400 text-slate-950 font-bold text-xs px-5 py-2 rounded-lg',
  },

  // Notices Section (Senate Circulars & Academic Regulations)
  notices: {
    sectionBg: 'py-8 sm:py-10 bg-white text-slate-900 border-y border-stone-100',
    sectionHeaderBadge: 'bg-amber-50 text-amber-900 border border-amber-200 text-xs font-serif italic',
    headingFont: 'font-serif font-bold tracking-tight text-slate-900 text-2xl sm:text-3xl',
    subtitleFont: 'font-sans text-slate-600 text-xs sm:text-sm',
    cardBg: 'bg-stone-50 border border-stone-200 rounded-xl p-4 sm:p-5',
    cardBorder: 'border-stone-200',
    noticeItemBg: 'bg-white hover:bg-rose-50/40 transition border border-stone-200 rounded-lg p-3.5 sm:p-4',
    noticeItemBorder: 'border-stone-200 hover:border-rose-700',
    dateBadge: 'bg-rose-50 text-rose-900 font-serif text-xs font-bold px-2 py-0.5 rounded-md border border-rose-200',
    accentText: 'text-rose-900 hover:text-rose-950 font-serif font-bold',
    isCentered: true,
    defaultBadgeText: 'Senate Circulars',
    defaultTitle: 'Academic Regulations & Student Gazettes',
  },

  // Gallery Section (Historic Campus Grounds)
  gallery: {
    sectionBg: 'py-8 sm:py-10 bg-slate-950 text-white',
    sectionHeaderBadge: 'bg-rose-950/80 text-amber-300 border border-amber-400/40 text-xs font-serif uppercase tracking-widest',
    headingFont: 'font-serif font-bold tracking-tight text-white text-2xl sm:text-3xl',
    subtitleFont: 'font-sans text-slate-300 text-xs sm:text-sm',
    tabActive: 'bg-rose-900 text-white font-serif font-bold',
    tabInactive: 'bg-slate-900 text-slate-300 hover:bg-slate-800 font-serif',
    imageBorder: 'border border-slate-800 rounded-xl overflow-hidden',
    overlayGradient: 'bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent',
    accentText: 'text-amber-400 font-serif font-bold',
    isCentered: true,
    defaultBadgeText: 'Historic Quadrangle & Archives',
    defaultTitle: 'University Grounds & Iconic Architecture',
  },

  // FAQ Section
  faq: {
    sectionBg: 'py-8 sm:py-10 bg-stone-50 text-slate-900 border-y border-stone-200',
    sectionHeaderBadge: 'bg-rose-50 text-rose-900 border border-rose-200 text-xs font-serif italic',
    headingFont: 'font-serif font-bold tracking-tight text-slate-900 text-2xl sm:text-3xl',
    subtitleFont: 'font-sans text-slate-600 text-xs sm:text-sm',
    itemBg: 'bg-white border border-stone-200 rounded-xl',
    itemBorder: 'border-stone-200',
    itemHover: 'hover:border-rose-700',
    questionFont: 'font-serif font-bold text-slate-900 text-sm sm:text-base',
    answerFont: 'font-sans text-slate-600 text-xs sm:text-sm leading-relaxed',
    accentColor: 'text-rose-900',
    isCentered: true,
    defaultBadgeText: 'Admissions & University Regulations',
    defaultTitle: 'Frequently Asked Inquiries',
  },

  // Contact Section
  contact: {
    sectionBg: 'py-8 sm:py-10 bg-white text-slate-900 border-y border-stone-200',
    sectionHeaderBadge: 'bg-rose-50 text-rose-900 border border-rose-200 text-xs font-serif italic',
    headingFont: 'font-serif font-bold tracking-tight text-slate-900 text-2xl sm:text-3xl',
    subtitleFont: 'font-sans text-slate-600 text-xs sm:text-sm',
    cardBg: 'bg-stone-50 border border-stone-200 rounded-xl p-4 sm:p-6',
    cardBorder: 'border-stone-200',
    inputBg: 'bg-white',
    inputBorder: 'border-stone-200 focus:border-rose-800 focus:ring-rose-800/20',
    submitBtn: 'bg-rose-900 hover:bg-rose-950 text-white font-serif font-bold uppercase tracking-wider text-xs py-2.5 px-5 rounded-lg shadow-sm',
    infoIconBg: 'bg-rose-50 text-rose-900 border border-rose-200',
    accentText: 'text-rose-900 font-serif font-bold',
    isCentered: true,
    defaultBadgeText: 'Chancellery & Registrar',
    defaultTitle: 'Connect With the University Registry & Admissions',
  },

  // Call to Action (CTA)
  cta: {
    sectionBg: 'py-10 sm:py-14 bg-gradient-to-r from-rose-950 via-slate-900 to-indigo-950 text-white relative overflow-hidden shadow-xl',
    badgeClass: 'bg-rose-950/80 border-amber-400/50 text-amber-300 font-serif uppercase tracking-widest text-xs',
    headlineFont: 'font-serif font-bold text-white text-2xl sm:text-3xl lg:text-4xl',
    subheadlineFont: 'font-sans text-rose-100 text-xs sm:text-sm',
    primaryBtnClass: 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-serif font-bold shadow-md text-xs px-5 py-2.5 rounded-lg',
    secondaryBtnClass: 'bg-rose-950/80 hover:bg-rose-900 border-amber-400/40 text-white font-serif text-xs px-5 py-2.5 rounded-lg',
  },

  // Cards Section
  cards: {
    headingFont: 'font-serif font-bold text-slate-900 text-2xl sm:text-3xl',
    cardBorder: 'border border-stone-200 hover:border-rose-700',
    cardBg: 'bg-white text-slate-900 shadow-xs rounded-xl p-4 sm:p-5',
    badge: 'bg-rose-50 text-rose-900 border border-rose-200 font-serif text-xs',
    isCentered: true,
  },

  // Icon Cards Section
  iconCards: {
    sectionBg: 'py-16 bg-stone-50 text-slate-900 border-y border-stone-200',
    sectionHeaderBadge: 'bg-rose-50 text-rose-900 border border-rose-200 text-xs font-serif italic',
    headingFont: 'font-serif font-bold tracking-tight text-slate-900 text-3xl sm:text-4xl',
    subtitleFont: 'font-sans text-slate-600 text-sm',
    cardBg: 'bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl border border-stone-200 text-slate-900 text-center',
    cardBorder: 'border-stone-200 hover:border-rose-700',
    iconBox: 'w-12 h-12 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center justify-center mx-auto',
    isCentered: true,
  },

  // Image & Text Section
  imageText: {
    sectionBg: 'py-16 bg-white text-slate-900 border-y border-stone-100',
    badgeClass: 'bg-rose-50 text-rose-900 border border-rose-200 text-xs font-serif italic',
    headingFont: 'font-serif font-bold tracking-tight text-slate-900 text-3xl sm:text-4xl',
    bodyFont: 'font-sans text-slate-600 leading-relaxed text-sm sm:text-base',
    primaryBtnClass: 'bg-rose-900 hover:bg-rose-950 text-white font-serif font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm',
    secondaryBtnClass: 'bg-stone-100 hover:bg-stone-200 text-slate-800 font-serif font-bold text-xs px-5 py-2.5 rounded-xl',
    imageBorder: 'rounded-2xl border border-stone-200 shadow-xl overflow-hidden',
  },

  // Logo Grid Section
  logoGrid: {
    sectionBg: 'py-12 bg-stone-50 border-y border-stone-200',
    headingFont: 'font-serif text-xs uppercase font-bold text-stone-500 tracking-wider text-center',
    subtitleFont: 'font-serif italic text-xs text-stone-400 text-center',
    cardBg: 'bg-white rounded-xl p-4 shadow-2xs border border-stone-200 flex items-center justify-center grayscale hover:grayscale-0 transition',
    cardBorder: 'border-stone-200 hover:border-rose-700',
  },
};
