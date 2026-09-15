import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';
import { NewsItem } from '../../types';
import { apiClient } from '../../services/apiClient';
import { SectionError } from './SectionError';
import { useTheme } from '../../themes/ThemeContext';

interface NewsSectionProps {
  content: {
    heading?: string;
    subheading?: string;
    title?: string;
    subtitle?: string;
    limit?: number;
  };
}

export const NewsSection: React.FC<NewsSectionProps> = ({ content }) => {
  const { isArtsAndScience, isMedical, isUniversity, isEngineering } = useTheme();
  const isCenterAligned = isArtsAndScience || isUniversity;

  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const title = content.title || content.heading || 'Campus News & Announcements';
  const subtitle = content.subtitle || content.subheading || 'Latest news, press releases, and campus updates';

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await apiClient.get('/site/news', {
          params: { limit: content.limit || 3 },
        });
        if (res.data.success) {
          setNews(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load news', err);
        setError('Unable to load news. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [content.limit]);

  if (error && !loading) {
    return <SectionError message={error} className="bg-white border-b border-slate-100" />;
  }

  if (!loading && news.length === 0) return null;

  const headingFont = isArtsAndScience 
    ? 'font-serif font-bold text-emerald-950 dark:text-emerald-50 text-3xl sm:text-4xl' 
    : isUniversity 
    ? 'font-serif font-bold text-rose-950 dark:text-amber-50 text-3xl sm:text-4xl' 
    : isMedical 
    ? 'font-sans font-extrabold text-slate-900 dark:text-white text-3xl sm:text-4xl' 
    : 'font-sans font-black text-slate-900 dark:text-white text-3xl sm:text-4xl';

  const linkColor = isArtsAndScience 
    ? 'text-emerald-700 hover:text-emerald-900 font-serif' 
    : isUniversity 
    ? 'text-rose-900 hover:text-amber-700 font-serif' 
    : isMedical 
    ? 'text-cyan-700 hover:text-cyan-900' 
    : 'text-primary hover:underline';

  const sectionBg = isEngineering
    ? 'py-16 bg-slate-900 text-white border-y border-slate-800'
    : isArtsAndScience
    ? 'py-16 bg-[#f5f2eb] text-slate-900 border-y border-emerald-900/10'
    : isMedical
    ? 'py-16 bg-slate-50 text-slate-900 border-y border-cyan-100'
    : 'py-16 bg-[#f7f4ee] text-slate-900 border-y border-stone-200';

  const cardBg = isEngineering
    ? 'group bg-slate-950 text-white rounded-2xl border border-slate-800 hover:border-amber-400/60 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col'
    : isArtsAndScience
    ? 'group bg-white text-slate-900 rounded-2xl border-2 border-emerald-800/15 hover:border-emerald-600 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col'
    : isMedical
    ? 'group bg-white text-slate-900 rounded-2xl border border-cyan-200 hover:border-cyan-500 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col'
    : 'group bg-white text-slate-900 rounded-2xl border-t-4 border-t-rose-900 border-x border-b border-stone-200 hover:border-rose-700 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col';

  return (
    <section className={sectionBg}>
      <div className="max-w-6xl mx-auto px-6">
        {isCenterAligned ? (
          <div className="text-center max-w-3xl mx-auto mb-10 space-y-2 flex flex-col items-center">
            <h2 className={headingFont}>{title}</h2>
            <p className="opacity-80 text-sm max-w-2xl mx-auto">{subtitle}</p>
            <Link
              to="/news"
              className={`inline-flex items-center gap-1.5 text-sm font-semibold pt-1 ${linkColor}`}
            >
              <span>View All News</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className={headingFont}>{title}</h2>
              <p className="opacity-80 text-sm mt-1">{subtitle}</p>
            </div>
            <Link
              to="/news"
              className={`inline-flex items-center gap-1.5 text-sm font-semibold ${linkColor} self-start sm:self-auto`}
            >
              <span>View All News</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-72 bg-slate-800/20 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {news.map((item) => (
              <article
                key={item.id}
                className={cardBg}
              >
                {item.imageUrl && (
                  <div className="aspect-[16/9] overflow-hidden bg-slate-200/50">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  </div>
                )}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-medium opacity-60">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(item.publishedDate).toLocaleDateString()}</span>
                    </div>
                    <h3 className={`font-bold line-clamp-2 ${isArtsAndScience || isUniversity ? 'font-serif' : 'font-sans'}`}>
                      {item.title}
                    </h3>
                    <p className="text-sm line-clamp-3 leading-relaxed opacity-80">
                      {item.summary}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-current/10">
                    <Link
                      to={`/news/${item.slug}`}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:gap-2.5 transition-all"
                    >
                      <span>Read Story</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
