import React from 'react';
import { Calendar, Sparkles, Award } from 'lucide-react';
import { TimelineItem } from '../../types';

interface TimelineSectionProps {
  content: {
    badge?: string;
    title?: string;
    subtitle?: string;
    items?: TimelineItem[];
  };
}

export const TimelineSection: React.FC<TimelineSectionProps> = ({ content }) => {
  const items = Array.isArray(content.items) ? content.items : [];
  if (items.length === 0) return null;

  const sectionBadge = content.badge || 'Milestones & History';
  const sectionTitle = content.title || 'Our Journey of Excellence';
  const sectionSubtitle = content.subtitle || 'Tracing the foundation, growth, accreditations, and achievements across generations';

  return (
    <section className="py-14 sm:py-20 bg-slate-50 dark:bg-slate-950 transition-colors border-y border-slate-200/80 dark:border-slate-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2.5">
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

        {/* Timeline Stepper Container */}
        <div className="relative border-l-2 border-primary/30 dark:border-primary/20 ml-4 sm:ml-32 space-y-10">
          {items.map((item, idx) => (
            <div key={item.id || idx} className="relative pl-6 sm:pl-8 group">
              
              {/* Year Marker on Left (Desktop) */}
              <div className="hidden sm:block absolute -left-32 top-0 w-24 text-right">
                <span className="text-sm font-mono font-black text-primary px-2.5 py-1 bg-primary/10 rounded-lg">
                  {item.year}
                </span>
              </div>

              {/* Pulsing Bullet Node on Timeline Line */}
              <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-white dark:bg-slate-900 border-4 border-primary shadow-xs group-hover:scale-125 transition-transform" />

              {/* Milestone Card */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="sm:hidden text-xs font-mono font-black text-primary px-2 py-0.5 bg-primary/10 rounded">
                      {item.year}
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-tight">
                      {item.title}
                    </h3>
                  </div>
                  {item.badge && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      <Award className="w-3 h-3" />
                      {item.badge}
                    </span>
                  )}
                </div>

                {item.description && (
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {item.description}
                  </p>
                )}

                {item.imageUrl && (
                  <div className="pt-2">
                    <img 
                      src={item.imageUrl} 
                      alt={item.title} 
                      className="w-full max-h-60 object-cover rounded-xl border border-slate-100 dark:border-slate-800"
                    />
                  </div>
                )}
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
