import { TemplatePackage } from '../contracts/TemplateContracts';
import { config3DKinetic } from './config';
import { THEME_3D_KINETIC } from './theme';
import { KineticHeader } from './KineticHeader';
import { KineticPageHero } from './KineticPageHero';
import { KineticFooter } from './KineticFooter';
import { KineticHeroTemplate } from './KineticHeroTemplate';

export const Template3DKineticPackage: TemplatePackage = {
  config: config3DKinetic,
  themeStyles: THEME_3D_KINETIC,
  Header: KineticHeader,
  PageHero: KineticPageHero,
  Footer: KineticFooter,
  Hero: KineticHeroTemplate,
};

export const template3DKinetic = Template3DKineticPackage;
export const DESIGN_3D_KINETIC_CONFIG = config3DKinetic;
export const THEME_3D_KINETIC_STYLES = THEME_3D_KINETIC;

export {
  config3DKinetic,
  THEME_3D_KINETIC,
  KineticHeader,
  KineticPageHero,
  KineticFooter,
  KineticHeroTemplate,
};

// Kinetic Components
export * from './components';
