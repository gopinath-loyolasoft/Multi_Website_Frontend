import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight, GraduationCap, Compass, BookMarked, CheckCircle2, Globe2, Sparkles } from 'lucide-react';
import { HeroTemplateProps } from '../contracts/HeroTypes';

export const UniversityHeroTemplate: React.FC<HeroTemplateProps> = ({
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
    <div className="relative w-full h-[450px] sm:h-[500px] lg:h-[540px] bg-stone-950 text-white overflow-hidden select-none flex items-center font-serif">
      {/* Background Image Slides with Crimson & Deep Blue Gradient */}
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
              alt={s.headline || 'University Slide'}
              className="w-full h-full object-cover object-center opacity-100 transition-opacity duration-700"
            />
          )}
          {/* Clean Neutral Dark Vignette Overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.10) 100%)',
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 40%, rgba(0,0,0,0.20) 100%)',
            }}
          />
        </div>
      ))}

      {/* Main Container */}
      <div className="relative max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-16 py-7 lg:py-10 w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          
          {/* Left Column: Collegiate Research Headline & CTAs */}
          <div className={`${showRightCard ? 'lg:col-span-7 xl:col-span-8' : 'lg:col-span-12 max-w-4xl'} space-y-3.5 animate-in fade-in slide-in-from-bottom-3 duration-500`}>
            
            {/* University Senate Badge */}
            {slide.badge && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[11px] tracking-widest bg-stone-900/90 border border-amber-400/50 text-amber-300 shadow-md shadow-black/40">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>{slide.badge}</span>
              </div>
            )}

            {/* Noble Academic Headline */}
            <h1
              className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight text-white leading-tight drop-shadow-xl line-clamp-2"
              style={{ textShadow: '0 4px 16px rgba(0,0,0,0.9)' }}
            >
              {slide.headline || 'Welcome to our Campus'}
            </h1>

            {/* University Mission Caption */}
            {slide.caption && (
              <p
                className="text-xs sm:text-sm lg:text-base text-stone-200 leading-relaxed max-w-2xl font-normal drop-shadow-md line-clamp-2 font-sans"
                style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}
              >
                {slide.caption}
              </p>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              {slide.buttonText && (
                <Link
                  to={slide.buttonUrl || '/courses'}
                  className="inline-flex items-center gap-2 px-6 py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm tracking-wide bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-lg shadow-amber-950/40 transition transform hover:-translate-y-0.5"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>{slide.buttonText}</span>
                </Link>
              )}

              {slide.secondaryButtonText ? (
                <Link
                  to={slide.secondaryButtonUrl || '/about'}
                  className="inline-flex items-center gap-2 px-5 py-2.5 sm:py-3 rounded-xl font-medium text-xs sm:text-sm text-amber-200 bg-stone-900/90 hover:bg-stone-800 border border-amber-400/40 hover:border-amber-400/70 transition shadow-md"
                >
                  <Compass className="w-4 h-4 text-amber-300" />
                  <span>{slide.secondaryButtonText}</span>
                </Link>
              ) : (
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 px-5 py-2.5 sm:py-3 rounded-xl font-medium text-xs sm:text-sm text-slate-200 bg-stone-900/80 hover:bg-stone-800 border border-white/20 transition"
                >
                  <span>Faculties & Research</span>
                </Link>
              )}
            </div>

            {/* University Pillars */}
            {pillars && pillars.length > 0 && (
              <div className="pt-2.5 grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs text-stone-300 border-t border-stone-800 max-w-2xl font-sans">
                {pillars.map((pillar, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-amber-400" />
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
                        ? 'w-8 bg-amber-400 shadow-md shadow-amber-400/50'
                        : 'w-2.5 bg-stone-700/80 hover:bg-stone-600'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Collegiate Research Hub Panel */}
          {showRightCard && cardItems && cardItems.length > 0 && (
            <div className="hidden lg:block lg:col-span-5 xl:col-span-4">
              <div className="bg-stone-950/95 border border-amber-400/40 rounded-3xl p-6 sm:p-7 shadow-2xl shadow-black/80 space-y-5 text-white">
                
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-inner">
                      <Globe2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-white leading-tight">
                        {cardTitle || 'Multi-Faculty Gateway'}
                      </h3>
                      <p className="text-[11px] text-amber-300/80 italic font-sans">
                        {cardSubtitle || 'Central Research Campus'}
                      </p>
                    </div>
                  </div>

                  {cardBadge && (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-amber-500/20 text-amber-300 border border-amber-500/40 font-sans">
                      {cardBadge}
                    </span>
                  )}
                </div>

                {/* Collegiate Items */}
                <div className="space-y-3.5 text-xs font-sans">
                  {cardItems.map((item, idx) => {
                    const IconComp = idx === 0 ? GraduationCap : idx === 1 ? BookMarked : Globe2;
                    return (
                      <div key={idx} className="flex items-start gap-3 p-2.5 rounded-xl bg-stone-900/60 border border-stone-800 hover:border-amber-400/40 transition">
                        <IconComp className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                        <div>
                          <p className="font-bold text-white text-xs">{item.title}</p>
                          {item.desc && <p className="text-[11px] text-stone-300 mt-0.5 leading-snug">{item.desc}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Card Action Buttons */}
                {(cardPrimaryButtonText || cardSecondaryButtonText) && (
                  <div className="pt-2 flex flex-col gap-2 font-sans">
                    {cardPrimaryButtonText && (
                      <Link
                        to={cardPrimaryButtonUrl || '/admissions'}
                        className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 transition shadow-md shadow-amber-950/40"
                      >
                        <span>{cardPrimaryButtonText}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                    {cardSecondaryButtonText && (
                      <Link
                        to={cardSecondaryButtonUrl || '/courses'}
                        className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-medium text-xs text-amber-200 hover:text-white bg-stone-900 hover:bg-stone-800 border border-stone-700 transition"
                      >
                        <GraduationCap className="w-3.5 h-3.5 text-amber-300" />
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

      {/* Chevrons */}
      {showArrows && totalSlides > 1 && (
        <>
          <button
            onClick={onPrevSlide}
            aria-label="Previous slide"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-xl bg-stone-900/90 hover:bg-stone-800 border border-amber-400/40 hover:border-amber-400 flex items-center justify-center text-white transition shadow-lg cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5 text-amber-300" />
          </button>
          <button
            onClick={onNextSlide}
            aria-label="Next slide"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-xl bg-stone-900/90 hover:bg-stone-800 border border-amber-400/40 hover:border-amber-400 flex items-center justify-center text-white transition shadow-lg cursor-pointer"
          >
            <ChevronRight className="w-5 h-5 text-amber-300" />
          </button>
        </>
      )}
    </div>
  );
};
