import { TemplatePackage } from '../contracts/TemplateContracts';
import { artsScienceConfig } from './config';
import { ARTS_SCIENCE_THEME } from './theme';
import { ArtsScienceHeader } from './ArtsScienceHeader';
import { ArtsSciencePageHero } from './ArtsSciencePageHero';
import { ArtsScienceFooter } from './ArtsScienceFooter';
import { ArtsScienceHeroTemplate } from './ArtsScienceHeroTemplate';

export const ArtsScienceTemplatePackage: TemplatePackage = {
  config: artsScienceConfig,
  themeStyles: ARTS_SCIENCE_THEME,
  Header: ArtsScienceHeader,
  PageHero: ArtsSciencePageHero,
  Footer: ArtsScienceFooter,
  Hero: ArtsScienceHeroTemplate
};

export const artsScienceTemplate = ArtsScienceTemplatePackage;
export const ARTS_SCIENCE_CONFIG = artsScienceConfig;

export {
  artsScienceConfig,
  ARTS_SCIENCE_THEME,
  ArtsScienceHeader,
  ArtsSciencePageHero,
  ArtsScienceFooter,
  ArtsScienceHeroTemplate as ArtsScienceHero,
  ArtsScienceHeroTemplate
};



