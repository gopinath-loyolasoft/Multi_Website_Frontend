import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Mail, MapPin, Phone, Zap } from 'lucide-react';
import { TemplateFooterProps } from '../contracts/TemplateContracts';
import { config3DKinetic } from './config';
import { KineticRibbonButton } from './components/KineticRibbonButton';

export const KineticFooter: React.FC<TemplateFooterProps> = ({ siteConfig }) => {
  const { tenant, theme } = siteConfig;
  const themeConfig = theme?.configuration;
  const Crest = config3DKinetic.CrestIcon;

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-rose-500/20 relative">
      <div className="max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 relative z-10">
        {/* Col 1 & 2: College Identity */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-white ${config3DKinetic.crestBg} shadow-[0_0_15px_rgba(244,63,94,0.4)]`}>
              <Crest className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className={`text-xl text-white block leading-tight ${config3DKinetic.nameFont}`}>{tenant.name}</span>
              <span className="text-xs font-bold block mt-0.5 text-rose-400 font-mono">
                {siteConfig.settings?.tagline || config3DKinetic.defaultBadge}
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-300 max-w-sm leading-relaxed">
            {themeConfig?.badgeText || config3DKinetic.footerDescription}
          </p>
        </div>

        {/* Col 3: Academic Schools */}
        <div>
          <h4 className="text-xs font-black text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
            Academics & Faculty
          </h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/departments" className="hover:text-rose-400 transition">Academic Departments</Link></li>
            <li><Link to="/courses" className="text-rose-400 font-bold hover:underline">Degrees & Syllabi →</Link></li>
            <li><Link to="/library" className="hover:text-rose-400 transition">Central Library & Repositories</Link></li>
            <li><Link to="/faculty" className="hover:text-rose-400 transition">Faculty Directory</Link></li>
          </ul>
        </div>

        {/* Col 4: Campus Portals & Facilities */}
        <div>
          <h4 className="text-xs font-black text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
            Student Life & Career
          </h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/placements" className="hover:text-rose-400 transition">Corporate Placement Cell</Link></li>
            <li><Link to="/facilities" className="hover:text-rose-400 transition">Smart Innovation Labs</Link></li>
            <li><Link to="/alumni" className="hover:text-rose-400 transition">Global Alumni Network</Link></li>
            <li><Link to="/compliance" className="hover:text-rose-400 transition text-slate-300 font-medium">Statutory Compliance</Link></li>
          </ul>
        </div>

        {/* Col 5: Campus Helpline & Contact */}
        <div>
          <h4 className="text-xs font-black text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
            Connect With Us
          </h4>
          <div className="space-y-2.5 text-xs text-slate-300">
            {siteConfig.settings?.address && (
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{siteConfig.settings.address}</span>
              </div>
            )}
            {siteConfig.settings?.contactPhone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{siteConfig.settings.contactPhone}</span>
              </div>
            )}
            {siteConfig.settings?.contactEmail && (
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{siteConfig.settings.contactEmail}</span>
              </div>
            )}
            <div className="pt-2">
              <Link to="/contact">
                <KineticRibbonButton variant="rose" size="sm">
                  Contact Helpdesk
                </KineticRibbonButton>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-16 mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-4">
        <span>© {new Date().getFullYear()} {tenant.name}. Powered by 3D Kinetic Design System.</span>
        <div className="flex items-center gap-4">
          <Link to="/compliance" className="hover:text-white transition">Privacy Policy</Link>
          <span>•</span>
          <Link to="/compliance" className="hover:text-white transition">Terms</Link>
          <span>•</span>
          <Link to="/compliance" className="hover:text-white transition">Accessibility</Link>
        </div>
      </div>
    </footer>
  );
};
