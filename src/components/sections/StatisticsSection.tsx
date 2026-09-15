import React from 'react';
import { 
  GraduationCap, 
  Users, 
  Award, 
  BookOpen, 
  Building2, 
  Trophy, 
  Briefcase, 
  FileCheck, 
  TrendingUp,
  Globe,
  Sparkles,
  ShieldCheck,
  Target,
  Clock,
  HeartPulse,
  Activity,
  Cpu,
  Landmark,
  Scale
} from 'lucide-react';
import { useTenant } from '../../tenant/TenantContext';
import { useTheme } from '../../themes/ThemeContext';

interface StatItem {
  label: string;
  value: string | number;
  suffix?: string;
  icon?: string;
}

interface StatisticsProps {
  content: {
    title?: string;
    subtitle?: string;
    stats?: StatItem[];
  };
}

const getStatIcon = (iconName?: string) => {
  switch ((iconName || '').toLowerCase().replace(/[-_]/g, '')) {
    case 'users':
    case 'students':
    case 'community':
      return Users;
    case 'award':
    case 'honor':
    case 'faculty':
      return Award;
    case 'bookopen':
    case 'book':
    case 'courses':
    case 'academics':
      return BookOpen;
    case 'building2':
    case 'building':
    case 'campus':
    case 'infrastructure':
      return Building2;
    case 'trophy':
    case 'achievement':
      return Trophy;
    case 'briefcase':
    case 'career':
    case 'jobs':
      return Briefcase;
    case 'filecheck':
    case 'accreditation':
    case 'audit':
      return FileCheck;
    case 'trendingup':
    case 'growth':
    case 'placement':
    case 'rank':
      return TrendingUp;
    case 'globe':
    case 'global':
    case 'international':
      return Globe;
    case 'sparkles':
    case 'innovation':
    case 'excellence':
      return Sparkles;
    case 'shieldcheck':
    case 'shield':
    case 'security':
      return ShieldCheck;
    case 'target':
    case 'goals':
      return Target;
    case 'clock':
    case 'history':
      return Clock;
    case 'heartpulse':
    case 'medical':
      return HeartPulse;
    case 'activity':
      return Activity;
    case 'cpu':
    case 'tech':
      return Cpu;
    case 'landmark':
      return Landmark;
    case 'scale':
      return Scale;
    case 'graduationcap':
    case 'alumni':
    case 'degrees':
    default:
      return GraduationCap;
  }
};

