import React from 'react';

export interface IsometricCardProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  badge?: string;
  linkText?: string;
  linkUrl?: string;
  accentColor?: 'amber' | 'blue' | 'emerald' | 'rose';
  className?: string;
}

export const IsometricCard: React.FC<IsometricCardProps> = ({
  icon,
  title,
  description,
  badge,
  linkText,
  linkUrl,
  accentColor = 'amber',
  className = '',
}) => {
  const accentClasses = {
    amber: 'border-t-4 border-amber-500 hover:border-amber-600',
    blue: 'border-t-4 border-blue-600 hover:border-blue-700',
    emerald: 'border-t-4 border-emerald-500 hover:border-emerald-600',
    rose: 'border-t-4 border-rose-500 hover:border-rose-600',
  };

  const iconBgClasses = {
    amber: 'bg-amber-400 border-2 border-slate-900 text-slate-950 shadow-[3px_3px_0px_0px_#0f172a]',
    blue: 'bg-blue-600 border-2 border-slate-900 text-white shadow-[3px_3px_0px_0px_#0f172a]',
    emerald: 'bg-emerald-500 border-2 border-slate-900 text-white shadow-[3px_3px_0px_0px_#0f172a]',
    rose: 'bg-rose-500 border-2 border-slate-900 text-white shadow-[3px_3px_0px_0px_#0f172a]',
  };

  return (
    <div
      className={`group relative bg-white border-3 border-slate-900 rounded-2xl p-6 transition-all duration-200 hover:-translate-y-2 shadow-[6px_6px_0px_0px_#0f172a] hover:shadow-[10px_10px_0px_0px_#0f172a] ${accentClasses[accentColor]} ${className}`}
    >
      {/* Floating Badge */}
      {badge && (
        <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-mono font-black uppercase tracking-wider bg-slate-100 text-slate-900 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] mb-3">
          {badge}
        </span>
      )}

      {/* 3D Icon container */}
      {icon && (
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-200 group-hover:scale-105 ${iconBgClasses[accentColor]}`}
        >
          {icon}
        </div>
      )}

      {/* Title */}
      <h3 className="text-lg font-black text-slate-900 tracking-tight mb-2 group-hover:text-amber-600 transition-colors">
        {title}
      </h3>

      {/* Description */}
      <p className="text-xs text-slate-600 font-medium leading-relaxed line-clamp-3">
        {description}
      </p>

      {/* Action link */}
      {linkText && linkUrl && (
        <div className="mt-4 pt-3 border-t-2 border-slate-200 flex items-center justify-between">
          <a
            href={linkUrl}
            className="text-xs font-black text-slate-900 hover:text-amber-600 inline-flex items-center gap-1 group-hover:underline"
          >
            <span>{linkText}</span>
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </a>
        </div>
      )}
    </div>
  );
};
