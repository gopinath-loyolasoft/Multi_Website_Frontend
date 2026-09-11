import React, { useState, useEffect } from 'react';
import { CheckCircle2, FileText, Phone, Mail, Send, Sparkles, AlertCircle } from 'lucide-react';
import { apiClient } from '../../services/apiClient';
import { PageData } from '../../types';
import { PageRenderer } from '../../components/dynamic/SectionRenderer';
import { useTenant } from '../../tenant/TenantContext';
import { useTheme } from '../../themes/ThemeContext';

interface CourseOption {
  id: string | number;
  title: string;
  code?: string;
}

export const AdmissionsPage: React.FC = () => {
  const { tenantDomain } = useTenant();
  const { isArtsAndScience, isMedical, isUniversity, isEngineering } = useTheme();
  const [cmsPage, setCmsPage] = useState<PageData | null>(null);
  const [cmsLoading, setCmsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [selectedProgram, setSelectedProgram] = useState('');
  const [contactInfo, setContactInfo] = useState<{ phone?: string; email?: string }>({});
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseRes, contactRes, pageRes] = await Promise.allSettled([
          apiClient.get('/site/courses'),
          apiClient.get('/site/contact'),
          apiClient.get('/site/pages/admissions'),
        ]);

        if (courseRes.status === 'fulfilled' && courseRes.value.data.success && courseRes.value.data.data) {
          const list: CourseOption[] = courseRes.value.data.data;
          setCourses(list);
          if (list.length > 0) {
            setSelectedProgram(list[0].title);
          }
        }

        if (contactRes.status === 'fulfilled' && contactRes.value.data.success && contactRes.value.data.data) {
          const d = contactRes.value.data.data;
          setContactInfo({
            phone: d.contactPhone || '',
            email: d.contactEmail || '',
          });
        }

        if (pageRes.status === 'fulfilled' && pageRes.value.data.success && pageRes.value.data.data) {
          setCmsPage(pageRes.value.data.data);
        } else if (pageRes.status === 'rejected') {
          setFetchError('Unable to load the Admissions page from the CMS. Showing default content instead.');
        }
      } catch (err) {
        console.error('Failed to load admission dependencies', err);
        setFetchError('Unable to load the Admissions page from the CMS. Showing default content instead.');
      } finally {
        setCmsLoading(false);
      }
    };
    fetchData();
  }, [tenantDomain]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    try {
      await apiClient.post('/site/contact/submissions', {
        name: fullName,
        email,
        phoneNumber,
        subject: `Admission Inquiry: ${selectedProgram || 'General'}`,
        message: message || `Prospective student inquiring about admission${selectedProgram ? ` into ${selectedProgram}` : ''}.`,
      });
      setSubmitted(true);
    } catch (err: any) {
      console.error('Failed to submit admission inquiry', err);
      setSubmitError(err.response?.data?.message || 'Unable to submit your inquiry. Please try again or contact us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  const heroBg = isArtsAndScience
    ? 'bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-950'
    : isMedical
    ? 'bg-gradient-to-r from-teal-950 via-teal-900 to-slate-950'
    : isUniversity
    ? 'bg-gradient-to-r from-rose-950 via-slate-950 to-slate-900'
    : 'bg-gradient-to-r from-slate-950 via-blue-950 to-slate-900';

  const titleFont = isArtsAndScience || isUniversity ? 'font-serif' : 'font-sans';

  if (cmsLoading) {
    return (
      <div className="min-h-screen bg-slate-50 py-24 flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 text-sm font-medium">Loading Admissions...</p>
      </div>
    );
  }

  const renderInquiryForm = () => (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Direct Application Inquiry Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80">
          <div className="mb-6">
            <span className="text-xs font-bold text-primary uppercase tracking-wider block mb-1">
              Fast-Track Admissions
            </span>
            <h2 className={`text-2xl sm:text-3xl font-black text-slate-900 ${titleFont}`}>
              Online Admission Inquiry Form
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1.5">
              Submit your credentials and our admission counseling committee will reach out within 24 hours.
            </p>
          </div>

          {submitted ? (
            <div className="p-8 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-4">
              <div className="w-14 h-14 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-extrabold text-emerald-900">Inquiry Received Successfully!</h3>
              <p className="text-emerald-800 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
                Thank you, <strong>{fullName}</strong>. Our senior admissions counselor will review your application details for <strong>{selectedProgram}</strong> and contact you via phone or email shortly.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFullName('');
                  setEmail('');
                  setPhoneNumber('');
                  setMessage('');
                }}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm"
              >
                Submit Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Program of Choice *
                  </label>
                  {courses.length > 0 ? (
                    <select
                      value={selectedProgram}
                      onChange={(e) => setSelectedProgram(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    >
                      {courses.map((c) => (
                        <option key={c.id} value={c.title}>
                          {c.title} {c.code ? `(${c.code})` : ''}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      required
                      placeholder="e.g. Computer Science, Mechanical, etc."
                      value={selectedProgram}
                      onChange={(e) => setSelectedProgram(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Questions or Academic Background (Optional)
                </label>
                <textarea
                  rows={4}
                  placeholder="Provide details about your academic background or specific inquiries..."
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
                <span>{submitting ? 'Submitting Application...' : 'Submit Admission Inquiry'}</span>
              </button>
            </form>
          )}
        </div>

        {/* Right Column: Dynamic Helpline & Application Checklist */}
        <div className="lg:col-span-5 space-y-6">
          {/* Required Documents Checklist Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
              <FileText className="w-4 h-4 text-primary" />
              <span>Application Prerequisites</span>
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Documents to Keep Ready
            </h3>
            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>High school / Secondary school marks transcripts</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Government-issued photo identification proof</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Recent passport-size color photographs</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Transfer & conduct certificates from prior institution</span>
              </div>
            </div>
          </div>

          {(contactInfo.phone || contactInfo.email) && (
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900">
                Admissions Contact Desk
              </h3>
              <div className="space-y-3 text-xs">
                {contactInfo.phone && (
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <Phone className="w-4 h-4 text-primary shrink-0" />
                    <div>
                      <span className="block text-[10px] text-slate-400 font-semibold uppercase">Official Contact Number</span>
                      <a href={`tel:${contactInfo.phone}`} className="font-bold text-slate-800 hover:text-primary">
                        {contactInfo.phone}
                      </a>
                    </div>
                  </div>
                )}

                {contactInfo.email && (
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <Mail className="w-4 h-4 text-primary shrink-0" />
                    <div>
                      <span className="block text-[10px] text-slate-400 font-semibold uppercase">Official Email</span>
                      <a href={`mailto:${contactInfo.email}`} className="font-bold text-slate-800 hover:text-primary">
                        {contactInfo.email}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );

  if (cmsPage && cmsPage.sections && cmsPage.sections.length > 0) {
    return (
      <div className={`min-h-screen ${isArtsAndScience ? 'bg-amber-50/30' : isMedical ? 'bg-teal-50/20' : 'bg-slate-50'}`}>
        <PageRenderer sections={cmsPage.sections} />
        {renderInquiryForm()}
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isArtsAndScience ? 'bg-amber-50/30' : isMedical ? 'bg-teal-50/20' : 'bg-slate-50'}`}>
      {fetchError && (
        <div className="flex items-center justify-center gap-2.5 bg-red-50 border-b border-red-200 text-red-700 text-xs font-semibold px-4 py-3 text-center">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {fetchError}
        </div>
      )}
      {/* Hero Banner */}
      <section className={`relative ${heroBg} text-white py-16 md:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden`}>
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-wider text-white mb-4">
            <Sparkles className="w-4 h-4 text-emerald-300" />
            <span>{isArtsAndScience ? 'Scholarly Admissions 2026 - 2027' : isMedical ? 'Medical & Clinical Admissions 2026 - 2027' : isUniversity ? 'University Enrollment 2026 - 2027' : 'Admissions Open 2026 - 2027'}</span>
          </div>
          <h1 className={`text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-4 ${titleFont}`}>
            Begin Your Transformative Journey
          </h1>
          <p className={`text-slate-200 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed ${isArtsAndScience ? 'font-serif' : ''}`}>
            Join a vibrant university ecosystem committed to academic distinction, cutting-edge innovation, and global leadership.
          </p>
        </div>
      </section>

      {/* 4-Step Application Pipeline Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            {
              step: '01',
              title: 'Explore & Choose Program',
              desc: 'Select from over 45+ accredited UG, PG, and Doctoral degrees suited to your career ambition.',
              badge: 'Step 1',
            },
            {
              step: '02',
              title: 'Submit Online Application',
              desc: 'Fill out the portal application form and upload academic marks cards & photo ID credentials.',
              badge: 'Step 2',
            },
            {
              step: '03',
              title: 'Merit & Counseling',
              desc: 'Participate in entrance score evaluation, document scrutiny, and personal interview session.',
              badge: 'Step 3',
            },
            {
              step: '04',
              title: 'Admission Confirmation',
              desc: 'Receive provisional letter of offer, secure your seat with fee deposit, and join orientation.',
              badge: 'Step 4',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 shadow-md border border-slate-200/80 hover:shadow-xl transition-all duration-300 relative overflow-hidden group hover:-translate-y-1"
            >
              <div className="text-3xl font-black text-primary/20 group-hover:text-primary/30 transition-colors mb-2">
                {item.step}
              </div>
              <h3 className="font-bold text-slate-900 text-base leading-snug mb-2">
                {item.title}
              </h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {renderInquiryForm()}
    </div>
  );
};