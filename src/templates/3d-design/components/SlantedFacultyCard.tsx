import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ArrowRight } from 'lucide-react';

export interface SlantedFacultyCardProps {
  id?: string | number;
  name: string;
  designation: string;
  department?: string;
  qualification?: string;
  specialization?: string;
  imageUrl?: string;
  profileUrl?: string;
  className?: string;
}

export const SlantedFacultyCard: React.FC<SlantedFacultyCardProps> = ({
  id,
  name,
  designation,
  department,
  qualification,
  specialization,
  imageUrl,
  profileUrl,
  className = '',
}) => {
  const targetUrl = profileUrl || (id ? `/faculty/${id}` : '/faculty');

  const initials = name
    .replace('Dr. ', '')
    .replace('Prof. ', '')
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('');

  return (
    <div
      className={`group bg-white border border-slate-200/90 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden hover:-translate-y-2 hover:border-[#e5a912] relative ${className}`}
    >
      {/* Top Gold Stripe */}
      <div className="h-1.5 w-full bg-[#e5a912] group-hover:bg-[#134975] transition-colors" />

      <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Avatar + Designation */}
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 -skew-x-12 bg-[#134975] text-amber-300 border border-amber-400/40 shadow-md flex items-center justify-center shrink-0 overflow-hidden font-black text-xl">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={name}
                  className="w-full h-full object-cover object-top skew-x-12 scale-110"
                />
              ) : (
                <span className="skew-x-12">{initials || 'F'}</span>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <span className="inline-block px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider mb-1 -skew-x-6 bg-amber-100 text-amber-950 border border-amber-300">
                <span className="inline-block skew-x-6">{designation}</span>
              </span>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#134975] transition-colors leading-tight truncate">
                {name}
              </h3>
              {department && (
                <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
                  {department}
                </p>
              )}
            </div>
          </div>

          {/* Qualification Badge */}
          {qualification && (
            <div className="mt-4 p-2.5 bg-slate-50 border-l-2 border-l-[#e5a912] border-slate-200 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-[#134975] shrink-0" />
              <span className="text-xs font-semibold text-slate-700 truncate">
                {qualification}
              </span>
            </div>
          )}

          {/* Specialization */}
          {specialization && (
            <div className="mt-3">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Domain & Research
              </span>
              <p className="text-xs text-slate-600 mt-0.5 line-clamp-2 leading-relaxed">
                {specialization}
              </p>
            </div>
          )}
        </div>

        {/* Card Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <Link
            to={targetUrl}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#134975] group-hover:text-amber-600 transition-colors"
          >
            <span>View Academic Profile</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};
