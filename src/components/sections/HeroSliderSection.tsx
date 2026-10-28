import React, { useState, useEffect } from 'react';
import { useTenant } from '../../tenant/TenantContext';
import { useTemplateTheme } from '../../themes/ThemeContext';
import { useActiveTemplate, SlideItem, HighlightCardItem } from '../../templates';

interface HeroSliderProps {
  content: {
    slides?: SlideItem[];
    autoplaySpeed?: number;
    showArrows?: boolean;
    showDots?: boolean;
    
    // Dynamic Highlights Card Controls
    showRightCard?: boolean;
    cardBadge?: string;
    cardTitle?: string;
    cardSubtitle?: string;
    cardItems?: HighlightCardItem[];
    cardPrimaryButtonText?: string;
    cardPrimaryButtonUrl?: string;
    cardSecondaryButtonText?: string;
    cardSecondaryButtonUrl?: string;
    pillars?: string[];
  };
  banners?: any[];
}

export const HeroSliderSection: React.FC<HeroSliderProps> = ({ content, banners: propBanners }) => {
  const { siteConfig } = useTenant();
  const { styles } = useTemplateTheme();
  const { Hero } = useActiveTemplate();

  // Dynamic slides resolution: prop slides -> banners -> siteConfig -> default template banners
  const rawBanners = propBanners !== undefined ? propBanners : (siteConfig?.banners || []);
  const activeBanners = rawBanners.filter((b: any) => b.isActive !== false && !b.isDeleted);

  const defaultLocalBg = styles.heroSlider?.defaultBgImage || '/assets/templates/engineering/banner1.svg';

  const defaultBadge = siteConfig?.settings?.tagline || '';
  const defaultHeadline = siteConfig?.tenant?.name || 'Welcome to our Campus';
  const defaultCaption = siteConfig?.settings?.description || '';
  const defaultPrimaryBtnText = 'Explore Programs';

  const slides: SlideItem[] = 
    content.slides && content.slides.length > 0
      ? content.slides
      : activeBanners.length > 0
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
            imageUrl: defaultLocalBg,
            headline: defaultHeadline,
            caption: defaultCaption,
            badge: defaultBadge,
            buttonText: defaultPrimaryBtnText,
            buttonUrl: '/courses',
          },
        ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, content.autoplaySpeed || 6000);
    return () => clearInterval(timer);
  }, [slides.length, content.autoplaySpeed]);

  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);

  // Dynamic Highlight Card configuration
  const institutionName = siteConfig?.tenant?.name || '';
  const rawCardItems: HighlightCardItem[] = (content.cardItems && content.cardItems.length > 0) ? content.cardItems : [];
  const showRightCard = content.showRightCard !== undefined ? content.showRightCard : rawCardItems.length > 0;
  const cardTitle = content.cardTitle || 'Campus Highlights';
  const cardSubtitle = content.cardSubtitle || institutionName;
  const cardBadge = content.cardBadge || '';
  const cardItems = rawCardItems;

  const currentSlideItem = slides[currentSlide];
  const pillars =
    currentSlideItem?.pillars && currentSlideItem.pillars.length > 0
      ? currentSlideItem.pillars.filter(Boolean)
      : content.pillars && content.pillars.length > 0
      ? content.pillars.filter(Boolean)
      : [];

  const templateProps = {
    slides,
    currentSlide,
    onSelectSlide: (idx: number) => setCurrentSlide(idx),
    onPrevSlide: prevSlide,
    onNextSlide: nextSlide,
    showArrows: content.showArrows !== false,
    showDots: content.showDots !== false,
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
