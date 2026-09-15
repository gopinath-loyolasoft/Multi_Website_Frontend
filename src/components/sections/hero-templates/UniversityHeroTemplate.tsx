import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight, GraduationCap, Award, Landmark, Scale, Briefcase, Globe, CheckCircle2 } from 'lucide-react';
import { HeroTemplateProps } from './heroTypes';

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
    <div className="relative w-full h-[580px] sm:h-[620px] lg:h-[660px] bg-slate-950 text-white overflow-hidden select-none flex items-center">
      {/* Background Image Slides with Royal Crimson & Navy Atmosphere */}
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
              alt={s.headline || 'University Banner Slide'}
              className="w-full h-full object-cover object-center opacity-85 transition-transform duration-1000 ease-out transform scale-105"
            />
          )}
          {/* Monumental Royal Crimson & Navy Overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: 'linear-gradient(to right, rgba(2,6,23,0.96) 0%, rgba(136,19,55,0.45) 55%, rgba(15,23,42,0.30) 100%)',
            }}
          />
          {/* Subtle Archival Texture / Vignette */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(to top, rgba(2, 6, 23, 0.90) 0%, transparent 55%, rgba(2, 6, 23, 0.45) 100%)',
            }}
          />
        </div>
      ))}

      {/* Main Slide Container */}
      <div className="relative max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-16 py-8 lg:py-12 w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Grand Collegiate Arch Heading, Badges & Gilded CTAs */}
          <div className={`${showRightCard ? 'lg:col-span-8' : 'lg:col-span-12 max-w-4xl'} space-y-5 animate-in fade-in slide-in-from-bottom-3 duration-500`}>
            
            {/* University Crest Medal Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-xs font-serif font-bold uppercase tracking-wider bg-rose-950/80 border border-amber-400/40 text-amber-200 backdrop-blur-md shadow-xl shadow-rose-950/40">
              <GraduationCap className="w-4 h-4 text-amber-300" />
              <span>{slide.badge || '👑 CENTRAL RESEARCH UNIVERSITY • ESTD 1926'}</span>
            </div>

            {/* Monumental Serif Headline */}
            <h1
              className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-amber-50 tracking-normal leading-tight drop-shadow-2xl line-clamp-2"
              style={{ textShadow: '0 4px 18px rgba(0,0,0,0.95)' }}
            >
              {slide.headline || 'A Global Epicenter for Academic Excellence'}
            </h1>

            {/* Academic Description */}
            {slide.caption && (
              <p
                className="text-sm sm:text-base lg:text-lg font-serif text-slate-200 leading-relaxed max-w-2xl font-normal drop-shadow-md line-clamp-2"
                style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}
              >
                {slide.caption}
              </p>
            )}

            {/* Royal Gilded Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              {slide.buttonText && (
                <Link
                  to={slide.buttonUrl || '/courses'}
                  className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl font-serif font-bold text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 border border-amber-300/50 shadow-xl shadow-amber-950/50 transition transform hover:-translate-y-0.5"
                >
                  <span>{slide.buttonText}</span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </Link>
              )}

              {slide.secondaryButtonText ? (
                <Link
                  to={slide.secondaryButtonUrl || '/about'}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-serif font-semibold text-sm text-amber-200 bg-rose-950/60 hover:bg-rose-900/60 border border-amber-400/30 transition backdrop-blur-md shadow-lg"
                >
                  <Globe className="w-4 h-4 text-amber-300" />
                  <span>{slide.secondaryButtonText}</span>
                </Link>
              ) : (
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-serif font-semibold text-sm text-amber-200 bg-rose-950/60 hover:bg-rose-900/60 border border-amber-400/30 transition backdrop-blur-md shadow-lg"
                >
                  <Landmark className="w-4 h-4 text-amber-300" />
                  <span>Chancellor's Vision & Alliances</span>
                </Link>
              )}
            </div>

            {/* Quick University Pillars */}
            {pillars && pillars.length > 0 && (
              <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-serif text-amber-100/80 border-t border-rose-900/40 max-w-2xl">
                {pillars.map((pillar, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-amber-400" />
                    <span className="font-normal text-slate-200">{pillar}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Royal Gold Dot Slider Controls */}
            {totalSlides > 1 && (
              <div className="pt-4 flex items-center gap-2">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => onSelectSlide(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                      i === currentSlide
                        ? 'w-8 bg-amber-400 shadow-md shadow-amber-400/60'
                        : 'w-2.5 bg-slate-700/80 hover:bg-slate-500'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Multi-Faculty Gateway Drawer Card */}
          {showRightCard && (
            <div className="hidden lg:block lg:col-span-4">
              <div className="bg-slate-950/90 backdrop-blur-xl border border-amber-500/30 rounded-3xl p-6 sm:p-7 shadow-2xl shadow-rose-950/50 space-y-5 text-amber-100">
                
                {/* Gateway Header */}
                <div className="flex items-center justify-between pb-3 border-b border-rose-900/40">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-900/40 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-inner">
                      <Landmark className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-serif font-bold text-amber-50 leading-tight">
                        {cardTitle || 'Multi-Faculty Gateway'}
                      </h3>
                      <p className="text-[11px] text-amber-300/80 font-serif italic">
                        {cardSubtitle || 'Central Campus'}
                      </p>
                    </div>
                  </div>

                  {cardBadge && (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-serif font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {cardBadge}
                    </span>
                  )}
                </div>

                {/* Faculty Highlight Items */}
                <div className="space-y-3 text-xs">
                  {cardItems.map((item, idx) => {
                    const IconComp = idx === 0 ? Landmark : idx === 1 ? Scale : Briefcase;
                    return (
                      <div key={idx} className="flex items-start gap-3 p-2.5 rounded-xl bg-rose-950/30 border border-amber-500/20 hover:border-amber-400/40 transition">
                        <IconComp className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                        <div>
                          <p className="font-serif font-bold text-amber-100 text-xs">{item.title}</p>
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
                        className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-serif font-bold text-xs bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 transition shadow-md shadow-amber-950/40"
                      >
                        <span>{cardPrimaryButtonText}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
                      </Link>
                    )}
                    {cardSecondaryButtonText && (
                      <Link
                        to={cardSecondaryButtonUrl || '/courses'}
                        className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-serif font-semibold text-xs text-amber-200 hover:text-white bg-rose-950/60 hover:bg-rose-900/60 border border-amber-400/30 transition"
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

      {/* Royal Gilded Navigation Chevrons */}
      {showArrows && totalSlides > 1 && (
        <>
          <button
            onClick={onPrevSlide}
            aria-label="Previous slide"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-slate-950/70 hover:bg-slate-900 border border-amber-400/30 hover:border-amber-400 flex items-center justify-center text-white backdrop-blur-md transition shadow-lg"
          >
            <ChevronLeft className="w-5 h-5 text-amber-300" />
          </button>
          <button
            onClick={onNextSlide}
            aria-label="Next slide"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-slate-950/70 hover:bg-slate-900 border border-amber-400/30 hover:border-amber-400 flex items-center justify-center text-white backdrop-blur-md transition shadow-lg"
          >
            <ChevronRight className="w-5 h-5 text-amber-300" />
          </button>
        </>
      )}
    </div>
  );
};
