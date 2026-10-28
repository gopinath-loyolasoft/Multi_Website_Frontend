import React, { useEffect, useState } from 'react';
import { Users, Search, Mail, GraduationCap, Award, Building, Phone, MapPin, X, BookOpen, ExternalLink, AlertCircle } from 'lucide-react';
import { apiClient } from '../../services/apiClient';
import { useTheme } from '../../themes/ThemeContext';
import { useActiveTemplate } from '../../templates/templateRegistry';
import { useTenant } from '../../tenant/TenantContext';

interface Faculty {
  id: string;
  departmentId?: string;
  departmentName?: string;
  name: string;
  designation: string;
  qualification: string;
  specialization: string;
  qualificationDetails?: string;
  researchInterests?: string;
  email: string;
  phone?: string;
  officeRoom?: string;
  profileImageUrl?: string;
  avatarUrl?: string;
  bio?: string;
  sortOrder?: number;
  isActive: boolean;
}

export const FacultyPage: React.FC = () => {
  const { siteConfig } = useTenant();
  const { isArtsAndScience } = useTheme();
  const [facultyList, setFacultyList] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('All Departments');
  const [selectedProfile, setSelectedProfile] = useState<Faculty | null>(null);

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
      (f.specialization && f.specialization.toLowerCase().includes(search.toLowerCase())) ||
      (f.qualification && f.qualification.toLowerCase().includes(search.toLowerCase())) ||
      (f.designation && f.designation.toLowerCase().includes(search.toLowerCase()));
    const matchesDept =
      selectedDept === 'All Departments' ||
      f.departmentName?.toLowerCase().includes(selectedDept.toLowerCase()) ||
      selectedDept.toLowerCase().includes(f.departmentName?.toLowerCase() || '');
    return matchesSearch && matchesDept;
  });

  const Template = useActiveTemplate();
  const isSlanted =
    Template.config.code === 'DESIGN_3D_MODERN' ||
    Template.config.code === 'SALESIAN_SLANTED' ||
    Template.config.code === 'ARTS_SCIENCE_MODERN' ||
    Template.config.code === 'TEMPLATE2' ||
    Template.config.code === 'TEMPLATE_2';

  const headerConfig = siteConfig?.settings?.socialLinks?.pageHeaders?.faculty || siteConfig?.settings?.pageHeaders?.faculty;
  const badgeText = headerConfig?.badge || (isSlanted ? 'Distinguished Scholars & Professors' : 'Faculty Directory');
  const titleText = headerConfig?.title || 'Meet Our Faculty';
  const subtitleText = headerConfig?.subtitle || 'Professors, researchers, and mentors guiding our students towards academic excellence.';

  return (
    <div className={`min-h-screen ${Template.config.bodyBgClass}`}>
      {/* Dynamic Modular Template Page Hero */}
      <Template.PageHero
        badge={badgeText}
        title={selectedProfile ? selectedProfile.name : titleText}
        subtitle={selectedProfile ? `${selectedProfile.designation} — Department of ${selectedProfile.departmentName || 'Academics'}` : subtitleText}
        icon={<Users className="w-4 h-4 text-amber-300" />}
      />

      {/* Filter & Search Bar / Back Button Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 relative z-20">
        <div className={`bg-white shadow-lg border p-4 sm:p-6 flex flex-col md:flex-row gap-4 items-center justify-between ${isArtsAndScience ? 'rounded-none border-l-4 border-l-[#e5a912] border-slate-200 shadow-md' : 'rounded-2xl border-slate-200/80'}`}>
          {selectedProfile ? (
            <div className="flex items-center justify-between w-full">
              <button
                onClick={() => setSelectedProfile(null)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                <span>← Back to Faculty Listing</span>
              </button>
              <div className="text-xs font-semibold text-slate-500 hidden sm:block">
                Viewing profile of <strong className="text-slate-800">{selectedProfile.name}</strong>
              </div>
            </div>
          ) : (
            <>
              {/* Department Filter Tabs */}
              {availableDepts.length > 1 ? (
                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                  {availableDepts.map((dept) => (
                    <button
                      key={dept}
                      onClick={() => setSelectedDept(dept)}
                      className={`px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                        isArtsAndScience ? '-skew-x-12 ' : 'rounded-xl '
                      } ${
                        selectedDept === dept
                          ? isArtsAndScience
                            ? 'bg-[#134975] text-amber-300 shadow-md'
                            : 'bg-primary text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <span className={isArtsAndScience ? 'inline-block skew-x-12' : ''}>
                        {dept}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Faculty Directory ({filtered.length} Members)
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
                  className={`w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#134975]/20 focus:border-[#134975] ${isArtsAndScience ? 'rounded-none border-l-4 border-l-[#e5a912]' : 'rounded-xl'}`}
                />
              </div>
            </>
          )}
        </div>
      </section>

      {/* Main Content Area: Inline Profile Detail OR Faculty Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {selectedProfile ? (
          /* ── INLINE FACULTY PROFILE DETAIL VIEW ── */
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Header Banner */}
            <div className="p-6 sm:p-10 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
                {selectedProfile.profileImageUrl || selectedProfile.avatarUrl ? (
                  <img
                    src={selectedProfile.profileImageUrl || selectedProfile.avatarUrl}
                    alt={selectedProfile.name}
                    className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover border-4 border-white/20 shadow-2xl shrink-0"
                  />
                ) : (
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-blue-600 text-white flex items-center justify-center font-bold text-3xl border-4 border-white/20 shadow-2xl shrink-0">
                    {selectedProfile.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                  </div>
                )}

                <div className="space-y-2.5 flex-1">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-900 shadow-xs">
                      {selectedProfile.designation}
                    </span>
                    {selectedProfile.departmentName && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-blue-200 border border-white/10">
                        Department of {selectedProfile.departmentName}
                      </span>
                    )}
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                    {selectedProfile.name}
                  </h1>

                  {selectedProfile.qualification && (
                    <p className="text-sm text-slate-300 font-medium flex items-center justify-center sm:justify-start gap-1.5 pt-1">
                      <GraduationCap className="w-4 h-4 text-amber-300 shrink-0" />
                      <span>{selectedProfile.qualification}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Content Body */}
            <div className="p-6 sm:p-10 space-y-8 text-slate-800">
              {/* Research Specialization & Interests */}
              {(selectedProfile.specialization || selectedProfile.researchInterests) && (
                <div className="p-6 bg-blue-50/70 rounded-2xl border border-blue-100/80 space-y-3">
                  <h3 className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-2">
                    <Award className="w-4.5 h-4.5 text-blue-600" />
                    <span>Research Specialization & Interests</span>
                  </h3>
                  {selectedProfile.specialization && (
                    <p className="text-xs sm:text-sm text-slate-700 font-medium">
                      <strong className="text-slate-900">Primary Focus:</strong> {selectedProfile.specialization}
                    </p>
                  )}
                  {selectedProfile.researchInterests && (
                    <p className="text-xs sm:text-sm text-slate-600">
                      <strong className="text-slate-900">Areas of Interest:</strong> {selectedProfile.researchInterests}
                    </p>
                  )}
                </div>
              )}

              {/* Short Biography */}
              {selectedProfile.bio && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <BookOpen className="w-4.5 h-4.5 text-slate-400" />
                    <span>Biography</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    {selectedProfile.bio}
                  </p>
                </div>
              )}

              {/* Qualification Details */}
              {selectedProfile.qualificationDetails && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <GraduationCap className="w-4.5 h-4.5 text-slate-400" />
                    <span>Academic Qualification Details</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-700 font-medium bg-slate-50 p-4 rounded-xl border border-slate-100">
                    {selectedProfile.qualificationDetails}
                  </p>
                </div>
              )}

              {/* Contact Information */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Contact & Office Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedProfile.email && (
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
                      <Mail className="w-5 h-5 text-blue-600 shrink-0" />
                      <div className="truncate">
                        <span className="text-[10px] text-slate-400 block uppercase font-bold">Official Email</span>
                        <a href={`mailto:${selectedProfile.email}`} className="font-mono text-xs sm:text-sm text-slate-800 hover:text-blue-600 font-medium truncate block">
                          {selectedProfile.email}
                        </a>
                      </div>
                    </div>
                  )}
                  {selectedProfile.phone && (
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
                      <Phone className="w-5 h-5 text-emerald-600 shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase font-bold">Phone Number</span>
                        <span className="font-mono text-xs sm:text-sm text-slate-800 font-medium">{selectedProfile.phone}</span>
                      </div>
                    </div>
                  )}
                  {selectedProfile.officeRoom && (
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-amber-600 shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase font-bold">Office / Location</span>
                        <span className="text-xs sm:text-sm text-slate-800 font-medium">{selectedProfile.officeRoom}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Back Button */}
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setSelectedProfile(null)}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer flex items-center gap-2"
              >
                <span>← Back to Faculty Listing</span>
              </button>
            </div>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className={`h-80 bg-slate-200 ${isArtsAndScience ? 'rounded-none' : 'rounded-2xl'}`} />
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
            {filtered.map((fac) => {
              const photo = fac.profileImageUrl || fac.avatarUrl;
              return (
                <div
                  key={fac.id}
                  className="bg-white rounded-2xl border border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                >
                  <div className="p-6 space-y-4">
                    {/* Top row: Photo & Basic Metadata */}
                    <div className="flex items-start gap-4">
                      {photo ? (
                        <img
                          src={photo}
                          alt={fac.name}
                          className="w-20 h-20 rounded-2xl object-cover border border-slate-200 shrink-0 group-hover:scale-105 transition-transform duration-300 shadow-sm"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-bold text-xl shrink-0 shadow-sm">
                          {fac.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                        </div>
                      )}
                      <div className="space-y-1">
                        <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-blue-600 transition-colors">
                          {fac.name}
                        </h3>
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
                          {fac.designation}
                        </span>
                        {fac.qualification && (
                          <div className="flex items-center gap-1 text-xs text-slate-600 font-semibold pt-0.5">
                            <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{fac.qualification}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="h-px bg-slate-100" />

                    {/* Academic details */}
                    <div className="space-y-2 text-xs">
                      {fac.departmentName && (
                        <div className="flex items-center gap-2 text-slate-700 font-medium">
                          <Building className="w-4 h-4 text-blue-500 shrink-0" />
                          <span>Department of {fac.departmentName}</span>
                        </div>
                      )}

                      {fac.specialization && (
                        <div className="flex items-start gap-2 text-slate-600">
                          <Award className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                          <span className="line-clamp-2">
                            <strong className="text-slate-800 font-semibold">Research:</strong> {fac.specialization}
                          </span>
                        </div>
                      )}

                      {fac.email && (
                        <div className="flex items-center gap-2 text-slate-500 font-mono text-[11px]">
                          <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <a href={`mailto:${fac.email}`} className="hover:underline hover:text-blue-600 truncate">
                            {fac.email}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer Action */}
                  <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 font-medium">Faculty Member</span>
                    <button
                      onClick={() => setSelectedProfile(fac)}
                      className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <span>View Profile</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

