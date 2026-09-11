/**
 * ============================================================================
 * UNIVERSAL FORM DRAWER STANDARD (CollegeAdmin & SuperAdmin)
 * ============================================================================
 * MANDATE:
 * All Create, Edit, and View forms across ALL portals and any newly created
 * modules MUST use this right-side FormDrawer.
 *
 * Rules:
 * 1. Never use centered modals or full-page navigation for CRUD forms.
 * 2. Pass mode='create' | 'edit' | 'view'. The badge indicator and primary
 *    action button will adapt automatically.
 * 3. In 'view' mode, if onEditClick is provided, an "Edit Record" button will
 *    seamlessly toggle from view mode to edit mode.
 * ============================================================================
 */
import React from 'react';
import { Drawer } from './Drawer';
import { Plus, Edit2, Eye, Loader2, Check } from 'lucide-react';

export type DrawerMode = 'create' | 'edit' | 'view';

export interface FormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  mode: DrawerMode;
  children: React.ReactNode;
  onSubmit?: (e: React.FormEvent) => void | Promise<void>;
  onEditClick?: () => void;
  loading?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  submitText?: string;
  cancelText?: string;
  customFooter?: React.ReactNode;
  closeOnOutsideClick?: boolean;
}

export const FormDrawer: React.FC<FormDrawerProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  mode,
  children,
  onSubmit,
  onEditClick,
  loading = false,
  size = 'md',
  submitText,
  cancelText,
  customFooter,
  closeOnOutsideClick = true,
}) => {
  const getModeBadge = () => {
    switch (mode) {
      case 'create':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
            <Plus className="w-3 h-3" />
            Add New
          </span>
        );
      case 'edit':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
            <Edit2 className="w-3 h-3" />
            Edit Mode
          </span>
        );
      case 'view':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300">
            <Eye className="w-3 h-3" />
            View Mode
          </span>
        );
    }
  };

  const cleanTitle = title.replace(/^(Create|Edit|View)\s+/i, '');

  const resolvedSubmitText =
    submitText || (mode === 'create' ? `Create ${cleanTitle}` : `Save Changes`);

  const resolvedCancelText =
    cancelText || (mode === 'view' ? 'Close' : 'Cancel');

  const defaultFooter = (
    <div className="flex items-center justify-end gap-3 w-full">
      <button
        type="button"
        onClick={onClose}
        disabled={loading}
        className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer disabled:opacity-50"
      >
        {resolvedCancelText}
      </button>

      {mode === 'view' && onEditClick && (
        <button
          type="button"
          onClick={onEditClick}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-primary hover:opacity-90 transition cursor-pointer shadow-sm shadow-primary/20"
        >
          <Edit2 className="w-3.5 h-3.5" />
          Edit {cleanTitle}
        </button>
      )}

      {mode !== 'view' && (
        <button
          type={onSubmit ? 'submit' : 'button'}
          disabled={loading}
          form="drawer-active-form"
          className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-white bg-primary hover:opacity-90 transition cursor-pointer disabled:opacity-60 shadow-sm shadow-primary/20"
        >
          {loading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>{resolvedSubmitText}</span>
            </>
          )}
        </button>
      )}
    </div>
  );

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
      icon={
        icon || (
          mode === 'create' ? <Plus className="w-4 h-4" /> : mode === 'edit' ? <Edit2 className="w-4 h-4" /> : <Eye className="w-4 h-4" />
        )
      }
      size={size}
      closeOnOutsideClick={closeOnOutsideClick}
      footer={customFooter !== undefined ? customFooter : defaultFooter}
    >
      <div className="space-y-4">
        {/* Top Header Mode Indicator */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-2">
            {getModeBadge()}
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {mode === 'view' ? 'Read-only preview' : 'Fill in required fields'}
            </span>
          </div>
        </div>

        {/* Content Wrapper */}
        {mode !== 'view' && onSubmit ? (
          <form
            id="drawer-active-form"
            onSubmit={onSubmit}
            className="space-y-4"
          >
            {children}
          </form>
        ) : (
          <div className="space-y-4">{children}</div>
        )}
      </div>
    </Drawer>
  );
};
