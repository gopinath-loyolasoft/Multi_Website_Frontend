import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';
import { NewsItem } from '../../types';
import { apiClient } from '../../services/apiClient';
import { SectionError } from './SectionError';

interface NewsSectionProps {
  content: {
    heading?: string;
    subheading?: string;
    limit?: number;
  };
}

export const NewsSection: React.FC<NewsSectionProps> = ({ content }) => {
const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <section className="py-16 bg-white border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900">{content.heading || 'Campus News'}</h2>
            <p className="text-slate-500 mt-1">{content.subheading || 'Latest updates and announcements'}</p>
          </div>
          <Link
            to="/news"
            className="inline-flex items-center gap-1.5 font-semibold text-primary hover:underline text-sm"
          >
            <span>View All News</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-72 bg-slate-100 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {news.map((item) => (
              <article
                key={item.id}
                className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                {item.imageUrl && (
                  <div className="aspect-[16/9] overflow-hidden bg-slate-100">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  </div>
                )}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(item.publishedDate).toLocaleDateString()}</span>
                    </div>
                    <h3 className="font-bold text-slate-900 group-hover:text-primary transition line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 text-sm line-clamp-3 leading-relaxed">
                      {item.summary}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100">
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
