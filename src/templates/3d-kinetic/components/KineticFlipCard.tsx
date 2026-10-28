import React, { useState } from 'react';
import { RotateCw, ExternalLink } from 'lucide-react';

export interface KineticFlipCardProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  badge?: string;
  backTitle?: string;
  backHighlights?: string[];
  linkText?: string;
  linkUrl?: string;
  glowColor?: 'rose' | 'indigo' | 'purple' | 'amber';
  className?: string;
}

export const KineticFlipCard: React.FC<KineticFlipCardProps> = ({
  icon,
  title,
  description,
  badge,
  backTitle,
  backHighlights = [
    'Advanced practical curriculum',
    'Tier-1 industry mentorship',
    'Accredited certifications',
    'High campus placement rate'
  ],
  linkText = 'Explore Details',
  linkUrl = '/courses',
  glowColor = 'rose',
  className = '',
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const glowBorderClasses = {
    rose: 'border-rose-500/30 hover:border-rose-500/80 shadow-[0_0_25px_rgba(244,63,94,0.15)] hover:shadow-[0_0_35px_rgba(244,63,94,0.35)]',
    indigo: 'border-indigo-500/30 hover:border-indigo-500/80 shadow-[0_0_25px_rgba(99,102,241,0.15)] hover:shadow-[0_0_35px_rgba(99,102,241,0.35)]',
    purple: 'border-purple-500/30 hover:border-purple-500/80 shadow-[0_0_25px_rgba(168,85,247,0.15)] hover:shadow-[0_0_35px_rgba(168,85,247,0.35)]',
    amber: 'border-amber-500/30 hover:border-amber-500/80 shadow-[0_0_25px_rgba(245,158,11,0.15)] hover:shadow-[0_0_35px_rgba(245,158,11,0.35)]',
  };

  const iconBgClasses = {
    rose: 'bg-rose-500/20 text-rose-400 border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.3)]',
    indigo: 'bg-indigo-500/20 text-indigo-400 border-indigo-400/40 shadow-[0_0_15px_rgba(99,102,241,0.3)]',
    purple: 'bg-purple-500/20 text-purple-400 border-purple-400/40 shadow-[0_0_15px_rgba(168,85,247,0.3)]',
    amber: 'bg-amber-500/20 text-amber-400 border-amber-400/40 shadow-[0_0_15px_rgba(245,158,11,0.3)]',
  };

  return (
    <div
      className={`relative h-[280px] w-full [perspective:1000px] cursor-pointer group ${className}`}
      onClick={() => setIsFlipped(!isFlipped)}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      {/* 3D Flip Container */}
      <div
        className={`w-full h-full relative transition-transform duration-700 [transform-style:preserve-3d] ${
          isFlipped ? '[transform:rotateY(180deg)]' : ''
        }`}
      >
        {/* FRONT FACE */}
        <div
          className={`absolute inset-0 w-full h-full [backface-visibility:hidden] bg-slate-800/80 border rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 ${glowBorderClasses[glowColor]}`}
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between">
            {badge ? (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-rose-500/10 text-rose-300 border border-rose-500/30">
                {badge}
              </span>
            ) : <span />}
            <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1 opacity-75 group-hover:opacity-100">
              <RotateCw className="w-3 h-3 text-rose-400 animate-spin" style={{ animationDuration: '6s' }} />
              <span>Hover to Flip</span>
            </span>
          </div>

          {/* Body */}
          <div>
            {icon && (
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 border transition-transform duration-300 group-hover:scale-110 ${iconBgClasses[glowColor]}`}
              >
                {icon}
              </div>
            )}
            <h3 className="text-lg font-black text-white tracking-tight mb-2 group-hover:text-rose-400 transition-colors">
              {title}
            </h3>
            <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
              {description}
            </p>
          </div>

          <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px] font-bold text-rose-400">
            <span>Flip for Key Highlights</span>
            <span>⟳</span>
          </div>
        </div>

        {/* BACK FACE (Rotated 180deg) */}
        <div
          className={`absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-slate-900 border rounded-2xl p-6 flex flex-col justify-between ${glowBorderClasses[glowColor]}`}
        >
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
              <h4 className="text-sm font-black text-rose-400">
                {backTitle || title}
              </h4>
              <span className="text-[10px] font-mono text-slate-400">Highlights</span>
            </div>

            <ul className="space-y-2 text-xs text-slate-200">
              {backHighlights.map((hl, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold mt-0.5">✦</span>
                  <span className="leading-snug">{hl}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-3 border-t border-slate-800">
            <a
              href={linkUrl}
              className="w-full py-2 rounded-xl bg-gradient-to-r from-rose-500 to-indigo-600 hover:from-rose-400 hover:to-indigo-500 text-white text-xs font-black text-center inline-flex items-center justify-center gap-1.5 shadow-md"
            >
              <span>{linkText}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
