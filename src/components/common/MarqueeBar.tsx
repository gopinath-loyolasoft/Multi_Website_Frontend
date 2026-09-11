import React, { useState } from 'react';
import { MarqueeData, MarqueeSettings, MarqueeItem } from '../../types';
import { Bell, ChevronRight } from 'lucide-react';

interface MarqueeBarProps {
  marquee?: MarqueeData;
  settings?: MarqueeSettings;
  items?: MarqueeItem[];
  isPreview?: boolean;
}

export const MarqueeBar: React.FC<MarqueeBarProps> = ({
  marquee,
  settings: propSettings,
  items: propItems,
  isPreview = false,
}) => {
  const settings = propSettings || marquee?.settings || {
    isActive: true,
    speed: 'medium',
    pauseOnHover: true,
    bgColor: '#0f172a',
    textColor: '#f8fafc',
    badgeBgColor: '#f59e0b',
  };

  const rawItems = propItems || marquee?.items || [];
  const now = new Date();
  const activeItems = rawItems.filter((i) => {
    if (!i.isActive) return false;
    if (i.startDate && new Date(i.startDate) > now) return false;
    if (i.endDate && new Date(i.endDate) < now) return false;
    return true;
  });

  const [isPaused, setIsPaused] = useState(false);

  if (!settings.isActive && !isPreview) {
    return null;
  }

  if (activeItems.length === 0) {
    if (isPreview) {
      return (
        <div className="py-2.5 px-4 text-center text-xs font-medium text-slate-400 bg-slate-900 border-b border-slate-800">
          No announcement items configured yet. Add an item below to see the preview.
        </div>
      );
    }
    return null;
  }

  const speedDurations: Record<string, string> = {
    slow: '45s',
    medium: '25s',
    fast: '14s',
  };
  const duration = speedDurations[settings.speed?.toLowerCase()] || '25s';

  return (
    <div
      className="relative overflow-hidden z-30 transition-colors border-b border-white/10"
      style={{
        backgroundColor: settings.bgColor || '#0f172a',
        color: settings.textColor || '#f8fafc',
      }}
      onMouseEnter={() => settings.pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => settings.pauseOnHover && setIsPaused(false)}
    >
      <div className="max-w-screen-2xl mx-auto flex items-center py-2 px-6 sm:px-10 lg:px-16">
        <div className="shrink-0 flex items-center gap-1.5 pr-4 border-r border-white/15 z-10 bg-inherit mr-2">
          <span
            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider text-slate-950 shadow-sm"
            style={{ backgroundColor: settings.badgeBgColor || '#f59e0b' }}
          >
            <Bell className="w-3 h-3 animate-pulse" />
            <span>Alerts</span>
          </span>
          {isPreview && (
            <span className="hidden md:inline text-[10px] font-mono uppercase bg-primary/20 text-primary-300 px-1.5 py-0.5 rounded border border-primary/30">
              Admin Live Preview
            </span>
          )}
        </div>

        <div className="relative flex-1 overflow-hidden">
          <div
            className="inline-flex items-center whitespace-nowrap gap-12 text-xs font-medium"
            style={{
              animationName: 'marquee-scroll',
              animationDuration: duration,
              animationTimingFunction: 'linear',
              animationIterationCount: 'infinite',
              animationPlayState: isPaused ? 'paused' : 'running',
            }}
          >
            {[...activeItems, ...activeItems].map((item, idx) => (
              <div key={`${item.id}-${idx}`} className="inline-flex items-center gap-2.5 shrink-0">
                {item.badgeText && (
                  <span
                    className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wide text-slate-950 shadow-sm"
                    style={{ backgroundColor: settings.badgeBgColor || '#f59e0b' }}
                  >
                    {item.badgeText}
                  </span>
                )}
                {item.linkUrl ? (
                  <a
                    href={item.linkUrl}
                    className="hover:underline flex items-center gap-1 transition opacity-95 hover:opacity-100"
                    target={item.linkUrl.startsWith('http') ? '_blank' : '_self'}
                    rel="noreferrer"
                  >
                    <span>{item.message}</span>
                    <ChevronRight className="w-3 h-3 opacity-70" />
                  </a>
                ) : (
                  <span>{item.message}</span>
                )}
                <span className="opacity-30 select-none text-sm">✦</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee-scroll {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
};
