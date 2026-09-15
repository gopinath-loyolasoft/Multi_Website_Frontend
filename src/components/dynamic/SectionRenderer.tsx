import React from 'react';
import { PageSection } from '../../types';
import { HeroSection } from '../sections/HeroSection';
import { HeroSliderSection } from '../sections/HeroSliderSection';
import { TextSection } from '../sections/TextSection';
import { ImageSection } from '../sections/ImageSection';
import { ImageTextSection } from '../sections/ImageTextSection';
import { CardsSection } from '../sections/CardsSection';
import { StatisticsSection } from '../sections/StatisticsSection';
import { IconCardsSection } from '../sections/IconCardsSection';
import { NewsSection } from '../sections/NewsSection';
import { EventsSection } from '../sections/EventsSection';
import { NoticesSection } from '../sections/NoticesSection';
import { CoursesSection } from '../sections/CoursesSection';
import { DepartmentsSection } from '../sections/DepartmentsSection';
import { FacultySection } from '../sections/FacultySection';
import { GallerySection } from '../sections/GallerySection';
import { TestimonialsSection } from '../sections/TestimonialsSection';
import { CtaSection } from '../sections/CtaSection';
import { VideoSection } from '../sections/VideoSection';
import { LogoGridSection } from '../sections/LogoGridSection';
import { FaqSection } from '../sections/FaqSection';
import { ContactSection } from '../sections/ContactSection';
import { MapSection } from '../sections/MapSection';
import { QuoteSection } from '../sections/QuoteSection';

import { useTheme } from '../../themes/ThemeContext';

interface SectionRendererProps {
  section: PageSection;
}

