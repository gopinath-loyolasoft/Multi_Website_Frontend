import React from 'react';
import { Link } from 'react-router-dom';
import { TemplateHeaderProps } from '../contracts/TemplateContracts';
import { config3DDesign } from './config';
import { NavigationMenuRenderer } from '../common/NavigationMenuRenderer';
import { TopbarAnnouncementBar } from '../../components/common/TopbarAnnouncementBar';

export const Header3DDesign: React.FC<TemplateHeaderProps> = (props) => {
  const { siteConfig, visibleMenus } = props;
  const { tenant, theme } = siteConfig;
  const themeConfig = theme?.configuration;
  const Crest = config3DDesign.CrestIcon;

  return (
    <>
      <TopbarAnnouncementBar siteConfig={siteConfig} />
      <header className="sticky top-0 z-40 bg-[#134975] text-white shadow-lg border-b-2 border-[#e5a912] transition-colors">
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
              <div className={`w-11 h-11 -skew-x-12 flex items-center justify-center text-amber-300 ${config3DDesign.crestBg} group-hover:scale-105 transition duration-300 shrink-0`}>
                <div className="skew-x-12">
                  <Crest className="w-6 h-6" />
                </div>
              </div>
            )}
            <div>
              <span className={`text-xl leading-tight block text-white ${config3DDesign.nameFont}`}>
                {siteConfig.settings?.siteName || tenant.name}
              </span>
              {(siteConfig.settings?.tagline || themeConfig?.badgeText) && (
                <span className={`text-[11px] tracking-wide block ${config3DDesign.badgeFont}`}>
                  {siteConfig.settings?.tagline || themeConfig?.badgeText}
                </span>
              )}
            </div>
          </Link>

          {/* Navigation */}
          <NavigationMenuRenderer {...props} visibleMenus={visibleMenus} is3DDesign={true} />
        </div>
      </header>
    </>
  );
};

export const SalesianHeader = Header3DDesign;

