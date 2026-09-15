import React, { useState, useEffect } from 'react';
import { Camera, X, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import { apiClient } from '../../services/apiClient';
import { SectionError } from './SectionError';
import { useTheme } from '../../themes/ThemeContext';

interface GalleryImg {
  title?: string;
  imageUrl: string;
}

interface GalleryProps {
  content: {
    title?: string;
    subtitle?: string;
    images?: GalleryImg[];
  };
}

export const GallerySection: React.FC<GalleryProps> = ({ content }) => {
  const { isArtsAndScience, isMedical, isUniversity, isEngineering } = useTheme();
  const isCenterAligned = isArtsAndScience || isUniversity;

  const [fetchedImages, setFetchedImages] = useState<GalleryImg[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!content.images || content.images.length === 0) {
      setLoading(true);
      apiClient.get('/site/gallery', { params: { limit: 4 } })
        .then((res) => {
          if (res.data.success && Array.isArray(res.data.data)) {
            setFetchedImages(res.data.data.map((g: any) => ({
              title: g.title,
              imageUrl: g.coverImageUrl,
            })).filter((img: any) => Boolean(img.imageUrl)));
          }
        })
        .catch(() => setError('Unable to load gallery. Please try again later.'))
        .finally(() => setLoading(false));
    }
  }, [content.images]);

  const images = content.images && content.images.length > 0 ? content.images : fetchedImages;
  const [activeModalImg, setActiveModalImg] = useState<string | null>(null);

  if (error && !loading) {
    return <SectionError message={error} className="bg-slate-50 dark:bg-slate-950" />;
  }
  if (!loading && images.length === 0) return null;

  const badgeClass = isArtsAndScience 
    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 font-serif' 
    : isUniversity 
    ? 'bg-rose-100 text-rose-900 border border-rose-200 font-serif' 
    : isMedical 
    ? 'bg-teal-100 text-teal-800 border border-teal-200 font-sans' 
    : 'bg-primary/10 text-primary font-sans';

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
    ? 'py-16 bg-slate-950 text-white border-y border-slate-900'
    : isArtsAndScience
    ? 'py-16 bg-[#fbf9f4] text-slate-900 border-y border-emerald-900/10'
    : isMedical
    ? 'py-16 bg-white text-slate-900 border-y border-cyan-100'
    : 'py-16 bg-[#fcfaf7] text-slate-900 border-y border-stone-200';

  const cardBorder = isEngineering
    ? 'border border-slate-800 hover:border-amber-400/60 shadow-xl'
    : isArtsAndScience
    ? 'border-2 border-emerald-800/15 hover:border-emerald-600 shadow-sm'
    : isMedical
    ? 'border border-cyan-200 hover:border-cyan-500 shadow-sm'
    : 'border-t-4 border-t-rose-900 border-x border-b border-stone-200 hover:border-rose-700 shadow-sm';

  return (
    <section className={sectionBg}>
      <div className="max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-16">
        {isCenterAligned ? (
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3 flex flex-col items-center">
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${badgeClass}`}>
              <Camera className="w-3.5 h-3.5" />
              <span>Campus Visual Tour</span>
            </div>
            <h2 className={headingFont}>
              {content.title || 'Campus Photo & Video Gallery'}
            </h2>
            {content.subtitle && (
              <p className="text-sm opacity-80 max-w-2xl mx-auto">
                {content.subtitle}
              </p>
            )}
            <Link
              to="/gallery"
              className={`inline-flex items-center gap-1 text-xs font-bold pt-1 ${linkColor}`}
            >
              <span>Explore All Albums</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-2 ${badgeClass}`}>
                <Camera className="w-3.5 h-3.5" />
                <span>Campus Visual Tour</span>
              </div>
              <h2 className={headingFont}>
                {content.title || 'Campus Photo & Video Gallery'}
              </h2>
              {content.subtitle && (
                <p className="text-sm opacity-80 mt-1">
                  {content.subtitle}
                </p>
              )}
            </div>
            <Link
              to="/gallery"
              className={`inline-flex items-center gap-1 text-xs font-bold self-start md:self-auto ${linkColor}`}
            >
              <span>Explore All Albums</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {images.map((img, idx) => (
            <div
              key={idx}
              onClick={() => setActiveModalImg(img.imageUrl)}
              className={`group relative h-64 rounded-2xl overflow-hidden hover:shadow-xl cursor-pointer ${cardBorder} transition duration-300`}
            >
              <img
                src={img.imageUrl}
                alt={img.title || 'Campus'}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300 p-4 flex flex-col justify-end">
                <p className="text-xs font-bold text-white leading-snug">
                  {img.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeModalImg && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setActiveModalImg(null)}
        >
          <button
            onClick={() => setActiveModalImg(null)}
            className="absolute top-6 right-6 text-white hover:text-red-400 p-2"
          >
            <X className="w-8 h-8" />
          </button>
          <img
            src={activeModalImg}
            alt="Enlarged campus view"
            className="max-w-4xl max-h-[85vh] object-contain rounded-xl shadow-2xl"
          />
        </div>
      )}
    </section>
  );
};
