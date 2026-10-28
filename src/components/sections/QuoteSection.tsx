import React from 'react';
import { Quote, Sparkles } from 'lucide-react';
import { useTenant } from '../../tenant/TenantContext';
import { useTemplateTheme } from '../../themes/ThemeContext';

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
  const { styles } = useTemplateTheme();
  const q = styles.quote;

  const quote = siteConfig?.quote;
  const quoteText = content?.quoteText || quote?.quoteText;
  const authorName = content?.authorName ?? quote?.authorName ?? '';
  const authorTitle = content?.designation || content?.authorTitle || quote?.designation || quote?.authorTitle || '';
  const authorImage = content?.authorImageUrl || content?.authorImage || quote?.authorImageUrl || quote?.authorImage || '';
  const subText = content?.subText || quote?.subText;
  const isActive = quote?.isActive !== false;

  if (!isActive || !quoteText) {
    return null;
  }

  const hasAuthorInfo = Boolean(authorName || authorTitle || subText);
  const hasAuthorImage = Boolean(authorImage);
  const sectionTitle = content?.title || "Leadership & Academic Vision";
  const officeLabel = q.footerLabel || "Office of the Dean";

  // Centered Plaque Layout (for templates with centered flag)
  if (q.isCentered) {
    return (
      <section className={`py-8 sm:py-10 relative overflow-hidden ${q.sectionBg}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 animate-in fade-in duration-700">
          <div className={`relative rounded-2xl ${q.cardBg || 'bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shadow-[0_8px_24px_rgba(15,23,42,0.06)]'} p-6 sm:p-8 text-center overflow-hidden`}>
            {/* Top Accent Bar */}
            {q.cardTopAccent && (
              <div className={`absolute top-0 left-0 right-0 h-[3px] ${q.cardTopAccent}`} />
            )}

            {/* Watermark Quote Icon */}
            <Quote className="w-28 h-28 absolute -top-4 -right-4 text-black/[0.03] dark:text-white/[0.03] pointer-events-none stroke-[1]" />

            {/* Crest Badge */}
            <div className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-4 ${q.badgeClass}`}>
              <Sparkles className="w-3.5 h-3.5" />
              <span>{sectionTitle}</span>
              <Sparkles className="w-3.5 h-3.5" />
            </div>

            {/* Grand Centered Quote */}
            <div className="relative pt-1 max-w-2xl mx-auto">
              <Quote className={`w-6 h-6 mx-auto mb-2.5 opacity-50 ${q.iconColor}`} />
              <blockquote className={`${q.quoteTextFont || 'font-serif text-[18px] sm:text-[19px] italic leading-[1.6] text-slate-900 dark:text-slate-100'}`}>
                "{quoteText}"
              </blockquote>
            </div>

            {/* Cameo / Author Card */}
            {(hasAuthorImage || hasAuthorInfo) && (
              <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 flex flex-col items-center gap-2.5">
                {hasAuthorImage ? (
                  <div className={`w-[86px] h-[86px] rounded-full overflow-hidden border-[3px] border-white dark:border-slate-800 shadow-md ring-2 ${q.avatarRing || 'ring-primary/20'} bg-stone-100 dark:bg-stone-800 shrink-0`}>
                    <img
                      src={authorImage}
                      alt={authorName || 'Author'}
                      className="w-full h-full object-cover object-top"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-[86px] h-[86px] rounded-full bg-primary/10 text-primary font-black text-2xl flex items-center justify-center border-[3px] border-white dark:border-slate-800 shadow-md">
                    {authorName ? authorName.charAt(0).toUpperCase() : 'L'}
                  </div>
                )}
                {hasAuthorInfo && (
                  <div className="text-center space-y-0.5">
                    {authorName && <h4 className={`text-[15px] sm:text-[16px] font-bold tracking-tight text-slate-900 dark:text-slate-100 ${q.authorNameFont}`}>{authorName}</h4>}
                    {authorTitle && <p className={`text-xs font-semibold ${q.authorTitleFont}`}>{authorTitle}</p>}
                    {subText && <p className={`text-[11px] opacity-75 ${q.subTextFont}`}>{subText}</p>}
                  </div>
                )}
              </div>
            )}

            {/* Footer Metadata */}
            <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
              <span>Leadership Charter</span>
              <span className="text-primary font-bold">{officeLabel}</span>
            </div>

          </div>
        </div>
      </section>
    );
  }

  // Unified Executive Card Layout (Template 3 / Medical, Template 1 / Engineering, etc.)
  return (
    <section className={`py-8 sm:py-10 relative overflow-hidden ${q.sectionBg}`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 animate-in fade-in duration-700">
        <div className={`relative rounded-2xl ${q.cardBg || 'bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-[0_8px_24px_rgba(15,23,42,0.06)]'} overflow-hidden`}>
          
          {/* Top Accent Gradient Bar */}
          {q.cardTopAccent && (
            <div className={`absolute top-0 left-0 right-0 h-[3px] ${q.cardTopAccent}`} />
          )}

          {/* Decorative Background Quote Icon Watermark */}
          <Quote className="w-40 h-40 absolute -bottom-8 -right-8 text-black/[0.03] dark:text-white/[0.03] pointer-events-none stroke-[1]" />

          <div className="p-6 sm:p-7 md:p-8 flex flex-col md:flex-row items-center md:items-stretch gap-6 sm:gap-7 relative z-10">
            
            {/* Left Column: Author Cameo Box (approx 255px) */}
            {(hasAuthorImage || hasAuthorInfo) && (
              <div className={`w-full md:w-[255px] shrink-0 rounded-xl p-5 flex flex-col items-center text-center justify-center ${q.profileBg || 'bg-slate-50/80 dark:bg-slate-800/70 border border-slate-200/90 dark:border-slate-700/80'}`}>
                {hasAuthorImage ? (
                  <div className={`w-[86px] h-[86px] rounded-full overflow-hidden mb-3.5 border-[3px] border-white dark:border-slate-800 shadow-md ring-2 ${q.avatarRing || 'ring-primary/20'} bg-white dark:bg-slate-800 shrink-0`}>
                    <img
                      src={authorImage}
                      alt={authorName || 'Leader'}
                      className="w-full h-full object-cover object-top"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-[86px] h-[86px] rounded-full bg-primary/10 text-primary font-black text-2xl flex items-center justify-center mb-3.5 border-[3px] border-white dark:border-slate-800 shadow-md shrink-0">
                    {authorName ? authorName.charAt(0).toUpperCase() : 'L'}
                  </div>
                )}

                {authorName && (
                  <h4 className={`text-[15px] sm:text-[16px] font-bold tracking-tight text-slate-900 dark:text-slate-100 leading-snug ${q.authorNameFont}`}>
                    {authorName}
                  </h4>
                )}
                {authorTitle && (
                  <p className={`text-xs font-semibold mt-1 leading-snug ${q.authorTitleFont}`}>
                    {authorTitle}
                  </p>
                )}
                {subText && (
                  <p className={`text-[11px] opacity-75 mt-1.5 leading-tight line-clamp-2 ${q.subTextFont}`}>
                    {subText}
                  </p>
                )}
              </div>
            )}

            {/* Right Column: Quote Body */}
            <div className="flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-3.5">
                <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className={`inline-flex items-center gap-1.5 ${q.badgeClass}`}>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{sectionTitle}</span>
                  </div>
                  <Quote className={`w-5 h-5 opacity-40 ${q.iconColor}`} />
                </div>

                <blockquote className={`${q.quoteTextFont || 'font-serif text-[18px] sm:text-[19px] font-normal sm:font-medium leading-[1.6] text-slate-900 dark:text-slate-100'} tracking-normal`}>
                  "{quoteText}"
                </blockquote>
              </div>

              {/* Bottom Charter Metadata Bar */}
              <div className="pt-3.5 mt-auto border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">
                <span>Leadership Charter</span>
                <span className="text-primary font-bold">{officeLabel}</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
