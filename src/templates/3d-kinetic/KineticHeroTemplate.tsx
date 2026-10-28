import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronsLeft, ChevronsRight, Zap, Compass, Award, Layers } from 'lucide-react';
import { HeroTemplateProps } from '../contracts/HeroTypes';
import { KineticRibbonButton } from './components/KineticRibbonButton';
import { KineticFlipCard } from './components/KineticFlipCard';

export const KineticHeroTemplate: React.FC<HeroTemplateProps> = ({
  slides,
  currentSlide,
  onSelectSlide,
  onPrevSlide,
  onNextSlide,
  showArrows = true,
  showRightCard,
  cardTitle,
  cardSubtitle,
  cardItems,
  cardPrimaryButtonText,
  cardPrimaryButtonUrl,
  pillars,
}) => {
  const slide = slides[currentSlide] || slides[0] || {};
  const totalSlides = slides.length;

  return (
    <div className="w-full flex flex-col bg-slate-900 text-white">
      {/* 1. MAIN HERO BANNER WITH 3D KINETIC PERSPECTIVE */}
      <div className="relative w-full h-[500px] sm:h-[560px] lg:h-[620px] overflow-hidden select-none flex items-center">
        {/* Background Image Slides */}
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
                alt={s.headline || 'College Banner'}
                className="w-full h-full object-cover object-center"
              />
            )}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(circle at 75% 30%, rgba(244,63,94,0.2) 0%, transparent 60%), linear-gradient(to right, rgba(15,23,42,0.95) 0%, rgba(88,28,135,0.7) 50%, rgba(15,23,42,0.95) 100%)',
              }}
            />
          </div>
        ))}

        {/* Hero Content Container */}
        <div className="relative max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-16 py-10 w-full z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-8 space-y-6">
              {slide.badge && (
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/20 border border-rose-500/50 text-rose-300 text-xs font-mono font-bold uppercase tracking-wider backdrop-blur-xl shadow-[0_0_20px_rgba(244,63,94,0.3)]">
                  <Zap className="w-3.5 h-3.5 text-rose-400" />
                  <span>{slide.badge}</span>
                </div>
              )}

              <h1
                className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-white leading-tight drop-shadow-2xl"
              >
                {slide.headline || 'Accelerating Global Innovation'}
              </h1>

              {slide.caption && (
                <p className="text-sm sm:text-base lg:text-lg text-slate-200 leading-relaxed max-w-2xl font-normal drop-shadow-md">
                  {slide.caption}
                </p>
              )}

              {/* Kinetic Ribbon CTA Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link to={slide.buttonUrl || '/admissions'}>
                  <KineticRibbonButton variant="rose" size="lg" showArrow={true}>
                    {slide.buttonText || 'Online Admissions'}
                  </KineticRibbonButton>
                </Link>

                <Link to="/courses">
                  <KineticRibbonButton variant="dark" size="lg">
                    Explore Departments
                  </KineticRibbonButton>
                </Link>
              </div>
            </div>

            {/* Right Quick Info Card */}
            {showRightCard && (
              <div className="lg:col-span-4 hidden lg:block">
                <div className="p-6 rounded-2xl bg-slate-900/80 hover:bg-slate-900/95 backdrop-blur-xl border border-rose-500/40 shadow-2xl transition-all duration-300">
                  <div className="flex items-center gap-2.5 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shadow-md">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-white">{cardTitle || 'Campus Briefing'}</h3>
                      {cardSubtitle && <p className="text-xs text-rose-400 font-mono">{cardSubtitle}</p>}
                    </div>
                  </div>

                  {cardItems && cardItems.length > 0 && (
                    <ul className="space-y-2.5 mb-5 text-xs text-slate-200">
                      {cardItems.map((item: any, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-rose-500 mt-0.5">✦</span>
                          <span className="leading-snug">{typeof item === 'string' ? item : (item.title || item.text || '')}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {cardPrimaryButtonText && (
                    <Link to={cardPrimaryButtonUrl || '/contact'} className="block">
                      <KineticRibbonButton variant="rose" size="sm" className="w-full">
                        {cardPrimaryButtonText}
                      </KineticRibbonButton>
                    </Link>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Carousel Navigation Arrows */}
        {showArrows && totalSlides > 1 && (
          <>
            <button
              onClick={onPrevSlide}
              aria-label="Previous Slide"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-2xl bg-slate-900/80 hover:bg-rose-600 border border-rose-500/40 text-white backdrop-blur-xl flex items-center justify-center shadow-lg transition duration-300 hover:scale-110 cursor-pointer"
            >
              <ChevronsLeft className="w-5 h-5" />
            </button>
            <button
              onClick={onNextSlide}
              aria-label="Next Slide"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-2xl bg-slate-900/80 hover:bg-rose-600 border border-rose-500/40 text-white backdrop-blur-xl flex items-center justify-center shadow-lg transition duration-300 hover:scale-110 cursor-pointer"
            >
              <ChevronsRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Dot Pagination */}
        {totalSlides > 1 && (
          <div className="absolute bottom-6 inset-x-0 z-20 flex items-center justify-center gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => onSelectSlide(idx)}
                aria-label={`Slide ${idx + 1}`}
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === currentSlide
                    ? 'w-8 bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.8)]'
                    : 'w-2.5 bg-white/30 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* 2. THREE-PILLAR 3D KINETIC FLIP CARDS */}
      <section className="relative z-10 max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-16 -mt-10 sm:-mt-14 mb-14 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <KineticFlipCard
            glowColor="rose"
            icon={<Zap className="w-6 h-6" />}
            title="Degree Programs"
            description="Innovative undergraduate and postgraduate disciplines with dynamic learning tracks."
            backTitle="Program Advantages"
            linkUrl="/courses"
          />
          <KineticFlipCard
            glowColor="indigo"
            icon={<Layers className="w-6 h-6" />}
            title="Admissions & Aid"
            description="Merit-driven entrance avenues, sports quotas, and progressive scholarship endowments."
            backTitle="Application Criteria"
            linkUrl="/admissions"
          />
          <KineticFlipCard
            glowColor="purple"
            icon={<Compass className="w-6 h-6" />}
            title="Career Placements"
            description="Global corporate tie-ups, incubator support, and dedicated career acceleration bootcamps."
            backTitle="Recruiter Metrics"
            linkUrl="/placements"
          />
        </div>
      </section>
    </div>
  );
};
