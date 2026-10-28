import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Search, Clock, CheckCircle2, ArrowRight, Building2, AlertCircle, FileText, Download } from 'lucide-react';
import { apiClient } from '../../services/apiClient';
import { useActiveTemplate } from '../../templates/templateRegistry';
import { PdfDocumentViewerModal } from '../../components/common/PdfDocumentViewerModal';
import { TemplateCard } from '../../components/website/TemplateCard';
import { useTenant } from '../../tenant/TenantContext';
import { Course } from '../../types';

const DEFAULT_COURSE_IMAGES: Record<string, string> = {
  math: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop&q=80',
  cs: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
  commerce: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
  management: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=80',
  science: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop&q=80',
  engineering: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80',
  medical: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80',
  default: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80',
};

const getCourseFallbackImage = (courseName: string, deptName: string) => {
  const text = `${courseName} ${deptName}`.toLowerCase();
  if (text.includes('math') || text.includes('static') || text.includes('algebra') || text.includes('calculus')) {
    return DEFAULT_COURSE_IMAGES.math;
  }
  if (text.includes('computer') || text.includes('ai') || text.includes('data') || text.includes('tech') || text.includes('code') || text.includes('software')) {
    return DEFAULT_COURSE_IMAGES.cs;
  }
  if (text.includes('commerce') || text.includes('finance') || text.includes('accounting') || text.includes('b.com') || text.includes('m.com')) {
    return DEFAULT_COURSE_IMAGES.commerce;
  }
  if (text.includes('business') || text.includes('management') || text.includes('mba') || text.includes('bba')) {
    return DEFAULT_COURSE_IMAGES.management;
  }
  if (text.includes('engineering') || text.includes('mech') || text.includes('civil') || text.includes('robot')) {
    return DEFAULT_COURSE_IMAGES.engineering;
  }
  if (text.includes('medical') || text.includes('clinical') || text.includes('health') || text.includes('nursing')) {
    return DEFAULT_COURSE_IMAGES.medical;
  }
  if (text.includes('science') || text.includes('physics') || text.includes('chem') || text.includes('bio')) {
    return DEFAULT_COURSE_IMAGES.science;
  }
  return DEFAULT_COURSE_IMAGES.default;
};

