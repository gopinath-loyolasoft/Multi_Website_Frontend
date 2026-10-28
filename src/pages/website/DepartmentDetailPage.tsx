import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Building2,
  BookOpen,
  GraduationCap,
  Users,
  FlaskConical,
  Mail,
  Phone,
  ArrowLeft,
  FileText,
  Download,
  Eye,
  CheckCircle2,
  Award,
  Sparkles,
  Layers,
  Clock,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { apiClient } from '../../services/apiClient';
import { Department, Course, FacultyMember, SemesterSyllabusItem, DepartmentSyllabusItem } from '../../types';
import { useTheme } from '../../themes/ThemeContext';
import { PdfDocumentViewerModal } from '../../components/common/PdfDocumentViewerModal';

export const DepartmentDetailPage: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const { isArtsAndScience, isMedical, isUniversity } = useTheme();

  const [department, setDepartment] = useState<Department | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'overview' | 'hod' | 'faculty' | 'labs' | 'syllabus'>('overview');

  // Document Viewer State
  const [selectedDoc, setSelectedDoc] = useState<{ url: string; title: string; subtitle?: string } | null>(null);

  useEffect(() => {
    const fetchDepartment = async () => {
      if (!code) return;
      try {
        setLoading(true);
        const res = await apiClient.get(`/site/departments/${code}`);
        if (res.data.success && res.data.data) {
          setDepartment(res.data.data);
        } else {
          setError('Department details not found.');
        }
      } catch (err) {
        console.error('Failed to load department details:', err);
        setError('Unable to load department information. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchDepartment();
  }, [code]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-16 px-4">
        <div className="max-w-7xl mx-auto space-y-6 animate-pulse">
          <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
          <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded-2xl w-2/3" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-80 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
            <div className="h-80 bg-slate-200 dark:bg-slate-800 rounded-2xl md:col-span-2" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !department) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-20 px-4 text-center">
        <div className="max-w-md mx-auto p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Department Not Found</h2>
          <p className="text-xs text-slate-500 leading-relaxed">{error || 'The requested department code does not exist.'}</p>
          <Link
            to="/departments"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Departments</span>
          </Link>
        </div>
      </div>
    );
  }

  const courses = department.courses || [];
  const faculty = department.faculty || [];
  const laboratories = department.laboratories || [];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* ─── 1. HERO HEADER ────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-950 text-white py-14 md:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Department cover image as hero background (falls back to gradient) */}
        {department.imageUrl && (
          <div className="absolute inset-0">
            <img src={department.imageUrl} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-blue-950/85 to-indigo-950/80" />
          </div>
        )}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-200/80 mb-4">
            <Link to="/" className="hover:text-white transition">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link to="/departments" className="hover:text-white transition">Departments</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white font-bold">{department.code}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-xs font-bold text-blue-300">
                <Building2 className="w-3.5 h-3.5" />
                <span>{department.stream || 'Engineering & Technology'}</span>
                <span className="opacity-40">•</span>
                <span>Code: {department.code}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
                {department.name}
              </h1>

              {department.description && (
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
                  {department.description}
                </p>
              )}
            </div>

            {/* Quick Stats Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white/10 backdrop-blur-md border border-white/15 p-4 rounded-2xl shrink-0 text-center">
              <div className="p-2">
                <span className="block text-2xl font-black text-white">{courses.length}</span>
                <span className="text-[10px] text-blue-200 font-semibold uppercase">Degrees</span>
              </div>
              <div className="p-2 sm:border-x border-white/10">
                <span className="block text-2xl font-black text-white">{faculty.length}</span>
                <span className="text-[10px] text-blue-200 font-semibold uppercase">Faculty</span>
              </div>
              <div className="p-2">
                <span className="block text-2xl font-black text-white">{laboratories.length || department.labCount || 0}</span>
                <span className="text-[10px] text-blue-200 font-semibold uppercase">Labs</span>
              </div>
              <div className="p-2 sm:border-l border-white/10">
                <span className="block text-2xl font-black text-white">{department.studentCount || 0}</span>
                <span className="text-[10px] text-blue-200 font-semibold uppercase">Students</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 2. TAB NAVIGATION ─────────────────────────────────────────── */}
      <section className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2.5">
            {[
              { key: 'overview', label: 'Overview & Vision', icon: Sparkles },
              { key: 'hod', label: 'HOD Desk', icon: Users },
              { key: 'faculty', label: `Faculty (${faculty.length})`, icon: GraduationCap },
              { key: 'labs', label: `Laboratories (${laboratories.length || department.labCount || 0})`, icon: FlaskConical },
              { key: 'syllabus', label: 'Curriculum & Syllabi (Sem 1-N)', icon: BookOpen },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── 3. TAB CONTENT VIEWS ──────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        {/* ── TAB 1: OVERVIEW & VISION / MISSION ── */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Vision & Mission Card - Displayed when configured in DB */}
              {department.visionMission && (
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400 flex items-center justify-center">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                        Vision & Mission
                      </h3>
                      <p className="text-xs text-slate-500">Core guiding principles of the department</p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <div className="p-5 rounded-2xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 space-y-2">
                      <span className="text-[11px] font-black uppercase tracking-wider text-blue-700 dark:text-blue-400">
                        Department Vision & Objectives
                      </span>
                      <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                        {department.visionMission}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Degrees Offered Summary */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    <span>Courses &amp; Programs Offered</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab('syllabus')}
                    className="text-xs text-blue-600 font-bold hover:underline"
                  >
                    View All Syllabi & Regulations ➔
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {courses.map((course) => (
                    <div
                      key={course.id}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex flex-col justify-between"
                    >
                      <div>
                        <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-[10px] font-bold uppercase">
                          {course.degreeLevel}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-2">
                          {course.name}
                        </h4>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                          {course.description}
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-500">
                        <span>Duration: <strong>{course.durationYears} Years</strong></span>
                        <button
                          onClick={() => setActiveTab('syllabus')}
                          className="font-bold text-blue-600 hover:underline"
                        >
                          Syllabus (Sem 1-{course.totalSemesters || 8})
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Contact & HOD Cardlet */}
            <div className="space-y-6">
              {department.headOfDepartment && (
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-4">
                  <div className="w-20 h-20 rounded-2xl bg-blue-600 text-white font-black text-xl flex items-center justify-center mx-auto shadow-md overflow-hidden">
                    {department.hodPhotoUrl ? (
                      <img src={department.hodPhotoUrl} alt={department.headOfDepartment} className="w-full h-full object-cover" />
                    ) : (
                      department.headOfDepartment.split(' ').map((n) => n[0]).join('').slice(0, 2)
                    )}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Head of Department
                    </span>
                    <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                      {department.headOfDepartment}
                    </h4>
                    {department.email && (
                      <a href={`mailto:${department.email}`} className="text-xs text-blue-600 font-medium hover:underline block mt-1">
                        {department.email}
                      </a>
                    )}
                  </div>
                  <button
                    onClick={() => setActiveTab('hod')}
                    className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold transition cursor-pointer"
                  >
                    Read HOD Welcome Note
                  </button>
                </div>
              )}

              {/* Department Contact Card */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Department Information Desk
                </h4>
                <div className="space-y-2.5 text-xs">
                  {department.email && (
                    <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
                      <Mail className="w-4 h-4 text-blue-600 shrink-0" />
                      <span className="truncate">{department.email}</span>
                    </div>
                  )}
                  {department.phone && (
                    <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
                      <Phone className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>{department.phone}</span>
                    </div>
                  )}
                  {!department.email && !department.phone && (
                    <div className="flex items-center gap-2.5 text-slate-400 dark:text-slate-500 italic">
                      <Phone className="w-4 h-4 shrink-0" />
                      <span>Contact details will be updated soon.</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2: HOD DESK ── */}
        {activeTab === 'hod' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm max-w-4xl mx-auto space-y-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 border-b border-slate-100 dark:border-slate-800 pb-8">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-blue-600 text-white font-black text-3xl flex items-center justify-center shrink-0 shadow-lg overflow-hidden">
                {department.hodPhotoUrl ? (
                  <img src={department.hodPhotoUrl} alt={department.headOfDepartment} className="w-full h-full object-cover" />
                ) : (
                  (department.headOfDepartment || 'HD').split(' ').map((n) => n[0]).join('').slice(0, 2)
                )}
              </div>
              <div className="text-center sm:text-left space-y-1.5">
                <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 text-xs font-bold uppercase">
                  Leadership Desk
                </span>
                <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100">
                  {department.headOfDepartment || 'Prof. Head of Department'}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Professor & Head, Department of {department.name}
                </p>
                {department.email && (
                  <p className="text-xs text-blue-600">
                    Email: <a href={`mailto:${department.email}`} className="hover:underline">{department.email}</a>
                  </p>
                )}
              </div>
            </div>

            {/* HOD Welcome Message - Displayed when configured */}
            {department.hodMessage ? (
              <div className="space-y-4 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Welcome Message from the Head of Department
                </h4>
                <p className="whitespace-pre-line">
                  {department.hodMessage}
                </p>
              </div>
            ) : (
              <div className="text-center py-12 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                <Users className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Message coming soon</h4>
                <p className="text-xs text-slate-500 mt-1">The Head of Department's welcome note will be published shortly.</p>
              </div>
            )}
          </div>
        )}

        {/* ── TAB 3: FACULTY DIRECTORY ── */}
        {activeTab === 'faculty' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  Department Faculty Members
                </h3>
                <p className="text-xs text-slate-500">
                  Renowned professors, researchers, and mentors guiding our students
                </p>
              </div>
              <span className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold">
                {faculty.length} Faculty Members
              </span>
            </div>

            {faculty.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 max-w-md mx-auto">
                <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h4 className="font-bold text-slate-800 dark:text-slate-200">No faculty listed</h4>
                <p className="text-xs text-slate-500 mt-1">Faculty directory will be updated shortly.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {faculty.map((f) => (
                  <div
                    key={f.id}
                    className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-sm flex items-center justify-center shrink-0 overflow-hidden">
                        {f.profileImageUrl ? (
                          <img src={f.profileImageUrl} alt={f.name} className="w-full h-full object-cover" />
                        ) : (
                          f.name.split(' ').map((n) => n[0]).join('').slice(0, 2)
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                          {f.name}
                        </h4>
                        <span className="block text-xs font-semibold text-blue-600 dark:text-blue-400 mt-0.5 truncate">
                          {f.designation}
                        </span>
                        <span className="block text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                          {f.qualification}
                        </span>
                      </div>
                    </div>

                    {f.specialization && (
                      <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300">
                        <strong>Focus:</strong> {f.specialization}
                      </div>
                    )}

                    {f.email && (
                      <div className="mt-2 text-[11px]">
                        <a href={`mailto:${f.email}`} className="text-blue-600 hover:underline flex items-center gap-1.5 truncate">
                          <Mail className="w-3 h-3 shrink-0" />
                          <span className="truncate">{f.email}</span>
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── TAB 4: LABORATORIES & INFRASTRUCTURE ── */}
        {activeTab === 'labs' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Department Laboratories & Specialized Facilities
              </h3>
              <p className="text-xs text-slate-500">
                Modern research suites and practical testing environments
              </p>
            </div>

            {laboratories.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 max-w-md mx-auto">
                <FlaskConical className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h4 className="font-bold text-slate-800 dark:text-slate-200">No laboratories listed yet</h4>
                <p className="text-xs text-slate-500 mt-1">Department laboratory and equipment details will be published by the administration.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {laboratories.map((lab, i) => (
                  <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
                      <FlaskConical className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{lab.name}</h4>
                    {lab.description && <p className="text-xs text-slate-500 leading-relaxed">{lab.description}</p>}
                    {lab.equipment && (
                      <div className="text-[11px] text-slate-600 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700">
                        <strong>Equipment:</strong> {lab.equipment}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── TAB 5: DYNAMIC SEMESTER SYLLABI (SEM 1 TO N) ── */}
        {activeTab === 'syllabus' && (
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Curriculum, Regulations & Semester-wise Syllabi
              </h3>
              <p className="text-xs text-slate-500">
                Official syllabus booklets and curriculum regulations for all degree pathways (Semesters 1 to {department.totalSemesters || 8})
              </p>
            </div>

            {/* ── DEPARTMENT SYLLABI & REGULATIONS SECTION ── */}
            {(() => {
              let parsedSyllabi: DepartmentSyllabusItem[] = [];
              if (Array.isArray(department.syllabi) && department.syllabi.length > 0) {
                parsedSyllabi = department.syllabi;
              } else if (department.syllabiJson) {
                try {
                  const p = JSON.parse(department.syllabiJson);
                  if (Array.isArray(p) && p.length > 0) parsedSyllabi = p;
                } catch {}
              }
              if (parsedSyllabi.length === 0 && department.syllabusPdfUrl) {
                parsedSyllabi = [
                  {
                    id: '1',
                    title: 'Department Master Curriculum & Regulations Handbook',
                    fileUrl: department.syllabusPdfUrl,
                    fileName: 'Master_Curriculum.pdf',
                    fileType: 'pdf',
                  },
                ];
              }

              if (parsedSyllabi.length === 0) return null;

              return (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span>Department Syllabi &amp; Academic Handbooks ({parsedSyllabi.length})</span>
                    </h4>
                    <span className="text-xs text-slate-400 font-medium">
                      Official Curriculum Downloads
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {parsedSyllabi.map((syl, sIdx) => {
                      const ext = (syl.fileType || syl.fileUrl.split('.').pop() || 'pdf').toLowerCase();
                      const isPdf = ext === 'pdf';
                      const isWord = ext === 'doc' || ext === 'docx';

                      return (
                        <div
                          key={syl.id || sIdx}
                          className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 text-white shadow-md border border-blue-400/20 flex flex-col justify-between space-y-4 hover:border-blue-400/40 hover:shadow-lg transition group"
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span
                                className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] uppercase border ${
                                  isWord
                                    ? 'bg-blue-500/20 text-blue-300 border-blue-400/30'
                                    : 'bg-purple-500/20 text-purple-300 border-purple-400/30'
                                }`}
                              >
                                {isWord ? 'WORD DOC' : 'PDF'}
                              </span>
                              <span className="text-[10px] text-slate-400 font-medium font-mono">
                                {syl.academicYear || department.code}
                              </span>
                            </div>
                            <h5 className="text-sm font-bold text-white leading-snug group-hover:text-blue-200 transition line-clamp-2">
                              {syl.title || 'Syllabus & Regulations'}
                            </h5>
                            {syl.fileName && syl.fileName !== syl.title && (
                              <p className="text-[11px] text-slate-400 font-mono truncate">
                                {syl.fileName}
                              </p>
                            )}
                          </div>

                          <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                            {isPdf ? (
                              <button
                                type="button"
                                onClick={() =>
                                  setSelectedDoc({
                                    url: syl.fileUrl,
                                    title: `${department.name} - ${syl.title}`,
                                    subtitle: `Department Code: ${department.code}`,
                                  })
                                }
                                className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-sm cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>View Document</span>
                              </button>
                            ) : (
                              <a
                                href={syl.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition text-center"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Open Document</span>
                              </a>
                            )}
                            <a
                              href={syl.fileUrl}
                              download
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                              title="Download Document"
                            >
                              <Download className="w-4 h-4" />
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {courses.map((course) => {
              const totalSems = course.totalSemesters || (course.durationYears ? Math.round(course.durationYears * 2) : 8);
              const syllabi = course.semesterSyllabi || [];

              return (
                <div
                  key={course.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6"
                >
                  {/* Course Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-[10px] font-bold uppercase">
                          {course.degreeLevel}
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-400">
                          Regulation: {course.regulationYear || '2024'}
                        </span>
                      </div>
                      <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-1">
                        {course.name} ({course.code})
                      </h4>
                    </div>

                    {course.syllabusPdfUrl && (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedDoc({
                              url: course.syllabusPdfUrl!,
                              title: `${course.name} - Complete Syllabus Book`,
                              subtitle: `Regulation ${course.regulationYear || '2024'}`,
                            })
                          }
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition cursor-pointer shadow-xs"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Full Syllabus Book</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Semester 1 to N Grid */}
                  <div className="space-y-3">
                    <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                      Semester Breakdown ({totalSems} Semesters)
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                      {Array.from({ length: totalSems }, (_, i) => i + 1).map((semNum) => {
                        const semItem = syllabi.find((s) => s.semesterNumber === semNum);
                        const semTitle = semItem?.title || `Semester ${semNum} Syllabus`;
                        const semPdfUrl = semItem?.pdfUrl || course.syllabusPdfUrl;

                        return (
                          <div
                            key={semNum}
                            className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/70 flex flex-col justify-between space-y-3"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <span className="w-6 h-6 rounded-lg bg-blue-600 text-white text-xs font-black flex items-center justify-center mb-2 shadow-xs">
                                  {semNum}
                                </span>
                                <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                                  {semTitle}
                                </h5>
                                <p className="text-[10px] text-slate-400 mt-0.5">
                                  Regulation {course.regulationYear || '2024'}
                                </p>
                              </div>
                            </div>

                            {/* View & Download Buttons */}
                            <div className="pt-2 border-t border-slate-200/70 dark:border-slate-700/70 flex items-center justify-between gap-2">
                              {semPdfUrl ? (
                                <>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setSelectedDoc({
                                        url: semPdfUrl,
                                        title: `${course.name} - Semester ${semNum} Syllabus`,
                                        subtitle: `Regulation ${course.regulationYear || '2024'}`,
                                      })
                                    }
                                    className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                                  >
                                    <Eye className="w-3 h-3" />
                                    <span>View</span>
                                  </button>

                                  <a
                                    href={semPdfUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    download
                                    className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                                  >
                                    <Download className="w-3 h-3" />
                                    <span>PDF</span>
                                  </a>
                                </>
                              ) : (
                                <span className="text-[10px] text-slate-400 italic">No document attached</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ─── 4. INLINE PDF VIEWER MODAL ─────────────────────────────────── */}
      {selectedDoc && (
        <PdfDocumentViewerModal
          isOpen={!!selectedDoc}
          onClose={() => setSelectedDoc(null)}
          title={selectedDoc.title}
          subtitle={selectedDoc.subtitle}
          documentUrl={selectedDoc.url}
        />
      )}
    </div>
  );
};
