import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, ArrowRight, ShieldCheck } from 'lucide-react';
import { apiClient } from '../../services/apiClient';
import { SectionError } from './SectionError';
import { useTemplateTheme } from '../../themes/ThemeContext';

interface DeptItem {
  id?: string | number;
  name: string;
  code?: string;
  headOfDepartment?: string;
  description?: string;
  imageUrl?: string;
  courses?: number;
  faculty?: number;
}

interface DepartmentsProps {
  content: {
    title?: string;
    subtitle?: string;
    badge?: string;
    departments?: DeptItem[];
  };
}

export const DepartmentsSection: React.FC<DepartmentsProps> = ({ content }) => {
  const { styles } = useTemplateTheme();
  const deptStyles = styles.departments;

  const [fetchedDepts, setFetchedDepts] = React.useState<DeptItem[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!content.departments || content.departments.length === 0) {
      setLoading(true);
      apiClient.get('/site/departments')
        .then((res) => {
          if (res.data.success && Array.isArray(res.data.data)) {
            setFetchedDepts(res.data.data.slice(0, 6).map((d: any) => ({
              id: d.id,
              name: d.name,
              code: d.code,
              headOfDepartment: d.headOfDepartment,
              description: d.description,
              imageUrl: d.imageUrl,
              courses: d.courses?.length,
              faculty: d.faculty?.length,
            })));
          }
        })
        .catch(() => setError('Unable to load departments. Please try again later.'))
        .finally(() => setLoading(false));
    }
  }, [content.departments]);

  const depts = (content.departments && content.departments.length > 0 ? content.departments : fetchedDepts).slice(0, 6);
  if (error && !loading) {
    return <SectionError message={error} className="bg-slate-950 text-white" />;
  }
  if (!loading && depts.length === 0) return null;

  const isCentered = deptStyles.isCentered ?? false;
  const badgeText = content.badge || deptStyles.defaultBadgeText || 'Academic Divisions';
  const titleText = content.title || deptStyles.defaultTitle || 'Departments & Academic Schools';
  const subtitleText = content.subtitle || deptStyles.defaultSubtitle;

  return (
    <section className={`py-8 sm:py-10 relative overflow-hidden ${deptStyles.sectionBg}`}>
      {/* Background Pattern Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={deptStyles.bgPatternOverlay || {
          backgroundImage: 'linear-gradient(135deg, rgba(229,169,18,0.04) 25%, transparent 25%), linear-gradient(225deg, rgba(229,169,18,0.04) 25%, transparent 25%)',
          backgroundSize: '30px 30px',
          opacity: 1,
        }}
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

      <div className="max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
        
        {/* Header Section */}
        {isCentered ? (
          <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8 space-y-2 flex flex-col items-center">
            {badgeText && (
              <div className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold ${deptStyles.sectionHeaderBadge}`}>
                <Building2 className="w-3.5 h-3.5" />
                <span>{badgeText}</span>
              </div>
            )}
            <h2 className={deptStyles.headingFont}>
              {titleText}
            </h2>
            {subtitleText && (
              <p className={`${deptStyles.subtitleFont} max-w-2xl mx-auto`}>
                {subtitleText}
              </p>
            )}
            {!deptStyles.showBottomCta && (
              <Link
                to="/departments"
                className={`inline-flex items-center gap-1 text-xs font-bold pt-0.5 ${deptStyles.accentText}`}
              >
                <span>All Departments</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        ) : (
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-8 gap-3">
            <div>
              {badgeText && (
                <div className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold mb-1.5 ${deptStyles.sectionHeaderBadge}`}>
                  <Building2 className="w-3.5 h-3.5" />
                  <span>{badgeText}</span>
                </div>
              )}
              <h2 className={deptStyles.headingFont}>
                {titleText}
              </h2>
              {subtitleText && (
                <p className={deptStyles.subtitleFont}>
                  {subtitleText}
                </p>
              )}
            </div>
            <Link
              to="/departments"
              className={`inline-flex items-center gap-1 text-xs font-bold self-start md:self-auto ${deptStyles.accentText}`}
            >
              <span>All Departments</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* Departments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {depts.map((d, idx) => (
            <Link
              key={d.id ?? idx}
              to={d.code || d.id ? `/departments/${d.code || d.id}` : '/departments'}
              className={`${deptStyles.cardBg} ${deptStyles.cardBorder} ${deptStyles.cardHover} rounded-xl p-4 sm:p-5 flex flex-col justify-between shadow-xs hover:shadow-lg transition duration-300 relative`}
            >
              {/* Optional Top Accent Bar */}
              {deptStyles.cardTopAccent && (
                <div className={`absolute top-0 left-0 right-0 h-1 ${deptStyles.cardTopAccent}`} />
              )}

              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 overflow-hidden ${deptStyles.iconBg}`}>
                    {d.imageUrl ? (
                      <img src={d.imageUrl} alt={d.name} className="w-full h-full object-cover" loading="lazy" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
                    ) : (
                      <Building2 className="w-4 h-4 stroke-[2]" />
                    )}
                  </div>
                  {d.code && (
                    <span className={deptStyles.tagBadge}>
                      {d.code}
                    </span>
                  )}
                </div>

                <h3 className={`text-sm sm:text-base font-bold leading-snug line-clamp-2 ${deptStyles.cardTitleFont || ''}`}>
                  {d.name}
                </h3>

                {d.description && (
                  <p className={`text-xs leading-relaxed line-clamp-2 ${deptStyles.cardDescFont || 'text-slate-500 dark:text-slate-400'}`}>
                    {d.description}
                  </p>
                )}
              </div>

              <div className="mt-3.5 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-2">
                <div>
                  {d.headOfDepartment ? (
                    <div>
                      <span className="block text-[9px] uppercase font-bold tracking-wider opacity-60">Head of Department</span>
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold truncate max-w-[140px] sm:max-w-[160px] inline-block">{d.headOfDepartment}</span>
                        <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      </div>
                    </div>
                  ) : (
                    <span className="text-[11px] opacity-60 italic">Academic Division</span>
                  )}
                </div>

                {deptStyles.showBottomCta && (
                  <span className={`inline-flex items-center gap-1 text-xs font-bold group/link shrink-0 ${deptStyles.accentText}`}>
                    <span>Explore</span>
                    <ArrowRight className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom Centered CTA */}
        {deptStyles.showBottomCta && (
          <div className="mt-6 sm:mt-8 text-center">
            <Link
              to="/departments"
              className={deptStyles.primaryBtn || "inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-primary text-white font-bold text-xs uppercase shadow-sm"}
            >
              <span>{deptStyles.bottomCtaText || "View All Academic Departments"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

      </div>
    </section>
  );
};
