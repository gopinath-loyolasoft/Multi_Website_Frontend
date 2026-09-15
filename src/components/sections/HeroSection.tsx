import React, { useState, useEffect } from 'react';
import { useTenant } from '../../tenant/TenantContext';
import { useTheme } from '../../themes/ThemeContext';
import { 
  SlideItem, 
  HighlightCardItem, 
  EngineeringHeroTemplate, 
  ArtsScienceHeroTemplate, 
  MedicalHeroTemplate, 
  UniversityHeroTemplate 
} from './hero-templates';

interface HeroCardItem {
  title: string;
  desc?: string;
}

interface HeroProps {
  content: {
    badge?: string;
    heading?: string;
    description?: string;
    subheading?: string;
    ctaText?: string;
    ctaLink?: string;
    secondaryCtaText?: string;
    secondaryCtaLink?: string;
    backgroundImage?: string;

    // Dynamic Right Card Controls
    showRightCard?: boolean;
    cardBadge?: string;
    cardTitle?: string;
    cardSubtitle?: string;
    cardItems?: HeroCardItem[];
    cardPrimaryButtonText?: string;
    cardPrimaryButtonUrl?: string;
    cardSecondaryButtonText?: string;
    cardSecondaryButtonUrl?: string;

    // Quick pillars below heading
    pillars?: string[];

    // Backward compatibility
    showAdmissionsCard?: boolean;
    admissionsCardTitle?: string;
    admissionsCardPoints?: string[];
  };
  banners?: any[];
}

