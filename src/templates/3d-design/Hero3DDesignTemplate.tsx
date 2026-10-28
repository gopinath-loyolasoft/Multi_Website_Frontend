import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronsLeft, ChevronsRight, Award, GraduationCap, Landmark, BookOpenCheck } from 'lucide-react';
import { HeroTemplateProps } from '../contracts/HeroTypes';
import { SlantedButton } from '../../UI_Componentes/3D_Slanted/SlantedButton';
import { SlantedCard } from '../../UI_Componentes/3D_Slanted/SlantedCard';
import { SlantedStatCounter } from '../../UI_Componentes/3D_Slanted/SlantedStatCounter';

export const Hero3DDesignTemplate: React.FC<HeroTemplateProps> = ({
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
    <div className="w-full flex flex-col">
      {/* 1. MAIN HERO BANNER WITH DIAGONAL GOLD SLICE & SKEWED ARROWS */}
      <div className="relative w-full h-[480px] sm:h-[540px] lg:h-[600px] bg-[#0b3353] text-white overflow-hidden select-none flex items-center">
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
            {/* Soft, minimal contrast gradient only on left for sharp text readability */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 45%, transparent 75%)',
              }}
            />
          </div>
        ))}

        {/* CLEAN TRANSLUCENT GOLD DIAGONAL SLICE (Reduced width & positioned towards right) */}
        <div
          className="absolute top-0 right-[15%] w-[22%] h-full bg-[#e5a912]/45 -skew-x-12 transform pointer-events-none hidden md:block border-x border-[#e5a912]/30"
          style={{ zIndex: 5 }}
        />

        {/* Hero Content Container */}
        <div className="relative max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-16 py-10 w-full z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-8 space-y-5">
              {slide.badge && (
                <div className="inline-flex items-center gap-2 px-4 py-1.5 -skew-x-12 bg-[#0b3353] border border-amber-400 text-amber-300 text-xs font-bold uppercase tracking-wider shadow-md">
                  <span className="skew-x-12 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    {slide.badge}
                  </span>
                </div>
              )}

              <h1
                className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-white leading-tight drop-shadow-2xl"
                style={{ textShadow: '0 4px 20px rgba(0,0,0,0.8)' }}
              >
                {slide.headline || 'Fee Payment & Admissions'}
              </h1>

              {slide.caption && (
                <p
                  className="text-sm sm:text-base lg:text-lg text-slate-100 leading-relaxed max-w-2xl font-normal drop-shadow-md"
                  style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}
                >
                  {slide.caption}
                </p>
              )}

              {/* Slanted CTA Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link to={slide.buttonUrl || '/admissions'}>
                  <SlantedButton variant="gold" size="lg">
                    {slide.buttonText || 'Click to Apply'}
                  </SlantedButton>
                </Link>

                <Link to="/contact">
                  <SlantedButton variant="blue" size="lg" iconVariant="none">
                    Fee Payment / Inquiry
                  </SlantedButton>
                </Link>
              </div>

              {/* Pillars Checkmarks */}
              {pillars && pillars.length > 0 && (
                <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-slate-200 border-t border-white/20 max-w-2xl">
                  {pillars.map((pillar, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-[#e5a912] -skew-x-12 inline-block" />
                      <span className="font-semibold text-white">{pillar}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right HUD Card (if configured) */}
            {showRightCard && cardItems && cardItems.length > 0 && (
              <div className="hidden lg:block lg:col-span-4">
                <div className="bg-[#0b3353]/95 border-2 border-[#e5a912] p-6 shadow-2xl space-y-4 text-white -skew-x-3">
                  <div className="skew-x-3">
                    <h3 className="text-base font-black uppercase text-amber-300">
                      {cardTitle || 'Admissions & Notices'}
                    </h3>
                    {cardSubtitle && (
                      <p className="text-xs text-slate-300 font-mono mt-0.5">{cardSubtitle}</p>
                    )}
                  </div>
                  <div className="space-y-3 text-xs skew-x-3">
                    {cardItems.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="p-2.5 bg-white/10 border-l-2 border-amber-400">
                        <p className="font-bold text-white text-xs">{item.title}</p>
                        {item.desc && <p className="text-[11px] text-slate-300 mt-0.5">{item.desc}</p>}
                      </div>
                    ))}
                  </div>
                  {cardPrimaryButtonText && (
                    <div className="skew-x-3 pt-2">
                      <Link to={cardPrimaryButtonUrl || '/admissions'} className="block">
                        <SlantedButton variant="gold" size="sm" className="w-full">
                          {cardPrimaryButtonText}
                        </SlantedButton>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SIGNATURE 3D SKEWED SLIDER CONTROLS (« ») */}
        {showArrows && totalSlides > 1 && (
          <div className="absolute bottom-8 right-8 z-20 flex items-center gap-3">
            <button
              onClick={onPrevSlide}
              aria-label="Previous slide"
              className="w-12 h-14 bg-black/90 hover:bg-[#e5a912] hover:text-black text-white border border-[#e5a912] -skew-x-12 flex items-center justify-center transition-all duration-300 shadow-xl cursor-pointer"
            >
              <ChevronsLeft className="w-5 h-5 skew-x-12" />
            </button>
            <button
              onClick={onNextSlide}
              aria-label="Next slide"
              className="w-12 h-14 bg-black/90 hover:bg-[#e5a912] hover:text-black text-white border border-[#e5a912] -skew-x-12 flex items-center justify-center transition-all duration-300 shadow-xl cursor-pointer"
            >
              <ChevronsRight className="w-5 h-5 skew-x-12" />
            </button>
          </div>
        )}
      </div>

      {/* 2. 3D SLANTED FEATURE CARDS (Facilities, Academics, Admission) */}
      <section className="relative -mt-10 max-w-7xl mx-auto px-6 z-20 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <SlantedCard
            icon={<GraduationCap className="w-8 h-8" />}
            title="Facilities"
            description="Large and green campuses with digital libraries, tech enabled classrooms, auditoriums, learning commons, and sports facilities."
          />
          <SlantedCard
            icon={<Landmark className="w-8 h-8" />}
            title="Academics"
            description="Intense and rigorous academic curriculum with deaneries, departments, research centers, and global collaborations."
          />
          <SlantedCard
            icon={<BookOpenCheck className="w-8 h-8" />}
            title="Admissions"
            description="Welcoming students across arts, science, commerce, and professional education with seamless application procedures."
          />
        </div>
      </section>
    </div>
  );
};

export const SalesianHeroTemplate = Hero3DDesignTemplate;

