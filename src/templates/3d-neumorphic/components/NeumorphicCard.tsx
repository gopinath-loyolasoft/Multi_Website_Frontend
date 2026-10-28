import React from 'react';

export interface NeumorphicCardProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  badge?: string;
  linkText?: string;
  linkUrl?: string;
  className?: string;
}

export const NeumorphicCard: React.FC<NeumorphicCardProps> = ({
  icon,
  title,
  description,
  badge,
  linkText,
  linkUrl,
  className = '',
}) => {
  return (
    <div
      className={`group relative bg-[#eef2f6] rounded-3xl p-6 transition-all duration-300 hover:-translate-y-2 shadow-[8px_8px_16px_#d1d9e6,-8px_-8px_16px_#ffffff] hover:shadow-[12px_12px_24px_#d1d9e6,-12px_-12px_24px_#ffffff] ${className}`}
    >
      {/* Top Accent Strip */}
      <div className="h-1.5 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-t-3xl absolute top-0 inset-x-0 w-full" />

      {/* Floating Pill Badge */}
      {badge && (
        <span className="inline-block px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-[#eef2f6] text-teal-700 shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#ffffff] mb-3">
          {badge}
        </span>
      )}

      {/* 3D Icon container */}
      {icon && (
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 bg-[#eef2f6] text-teal-600 shadow-[4px_4px_8px_#d1d9e6,-4px_-4px_8px_#ffffff] transition-transform duration-300 group-hover:scale-105">
          {icon}
        </div>
      )}

      {/* Title */}
      <h3 className="text-lg font-black text-slate-800 tracking-tight mb-2 group-hover:text-teal-600 transition-colors">
        {title}
      </h3>

      {/* Description */}
      <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 font-medium">
        {description}
      </p>

      {/* Action link */}
      {linkText && linkUrl && (
        <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
          <a
            href={linkUrl}
            className="text-xs font-black text-teal-600 hover:text-teal-700 inline-flex items-center gap-1 group-hover:underline"
          >
            <span>{linkText}</span>
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </a>
        </div>
      )}
    </div>
  );
};
