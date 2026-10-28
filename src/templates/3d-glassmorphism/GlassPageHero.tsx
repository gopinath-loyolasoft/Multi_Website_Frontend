import React from 'react';
import { TemplatePageHeroProps } from '../contracts/TemplateContracts';
import { config3DGlass } from './config';
import { Sparkles } from 'lucide-react';

export const GlassPageHero: React.FC<TemplatePageHeroProps> = ({
  badge,
  title,
  subtitle,
  icon,
  children,
}) => {
  const Crest = config3DGlass.CrestIcon;

  return (
    <section className={`relative ${config3DGlass.heroGradient} text-white pt-10 md:pt-12 pb-14 md:pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden`}>
      {/* Floating 3D Frosted Glass Prism Orbs */}
      <div className="absolute top-0 right-10 w-80 h-80 rounded-full bg-gradient-to-tr from-cyan-500/20 to-purple-600/20 blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-0 left-10 w-80 h-80 rounded-full bg-gradient-to-tr from-blue-600/20 to-teal-400/20 blur-3xl pointer-events-none" />
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:20px_20px]" />

      <div className="max-w-4xl mx-auto relative z-10 text-center">
        {badge && (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-cyan-400/40 text-xs font-mono font-bold uppercase tracking-wider text-cyan-300 mb-4 backdrop-blur-xl shadow-[0_0_20px_rgba(6,182,212,0.3)]">
            {icon || <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '4s' }} />}
            <span>{badge}</span>
          </div>
        )}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-4 font-sans drop-shadow-[0_4px_20px_rgba(0,0,0,0.7)]">
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
