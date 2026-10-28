import React from 'react';

export interface IsometricStatBlockProps {
  icon?: React.ReactNode;
  value: string | number;
  suffix?: string;
  label: string;
  tag?: string;
  accentColor?: 'amber' | 'blue' | 'emerald' | 'rose';
}

export const IsometricStatBlock: React.FC<IsometricStatBlockProps> = ({
  icon,
  value,
  suffix,
  label,
  tag,
  accentColor = 'amber',
}) => {
  const iconColors = {
    amber: 'bg-amber-400 text-slate-950',
    blue: 'bg-blue-600 text-white',
    emerald: 'bg-emerald-500 text-white',
    rose: 'bg-rose-500 text-white',
  };

  return (
    <div className="group relative bg-white border-3 border-slate-900 rounded-2xl p-6 transition-all duration-200 hover:-translate-y-2 shadow-[6px_6px_0px_0px_#0f172a] hover:shadow-[10px_10px_0px_0px_#0f172a] flex flex-col items-center text-center">
      {/* Top Strip */}
      <div className="h-2 bg-amber-400 rounded-t-xl border-b-2 border-slate-900 absolute top-0 inset-x-0 w-full" />

      {/* 3D Icon Box */}
      <div
        className={`w-14 h-14 rounded-2xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] flex items-center justify-center mb-3 mt-1 transition-transform duration-200 group-hover:scale-105 ${iconColors[accentColor]}`}
      >
        {icon}
      </div>

      {/* Value Counter */}
      <div className="flex items-baseline justify-center gap-1">
        <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {value}
        </span>
        {suffix && (
          <span className="text-xl font-black text-amber-600">
            {suffix}
          </span>
        )}
      </div>

      {/* Label */}
      <span className="text-xs font-black text-slate-700 uppercase tracking-wider mt-1.5">
        {label}
      </span>

      {/* Tag */}
      {tag && (
        <span className="mt-3 inline-block px-2.5 py-0.5 rounded text-[10px] font-mono font-black uppercase bg-slate-100 text-slate-900 border-2 border-slate-900 shadow-[1px_1px_0px_0px_#0f172a]">
          {tag}
        </span>
      )}
    </div>
  );
};
