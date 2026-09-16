import { TemplatePackage } from '../contracts/TemplateContracts';
import { engineeringConfig } from './config';
import { EngineeringHeader } from './EngineeringHeader';
import { EngineeringPageHero } from './EngineeringPageHero';
import { EngineeringFooter } from './EngineeringFooter';
import { EngineeringHeroTemplate } from '../../components/sections/hero-templates/EngineeringHeroTemplate';

export const engineeringTemplate: TemplatePackage = {
  config: engineeringConfig,
  Header: EngineeringHeader,
  PageHero: EngineeringPageHero,
  Footer: EngineeringFooter,
  Hero: EngineeringHeroTemplate
};

export * from './config';
export * from './EngineeringHeader';
export * from './EngineeringPageHero';
export * from './EngineeringFooter';
