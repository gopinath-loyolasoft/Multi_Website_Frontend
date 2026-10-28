import React, { useEffect, useState } from 'react';
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

const toastStyles: Record<
  ToastType,
  {
    border: string;
    icon: React.ReactNode;
    bg: string;
    titleColor: string;
    messageColor: string;
    accentBar: string;
  }
> = {
  success: {
    border: 'border-emerald-200 dark:border-emerald-800/80 shadow-emerald-500/10',
    bg: 'bg-white dark:bg-slate-900',
    icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />,
    titleColor: 'text-emerald-950 dark:text-emerald-200',
    messageColor: 'text-slate-700 dark:text-slate-300',
    accentBar: 'bg-emerald-500',
  },
  error: {
    border: 'border-rose-200 dark:border-rose-800/80 shadow-rose-500/10',
    bg: 'bg-white dark:bg-slate-900',
    icon: <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />,
    titleColor: 'text-rose-950 dark:text-rose-200',
    messageColor: 'text-slate-700 dark:text-slate-300',
    accentBar: 'bg-rose-500',
  },
  warning: {
    border: 'border-amber-200 dark:border-amber-800/80 shadow-amber-500/10',
    bg: 'bg-white dark:bg-slate-900',
    icon: <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />,
    titleColor: 'text-amber-950 dark:text-amber-200',
    messageColor: 'text-slate-700 dark:text-slate-300',
    accentBar: 'bg-amber-500',
  },
  info: {
    border: 'border-blue-200 dark:border-blue-800/80 shadow-blue-500/10',
    bg: 'bg-white dark:bg-slate-900',
    icon: <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />,
    titleColor: 'text-blue-950 dark:text-blue-200',
    messageColor: 'text-slate-700 dark:text-slate-300',
    accentBar: 'bg-blue-500',
  },
};

export const ToastCard: React.FC<ToastCardProps> = ({ toast, onDismiss }) => {
  const style = toastStyles[toast.type];
  const duration = toast.duration ?? 1500;
  const [isExiting, setIsExiting] = useState(false);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => {
      onDismiss(toast.id);
    }, 150);
  };

  return (
    <div
      role="alert"
      className={`relative max-w-sm w-full p-3.5 pr-8 rounded-2xl border shadow-xl backdrop-blur-xl flex items-start gap-3 transition-all duration-200 overflow-hidden ${
        isExiting
          ? 'opacity-0 translate-x-12 scale-95'
          : 'animate-in slide-in-from-right-8 fade-in duration-200'
      } ${style.bg} ${style.border}`}
    >
      {/* Left Accent Bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${style.accentBar}`} />

      {/* Type Icon */}
      <div className="mt-0.5 pl-1">{style.icon}</div>

      {/* Toast Content */}
      <div className="flex-1 space-y-0.5 text-left min-w-0">
        {toast.title && (
          <h4 className={`text-xs font-bold leading-snug truncate ${style.titleColor}`}>
            {toast.title}
          </h4>
        )}
        <p className={`text-xs font-medium leading-relaxed ${style.messageColor}`}>
          {toast.message}
        </p>
      </div>

      {/* Top-Right 'X' Cancel Icon Button */}
      <button
        type="button"
        onClick={handleDismiss}
        className="absolute top-2.5 right-2.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 p-1 rounded-lg transition-colors cursor-pointer"
        aria-label="Dismiss notification"
        title="Dismiss"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      {/* Subtle Auto-Dismiss Progress Bar */}
      {duration > 0 && (
        <div
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-200/50 dark:bg-slate-700/50 overflow-hidden"
        >
          <div
            className={`h-full ${style.accentBar} transition-all ease-linear`}
            style={{
              animation: `toast-progress ${duration}ms linear forwards`,
            }}
          />
        </div>
      )}
    </div>
  );
};
