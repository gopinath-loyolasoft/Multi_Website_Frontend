import React from 'react';
import { AlertCircle } from 'lucide-react';

interface SectionErrorProps {
  message: string;
  className?: string;
}

export const SectionError: React.FC<SectionErrorProps> = ({ message, className = '' }) => (
  <section className={`${className} transition-colors`}>
    <div className="max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-16 py-8">
      <div className="flex items-center justify-center gap-2.5 p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs font-semibold text-center">
        <AlertCircle className="w-4 h-4 shrink-0" />
        <span>{message}</span>
      </div>
    </div>
  </section>
);