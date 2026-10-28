import React from 'react';
import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';
import { TemplateHeaderProps } from '../contracts/TemplateContracts';
import { config3DKinetic } from './config';
import { NavigationMenuRenderer } from '../common/NavigationMenuRenderer';
import { TopbarAnnouncementBar } from '../../components/common/TopbarAnnouncementBar';

export const KineticHeader: React.FC<TemplateHeaderProps> = (props) => {
  const { siteConfig, visibleMenus } = props;
  const { tenant, theme } = siteConfig;
  const themeConfig = theme?.configuration;
  const Crest = config3DKinetic.CrestIcon;

  return (
    <>
      <TopbarAnnouncementBar siteConfig={siteConfig} />
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-2xl text-white shadow-2xl border-b border-rose-500/30 transition-all">
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
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-white ${config3DKinetic.crestBg} group-hover:scale-105 transition duration-300 shrink-0 shadow-[0_0_15px_rgba(244,63,94,0.4)]`}>
                <Crest className="w-6 h-6 animate-pulse" />
              </div>
            )}
            <div>
              <span className={`text-xl leading-tight block text-white ${config3DKinetic.nameFont}`}>
                {siteConfig.settings?.siteName || tenant.name}
              </span>
              {(siteConfig.settings?.tagline || themeConfig?.badgeText) && (
                <span className={`text-[11px] tracking-wide block ${config3DKinetic.badgeFont}`}>
                  {siteConfig.settings?.tagline || themeConfig?.badgeText}
                </span>
              )}
            </div>
          </Link>

          {/* Navigation Menu */}
          <NavigationMenuRenderer {...props} visibleMenus={visibleMenus} is3DDesign={true} />
        </div>
      </header>
    </>
  );
};
