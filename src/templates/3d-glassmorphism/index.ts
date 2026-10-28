import { TemplatePackage } from '../contracts/TemplateContracts';
import { config3DGlass } from './config';
import { THEME_3D_GLASS } from './theme';
import { GlassHeader } from './GlassHeader';
import { GlassPageHero } from './GlassPageHero';
import { GlassFooter } from './GlassFooter';
import { GlassHeroTemplate } from './GlassHeroTemplate';

export const Template3DGlassPackage: TemplatePackage = {
  config: config3DGlass,
  themeStyles: THEME_3D_GLASS,
  Header: GlassHeader,
  PageHero: GlassPageHero,
  Footer: GlassFooter,
  Hero: GlassHeroTemplate,
};

export const template3DGlass = Template3DGlassPackage;
export const DESIGN_3D_GLASS_CONFIG = config3DGlass;
export const THEME_3D_GLASS_STYLES = THEME_3D_GLASS;

export {
  config3DGlass,
  THEME_3D_GLASS,
  GlassHeader,
  GlassPageHero,
  GlassFooter,
  GlassHeroTemplate,
};

// Glass Components
export * from './components';
