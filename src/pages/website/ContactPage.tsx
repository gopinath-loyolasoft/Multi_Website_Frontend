import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Send, CheckCircle2, MessageSquare, Compass, AlertCircle } from 'lucide-react';
import { apiClient } from '../../services/apiClient';
import { useTheme } from '../../themes/ThemeContext';

export const ContactPage: React.FC = () => {
  const { isArtsAndScience, isMedical, isUniversity, isEngineering } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [contactInfo, setContactInfo] = useState<{
    siteName?: string;
    address?: string;
    phone?: string;
    email?: string;
    officeHours?: string;
    googleMapsUrl?: string;
  }>({});
  const [contactLoading, setContactLoading] = useState(true);
  const [contactError, setContactError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const res = await apiClient.get('/site/contact');
        if (res.data.success && res.data.data) {
          const d = res.data.data;
          setContactInfo({
            siteName: d.siteName,
            address: d.address || d.contactAddress || '',
            phone: d.contactPhone || '',
            email: d.contactEmail || '',
            officeHours: d.officeHours || d.socialLinks?.officeHours || 'Monday - Saturday: 9:00 AM - 5:00 PM',
            googleMapsUrl: d.googleMapsUrl || d.socialLinks?.googleMapsUrl || '',
          });
        }
      } catch (err) {
        console.error('Failed to load contact info', err);
        setContactError('Unable to load contact details. Please try again later.');
      } finally {
        setContactLoading(false);
      }
    };
    fetchContact();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    try {
      await apiClient.post('/site/contact/submissions', {
        name,
        email,
        phoneNumber: phone,
        subject: subject || 'General Inquiry',
        message,
      });
      setSubmitted(true);
    } catch (err: any) {
      console.error('Failed to submit contact form', err);
      setSubmitError(err.response?.data?.message || 'Unable to submit your message. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  const hasAnyContactDetail = contactInfo.address || contactInfo.phone || contactInfo.email;

  const heroBg = isArtsAndScience
    ? 'bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-950'
    : isMedical
    ? 'bg-gradient-to-r from-teal-950 via-teal-900 to-slate-950'
    : isUniversity
    ? 'bg-gradient-to-r from-rose-950 via-slate-950 to-slate-900'
    : 'bg-gradient-to-r from-slate-950 via-blue-950 to-slate-900';

  const titleFont = isArtsAndScience || isUniversity ? 'font-serif' : 'font-sans';

  return (
    <div className={`min-h-screen ${isArtsAndScience ? 'bg-amber-50/30' : isMedical ? 'bg-teal-50/20' : 'bg-slate-50'}`}>
      {/* Hero Banner */}
      <section className={`relative ${heroBg} text-white py-16 md:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden`}>
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold uppercase tracking-wider text-white mb-4">
            <MessageSquare className="w-4 h-4 text-emerald-300" />
            <span>Connect & Visit</span>
          </div>
          <h1 className={`text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-4 ${titleFont}`}>
            Contact & Institutional Registry
          </h1>
          <p className={`text-slate-200 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed ${isArtsAndScience ? 'font-serif' : ''}`}>
            Reach out to our offices or submit an inquiry directly below.
          </p>
        </div>
      </section>

      {/* Admin Contact Cards - only rendered if admin configured contact details */}
      {contactLoading ? (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-slate-200 rounded-2xl" />
            ))}
          </div>
        </section>
      ) : contactError && !hasAnyContactDetail ? (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {contactError}
          </div>
        </section>
      ) : hasAnyContactDetail && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contactInfo.address && (
              <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200/80 hover:shadow-xl transition-all">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Campus Location</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed whitespace-pre-line">
                  {contactInfo.address}
                </p>
              </div>
            )}

            {contactInfo.phone && (
              <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200/80 hover:shadow-xl transition-all">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                  <Phone className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Official Helpline</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  <a href={`tel:${contactInfo.phone}`} className="hover:text-emerald-600 font-semibold text-slate-800">
                    {contactInfo.phone}
                  </a>
                </p>
              </div>
            )}

            {contactInfo.email && (
              <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200/80 hover:shadow-xl transition-all">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                  <Mail className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Official Email Inquiries</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  <a href={`mailto:${contactInfo.email}`} className="hover:text-blue-600 font-semibold text-slate-800">
                    {contactInfo.email}
                  </a>
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Main Section: Left Form + Right Map & Visiting Hours */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Inquiry Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80">
            <div className="mb-6">
              <span className="text-xs font-bold text-primary uppercase tracking-wider block mb-1">
                Drop Us a Message
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                Send Us an Inquiry
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm mt-1.5">
                Fill out the form below and the appropriate department will respond promptly.
              </p>
            </div>

            {submitted ? (
              <div className="p-8 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-4">
                <div className="w-14 h-14 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-extrabold text-emerald-900">Message Dispatched!</h3>
                <p className="text-emerald-800 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
                  Thank you, <strong>{name}</strong>. Your inquiry regarding "{subject || 'General Information'}" has been forwarded to the institutional registry.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setName('');
                    setEmail('');
                    setPhone('');
                    setSubject('');
                    setMessage('');
                  }}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sarah Jenkins"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. sarah@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Subject *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Admission / Verification / Campus Visit"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Message *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Type your message or inquiry here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                {submitError && (
                  <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-red-200 text-red-700 flex items-center justify-center shrink-0 text-[9px] font-black">!</span>
                    <span>{submitError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-primary text-white font-bold text-xs sm:text-sm rounded-xl shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Transmitting Message...' : 'Send Message'}</span>
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Campus Location & Directions Map Card */}
          <div className="lg:col-span-5">
            {contactInfo.address && (
              <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden h-full">
                {/* Card header */}
                <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-2">
                  <Compass className="w-5 h-5 text-primary" />
                  <h3 className="text-base font-bold text-slate-900">Campus Location & Directions</h3>
                </div>

                {/* Map placeholder with pin */}
                <div className="relative w-full bg-gradient-to-br from-slate-100 to-blue-50 flex flex-col items-center justify-center py-16 px-6">
                  {/* Decorative grid */}
                  <div className="absolute inset-0 opacity-20 bg-[linear-gradient(#94a3b8_1px,transparent_1px),linear-gradient(90deg,#94a3b8_1px,transparent_1px)] bg-[size:32px_32px]" />
                  <div className="relative z-10 flex flex-col items-center text-center">
                    {/* Animated pin */}
                    <div className="relative mb-4">
                      <div className="absolute -inset-2 rounded-full bg-primary/20 animate-ping" />
                      <div className="w-14 h-14 rounded-full bg-white border-4 border-primary shadow-xl flex items-center justify-center relative z-10">
                        <MapPin className="w-7 h-7 text-primary" />
                      </div>
                    </div>
                    <span className="font-bold text-sm text-slate-900 block">{contactInfo.siteName || 'Campus Main Office'}</span>
                    <p className="text-xs text-slate-600 mt-2 max-w-xs whitespace-pre-line leading-relaxed">
                      {contactInfo.address}
                    </p>
                  </div>
                </div>

                {/* Open Maps button */}
                <div className="px-6 py-5">
                  <a
                    href={contactInfo.googleMapsUrl || `https://maps.google.com/?q=${encodeURIComponent(contactInfo.address)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 bg-primary text-white font-bold rounded-xl text-xs shadow-md hover:opacity-90 transition"
                  >
                    <MapPin className="w-4 h-4" />
                    <span>Open in Google Maps ↗</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
