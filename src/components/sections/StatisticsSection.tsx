import React from 'react';
import { 
  GraduationCap, 
  Users, 
  Award, 
  BookOpen, 
  Building2, 
  Trophy, 
  Briefcase, 
  FileCheck, 
  TrendingUp,
  Globe,
  Sparkles,
  ShieldCheck,
  Target,
  Clock
} from 'lucide-react';
import { useTenant } from '../../tenant/TenantContext';

interface StatItem {
  label: string;
  value: string | number;
  suffix?: string;
  icon?: string;
}

interface StatisticsProps {
  content: {
    title?: string;
    subtitle?: string;
    stats?: StatItem[];
  };
}

const getStatIcon = (iconName?: string) => {
  switch ((iconName || '').toLowerCase().replace(/[-_]/g, '')) {
    case 'users':
    case 'students':
    case 'community':
      return Users;
    case 'award':
    case 'honor':
    case 'faculty':
      return Award;
    case 'bookopen':
    case 'book':
    case 'courses':
    case 'academics':
      return BookOpen;
    case 'building2':
    case 'building':
    case 'campus':
    case 'infrastructure':
      return Building2;
    case 'trophy':
    case 'achievement':
      return Trophy;
    case 'briefcase':
    case 'career':
    case 'jobs':
      return Briefcase;
    case 'filecheck':
    case 'accreditation':
    case 'audit':
      return FileCheck;
    case 'trendingup':
    case 'growth':
    case 'placement':
    case 'rank':
      return TrendingUp;
    case 'globe':
    case 'global':
    case 'international':
      return Globe;
    case 'sparkles':
    case 'innovation':
    case 'excellence':
      return Sparkles;
    case 'shieldcheck':
    case 'shield':
    case 'security':
      return ShieldCheck;
    case 'target':
    case 'goals':
      return Target;
    case 'clock':
    case 'history':
      return Clock;
    case 'graduationcap':
    case 'alumni':
    case 'degrees':
    default:
      return GraduationCap;
  }
};

export const StatisticsSection: React.FC<StatisticsProps> = ({ content }) => {
  const { siteConfig } = useTenant();

  const stats: StatItem[] = (content.stats && content.stats.length > 0)
    ? content.stats
    : (siteConfig?.stats && siteConfig.stats.length > 0)
    ? siteConfig.stats.filter((s: any) => s.isActive !== false).map((s: any) => ({
        label: s.label || '',
        value: s.value !== undefined ? ((s.prefix || '') + s.value) : (s.metric || ''),
        suffix: s.suffix || '',
        icon: s.iconName || s.icon || 'GraduationCap',
      }))
    : [];

  if (stats.length === 0) return null;

  return (
    <section className="py-6 sm:py-8 relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50/70 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border-y border-slate-200/70 dark:border-slate-800/70">
      {/* Dynamic Template Ambient Radial Wash */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-20"
        style={{
          background: 'radial-gradient(circle at 50% 15%, var(--primary-color, #1e40af) 0%, transparent 65%)',
          filter: 'blur(70px)',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header (Adaptive to all templates) */}
        {(content.title || content.subtitle) && (
          <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8 space-y-1.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-widest bg-primary/10 text-primary border border-primary/20">
              Key Metrics & Impact
            </span>
            {content.title && (
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                {content.title}
              </h2>
            )}
            {content.subtitle && (
              <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                {content.subtitle}
              </p>
            )}
          </div>
        )}

        {/* Elevated Floating Ribbon - Universal across Arts, Engineering, Medical */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl shadow-lg shadow-slate-200/50 dark:shadow-slate-950/60 border border-slate-200/80 dark:border-slate-800 overflow-hidden">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 dark:divide-slate-800/80">
            {stats.map((st, idx) => {
              const Icon = getStatIcon(st.icon);
              return (
                <div
                  key={idx}
                  className="py-4 sm:py-5 px-3 sm:px-6 flex flex-col items-center text-center group hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-all duration-300 relative"
                >
                  {/* Top highlight accent on hover */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-transparent group-hover:bg-primary transition-all duration-300" />

                  {/* Icon Squircle with dynamic template primary color */}
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center mb-2.5 group-hover:scale-105 group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
                  </div>

                  {/* Stat Metric & Value - Always geometric modern sans-serif */}
                  <div 
                    className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-none flex items-baseline"
                    style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
                  >
                    <span>{st.value}</span>
                    {st.suffix && (
                      <span className="text-secondary font-black ml-0.5 group-hover:text-primary transition-colors">
                        {st.suffix}
                      </span>
                    )}
                  </div>

                  {/* Stat Label */}
                  <div className="text-[11px] sm:text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mt-1.5 max-w-[190px]">
                    {st.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
