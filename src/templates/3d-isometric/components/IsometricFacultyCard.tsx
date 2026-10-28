import React from 'react';
import { Mail, GraduationCap, Award } from 'lucide-react';

export interface IsometricFacultyCardProps {
  name: string;
  designation?: string;
  departmentName?: string;
  qualification?: string;
  experienceYears?: number;
  imageUrl?: string;
  email?: string;
}

export const IsometricFacultyCard: React.FC<IsometricFacultyCardProps> = ({
  name,
  designation,
  departmentName,
  qualification,
  experienceYears,
  imageUrl,
  email,
}) => {
  return (
    <div className="group relative bg-white border-3 border-slate-900 rounded-2xl p-5 transition-all duration-200 hover:-translate-y-2 shadow-[6px_6px_0px_0px_#0f172a] hover:shadow-[10px_10px_0px_0px_#0f172a] flex flex-col items-center text-center">
      {/* Top Accent Strip */}
      <div className="h-2 bg-amber-400 rounded-t-xl border-b-2 border-slate-900 absolute top-0 inset-x-0 w-full" />

      {/* Avatar Container with Isometric Shadow */}
      <div className="relative mt-3 mb-4">
        <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-3 border-slate-900 bg-amber-100 shadow-[4px_4px_0px_0px_#0f172a]">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-amber-300 text-slate-950">
              <GraduationCap className="w-10 h-10" />
            </div>
          )}
        </div>
      </div>

      {/* Name */}
      <h4 className="text-base font-black text-slate-900 group-hover:text-amber-600 transition-colors">
        {name}
      </h4>

      {/* Designation */}
      {designation && (
        <span className="text-xs font-bold text-amber-700 mt-0.5">
          {designation}
        </span>
      )}

      {/* Department */}
      {departmentName && (
        <span className="text-[11px] text-slate-600 font-semibold mt-1">
          {departmentName}
        </span>
      )}

      {/* Qualification / Experience Pill */}
      {(qualification || experienceYears) && (
        <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded text-[10px] font-mono font-black uppercase bg-slate-100 text-slate-900 border-2 border-slate-900 shadow-[1px_1px_0px_0px_#0f172a]">
          <Award className="w-3 h-3 text-amber-600" />
          <span>{qualification || `${experienceYears}+ Yrs Exp`}</span>
        </div>
      )}

      {/* Email Link */}
      {email && (
        <a
          href={`mailto:${email}`}
          className="mt-4 inline-flex items-center gap-1 text-[11px] text-slate-600 hover:text-slate-950 font-bold transition"
        >
          <Mail className="w-3.5 h-3.5 text-amber-600" />
          <span className="truncate max-w-[150px]">{email}</span>
        </a>
      )}
    </div>
  );
};
