import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, HeartPulse, GraduationCap, Cpu, PhoneCall, BookOpen } from 'lucide-react';
import { useTheme } from '../../themes/ThemeContext';

interface CtaProps {
  content: {
    headline?: string;
    subheadline?: string;
    badge?: string;
    buttonText?: string;
    buttonUrl?: string;
    secondaryButtonText?: string;
    secondaryButtonUrl?: string;
  };
}

export const CtaSection: React.FC<CtaProps> = ({ content }) => {
  const { isArtsAndScience, isMedical, isEngineering, isUniversity } = useTheme();

  if (!content.headline && !content.buttonText) return null;

  // 1. Engineering CTA
  if (isEngineering) {
    return (
      <section className="py-16 sm:py-20 bg-slate-950 text-white relative overflow-hidden border-y border-amber-500/30">
        <div 
          className="absolute inset-0 pointer-events-none opacity-15"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(245, 158, 11, 0.4) 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
        />
        <div className="max-w-5xl mx-auto px-6 text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-slate-900 border border-amber-400/50 text-amber-300 shadow-xl">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>{content.badge || 'ADMISSIONS 2026-27 ACTIVE'}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight leading-tight max-w-3xl mx-auto text-white drop-shadow-xl">
            {content.headline || 'Launch Your High-Tech Engineering Career'}
          </h2>

          {content.subheadline && (
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed font-mono">
              {content.subheadline}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            {content.buttonText && (
              <Link
                to={content.buttonUrl || '/admissions'}
                className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl font-black text-sm uppercase tracking-wide bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-xl shadow-amber-500/25 transition transform hover:-translate-y-0.5"
              >
                <span>{content.buttonText}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
            {content.secondaryButtonText && (
              <Link
                to={content.secondaryButtonUrl || '/contact'}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm text-white bg-slate-900/80 hover:bg-slate-800 border border-cyan-400/40 transition backdrop-blur-md"
              >
                <span>{content.secondaryButtonText}</span>
              </Link>
            )}
          </div>
        </div>
      </section>
    );
  }

  // 2. Arts & Science CTA
  if (isArtsAndScience) {
    return (
      <section className="py-16 sm:py-20 bg-slate-950 text-emerald-100 relative overflow-hidden border-y-2 border-emerald-500/30">
        <div 
          className="absolute inset-0 pointer-events-none opacity-25"
          style={{
            backgroundImage: 'radial-gradient(ellipse at center, rgba(6,78,59,0.5) 0%, transparent 80%)',
          }}
        />
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full text-xs font-serif font-bold uppercase tracking-widest bg-emerald-950/90 border border-emerald-500/40 text-amber-300 shadow-xl">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{content.badge || '⚜️ UGC AUTONOMOUS ADMISSIONS OPEN ⚜️'}</span>
            <Sparkles className="w-3.5 h-3.5" />
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-normal leading-tight max-w-3xl mx-auto text-emerald-50 drop-shadow-2xl">
            {content.headline || 'Begin Your Journey of Wisdom & Discovery'}
          </h2>

          {content.subheadline && (
            <p className="text-sm sm:text-base font-serif text-slate-200 max-w-2xl mx-auto leading-relaxed italic">
              {content.subheadline}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            {content.buttonText && (
              <Link
                to={content.buttonUrl || '/admissions'}
                className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl font-serif font-bold text-sm bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-400/40 shadow-xl shadow-emerald-950/80 transition transform hover:-translate-y-0.5"
              >
                <span>{content.buttonText}</span>
                <ArrowRight className="w-4 h-4 text-emerald-200" />
              </Link>
            )}
            {content.secondaryButtonText && (
              <Link
                to={content.secondaryButtonUrl || '/about'}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-serif font-semibold text-sm text-amber-200 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/40 transition backdrop-blur-md"
              >
                <BookOpen className="w-4 h-4 text-amber-300" />
                <span>{content.secondaryButtonText}</span>
              </Link>
            )}
          </div>
        </div>
      </section>
    );
  }

  // 3. Medical CTA
  if (isMedical) {
    return (
      <section className="py-16 sm:py-20 bg-slate-950 text-white relative overflow-hidden border-y border-cyan-900/60">
        <div 
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage: 'linear-gradient(rgba(6, 182, 212, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.3) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="max-w-5xl mx-auto px-6 text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-950/80 border border-cyan-400/40 text-cyan-200 shadow-xl">
            <HeartPulse className="w-4 h-4 text-rose-400 animate-pulse" />
            <span>{content.badge || 'NMC ACCREDITED CLINICAL ADMISSIONS'}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight max-w-3xl mx-auto text-white drop-shadow-xl">
            {content.headline || 'Pursue Excellence in Clinical Medicine & Healthcare'}
          </h2>

          {content.subheadline && (
            <p className="text-sm sm:text-base text-cyan-100/90 max-w-2xl mx-auto leading-relaxed">
              {content.subheadline}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            {content.buttonText && (
              <Link
                to={content.buttonUrl || '/admissions'}
                className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl font-bold text-sm bg-cyan-600 hover:bg-cyan-500 text-white shadow-xl shadow-cyan-900/50 transition transform hover:-translate-y-0.5"
              >
                <span>{content.buttonText}</span>
                <ArrowRight className="w-4 h-4 text-cyan-200" />
              </Link>
            )}
            {content.secondaryButtonText ? (
              <Link
                to={content.secondaryButtonUrl || '/contact'}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm text-white bg-rose-600 hover:bg-rose-500 border border-rose-500/40 shadow-xl shadow-rose-950/50 transition"
              >
                <PhoneCall className="w-4 h-4" />
                <span>{content.secondaryButtonText}</span>
              </Link>
            ) : (
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm text-white bg-rose-600 hover:bg-rose-500 border border-rose-500/40 shadow-xl shadow-rose-950/50 transition"
              >
                <PhoneCall className="w-4 h-4" />
                <span>24/7 Casualty Hotline</span>
              </Link>
            )}
          </div>
        </div>
      </section>
    );
  }

  // 4. University CTA
  return (
    <section className="py-16 sm:py-20 bg-slate-950 text-amber-100 relative overflow-hidden border-y border-amber-500/40">
      <div 
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(136,19,55,0.45) 0%, transparent 75%)',
        }}
      />
      <div className="max-w-5xl mx-auto px-6 text-center space-y-6 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-serif font-bold uppercase tracking-wider bg-rose-950/80 border border-amber-400/40 text-amber-200 shadow-xl">
          <GraduationCap className="w-4 h-4 text-amber-300" />
          <span>{content.badge || '👑 UNIVERSITY MATRICULATION OPEN 👑'}</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-normal leading-tight max-w-3xl mx-auto text-amber-50 drop-shadow-2xl">
          {content.headline || 'Join a World-Renowned Seat of Academic Excellence'}
        </h2>

        {content.subheadline && (
          <p className="text-sm sm:text-base font-serif text-slate-200 max-w-2xl mx-auto leading-relaxed">
            {content.subheadline}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          {content.buttonText && (
            <Link
              to={content.buttonUrl || '/admissions'}
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl font-serif font-bold text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 border border-amber-300/50 shadow-xl shadow-amber-950/50 transition transform hover:-translate-y-0.5"
            >
              <span>{content.buttonText}</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </Link>
          )}
          {content.secondaryButtonText && (
            <Link
              to={content.secondaryButtonUrl || '/about'}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-serif font-semibold text-sm text-amber-200 bg-rose-950/60 hover:bg-rose-900/60 border border-amber-400/30 transition backdrop-blur-md"
            >
              <span>{content.secondaryButtonText}</span>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};
