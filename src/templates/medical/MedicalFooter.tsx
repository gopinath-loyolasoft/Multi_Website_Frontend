import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Mail, MapPin, Phone } from 'lucide-react';
import { TemplateFooterProps } from '../contracts/TemplateContracts';
import { medicalConfig } from './config';

export const MedicalFooter: React.FC<TemplateFooterProps> = ({ siteConfig }) => {
  const { tenant, theme } = siteConfig;
  const themeConfig = theme?.configuration;
  const Crest = medicalConfig.CrestIcon;

  return (
    <footer className="bg-slate-950 text-slate-400 pt-16 pb-12 border-t border-slate-900">
      <div className="max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* Col 1 & 2: College Identity */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${medicalConfig.crestBg} shadow-md`}>
              <Crest className="w-6 h-6" />
            </div>
            <div>
              <span className={`text-xl text-white block leading-tight ${medicalConfig.nameFont}`}>{tenant.name}</span>
              <span className="text-xs font-semibold block mt-0.5 text-cyan-400">
                {siteConfig.settings?.tagline || medicalConfig.defaultBadge}
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
            {themeConfig?.badgeText || medicalConfig.footerDescription}
          </p>
        </div>

        {/* Col 3: Academic Schools */}
        <div>
          <h4 className="text-xs font-black text-white uppercase tracking-wider mb-4 border-b border-slate-800/80 pb-2">
            Clinical Departments
          </h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/departments" className="hover:text-white transition">Departments Directory</Link></li>
            <li><Link to="/courses" className="text-primary font-bold hover:underline">Medical Degrees & OPD →</Link></li>
          </ul>
        </div>

        {/* Col 4: Quick Student Links */}
        <div>
          <h4 className="text-xs font-black text-white uppercase tracking-wider mb-4 border-b border-slate-800/80 pb-2">
            Patient & Student Desk
          </h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/admissions" className="hover:text-white transition">NEET Admissions</Link></li>
            <li><Link to="/events" className="hover:text-white transition">Clinical Conferences</Link></li>
            <li><Link to="/gallery" className="hover:text-white transition">Hospital Tour</Link></li>
            <li><Link to="/faculty" className="hover:text-white transition">Doctors & Faculty</Link></li>
            <li><Link to="/news" className="hover:text-white transition">Medical Bulletins</Link></li>
          </ul>
        </div>

        {/* Col 5: Hospital Emergency & Contact */}
        <div>
          <h4 className="text-xs font-black text-white uppercase tracking-wider mb-4 border-b border-slate-800/80 pb-2">
            Emergency & Hospital Desk
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
                <span>Casualty / OPD Contact</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-16 mt-12 pt-6 border-t border-slate-900 flex flex-wrap items-center justify-between gap-4 text-[11px] text-slate-500">
        <div>
          © {new Date().getFullYear()} {tenant.name}. All rights reserved. Hospital CMS Platform.
        </div>
        <div className="text-[11px] text-slate-500 flex items-center gap-3">
          <span>Healthcare Portal: <strong className="text-teal-400 font-semibold">NMC Certified</strong></span>
          <span>•</span>
          <span>Tertiary Teaching Hospital</span>
        </div>
      </div>
    </footer>
  );
};
