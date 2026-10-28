import React, { useEffect, useState } from 'react';
import { Award, Users, Globe, Briefcase, GraduationCap, PlusCircle, CheckCircle2, ExternalLink, Mail, MapPin } from 'lucide-react';
import { apiClient } from '../../services/apiClient';
import { useActiveTemplate } from '../../templates/templateRegistry';
import { useTenant } from '../../tenant/TenantContext';
import { AlumniMember } from '../../types';

export const AlumniPage: React.FC = () => {
  const Template = useActiveTemplate();
  const { siteConfig } = useTenant();
  const [alumni, setAlumni] = useState<AlumniMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const headerConfig =
    siteConfig?.settings?.socialLinks?.pageHeaders?.alumni ||
    siteConfig?.settings?.pageHeaders?.alumni;

  const badgeText = headerConfig?.badge || 'Global Alumni Association';
  const titleText = headerConfig?.title || 'Alumni Network & Legacy';
  const subtitleText =
    headerConfig?.subtitle ||
    'Celebrating our distinguished alumni leading innovations, founding enterprises, and making a profound impact across the globe.';
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    graduationYear: new Date().getFullYear() - 1,
    degree: '',
    currentCompany: '',
    currentDesignation: '',
    currentCity: '',
    linkedinUrl: '',
    testimonial: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        const res = await apiClient.get('/site/alumni');
        if (res.data.success && Array.isArray(res.data.data)) {
          setAlumni(res.data.data);
        } else {
          setAlumni([]);
        }
      } catch (err) {
        console.error('Failed to load alumni', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAlumni();
  }, []);

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await apiClient.post('/site/alumni/register', formData);
      if (res.data.success) {
        setSubmitSuccess(true);
        setTimeout(() => {
          setIsRegisterOpen(false);
          setSubmitSuccess(false);
          setFormData({
            fullName: '',
            email: '',
            phone: '',
            graduationYear: new Date().getFullYear() - 1,
            degree: '',
            currentCompany: '',
            currentDesignation: '',
            currentCity: '',
            linkedinUrl: '',
            testimonial: '',
          });
        }, 2000);
      }
    } catch (err) {
      console.error('Registration failed', err);
      alert('Unable to submit registration right now. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen ${Template.config.bodyBgClass}`}>
      <Template.PageHero
        badge={badgeText}
        title={titleText}
        subtitle={subtitleText}
        icon={<GraduationCap className="w-4 h-4 text-amber-300" />}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Network CTA Banner */}
        <div className="bg-gradient-to-r from-primary to-primary/80 text-white rounded-3xl p-8 sm:p-10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-black">Are You an Alumnus?</h2>
            <p className="text-white/80 text-xs sm:text-sm">
              Stay connected with your alma mater, mentor current students, post job openings, and receive invitations to annual alumni reunions.
            </p>
          </div>
          <button
            onClick={() => setIsRegisterOpen(true)}
            className="px-6 py-3.5 bg-white text-primary font-black rounded-xl shadow-md hover:bg-slate-50 transition shrink-0 cursor-pointer flex items-center gap-2"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Join Alumni Network</span>
          </button>
        </div>

        {/* Notable Alumni Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Distinguished Alumni Spotlights</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Leaders across technology, science, and governance.</p>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs font-semibold text-slate-500">Loading alumni network...</p>
            </div>
          ) : alumni.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 max-w-md mx-auto">
              <GraduationCap className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-bold text-slate-800 text-lg">Alumni Profiles Updating</h3>
              <p className="text-slate-500 text-xs mt-1">Be the first to register your profile!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {alumni.map((member) => (
                <div key={member.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      {member.photoUrl ? (
                        <img src={member.photoUrl} alt={member.fullName} className="w-14 h-14 rounded-2xl object-cover border border-slate-200" />
                      ) : (
                        <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary font-black text-lg flex items-center justify-center border border-primary/20">
                          {member.fullName.charAt(0)}
                        </div>
                      )}
                      <div className="min-w-0">
                        <h3 className="font-bold text-base text-slate-900 truncate">{member.fullName}</h3>
                        <p className="text-xs font-semibold text-primary truncate">{member.currentDesignation || 'Alumnus'}</p>
                        <p className="text-[11px] text-slate-500 font-medium truncate">{member.currentCompany}</p>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                        <span>Class of {member.graduationYear} {member.degree ? `(${member.degree})` : ''}</span>
                      </div>
                      {member.currentCity && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{member.currentCity}</span>
                        </div>
                      )}
                    </div>

                    {member.testimonial && (
                      <p className="text-xs italic text-slate-600 mt-3 pt-3 border-t border-slate-100 line-clamp-3">
                        "{member.testimonial}"
                      </p>
                    )}
                  </div>

                  {member.linkedinUrl && (
                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <a
                        href={member.linkedinUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:underline"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Connect on LinkedIn</span>
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Online Registration Modal */}
      {isRegisterOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8">
            {submitSuccess ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black text-slate-900">Welcome to the Network!</h3>
                <p className="text-xs text-slate-600">Your profile details have been submitted to the alumni directory.</p>
              </div>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="text-lg font-black text-slate-900">Alumni Association Registration</h3>
                  <button
                    type="button"
                    onClick={() => setIsRegisterOpen(false)}
                    className="text-slate-400 hover:text-slate-600 font-bold text-lg"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Graduation Year *</label>
                    <input
                      type="number"
                      required
                      value={formData.graduationYear}
                      onChange={(e) => setFormData({ ...formData, graduationYear: parseInt(e.target.value) || 2020 })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Degree / Branch</label>
                    <input
                      type="text"
                      placeholder="e.g. B.Tech CSE"
                      value={formData.degree}
                      onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Company / Org</label>
                    <input
                      type="text"
                      placeholder="Current Employer"
                      value={formData.currentCompany}
                      onChange={(e) => setFormData({ ...formData, currentCompany: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Designation</label>
                    <input
                      type="text"
                      placeholder="Role Title"
                      value={formData.currentDesignation}
                      onChange={(e) => setFormData({ ...formData, currentDesignation: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">LinkedIn Profile URL</label>
                  <input
                    type="url"
                    placeholder="https://linkedin.com/in/..."
                    value={formData.linkedinUrl}
                    onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Alma Mater Memory / Message</label>
                  <textarea
                    rows={2}
                    placeholder="Share a thought for upcoming juniors..."
                    value={formData.testimonial}
                    onChange={(e) => setFormData({ ...formData, testimonial: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-primary focus:outline-none resize-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsRegisterOpen(false)}
                    className="px-4 py-2 border border-slate-200 text-slate-600 font-bold rounded-xl text-xs hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 bg-primary text-white font-bold rounded-xl text-xs hover:opacity-90 disabled:opacity-50"
                  >
                    {submitting ? 'Registering...' : 'Submit Profile'}
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
