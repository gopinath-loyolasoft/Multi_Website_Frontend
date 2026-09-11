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
  const { isArtsAndScience, isMedical, isEngineering, isUniversity } = useTheme();
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
    return <SectionError message={error} className="bg-slate-50 dark:bg-slate-950" />;
  }
  if (!loading && depts.length === 0) return null;

  // Template Visual Configurations
  const BadgeIcon = isArtsAndScience ? BookOpen : isMedical ? Stethoscope : isUniversity ? Landmark : Building2;

  const tagClass = deptStyles.tagBadge;
  const headingFont = deptStyles.headingFont;
  const cardBorderClass = `${deptStyles.cardBorder} ${deptStyles.cardHover}`;
  const iconBoxClass = deptStyles.iconBg;
  const linkTextClass = deptStyles.accentText;

  return (
    <section className="py-16 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold mb-2.5 ${tagClass}`}>
              <BadgeIcon className="w-3.5 h-3.5" />
              <span>{isMedical ? 'Medical & Clinical Faculties' : isArtsAndScience ? 'Arts, Science & Humanities' : isUniversity ? 'University Schools & Colleges' : 'Academic Divisions'}</span>
            </div>
            <h2 className={`text-3xl sm:text-4xl text-slate-900 dark:text-white tracking-tight ${headingFont}`}>
              {content.title || (isUniversity ? 'Faculties & Research Schools' : isMedical ? 'Clinical Departments & Specialty Wings' : 'Departments & Academic Schools')}
            </h2>
            {content.subtitle && (
              <p className={`text-sm text-slate-600 dark:text-slate-400 mt-1.5 max-w-2xl ${isArtsAndScience || isUniversity ? 'font-serif' : ''}`}>
                {content.subtitle}
              </p>
            )}
          </div>
          <Link
            to="/departments"
            className={`inline-flex items-center gap-1.5 text-xs font-bold hover:underline self-start md:self-auto ${linkTextClass}`}
          >
            <span>All Departments</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {depts.map((d, idx) => (
            <div
              key={idx}
              className={`bg-white dark:bg-slate-900 p-6 border shadow-sm hover:shadow-xl transition duration-300 flex flex-col justify-between ${cardBorderClass}`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${iconBoxClass}`}>
                    <BadgeIcon className="w-5 h-5" />
                  </div>
                  {d.code && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {d.code}
                    </span>
                  )}
                </div>

                <h3 className={`text-xl font-bold text-slate-900 dark:text-white leading-snug ${isArtsAndScience || isUniversity ? 'font-serif' : ''}`}>
                  {d.name}
                </h3>

                {d.description && (
                  <p className={`text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3 ${isArtsAndScience ? 'font-serif' : ''}`}>
                    {d.description}
                  </p>
                )}
              </div>

              {d.headOfDepartment && (
                <div className="pt-4 mt-5 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-500 flex items-center justify-between">
                  <div>
                    <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-400">Head of Department</span>
                    <span className={`font-semibold text-slate-800 dark:text-slate-200 ${isArtsAndScience || isUniversity ? 'font-serif' : ''}`}>{d.headOfDepartment}</span>
                  </div>
                  <ShieldCheck className="w-4 h-4 text-emerald-500/60" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
