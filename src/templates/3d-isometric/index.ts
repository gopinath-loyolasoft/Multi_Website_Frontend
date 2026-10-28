import { TemplatePackage } from '../contracts/TemplateContracts';
import { config3DIsometric } from './config';
import { THEME_3D_ISOMETRIC } from './theme';
import { IsometricHeader } from './IsometricHeader';
import { IsometricPageHero } from './IsometricPageHero';
import { IsometricFooter } from './IsometricFooter';
import { IsometricHeroTemplate } from './IsometricHeroTemplate';

export const Template3DIsometricPackage: TemplatePackage = {
  config: config3DIsometric,
  themeStyles: THEME_3D_ISOMETRIC,
  Header: IsometricHeader,
  PageHero: IsometricPageHero,
  Footer: IsometricFooter,
  Hero: IsometricHeroTemplate,
};

export const template3DIsometric = Template3DIsometricPackage;
export const DESIGN_3D_ISOMETRIC_CONFIG = config3DIsometric;
export const THEME_3D_ISOMETRIC_STYLES = THEME_3D_ISOMETRIC;

export {
  config3DIsometric,
  THEME_3D_ISOMETRIC,
  IsometricHeader,
  IsometricPageHero,
  IsometricFooter,
  IsometricHeroTemplate,
};

// Isometric Components
export * from './components';
