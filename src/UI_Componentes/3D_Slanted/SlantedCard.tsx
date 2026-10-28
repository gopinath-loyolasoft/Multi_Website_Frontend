import React from 'react';
import { useTilt3D } from '../../hooks/useTilt3D';

export interface SlantedCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  badgeBg?: string;
  cardBg?: string;
  onClick?: () => void;
  className?: string;
}

export const SlantedCard: React.FC<SlantedCardProps> = ({
  icon,
  title,
  description,
  badgeBg = 'bg-[#1b4b72]',
  cardBg = 'bg-[#f4f4f4]',
  onClick,
  className = '',
}) => {
  const { ref, style, handleMouseMove, handleMouseLeave } = useTilt3D(8);

  return (
    <div
      ref={ref}
      style={style}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`relative flex flex-col items-center group cursor-pointer pt-14 pb-8 px-6 transition-all duration-300 ${className}`}
    >
      {/* 3D Slanted Background Plate (Parallelogram) */}
      <div
        className={`absolute inset-0 -skew-x-12 transform ${cardBg} rounded-sm shadow-md transition-all duration-300 group-hover:shadow-2xl group-hover:bg-white group-hover:-translate-y-2 border border-slate-200/80 group-hover:border-amber-400/60`}
      />

      {/* Floating 3D Angled Top Icon Badge */}
      <div
        className={`relative -mt-20 mb-6 -skew-x-12 transform ${badgeBg} text-white px-8 py-5 shadow-lg transition-transform duration-300 group-hover:-translate-y-3 group-hover:shadow-sky-950/40`}
      >
        <div className="skew-x-12 transform text-amber-300 flex items-center justify-center">
          {icon}
        </div>
      </div>

      {/* Card Content - Counter-skewed for readability */}
      <div className="relative z-10 text-center px-2">
        <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-[#1b4b72] transition-colors">
          {title}
        </h3>
        <p className="text-sm leading-relaxed text-slate-600 font-normal">
          {description}
        </p>
      </div>

      {/* Bottom Accent Indicator */}
      <div className="relative z-10 mt-6 w-10 h-1 bg-amber-400/60 group-hover:w-20 group-hover:bg-amber-500 transition-all duration-300 -skew-x-12" />
    </div>
  );
};
