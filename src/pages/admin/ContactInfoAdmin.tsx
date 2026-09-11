import React, { useEffect, useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Save,
  RefreshCw,
  Check,
  X,
  Info,
  ExternalLink,
  Globe
} from 'lucide-react';
import { useTenant } from '../../tenant/TenantContext';
import { apiClient } from '../../services/apiClient';

export const ContactInfoAdminPage: React.FC = () => {
  const { siteConfig, refreshConfig } = useTenant();

  // Editable fields
  const [address, setAddress] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [googleMapsUrl, setGoogleMapsUrl] = useState('');

  // UI state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [showContactMonitor, setShowContactMonitor] = useState(true);


  const siteName = siteConfig?.settings?.siteName || siteConfig?.tenant?.name || 'College';

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4500);
  };

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/admin/profile/settings');
      if (res.data.success && res.data.data) {
        const d = res.data.data;
        setAddress(d.address || '');
        setContactPhone(d.contactPhone || '');
        setContactEmail(d.contactEmail || '');
        setGoogleMapsUrl(d.googleMapsUrl || d.socialLinks?.googleMapsUrl || '');
      }
    } catch (err) {
      console.error('Failed to load contact settings', err);
      showNotification('Failed to load contact information.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!address.trim() && !contactPhone.trim() && !contactEmail.trim()) {
      showNotification('Please fill in at least one contact detail before saving.', 'error');
      return;
    }
    try {
      setSaving(true);
      // We must also send existing non-contact settings to avoid overwriting them
      const existing = await apiClient.get('/admin/profile/settings');
      const ex = existing.data?.data || {};

      const payload = {
        siteName: ex.siteName || siteName,
        tagline: ex.tagline || '',
        logoUrl: ex.logoUrl || '',
        loginBgImageUrl: ex.loginBgImageUrl || '',
        contactEmail: contactEmail.trim(),
        contactPhone: contactPhone.trim(),
        address: address.trim(),
        socialLinks: {
          ...(ex.socialLinks || {}),
          googleMapsUrl: googleMapsUrl.trim(),
        },
      };

      const res = await apiClient.put('/admin/profile/settings', payload);
      if (res.data.success) {
        showNotification('Contact information updated! The live website will reflect changes immediately.');
        await refreshConfig();
      } else {
        showNotification(res.data.message || 'Failed to save contact info.', 'error');
      }
    } catch (err: any) {
      console.error(err);
      showNotification('Error saving contact information. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 font-sans text-slate-900 dark:text-slate-100 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <MapPin className="w-6 h-6 text-primary" />
            <span>Contact Information</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Edit campus contact details — changes update immediately across the website header, footer, and contact page.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <a
            href="/contact"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-white font-semibold rounded-xl text-xs border border-slate-200 dark:border-slate-700 transition cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-blue-500" />
            <span>Open Live Page</span>
          </a>
          <button
            onClick={fetchSettings}
            disabled={loading}
            className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl transition cursor-pointer"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Notification */}
      {message && (
        <div
          className={`p-3.5 rounded-xl text-xs font-semibold flex items-center justify-between gap-3 ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === 'success' ? (
              <Check className="w-4 h-4 shrink-0" />
            ) : (
              <X className="w-4 h-4 shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
          <button onClick={() => setMessage(null)}>
            <X className="w-4 h-4 text-slate-400 hover:text-slate-600" />
          </button>
        </div>
      )}

      {/* ── LIVE CONTACT INFO MONITOR (LIGHT MODE) ── */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="p-4 flex items-center justify-between border-b border-slate-100 bg-slate-50/75">
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${(address || contactPhone || contactEmail) ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`} />
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 font-mono">
              Live Contact Info Monitor
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-500">
              {[address, contactPhone, contactEmail].filter(Boolean).length} of 3 fields set
            </span>
            <button
              type="button"
              onClick={() => setShowContactMonitor(!showContactMonitor)}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs transition cursor-pointer"
            >
              {showContactMonitor ? 'Hide Preview' : 'Show Preview'}
            </button>
          </div>
        </div>
        {showContactMonitor && (
          <div className="p-5 bg-slate-50/50">
            {!(address || contactPhone || contactEmail) ? (
              <div className="text-center text-slate-400 text-xs py-8 space-y-1">
                <MapPin className="w-8 h-8 text-slate-300 mx-auto" />
                <p>No contact details set. Fill in fields below to see the preview.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {address && (
                  <div className="rounded-xl border border-slate-200 bg-white p-3.5 space-y-1 shadow-2xs">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-blue-600" />
                      <span>Campus Location</span>
                    </div>
                    <p className="text-xs text-slate-900 font-semibold leading-relaxed line-clamp-2">{address}</p>
                  </div>
                )}
                {contactPhone && (
                  <div className="rounded-xl border border-slate-200 bg-white p-3.5 space-y-1 shadow-2xs">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Helpline</span>
                    </div>
                    <p className="text-xs font-bold text-slate-900 truncate">{contactPhone}</p>
                  </div>
                )}
                {contactEmail && (
                  <div className="rounded-xl border border-slate-200 bg-white p-3.5 space-y-1 shadow-2xs">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      <Mail className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Official Email</span>
                    </div>
                    <p className="text-xs font-bold text-slate-900 truncate">{contactEmail}</p>
                  </div>
                )}
              </div>
            )}
            <p className="text-[11px] text-slate-400 italic text-center pt-4">
              * Renders dynamically on your Contact page. Updates instantly as you edit.
            </p>
          </div>
        )}
      </div>

      {loading ? (
        <div className="space-y-4 animate-pulse w-full">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="w-full">
          <form onSubmit={handleSave} className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-6 space-y-6">
              <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Save className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">Contact Information & Details</h2>
                  <p className="text-xs text-slate-500">Changes update dynamically in the monitor above and publish to the website upon saving.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Campus Location */}
                <div className="md:col-span-2 space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <label className="text-xs font-bold text-slate-800 dark:text-white">
                      Campus Physical Address *
                    </label>
                  </div>
                  <textarea
                    rows={3}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. 123 University Avenue, Knowledge City, Chennai - 600001"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-600 focus:outline-none resize-none leading-relaxed"
                  />
                </div>

                {/* Official Helpline */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-emerald-600" />
                    <label className="text-xs font-bold text-slate-800 dark:text-white">
                      Official Helpline / Phone
                    </label>
                  </div>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="e.g. +91 44 2855 0000"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                {/* Official Email */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-indigo-600" />
                    <label className="text-xs font-bold text-slate-800 dark:text-white">
                      Official Admissions / Inquiries Email
                    </label>
                  </div>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="e.g. info@college.edu.in"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                {/* Google Maps URL */}
                <div className="md:col-span-2 space-y-2">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-red-500" />
                    <label className="text-xs font-bold text-slate-800 dark:text-white">
                      Google Maps URL <span className="text-slate-400 font-normal">(optional direction link)</span>
                    </label>
                  </div>
                  <input
                    type="url"
                    value={googleMapsUrl}
                    onChange={(e) => setGoogleMapsUrl(e.target.value)}
                    placeholder="e.g. https://maps.google.com/?q=College+Campus"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-600 focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Action Bar */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs text-slate-400 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-slate-400" />
                  <span>Changes will immediately update the Contact page and Header/Footer widgets.</span>
                </p>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-2 text-xs cursor-pointer disabled:opacity-60"
                >
                  {saving ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>{saving ? 'Saving Changes...' : 'Save Contact Information'}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
