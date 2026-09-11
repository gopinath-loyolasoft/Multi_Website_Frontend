import React, { useState, useEffect } from 'react';
import { Camera, X, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import { apiClient } from '../../services/apiClient';
import { SectionError } from './SectionError';

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

  return (
    <section className="py-16 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary mb-2">
              <Camera className="w-3.5 h-3.5" />
              <span>Campus Visual Tour</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {content.title || 'Campus Photo & Video Gallery'}
            </h2>
            {content.subtitle && (
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {content.subtitle}
              </p>
            )}
          </div>
          <Link
            to="/gallery"
            className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline self-start md:self-auto"
          >
            <span>Explore All Albums</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {images.map((img, idx) => (
            <div
              key={idx}
              onClick={() => setActiveModalImg(img.imageUrl)}
              className="group relative h-64 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl cursor-pointer border border-slate-200/80 dark:border-slate-800 transition duration-300"
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