export const SectionRenderer: React.FC<SectionRendererProps> = ({ section }) => {
  const { isArtsAndScience, isMedical, isUniversity, isEngineering } = useTheme();

  if (!section.isVisible) return null;

  const settings = section.settings || {};
  const isHero = ['HERO', 'HERO_SLIDER', 'BANNERS'].includes(section.sectionType.toUpperCase());

  const bgClass =
    settings.background === 'muted'
      ? 'bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100'
      : settings.background === 'dark'
      ? 'bg-slate-900 dark:bg-black text-white'
      : settings.background === 'gradient'
      ? 'bg-gradient-to-b from-primary/10 via-white to-slate-50 dark:from-slate-950 dark:to-slate-900 text-slate-900 dark:text-slate-100'
      : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100';

  const spacingClass =
    settings.spacing === 'compact'
      ? 'py-8'
      : settings.spacing === 'large'
      ? 'py-20 md:py-28'
      : 'py-12 md:py-16';

  const widthClass =
    settings.containerWidth === 'narrow'
      ? 'max-w-4xl mx-auto px-4'
      : settings.containerWidth === 'full'
      ? 'w-full px-4 sm:px-6'
      : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8';

  const alignClass = isArtsAndScience 
    ? 'text-center'
    : isUniversity
    ? 'text-center'
    : settings.alignment === 'left'
    ? 'text-left'
    : 'text-left md:text-center';

  const titleFontClass = isArtsAndScience 
    ? 'font-serif font-black tracking-normal text-emerald-950 dark:text-emerald-100'
    : isUniversity
    ? 'font-serif font-extrabold tracking-tight text-slate-900 dark:text-white'
    : isMedical
    ? 'font-sans font-black tracking-tight text-teal-950 dark:text-teal-100'
    : 'font-sans font-black tracking-tight text-slate-900 dark:text-white';

  const renderContent = () => {
    switch (section.sectionType.toUpperCase()) {
      case 'HERO':
        return <HeroSection content={section.content || {}} />;
      case 'HERO_SLIDER':
      case 'BANNERS':
        return <HeroSliderSection content={section.content || {}} />;
      case 'QUOTE':
        return <QuoteSection content={section.content || {}} />;
      case 'TEXT':
        return <TextSection content={section.content || {}} />;
      case 'IMAGE':
        return <ImageSection content={section.content || {}} />;
      case 'IMAGE_TEXT':
        return <ImageTextSection content={section.content || {}} />;
      case 'CARDS':
        return <CardsSection content={section.content || {}} />;
      case 'STATISTICS':
      case 'STATS':
        return <StatisticsSection content={section.content || {}} />;
      case 'ICON_CARDS':
        return <IconCardsSection content={section.content || {}} />;
      case 'NEWS':
        return <NewsSection content={section.content || {}} />;
      case 'EVENTS':
        return <EventsSection content={section.content || {}} />;
      case 'NOTICES':
        return <NoticesSection content={section.content || {}} />;
      case 'COURSES':
        return <CoursesSection content={section.content || {}} />;
      case 'DEPARTMENTS':
        return <DepartmentsSection content={section.content || {}} />;
      case 'FACULTY':
        return <FacultySection content={section.content || {}} />;
      case 'GALLERY':
        return <GallerySection content={section.content || {}} />;
      case 'TESTIMONIALS':
        return <TestimonialsSection content={section.content || {}} />;
      case 'CALL_TO_ACTION':
      case 'CTA':
        return <CtaSection content={section.content || {}} />;
      case 'VIDEO':
        return <VideoSection content={section.content || {}} />;
      case 'LOGO_GRID':
        return <LogoGridSection content={section.content || {}} />;
      case 'FAQ':
        return <FaqSection content={section.content || {}} />;
      case 'CONTACT':
        return <ContactSection content={section.content || {}} />;
      case 'MAP':
        return <MapSection content={section.content || {}} />;
      default:
        return (
          <div className="p-8 my-4 max-w-6xl mx-auto bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm">
            Unknown Section Type: <strong>{section.sectionType}</strong>
          </div>
        );
    }
  };

  const getSectionAnchorId = (sec: PageSection): string => {
    if (sec.settings?.anchorId) return sec.settings.anchorId;
    const type = (sec.sectionType || '').toUpperCase();
    switch (type) {
      case 'HERO':
      case 'HERO_SLIDER':
      case 'BANNERS':
        return 'hero';
      case 'QUOTE':
        return 'quote';
      case 'STATISTICS':
      case 'STATS':
        return 'stats';
      case 'DEPARTMENTS':
        return 'departments';
      case 'COURSES':
        return 'courses';
      case 'FACULTY':
        return 'faculty';
      case 'NEWS':
        return 'news';
      case 'EVENTS':
        return 'events';
      case 'NOTICES':
        return 'notices';
      case 'GALLERY':
        return 'gallery';
      case 'PLACEMENTS':
      case 'RECRUITERS':
        return 'placements';
      case 'TESTIMONIALS':
        return 'testimonials';
      case 'FAQ':
        return 'faq';
      case 'CONTACT':
      case 'MAP':
        return 'contact';
      case 'IMAGE_TEXT':
      case 'TEXT':
      case 'CARDS':
        return sec.title?.toLowerCase().includes('about') ? 'about' : `section-${sec.id}`;
      default:
        return `section-${sec.id}`;
    }
  };

  const anchorId = getSectionAnchorId(section);

  if (isHero) {
    return (
      <section
        id={anchorId}
        data-section-id={section.id}
        data-section-type={section.sectionType}
        className="w-full scroll-mt-24"
        style={{ scrollMarginTop: '85px' }}
      >
        {renderContent()}
      </section>
    );
  }

  return (
    <section
      id={anchorId}
      data-section-id={section.id}
      data-section-type={section.sectionType}
      data-columns={settings.columns || 3}
      data-card-variant={settings.cardVariant || 'standard'}
      className={`w-full scroll-mt-24 transition-colors duration-200 ${bgClass} ${spacingClass} ${settings.customCssClass || ''}`}
      style={{ scrollMarginTop: '85px' }}
    >
      <div className={`${widthClass} ${alignClass}`}>
        {(section.title || section.subtitle) && (
          <div className="mb-8 md:mb-12 space-y-2">
            {isArtsAndScience && (
              <div className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-serif italic mb-2 border border-emerald-200">
                Academic Excellence & Humanities
              </div>
            )}
            {isMedical && (
              <div className="inline-block px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-[11px] font-bold uppercase tracking-wider mb-2 border border-teal-200">
                Clinical Science & Care
              </div>
            )}
            {isUniversity && (
              <div className="inline-block px-3 py-1 rounded-full bg-rose-100 text-rose-900 text-[11px] font-bold uppercase tracking-widest mb-2 border border-rose-200">
                Research & Multi-Faculty Campus
              </div>
            )}
            {section.title && (
              <h2 className={`text-2xl sm:text-3xl lg:text-4xl ${titleFontClass}`}>
                {section.title}
              </h2>
            )}
            {section.subtitle && (
              <p className={`text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl ${isArtsAndScience ? 'mx-auto font-serif' : isUniversity ? 'mx-auto' : ''}`}>
                {section.subtitle}
              </p>
            )}
          </div>
        )}
        {renderContent()}
      </div>
    </section>
  );
};

export const PageRenderer: React.FC<{ sections: PageSection[] }> = ({ sections }) => {
  return (
    <div className="flex flex-col w-full">
      {sections.map((section) => (
        <SectionRenderer key={section.id} section={section} />
      ))}
    </div>
  );
};
