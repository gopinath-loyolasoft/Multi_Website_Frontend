import React from 'react';
import { Quote, Sparkles, HeartPulse, GraduationCap, Cpu, ShieldCheck, ArrowRight } from 'lucide-react';
import { useTenant } from '../../tenant/TenantContext';
import { useTheme } from '../../themes/ThemeContext';

interface QuoteSectionProps {
  content?: {
    title?: string;
    quoteText?: string;
    authorName?: string;
    designation?: string;
    authorTitle?: string;
    authorImage?: string;
    authorImageUrl?: string;
    subText?: string;
  };
}

export const QuoteSection: React.FC<QuoteSectionProps> = ({ content }) => {
  const { siteConfig } = useTenant();
  const { isArtsAndScience, isMedical, isEngineering, isUniversity } = useTheme();

  const quote = siteConfig?.quote;
  const quoteText = content?.quoteText || quote?.quoteText;
  const authorName = content?.authorName || quote?.authorName || 'Leadership Directorate';
  const authorTitle = content?.designation || content?.authorTitle || quote?.designation || quote?.authorTitle || (
    isMedical ? 'Dean & Medical Superintendent' : isArtsAndScience ? 'President & Dean of Academic Council' : isUniversity ? 'Chancellor & Chairman of Senate' : 'Principal & Technology Director'
  );
  const authorImage = content?.authorImageUrl || content?.authorImage || quote?.authorImageUrl || quote?.authorImage || '/assets/templates/common/leader_portrait.svg';
  const subText = content?.subText || quote?.subText;
  const isActive = quote?.isActive !== false;

  if (!isActive || !quoteText) {
    return null;
  }

  // -------------------------------------------------------------
  // 1. ENGINEERING TEMPLATE: Split Industrial Tech Layout
  // -------------------------------------------------------------
  if (isEngineering) {
    return (
      <section className="py-14 sm:py-18 relative overflow-hidden bg-slate-950 text-white border-y border-slate-800">
        <div className="max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Angular Tech Photo Frame & Credentials */}
            <div className="lg:col-span-4 bg-slate-900/90 backdrop-blur-xl border border-amber-400/30 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-4">
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden border border-slate-700 bg-slate-800">
                <img
                  src={authorImage}
                  alt={authorName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/templates/common/leader_portrait.svg';
                  }}
                />
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-slate-900/90 text-amber-300 border border-amber-400/40">
                  LEADERSHIP
                </div>
              </div>

              <div>
                <h3 className="text-lg font-black uppercase text-white tracking-wide">{authorName}</h3>
                <p className="text-xs font-mono text-amber-300 mt-0.5">{authorTitle}</p>
                {subText && <p className="text-[11px] text-slate-400 mt-1">{subText}</p>}
              </div>
            </div>

            {/* Right Column: Cyber Terminal Quote Box */}
            <div className="lg:col-span-8 bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl relative space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="inline-flex items-center gap-2 text-xs font-mono uppercase font-bold text-amber-300">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  <span>{content?.title || "Leadership & Engineering Vision"}</span>
                </div>
                <Quote className="w-6 h-6 text-slate-600" />
              </div>

              <blockquote className="text-lg sm:text-xl lg:text-2xl font-sans font-medium text-slate-100 leading-relaxed drop-shadow-md">
                "{quoteText}"
              </blockquote>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>// EMPOWERING GLOBAL ENGINEERS & INNOVATORS</span>
                <span className="text-amber-400 font-bold">EXCELLENCE VERIFIED</span>
              </div>
            </div>

          </div>
        </div>
      </section>
    );
  }

  // -------------------------------------------------------------
  // 2. ARTS & SCIENCE TEMPLATE: Centered Classical Editorial Plaque
  // -------------------------------------------------------------
  if (isArtsAndScience) {
    return (
      <section className="py-16 sm:py-20 relative overflow-hidden bg-slate-950 text-emerald-100 border-y-2 border-emerald-500/30">
        <div className="max-w-4xl mx-auto px-6 sm:px-10 relative z-10 text-center space-y-8 animate-in fade-in duration-700">
          
          {/* Crest Laurel */}
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full text-xs font-serif font-bold uppercase tracking-widest bg-emerald-950/80 border border-emerald-500/40 text-amber-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>⚜️ Leadership Vision & Academic Charter ⚜️</span>
            <Sparkles className="w-3.5 h-3.5" />
          </div>

          {/* Grand Centered Serif Quote */}
          <div className="relative">
            <Quote className="w-12 h-12 text-emerald-500/30 mx-auto mb-4" />
            <blockquote className="text-xl sm:text-2xl lg:text-3xl font-serif italic text-emerald-50 leading-relaxed drop-shadow-xl max-w-3xl mx-auto">
              "{quoteText}"
            </blockquote>
          </div>

          {/* Centered Oval Cameo Portrait & Credentials */}
          <div className="pt-4 flex flex-col items-center space-y-3">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-3 border-amber-400/50 shadow-2xl shadow-emerald-950/80 p-1 bg-emerald-950">
              <img
                src={authorImage}
                alt={authorName}
                className="w-full h-full object-cover rounded-full"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/templates/common/leader_portrait.svg';
                }}
              />
            </div>
            <div>
              <div className="font-serif font-bold text-lg sm:text-xl text-amber-100">
                {authorName}
              </div>
              <div className="font-serif text-xs sm:text-sm text-emerald-300 italic mt-0.5">
                {authorTitle}
              </div>
              {subText && (
                <div className="text-xs text-slate-400 mt-1 font-serif">
                  {subText}
                </div>
              )}
            </div>
          </div>

        </div>
      </section>
    );
  }

  // -------------------------------------------------------------
  // 3. MEDICAL TEMPLATE: Medical Director Clinical Station
  // -------------------------------------------------------------
  if (isMedical) {
    return (
      <section className="py-14 sm:py-18 relative overflow-hidden bg-slate-950 text-white border-y border-cyan-900/60">
        <div className="max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Doctor Profile Card */}
            <div className="lg:col-span-4 bg-slate-900/90 backdrop-blur-xl border border-cyan-500/30 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-4">
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden border border-cyan-900/80 bg-slate-800">
                <img
                  src={authorImage}
                  alt={authorName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/templates/common/leader_portrait.svg';
                  }}
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-cyan-950/90 text-cyan-200 border border-cyan-400/40">
                  <HeartPulse className="w-3 h-3 inline-block mr-1 text-rose-400" />
                  Dean & CMO
                </div>
              </div>

              <div>
                <h3 className="text-lg font-extrabold text-white">{authorName}</h3>
                <p className="text-xs font-medium text-cyan-300 mt-0.5">{authorTitle}</p>
                {subText && <p className="text-[11px] text-cyan-100/70 mt-1">{subText}</p>}
              </div>
            </div>

            {/* Right Column: Dean's Clinical Mission & Patient Care Charter */}
            <div className="lg:col-span-8 bg-slate-900/70 backdrop-blur-xl border border-cyan-500/30 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-cyan-900/50 pb-3">
                <div className="inline-flex items-center gap-2 text-xs uppercase font-bold text-cyan-200">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span>{content?.title || "Clinical Healthcare Mission & Medical Oath"}</span>
                </div>
                <Quote className="w-6 h-6 text-cyan-500/40" />
              </div>

              <blockquote className="text-lg sm:text-xl lg:text-2xl font-sans font-semibold text-white leading-relaxed">
                "{quoteText}"
              </blockquote>

              <div className="pt-3 border-t border-cyan-900/50 flex items-center justify-between text-xs text-cyan-200/80">
                <span>🩺 EVIDENCE-BASED PRACTICE & PATIENT COMPASSION</span>
                <span className="text-cyan-400 font-bold">NMC ACCREDITED</span>
              </div>
            </div>

          </div>
        </div>
      </section>
    );
  }

  // -------------------------------------------------------------
  // 4. UNIVERSITY TEMPLATE: Chancellor's Grand Archival Chamber
  // -------------------------------------------------------------
  return (
    <section className="py-16 sm:py-20 relative overflow-hidden bg-slate-950 text-amber-100 border-y border-amber-500/40">
      {/* Royal Background Wash */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(136,19,55,0.45) 0%, transparent 75%)',
        }}
      />

      <div className="max-w-5xl mx-auto px-6 sm:px-10 relative z-10 text-center space-y-8">
        {/* University Crest Medal */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-serif font-bold uppercase tracking-wider bg-rose-950/80 border border-amber-400/40 text-amber-200 shadow-xl">
          <GraduationCap className="w-4 h-4 text-amber-300" />
          <span>👑 Chancellor's Address to Convocation & Faculties 👑</span>
        </div>

        {/* Gilded Quote */}
        <blockquote className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-amber-50 leading-relaxed drop-shadow-xl max-w-4xl mx-auto">
          "{quoteText}"
        </blockquote>

        {/* Chancellor Credential Strip */}
        <div className="pt-4 flex items-center justify-center gap-4 max-w-md mx-auto p-4 rounded-2xl bg-slate-900/80 border border-amber-500/30">
          <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-amber-400/60 shrink-0">
            <img
              src={authorImage}
              alt={authorName}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/assets/templates/common/leader_portrait.svg';
              }}
            />
          </div>
          <div className="text-left">
            <div className="font-serif font-bold text-base text-amber-100">{authorName}</div>
            <div className="font-serif text-xs text-amber-300/90">{authorTitle}</div>
            {subText && <div className="font-serif text-[11px] text-slate-400">{subText}</div>}
          </div>
        </div>
      </div>
    </section>
  );
};
