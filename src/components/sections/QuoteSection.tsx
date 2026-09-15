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
  const authorName = content?.authorName || quote?.authorName || 'Leadership Directorate';
  const authorTitle = content?.designation || content?.authorTitle || quote?.designation || quote?.authorTitle || 'Dean & Institutional Leadership';
  const authorImage = content?.authorImageUrl || content?.authorImage || quote?.authorImageUrl || quote?.authorImage || '/assets/templates/common/leader_portrait.svg';
  const subText = content?.subText || quote?.subText;
  const isActive = quote?.isActive !== false;

  if (!isActive || !quoteText) {
    return null;
  }

  // Centered Plaque Layout (Arts & Science, University)
  if (q.isCentered) {
    return (
      <section className={`py-16 sm:py-20 relative overflow-hidden ${q.sectionBg}`}>
        <div className={`${q.layoutContainer} px-6 sm:px-10 relative z-10 animate-in fade-in duration-700`}>
          
          {/* Crest Badge */}
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs ${q.badgeClass}`}>
            <Sparkles className="w-3.5 h-3.5" />
            <span>{content?.title || "Leadership Vision & Academic Charter"}</span>
            <Sparkles className="w-3.5 h-3.5" />
          </div>

          {/* Grand Centered Quote */}
          <div className="relative pt-3">
            <Quote className={`w-10 h-10 mx-auto mb-4 ${q.iconColor}`} />
            <blockquote className={q.quoteTextFont}>
              "{quoteText}"
            </blockquote>
          </div>

          {/* Cameo / Author Card */}
          <div className={q.photoContainer}>
            <div className={q.photoFrame}>
              <img
                src={authorImage}
                alt={authorName}
                className="w-full h-full object-cover rounded-full"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/templates/common/leader_portrait.svg';
                }}
              />
            </div>
            <div className="text-center">
              <div className={q.authorNameFont}>{authorName}</div>
              <div className={q.authorTitleFont}>{authorTitle}</div>
              {subText && <div className={q.subTextFont}>{subText}</div>}
            </div>
          </div>

        </div>
      </section>
    );
  }

  // Split Screen Industrial / Clinical Layout (Engineering, Medical)
  return (
    <section className={`py-14 sm:py-18 relative overflow-hidden ${q.sectionBg}`}>
      <div className="max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
        <div className={q.layoutContainer}>
          
          {/* Photo & Author Card */}
          <div className={q.photoContainer}>
            <div className={q.photoFrame}>
              <img
                src={authorImage}
                alt={authorName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/templates/common/leader_portrait.svg';
                }}
              />
            </div>

            <div>
              <h3 className={q.authorNameFont}>{authorName}</h3>
              <p className={q.authorTitleFont}>{authorTitle}</p>
              {subText && <p className={q.subTextFont}>{subText}</p>}
            </div>
          </div>

          {/* Quote Container */}
          <div className={q.quoteBox}>
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className={`inline-flex items-center gap-2 ${q.badgeClass}`}>
                <Sparkles className="w-4 h-4" />
                <span>{content?.title || "Leadership Vision & Academic Charter"}</span>
              </div>
              <Quote className={`w-6 h-6 ${q.iconColor}`} />
            </div>

            <blockquote className={q.quoteTextFont}>
              "{quoteText}"
            </blockquote>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs opacity-75">
              <span>INSTITUTIONAL DIRECTIVE</span>
              <span className="font-bold">VERIFIED</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
