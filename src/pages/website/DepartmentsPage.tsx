import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Search, GraduationCap, ArrowRight, ChevronRight, AlertCircle, BookOpen, Clock } from 'lucide-react';
import { apiClient } from '../../services/apiClient';
import { useTheme } from '../../themes/ThemeContext';
import { useTenant } from '../../tenant/TenantContext';
import { useActiveTemplate } from '../../templates/templateRegistry';
import { Course, Department } from '../../types';

// Curated high-resolution fallback photos for academic streams
const DEFAULT_STREAM_IMAGES: Record<string, string> = {
  cs: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
  commerce: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
  management: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=80',
  hotel: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
  science: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop&q=80',
  arts: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80',
  engineering: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80',
  medical: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80',
  default: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80',
};

const getFallbackImage = (courseName: string, deptName: string, stream?: string) => {
  const text = `${courseName} ${deptName} ${stream || ''}`.toLowerCase();
  if (text.includes('computer') || text.includes('ai') || text.includes('it') || text.includes('data') || text.includes('technology') || text.includes('software')) {
    return DEFAULT_STREAM_IMAGES.cs;
  }
  if (text.includes('commerce') || text.includes('accounting') || text.includes('b.com') || text.includes('m.com') || text.includes('finance') || text.includes('tax')) {
    return DEFAULT_STREAM_IMAGES.commerce;
  }
  if (text.includes('management') || text.includes('business') || text.includes('bba') || text.includes('mba') || text.includes('administration')) {
    return DEFAULT_STREAM_IMAGES.management;
  }
  if (text.includes('hotel') || text.includes('catering') || text.includes('culinary') || text.includes('hospitality') || text.includes('tourism')) {
    return DEFAULT_STREAM_IMAGES.hotel;
  }
  if (text.includes('medical') || text.includes('health') || text.includes('nursing') || text.includes('pharmacy') || text.includes('clinic')) {
    return DEFAULT_STREAM_IMAGES.medical;
  }
  if (text.includes('engineering') || text.includes('mechanical') || text.includes('civil') || text.includes('robotics')) {
    return DEFAULT_STREAM_IMAGES.engineering;
  }
  if (text.includes('science') || text.includes('physics') || text.includes('chemistry') || text.includes('math') || text.includes('bio')) {
    return DEFAULT_STREAM_IMAGES.science;
  }
  if (text.includes('arts') || text.includes('english') || text.includes('history') || text.includes('literature') || text.includes('media')) {
    return DEFAULT_STREAM_IMAGES.arts;
  }
  return DEFAULT_STREAM_IMAGES.default;
};

