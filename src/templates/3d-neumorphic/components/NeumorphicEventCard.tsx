import React from 'react';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface NeumorphicEventCardProps {
  id?: string | number;
  title: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  category?: string;
  description?: string;
  slug?: string;
}

export const NeumorphicEventCard: React.FC<NeumorphicEventCardProps> = ({
  id,
  title,
  startDate,
  location,
  category = 'Campus Event',
  description,
  slug,
}) => {
  const detailUrl = slug ? `/events/${slug}` : id ? `/events/${id}` : '/events';

  const dateObj = startDate ? new Date(startDate) : null;
  const month = dateObj ? dateObj.toLocaleString('en-US', { month: 'short' }).toUpperCase() : 'EVENT';
  const day = dateObj ? dateObj.getDate() : '📅';

  return (
    <div className="group relative bg-[#eef2f6] rounded-3xl p-5 transition-all duration-300 hover:-translate-y-2 shadow-[8px_8px_16px_#d1d9e6,-8px_-8px_16px_#ffffff] hover:shadow-[12px_12px_24px_#d1d9e6,-12px_-12px_24px_#ffffff] flex flex-col sm:flex-row items-start sm:items-center gap-5">
      {/* 3D Soft Date Box */}
      <div className="shrink-0 w-16 h-16 rounded-2xl bg-teal-600 shadow-[4px_4px_10px_rgba(13,148,136,0.35),-2px_-2px_6px_#ffffff] flex flex-col items-center justify-center text-white group-hover:scale-105 transition duration-200">
        <span className="text-[10px] font-mono font-black text-teal-100 tracking-wider">
          {month}
        </span>
        <span className="text-xl font-black leading-none">
          {day}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 space-y-1.5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-3 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-[#eef2f6] text-teal-700 shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#ffffff]">
            {category}
          </span>
          {location && (
            <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500">
              <MapPin className="w-3.5 h-3.5 text-teal-600" />
              <span>{location}</span>
            </div>
          )}
        </div>

        <h4 className="text-base font-black text-slate-800 group-hover:text-teal-600 transition-colors line-clamp-1">
          {title}
        </h4>

        {description && (
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-medium">
            {description}
          </p>
        )}
      </div>

      {/* Action Button */}
      <div className="shrink-0">
        <Link
          to={detailUrl}
          className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-[#eef2f6] hover:bg-teal-600 hover:text-white shadow-[4px_4px_8px_#d1d9e6,-4px_-4px_8px_#ffffff] active:shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#ffffff] text-slate-700 transition-all"
        >
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
