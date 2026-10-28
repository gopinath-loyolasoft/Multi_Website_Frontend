import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronsLeft, ChevronsRight, Sparkles, Compass, Award, Layers } from 'lucide-react';
import { HeroTemplateProps } from '../contracts/HeroTypes';
import { GlassButton } from './components/GlassButton';
import { GlassCard } from './components/GlassCard';
import { GlassStatOrb } from './components/GlassStatOrb';

export const GlassHeroTemplate: React.FC<HeroTemplateProps> = ({
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
    <div className="w-full flex flex-col bg-slate-950 text-white">
      {/* 1. MAIN HERO BANNER WITH 3D GLASS PARALLAX & BOKEH GLOW */}
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
                className="w-full h-full object-cover object-center scale-105 animate-pulse"
                style={{ animationDuration: '8s' }}
              />
            )}
            {/* Deep Glass Aurora Overlay Gradient */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(circle at 20% 40%, rgba(6,182,212,0.25) 0%, transparent 60%), linear-gradient(to right, rgba(2,6,23,0.95) 0%, rgba(15,23,42,0.75) 50%, rgba(2,6,23,0.95) 100%)',
              }}
            />
          </div>
        ))}

        {/* Floating 3D Frosted Glass Prism Orbs in Background */}
        <div className="absolute top-12 right-[20%] w-72 h-72 rounded-full bg-gradient-to-tr from-cyan-500/20 to-purple-600/20 blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute bottom-10 left-[30%] w-96 h-96 rounded-full bg-gradient-to-tr from-blue-600/20 to-teal-400/20 blur-3xl pointer-events-none" />

        {/* Hero Content Container */}
        <div className="relative max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-16 py-10 w-full z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-8 space-y-6">
              {slide.badge && (
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-cyan-400/40 text-cyan-300 text-xs font-mono font-bold uppercase tracking-wider backdrop-blur-xl shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-spin" style={{ animationDuration: '4s' }} />
                  <span>{slide.badge}</span>
                </div>
              )}

              <h1
                className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-white leading-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]"
              >
                {slide.headline || 'Excellence in Higher Education'}
              </h1>

              {slide.caption && (
                <p className="text-sm sm:text-base lg:text-lg text-slate-200 leading-relaxed max-w-2xl font-normal drop-shadow-md">
                  {slide.caption}
                </p>
              )}

              {/* Glass CTA Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link to={slide.buttonUrl || '/admissions'}>
                  <GlassButton variant="cyan" size="lg" showArrow={true}>
                    {slide.buttonText || 'Explore Admissions'}
                  </GlassButton>
                </Link>

                <Link to="/courses">
                  <GlassButton variant="frosted" size="lg">
                    Academic Programs
                  </GlassButton>
                </Link>
              </div>
            </div>

            {/* Right Quick Info Card */}
            {showRightCard && (
              <div className="lg:col-span-4 hidden lg:block">
                <div className="p-6 rounded-3xl bg-white/10 hover:bg-white/15 backdrop-blur-3xl border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] transition-all duration-300">
                  <div className="flex items-center gap-2.5 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-md">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-white">{cardTitle || 'Campus Highlights'}</h3>
                      {cardSubtitle && <p className="text-xs text-cyan-300 font-mono">{cardSubtitle}</p>}
                    </div>
                  </div>

                  {cardItems && cardItems.length > 0 && (
                    <ul className="space-y-2.5 mb-5 text-xs text-slate-200">
                      {cardItems.map((item: any, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-cyan-400 mt-0.5">✦</span>
                          <span className="leading-snug">{typeof item === 'string' ? item : (item.title || item.text || '')}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {cardPrimaryButtonText && (
                    <Link to={cardPrimaryButtonUrl || '/contact'} className="block">
                      <GlassButton variant="cyan" size="sm" className="w-full">
                        {cardPrimaryButtonText}
                      </GlassButton>
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
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-2xl bg-white/10 hover:bg-white/25 border border-white/20 text-white backdrop-blur-xl flex items-center justify-center shadow-lg transition duration-300 hover:scale-110 cursor-pointer"
            >
              <ChevronsLeft className="w-5 h-5" />
            </button>
            <button
              onClick={onNextSlide}
              aria-label="Next Slide"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-2xl bg-white/10 hover:bg-white/25 border border-white/20 text-white backdrop-blur-xl flex items-center justify-center shadow-lg transition duration-300 hover:scale-110 cursor-pointer"
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
                    ? 'w-8 bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.8)]'
                    : 'w-2.5 bg-white/30 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* 2. THREE-PILLAR 3D FLOATING GLASS CARDS */}
      <section className="relative z-10 max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-16 -mt-10 sm:-mt-14 mb-14 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard
            glowColor="cyan"
            icon={<Sparkles className="w-6 h-6" />}
            title="Academic Programs"
            description="Multi-disciplinary undergraduate, postgraduate, and doctoral degrees with global curriculum standards."
            linkText="Browse Programs"
            linkUrl="/courses"
          />
          <GlassCard
            glowColor="violet"
            icon={<Layers className="w-6 h-6" />}
            title="Admissions & Aid"
            description="Seamless merit-based online admissions, academic scholarships, and dedicated student counseling."
            linkText="Apply Now"
            linkUrl="/admissions"
          />
          <GlassCard
            glowColor="emerald"
            icon={<Compass className="w-6 h-6" />}
            title="Research & Placements"
            description="State-of-the-art incubation labs, funded research projects, and tier-1 industry placement partnerships."
            linkText="Discover Careers"
            linkUrl="/placements"
          />
        </div>
      </section>
    </div>
  );
};
