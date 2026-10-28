import React from 'react';
import { Sparkles, Globe } from 'lucide-react';
import { EmbedSectionContent } from '../../types';

interface EmbedSectionProps {
  content: EmbedSectionContent & {
    badge?: string;
  };
}

export const EmbedSection: React.FC<EmbedSectionProps> = ({ content }) => {
  if (!content.embedUrl) return null;

  const sectionBadge = content.badge || 'Interactive Tour & Portal';
  const sectionTitle = content.title;
  const sectionSubtitle = content.subtitle;

  const height = content.heightPx || 480;

  return (
    <section className="py-12 sm:py-16 bg-white dark:bg-slate-900 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header (optional) */}
        {(sectionTitle || sectionBadge) && (
          <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
            {sectionBadge && (
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{sectionBadge}</span>
              </div>
            )}
            {sectionTitle && (
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {sectionTitle}
              </h2>
            )}
            {sectionSubtitle && (
              <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">
                {sectionSubtitle}
              </p>
            )}
          </div>
        )}

        {/* Responsive Iframe Container */}
        <div className="bg-slate-100 dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-md">
          <iframe
            src={content.embedUrl}
            title={content.title || 'Interactive Portal'}
            style={{ width: '100%', height: `${height}px`, border: 'none' }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen={content.allowFullscreen !== false}
            loading="lazy"
            className="w-full"
          />
        </div>

        {content.caption && (
          <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-3 italic">
            {content.caption}
          </p>
        )}

      </div>
    </section>
  );
};
