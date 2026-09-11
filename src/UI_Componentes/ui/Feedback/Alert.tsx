import React from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

export interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

const variantStyles = {
  info: {
    container: 'bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-950/50 dark:border-blue-800 dark:text-blue-200',
    icon: <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />,
  },
  success: {
    container: 'bg-emerald-50 border-emerald-200 text-emerald-900 dark:bg-emerald-950/50 dark:border-emerald-800 dark:text-emerald-200',
    icon: <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />,
  },
  warning: {
    container: 'bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-950/50 dark:border-amber-800 dark:text-amber-200',
    icon: <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />,
  },
  error: {
    container: 'bg-red-50 border-red-200 text-red-900 dark:bg-red-950/50 dark:border-red-800 dark:text-red-200',
    icon: <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />,
  },
};

export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  children,
  onClose,
  className = '',
}) => {
  const style = variantStyles[variant];

  return (
    <div className={`p-3.5 rounded-xl border text-xs flex items-start gap-3 relative ${style.container} ${className}`}>
      <div className="mt-0.5">{style.icon}</div>
      <div className="flex-1 space-y-0.5 pr-2">
        {title && <h5 className="font-bold text-xs">{title}</h5>}
        <div className="opacity-90 leading-relaxed">{children}</div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/10 opacity-70 hover:opacity-100 transition cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
