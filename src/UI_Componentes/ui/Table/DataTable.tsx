import React from 'react';
import { Spinner } from '../Feedback/Spinner';
import { TableEmptyState } from './TableEmptyState';
import { TablePagination, TablePaginationProps } from './TablePagination';

export interface ColumnDef<T> {
  header: string | React.ReactNode;
  accessor?: keyof T;
  render?: (value: any, row: T, index: number) => React.ReactNode;
  className?: string;
  headerClassName?: string;
  align?: 'left' | 'center' | 'right';
  width?: string;
}

export interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  loading?: boolean;
  emptyTitle?: string;
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
  emptyAction?: React.ReactNode;
  keyExtractor?: (item: T, index: number) => string | number;
  onRowClick?: (row: T) => void;
  pagination?: TablePaginationProps;
  className?: string;
}

export function DataTable<T>({
  columns,
  data,
  loading = false,
  emptyTitle = 'No records found',
  emptyMessage = 'There is no data to display right now.',
  emptyIcon,
  emptyAction,
  keyExtractor,
  onRowClick,
  pagination,
  className = '',
}: DataTableProps<T>) {
  const getAlignClass = (align?: 'left' | 'center' | 'right') => {
    if (align === 'center') return 'text-center';
    if (align === 'right') return 'text-right';
    return 'text-left';
  };

  return (
    <div
      className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs font-sans ${className}`}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          {/* Table Header */}
          <thead className="bg-slate-50 dark:bg-slate-950/60 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider font-semibold text-[11px] select-none">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  style={col.width ? { width: col.width } : undefined}
                  className={`py-3 px-5 ${getAlignClass(col.align)} ${col.headerClassName || ''}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="py-20 text-center">
                  <div className="flex flex-col items-center justify-center gap-2.5">
                    <Spinner size="lg" color="primary" />
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      Loading data...
                    </span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length}>
                  <TableEmptyState
                    icon={emptyIcon}
                    title={emptyTitle}
                    description={emptyMessage}
                    action={emptyAction}
                  />
                </td>
              </tr>
            ) : (
              data.map((row, rowIdx) => {
                const rowKey = keyExtractor
                  ? keyExtractor(row, rowIdx)
                  : (row as any)?.id || (row as any)?._id || rowIdx;

                return (
                  <tr
                    key={rowKey}
                    onClick={() => onRowClick && onRowClick(row)}
                    className={`transition ${
                      onRowClick ? 'cursor-pointer hover:bg-blue-50/50 dark:hover:bg-blue-950/20' : 'hover:bg-slate-50/70 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    {columns.map((col, colIdx) => {
                      const rawValue = col.accessor ? (row as any)[col.accessor] : undefined;
                      const cellContent = col.render
                        ? col.render(rawValue, row, rowIdx)
                        : rawValue !== undefined && rawValue !== null
                        ? String(rawValue)
                        : '—';

                      return (
                        <td
                          key={colIdx}
                          className={`py-3.5 px-5 ${getAlignClass(col.align)} ${col.className || ''}`}
                        >
                          {cellContent}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Optional Table Pagination */}
      {!loading && data.length > 0 && pagination && <TablePagination {...pagination} />}
    </div>
  );
}
