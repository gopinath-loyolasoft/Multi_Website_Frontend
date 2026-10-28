import React from 'react';
import { TemplatePageHeroProps } from '../contracts/TemplateContracts';
import { config3DKinetic } from './config';
import { Zap } from 'lucide-react';

export const KineticPageHero: React.FC<TemplatePageHeroProps> = ({
  badge,
  title,
  subtitle,
  icon,
  children,
}) => {
  const Crest = config3DKinetic.CrestIcon;

  return (
    <section className={`relative ${config3DKinetic.heroGradient} text-white pt-10 md:pt-12 pb-14 md:pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden`}>
      <div className="absolute top-0 right-10 w-72 h-72 rounded-full bg-rose-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-72 h-72 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#f43f5e_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="max-w-4xl mx-auto relative z-10 text-center">
        {badge && (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/20 border border-rose-500/50 text-xs font-mono font-bold uppercase tracking-wider text-rose-300 mb-4 backdrop-blur-xl shadow-[0_0_20px_rgba(244,63,94,0.3)]">
            {icon || <Zap className="w-3.5 h-3.5 text-rose-400" />}
            <span>{badge}</span>
          </div>
        )}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-4 font-sans drop-shadow-2xl">
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
