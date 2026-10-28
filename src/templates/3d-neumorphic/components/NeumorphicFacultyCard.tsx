import React from 'react';
import { Mail, GraduationCap, Award } from 'lucide-react';

export interface NeumorphicFacultyCardProps {
  name: string;
  designation?: string;
  departmentName?: string;
  qualification?: string;
  experienceYears?: number;
  imageUrl?: string;
  email?: string;
}

export const NeumorphicFacultyCard: React.FC<NeumorphicFacultyCardProps> = ({
  name,
  designation,
  departmentName,
  qualification,
  experienceYears,
  imageUrl,
  email,
}) => {
  return (
    <div className="group relative bg-[#eef2f6] rounded-3xl p-5 transition-all duration-300 hover:-translate-y-2 shadow-[8px_8px_16px_#d1d9e6,-8px_-8px_16px_#ffffff] hover:shadow-[12px_12px_24px_#d1d9e6,-12px_-12px_24px_#ffffff] flex flex-col items-center text-center">
      {/* Top Accent Strip */}
      <div className="h-1.5 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-t-3xl absolute top-0 inset-x-0 w-full" />

      {/* Avatar Container with Inset & Outset Soft Shadow */}
      <div className="relative mt-2 mb-4">
        <div className="w-24 h-24 rounded-3xl overflow-hidden p-1 bg-[#eef2f6] shadow-[6px_6px_12px_#d1d9e6,-6px_-6px_12px_#ffffff]">
          <div className="w-full h-full rounded-2xl overflow-hidden">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={name}
                className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-teal-50 text-teal-600">
                <GraduationCap className="w-10 h-10" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Name */}
      <h4 className="text-base font-black text-slate-800 group-hover:text-teal-600 transition-colors">
        {name}
      </h4>

      {/* Designation */}
      {designation && (
        <span className="text-xs font-bold text-teal-600 mt-0.5">
          {designation}
        </span>
      )}

      {/* Department */}
      {departmentName && (
        <span className="text-[11px] text-slate-500 mt-1 font-medium">
          {departmentName}
        </span>
      )}

      {/* Qualification / Experience Pill */}
      {(qualification || experienceYears) && (
        <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono bg-[#eef2f6] text-teal-800 shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#ffffff]">
          <Award className="w-3 h-3 text-teal-600" />
          <span>{qualification || `${experienceYears}+ Yrs Exp`}</span>
        </div>
      )}

      {/* Email Link */}
      {email && (
        <a
          href={`mailto:${email}`}
          className="mt-4 inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-teal-600 font-bold transition"
        >
          <Mail className="w-3.5 h-3.5 text-teal-600" />
          <span className="truncate max-w-[150px]">{email}</span>
        </a>
      )}
    </div>
  );
};
