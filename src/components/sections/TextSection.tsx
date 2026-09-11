import React from 'react';
import DOMPurify from 'dompurify';
import { Quote } from 'lucide-react';

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
    <section className="py-16 bg-white border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
        {content.title && (
          <div className="text-center space-y-2 mb-10">
            <h2 className="text-3xl font-bold text-slate-900">{content.title}</h2>
            <div className="w-16 h-1 bg-primary mx-auto rounded-full" />
          </div>
        )}

        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-8 sm:p-10 relative">
          <Quote className="w-12 h-12 text-primary/15 absolute top-6 right-6" />

          {content.leadText && (
            <p className="text-xl font-medium text-slate-800 leading-relaxed mb-6 italic">
              "{content.leadText}"
            </p>
          )}

          <div
            className="prose prose-slate max-w-none text-slate-600 leading-relaxed space-y-4"
            dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
          />

          {(content.authorName || content.authorRole) && (
            <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-900">{content.authorName}</h4>
                <p className="text-sm text-slate-500">{content.authorRole}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
