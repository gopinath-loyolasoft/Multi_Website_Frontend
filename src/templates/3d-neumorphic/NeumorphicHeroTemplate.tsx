import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronsLeft, ChevronsRight, Shield, Compass, Award, Layers } from 'lucide-react';
import { HeroTemplateProps } from '../contracts/HeroTypes';
import { NeumorphicButton } from './components/NeumorphicButton';
import { NeumorphicCard } from './components/NeumorphicCard';

export const NeumorphicHeroTemplate: React.FC<HeroTemplateProps> = ({
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
    <div className="w-full flex flex-col bg-[#eef2f6] text-slate-800">
      {/* 1. MAIN HERO BANNER WITH SOFT 3D OVERLAYS */}
      <div className="relative w-full h-[500px] sm:h-[560px] lg:h-[620px] bg-slate-900 text-white overflow-hidden select-none flex items-center">
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
                backgroundImage: 'linear-gradient(to right, rgba(15,23,42,0.92) 0%, rgba(19,78,74,0.75) 50%, rgba(15,23,42,0.85) 100%)',
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
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#eef2f6]/95 text-teal-800 text-xs font-mono font-black uppercase tracking-wider shadow-[4px_4px_10px_rgba(0,0,0,0.3)]">
                  <Shield className="w-3.5 h-3.5 text-teal-600" />
                  <span>{slide.badge}</span>
                </div>
              )}

              <h1
                className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-white leading-tight drop-shadow-xl"
              >
                {slide.headline || 'Sculpting Exceptional Futures'}
              </h1>

              {slide.caption && (
                <p className="text-sm sm:text-base lg:text-lg text-slate-200 leading-relaxed max-w-2xl font-normal drop-shadow-md">
                  {slide.caption}
                </p>
              )}

              {/* Neumorphic CTA Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link to={slide.buttonUrl || '/admissions'}>
                  <NeumorphicButton variant="teal" size="lg" showArrow={true}>
                    {slide.buttonText || 'Online Admissions'}
                  </NeumorphicButton>
                </Link>

                <Link to="/courses">
                  <NeumorphicButton variant="soft" size="lg">
                    Academic Curriculum
                  </NeumorphicButton>
                </Link>
              </div>
            </div>

            {/* Right Quick Info Card */}
            {showRightCard && (
              <div className="lg:col-span-4 hidden lg:block">
                <div className="p-6 rounded-3xl bg-[#eef2f6] text-slate-800 shadow-[10px_10px_25px_rgba(0,0,0,0.4)]">
                  <div className="flex items-center gap-2.5 mb-4">
                    <div className="w-10 h-10 rounded-2xl bg-[#eef2f6] shadow-[4px_4px_8px_#cbd5e1,-4px_-4px_8px_#ffffff] flex items-center justify-center text-teal-600">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-slate-800">{cardTitle || 'Campus Briefing'}</h3>
                      {cardSubtitle && <p className="text-xs text-teal-600 font-mono font-bold">{cardSubtitle}</p>}
                    </div>
                  </div>

                  {cardItems && cardItems.length > 0 && (
                    <ul className="space-y-2.5 mb-5 text-xs text-slate-600 font-medium">
                      {cardItems.map((item: any, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-teal-600 font-bold mt-0.5">✦</span>
                          <span className="leading-snug">{typeof item === 'string' ? item : (item.title || item.text || '')}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {cardPrimaryButtonText && (
                    <Link to={cardPrimaryButtonUrl || '/contact'} className="block">
                      <NeumorphicButton variant="teal" size="sm" className="w-full">
                        {cardPrimaryButtonText}
                      </NeumorphicButton>
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
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-2xl bg-[#eef2f6] text-slate-800 shadow-[4px_4px_10px_rgba(0,0,0,0.35)] flex items-center justify-center hover:scale-105 transition cursor-pointer"
            >
              <ChevronsLeft className="w-5 h-5" />
            </button>
            <button
              onClick={onNextSlide}
              aria-label="Next Slide"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-2xl bg-[#eef2f6] text-slate-800 shadow-[4px_4px_10px_rgba(0,0,0,0.35)] flex items-center justify-center hover:scale-105 transition cursor-pointer"
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
                    ? 'w-8 bg-teal-400 shadow-[0_0_12px_rgba(45,212,191,0.8)]'
                    : 'w-2.5 bg-white/30 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* 2. THREE-PILLAR NEUMORPHIC 3D CARDS */}
      <section className="relative z-10 max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-16 -mt-10 sm:-mt-14 mb-14 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <NeumorphicCard
            icon={<Shield className="w-6 h-6" />}
            title="Degree Programs"
            description="Comprehensive undergraduate and postgraduate programs crafted for depth, clarity, and mastery."
            linkText="Discover Programs"
            linkUrl="/courses"
          />
          <NeumorphicCard
            icon={<Layers className="w-6 h-6" />}
            title="Admissions & Aid"
            description="Clear admission avenues, merit scholarships, and dedicated student lifecycle guidance."
            linkText="Apply for Admission"
            linkUrl="/admissions"
          />
          <NeumorphicCard
            icon={<Compass className="w-6 h-6" />}
            title="Careers & Incubation"
            description="Comprehensive placement mentoring, corporate campus recruitment, and alumni career linkages."
            linkText="Explore Careers"
            linkUrl="/placements"
          />
        </div>
      </section>
    </div>
  );
};
