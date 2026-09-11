import React, { useEffect, useState } from 'react';
import { Users, Search, Mail, GraduationCap, FileText, AlertCircle } from 'lucide-react';
import { apiClient } from '../../services/apiClient';
import { useTheme } from '../../themes/ThemeContext';

interface Faculty {
  id: string;
  departmentId?: string;
  departmentName?: string;
  name: string;
  designation: string;
  qualification: string;
  specialization: string;
  email: string;
  isActive: boolean;
  avatarUrl?: string;
  experienceYears?: number;
  publicationsCount?: number;
  patentsCount?: number;
}

export const FacultyPage: React.FC = () => {
  const { isArtsAndScience, isMedical, isUniversity, isEngineering } = useTheme();
  const [facultyList, setFacultyList] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('All Departments');

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const res = await apiClient.get('/site/faculty');
        if (res.data.success && Array.isArray(res.data.data)) {
          const apiFaculty = res.data.data.map((f: any) => ({
            ...f,
            departmentName: f.departmentName || f.department?.name,
          }));
          setFacultyList(apiFaculty);
        } else {
          setFacultyList([]);
        }
      } catch (err) {
        console.error('Failed to load faculty', err);
        setError('Unable to load faculty. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchFaculty();
  }, []);

  const availableDepts = React.useMemo(() => {
    const set = new Set<string>();
    facultyList.forEach((f) => {
      if (f.departmentName && f.departmentName.trim()) {
        set.add(f.departmentName.trim());
      }
    });
    return set.size > 0 ? ['All Departments', ...Array.from(set)] : [];
  }, [facultyList]);

  const filtered = facultyList.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.specialization.toLowerCase().includes(search.toLowerCase()) ||
      f.qualification.toLowerCase().includes(search.toLowerCase()) ||
      f.designation.toLowerCase().includes(search.toLowerCase());
    const matchesDept =
      selectedDept === 'All Departments' ||
      f.departmentName?.toLowerCase().includes(selectedDept.toLowerCase()) ||
      selectedDept.toLowerCase().includes(f.departmentName?.toLowerCase() || '');
    return matchesSearch && matchesDept;
  });

  const heroBg = isArtsAndScience
    ? 'bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-950'
    : isMedical
    ? 'bg-gradient-to-r from-teal-950 via-teal-900 to-slate-950'
    : isUniversity
    ? 'bg-gradient-to-r from-rose-950 via-slate-950 to-slate-900'
    : 'bg-gradient-to-r from-slate-950 via-blue-950 to-slate-900';

  const titleFont = isArtsAndScience || isUniversity ? 'font-serif' : 'font-sans';

  return (
    <div className={`min-h-screen ${isArtsAndScience ? 'bg-amber-50/30 font-serif' : isMedical ? 'bg-teal-50/20' : 'bg-slate-50'}`}>
      {/* Header Banner */}
      <section className={`relative ${heroBg} text-white py-16 md:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden`}>
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold uppercase tracking-wider text-white mb-4">
            <Users className="w-4 h-4 text-amber-300" />
            <span>{isArtsAndScience ? 'Distinguished Scholars & Professors' : isMedical ? 'Clinical Consultants & Professors' : isUniversity ? 'Multi-Faculty Academic Mentors' : 'Scholarly Excellence'}</span>
          </div>
          <h1 className={`text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-4 ${titleFont}`}>
            Distinguished Faculty Directory
          </h1>
          <p className={`text-slate-200 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed ${isArtsAndScience ? 'font-serif' : ''}`}>
            Meet our distinguished mentors, world-renowned researchers, and passionate educators dedicated to shaping curious minds and leading breakthrough research.
          </p>
        </div>
      </section>

      {/* Filter & Search Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 relative z-20">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200/80 p-4 sm:p-6 flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Department Filter Tabs (rendered if more than 1 option exists) */}
          {availableDepts.length > 1 ? (
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              {availableDepts.map((dept) => (
                <button
                  key={dept}
                  onClick={() => setSelectedDept(dept)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedDept === dept
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>
          ) : (
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Faculty Directory ({filtered.length} Mentors)
            </div>
          )}

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search faculty, Ph.D, domain..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>
      </section>

      {/* Main Faculty Cards Grid */}
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
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-800 text-lg">No faculty members found</h3>
            <p className="text-slate-500 text-xs mt-1">Try searching by department or professor name.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filtered.map((fac) => (
              <div
                key={fac.id}
                className="group bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden hover:-translate-y-1"
              >
                <div className="p-6">
                  {/* Top Profile Header */}
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary to-blue-600 text-white font-black text-lg flex items-center justify-center shrink-0 shadow-md">
                      {fac.name
                        .replace('Dr. ', '')
                        .replace('Prof. ', '')
                        .split(' ')
                        .slice(0, 2)
                        .map((n) => n[0])
                        .join('')}
                    </div>
                    <div className="min-w-0">
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-extrabold uppercase tracking-wider mb-1">
                        {fac.designation}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-primary transition-colors leading-tight truncate">
                        {fac.name}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
                        {fac.departmentName}
                      </p>
                    </div>
                  </div>

                  {/* Qualification Badge */}
                  <div className="mt-4 p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-xs font-semibold text-slate-700 truncate">
                      {fac.qualification}
                    </span>
                  </div>

                  {/* Specialization */}
                  <div className="mt-3.5">
                    <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Research & Specialization
                    </span>
                    <p className="text-xs text-slate-700 mt-1 leading-relaxed line-clamp-2 font-medium">
                      {fac.specialization}
                    </p>
                  </div>

                  {/* Research Metrics (only if real values provided) */}
                  {(Boolean(fac.experienceYears) || Boolean(fac.publicationsCount) || Boolean(fac.patentsCount)) && (
                    <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-around gap-2 text-center">
                      {Boolean(fac.experienceYears) && (
                        <div className="p-2 bg-slate-50 rounded-lg flex-1">
                          <span className="block text-xs font-black text-slate-800">{fac.experienceYears}+</span>
                          <span className="text-[10px] text-slate-500 font-medium">Yrs Exp</span>
                        </div>
                      )}
                      {Boolean(fac.publicationsCount) && (
                        <div className="p-2 bg-slate-50 rounded-lg flex-1">
                          <span className="block text-xs font-black text-slate-800">{fac.publicationsCount}+</span>
                          <span className="text-[10px] text-slate-500 font-medium">Papers</span>
                        </div>
                      )}
                      {Boolean(fac.patentsCount) && (
                        <div className="p-2 bg-slate-50 rounded-lg flex-1">
                          <span className="block text-xs font-black text-slate-800">{fac.patentsCount}</span>
                          <span className="text-[10px] text-slate-500 font-medium">Patents</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer Email & Contact Action */}
                <div className="px-6 py-3.5 bg-slate-50/90 border-t border-slate-100 flex items-center justify-between group-hover:bg-primary/5 transition-colors">
                  <a
                    href={`mailto:${fac.email}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline truncate"
                  >
                    <Mail className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{fac.email}</span>
                  </a>
                  <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1 shrink-0">
                    <FileText className="w-3 h-3" />
                    Bio
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
