import React from 'react';
import { 
  ENGINEERING_THEME, 
  ARTS_SCIENCE_THEME, 
  MEDICAL_THEME, 
  UNIVERSITY_THEME 
} from './templates';

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
  };
}

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
