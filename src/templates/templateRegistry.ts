import { useTenant } from '../tenant/TenantContext';
import { useTheme } from '../themes/ThemeContext';
import { TemplateCode, TemplatePackage } from './contracts/TemplateContracts';
import { engineeringTemplate } from './engineering';
import { artsScienceTemplate } from './arts-science';
import { medicalTemplate } from './medical';
import { universityTemplate } from './university';

const registry: Record<string, TemplatePackage> = {
  ENGINEERING_MODERN: engineeringTemplate,
  ENGINEERING: engineeringTemplate,
  TEMPLATE1: engineeringTemplate,
  TEMPLATE_1: engineeringTemplate,

  ARTS_SCIENCE_MODERN: artsScienceTemplate,
  ARTS_SCIENCE: artsScienceTemplate,
  TEMPLATE2: artsScienceTemplate,
  TEMPLATE_2: artsScienceTemplate,

  MEDICAL_MODERN: medicalTemplate,
  MEDICAL: medicalTemplate,
  TEMPLATE3: medicalTemplate,
  TEMPLATE_3: medicalTemplate,

  UNIVERSITY_MODERN: universityTemplate,
  UNIVERSITY: universityTemplate,
  TEMPLATE4: universityTemplate,
  TEMPLATE_4: universityTemplate,
};

export const getTemplatePackage = (code?: string | null): TemplatePackage => {
  if (!code) return engineeringTemplate;
  const normalized = code.trim().toUpperCase();
  return registry[normalized] || engineeringTemplate;
};

export const useActiveTemplate = (): TemplatePackage => {
  const { siteConfig } = useTenant();
  const { templateCode } = useTheme();

  const activeCode = (templateCode || siteConfig?.templateCode || siteConfig?.tenant?.templateCode || 'ENGINEERING_MODERN') as TemplateCode;
  return getTemplatePackage(activeCode);
};

export * from './contracts/TemplateContracts';
export * from './engineering';
export * from './arts-science';
export * from './medical';
export * from './university';
