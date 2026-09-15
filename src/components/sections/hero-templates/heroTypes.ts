export interface SlideItem {
  imageUrl?: string;
  headline?: string;
  caption?: string;
  badge?: string;
  buttonText?: string;
  buttonUrl?: string;
  secondaryButtonText?: string;
  secondaryButtonUrl?: string;
  pillars?: string[];
}

export interface HighlightCardItem {
  title: string;
  desc?: string;
}

export interface HeroTemplateProps {
  slides: SlideItem[];
  currentSlide: number;
  onSelectSlide: (index: number) => void;
  onPrevSlide: () => void;
  onNextSlide: () => void;
  showArrows?: boolean;
  showDots?: boolean;
  
  // Highlight Card dynamic props
  showRightCard: boolean;
  cardTitle: string;
  cardSubtitle: string;
  cardBadge: string;
  cardItems: HighlightCardItem[];
  cardPrimaryButtonText?: string;
  cardPrimaryButtonUrl?: string;
  cardSecondaryButtonText?: string;
  cardSecondaryButtonUrl?: string;

  // Quick pillars
  pillars: string[];
}
