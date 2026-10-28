import React from 'react';
import { TemplatePageHeroProps } from '../contracts/TemplateContracts';
import { config3DNeumorphic } from './config';
import { Shield } from 'lucide-react';

export const NeumorphicPageHero: React.FC<TemplatePageHeroProps> = ({
  badge,
  title,
  subtitle,
  icon,
  children,
}) => {
  const Crest = config3DNeumorphic.CrestIcon;

  return (
    <section className={`relative ${config3DNeumorphic.heroGradient} text-white pt-10 md:pt-12 pb-14 md:pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden`}>
      <div className="max-w-4xl mx-auto relative z-10 text-center">
        {badge && (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#eef2f6]/95 text-xs font-mono font-black uppercase tracking-wider text-teal-800 mb-4 shadow-[4px_4px_10px_rgba(0,0,0,0.3)]">
            {icon || <Shield className="w-3.5 h-3.5 text-teal-600" />}
            <span>{badge}</span>
          </div>
        )}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-4 font-sans drop-shadow-xl">
          {title}
        </h1>
        {subtitle && (
          <p className="text-slate-200 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed font-sans font-normal drop-shadow-md">
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </section>
  );
};
