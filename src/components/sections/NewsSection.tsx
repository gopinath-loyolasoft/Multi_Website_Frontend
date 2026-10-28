import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  ArrowRight, 
  Sparkles, 
  Newspaper, 
  ChevronRight, 
  ChevronLeft,
  Clock, 
  MapPin, 
  Activity, 
  Award,
  Stethoscope,
  Microscope,
  BookOpen
} from 'lucide-react';
import { NewsItem, EventItem } from '../../types';
import { apiClient } from '../../services/apiClient';
import { SectionError } from './SectionError';
import { useTemplateTheme } from '../../themes/ThemeContext';

interface NewsSectionProps {
  content: {
    heading?: string;
    subheading?: string;
    title?: string;
    subtitle?: string;
    badge?: string;
    limit?: number;
  };
}

const formatNewsDate = (dateStr?: string) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const formatEventDateParts = (dateStr?: string) => {
  if (!dateStr) return { day: '01', month: 'JAN' };
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return { day: '01', month: 'JAN' };
  return {
    day: String(d.getDate()).padStart(2, '0'),
    month: d.toLocaleString('en-US', { month: 'short' }).toUpperCase(),
  };
};

export const NewsSection: React.FC<NewsSectionProps> = ({ content }) => {
  const { styles } = useTemplateTheme();
  const newsStyles = styles.news;
  const eventStyles = styles.events;
  const layoutVariant = newsStyles.layoutVariant || (newsStyles.isCentered ? 'featured' : 'cards');

  const [news, setNews] = useState<NewsItem[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  const title = content.title || content.heading || newsStyles.defaultTitle || 'Latest News';
  const subtitle = content.subtitle || content.subheading || newsStyles.defaultSubtitle || 'Latest happenings and campus announcements';
  const badgeText = content.badge || newsStyles.defaultBadgeText || 'Campus Bulletin';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const newsPromise = apiClient.get('/site/news', {
          params: { limit: content.limit || (layoutVariant === 'featured' ? 4 : 3) },
        });

        const eventsPromise = (layoutVariant === 'split')
          ? apiClient.get('/site/events', { params: { limit: 5 } })
          : Promise.resolve({ data: { success: false, data: [] } });

        const [newsRes, eventsRes] = await Promise.all([newsPromise, eventsPromise]);

        if (newsRes.data.success && Array.isArray(newsRes.data.data)) {
          setNews(newsRes.data.data);
        }
        if (eventsRes.data.success && Array.isArray(eventsRes.data.data)) {
          setEvents(eventsRes.data.data);
        }
      } catch (err) {
        console.error('Failed to load news', err);
        setError('Unable to load news. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [content.limit, layoutVariant]);

  if (error && !loading) {
    return <SectionError message={error} className="bg-white border-b border-slate-100" />;
  }

  if (!loading && news.length === 0) return null;

  // =========================================================================
  // 1. TEMPLATE 2 & TEMPLATE 5: 3D DESIGNED CAMPUS NEWS CARDS
  // =========================================================================
  const { isArtsAndScience } = useTemplateTheme();
  if (isArtsAndScience || layoutVariant === 'slanted') {
    return (
      <section className="py-12 sm:py-16 bg-slate-50 relative overflow-hidden">
        {/* Subtle geometric dot backdrop */}
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#134975_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        {/* 3D Slanted Parallelogram Band Accent (Narrowed & Shifted Right) */}
        <div 
          className="absolute top-0 right-0 bottom-0 w-5/12 bg-gradient-to-br from-[#134975]/85 via-[#0b3353]/90 to-[#134975]/80 pointer-events-none hidden md:block z-0"
          style={{ clipPath: 'polygon(50% 0, 100% 0, 50% 100%, 0% 100%)' }}
        >
          {/* Crisp Golden Slanted Edge Line */}
          <div 
            className="absolute inset-0 border-l-2 border-amber-400/60" 
            style={{ clipPath: 'polygon(50% 0, 51% 0, 1% 100%, 0% 100%)' }}
          />
          {/* Subtle Inner Micro Grid Texture */}
          <div className="absolute inset-0 opacity-[0.07] bg-[radial-gradient(#e5a912_1px,transparent_1px)] [background-size:16px_16px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 text-xs font-bold uppercase tracking-wider mb-2.5 -skew-x-12 bg-sky-50 text-[#134975] border border-sky-200">
                <Newspaper className="w-3.5 h-3.5 text-amber-500 skew-x-12" />
                <span className="skew-x-12">{badgeText || 'Campus Bulletin & Press'}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
                {title}
              </h2>
              {subtitle && (
                <p className="text-sm sm:text-base text-slate-600 mt-1 max-w-2xl">
                  {subtitle}
                </p>
              )}
            </div>
            <Link
              to="/news"
              className="inline-flex items-center gap-2 px-5 py-2.5 -skew-x-12 bg-[#134975] hover:bg-[#0b3353] text-amber-300 font-black text-xs uppercase tracking-wider shadow-md hover:scale-105 transition shrink-0 self-start md:self-auto"
            >
              <span className="skew-x-12 flex items-center gap-1.5">
                <span>View All News</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </div>

          {/* 3D Slanted Polygon News Cards Carousel / Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-500">
            {news.map((item, idx) => {
              const isVisibleInSlide = news.length <= 3 || (idx >= activeSlideIndex * 3 && idx < (activeSlideIndex + 1) * 3);
              if (!isVisibleInSlide) return null;

              return (
                <Link
                  key={item.id}
                  to={`/news/${item.slug || item.id}`}
                  className="group block relative overflow-hidden bg-white shadow-md hover:shadow-2xl transition-all duration-300 border border-slate-200 hover:-translate-y-2 animate-fadeIn"
                >
                  {/* Thumbnail */}
                  <div className="relative h-56 w-full overflow-hidden bg-slate-900">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#134975] flex items-center justify-center text-amber-300">
                        <Newspaper className="w-12 h-12 stroke-[1.5]" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    {/* Category Pill */}
                    {item.category && (
                      <span className="absolute top-3 left-3 px-3 py-1 bg-[#134975]/90 text-amber-300 text-[10px] font-black uppercase -skew-x-12 backdrop-blur-sm border border-amber-400/30">
                        <span className="inline-block skew-x-12">{item.category}</span>
                      </span>
                    )}
                  </div>

                  {/* Slanted Content Box Overlay */}
                  <div
                    className="relative -mt-10 mx-3 bg-white p-6 shadow-lg border-b-4 border-[#134975] group-hover:border-[#e5a912] transition-all duration-300"
                    style={{ clipPath: 'polygon(0 0, 100% 0, 92% 100%, 0% 100%)' }}
                  >
                    <div className="flex items-center gap-3 text-xs text-red-600 font-semibold italic mb-2">
                      <span className="inline-flex items-center gap-1 text-slate-500 not-italic font-mono text-[11px]">
                        <Calendar className="w-3.5 h-3.5 text-[#e5a912]" />
                        {formatNewsDate(item.publishedDate)}
                      </span>
                    </div>
                    <h4 className="text-base sm:text-lg font-bold text-slate-900 line-clamp-2 group-hover:text-[#134975] transition-colors pr-6 leading-snug">
                      {item.title}
                    </h4>
                    {item.summary && (
                      <p className="text-xs text-slate-600 line-clamp-2 mt-2 leading-relaxed pr-6">
                        {item.summary}
                      </p>
                    )}

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#134975] group-hover:text-amber-600 transition-colors pr-4">
                      <span>Read Article</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Carousel Slider Pagination Indicators (Salesian Reference Design) */}
          <div className="mt-10 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => setActiveSlideIndex((prev) => (prev > 0 ? prev - 1 : Math.max(0, Math.ceil(news.length / 3) - 1)))}
              className="w-8 h-8 rounded-full bg-slate-200 hover:bg-[#134975] hover:text-white flex items-center justify-center text-slate-700 transition shadow-xs cursor-pointer"
              title="Previous Cards"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Slide Pagination Indicator Bars */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-200/60 rounded-md">
              {Array.from({ length: Math.max(3, Math.ceil(news.length / 3)) }).map((_, pIdx) => (
                <button
                  key={pIdx}
                  type="button"
                  onClick={() => setActiveSlideIndex(pIdx)}
                  className={`h-2.5 rounded-xs transition-all duration-300 cursor-pointer ${
                    activeSlideIndex === pIdx
                      ? 'w-12 bg-black'
                      : 'w-8 bg-white border border-slate-300 hover:bg-slate-100'
                  }`}
                  title={`Slide ${pIdx + 1}`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => setActiveSlideIndex((prev) => (prev < Math.max(0, Math.ceil(news.length / 3) - 1) ? prev + 1 : 0))}
              className="w-9 h-9 rounded-full bg-amber-500 hover:bg-amber-600 text-slate-950 flex items-center justify-center font-bold transition shadow-md cursor-pointer"
              title="Next Cards"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Bottom Center CTA */}
          <div className="mt-6 flex justify-center">
            <Link
              to="/news"
              className="inline-flex items-center gap-2 px-8 py-3.5 -skew-x-12 bg-[#134975] hover:bg-[#0b3353] text-amber-300 font-black text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition"
            >
              <span className="skew-x-12 flex items-center gap-2">
                <span>View All Press Releases</span>
                <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </div>

        </div>
      </section>
    );
  }

  // =========================================================================
  // 2. TEMPLATE 3: MEDICAL / CLINICAL — HORIZONTAL DISPATCHES LIST
  // =========================================================================
  if (layoutVariant === 'clinical') {
    return (
      <section className={`py-8 sm:py-10 relative overflow-hidden ${newsStyles.sectionBg}`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold mb-2 bg-teal-100 text-teal-800 border border-teal-300">
                <Stethoscope className="w-3.5 h-3.5" />
                <span>Campus Updates</span>
              </div>
              <h2 className={newsStyles.headingFont}>{title}</h2>
              {subtitle && <p className={`${newsStyles.subtitleFont} mt-1`}>{subtitle}</p>}
            </div>
            <Link
              to="/news"
              className={`inline-flex items-center gap-1.5 text-xs font-bold ${newsStyles.accentText}`}
            >
              <span>View All Updates</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Horizontal Clinical News Rows Container */}
          <div className="bg-white border border-teal-100 rounded-2xl divide-y divide-teal-50 overflow-hidden shadow-xs">
            {news.map((item, idx) => {
              const icon = idx === 0 ? '📰' : idx === 1 ? '🏥' : '🧬';
              return (
                <Link
                  key={item.id}
                  to={`/news/${item.slug}`}
                  className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-teal-50/40 transition group"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span className="text-xl shrink-0 p-2 rounded-xl bg-teal-50 border border-teal-100">
                      {icon}
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-sans font-bold text-sm sm:text-base text-slate-900 group-hover:text-teal-700 transition truncate">
                        {item.title}
                      </h3>
                      {item.summary && (
                        <p className="text-xs text-slate-500 truncate mt-0.5">
                          {item.summary}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-mono font-semibold text-slate-500 hidden sm:inline">
                      {formatNewsDate(item.publishedDate)}
                    </span>
                    <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

        </div>
      </section>
    );
  }

  // =========================================================================
  // 3. TEMPLATE 4: UNIVERSITY — LARGE FEATURED STORY SHOWCASE
  // =========================================================================
  if (layoutVariant === 'featured') {
    const featuredStory = news[0];
    const secondaryStories = news.slice(1, 4);

    return (
      <section className={`py-8 sm:py-10 relative overflow-hidden ${newsStyles.sectionBg}`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-7 sm:mb-9 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-0.5 rounded-full text-xs font-serif uppercase tracking-widest bg-rose-50 text-rose-900 border border-rose-200">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{badgeText}</span>
            </div>
            <h2 className={newsStyles.headingFont}>{title}</h2>
            {subtitle && <p className={newsStyles.subtitleFont}>{subtitle}</p>}
          </div>

          {/* Featured Large Story Card */}
          {featuredStory && (
            <article className="bg-gradient-to-br from-[#111827] to-[#172554] border border-[#d4af37]/40 rounded-2xl overflow-hidden shadow-xl text-white mb-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
                {/* 50% Image */}
                <div className="md:col-span-6 h-56 sm:h-72 lg:h-80 overflow-hidden relative">
                  {featuredStory.imageUrl ? (
                    <img
                      src={featuredStory.imageUrl}
                      alt={featuredStory.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-900 flex items-center justify-center text-[#d4af37]">
                      <Newspaper className="w-16 h-16 stroke-[1.2]" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="bg-[#d4af37] text-slate-950 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm">
                      Featured Story
                    </span>
                  </div>
                </div>

                {/* 50% Story Body */}
                <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    <span className="text-[#d4af37] font-serif text-xs uppercase tracking-widest font-semibold block">
                      {formatNewsDate(featuredStory.publishedDate)}
                    </span>
                    <h3 className="font-serif font-bold text-xl sm:text-2xl text-white leading-snug">
                      {featuredStory.title}
                    </h3>
                    {featuredStory.summary && (
                      <p className="text-xs sm:text-sm text-slate-300 line-clamp-3 leading-relaxed">
                        {featuredStory.summary}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-[#d4af37]/20 flex items-center justify-between">
                    <Link
                      to={`/news/${featuredStory.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-serif font-bold text-[#d4af37] hover:text-amber-300"
                    >
                      <span>Read Full Story</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          )}

          {/* Secondary Stories Row */}
          {secondaryStories.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {secondaryStories.map((item) => (
                <div
                  key={item.id}
                  className="bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-4 flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[11px] font-serif text-rose-900 dark:text-rose-400 font-bold block">
                      {formatNewsDate(item.publishedDate)}
                    </span>
                    <h4 className="font-serif font-bold text-sm text-slate-900 dark:text-white line-clamp-2 mt-1">
                      {item.title}
                    </h4>
                  </div>
                  <Link
                    to={`/news/${item.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-serif font-bold text-rose-900 dark:text-rose-400 hover:underline pt-3"
                  >
                    <span>Read Story</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              ))}
            </div>
          )}

          {/* Directory Link */}
          <div className="mt-8 text-center">
            <Link
              to="/news"
              className="inline-flex items-center gap-2 bg-rose-900 hover:bg-rose-950 text-white font-serif font-bold text-xs px-6 py-2.5 rounded-lg shadow-sm"
            >
              <span>View All News & Announcements</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </section>
    );
  }

  // =========================================================================
  // 4. TEMPLATE 1: ENGINEERING — 3 MODERN TECHNICAL NEWS CARDS
  // =========================================================================
  return (
    <section className={`py-8 sm:py-10 relative overflow-hidden ${newsStyles.sectionBg}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-7 sm:mb-8 gap-3">
          <div>
            {badgeText && (
              <div className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold mb-2 ${newsStyles.sectionHeaderBadge}`}>
                <Sparkles className="w-3.5 h-3.5" />
                <span>{badgeText}</span>
              </div>
            )}
            <h2 className={newsStyles.headingFont}>{title}</h2>
            {subtitle && (
              <p className={`${newsStyles.subtitleFont} mt-1`}>{subtitle}</p>
            )}
          </div>
          <Link
            to="/news"
            className={`inline-flex items-center gap-1.5 text-xs font-bold ${newsStyles.accentText} self-start sm:self-auto`}
          >
            <span>View All News</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 3 Modern Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {news.map((item) => (
            <article
              key={item.id}
              className={`group ${newsStyles.cardBg} ${newsStyles.cardBorder} ${newsStyles.cardHover} rounded-[14px] overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between`}
            >
              <div>
                {/* Top Accent Line */}
                {newsStyles.cardTopAccent && (
                  <div className={`h-[3px] w-full ${newsStyles.cardTopAccent}`} />
                )}

                {/* Image */}
                <div className="relative h-40 overflow-hidden bg-slate-100 dark:bg-slate-800">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-blue-50/70 flex items-center justify-center text-blue-600">
                      <Newspaper className="w-8 h-8 stroke-[1.5]" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 sm:p-5 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className={newsStyles.datePill || 'text-[11px] text-blue-700 font-mono font-bold'}>
                      {formatNewsDate(item.publishedDate)}
                    </span>
                    {item.category && (
                      <span className={newsStyles.tagBadge || 'text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-100'}>
                        {item.category}
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white line-clamp-2 leading-snug">
                    {item.title}
                  </h3>

                  {item.summary && (
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {item.summary}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Link */}
              <div className="p-4 pt-0">
                <Link
                  to={`/news/${item.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 pt-2.5 border-t border-slate-100 dark:border-slate-800 w-full justify-between"
                >
                  <span>Read Full Story</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
};
