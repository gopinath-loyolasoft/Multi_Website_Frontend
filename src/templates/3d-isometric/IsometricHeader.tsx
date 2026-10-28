import React from 'react';
import { Link } from 'react-router-dom';
import { Box } from 'lucide-react';
import { TemplateHeaderProps } from '../contracts/TemplateContracts';
import { config3DIsometric } from './config';
import { NavigationMenuRenderer } from '../common/NavigationMenuRenderer';
import { TopbarAnnouncementBar } from '../../components/common/TopbarAnnouncementBar';

export const IsometricHeader: React.FC<TemplateHeaderProps> = (props) => {
  const { siteConfig, visibleMenus } = props;
  const { tenant, theme } = siteConfig;
  const themeConfig = theme?.configuration;
  const Crest = config3DIsometric.CrestIcon;

  return (
    <>
      <TopbarAnnouncementBar siteConfig={siteConfig} />
      <header className="sticky top-0 z-40 bg-white text-slate-900 border-b-4 border-slate-900 shadow-md transition-all">
        <div className="max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-16 py-3.5 flex items-center justify-between">
          {/* Brand Logo & Name */}
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
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-slate-950 ${config3DIsometric.crestBg} group-hover:scale-105 transition duration-200 shrink-0`}>
                <Crest className="w-6 h-6" />
              </div>
            )}
            <div>
              <span className={`text-xl leading-tight block text-slate-900 ${config3DIsometric.nameFont}`}>
                {siteConfig.settings?.siteName || tenant.name}
              </span>
              {(siteConfig.settings?.tagline || themeConfig?.badgeText) && (
                <span className={`text-[11px] tracking-wide block ${config3DIsometric.badgeFont}`}>
                  {siteConfig.settings?.tagline || themeConfig?.badgeText}
                </span>
              )}
            </div>
          </Link>

          {/* Navigation Menu */}
          <NavigationMenuRenderer {...props} visibleMenus={visibleMenus} />
        </div>
      </header>
    </>
  );
};
