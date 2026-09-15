import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { apiClient } from '../../services/apiClient';
import { useTheme } from '../../themes/ThemeContext';

interface ContactProps {
  content: {
    title?: string;
    subtitle?: string;
    phone?: string;
    email?: string;
    address?: string;
    showForm?: boolean;
  };
}

export const ContactSection: React.FC<ContactProps> = ({ content }) => {
  const { isArtsAndScience, isMedical, isUniversity, isEngineering } = useTheme();

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    try {
      await apiClient.post('/site/contact/submissions', {
        name: form.name,
        email: form.email,
        phoneNumber: form.phone,
        subject: 'Website Contact Section Inquiry',
        message: form.message,
      });
      setSubmitted(true);
    } catch (err: any) {
      console.error('Failed to submit contact section inquiry', err);
      setSubmitError(err.response?.data?.message || 'Unable to submit your inquiry. Please try again or contact us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  const sectionBg = isEngineering
    ? 'py-16 bg-slate-950 text-white border-y border-slate-900'
    : isArtsAndScience
    ? 'py-16 bg-[#fbf9f4] text-slate-900 border-y border-emerald-900/10'
    : isMedical
    ? 'py-16 bg-white text-slate-900 border-y border-cyan-100'
    : 'py-16 bg-[#fcfaf7] text-slate-900 border-y border-stone-200';

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

  return (
    <section className={sectionBg}>
      <div className="max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contact Details */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-2 ${badgeClass}`}>
                <Phone className="w-3.5 h-3.5" />
                <span>Get In Touch</span>
              </div>
              <h2 className={headingFont}>
                {content.title || 'Contact Admissions & Campus Office'}
              </h2>
              <p className="text-sm opacity-80 mt-2">
                {content.subtitle || 'Our administrative counselors are available Monday through Saturday to answer questions regarding admission prerequisites and scholarships.'}
              </p>
            </div>

            <div className="space-y-4">
              {content.phone && (
                <div className="flex items-start gap-4 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Helpline</span>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{content.phone}</p>
                  </div>
                </div>
              )}

              {content.email && (
                <div className="flex items-start gap-4 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Email</span>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{content.email}</p>
                  </div>
                </div>
              )}

              {content.address && (
                <div className="flex items-start gap-4 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Campus Location</span>
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{content.address}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl">
              {submitted ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Inquiry Received!</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Thank you for reaching out. Our admissions coordinator will contact you via email or phone within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Send an Instant Inquiry</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Contact Phone</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Message / Questions</label>
                    <textarea
                      rows={3}
                      required
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Tell us about the degree program you are interested in..."
                    />
                  </div>
                  {submitError && (
                    <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{submitError}</span>
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 rounded-xl font-bold text-xs text-white bg-primary hover:opacity-90 shadow-md shadow-primary/20 flex items-center justify-center gap-2 transition"
                  >
                    <span>{submitting ? 'Submitting...' : 'Submit Inquiry'}</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
