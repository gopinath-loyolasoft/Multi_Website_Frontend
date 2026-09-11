import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqProps {
  content: {
    title?: string;
    subtitle?: string;
    faqs?: FaqItem[];
  };
}

export const FaqSection: React.FC<FaqProps> = ({ content }) => {
  const rawFaqs = content.faqs && content.faqs.length > 0 ? content.faqs : (content as any).items;
  const faqs: FaqItem[] = Array.isArray(rawFaqs) ? rawFaqs : [];
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  if (faqs.length === 0) return null;

  const toggle = (idx: number) => setOpenIdx(openIdx === idx ? null : idx);

  return (
    <section className="py-16 bg-white dark:bg-slate-900 transition-colors">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {content.title || 'Frequently Asked Questions'}
          </h2>
          {content.subtitle && (
            <p className="text-sm text-slate-600 dark:text-slate-400">
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
                className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/60 overflow-hidden transition"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-slate-900 dark:text-white hover:text-primary transition"
                >
                  <span>{faq.question}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-primary' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 animate-in fade-in">
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
