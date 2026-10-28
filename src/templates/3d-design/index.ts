import { TemplatePackage } from '../contracts/TemplateContracts';
import { config3DDesign, salesianConfig } from './config';
import { THEME_3D_DESIGN, SALESIAN_THEME } from './theme';
import { Header3DDesign, SalesianHeader } from './Header3DDesign';
import { PageHero3DDesign, SalesianPageHero } from './PageHero3DDesign';
import { Footer3DDesign, SalesianFooter } from './Footer3DDesign';
import { Hero3DDesignTemplate, SalesianHeroTemplate } from './Hero3DDesignTemplate';

export const Template3DDesignPackage: TemplatePackage = {
  config: config3DDesign,
  themeStyles: THEME_3D_DESIGN,
  Header: Header3DDesign,
  PageHero: PageHero3DDesign,
  Footer: Footer3DDesign,
  Hero: Hero3DDesignTemplate,
};

export const SalesianTemplatePackage = Template3DDesignPackage;
export const template3DDesign = Template3DDesignPackage;
export const salesianTemplate = Template3DDesignPackage;
export const DESIGN_3D_CONFIG = config3DDesign;
export const SALESIAN_CONFIG = config3DDesign;

export {
  config3DDesign,
  salesianConfig,
  THEME_3D_DESIGN,
  SALESIAN_THEME,
  Header3DDesign,
  SalesianHeader,
  PageHero3DDesign,
  SalesianPageHero,
  Footer3DDesign,
  SalesianFooter,
  Hero3DDesignTemplate,
  SalesianHeroTemplate,
};

// 3D Slanted Components & Hooks
export * from './components';
export * from './hooks/useTilt3D';