export const HeroSection: React.FC<HeroProps> = ({ content, banners: propBanners }) => {
  const { siteConfig } = useTenant();
  const { isArtsAndScience, isMedical, isEngineering, isUniversity } = useTheme();

  // Active promotional banners from Slider Banners (managed in /admin/banners or siteConfig)
  const rawBanners = propBanners !== undefined ? propBanners : (siteConfig?.banners || []);
  const activeBanners = rawBanners.filter((b: any) => b.isActive !== false && !b.isDeleted);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % activeBanners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [activeBanners.length]);

  const defaultLocalBg = isArtsAndScience 
    ? '/assets/templates/arts/banner1.svg'
    : isMedical
    ? '/assets/templates/medical/banner1.svg'
    : isUniversity
    ? '/assets/templates/university/banner1.svg'
    : '/assets/templates/engineering/banner1.svg';

  const defaultBadge = isArtsAndScience
    ? '⚜️ UGC AUTONOMOUS • HERITAGE INSTITUTION • ESTD 1968 ⚜️'
    : isMedical
    ? 'NMC RECOGNIZED • 1,200-BED TEACHING HOSPITAL'
    : isUniversity
    ? '👑 CENTRAL RESEARCH UNIVERSITY • ESTD 1926'
    : 'ADMISSIONS 2026-27 ACTIVE • NBA TIER-1 ACCREDITED';

  const defaultHeadline = siteConfig?.tenant?.name || (
    isArtsAndScience
      ? 'Nurturing Wisdom, Science & Cultural Heritage'
      : isMedical
      ? 'Advancing Clinical Healthcare & Medicine'
      : isUniversity
      ? 'A Global Epicenter for Academic Excellence'
      : 'Innovation & Future-Ready Engineering'
  );

  const defaultCaption = isArtsAndScience
    ? 'Empowering visionary scholars through liberal arts, archival research, and transformative scientific mentorship.'
    : isMedical
    ? 'Comprehensive clinical clerkships, world-class surgical simulation suites, and hands-on patient care.'
    : isUniversity
    ? 'Fostering interdisciplinary innovation across faculties, dual degrees, and world-renowned research fellowships.'
    : 'Empowering engineers with high-performance research labs, industry patents, and premier corporate placements.';

  const defaultPrimaryBtnText = isMedical
    ? 'Explore Medical Admissions'
    : isArtsAndScience
    ? 'Apply for Admission'
    : isUniversity
    ? 'Explore University Degrees'
    : 'Explore Tech Programs';

  const slides: SlideItem[] = 
    activeBanners.length > 0
      ? activeBanners.map((b: any) => ({
          imageUrl: b.imageUrl || defaultLocalBg,
          headline: b.title || defaultHeadline,
          caption: b.subtitle || defaultCaption,
          badge: b.badge || defaultBadge,
          buttonText: b.ctaText || defaultPrimaryBtnText,
          buttonUrl: b.ctaUrl || '/courses',
          secondaryButtonText: b.secondaryCtaText,
          secondaryButtonUrl: b.secondaryCtaUrl,
          pillars: b.pillars,
        }))
      : [
          {
            imageUrl: content.backgroundImage || defaultLocalBg,
            headline: content.heading || defaultHeadline,
            caption: content.description || content.subheading || defaultCaption,
            badge: content.badge || defaultBadge,
            buttonText: content.ctaText || defaultPrimaryBtnText,
            buttonUrl: content.ctaLink || '/courses',
            secondaryButtonText: content.secondaryCtaText,
            secondaryButtonUrl: content.secondaryCtaLink,
            pillars: content.pillars,
          },
        ];

  const institutionName = siteConfig?.tenant?.name || 'Campus Highlights';
  const showRightCard = 
    content.showRightCard !== undefined 
      ? content.showRightCard 
      : content.showAdmissionsCard !== undefined 
      ? content.showAdmissionsCard 
      : true;

  const cardTitle = content.cardTitle || content.admissionsCardTitle || (
    isArtsAndScience ? 'Heritage & Academic Record' : isMedical ? 'Clinical Excellence Wing' : isUniversity ? 'Multi-Faculty Gateway' : 'Placement & Innovation'
  );
  const cardSubtitle = content.cardSubtitle || institutionName;
  const cardBadge = content.cardBadge || '2026-27 OPEN';

  const defaultItems: HighlightCardItem[] = isArtsAndScience
    ? [
        { title: 'UGC Autonomous & NAAC A++', desc: 'Legacy of distinguished academic scholars, humanities & scientific research.' },
        { title: 'Rich Library & Heritage Archives', desc: 'Over 100,000+ volumes, rare manuscripts & modern digital repositories.' },
        { title: 'Civil Services & Career Pathways', desc: 'Distinguished mentorship, postgraduate fellowships & IAS coaching.' },
      ]
    : isMedical
    ? [
        { title: 'NMC & NABH Accredited', desc: '1,200-bed multi-specialty teaching hospital with super-specialty departments.' },
        { title: 'Advanced Simulation Lab', desc: 'Comprehensive clinical skills laboratory and digital anatomy suites.' },
        { title: '24/7 Clinical Rotations', desc: 'Direct patient care experience under eminent specialist consultants.' },
      ]
    : isUniversity
    ? [
        { title: 'Multi-Faculty Academic Campus', desc: 'Comprising faculties of Science, Technology, Arts, Law & Business.' },
        { title: 'World-Class Research Hub', desc: 'State-of-the-art interdisciplinary research centers & global publications.' },
        { title: 'Global University Alliances', desc: 'Dual-degree programs, faculty exchanges & joint research initiatives.' },
      ]
    : [
        { title: 'Autonomous & Tier-1 Accredited', desc: 'Highest NAAC grade with updated industry-aligned curricula.' },
        { title: '50+ Cutting-Edge Labs', desc: 'State-of-the-art AI, robotics & IoT centers for live research.' },
        { title: '150+ Recruiter MNCs', desc: 'Over ₹45 LPA highest package with top technology companies.' },
      ];

  const cardItems: HighlightCardItem[] = 
    (content.cardItems && content.cardItems.length > 0)
      ? content.cardItems
      : (content.admissionsCardPoints && content.admissionsCardPoints.length > 0)
      ? content.admissionsCardPoints.map((p) => ({ title: p, desc: '' }))
      : defaultItems;

  const defaultPillars = isArtsAndScience
    ? ['UGC Autonomous', 'NAAC A++ Heritage', 'Civil Services Mentorship']
    : isMedical
    ? ['1,200 Teaching Beds', '24/7 Trauma Care Active', 'NMC Recognized']
    : isUniversity
    ? ['Multi-Faculty Campus', 'Global Research Alliances', 'UGC & NAAC A++']
    : ['AICTE & NBA Tier-1', '150+ Top Recruiters', '50+ Advanced Research Labs'];

  const currentSlideItem = slides[currentSlideIndex];
  const pillars =
    currentSlideItem?.pillars && currentSlideItem.pillars.length > 0
      ? currentSlideItem.pillars.filter(Boolean)
      : content.pillars && content.pillars.length > 0
      ? content.pillars.filter(Boolean)
      : defaultPillars;

  const prevSlide = () => setCurrentSlideIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  const nextSlide = () => setCurrentSlideIndex((prev) => (prev + 1) % slides.length);

  const templateProps = {
    slides,
    currentSlide: currentSlideIndex,
    onSelectSlide: (idx: number) => setCurrentSlideIndex(idx),
    onPrevSlide: prevSlide,
    onNextSlide: nextSlide,
    showArrows: activeBanners.length > 1,
    showDots: activeBanners.length > 1,
    showRightCard,
    cardTitle,
    cardSubtitle,
    cardBadge,
    cardItems,
    cardPrimaryButtonText: content.cardPrimaryButtonText,
    cardPrimaryButtonUrl: content.cardPrimaryButtonUrl,
    cardSecondaryButtonText: content.cardSecondaryButtonText,
    cardSecondaryButtonUrl: content.cardSecondaryButtonUrl,
    pillars,
  };

  if (isArtsAndScience) {
    return <ArtsScienceHeroTemplate {...templateProps} />;
  }
  if (isMedical) {
    return <MedicalHeroTemplate {...templateProps} />;
  }
  if (isUniversity) {
    return <UniversityHeroTemplate {...templateProps} />;
  }
  return <EngineeringHeroTemplate {...templateProps} />;
};
