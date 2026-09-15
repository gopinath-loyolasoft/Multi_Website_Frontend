import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight, HeartPulse, PhoneCall, Stethoscope, Activity, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { HeroTemplateProps } from './heroTypes';

export const MedicalHeroTemplate: React.FC<HeroTemplateProps> = ({
  slides,
  currentSlide,
  onSelectSlide,
  onPrevSlide,
  onNextSlide,
  showArrows = true,
  showDots = true,
  showRightCard,
  cardTitle,
  cardSubtitle,
  cardBadge,
  cardItems,
  cardPrimaryButtonText,
  cardPrimaryButtonUrl,
  cardSecondaryButtonText,
  cardSecondaryButtonUrl,
  pillars,
}) => {
  const slide = slides[currentSlide] || slides[0] || {};
  const totalSlides = slides.length;

  return (
    <div className="relative w-full h-[580px] sm:h-[620px] lg:h-[660px] bg-slate-950 text-white overflow-hidden select-none flex items-center">
      {/* Background Image Slides with Clinical Teal/Navy Gradient */}
      {slides.map((s, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          {s.imageUrl && (
            <img
              src={s.imageUrl}
              alt={s.headline || 'Medical Banner Slide'}
              className="w-full h-full object-cover object-center opacity-85 transition-transform duration-1000 ease-out transform scale-105"
            />
          )}
          {/* Clinical Cyan & Navy Overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: 'linear-gradient(to right, rgba(2,6,23,0.96) 0%, rgba(8,51,68,0.70) 55%, rgba(2,6,23,0.30) 100%)',
            }}
          />
          {/* Subtle ECG Heartbeat Pulse Grid Effect */}
          <div
            className="absolute inset-0 pointer-events-none opacity-10"
            style={{
              backgroundImage: 'linear-gradient(rgba(6, 182, 212, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.3) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />
          {/* Top & Bottom Vignette */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(to top, rgba(2, 6, 23, 0.85) 0%, transparent 50%, rgba(2, 6, 23, 0.40) 100%)',
            }}
          />
        </div>
      ))}

      {/* Main Slide Container */}
      <div className="relative max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-16 py-8 lg:py-12 w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Clinical Headline, Heartbeat Pulse Badges & Action CTAs */}
          <div className={`${showRightCard ? 'lg:col-span-7 xl:col-span-8' : 'lg:col-span-12 max-w-4xl'} space-y-5 animate-in fade-in slide-in-from-bottom-3 duration-500`}>
            
            {/* Live Medical Heartbeat Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-950/80 border border-cyan-400/40 text-cyan-200 backdrop-blur-md shadow-lg shadow-cyan-900/30">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500" />
              </span>
              <HeartPulse className="w-3.5 h-3.5 text-cyan-300" />
              <span>{slide.badge || 'NMC RECOGNIZED • 1,200-BED TEACHING HOSPITAL'}</span>
            </div>

            {/* Clean Medical Headline */}
            <h1
              className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight drop-shadow-xl line-clamp-2"
              style={{ textShadow: '0 4px 16px rgba(0,0,0,0.9)' }}
            >
              {slide.headline || 'Advancing Clinical Healthcare & Medicine'}
            </h1>

            {/* Clinical Description */}
            {slide.caption && (
              <p
                className="text-sm sm:text-base lg:text-lg text-cyan-100/90 leading-relaxed max-w-2xl font-normal drop-shadow-md line-clamp-2"
                style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}
              >
                {slide.caption}
              </p>
            )}

            {/* Clinical Action CTAs + Emergency Casualty Button */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              {slide.buttonText && (
                <Link
                  to={slide.buttonUrl || '/courses'}
                  className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl font-bold text-sm bg-cyan-600 hover:bg-cyan-500 text-white shadow-xl shadow-cyan-900/40 transition transform hover:-translate-y-0.5"
                >
                  <span>{slide.buttonText}</span>
                  <ArrowRight className="w-4 h-4 text-cyan-200" />
                </Link>
              )}

              {slide.secondaryButtonText ? (
                <Link
                  to={slide.secondaryButtonUrl || '/contact'}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-rose-600 hover:bg-rose-500 border border-rose-500/40 shadow-xl shadow-rose-950/50 transition"
                >
                  <PhoneCall className="w-4 h-4 animate-pulse" />
                  <span>{slide.secondaryButtonText}</span>
                </Link>
              ) : (
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-rose-600 hover:bg-rose-500 border border-rose-500/40 shadow-xl shadow-rose-950/50 transition"
                >
                  <PhoneCall className="w-4 h-4 animate-pulse" />
                  <span>24/7 Casualty Hotline: 044-24567890</span>
                </Link>
              )}
            </div>

            {/* Quick Medical Pillars */}
            {pillars && pillars.length > 0 && (
              <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-cyan-100/80 border-t border-cyan-900/50 max-w-2xl">
                {pillars.map((pillar, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-cyan-400" />
                    <span className="font-medium text-slate-200">{pillar}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Vital Signs / Heartbeat Pulse Navigation Slider */}
            {totalSlides > 1 && (
              <div className="pt-4 flex items-center gap-2">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => onSelectSlide(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                      i === currentSlide
                        ? 'w-8 bg-cyan-400 shadow-md shadow-cyan-400/50'
                        : 'w-2.5 bg-slate-700/80 hover:bg-slate-500'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Floating Clinical Station Desk */}
          {showRightCard && (
            <div className="hidden lg:block lg:col-span-5 xl:col-span-4">
              <div className="bg-slate-950/90 backdrop-blur-xl border border-cyan-500/30 rounded-3xl p-6 sm:p-7 shadow-2xl shadow-cyan-950/60 space-y-5 text-white">
                
                {/* Clinical Station Header */}
                <div className="flex items-center justify-between pb-3 border-b border-cyan-900/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center text-cyan-300 shadow-inner">
                      <Stethoscope className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-white leading-tight">
                        {cardTitle || 'Clinical Station Desk'}
                      </h3>
                      <p className="text-[11px] text-cyan-300/90 font-medium">
                        {cardSubtitle || 'Teaching Hospital'}
                      </p>
                    </div>
                  </div>

                  {cardBadge && (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse">
                      {cardBadge}
                    </span>
                  )}
                </div>

                {/* Clinical Bullet Items */}
                <div className="space-y-3 text-xs">
                  {cardItems.map((item, idx) => {
                    const IconComp = idx === 0 ? HeartPulse : idx === 1 ? Activity : ShieldCheck;
                    return (
                      <div key={idx} className="flex items-start gap-3 p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-900/50 hover:border-cyan-400/30 transition">
                        <IconComp className="w-4 h-4 shrink-0 mt-0.5 text-cyan-400" />
                        <div>
                          <p className="font-bold text-white text-xs">{item.title}</p>
                          {item.desc && <p className="text-[11px] text-cyan-100/80 mt-0.5 leading-snug">{item.desc}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Card Action Buttons */}
                {(cardPrimaryButtonText || cardSecondaryButtonText) && (
                  <div className="pt-2 flex flex-col gap-2">
                    {cardPrimaryButtonText && (
                      <Link
                        to={cardPrimaryButtonUrl || '/admissions'}
                        className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs bg-cyan-600 hover:bg-cyan-500 text-white transition shadow-md shadow-cyan-900/40"
                      >
                        <span>{cardPrimaryButtonText}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                    {cardSecondaryButtonText && (
                      <Link
                        to={cardSecondaryButtonUrl || '/contact'}
                        className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-xs text-cyan-200 hover:text-white bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/30 transition"
                      >
                        <span>{cardSecondaryButtonText}</span>
                      </Link>
                    )}
                  </div>
                )}

              </div>
            </div>
          )}

        </div>
      </div>

      {/* Navigation Chevrons */}
      {showArrows && totalSlides > 1 && (
        <>
          <button
            onClick={onPrevSlide}
            aria-label="Previous slide"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-slate-950/70 hover:bg-slate-900 border border-cyan-500/30 hover:border-cyan-400 flex items-center justify-center text-white backdrop-blur-md transition shadow-lg"
          >
            <ChevronLeft className="w-5 h-5 text-cyan-300" />
          </button>
          <button
            onClick={onNextSlide}
            aria-label="Next slide"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-slate-950/70 hover:bg-slate-900 border border-cyan-500/30 hover:border-cyan-400 flex items-center justify-center text-white backdrop-blur-md transition shadow-lg"
          >
            <ChevronRight className="w-5 h-5 text-cyan-300" />
          </button>
        </>
      )}
    </div>
  );
};
