import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ChevronsRight, ArrowRight, Activity, HeartPulse, Stethoscope, CheckCircle2, Hospital, Sparkles } from 'lucide-react';
import { HeroTemplateProps } from '../contracts/HeroTypes';

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
    <div className="relative w-full h-[450px] sm:h-[500px] lg:h-[540px] bg-slate-950 text-white overflow-hidden select-none flex items-center">
      {/* Background Image Slides with Teal & Clinical Emerald Gradient */}
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
              alt={s.headline || 'Medical Slide'}
              className="w-full h-full object-cover object-center opacity-100 transition-opacity duration-700"
            />
          )}
          {/* Clinical Contrast & Vignette Overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.10) 100%)',
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(to top, rgba(0, 0, 0, 0.45) 0%, transparent 35%, rgba(0, 0, 0, 0.20) 100%)',
            }}
          />
        </div>
      ))}

      {/* Main Container */}
      <div className="relative max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-16 py-7 lg:py-10 w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          
          {/* Left Column: Clinical Excellence Headline & CTAs */}
          <div className={`${showRightCard ? 'lg:col-span-7 xl:col-span-8' : 'lg:col-span-12 max-w-4xl'} space-y-3.5 animate-in fade-in slide-in-from-bottom-3 duration-500`}>
            
            {/* Clinical Trust Badge */}
            {slide.badge && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[11px] font-bold tracking-wide bg-slate-900/95 border border-teal-400/50 text-teal-300 shadow-md shadow-black/40">
                <HeartPulse className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                <span>{slide.badge}</span>
              </div>
            )}

            {/* Clean Bold Healthcare Headline */}
            <h1
              className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold tracking-tight text-white leading-tight drop-shadow-xl line-clamp-2"
              style={{ textShadow: '0 4px 16px rgba(0,0,0,0.9)' }}
            >
              {slide.headline || 'Welcome to our Campus'}
            </h1>

            {/* Compassionate Healthcare Subtitle */}
            {slide.caption && (
              <p
                className="text-xs sm:text-sm lg:text-base text-slate-200 leading-relaxed max-w-2xl font-normal drop-shadow-md line-clamp-2"
                style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}
              >
                {slide.caption}
              </p>
            )}

            {/* Template 3 Stylized Promotional Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              {slide.buttonText && (
                <Link
                  to={slide.buttonUrl || '/courses'}
                  className="group inline-flex items-stretch rounded-none shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 select-none overflow-visible"
                >
                  {/* Left Golden Yellow Block */}
                  <span className="flex items-center justify-center px-6 sm:px-8 py-3 sm:py-3.5 bg-[#F0A500] group-hover:bg-[#E59A00] text-slate-950 font-black text-xs sm:text-sm tracking-wide transition-colors">
                    {slide.buttonText}
                  </span>
                  {/* Right Slanted Black Parallelogram with Yellow Top-Right Accent */}
                  <span className="relative flex items-center justify-center px-4 sm:px-5 bg-black border-t-2 border-r-[3px] border-yellow-400 transform -skew-x-[20deg] origin-bottom transition-all duration-300 -ml-2">
                    <span className="transform skew-x-[20deg] flex items-center justify-center">
                      <ChevronsRight className="w-4 h-4 sm:w-5 sm:h-5 text-white transform group-hover:translate-x-1 transition-transform duration-200" />
                    </span>
                  </span>
                </Link>
              )}

              {slide.secondaryButtonText ? (
                <Link
                  to={slide.secondaryButtonUrl || '/about'}
                  className="group inline-flex items-stretch rounded-none shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 select-none overflow-visible"
                >
                  <span className="flex items-center justify-center px-5 sm:px-7 py-3 sm:py-3.5 bg-slate-900/90 group-hover:bg-slate-800 text-white font-bold text-xs sm:text-sm tracking-wide border-t border-b border-l border-slate-700 transition-colors">
                    {slide.secondaryButtonText}
                  </span>
                  <span className="relative flex items-center justify-center px-4 sm:px-5 bg-slate-950 border-t-2 border-r-[3px] border-teal-400 transform -skew-x-[20deg] origin-bottom transition-all duration-300 -ml-2">
                    <span className="transform skew-x-[20deg] flex items-center justify-center">
                      <ChevronsRight className="w-4 h-4 sm:w-5 sm:h-5 text-teal-300 transform group-hover:translate-x-1 transition-transform duration-200" />
                    </span>
                  </span>
                </Link>
              ) : (
                <Link
                  to="/about"
                  className="group inline-flex items-stretch rounded-none shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 select-none overflow-visible"
                >
                  <span className="flex items-center justify-center px-5 sm:px-7 py-3 sm:py-3.5 bg-slate-900/90 group-hover:bg-slate-800 text-white font-bold text-xs sm:text-sm tracking-wide border-t border-b border-l border-slate-700 transition-colors">
                    Hospital & Specialties
                  </span>
                  <span className="relative flex items-center justify-center px-4 sm:px-5 bg-slate-950 border-t-2 border-r-[3px] border-teal-400 transform -skew-x-[20deg] origin-bottom transition-all duration-300 -ml-2">
                    <span className="transform skew-x-[20deg] flex items-center justify-center">
                      <ChevronsRight className="w-4 h-4 sm:w-5 sm:h-5 text-teal-300 transform group-hover:translate-x-1 transition-transform duration-200" />
                    </span>
                  </span>
                </Link>
              )}
            </div>

            {/* Clinical Checkmarks */}
            {pillars && pillars.length > 0 && (
              <div className="pt-2.5 grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs text-slate-300 border-t border-slate-800 max-w-2xl">
                {pillars.map((pillar, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-teal-400" />
                    <span className="font-medium text-slate-200 text-[11px] sm:text-xs">{pillar}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Slider Dots */}
            {totalSlides > 1 && (
              <div className="pt-2 flex items-center gap-2">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => onSelectSlide(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                      i === currentSlide
                        ? 'w-8 bg-teal-400 shadow-md shadow-teal-400/50'
                        : 'w-2.5 bg-slate-700/80 hover:bg-slate-500'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Hospital Telemetry Panel */}
          {showRightCard && cardItems && cardItems.length > 0 && (
            <div className="hidden lg:block lg:col-span-5 xl:col-span-4">
              <div className="bg-slate-950/95 border border-teal-400/40 rounded-3xl p-6 sm:p-7 shadow-2xl shadow-black/80 space-y-5 text-white">
                
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-400/15 border border-teal-400/40 flex items-center justify-center text-teal-300 shadow-inner">
                      <Stethoscope className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-white leading-tight">
                        {cardTitle || 'Clinical Excellence Wing'}
                      </h3>
                      <p className="text-[11px] text-teal-300/90 font-mono">
                        {cardSubtitle || 'Teaching Hospital'}
                      </p>
                    </div>
                  </div>

                  {cardBadge && (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/40">
                      {cardBadge}
                    </span>
                  )}
                </div>

                {/* Clinical Items */}
                <div className="space-y-3.5 text-xs">
                  {cardItems.map((item, idx) => {
                    const IconComp = idx === 0 ? Hospital : idx === 1 ? Sparkles : Stethoscope;
                    return (
                      <div key={idx} className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-teal-400/30 transition">
                        <IconComp className="w-4 h-4 shrink-0 mt-0.5 text-teal-400" />
                        <div>
                          <p className="font-bold text-white text-xs">{item.title}</p>
                          {item.desc && <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">{item.desc}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Card Action Buttons */}
                {(cardPrimaryButtonText || cardSecondaryButtonText) && (
                  <div className="pt-2 flex flex-col gap-2.5">
                    {cardPrimaryButtonText && (
                      <Link
                        to={cardPrimaryButtonUrl || '/admissions'}
                        className="group w-full inline-flex items-stretch rounded-none shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 overflow-visible"
                      >
                        <span className="flex-1 flex items-center justify-center py-2.5 px-4 bg-[#F0A500] group-hover:bg-[#E59A00] text-slate-950 font-black text-xs uppercase tracking-wider transition-colors">
                          {cardPrimaryButtonText}
                        </span>
                        <span className="relative flex items-center justify-center px-4 bg-black border-t-2 border-r-[3px] border-yellow-400 transform -skew-x-[20deg] origin-bottom -ml-2">
                          <span className="transform skew-x-[20deg] flex items-center justify-center">
                            <ChevronsRight className="w-3.5 h-3.5 text-white group-hover:translate-x-1 transition-transform" />
                          </span>
                        </span>
                      </Link>
                    )}
                    {cardSecondaryButtonText && (
                      <Link
                        to={cardSecondaryButtonUrl || '/courses'}
                        className="group w-full inline-flex items-stretch rounded-none shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 overflow-visible"
                      >
                        <span className="flex-1 flex items-center justify-center py-2 px-4 bg-slate-900/90 group-hover:bg-slate-800 text-slate-200 font-bold text-xs uppercase tracking-wider border-t border-b border-l border-slate-700 transition-colors">
                          {cardSecondaryButtonText}
                        </span>
                        <span className="relative flex items-center justify-center px-4 bg-slate-950 border-t-2 border-r-[3px] border-teal-400 transform -skew-x-[20deg] origin-bottom -ml-2">
                          <span className="transform skew-x-[20deg] flex items-center justify-center">
                            <ChevronsRight className="w-3.5 h-3.5 text-teal-300 group-hover:translate-x-1 transition-transform" />
                          </span>
                        </span>
                      </Link>
                    )}
                  </div>
                )}

              </div>
            </div>
          )}

        </div>
      </div>

      {/* Clinical Chevrons */}
      {showArrows && totalSlides > 1 && (
        <>
          <button
            onClick={onPrevSlide}
            aria-label="Previous slide"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-teal-400/30 hover:border-teal-400 flex items-center justify-center text-white transition shadow-lg cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5 text-teal-300" />
          </button>
          <button
            onClick={onNextSlide}
            aria-label="Next slide"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-teal-400/30 hover:border-teal-400 flex items-center justify-center text-white transition shadow-lg cursor-pointer"
          >
            <ChevronRight className="w-5 h-5 text-teal-300" />
          </button>
        </>
      )}
    </div>
  );
};
