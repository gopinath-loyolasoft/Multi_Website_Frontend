import { TemplatePackage } from '../contracts/TemplateContracts';
import { config3DNeumorphic } from './config';
import { THEME_3D_NEUMORPHIC } from './theme';
import { NeumorphicHeader } from './NeumorphicHeader';
import { NeumorphicPageHero } from './NeumorphicPageHero';
import { NeumorphicFooter } from './NeumorphicFooter';
import { NeumorphicHeroTemplate } from './NeumorphicHeroTemplate';

export const Template3DNeumorphicPackage: TemplatePackage = {
  config: config3DNeumorphic,
  themeStyles: THEME_3D_NEUMORPHIC,
  Header: NeumorphicHeader,
  PageHero: NeumorphicPageHero,
  Footer: NeumorphicFooter,
  Hero: NeumorphicHeroTemplate,
};

export const template3DNeumorphic = Template3DNeumorphicPackage;
export const DESIGN_3D_NEUMORPHIC_CONFIG = config3DNeumorphic;
export const THEME_3D_NEUMORPHIC_STYLES = THEME_3D_NEUMORPHIC;

export {
  config3DNeumorphic,
  THEME_3D_NEUMORPHIC,
  NeumorphicHeader,
  NeumorphicPageHero,
  NeumorphicFooter,
  NeumorphicHeroTemplate,
};

// Neumorphic Components
export * from './components';
