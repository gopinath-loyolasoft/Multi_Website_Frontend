import React, { useState } from 'react';
import { Mail, GraduationCap, Award, RotateCw } from 'lucide-react';

export interface KineticFacultyCardProps {
  name: string;
  designation?: string;
  departmentName?: string;
  qualification?: string;
  experienceYears?: number;
  imageUrl?: string;
  email?: string;
  researchInterests?: string[];
}

export const KineticFacultyCard: React.FC<KineticFacultyCardProps> = ({
  name,
  designation,
  departmentName,
  qualification,
  experienceYears,
  imageUrl,
  email,
  researchInterests = ['Applied AI & Algorithms', 'Data Engineering', 'IoT & Cyber Systems'],
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="relative h-[320px] w-full [perspective:1000px] cursor-pointer group"
      onClick={() => setIsFlipped(!isFlipped)}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <div
        className={`w-full h-full relative transition-transform duration-700 [transform-style:preserve-3d] ${
          isFlipped ? '[transform:rotateY(180deg)]' : ''
        }`}
      >
        {/* FRONT FACE */}
        <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] bg-slate-800/80 border border-slate-700/80 group-hover:border-rose-500/60 rounded-2xl p-5 flex flex-col items-center text-center justify-between shadow-xl transition-all duration-300">
          <div className="h-1 bg-gradient-to-r from-rose-500 via-purple-500 to-indigo-500 rounded-t-2xl absolute top-0 inset-x-0 w-full" />

          {/* Avatar with Neon Glow */}
          <div className="relative mt-2">
            <div className="absolute -inset-1.5 bg-gradient-to-tr from-rose-500 to-indigo-600 rounded-2xl blur-sm opacity-50 group-hover:opacity-100 transition duration-500" />
            <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-white/20 bg-slate-900 shadow-xl">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={name}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-950 text-rose-400">
                  <GraduationCap className="w-10 h-10" />
                </div>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-base font-black text-white group-hover:text-rose-400 transition-colors">
              {name}
            </h4>
            {designation && (
              <span className="text-xs font-bold text-rose-400 block mt-0.5">
                {designation}
              </span>
            )}
            {departmentName && (
              <span className="text-[11px] text-slate-400 block mt-0.5">
                {departmentName}
              </span>
            )}
          </div>

          {(qualification || experienceYears) && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono bg-rose-500/10 border border-rose-500/30 text-rose-300">
              <Award className="w-3 h-3 text-rose-400" />
              <span>{qualification || `${experienceYears}+ Yrs Exp`}</span>
            </div>
          )}

          <div className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
            <RotateCw className="w-3 h-3 text-rose-400" />
            <span>Hover to view profile details</span>
          </div>
        </div>

        {/* BACK FACE */}
        <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-slate-900 border border-rose-500/60 rounded-2xl p-5 flex flex-col justify-between shadow-2xl">
          <div>
            <div className="border-b border-slate-800 pb-2 mb-3">
              <h4 className="text-sm font-black text-white">{name}</h4>
              <span className="text-[11px] font-bold text-rose-400">{designation}</span>
            </div>

            <div className="space-y-1.5 text-xs text-slate-300">
              <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block">Research & Teaching</span>
              <ul className="space-y-1 text-[11px]">
                {researchInterests.map((r, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-rose-500">▪</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {email && (
            <a
              href={`mailto:${email}`}
              className="w-full py-2 rounded-xl bg-slate-800 hover:bg-rose-600 text-white text-xs font-bold text-center inline-flex items-center justify-center gap-1.5 transition border border-rose-500/30"
            >
              <Mail className="w-3.5 h-3.5" />
              <span className="truncate max-w-[180px]">{email}</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
