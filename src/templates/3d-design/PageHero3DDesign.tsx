import React from 'react';
import { TemplatePageHeroProps } from '../contracts/TemplateContracts';
import { config3DDesign } from './config';

export const PageHero3DDesign: React.FC<TemplatePageHeroProps> = ({
  badge,
  title,
  subtitle,
  icon,
  children,
}) => {
  const Crest = config3DDesign.CrestIcon;

  return (
    <section className={`relative ${config3DDesign.heroGradient} text-white pt-10 md:pt-12 pb-14 md:pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden`}>
      {/* 3D Diagonal Gold Slice in background */}
      <div
        className="absolute top-0 right-10 w-64 h-full bg-[#e5a912] opacity-20 -skew-x-12 transform pointer-events-none"
      />
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="max-w-4xl mx-auto relative z-10 text-center">
        {badge && (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 -skew-x-12 bg-[#0b3353] border border-amber-400/50 text-xs font-bold uppercase tracking-wider text-amber-300 mb-4 shadow-md">
            <span className="skew-x-12 inline-flex items-center gap-2">
              {icon || <Crest className="w-4 h-4 text-amber-300" />}
              <span>{badge}</span>
            </span>
          </div>
        )}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-4 font-sans">
          {title}
        </h1>
        {subtitle && (
          <p className="text-slate-100 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed font-sans font-normal">
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </section>
  );
};

export const SalesianPageHero = PageHero3DDesign;

