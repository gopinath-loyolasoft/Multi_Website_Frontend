import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Calendar, ArrowLeft, ArrowRight, Newspaper, AlertCircle } from 'lucide-react';
import { NewsItem } from '../../types';
import { apiClient } from '../../services/apiClient';
import { useActiveTemplate } from '../../templates/templateRegistry';
import DOMPurify from 'dompurify';

export const NewsListPage: React.FC = () => {
  const Template = useActiveTemplate();
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await apiClient.get('/site/news', { params: { limit: 50 } });
        if (res.data.success) {
          setNewsList(res.data.data);
        }
      } catch (err) {
        console.error(err);
        setError('Unable to load news. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  return (
    <div className={`min-h-screen ${Template.config.bodyBgClass}`}>
      {/* Dynamic Modular Template Page Hero */}
      <Template.PageHero
        badge={Template.config.code === 'ARTS_SCIENCE_MODERN' ? 'Scholarly Gazette & Media' : Template.config.code === 'MEDICAL_MODERN' ? 'Medical Bulletins & Press' : Template.config.code === 'UNIVERSITY_MODERN' ? 'University Press & Gazette' : 'Campus News & Media'}
        title="Campus News & Press Releases"
        subtitle="Latest announcements, research breakthroughs, student achievements, and university media highlights."
        icon={<Newspaper className="w-4 h-4 text-emerald-300" />}
      />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
{loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-72 bg-slate-200 rounded-2xl" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-red-200 p-8 max-w-md mx-auto shadow-xs">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
            <h3 className="font-bold text-red-700 text-lg">Something went wrong</h3>
            <p className="text-red-500 text-xs mt-1">{error}</p>
          </div>
        ) : newsList.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 max-w-md mx-auto shadow-xs">
            <Newspaper className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-800 text-lg">No press releases posted</h3>
            <p className="text-slate-500 text-xs mt-1">Check back soon for university announcements.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {newsList.map((item) => (
              <article
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition flex flex-col justify-between group"
              >
                {item.imageUrl && (
                  <div className="aspect-[16/9] overflow-hidden bg-slate-100">
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                  </div>
                )}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Calendar className="w-3.5 h-3.5 text-primary" />
                      <span>{new Date(item.publishedDate).toLocaleDateString()}</span>
                    </div>
                    <h3 className="font-bold text-slate-900 group-hover:text-primary transition leading-snug">{item.title}</h3>
                    <p className="text-slate-600 text-xs sm:text-sm line-clamp-3 leading-relaxed">{item.summary}</p>
                  </div>
                  <div className="pt-4 mt-4 border-t border-slate-100">
                    <Link
                      to={`/news/${item.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-primary group-hover:translate-x-0.5 transition"
                    >
                      <span>Read Full Article</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export const NewsDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
const [news, setNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailError, setDetailError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await apiClient.get(`/site/news/${slug}`);
        if (res.data.success) {
          setNews(res.data.data);
        }
      } catch (err) {
        console.error(err);
        setDetailError('Unable to load this article. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [slug]);

  if (loading) {
    return (
      <div className="py-24 flex justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (detailError) {
    return (
      <div className="py-24 text-center">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
        <h2 className="text-2xl font-bold text-red-700">Unable to load this article</h2>
        <p className="text-sm text-red-500 mt-1">{detailError}</p>
        <Link to="/news" className="text-primary mt-2 inline-block font-semibold">
          ← Back to All News
        </Link>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="py-24 text-center">
        <h2 className="text-2xl font-bold">News Article Not Found</h2>
        <Link to="/news" className="text-primary mt-2 inline-block font-semibold">
          ← Back to All News
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <Link
        to="/news"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-primary mb-6 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to News</span>
      </Link>

      <div className="space-y-4 mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
          <Calendar className="w-4 h-4" />
          <span>Published on {new Date(news.publishedDate).toLocaleDateString()}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
          {news.title}
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed font-medium italic border-l-4 border-primary pl-4">
          {news.summary}
        </p>
      </div>

      {news.imageUrl && (
        <div className="aspect-[16/9] rounded-2xl overflow-hidden mb-10 shadow-lg">
          <img src={news.imageUrl} alt={news.title} className="w-full h-full object-cover" />
        </div>
      )}

      <div
        className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-4"
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(news.content) }}
      />
    </div>
  );
};
