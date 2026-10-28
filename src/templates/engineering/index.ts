import { TemplatePackage } from '../contracts/TemplateContracts';
import { engineeringConfig } from './config';
import { ENGINEERING_THEME } from './theme';
import { EngineeringHeader } from './EngineeringHeader';
import { EngineeringPageHero } from './EngineeringPageHero';
import { EngineeringFooter } from './EngineeringFooter';
import { EngineeringHeroTemplate } from './EngineeringHeroTemplate';

export const EngineeringTemplatePackage: TemplatePackage = {
  config: engineeringConfig,
  themeStyles: ENGINEERING_THEME,
  Header: EngineeringHeader,
  PageHero: EngineeringPageHero,
  Footer: EngineeringFooter,
  Hero: EngineeringHeroTemplate,
};

export const engineeringTemplate = EngineeringTemplatePackage;
export const ENGINEERING_CONFIG = engineeringConfig;

export {
  engineeringConfig,
  ENGINEERING_THEME,
  EngineeringHeader,
  EngineeringPageHero,
  EngineeringFooter,
  EngineeringHeroTemplate,
};
