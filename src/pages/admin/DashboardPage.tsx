import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Newspaper, 
  CalendarDays, 
  ArrowRight, 

  Building2,
  BookOpen,
  Users,
  Image,
  Sliders,
  ShieldCheck,
  Sparkles,
  Menu,
  Volume2,
  UserCheck,
  RefreshCw,
  Globe
} from 'lucide-react';
import { apiClient } from '../../services/apiClient';
import { useTenant } from '../../tenant/TenantContext';
import { LivePreviewModal } from '../../UI_Componentes/ui';

export const DashboardPage: React.FC = () => {
  const { siteConfig, tenantDomain } = useTenant();
  const [newsCount, setNewsCount] = useState(0);
  const [eventsCount, setEventsCount] = useState(0);
  const [deptCount, setDeptCount] = useState(0);
  const [coursesCount, setCoursesCount] = useState(0);
  const [facultyCount, setFacultyCount] = useState(0);
  const [menusCount, setMenusCount] = useState(0);
  const [marqueeCount, setMarqueeCount] = useState(0);
  const [galleryCount, setGalleryCount] = useState(0);
  const [bannersCount, setBannersCount] = useState(0);
  const [admissionsCount, setAdmissionsCount] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const tenantDbName = siteConfig?.tenant.databaseName || `college_${siteConfig?.tenant.tenantCode?.toLowerCase() || 'database'}`;

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [
        newsRes, 
        eventsRes, 
        deptRes, 
        coursesRes, 
        facultyRes,
        menusRes,
        marqueeRes,
        galleryRes,
        bannersRes,
        admissionsRes
      ] = await Promise.allSettled([
        apiClient.get('/admin/news'),
        apiClient.get('/admin/events'),
        apiClient.get('/admin/departments'),
        apiClient.get('/admin/courses'),
        apiClient.get('/admin/faculty'),
        apiClient.get('/admin/menus'),
        apiClient.get('/admin/marquee'),
        apiClient.get('/admin/gallery'),
        apiClient.get('/admin/banners'),
        apiClient.get('/admin/contact/submissions')
      ]);
      if (newsRes.status === 'fulfilled' && newsRes.value.data.success) {
        setNewsCount(newsRes.value.data.data?.length || newsRes.value.data.data?.items?.length || 0);
      }
      if (eventsRes.status === 'fulfilled' && eventsRes.value.data.success) {
        setEventsCount(eventsRes.value.data.data?.length || eventsRes.value.data.data?.items?.length || 0);
      }
      if (deptRes.status === 'fulfilled' && deptRes.value.data.success) {
        setDeptCount(deptRes.value.data.data?.length || deptRes.value.data.data?.items?.length || 0);
      }
      if (coursesRes.status === 'fulfilled' && coursesRes.value.data.success) {
        setCoursesCount(coursesRes.value.data.data?.length || coursesRes.value.data.data?.items?.length || 0);
      }
      if (facultyRes.status === 'fulfilled' && facultyRes.value.data.success) {
        setFacultyCount(facultyRes.value.data.data?.length || facultyRes.value.data.data?.items?.length || 0);
      }
      if (menusRes.status === 'fulfilled' && menusRes.value.data.success) {
        setMenusCount(menusRes.value.data.data?.length || 0);
      }
      if (marqueeRes.status === 'fulfilled' && marqueeRes.value.data.success) {
        setMarqueeCount(marqueeRes.value.data.data?.items?.length || 0);
      }
      if (galleryRes.status === 'fulfilled' && galleryRes.value.data.success) {
        setGalleryCount(galleryRes.value.data.data?.length || galleryRes.value.data.data?.items?.length || 0);
      }
      if (bannersRes.status === 'fulfilled' && bannersRes.value.data.success) {
        setBannersCount(bannersRes.value.data.data?.length || 0);
      }
      if (admissionsRes.status === 'fulfilled' && admissionsRes.value.data.success) {
        setAdmissionsCount(admissionsRes.value.data.data?.length || admissionsRes.value.data.data?.items?.length || 0);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const enabledFeatures = siteConfig?.enabledFeatures || [];
  const isFeatureActive = (code: string) => enabledFeatures.includes(code.toUpperCase());

  const allCards = [
    { label: 'Navigation Menus', count: menusCount || 1, icon: Menu, link: '/admin/menus', color: 'bg-cyan-600', feature: 'MENUS', desc: 'Header & footer hierarchies' },
    { label: 'Marquee Bar Ticker', count: marqueeCount, icon: Volume2, link: '/admin/marquee', color: 'bg-amber-600', feature: 'MARQUEE', desc: 'Urgent announcements' },
    { label: 'Academic Departments', count: deptCount, icon: Building2, link: '/admin/departments', color: 'bg-indigo-600', feature: 'DEPARTMENTS', desc: 'Faculties & HODs' },
    { label: 'Degree Programs', count: coursesCount, icon: BookOpen, link: '/admin/courses', color: 'bg-purple-600', feature: 'COURSES', desc: 'UG, PG & PhD offerings' },
    { label: 'Faculty Directory', count: facultyCount, icon: Users, link: '/admin/faculty', color: 'bg-teal-600', feature: 'FACULTY', desc: 'Professors & mentors' },
    { label: 'Campus News Articles', count: newsCount, icon: Newspaper, link: '/admin/news', color: 'bg-orange-600', feature: 'NEWS', desc: 'Press & announcements' },
    { label: 'Upcoming Events', count: eventsCount, icon: CalendarDays, link: '/admin/events', color: 'bg-emerald-600', feature: 'EVENTS', desc: 'Workshops & seminars' },
    { label: 'Photo Gallery', count: galleryCount, icon: Image, link: '/admin/gallery', color: 'bg-rose-600', feature: 'GALLERY', desc: 'Albums & photos' },
    { label: 'Slider Banners', count: bannersCount, icon: Sliders, link: '/admin/banners', color: 'bg-violet-600', feature: 'BANNERS', desc: 'Hero slide promotions' },
    { label: 'Admission Inquiries', count: admissionsCount, icon: UserCheck, link: '/admin/admissions', color: 'bg-pink-600', feature: 'ADMISSIONS', desc: 'Student inquiries' },
  ];

  const visibleCards = allCards.filter(c => isFeatureActive(c.feature));

  return (
    <div className="space-y-6 font-sans text-slate-900">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Sparkles className="w-6 h-6 text-blue-600" />
            <span>Welcome, {siteConfig?.tenant.name || 'College'} Administrator!</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Managing isolated tenant database <code className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-mono font-semibold">{tenantDbName}</code> mapped to domain <code className="text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded font-mono font-semibold">{tenantDomain}</code>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchStats}
            disabled={loading}
            className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-xs font-semibold transition shadow-2xs cursor-pointer"
            title="Refresh Stats"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 transition shadow-xs shrink-0 text-xs cursor-pointer"
            title="Preview Live Website In-Page"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>View Public Site</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {visibleCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div 
              key={i} 
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3 hover:shadow-md transition flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">{stat.label}</span>
                  <span className="text-[11px] text-slate-400">{stat.desc}</span>
                </div>
                <div className={`w-9 h-9 rounded-lg ${stat.color} text-white flex items-center justify-center shadow-xs shrink-0`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-bold text-slate-900">
                {loading ? '...' : stat.count}
              </div>
              <Link
                to={stat.link}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline pt-2.5 border-t border-slate-100"
              >
                <span>Manage {stat.label}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          );
        })}
      </div>

      {/* Quick Launchpad & Active Modules */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>Active College Tenant Features ({enabledFeatures.length} Enabled by SuperAdmin)</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">Isolated DB: {tenantDbName}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {enabledFeatures.map((code) => (
            <span
              key={code}
              className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-50 border border-slate-200 text-slate-700 font-mono flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>{code}</span>
            </span>
          ))}
        </div>
      </div>

      {/* In-Page Live Preview Modal for Dashboard */}
      <LivePreviewModal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        urlPath="/"
        title={`${siteConfig?.tenant.name || 'College'} Live Website Preview`}
      />
    </div>
  );
};
