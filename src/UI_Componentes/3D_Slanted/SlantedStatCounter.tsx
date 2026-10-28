import React from 'react';

export interface SlantedStatCounterProps {
  value: string;
  label: string;
  sublabel?: string;
  className?: string;
}

export const SlantedStatCounter: React.FC<SlantedStatCounterProps> = ({
  value,
  label,
  sublabel,
  className = '',
}) => {
  return (
    <div
      className={`relative group bg-white border border-slate-200 p-7 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 ${className}`}
    >
      {/* Floating 3D Gold Accent Ribbon on Right */}
      <div className="absolute -right-3 -bottom-3 w-10 h-14 bg-[#e5a912] -skew-x-12 transform shadow-md transition-all duration-300 group-hover:scale-110 group-hover:bg-[#f5b820]" />

      <div className="relative z-10 flex flex-col items-start">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-4xl font-extrabold text-slate-900 font-mono tracking-tight group-hover:text-[#1b4b72] transition-colors">
            {value}
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-[#1b4b72] bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
            {label}
          </span>
        </div>
        {sublabel && (
          <p className="text-xs text-slate-500 font-medium mt-2">
            {sublabel}
          </p>
        )}
      </div>
    </div>
  );
};
