import { TemplatePackage } from '../contracts/TemplateContracts';
import { universityConfig } from './config';
import { UNIVERSITY_THEME } from './theme';
import { UniversityHeader } from './UniversityHeader';
import { UniversityPageHero } from './UniversityPageHero';
import { UniversityFooter } from './UniversityFooter';
import { UniversityHeroTemplate } from './UniversityHeroTemplate';

export const UniversityTemplatePackage: TemplatePackage = {
  config: universityConfig,
  themeStyles: UNIVERSITY_THEME,
  Header: UniversityHeader,
  PageHero: UniversityPageHero,
  Footer: UniversityFooter,
  Hero: UniversityHeroTemplate,
};

export const universityTemplate = UniversityTemplatePackage;
export const UNIVERSITY_CONFIG = universityConfig;

export {
  universityConfig,
  UNIVERSITY_THEME,
  UniversityHeader,
  UniversityPageHero,
  UniversityFooter,
  UniversityHeroTemplate,
};
