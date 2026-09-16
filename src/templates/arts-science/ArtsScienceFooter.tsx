import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Mail, MapPin, Phone } from 'lucide-react';
import { TemplateFooterProps } from '../contracts/TemplateContracts';
import { artsScienceConfig } from './config';

export const ArtsScienceFooter: React.FC<TemplateFooterProps> = ({ siteConfig }) => {
  const { tenant, theme } = siteConfig;
  const themeConfig = theme?.configuration;
  const Crest = artsScienceConfig.CrestIcon;

  return (
    <footer className="bg-slate-950 text-slate-400 pt-16 pb-12 border-t border-slate-900 font-serif">
      <div className="max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* Col 1 & 2: College Identity */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${artsScienceConfig.crestBg} shadow-md`}>
              <Crest className="w-6 h-6" />
            </div>
            <div>
              <span className={`text-xl text-white block leading-tight ${artsScienceConfig.nameFont}`}>{tenant.name}</span>
              <span className="text-xs font-semibold block mt-0.5 text-emerald-400 font-serif">
                {siteConfig.settings?.tagline || artsScienceConfig.defaultBadge}
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-400 max-w-sm leading-relaxed font-serif">
            {themeConfig?.badgeText || artsScienceConfig.footerDescription}
          </p>
        </div>

        {/* Col 3: Academic Schools */}
        <div>
          <h4 className="text-xs font-black text-white uppercase tracking-wider mb-4 border-b border-slate-800/80 pb-2">
            Academic Schools
          </h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/departments" className="hover:text-white transition">Departments Directory</Link></li>
            <li><Link to="/courses" className="text-primary font-bold hover:underline">Explore Degree Programs →</Link></li>
          </ul>
        </div>

        {/* Col 4: Quick Student Links */}
        <div>
          <h4 className="text-xs font-black text-white uppercase tracking-wider mb-4 border-b border-slate-800/80 pb-2">
            Admissions & Campus
          </h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/admissions" className="hover:text-white transition">Admissions</Link></li>
            <li><Link to="/events" className="hover:text-white transition">Events Calendar</Link></li>
            <li><Link to="/gallery" className="hover:text-white transition">Campus Gallery</Link></li>
            <li><Link to="/faculty" className="hover:text-white transition">Faculty Directory</Link></li>
            <li><Link to="/news" className="hover:text-white transition">Latest News</Link></li>
          </ul>
        </div>

        {/* Col 5: Campus Helpline & Contact */}
        <div>
          <h4 className="text-xs font-black text-white uppercase tracking-wider mb-4 border-b border-slate-800/80 pb-2">
            Campus Office
          </h4>
          <div className="space-y-2.5 text-xs text-slate-400">
            {siteConfig.settings?.address && (
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>{siteConfig.settings.address}</span>
              </div>
            )}
            {siteConfig.settings?.contactPhone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <span>{siteConfig.settings.contactPhone}</span>
              </div>
            )}
            {siteConfig.settings?.contactEmail && (
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <span>{siteConfig.settings.contactEmail}</span>
              </div>
            )}
            <div className="pt-2">
              <Link
                to="/contact"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 transition"
              >
                <span>Contact Helpdesk</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-16 mt-12 pt-6 border-t border-slate-900 flex flex-wrap items-center justify-between gap-4 text-[11px] text-slate-500">
        <div>
          © {new Date().getFullYear()} {tenant.name}. All rights reserved. Powered by Institutional Dynamic CMS.
        </div>
        <div className="text-[11px] text-slate-500 flex items-center gap-3">
          <span>Portal: <strong className="text-emerald-400 font-semibold">Active & Certified</strong></span>
          <span>•</span>
          <span>Accredited Campus Network</span>
        </div>
      </div>
    </footer>
  );
};