export const StatisticsSection: React.FC<StatisticsProps> = ({ content }) => {
  const { siteConfig } = useTenant();
  const { isArtsAndScience, isMedical, isEngineering, isUniversity } = useTheme();

  const stats: StatItem[] = (content.stats && content.stats.length > 0)
    ? content.stats
    : (siteConfig?.stats && siteConfig.stats.length > 0)
    ? siteConfig.stats.filter((s: any) => s.isActive !== false).map((s: any) => ({
        label: s.label || '',
        value: s.value !== undefined ? ((s.prefix || '') + s.value) : (s.metric || ''),
        suffix: s.suffix || '',
        icon: s.iconName || s.icon || 'GraduationCap',
      }))
    : [];

  if (stats.length === 0) return null;

  // -------------------------------------------------------------
  // 1. ENGINEERING TEMPLATE: Modular 4-Card Cyber Telemetry Grid
  // -------------------------------------------------------------
  if (isEngineering) {
    return (
      <section className="py-14 sm:py-16 relative overflow-hidden bg-slate-950 text-white border-y border-slate-800/80">
        {/* Subtle Cyber Grid Background */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(56, 189, 248, 0.4) 1px, transparent 0)',
            backgroundSize: '28px 28px',
          }}
        />
        
        <div className="max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
          {/* Left-Aligned Tech Header */}
          <div className="mb-10 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-900 border border-amber-400/40 text-amber-300 shadow-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
              <span>⚡ Campus Telemetry & Impact</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white mt-3 drop-shadow-md">
              {content.title || 'Key Statistics & Engineering Milestones'}
            </h2>
            {content.subtitle && (
              <p className="text-sm text-slate-400 mt-1 max-w-2xl font-mono">
                {content.subtitle}
              </p>
            )}
          </div>

          {/* 4 Separate Angular Tech Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((st, idx) => {
              const Icon = getStatIcon(st.icon);
              return (
                <div
                  key={idx}
                  className="bg-slate-900/90 backdrop-blur-md border border-slate-800 hover:border-amber-400/60 rounded-2xl p-6 shadow-xl relative overflow-hidden group transition-all duration-300 transform hover:-translate-y-1"
                >
                  {/* Neon Top Edge Glow */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-cyan-400 opacity-70 group-hover:opacity-100 transition-opacity" />

                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-300 group-hover:bg-amber-400 group-hover:text-slate-950 transition-all shadow-inner">
                      <Icon className="w-6 h-6 stroke-[2]" />
                    </div>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      SYS #{idx + 1}
                    </span>
                  </div>

                  {/* Monospace Tech Metric */}
                  <div className="text-3xl sm:text-4xl font-black font-mono text-white tracking-tight leading-none flex items-baseline">
                    <span>{st.value}</span>
                    {st.suffix && <span className="text-amber-400 font-mono ml-0.5">{st.suffix}</span>}
                  </div>

                  {/* Label */}
                  <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mt-2.5">
                    {st.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  // -------------------------------------------------------------
  // 2. ARTS & SCIENCE TEMPLATE: Full-Width Classical Archival Ribbon
  // -------------------------------------------------------------
  if (isArtsAndScience) {
    return (
      <section className="py-14 sm:py-16 relative overflow-hidden bg-slate-950 text-emerald-100 border-y-2 border-emerald-500/30">
        {/* Classical Ambient Green Glow */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(6,78,59,0.5) 0%, transparent 70%)',
          }}
        />

        <div className="max-w-6xl mx-auto px-6 sm:px-10 relative z-10 text-center">
          {/* Centered Classical Header */}
          <div className="mb-10 space-y-2">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full text-xs font-serif font-bold uppercase tracking-widest bg-emerald-950/80 border border-emerald-500/40 text-amber-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>⚜️ Academic Distinctions & Record ⚜️</span>
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-emerald-50 tracking-normal drop-shadow-md">
              {content.title || 'Campus at a Glance — Excellence in Numbers'}
            </h2>
            {content.subtitle && (
              <p className="text-sm font-serif text-slate-300 max-w-xl mx-auto italic">
                {content.subtitle}
              </p>
            )}
          </div>

          {/* Classical Embossed Parchment Bar */}
          <div className="bg-slate-900/80 backdrop-blur-xl border border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-emerald-500/20">
              {stats.map((st, idx) => {
                const Icon = getStatIcon(st.icon);
                return (
                  <div key={idx} className={`flex flex-col items-center text-center ${idx > 0 ? 'pt-4 sm:pt-0 sm:pl-4' : ''}`}>
                    {/* Gold Medallion Icon */}
                    <div className="w-13 h-13 rounded-full bg-emerald-950 border-2 border-amber-400/40 flex items-center justify-center text-amber-300 mb-3 shadow-lg shadow-emerald-950/60 p-3">
                      <Icon className="w-6 h-6 stroke-[1.8]" />
                    </div>

                    {/* Classical Serif Metric */}
                    <div className="text-3xl sm:text-4xl font-serif font-bold text-amber-200 tracking-normal leading-none flex items-baseline">
                      <span>{st.value}</span>
                      {st.suffix && <span className="text-emerald-400 font-serif ml-0.5">{st.suffix}</span>}
                    </div>

                    {/* Stat Label */}
                    <div className="text-xs font-serif font-semibold text-emerald-100/90 mt-2 max-w-[180px]">
                      {st.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // -------------------------------------------------------------
  // 3. MEDICAL TEMPLATE: Clinical Vital-Metrics Strip & Dashboard
  // -------------------------------------------------------------
  if (isMedical) {
    return (
      <section className="py-14 sm:py-16 relative overflow-hidden bg-slate-950 text-white border-y border-cyan-900/60">
        {/* Subtle ECG Grid */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage: 'linear-gradient(rgba(6, 182, 212, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.3) 1px, transparent 1px)',
            backgroundSize: '36px 36px',
          }}
        />

        <div className="max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
          {/* Clinical Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-950/80 border border-cyan-400/40 text-cyan-200">
                <HeartPulse className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                <span>🟢 24/7 Clinical Capacity & Patient Care Audit</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white mt-2.5">
                {content.title || 'Clinical Healthcare & Hospital Infrastructure'}
              </h2>
            </div>
            {content.subtitle && (
              <p className="text-xs sm:text-sm text-cyan-100/80 max-w-md">
                {content.subtitle}
              </p>
            )}
          </div>

          {/* Hospital Telemetry Dashboard Strip */}
          <div className="bg-slate-900/90 backdrop-blur-xl border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-cyan-900/50">
              {stats.map((st, idx) => {
                const Icon = getStatIcon(st.icon);
                return (
                  <div key={idx} className={`flex items-center gap-4 ${idx > 0 ? 'pt-4 sm:pt-0 sm:pl-6' : ''}`}>
                    <div className="w-13 h-13 rounded-2xl bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center text-cyan-300 shrink-0 p-3 shadow-inner">
                      <Icon className="w-6 h-6 stroke-[2]" />
                    </div>
                    <div>
                      <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-none flex items-baseline">
                        <span>{st.value}</span>
                        {st.suffix && <span className="text-cyan-400 ml-0.5">{st.suffix}</span>}
                      </div>
                      <div className="text-xs font-bold text-cyan-100/80 mt-1 uppercase tracking-wide">
                        {st.label}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // -------------------------------------------------------------
  // 4. UNIVERSITY TEMPLATE: Monumental Grand Quadrangle Stat Matrix
  // -------------------------------------------------------------
  return (
    <section className="py-14 sm:py-16 relative overflow-hidden bg-slate-950 text-amber-100 border-y border-rose-900/50">
      {/* Royal Atmosphere Glow */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 30%, rgba(136,19,55,0.4) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-6xl mx-auto px-6 sm:px-10 relative z-10">
        {/* Monumental Centered Header */}
        <div className="text-center mb-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full text-xs font-serif font-bold uppercase tracking-wider bg-rose-950/80 border border-amber-400/40 text-amber-200">
            <GraduationCap className="w-4 h-4 text-amber-300" />
            <span>👑 Central Comprehensive University 👑</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-amber-50 tracking-normal drop-shadow-lg">
            {content.title || 'University at a Glance & Global Impact'}
          </h2>
          {content.subtitle && (
            <p className="text-sm font-serif text-slate-300 max-w-xl mx-auto">
              {content.subtitle}
            </p>
          )}
        </div>

        {/* 2x2 Stacked Grand Architectural Quadrangle Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((st, idx) => {
            const Icon = getStatIcon(st.icon);
            return (
              <div
                key={idx}
                className="bg-slate-900/90 backdrop-blur-xl border border-amber-500/30 hover:border-amber-400 rounded-2xl p-6 shadow-2xl text-center space-y-3 transition transform hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-xl bg-rose-900/40 border border-amber-400/40 flex items-center justify-center text-amber-300 mx-auto shadow-inner">
                  <Icon className="w-6 h-6 stroke-[1.8]" />
                </div>

                <div className="text-3xl sm:text-4xl font-serif font-bold text-amber-100 tracking-tight leading-none flex items-baseline justify-center">
                  <span>{st.value}</span>
                  {st.suffix && <span className="text-rose-400 font-serif ml-0.5">{st.suffix}</span>}
                </div>

                <div className="text-xs font-serif font-semibold text-slate-300 uppercase tracking-wider">
                  {st.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
