import { TemplatePackage } from '../contracts/TemplateContracts';
import { medicalConfig } from './config';
import { MedicalHeader } from './MedicalHeader';
import { MedicalPageHero } from './MedicalPageHero';
import { MedicalFooter } from './MedicalFooter';
import { MedicalHeroTemplate } from '../../components/sections/hero-templates/MedicalHeroTemplate';

export const medicalTemplate: TemplatePackage = {
  config: medicalConfig,
  Header: MedicalHeader,
  PageHero: MedicalPageHero,
  Footer: MedicalFooter,
  Hero: MedicalHeroTemplate
};

export * from './config';
export * from './MedicalHeader';
export * from './MedicalPageHero';
export * from './MedicalFooter';
