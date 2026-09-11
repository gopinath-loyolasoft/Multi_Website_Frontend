import React from 'react';
import { Quote } from 'lucide-react';
import { useTenant } from '../../tenant/TenantContext';

interface QuoteSectionProps {
  content?: {
    title?: string;
    quoteText?: string;
    authorName?: string;
    designation?: string;
    authorTitle?: string;
    authorImage?: string;
    authorImageUrl?: string;
    subText?: string;
  };
}

export const QuoteSection: React.FC<QuoteSectionProps> = ({ content }) => {
  const { siteConfig } = useTenant();

  const quote = siteConfig?.quote;
  const quoteText = content?.quoteText || quote?.quoteText;
  const authorName = content?.authorName || quote?.authorName;
  const authorTitle = content?.designation || content?.authorTitle || quote?.designation || quote?.authorTitle || 'Dean & Institutional Leadership';
  const authorImage = content?.authorImageUrl || content?.authorImage || quote?.authorImageUrl || quote?.authorImage || '/assets/templates/common/leader_portrait.svg';
  const subText = content?.subText || quote?.subText;
  const isActive = quote?.isActive !== false;

  if (!isActive || !quoteText) {
    return null;
  }

  return (
    <section className="py-12 sm:py-16 relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50/70 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border-y border-slate-200/70 dark:border-slate-800/70">
      {/* Dynamic Template Ambient Radial Wash */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-30 dark:opacity-15"
        style={{
          background: 'radial-gradient(circle at 50% 30%, var(--primary-color, #1e40af) 0%, transparent 65%)',
          filter: 'blur(80px)',
        }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header if title is present */}
        {content?.title && (
          <div className="text-center max-w-2xl mx-auto mb-8 space-y-1.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-widest bg-primary/10 text-primary border border-primary/20">
              Institutional Leadership
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              {content.title}
            </h2>
          </div>
        )}

        {/* Elevated Universal Card Container */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-slate-950/60 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-10 flex flex-col md:flex-row items-center gap-6 sm:gap-10 relative overflow-hidden">
          
          {/* Top highlight line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-primary" />

          {/* Author Portrait Photo */}
          <div className="shrink-0 relative">
            <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-primary/25 shadow-xl bg-slate-100 dark:bg-slate-800">
              <img
                key={authorImage}
                src={authorImage}
                alt={authorName || 'Leadership'}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    '/assets/templates/common/leader_portrait.svg';
                }}
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center shadow-md">
              <Quote className="w-4 h-4" />
            </div>
          </div>

          {/* Quote & Author Info */}
          <div className="flex-1 text-center md:text-left space-y-4">
            <blockquote className="text-base sm:text-lg lg:text-xl font-serif italic text-slate-800 dark:text-slate-100 leading-relaxed">
              "{quoteText}"
            </blockquote>
            
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
                {authorName}
              </div>
              <div className="text-xs sm:text-sm font-bold text-primary mt-0.5">
                {authorTitle}
              </div>
              {subText && (
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {subText}
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
