import React from 'react';
import { Calendar } from 'lucide-react';

export interface SlantedNewsCardProps {
  imageSrc: string;
  category: string;
  date: string;
  title: string;
  href?: string;
  className?: string;
}

export const SlantedNewsCard: React.FC<SlantedNewsCardProps> = ({
  imageSrc,
  category,
  date,
  title,
  href = '#',
  className = '',
}) => {
  return (
    <a
      href={href}
      className={`group block relative overflow-hidden bg-white shadow-md hover:shadow-2xl transition-all duration-300 border border-slate-100 ${className}`}
    >
      {/* Thumbnail */}
      <div className="relative h-56 w-full overflow-hidden bg-slate-900">
        <img
          src={imageSrc}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </div>

      {/* Slanted Content Box Overlay */}
      <div
        className="relative -mt-10 mx-3 bg-white p-6 shadow-lg border-b-4 border-[#1b4b72] group-hover:border-[#e5a912] transition-all duration-300"
        style={{ clipPath: 'polygon(0 0, 100% 0, 88% 100%, 0% 100%)' }}
      >
        <div className="flex items-center gap-3 text-xs text-red-600 font-semibold italic mb-1.5">
          <span>{category}</span>
          <span className="inline-flex items-center gap-1 text-slate-400 not-italic font-normal">
            <Calendar className="w-3 h-3 text-amber-500" />
            {date}
          </span>
        </div>
        <h4 className="text-base font-bold text-slate-900 line-clamp-2 group-hover:text-[#1b4b72] transition-colors pr-6">
          {title}
        </h4>
      </div>
    </a>
  );
};
