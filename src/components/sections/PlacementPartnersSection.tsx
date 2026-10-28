import React, { useEffect, useState } from 'react';
import { Briefcase, Building2, TrendingUp, Award, ExternalLink } from 'lucide-react';
import { apiClient } from '../../services/apiClient';

interface PlacementCompany {
  id: string;
  companyName: string;
  companyLogoUrl: string;
  companyWebsite?: string;
  displayOrder?: number;
}

const DEFAULT_PARTNERS: PlacementCompany[] = [
  { id: '1', companyName: 'Infosys', companyLogoUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg', companyWebsite: 'https://www.infosys.com' },
  { id: '2', companyName: 'TCS', companyLogoUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Tata_Consultancy_Services_Logo.svg', companyWebsite: 'https://www.tcs.com' },
  { id: '3', companyName: 'Wipro', companyLogoUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Wipro_Primary_Logo_Color_RGB.svg', companyWebsite: 'https://www.wipro.com' },
  { id: '4', companyName: 'Accenture', companyLogoUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/cd/Accenture.svg', companyWebsite: 'https://www.accenture.com' },
  { id: '5', companyName: 'Cognizant', companyLogoUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/22/Cognizant_logo_2022.svg', companyWebsite: 'https://www.cognizant.com' },
  { id: '6', companyName: 'IBM', companyLogoUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg', companyWebsite: 'https://www.ibm.com' },
  { id: '7', companyName: 'HCL Tech', companyLogoUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/HCL_Technologies_logo.svg', companyWebsite: 'https://www.hcltech.com' },
  { id: '8', companyName: 'Capgemini', companyLogoUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Capgemini_2017_logo.svg', companyWebsite: 'https://www.capgemini.com' },
];

export const PlacementPartnersSection: React.FC = () => {
  const [companies, setCompanies] = useState<PlacementCompany[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await apiClient.get('/site/placement-companies');
        if (res.data.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
          setCompanies(res.data.data);
        } else {
          setCompanies(DEFAULT_PARTNERS);
        }
      } catch {
        setCompanies(DEFAULT_PARTNERS);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  const displayList = companies.length > 0 ? companies : DEFAULT_PARTNERS;
  // Duplicate list to create seamless infinite right-to-left marquee animation
  const marqueeItems = [...displayList, ...displayList, ...displayList];

  return (
    <section className="py-16 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-white relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* Section Header & Placement Summary Stats */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 inline-block">
            Placement Partners
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            Our Students Are Placed In Leading Organizations
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-medium">
            Building global careers through top corporate recruiter partnerships and career placement cell initiatives.
          </p>

          {/* Placement Stats Counter Pills */}
          <div className="pt-4 grid grid-cols-3 gap-3 max-w-xl mx-auto">
            <div className="bg-white/5 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 text-center">
              <span className="block text-lg sm:text-xl font-extrabold text-emerald-400">5000+</span>
              <span className="text-[10px] sm:text-xs text-slate-400 font-medium">Students Placed</span>
            </div>
            <div className="bg-white/5 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 text-center">
              <span className="block text-lg sm:text-xl font-extrabold text-blue-400">250+</span>
              <span className="text-[10px] sm:text-xs text-slate-400 font-medium">Top Recruiters</span>
            </div>
            <div className="bg-white/5 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 text-center">
              <span className="block text-lg sm:text-xl font-extrabold text-amber-400">95%</span>
              <span className="text-[10px] sm:text-xs text-slate-400 font-medium">Placement Rate</span>
            </div>
          </div>
        </div>

        {/* ── RIGHT-TO-LEFT INFINITE LOGO MARQUEE ANIMATION ── */}
        <div className="relative w-full overflow-hidden py-4 group">
          {/* Left/Right Fading Edge Overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-slate-950 to-transparent z-20 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-slate-950 to-transparent z-20 pointer-events-none" />

          {/* Continuous Marquee Track (Pauses on Hover) */}
          <div className="flex items-center space-x-6 animate-marquee group-hover:[animation-play-state:paused]">
            {marqueeItems.map((partner, index) => (
              <a
                key={`${partner.id}-${index}`}
                href={partner.companyWebsite || '#'}
                target={partner.companyWebsite ? '_blank' : '_self'}
                rel="noopener noreferrer"
                className="flex-none w-48 sm:w-56 h-24 sm:h-28 bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/80 p-4 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center justify-center space-y-1.5 group/card"
              >
                {partner.companyLogoUrl ? (
                  <img
                    src={partner.companyLogoUrl}
                    alt={partner.companyName}
                    className="max-h-12 max-w-full object-contain filter group-hover/card:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <Building2 className="w-8 h-8 text-slate-700" />
                )}
                <span className="text-xs font-bold text-slate-800 line-clamp-1">{partner.companyName}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