export const CoursesPage: React.FC = () => {
  const { siteConfig } = useTenant();
  const Template = useActiveTemplate();
  const headerConfig = siteConfig?.settings?.socialLinks?.pageHeaders?.courses || siteConfig?.settings?.pageHeaders?.courses;

  const isSlanted =
    Template.config.code === 'DESIGN_3D_MODERN' ||
    Template.config.code === 'SALESIAN_SLANTED' ||
    Template.config.code === 'ARTS_SCIENCE_MODERN' ||
    Template.config.code === 'TEMPLATE2' ||
    Template.config.code === 'TEMPLATE_2';

  const badgeText = headerConfig?.badge || (isSlanted ? 'Curriculum & Degree Programs' : Template.config.code === 'MEDICAL_MODERN' ? 'Clinical & Medical Degrees' : Template.config.code === 'UNIVERSITY_MODERN' ? 'Multi-Disciplinary Curricula' : 'Courses & Programs');
  const titleText = headerConfig?.title || 'Courses & Programs';
  const subtitleText = headerConfig?.subtitle || 'Gain recognized degrees accredited by national and international bodies, empowered by experiential learning, cutting-edge labs, and corporate ecosystems.';
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('All Programs');
  const [activeViewer, setActiveViewer] = useState<{
    isOpen: boolean;
    title: string;
    url: string;
    subtitle?: string;
  }>({
    isOpen: false,
    title: '',
    url: '',
    subtitle: '',
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await apiClient.get('/site/courses');
        if (res.data.success && Array.isArray(res.data.data)) {
          const apiCourses = res.data.data.map((c: any) => ({
            ...c,
            departmentName: c.departmentName || c.department?.name,
            curriculumHighlights: c.curriculumHighlights,
            intake: c.intake,
          }));
          setCourses(apiCourses);
        } else {
          setCourses([]);
        }
      } catch (err) {
        console.error('Failed to load courses', err);
        setError('Unable to load courses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const availableLevels = React.useMemo(() => {
    const set = new Set<string>();
    courses.forEach((c) => {
      if (c.degreeLevel && c.degreeLevel.trim()) {
        set.add(c.degreeLevel.trim());
      }
    });
    return set.size > 0 ? ['All Programs', ...Array.from(set)] : [];
  }, [courses]);

  const filtered = courses.filter((c) => {
    const matchesLevel =
      selectedLevel === 'All Programs' ||
      c.degreeLevel?.toLowerCase() === selectedLevel.toLowerCase();
    const matchesSearch =
      !search.trim() ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      (c.departmentName && c.departmentName.toLowerCase().includes(search.toLowerCase()));
    return matchesLevel && matchesSearch;
  });

  const getDegreeBadgeColor = (level: string) => {
    const lower = level.toLowerCase();
    if (isSlanted) {
      return 'bg-[#134975] text-amber-300 border-[#134975] font-sans -skew-x-12';
    }
    if (Template.config.code === 'MEDICAL_MODERN') {
      return 'bg-teal-100/80 text-teal-900 border-teal-300';
    }
    if (Template.config.code === 'UNIVERSITY_MODERN') {
      return 'bg-rose-100/80 text-rose-900 border-rose-300 font-serif';
    }
    if (lower.includes('undergrad')) return 'bg-blue-50 text-blue-700 border-blue-200';
    if (lower.includes('postgrad')) return 'bg-purple-50 text-purple-700 border-purple-200';
    if (lower.includes('doctor')) return 'bg-amber-50 text-amber-800 border-amber-200';
    return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  };

  return (
    <div className={`min-h-screen ${Template.config.bodyBgClass}`}>
      {/* Dynamic Modular Template Page Hero */}
      <Template.PageHero
        badge={badgeText}
        title={titleText}
        subtitle={subtitleText}
        icon={<BookOpen className="w-4 h-4 text-amber-300" />}
      />

      {/* Filter & Search Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 relative z-20">
        <div className={`bg-white shadow-lg border p-4 sm:p-6 flex flex-col md:flex-row gap-4 items-center justify-between ${isSlanted ? 'border-[#e5a912]/50 rounded-sm' : 'rounded-2xl border-slate-200/80'}`}>
          {/* Level Filter Tabs */}
          {availableLevels.length > 1 ? (
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              {availableLevels.map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setSelectedLevel(lvl)}
                  className={`px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                    isSlanted ? '-skew-x-12 ' : 'rounded-xl '
                  } ${
                    selectedLevel === lvl
                      ? isSlanted
                        ? 'bg-[#134975] text-amber-300 shadow-md'
                        : 'bg-primary text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span className={isSlanted ? 'inline-block skew-x-12' : ''}>
                    {lvl}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Courses &amp; Programs ({filtered.length} Programs)
            </div>
          )}

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search program, code, or degree..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#134975]/20 focus:border-[#134975] ${isSlanted ? 'rounded-none border-l-4 border-l-[#e5a912]' : 'rounded-xl'}`}
            />
          </div>
        </div>
      </section>

      {/* Main Course Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className={`h-96 bg-slate-200 ${isSlanted ? 'rounded-none' : 'rounded-2xl'}`} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-red-200 p-8 max-w-md mx-auto">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
            <h3 className="font-bold text-red-700 text-lg">Something went wrong</h3>
            <p className="text-red-500 text-xs mt-1">{error}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 max-w-md mx-auto">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-800 text-lg">No programs found</h3>
            <p className="text-slate-500 text-xs mt-1">Try changing your search term or level filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filtered.map((course) => {
              const imageSrc = (course as any).imageUrl || (course as any).thumbnailUrl || getCourseFallbackImage(course.name, course.departmentName || '');

              return (
                <TemplateCard
                  key={course.id}
                  title={course.name}
                  categoryBadge={course.degreeLevel}
                  dateBadge={`${course.durationYears} Years Duration`}
                  subtitle={`🏛️ ${course.departmentName}`}
                  imageUrl={imageSrc}
                  imageAlt={course.name}
                  description={course.description}
                  linkTo="/admissions"
                  actionText="Apply Now"
                  tags={[course.code || 'Degree', `${course.durationYears}Y`]}
                >
                {/* Eligibility Box */}
                {course.eligibility && (
                  <div className="my-1.5 py-1 px-2.5 bg-amber-50/80 dark:bg-slate-800 border-l-3 border-amber-500 rounded-r-md">
                    <span className="block text-[9px] font-extrabold uppercase tracking-wider text-amber-900 dark:text-amber-300">
                      Eligibility
                    </span>
                    <p className="text-[11px] text-slate-800 dark:text-slate-200 font-medium leading-snug line-clamp-1">
                      {course.eligibility}
                    </p>
                  </div>
                )}

                {/* Curriculum & Semester Syllabi Highlights */}
                {course.semesterSyllabi && course.semesterSyllabi.length > 0 ? (
                  <div className="my-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 space-y-2">
                    <span className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Semester Syllabi ({course.semesterSyllabi.length} Semesters)
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {course.semesterSyllabi.slice(0, 4).map((sem, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            if (sem.pdfUrl) {
                              setActiveViewer({
                                isOpen: true,
                                title: `${course.name} - Semester ${sem.semester} Syllabus`,
                                url: sem.pdfUrl,
                                subtitle: sem.title || `Regulation ${course.regulationYear || '2024'}`
                              });
                            }
                          }}
                          className={`px-2 py-1 rounded text-[11px] font-semibold flex items-center gap-1 transition ${
                            sem.pdfUrl
                              ? 'bg-blue-50 dark:bg-slate-800 text-blue-700 dark:text-cyan-300 hover:bg-blue-100 border border-blue-200 dark:border-slate-700 cursor-pointer'
                              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          }`}
                          title={sem.pdfUrl ? `View Sem ${sem.semester} Syllabus` : 'No PDF attached'}
                        >
                          <FileText className="w-3 h-3 text-blue-500" />
                          <span>Sem {sem.semester}</span>
                        </button>
                      ))}
                      {course.semesterSyllabi.length > 4 && (
                        <span className="px-2 py-1 rounded text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-500">
                          +{course.semesterSyllabi.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                ) : course.syllabusPdfUrl ? (
                  <div className="my-3 pt-2.5 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveViewer({
                          isOpen: true,
                          title: `${course.name} Complete Syllabus`,
                          url: course.syllabusPdfUrl!,
                          subtitle: `Curriculum Document • ${course.code}`
                        });
                      }}
                      className="w-full py-1.5 px-3 rounded-lg bg-blue-50 dark:bg-slate-800 text-blue-700 dark:text-cyan-300 hover:bg-blue-100 border border-blue-200 dark:border-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>View Full Program Syllabus (PDF)</span>
                    </button>
                  </div>
                ) : null}
              </TemplateCard>
            );
          })}
          </div>
        )}
      </section>

      {/* Dynamic PDF/Document Viewer Modal */}
      <PdfDocumentViewerModal
        isOpen={activeViewer.isOpen}
        onClose={() => setActiveViewer((prev) => ({ ...prev, isOpen: false }))}
        documentUrl={activeViewer.url}
        title={activeViewer.title}
        subtitle={activeViewer.subtitle}
      />
    </div>
  );
};
