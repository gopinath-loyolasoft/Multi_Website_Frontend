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
  const { isArtsAndScience, isMedical, isUniversity } = useTheme();
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

  const TagIcon = isArtsAndScience ? BookOpen : isMedical ? HeartPulse : isUniversity ? GraduationCap : Award;

  return (
    <section className={courseStyles.sectionBg}>
      <div className="max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-16">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold mb-2.5 ${courseStyles.sectionHeaderBadge}`}>
              <TagIcon className="w-3.5 h-3.5" />
              <span>{isMedical ? 'Medical & Health Degree Programs' : isArtsAndScience ? 'Humanities & Pure Science Programs' : isUniversity ? 'Faculties & Degree Programs' : 'Degree Programs'}</span>
            </div>
            <h2 className={courseStyles.headingFont}>
              {content.title || (isUniversity ? 'University Curricula & Degrees' : isMedical ? 'Clinical & Medical Degrees' : 'Explore Academic Programs')}
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
            <span>View All Programs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 4-Column Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((c, idx) => (
            <div
              key={idx}
              className={`${courseStyles.cardBg} ${courseStyles.cardBorder} flex flex-col justify-between`}
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between gap-2">
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${courseStyles.badge}`}>
                    {c.degreeLevel || 'Degree'}
                  </span>
                  {c.duration && (
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                      <Clock className="w-3 h-3" />
                      <span>{c.duration}</span>
                    </span>
                  )}
                </div>

                <h3 className={`text-base font-bold leading-snug ${isArtsAndScience || isUniversity ? 'font-serif' : ''}`}>
                  {c.name}
                </h3>

                {c.description && (
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                    {c.description}
                  </p>
                )}
              </div>

              <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-400">
                  {c.department || 'Academic School'}
                </span>
                <Link
                  to="/admissions"
                  className={`text-xs font-bold flex items-center gap-1 px-3 py-1.5 rounded-lg ${courseStyles.primaryBtn}`}
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
