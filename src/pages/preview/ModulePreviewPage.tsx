import React, { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { 
  Volume2, 
  Menu as MenuIcon, 
  Sliders, 
  Newspaper, 
  CalendarDays, 
  Building2, 
  BookOpen, 
  Users, 
  Camera, 
  UserCheck, 
  Layout, 
  Globe, 
  ExternalLink,
  GraduationCap,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  ChevronDown,
  BarChart3,
  Quote,
  Award,
  Trophy,
  Briefcase,
  FileCheck,
  TrendingUp
} from 'lucide-react';

const getPreviewStatIcon = (iconName?: string) => {
  switch ((iconName || '').toLowerCase()) {
    case 'users':
      return Users;
    case 'award':
      return Award;
    case 'bookopen':
      return BookOpen;
    case 'building2':
      return Building2;
    case 'trophy':
      return Trophy;
    case 'briefcase':
      return Briefcase;
    case 'filecheck':
      return FileCheck;
    case 'trendingup':
      return TrendingUp;
    case 'barchart3':
      return BarChart3;
    case 'graduationcap':
    default:
      return GraduationCap;
  }
};
import { useTenant } from '../../tenant/TenantContext';
import { MarqueeBar } from '../../components/common/MarqueeBar';
import { NewsSection } from '../../components/sections/NewsSection';
import { EventsSection } from '../../components/sections/EventsSection';
import { DepartmentsSection } from '../../components/sections/DepartmentsSection';
import { CoursesSection } from '../../components/sections/CoursesSection';
import { FacultySection } from '../../components/sections/FacultySection';
import { GallerySection } from '../../components/sections/GallerySection';
import { HeroSliderSection } from '../../components/sections/HeroSliderSection';

export const ModulePreviewPage: React.FC = () => {
  const { moduleKey: pathModuleKey } = useParams<{ moduleKey: string }>();
  const [searchParams] = useSearchParams();
  const queryModuleKey = searchParams.get('module');
  const activeModule = (pathModuleKey || queryModuleKey || 'marquee').toLowerCase().trim();

  const { siteConfig, loading } = useTenant();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white p-6">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-sm font-semibold text-slate-300">Loading module preview environment...</p>
      </div>
    );
  }

  const tenant = siteConfig?.tenant || { name: 'Sample College', code: 'COLLEGE' };
  const themeConfig = siteConfig?.theme?.configuration;
  const primaryMenu = siteConfig?.primaryMenu || [];
  const visibleMenus = primaryMenu.filter((item) => item.isVisible !== false);

  // Map module keys to metadata
  const moduleMeta: Record<string, { name: string; icon: React.ElementType; desc: string }> = {
    marquee: { name: 'Marquee Announcement Ticker', icon: Volume2, desc: 'Top rolling notification banner' },
    header: { name: 'Navigation Menu & Top Header', icon: MenuIcon, desc: 'Main navigation bar with dropdowns' },
    menus: { name: 'Navigation Menu & Top Header', icon: MenuIcon, desc: 'Main navigation bar with dropdowns' },
    banners: { name: 'Hero Promotional Slider', icon: Sliders, desc: 'Full-width showcase slide banners' },
    hero: { name: 'Hero Promotional Slider', icon: Sliders, desc: 'Full-width showcase slide banners' },
    stats: { name: 'Stats Counter Bar', icon: BarChart3, desc: 'Key metrics & performance counter cards' },
    quote: { name: 'Welcome Quote & Message', icon: Quote, desc: 'Chancellor / Leadership message banner' },
    admissions: { name: 'Admissions & Inquiry Lead Form', icon: UserCheck, desc: 'Prospective student application & counseling CTA' },
    news: { name: 'Campus News Bulletin', icon: Newspaper, desc: 'Press announcements and academic news grid' },
    events: { name: 'College Events Calendar', icon: CalendarDays, desc: 'Upcoming workshops, symposiums, and sports dates' },
    departments: { name: 'Academic Departments Directory', icon: Building2, desc: 'Departmental divisions and HOD leadership cards' },
    courses: { name: 'Degree Programs & Courses', icon: BookOpen, desc: 'Undergraduate and postgraduate degree offerings' },
    faculty: { name: 'Faculty & Mentors Directory', icon: Users, desc: 'Professor profiles, designations, and contacts' },
    gallery: { name: 'Campus Photo & Video Gallery', icon: Camera, desc: 'Campus life photo albums and visual showcase' },
    footer: { name: 'University Footer & Campus Info', icon: Layout, desc: 'Mega-footer with address, contact desk, and links' },
  };

  const currentMeta = moduleMeta[activeModule] || {
    name: `${activeModule.toUpperCase()} Module`,
    icon: Globe,
    desc: 'Isolated Component Preview',
  };

  const ModuleIcon = currentMeta.icon;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Standalone Module Preview Banner */}
      <div className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-2.5 flex items-center justify-between gap-4 sticky top-0 z-50 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-1.5 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30">
            <ModuleIcon className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Single Module View Mode
              </span>
              <h1 className="text-xs font-bold text-white truncate">
                {currentMeta.name}
              </h1>
            </div>
            <p className="text-[11px] text-slate-400 truncate hidden sm:block">
              {currentMeta.desc} — Viewing only this isolated module without overall website layout wrap.
            </p>
          </div>
        </div>

        {/* Quick Module Switcher Dropdown */}
        <div className="flex items-center gap-2 shrink-0">
          <select
            value={activeModule}
            onChange={(e) => {
              window.location.href = `/preview/module/${e.target.value}`;
            }}
            className="px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
          >
            <option value="marquee">Marquee Ticker</option>
            <option value="header">Navigation Header</option>
            <option value="banners">Hero Banners</option>
            <option value="stats">Stats Counter Bar</option>
            <option value="quote">Leadership Quote</option>
            <option value="admissions">Admissions Module</option>
            <option value="news">Campus News</option>
            <option value="events">Events Calendar</option>
            <option value="departments">Departments</option>
            <option value="courses">Degree Courses</option>
            <option value="faculty">Faculty Directory</option>
            <option value="gallery">Photo Gallery</option>
            <option value="footer">Footer & Helpdesk</option>
          </select>

          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center gap-1.5"
            title="Open Full Website in New Tab"
          >
            <span>Full Website</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
        </div>
      </div>

      {/* Main Preview Container Area */}
      <div className="flex-1 overflow-y-auto bg-slate-100 dark:bg-slate-950 p-4 sm:p-8 flex flex-col items-center justify-center">
        <div className="w-full max-w-7xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden min-h-[400px]">
          
          {/* Module 1: MARQUEE */}
          {activeModule === 'marquee' && (
            <div className="p-6 space-y-6">
              <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-xl text-xs text-blue-900 dark:text-blue-200 font-medium flex items-center justify-between">
                <span>Rendering isolated Announcement Marquee Bar as seen by top visitors:</span>
                <span className="font-mono text-[10px] bg-blue-100 dark:bg-blue-900 px-2 py-0.5 rounded font-bold">Top Bar</span>
              </div>

              <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm">
                <MarqueeBar marquee={siteConfig?.marquee} isPreview={true} />
              </div>

              {/* Sample Context Cards */}
              <div className="p-8 text-center text-slate-400 border border-dashed border-slate-300 dark:border-slate-800 rounded-xl">
                <p className="text-xs font-semibold">Marquee Module isolation frame active.</p>
                <p className="text-[11px] text-slate-500 mt-1">Changes made in Marquee Admin reflect in real-time inside this component.</p>
              </div>
            </div>
          )}

          {/* Module 2: HEADER / MENUS */}
          {(activeModule === 'header' || activeModule === 'menus') && (
            <div className="space-y-6">
              <div className="p-4 bg-slate-900 text-white text-xs flex items-center justify-between border-b border-slate-800">
                <span className="font-bold flex items-center gap-2">
                  <MenuIcon className="w-4 h-4 text-blue-400" />
                  Navigation Header Component Standalone View
                </span>
                <span className="text-[11px] text-slate-400">Desktop & Mobile Navigation Bar</span>
              </div>

              <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white bg-primary shadow-md shrink-0">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight leading-tight block">
                        {tenant.name}
                      </span>
                      <span className="text-[11px] font-semibold text-primary tracking-wide block">
                        {themeConfig?.badgeText || 'Excellence in Higher Education'}
                      </span>
                    </div>
                  </div>

                  <nav className="hidden lg:flex items-center gap-1">
                    {visibleMenus.map((item) => {
                      const menuKey = item.title.toLowerCase().trim();
                      const subItems = item.children?.filter((c) => c.isVisible !== false) || [];
                      const hasDropdown = subItems.length > 0;
                      const isOpen = activeDropdown === menuKey;

                      return (
                        <div
                          key={item.id}
                          className="relative"
                          onMouseEnter={() => hasDropdown && setActiveDropdown(menuKey)}
                          onMouseLeave={() => setActiveDropdown(null)}
                        >
                          <span
                            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold cursor-pointer transition ${
                              isOpen
                                ? 'text-primary bg-slate-100 dark:bg-slate-800'
                                : 'text-slate-700 dark:text-slate-200 hover:text-primary'
                            }`}
                          >
                            <span>{item.title}</span>
                            {hasDropdown && (
                              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180 text-primary' : ''}`} />
                            )}
                          </span>

                          {hasDropdown && isOpen && (
                            <div className="absolute top-full left-0 mt-1 w-72 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-2.5 z-50">
                              <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-700">
                                {item.title} Links
                              </div>
                              <div className="space-y-1 mt-1">
                                {subItems.map((sub, idx) => (
                                  <div
                                    key={idx}
                                    className="p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/60 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between"
                                  >
                                    <span>{sub.title}</span>
                                    <span className="text-[10px] font-mono text-slate-400">{sub.url}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}

                    <span className="ml-2 px-4 py-2 rounded-xl text-xs font-extrabold text-white bg-primary shadow-md">
                      Apply Now
                    </span>
                  </nav>
                </div>
              </header>

              <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                <p className="text-xs font-semibold">Hover over menu items above to preview drop-down submenus live.</p>
              </div>
            </div>
          )}

          {/* Module 3: HERO BANNERS */}
          {(activeModule === 'banners' || activeModule === 'hero') && (
            <div className="space-y-4">
              <div className="p-3 bg-slate-900 text-white text-xs flex items-center justify-between">
                <span className="font-bold flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-blue-400" />
                  Hero Slider Showcase Banners Component
                </span>
                <span className="text-[11px] text-slate-400">Full-Width Promotional Carousel</span>
              </div>
              <HeroSliderSection
                content={{
                  slides: siteConfig?.banners?.length
                    ? siteConfig.banners.map((b: any) => ({
                        headline: b.title || b.headline || `${tenant.name} Showcase`,
                        caption: b.subtitle !== undefined ? b.subtitle : (b.caption || b.description || ''),
                        imageUrl: b.imageUrl || b.bannerUrl,
                        badge: b.badge || '',
                        buttonText: b.ctaText || b.buttonText || '',
                        buttonUrl: b.ctaUrl || b.buttonUrl || '',
                      }))
                    : [
                        {
                          headline: `Welcome to ${tenant.name}`,
                          caption: 'Leading Higher Education, Research, and Academic Excellence',
                          badge: 'Admissions Open 2026',
                          buttonText: 'Explore Degree Programs',
                          buttonUrl: '/courses',
                          imageUrl: '/assets/templates/arts/banner1.svg',
                        },
                        {
                          headline: 'Empowering Minds, Shaping Futures',
                          caption: 'World-class laboratories, accredited faculty, and campus placement programs.',
                          badge: 'Campus Showcase',
                          buttonText: 'Apply For Admission',
                          buttonUrl: '/admissions',
                          imageUrl: '/assets/templates/arts/banner2.svg',
                        },
                      ],
                }}
              />
            </div>
          )}

          {/* Module: STATS */}
          {activeModule === 'stats' && (
            <div className="p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 uppercase">
                    Stats Counter Module
                  </span>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                    Key Performance Indicators & Metrics
                  </h2>
                </div>
                <span className="text-xs font-mono text-slate-400">Homepage Counter Bar</span>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl shadow-lg shadow-slate-200/50 dark:shadow-slate-950/60 border border-slate-200/80 dark:border-slate-800 overflow-hidden">
                <div className="grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 dark:divide-slate-800/80">
                  {(siteConfig?.stats && siteConfig.stats.length > 0
                    ? siteConfig.stats.filter((s: any) => s.isActive !== false)
                    : [
                        { id: '1', label: 'Active Students', value: '8,200', prefix: '', suffix: '+', iconName: 'Users' },
                        { id: '2', label: 'Degree Programs', value: '42', prefix: '', suffix: '+', iconName: 'BookOpen' },
                        { id: '3', label: 'Faculty Mentors', value: '310', prefix: '', suffix: '+', iconName: 'Award' },
                        { id: '4', label: 'Graduation Rate', value: '96.8', prefix: '', suffix: '%', iconName: 'GraduationCap' },
                      ]
                  ).map((st: any, idx: number) => {
                    const Icon = getPreviewStatIcon(st.iconName || st.icon);
                    const displayVal = st.value !== undefined ? st.value : (st.metric || '');
                    return (
                      <div
                        key={st.id || idx}
                        className="py-4 sm:py-5 px-3 sm:px-6 flex flex-col items-center text-center group hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-all duration-300 relative"
                      >
                        <div className="absolute top-0 left-0 right-0 h-1 bg-transparent group-hover:bg-primary transition-all duration-300" />
                        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center mb-2.5 group-hover:scale-105 group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm">
                          <Icon className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
                        </div>
                        <div 
                          className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-none flex items-baseline"
                          style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
                        >
                          <span>{st.prefix || ''}{displayVal}</span>
                          {st.suffix && (
                            <span className="text-secondary font-black ml-0.5 group-hover:text-primary transition-colors">
                              {st.suffix}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] sm:text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mt-1.5 max-w-[190px]">
                          {st.label}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Module: QUOTE */}
          {activeModule === 'quote' && (
            <div className="p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 uppercase">
                    Leadership Quote Module
                  </span>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                    Welcome & Strategic Address
                  </h2>
                </div>
                <span className="text-xs font-mono text-slate-400">Chancellor Quote Component</span>
              </div>

              <div className="max-w-4xl mx-auto p-6 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col md:flex-row items-center gap-6 sm:gap-10 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-primary" />
                <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-primary/25 shadow-xl bg-slate-100 dark:bg-slate-800 shrink-0 relative">
                  <img
                    key={siteConfig?.quote?.authorImageUrl || siteConfig?.quote?.authorImage || '/assets/templates/common/leader_portrait.svg'}
                    src={
                      siteConfig?.quote?.authorImageUrl ||
                      siteConfig?.quote?.authorImage ||
                      '/assets/templates/common/leader_portrait.svg'
                    }
                    alt={siteConfig?.quote?.authorName || 'Leadership'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        '/assets/templates/common/leader_portrait.svg';
                    }}
                  />
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shadow-md">
                    <Quote className="w-4 h-4" />
                  </div>
                </div>
                <div className="space-y-3 text-center md:text-left flex-1">
                  <blockquote className="text-base sm:text-lg lg:text-xl font-serif italic text-slate-800 dark:text-slate-100 leading-relaxed">
                    "{siteConfig?.quote?.quoteText || 'Empowering learners to think innovatively, solve real-world problems, and lead humanity forward with ethical excellence.'}"
                  </blockquote>
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="font-bold text-base text-slate-900 dark:text-white">
                      {siteConfig?.quote?.authorName || 'Dr. Aruna Krishnan, Ph.D.'}
                    </div>
                    <div className="text-xs sm:text-sm font-semibold text-primary">
                      {siteConfig?.quote?.designation || siteConfig?.quote?.authorTitle || 'Principal & Dean'}
                    </div>
                    {siteConfig?.quote?.subText && (
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{siteConfig.quote.subText}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Module 4: ADMISSIONS */}
          {activeModule === 'admissions' && (
            <div className="p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary uppercase">
                    Admissions Module
                  </span>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                    Online Admissions & Counseling Helpdesk
                  </h2>
                </div>
                <span className="text-xs font-mono text-slate-400">Isolated Lead Capture View</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4 bg-slate-50 dark:bg-slate-800/40 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Why Apply to {tenant.name}?</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    World-class laboratories, accredited degree programs, 95%+ campus placement records, and merit scholarships.
                  </p>
                  <ul className="space-y-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <li className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" /> NAAC & NBA Accredited Campus
                    </li>
                    <li className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" /> Industry Internship Partnerships
                    </li>
                    <li className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" /> Financial Aid & Sports Quotas
                    </li>
                  </ul>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md space-y-3">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Request Admission Counseling</h4>
                  <input
                    type="text"
                    disabled
                    placeholder="Full Student Name"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                  />
                  <input
                    type="email"
                    disabled
                    placeholder="Email Address"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                  />
                  <input
                    type="tel"
                    disabled
                    placeholder="Phone Number"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                  />
                  <button
                    type="button"
                    disabled
                    className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-primary opacity-90 cursor-not-allowed"
                  >
                    Submit Application Query (Preview Mode)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Module 5: NEWS */}
          {activeModule === 'news' && (
            <div>
              <NewsSection content={{ heading: 'Campus Press & News Bulletin', limit: 6 }} />
            </div>
          )}

          {/* Module 6: EVENTS */}
          {activeModule === 'events' && (
            <div>
              <EventsSection content={{ heading: 'College Events & Seminars Calendar', limit: 6 }} />
            </div>
          )}

          {/* Module 7: DEPARTMENTS */}
          {activeModule === 'departments' && (
            <div>
              <DepartmentsSection content={{ title: 'Academic Departments Directory' }} />
            </div>
          )}

          {/* Module 8: COURSES */}
          {activeModule === 'courses' && (
            <div>
              <CoursesSection content={{ title: 'Degree Programs & Courses' }} />
            </div>
          )}

          {/* Module 9: FACULTY */}
          {activeModule === 'faculty' && (
            <div>
              <FacultySection content={{ title: 'Distinguished Faculty Directory' }} />
            </div>
          )}

          {/* Module 10: GALLERY */}
          {activeModule === 'gallery' && (
            <div>
              <GallerySection content={{ title: 'Campus Visual Tour & Photo Gallery' }} />
            </div>
          )}

          {/* Module 11: FOOTER */}
          {activeModule === 'footer' && (
            <div>
              <div className="p-3 bg-slate-900 text-white text-xs flex items-center justify-between border-b border-slate-800">
                <span className="font-bold flex items-center gap-2">
                  <Layout className="w-4 h-4 text-blue-400" />
                  University Mega-Footer & Contact Office Standalone View
                </span>
              </div>

              <footer className="bg-slate-950 text-slate-400 pt-12 pb-8 border-t border-slate-900">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white bg-primary">
                        <GraduationCap className="w-5 h-5" />
                      </div>
                      <span className="text-lg font-black text-white">{tenant.name}</span>
                    </div>
                    <p className="text-xs text-slate-400">
                      {themeConfig?.badgeText || 'Accredited Higher Education Campus Network'}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-black text-white uppercase tracking-wider mb-3">Campus Office</h4>
                    <div className="space-y-2 text-xs">
                      {siteConfig?.settings?.address && (
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                          <span>{siteConfig.settings.address}</span>
                        </div>
                      )}
                      {siteConfig?.settings?.contactPhone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-primary shrink-0" />
                          <span>{siteConfig.settings.contactPhone}</span>
                        </div>
                      )}
                      {siteConfig?.settings?.contactEmail && (
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-primary shrink-0" />
                          <span>{siteConfig.settings.contactEmail}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-black text-white uppercase tracking-wider mb-3">Quick Directory</h4>
                    <ul className="space-y-1.5 text-xs">
                      <li>Departments & Academic Divisions</li>
                      <li>Degree Programs & Admission Requirements</li>
                      <li>Faculty Leadership Directory</li>
                    </ul>
                  </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 mt-8 pt-4 border-t border-slate-900 text-center text-[11px] text-slate-500">
                  © {new Date().getFullYear()} {tenant.name}. All rights reserved.
                </div>
              </footer>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
