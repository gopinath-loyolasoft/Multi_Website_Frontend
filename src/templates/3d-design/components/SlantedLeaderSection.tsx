import React from 'react';
import { SlantedButton } from './SlantedButton';

export interface SlantedLeaderSectionProps {
  tagline?: string;
  name: string;
  description: string;
  imageSrc: string;
  ctaText?: string;
  onCtaClick?: () => void;
  className?: string;
}

export const SlantedLeaderSection: React.FC<SlantedLeaderSectionProps> = ({
  tagline = 'DISTINGUISHED PATRON & MENTOR',
  name = 'Leadership',
  description,
  imageSrc,
  ctaText = 'Read Message',
  onCtaClick,
  className = '',
}) => {
  return (
    <section className={`relative py-20 bg-white overflow-hidden ${className}`}>
      {/* Diagonal Gold Slice in Background */}
      <div
        className="absolute top-0 right-1/4 w-1/3 h-full bg-[#e5a912] -skew-x-12 transform pointer-events-none opacity-95 hidden md:block"
        style={{ zIndex: 0 }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Portrait with 3D shadow & subtle frame */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative group max-w-md w-full">
              {/* Back Accent Skew Card */}
              <div className="absolute -inset-2 bg-slate-900 -skew-x-6 transform rounded-sm opacity-20 group-hover:opacity-40 transition-opacity" />
              <img
                src={imageSrc}
                alt={name}
                className="relative z-10 w-full h-[420px] object-cover shadow-2xl border-4 border-white"
              />
            </div>
          </div>

          {/* Right Column: Information & Slanted CTA */}
          <div className="lg:col-span-7 bg-white/95 backdrop-blur-sm lg:bg-transparent p-6 lg:p-0 rounded-lg">
            <p className="text-xs font-black uppercase tracking-widest text-[#134975] mb-2 font-mono">
              {tagline}
            </p>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
              {name}
            </h2>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-8 max-w-2xl font-normal">
              {description}
            </p>
            <div>
              <SlantedButton variant="gold" size="md" onClick={onCtaClick}>
                {ctaText}
              </SlantedButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
