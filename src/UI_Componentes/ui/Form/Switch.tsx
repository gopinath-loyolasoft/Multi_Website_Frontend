import React from 'react';

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  size?: 'sm' | 'md';
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  size = 'md',
}) => {
  const isSm = size === 'sm';

  return (
    <label className={`flex items-start gap-3 select-none ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`relative inline-flex shrink-0 transition-colors duration-200 ease-in-out rounded-full border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${
          isSm ? 'h-5 w-9' : 'h-6 w-11'
        } ${checked ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'}`}
      >
        <span
          className={`pointer-events-none inline-block rounded-full bg-white shadow-xs transform ring-0 transition duration-200 ease-in-out ${
            isSm ? 'h-4 w-4' : 'h-5 w-5'
          } ${checked ? (isSm ? 'translate-x-4' : 'translate-x-5') : 'translate-x-0'}`}
        />
      </button>

      {(label || description) && (
        <div className="text-left space-y-0.5">
          {label && <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">{label}</div>}
          {description && <div className="text-[11px] text-slate-500 dark:text-slate-400">{description}</div>}
        </div>
      )}
    </label>
  );
};
