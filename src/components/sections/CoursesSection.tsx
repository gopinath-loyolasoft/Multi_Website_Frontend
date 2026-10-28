import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, ArrowRight, Award, GraduationCap, HeartPulse } from 'lucide-react';
import { apiClient } from '../../services/apiClient';
import { SectionError } from './SectionError';
import { useTheme, useTemplateTheme } from '../../themes/ThemeContext';

interface CourseItem {
  name: string;
  degreeLevel?: string;
  duration?: string;
  department?: string;
  description?: string;
  eligibility?: string;
  code?: string;
}

interface CoursesProps {
  content: {
    title?: string;
    subtitle?: string;
    limit?: number;
    courses?: CourseItem[];
  };
}

export const CoursesSection: React.FC<CoursesProps> = ({ content }) => {
  const { styles } = useTemplateTheme();
  const courseStyles = styles.courses;

  const [fetchedCourses, setFetchedCourses] = React.useState<CourseItem[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!content.courses || content.courses.length === 0) {
      setLoading(true);
      apiClient.get('/site/courses')
        .then((res) => {
          if (res.data.success && Array.isArray(res.data.data)) {
            setFetchedCourses(res.data.data.slice(0, content.limit || 4).map((c: any) => ({
              name: c.name,
              degreeLevel: c.degreeLevel,
              duration: c.durationYears ? `${c.durationYears} Years` : undefined,
              department: c.departmentName || c.department?.name,
              description: c.description,
              eligibility: c.eligibility,
              code: c.code,
            })));
          }
        })
        .catch(() => setError('Unable to load courses. Please try again later.'))
        .finally(() => setLoading(false));
    }
  }, [content.courses, content.limit]);

  const courses = content.courses && content.courses.length > 0 ? content.courses : fetchedCourses;
  if (error && !loading) {
    return <SectionError message={error} className="bg-slate-950 text-white" />;
  }
  if (!loading && courses.length === 0) return null;

  const isCenterAligned = courseStyles.isCentered ?? false;

  return (
    <section className={`py-8 sm:py-10 ${courseStyles.sectionBg}`}>
      <div className="max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-16">
        
        {/* Header */}
        {isCenterAligned ? (
          <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8 space-y-2 flex flex-col items-center">
            <div className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold ${courseStyles.sectionHeaderBadge}`}>
              <BookOpen className="w-3.5 h-3.5" />
              <span>{courseStyles.defaultBadgeText || 'Courses & Programs'}</span>
            </div>
            <h2 className={courseStyles.headingFont}>
              {content.title || courseStyles.defaultTitle || 'Explore Courses & Programs'}
            </h2>
            {content.subtitle && (
              <p className={`${courseStyles.subtitleFont} max-w-2xl mx-auto`}>
                {content.subtitle}
              </p>
            )}
            <Link
              to="/courses"
              className={`inline-flex items-center gap-1.5 text-xs font-bold pt-0.5 ${courseStyles.accentText}`}
            >
              <span>View All Courses &amp; Programs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-8 gap-3">
            <div>
              <div className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold mb-1.5 ${courseStyles.sectionHeaderBadge}`}>
                <Award className="w-3.5 h-3.5" />
                <span>{courseStyles.defaultBadgeText || 'Courses & Programs'}</span>
              </div>
              <h2 className={courseStyles.headingFont}>
                {content.title || courseStyles.defaultTitle || 'Explore Courses & Programs'}
              </h2>
              {content.subtitle && (
                <p className={courseStyles.subtitleFont}>
                  {content.subtitle}
                </p>
              )}
            </div>
            <Link
              to="/courses"
              className={`inline-flex items-center gap-1.5 text-xs font-bold self-start md:self-auto ${courseStyles.accentText}`}
            >
              <span>View All Courses &amp; Programs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* 4-Column Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {courses.map((c, idx) => (
            <div
              key={idx}
              className={`${courseStyles.cardBg} ${courseStyles.cardBorder} ${courseStyles.cardHover || ''} rounded-xl p-4 sm:p-5 flex flex-col justify-between shadow-xs hover:shadow-lg transition duration-300`}
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${courseStyles.badge}`}>
                    {c.degreeLevel || 'Degree'}
                  </span>
                  {c.duration && (
                    <span className="text-[11px] opacity-70 flex items-center gap-1 font-medium">
                      <Clock className="w-3 h-3" />
                      <span>{c.duration}</span>
                    </span>
                  )}
                </div>

                <h3 className={`text-sm sm:text-base font-bold leading-snug ${courseStyles.headingFont ? 'font-inherit' : ''}`}>
                  {c.name}
                </h3>

                {c.description && (
                  <p className="text-xs opacity-75 leading-relaxed line-clamp-2">
                    {c.description}
                  </p>
                )}
              </div>

              <div className="pt-3 mt-3 border-t border-current/10 flex items-center justify-between">
                <span className="text-[11px] font-semibold opacity-70 truncate max-w-[120px]">
                  {c.department || 'Academic School'}
                </span>
                <Link
                  to="/admissions"
                  className={`text-xs font-bold flex items-center gap-1 px-2.5 py-1 rounded-lg ${courseStyles.primaryBtn}`}
                >
                  <span>Apply</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
