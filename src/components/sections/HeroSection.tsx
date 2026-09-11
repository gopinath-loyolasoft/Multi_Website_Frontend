import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Sparkles,
  GraduationCap,
  Award,
  Users,
  Building2,
  CheckCircle2,
  BookOpen,
  HeartPulse,
  Cpu,
  PhoneCall
} from 'lucide-react';
import { useTenant } from '../../tenant/TenantContext';
import { useTheme, useTemplateTheme } from '../../themes/ThemeContext';

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

    // Quick pillars below heading (bypasses hardcoded defaults)
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
  const { styles } = useTemplateTheme();
  const heroStyles = styles.hero;

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

  const currentBanner = activeBanners[currentSlideIndex];

  // Dynamic Content Resolution:
  const defaultLocalBg = isArtsAndScience 
    ? '/assets/templates/arts/banner1.svg'
    : isMedical
    ? '/assets/templates/medical/banner1.svg'
    : isUniversity
    ? '/assets/templates/university/banner1.svg'
    : '/assets/templates/engineering/banner1.svg';

  const heading = currentBanner?.title || content.heading || siteConfig?.tenant?.name || 'Excellence in Higher Education';
  const description = currentBanner?.subtitle || content.description || content.subheading;
  const bgImage = 
    currentBanner?.imageUrl || 
    content.backgroundImage || 
    defaultLocalBg;

  const primaryBtnText = currentBanner !== undefined
    ? (currentBanner.ctaText?.trim() || null)
    : (content.ctaText || (isMedical ? 'Explore Medical Admissions' : isArtsAndScience ? 'Apply for Admission' : isUniversity ? 'Explore University Programs' : 'Explore Programs'));
  const primaryBtnUrl = currentBanner !== undefined
    ? (currentBanner.ctaUrl?.trim() || '/courses')
    : (content.ctaLink || '/courses');

  const secondaryCtaText = currentBanner !== undefined
    ? (currentBanner.secondaryCtaText?.trim() || null)
    : (content.secondaryCtaText || null);
  const secondaryCtaUrl = currentBanner !== undefined
    ? (currentBanner.secondaryCtaUrl?.trim() || '/contact')
    : (content.secondaryCtaLink || '/contact');

  const bannerBadgeText = currentBanner?.badge || content.badge || null;

  const institutionName = siteConfig?.tenant?.name || 'University Campus';

  const showCard = content.showRightCard !== undefined ? content.showRightCard : !isArtsAndScience;
  const cardTitle = content.cardTitle || content.admissionsCardTitle || (isArtsAndScience ? 'Academic Highlights' : isMedical ? 'Clinical & Academic Wing' : isUniversity ? 'University Council & Portal' : 'Campus Highlights');
  const cardSubtitle = content.cardSubtitle || institutionName;
  const cardBadge = content.cardBadge || '2026-27 Open';

  const defaultItems: HeroCardItem[] = isArtsAndScience
    ? [
        { title: 'UGC Autonomous & NAAC A++', desc: 'Legacy of distinguished academic scholars, humanities & scientific research.' },
        { title: 'Rich Library & Heritage Archives', desc: 'Over 100,000+ volumes, rare manuscripts & modern digital repositories.' },
        { title: 'Holistic Career Pathways', desc: 'Civil services mentorship, postgraduate fellowships & corporate placement.' },
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
        { title: 'Autonomous & Accredited', desc: 'Highest NAAC grade with updated industry-aligned curricula.' },
        { title: 'Cutting-Edge Infrastructure', desc: '50+ advanced research labs, smart classrooms & digital library.' },
        { title: 'Placement & Mentorship', desc: 'Over 150+ top MNC recruiters visiting campus annually.' },
      ];

  const cardItems: HeroCardItem[] = 
    (content.cardItems && content.cardItems.length > 0)
      ? content.cardItems
      : (content.admissionsCardPoints && content.admissionsCardPoints.length > 0)
      ? content.admissionsCardPoints.map((p) => ({ title: p, desc: '' }))
      : defaultItems;

  const defaultPillars = isArtsAndScience
    ? ['UGC Autonomous', 'NAAC A++ Heritage', 'Distinguished Faculty Mentors']
    : isMedical
    ? ['1200 Teaching Beds', '24/7 Super Specialty Care', 'NMC Recognized']
    : isUniversity
    ? ['Multi-Faculty Campus', 'Global Research Alliances', 'UGC & NAAC A++']
    : ['AICTE & NBA Tier-1', 'Top Placement Record', 'Advanced Research Labs'];

  const pillars =
    currentBanner && Array.isArray(currentBanner.pillars) && currentBanner.pillars.filter(Boolean).length > 0
      ? currentBanner.pillars.filter(Boolean)
      : Array.isArray(content.pillars) && content.pillars.filter(Boolean).length > 0
      ? content.pillars.filter(Boolean)
      : defaultPillars;

  // Template specific styling helpers
  const badgeClass = heroStyles.badgeClass;
  const badgeIconClass = heroStyles.badgeIconClass;
  const defaultBadgeText = isArtsAndScience
    ? 'UGC Autonomous • Heritage Institution'
    : isMedical
    ? 'NMC Recognized • 1200-Bed Teaching Hospital'
    : isUniversity
    ? 'Established University • Multi-Faculty & Research Center'
    : 'AICTE Approved • NBA Accredited Tier-1';
  const headingClass = heroStyles.headingClass;
  const primaryBtnClass = heroStyles.primaryBtnClass;
  const checkColor = heroStyles.checkColor;
  const CardCrestIcon = isArtsAndScience ? BookOpen : isMedical ? HeartPulse : isUniversity ? GraduationCap : Cpu;
  const cardIconClass = heroStyles.cardIconClass;
  const cardSubtitleColor = heroStyles.cardSubtitleColor;
  const rightCardBorder = heroStyles.rightCardBorder;

  return (
    <div 
      className="public-hero-section relative text-white overflow-hidden bg-slate-950 h-[560px] sm:h-[600px] lg:h-[640px] flex items-center"
      style={{ backgroundColor: '#020617', color: '#ffffff' }}
    >
      {/* Background Image with directional visibility gradient */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={bgImage}
          alt={heading}
          className={`w-full h-full object-cover object-center ${heroStyles.imageOpacity} transition-opacity duration-700`}
          onError={(e) => {
            (e.target as HTMLImageElement).src = defaultLocalBg;
          }}
        />
        {/* Left-to-right gradient: deep dark on text side, clear photo on right */}
        <div className="absolute inset-0 pointer-events-none" style={heroStyles.overlayGradient} />
        {/* Subtle top/bottom vignette */}
        <div className="absolute inset-0 pointer-events-none" style={heroStyles.vignetteStyle} />
      </div>

      {/* Main Hero Content - Expanded to max-w-screen-2xl */}
      <div className="relative max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-16 py-10 lg:py-16 w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Heading, Badge, Description & CTAs */}
          <div className={`${showCard ? 'lg:col-span-7 xl:col-span-8' : 'lg:col-span-12 max-w-4xl'} space-y-5`}>
            <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border shadow-sm backdrop-blur-md ${badgeClass}`}>
              <Sparkles className={`w-3.5 h-3.5 ${badgeIconClass}`} />
              <span>{bannerBadgeText || content.badge || defaultBadgeText}</span>
            </div>

            <h1 
              className={`text-2xl sm:text-4xl lg:text-5xl leading-tight drop-shadow-md line-clamp-2 ${headingClass}`}
              style={{ textShadow: '0 3px 12px rgba(0,0,0,0.85)' }}
            >
              {heading}
            </h1>

            {description && (
              <p 
                className={`text-base sm:text-lg text-slate-200 leading-relaxed max-w-2xl font-normal drop-shadow-sm line-clamp-2 ${isArtsAndScience ? 'font-serif' : ''}`}
                style={{ color: '#e2e8f0', textShadow: '0 1px 6px rgba(0,0,0,0.7)' }}
              >
                {description}
              </p>
            )}

            {(primaryBtnText || secondaryCtaText || content.secondaryCtaText) && (
              <div className="flex flex-wrap items-center gap-4 pt-2">
                {primaryBtnText && (
                  <Link
                    to={primaryBtnUrl || '/courses'}
                    className={`inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm shadow-xl transition transform hover:-translate-y-0.5 ${primaryBtnClass}`}
                  >
                    <span>{primaryBtnText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}

                {secondaryCtaText ? (
                  <Link
                    to={secondaryCtaUrl || '/contact'}
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm text-white/90 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 transition"
                  >
                    <span>{secondaryCtaText}</span>
                  </Link>
                ) : content.secondaryCtaText ? (
                  <Link
                    to={content.secondaryCtaLink || '/about'}
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm text-white/90 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 transition"
                  >
                    <span>{content.secondaryCtaText}</span>
                  </Link>
                ) : isMedical ? (
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-rose-600 hover:bg-rose-500 shadow-xl shadow-rose-900/30 border border-rose-500/40 transition"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>24/7 Emergency Casualty</span>
                  </Link>
                ) : isArtsAndScience ? (
                  <Link
                    to="/about"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-serif font-semibold text-sm text-amber-200 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/30 transition"
                  >
                    <span>Institutional Heritage & Dean</span>
                  </Link>
                ) : null}
              </div>
            )}

            {/* Banner Slider Navigation Dots (if multiple banners) */}
            {activeBanners.length > 1 && (
              <div className="flex items-center gap-2 pt-1">
                {activeBanners.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlideIndex(i)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      i === currentSlideIndex 
                        ? (isArtsAndScience ? 'w-8 bg-emerald-400' : isMedical ? 'w-8 bg-cyan-400' : 'w-8 bg-amber-400')
                        : 'w-2 bg-white/40 hover:bg-white/70'
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
            )}

            {/* Quick Institutional Pillars — driven by CMS content.pillars */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-slate-300 border-t border-white/10 max-w-2xl">
              {pillars.map((pillar: string) => (
                <div key={pillar} className="flex items-center gap-2">
                  <CheckCircle2 className={`w-4 h-4 shrink-0 ${checkColor}`} />
                  <span className={isArtsAndScience ? 'font-serif' : ''}>{pillar}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Dynamic Frosted-Glass Campus Highlights / Admissions Card */}
          {showCard && (
            <div className="lg:col-span-5 xl:col-span-4">
              <div 
                className={`backdrop-blur-xl border rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 text-white ${rightCardBorder}`}
                style={{ backgroundColor: 'rgba(2, 6, 23, 0.85)', color: '#ffffff' }}
              >
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${cardIconClass}`}>
                      <CardCrestIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className={`text-sm font-extrabold text-white leading-tight ${isArtsAndScience ? 'font-serif' : ''}`}>{cardTitle}</h3>
                      <p className={`text-[11px] ${cardSubtitleColor}`}>{cardSubtitle}</p>
                    </div>
                  </div>
                  {cardBadge && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {cardBadge}
                    </span>
                  )}
                </div>

                <div className="space-y-3.5 text-xs text-slate-200">
                  {cardItems.map((item, idx) => {
                    const IconComp = idx === 0 ? Award : idx === 1 ? Building2 : Users;
                    return (
                      <div key={idx} className="flex items-start gap-3">
                        <IconComp className={`w-4 h-4 shrink-0 mt-0.5 ${checkColor}`} />
                        <div>
                          <p className={`font-bold text-white ${isArtsAndScience ? 'font-serif' : ''}`}>{item.title}</p>
                          {item.desc && <p className="text-[11px] text-slate-300">{item.desc}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {(content.cardPrimaryButtonText || content.cardSecondaryButtonText) && (
                  <div className="pt-2 flex flex-col gap-2">
                    {content.cardPrimaryButtonText && (
                      <Link
                        to={content.cardPrimaryButtonUrl || '/admissions'}
                        className={`w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-extrabold text-xs transition shadow-md ${primaryBtnClass}`}
                      >
                        <span>{content.cardPrimaryButtonText}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                    {content.cardSecondaryButtonText && (
                      <Link
                        to={content.cardSecondaryButtonUrl || '/courses'}
                        className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-xs text-white/90 hover:text-white bg-white/10 hover:bg-white/15 border border-white/15 transition"
                      >
                        <span>{content.cardSecondaryButtonText}</span>
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};


