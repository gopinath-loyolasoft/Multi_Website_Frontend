import { TemplatePackage } from '../contracts/TemplateContracts';
import { universityConfig } from './config';
import { UniversityHeader } from './UniversityHeader';
import { UniversityPageHero } from './UniversityPageHero';
import { UniversityFooter } from './UniversityFooter';
import { UniversityHeroTemplate } from '../../components/sections/hero-templates/UniversityHeroTemplate';

export const universityTemplate: TemplatePackage = {
  config: universityConfig,
  Header: UniversityHeader,
  PageHero: UniversityPageHero,
  Footer: UniversityFooter,
  Hero: UniversityHeroTemplate
};

export * from './config';
export * from './UniversityHeader';
export * from './UniversityPageHero';
export * from './UniversityFooter';
