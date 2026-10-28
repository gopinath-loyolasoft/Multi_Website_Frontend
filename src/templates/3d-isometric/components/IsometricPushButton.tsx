import React from 'react';
import { ArrowRight } from 'lucide-react';

export interface IsometricPushButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'amber' | 'blue' | 'white' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  icon?: React.ReactNode;
  showArrow?: boolean;
}

export const IsometricPushButton: React.FC<IsometricPushButtonProps> = ({
  variant = 'amber',
  size = 'md',
  children,
  icon,
  showArrow = false,
  className = '',
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-3.5 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base',
  };

  const variantClasses = {
    amber: 'bg-amber-400 hover:bg-amber-300 text-slate-950 border-2 border-slate-900 shadow-[0_5px_0_0_#0f172a] active:translate-y-1 active:shadow-[0_1px_0_0_#0f172a]',
    blue: 'bg-blue-600 hover:bg-blue-500 text-white border-2 border-slate-900 shadow-[0_5px_0_0_#0f172a] active:translate-y-1 active:shadow-[0_1px_0_0_#0f172a]',
    white: 'bg-white hover:bg-slate-100 text-slate-900 border-2 border-slate-900 shadow-[0_5px_0_0_#0f172a] active:translate-y-1 active:shadow-[0_1px_0_0_#0f172a]',
    dark: 'bg-slate-900 hover:bg-slate-800 text-white border-2 border-amber-400 shadow-[0_5px_0_0_#f59e0b] active:translate-y-1 active:shadow-[0_1px_0_0_#f59e0b]',
  };

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-black uppercase tracking-wide transition-all duration-150 cursor-pointer ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
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
