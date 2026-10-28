import React from 'react';
import { Quote, Star, Sparkles, GraduationCap, Building2 } from 'lucide-react';
import { TestimonialItem } from '../../types';

interface TestimonialsSectionProps {
  content: {
    badge?: string;
    title?: string;
    subtitle?: string;
    testimonials?: TestimonialItem[];
  };
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ content }) => {
  const testimonials = Array.isArray(content.testimonials) ? content.testimonials : [];
  if (testimonials.length === 0) return null;

  const sectionBadge = content.badge || 'Student & Alumni Stories';
  const sectionTitle = content.title || 'Voices of Our Achievers';
  const sectionSubtitle = content.subtitle || 'Read authentic reflections from graduates and students shaping global industries';

  return (
    <section className="py-14 sm:py-20 bg-slate-50/80 dark:bg-slate-950 transition-colors border-y border-slate-200/80 dark:border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2.5">
          {sectionBadge && (
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{sectionBadge}</span>
            </div>
          )}
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            {sectionTitle}
          </h2>
          {sectionSubtitle && (
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">
              {sectionSubtitle}
            </p>
          )}
        </div>

        {/* Testimonials Grid */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 ${testimonials.length >= 3 ? 'lg:grid-cols-3' : 'max-w-3xl mx-auto'} gap-6`}>
          {testimonials.map((t, idx) => (
            <div
              key={t.id || idx}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between space-y-5 group relative"
            >
              <Quote className="w-8 h-8 text-primary/20 absolute top-6 right-6" />

              <div className="space-y-3">
                {/* Rating Stars */}
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: t.rating || 5 }).map((_, rIdx) => (
                    <Star key={rIdx} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>

                <p className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm italic leading-relaxed">
                  "{t.quote}"
                </p>
              </div>

              {/* Student/Alumni Author Cameo */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                  {t.avatarUrl ? (
                    <img src={t.avatarUrl} alt={t.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-primary/10 text-primary font-bold text-base flex items-center justify-center">
                      {t.name ? t.name.charAt(0).toUpperCase() : 'A'}
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm leading-snug truncate">
                    {t.name}
                  </h4>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-0.5">
                    {t.degree && (
                      <p className="flex items-center gap-1 truncate">
                        <GraduationCap className="w-3 h-3 text-primary shrink-0" />
                        <span className="truncate">{t.degree} {t.batch ? `(${t.batch})` : ''}</span>
                      </p>
                    )}
                    {(t.role || t.company) && (
                      <p className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300 truncate">
                        <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{t.role}{t.company ? ` • ${t.company}` : ''}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
