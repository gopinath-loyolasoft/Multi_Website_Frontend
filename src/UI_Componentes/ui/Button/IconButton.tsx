import React from 'react';
import { Spinner } from '../Feedback/Spinner';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline' | 'success';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  loading?: boolean;
  tooltip?: string;
}

const variantClasses: Record<string, string> = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
  secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 focus:ring-slate-300',
  danger: 'bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 focus:ring-red-400',
  ghost: 'bg-transparent hover:bg-slate-100 text-slate-500 hover:text-slate-800 focus:ring-slate-200',
  outline: 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 focus:ring-slate-300',
  success: 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 focus:ring-emerald-400',
};

const sizeClasses: Record<string, string> = {
  xs: 'p-1 rounded text-xs',
  sm: 'p-1.5 rounded-lg text-xs',
  md: 'p-2 rounded-lg text-sm',
  lg: 'p-2.5 rounded-xl text-base',
};

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  variant = 'ghost',
  size = 'sm',
  loading = false,
  disabled = false,
  tooltip,
  className = '',
  ...props
}) => {
  const isDisabled = disabled || loading;

  return (
    <button
      title={tooltip}
      disabled={isDisabled}
      className={`inline-flex items-center justify-center transition select-none focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {loading ? <Spinner size="xs" color={variant === 'primary' ? 'white' : 'slate'} /> : icon}
    </button>
  );
};
