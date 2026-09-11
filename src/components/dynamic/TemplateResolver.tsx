import React from 'react';
import { useTenant } from '../../tenant/TenantContext';

interface TemplateResolverProps {
  children: React.ReactNode;
  templateCode?: string;
}

export const TemplateResolver: React.FC<TemplateResolverProps> = ({ children, templateCode: overrideCode }) => {
  const { siteConfig } = useTenant();
  const templateCode = overrideCode || siteConfig?.templateCode || 'ENGINEERING_MODERN';

  // Template-specific layout container classes & theme wrapper configuration
  const getTemplateContainerStyles = () => {
    switch (templateCode.toUpperCase()) {
      case 'ARTS_SCIENCE_MODERN':
        return {
          wrapperClass: 'template-arts-science font-serif bg-slate-50/50 dark:bg-slate-950/80',
          badgeText: 'Classic Arts & Science Academy',
          badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-900',
          accentBorder: 'border-t-4 border-emerald-600',
        };
      case 'MEDICAL_MODERN':
        return {
          wrapperClass: 'template-medical font-sans bg-teal-50/20 dark:bg-slate-950',
          badgeText: 'Clinical Healthcare & Medical Sciences',
          badgeClass: 'bg-teal-50 text-teal-800 border-teal-200 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-900',
          accentBorder: 'border-t-4 border-teal-600',
        };
      case 'UNIVERSITY_MODERN':
        return {
          wrapperClass: 'template-university font-serif bg-rose-50/20 dark:bg-slate-950',
          badgeText: 'Comprehensive Research University',
          badgeClass: 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-900',
          accentBorder: 'border-t-4 border-rose-700',
        };
      case 'ENGINEERING_MODERN':
      default:
        return {
          wrapperClass: 'template-engineering font-sans bg-slate-50/40 dark:bg-slate-950',
          badgeText: 'Modern Engineering & Technology',
          badgeClass: 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-900',
          accentBorder: 'border-t-4 border-blue-600',
        };
    }
  };

  const styleConfig = getTemplateContainerStyles();

  return (
    <div
      className={`min-h-screen flex flex-col w-full transition-colors duration-300 ${styleConfig.wrapperClass} ${styleConfig.accentBorder}`}
      data-template-code={templateCode}
    >
      {children}
    </div>
  );
};
