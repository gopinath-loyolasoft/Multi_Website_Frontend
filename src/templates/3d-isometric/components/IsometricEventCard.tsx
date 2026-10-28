import React from 'react';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface IsometricEventCardProps {
  id?: string | number;
  title: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  category?: string;
  description?: string;
  slug?: string;
}

export const IsometricEventCard: React.FC<IsometricEventCardProps> = ({
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
    <div className="group relative bg-white border-3 border-slate-900 rounded-2xl p-5 transition-all duration-200 hover:-translate-y-2 shadow-[6px_6px_0px_0px_#0f172a] hover:shadow-[10px_10px_0px_0px_#0f172a] flex flex-col sm:flex-row items-start sm:items-center gap-5">
      {/* 3D Date Box */}
      <div className="shrink-0 w-16 h-16 rounded-2xl bg-amber-400 border-3 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] flex flex-col items-center justify-center text-slate-950 group-hover:scale-105 transition duration-200">
        <span className="text-[10px] font-mono font-black tracking-wider">
          {month}
        </span>
        <span className="text-xl font-black leading-none">
          {day}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 space-y-1.5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-black uppercase tracking-wider bg-slate-100 text-slate-900 border-2 border-slate-900 shadow-[1px_1px_0px_0px_#0f172a]">
            {category}
          </span>
          {location && (
            <div className="flex items-center gap-1 text-[11px] font-bold text-slate-600">
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              <span>{location}</span>
            </div>
          )}
        </div>

        <h4 className="text-base font-black text-slate-900 group-hover:text-amber-600 transition-colors line-clamp-1">
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
          className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-amber-400 hover:bg-amber-300 border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#0f172a] text-slate-950 transition-all font-black"
        >
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
