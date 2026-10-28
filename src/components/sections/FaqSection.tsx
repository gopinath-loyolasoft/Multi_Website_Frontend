import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { useTemplateTheme } from '../../themes/ThemeContext';

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqProps {
  content: {
    title?: string;
    subtitle?: string;
    badge?: string;
    faqs?: FaqItem[];
  };
}

export const FaqSection: React.FC<FaqProps> = ({ content }) => {
  const { styles } = useTemplateTheme();
  const faqStyles = styles.faq;

  const rawFaqs = content.faqs && content.faqs.length > 0 ? content.faqs : (content as any).items;
  const faqs: FaqItem[] = Array.isArray(rawFaqs) ? rawFaqs : [];
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  if (faqs.length === 0) return null;

  const toggle = (idx: number) => setOpenIdx(openIdx === idx ? null : idx);
  const isCentered = faqStyles.isCentered ?? true;
  const badgeText = content.badge || faqStyles.defaultBadgeText || 'Got Questions?';
  const titleText = content.title || faqStyles.defaultTitle || 'Frequently Asked Questions';

  return (
    <section className={faqStyles.sectionBg || "py-16 bg-white dark:bg-slate-900 transition-colors"}>
      <div className="max-w-4xl mx-auto px-6">
        <div className={`${isCentered ? 'text-center' : 'text-left'} mb-12 space-y-2`}>
          {badgeText && (
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${faqStyles.sectionHeaderBadge || 'bg-primary/10 text-primary'}`}>
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{badgeText}</span>
            </div>
          )}
          <h2 className={faqStyles.headingFont || "text-3xl font-black text-slate-900 dark:text-white tracking-tight"}>
            {titleText}
          </h2>
          {content.subtitle && (
            <p className={faqStyles.subtitleFont || "text-sm text-slate-600 dark:text-slate-400"}>
              {content.subtitle}
            </p>
          )}
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className={`${faqStyles.itemBg || 'bg-slate-50/50 dark:bg-slate-950/60 rounded-2xl border border-slate-200/80 dark:border-slate-800'} ${faqStyles.itemBorder || ''} ${faqStyles.itemHover || ''} overflow-hidden transition`}
              >
                <button
                  onClick={() => toggle(idx)}
                  className={`w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm ${faqStyles.questionFont || 'text-slate-900 dark:text-white'} hover:text-primary transition`}
                >
                  <span>{faq.question}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? `rotate-180 ${faqStyles.accentColor || 'text-primary'}` : ''}`} />
                </button>
                {isOpen && (
                  <div className={`px-5 pb-5 pt-1 text-xs ${faqStyles.answerFont || 'text-slate-600 dark:text-slate-400'} leading-relaxed border-t border-slate-100 dark:border-slate-800/80 animate-in fade-in`}>
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
