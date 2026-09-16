import React from 'react';
import { Link } from 'react-router-dom';
import { TemplateHeaderProps } from '../contracts/TemplateContracts';
import { universityConfig } from './config';
import { NavigationMenuRenderer } from '../common/NavigationMenuRenderer';

export const UniversityHeader: React.FC<TemplateHeaderProps> = (props) => {
  const { siteConfig, visibleMenus } = props;
  const { tenant, theme } = siteConfig;
  const themeConfig = theme?.configuration;
  const Crest = universityConfig.CrestIcon;

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 text-white shadow-sm transition-colors">
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
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-white ${universityConfig.crestBg} group-hover:scale-105 transition duration-300 shrink-0`}>
              <Crest className="w-6 h-6 text-rose-200" />
            </div>
          )}
          <div>
            <span className={`text-xl leading-tight block text-white ${universityConfig.nameFont}`}>
              {siteConfig.settings?.siteName || tenant.name}
            </span>
            <span className={`text-[11px] tracking-wide block ${universityConfig.badgeFont}`}>
              {siteConfig.settings?.tagline || themeConfig?.badgeText || universityConfig.defaultBadge}
            </span>
          </div>
        </Link>

        {/* Navigation */}
        <NavigationMenuRenderer {...props} visibleMenus={visibleMenus} isUniversity={true} />
      </div>
    </header>
  );
};