export const DepartmentsPage: React.FC = () => {
  const { siteConfig } = useTenant();
  const Template = useActiveTemplate();
  const headerConfig = siteConfig?.settings?.socialLinks?.pageHeaders?.departments || siteConfig?.settings?.pageHeaders?.departments;

  const badgeText = headerConfig?.badge || 'Academic Divisions';
  const titleText = headerConfig?.title || 'Academic Departments & Schools';
  const subtitleText = headerConfig?.subtitle || 'Explore our world-class academic departments, cutting-edge research facilities, and expert faculty leadership.';

  const { isArtsAndScience, isMedical, isUniversity } = useTheme();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedStream, setSelectedStream] = useState('All Streams');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [deptsRes, coursesRes] = await Promise.all([
          apiClient.get('/site/departments'),
          apiClient.get('/site/courses')
        ]);

        if (deptsRes.data.success && Array.isArray(deptsRes.data.data)) {
          setDepartments(deptsRes.data.data);
        } else {
          setDepartments([]);
        }

        if (coursesRes.data.success && Array.isArray(coursesRes.data.data)) {
          setCourses(coursesRes.data.data);
        } else {
          setCourses([]);
        }
      } catch (err) {
        console.error('Failed to load departments and courses', err);
        setError('Unable to load departments. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const availableStreams = React.useMemo(() => {
    const set = new Set<string>();
    departments.forEach((d) => {
      if (d.stream && d.stream.trim()) {
        set.add(d.stream.trim());
      }
    });
    return set.size > 0 ? ['All Streams', ...Array.from(set)] : [];
  }, [departments]);

  // Group courses by Department ID / Code
  const groupedDepartments = React.useMemo(() => {
    const filteredDepts = departments.filter((d) => {
      const matchesStream =
        selectedStream === 'All Streams' || d.stream === selectedStream;
      const deptCourses = courses.filter(
        (c) => String(c.departmentId) === String(d.id) || (c.departmentName && c.departmentName.toLowerCase() === d.name.toLowerCase())
      );
      const matchesDeptSearch =
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.code.toLowerCase().includes(search.toLowerCase());
      const matchesCourseSearch = deptCourses.some((c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.code.toLowerCase().includes(search.toLowerCase())
      );

      return matchesStream && (!search.trim() || matchesDeptSearch || matchesCourseSearch);
    });

    return filteredDepts.map((d) => {
      const deptCourses = courses.filter(
        (c) => String(c.departmentId) === String(d.id) || (c.departmentName && c.departmentName.toLowerCase() === d.name.toLowerCase())
      ).filter((c) => {
        if (!search.trim()) return true;
        const matchesCourseSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.code.toLowerCase().includes(search.toLowerCase());
        const matchesDeptSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.code.toLowerCase().includes(search.toLowerCase());
        return matchesCourseSearch || matchesDeptSearch;
      });

      return {
        ...d,
        matchedCourses: deptCourses,
      };
    });
  }, [departments, courses, search, selectedStream]);

  return (
    <div className={`min-h-screen ${isArtsAndScience ? 'bg-amber-50/20' : isMedical ? 'bg-teal-50/15' : 'bg-slate-50 dark:bg-slate-950'}`}>
      {/* ── Dynamic Modular Template Page Hero ── */}
      <Template.PageHero
        badge={badgeText}
        title={titleText}
        subtitle={subtitleText}
        icon={<Building2 className="w-4 h-4 text-amber-300" />}
      />

      {/* ── 1. COMPACT TOP UTILITY BREADCRUMB BAR ── */}
      <div className="bg-[#1E3A8A] dark:bg-slate-900 text-white py-2.5 px-4 sm:px-6 lg:px-8 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-2 text-slate-200">
            <Link to="/" className="hover:text-white transition">Home</Link>
            <span className="opacity-50">/</span>
            <span className="text-white font-bold">Departments</span>
          </div>
          <span className="hidden sm:inline-block text-[11px] text-blue-200 font-mono">
            {departments.length} Academic Departments · {courses.length} Programs
          </span>
        </div>
      </div>

      {/* ── 2. FILTER & SEARCH CONTROLS ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <div className={`bg-white dark:bg-slate-900 shadow-sm border p-4 sm:p-5 flex flex-col md:flex-row gap-4 items-center justify-between ${isArtsAndScience ? 'rounded-none border-l-4 border-l-[#e5a912] border-slate-200 shadow-md' : 'rounded-2xl border-slate-200/80 dark:border-slate-800'}`}>
          {/* Stream Filter Pills */}
          {availableStreams.length > 1 ? (
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              {availableStreams.map((st) => (
                <button
                  key={st}
                  onClick={() => setSelectedStream(st)}
                  className={`px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                    isArtsAndScience ? '-skew-x-12 ' : 'rounded-xl '
                  } ${
                    selectedStream === st
                      ? isArtsAndScience
                        ? 'bg-[#134975] text-amber-300 shadow-md'
                        : 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <span className={isArtsAndScience ? 'inline-block skew-x-12' : ''}>
                    {st}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
              Academic Departments Directory
            </div>
          )}

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search department or course (e.g. B.Sc, B.Com, MBA)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#134975]/20 focus:border-[#134975] ${isArtsAndScience ? 'rounded-none border-l-4 border-l-[#e5a912]' : 'rounded-xl'}`}
            />
          </div>
        </div>
      </section>

      {/* ── 3. MAIN GROUPED DEPARTMENTS & COURSE CARDS (Exact Reference Design) ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20">
        {loading ? (
          <div className="space-y-12 py-10 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-6">
                <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/3 mx-auto" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-red-200 p-8 max-w-md mx-auto my-12">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
            <h3 className="font-bold text-red-700 dark:text-red-400 text-lg">Something went wrong</h3>
            <p className="text-red-500 text-xs mt-1">{error}</p>
          </div>
        ) : groupedDepartments.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 max-w-md mx-auto my-12 shadow-xs">
            <Building2 className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">No departments found</h3>
            <p className="text-slate-500 text-xs mt-1">Try adjusting your search query or selecting a different stream filter.</p>
          </div>
        ) : (
          <div className="space-y-14 sm:space-y-16">
            {groupedDepartments.map((dept) => {
              const deptCourses = dept.matchedCourses;

              const cleanLinkText = (name: string) => {
                const n = (name || '').trim();
                if (n.toLowerCase().startsWith('department')) {
                  return `Explore ${n}`;
                }
                return `Explore Department of ${n}`;
              };

              // Fallback image for department when courses array is empty
              const deptFallbackImage = dept.imageUrl || getFallbackImage('', dept.name, dept.stream);

              return (
                <section key={dept.id} id={`dept-${dept.code}`} className="scroll-mt-20">
                  {/* ── RED HEADER WITH GOLD WINGS (Matching Reference Screenshots) ── */}
                  <div className="relative flex items-center justify-center my-6 sm:my-8">
                    <div className="grow border-t-2 border-amber-400 dark:border-amber-500/80 max-w-xs sm:max-w-md hidden sm:block opacity-90" />
                    <h2 className="mx-4 text-center text-base sm:text-xl md:text-2xl font-black uppercase tracking-wider text-[#EF4444] dark:text-red-400 px-3 select-none">
                      {dept.name}
                    </h2>
                    <div className="grow border-t-2 border-amber-400 dark:border-amber-500/80 max-w-xs sm:max-w-md hidden sm:block opacity-90" />
                  </div>

                  {/* ── DEPARTMENT META (code + description) ── */}
                  {deptCourses.length > 0 && (
                    <div className="flex flex-col items-center gap-1.5 mb-6 text-center">
                      <span className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Code: {dept.code}
                      </span>
                      {dept.description && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed line-clamp-2">
                          {dept.description}
                        </p>
                      )}
                    </div>
                  )}

                  {/* ── COURSE IMAGE CARDS GRID OR DEPARTMENT OVERVIEW CARD ── */}
                  {deptCourses.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
                      {deptCourses.map((course) => {
                        const imageSrc = course.imageUrl || (course as any).thumbnailUrl || getFallbackImage(course.name, dept.name, dept.stream);

                        return (
                          <Link
                            key={course.id}
                            to={`/departments/${dept.code || dept.id}`}
                            className={`group bg-white dark:bg-slate-900 border shadow-xs hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col hover:-translate-y-1.5 ${
                              isArtsAndScience
                                ? 'rounded-none border-slate-200 hover:border-[#e5a912]'
                                : 'rounded-2xl border-slate-200/90 dark:border-slate-800'
                            }`}
                          >
                            {/* Slanted Top Accent Stripe */}
                            {isArtsAndScience && (
                              <div className="h-1.5 w-full bg-[#e5a912] group-hover:bg-[#134975] transition-colors" />
                            )}

                            {/* Card Top Image Thumbnail */}
                            <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                              <img
                                src={imageSrc}
                                alt={course.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                loading="lazy"
                                onError={(e) => {
                                  (e.target as HTMLElement).setAttribute('src', DEFAULT_STREAM_IMAGES.default);
                                }}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                <span className="text-white text-xs font-bold inline-flex items-center gap-1">
                                  <span>View Syllabus &amp; Overview</span>
                                  <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                                </span>
                              </div>
                              {course.degreeLevel && (
                                <div className="absolute top-3 left-3">
                                  <span
                                    className={`px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider shadow-xs ${
                                      isArtsAndScience
                                        ? 'bg-[#134975] text-amber-300 -skew-x-12 rounded-none'
                                        : 'rounded-md bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-800 dark:text-slate-200 border border-white/20'
                                    }`}
                                  >
                                    <span className={isArtsAndScience ? 'inline-block skew-x-12' : ''}>
                                      {course.degreeLevel}
                                    </span>
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Card Bottom Course Title */}
                            <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between text-center bg-white dark:bg-slate-900">
                              <div>
                                <h3 className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors leading-snug">
                                  {course.name}
                                </h3>
                                {course.durationYears && (
                                  <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 font-medium flex items-center justify-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    <span>{course.durationYears} Years Duration · Semesters: {course.totalSemesters || course.durationYears * 2}</span>
                                  </p>
                                )}
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  ) : (
                    /* Elegant Department Card when no courses added yet under this department */
                    <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden hover:shadow-md transition">
                      <div className="flex flex-col sm:flex-row">
                        <div className="sm:w-2/5 relative h-48 sm:h-auto min-h-[160px] bg-slate-100 dark:bg-slate-800">
                          <img
                            src={deptFallbackImage}
                            alt={dept.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLElement).setAttribute('src', DEFAULT_STREAM_IMAGES.default);
                            }}
                          />
                          <div className="absolute top-3 left-3 flex items-center gap-1.5">
                            <span className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase bg-slate-900/80 text-white backdrop-blur-md rounded-md">
                              Code: {dept.code}
                            </span>
                          </div>
                        </div>

                        <div className="sm:w-3/5 p-6 flex flex-col justify-between space-y-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                                {dept.stream || 'Academic Division'}
                              </span>
                              {dept.headOfDepartment && (
                                <span className="text-[11px] text-slate-500 font-medium">
                                  HOD: {dept.headOfDepartment}
                                </span>
                              )}
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                              {dept.name}
                            </h3>
                            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                              {dept.description || 'Specialized degree curriculum, research labs, and academic faculty under this department.'}
                            </p>
                          </div>

                          <div className="pt-2">
                            <Link
                              to={`/departments/${dept.code || dept.id}`}
                              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs"
                            >
                              <span>View Department Profile &amp; Faculty</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Department Quick Link Footer */}
                  <div className="mt-4 flex items-center justify-end">
                    <Link
                      to={`/departments/${dept.code || dept.id}`}
                      className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 inline-flex items-center gap-1"
                    >
                      <span>{cleanLinkText(dept.name)}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

