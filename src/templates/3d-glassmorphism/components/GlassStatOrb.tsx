import React from 'react';

export interface GlassStatOrbProps {
  icon?: React.ReactNode;
  value: string | number;
  suffix?: string;
  label: string;
  tag?: string;
  glowColor?: 'cyan' | 'violet' | 'emerald' | 'amber';
}

export const GlassStatOrb: React.FC<GlassStatOrbProps> = ({
  icon,
  value,
  suffix,
  label,
  tag,
  glowColor = 'cyan',
}) => {
  const glowColors = {
    cyan: 'from-cyan-500/20 via-blue-500/10 to-transparent border-cyan-400/40 text-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.25)]',
    violet: 'from-violet-500/20 via-purple-500/10 to-transparent border-violet-400/40 text-violet-400 shadow-[0_0_30px_rgba(139,92,246,0.25)]',
    emerald: 'from-emerald-500/20 via-teal-500/10 to-transparent border-emerald-400/40 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.25)]',
    amber: 'from-amber-500/20 via-yellow-500/10 to-transparent border-amber-400/40 text-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.25)]',
  };

  return (
    <div className="group relative bg-white/5 hover:bg-white/10 backdrop-blur-2xl border border-white/15 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-2 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] flex flex-col items-center text-center">
      {/* 3D Glass Spherical Orb */}
      <div
        className={`w-16 h-16 rounded-2xl bg-gradient-to-tr border flex items-center justify-center mb-4 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 ${glowColors[glowColor]}`}
      >
        {icon}
      </div>

      {/* Value Counter */}
      <div className="flex items-baseline justify-center gap-1">
        <span className="text-3xl sm:text-4xl font-black text-white tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
          {value}
        </span>
        {suffix && (
          <span className="text-xl font-black text-cyan-400">
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
        <span className="mt-3 inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-white/10 text-cyan-300 border border-cyan-400/30">
          {tag}
        </span>
      )}
    </div>
  );
};
