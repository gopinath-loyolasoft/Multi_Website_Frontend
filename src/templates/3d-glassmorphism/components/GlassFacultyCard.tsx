import React from 'react';
import { Mail, GraduationCap, Award } from 'lucide-react';

export interface GlassFacultyCardProps {
  name: string;
  designation?: string;
  departmentName?: string;
  qualification?: string;
  experienceYears?: number;
  imageUrl?: string;
  email?: string;
}

export const GlassFacultyCard: React.FC<GlassFacultyCardProps> = ({
  name,
  designation,
  departmentName,
  qualification,
  experienceYears,
  imageUrl,
  email,
}) => {
  return (
    <div className="group relative bg-white/5 hover:bg-white/10 backdrop-blur-2xl border border-white/15 hover:border-cyan-400/50 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-2 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] hover:shadow-[0_0_35px_rgba(6,182,212,0.3)] flex flex-col items-center text-center">
      {/* Top chromatic accent */}
      <div className="h-1 bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 rounded-t-2xl absolute top-0 inset-x-0 w-full" />

      {/* Avatar Container with Glow Ring */}
      <div className="relative mt-2 mb-4">
        <div className="absolute -inset-1.5 bg-gradient-to-tr from-cyan-500 to-violet-600 rounded-2xl blur-sm opacity-50 group-hover:opacity-100 transition duration-500" />
        <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-white/30 bg-slate-900 shadow-xl">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-cover object-top group-hover:scale-110 transition duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-cyan-900/60 to-slate-900 text-cyan-300">
              <GraduationCap className="w-10 h-10" />
            </div>
          )}
        </div>
      </div>

      {/* Name */}
      <h4 className="text-base font-black text-white group-hover:text-cyan-300 transition-colors">
        {name}
      </h4>

      {/* Designation */}
      {designation && (
        <span className="text-xs font-bold text-cyan-400 mt-0.5">
          {designation}
        </span>
      )}

      {/* Department */}
      {departmentName && (
        <span className="text-[11px] text-slate-300 mt-1">
          {departmentName}
        </span>
      )}

      {/* Qualification / Experience Pill */}
      {(qualification || experienceYears) && (
        <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono bg-white/10 border border-white/15 text-slate-200">
          <Award className="w-3 h-3 text-cyan-400" />
          <span>{qualification || `${experienceYears}+ Yrs Exp`}</span>
        </div>
      )}

      {/* Email Link */}
      {email && (
        <a
          href={`mailto:${email}`}
          className="mt-4 inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-cyan-300 transition"
        >
          <Mail className="w-3.5 h-3.5" />
          <span className="truncate max-w-[150px]">{email}</span>
        </a>
      )}
    </div>
  );
};
