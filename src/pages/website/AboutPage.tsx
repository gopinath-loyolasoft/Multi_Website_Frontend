import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, GraduationCap, Phone, Mail, MapPin, Quote, ArrowRight, Image as ImageIcon } from 'lucide-react';
import { PageData } from '../../types';
import { apiClient } from '../../services/apiClient';
import { PageRenderer } from '../../components/dynamic/SectionRenderer';
import { useTenant } from '../../tenant/TenantContext';
import { useTheme } from '../../themes/ThemeContext';

export const AboutPage: React.FC = () => {
  const { tenantDomain, siteConfig } = useTenant();
  const { isArtsAndScience, isMedical, isUniversity } = useTheme();
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [found, setFound] = useState(false);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get('/site/pages/about');
        if (res.data.success && res.data.data) {
          setPageData(res.data.data);
          setFound(true);
        } else {
          setFound(false);
        }
      } catch {
        setFound(false);
      } finally {
        setLoading(false);
      }
    };
    fetchPage();
  }, [tenantDomain]);

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 text-sm font-medium">Loading About {siteConfig?.tenant?.name || ''}...</p>
      </div>
    );
  }

  // If a custom dynamic About page has been created in the CMS by the Admin, render it
  if (found && pageData && pageData.sections && pageData.sections.length > 0) {
    return (
      <div className="min-h-screen bg-slate-50">
        <PageRenderer sections={pageData.sections} />
      </div>
    );
  }

  const institutionName = siteConfig?.tenant?.name || 'Our Institution';
  const tagline = siteConfig?.settings?.tagline || siteConfig?.settings?.description;
  const address = siteConfig?.settings?.address;
  const phone = siteConfig?.settings?.phone || siteConfig?.settings?.contactPhone;
  const email = siteConfig?.settings?.email || siteConfig?.settings?.contactEmail;
  const stats = siteConfig?.stats && Array.isArray(siteConfig.stats) && siteConfig.stats.length > 0 ? siteConfig.stats : null;
  const quote = siteConfig?.quote;

  const heroBg = isArtsAndScience
    ? 'bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-950'
    : isMedical
    ? 'bg-gradient-to-r from-teal-950 via-teal-900 to-slate-950'
    : isUniversity
    ? 'bg-gradient-to-r from-rose-950 via-slate-950 to-slate-900'
    : 'bg-gradient-to-r from-slate-950 via-blue-950 to-slate-900';

  const titleFont = isArtsAndScience || isUniversity ? 'font-serif' : 'font-sans';
  const statValColor = isArtsAndScience
    ? 'text-emerald-700 font-serif'
    : isMedical
    ? 'text-teal-700 font-sans'
    : isUniversity
    ? 'text-rose-900 font-serif'
    : 'text-blue-700 font-sans';

  return (
    <div className={`min-h-screen ${isArtsAndScience ? 'bg-amber-50/30 font-serif' : isMedical ? 'bg-teal-50/20' : 'bg-slate-50'}`}>
      {/* Hero Banner */}
      <section className={`relative ${heroBg} text-white py-16 md:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden`}>
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold uppercase tracking-wider text-white mb-4">
            <Building2 className="w-4 h-4 text-amber-300" />
            <span>Institutional Profile</span>
          </div>
          <h1 className={`text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-4 ${titleFont}`}>
            About {institutionName}
          </h1>
          {tagline && (
            <p className={`text-slate-200 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed ${isArtsAndScience ? 'font-serif' : ''}`}>
              {tagline}
            </p>
          )}
        </div>
      </section>

      {/* Dynamic Stats Ribbon (Rendered only when real stats are configured) */}
      {stats && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
          <div className={`grid grid-cols-2 sm:grid-cols-${Math.min(stats.length, 4)} gap-4 sm:gap-6 bg-white rounded-3xl p-6 sm:p-8 shadow-lg border border-slate-200/80`}>
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <span className={`block text-2xl sm:text-3xl font-black ${statValColor}`}>{stat.value}</span>
                <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">{stat.label}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Leadership / Quote Section (Rendered only when real quote is configured and active) */}
      {quote && quote.isActive !== false && quote.quoteText && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-sm relative">
            <Quote className="w-10 h-10 text-primary/20 absolute top-6 right-6" />
            <p className="text-slate-700 text-base sm:text-lg italic leading-relaxed mb-6">
              "{quote.quoteText}"
            </p>
            {(quote.authorName || quote.designation || quote.authorTitle) && (
              <div className="border-t border-slate-100 pt-4 flex items-center gap-4">
                {(quote.authorImageUrl || quote.authorImage) && (
                  <img
                    src={quote.authorImageUrl || quote.authorImage}
                    alt={quote.authorName}
                    className="w-12 h-12 rounded-full object-cover border border-slate-200"
                  />
                )}
                <div>
                  {quote.authorName && <h4 className="text-base font-bold text-slate-900">{quote.authorName}</h4>}
                  {(quote.designation || quote.authorTitle) && (
                    <p className="text-xs text-slate-500 font-medium">{quote.designation || quote.authorTitle}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Institutional Details & Quick Access */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Real Contact & Location Info */}
          {(address || phone || email) && (
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" />
                Campus & Contact Details
              </h3>
              <div className="space-y-4 text-sm text-slate-600">
                {address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span>{address}</span>
                  </div>
                )}
                {phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-primary shrink-0" />
                    <a href={`tel:${phone}`} className="hover:text-primary transition-colors font-medium">
                      {phone}
                    </a>
                  </div>
                )}
                {email && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-primary shrink-0" />
                    <a href={`mailto:${email}`} className="hover:text-primary transition-colors font-medium">
                      {email}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Quick Navigation Cards */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-primary" />
                Explore {institutionName}
              </h3>
              <p className="text-slate-600 text-sm mb-6">
                Discover academic programs, campus life, events, and resources available at our campus.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                to="/courses"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-primary/5 hover:text-primary border border-slate-200/80 transition-all font-semibold text-sm group"
              >
                <span>Academic Courses</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                to="/gallery"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-primary/5 hover:text-primary border border-slate-200/80 transition-all font-semibold text-sm group"
              >
                <span className="flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-slate-500" />
                  Campus Gallery
                </span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                to="/contact"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-primary/5 hover:text-primary border border-slate-200/80 transition-all font-semibold text-sm group sm:col-span-2"
              >
                <span>Contact Campus Admissions</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};