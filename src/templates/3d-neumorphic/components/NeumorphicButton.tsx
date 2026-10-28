import React from 'react';
import { ArrowRight } from 'lucide-react';

export interface NeumorphicButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'teal' | 'soft' | 'concave' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  icon?: React.ReactNode;
  showArrow?: boolean;
}

export const NeumorphicButton: React.FC<NeumorphicButtonProps> = ({
  variant = 'teal',
  size = 'md',
  children,
  icon,
  showArrow = false,
  className = '',
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-4 py-1.5 text-xs',
    md: 'px-6 py-2.5 text-sm',
    lg: 'px-8 py-3.5 text-base',
  };

  const variantClasses = {
    teal: 'bg-teal-600 hover:bg-teal-500 text-white shadow-[6px_6px_14px_rgba(13,148,136,0.35),-4px_-4px_10px_#ffffff] active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.3)]',
    soft: 'bg-[#eef2f6] hover:bg-[#e4ebf3] text-slate-800 shadow-[6px_6px_12px_#d1d9e6,-6px_-6px_12px_#ffffff] active:shadow-[inset_4px_4px_8px_#d1d9e6,inset_-4px_-4px_8px_#ffffff]',
    concave: 'bg-[#eef2f6] text-teal-700 shadow-[inset_4px_4px_8px_#d1d9e6,inset_-4px_-4px_8px_#ffffff] hover:shadow-[6px_6px_12px_#d1d9e6,-6px_-6px_12px_#ffffff]',
    dark: 'bg-slate-800 hover:bg-slate-700 text-white shadow-[6px_6px_14px_rgba(0,0,0,0.4)] active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.6)]',
  };

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-2xl font-black tracking-wide transition-all duration-200 cursor-pointer active:scale-98 ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
      {showArrow && (
        <ArrowRight className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-1" />
      )}
    </button>
  );
};
