import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, ArrowRight, BookOpen, Stethoscope, Landmark, ShieldCheck } from 'lucide-react';
import { apiClient } from '../../services/apiClient';
import { SectionError } from './SectionError';
import { useTheme, useTemplateTheme } from '../../themes/ThemeContext';

interface DeptItem {
  name: string;
  code?: string;
  headOfDepartment?: string;
  description?: string;
  imageUrl?: string;
}

interface DepartmentsProps {
  content: {
    title?: string;
    subtitle?: string;
    departments?: DeptItem[];
  };
}

export const DepartmentsSection: React.FC<DepartmentsProps> = ({ content }) => {
  const { isArtsAndScience, isMedical, isUniversity } = useTheme();
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
            setFetchedDepts(res.data.data.slice(0, 3).map((d: any) => ({
              name: d.name,
              code: d.code,
              headOfDepartment: d.headOfDepartment,
              description: d.description,
              imageUrl: d.imageUrl,
            })));
          }
        })
        .catch(() => setError('Unable to load departments. Please try again later.'))
        .finally(() => setLoading(false));
    }
  }, [content.departments]);

  const depts = content.departments && content.departments.length > 0 ? content.departments : fetchedDepts;
  if (error && !loading) {
    return <SectionError message={error} className="bg-slate-950 text-white" />;
  }
  if (!loading && depts.length === 0) return null;

  const BadgeIcon = isArtsAndScience ? BookOpen : isMedical ? Stethoscope : isUniversity ? Landmark : Building2;

  const isCenterAligned = isArtsAndScience || isUniversity;

  return (
    <section className={deptStyles.sectionBg}>
      <div className="max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-16">
        
        {/* Header */}
        {isCenterAligned ? (
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3 flex flex-col items-center">
            <div className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold ${deptStyles.sectionHeaderBadge}`}>
              <BadgeIcon className="w-3.5 h-3.5" />
              <span>{isArtsAndScience ? 'Arts, Science & Humanities' : 'University Schools & Colleges'}</span>
            </div>
            <h2 className={deptStyles.headingFont}>
              {content.title || (isUniversity ? 'Faculties & Research Schools' : 'Departments & Academic Schools')}
            </h2>
            {content.subtitle && (
              <p className={`${deptStyles.subtitleFont} max-w-2xl mx-auto`}>
                {content.subtitle}
              </p>
            )}
            <Link
              to="/departments"
              className={`inline-flex items-center gap-1.5 text-xs font-bold pt-1 ${deptStyles.accentText}`}
            >
              <span>All Departments</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold mb-2.5 ${deptStyles.sectionHeaderBadge}`}>
                <BadgeIcon className="w-3.5 h-3.5" />
                <span>{isMedical ? 'Medical & Clinical Faculties' : 'Academic Divisions'}</span>
              </div>
              <h2 className={deptStyles.headingFont}>
                {content.title || (isMedical ? 'Clinical Departments & Specialty Wings' : 'Departments & Academic Schools')}
              </h2>
              {content.subtitle && (
                <p className={deptStyles.subtitleFont}>
                  {content.subtitle}
                </p>
              )}
            </div>
            <Link
              to="/departments"
              className={`inline-flex items-center gap-1.5 text-xs font-bold self-start md:self-auto ${deptStyles.accentText}`}
            >
              <span>All Departments</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* 3-Column Departments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {depts.map((d, idx) => (
            <div
              key={idx}
              className={`${deptStyles.cardBg} ${deptStyles.cardBorder} ${deptStyles.cardHover} flex flex-col justify-between`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${deptStyles.iconBg}`}>
                    <BadgeIcon className="w-5 h-5" />
                  </div>
                  {d.code && (
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase ${deptStyles.tagBadge}`}>
                      {d.code}
                    </span>
                  )}
                </div>

                <h3 className={`text-xl font-bold leading-snug ${isArtsAndScience || isUniversity ? 'font-serif' : ''}`}>
                  {d.name}
                </h3>

                {d.description && (
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                    {d.description}
                  </p>
                )}
              </div>

              {d.headOfDepartment && (
                <div className="pt-4 mt-5 border-t border-white/10 text-xs text-slate-400 flex items-center justify-between">
                  <div>
                    <span className="block text-[10px] uppercase font-bold tracking-wider opacity-60">Head of Department</span>
                    <span className="font-semibold text-slate-200">{d.headOfDepartment}</span>
                  </div>
                  <ShieldCheck className="w-4 h-4 text-emerald-400/80" />
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
