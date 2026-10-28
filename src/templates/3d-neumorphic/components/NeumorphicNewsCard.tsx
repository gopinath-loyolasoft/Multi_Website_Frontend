import React from 'react';
import { Calendar, ArrowRight, Newspaper } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface NeumorphicNewsCardProps {
  id?: string | number;
  title: string;
  excerpt?: string;
  category?: string;
  publishedAt?: string;
  imageUrl?: string;
  slug?: string;
}

export const NeumorphicNewsCard: React.FC<NeumorphicNewsCardProps> = ({
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
    <div className="group relative bg-[#eef2f6] rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-2 shadow-[8px_8px_16px_#d1d9e6,-8px_-8px_16px_#ffffff] hover:shadow-[12px_12px_24px_#d1d9e6,-12px_-12px_24px_#ffffff] flex flex-col justify-between">
      {/* Top Media Image */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-200">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#e4ebf3] text-slate-400">
            <Newspaper className="w-12 h-12 opacity-50" />
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-[#eef2f6]/95 text-teal-800 shadow-md">
            {category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {publishedAt && (
            <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-slate-500 mb-2">
              <Calendar className="w-3.5 h-3.5 text-teal-600" />
              <span>{publishedAt}</span>
            </div>
          )}
          <h3 className="text-base font-black text-slate-800 group-hover:text-teal-600 transition-colors line-clamp-2 mb-2 leading-snug">
            {title}
          </h3>
          {excerpt && (
            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-medium">
              {excerpt}
            </p>
          )}
        </div>

        {/* Action Link */}
        <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
          <Link
            to={detailUrl}
            className="text-xs font-black text-teal-600 hover:text-teal-700 inline-flex items-center gap-1.5 group-hover:underline"
          >
            <span>Read Announcement</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};
