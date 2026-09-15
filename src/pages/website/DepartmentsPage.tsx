import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Search, GraduationCap, ArrowRight, Mail, AlertCircle } from 'lucide-react';
import { apiClient } from '../../services/apiClient';
import { useTheme } from '../../themes/ThemeContext';

interface Department {
  id: string;
  name: string;
  code: string;
  description: string;
  headOfDepartment: string;
  email: string;
  isActive: boolean;
  stream?: string;
  studentCount?: number;
  labCount?: number;
  degreeLevels?: string[];
}

export const DepartmentsPage: React.FC = () => {
  const { isArtsAndScience, isMedical, isUniversity, isEngineering } = useTheme();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedStream, setSelectedStream] = useState('All Streams');

  useEffect(() => {
    const fetchDepts = async () => {
      try {
        const res = await apiClient.get('/site/departments');
        if (res.data.success && Array.isArray(res.data.data)) {
          setDepartments(res.data.data);
        } else {
          setDepartments([]);
        }
      } catch (err) {
        console.error('Failed to load departments', err);
        setError('Unable to load departments. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchDepts();
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

  const filtered = departments.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.code.toLowerCase().includes(search.toLowerCase()) ||
      d.headOfDepartment?.toLowerCase().includes(search.toLowerCase());
    const matchesStream =
      selectedStream === 'All Streams' || d.stream === selectedStream;
    return matchesSearch && matchesStream;
  });

  const heroBg = isArtsAndScience
    ? 'bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-950'
    : isMedical
      ? 'bg-gradient-to-r from-teal-950 via-teal-900 to-slate-950'
      : isUniversity
        ? 'bg-gradient-to-r from-rose-950 via-slate-950 to-slate-900'
        : 'bg-gradient-to-r from-slate-950 via-blue-950 to-slate-900';

  const titleFont = isArtsAndScience || isUniversity ? 'font-serif' : 'font-sans';
  const cardBadgeStyle = isArtsAndScience
    ? 'bg-emerald-100 text-emerald-800 border-emerald-200 font-serif'
    : isMedical
      ? 'bg-teal-100 text-teal-800 border-teal-200'
      : isUniversity
        ? 'bg-rose-100 text-rose-900 border-rose-200'
        : 'bg-blue-100 text-blue-800 border-blue-200';

  return (
    <div className={`min-h-screen ${isArtsAndScience ? 'bg-amber-50/30' : isMedical ? 'bg-teal-50/20' : 'bg-slate-50'}`}>
      {/* Header Banner */}
      <section className={`relative ${heroBg} text-white py-16 md:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden`}>
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold uppercase tracking-wider text-white mb-4">
            <Building2 className="w-4 h-4 text-amber-300" />
            <span>{isArtsAndScience ? 'Scholarly Faculties & Humanities' : isMedical ? 'Clinical & Medical Disciplines' : isUniversity ? 'Multi-Faculty Research Schools' : 'Engineering & Technology Disciplines'}</span>
          </div>
          <h1 className={`text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-4 ${titleFont}`}>
            Academic Departments
          </h1>
          <p className={`text-slate-200 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed ${isArtsAndScience ? 'font-serif' : ''}`}>
            Discover our world-renowned academic faculties, accredited research laboratories, and interdisciplinary programs designed to mold pioneering innovators.
          </p>
        </div>
      </section>

      {/* Filter & Search Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 relative z-20">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200/80 p-4 sm:p-6 flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Stream Filter Tabs */}
          {availableStreams.length > 1 ? (
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              {availableStreams.map((st) => (
                <button
                  key={st}
                  onClick={() => setSelectedStream(st)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${selectedStream === st
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                >
                  {st}
                </button>
              ))}
            </div>
          ) : (
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Departments Directory ({filtered.length} Departments)
            </div>
          )}

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search department or HoD..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>
      </section>

      {/* Main Department Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-80 bg-slate-200 rounded-2xl" />
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
            <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-800 text-lg">No departments found</h3>
            <p className="text-slate-500 text-xs mt-1">Try refining your search keyword or selected stream filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filtered.map((dept) => (
              <div
                key={dept.id}
                className="group bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden hover:-translate-y-1"
              >
                <div className="p-6">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-xs font-extrabold tracking-wider uppercase border border-primary/20">
                      {dept.code}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-primary transition-colors leading-snug">
                    {dept.name}
                  </h3>

                  {/* Description */}
                  {dept.description && (
                    <p className="text-slate-600 text-xs sm:text-sm mt-2.5 leading-relaxed line-clamp-3">
                      {dept.description}
                    </p>
                  )}

                  {/* Head of Department Cardlet */}
                  {dept.headOfDepartment && (
                    <div className="mt-5 p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
                        {dept.headOfDepartment
                          ?.split(' ')
                          .filter(Boolean)
                          .slice(0, 2)
                          .map((n) => n[0])
                          .join('') || 'HD'}
                      </div>
                      <div className="min-w-0">
                        <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400">Head of Department</span>
                        <h4 className="text-xs font-bold text-slate-900 truncate">{dept.headOfDepartment}</h4>
                        {dept.email && (
                          <a
                            href={`mailto:${dept.email}`}
                            className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline mt-0.5 font-medium truncate max-w-full"
                          >
                            <Mail className="w-3 h-3 shrink-0" />
                            <span className="truncate">{dept.email}</span>
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Degree Levels */}
                  {dept.degreeLevels && dept.degreeLevels.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <GraduationCap className="w-3.5 h-3.5 text-primary" />
                        <span>{dept.degreeLevels.join(' • ')}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Action */}
                <div className="px-6 py-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between group-hover:bg-primary/5 transition-colors">
                  <Link
                    to={`/courses`}
                    className="text-xs font-bold text-primary inline-flex items-center gap-1 hover:gap-1.5 transition-all"
                  >
                    <span>View Courses & Syllabi</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    to={`/faculty`}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-800"
                  >
                    Meet Faculty
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
