import React from 'react';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface KineticEventCardProps {
  id?: string | number;
  title: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  category?: string;
  description?: string;
  slug?: string;
}

export const KineticEventCard: React.FC<KineticEventCardProps> = ({
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
    <div className="group relative bg-slate-800/60 hover:bg-slate-800/90 border border-slate-700/80 hover:border-rose-500/60 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-2 shadow-xl hover:shadow-[0_0_30px_rgba(244,63,94,0.3)] flex flex-col sm:flex-row items-start sm:items-center gap-5">
      {/* 3D Glowing Neon Date Box */}
      <div className="shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-500 to-indigo-600 p-0.5 shadow-[0_0_20px_rgba(244,63,94,0.4)] group-hover:scale-105 transition duration-300">
        <div className="w-full h-full rounded-[14px] bg-slate-950 flex flex-col items-center justify-center text-white">
          <span className="text-[10px] font-mono font-black text-rose-400 tracking-wider">
            {month}
          </span>
          <span className="text-xl font-black text-white leading-none">
            {day}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 space-y-1.5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-rose-500/10 text-rose-300 border border-rose-500/30">
            {category}
          </span>
          {location && (
            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              <span>{location}</span>
            </div>
          )}
        </div>

        <h4 className="text-base font-black text-white group-hover:text-rose-400 transition-colors line-clamp-1">
          {title}
        </h4>

        {description && (
          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {/* Action Button */}
      <div className="shrink-0">
        <Link
          to={detailUrl}
          className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-slate-800 hover:bg-rose-600 border border-slate-700 hover:border-rose-400 text-white transition-all shadow-md group-hover:scale-105"
        >
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
