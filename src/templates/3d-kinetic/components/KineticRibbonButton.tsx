import React from 'react';
import { ArrowRight, Zap } from 'lucide-react';

export interface KineticRibbonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'rose' | 'indigo' | 'dark' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  icon?: React.ReactNode;
  showArrow?: boolean;
}

export const KineticRibbonButton: React.FC<KineticRibbonButtonProps> = ({
  variant = 'rose',
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
    rose: 'bg-gradient-to-r from-rose-500 via-pink-600 to-indigo-600 hover:from-rose-400 hover:to-indigo-500 text-white shadow-[0_0_25px_rgba(244,63,94,0.4)] hover:shadow-[0_0_35px_rgba(244,63,94,0.6)] border border-rose-300/30',
    indigo: 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-[0_0_25px_rgba(99,102,241,0.4)] border border-indigo-300/30',
    dark: 'bg-slate-800 hover:bg-slate-700 text-white border border-rose-500/40 shadow-lg',
    outline: 'bg-transparent hover:bg-rose-500/10 text-rose-400 hover:text-white border-2 border-rose-500/50 hover:border-rose-400',
  };

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-black uppercase tracking-wider transition-all duration-300 cursor-pointer active:scale-95 group relative overflow-hidden ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {/* Dynamic kinetic neon sweep */}
      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out pointer-events-none" />

      {icon && <span className="shrink-0">{icon}</span>}
      <span className="relative z-10">{children}</span>
      {showArrow && (
        <ArrowRight className="w-4 h-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1.5 relative z-10" />
      )}
    </button>
  );
};
