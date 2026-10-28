import React from 'react';

export interface NeumorphicStatSphereProps {
  icon?: React.ReactNode;
  value: string | number;
  suffix?: string;
  label: string;
  tag?: string;
}

export const NeumorphicStatSphere: React.FC<NeumorphicStatSphereProps> = ({
  icon,
  value,
  suffix,
  label,
  tag,
}) => {
  return (
    <div className="group relative bg-[#eef2f6] rounded-3xl p-6 transition-all duration-300 hover:-translate-y-2 shadow-[8px_8px_16px_#d1d9e6,-8px_-8px_16px_#ffffff] hover:shadow-[12px_12px_24px_#d1d9e6,-12px_-12px_24px_#ffffff] flex flex-col items-center text-center">
      {/* 3D Embossed Soft Sphere */}
      <div className="w-16 h-16 rounded-2xl bg-[#eef2f6] text-teal-600 shadow-[6px_6px_12px_#d1d9e6,-6px_-6px_12px_#ffffff] flex items-center justify-center mb-3 mt-1 transition-transform duration-300 group-hover:scale-105">
        {icon}
      </div>

      {/* Value Counter */}
      <div className="flex items-baseline justify-center gap-1">
        <span className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight">
          {value}
        </span>
        {suffix && (
          <span className="text-xl font-black text-teal-600">
            {suffix}
          </span>
        )}
      </div>

      {/* Label */}
      <span className="text-xs font-black text-slate-600 uppercase tracking-wider mt-1.5">
        {label}
      </span>

      {/* Tag */}
      {tag && (
        <span className="mt-3 inline-block px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-[#eef2f6] text-teal-700 shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#ffffff]">
          {tag}
        </span>
      )}
    </div>
  );
};
