import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  ArrowRight, 
  GraduationCap, 
  Building2, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Award,
  Stethoscope
} from 'lucide-react';

import { apiClient } from '../../services/apiClient';
import { SectionError } from './SectionError';
import { useTemplateTheme } from '../../themes/ThemeContext';

interface FacultyItem {
  id?: string | number;
  name: string;
  designation: string;
  department?: string;
  qualification?: string;
  specialization?: string;
  email?: string;
  imageUrl?: string;
  profileUrl?: string;
}

interface FacultyProps {
  content: {
    badge?: string;
    title?: string;
    subtitle?: string;
    faculty?: FacultyItem[];
  };
}

export const FacultySection: React.FC<FacultyProps> = ({ content }) => {
  const { styles } = useTemplateTheme();
  const facultyStyles = styles.faculty;
  const layoutVariant = facultyStyles.layoutVariant || (facultyStyles.isCentered ? 'editorial' : 'grid');

  const [fetchedFaculty, setFetchedFaculty] = React.useState<FacultyItem[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [activeShowcaseIdx, setActiveShowcaseIdx] = React.useState(0);

  React.useEffect(() => {
    if (!content.faculty || content.faculty.length === 0) {
      setLoading(true);
      apiClient.get('/site/faculty')
        .then((res) => {
          if (res.data.success && Array.isArray(res.data.data)) {
            setFetchedFaculty(res.data.data.slice(0, 6).map((f: any) => ({
              id: f.id,
              name: f.name,
              designation: f.designation,
              department: f.department || f.departmentName,
              qualification: f.qualification,
              specialization: f.specialization,
              email: f.email,
              imageUrl: f.avatarUrl || f.imageUrl,
              profileUrl: f.profileUrl || `/faculty/${f.id || ''}`,
            })));
          }
        })
        .catch(() => setError('Unable to load faculty. Please try again later.'))
        .finally(() => setLoading(false));
    }
  }, [content.faculty]);

  const facultyList: FacultyItem[] = content.faculty && content.faculty.length > 0 ? content.faculty : fetchedFaculty;
  
  if (error && !loading) {
    return <SectionError message={error} className="bg-white dark:bg-slate-900" />;
  }
  if (!loading && facultyList.length === 0) return null;

  const sectionBadge = content.badge || facultyStyles.sectionHeaderBadge ? facultyStyles.defaultBadgeText || 'Distinguished Faculty' : '';
  const sectionTitle = content.title || facultyStyles.defaultTitle || 'Distinguished Faculty';
  const sectionSubtitle = content.subtitle || 'Renowned professors, doctorate researchers, and industry fellows';

  // =========================================================================
  // 1. TEMPLATE 2 & TEMPLATE 5: 3D DESIGNED FACULTY CARDS
  // =========================================================================
  const { isArtsAndScience } = useTemplateTheme();
  if (isArtsAndScience || layoutVariant === 'slanted') {
    return (
      <section className="py-12 sm:py-16 bg-white relative overflow-hidden">
        {/* Subtle geometric dot backdrop */}
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#134975_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 text-xs font-bold uppercase tracking-wider mb-2.5 -skew-x-12 bg-sky-50 text-[#134975] border border-sky-200">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 skew-x-12" />
                <span className="skew-x-12">{sectionBadge || 'Distinguished Faculty'}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
                {sectionTitle}
              </h2>
              {sectionSubtitle && (
                <p className="text-sm sm:text-base text-slate-600 mt-1 max-w-2xl">
                  {sectionSubtitle}
                </p>
              )}
            </div>
            <Link
              to="/faculty"
              className="inline-flex items-center gap-2 px-5 py-2.5 -skew-x-12 bg-[#134975] hover:bg-[#0b3353] text-amber-300 font-black text-xs uppercase tracking-wider shadow-md hover:scale-105 transition shrink-0 self-start md:self-auto"
            >
              <span className="skew-x-12 flex items-center gap-1.5">
                <span>View Full Directory</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </div>

          {/* 3D Slanted Faculty Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {facultyList.map((f, idx) => {
              const initials = f.name
                .replace('Dr. ', '')
                .replace('Prof. ', '')
                .split(' ')
                .slice(0, 2)
                .map((n) => n[0])
                .join('');

              return (
                <div
                  key={idx}
                  className="group bg-white border border-slate-200/90 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden hover:-translate-y-2 hover:border-[#e5a912] relative"
                >
                  {/* Top Gold Stripe */}
                  <div className="h-1.5 w-full bg-[#e5a912] group-hover:bg-[#134975] transition-colors" />

                  <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      {/* Avatar + Designation */}
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 -skew-x-12 bg-[#134975] text-amber-300 border border-amber-400/40 shadow-md flex items-center justify-center shrink-0 overflow-hidden font-black text-xl">
                          {f.imageUrl ? (
                            <img
                              src={f.imageUrl}
                              alt={f.name}
                              className="w-full h-full object-cover object-top skew-x-12 scale-110"
                            />
                          ) : (
                            <span className="skew-x-12">{initials || 'F'}</span>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <span className="inline-block px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider mb-1 -skew-x-6 bg-amber-100 text-amber-950 border border-amber-300">
                            <span className="inline-block skew-x-6">{f.designation}</span>
                          </span>
                          <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#134975] transition-colors leading-tight truncate">
                            {f.name}
                          </h3>
                          {f.department && (
                            <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
                              {f.department}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Qualification Badge */}
                      {f.qualification && (
                        <div className="mt-4 p-2.5 bg-slate-50 border-l-2 border-l-[#e5a912] border-slate-200 flex items-center gap-2">
                          <GraduationCap className="w-4 h-4 text-[#134975] shrink-0" />
                          <span className="text-xs font-semibold text-slate-700 truncate">
                            {f.qualification}
                          </span>
                        </div>
                      )}

                      {/* Specialization */}
                      {f.specialization && (
                        <div className="mt-3">
                          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Domain & Research
                          </span>
                          <p className="text-xs text-slate-600 mt-0.5 line-clamp-2 leading-relaxed">
                            {f.specialization}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Card Footer */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <Link
                        to={f.profileUrl || `/faculty`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#134975] group-hover:text-amber-600 transition-colors"
                      >
                        <span>View Academic Profile</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Center CTA */}
          <div className="mt-10 flex justify-center">
            <Link
              to="/faculty"
              className="inline-flex items-center gap-2 px-8 py-3.5 -skew-x-12 bg-[#134975] hover:bg-[#0b3353] text-amber-300 font-black text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition"
            >
              <span className="skew-x-12 flex items-center gap-2">
                <span>Explore All Faculty Members</span>
                <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </div>

        </div>
      </section>
    );
  }

  // =========================================================================
  // 2. TEMPLATE 3: MEDICAL — CLINICAL FACULTY & CONSULTANT CARDS
  // =========================================================================
  if (layoutVariant === 'clinical') {
    const medicalGridCols = facultyList.length === 2 
      ? 'max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-5'
      : facultyList.length === 3
      ? 'max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'
      : 'max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5';

    return (
      <section className={`py-8 sm:py-10 ${facultyStyles.sectionBg} transition-colors`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-7 sm:mb-8 gap-3">
            <div>
              {sectionBadge && (
                <div className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold mb-2 ${facultyStyles.sectionHeaderBadge}`}>
                  <Stethoscope className="w-3.5 h-3.5" />
                  <span>{sectionBadge}</span>
                </div>
              )}
              <h2 className={facultyStyles.headingFont}>
                {sectionTitle}
              </h2>
              {sectionSubtitle && (
                <p className={`${facultyStyles.subtitleFont} mt-1`}>
                  {sectionSubtitle}
                </p>
              )}
            </div>
            <Link
              to="/faculty"
              className={`inline-flex items-center gap-1 text-xs font-bold self-start md:self-auto ${facultyStyles.accentText}`}
            >
              <span>Faculty Directory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Clinical Profile Cards */}
          <div className={medicalGridCols}>
            {facultyList.map((f, idx) => (
              <div
                key={idx}
                className={`${facultyStyles.cardBg} ${facultyStyles.cardBorder} ${facultyStyles.cardHover} flex flex-col justify-between`}
              >
                <div>
                  {/* Photo Frame */}
                  <div className="h-44 rounded-xl overflow-hidden mb-4 bg-teal-50/60 border border-teal-100 flex items-center justify-center">
                    {f.imageUrl ? (
                      <img
                        src={f.imageUrl}
                        alt={f.name}
                        className="w-full h-full object-cover object-top"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-teal-100 text-teal-700 font-extrabold text-2xl flex items-center justify-center shadow-inner">
                        {f.name ? f.name.charAt(0).toUpperCase() : 'Dr'}
                      </div>
                    )}
                  </div>

                  {/* Doctor Info */}
                  <div className="space-y-2">
                    <div>
                      <h3 className="font-sans font-bold text-slate-900 text-base leading-snug">
                        {f.name}
                      </h3>
                      <p className={facultyStyles.roleFont || 'text-xs text-teal-700 font-bold'}>
                        {f.designation}
                      </p>
                    </div>

                    {/* Chips */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {f.department && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-teal-50 text-teal-800 border border-teal-200/80 px-2 py-0.5 rounded-md">
                          <span>🏥</span>
                          <span className="truncate max-w-[140px]">{f.department}</span>
                        </span>
                      )}
                      {f.qualification && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-cyan-50 text-cyan-800 border border-cyan-200/80 px-2 py-0.5 rounded-md">
                          <span>🎓</span>
                          <span className="truncate max-w-[140px]">{f.qualification}</span>
                        </span>
                      )}
                    </div>

                    {f.specialization && (
                      <p className="text-[11px] text-slate-500 line-clamp-2 pt-1">
                        {f.specialization}
                      </p>
                    )}
                  </div>
                </div>

                {/* Profile Link */}
                <div className="pt-4 mt-4 border-t border-teal-100/80">
                  <Link
                    to={f.profileUrl || `/faculty/${f.id || ''}`}
                    className="inline-flex items-center justify-between w-full text-xs font-bold text-teal-700 hover:text-teal-900 transition-colors"
                  >
                    <span>View Clinical Profile</span>
                    <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom All Faculty CTA */}
          <div className="mt-8 flex justify-center">
            <Link
              to="/faculty"
              className={`inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all duration-200 hover:-translate-y-0.5 ${facultyStyles.primaryBtn || 'bg-teal-600 hover:bg-teal-700 text-white'}`}
            >
              <span>View All Faculty Directory</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </Link>
          </div>

        </div>
      </section>
    );
  }

  // =========================================================================
  // 3. TEMPLATE 4: UNIVERSITY — PRESTIGIOUS LEADERSHIP SHOWCASE & CAROUSEL
  // =========================================================================
  if (layoutVariant === 'showcase') {
    const currentFaculty = facultyList[activeShowcaseIdx] || facultyList[0];

    return (
      <section className={`py-8 sm:py-10 ${facultyStyles.sectionBg} transition-colors`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-7 sm:mb-8 space-y-2">
            {sectionBadge && (
              <div className={`inline-flex items-center gap-1.5 px-3.5 py-0.5 rounded-full text-xs font-serif ${facultyStyles.sectionHeaderBadge}`}>
                <Award className="w-3.5 h-3.5" />
                <span>{sectionBadge}</span>
              </div>
            )}
            <h2 className={facultyStyles.headingFont}>
              {sectionTitle}
            </h2>
            {sectionSubtitle && (
              <p className={`${facultyStyles.subtitleFont}`}>
                {sectionSubtitle}
              </p>
            )}
          </div>

          {/* Featured Showcase Card */}
          {currentFaculty && (
            <div className={`${facultyStyles.cardBg} ${facultyStyles.cardBorder} transition-all duration-300`}>
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 lg:gap-8">
                
                {/* Prominent Portrait Cameo */}
                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border-2 border-[#d4af37] shadow-lg shrink-0 bg-slate-800 flex items-center justify-center">
                  {currentFaculty.imageUrl ? (
                    <img
                      src={currentFaculty.imageUrl}
                      alt={currentFaculty.name}
                      className="w-full h-full object-cover object-top"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-900 text-[#d4af37] font-serif font-black text-3xl flex items-center justify-center">
                      {currentFaculty.name ? currentFaculty.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                </div>

                {/* Academic Profile Details */}
                <div className="flex-1 min-w-0 text-center sm:text-left space-y-2.5">
                  <div>
                    <h3 className="font-serif font-bold text-xl sm:text-2xl text-white tracking-wide">
                      {currentFaculty.name}
                    </h3>
                    <p className="font-serif text-sm sm:text-base text-[#d4af37] font-semibold mt-0.5">
                      {currentFaculty.designation} {currentFaculty.department ? `• ${currentFaculty.department}` : ''}
                    </p>
                  </div>

                  {currentFaculty.qualification && (
                    <p className="text-xs text-slate-300 font-medium">
                      {currentFaculty.qualification}
                    </p>
                  )}

                  {currentFaculty.specialization && (
                    <p className="text-xs text-slate-300/80 leading-relaxed max-w-xl">
                      Research & Expertise: {currentFaculty.specialization}
                    </p>
                  )}

                  <div className="pt-2 border-t border-[#d4af37]/20 flex items-center justify-between">
                    <Link
                      to={currentFaculty.profileUrl || `/faculty/${currentFaculty.id || ''}`}
                      className="inline-flex items-center gap-1.5 text-xs font-serif font-bold text-[#d4af37] hover:text-amber-300"
                    >
                      <span>View Full Profile</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    {/* Next / Previous arrows */}
                    {facultyList.length > 1 && (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setActiveShowcaseIdx((prev) => (prev > 0 ? prev - 1 : facultyList.length - 1))}
                          className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
                          aria-label="Previous faculty"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setActiveShowcaseIdx((prev) => (prev < facultyList.length - 1 ? prev + 1 : 0))}
                          className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
                          aria-label="Next faculty"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Selector Dots / Thumbnails */}
          {facultyList.length > 1 && (
            <div className="mt-5 flex items-center justify-center gap-2">
              {facultyList.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveShowcaseIdx(idx)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${activeShowcaseIdx === idx ? 'w-8 bg-[#d4af37]' : 'w-2.5 bg-slate-300 dark:bg-slate-700'}`}
                  aria-label={`View faculty member ${idx + 1}`}
                />
              ))}
            </div>
          )}

          {/* Bottom All Faculty CTA */}
          <div className="mt-8 flex justify-center">
            <Link
              to="/faculty"
              className={`inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-serif font-bold shadow-sm transition-all duration-200 hover:-translate-y-0.5 ${facultyStyles.primaryBtn || 'bg-[#d4af37] hover:bg-amber-400 text-slate-950'}`}
            >
              <span>View Full Faculty Directory</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </Link>
          </div>

        </div>
      </section>
    );
  }

  // =========================================================================
  // 4. TEMPLATE 1: ENGINEERING — MODERN FACULTY GRID
  // =========================================================================
  const engGridCols = facultyList.length === 2
    ? 'max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-5'
    : facultyList.length === 3
    ? 'max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'
    : 'max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5';

  return (
    <section className={`py-8 sm:py-10 ${facultyStyles.sectionBg} transition-colors`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-7 sm:mb-8 gap-3">
          <div>
            {sectionBadge && (
              <div className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold mb-2 ${facultyStyles.sectionHeaderBadge}`}>
                <Users className="w-3.5 h-3.5" />
                <span>{sectionBadge}</span>
              </div>
            )}
            <h2 className={facultyStyles.headingFont}>
              {sectionTitle}
            </h2>
            {sectionSubtitle && (
              <p className={`${facultyStyles.subtitleFont} mt-1`}>
                {sectionSubtitle}
              </p>
            )}
          </div>
          <Link
            to="/faculty"
            className={`inline-flex items-center gap-1 text-xs font-bold self-start md:self-auto ${facultyStyles.accentText}`}
          >
            <span>Faculty Directory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 3/4-Column Engineering Grid Cards */}
        <div className={engGridCols}>
          {facultyList.map((f, idx) => (
            <div
              key={idx}
              className={`${facultyStyles.cardBg} ${facultyStyles.cardHover} flex flex-col justify-between`}
            >
              <div>
                {/* Photo Frame */}
                <div className="h-44 sm:h-48 overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center border-b border-blue-100/70">
                  {f.imageUrl ? (
                    <img
                      src={f.imageUrl}
                      alt={f.name}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 font-black text-2xl flex items-center justify-center shadow-inner">
                      {f.name ? f.name.charAt(0).toUpperCase() : 'F'}
                    </div>
                  )}
                </div>

                {/* Faculty Details */}
                <div className="p-4 sm:p-5 space-y-2">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                      {f.name}
                    </h3>
                    <p className={facultyStyles.roleFont || 'text-xs text-blue-600 font-semibold'}>
                      {f.designation}
                    </p>
                  </div>

                  {f.department && (
                    <div className="pt-0.5">
                      <span className="inline-block text-[10px] font-mono font-bold uppercase tracking-wider bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
                        {f.department}
                      </span>
                    </div>
                  )}

                  {f.qualification && (
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                      {f.qualification}
                    </p>
                  )}

                  {f.specialization && (
                    <p className="text-[11px] text-slate-500 line-clamp-2">
                      {f.specialization}
                    </p>
                  )}
                </div>
              </div>

              {/* View Profile Action Link */}
              <div className="p-4 pt-0">
                <Link
                  to={f.profileUrl || `/faculty/${f.id || ''}`}
                  className="inline-flex items-center justify-between w-full text-xs font-bold text-blue-600 hover:text-blue-800 pt-3 border-t border-slate-100 dark:border-slate-800 transition-colors"
                >
                  <span>View Academic Profile</span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                </Link>
              </div>

            </div>
          ))}
        </div>

        {/* Bottom All Faculty CTA */}
        <div className="mt-8 flex justify-center">
          <Link
            to="/faculty"
            className={`inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all duration-200 hover:-translate-y-0.5 ${facultyStyles.primaryBtn || 'bg-blue-600 hover:bg-blue-700 text-white'}`}
          >
            <span>View All Faculty Directory</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </Link>
        </div>

      </div>
    </section>
  );
};
