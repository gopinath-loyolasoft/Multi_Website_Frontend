import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight, BookOpen, GraduationCap, CheckCircle2, Scroll } from 'lucide-react';
import { HeroTemplateProps } from '../contracts/HeroTypes';

export const ArtsScienceHeroTemplate: React.FC<HeroTemplateProps> = ({
  slides,
  currentSlide,
  onSelectSlide,
  onPrevSlide,
  onNextSlide,
  showArrows = true,
  showDots = true,
  pillars,
}) => {
  const slide = slides[currentSlide] || slides[0] || {};
  const totalSlides = slides.length;

  return (
    <div className="relative w-full h-[450px] sm:h-[500px] lg:h-[540px] bg-stone-950 text-white overflow-hidden select-none flex items-center justify-center font-serif">
      {/* Background Image Slides with Clean Vignette */}
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
              alt={s.headline || 'Arts and Science Slide'}
              className="w-full h-full object-cover object-center opacity-100 transition-opacity duration-700"
            />
          )}
          {/* Classical Centered Radial Overlay & Dark Vignette */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: 'linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.45) 50%, rgba(0, 0, 0, 0.70) 100%)',
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at center, transparent 30%, rgba(0, 0, 0, 0.60) 100%)',
            }}
          />
        </div>
      ))}

      {/* Main Container - Centered Classical Layout */}
      <div className="relative max-w-5xl mx-auto px-6 sm:px-10 lg:px-16 py-7 lg:py-10 w-full z-10 text-center flex flex-col items-center justify-center space-y-4 animate-in fade-in zoom-in-95 duration-500">
        
        {/* Academic Heritage Crest Pill */}
        {slide.badge && (
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full text-[11px] tracking-widest bg-stone-900/90 border border-amber-400/60 text-amber-300 shadow-lg shadow-black/60">
            <Scroll className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-semibold uppercase">{slide.badge}</span>
          </div>
        )}

        {/* Serif Classical Centered Headline */}
        <h1
          className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight text-white leading-tight drop-shadow-2xl max-w-4xl"
          style={{ textShadow: '0 4px 20px rgba(0,0,0,0.95)' }}
        >
          {slide.headline || 'Nurturing Wisdom, Science & Cultural Heritage'}
        </h1>

        {/* Classical Caption / Subtitle */}
        {slide.caption && (
          <p
            className="text-xs sm:text-sm lg:text-base text-stone-200 leading-relaxed max-w-3xl font-light drop-shadow-lg mx-auto"
            style={{ textShadow: '0 2px 10px rgba(0,0,0,0.9)' }}
          >
            {slide.caption}
          </p>
        )}

        {/* Centered Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
          {slide.buttonText && (
            <Link
              to={slide.buttonUrl || '/courses'}
              className="inline-flex items-center gap-2 px-6 py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm tracking-wide bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 shadow-lg shadow-amber-950/50 transition transform hover:-translate-y-0.5 cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>{slide.buttonText}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}

          {slide.secondaryButtonText ? (
            <Link
              to={slide.secondaryButtonUrl || '/about'}
              className="inline-flex items-center gap-2 px-5 py-2.5 sm:py-3 rounded-xl font-medium text-xs sm:text-sm text-amber-200 bg-stone-900/90 hover:bg-stone-800 border border-amber-400/50 hover:border-amber-400/80 transition shadow-md cursor-pointer"
            >
              <GraduationCap className="w-4 h-4 text-amber-300" />
              <span>{slide.secondaryButtonText}</span>
            </Link>
          ) : (
            <Link
              to="/about"
              className="inline-flex items-center gap-2 px-5 py-2.5 sm:py-3 rounded-xl font-medium text-xs sm:text-sm text-amber-200 bg-stone-900/90 hover:bg-stone-800 border border-amber-400/50 hover:border-amber-400/80 transition shadow-md cursor-pointer"
            >
              <GraduationCap className="w-4 h-4 text-amber-300" />
              <span>Institution Heritage</span>
            </Link>
          )}
        </div>

        {/* Centered Academic Pillars */}
        {pillars && pillars.length > 0 && (
          <div className="pt-2.5 flex flex-wrap items-center justify-center gap-3 sm:gap-5 text-xs text-stone-200 border-t border-stone-800 max-w-3xl">
            {pillars.map((pillar, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                <span className="font-medium text-stone-100 text-[11px] sm:text-xs">{pillar}</span>
              </div>
            ))}
          </div>
        )}

        {/* Centered Slider Dots */}
        {totalSlides > 1 && (
          <div className="pt-2 flex items-center justify-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => onSelectSlide(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  i === currentSlide
                    ? 'w-8 bg-amber-400 shadow-md shadow-amber-400/50'
                    : 'w-2.5 bg-stone-700 hover:bg-stone-600'
                }`}
              />
            ))}
          </div>
        )}

      </div>

      {/* Classical Chevrons */}
      {showArrows && totalSlides > 1 && (
        <>
          <button
            onClick={onPrevSlide}
            aria-label="Previous slide"
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-xl bg-stone-900/90 hover:bg-stone-800 border border-amber-400/50 hover:border-amber-400 flex items-center justify-center text-white transition shadow-xl cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5 text-amber-300" />
          </button>
          <button
            onClick={onNextSlide}
            aria-label="Next slide"
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-xl bg-stone-900/90 hover:bg-stone-800 border border-amber-400/50 hover:border-amber-400 flex items-center justify-center text-white transition shadow-xl cursor-pointer"
          >
            <ChevronRight className="w-5 h-5 text-amber-300" />
          </button>
        </>
      )}
    </div>
  );
};
