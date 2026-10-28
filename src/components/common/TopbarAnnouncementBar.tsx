import React from 'react';
import { Link } from 'react-router-dom';
import { 
  HeartPulse, 
  Phone, 
  Bell, 
  AlertCircle, 
  Sparkles, 
  Megaphone,
  ExternalLink
} from 'lucide-react';
import { SiteConfig } from '../../types';
import { getLucideIcon } from './IconPicker';

export interface TopbarConfig {
  isActive?: boolean;
  position?: 'split' | 'center' | 'left' | 'right';
  icon?: string;
  headline?: string;
  badgeText?: string;
  link1Text?: string;
  link1Url?: string;
  link2Text?: string;
  link2Url?: string;
  link2Highlight?: boolean;
  bgColor?: string;
  textColor?: string;
  colorScheme?: string;
}

interface Props {
  siteConfig?: SiteConfig | null;
}

export const TopbarAnnouncementBar: React.FC<Props> = ({ siteConfig }) => {
  const topbar = (siteConfig?.settings?.socialLinks as any)?.topbar as TopbarConfig | undefined;

  // If not active, or unconfigured, do not render anything
  if (!topbar || topbar.isActive === false) {
    return null;
  }

  const hasHeadline = Boolean(topbar.headline && topbar.headline.trim());
  const hasBadge = Boolean(topbar.badgeText && topbar.badgeText.trim());
  const hasLink1 = Boolean(topbar.link1Text && topbar.link1Text.trim());
  const hasLink2 = Boolean(topbar.link2Text && topbar.link2Text.trim());

  if (!hasHeadline && !hasBadge && !hasLink1 && !hasLink2) {
    return null;
  }

  const position = topbar.position || 'split';

  const renderIcon = () => {
    if (!topbar.icon || topbar.icon === 'None' || topbar.icon === 'none') {
      return null;
    }
    const IconComp = getLucideIcon(topbar.icon);
    const isPulse = topbar.icon === 'HeartPulse' || topbar.icon === 'Activity';
    return <IconComp className={`w-3.5 h-3.5 shrink-0 ${isPulse ? 'animate-pulse text-rose-400' : ''}`} />;
  };

  // Resolve custom or fallback background color
  const resolveCustomStyle = (): React.CSSProperties => {
    if (topbar.bgColor) {
      return {
        backgroundColor: topbar.bgColor,
        color: topbar.textColor || '#ffffff',
        borderColor: 'rgba(255, 255, 255, 0.15)',
      };
    }
    return {};
  };

  // Color scheme fallback classes if no custom hex is set
  const getContainerBgClass = () => {
    if (topbar.bgColor) {
      return '';
    }
    switch (topbar.colorScheme) {
      case 'blue':
        return 'bg-blue-950 text-blue-100 border-blue-900';
      case 'indigo':
        return 'bg-indigo-950 text-indigo-100 border-indigo-900';
      case 'emerald':
        return 'bg-emerald-950 text-emerald-100 border-emerald-900';
      case 'crimson':
        return 'bg-rose-950 text-rose-100 border-rose-900';
      case 'amber':
        return 'bg-amber-950 text-amber-100 border-amber-900';
      case 'dark':
        return 'bg-slate-950 text-slate-100 border-slate-900';
      case 'teal':
      default:
        return 'bg-teal-950 text-teal-100 border-teal-900';
    }
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'center':
        return 'justify-center text-center';
      case 'left':
        return 'justify-start text-left';
      case 'right':
        return 'justify-end text-right';
      case 'split':
      default:
        return 'justify-between';
    }
  };

  const isExternal = (url: string) => url.startsWith('http://') || url.startsWith('https://');

  const renderLink = (text?: string, url?: string, isHighlight?: boolean) => {
    if (!text || !url) return null;

    const highlightClass = isHighlight
      ? 'bg-amber-400 text-slate-950 font-bold px-2 py-0.5 rounded shadow-2xs hover:bg-amber-300'
      : 'text-white/90 hover:text-white hover:underline';

    if (isExternal(url)) {
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-1 transition ${highlightClass}`}
        >
          <span>{text}</span>
          <ExternalLink className="w-2.5 h-2.5 opacity-70" />
        </a>
      );
    }

    return (
      <Link to={url} className={`inline-flex items-center gap-1 transition ${highlightClass}`}>
        <span>{text}</span>
      </Link>
    );
  };

  return (
    <div
      style={resolveCustomStyle()}
      className={`text-xs py-1.5 px-4 sm:px-8 lg:px-12 flex flex-wrap items-center gap-3 border-b font-medium transition-colors ${getContainerBgClass()} ${getPositionClasses()}`}
    >
      {/* Headline & Secondary Badge */}
      {(hasHeadline || hasBadge) && (
        <div className="flex items-center gap-3 flex-wrap">
          {hasHeadline && (
            <span className="flex items-center gap-1.5 font-bold tracking-wide">
              {renderIcon()}
              <span>{topbar.headline}</span>
            </span>
          )}

          {hasHeadline && hasBadge && <span className="opacity-40">|</span>}

          {hasBadge && (
            <span className="opacity-80 text-[11px] font-normal">
              {topbar.badgeText}
            </span>
          )}
        </div>
      )}

      {/* Action Links */}
      {(hasLink1 || hasLink2) && (
        <div className="flex items-center gap-2.5 text-[11px]">
          {hasLink1 && renderLink(topbar.link1Text, topbar.link1Url, false)}
          {hasLink1 && hasLink2 && <span className="opacity-40">•</span>}
          {hasLink2 && renderLink(topbar.link2Text, topbar.link2Url, topbar.link2Highlight)}
        </div>
      )}
    </div>
  );
};
