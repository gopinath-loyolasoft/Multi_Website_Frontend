import { TemplatePackage } from '../contracts/TemplateContracts';
import { artsScienceConfig } from './config';
import { ArtsScienceHeader } from './ArtsScienceHeader';
import { ArtsSciencePageHero } from './ArtsSciencePageHero';
import { ArtsScienceFooter } from './ArtsScienceFooter';
import { ArtsScienceHeroTemplate } from '../../components/sections/hero-templates/ArtsScienceHeroTemplate';

export const artsScienceTemplate: TemplatePackage = {
  config: artsScienceConfig,
  Header: ArtsScienceHeader,
  PageHero: ArtsSciencePageHero,
  Footer: ArtsScienceFooter,
  Hero: ArtsScienceHeroTemplate
};

export * from './config';
export * from './ArtsScienceHeader';
export * from './ArtsSciencePageHero';
export * from './ArtsScienceFooter';
