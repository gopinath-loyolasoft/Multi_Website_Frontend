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
    defaultBgImage?: string;
  };
  // Statistics Section
  statistics: {
    sectionBg: string;
    bgPatternOverlay: React.CSSProperties;
    headerAlignment: string;
    headerBadge: string;
    headerTitleFont: string;
    headerSubtitleFont: string;
    cardContainer: string;
    cardBg: string;
    cardTopAccent: string;
    iconBox: string;
    valueFont: string;
    suffixFont: string;
    labelFont: string;
    tagBadge: string;
  };
  // Quote / Leadership Section
  quote: {
    sectionBg: string;
    isCentered: boolean;
    layoutContainer: string;
    photoContainer: string;
    photoFrame: string;
    quoteBox: string;
    quoteTextFont: string;
    authorNameFont: string;
    authorTitleFont: string;
    subTextFont: string;
    badgeClass: string;
    iconColor: string;
    cardBg?: string;
    cardBorder?: string;
    cardTopAccent?: string;
    profileBg?: string;
    avatarRing?: string;
    footerLabel?: string;
  };
  // Departments Section
  departments: {
    sectionBg: string;
    sectionHeaderBadge: string;
    headingFont: string;
    subtitleFont: string;
    cardBorder: string;
    cardBg: string;
    cardHover: string;
    iconBg: string;
    accentText: string;
    tagBadge: string;
    cardTitleFont?: string;
    cardDescFont?: string;
    cardTopAccent?: string;
    bgPatternOverlay?: React.CSSProperties;
    primaryBtn?: string;
    isCentered?: boolean;
    defaultBadgeText?: string;
    defaultTitle?: string;
    defaultSubtitle?: string;
    showBottomCta?: boolean;
    bottomCtaText?: string;
  };
  // Courses Section
  courses: {
    sectionBg: string;
    sectionHeaderBadge: string;
    headingFont: string;
    subtitleFont: string;
    cardBorder: string;
    cardBg: string;
    badge: string;
    accentText: string;
    primaryBtn: string;
    iconColor: string;
    isCentered?: boolean;
    defaultBadgeText?: string;
    defaultTitle?: string;
    cardHover?: string;
    cardTopAccent?: string;
  };
  // Faculty Section
  faculty: {
    sectionBg: string;
    sectionHeaderBadge: string;
    headingFont: string;
    subtitleFont: string;
    cardBg: string;
    cardBorder: string;
    cardHover: string;
    avatarBorder: string;
    roleFont: string;
    accentText: string;
    isCentered?: boolean;
    defaultBadgeText?: string;
    defaultTitle?: string;
    primaryBtn?: string;
    layoutVariant?: 'grid' | 'editorial' | 'clinical' | 'showcase' | string;
    cardTopAccent?: string;
  };
  // Events Section
  events: {
    sectionBg: string;
    sectionHeaderBadge: string;
    headingFont: string;
    subtitleFont: string;
    cardBg: string;
    cardBorder: string;
    cardHover: string;
    dateBadge: string;
    accentText: string;
    isCentered?: boolean;
    defaultBadgeText?: string;
    defaultTitle?: string;
    primaryBtn?: string;
    layoutVariant?: 'cards' | 'split' | 'clinical' | 'timeline' | string;
  };
  // News Section
  news: {
    sectionBg: string;
    sectionHeaderBadge: string;
    headingFont: string;
    subtitleFont: string;
    cardBg: string;
    cardBorder: string;
    cardHover: string;
    datePill: string;
    tagBadge: string;
    accentText: string;
    cardTitleFont?: string;
    cardDescFont?: string;
    cardTopAccent?: string;
    bgPatternOverlay?: React.CSSProperties;
    isCentered?: boolean;
    defaultBadgeText?: string;
    defaultTitle?: string;
    defaultSubtitle?: string;
    primaryBtn?: string;
    showBottomCta?: boolean;
    bottomCtaText?: string;
    layoutVariant?: 'cards' | 'split' | 'clinical' | 'featured' | string;
  };
  // Notices Section
  notices: {
    sectionBg: string;
    sectionHeaderBadge: string;
    headingFont: string;
    subtitleFont: string;
    cardBg: string;
    cardBorder: string;
    noticeItemBg: string;
    noticeItemBorder: string;
    dateBadge: string;
    accentText: string;
    isCentered?: boolean;
    defaultBadgeText?: string;
    defaultTitle?: string;
  };
  // Gallery Section
  gallery: {
    sectionBg: string;
    sectionHeaderBadge: string;
    headingFont: string;
    subtitleFont: string;
    tabActive: string;
    tabInactive: string;
    imageBorder: string;
    overlayGradient: string;
    accentText: string;
    isCentered?: boolean;
    defaultBadgeText?: string;
    defaultTitle?: string;
  };
  // FAQ Section
  faq: {
    sectionBg: string;
    sectionHeaderBadge: string;
    headingFont: string;
    subtitleFont: string;
    itemBg: string;
    itemBorder: string;
    itemHover: string;
    questionFont: string;
    answerFont: string;
    accentColor: string;
    isCentered?: boolean;
    defaultBadgeText?: string;
    defaultTitle?: string;
  };
  // Contact Section
  contact: {
    sectionBg: string;
    sectionHeaderBadge: string;
    headingFont: string;
    subtitleFont: string;
    cardBg: string;
    cardBorder: string;
    inputBg: string;
    inputBorder: string;
    submitBtn: string;
    infoIconBg: string;
    accentText: string;
    isCentered?: boolean;
    defaultBadgeText?: string;
    defaultTitle?: string;
  };
  // Call to Action (CTA) Section
  cta: {
    sectionBg: string;
    badgeClass: string;
    headlineFont: string;
    subheadlineFont: string;
    primaryBtnClass: string;
    secondaryBtnClass: string;
  };
  // Cards Section
  cards: {
    headingFont: string;
    cardBorder: string;
    cardBg: string;
    badge: string;
    isCentered?: boolean;
  };
  // Icon Cards Section
  iconCards: {
    sectionBg: string;
    sectionHeaderBadge: string;
    headingFont: string;
    subtitleFont: string;
    cardBg: string;
    cardBorder: string;
    iconBox: string;
    isCentered?: boolean;
  };
  // Image & Text Section
  imageText: {
    sectionBg: string;
    badgeClass: string;
    headingFont: string;
    bodyFont: string;
    primaryBtnClass: string;
    secondaryBtnClass?: string;
    imageBorder: string;
  };
  // Logo Grid Section
  logoGrid: {
    sectionBg: string;
    headingFont: string;
    subtitleFont: string;
    cardBg: string;
    cardBorder: string;
  };
}
