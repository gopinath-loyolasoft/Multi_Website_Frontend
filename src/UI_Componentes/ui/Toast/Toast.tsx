import React from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
  title?: string;
  duration?: number;
}

interface ToastCardProps {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}

const toastStyles: Record<ToastType, { border: string; icon: React.ReactNode; bg: string }> = {
  success: {
    border: 'border-emerald-200 dark:border-emerald-800',
    bg: 'bg-emerald-50/90 dark:bg-emerald-950/90',
    icon: <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />,
  },
  error: {
    border: 'border-red-200 dark:border-red-800',
    bg: 'bg-red-50/90 dark:bg-red-950/90',
    icon: <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />,
  },
  warning: {
    border: 'border-amber-200 dark:border-amber-800',
    bg: 'bg-amber-50/90 dark:bg-amber-950/90',
    icon: <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />,
  },
  info: {
    border: 'border-blue-200 dark:border-blue-800',
    bg: 'bg-blue-50/90 dark:bg-blue-950/90',
    icon: <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />,
  },
};

export const ToastCard: React.FC<ToastCardProps> = ({ toast, onDismiss }) => {
  const style = toastStyles[toast.type];

  return (
    <div
      role="alert"
      className={`max-w-sm w-full p-4 rounded-xl border shadow-lg backdrop-blur-md flex items-start gap-3 transition-all duration-300 animate-in slide-in-from-top-4 ${style.bg} ${style.border}`}
    >
      <div className="mt-0.5">{style.icon}</div>
      <div className="flex-1 space-y-0.5 text-left">
        {toast.title && (
          <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
            {toast.title}
          </h4>
        )}
        <p className="text-xs text-slate-700 dark:text-slate-300 leading-snug">
          {toast.message}
        </p>
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition p-0.5 cursor-pointer"
        aria-label="Dismiss"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
