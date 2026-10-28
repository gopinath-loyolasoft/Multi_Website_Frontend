import React from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { TemplateHeaderProps } from '../contracts/TemplateContracts';
import { config3DNeumorphic } from './config';
import { NavigationMenuRenderer } from '../common/NavigationMenuRenderer';
import { TopbarAnnouncementBar } from '../../components/common/TopbarAnnouncementBar';

export const NeumorphicHeader: React.FC<TemplateHeaderProps> = (props) => {
  const { siteConfig, visibleMenus } = props;
  const { tenant, theme } = siteConfig;
  const themeConfig = theme?.configuration;
  const Crest = config3DNeumorphic.CrestIcon;

  return (
    <>
      <TopbarAnnouncementBar siteConfig={siteConfig} />
      <header className="sticky top-0 z-40 bg-[#eef2f6] text-slate-800 border-b border-slate-200/80 shadow-[0_10px_20px_rgba(163,177,198,0.3)] transition-all">
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
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-teal-600 ${config3DNeumorphic.crestBg} group-hover:scale-105 transition duration-200 shrink-0`}>
                <Crest className="w-6 h-6" />
              </div>
            )}
            <div>
              <span className={`text-xl leading-tight block text-slate-800 ${config3DNeumorphic.nameFont}`}>
                {siteConfig.settings?.siteName || tenant.name}
              </span>
              {(siteConfig.settings?.tagline || themeConfig?.badgeText) && (
                <span className={`text-[11px] tracking-wide block ${config3DNeumorphic.badgeFont}`}>
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
