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
  highlight?: boolean;
  description?: string;
  year?: string | number;
}

interface StatisticsProps {
  content: {
    badge?: string;
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

const getDynamicGridClasses = (count: number) => {
  if (count <= 1) {
    return {
      wrapper: 'max-w-xs mx-auto',
      grid: 'grid grid-cols-1 gap-4',
    };
  }
  if (count === 2) {
    return {
      wrapper: 'max-w-[480px] sm:max-w-[520px] mx-auto',
      grid: 'grid grid-cols-2 gap-4 sm:gap-5',
    };
  }
  if (count === 3) {
    return {
      wrapper: 'max-w-[720px] sm:max-w-[760px] mx-auto',
      grid: 'grid grid-cols-1 sm:grid-cols-3 gap-4',
    };
  }
  if (count === 4) {
    return {
      wrapper: 'max-w-5xl mx-auto',
      grid: 'grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5',
    };
  }
  if (count === 5) {
    return {
      wrapper: 'max-w-6xl mx-auto',
      grid: 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4',
    };
  }
  // Unlimited statistics (6, 8, 10, 12+) with automatic 4-column multi-row wrap
  return {
    wrapper: 'max-w-6xl mx-auto',
    grid: 'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5',
  };
};

const AnimatedStatValue: React.FC<{ value: string | number; suffix?: string; isVisible: boolean }> = ({ value, suffix, isVisible }) => {
  const rawStr = String(value ?? '');
  const match = rawStr.match(/^([^\d]*)([\d,.]+)(.*)$/);
  const prefix = match ? match[1] : '';
  const numStr = match ? match[2].replace(/,/g, '') : '';
  const inlineSuffix = match ? match[3] : '';
  const targetNum = parseFloat(numStr);

  const [currentNum, setCurrentNum] = React.useState<number>(0);

  React.useEffect(() => {
    if (!isVisible || isNaN(targetNum)) return;
    let start = 0;
    const duration = 1200;
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = targetNum / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= targetNum) {
        setCurrentNum(targetNum);
        clearInterval(timer);
      } else {
        setCurrentNum(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [isVisible, targetNum]);

  if (isNaN(targetNum)) {
    return (
      <span>
        {rawStr}{suffix}
      </span>
    );
  }

  const formattedNum = isVisible 
    ? (targetNum % 1 === 0 ? currentNum.toLocaleString() : currentNum.toFixed(1)) 
    : '0';

  return (
    <span>
      {prefix}{formattedNum}{inlineSuffix}{suffix}
    </span>
  );
};

export const StatisticsSection: React.FC<StatisticsProps> = ({ content }) => {
  const { siteConfig } = useTenant();
  const { styles } = useTemplateTheme();
  const s = styles.statistics;

  const sectionRef = React.useRef<HTMLElement>(null);
  const [isInView, setIsInView] = React.useState(false);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

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

  const gridConfig = getDynamicGridClasses(stats.length);

  const sectionBadge = content.badge || siteConfig?.statsSettings?.badge || 'Key Metrics & Institutional Record';
  const sectionTitle = content.title || siteConfig?.statsSettings?.title || 'Campus at a Glance';
  const sectionSubtitle = content.subtitle !== undefined 
    ? content.subtitle 
    : (siteConfig?.statsSettings?.subtitle !== undefined ? siteConfig.statsSettings.subtitle : 'Excellence in Numbers');

  return (
    <section ref={sectionRef} className={`py-8 sm:py-10 relative overflow-hidden ${s.sectionBg}`}>
      {/* Template Background Pattern / Ambient Wash */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={s.bgPatternOverlay}
      />

      {/* 3D Slanted Parallelogram Band Accent (Narrowed & Shifted Right) */}
      <div 
        className="absolute top-0 right-0 bottom-0 w-5/12 bg-gradient-to-br from-[#134975]/85 via-[#0b3353]/90 to-[#134975]/80 pointer-events-none hidden md:block z-0"
        style={{ clipPath: 'polygon(50% 0, 100% 0, 50% 100%, 0% 100%)' }}
      >
        {/* Crisp Golden Slanted Edge Line */}
        <div 
          className="absolute inset-0 border-l-2 border-amber-400/60" 
          style={{ clipPath: 'polygon(50% 0, 51% 0, 1% 100%, 0% 100%)' }}
        />
        {/* Subtle Inner Micro Grid Texture */}
        <div className="absolute inset-0 opacity-[0.07] bg-[radial-gradient(#e5a912_1px,transparent_1px)] [background-size:16px_16px]" />
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className={`mb-6 sm:mb-8 space-y-2 ${s.headerAlignment}`}>
          {sectionBadge && (
            <div className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${s.headerBadge}`}>
              <Sparkles className="w-3 h-3" />
              <span>{sectionBadge}</span>
            </div>
          )}
          {sectionTitle && (
            <h2 className={`text-2xl sm:text-[32px] font-extrabold tracking-tight drop-shadow-xs leading-tight ${s.headerTitleFont}`}>
              {sectionTitle}
            </h2>
          )}
          {sectionSubtitle && (
            <p className={`text-xs sm:text-[14px] font-normal max-w-2xl mx-auto mt-1 ${s.headerSubtitleFont}`}>
              {sectionSubtitle}
            </p>
          )}
        </div>

        {/* Dynamic Balanced Grid Container */}
        <div className={gridConfig.wrapper}>
          <div className={gridConfig.grid}>
            {stats.map((st, idx) => {
              const Icon = getStatIcon(st.icon);
              return (
                <div 
                  key={idx} 
                  className={`relative overflow-hidden group min-h-[125px] sm:min-h-[130px] p-4 sm:p-[18px] rounded-[14px] flex flex-col items-center justify-center text-center transition-all duration-200 transform hover:-translate-y-1 ${s.cardBg || 'bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 shadow-[0_4px_14px_rgba(15,23,42,0.05)] hover:shadow-[0_10px_24px_rgba(15,23,42,0.09)]'}`}
                >
                  {/* Top Accent Inset Bar */}
                  {s.cardTopAccent && (
                    <div className={`absolute top-0 left-5 right-5 h-[3px] rounded-b-[6px] ${s.cardTopAccent}`} />
                  )}

                  {/* Stat Icon Box */}
                  <div className={`w-[38px] h-[38px] rounded-[10px] flex items-center justify-center mb-2.5 shrink-0 transition-transform duration-200 group-hover:scale-105 ${s.iconBox || 'bg-blue-50 border border-blue-200 text-blue-600'}`}>
                    <Icon className="w-[18px] h-[18px] stroke-[2.2]" />
                  </div>

                  {/* Value / Number */}
                  <div className={`flex items-baseline justify-center tracking-[-0.04em] ${s.valueFont || 'font-sans font-extrabold text-[26px] sm:text-[28px] text-slate-900 dark:text-white leading-none'}`}>
                    <AnimatedStatValue 
                      value={st.value} 
                      suffix={st.suffix} 
                      isVisible={isInView} 
                    />
                  </div>

                  {/* Label */}
                  <div className={`mt-1.5 uppercase tracking-[0.08em] line-clamp-1 ${s.labelFont || 'font-sans text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400'}`}>
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
