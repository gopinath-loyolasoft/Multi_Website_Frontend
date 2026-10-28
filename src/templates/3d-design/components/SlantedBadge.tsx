import React from 'react';

export interface SlantedBadgeProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  variant?: 'gold' | 'blue' | 'sky' | 'amber';
  className?: string;
}

export const SlantedBadge: React.FC<SlantedBadgeProps> = ({
  children,
  icon,
  variant = 'sky',
  className = '',
}) => {
  const variantStyles = {
    sky: 'bg-sky-50 text-[#134975] border-sky-200',
    gold: 'bg-[#e5a912] text-slate-950 border-amber-400',
    blue: 'bg-[#134975] text-amber-300 border-amber-400/40',
    amber: 'bg-amber-100 text-amber-950 border-amber-300',
  };

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold uppercase tracking-wider -skew-x-12 border shadow-xs ${variantStyles[variant]} ${className}`}
    >
      {icon && <span className="skew-x-12">{icon}</span>}
      <span className="skew-x-12 font-mono">{children}</span>
    </div>
  );
};
