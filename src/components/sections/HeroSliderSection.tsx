import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles, HeartPulse, GraduationCap, Cpu, PhoneCall, BookOpen, ShieldCheck } from 'lucide-react';
import { useTheme, useTemplateTheme } from '../../themes/ThemeContext';

interface Slide {
  imageUrl?: string;
  headline?: string;
  caption?: string;
  badge?: string;
  buttonText?: string;
  buttonUrl?: string;
  secondaryButtonText?: string;
  secondaryButtonUrl?: string;
  pillars?: string[];
}

interface HeroSliderProps {
  content: {
    slides?: Slide[];
    autoplaySpeed?: number;
    showArrows?: boolean;
    showDots?: boolean;
  };
}

export const HeroSliderSection: React.FC<HeroSliderProps> = ({ content }) => {
  const { isArtsAndScience, isMedical, isEngineering, isUniversity } = useTheme();
  const { styles } = useTemplateTheme();
  const sliderStyles = styles.heroSlider;

  const slides = content.slides && content.slides.length > 0 ? content.slides : [];
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, content.autoplaySpeed || 6000);
    return () => clearInterval(timer);
  }, [slides.length, content.autoplaySpeed]);

  if (slides.length === 0) return null;

  const prevSlide = () => setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);

  const slide = slides[current];

  const badgeClass = sliderStyles.badgeClass;
  const badgeIconClass = sliderStyles.badgeIconClass;
  const BadgeIcon = isArtsAndScience ? BookOpen : isMedical ? HeartPulse : isUniversity ? GraduationCap : Cpu;
  const headlineClass = sliderStyles.headlineClass;
  const primaryBtnClass = sliderStyles.primaryBtnClass;
  const dotActiveClass = sliderStyles.dotActiveClass;
  const overlayStyle = sliderStyles.overlayStyle;

  return (
    <div className="relative w-full h-[560px] sm:h-[600px] lg:h-[640px] bg-slate-950 text-white overflow-hidden select-none flex items-center">
      {/* Background Image Slides */}
      {slides.map((s, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          {s.imageUrl && (
            <img
              src={s.imageUrl}
              alt={s.headline || 'Promotional Banner Slide'}
              className="w-full h-full object-cover opacity-90 sm:opacity-95 transition-transform duration-1000 ease-out transform scale-105"
            />
          )}
          <div className="absolute inset-0 pointer-events-none" style={overlayStyle} />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(to top, rgba(2, 6, 23, 0.75) 0%, transparent 60%, rgba(2, 6, 23, 0.35) 100%)' }}
          />
        </div>
      ))}

      {/* Main Slide Grid Container */}
      <div className="relative max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-16 py-10 lg:py-16 w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Headline, Badge & CTAs */}
          <div key={current} className="lg:col-span-8 space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {slide.badge && (
              <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border shadow-sm backdrop-blur-md ${badgeClass}`}>
                <BadgeIcon className={`w-3.5 h-3.5 ${badgeIconClass}`} />
                <span>{slide.badge}</span>
              </div>
            )}

            <h2
              className={`text-2xl sm:text-4xl lg:text-5xl leading-tight drop-shadow-md line-clamp-2 ${headlineClass}`}
              style={{ textShadow: '0 3px 12px rgba(0,0,0,0.85)' }}
            >
              {slide.headline}
            </h2>

            {slide.caption && (
              <p
                className={`text-base sm:text-lg text-slate-200 leading-relaxed max-w-2xl font-normal drop-shadow-sm line-clamp-2 ${isArtsAndScience || isUniversity ? 'font-serif' : ''}`}
                style={{ textShadow: '0 1px 6px rgba(0,0,0,0.7)' }}
              >
                {slide.caption}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4 pt-2">
              {slide.buttonText && (
                <Link
                  to={slide.buttonUrl || '/admissions'}
                  className={`inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-extrabold shadow-xl transition transform hover:-translate-y-0.5 ${primaryBtnClass}`}
                >
                  <span>{slide.buttonText}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}

              {slide.secondaryButtonText ? (
                <Link
                  to={slide.secondaryButtonUrl || '/contact'}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-white/10 hover:bg-white/20 border border-white/20 transition backdrop-blur-md"
                >
                  <span>{slide.secondaryButtonText}</span>
                </Link>
              ) : isMedical ? (
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-rose-600 hover:bg-rose-500 border border-rose-500/40 shadow-xl transition"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>24/7 Emergency Casualty</span>
                </Link>
              ) : isArtsAndScience ? (
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-serif text-sm font-semibold text-emerald-200 bg-emerald-900/40 hover:bg-emerald-900/60 border border-emerald-500/30 transition backdrop-blur-md"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Heritage Library & Archives</span>
                </Link>
              ) : isUniversity ? (
                <Link
                  to="/courses"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-serif text-sm font-semibold text-amber-200 bg-rose-900/40 hover:bg-rose-900/60 border border-amber-400/30 transition backdrop-blur-md"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Research & Multi-Faculty</span>
                </Link>
              ) : (
                <Link
                  to="/courses"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-white/10 hover:bg-white/20 border border-white/20 transition backdrop-blur-md"
                >
                  <span>Explore Programs</span>
                </Link>
              )}
            </div>
          </div>

          {/* Right Column: Template-Specific Highlight Cards */}
          <div className="hidden lg:block lg:col-span-4">
            <div className={`p-6 rounded-3xl backdrop-blur-xl border shadow-2xl space-y-4 ${
              isArtsAndScience
                ? 'bg-slate-950/80 border-emerald-500/30 text-emerald-100'
                : isMedical
                ? 'bg-slate-950/80 border-cyan-500/30 text-cyan-100'
                : isUniversity
                ? 'bg-slate-950/90 border-amber-500/40 text-amber-100'
                : 'bg-slate-900/80 border-white/20 text-white'
            }`}>
              <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                  isArtsAndScience
                    ? 'bg-emerald-500/20 border-emerald-400/30 text-emerald-300'
                    : isMedical
                    ? 'bg-cyan-500/20 border-cyan-400/30 text-cyan-300'
                    : isUniversity
                    ? 'bg-rose-800/40 border-amber-400/40 text-amber-300'
                    : 'bg-amber-400/20 border-amber-400/30 text-amber-300'
                }`}>
                  <BadgeIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className={`text-sm font-extrabold text-white ${isArtsAndScience || isUniversity ? 'font-serif' : ''}`}>
                    {isArtsAndScience ? 'Heritage & Academic Record' : isMedical ? 'Clinical Excellence Wing' : isUniversity ? 'Multi-Faculty Gateway' : 'Placement & Innovation'}
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    {isArtsAndScience ? 'UGC Autonomous Institute' : isMedical ? 'NMC & NABH Accredited' : isUniversity ? 'Central Research Campus' : 'Top MNC Recruiter Network'}
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">{isArtsAndScience ? 'Distinguished Scholars' : isMedical ? '1,200-Bed Teaching Hospital' : isUniversity ? 'Global University Partners' : '150+ Top Recruiter MNCs'}</span>
                    <span className="text-[11px] text-slate-300 leading-snug">
                      {isArtsAndScience ? 'Distinguished faculty mentors & civil services coaching.' : isMedical ? 'Full clinical rotations under senior consultants.' : isUniversity ? 'Interdisciplinary research & dual degree options.' : 'High package campus offers with top tech leaders.'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Navigation Arrows */}
      {(content.showArrows !== false) && slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            aria-label="Previous slide"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 hover:bg-black/70 border border-white/20 flex items-center justify-center text-white backdrop-blur-sm transition"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            aria-label="Next slide"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 hover:bg-black/70 border border-white/20 flex items-center justify-center text-white backdrop-blur-sm transition"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Slide Dots */}
      {(content.showDots !== false) && slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                idx === current ? dotActiveClass : 'w-2.5 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
