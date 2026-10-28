import React from 'react';

export interface KineticStatCounterProps {
  icon?: React.ReactNode;
  value: string | number;
  suffix?: string;
  label: string;
  tag?: string;
  glowColor?: 'rose' | 'indigo' | 'purple' | 'amber';
}

export const KineticStatCounter: React.FC<KineticStatCounterProps> = ({
  icon,
  value,
  suffix,
  label,
  tag,
  glowColor = 'rose',
}) => {
  const glowColors = {
    rose: 'from-rose-500/20 via-purple-500/10 to-transparent border-rose-500/40 text-rose-400 shadow-[0_0_25px_rgba(244,63,94,0.3)]',
    indigo: 'from-indigo-500/20 via-blue-500/10 to-transparent border-indigo-500/40 text-indigo-400 shadow-[0_0_25px_rgba(99,102,241,0.3)]',
    purple: 'from-purple-500/20 via-pink-500/10 to-transparent border-purple-500/40 text-purple-400 shadow-[0_0_25px_rgba(168,85,247,0.3)]',
    amber: 'from-amber-500/20 via-yellow-500/10 to-transparent border-amber-500/40 text-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.3)]',
  };

  return (
    <div className="group relative bg-slate-800/60 hover:bg-slate-800/90 border border-slate-700/80 hover:border-rose-500/60 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-2 shadow-xl hover:shadow-[0_0_30px_rgba(244,63,94,0.3)] flex flex-col items-center text-center">
      {/* 3D Rolling Number Box */}
      <div
        className={`w-16 h-16 rounded-2xl bg-gradient-to-tr border flex items-center justify-center mb-4 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12 ${glowColors[glowColor]}`}
      >
        {icon}
      </div>

      {/* Value Counter */}
      <div className="flex items-baseline justify-center gap-1">
        <span className="text-3xl sm:text-4xl font-black text-white tracking-tight drop-shadow-md">
          {value}
        </span>
        {suffix && (
          <span className="text-xl font-black text-rose-400">
            {suffix}
          </span>
        )}
      </div>

      {/* Label */}
      <span className="text-xs font-bold text-slate-300 uppercase tracking-wider mt-1.5">
        {label}
      </span>

      {/* Tag */}
      {tag && (
        <span className="mt-3 inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-rose-500/10 text-rose-300 border border-rose-500/30">
          {tag}
        </span>
      )}
    </div>
  );
};
