import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight } from 'lucide-react';

interface ImageTextProps {
  content: {
    badge?: string;
    heading?: string;
    description?: string;
    imageUrl?: string;
    points?: string[];
    ctaText?: string;
    ctaLink?: string;
  };
}

export const ImageTextSection: React.FC<ImageTextProps> = ({ content }) => {
  return (
    <section className="py-16 bg-slate-50 border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-6">
        <div className={`grid grid-cols-1 ${content.imageUrl ? 'lg:grid-cols-2' : 'lg:grid-cols-1 max-w-3xl mx-auto'} gap-12 items-center`}>
          {/* Text Col */}
          <div className="space-y-6">
            {content.badge && (
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                {content.badge}
              </span>
            )}

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
              {content.heading}
            </h2>

            <p className="text-slate-600 text-lg leading-relaxed">
              {content.description}
            </p>

            {content.points && content.points.length > 0 && (
              <ul className="space-y-3 pt-2">
                {content.points.map((pt, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            )}

            {content.ctaText && (
              <div className="pt-4">
                <Link
                  to={content.ctaLink || '/'}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-primary hover:opacity-90 transition shadow-md"
                >
                  <span>{content.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>

          {/* Image Col */}
          {content.imageUrl && (
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                <img
                  src={content.imageUrl}
                  alt={content.heading || 'Section image'}
                  className="w-full h-full object-cover transform hover:scale-105 transition duration-500"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
