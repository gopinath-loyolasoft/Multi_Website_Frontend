import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Mail,
  Eye,
  Target,
  History,
  Award,
  Users,
  Star,
  CheckCircle2,
  Lightbulb,
  BookOpen,
  Trophy,
  Calendar,
  Compass
} from 'lucide-react';
import { PageData } from '../../types';
import { apiClient } from '../../services/apiClient';
import { PageRenderer } from '../../components/dynamic/SectionRenderer';
import { useTenant } from '../../tenant/TenantContext';
import { useActiveTemplate } from '../../templates/templateRegistry';

// ─── About Module Types ────────────────────────────────────────
interface AccreditationItem {
  body: string;
  grade?: string;
  year?: string;
  logoUrl?: string;
  description?: string;
}

interface AchievementItem {
  title: string;
  year?: string;
  description?: string;
  iconUrl?: string;
}

interface LeadershipMember {
  name: string;
  designation?: string;
  photoUrl?: string;
  message?: string;
  email?: string;
  sortOrder?: number;
}

interface CoreValueItem {
  title: string;
  description?: string;
  icon?: string;
  sortOrder?: number;
}

interface AboutModuleData {
  id?: string;
  historyTitle?: string;
  historyContent?: string;
  historyImageUrl?: string;
  establishedYear?: number;
  visionText?: string;
  missionText?: string;
  accreditations: AccreditationItem[];
  achievements: AchievementItem[];
  leadership: LeadershipMember[];
  coreValues: CoreValueItem[];
  isActive?: boolean;
}

// ─── Icon Map for core values ──────────────────────────────────
const CoreValueIconMap: Record<string, React.ReactNode> = {
  star: <Star className="w-6 h-6" />,
  target: <Target className="w-6 h-6" />,
  lightbulb: <Lightbulb className="w-6 h-6" />,
  book: <BookOpen className="w-6 h-6" />,
  award: <Award className="w-6 h-6" />,
  users: <Users className="w-6 h-6" />,
  check: <CheckCircle2 className="w-6 h-6" />,
};

