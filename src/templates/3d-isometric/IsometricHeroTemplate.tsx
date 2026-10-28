import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronsLeft, ChevronsRight, Box, Compass, Award, Layers } from 'lucide-react';
import { HeroTemplateProps } from '../contracts/HeroTypes';
import { IsometricPushButton } from './components/IsometricPushButton';
import { IsometricCard } from './components/IsometricCard';

export const IsometricHeroTemplate: React.FC<HeroTemplateProps> = ({
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
    <div className="w-full flex flex-col bg-slate-100 text-slate-900">
      {/* 1. MAIN HERO BANNER WITH TACTILE ISOMETRIC OVERLAYS */}
      <div className="relative w-full h-[500px] sm:h-[560px] lg:h-[620px] bg-slate-900 text-white overflow-hidden select-none flex items-center border-b-4 border-slate-900">
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
                backgroundImage: 'linear-gradient(to right, rgba(15,23,42,0.95) 0%, rgba(15,23,42,0.75) 50%, rgba(15,23,42,0.85) 100%)',
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
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg bg-amber-400 border-2 border-slate-900 text-slate-950 text-xs font-mono font-black uppercase tracking-wider shadow-[3px_3px_0px_0px_#0f172a]">
                  <Box className="w-4 h-4" />
                  <span>{slide.badge}</span>
                </div>
              )}

              <h1
                className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-white leading-tight drop-shadow-xl"
              >
                {slide.headline || 'Inspiring Next Generation Leaders'}
              </h1>

              {slide.caption && (
                <p className="text-sm sm:text-base lg:text-lg text-slate-200 leading-relaxed max-w-2xl font-medium">
                  {slide.caption}
                </p>
              )}

              {/* Isometric Push CTA Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link to={slide.buttonUrl || '/admissions'}>
                  <IsometricPushButton variant="amber" size="lg" showArrow={true}>
                    {slide.buttonText || 'Enroll Today'}
                  </IsometricPushButton>
                </Link>

                <Link to="/courses">
                  <IsometricPushButton variant="white" size="lg">
                    View Academic Catalog
                  </IsometricPushButton>
                </Link>
              </div>
            </div>

            {/* Right Quick Info Card */}
            {showRightCard && (
              <div className="lg:col-span-4 hidden lg:block">
                <div className="p-6 rounded-2xl bg-white border-3 border-slate-900 text-slate-900 shadow-[8px_8px_0px_0px_#0f172a]">
                  <div className="flex items-center gap-2.5 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-400 border-2 border-slate-900 flex items-center justify-center text-slate-950 shadow-[2px_2px_0px_0px_#0f172a]">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-slate-900">{cardTitle || 'Campus Information'}</h3>
                      {cardSubtitle && <p className="text-xs text-amber-700 font-mono font-bold">{cardSubtitle}</p>}
                    </div>
                  </div>

                  {cardItems && cardItems.length > 0 && (
                    <ul className="space-y-2.5 mb-5 text-xs text-slate-700 font-bold">
                      {cardItems.map((item: any, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-amber-500 font-black mt-0.5">■</span>
                          <span className="leading-snug">{typeof item === 'string' ? item : (item.title || item.text || '')}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {cardPrimaryButtonText && (
                    <Link to={cardPrimaryButtonUrl || '/contact'} className="block">
                      <IsometricPushButton variant="amber" size="sm" className="w-full">
                        {cardPrimaryButtonText}
                      </IsometricPushButton>
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
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-xl bg-white hover:bg-amber-400 border-2 border-slate-900 text-slate-900 shadow-[3px_3px_0px_0px_#0f172a] active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#0f172a] flex items-center justify-center transition cursor-pointer font-black"
            >
              <ChevronsLeft className="w-5 h-5" />
            </button>
            <button
              onClick={onNextSlide}
              aria-label="Next Slide"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-xl bg-white hover:bg-amber-400 border-2 border-slate-900 text-slate-900 shadow-[3px_3px_0px_0px_#0f172a] active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#0f172a] flex items-center justify-center transition cursor-pointer font-black"
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
                className={`h-3 rounded-full transition-all duration-200 cursor-pointer ${
                  idx === currentSlide
                    ? 'w-8 bg-amber-400 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]'
                    : 'w-3 bg-white/40 hover:bg-white border border-slate-900'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* 2. THREE-PILLAR ISOMETRIC 3D CARDS */}
      <section className="relative z-10 max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-16 -mt-10 sm:-mt-14 mb-14 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <IsometricCard
            accentColor="amber"
            icon={<Box className="w-6 h-6" />}
            title="Degree Programs"
            description="Robust professional, undergraduate, and graduate programs designed for practical career dominance."
            linkText="View Courses"
            linkUrl="/courses"
          />
          <IsometricCard
            accentColor="blue"
            icon={<Layers className="w-6 h-6" />}
            title="Campus Admissions"
            description="Transparent, direct application pipelines with merit considerations and scholarship offerings."
            linkText="Admissions Portal"
            linkUrl="/admissions"
          />
          <IsometricCard
            accentColor="emerald"
            icon={<Compass className="w-6 h-6" />}
            title="Recruiters & Alumni"
            description="Comprehensive training, high-tier placement records, and lifetime professional alumni connections."
            linkText="Explore Careers"
            linkUrl="/placements"
          />
        </div>
      </section>
    </div>
  );
};
