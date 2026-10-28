import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Mail, MapPin, Phone, Shield } from 'lucide-react';
import { TemplateFooterProps } from '../contracts/TemplateContracts';
import { config3DNeumorphic } from './config';
import { NeumorphicButton } from './components/NeumorphicButton';

export const NeumorphicFooter: React.FC<TemplateFooterProps> = ({ siteConfig }) => {
  const { tenant, theme } = siteConfig;
  const themeConfig = theme?.configuration;
  const Crest = config3DNeumorphic.CrestIcon;

  return (
    <footer className="bg-[#eef2f6] text-slate-700 pt-16 pb-12 border-t border-slate-200 shadow-[0_-10px_20px_rgba(163,177,198,0.2)] relative">
      <div className="max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 relative z-10">
        {/* Col 1 & 2: College Identity */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-teal-600 ${config3DNeumorphic.crestBg}`}>
              <Crest className="w-6 h-6" />
            </div>
            <div>
              <span className={`text-xl text-slate-800 block leading-tight ${config3DNeumorphic.nameFont}`}>{tenant.name}</span>
              <span className="text-xs font-bold block mt-0.5 text-teal-700 font-mono">
                {siteConfig.settings?.tagline || config3DNeumorphic.defaultBadge}
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-600 max-w-sm leading-relaxed font-medium">
            {themeConfig?.badgeText || config3DNeumorphic.footerDescription}
          </p>
        </div>

        {/* Col 3: Academic Schools */}
        <div>
          <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-4 border-b border-slate-300 pb-2">
            Academics & Study
          </h4>
          <ul className="space-y-2 text-xs font-bold">
            <li><Link to="/departments" className="hover:text-teal-600 transition">Academic Departments</Link></li>
            <li><Link to="/courses" className="text-teal-600 font-black hover:underline">Degree Programs & Syllabi →</Link></li>
            <li><Link to="/library" className="hover:text-teal-600 transition">Central Library & Archives</Link></li>
            <li><Link to="/faculty" className="hover:text-teal-600 transition">Faculty Directory</Link></li>
          </ul>
        </div>

        {/* Col 4: Campus Portals & Facilities */}
        <div>
          <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-4 border-b border-slate-300 pb-2">
            Campus Experience
          </h4>
          <ul className="space-y-2 text-xs font-bold">
            <li><Link to="/placements" className="hover:text-teal-600 transition">Career & Training Cell</Link></li>
            <li><Link to="/facilities" className="hover:text-teal-600 transition">Research Centers & Labs</Link></li>
            <li><Link to="/alumni" className="hover:text-teal-600 transition">Alumni Association</Link></li>
            <li><Link to="/compliance" className="hover:text-teal-600 transition text-slate-600 font-medium">Accreditation Policies</Link></li>
          </ul>
        </div>

        {/* Col 5: Campus Helpline & Contact */}
        <div>
          <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-4 border-b border-slate-300 pb-2">
            Campus Helpdesk
          </h4>
          <div className="space-y-2.5 text-xs text-slate-600 font-medium">
            {siteConfig.settings?.address && (
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span>{siteConfig.settings.address}</span>
              </div>
            )}
            {siteConfig.settings?.contactPhone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-teal-600 shrink-0" />
                <span>{siteConfig.settings.contactPhone}</span>
              </div>
            )}
            {siteConfig.settings?.contactEmail && (
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-teal-600 shrink-0" />
                <span>{siteConfig.settings.contactEmail}</span>
              </div>
            )}
            <div className="pt-2">
              <Link to="/contact">
                <NeumorphicButton variant="teal" size="sm">
                  Contact Helpdesk
                </NeumorphicButton>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-16 mt-12 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-4 font-bold">
        <span>© {new Date().getFullYear()} {tenant.name}. 3D Neumorphic Design System.</span>
        <div className="flex items-center gap-4">
          <Link to="/compliance" className="hover:text-slate-800 transition">Privacy Policy</Link>
          <span>•</span>
          <Link to="/compliance" className="hover:text-slate-800 transition">Terms</Link>
          <span>•</span>
          <Link to="/compliance" className="hover:text-slate-800 transition">Accessibility</Link>
        </div>
      </div>
    </footer>
  );
};
