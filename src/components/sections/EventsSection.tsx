import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, MapPin, ArrowRight } from 'lucide-react';
import { EventItem } from '../../types';
import { apiClient } from '../../services/apiClient';
import { SectionError } from './SectionError';

interface EventsSectionProps {
  content: {
    heading?: string;
    subheading?: string;
    limit?: number;
  };
}

export const EventsSection: React.FC<EventsSectionProps> = ({ content }) => {
const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <section className="py-16 bg-slate-50 border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900">{content.heading || 'Upcoming Events'}</h2>
            <p className="text-slate-500 mt-1">{content.subheading || 'Key academic & student activities'}</p>
          </div>
          <Link
            to="/events"
            className="inline-flex items-center gap-1.5 font-semibold text-primary hover:underline text-sm"
          >
            <span>View Full Calendar</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-64 bg-slate-200 rounded-2xl" />
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
                  className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      {/* Date Badge */}
                      <div className="bg-primary/10 border border-primary/20 rounded-xl px-3.5 py-2 text-center shrink-0">
                        <span className="block text-xs font-bold uppercase tracking-wider text-primary">{month}</span>
                        <span className="block text-2xl font-black text-slate-900">{day}</span>
                      </div>

                      <div>
                        <h3 className="font-bold text-slate-900 line-clamp-2 leading-snug">
                          {evt.title}
                        </h3>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1.5">
                          <MapPin className="w-3.5 h-3.5 text-primary" />
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
