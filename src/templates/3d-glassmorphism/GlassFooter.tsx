import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Mail, MapPin, Phone, Sparkles } from 'lucide-react';
import { TemplateFooterProps } from '../contracts/TemplateContracts';
import { config3DGlass } from './config';
import { GlassButton } from './components/GlassButton';

export const GlassFooter: React.FC<TemplateFooterProps> = ({ siteConfig }) => {
  const { tenant, theme } = siteConfig;
  const themeConfig = theme?.configuration;
  const Crest = config3DGlass.CrestIcon;

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-white/10 relative overflow-hidden">
      {/* Background Aurora Orbs */}
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

      <div className="max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 relative z-10">
        {/* Col 1 & 2: College Identity */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-cyan-300 ${config3DGlass.crestBg} shadow-[0_0_20px_rgba(6,182,212,0.3)]`}>
              <Crest className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className={`text-xl text-white block leading-tight ${config3DGlass.nameFont}`}>{tenant.name}</span>
              <span className="text-xs font-bold block mt-0.5 text-cyan-400 font-mono">
                {siteConfig.settings?.tagline || config3DGlass.defaultBadge}
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-300 max-w-sm leading-relaxed">
            {themeConfig?.badgeText || config3DGlass.footerDescription}
          </p>
        </div>

        {/* Col 3: Academic Schools */}
        <div>
          <h4 className="text-xs font-black text-white uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
            Academics & Admissions
          </h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/departments" className="hover:text-cyan-400 transition">Academic Departments</Link></li>
            <li><Link to="/courses" className="text-cyan-400 font-bold hover:underline">Degree Programs & Syllabi →</Link></li>
            <li><Link to="/library" className="hover:text-cyan-400 transition">Central Library & Archives</Link></li>
            <li><Link to="/faculty" className="hover:text-cyan-400 transition">Faculty Directory</Link></li>
          </ul>
        </div>

        {/* Col 4: Campus Portals & Facilities */}
        <div>
          <h4 className="text-xs font-black text-white uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
            Student & Campus Life
          </h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/placements" className="hover:text-cyan-400 transition">Career & Placements</Link></li>
            <li><Link to="/facilities" className="hover:text-cyan-400 transition">Research Centers & Labs</Link></li>
            <li><Link to="/alumni" className="hover:text-cyan-400 transition">Alumni Association</Link></li>
            <li><Link to="/compliance" className="hover:text-cyan-400 transition text-slate-300 font-medium">Accreditation & NIRF</Link></li>
          </ul>
        </div>

        {/* Col 5: Campus Helpline & Contact */}
        <div>
          <h4 className="text-xs font-black text-white uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
            Campus Helpdesk
          </h4>
          <div className="space-y-2.5 text-xs text-slate-300">
            {siteConfig.settings?.address && (
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>{siteConfig.settings.address}</span>
              </div>
            )}
            {siteConfig.settings?.contactPhone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>{siteConfig.settings.contactPhone}</span>
              </div>
            )}
            {siteConfig.settings?.contactEmail && (
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>{siteConfig.settings.contactEmail}</span>
              </div>
            )}
            <div className="pt-2">
              <Link to="/contact">
                <GlassButton variant="cyan" size="sm">
                  Contact Campus
                </GlassButton>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-16 mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-4">
        <span>© {new Date().getFullYear()} {tenant.name}. All Rights Reserved.</span>
        <div className="flex items-center gap-4">
          <Link to="/compliance" className="hover:text-white transition">Privacy Policy</Link>
          <span>•</span>
          <Link to="/compliance" className="hover:text-white transition">Terms of Service</Link>
          <span>•</span>
          <Link to="/compliance" className="hover:text-white transition">Accessibility</Link>
        </div>
      </div>
    </footer>
  );
};
