import React from 'react';
import { useActiveTemplate } from '../../templates/templateRegistry';
import { useTenant } from '../../tenant/TenantContext';
import { PlacementPartnersSection } from '../../components/sections/PlacementPartnersSection';
import { Briefcase } from 'lucide-react';

export const PlacementsPage: React.FC = () => {
  const Template = useActiveTemplate();
  const { siteConfig } = useTenant();

  const headerConfig =
    siteConfig?.settings?.socialLinks?.pageHeaders?.placements ||
    siteConfig?.settings?.pageHeaders?.placements;

  const badgeText = headerConfig?.badge || 'Corporate Relations & Careers';
  const titleText = headerConfig?.title || 'Training & Placement Cell';
  const subtitleText =
    headerConfig?.subtitle ||
    'Empowering graduates with career acceleration, tier-1 campus recruitments, industry internships, and world-class packages.';

  return (
    <div className={`min-h-screen ${Template.config.bodyBgClass}`}>
      <Template.PageHero
        badge={badgeText}
        title={titleText}
        subtitle={subtitleText}
        icon={<Briefcase className="w-4 h-4 text-amber-300" />}
      />

      {/* ── PLACEMENT PARTNERS RIGHT-TO-LEFT LOGO MARQUEE SECTION ── */}
      <PlacementPartnersSection />
    </div>
  );
};
