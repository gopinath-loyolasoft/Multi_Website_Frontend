import React, { useState, useRef, useEffect } from 'react';
import { 
  LogOut, 
  ShieldCheck, 
  ChevronDown, 
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';

export interface HeaderProfileDropdownProps {
  user: {
    fullName?: string;
    username?: string;
    email?: string;
    role?: string;
  } | null;
  roleTitle: string;
  subInfo?: string;
  onLogout: () => void;
  variant?: 'admin' | 'superadmin';
  quickLinks?: {
    label: string;
    to?: string;
    onClick?: () => void;
    icon: React.ComponentType<{ className?: string }>;
    external?: boolean;
  }[];
}

export const HeaderProfileDropdown: React.FC<HeaderProfileDropdownProps> = ({
  user,
  roleTitle,
  subInfo,
  onLogout,
  variant = 'admin',
  quickLinks = []
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const displayName = user?.fullName || user?.username || (variant === 'superadmin' ? 'Super Administrator' : 'College Admin');
  const displayEmail = user?.email || user?.username || 'admin@portal.edu';
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'AD';

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Profile Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-xl transition border cursor-pointer ${
          isOpen
            ? 'bg-slate-100 dark:bg-slate-800 border-blue-500/40 text-blue-600 dark:text-blue-400'
            : 'bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 shadow-xs'
        }`}
        title={`Logged in as ${displayName} (${roleTitle})`}
        aria-expanded={isOpen}
      >
        {/* Avatar Circle */}
        <div className="relative">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-xs tracking-wider">
            {initials}
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900 absolute -bottom-0.5 -right-0.5" />
        </div>

        {/* User Info (hidden on small screens) */}
        <div className="hidden md:flex flex-col text-left min-w-0 max-w-[130px]">
          <span className="text-xs font-bold text-slate-900 dark:text-white truncate leading-tight">
            {displayName}
          </span>
          <span className="text-[10px] text-slate-400 dark:text-slate-400 font-medium truncate leading-tight">
            {roleTitle}
          </span>
        </div>

        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-blue-600 dark:text-blue-400' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-2 z-50 space-y-2 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-xl">
          {/* Header Card with User Details */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800/80 space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-sm shadow-sm">
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-xs text-slate-900 dark:text-white truncate">
                  {displayName}
                </p>
                <p className="text-[11px] text-slate-400 truncate">
                  {displayEmail}
                </p>
              </div>
            </div>

            {/* Badges */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50">
                <ShieldCheck className="w-3 h-3" />
                <span>{roleTitle}</span>
              </span>
              {subInfo && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-200/70 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300">
                  {subInfo}
                </span>
              )}
            </div>
          </div>

          {/* Quick Links */}
          {quickLinks.length > 0 && (
            <div className="space-y-0.5">
              {quickLinks.map((link, idx) => {
                const IconComp = link.icon;
                if (link.to) {
                  return (
                    <Link
                      key={idx}
                      to={link.to}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    >
                      <div className="flex items-center gap-2">
                        <IconComp className="w-3.5 h-3.5 text-slate-400" />
                        <span>{link.label}</span>
                      </div>
                      {link.external && <ExternalLink className="w-3 h-3 text-slate-400 opacity-60" />}
                    </Link>
                  );
                }
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      link.onClick?.();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <IconComp className="w-3.5 h-3.5 text-slate-400" />
                      <span>{link.label}</span>
                    </div>
                    {link.external && <ExternalLink className="w-3 h-3 text-slate-400 opacity-60" />}
                  </button>
                );
              })}
            </div>
          )}

          {/* Sign Out Action Button */}
          <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onLogout();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 transition text-left cursor-pointer group"
            >
              <LogOut className="w-4 h-4 text-red-500 transition-transform group-hover:-translate-x-0.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
