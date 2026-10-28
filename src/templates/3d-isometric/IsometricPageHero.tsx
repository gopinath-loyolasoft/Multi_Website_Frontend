import React from 'react';
import { TemplatePageHeroProps } from '../contracts/TemplateContracts';
import { config3DIsometric } from './config';
import { Box } from 'lucide-react';

export const IsometricPageHero: React.FC<TemplatePageHeroProps> = ({
  badge,
  title,
  subtitle,
  icon,
  children,
}) => {
  const Crest = config3DIsometric.CrestIcon;

  return (
    <section className={`relative ${config3DIsometric.heroGradient} text-white pt-10 md:pt-12 pb-14 md:pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden border-b-4 border-slate-900`}>
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:20px_20px]" />

      <div className="max-w-4xl mx-auto relative z-10 text-center">
        {badge && (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg bg-amber-400 border-2 border-slate-900 text-xs font-mono font-black uppercase tracking-wider text-slate-950 mb-4 shadow-[3px_3px_0px_0px_#0f172a]">
            {icon || <Box className="w-4 h-4 text-slate-950" />}
            <span>{badge}</span>
          </div>
        )}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-4 font-sans drop-shadow-lg">
          {title}
        </h1>
        {subtitle && (
          <p className="text-slate-200 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed font-sans font-medium">
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </section>
  );
};
