import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, ArrowRight } from 'lucide-react';

export interface SlantedEventCardProps {
  id: string | number;
  title: string;
  description?: string;
  eventDate: string;
  location?: string;
  time?: string;
  category?: string;
  className?: string;
}

const formatEventDateParts = (dateStr?: string) => {
  if (!dateStr) return { day: '01', month: 'JAN', year: '2026' };
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return { day: '01', month: 'JAN', year: '2026' };
  return {
    day: String(d.getDate()).padStart(2, '0'),
    month: d.toLocaleString('en-US', { month: 'short' }).toUpperCase(),
    year: String(d.getFullYear()),
  };
};

export const SlantedEventCard: React.FC<SlantedEventCardProps> = ({
  id,
  title,
  description,
  eventDate,
  location = 'Main Auditorium',
  time,
  category,
  className = '',
}) => {
  const { day, month, year } = formatEventDateParts(eventDate);

  return (
    <Link
      to={`/events/${id}`}
      className={`group bg-white border border-slate-200/90 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden hover:-translate-y-2 hover:border-[#e5a912] relative ${className}`}
    >
      {/* Top Gold Stripe */}
      <div className="h-1.5 w-full bg-[#e5a912] group-hover:bg-[#134975] transition-colors" />

      <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
        <div className="flex items-start gap-4">
          {/* Slanted Date Box */}
          <div className="w-16 h-18 -skew-x-12 bg-[#134975] text-amber-300 border border-amber-400/40 shadow-md flex flex-col items-center justify-center shrink-0 text-center">
            <span className="text-[10px] font-mono font-black uppercase tracking-wider skew-x-12 text-amber-400">
              {month}
            </span>
            <span className="text-2xl font-black skew-x-12 leading-none mt-0.5 text-white">
              {day}
            </span>
            <span className="text-[9px] font-mono text-slate-300 skew-x-12 mt-0.5">
              {year}
            </span>
          </div>

          {/* Content Details */}
          <div className="min-w-0 flex-1">
            {category && (
              <span className="inline-block px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider mb-1.5 -skew-x-6 bg-sky-50 text-[#134975] border border-sky-200">
                <span className="inline-block skew-x-6">{category}</span>
              </span>
            )}
            <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#134975] transition-colors leading-snug line-clamp-2">
              {title}
            </h3>
          </div>
        </div>

        {description && (
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {description}
          </p>
        )}

        <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#e5a912] shrink-0" />
            <span className="truncate">{location}</span>
          </div>
          {time && (
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#134975] shrink-0" />
              <span>{time}</span>
            </div>
          )}
        </div>

        {/* Card Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#134975] group-hover:text-amber-600 transition-colors">
          <span>View Event Details</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
};
