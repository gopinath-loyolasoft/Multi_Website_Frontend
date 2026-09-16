import React from 'react';
import { Link } from 'react-router-dom';
import { HeartPulse } from 'lucide-react';
import { TemplateHeaderProps } from '../contracts/TemplateContracts';
import { medicalConfig } from './config';
import { NavigationMenuRenderer } from '../common/NavigationMenuRenderer';

export const MedicalHeader: React.FC<TemplateHeaderProps> = (props) => {
  const { siteConfig, visibleMenus } = props;
  const { tenant, theme } = siteConfig;
  const themeConfig = theme?.configuration;
  const Crest = medicalConfig.CrestIcon;

  return (
    <>
      {/* 24/7 Hospital & Clinical Hotline Topbar */}
      <div className="bg-teal-900 text-teal-100 text-xs py-1.5 px-6 sm:px-10 flex flex-wrap items-center justify-between gap-2 border-b border-teal-800 font-medium">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-teal-300 font-bold">
            <HeartPulse className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
            <span>24/7 Casualty & Hospital Helpline: +91 98765 43210</span>
          </span>
          <span className="hidden md:inline text-teal-400">|</span>
          <span className="hidden md:inline text-teal-200 text-[11px]">NMC Recognized • 1200-Bed Teaching Hospital</span>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <Link to="/contact" className="hover:underline text-teal-200">Patient Desk</Link>
          <span>•</span>
          <Link to="/admissions" className="hover:underline text-amber-300 font-bold">NEET Admissions 2026</Link>
        </div>
      </div>

      {/* Main Medical Header */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-teal-100 dark:border-slate-800 shadow-sm transition-colors">
        <div className="max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-16 py-3.5 flex items-center justify-between">
          {/* College Crest & Name */}
          <Link to="/" className="flex items-center gap-3.5 group">
            {siteConfig.settings?.logoUrl ? (
              <img
                src={siteConfig.settings.logoUrl}
                alt={siteConfig.settings?.siteName || tenant.name}
                className="h-11 max-w-[160px] object-contain group-hover:scale-105 transition duration-300 shrink-0"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-white ${medicalConfig.crestBg} group-hover:scale-105 transition duration-300 shrink-0`}>
                <Crest className="w-6 h-6" />
              </div>
            )}
            <div>
              <span className={`text-xl leading-tight block text-slate-900 dark:text-white ${medicalConfig.nameFont}`}>
                {siteConfig.settings?.siteName || tenant.name}
              </span>
              <span className={`text-[11px] tracking-wide block ${medicalConfig.badgeFont}`}>
                {siteConfig.settings?.tagline || themeConfig?.badgeText || medicalConfig.defaultBadge}
              </span>
            </div>
          </Link>

          {/* Navigation */}
          <NavigationMenuRenderer {...props} visibleMenus={visibleMenus} />
        </div>
      </header>
    </>
  );
};
