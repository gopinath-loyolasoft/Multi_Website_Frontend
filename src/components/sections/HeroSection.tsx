import React, { useState, useEffect } from 'react';
import { useTenant } from '../../tenant/TenantContext';
import { useTemplateTheme } from '../../themes/ThemeContext';
import { useActiveTemplate, SlideItem, HighlightCardItem } from '../../templates';

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
  const { styles } = useTemplateTheme();
  const { Hero } = useActiveTemplate();

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

  const defaultLocalBg = styles.heroSlider?.defaultBgImage || '/assets/templates/engineering/banner1.svg';

  const defaultBadge = siteConfig?.settings?.tagline || '';
  const defaultHeadline = siteConfig?.tenant?.name || content.heading || 'Welcome to our Campus';
  const defaultCaption = siteConfig?.settings?.description || content.description || content.subheading || '';
  const defaultPrimaryBtnText = content.ctaText || 'Explore Programs';

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

  const institutionName = siteConfig?.tenant?.name || '';
  const rawCardItems: HighlightCardItem[] = 
    (content.cardItems && content.cardItems.length > 0)
      ? content.cardItems
      : (content.admissionsCardPoints && content.admissionsCardPoints.length > 0)
      ? content.admissionsCardPoints.map((p) => ({ title: p, desc: '' }))
      : [];

  const showRightCard = 
    content.showRightCard !== undefined 
      ? content.showRightCard 
      : content.showAdmissionsCard !== undefined 
      ? content.showAdmissionsCard 
      : rawCardItems.length > 0;

  const cardTitle = content.cardTitle || content.admissionsCardTitle || 'Campus Highlights';
  const cardSubtitle = content.cardSubtitle || institutionName;
  const cardBadge = content.cardBadge || '';
  const cardItems: HighlightCardItem[] = rawCardItems;

  const currentSlideItem = slides[currentSlideIndex];
  const pillars =
    currentSlideItem?.pillars && currentSlideItem.pillars.length > 0
      ? currentSlideItem.pillars.filter(Boolean)
      : content.pillars && content.pillars.length > 0
      ? content.pillars.filter(Boolean)
      : [];

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

  return <Hero {...templateProps} />;
};
