import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  CalendarDays, 
  MapPin, 
  ArrowRight, 
  Sparkles, 
  ChevronRight, 
  Clock, 
  Calendar,
  Activity,
  CheckCircle2
} from 'lucide-react';
import { EventItem } from '../../types';
import { apiClient } from '../../services/apiClient';
import { SectionError } from './SectionError';
import { useTemplateTheme } from '../../themes/ThemeContext';

interface EventsSectionProps {
  content: {
    heading?: string;
    subheading?: string;
    title?: string;
    subtitle?: string;
    badge?: string;
    limit?: number;
  };
}

const formatEventDateParts = (dateStr?: string) => {
  if (!dateStr) return { day: '01', month: 'JAN', year: '2026' };
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return { day: '01', month: 'JAN', year: '2026' };
  return {
    day: String(d.getDate()).padStart(2, '0'),
    month: d.toLocaleString('en-US', { month: 'short' }).toUpperCase(),
    year: String(d.getFullYear()),
  };
};

export const EventsSection: React.FC<EventsSectionProps> = ({ content }) => {
  const { styles } = useTemplateTheme();
  const eventStyles = styles.events;
  const layoutVariant = eventStyles.layoutVariant || (eventStyles.isCentered ? 'timeline' : 'cards');

  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const title = content.title || content.heading || eventStyles.defaultTitle || 'Upcoming Events';
  const subtitle = content.subtitle || content.subheading || 'Key academic conferences, symposiums, and student activities';
  const badgeText = content.badge || eventStyles.defaultBadgeText || 'Campus Events';

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await apiClient.get('/site/events', {
          params: { limit: content.limit || (layoutVariant === 'timeline' ? 4 : 3) },
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
  }, [content.limit, layoutVariant]);

  if (error && !loading) {
    return <SectionError message={error} className="bg-slate-50 border-b border-slate-100" />;
  }

  if (!loading && events.length === 0) return null;

  // =========================================================================
  // 1. TEMPLATE 2 & TEMPLATE 5: 3D DESIGNED UPCOMING EVENTS
  // =========================================================================
  const { isArtsAndScience } = useTemplateTheme();
  if (isArtsAndScience || layoutVariant === 'slanted') {
    return (
      <section className="py-12 sm:py-16 bg-white relative overflow-hidden">
        {/* Subtle geometric pattern */}
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#134975_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 text-xs font-bold uppercase tracking-wider mb-2.5 -skew-x-12 bg-amber-100 text-amber-950 border border-amber-300">
                <CalendarDays className="w-3.5 h-3.5 text-[#134975] skew-x-12" />
                <span className="skew-x-12">{badgeText || 'Academic Calendar & Summits'}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
                {title}
              </h2>
              {subtitle && (
                <p className="text-sm sm:text-base text-slate-600 mt-1 max-w-2xl">
                  {subtitle}
                </p>
              )}
            </div>
            <Link
              to="/events"
              className="inline-flex items-center gap-2 px-5 py-2.5 -skew-x-12 bg-[#134975] hover:bg-[#0b3353] text-amber-300 font-black text-xs uppercase tracking-wider shadow-md hover:scale-105 transition shrink-0 self-start md:self-auto"
            >
              <span className="skew-x-12 flex items-center gap-1.5">
                <span>Full Calendar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </div>

          {/* 3D Slanted Events Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {events.map((evt) => {
              const { day, month, year } = formatEventDateParts(evt.eventDate);

              return (
                <Link
                  key={evt.id}
                  to={`/events/${evt.id}`}
                  className="group bg-white border border-slate-200/90 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden hover:-translate-y-2 hover:border-[#e5a912] relative"
                >
                  {/* Top Gold Stripe */}
                  <div className="h-1.5 w-full bg-[#e5a912] group-hover:bg-[#134975] transition-colors" />

                  <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
                    <div className="flex items-start gap-4">
                      {/* Slanted Date Box */}
                      <div className="w-16 h-18 -skew-x-12 bg-[#134975] text-amber-300 border border-amber-400/40 shadow-md flex flex-col items-center justify-center shrink-0 text-center">
                        <span className="text-[10px] font-mono font-black uppercase tracking-wider skew-x-12 text-amber-400">
                          {month}
                        </span>
                        <span className="text-2xl font-black skew-x-12 leading-none mt-0.5 text-white">
                          {day}
                        </span>
                        <span className="text-[9px] font-mono text-slate-300 skew-x-12 mt-0.5">
                          {year}
                        </span>
                      </div>

                      {/* Content Details */}
                      <div className="min-w-0 flex-1">
                        {evt.category && (
                          <span className="inline-block px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider mb-1.5 -skew-x-6 bg-sky-50 text-[#134975] border border-sky-200">
                            <span className="inline-block skew-x-6">{evt.category}</span>
                          </span>
                        )}
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#134975] transition-colors leading-snug line-clamp-2">
                          {evt.title}
                        </h3>
                      </div>
                    </div>

                    {evt.description && (
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {evt.description}
                      </p>
                    )}

                    <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-500 font-medium">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#e5a912] shrink-0" />
                        <span className="truncate">{evt.location || 'Main Auditorium'}</span>
                      </div>
                      {evt.time && (
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#134975] shrink-0" />
                          <span>{evt.time}</span>
                        </div>
                      )}
                    </div>

                    {/* Card Footer */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#134975] group-hover:text-amber-600 transition-colors">
                      <span>View Event Details</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Bottom Center CTA */}
          <div className="mt-10 flex justify-center">
            <Link
              to="/events"
              className="inline-flex items-center gap-2 px-8 py-3.5 -skew-x-12 bg-[#134975] hover:bg-[#0b3353] text-amber-300 font-black text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition"
            >
              <span className="skew-x-12 flex items-center gap-2">
                <span>View Full Academic Calendar</span>
                <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </div>

        </div>
      </section>
    );
  }

  // =========================================================================
  // 2. TEMPLATE 3: MEDICAL / HEALTHCARE (CLINICAL VITALS & SYMPOSIUMS)
  // =========================================================================
  if (layoutVariant === 'clinical') {
    return (
      <section className={`py-8 sm:py-10 ${eventStyles.sectionBg}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-3 border-b border-teal-100 dark:border-teal-900/50 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold mb-1.5 bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border border-teal-200/80 dark:border-teal-800/80">
                <Activity className="w-3 h-3 text-teal-600 dark:text-teal-400" />
                <span>{badgeText}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {title}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>
            </div>
            <Link
              to="/events"
              className="inline-flex items-center gap-1.5 font-bold text-xs text-teal-700 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300"
            >
              <span>View CME Schedule</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-pulse">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-44 bg-slate-200 dark:bg-slate-800 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {events.map((evt) => {
                const { day, month, year } = formatEventDateParts(evt.eventDate);
                return (
                  <div
                    key={evt.id}
                    className="group bg-white dark:bg-slate-900 border border-teal-100/90 dark:border-slate-800 rounded-xl p-4 shadow-2xs hover:shadow-md hover:border-teal-300 dark:hover:border-teal-700 transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Header Badge */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-lg bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800/70 flex flex-col items-center justify-center text-center">
                            <span className="text-[9px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300 leading-none">
                              {month}
                            </span>
                            <span className="text-sm font-black text-slate-900 dark:text-white leading-none mt-0.5">
                              {day}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 block">
                              Year {year}
                            </span>
                            <span className="text-[11px] font-bold text-teal-800 dark:text-teal-300 flex items-center gap-1">
                              <Calendar className="w-3 h-3" /> CME & Workshop
                            </span>
                          </div>
                        </div>
                      </div>

                      <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">
                        {evt.title}
                      </h3>

                      <p className="text-slate-500 dark:text-slate-400 text-xs line-clamp-2 mt-2 leading-relaxed">
                        {evt.description || 'Clinical rounds, multidisciplinary case discussions, and surgical updates.'}
                      </p>
                    </div>

                    <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500 truncate max-w-[160px]">
                        <MapPin className="w-3 h-3 text-teal-600 shrink-0" />
                        <span className="truncate">{evt.location || 'Clinical Complex'}</span>
                      </div>
                      <Link
                        to={`/events/${evt.id}`}
                        className="text-xs font-bold text-teal-700 dark:text-teal-400 hover:text-teal-800 hover:underline shrink-0"
                      >
                        Register →
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
  }

  // =========================================================================
  // 3. TEMPLATE 4: UNIVERSITY / PRESTIGE (TIMELINE / HORIZONTAL SESSIONS)
  // =========================================================================
  if (layoutVariant === 'timeline') {
    return (
      <section className={`py-8 sm:py-10 ${eventStyles.sectionBg}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-serif font-bold mb-2 bg-amber-500/10 text-amber-900 dark:text-amber-400 border border-amber-500/20">
              <Sparkles className="w-3 h-3 text-amber-600" />
              <span>{badgeText}</span>
            </div>
            <h2 className="font-serif font-black text-2xl sm:text-3xl text-slate-900 dark:text-white">
              {title}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1">{subtitle}</p>
          </div>

          {loading ? (
            <div className="space-y-3 max-w-4xl mx-auto animate-pulse">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-20 bg-slate-200 dark:bg-slate-800 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-3 sm:space-y-4">
              {events.map((evt, idx) => {
                const { day, month, year } = formatEventDateParts(evt.eventDate);
                return (
                  <div
                    key={evt.id}
                    className="group bg-white dark:bg-slate-900 border border-amber-900/15 dark:border-amber-500/20 rounded-xl p-4 sm:p-5 shadow-2xs hover:shadow-md hover:border-amber-500/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start sm:items-center gap-4">
                      {/* Timeline Badge */}
                      <div className="shrink-0 w-14 h-14 rounded-lg bg-navy-900 bg-slate-900 text-amber-400 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-500/30 flex flex-col items-center justify-center text-center">
                        <span className="text-[10px] font-bold uppercase tracking-wider leading-none">
                          {month}
                        </span>
                        <span className="text-lg font-black leading-tight mt-0.5">{day}</span>
                      </div>

                      {/* Text */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            Session {idx + 1}
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                            <Clock className="w-3 h-3 text-amber-600" /> {year}
                          </span>
                        </div>
                        <h3 className="font-serif font-bold text-base text-slate-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                          {evt.title}
                        </h3>
                        <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                          <MapPin className="w-3 h-3 text-amber-600 shrink-0" />
                          <span>{evt.location || 'Convocation Hall'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 sm:self-center">
                      <Link
                        to={`/events/${evt.id}`}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-amber-50 dark:bg-amber-950/50 text-amber-900 dark:text-amber-300 border border-amber-400/40 hover:bg-amber-500 hover:text-white transition-all shadow-2xs"
                      >
                        <span>Details</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="text-center mt-6">
            <Link
              to="/events"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-400 hover:underline"
            >
              <span>Explore Complete Convocation & Academic Schedule</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // =========================================================================
  // 4. TEMPLATE 1: ENGINEERING / MODERN (TECH CARD GRID WITH SOLID BLUE BADGES)
  // =========================================================================
  return (
    <section className={`py-8 sm:py-10 ${eventStyles.sectionBg}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-3">
          <div>
            {eventStyles.sectionHeaderBadge && (
              <div className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold mb-1.5 ${eventStyles.sectionHeaderBadge}`}>
                <Sparkles className="w-3.5 h-3.5" />
                <span>{badgeText}</span>
              </div>
            )}
            <h2 className={eventStyles.headingFont}>{title}</h2>
            <p className={`${eventStyles.subtitleFont} mt-1`}>{subtitle}</p>
          </div>
          <Link
            to="/events"
            className={`inline-flex items-center gap-1.5 font-semibold text-xs ${eventStyles.accentText} self-start sm:self-auto`}
          >
            <span>View Full Calendar</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-pulse">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-48 bg-slate-200 dark:bg-slate-800 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            {events.map((evt) => {
              const { day, month } = formatEventDateParts(evt.eventDate);
              const fullDateStr = evt.eventDate ? new Date(evt.eventDate).toLocaleDateString() : '';

              return (
                <div
                  key={evt.id}
                  className={`${eventStyles.cardBg} ${eventStyles.cardBorder} ${eventStyles.cardHover} rounded-xl p-4 sm:p-5 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      {/* Date Badge */}
                      <div className={`rounded-lg px-2.5 py-1.5 text-center shrink-0 ${eventStyles.dateBadge}`}>
                        <span className="block text-[10px] font-bold uppercase tracking-wider leading-none">{month}</span>
                        <span className="block text-lg sm:text-xl font-black leading-tight">{day}</span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-sm sm:text-base line-clamp-2 leading-snug">
                          {evt.title}
                        </h3>
                        <div className="flex items-center gap-1 text-xs opacity-70 mt-1">
                          <MapPin className="w-3 h-3 shrink-0" />
                          <span className="line-clamp-1">{evt.location || 'Campus Tech Hall'}</span>
                        </div>
                      </div>
                    </div>

                    <p className="opacity-80 text-xs line-clamp-2 leading-relaxed">
                      {evt.description}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-current/10 flex items-center justify-between">
                    <span className="text-[11px] opacity-60 flex items-center gap-1">
                      <CalendarDays className="w-3 h-3" />
                      {fullDateStr}
                    </span>
                    <Link
                      to={`/events/${evt.id}`}
                      className={`text-xs font-bold ${eventStyles.accentText} hover:underline`}
                    >
                      Details →
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
