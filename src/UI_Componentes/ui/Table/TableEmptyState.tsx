import React from 'react';
import { Inbox } from 'lucide-react';

export interface TableEmptyStateProps {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export const TableEmptyState: React.FC<TableEmptyStateProps> = ({
  icon = <Inbox className="w-10 h-10 text-slate-300 dark:text-slate-600" />,
  title = 'No records found',
  description = 'Try adjusting your search filters or add a new record.',
  action,
}) => {
  return (
    <div className="py-16 px-4 flex flex-col items-center justify-center text-center space-y-3">
      <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800">
        {icon}
      </div>
      <div className="space-y-1 max-w-sm">
        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{title}</h4>
        {description && (
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {action && <div className="pt-2">{action}</div>}
    </div>
  );
};
