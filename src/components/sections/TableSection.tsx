import React, { useState } from 'react';
import { Table, Search, Sparkles } from 'lucide-react';
import { TableSectionContent } from '../../types';

interface TableSectionProps {
  content: TableSectionContent & {
    badge?: string;
  };
}

export const TableSection: React.FC<TableSectionProps> = ({ content }) => {
  const [search, setSearch] = useState('');

  const columns = content.columns && content.columns.length > 0
    ? content.columns
    : [
        { key: 'col1', label: 'Program / Item', align: 'left' as const },
        { key: 'col2', label: 'Duration / Code', align: 'left' as const },
        { key: 'col3', label: 'Intake / Eligibility', align: 'center' as const },
        { key: 'col4', label: 'Annual Fee (INR)', align: 'right' as const },
      ];

  const rows = content.rows && content.rows.length > 0 ? content.rows : [];

  const filteredRows = rows.filter(row => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    return Object.values(row).some(val => 
      String(val).toLowerCase().includes(term)
    );
  });

  if (rows.length === 0 && (!content.title || !content.columns)) return null;

  return (
    <section className="py-12 sm:py-16 bg-white dark:bg-slate-900 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            {content.badge && (
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20 mb-2.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{content.badge}</span>
              </div>
            )}
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {content.title || 'Structured Fee & Intake Matrix'}
            </h2>
            {content.subtitle && (
              <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1.5 max-w-2xl">
                {content.subtitle}
              </p>
            )}
          </div>

          {content.searchable !== false && rows.length > 4 && (
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Filter table rows..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary shadow-xs"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          )}
        </div>

        {/* Responsive Table Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold uppercase tracking-wider text-[11px]">
                  {columns.map((col, idx) => (
                    <th 
                      key={col.key || idx} 
                      className={`py-4 px-5 sm:px-6 text-${col.align || 'left'}`}
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-700 dark:text-slate-300">
                {filteredRows.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className="py-10 text-center text-slate-400 text-xs">
                      No matching records found.
                    </td>
                  </tr>
                ) : (
                  filteredRows.map((row, rIdx) => (
                    <tr 
                      key={rIdx} 
                      className={`${
                        content.striped !== false && rIdx % 2 === 1 
                          ? 'bg-slate-50/50 dark:bg-slate-800/30' 
                          : 'bg-white dark:bg-slate-900'
                      } hover:bg-primary/5 transition-colors`}
                    >
                      {columns.map((col, cIdx) => (
                        <td 
                          key={col.key || cIdx} 
                          className={`py-4 px-5 sm:px-6 text-${col.align || 'left'} ${
                            cIdx === 0 ? 'font-bold text-slate-900 dark:text-white' : ''
                          }`}
                        >
                          {row[col.key] !== undefined ? String(row[col.key]) : '—'}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>
  );
};
