import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight, BookOpen, Landmark, Award, GraduationCap, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { HeroTemplateProps } from './heroTypes';


export const ArtsScienceHeroTemplate: React.FC<HeroTemplateProps> = ({
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
    <div className="relative w-full min-h-[600px] sm:min-h-[640px] lg:min-h-[680px] bg-slate-950 text-white overflow-hidden select-none flex flex-col justify-between">
      {/* Background Image Slides with Warm Classical Heritage Vignette */}
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
              alt={s.headline || 'Heritage Banner Slide'}
              className="w-full h-full object-cover object-center opacity-85 transition-transform duration-1000 ease-out transform scale-105"
            />
          )}
          {/* Classical Royal Green & Gold Overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(ellipse at center, rgba(6,78,59,0.30) 0%, rgba(2,6,23,0.92) 85%)',
            }}
          />
          {/* Subtle Top & Bottom Archival Vignette */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(to top, rgba(2, 6, 23, 0.95) 0%, transparent 60%, rgba(2, 6, 23, 0.50) 100%)',
            }}
          />
        </div>
      ))}

      {/* Main Centered Symmetrical Hero Content */}
      <div className="relative max-w-5xl mx-auto px-6 sm:px-10 py-12 lg:py-16 text-center z-10 my-auto space-y-6 animate-in fade-in zoom-in-95 duration-700">
        
        {/* Regal Heraldic Badge */}
        <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full text-xs font-serif font-bold uppercase tracking-widest bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 backdrop-blur-md shadow-xl">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>{slide.badge || '⚜️ UGC AUTONOMOUS • HERITAGE INSTITUTION • ESTD 1968 ⚜️'}</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
        </div>

        {/* Grand Classical Serif Headline */}
        <h1
          className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-emerald-50 tracking-normal drop-shadow-2xl leading-tight"
          style={{ textShadow: '0 4px 20px rgba(0,0,0,0.95)' }}
        >
          {slide.headline || 'Nurturing Wisdom, Science & Cultural Heritage'}
        </h1>

        {/* Poetic Serif Subtitle */}
        {slide.caption && (
          <p
            className="text-base sm:text-lg lg:text-xl font-serif text-slate-200/90 leading-relaxed max-w-3xl mx-auto font-normal drop-shadow-md"
            style={{ textShadow: '0 2px 10px rgba(0,0,0,0.85)' }}
          >
            {slide.caption}
          </p>
        )}

        {/* Regal Dual Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          {slide.buttonText && (
            <Link
              to={slide.buttonUrl || '/admissions'}
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl font-serif font-bold text-sm bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-400/40 shadow-xl shadow-emerald-950/60 transition transform hover:-translate-y-0.5"
            >
              <span>{slide.buttonText}</span>
              <ArrowRight className="w-4 h-4 text-emerald-200" />
            </Link>
          )}

          {slide.secondaryButtonText ? (
            <Link
              to={slide.secondaryButtonUrl || '/about'}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-serif font-semibold text-sm text-amber-200 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/40 transition backdrop-blur-md shadow-lg"
            >
              <BookOpen className="w-4 h-4 text-amber-300" />
              <span>{slide.secondaryButtonText}</span>
            </Link>
          ) : (
            <Link
              to="/about"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-serif font-semibold text-sm text-emerald-200 bg-emerald-900/40 hover:bg-emerald-900/60 border border-emerald-500/30 transition backdrop-blur-md"
            >
              <Landmark className="w-4 h-4 text-emerald-300" />
              <span>Heritage Library & Archives</span>
            </Link>
          )}
        </div>

        {/* Centered Dot Slider Pagination */}
        {totalSlides > 1 && (
          <div className="pt-3 flex items-center justify-center gap-3">
            <button
              onClick={onPrevSlide}
              aria-label="Previous Slide"
              className="p-1.5 rounded-full text-emerald-300/80 hover:text-emerald-100 hover:bg-emerald-900/40 transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            <div className="flex items-center gap-2">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => onSelectSlide(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === currentSlide
                      ? 'w-8 bg-emerald-400 shadow-md shadow-emerald-400/50'
                      : 'w-2.5 bg-emerald-900/60 border border-emerald-500/40 hover:bg-emerald-700/60'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={onNextSlide}
              aria-label="Next Slide"
              className="p-1.5 rounded-full text-emerald-300/80 hover:text-emerald-100 hover:bg-emerald-900/40 transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Bottom-Anchored 3-Column Parchment Ribbon (Campus Highlights Card) */}
      {showRightCard && (
        <div className="relative z-10 w-full bg-slate-950/90 border-t border-emerald-500/30 backdrop-blur-xl py-4 sm:py-5 px-6 sm:px-10 lg:px-16 shadow-2xl">
          <div className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 items-center divide-y md:divide-y-0 md:divide-x divide-emerald-500/20">
            {cardItems.slice(0, 3).map((item, idx) => {
              const IconComp = idx === 0 ? Landmark : idx === 1 ? BookOpen : GraduationCap;
              return (
                <div key={idx} className={`flex items-start gap-3.5 ${idx > 0 ? 'pt-4 md:pt-0 md:pl-6' : ''}`}>
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center text-emerald-300 shrink-0 mt-0.5">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-emerald-100 text-sm">{item.title}</h4>
                    {item.desc && (
                      <p className="text-slate-300 text-xs mt-0.5 leading-snug line-clamp-2">{item.desc}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Navigation Arrows */}
      {showArrows && totalSlides > 1 && (
        <>
          <button
            onClick={onPrevSlide}
            aria-label="Previous slide"
            className="hidden sm:flex absolute left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-slate-950/60 hover:bg-slate-900 border border-emerald-500/30 hover:border-emerald-400 items-center justify-center text-white backdrop-blur-md transition shadow-xl"
          >
            <ChevronLeft className="w-6 h-6 text-emerald-300" />
          </button>
          <button
            onClick={onNextSlide}
            aria-label="Next slide"
            className="hidden sm:flex absolute right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-slate-950/60 hover:bg-slate-900 border border-emerald-500/30 hover:border-emerald-400 items-center justify-center text-white backdrop-blur-md transition shadow-xl"
          >
            <ChevronRight className="w-6 h-6 text-emerald-300" />
          </button>
        </>
      )}
    </div>
  );
};
