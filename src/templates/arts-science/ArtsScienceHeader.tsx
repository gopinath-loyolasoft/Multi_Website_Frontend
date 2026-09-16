import React from 'react';
import { Link } from 'react-router-dom';
import { TemplateHeaderProps } from '../contracts/TemplateContracts';
import { artsScienceConfig } from './config';
import { NavigationMenuRenderer } from '../common/NavigationMenuRenderer';

export const ArtsScienceHeader: React.FC<TemplateHeaderProps> = (props) => {
  const { siteConfig, visibleMenus } = props;
  const { tenant, theme } = siteConfig;
  const themeConfig = theme?.configuration;
  const Crest = artsScienceConfig.CrestIcon;

  return (
    <header className="sticky top-0 z-40 bg-amber-50/80 dark:bg-slate-900/95 backdrop-blur-md border-b border-amber-200/80 dark:border-slate-800 shadow-sm transition-colors font-serif">
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
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-white ${artsScienceConfig.crestBg} group-hover:scale-105 transition duration-300 shrink-0`}>
              <Crest className="w-6 h-6" />
            </div>
          )}
          <div>
            <span className={`text-xl leading-tight block text-slate-900 dark:text-white ${artsScienceConfig.nameFont}`}>
              {siteConfig.settings?.siteName || tenant.name}
            </span>
            <span className={`text-[11px] tracking-wide block ${artsScienceConfig.badgeFont}`}>
              {siteConfig.settings?.tagline || themeConfig?.badgeText || artsScienceConfig.defaultBadge}
            </span>
          </div>
        </Link>

        {/* Navigation */}
        <NavigationMenuRenderer {...props} visibleMenus={visibleMenus} isArtsAndScience={true} />
      </div>
    </header>
  );
};
