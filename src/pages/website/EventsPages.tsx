import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CalendarDays, MapPin, ArrowLeft, CheckCircle, Send, AlertCircle } from 'lucide-react';
import { EventItem } from '../../types';
import { apiClient } from '../../services/apiClient';
import { useTheme } from '../../themes/ThemeContext';
import { useActiveTemplate } from '../../templates/templateRegistry';
import { useTenant } from '../../tenant/TenantContext';
import { TemplateCard } from '../../components/website/TemplateCard';

export const EventsListPage: React.FC = () => {
  const Template = useActiveTemplate();
  const { siteConfig } = useTenant();
  const { isArtsAndScience, isMedical, isUniversity, isEngineering } = useTheme();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isSlanted =
    Template.config.code === 'DESIGN_3D_MODERN' ||
    Template.config.code === 'SALESIAN_SLANTED' ||
    Template.config.code === 'ARTS_SCIENCE_MODERN' ||
    Template.config.code === 'TEMPLATE2' ||
    Template.config.code === 'TEMPLATE_2';

  const headerConfig =
    siteConfig?.settings?.socialLinks?.pageHeaders?.events ||
    siteConfig?.settings?.pageHeaders?.events;

  const badgeText = headerConfig?.badge || (isSlanted ? 'Academic Symposia & Campus Events' : 'Events & Campus Calendar');
  const titleText = headerConfig?.title || 'Events & Campus Calendar';
  const subtitleText =
    headerConfig?.subtitle ||
    'Conferences, distinguished guest lectures, hackathons, academic symposiums, and sports championships.';

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await apiClient.get('/site/events', { params: { limit: 50 } });
        if (res.data.success) {
          setEvents(res.data.data);
        }
      } catch (err) {
        console.error(err);
        setError('Unable to load events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className={`min-h-screen ${Template.config.bodyBgClass}`}>
      {/* Dynamic Modular Template Page Hero */}
      <Template.PageHero
        badge={badgeText}
        title={titleText}
        subtitle={subtitleText}
        icon={<CalendarDays className="w-4 h-4 text-amber-300" />}
      />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((n) => (
              <div key={n} className={`h-64 bg-slate-200 ${isArtsAndScience ? 'rounded-none' : 'rounded-2xl'}`} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-red-200 p-8 max-w-md mx-auto shadow-xs">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
            <h3 className="font-bold text-red-700 text-lg">Something went wrong</h3>
            <p className="text-red-500 text-xs mt-1">{error}</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 max-w-md mx-auto shadow-xs">
            <CalendarDays className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-800 text-lg">No upcoming events</h3>
            <p className="text-slate-500 text-xs mt-1">Check back soon for academic conferences and campus events.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {events.map((evt) => {
              const d = new Date(evt.eventDate);
              const dateStr = `${d.toLocaleDateString()} • ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

              return (
                <TemplateCard
                  key={evt.id}
                  title={evt.title}
                  categoryBadge="Event@Campus"
                  dateBadge={dateStr}
                  subtitle={`📍 ${evt.location}`}
                  description={evt.description}
                  linkTo={`/events/${evt.id}`}
                  actionText="View Details"
                  tags={[evt.location]}
                />
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export const EventDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [regOpen, setRegOpen] = useState(false);
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regSubmitting, setRegSubmitting] = useState(false);
  const [regSuccess, setRegSuccess] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await apiClient.get(`/site/events/${id}`);
        if (res.data.success) {
          setEvent(res.data.data);
        }
      } catch (err) {
        console.error(err);
        setDetailError('Unable to load this event. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegSubmitting(true);
    setRegError(null);
    try {
      await apiClient.post('/site/contact/submissions', {
        name: regName,
        email: regEmail,
        phoneNumber: regPhone,
        subject: `Event Registration: ${event?.title || 'College Event'}`,
        message: `Interested in registering for the event "${event?.title}" scheduled on ${event?.eventDate ? new Date(event.eventDate).toLocaleDateString() : 'TBD'} at ${event?.location || 'Campus'}. Please share registration details.`,
      });
      setRegSuccess(true);
    } catch (err: any) {
      console.error('Failed to submit event registration', err);
      setRegError(err.response?.data?.message || 'Unable to submit your registration. Please try again later.');
    } finally {
      setRegSubmitting(false);
    }
  };

if (loading) {
    return (
      <div className="py-24 flex justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (detailError) {
    return (
      <div className="py-24 text-center">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
        <h2 className="text-2xl font-bold text-red-700">Unable to load this event</h2>
        <p className="text-sm text-red-500 mt-1">{detailError}</p>
        <Link to="/events" className="text-primary mt-2 inline-block font-semibold">
          ← Back to Events
        </Link>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="py-24 text-center">
        <h2 className="text-2xl font-bold">Event Not Found</h2>
        <Link to="/events" className="text-primary mt-2 inline-block font-semibold">
          ← Back to Events
        </Link>
      </div>
    );
  }

  const d = new Date(event.eventDate);

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <Link
        to="/events"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-primary mb-6 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Events</span>
      </Link>

      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-slate-600">
          <div className="flex items-center gap-2 text-primary">
            <CalendarDays className="w-4 h-4" />
            <span>{d.toLocaleDateString()} at {d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            <span>{event.location}</span>
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
          {event.title}
        </h1>

        <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed">
          <p>{event.description}</p>
        </div>

        <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={() => {
              setRegOpen(true);
              setRegSuccess(false);
              setRegError(null);
            }}
            className="px-6 py-3 rounded-xl font-bold text-white bg-primary hover:opacity-90 transition shadow-md"
          >
            Register for Event
          </button>
        </div>
      </div>

      {/* Registration Modal */}
      {regOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm" onClick={() => setRegOpen(false)}>
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 sm:p-8 space-y-5" onClick={(e) => e.stopPropagation()}>
            {regSuccess ? (
              <div className="text-center space-y-3 py-6">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Registration Submitted!</h3>
                <p className="text-xs text-slate-600">
                  Thank you, <strong>{regName}</strong>. Our events team will contact you regarding "{event?.title}".
                </p>
                <button
                  onClick={() => setRegOpen(false)}
                  className="mt-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="text-center space-y-1.5">
                  <h3 className="text-lg font-bold text-slate-900">Register for Event</h3>
                  <p className="text-xs text-slate-500">{event?.title}</p>
                </div>

                {regError && (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{regError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                  <input type="text" required value={regName} onChange={(e) => setRegName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                  <input type="email" required value={regEmail} onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary" placeholder="john@example.com" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                  <input type="tel" value={regPhone} onChange={(e) => setRegPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary" placeholder="+91 98765 43210" />
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setRegOpen(false)}
                    className="flex-1 py-2.5 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition">
                    Cancel
                  </button>
                  <button type="submit" disabled={regSubmitting}
                    className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-primary hover:opacity-90 transition flex items-center justify-center gap-2">
                    <Send className="w-3.5 h-3.5" />
                    <span>{regSubmitting ? 'Submitting...' : 'Confirm Registration'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
