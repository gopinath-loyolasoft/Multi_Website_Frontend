import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, Lock } from 'lucide-react';
import { TemplateHeaderProps } from '../contracts/TemplateContracts';
import { config3DGlass } from './config';
import { NavigationMenuRenderer } from '../common/NavigationMenuRenderer';
import { TopbarAnnouncementBar } from '../../components/common/TopbarAnnouncementBar';

export const GlassHeader: React.FC<TemplateHeaderProps> = (props) => {
  const { siteConfig, visibleMenus } = props;
  const { tenant, theme } = siteConfig;
  const themeConfig = theme?.configuration;
  const Crest = config3DGlass.CrestIcon;

  return (
    <>
      <TopbarAnnouncementBar siteConfig={siteConfig} />
      <header className="sticky top-0 z-40 bg-slate-950/75 backdrop-blur-2xl text-white shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] border-b border-white/10 transition-all">
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
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-cyan-300 ${config3DGlass.crestBg} group-hover:scale-105 transition duration-300 shrink-0 shadow-[0_0_20px_rgba(6,182,212,0.3)]`}>
                <Crest className="w-6 h-6 animate-pulse" />
              </div>
            )}
            <div>
              <span className={`text-xl leading-tight block text-white ${config3DGlass.nameFont}`}>
                {siteConfig.settings?.siteName || tenant.name}
              </span>
              {(siteConfig.settings?.tagline || themeConfig?.badgeText) && (
                <span className={`text-[11px] tracking-wide block ${config3DGlass.badgeFont}`}>
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
