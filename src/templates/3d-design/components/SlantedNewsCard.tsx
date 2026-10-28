import React from 'react';
import { Calendar, ArrowRight, Newspaper } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface SlantedNewsCardProps {
  id?: string | number;
  imageSrc?: string;
  category?: string;
  date?: string;
  title: string;
  summary?: string;
  href?: string;
  className?: string;
}

export const SlantedNewsCard: React.FC<SlantedNewsCardProps> = ({
  id,
  imageSrc,
  category,
  date,
  title,
  summary,
  href,
  className = '',
}) => {
  const targetUrl = href || (id ? `/news/${id}` : '/news');

  return (
    <Link
      to={targetUrl}
      className={`group block relative overflow-hidden bg-white shadow-md hover:shadow-2xl transition-all duration-300 border border-slate-200 hover:-translate-y-2 ${className}`}
    >
      {/* Thumbnail */}
      <div className="relative h-56 w-full overflow-hidden bg-slate-900">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
          />
        ) : (
          <div className="w-full h-full bg-[#134975] flex items-center justify-center text-amber-300">
            <Newspaper className="w-12 h-12 stroke-[1.5]" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Category Pill */}
        {category && (
          <span className="absolute top-3 left-3 px-3 py-1 bg-[#134975]/90 text-amber-300 text-[10px] font-black uppercase -skew-x-12 backdrop-blur-sm border border-amber-400/30">
            <span className="inline-block skew-x-12">{category}</span>
          </span>
        )}
      </div>

      {/* Slanted Content Box Overlay */}
      <div
        className="relative -mt-10 mx-3 bg-white p-6 shadow-lg border-b-4 border-[#134975] group-hover:border-[#e5a912] transition-all duration-300"
        style={{ clipPath: 'polygon(0 0, 100% 0, 92% 100%, 0% 100%)' }}
      >
        {date && (
          <div className="flex items-center gap-3 text-xs text-red-600 font-semibold italic mb-2">
            <span className="inline-flex items-center gap-1 text-slate-500 not-italic font-mono text-[11px]">
              <Calendar className="w-3.5 h-3.5 text-[#e5a912]" />
              {date}
            </span>
          </div>
        )}
        <h4 className="text-base sm:text-lg font-bold text-slate-900 line-clamp-2 group-hover:text-[#134975] transition-colors pr-6 leading-snug">
          {title}
        </h4>
        {summary && (
          <p className="text-xs text-slate-600 line-clamp-2 mt-2 leading-relaxed pr-6">
            {summary}
          </p>
        )}

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#134975] group-hover:text-amber-600 transition-colors pr-4">
          <span>Read Article</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
};
