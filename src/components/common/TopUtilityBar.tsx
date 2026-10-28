import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, Award, Phone, Mail, FileText, Bus, BookOpen, Users, ShieldCheck, Briefcase } from 'lucide-react';
import { SiteConfig } from '../../types';

interface TopUtilityBarProps {
  siteConfig: SiteConfig;
}

export const TopUtilityBar: React.FC<TopUtilityBarProps> = ({ siteConfig }) => {
  const [fontSizeLevel, setFontSizeLevel] = useState<'sm' | 'md' | 'lg'>('md');

  const handleFontSize = (level: 'sm' | 'md' | 'lg') => {
    setFontSizeLevel(level);
    const root = document.documentElement;
    if (level === 'sm') {
      root.style.fontSize = '14px';
    } else if (level === 'lg') {
      root.style.fontSize = '18px';
    } else {
      root.style.fontSize = '16px';
    }
  };

  const phone = siteConfig.settings?.phone;
  const email = siteConfig.settings?.email;

  return (
    <div className="bg-slate-900 text-slate-300 text-[11px] font-medium border-b border-slate-800">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 lg:px-16 py-1.5 flex flex-wrap items-center justify-between gap-2">
        {/* Left Side: Contact Info & Statutory Links */}
        <div className="flex items-center gap-4 flex-wrap">
          {phone && (
            <a
              href={`tel:${phone}`}
              className="inline-flex items-center gap-1.5 hover:text-white transition"
              title="Admissions Helpline"
            >
              <Phone className="w-3 h-3 text-emerald-400" />
              <span>Admissions: {phone}</span>
            </a>
          )}
          {email && (
            <a
              href={`mailto:${email}`}
              className="hidden md:inline-flex items-center gap-1.5 hover:text-white transition"
              title="Official Email"
            >
              <Mail className="w-3 h-3 text-blue-400" />
              <span>{email}</span>
            </a>
          )}

          <div className="hidden xl:flex items-center gap-3 pl-2 border-l border-slate-700">
            <Link to="/placements" className="hover:text-amber-300 transition flex items-center gap-1">
              <Briefcase className="w-2.5 h-2.5" />
              <span>Placements</span>
            </Link>
            <Link to="/compliance" className="hover:text-amber-300 transition flex items-center gap-1">
              <ShieldCheck className="w-2.5 h-2.5" />
              <span>Mandatory Disclosure</span>
            </Link>
            <Link to="/library" className="hover:text-amber-300 transition flex items-center gap-1">
              <BookOpen className="w-2.5 h-2.5" />
              <span>Library</span>
            </Link>
            <Link to="/transport" className="hover:text-amber-300 transition flex items-center gap-1">
              <Bus className="w-2.5 h-2.5" />
              <span>Transport</span>
            </Link>
            <Link to="/alumni" className="hover:text-amber-300 transition flex items-center gap-1">
              <Users className="w-2.5 h-2.5" />
              <span>Alumni</span>
            </Link>
          </div>
        </div>

        {/* Right Side: Quick Action Portals & Font Resizer */}
        <div className="flex items-center gap-3 ml-auto">
          <Link
            to="/admissions"
            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-emerald-600/30 text-emerald-300 hover:bg-emerald-600/50 transition font-bold"
          >
            <CreditCard className="w-3 h-3" />
            <span>Pay Fees Online</span>
          </Link>

          <Link
            to="/courses"
            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-blue-600/30 text-blue-300 hover:bg-blue-600/50 transition font-bold"
          >
            <Award className="w-3 h-3" />
            <span>Exam Results & Grades</span>
          </Link>

          {/* Accessibility Font Size Control */}
          <div className="flex items-center gap-0.5 pl-2 border-l border-slate-700">
            <span className="text-[10px] text-slate-400 mr-1 hidden sm:inline">Text:</span>
            <button
              onClick={() => handleFontSize('sm')}
              className={`px-1.5 py-0.5 rounded font-bold transition ${fontSizeLevel === 'sm' ? 'bg-primary text-white' : 'hover:bg-slate-800 text-slate-400'}`}
              title="Small text"
            >
              A-
            </button>
            <button
              onClick={() => handleFontSize('md')}
              className={`px-1.5 py-0.5 rounded font-bold transition ${fontSizeLevel === 'md' ? 'bg-primary text-white' : 'hover:bg-slate-800 text-slate-400'}`}
              title="Normal text"
            >
              A
            </button>
            <button
              onClick={() => handleFontSize('lg')}
              className={`px-1.5 py-0.5 rounded font-bold transition ${fontSizeLevel === 'lg' ? 'bg-primary text-white' : 'hover:bg-slate-800 text-slate-400'}`}
              title="Large text"
            >
              A+
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
