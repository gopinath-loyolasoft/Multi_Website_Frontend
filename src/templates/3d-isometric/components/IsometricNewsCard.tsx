import React from 'react';
import { Calendar, ArrowRight, Newspaper } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface IsometricNewsCardProps {
  id?: string | number;
  title: string;
  excerpt?: string;
  category?: string;
  publishedAt?: string;
  imageUrl?: string;
  slug?: string;
}

export const IsometricNewsCard: React.FC<IsometricNewsCardProps> = ({
  id,
  title,
  excerpt,
  category = 'Campus Notice',
  publishedAt,
  imageUrl,
  slug,
}) => {
  const detailUrl = slug ? `/news/${slug}` : id ? `/news/${id}` : '/news';

  return (
    <div className="group relative bg-white border-3 border-slate-900 rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-2 shadow-[6px_6px_0px_0px_#0f172a] hover:shadow-[10px_10px_0px_0px_#0f172a] flex flex-col justify-between">
      {/* Top Media Image */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-200 border-b-3 border-slate-900">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
            <Newspaper className="w-12 h-12" />
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded text-[10px] font-mono font-black uppercase tracking-wider bg-amber-400 border-2 border-slate-900 text-slate-950 shadow-[2px_2px_0px_0px_#0f172a]">
            {category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {publishedAt && (
            <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-slate-500 mb-2">
              <Calendar className="w-3.5 h-3.5 text-amber-600" />
              <span>{publishedAt}</span>
            </div>
          )}
          <h3 className="text-base font-black text-slate-900 group-hover:text-amber-600 transition-colors line-clamp-2 mb-2 leading-snug">
            {title}
          </h3>
          {excerpt && (
            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-medium">
              {excerpt}
            </p>
          )}
        </div>

        {/* Action Link */}
        <div className="mt-4 pt-3 border-t-2 border-slate-200 flex items-center justify-between">
          <Link
            to={detailUrl}
            className="text-xs font-black text-slate-900 hover:text-amber-600 inline-flex items-center gap-1.5 group-hover:underline"
          >
            <span>Read Notice</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};
