import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { ThemeConfig } from '../types';
import { useTenant } from '../tenant/TenantContext';
import { getTemplateModuleStyles, ModuleThemeStyles, TemplateCode } from '../templates';

export type { TemplateCode };

interface ThemeContextType {
  themeConfig?: ThemeConfig;
  templateCode: TemplateCode;
  isArtsAndScience: boolean;
  isEngineering: boolean;
  isMedical: boolean;
  isUniversity: boolean;
  styles: ModuleThemeStyles;
}

const defaultStyles = getTemplateModuleStyles('ENGINEERING_MODERN');

const ThemeContext = createContext<ThemeContextType>({
  templateCode: 'ENGINEERING_MODERN',
  isArtsAndScience: false,
  isEngineering: true,
  isMedical: false,
  isUniversity: false,
  styles: defaultStyles,
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { siteConfig } = useTenant();
  const themeConfig = siteConfig?.theme?.configuration;

  // Resolve template code from siteConfig or theme code fallback
  const rawCode = (siteConfig?.templateCode || siteConfig?.tenant?.templateCode || '').toUpperCase();
  let templateCode: TemplateCode = 'ENGINEERING_MODERN';
  if (['TEMPLATE1', 'TEMPLATE_1', 'ENGINEERING_MODERN', 'ENGINEERING'].includes(rawCode)) {
    templateCode = 'ENGINEERING_MODERN';
  } else if (['TEMPLATE2', 'TEMPLATE_2', 'ARTS_SCIENCE_MODERN', 'ARTS_SCIENCE'].includes(rawCode)) {
    templateCode = 'ARTS_SCIENCE_MODERN';
  } else if (['TEMPLATE3', 'TEMPLATE_3', 'MEDICAL_MODERN', 'MEDICAL'].includes(rawCode)) {
    templateCode = 'MEDICAL_MODERN';
  } else if (['TEMPLATE4', 'TEMPLATE_4', 'UNIVERSITY_MODERN', 'UNIVERSITY'].includes(rawCode)) {
    templateCode = 'UNIVERSITY_MODERN';
  } else if (['TEMPLATE5', 'TEMPLATE_5', 'SALESIAN_SLANTED', 'DESIGN_3D_MODERN', '3D_DESIGN'].includes(rawCode)) {
    templateCode = 'SALESIAN_SLANTED';
  } else if (['TEMPLATE6', 'TEMPLATE_6', 'DESIGN_3D_GLASS', 'GLASS_3D'].includes(rawCode)) {
    templateCode = 'DESIGN_3D_GLASS';
  } else if (['TEMPLATE7', 'TEMPLATE_7', 'DESIGN_3D_ISOMETRIC', 'ISOMETRIC_3D'].includes(rawCode)) {
    templateCode = 'DESIGN_3D_ISOMETRIC';
  } else if (['TEMPLATE8', 'TEMPLATE_8', 'DESIGN_3D_KINETIC', 'KINETIC_3D'].includes(rawCode)) {
    templateCode = 'DESIGN_3D_KINETIC';
  } else if (['TEMPLATE9', 'TEMPLATE_9', 'DESIGN_3D_NEUMORPHIC', 'NEUMORPHIC_3D'].includes(rawCode)) {
    templateCode = 'DESIGN_3D_NEUMORPHIC';
  } else if (rawCode) {
    templateCode = rawCode as TemplateCode;
  } else if (siteConfig?.theme?.code === 'ARTS_GREEN' || siteConfig?.theme?.code === 'THEME_EMERALD') {
    templateCode = 'ARTS_SCIENCE_MODERN';
  } else if (siteConfig?.theme?.code === 'NURSING_CARE' || siteConfig?.theme?.code === 'THEME_TEAL') {
    templateCode = 'MEDICAL_MODERN';
  } else if (siteConfig?.theme?.code === 'UNIV_CRIMSON' || siteConfig?.theme?.code === 'THEME_CRIMSON') {
    templateCode = 'UNIVERSITY_MODERN';
  }

  const isArtsAndScience = templateCode === 'ARTS_SCIENCE_MODERN';
  const isMedical = templateCode === 'MEDICAL_MODERN';
  const isUniversity = templateCode === 'UNIVERSITY_MODERN';
  const isEngineering = templateCode === 'ENGINEERING_MODERN';

  const styles = useMemo(() => getTemplateModuleStyles(templateCode), [templateCode]);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-template', templateCode);

    // Template defaults
    let primary = '#1e40af'; // Royal Blue
    let secondary = '#4f46e5'; // Cyber Indigo
    let accent = '#0284c7';
    let font = "'Outfit', 'Inter', system-ui, -apple-system, sans-serif";
    let headingFont = "'Outfit', 'Inter', sans-serif";
    let cardRadius = "0.75rem";

    if (isArtsAndScience) {
      primary = '#15803d'; // Rich Emerald Green
      secondary = '#b45309'; // Classical Amber / Gold
      accent = '#047857';
      font = "'Merriweather', 'Georgia', serif";
      headingFont = "'Playfair Display', 'Georgia', serif";
      cardRadius = "0.5rem";
    } else if (isMedical) {
      primary = '#0891b2'; // Clinical Teal
      secondary = '#e11d48'; // Emergency Rose Red
      accent = '#0284c7';
      font = "'Plus Jakarta Sans', system-ui, sans-serif";
      headingFont = "'Plus Jakarta Sans', system-ui, sans-serif";
      cardRadius = "1.25rem";
    } else if (isUniversity) {
      primary = '#881337'; // Academic Crimson / Burgundy
      secondary = '#1e3a8a'; // Deep Collegiate Navy
      accent = '#d97706'; // Rich Gold
      font = "'Outfit', system-ui, sans-serif";
      headingFont = "'Lora', 'Playfair Display', serif";
      cardRadius = "0.625rem";
    } else if (templateCode === 'SALESIAN_SLANTED') {
      primary = '#134975'; // Deep Navy
      secondary = '#e5a912'; // Rich Gold
      accent = '#0284c7';
      font = "'Outfit', sans-serif";
      headingFont = "'Outfit', sans-serif";
      cardRadius = "1rem";
    } else if (templateCode === 'DESIGN_3D_GLASS') {
      primary = '#06b6d4'; // Cyan
      secondary = '#3b82f6'; // Neon Blue
      accent = '#6366f1';
      font = "'Outfit', sans-serif";
      headingFont = "'Outfit', sans-serif";
      cardRadius = "1.5rem";
    } else if (templateCode === 'DESIGN_3D_ISOMETRIC') {
      primary = '#f59e0b'; // Amber Gold
      secondary = '#0f172a'; // Deep Slate
      accent = '#10b981';
      font = "'Outfit', sans-serif";
      headingFont = "'Outfit', sans-serif";
      cardRadius = "0.75rem";
    } else if (templateCode === 'DESIGN_3D_KINETIC') {
      primary = '#f43f5e'; // Hot Rose
      secondary = '#9333ea'; // Electric Purple
      accent = '#6366f1';
      font = "'Outfit', sans-serif";
      headingFont = "'Outfit', sans-serif";
      cardRadius = "1.25rem";
    } else if (templateCode === 'DESIGN_3D_NEUMORPHIC') {
      primary = '#0d9488'; // Teal
      secondary = '#334155'; // Slate
      accent = '#0284c7';
      font = "'Outfit', sans-serif";
      headingFont = "'Outfit', sans-serif";
      cardRadius = "1.75rem";
    }

    // Override with custom themeConfig if present
    if (themeConfig?.primaryColor) primary = themeConfig.primaryColor;
    if (themeConfig?.secondaryColor) secondary = themeConfig.secondaryColor;
    if (themeConfig?.accentColor) accent = themeConfig.accentColor;
    if (themeConfig?.fontFamily) font = themeConfig.fontFamily;

    root.style.setProperty('--primary-color', primary);
    root.style.setProperty('--color-primary', primary);
    root.style.setProperty('--secondary-color', secondary);
    root.style.setProperty('--color-secondary', secondary);
    root.style.setProperty('--accent-color', accent);
    root.style.setProperty('--font-family', font);
    root.style.setProperty('--font-heading', headingFont);
    root.style.setProperty('--card-radius', cardRadius);
  }, [templateCode, themeConfig, isArtsAndScience, isMedical, isUniversity, isEngineering]);

  return (
    <ThemeContext.Provider value={{ themeConfig, templateCode, isArtsAndScience, isEngineering, isMedical, isUniversity, styles }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
export const useTemplateTheme = () => {
  const { styles, templateCode, isArtsAndScience, isEngineering, isMedical, isUniversity } = useTheme();
  return { styles, templateCode, isArtsAndScience, isEngineering, isMedical, isUniversity };
};

