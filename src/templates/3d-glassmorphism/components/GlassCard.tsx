import React from 'react';

export interface GlassCardProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  badge?: string;
  linkText?: string;
  linkUrl?: string;
  glowColor?: 'cyan' | 'violet' | 'emerald' | 'amber';
  className?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  icon,
  title,
  description,
  badge,
  linkText,
  linkUrl,
  glowColor = 'cyan',
  className = '',
}) => {
  const glowBorderClasses = {
    cyan: 'hover:border-cyan-400/60 hover:shadow-[0_0_35px_rgba(6,182,212,0.3)]',
    violet: 'hover:border-violet-400/60 hover:shadow-[0_0_35px_rgba(139,92,246,0.3)]',
    emerald: 'hover:border-emerald-400/60 hover:shadow-[0_0_35px_rgba(16,185,129,0.3)]',
    amber: 'hover:border-amber-400/60 hover:shadow-[0_0_35px_rgba(245,158,11,0.3)]',
  };

  const iconBgClasses = {
    cyan: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40 shadow-[0_0_15px_rgba(6,182,212,0.3)]',
    violet: 'bg-violet-500/20 text-violet-300 border-violet-400/40 shadow-[0_0_15px_rgba(139,92,246,0.3)]',
    emerald: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40 shadow-[0_0_15px_rgba(16,185,129,0.3)]',
    amber: 'bg-amber-500/20 text-amber-300 border-amber-400/40 shadow-[0_0_15px_rgba(245,158,11,0.3)]',
  };

  return (
    <div
      className={`group relative bg-white/5 hover:bg-white/10 backdrop-blur-2xl border border-white/15 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-2 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] ${glowBorderClasses[glowColor]} ${className}`}
    >
      {/* Top chromatic color bar */}
      <div className="absolute top-0 inset-x-6 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50 group-hover:opacity-100 transition duration-500" />

      {/* Floating Badge */}
      {badge && (
        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-white/10 text-cyan-300 border border-cyan-400/30 mb-3">
          {badge}
        </span>
      )}

      {/* 3D Icon container */}
      {icon && (
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 border transition-transform duration-300 group-hover:scale-110 ${iconBgClasses[glowColor]}`}
        >
          {icon}
        </div>
      )}

      {/* Title */}
      <h3 className="text-lg font-black text-white tracking-tight mb-2 group-hover:text-cyan-300 transition-colors">
        {title}
      </h3>

      {/* Description */}
      <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
        {description}
      </p>

      {/* Action link */}
      {linkText && linkUrl && (
        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
          <a
            href={linkUrl}
            className="text-xs font-extrabold text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1 group-hover:underline"
          >
            <span>{linkText}</span>
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </a>
        </div>
      )}
    </div>
  );
};
