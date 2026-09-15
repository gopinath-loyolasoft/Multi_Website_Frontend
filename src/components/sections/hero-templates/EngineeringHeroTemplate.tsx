import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight, Award, Building2, Cpu, CheckCircle2, Download, Play, ShieldCheck } from 'lucide-react';
import { HeroTemplateProps } from './heroTypes';

export const EngineeringHeroTemplate: React.FC<HeroTemplateProps> = ({
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
      {/* Background Image Slides with Tech Cyber Gradient */}
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
              alt={s.headline || 'Engineering Banner Slide'}
              className="w-full h-full object-cover object-center opacity-100 transition-opacity duration-700"
            />
          )}
          {/* Subtle Contrast Overlay for Crisp Image & Readable Text */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: 'linear-gradient(to right, rgba(2,6,23,0.80) 0%, rgba(2,6,23,0.40) 50%, rgba(2,6,23,0.15) 100%)',
            }}
          />
          {/* Soft Top & Bottom Edge Vignette */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(to top, rgba(2, 6, 23, 0.45) 0%, transparent 35%, rgba(2, 6, 23, 0.25) 100%)',
            }}
          />
        </div>
      ))}

      {/* Main Container */}
      <div className="relative max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-16 py-8 lg:py-12 w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Tech Headline, Telemetry Badges & CTAs */}
          <div className={`${showRightCard ? 'lg:col-span-7 xl:col-span-8' : 'lg:col-span-12 max-w-4xl'} space-y-5 animate-in fade-in slide-in-from-bottom-3 duration-500`}>
            
            {/* Active Telemetry Pill Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-900/90 border border-amber-400/40 text-amber-300 backdrop-blur-md shadow-lg shadow-amber-500/10">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
              <span>{slide.badge || 'ADMISSIONS 2026-27 ACTIVE • NBA TIER-1 ACCREDITED'}</span>
            </div>

            {/* Industrial Uppercase Tech Headline */}
            <h1
              className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-none drop-shadow-xl line-clamp-2"
              style={{ textShadow: '0 4px 16px rgba(0,0,0,0.9)' }}
            >
              {slide.headline || 'Innovation & Future Engineering'}
            </h1>

            {/* Tech Subtitle / Description */}
            {slide.caption && (
              <p
                className="text-sm sm:text-base lg:text-lg text-slate-200 leading-relaxed max-w-2xl font-normal drop-shadow-md line-clamp-2"
                style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}
              >
                {slide.caption}
              </p>
            )}

            {/* Tech Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              {slide.buttonText && (
                <Link
                  to={slide.buttonUrl || '/courses'}
                  className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl font-black text-sm uppercase tracking-wide bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-xl shadow-amber-500/25 transition transform hover:-translate-y-0.5"
                >
                  <span>{slide.buttonText}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}

              {slide.secondaryButtonText ? (
                <Link
                  to={slide.secondaryButtonUrl || '/about'}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-slate-900/80 hover:bg-slate-800 border border-cyan-400/30 hover:border-cyan-400/60 transition backdrop-blur-md shadow-lg"
                >
                  <Play className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
                  <span>{slide.secondaryButtonText}</span>
                </Link>
              ) : (
                <Link
                  to="/courses"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-slate-200 bg-white/10 hover:bg-white/20 border border-white/20 transition backdrop-blur-md"
                >
                  <span>Explore Programs</span>
                </Link>
              )}
            </div>

            {/* Quick Tech Checkmark Pillars */}
            {pillars && pillars.length > 0 && (
              <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-slate-300 border-t border-slate-800/80 max-w-2xl">
                {pillars.map((pillar, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-amber-400" />
                    <span className="font-semibold text-slate-200">{pillar}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Tech Dot Slider Controls */}
            {totalSlides > 1 && (
              <div className="pt-4 flex items-center gap-2">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => onSelectSlide(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                      i === currentSlide
                        ? 'w-8 bg-amber-400 shadow-md shadow-amber-400/50'
                        : 'w-2.5 bg-slate-700/80 hover:bg-slate-500'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Floating Dark Glass HUD Panel */}
          {showRightCard && (
            <div className="hidden lg:block lg:col-span-5 xl:col-span-4">
              <div className="bg-slate-900/90 backdrop-blur-xl border border-amber-400/30 rounded-3xl p-6 sm:p-7 shadow-2xl shadow-slate-950/80 space-y-5 text-white">
                
                {/* HUD Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-400/15 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-inner">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black uppercase tracking-wide text-white leading-tight">
                        {cardTitle || 'Campus Highlights'}
                      </h3>
                      <p className="text-[11px] text-amber-300/90 font-mono">
                        {cardSubtitle || 'Engineering & Tech'}
                      </p>
                    </div>
                  </div>

                  {cardBadge && (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      {cardBadge}
                    </span>
                  )}
                </div>

                {/* Tech Bullet Items */}
                <div className="space-y-3.5 text-xs">
                  {cardItems.map((item, idx) => {
                    const IconComp = idx === 0 ? Award : idx === 1 ? Building2 : ShieldCheck;
                    return (
                      <div key={idx} className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-amber-400/30 transition">
                        <IconComp className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                        <div>
                          <p className="font-extrabold text-white text-xs">{item.title}</p>
                          {item.desc && <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">{item.desc}</p>}
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
                        className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-black text-xs uppercase tracking-wider bg-amber-400 hover:bg-amber-300 text-slate-950 transition shadow-md shadow-amber-500/20"
                      >
                        <span>{cardPrimaryButtonText}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                    {cardSecondaryButtonText && (
                      <Link
                        to={cardSecondaryButtonUrl || '/courses'}
                        className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-xs text-slate-200 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700 transition"
                      >
                        <Download className="w-3.5 h-3.5 text-amber-300" />
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

      {/* Futuristic Angular Chevrons */}
      {showArrows && totalSlides > 1 && (
        <>
          <button
            onClick={onPrevSlide}
            aria-label="Previous slide"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-xl bg-slate-950/70 hover:bg-slate-900 border border-amber-400/30 hover:border-amber-400 flex items-center justify-center text-white backdrop-blur-md transition shadow-lg"
          >
            <ChevronLeft className="w-5 h-5 text-amber-300" />
          </button>
          <button
            onClick={onNextSlide}
            aria-label="Next slide"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-xl bg-slate-950/70 hover:bg-slate-900 border border-amber-400/30 hover:border-amber-400 flex items-center justify-center text-white backdrop-blur-md transition shadow-lg"
          >
            <ChevronRight className="w-5 h-5 text-amber-300" />
          </button>
        </>
      )}
    </div>
  );
};
