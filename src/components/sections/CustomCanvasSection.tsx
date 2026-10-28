import React, { useState } from 'react';
import {
  FileText,
  Download,
  ExternalLink,
  Award,
  Sparkles,
  Play,
  Clock,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  GraduationCap,
  Building2,
  Users,
  Bell,
  MapPin,
  Calendar,
  Newspaper,
  Globe,
  Mail,
  Phone,
  Compass,
} from 'lucide-react';
import { CustomCanvasContent, CanvasBlock } from '../../types/canvasBuilder';
import { SectionSettings } from '../../types';

interface CustomCanvasSectionProps {
  content?: CustomCanvasContent | Record<string, any>;
  settings?: SectionSettings;
  title?: string;
  subtitle?: string;
}

const PublicTabsBlock: React.FC<{
  block: CanvasBlock;
  inlineStyles: React.CSSProperties;
  alignmentWrapperClass: string;
  paddingYClass: string;
  paddingXClass: string;
  marginYClass: string;
  radiusClass: string;
  shadowClass: string;
}> = ({
  block,
  inlineStyles,
  alignmentWrapperClass,
  paddingYClass,
  paddingXClass,
  marginYClass,
  radiusClass,
  shadowClass,
}) => {
  const content = block.content || {};
  const tabs = Array.isArray(content.tabs) ? content.tabs : [];
  const [activeIdx, setActiveIdx] = useState(content.activeTabIndex ?? 0);
  const activeTab = tabs[activeIdx] || tabs[0];

  if (tabs.length === 0) return null;

  return (
    <div style={inlineStyles} className={`${alignmentWrapperClass} ${paddingYClass} ${paddingXClass} ${marginYClass}`}>
      <div className={`space-y-4 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 ${radiusClass} ${shadowClass}`}>
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          {tabs.map((tab: any, idx: number) => {
            const isActive = activeIdx === idx;
            return (
              <button
                key={tab.id || idx}
                type="button"
                onClick={() => setActiveIdx(idx)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <span>{tab.title || `Tab ${idx + 1}`}</span>
                {tab.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full uppercase font-mono ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        {activeTab && (
          <div className="p-4 sm:p-5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <h4 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-slate-100">
                {activeTab.title}
              </h4>
              {activeTab.badge && (
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 uppercase tracking-wider">
                  {activeTab.badge}
                </span>
              )}
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {activeTab.content || ''}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const PublicBlockItem: React.FC<{ block: CanvasBlock }> = ({ block }) => {
  const styles = block.styles || {};
  const content = block.content || {};

  const inlineStyles: React.CSSProperties = {
    fontFamily: styles.fontFamily && styles.fontFamily !== 'inherit' ? styles.fontFamily : undefined,
    color: styles.color || undefined,
    backgroundColor: styles.backgroundColor && !styles.gradient ? styles.backgroundColor : undefined,
    background: styles.gradient || undefined,
    textAlign: (styles.textAlign || styles.alignment as any) || undefined,
    lineHeight: styles.lineHeight || undefined,
    letterSpacing: styles.letterSpacing || undefined,
    width: styles.width && styles.width !== 'auto' ? styles.width : undefined,
    minHeight: styles.minHeight && styles.minHeight !== 'auto' ? styles.minHeight : undefined,
    height: styles.height && styles.height !== 'auto' ? styles.height : undefined,
    alignSelf: styles.flexAlignment || undefined,
  };

  const alignmentWrapperClass =
    styles.flexAlignment === 'center'
      ? 'mx-auto'
      : styles.flexAlignment === 'end'
      ? 'ml-auto'
      : styles.flexAlignment === 'start'
      ? 'mr-auto'
      : '';

  const paddingYClass = {
    none: 'py-0',
    sm: 'py-2',
    md: 'py-4',
    lg: 'py-8',
    xl: 'py-12',
  }[styles.paddingY || 'none'];

  const paddingXClass = {
    none: 'px-0',
    sm: 'px-3',
    md: 'px-6',
    lg: 'px-10',
    xl: 'px-16',
  }[styles.paddingX || 'none'];

  const marginYClass = {
    none: 'my-0',
    sm: 'my-2',
    md: 'my-4',
    lg: 'my-8',
    xl: 'my-12',
  }[styles.marginY || 'sm'];

  const radiusClass = {
    none: 'rounded-none',
    sm: 'rounded-lg',
    md: 'rounded-xl',
    lg: 'rounded-2xl',
    xl: 'rounded-3xl',
    '2xl': 'rounded-2xl',
    full: 'rounded-full',
  }[styles.borderRadius || 'none'] || 'rounded-none';

  const shadowClass = {
    none: '',
    sm: 'shadow-xs',
    md: 'shadow-md',
    lg: 'shadow-xl',
    xl: 'shadow-2xl shadow-blue-500/10',
  }[styles.shadow || 'none'] || '';

  switch (block.type) {
    case 'HEADING': {
      const Tag = (content.tag || 'h2') as 'h1' | 'h2' | 'h3' | 'h4';
      return (
        <div style={inlineStyles} className={`${alignmentWrapperClass} ${paddingYClass} ${paddingXClass} ${marginYClass}`}>
          {content.badge && (
            <span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 mb-2 shadow-2xs">
              {content.badge}
            </span>
          )}
          <Tag
            style={{
              fontSize: styles.fontSize || '32px',
              fontWeight: styles.fontWeight || 'bold',
              color: styles.color || undefined,
              fontFamily: styles.fontFamily && styles.fontFamily !== 'inherit' ? styles.fontFamily : undefined,
              textAlign: (styles.textAlign || styles.alignment as any) || undefined,
            }}
            className={`tracking-tight ${!styles.color ? 'text-slate-900 dark:text-slate-100' : ''}`}
          >
            {content.text || ''}
          </Tag>
        </div>
      );
    }

    case 'TEXT':
    case 'PARAGRAPH': {
      return (
        <div style={inlineStyles} className={`${alignmentWrapperClass} ${paddingYClass} ${paddingXClass} ${marginYClass}`}>
          <p
            style={{
              fontSize: styles.fontSize || '16px',
              fontWeight: styles.fontWeight || 'normal',
              color: styles.color || undefined,
              fontFamily: styles.fontFamily && styles.fontFamily !== 'inherit' ? styles.fontFamily : undefined,
              textAlign: (styles.textAlign || styles.alignment as any) || undefined,
            }}
            className={`leading-relaxed ${!styles.color ? 'text-slate-600 dark:text-slate-300' : ''}`}
          >
            {content.text || ''}
          </p>
        </div>
      );
    }

    case 'IMAGE': {
      const aspect = {
        auto: 'aspect-auto',
        '16:9': 'aspect-video',
        '4:3': 'aspect-4/3',
        '1:1': 'aspect-square',
        circle: 'aspect-square rounded-full max-w-[240px] mx-auto',
      }[styles.aspectRatio || '16:9'] || 'aspect-video';

      return (
        <div style={inlineStyles} className={`${alignmentWrapperClass} ${paddingYClass} ${paddingXClass} ${marginYClass} space-y-2`}>
          <div className={`overflow-hidden ${aspect} ${radiusClass} ${shadowClass} bg-slate-100 dark:bg-slate-800`}>
            {content.imageUrl && (
              <img
                src={content.imageUrl}
                alt={content.alt || 'Visual Media'}
                className="w-full h-full object-cover transition duration-300 hover:scale-105"
                loading="lazy"
              />
            )}
          </div>
          {content.caption && (
            <p className="text-xs text-slate-400 text-center italic">{content.caption}</p>
          )}
        </div>
      );
    }

    case 'DOCUMENT_PDF': {
      return (
        <div style={inlineStyles} className={`${alignmentWrapperClass} ${paddingYClass} ${paddingXClass} ${marginYClass}`}>
          <div
            className={`p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 ${shadowClass} flex items-start justify-between gap-4 transition hover:border-blue-300 dark:hover:border-blue-700`}
          >
            <div className="flex items-start gap-3.5 min-w-0">
              <div className="w-11 h-11 rounded-xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex flex-col items-center justify-center font-black text-xs shrink-0 shadow-xs">
                <FileText className="w-5 h-5 mb-0.5" />
                <span className="text-[8px] leading-none uppercase">{content.fileType || 'PDF'}</span>
              </div>
              <div className="min-w-0">
                <h4
                  style={{
                    color: styles.color || undefined,
                    fontFamily: styles.fontFamily && styles.fontFamily !== 'inherit' ? styles.fontFamily : undefined,
                  }}
                  className={`text-sm sm:text-base font-bold leading-snug ${!styles.color ? 'text-slate-900 dark:text-slate-100' : ''}`}
                >
                  {content.title || 'Official Document'}
                </h4>
                {content.description && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {content.description}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-2 text-xs font-medium text-slate-400">
                  {content.fileSize && <span>{content.fileSize}</span>}
                  {content.publishDate && <span>• {content.publishDate}</span>}
                </div>
              </div>
            </div>

            <a
              href={content.fileUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-blue-600/20 shrink-0 transition"
            >
              <span>{content.buttonText || 'View'}</span>
              <Download className="w-4 h-4" />
            </a>
          </div>
        </div>
      );
    }

    case 'BUTTON': {
      const alignClass =
        styles.alignment === 'center'
          ? 'justify-center'
          : styles.alignment === 'right'
          ? 'justify-end'
          : 'justify-start';

      return (
        <div style={inlineStyles} className={`${alignmentWrapperClass} ${paddingYClass} ${paddingXClass} ${marginYClass} flex ${alignClass}`}>
          <a
            href={content.url || '#'}
            target={content.openInNewTab ? '_blank' : undefined}
            rel={content.openInNewTab ? 'noopener noreferrer' : undefined}
            style={{
              backgroundColor: styles.backgroundColor || '#2563eb',
              color: styles.color || '#ffffff',
              fontSize: styles.fontSize || '15px',
              fontWeight: styles.fontWeight || '600',
              fontFamily: styles.fontFamily && styles.fontFamily !== 'inherit' ? styles.fontFamily : undefined,
            }}
            className={`inline-flex items-center gap-2 px-6 py-3 ${radiusClass} ${shadowClass} transition hover:opacity-90 shadow-sm shadow-blue-600/30`}
          >
            <span>{content.label || 'Action Button'}</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      );
    }

    case 'ICON_BOX': {
      return (
        <div style={inlineStyles} className={`${alignmentWrapperClass} ${paddingYClass} ${paddingXClass} ${marginYClass}`}>
          <div className={`p-6 rounded-2xl border border-slate-200 dark:border-slate-800 ${radiusClass} ${shadowClass} transition hover:border-blue-300 dark:hover:border-blue-700`}>
            <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 shadow-xs">
              <Award className="w-6 h-6" />
            </div>
            {content.badge && (
              <span className="inline-block text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1.5">
                {content.badge}
              </span>
            )}
            <h4
              style={{
                color: styles.color || undefined,
                fontFamily: styles.fontFamily && styles.fontFamily !== 'inherit' ? styles.fontFamily : undefined,
              }}
              className={`text-lg font-bold ${!styles.color ? 'text-slate-900 dark:text-slate-100' : ''}`}
            >
              {content.title || 'Feature Title'}
            </h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              {content.description || ''}
            </p>
          </div>
        </div>
      );
    }

    case 'STAT_COUNTER': {
      return (
        <div style={inlineStyles} className={`${paddingYClass} ${paddingXClass} ${marginYClass}`}>
          <div className={`p-6 rounded-2xl text-center ${radiusClass} ${shadowClass}`}>
            <div
              style={{
                color: styles.color || undefined,
                fontFamily: styles.fontFamily && styles.fontFamily !== 'inherit' ? styles.fontFamily : undefined,
              }}
              className="text-4xl sm:text-5xl font-extrabold tracking-tight"
            >
              {content.value || '98'}
              <span className="text-blue-500">{content.suffix || '%'}</span>
            </div>
            <div
              style={{
                fontFamily: styles.fontFamily && styles.fontFamily !== 'inherit' ? styles.fontFamily : undefined,
              }}
              className="text-base font-bold text-slate-900 dark:text-slate-100 mt-2"
            >
              {content.label || ''}
            </div>
            {content.description && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{content.description}</p>
            )}
          </div>
        </div>
      );
    }

    case 'TABLE': {
      const tableData = block.tableData || { rows: 0, cols: 0, data: [] };
      return (
        <div style={inlineStyles} className={`${paddingYClass} ${paddingXClass} ${marginYClass} overflow-x-auto`}>
          <table
            className="w-full"
            style={{
              borderCollapse: styles.borderCollapse || 'collapse',
              fontFamily: styles.fontFamily && styles.fontFamily !== 'inherit' ? styles.fontFamily : undefined,
              fontSize: styles.fontSize || '14px',
              color: styles.color || undefined,
            }}
          >
            <tbody>
              {tableData.data?.map((row, rIdx) => (
                <tr key={rIdx}>
                  {row.map((cellText, cIdx) => (
                    <td
                      key={cIdx}
                      style={{
                        padding: styles.cellPadding || '8px',
                        borderWidth: styles.cellBorderWidth || '1px',
                        borderStyle: (styles.cellBorderStyle as any) || 'solid',
                        borderColor: styles.cellBorderColor || '#cbd5e1',
                        textAlign: (styles.textAlign || styles.alignment as any) || 'left',
                      }}
                      className="text-slate-800 dark:text-slate-200"
                    >
                      {cellText}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    case 'DIVIDER': {
      return (
        <div className={`${paddingYClass} ${marginYClass}`}>
          <hr
            className="border-t"
            style={{ borderColor: styles.borderColor || '#e2e8f0' }}
          />
        </div>
      );
    }

    case 'VIDEO_POPUP': {
      const coverImg = content.coverImageUrl || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80';
      return (
        <div style={inlineStyles} className={`${alignmentWrapperClass} ${paddingYClass} ${paddingXClass} ${marginYClass}`}>
          <div className={`relative overflow-hidden group ${radiusClass} ${shadowClass} border border-slate-200 dark:border-slate-800 bg-slate-900`}>
            <div className="relative aspect-video w-full overflow-hidden">
              <img
                src={coverImg}
                alt={content.title || 'Video Cover'}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent flex flex-col justify-between p-6">
                <div className="flex items-center justify-between">
                  {content.badge && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-600/90 text-white backdrop-blur-md shadow-sm">
                      <Sparkles className="w-3 h-3" />
                      <span>{content.badge}</span>
                    </span>
                  )}
                  {content.duration && (
                    <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-black/60 text-white backdrop-blur-md border border-white/10">
                      {content.duration}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <a
                    href={content.videoUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/40 hover:scale-110 hover:bg-blue-500 transition cursor-pointer shrink-0"
                  >
                    <Play className="w-6 h-6 ml-0.5 fill-current" />
                  </a>
                  <div className="min-w-0">
                    <h4 className="text-lg sm:text-xl font-bold text-white drop-shadow-sm">
                      {content.title || 'Campus Virtual Tour & Story'}
                    </h4>
                    <p className="text-xs text-slate-300 mt-0.5 truncate">
                      Watch in high definition
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    case 'COUNTDOWN_TIMER': {
      const targetDate = content.targetDate ? new Date(content.targetDate) : new Date(Date.now() + 30 * 86400000);
      const now = new Date();
      const diff = Math.max(0, targetDate.getTime() - now.getTime());
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      return (
        <div style={inlineStyles} className={`${alignmentWrapperClass} ${paddingYClass} ${paddingXClass} ${marginYClass}`}>
          <div
            style={{
              backgroundColor: styles.backgroundColor || '#0f172a',
              color: styles.color || '#ffffff',
            }}
            className={`p-6 sm:p-8 ${radiusClass} ${shadowClass} text-center space-y-6`}
          >
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/20 text-blue-400 border border-blue-500/30">
                <Clock className="w-3.5 h-3.5" />
                <span>Countdown</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {content.eventTitle || 'Admissions Round 2026-27'}
              </h3>
              {content.eventSubtitle && (
                <p className="text-sm text-slate-400 max-w-xl mx-auto">
                  {content.eventSubtitle}
                </p>
              )}
            </div>

            <div className="grid grid-cols-4 gap-3 sm:gap-4 max-w-lg mx-auto">
              {[
                { val: String(days).padStart(2, '0'), label: content.daysLabel || 'Days' },
                { val: String(hours).padStart(2, '0'), label: content.hoursLabel || 'Hours' },
                { val: String(minutes).padStart(2, '0'), label: content.minutesLabel || 'Mins' },
                { val: String(seconds).padStart(2, '0'), label: content.secondsLabel || 'Secs' },
              ].map((unit, idx) => (
                <div
                  key={idx}
                  className="p-3 sm:p-4 rounded-2xl bg-white/10 dark:bg-slate-800/80 backdrop-blur-md border border-white/10 flex flex-col items-center justify-center shadow-inner"
                >
                  <span className="text-2xl sm:text-4xl font-extrabold font-mono tracking-tight text-white">
                    {unit.val}
                  </span>
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 mt-1">
                    {unit.label}
                  </span>
                </div>
              ))}
            </div>

            {content.ctaButtonText && (
              <div className="pt-2">
                <a
                  href={content.ctaButtonUrl || '#'}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition"
                >
                  <span>{content.ctaButtonText}</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            )}
          </div>
        </div>
      );
    }

    case 'ACCORDION': {
      const items = Array.isArray(content.items) ? content.items : [];
      return (
        <div style={inlineStyles} className={`${alignmentWrapperClass} ${paddingYClass} ${paddingXClass} ${marginYClass} space-y-3`}>
          {items.map((item: any, idx: number) => {
            const isDefaultOpen = (content.defaultExpandedIndex ?? 0) === idx;
            return (
              <details
                key={item.id || idx}
                open={isDefaultOpen}
                className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-2xs transition"
              >
                <summary className="p-4 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/60 dark:hover:bg-slate-800/40 select-none list-none [&::-webkit-details-marker]:hidden">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                      <HelpCircle className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      {item.badge && (
                        <span className="inline-block text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-0.5">
                          {item.badge}
                        </span>
                      )}
                      <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
                        {item.title || `Item ${idx + 1}`}
                      </h4>
                    </div>
                  </div>
                  <div className="text-slate-400 group-open:rotate-180 transition-transform duration-200 p-1">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </summary>

                <div className="px-5 pb-5 pt-1 text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30">
                  <p>{item.content || ''}</p>
                </div>
              </details>
            );
          })}
        </div>
      );
    }

    case 'TABS_SWITCHER': {
      return (
        <PublicTabsBlock
          block={block}
          inlineStyles={inlineStyles}
          alignmentWrapperClass={alignmentWrapperClass}
          paddingYClass={paddingYClass}
          paddingXClass={paddingXClass}
          marginYClass={marginYClass}
          radiusClass={radiusClass}
          shadowClass={shadowClass}
        />
      );
    }

    case 'TIMELINE_ROADMAP': {
      const items = Array.isArray(content.items) ? content.items : [];
      return (
        <div style={inlineStyles} className={`${alignmentWrapperClass} ${paddingYClass} ${paddingXClass} ${marginYClass} space-y-6`}>
          <div className="relative border-l-2 border-blue-500/40 ml-4 sm:ml-6 space-y-6">
            {items.map((it: any, idx: number) => (
              <div key={it.id || idx} className="relative pl-6 sm:pl-8 group">
                <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-blue-600 border-4 border-white dark:border-slate-900 shadow-md shadow-blue-500/40" />
                <div className={`p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 ${shadowClass} space-y-2`}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black font-mono bg-blue-600 text-white shadow-xs">
                      {it.year || 'Year'}
                    </span>
                    {it.badge && (
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded">
                        {it.badge}
                      </span>
                    )}
                  </div>
                  <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                    {it.title || ''}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {it.description || ''}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    case 'FACULTY_GRID': {
      const members = Array.isArray(content.members) ? content.members : [];
      return (
        <div style={inlineStyles} className={`${alignmentWrapperClass} ${paddingYClass} ${paddingXClass} ${marginYClass}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map((m: any, idx: number) => (
              <div
                key={m.id || idx}
                className={`p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 ${radiusClass} ${shadowClass} text-center space-y-4 flex flex-col justify-between`}
              >
                <div className="space-y-3">
                  <div className="relative w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-blue-500 shadow-md">
                    <img
                      src={m.imageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                      alt={m.name || 'Faculty'}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <h4 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                      {m.name || ''}
                    </h4>
                    <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-0.5">
                      {m.designation || ''}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-left space-y-1.5">
                    {m.qualification && (
                      <div className="text-[11px] text-slate-600 dark:text-slate-300">
                        <span className="font-bold text-slate-700 dark:text-slate-200">Degree: </span>
                        <span>{m.qualification}</span>
                      </div>
                    )}
                    {m.specialization && (
                      <div className="text-[11px] text-slate-600 dark:text-slate-300">
                        <span className="font-bold text-slate-700 dark:text-slate-200">Domain: </span>
                        <span>{m.specialization}</span>
                      </div>
                    )}
                  </div>
                </div>
                {m.email && (
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-1 text-xs font-semibold text-slate-500">
                    <Mail className="w-3.5 h-3.5" />
                    <span>{m.email}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    case 'NOTICES_LIST': {
      const notices = Array.isArray(content.notices) ? content.notices : [];
      return (
        <div style={inlineStyles} className={`${alignmentWrapperClass} ${paddingYClass} ${paddingXClass} ${marginYClass} space-y-3`}>
          {notices.map((n: any, idx: number) => (
            <div
              key={n.id || idx}
              className={`p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 ${shadowClass} flex flex-col sm:flex-row sm:items-center justify-between gap-4`}
            >
              <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                <div className="px-3 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900 text-blue-700 dark:text-blue-300 flex flex-col items-center justify-center text-center shrink-0">
                  <span className="text-[11px] font-black font-mono uppercase tracking-wider">
                    {n.date || 'NOTICE'}
                  </span>
                </div>
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {n.category || 'GENERAL'}
                    </span>
                    {n.isNew && (
                      <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-red-500 text-white">
                        NEW
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 leading-snug">
                    {n.title || ''}
                  </h4>
                </div>
              </div>
              <a
                href={n.fileUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm shadow-blue-600/20 shrink-0 transition"
              >
                <span>View Notice</span>
                <Download className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>
      );
    }

    case 'LOGO_MATRIX': {
      const partners = Array.isArray(content.partners) ? content.partners : [];
      return (
        <div style={inlineStyles} className={`${alignmentWrapperClass} ${paddingYClass} ${paddingXClass} ${marginYClass}`}>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {partners.map((p: any, idx: number) => (
              <div
                key={p.id || idx}
                className={`p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 ${shadowClass} flex flex-col items-center justify-center text-center space-y-1.5 hover:border-blue-400 hover:shadow-md transition group`}
              >
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black text-base shadow-2xs group-hover:scale-110 transition-transform">
                  {p.name?.charAt(0) || 'P'}
                </div>
                <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {p.name || ''}
                </h5>
                {p.category && (
                  <span className="text-[9px] font-medium text-slate-400 uppercase tracking-wider">
                    {p.category}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    case 'COURSE_CARDS': {
      const courses = Array.isArray(content.courses) ? content.courses : [];
      return (
        <div style={inlineStyles} className={`${alignmentWrapperClass} ${paddingYClass} ${paddingXClass} ${marginYClass}`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {courses.map((c: any, idx: number) => (
              <div
                key={c.id || idx}
                className={`p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 ${radiusClass} ${shadowClass} flex flex-col justify-between space-y-4 hover:border-blue-300 dark:hover:border-blue-700 transition`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                      {c.degree || 'Degree'}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-500">
                      {c.duration || '4 Years'}
                    </span>
                  </div>
                  <h4 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-slate-100 leading-snug">
                    {c.title || ''}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {c.description || ''}
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-slate-400">
                    {c.intake || '120 Seats'}
                  </span>
                  <a
                    href={c.ctaUrl || '#'}
                    className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 transition"
                  >
                    <span>{c.ctaText || 'Learn More'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    case 'MAP_EMBED': {
      return (
        <div style={inlineStyles} className={`${alignmentWrapperClass} ${paddingYClass} ${paddingXClass} ${marginYClass}`}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <div className="lg:col-span-7 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 min-h-[280px] relative flex flex-col items-center justify-center text-center p-6 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/30 mb-3">
                <MapPin className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {content.campusName || 'Main Institutional Campus'}
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                Interactive Google Map Navigation & Transit Route Viewport
              </p>
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-blue-600 shadow-2xs">
                <Compass className="w-4 h-4" />
                <span>GPS: 13.0827° N, 80.2707° E</span>
              </div>
            </div>

            <div className={`lg:col-span-5 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 ${shadowClass} flex flex-col justify-between space-y-4`}>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Campus Location</h5>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                      {content.address || 'Knowledge Corridor, Innovation Highway, Campus City - 600001'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Helpdesk & Phone</h5>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                      {content.phone || '+91 44 2876 5432 / admissions@college.edu'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Visitor Hours</h5>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                      {content.officeHours || 'Monday – Saturday: 8:30 AM – 5:30 PM'}
                    </p>
                  </div>
                </div>
              </div>

              <a
                href={content.mapEmbedUrl || 'https://maps.google.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-600/30 transition"
              >
                <span>{content.ctaText || 'Get Driving Directions'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      );
    }

    case 'CONTAINER_1_COL':
    case 'CONTAINER_2_COL':
    case 'CONTAINER_3_COL': {
      const cols = block.columns || [];
      const gridClass =
        block.type === 'CONTAINER_2_COL'
          ? 'grid grid-cols-1 md:grid-cols-2 gap-6'
          : block.type === 'CONTAINER_3_COL'
          ? 'grid grid-cols-1 md:grid-cols-3 gap-6'
          : 'w-full';

      return (
        <div style={inlineStyles} className={`${paddingYClass} ${paddingXClass} ${marginYClass} ${gridClass}`}>
          {cols.map((col) => (
            <div key={col.id} className="space-y-4">
              {col.blocks.map((child) => (
                <PublicBlockItem key={child.id} block={child} />
              ))}
            </div>
          ))}
        </div>
      );
    }

    default:
      return null;
  }
};

export const CustomCanvasSection: React.FC<CustomCanvasSectionProps> = ({
  content,
  settings,
}) => {
  const blocks: CanvasBlock[] = Array.isArray(content?.blocks) ? content.blocks : [];

  if (blocks.length === 0) {
    return null;
  }

  const widthKey = (content?.containerWidth || settings?.containerWidth || 'standard') as 'narrow' | 'standard' | 'wide' | 'full';
  const maxWidthClass = {
    narrow: 'max-w-3xl',
    standard: 'max-w-6xl',
    wide: 'max-w-7xl',
    full: 'max-w-full',
  }[widthKey] || 'max-w-6xl';

  const sectionBgStyle: React.CSSProperties = {
    backgroundColor: content?.backgroundColor || undefined,
    background: content?.gradient || undefined,
  };

  const bgThemeClass =
    settings?.background === 'dark' && !content?.backgroundColor && !content?.gradient
      ? 'bg-slate-900 text-slate-100'
      : settings?.background === 'muted' && !content?.backgroundColor && !content?.gradient
      ? 'bg-slate-50 dark:bg-slate-900/50'
      : '';

  return (
    <section style={sectionBgStyle} className={`w-full py-8 md:py-14 ${bgThemeClass}`}>
      <div className={`mx-auto px-4 sm:px-6 lg:px-8 ${maxWidthClass} space-y-6`}>
        {blocks.map((block) => (
          <PublicBlockItem key={block.id} block={block} />
        ))}
      </div>
    </section>
  );
};
