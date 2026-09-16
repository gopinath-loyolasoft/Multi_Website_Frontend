import React from 'react';
import { SiteConfig, MenuItem } from '../../types';

export type TemplateCode = 
  | 'ENGINEERING_MODERN' 
  | 'ARTS_SCIENCE_MODERN' 
  | 'MEDICAL_MODERN' 
  | 'UNIVERSITY_MODERN';

export interface TemplateConfig {
  code: TemplateCode;
  displayName: string;
  pageContainerClass: string;
  bodyBgClass: string;
  headerClass: string;
  nameFont: string;
  titleFont: string;
  badgeFont: string;
  defaultBadge: string;
  crestBg: string;
  CrestIcon: React.ComponentType<{ className?: string }>;
  heroGradient: string;
  statValColor: string;
  footerDescription: string;
}

export interface TemplateHeaderProps {
  siteConfig: SiteConfig;
  activeDropdown: string | null;
  setActiveDropdown: (k: string | null) => void;
  mobileOpen: boolean;
  setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
  mobileExpanded: Record<string, boolean>;
  toggleMobileAccordion: (k: string) => void;
  handleMouseEnter: (k: string) => void;
  handleMouseLeave: () => void;
  visibleMenus: MenuItem[];
}

export interface TemplatePageHeroProps {
  badge?: string;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export interface TemplateFooterProps {
  siteConfig: SiteConfig;
}

export interface TemplatePackage {
  config: TemplateConfig;
  Header: React.FC<TemplateHeaderProps>;
  PageHero: React.FC<TemplatePageHeroProps>;
  Footer: React.FC<TemplateFooterProps>;
  Hero?: React.FC<any>;
}
