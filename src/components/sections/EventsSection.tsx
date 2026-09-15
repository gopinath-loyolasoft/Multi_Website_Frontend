import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, MapPin, ArrowRight } from 'lucide-react';
import { EventItem } from '../../types';
import { apiClient } from '../../services/apiClient';
import { SectionError } from './SectionError';
import { useTheme } from '../../themes/ThemeContext';

interface EventsSectionProps {
  content: {
    heading?: string;
    subheading?: string;
    title?: string;
    subtitle?: string;
    limit?: number;
  };
}

export const EventsSection: React.FC<EventsSectionProps> = ({ content }) => {
  const { isArtsAndScience, isMedical, isUniversity, isEngineering } = useTheme();
  const isCenterAligned = isArtsAndScience || isUniversity;

  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const title = content.title || content.heading || 'Upcoming Campus Events';
  const subtitle = content.subtitle || content.subheading || 'Key academic conferences, symposiums, and student activities';

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await apiClient.get('/site/events', {
          params: { limit: content.limit || 3 },
        });
        if (res.data.success && Array.isArray(res.data.data)) {
          setEvents(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load events', err);
        setError('Unable to load events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [content.limit]);

  if (error && !loading) {
    return <SectionError message={error} className="bg-slate-50 border-b border-slate-100" />;
  }

  if (!loading && events.length === 0) return null;

  const headingFont = isArtsAndScience 
    ? 'font-serif font-bold text-emerald-950 dark:text-emerald-50 text-3xl sm:text-4xl' 
    : isUniversity 
    ? 'font-serif font-bold text-rose-950 dark:text-amber-50 text-3xl sm:text-4xl' 
    : isMedical 
    ? 'font-sans font-extrabold text-slate-900 dark:text-white text-3xl sm:text-4xl' 
    : 'font-sans font-black text-slate-900 dark:text-white text-3xl sm:text-4xl';

  const linkColor = isArtsAndScience 
    ? 'text-emerald-700 hover:text-emerald-900 font-serif' 
    : isUniversity 
    ? 'text-rose-900 hover:text-amber-700 font-serif' 
    : isMedical 
    ? 'text-cyan-700 hover:text-cyan-900' 
    : 'text-primary hover:underline';

  const sectionBg = isEngineering
    ? 'py-16 bg-slate-950 text-white border-y border-slate-900'
    : isArtsAndScience
    ? 'py-16 bg-[#fbf9f4] text-slate-900 border-y border-emerald-900/10'
    : isMedical
    ? 'py-16 bg-white text-slate-900 border-y border-cyan-100'
    : 'py-16 bg-[#fcfaf7] text-slate-900 border-y border-stone-200';

  const cardBg = isEngineering
    ? 'bg-slate-900 text-white rounded-2xl border border-slate-800 hover:border-amber-400/60 p-6 shadow-xl hover:shadow-2xl transition-all flex flex-col justify-between'
    : isArtsAndScience
    ? 'bg-white text-slate-900 rounded-2xl border-2 border-emerald-800/15 hover:border-emerald-600 p-6 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between'
    : isMedical
    ? 'bg-slate-50 text-slate-900 rounded-2xl border border-cyan-200 hover:border-cyan-500 p-6 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between'
    : 'bg-white text-slate-900 rounded-2xl border-t-4 border-t-rose-900 border-x border-b border-stone-200 hover:border-rose-700 p-6 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between';

  const dateBadgeBg = isEngineering
    ? 'bg-amber-400/10 border border-amber-400/30 text-amber-300'
    : isArtsAndScience
    ? 'bg-emerald-100 border border-emerald-300 text-emerald-800'
    : isMedical
    ? 'bg-cyan-100 border border-cyan-200 text-cyan-800'
    : 'bg-rose-100 border border-rose-200 text-rose-900';

  return (
    <section className={sectionBg}>
      <div className="max-w-6xl mx-auto px-6">
        {isCenterAligned ? (
          <div className="text-center max-w-3xl mx-auto mb-10 space-y-2 flex flex-col items-center">
            <h2 className={headingFont}>{title}</h2>
            <p className="opacity-80 text-sm max-w-2xl mx-auto">{subtitle}</p>
            <Link
              to="/events"
              className={`inline-flex items-center gap-1.5 font-semibold text-sm pt-1 ${linkColor}`}
            >
              <span>View Full Calendar</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className={headingFont}>{title}</h2>
              <p className="opacity-80 text-sm mt-1">{subtitle}</p>
            </div>
            <Link
              to="/events"
              className={`inline-flex items-center gap-1.5 font-semibold text-sm ${linkColor} self-start sm:self-auto`}
            >
              <span>View Full Calendar</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-64 bg-slate-800/20 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {events.map((evt) => {
              const d = new Date(evt.eventDate);
              const month = d.toLocaleString('default', { month: 'short' });
              const day = d.getDate();

              return (
                <div
                  key={evt.id}
                  className={cardBg}
                >
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      {/* Date Badge */}
                      <div className={`rounded-xl px-3.5 py-2 text-center shrink-0 ${dateBadgeBg}`}>
                        <span className="block text-xs font-bold uppercase tracking-wider">{month}</span>
                        <span className="block text-2xl font-black">{day}</span>
                      </div>

                      <div>
                        <h3 className={`font-bold line-clamp-2 leading-snug ${isArtsAndScience || isUniversity ? 'font-serif' : 'font-sans'}`}>
                          {evt.title}
                        </h3>
                        <div className="flex items-center gap-1.5 text-xs opacity-70 mt-1.5">
                          <MapPin className="w-3.5 h-3.5 text-current" />
                          <span className="line-clamp-1">{evt.location}</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-slate-600 text-sm line-clamp-3 leading-relaxed">
                      {evt.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <CalendarDays className="w-3.5 h-3.5" />
                      {d.toLocaleDateString()}
                    </span>
                    <Link
                      to={`/events/${evt.id}`}
                      className="text-xs font-bold text-primary hover:underline"
                    >
                      Details & Registration →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