// ─── Component ────────────────────────────────────────────────
export const AboutPage: React.FC = () => {
  const { tenantDomain, siteConfig } = useTenant();
  const Template = useActiveTemplate();

  const [pageData, setPageData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [found, setFound] = useState(false);

  const [aboutData, setAboutData] = useState<AboutModuleData | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);

        // 1. Try CMS dynamic page (slug=about)
        const cmsRes = await apiClient.get('/site/pages/about').catch(() => null);
        if (cmsRes?.data?.success && cmsRes.data.data?.sections?.length > 0) {
          setPageData(cmsRes.data.data);
          setFound(true);
        }

        // 2. Fetch structured About module data (always)
        const aboutRes = await apiClient.get('/site/about').catch(() => null);
        if (aboutRes?.data?.success && aboutRes.data.data) {
          const raw = aboutRes.data.data;
          setAboutData({
            ...raw,
            accreditations: Array.isArray(raw.accreditations) ? raw.accreditations : [],
            achievements: Array.isArray(raw.achievements) ? raw.achievements : [],
            leadership: Array.isArray(raw.leadership) ? raw.leadership : [],
            coreValues: Array.isArray(raw.coreValues) ? raw.coreValues : [],
          });
        }
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [tenantDomain]);

  const enabledFeatures = siteConfig?.enabledFeatures || [];
  const isAboutFeatureEnabled =
    enabledFeatures.length === 0 ||
    enabledFeatures.some((f) => f.toUpperCase() === 'ABOUT' || f.toUpperCase() === 'ABOUT_MODULE');

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 text-sm font-medium">
          Loading About {siteConfig?.tenant?.name || ''}...
        </p>
      </div>
    );
  }

  if (!isAboutFeatureEnabled) {
    return (
      <div className="py-24 px-6 text-center max-w-xl mx-auto space-y-4">
        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
          <Building2 className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800">About Page Unavailable</h1>
        <p className="text-sm text-slate-500">
          The About Us module is not currently enabled for {siteConfig?.tenant?.name || 'this institution'}.
        </p>
        <div className="pt-2">
          <Link to="/" className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // If a custom CMS page exists (built in Pages Admin), render it
  if (found && pageData && pageData.sections && pageData.sections.length > 0) {
    return (
      <div className="min-h-screen bg-slate-50">
        <PageRenderer sections={pageData.sections} />
      </div>
    );
  }

  const institutionName = siteConfig?.tenant?.name || '';
  const tagline = siteConfig?.settings?.tagline || siteConfig?.settings?.description;

  const headerConfig =
    siteConfig?.settings?.socialLinks?.pageHeaders?.about ||
    siteConfig?.settings?.pageHeaders?.about;

  const badgeText = headerConfig?.badge || siteConfig?.settings?.badgeText || undefined;
  const titleText = headerConfig?.title || (institutionName ? `About ${institutionName}` : 'About Us');
  const subtitleText = headerConfig?.subtitle || tagline;

  const hasHistory = Boolean(aboutData?.historyContent || aboutData?.historyTitle || aboutData?.historyImageUrl);
  const hasVisionMission = Boolean(aboutData?.visionText || aboutData?.missionText);
  const hasCoreValues = Boolean(aboutData?.coreValues && aboutData.coreValues.length > 0);
  const hasLeadership = Boolean(aboutData?.leadership && aboutData.leadership.length > 0);
  const hasAccreditations = Boolean(aboutData?.accreditations && aboutData.accreditations.length > 0);
  const hasAchievements = Boolean(aboutData?.achievements && aboutData.achievements.length > 0);

  const hasAnyAboutData =
    hasHistory ||
    hasVisionMission ||
    hasCoreValues ||
    hasLeadership ||
    hasAccreditations ||
    hasAchievements;

  return (
    <div className={`min-h-screen ${Template.config.bodyBgClass}`}>

      {/* ── Page Hero ─────────────────────────────────────────── */}
      <Template.PageHero
        badge={badgeText}
        title={titleText}
        subtitle={subtitleText}
        icon={<Building2 className="w-4 h-4 text-amber-300" />}
      />

      {/* ═══════════════════════════════════════════════════════════
          DYNAMIC ABOUT MODULE SECTIONS (Zero Default Data)
      ════════════════════════════════════════════════════════════ */}
      {hasAnyAboutData ? (
        <div className="space-y-0">

          {/* ── Established Year Banner ────────────────────────── */}
          {Boolean(aboutData?.establishedYear) && (
            <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
              <div className="inline-flex items-center gap-3 bg-primary/10 border border-primary/20 rounded-2xl px-5 py-3">
                <Calendar className="w-5 h-5 text-primary" />
                <span className="text-sm font-bold text-primary">
                  Established in {aboutData?.establishedYear}
                </span>
              </div>
            </section>
          )}

          {/* ── History / Institution Story ────────────────────── */}
          {hasHistory && (
            <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className={`grid grid-cols-1 ${aboutData?.historyImageUrl ? 'lg:grid-cols-2' : ''} gap-10 items-center`}>
                <div className="space-y-5">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary/80">
                    <History className="w-4 h-4" />
                    <span>Our History</span>
                  </div>
                  {aboutData?.historyTitle && (
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white leading-tight">
                      {aboutData.historyTitle}
                    </h2>
                  )}
                  {aboutData?.historyContent && (
                    <div className="text-slate-600 dark:text-slate-300 text-base leading-relaxed space-y-3">
                      {aboutData.historyContent.split('\n').filter(Boolean).map((para, i) => (
                        <p key={i}>{para}</p>
                      ))}
                    </div>
                  )}
                </div>
                {aboutData?.historyImageUrl && (
                  <div className="relative">
                    <img
                      src={aboutData.historyImageUrl}
                      alt={aboutData?.historyTitle || institutionName || 'History'}
                      className="w-full rounded-3xl object-cover shadow-xl border border-slate-200/60 dark:border-slate-800 aspect-video"
                    />
                    {Boolean(aboutData?.establishedYear) && (
                      <div className="absolute -bottom-3 -left-3 bg-primary text-white px-4 py-2.5 rounded-2xl shadow-lg text-xs font-bold">
                        Est. {aboutData.establishedYear}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </section>
          )}

          {/* ── Vision & Mission ───────────────────────────────── */}
          {hasVisionMission && (
            <section className="bg-slate-900 text-white py-16">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10">
                  <span className="text-xs font-bold uppercase tracking-widest text-primary/80 bg-white/10 px-4 py-1.5 rounded-full">
                    Guiding Principles
                  </span>
                </div>
                <div className={`grid grid-cols-1 ${aboutData?.visionText && aboutData?.missionText ? 'md:grid-cols-2' : 'max-w-2xl mx-auto'} gap-6`}>
                  {aboutData?.visionText && (
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm hover:bg-white/10 transition-all">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-2xl bg-blue-500/20 flex items-center justify-center">
                          <Eye className="w-5 h-5 text-blue-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white">Vision</h3>
                      </div>
                      <p className="text-slate-300 leading-relaxed text-sm">{aboutData.visionText}</p>
                    </div>
                  )}
                  {aboutData?.missionText && (
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm hover:bg-white/10 transition-all">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-2xl bg-amber-500/20 flex items-center justify-center">
                          <Target className="w-5 h-5 text-amber-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white">Mission</h3>
                      </div>
                      <p className="text-slate-300 leading-relaxed text-sm">{aboutData.missionText}</p>
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* ── Core Values ───────────────────────────────────── */}
          {hasCoreValues && (
            <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
              <div className="text-center mb-10 space-y-2">
                <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-primary/80">
                  <Star className="w-4 h-4" />
                  <span>Core Values</span>
                </div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white">What We Stand For</h2>
              </div>
              <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${Math.min(aboutData!.coreValues.length, 4)} gap-5`}>
                {[...aboutData!.coreValues]
                  .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
                  .map((val, idx) => (
                    <div
                      key={idx}
                      className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all text-center space-y-3"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mx-auto">
                        {(val.icon && CoreValueIconMap[val.icon.toLowerCase()]) || <Star className="w-6 h-6" />}
                      </div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-base">{val.title}</h4>
                      {val.description && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{val.description}</p>
                      )}
                    </div>
                  ))}
              </div>
            </section>
          )}

          {/* ── Leadership Team ────────────────────────────────── */}
          {hasLeadership && (
            <section className="bg-slate-50 dark:bg-slate-950 py-16">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10 space-y-2">
                  <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-primary/80">
                    <Users className="w-4 h-4" />
                    <span>Leadership</span>
                  </div>
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white">Leadership Team</h2>
                </div>
                {aboutData!.leadership.length === 1 ? (
                  <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden hover:shadow-lg transition-all">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
                      {/* Photo */}
                      <div className="md:col-span-5 relative bg-slate-100 dark:bg-slate-800 min-h-[260px] flex items-center justify-center overflow-hidden">
                        {aboutData!.leadership[0].photoUrl ? (
                          <img
                            src={aboutData!.leadership[0].photoUrl}
                            alt={aboutData!.leadership[0].name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-20 h-20 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-400">
                            <Users className="w-10 h-10" />
                          </div>
                        )}
                        {aboutData!.leadership[0].designation && (
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/85 to-transparent p-4">
                            <span className="text-xs font-bold text-white/95 uppercase tracking-wider">
                              {aboutData!.leadership[0].designation}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-4">
                        <div className="space-y-3">
                          <h3 className="font-black text-slate-900 dark:text-white text-xl sm:text-2xl leading-tight">
                            {aboutData!.leadership[0].name}
                          </h3>
                          {aboutData!.leadership[0].message && (
                            <blockquote className="text-slate-600 dark:text-slate-300 text-sm sm:text-base italic leading-relaxed">
                              "{aboutData!.leadership[0].message}"
                            </blockquote>
                          )}
                        </div>
                        {aboutData!.leadership[0].email && (
                          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                            <a
                              href={`mailto:${aboutData!.leadership[0].email}`}
                              className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-semibold"
                            >
                              <Mail className="w-3.5 h-3.5" />
                              {aboutData!.leadership[0].email}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className={`grid grid-cols-1 sm:grid-cols-2 ${aboutData!.leadership.length >= 3 ? 'lg:grid-cols-3' : 'max-w-4xl mx-auto'} gap-6`}>
                    {[...aboutData!.leadership]
                      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
                      .map((leader, idx) => (
                        <div
                          key={idx}
                          className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden hover:shadow-lg transition-all group flex flex-col justify-between"
                        >
                          <div>
                            {/* Photo */}
                            <div className="relative bg-slate-100 dark:bg-slate-800 h-56 flex items-center justify-center overflow-hidden">
                              {leader.photoUrl ? (
                                <img
                                  src={leader.photoUrl}
                                  alt={leader.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                              ) : (
                                <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-400">
                                  <Users className="w-8 h-8" />
                                </div>
                              )}
                              {leader.designation && (
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/85 to-transparent p-4">
                                  <span className="text-xs font-bold text-white/95 uppercase tracking-wider">
                                    {leader.designation}
                                  </span>
                                </div>
                              )}
                            </div>

                            <div className="p-5 space-y-3">
                              <h3 className="font-black text-slate-900 dark:text-white text-lg leading-tight">{leader.name}</h3>
                              {leader.message && (
                                <blockquote className="text-slate-600 dark:text-slate-300 text-sm italic leading-relaxed">
                                  "{leader.message}"
                                </blockquote>
                              )}
                            </div>
                          </div>

                          {leader.email && (
                            <div className="p-5 pt-0">
                              <a
                                href={`mailto:${leader.email}`}
                                className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-medium"
                              >
                                <Mail className="w-3.5 h-3.5" />
                                {leader.email}
                              </a>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </section>
          )}

          {/* ── Accreditations & Rankings ─────────────────────── */}
          {hasAccreditations && (
            <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
              <div className="text-center mb-10 space-y-2">
                <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-primary/80">
                  <Award className="w-4 h-4" />
                  <span>Accreditations</span>
                </div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white">Accreditations & Affiliations</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {aboutData!.accreditations.map((acc, idx) => (
                  <div
                    key={idx}
                    className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex items-start gap-4 hover:shadow-md transition-all"
                  >
                    {acc.logoUrl ? (
                      <img
                        src={acc.logoUrl}
                        alt={acc.body}
                        className="w-12 h-12 object-contain rounded-xl border border-slate-100 dark:border-slate-800 shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <Award className="w-6 h-6 text-primary" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <h4 className="font-black text-slate-900 dark:text-white text-base">{acc.body}</h4>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {acc.grade && (
                          <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 rounded-lg text-xs font-bold">
                            {acc.grade}
                          </span>
                        )}
                        {acc.year && (
                          <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg text-xs font-mono font-bold">
                            {acc.year}
                          </span>
                        )}
                      </div>
                      {acc.description && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">{acc.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ── Achievements & Milestones ─────────────────────── */}
          {hasAchievements && (
            <section className="bg-primary/5 py-16">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10 space-y-2">
                  <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-primary/80">
                    <Trophy className="w-4 h-4" />
                    <span>Achievements</span>
                  </div>
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white">Milestones & Recognitions</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {aboutData!.achievements.map((ach, idx) => (
                    <div
                      key={idx}
                      className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-all space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center">
                          <Trophy className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        {ach.year && (
                          <span className="text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2.5 py-1 rounded-lg">
                            {ach.year}
                          </span>
                        )}
                      </div>
                      <h4 className="font-black text-slate-900 dark:text-white text-base leading-snug">{ach.title}</h4>
                      {ach.description && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{ach.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

        </div>
      ) : (
        /* Empty / Blank State when no about data has been configured yet */
        <div className="py-28 px-6 text-center max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
            <Compass className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Institutional Profile</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Detailed information about {institutionName || 'the institution'} will appear here once configured in the administration panel.
          </p>
          <div className="pt-2">
            <Link
              to="/"
              className="inline-flex items-center px-5 py-2.5 bg-slate-900 dark:bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition shadow-sm"
            >
              Back to Home
            </Link>
          </div>
        </div>
      )}

    </div>
  );
};