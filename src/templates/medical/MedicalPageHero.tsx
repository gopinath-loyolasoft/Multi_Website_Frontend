import React from 'react';
import { TemplatePageHeroProps } from '../contracts/TemplateContracts';
import { medicalConfig } from './config';

export const MedicalPageHero: React.FC<TemplatePageHeroProps> = ({
  badge,
  title,
  subtitle,
  icon,
  children,
}) => {
  const Crest = medicalConfig.CrestIcon;

  return (
    <section className={`relative ${medicalConfig.heroGradient} text-white py-16 md:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden`}>
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
      <div className="max-w-4xl mx-auto relative z-10 text-center">
        {badge && (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold uppercase tracking-wider text-teal-200 mb-4">
            {icon || <Crest className="w-4 h-4 text-teal-300" />}
            <span>{badge}</span>
          </div>
        )}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-4 font-sans">
          {title}
        </h1>
        {subtitle && (
          <p className="text-slate-200 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed font-sans">
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </section>
  );
};
