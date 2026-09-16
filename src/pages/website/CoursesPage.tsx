import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Search, Clock, CheckCircle2, ArrowRight, Building2, AlertCircle } from 'lucide-react';
import { apiClient } from '../../services/apiClient';
import { useActiveTemplate } from '../../templates/templateRegistry';

interface Course {
  id: string;
  departmentId?: string;
  name: string;
  code: string;
  degreeLevel: string;
  durationYears: number;
  description: string;
  eligibility: string;
  isActive: boolean;
  departmentName?: string;
  curriculumHighlights?: string[];
  intake?: number;
}

export const CoursesPage: React.FC = () => {
  const Template = useActiveTemplate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('All Programs');

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
    if (Template.config.code === 'ARTS_SCIENCE_MODERN') {
      return 'bg-amber-100/80 text-amber-900 border-amber-300 font-serif';
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
        badge={Template.config.code === 'ARTS_SCIENCE_MODERN' ? 'Scholarly Curriculum & Degrees' : Template.config.code === 'MEDICAL_MODERN' ? 'Clinical & Medical Degrees' : Template.config.code === 'UNIVERSITY_MODERN' ? 'Multi-Disciplinary Curricula' : 'Academic Degree Programs'}
        title="Degrees & Programs of Study"
        subtitle="Gain recognized degrees accredited by national and international bodies, empowered by experiential learning, cutting-edge labs, and corporate ecosystems."
        icon={<BookOpen className="w-4 h-4 text-emerald-300" />}
      />

      {/* Filter & Search Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 relative z-20">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200/80 p-4 sm:p-6 flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Level Filter Tabs */}
          {availableLevels.length > 1 ? (
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              {availableLevels.map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setSelectedLevel(lvl)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    selectedLevel === lvl
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          ) : (
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Degree Programs ({filtered.length} Programs)
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
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>
      </section>

      {/* Main Course Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-96 bg-slate-200 rounded-2xl" />
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
            {filtered.map((course) => (
              <div
                key={course.id}
                className="group bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden hover:-translate-y-1"
              >
                <div className="p-6">
                  {/* Top Level and Duration Badges */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span
                      className={`px-3 py-1 rounded-lg text-xs font-extrabold uppercase tracking-wider border ${getDegreeBadgeColor(
                        course.degreeLevel
                      )}`}
                    >
                      {course.degreeLevel}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                      <Clock className="w-3.5 h-3.5 text-primary" />
                      {course.durationYears} Years
                    </span>
                  </div>

                  {/* Title & Department */}
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-primary transition-colors leading-snug">
                    {course.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1.5 font-medium">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>{course.departmentName}</span>
                  </div>

                  {/* Description */}
                  <p className="text-slate-600 text-xs sm:text-sm mt-3 leading-relaxed line-clamp-3">
                    {course.description}
                  </p>

                  {/* Eligibility Box */}
                  <div className="mt-4 p-3 bg-amber-50/70 border border-amber-200/70 rounded-xl">
                    <span className="block text-[10px] font-extrabold uppercase tracking-wider text-amber-800">
                      Eligibility
                    </span>
                    <p className="text-xs text-amber-900 mt-0.5 font-medium leading-tight line-clamp-2">
                      {course.eligibility}
                    </p>
                  </div>

                  {/* Curriculum Highlights */}
                  {course.curriculumHighlights && course.curriculumHighlights.length > 0 && (
                    <div className="mt-4 space-y-1.5">
                      <span className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                        Key Learning Pillars
                      </span>
                      {course.curriculumHighlights.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-slate-600">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span className="truncate">{item}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Action */}
                <div className="px-6 py-4 bg-slate-50/90 border-t border-slate-100 flex items-center justify-between group-hover:bg-primary/5 transition-colors">
                  <span className="text-xs font-semibold text-slate-500">
                    Annual Intake: <strong className="text-slate-800">{course.intake || 120}</strong>
                  </span>
                  <Link
                    to="/admissions"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-primary text-white text-xs font-bold rounded-lg shadow-sm hover:opacity-90 transition-opacity"
                  >
                    <span>Apply Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
