import { useTenant } from '../tenant/TenantContext';
import { useTheme } from '../themes/ThemeContext';
import { TemplateCode, TemplatePackage, ModuleThemeStyles } from './contracts/TemplateContracts';
import { EngineeringTemplatePackage } from './engineering';
import { ArtsScienceTemplatePackage } from './arts-science';
import { MedicalTemplatePackage } from './medical';
import { UniversityTemplatePackage } from './university';
import { Template3DDesignPackage, SalesianTemplatePackage } from './3d-design';
import { Template3DGlassPackage } from './3d-glassmorphism';
import { Template3DIsometricPackage } from './3d-isometric';
import { Template3DKineticPackage } from './3d-kinetic';
import { Template3DNeumorphicPackage } from './3d-neumorphic';

const registry: Record<string, TemplatePackage> = {
  ENGINEERING_MODERN: EngineeringTemplatePackage,
  ENGINEERING: EngineeringTemplatePackage,
  TEMPLATE1: EngineeringTemplatePackage,
  TEMPLATE_1: EngineeringTemplatePackage,

  ARTS_SCIENCE_MODERN: ArtsScienceTemplatePackage,
  ARTS_SCIENCE: ArtsScienceTemplatePackage,
  TEMPLATE2: ArtsScienceTemplatePackage,
  TEMPLATE_2: ArtsScienceTemplatePackage,

  MEDICAL_MODERN: MedicalTemplatePackage,
  MEDICAL: MedicalTemplatePackage,
  TEMPLATE3: MedicalTemplatePackage,
  TEMPLATE_3: MedicalTemplatePackage,

  UNIVERSITY_MODERN: UniversityTemplatePackage,
  UNIVERSITY: UniversityTemplatePackage,
  TEMPLATE4: UniversityTemplatePackage,
  TEMPLATE_4: UniversityTemplatePackage,

  DESIGN_3D_MODERN: Template3DDesignPackage,
  DESIGN_3D: Template3DDesignPackage,
  '3D_DESIGN': Template3DDesignPackage,
  SALESIAN_SLANTED: Template3DDesignPackage,
  SALESIAN: Template3DDesignPackage,
  TEMPLATE5: Template3DDesignPackage,
  TEMPLATE_5: Template3DDesignPackage,

  DESIGN_3D_GLASS: Template3DGlassPackage,
  GLASS_3D: Template3DGlassPackage,
  TEMPLATE6: Template3DGlassPackage,
  TEMPLATE_6: Template3DGlassPackage,

  DESIGN_3D_ISOMETRIC: Template3DIsometricPackage,
  ISOMETRIC_3D: Template3DIsometricPackage,
  TEMPLATE7: Template3DIsometricPackage,
  TEMPLATE_7: Template3DIsometricPackage,

  DESIGN_3D_KINETIC: Template3DKineticPackage,
  KINETIC_3D: Template3DKineticPackage,
  TEMPLATE8: Template3DKineticPackage,
  TEMPLATE_8: Template3DKineticPackage,

  DESIGN_3D_NEUMORPHIC: Template3DNeumorphicPackage,
  NEUMORPHIC_3D: Template3DNeumorphicPackage,
  TEMPLATE9: Template3DNeumorphicPackage,
  TEMPLATE_9: Template3DNeumorphicPackage,
};

export const getTemplatePackage = (code?: string | null): TemplatePackage => {
  if (!code) return EngineeringTemplatePackage;
  const normalized = code.trim().toUpperCase();
  return registry[normalized] || EngineeringTemplatePackage;
};

export const getTemplateModuleStyles = (code: TemplateCode): ModuleThemeStyles => {
  return getTemplatePackage(code).themeStyles;
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
export * from './3d-design';
export * from './3d-glassmorphism';
export * from './3d-isometric';
export * from './3d-kinetic';
export * from './3d-neumorphic';