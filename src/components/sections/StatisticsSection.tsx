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
  Clock, 
  HeartPulse, 
  Activity, 
  Cpu, 
  Landmark, 
  Scale 
} from 'lucide-react';
import { useTenant } from '../../tenant/TenantContext';
import { useTemplateTheme } from '../../themes/ThemeContext';

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
    case 'heartpulse':
    case 'medical':
      return HeartPulse;
    case 'activity':
      return Activity;
    case 'cpu':
    case 'tech':
      return Cpu;
    case 'landmark':
      return Landmark;
    case 'scale':
      return Scale;
    case 'graduationcap':
    case 'alumni':
    case 'degrees':
    default:
      return GraduationCap;
  }
};

export const StatisticsSection: React.FC<StatisticsProps> = ({ content }) => {
  const { siteConfig } = useTenant();
  const { styles } = useTemplateTheme();
  const s = styles.statistics;

  const stats: StatItem[] = (content.stats && content.stats.length > 0)
    ? content.stats
    : (siteConfig?.stats && siteConfig.stats.length > 0)
    ? siteConfig.stats.filter((st: any) => st.isActive !== false).map((st: any) => ({
        label: st.label || '',
        value: st.value !== undefined ? ((st.prefix || '') + st.value) : (st.metric || ''),
        suffix: st.suffix || '',
        icon: st.iconName || st.icon || 'GraduationCap',
      }))
    : [];

  if (stats.length === 0) return null;

  return (
    <section className={`py-14 sm:py-16 relative overflow-hidden ${s.sectionBg}`}>
      {/* Template Background Pattern / Ambient Wash */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={s.bgPatternOverlay}
      />

      <div className="max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
        
        {/* Section Header */}
        <div className="mb-10 space-y-2">
          <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${s.headerBadge}`}>
            <Sparkles className="w-3.5 h-3.5" />
            <span>Key Metrics & Institutional Record</span>
          </div>
          <h2 className={`text-2xl sm:text-4xl drop-shadow-md ${s.headerTitleFont}`}>
            {content.title || 'Campus at a Glance — Excellence in Numbers'}
          </h2>
          {content.subtitle && (
            <p className={`text-sm max-w-2xl ${s.headerSubtitleFont}`}>
              {content.subtitle}
            </p>
          )}
        </div>

        {/* Statistics Cards / Container */}
        <div className={s.cardContainer}>
          {stats.map((st, idx) => {
            const Icon = getStatIcon(st.icon);
            return (
              <div key={idx} className={s.cardBg}>
                {/* Optional Top Edge Accent */}
                {s.cardTopAccent && (
                  <div className={`absolute top-0 left-0 right-0 h-1 ${s.cardTopAccent}`} />
                )}

                <div className={s.iconBox}>
                  <Icon className="w-6 h-6 stroke-[2]" />
                </div>

                <div className={`flex items-baseline ${s.valueFont}`}>
                  <span>{st.value}</span>
                  {st.suffix && <span className={s.suffixFont}>{st.suffix}</span>}
                </div>

                <div className={s.labelFont}>
                  {st.label}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
