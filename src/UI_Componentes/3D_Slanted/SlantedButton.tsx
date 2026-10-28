import React from 'react';
import { ChevronRight, ChevronsRight } from 'lucide-react';

export interface SlantedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'gold' | 'blue' | 'dark' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  iconVariant?: 'single' | 'double' | 'none';
}

export const SlantedButton: React.FC<SlantedButtonProps> = ({
  children,
  variant = 'gold',
  size = 'md',
  iconVariant = 'double',
  className = '',
  ...props
}) => {
  const colorThemes = {
    gold: 'bg-[#e5a912] hover:bg-[#d49a0d] text-slate-950 font-bold',
    blue: 'bg-[#134975] hover:bg-[#0f3c61] text-white font-semibold',
    dark: 'bg-[#0f172a] hover:bg-[#1e293b] text-white font-semibold',
    outline: 'border-2 border-amber-500 bg-transparent text-amber-500 hover:bg-amber-500 hover:text-slate-950 font-bold',
  };

  const sizeStyles = {
    sm: 'py-1.5 pl-4 pr-1.5 text-xs',
    md: 'py-2.5 pl-6 pr-2.5 text-sm',
    lg: 'py-3 pl-8 pr-3 text-base',
  };

  return (
    <button
      {...props}
      className={`group relative inline-flex items-center justify-center -skew-x-12 transform cursor-pointer border-0 transition-all duration-300 hover:scale-105 active:scale-95 shadow-md hover:shadow-xl hover:shadow-amber-500/20 ${colorThemes[variant]} ${sizeStyles[size]} ${className}`}
    >
      {/* Counter-skew inner text to keep it upright and readable */}
      <span className="inline-block skew-x-12 tracking-wide font-sans">
        {children}
      </span>

      {/* Skewed right arrow badge */}
      {iconVariant !== 'none' && (
        <span className="ml-3 inline-flex items-center justify-center bg-black/85 text-[#e5a912] px-2 py-1 shadow-inner transition-transform duration-300 group-hover:translate-x-1">
          <span className="skew-x-12 inline-flex">
            {iconVariant === 'double' ? (
              <ChevronsRight className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </span>
        </span>
      )}
    </button>
  );
};
