import React from 'react';
import { AlertTriangle, Info, CheckCircle2 } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from '../Button/Button';

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'primary' | 'success';
  loading?: boolean;
}

const variantStyles = {
  danger: {
    iconBg: 'bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-400 border-red-200 dark:border-red-900',
    icon: <AlertTriangle className="w-5 h-5" />,
    buttonVariant: 'danger' as const,
  },
  warning: {
    iconBg: 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 border-amber-200 dark:border-amber-900',
    icon: <AlertTriangle className="w-5 h-5" />,
    buttonVariant: 'primary' as const,
  },
  primary: {
    iconBg: 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 border-blue-200 dark:border-blue-900',
    icon: <Info className="w-5 h-5" />,
    buttonVariant: 'primary' as const,
  },
  success: {
    iconBg: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900',
    icon: <CheckCircle2 className="w-5 h-5" />,
    buttonVariant: 'success' as const,
  },
};

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  loading = false,
}) => {
  const currentVariant = variantStyles[variant];

  return (
    <Modal
      isOpen={isOpen}
      onClose={loading ? () => {} : onClose}
      maxWidth="md"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={loading}>
            {cancelText}
          </Button>
          <Button
            variant={currentVariant.buttonVariant}
            size="sm"
            loading={loading}
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
        </>
      }
    >
      <div className="flex items-start gap-4 py-2">
        <div
          className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${currentVariant.iconBg}`}
        >
          {currentVariant.icon}
        </div>
        <div className="space-y-1.5 text-left">
          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{title}</h4>
          <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            {message}
          </div>
        </div>
      </div>
    </Modal>
  );
};
