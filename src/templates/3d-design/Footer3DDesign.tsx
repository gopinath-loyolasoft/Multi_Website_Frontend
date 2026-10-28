import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Mail, MapPin, Phone } from 'lucide-react';
import { TemplateFooterProps } from '../contracts/TemplateContracts';
import { config3DDesign } from './config';

export const Footer3DDesign: React.FC<TemplateFooterProps> = ({ siteConfig }) => {
  const { tenant, theme } = siteConfig;
  const themeConfig = theme?.configuration;
  const Crest = config3DDesign.CrestIcon;

  return (
    <footer className="bg-[#0b3353] text-slate-300 pt-16 pb-12 border-t-4 border-[#e5a912] relative overflow-hidden">
      {/* Background Accent Slant */}
      <div className="absolute top-0 right-0 w-96 h-full bg-[#134975]/30 -skew-x-12 transform pointer-events-none" />

      <div className="max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 relative z-10">
        {/* Col 1 & 2: College Identity */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 -skew-x-12 flex items-center justify-center text-amber-300 ${config3DDesign.crestBg} shadow-md`}>
              <div className="skew-x-12">
                <Crest className="w-6 h-6" />
              </div>
            </div>
            <div>
              <span className={`text-xl text-white block leading-tight ${config3DDesign.nameFont}`}>{tenant.name}</span>
              <span className="text-xs font-bold block mt-0.5 text-amber-400">
                {siteConfig.settings?.tagline || config3DDesign.defaultBadge}
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-300 max-w-sm leading-relaxed">
            {themeConfig?.badgeText || config3DDesign.footerDescription}
          </p>
        </div>

        {/* Col 3: Academic Schools */}
        <div>
          <h4 className="text-xs font-black text-white uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
            Academics & Admissions
          </h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/departments" className="hover:text-amber-400 transition">Academic Departments</Link></li>
            <li><Link to="/courses" className="text-amber-400 font-bold hover:underline">Degree Programs & ITEP →</Link></li>
            <li><Link to="/library" className="hover:text-amber-400 transition">Central Library & Reading Rooms</Link></li>
            <li><Link to="/faculty" className="hover:text-amber-400 transition">Faculty Directory</Link></li>
          </ul>
        </div>

        {/* Col 4: Campus Portals & Facilities */}
        <div>
          <h4 className="text-xs font-black text-white uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
            Student & Campus Life
          </h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/placements" className="hover:text-amber-400 transition">Training & Placements</Link></li>
            <li><Link to="/facilities" className="hover:text-amber-400 transition">Campus Facilities & Labs</Link></li>
            <li><Link to="/alumni" className="hover:text-amber-400 transition">Alumni Network</Link></li>
            <li><Link to="/compliance" className="hover:text-amber-400 transition text-slate-300 font-medium">IQAC & NIRF Policies</Link></li>
          </ul>
        </div>

        {/* Col 5: Campus Helpline & Contact */}
        <div>
          <h4 className="text-xs font-black text-white uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
            Contact Administration
          </h4>
          <div className="space-y-2.5 text-xs text-slate-300">
            {siteConfig.settings?.address && (
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{siteConfig.settings.address}</span>
              </div>
            )}
            {siteConfig.settings?.contactPhone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{siteConfig.settings.contactPhone}</span>
              </div>
            )}
            {siteConfig.settings?.contactEmail && (
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{siteConfig.settings.contactEmail}</span>
              </div>
            )}
            <div className="pt-2">
              <Link
                to="/contact"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 -skew-x-12 text-[11px] font-bold bg-[#e5a912] text-slate-950 hover:bg-amber-400 transition shadow-md"
              >
                <span className="skew-x-12 inline-flex items-center gap-1">
                  <span>Contact Helpdesk</span>
                  <ExternalLink className="w-3 h-3" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-16 mt-12 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-[11px] text-slate-400">
        <div>
          © {new Date().getFullYear()} {tenant.name}. All rights reserved.
        </div>
        <div className="text-[11px] text-slate-400 flex items-center gap-3">
          <span>Accreditation: <strong className="text-amber-400 font-semibold">Autonomous NAAC 'A' Grade</strong></span>
        </div>
      </div>
    </footer>
  );
};

export const SalesianFooter = Footer3DDesign;

