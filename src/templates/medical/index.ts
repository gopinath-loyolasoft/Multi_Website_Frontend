import { TemplatePackage } from '../contracts/TemplateContracts';
import { medicalConfig } from './config';
import { MEDICAL_THEME } from './theme';
import { MedicalHeader } from './MedicalHeader';
import { MedicalPageHero } from './MedicalPageHero';
import { MedicalFooter } from './MedicalFooter';
import { MedicalHeroTemplate } from './MedicalHeroTemplate';

export const MedicalTemplatePackage: TemplatePackage = {
  config: medicalConfig,
  themeStyles: MEDICAL_THEME,
  Header: MedicalHeader,
  PageHero: MedicalPageHero,
  Footer: MedicalFooter,
  Hero: MedicalHeroTemplate,
};

export const medicalTemplate = MedicalTemplatePackage;
export const MEDICAL_CONFIG = medicalConfig;

export {
  medicalConfig,
  MEDICAL_THEME,
  MedicalHeader,
  MedicalPageHero,
  MedicalFooter,
  MedicalHeroTemplate,
};
