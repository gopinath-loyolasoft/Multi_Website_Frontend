import React from 'react';
import { Star, MessageSquare } from 'lucide-react';

import { apiClient } from '../../services/apiClient';
import { SectionError } from './SectionError';
import { useTheme } from '../../themes/ThemeContext';

interface TestimonialItem {
  name: string;
  role?: string;
  company?: string;
  quote: string;
  avatarUrl?: string;
  rating?: number;
}

interface TestimonialsProps {
  content: {
    title?: string;
    subtitle?: string;
    testimonials?: TestimonialItem[];
  };
}

export const TestimonialsSection: React.FC<TestimonialsProps> = ({ content }) => {
  const { isArtsAndScience, isMedical, isUniversity, isEngineering } = useTheme();
  const isCenterAligned = isArtsAndScience || isUniversity;

  const [fetchedList, setFetchedList] = React.useState<TestimonialItem[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!content.testimonials || content.testimonials.length === 0) {
      setLoading(true);
      apiClient.get('/site/testimonials')
        .then((res) => {
          if (res.data.success && Array.isArray(res.data.data)) {
            setFetchedList(res.data.data.map((item: any) => ({
              name: item.authorName || item.name,
              role: item.authorRole || item.role,
              company: item.authorCompany || item.company,
              quote: item.content || item.quote,
              avatarUrl: item.avatarUrl,
              rating: item.rating || 5,
            })));
          }
        })
        .catch(() => setError('Unable to load testimonials. Please try again later.'))
        .finally(() => setLoading(false));
    }
  }, [content.testimonials]);

  const list = (content.testimonials && content.testimonials.length > 0) ? content.testimonials : fetchedList;
  if (error && !loading) {
    return <SectionError message={error} className="bg-white dark:bg-slate-900" />;
  }
  if (!loading && list.length === 0) return null;

  const badgeClass = isArtsAndScience 
    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 font-serif' 
    : isUniversity 
    ? 'bg-rose-100 text-rose-900 border border-rose-200 font-serif' 
    : isMedical 
    ? 'bg-teal-100 text-teal-800 border border-teal-200 font-sans' 
    : 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 font-sans';

  const headingFont = isArtsAndScience 
    ? 'font-serif font-bold text-emerald-950 dark:text-emerald-50 text-3xl sm:text-4xl' 
    : isUniversity 
    ? 'font-serif font-bold text-rose-950 dark:text-amber-50 text-3xl sm:text-4xl' 
    : isMedical 
    ? 'font-sans font-extrabold text-slate-900 dark:text-white text-3xl sm:text-4xl' 
    : 'font-sans font-black text-slate-900 dark:text-white text-3xl sm:text-4xl';

  const sectionBg = isEngineering
    ? 'py-16 bg-slate-900 text-white border-y border-slate-800'
    : isArtsAndScience
    ? 'py-16 bg-[#f5f2eb] text-slate-900 border-y border-emerald-900/10'
    : isMedical
    ? 'py-16 bg-slate-50 text-slate-900 border-y border-cyan-100'
    : 'py-16 bg-[#f7f4ee] text-slate-900 border-y border-stone-200';

  const cardBg = isEngineering
    ? 'p-8 rounded-2xl bg-slate-950 text-white border border-slate-800 hover:border-amber-400/60 shadow-xl flex flex-col justify-between space-y-4'
    : isArtsAndScience
    ? 'p-8 rounded-2xl bg-white text-slate-900 border-2 border-emerald-800/15 hover:border-emerald-600 shadow-sm flex flex-col justify-between space-y-4'
    : isMedical
    ? 'p-8 rounded-2xl bg-white text-slate-900 border border-cyan-200 hover:border-cyan-500 shadow-sm flex flex-col justify-between space-y-4'
    : 'p-8 rounded-2xl bg-white text-slate-900 border-t-4 border-t-rose-900 border-x border-b border-stone-200 hover:border-rose-700 shadow-sm flex flex-col justify-between space-y-4';

  return (
    <section className={sectionBg}>
      <div className="max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-16">
        {(content.title || content.subtitle) && (
          <div className={`${isCenterAligned ? 'text-center max-w-2xl mx-auto' : 'text-left max-w-2xl'} mb-12 space-y-2`}>
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${badgeClass}`}>
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Voices of Success</span>
            </div>
            <h2 className={headingFont}>
              {content.title || 'What Our Alumni Say'}
            </h2>
            {content.subtitle && (
              <p className="opacity-80 text-sm">
                {content.subtitle}
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {list.map((t, idx) => (
            <div
              key={idx}
              className={cardBg}
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(t.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className={`text-xs sm:text-sm leading-relaxed italic opacity-90 ${isArtsAndScience || isUniversity ? 'font-serif' : 'font-sans'}`}>
                  "{t.quote}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-current/10">
                {t.avatarUrl ? (
                  <img
                    src={t.avatarUrl}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center">
                    {t.name ? t.name.charAt(0).toUpperCase() : 'A'}
                  </div>
                )}
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {t.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    {t.role || t.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
