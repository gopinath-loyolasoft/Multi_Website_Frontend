import React, { useEffect, useState } from 'react';
import { Building2, Award, Target, Compass, CheckCircle2 } from 'lucide-react';
import { PageData } from '../../types';
import { apiClient } from '../../services/apiClient';
import { PageRenderer } from '../../components/dynamic/SectionRenderer';
import { useTenant } from '../../tenant/TenantContext';
import { useTheme } from '../../themes/ThemeContext';

export const AboutPage: React.FC = () => {
  const { tenantDomain, siteConfig } = useTenant();
  const { isArtsAndScience, isMedical, isUniversity, isEngineering } = useTheme();
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

  if (found && pageData && pageData.sections.length > 0) {
    return (
      <div className="min-h-screen bg-slate-50">
        <PageRenderer sections={pageData.sections} />
      </div>
    );
  }

  const institutionName = siteConfig?.tenant?.name || 'Our Institution';

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
      <section className={`relative ${heroBg} text-white py-16 md:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden`}>
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold uppercase tracking-wider text-white mb-4">
            <Building2 className="w-4 h-4 text-amber-300" />
            <span>{isArtsAndScience ? 'Legacy of Classical Excellence' : isMedical ? 'Clinical & Hospital Legacy' : isUniversity ? 'Multi-Faculty Heritage' : 'Legacy of Excellence'}</span>
          </div>
          <h1 className={`text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-4 ${titleFont}`}>
            About {institutionName}
          </h1>
          <p className={`text-slate-200 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed ${isArtsAndScience ? 'font-serif' : ''}`}>
            Established with a visionary commitment to deliver transformative education, pioneer
            groundbreaking research, and empower global leaders.
          </p>
        </div>
      </section>

      {/* 4 Stats Ribbon */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 bg-white rounded-3xl p-6 sm:p-8 shadow-lg border border-slate-200/80">
          {[
            { label: 'Academic Heritage', value: 'Decades' },
            { label: 'Campus Footprint', value: 'Expansive' },
            { label: 'Placement Record', value: 'Excellent' },
            { label: 'Alumni Network', value: 'Global' },
          ].map((stat, idx) => (
            <div key={idx} className="text-center">
              <span className={`block text-2xl sm:text-3xl font-black ${statValColor}`}>{stat.value}</span>
              <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Vision & Mission Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm relative overflow-hidden group hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-5">
              <Target className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-3">Our Vision</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              To be recognized as a premier institution known for academic rigor, ethical
              entrepreneurship, disruptive discovery, and fostering holistic human values for
              societal upliftment.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm relative overflow-hidden group hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-5">
              <Compass className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-3">Our Mission</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              To impart student-centric education through modern experiential pedagogies, build
              world-class collaborative research facilities, and nurture responsible leaders who
              solve critical global challenges.
            </p>
          </div>
        </div>
      </section>

      {/* Accreditations & Recognitions Grid */}
      <section className="bg-slate-100/70 border-y border-slate-200 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Certified Quality</span>
            <h2 className="text-3xl font-black text-slate-900 mt-1">Accreditations & Recognitions</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { title: 'NAAC Accredited', desc: 'Highest Grade' },
              { title: 'NBA Tier-1', desc: 'Accredited Programs' },
              { title: 'NIRF Ranked', desc: 'National Standing' },
              { title: 'AICTE', desc: 'Govt. Approved' },
              { title: 'UGC', desc: 'Recognized Status' },
              { title: 'ISO 9001', desc: 'Quality Certified' },
            ].map((item, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-5 border border-slate-200 text-center shadow-sm">
                <Award className="w-6 h-6 text-primary mx-auto mb-2" />
                <h3 className="text-sm font-extrabold text-slate-900">{item.title}</h3>
                <p className="text-[11px] text-slate-500 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 max-w-lg mx-auto p-4 text-center text-xs text-slate-500 bg-white rounded-xl border border-dashed border-slate-300">
            <CheckCircle2 className="w-4 h-4 text-primary mx-auto mb-1.5" />
            This page is fully managed by the college admin. Log into the admin portal and create an
            "about" page to customize every section through the CMS.
          </div>
        </div>
      </section>
    </div>
  );
};