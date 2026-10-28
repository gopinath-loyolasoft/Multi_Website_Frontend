import React from 'react';
import DOMPurify from 'dompurify';

interface TextSectionProps {
  content: {
    title?: string;
    leadText?: string;
    bodyHtml?: string;
    authorName?: string;
    authorRole?: string;
  };
}

export const TextSection: React.FC<TextSectionProps> = ({ content }) => {
  const sanitizedHtml = DOMPurify.sanitize(content.bodyHtml || '');

  return (
    <section className="py-16 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 transition-colors">
      <div className="max-w-4xl mx-auto px-6 sm:px-10">
        {content.title && (
          <div className="text-center space-y-3 mb-10">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              {content.title}
            </h2>
            <div className="w-16 h-1 bg-primary mx-auto rounded-full" />
          </div>
        )}

        <div className="space-y-6">
          {content.leadText && (
            <p className="text-lg sm:text-xl font-medium text-slate-800 dark:text-slate-200 leading-relaxed border-l-4 border-primary pl-4 py-1">
              {content.leadText}
            </p>
          )}

          {sanitizedHtml && (
            <div
              className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-relaxed space-y-4"
              dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
            />
          )}

          {(content.authorName || content.authorRole) && (
            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">{content.authorName}</h4>
                {content.authorRole && (
                  <p className="text-xs text-slate-500 dark:text-slate-400">{content.authorRole}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
