import React from 'react';
import {
  GripVertical,
  Settings,
  Copy,
  Trash2,
  ArrowUp,
  ArrowDown,
  FileText,
  Download,
  ExternalLink,
  Award,
  Plus,
  Move,
  Layers,
  BringToFront,
  SendToBack,
  Play,
  PlayCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Sparkles,
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
  BookOpen,
  Briefcase,
  Compass,
} from 'lucide-react';
import { CanvasBlock, CanvasBlockStyle } from '../../../types/canvasBuilder';

interface CanvasBlockRendererProps {
  block: CanvasBlock;
  isSelected: boolean;
  selectedBlockId?: string | null;
  previewMode: boolean;
  onSelect: (id: string) => void;
  onUpdateContent: (id: string, content: Record<string, any>) => void;
  onUpdateStyles?: (id: string, styles: Partial<CanvasBlockStyle>) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  onAddBlockToColumn?: (block: CanvasBlock, columnId: string) => void;
  onMoveBlockToTarget?: (
    draggedId: string,
    targetId: string | null,
    position: 'before' | 'after' | 'inside-column',
    targetColumnId?: string
  ) => void;
}

export const CanvasBlockRenderer: React.FC<CanvasBlockRendererProps> = ({
  block,
  isSelected,
  selectedBlockId,
  previewMode,
  onSelect,
  onUpdateContent,
  onUpdateStyles,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  onAddBlockToColumn,
  onMoveBlockToTarget,
}) => {
  const styles = block.styles || {};
  const content = block.content || {};
  const isFloating = styles.positionMode === 'floating';

  // Build inline CSS styles from block style configuration
  const inlineStyles: React.CSSProperties = {
    fontFamily: styles.fontFamily && styles.fontFamily !== 'inherit' ? styles.fontFamily : undefined,
    fontSize: styles.fontSize || undefined,
    fontWeight: styles.fontWeight as any || undefined,
    fontStyle: styles.fontStyle || undefined,
    textDecoration: styles.textDecoration || undefined,
    color: styles.color || undefined,
    backgroundColor: styles.backgroundColor && !styles.gradient ? styles.backgroundColor : undefined,
    background: styles.gradient || undefined,
    textAlign: (styles.textAlign || styles.alignment as any) || undefined,
    textTransform: (styles.textTransform as any) || undefined,
    letterSpacing: styles.letterSpacing || undefined,
    lineHeight: styles.lineHeight || undefined,
    whiteSpace: (styles.whiteSpace as any) || undefined,
    opacity: styles.opacity !== undefined ? Number(styles.opacity) : undefined,
    width: styles.width && styles.width !== 'auto' ? styles.width : (isFloating ? '320px' : undefined),
    minHeight: styles.minHeight && styles.minHeight !== 'auto' ? styles.minHeight : undefined,
    height: styles.height && styles.height !== 'auto' ? styles.height : undefined,
    alignSelf: !isFloating ? styles.flexAlignment || undefined : undefined,
    position: isFloating ? 'absolute' : 'relative',
    left: isFloating ? (styles.posX !== undefined ? `${styles.posX}px` : '40px') : undefined,
    top: isFloating ? (styles.posY !== undefined ? `${styles.posY}px` : '40px') : undefined,
    zIndex: styles.zIndex ?? (isFloating ? 10 : undefined),
    transform: styles.rotation ? `rotate(${styles.rotation}deg)` : undefined,
    // Directional Borders
    border: styles.border || undefined,
    borderTop: styles.borderTop || undefined,
    borderRight: styles.borderRight || undefined,
    borderBottom: styles.borderBottom || undefined,
    borderLeft: styles.borderLeft || undefined,
    borderWidth:
      !styles.border &&
      !styles.borderTop &&
      !styles.borderBottom &&
      !styles.borderLeft &&
      !styles.borderRight &&
      styles.borderWidth &&
      styles.borderWidth !== '0px' &&
      styles.borderWidth !== 'none'
        ? styles.borderWidth
        : undefined,
    borderStyle: styles.borderStyle as any || undefined,
    borderColor: styles.borderColor || undefined,
    borderRadius: styles.borderRadius && styles.borderRadius !== 'none' ? styles.borderRadius : undefined,
  };

  // Helper classes for padding, margin, radius, shadow
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
  }[styles.borderRadius || 'none'] || '';

  const shadowClass = {
    none: '',
    sm: 'shadow-xs',
    md: 'shadow-md',
    lg: 'shadow-xl',
    xl: 'shadow-2xl shadow-blue-500/10',
  }[styles.shadow || 'none'] || '';

  const handleBlockClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!previewMode) {
      onSelect(block.id);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER ELEMENT CONTENTS BY BLOCK TYPE (WITH DIRECT INLINE EDITING)
  // ─────────────────────────────────────────────────────────────────────────────

  const renderContent = () => {
    switch (block.type) {
      // 0. TEXT BLOCK (Primary Text Tool)
      case 'TEXT': {
        return (
          <div
            contentEditable={!previewMode}
            suppressContentEditableWarning
            onBlur={(e) => {
              const newText = e.currentTarget.textContent || '';
              onUpdateContent(block.id, { ...content, text: newText });
            }}
            style={{
              fontSize: styles.fontSize || '16px',
              fontFamily: styles.fontFamily && styles.fontFamily !== 'inherit' ? styles.fontFamily : 'Calibri',
              fontWeight: styles.fontWeight as any || 'normal',
              fontStyle: styles.fontStyle || 'normal',
              textDecoration: styles.textDecoration || 'none',
              textAlign: (styles.textAlign || styles.alignment as any) || 'left',
              textTransform: (styles.textTransform as any) || 'none',
              letterSpacing: styles.letterSpacing || 'normal',
              lineHeight: styles.lineHeight || 'normal',
              whiteSpace: (styles.whiteSpace as any) || 'normal',
              color: styles.color || '#000000',
            }}
            className="outline-none focus:ring-2 focus:ring-blue-500/50 rounded-md p-1 transition cursor-text min-h-[1.5em]"
          >
            {content.text || 'Double click to edit'}
          </div>
        );
      }
      // 1. HEADING
      case 'HEADING': {
        const Tag = (content.tag || 'h2') as 'h1' | 'h2' | 'h3' | 'h4';
        return (
          <div className="space-y-1">
            {content.badge !== undefined && content.badge !== '' && (
              <span
                contentEditable={!previewMode}
                suppressContentEditableWarning
                onBlur={(e) => {
                  const newBadge = e.currentTarget.textContent || '';
                  onUpdateContent(block.id, { ...content, badge: newBadge });
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    (e.target as HTMLElement).blur();
                  }
                }}
                className="inline-block px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 mb-2 shadow-2xs outline-none focus:ring-2 focus:ring-blue-500/50 cursor-text"
              >
                {content.badge}
              </span>
            )}
            <Tag
              contentEditable={!previewMode}
              suppressContentEditableWarning
              onBlur={(e) => {
                const newText = e.currentTarget.textContent || '';
                onUpdateContent(block.id, { ...content, text: newText });
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  (e.target as HTMLElement).blur();
                }
              }}
              style={{
                fontSize: styles.fontSize || '32px',
                fontWeight: styles.fontWeight || 'bold',
                color: styles.color || undefined,
                fontFamily: styles.fontFamily && styles.fontFamily !== 'inherit' ? styles.fontFamily : undefined,
                textAlign: (styles.alignment as any) || undefined,
              }}
              className="tracking-tight outline-none focus:ring-2 focus:ring-blue-500/50 rounded-md px-1 transition cursor-text"
            >
              {content.text || 'Headline Title'}
            </Tag>
          </div>
        );
      }

      // 2. PARAGRAPH
      case 'PARAGRAPH': {
        return (
          <p
            contentEditable={!previewMode}
            suppressContentEditableWarning
            onBlur={(e) => {
              const newText = e.currentTarget.textContent || '';
              onUpdateContent(block.id, { ...content, text: newText });
            }}
            style={{
              fontSize: styles.fontSize || '16px',
              fontWeight: styles.fontWeight || 'normal',
              color: styles.color || undefined,
              fontFamily: styles.fontFamily && styles.fontFamily !== 'inherit' ? styles.fontFamily : undefined,
              textAlign: (styles.alignment as any) || undefined,
            }}
            className="leading-relaxed outline-none focus:ring-2 focus:ring-blue-500/50 rounded-md px-1 transition cursor-text"
          >
            {content.text || 'Enter your descriptive paragraph narrative here...'}
          </p>
        );
      }

      // 3. IMAGE (Primary Image Tool with base64, opacity, corner radius)
      case 'IMAGE': {
        const aspect = styles.height && styles.height !== 'auto'
          ? ''
          : {
              auto: 'aspect-auto',
              '16:9': 'aspect-video',
              '4:3': 'aspect-4/3',
              '1:1': 'aspect-square',
              circle: 'aspect-square rounded-full max-w-[240px] mx-auto',
            }[styles.aspectRatio || 'auto'] || '';

        const borderRadius =
          styles.borderRadius === '50%'
            ? '50%'
            : styles.borderRadius && styles.borderRadius !== 'none'
            ? styles.borderRadius
            : undefined;

        return (
          <div className="space-y-1 w-full flex flex-col items-center justify-center">
            <div
              style={{
                borderRadius,
                opacity: styles.opacity !== undefined ? Number(styles.opacity) : 1,
                width: styles.width || '100%',
                height: styles.height && styles.height !== 'auto' ? styles.height : undefined,
                maxHeight: '500px',
              }}
              className={`overflow-hidden ${aspect} ${!borderRadius ? radiusClass : ''} ${shadowClass} bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center`}
            >
              {content.imageUrl ? (
                <img
                  src={content.imageUrl}
                  alt={content.alt || 'Media'}
                  className="w-full h-full object-cover select-none pointer-events-none"
                />
              ) : (
                <div className="w-full h-32 flex items-center justify-center text-slate-400 text-xs">
                  No image selected
                </div>
              )}
            </div>
            {content.caption && (
              <p
                contentEditable={!previewMode}
                suppressContentEditableWarning
                onBlur={(e) => {
                  const newCap = e.currentTarget.textContent || '';
                  onUpdateContent(block.id, { ...content, caption: newCap });
                }}
                className="text-xs text-slate-400 text-center italic outline-none focus:ring-1 focus:ring-blue-500/40 rounded px-1 cursor-text"
              >
                {content.caption}
              </p>
            )}
          </div>
        );
      }

      // 4. DOCUMENT / PDF DOWNLOAD CARD
      case 'DOCUMENT_PDF': {
        return (
          <div
            className={`p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 ${shadowClass} flex items-start justify-between gap-4 transition hover:border-blue-300 dark:hover:border-blue-700`}
          >
            <div className="flex items-start gap-3.5 min-w-0 flex-1">
              <div className="w-11 h-11 rounded-xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex flex-col items-center justify-center font-black text-xs shrink-0 shadow-xs">
                <FileText className="w-5 h-5 mb-0.5" />
                <span className="text-[8px] leading-none uppercase">{content.fileType || 'PDF'}</span>
              </div>
              <div className="min-w-0 flex-1">
                <h4
                  contentEditable={!previewMode}
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    const newTitle = e.currentTarget.textContent || '';
                    onUpdateContent(block.id, { ...content, title: newTitle });
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      (e.target as HTMLElement).blur();
                    }
                  }}
                  style={{
                    color: styles.color || undefined,
                    fontFamily: styles.fontFamily && styles.fontFamily !== 'inherit' ? styles.fontFamily : undefined,
                  }}
                  className="text-sm sm:text-base font-bold leading-snug outline-none focus:ring-2 focus:ring-blue-500/50 rounded px-1 cursor-text"
                >
                  {content.title || 'Official Document Title.pdf'}
                </h4>
                <p
                  contentEditable={!previewMode}
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    const newDesc = e.currentTarget.textContent || '';
                    onUpdateContent(block.id, { ...content, description: newDesc });
                  }}
                  className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 outline-none focus:ring-2 focus:ring-blue-500/50 rounded px-1 cursor-text leading-relaxed"
                >
                  {content.description || 'Download document description.'}
                </p>
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
              onClick={(e) => !previewMode && e.preventDefault()}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-blue-600/20 shrink-0 transition"
            >
              <span
                contentEditable={!previewMode}
                suppressContentEditableWarning
                onBlur={(e) => {
                  const newBtn = e.currentTarget.textContent || '';
                  onUpdateContent(block.id, { ...content, buttonText: newBtn });
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    (e.target as HTMLElement).blur();
                  }
                }}
                className="outline-none focus:ring-1 focus:ring-white rounded px-0.5 cursor-text"
              >
                {content.buttonText || 'View'}
              </span>
              <Download className="w-4 h-4" />
            </a>
          </div>
        );
      }

      // 5. BUTTON
      case 'BUTTON': {
        return (
          <div className={`flex ${styles.alignment === 'center' ? 'justify-center' : styles.alignment === 'right' ? 'justify-end' : 'justify-start'}`}>
            <a
              href={content.url || '#'}
              target={content.openInNewTab ? '_blank' : undefined}
              rel={content.openInNewTab ? 'noopener noreferrer' : undefined}
              onClick={(e) => !previewMode && e.preventDefault()}
              style={{
                backgroundColor: styles.backgroundColor || '#2563eb',
                color: styles.color || '#ffffff',
                fontSize: styles.fontSize || '15px',
                fontWeight: styles.fontWeight || '600',
                fontFamily: styles.fontFamily && styles.fontFamily !== 'inherit' ? styles.fontFamily : undefined,
              }}
              className={`inline-flex items-center gap-2 px-6 py-3 ${radiusClass} ${shadowClass} transition hover:opacity-90 shadow-sm shadow-blue-600/30 cursor-pointer`}
            >
              <span
                contentEditable={!previewMode}
                suppressContentEditableWarning
                onBlur={(e) => {
                  const newLabel = e.currentTarget.textContent || '';
                  onUpdateContent(block.id, { ...content, label: newLabel });
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    (e.target as HTMLElement).blur();
                  }
                }}
                className="outline-none focus:ring-1 focus:ring-white rounded px-1 cursor-text"
              >
                {content.label || 'Action Button'}
              </span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        );
      }

      // 6. ICON FEATURE BOX
      case 'ICON_BOX': {
        return (
          <div className={`p-6 rounded-2xl border border-slate-200 dark:border-slate-800 ${radiusClass} ${shadowClass} transition hover:border-blue-300 dark:hover:border-blue-700`}>
            <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 shadow-xs">
              <Award className="w-6 h-6" />
            </div>
            {content.badge && (
              <span
                contentEditable={!previewMode}
                suppressContentEditableWarning
                onBlur={(e) => {
                  const newBadge = e.currentTarget.textContent || '';
                  onUpdateContent(block.id, { ...content, badge: newBadge });
                }}
                className="inline-block text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1.5 outline-none focus:ring-1 focus:ring-blue-500/50 rounded px-1 cursor-text"
              >
                {content.badge}
              </span>
            )}
            <h4
              contentEditable={!previewMode}
              suppressContentEditableWarning
              onBlur={(e) => {
                const newTitle = e.currentTarget.textContent || '';
                onUpdateContent(block.id, { ...content, title: newTitle });
              }}
              style={{
                color: styles.color || undefined,
                fontFamily: styles.fontFamily && styles.fontFamily !== 'inherit' ? styles.fontFamily : undefined,
              }}
              className="text-lg font-bold outline-none focus:ring-2 focus:ring-blue-500/50 rounded px-1 cursor-text"
            >
              {content.title || 'Feature Title'}
            </h4>
            <p
              contentEditable={!previewMode}
              suppressContentEditableWarning
              onBlur={(e) => {
                const newDesc = e.currentTarget.textContent || '';
                onUpdateContent(block.id, { ...content, description: newDesc });
              }}
              className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed outline-none focus:ring-2 focus:ring-blue-500/50 rounded px-1 cursor-text"
            >
              {content.description || 'Feature highlights and institutional differentiators.'}
            </p>
          </div>
        );
      }

      // 7. STAT COUNTER
      case 'STAT_COUNTER': {
        return (
          <div className={`p-6 rounded-2xl text-center ${radiusClass} ${shadowClass}`}>
            <div
              style={{
                color: styles.color || undefined,
                fontFamily: styles.fontFamily && styles.fontFamily !== 'inherit' ? styles.fontFamily : undefined,
              }}
              className="text-4xl sm:text-5xl font-extrabold tracking-tight flex items-center justify-center gap-0.5"
            >
              <span
                contentEditable={!previewMode}
                suppressContentEditableWarning
                onBlur={(e) => {
                  const newVal = e.currentTarget.textContent || '';
                  onUpdateContent(block.id, { ...content, value: newVal });
                }}
                className="outline-none focus:ring-2 focus:ring-blue-500/50 rounded px-1 cursor-text"
              >
                {content.value || '98'}
              </span>
              <span
                contentEditable={!previewMode}
                suppressContentEditableWarning
                onBlur={(e) => {
                  const newSuffix = e.currentTarget.textContent || '';
                  onUpdateContent(block.id, { ...content, suffix: newSuffix });
                }}
                className="text-blue-500 outline-none focus:ring-2 focus:ring-blue-500/50 rounded px-0.5 cursor-text"
              >
                {content.suffix || '%'}
              </span>
            </div>
            <div
              contentEditable={!previewMode}
              suppressContentEditableWarning
              onBlur={(e) => {
                const newLabel = e.currentTarget.textContent || '';
                onUpdateContent(block.id, { ...content, label: newLabel });
              }}
              style={{
                fontFamily: styles.fontFamily && styles.fontFamily !== 'inherit' ? styles.fontFamily : undefined,
              }}
              className="text-base font-bold text-slate-800 dark:text-slate-200 mt-2 outline-none focus:ring-2 focus:ring-blue-500/50 rounded px-1 cursor-text"
            >
              {content.label || 'Metric Label'}
            </div>
            {content.description && (
              <p
                contentEditable={!previewMode}
                suppressContentEditableWarning
                onBlur={(e) => {
                  const newDesc = e.currentTarget.textContent || '';
                  onUpdateContent(block.id, { ...content, description: newDesc });
                }}
                className="text-xs text-slate-400 mt-1 outline-none focus:ring-1 focus:ring-blue-500/40 rounded px-1 cursor-text"
              >
                {content.description}
              </p>
            )}
          </div>
        );
      }

      // 8. DIVIDER (Line Separator with full styles, thickness, shadows, and arrow/circle ends)
      case 'DIVIDER': {
        const thickness = styles.lineThickness || styles.height || '2px';
        const lineStyle = styles.lineStyle || styles.borderStyle || 'solid';
        const color = styles.backgroundColor || styles.borderColor || '#000000';
        const lineEnds = styles.lineEnds || styles.borderRadius || '0px';
        const endDec = styles.lineEndStyle || 'none';

        const shadowFilter =
          styles.lineShadow === 'light'
            ? 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))'
            : styles.lineShadow === 'medium'
            ? 'drop-shadow(3px 3px 6px rgba(0,0,0,0.5))'
            : styles.lineShadow === 'heavy'
            ? 'drop-shadow(4px 4px 8px rgba(0,0,0,0.7))'
            : undefined;

        const hasLeftCircle = endDec === 'circle-both' || endDec === 'circle-left';
        const hasRightCircle = endDec === 'circle-both' || endDec === 'circle-right';
        const hasLeftArrow = endDec === 'arrow-both' || endDec === 'arrow-left';
        const hasRightArrow = endDec === 'arrow-both' || endDec === 'arrow-right';

        return (
          <div
            className="flex items-center justify-center w-full py-2 select-none"
            style={{ filter: shadowFilter }}
          >
            <div
              className="flex items-center w-full"
              style={{ width: styles.width || '100%' }}
            >
              {/* Left End Decoration */}
              {hasLeftArrow && (
                <span
                  style={{
                    borderRight: `8px solid ${color}`,
                    borderTop: '5px solid transparent',
                    borderBottom: '5px solid transparent',
                  }}
                  className="w-0 h-0 inline-block shrink-0 -mr-1"
                />
              )}
              {hasLeftCircle && (
                <span
                  style={{
                    width: '10px',
                    height: '10px',
                    backgroundColor: color,
                    borderRadius: '50%',
                  }}
                  className="inline-block shrink-0 -mr-1 shadow-xs"
                />
              )}

              {/* Main Line */}
              <div
                className="flex-1 transition-all"
                style={{
                  height: lineStyle === 'solid' ? thickness : '0px',
                  backgroundColor: lineStyle === 'solid' ? color : 'transparent',
                  borderTop: lineStyle !== 'solid' ? `${thickness} ${lineStyle} ${color}` : undefined,
                  borderRadius: lineEnds,
                }}
              />

              {/* Right End Decoration */}
              {hasRightCircle && (
                <span
                  style={{
                    width: '10px',
                    height: '10px',
                    backgroundColor: color,
                    borderRadius: '50%',
                  }}
                  className="inline-block shrink-0 -ml-1 shadow-xs"
                />
              )}
              {hasRightArrow && (
                <span
                  style={{
                    borderLeft: `8px solid ${color}`,
                    borderTop: '5px solid transparent',
                    borderBottom: '5px solid transparent',
                  }}
                  className="w-0 h-0 inline-block shrink-0 -ml-1"
                />
              )}
            </div>
          </div>
        );
      }

      // 8B. TABLE (Interactive Grid Matrix with cell padding, borders & inline cell edit)
      case 'TABLE': {
        const tableData = block.tableData || {
          rows: 3,
          cols: 3,
          data: [
            ['Cell', 'Cell', 'Cell'],
            ['Cell', 'Cell', 'Cell'],
            ['Cell', 'Cell', 'Cell'],
          ],
        };

        const cellPadding = styles.cellPadding || '8px';
        const cellBorderWidth = styles.cellBorderWidth || '1px';
        const cellBorderStyle = styles.cellBorderStyle || 'solid';
        const cellBorderColor = styles.cellBorderColor || '#cbd5e1';

        const updateCellContent = (rIdx: number, cIdx: number, val: string) => {
          const currentData = tableData.data ? [...tableData.data] : [];
          if (!currentData[rIdx]) currentData[rIdx] = [];
          currentData[rIdx][cIdx] = val;
          block.tableData = {
            ...tableData,
            data: currentData,
          };
          onUpdateContent(block.id, {
            ...content,
          });
        };

        return (
          <div className="w-full overflow-x-auto my-2 select-none">
            <table
              className="w-full transition-all"
              style={{
                borderCollapse: styles.borderCollapse || 'collapse',
                fontFamily: styles.fontFamily && styles.fontFamily !== 'inherit' ? styles.fontFamily : 'Calibri',
                fontSize: styles.fontSize || '14px',
                color: styles.color || '#000000',
              }}
            >
              <tbody>
                {tableData.data?.map((row, rIdx) => (
                  <tr key={rIdx}>
                    {row.map((cellText, cIdx) => (
                      <td
                        key={cIdx}
                        contentEditable={!previewMode}
                        suppressContentEditableWarning
                        onBlur={(e) => {
                          const newText = e.currentTarget.textContent || '';
                          updateCellContent(rIdx, cIdx, newText);
                        }}
                        style={{
                          padding: cellPadding,
                          borderWidth: cellBorderWidth,
                          borderStyle: cellBorderStyle as any,
                          borderColor: cellBorderColor,
                          textAlign: (styles.textAlign || styles.alignment as any) || 'left',
                        }}
                        className="outline-none focus:bg-blue-50/50 dark:focus:bg-blue-950/30 focus:ring-1 focus:ring-blue-500 transition cursor-text min-w-[60px]"
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

      // 9. VIDEO SHOWCASE / MODAL POPUP
      case 'VIDEO_POPUP': {
        const coverImg = content.coverImageUrl || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80';
        return (
          <div className={`relative overflow-hidden group ${radiusClass} ${shadowClass} border border-slate-200 dark:border-slate-800 bg-slate-900`}>
            <div className="relative aspect-video w-full overflow-hidden">
              <img
                src={coverImg}
                alt={content.title || 'Video Cover'}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent flex flex-col justify-between p-6">
                <div className="flex items-center justify-between">
                  {content.badge && (
                    <span
                      contentEditable={!previewMode}
                      suppressContentEditableWarning
                      onBlur={(e) => {
                        const newBadge = e.currentTarget.textContent || '';
                        onUpdateContent(block.id, { ...content, badge: newBadge });
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-600/90 text-white backdrop-blur-md shadow-sm outline-none cursor-text"
                    >
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
                  <div className="w-14 h-14 rounded-full bg-blue-600/90 text-white flex items-center justify-center shadow-lg shadow-blue-600/40 group-hover:scale-110 group-hover:bg-blue-500 transition cursor-pointer shrink-0">
                    <Play className="w-6 h-6 ml-0.5 fill-current" />
                  </div>
                  <div className="min-w-0">
                    <h4
                      contentEditable={!previewMode}
                      suppressContentEditableWarning
                      onBlur={(e) => {
                        const newTitle = e.currentTarget.textContent || '';
                        onUpdateContent(block.id, { ...content, title: newTitle });
                      }}
                      className="text-lg sm:text-xl font-bold text-white drop-shadow-sm outline-none focus:ring-1 focus:ring-blue-400 rounded px-1 cursor-text"
                    >
                      {content.title || 'Campus Virtual Tour & Story'}
                    </h4>
                    <p className="text-xs text-slate-300 mt-0.5 truncate">
                      {content.videoUrl ? 'Click to play interactive video' : 'Video URL not configured'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }

      // 10. COUNTDOWN TIMER
      case 'COUNTDOWN_TIMER': {
        const targetDate = content.targetDate ? new Date(content.targetDate) : new Date(Date.now() + 30 * 86400000);
        const now = new Date();
        const diff = Math.max(0, targetDate.getTime() - now.getTime());
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        return (
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
              <h3
                contentEditable={!previewMode}
                suppressContentEditableWarning
                onBlur={(e) => {
                  const newTitle = e.currentTarget.textContent || '';
                  onUpdateContent(block.id, { ...content, eventTitle: newTitle });
                }}
                className="text-2xl sm:text-3xl font-extrabold tracking-tight outline-none focus:ring-2 focus:ring-blue-400 rounded px-1 cursor-text"
              >
                {content.eventTitle || 'Admissions Round 2026-27'}
              </h3>
              {content.eventSubtitle && (
                <p
                  contentEditable={!previewMode}
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    const newSub = e.currentTarget.textContent || '';
                    onUpdateContent(block.id, { ...content, eventSubtitle: newSub });
                  }}
                  className="text-sm text-slate-400 max-w-xl mx-auto outline-none focus:ring-1 focus:ring-blue-400 rounded px-1 cursor-text"
                >
                  {content.eventSubtitle}
                </p>
              )}
            </div>

            {/* 4 Metric Ticker Cards */}
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
                  onClick={(e) => e.preventDefault()}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition cursor-pointer"
                >
                  <span>{content.ctaButtonText}</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            )}
          </div>
        );
      }

      // 11. ACCORDION / EXPANDABLE PANELS
      case 'ACCORDION': {
        const items = Array.isArray(content.items) ? content.items : [];
        return (
          <div className="space-y-3">
            {items.map((item: any, idx: number) => {
              const isExpanded = (content.defaultExpandedIndex ?? 0) === idx;
              return (
                <div
                  key={item.id || idx}
                  className={`rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-2xs transition ${
                    isExpanded ? 'ring-2 ring-blue-500/20 border-blue-300 dark:border-blue-800' : ''
                  }`}
                >
                  <div
                    onClick={() => {
                      onUpdateContent(block.id, {
                        ...content,
                        defaultExpandedIndex: isExpanded ? -1 : idx,
                      });
                    }}
                    className="p-4 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/60 dark:hover:bg-slate-800/40 select-none transition"
                  >
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
                        <h4
                          contentEditable={!previewMode}
                          suppressContentEditableWarning
                          onClick={(e) => e.stopPropagation()}
                          onBlur={(e) => {
                            const newTitle = e.currentTarget.textContent || '';
                            const newItems = [...items];
                            newItems[idx] = { ...newItems[idx], title: newTitle };
                            onUpdateContent(block.id, { ...content, items: newItems });
                          }}
                          className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 outline-none focus:ring-1 focus:ring-blue-500 rounded px-1 cursor-text"
                        >
                          {item.title || `Accordion Item ${idx + 1}`}
                        </h4>
                      </div>
                    </div>
                    <div className="text-slate-400 p-1">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="px-5 pb-5 pt-1 text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30">
                      <p
                        contentEditable={!previewMode}
                        suppressContentEditableWarning
                        onBlur={(e) => {
                          const newText = e.currentTarget.textContent || '';
                          const newItems = [...items];
                          newItems[idx] = { ...newItems[idx], content: newText };
                          onUpdateContent(block.id, { ...content, items: newItems });
                        }}
                        className="outline-none focus:ring-1 focus:ring-blue-500 rounded px-1 cursor-text"
                      >
                        {item.content || 'Expandable panel details, description, and information.'}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}

            {!previewMode && (
              <button
                type="button"
                onClick={() => {
                  const newItems = [
                    ...items,
                    {
                      id: `acc-${Date.now()}`,
                      title: 'New Accordion Question',
                      content: 'Detailed explanation and breakdown for this topic.',
                      badge: 'Info',
                    },
                  ];
                  onUpdateContent(block.id, { ...content, items: newItems });
                }}
                className="w-full py-2.5 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-400 hover:bg-blue-50/30 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Accordion Item</span>
              </button>
            )}
          </div>
        );
      }

      // 12. TABS SWITCHER (Multi-panel switchable tabs)
      case 'TABS_SWITCHER': {
        const tabs = Array.isArray(content.tabs) ? content.tabs : [
          { id: 'tab-1', title: 'Curriculum & Syllabus', badge: 'Core', content: 'Comprehensive academic syllabus detailing foundational concepts, elective modules, and hands-on laboratory requirements.' },
          { id: 'tab-2', title: 'Laboratories & Research', badge: 'Facilities', content: 'Advanced computing labs equipped with high-performance workstations, IoT testbeds, and dedicated robotics workstations.' },
          { id: 'tab-3', title: 'Placements & Careers', badge: 'Recruiters', content: 'Robust placement training with over 150+ Tier-1 corporate partners and dedicated career mentorship cells.' },
        ];
        const activeIdx = Math.min(Math.max(0, content.activeTabIndex ?? 0), Math.max(0, tabs.length - 1));
        const activeTab = tabs[activeIdx] || tabs[0];

        return (
          <div className={`space-y-4 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 ${radiusClass} ${shadowClass}`}>
            {/* Tab Navigation Buttons */}
            <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              {tabs.map((tab: any, idx: number) => {
                const isActive = activeIdx === idx;
                return (
                  <button
                    key={tab.id || idx}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpdateContent(block.id, { ...content, activeTabIndex: idx });
                    }}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    <span
                      contentEditable={!previewMode}
                      suppressContentEditableWarning
                      onClick={(e) => e.stopPropagation()}
                      onBlur={(e) => {
                        const newTitle = e.currentTarget.textContent || '';
                        const newTabs = [...tabs];
                        newTabs[idx] = { ...newTabs[idx], title: newTitle };
                        onUpdateContent(block.id, { ...content, tabs: newTabs });
                      }}
                      className="outline-none focus:ring-1 focus:ring-white rounded px-0.5"
                    >
                      {tab.title || `Tab ${idx + 1}`}
                    </span>
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

              {!previewMode && (
                <button
                  type="button"
                  onClick={() => {
                    const newTabs = [
                      ...tabs,
                      {
                        id: `tab-${Date.now()}`,
                        title: `New Tab ${tabs.length + 1}`,
                        badge: 'Custom',
                        content: 'Detailed description and overview for this section topic.',
                      },
                    ];
                    onUpdateContent(block.id, { ...content, tabs: newTabs, activeTabIndex: newTabs.length - 1 });
                  }}
                  className="px-3 py-2 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-500 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50/30 transition flex items-center gap-1 cursor-pointer"
                  title="Add New Tab Panel"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Tab</span>
                </button>
              )}
            </div>

            {/* Active Tab Panel Content */}
            {activeTab && (
              <div className="p-4 sm:p-5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <h4
                    contentEditable={!previewMode}
                    suppressContentEditableWarning
                    onBlur={(e) => {
                      const newTitle = e.currentTarget.textContent || '';
                      const newTabs = [...tabs];
                      newTabs[activeIdx] = { ...newTabs[activeIdx], title: newTitle };
                      onUpdateContent(block.id, { ...content, tabs: newTabs });
                    }}
                    className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-slate-100 outline-none focus:ring-1 focus:ring-blue-500 rounded px-1 cursor-text"
                  >
                    {activeTab.title}
                  </h4>
                  {activeTab.badge && (
                    <span
                      contentEditable={!previewMode}
                      suppressContentEditableWarning
                      onBlur={(e) => {
                        const newBadge = e.currentTarget.textContent || '';
                        const newTabs = [...tabs];
                        newTabs[activeIdx] = { ...newTabs[activeIdx], badge: newBadge };
                        onUpdateContent(block.id, { ...content, tabs: newTabs });
                      }}
                      className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 uppercase tracking-wider outline-none cursor-text"
                    >
                      {activeTab.badge}
                    </span>
                  )}
                </div>
                <p
                  contentEditable={!previewMode}
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    const newText = e.currentTarget.textContent || '';
                    const newTabs = [...tabs];
                    newTabs[activeIdx] = { ...newTabs[activeIdx], content: newText };
                    onUpdateContent(block.id, { ...content, tabs: newTabs });
                  }}
                  className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed outline-none focus:ring-1 focus:ring-blue-500 rounded px-1 cursor-text min-h-[3em]"
                >
                  {activeTab.content || 'Enter tab overview content here...'}
                </p>
              </div>
            )}
          </div>
        );
      }

      // 13. TIMELINE ROADMAP (Stepped Milestones with connecting nodes)
      case 'TIMELINE_ROADMAP': {
        const items = Array.isArray(content.items) ? content.items : [
          { id: 'time-1', year: '2010', title: 'Institution Established', description: 'Founded with 3 foundational engineering streams and 300 scholars.', badge: 'Foundation' },
          { id: 'time-2', year: '2018', title: 'NAAC A++ Accreditation', description: 'Awarded highest institutional grade by the National Assessment and Accreditation Council.', badge: 'Quality' },
          { id: 'time-3', year: '2026', title: 'Autonomous Innovation Campus', description: 'Expanded to 12 academic schools with international research exchange pacts.', badge: 'Global Rank' },
        ];

        return (
          <div className="space-y-6 py-2">
            <div className="relative border-l-2 border-blue-500/40 ml-4 sm:ml-6 space-y-6">
              {items.map((it: any, idx: number) => (
                <div key={it.id || idx} className="relative pl-6 sm:pl-8 group">
                  {/* Timeline Glowing Node */}
                  <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-blue-600 border-4 border-white dark:border-slate-900 shadow-md shadow-blue-500/40 group-hover:scale-125 transition-transform" />

                  {/* Milestone Card */}
                  <div className={`p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 ${shadowClass} hover:border-blue-300 dark:hover:border-blue-700 transition space-y-2`}>
                    <div className="flex items-center justify-between gap-2">
                      <span
                        contentEditable={!previewMode}
                        suppressContentEditableWarning
                        onBlur={(e) => {
                          const newYear = e.currentTarget.textContent || '';
                          const newItems = [...items];
                          newItems[idx] = { ...newItems[idx], year: newYear };
                          onUpdateContent(block.id, { ...content, items: newItems });
                        }}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black font-mono bg-blue-600 text-white shadow-xs outline-none focus:ring-1 focus:ring-blue-400 cursor-text"
                      >
                        {it.year || 'Year'}
                      </span>
                      {it.badge && (
                        <span
                          contentEditable={!previewMode}
                          suppressContentEditableWarning
                          onBlur={(e) => {
                            const newBadge = e.currentTarget.textContent || '';
                            const newItems = [...items];
                            newItems[idx] = { ...newItems[idx], badge: newBadge };
                            onUpdateContent(block.id, { ...content, items: newItems });
                          }}
                          className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded outline-none cursor-text"
                        >
                          {it.badge}
                        </span>
                      )}
                    </div>

                    <h4
                      contentEditable={!previewMode}
                      suppressContentEditableWarning
                      onBlur={(e) => {
                        const newTitle = e.currentTarget.textContent || '';
                        const newItems = [...items];
                        newItems[idx] = { ...newItems[idx], title: newTitle };
                        onUpdateContent(block.id, { ...content, items: newItems });
                      }}
                      className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 outline-none focus:ring-1 focus:ring-blue-500 rounded px-1 cursor-text"
                    >
                      {it.title || 'Milestone Title'}
                    </h4>

                    <p
                      contentEditable={!previewMode}
                      suppressContentEditableWarning
                      onBlur={(e) => {
                        const newDesc = e.currentTarget.textContent || '';
                        const newItems = [...items];
                        newItems[idx] = { ...newItems[idx], description: newDesc };
                        onUpdateContent(block.id, { ...content, items: newItems });
                      }}
                      className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed outline-none focus:ring-1 focus:ring-blue-500 rounded px-1 cursor-text"
                    >
                      {it.description || 'Milestone historical description and achievement background.'}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {!previewMode && (
              <button
                type="button"
                onClick={() => {
                  const newItems = [
                    ...items,
                    {
                      id: `time-${Date.now()}`,
                      year: `${new Date().getFullYear()}`,
                      title: 'New Institutional Milestone',
                      description: 'Significant achievement, expansion, or global ranking accomplishment.',
                      badge: 'New',
                    },
                  ];
                  onUpdateContent(block.id, { ...content, items: newItems });
                }}
                className="w-full py-2.5 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-400 hover:bg-blue-50/30 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 transition flex items-center justify-center gap-1.5 cursor-pointer ml-4"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Milestone Step</span>
              </button>
            )}
          </div>
        );
      }

      // 14. FACULTY DIRECTORY (Professor Cards Grid)
      case 'FACULTY_GRID': {
        const members = Array.isArray(content.members) ? content.members : [
          {
            id: 'fac-1',
            name: 'Dr. Sarah Jenkins, Ph.D.',
            designation: 'Professor & HOD',
            qualification: 'Ph.D. Computer Science (Stanford)',
            specialization: 'Artificial Intelligence & Robotics',
            email: 's.jenkins@college.edu',
            imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          },
          {
            id: 'fac-2',
            name: 'Dr. Robert Chen, Ph.D.',
            designation: 'Associate Professor',
            qualification: 'Ph.D. Microelectronics (MIT)',
            specialization: 'VLSI Design & Quantum Architecture',
            email: 'r.chen@college.edu',
            imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
          },
          {
            id: 'fac-3',
            name: 'Dr. Emily Watson, Ph.D.',
            designation: 'Assistant Professor',
            qualification: 'Ph.D. Cybersecurity (Oxford)',
            specialization: 'Network Security & Blockchain',
            email: 'e.watson@college.edu',
            imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
          },
        ];

        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {members.map((m: any, idx: number) => (
                <div
                  key={m.id || idx}
                  className={`p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 ${radiusClass} ${shadowClass} text-center space-y-4 transition hover:border-blue-300 dark:hover:border-blue-700 flex flex-col justify-between`}
                >
                  <div className="space-y-3">
                    {/* Faculty Avatar */}
                    <div className="relative w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-blue-500 shadow-md">
                      <img
                        src={m.imageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                        alt={m.name || 'Faculty'}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div>
                      <h4
                        contentEditable={!previewMode}
                        suppressContentEditableWarning
                        onBlur={(e) => {
                          const newName = e.currentTarget.textContent || '';
                          const newMembers = [...members];
                          newMembers[idx] = { ...newMembers[idx], name: newName };
                          onUpdateContent(block.id, { ...content, members: newMembers });
                        }}
                        className="text-base font-extrabold text-slate-900 dark:text-slate-100 outline-none focus:ring-1 focus:ring-blue-500 rounded px-1 cursor-text"
                      >
                        {m.name || 'Professor Name'}
                      </h4>
                      <p
                        contentEditable={!previewMode}
                        suppressContentEditableWarning
                        onBlur={(e) => {
                          const newDesig = e.currentTarget.textContent || '';
                          const newMembers = [...members];
                          newMembers[idx] = { ...newMembers[idx], designation: newDesig };
                          onUpdateContent(block.id, { ...content, members: newMembers });
                        }}
                        className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-0.5 outline-none focus:ring-1 focus:ring-blue-500 rounded px-1 cursor-text"
                      >
                        {m.designation || 'Designation'}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-left space-y-1.5">
                      <div className="text-[11px] text-slate-600 dark:text-slate-300">
                        <span className="font-bold text-slate-700 dark:text-slate-200">Degree: </span>
                        <span
                          contentEditable={!previewMode}
                          suppressContentEditableWarning
                          onBlur={(e) => {
                            const newQual = e.currentTarget.textContent || '';
                            const newMembers = [...members];
                            newMembers[idx] = { ...newMembers[idx], qualification: newQual };
                            onUpdateContent(block.id, { ...content, members: newMembers });
                          }}
                          className="outline-none focus:ring-1 focus:ring-blue-500 rounded px-0.5"
                        >
                          {m.qualification || 'Ph.D.'}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-600 dark:text-slate-300">
                        <span className="font-bold text-slate-700 dark:text-slate-200">Domain: </span>
                        <span
                          contentEditable={!previewMode}
                          suppressContentEditableWarning
                          onBlur={(e) => {
                            const newSpec = e.currentTarget.textContent || '';
                            const newMembers = [...members];
                            newMembers[idx] = { ...newMembers[idx], specialization: newSpec };
                            onUpdateContent(block.id, { ...content, members: newMembers });
                          }}
                          className="outline-none focus:ring-1 focus:ring-blue-500 rounded px-0.5"
                        >
                          {m.specialization || 'Research Area'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {m.email && (
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-1 text-xs font-semibold text-slate-500 hover:text-blue-600">
                      <Mail className="w-3.5 h-3.5" />
                      <span>{m.email}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {!previewMode && (
              <button
                type="button"
                onClick={() => {
                  const newMembers = [
                    ...members,
                    {
                      id: `fac-${Date.now()}`,
                      name: 'Dr. New Faculty, Ph.D.',
                      designation: 'Assistant Professor',
                      qualification: 'Ph.D. in Engineering',
                      specialization: 'Emerging Technologies',
                      email: 'faculty@college.edu',
                      imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
                    },
                  ];
                  onUpdateContent(block.id, { ...content, members: newMembers });
                }}
                className="w-full py-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-400 hover:bg-blue-50/30 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Faculty Member</span>
              </button>
            )}
          </div>
        );
      }

      // 15. NOTICES LIST (Official Circulars and Notice Rows)
      case 'NOTICES_LIST': {
        const notices = Array.isArray(content.notices) ? content.notices : [
          { id: 'not-1', date: 'SEP 28, 2026', title: 'End-Semester Examination Timetable & Hall Ticket Release', category: 'EXAMINATION', fileUrl: '#', isNew: true },
          { id: 'not-2', date: 'SEP 22, 2026', title: 'National Innovation & Research Fellowship Grant Applications Open', category: 'RESEARCH', fileUrl: '#', isNew: false },
          { id: 'not-3', date: 'SEP 15, 2026', title: 'Campus Placement Drive & Pre-Placement Talk by Global Tier-1 Recruiters', category: 'PLACEMENT', fileUrl: '#', isNew: false },
        ];

        return (
          <div className="space-y-3">
            {notices.map((n: any, idx: number) => (
              <div
                key={n.id || idx}
                className={`p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 ${shadowClass} flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition hover:border-blue-300 dark:hover:border-blue-700`}
              >
                <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                  {/* Date Badge */}
                  <div className="px-3 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900 text-blue-700 dark:text-blue-300 flex flex-col items-center justify-center text-center shrink-0">
                    <span
                      contentEditable={!previewMode}
                      suppressContentEditableWarning
                      onBlur={(e) => {
                        const newDate = e.currentTarget.textContent || '';
                        const newNotices = [...notices];
                        newNotices[idx] = { ...newNotices[idx], date: newDate };
                        onUpdateContent(block.id, { ...content, notices: newNotices });
                      }}
                      className="text-[11px] font-black font-mono uppercase tracking-wider outline-none focus:ring-1 focus:ring-blue-500 rounded px-1 cursor-text"
                    >
                      {n.date || 'SEP 2026'}
                    </span>
                  </div>

                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        contentEditable={!previewMode}
                        suppressContentEditableWarning
                        onBlur={(e) => {
                          const newCat = e.currentTarget.textContent || '';
                          const newNotices = [...notices];
                          newNotices[idx] = { ...newNotices[idx], category: newCat };
                          onUpdateContent(block.id, { ...content, notices: newNotices });
                        }}
                        className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 outline-none cursor-text"
                      >
                        {n.category || 'NOTICE'}
                      </span>
                      {n.isNew && (
                        <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-red-500 text-white animate-pulse">
                          NEW
                        </span>
                      )}
                    </div>
                    <h4
                      contentEditable={!previewMode}
                      suppressContentEditableWarning
                      onBlur={(e) => {
                        const newTitle = e.currentTarget.textContent || '';
                        const newNotices = [...notices];
                        newNotices[idx] = { ...newNotices[idx], title: newTitle };
                        onUpdateContent(block.id, { ...content, notices: newNotices });
                      }}
                      className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 outline-none focus:ring-1 focus:ring-blue-500 rounded px-1 cursor-text leading-snug"
                    >
                      {n.title || 'Official Notice Title'}
                    </h4>
                  </div>
                </div>

                <a
                  href={n.fileUrl || '#'}
                  onClick={(e) => !previewMode && e.preventDefault()}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm shadow-blue-600/20 shrink-0 transition cursor-pointer"
                >
                  <span>View Notice</span>
                  <Download className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}

            {!previewMode && (
              <button
                type="button"
                onClick={() => {
                  const newNotices = [
                    ...notices,
                    {
                      id: `not-${Date.now()}`,
                      date: 'OCT 01, 2026',
                      title: 'New Official Announcement & Circular Notice',
                      category: 'GENERAL',
                      fileUrl: '#',
                      isNew: true,
                    },
                  ];
                  onUpdateContent(block.id, { ...content, notices: newNotices });
                }}
                className="w-full py-2.5 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-400 hover:bg-blue-50/30 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Notice Row</span>
              </button>
            )}
          </div>
        );
      }

      // 16. LOGO MATRIX (Recruiters & Academic Partners)
      case 'LOGO_MATRIX': {
        const partners = Array.isArray(content.partners) ? content.partners : [
          { id: 'p-1', name: 'Google', category: 'Tech Partner' },
          { id: 'p-2', name: 'Microsoft', category: 'Enterprise' },
          { id: 'p-3', name: 'Amazon', category: 'Cloud & AI' },
          { id: 'p-4', name: 'Deloitte', category: 'Consulting' },
          { id: 'p-5', name: 'Intel', category: 'Semiconductors' },
          { id: 'p-6', name: 'Cisco', category: 'Networking' },
        ];

        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {partners.map((p: any, idx: number) => (
                <div
                  key={p.id || idx}
                  className={`p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 ${shadowClass} flex flex-col items-center justify-center text-center space-y-1.5 hover:border-blue-400 hover:shadow-md transition group`}
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black text-base shadow-2xs group-hover:scale-110 transition-transform">
                    {p.name?.charAt(0) || 'P'}
                  </div>
                  <h5
                    contentEditable={!previewMode}
                    suppressContentEditableWarning
                    onBlur={(e) => {
                      const newName = e.currentTarget.textContent || '';
                      const newPartners = [...partners];
                      newPartners[idx] = { ...newPartners[idx], name: newName };
                      onUpdateContent(block.id, { ...content, partners: newPartners });
                    }}
                    className="text-xs font-bold text-slate-800 dark:text-slate-200 outline-none focus:ring-1 focus:ring-blue-500 rounded px-1 cursor-text"
                  >
                    {p.name || 'Partner'}
                  </h5>
                  {p.category && (
                    <span
                      contentEditable={!previewMode}
                      suppressContentEditableWarning
                      onBlur={(e) => {
                        const newCat = e.currentTarget.textContent || '';
                        const newPartners = [...partners];
                        newPartners[idx] = { ...newPartners[idx], category: newCat };
                        onUpdateContent(block.id, { ...content, partners: newPartners });
                      }}
                      className="text-[9px] font-medium text-slate-400 uppercase tracking-wider outline-none cursor-text"
                    >
                      {p.category}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {!previewMode && (
              <button
                type="button"
                onClick={() => {
                  const newPartners = [
                    ...partners,
                    {
                      id: `p-${Date.now()}`,
                      name: `Partner ${partners.length + 1}`,
                      category: 'Recruiter',
                    },
                  ];
                  onUpdateContent(block.id, { ...content, partners: newPartners });
                }}
                className="w-full py-2.5 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-400 hover:bg-blue-50/30 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Partner Logo</span>
              </button>
            )}
          </div>
        );
      }

      // 17. COURSE CARDS (Academic Degree Programs)
      case 'COURSE_CARDS': {
        const courses = Array.isArray(content.courses) ? content.courses : [
          {
            id: 'c-1',
            title: 'B.Tech in Artificial Intelligence & Data Science',
            degree: 'Undergraduate',
            duration: '4 Years (8 Semesters)',
            intake: '120 Seats',
            description: 'Comprehensive study of deep neural networks, machine learning algorithms, and high-performance computing.',
            ctaText: 'Curriculum & Details',
            ctaUrl: '#',
          },
          {
            id: 'c-2',
            title: 'B.Tech in Computer Science & Engineering',
            degree: 'Undergraduate',
            duration: '4 Years (8 Semesters)',
            intake: '180 Seats',
            description: 'Foundational computing, distributed architectures, cloud computing platforms, and full-stack software development.',
            ctaText: 'Curriculum & Details',
            ctaUrl: '#',
          },
          {
            id: 'c-3',
            title: 'M.Tech in Cybersecurity & Network Defense',
            degree: 'Postgraduate',
            duration: '2 Years (4 Semesters)',
            intake: '60 Seats',
            description: 'Applied cryptography, digital forensics, ethical hacking protocols, and corporate compliance frameworks.',
            ctaText: 'Curriculum & Details',
            ctaUrl: '#',
          },
        ];

        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {courses.map((c: any, idx: number) => (
                <div
                  key={c.id || idx}
                  className={`p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 ${radiusClass} ${shadowClass} flex flex-col justify-between space-y-4 hover:border-blue-300 dark:hover:border-blue-700 transition`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        contentEditable={!previewMode}
                        suppressContentEditableWarning
                        onBlur={(e) => {
                          const newDeg = e.currentTarget.textContent || '';
                          const newCourses = [...courses];
                          newCourses[idx] = { ...newCourses[idx], degree: newDeg };
                          onUpdateContent(block.id, { ...content, courses: newCourses });
                        }}
                        className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 outline-none cursor-text"
                      >
                        {c.degree || 'Degree'}
                      </span>
                      <span
                        contentEditable={!previewMode}
                        suppressContentEditableWarning
                        onBlur={(e) => {
                          const newDur = e.currentTarget.textContent || '';
                          const newCourses = [...courses];
                          newCourses[idx] = { ...newCourses[idx], duration: newDur };
                          onUpdateContent(block.id, { ...content, courses: newCourses });
                        }}
                        className="text-xs font-mono font-bold text-slate-500 outline-none cursor-text"
                      >
                        {c.duration || '4 Years'}
                      </span>
                    </div>

                    <h4
                      contentEditable={!previewMode}
                      suppressContentEditableWarning
                      onBlur={(e) => {
                        const newTitle = e.currentTarget.textContent || '';
                        const newCourses = [...courses];
                        newCourses[idx] = { ...newCourses[idx], title: newTitle };
                        onUpdateContent(block.id, { ...content, courses: newCourses });
                      }}
                      className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-slate-100 outline-none focus:ring-1 focus:ring-blue-500 rounded px-1 cursor-text leading-snug"
                    >
                      {c.title || 'Program Title'}
                    </h4>

                    <p
                      contentEditable={!previewMode}
                      suppressContentEditableWarning
                      onBlur={(e) => {
                        const newDesc = e.currentTarget.textContent || '';
                        const newCourses = [...courses];
                        newCourses[idx] = { ...newCourses[idx], description: newDesc };
                        onUpdateContent(block.id, { ...content, courses: newCourses });
                      }}
                      className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed outline-none focus:ring-1 focus:ring-blue-500 rounded px-1 cursor-text"
                    >
                      {c.description || 'Curriculum overview and program learning outcomes.'}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                    <span
                      contentEditable={!previewMode}
                      suppressContentEditableWarning
                      onBlur={(e) => {
                        const newIntake = e.currentTarget.textContent || '';
                        const newCourses = [...courses];
                        newCourses[idx] = { ...newCourses[idx], intake: newIntake };
                        onUpdateContent(block.id, { ...content, courses: newCourses });
                      }}
                      className="text-xs font-semibold text-slate-400 outline-none cursor-text"
                    >
                      {c.intake || '120 Seats'}
                    </span>
                    <a
                      href={c.ctaUrl || '#'}
                      onClick={(e) => !previewMode && e.preventDefault()}
                      className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 transition cursor-pointer"
                    >
                      <span>{c.ctaText || 'Learn More'}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {!previewMode && (
              <button
                type="button"
                onClick={() => {
                  const newCourses = [
                    ...courses,
                    {
                      id: `c-${Date.now()}`,
                      title: 'New Degree Program',
                      degree: 'Undergraduate',
                      duration: '4 Years (8 Semesters)',
                      intake: '60 Seats',
                      description: 'Specialized interdisciplinary curriculum aligned with national education policy.',
                      ctaText: 'Curriculum & Details',
                      ctaUrl: '#',
                    },
                  ];
                  onUpdateContent(block.id, { ...content, courses: newCourses });
                }}
                className="w-full py-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-400 hover:bg-blue-50/30 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Degree Program</span>
              </button>
            )}
          </div>
        );
      }

      // 18. MAP EMBED (Campus Map Viewport + Address Card)
      case 'MAP_EMBED': {
        return (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Map Box */}
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

            {/* Address & Hours Card */}
            <div className={`lg:col-span-5 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 ${shadowClass} flex flex-col justify-between space-y-4`}>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Campus Location</h5>
                    <p
                      contentEditable={!previewMode}
                      suppressContentEditableWarning
                      onBlur={(e) => {
                        const newAddr = e.currentTarget.textContent || '';
                        onUpdateContent(block.id, { ...content, address: newAddr });
                      }}
                      className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5 outline-none focus:ring-1 focus:ring-blue-500 rounded px-0.5 cursor-text"
                    >
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
                    <p
                      contentEditable={!previewMode}
                      suppressContentEditableWarning
                      onBlur={(e) => {
                        const newPhone = e.currentTarget.textContent || '';
                        onUpdateContent(block.id, { ...content, phone: newPhone });
                      }}
                      className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5 outline-none focus:ring-1 focus:ring-blue-500 rounded px-0.5 cursor-text"
                    >
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
                    <p
                      contentEditable={!previewMode}
                      suppressContentEditableWarning
                      onBlur={(e) => {
                        const newHours = e.currentTarget.textContent || '';
                        onUpdateContent(block.id, { ...content, officeHours: newHours });
                      }}
                      className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5 outline-none focus:ring-1 focus:ring-blue-500 rounded px-0.5 cursor-text"
                    >
                      {content.officeHours || 'Monday – Saturday: 8:30 AM – 5:30 PM'}
                    </p>
                  </div>
                </div>
              </div>

              <a
                href={content.mapEmbedUrl || 'https://maps.google.com'}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => !previewMode && e.preventDefault()}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-600/30 transition cursor-pointer"
              >
                <span>{content.ctaText || 'Get Driving Directions'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        );
      }

      // 19. LAYOUT CONTAINERS (1-Col, 2-Col, 3-Col)
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
          <div className={gridClass}>
            {cols.map((col, idx) => (
              <div
                key={col.id}
                onDragOver={(e) => {
                  if (!previewMode) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.dataTransfer.dropEffect = 'move';
                  }
                }}
                onDrop={(e) => {
                  if (!previewMode) {
                    e.preventDefault();
                    e.stopPropagation();
                    try {
                      const dataStr = e.dataTransfer.getData('application/json');
                      if (dataStr) {
                        const parsed = JSON.parse(dataStr);
                        if (parsed.type === 'MOVE_BLOCK' && parsed.blockId) {
                          onMoveBlockToTarget?.(parsed.blockId, null, 'inside-column', col.id);
                        } else if (onAddBlockToColumn) {
                          onAddBlockToColumn(parsed, col.id);
                        }
                      }
                    } catch (err) {
                      console.error('Failed to parse column drop', err);
                    }
                  }
                }}
                className={`min-h-[40px] rounded-2xl transition-all ${
                  previewMode || col.blocks.length > 0
                    ? 'p-0 space-y-3'
                    : 'border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40 p-4 space-y-3 hover:border-blue-400'
                }`}
              >
                {!previewMode && col.blocks.length === 0 && (
                  <div className="py-6 text-center text-xs text-slate-400">
                    <Plus className="w-4 h-4 mx-auto mb-1 text-slate-300" />
                    Drop elements into Column {idx + 1}
                  </div>
                )}

                {col.blocks.map((childBlock) => (
                  <CanvasBlockRenderer
                    key={childBlock.id}
                    block={childBlock}
                    isSelected={selectedBlockId === childBlock.id}
                    selectedBlockId={selectedBlockId}
                    previewMode={previewMode}
                    onSelect={onSelect}
                    onUpdateContent={onUpdateContent}
                    onUpdateStyles={onUpdateStyles}
                    onDelete={onDelete}
                    onDuplicate={onDuplicate}
                    onMoveUp={onMoveUp}
                    onMoveDown={onMoveDown}
                    onAddBlockToColumn={onAddBlockToColumn}
                    onMoveBlockToTarget={onMoveBlockToTarget}
                  />
                ))}

                {col.blocks.length === 0 && !previewMode && (
                  <div className="py-6 text-center text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                    <Plus className="w-4 h-4 mx-auto mb-1 text-slate-300" />
                    Drop elements into Column {idx + 1}
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      }

      default:
        return <div className="text-xs text-slate-400">Unknown block: {block.type}</div>;
    }
  };

  const blockRef = React.useRef<HTMLDivElement>(null);
  const [dropPosition, setDropPosition] = React.useState<'none' | 'before' | 'after'>('none');
  const [liveResizeDim, setLiveResizeDim] = React.useState<{
    w?: string;
    h?: string;
    x?: number;
    y?: number;
  } | null>(null);

  // ─────────────────────────────────────────────────────────────────────────────
  // 1. FREE MOVE DRAG CONTROLLER (MS Word / Figma style absolute positioning)
  // ─────────────────────────────────────────────────────────────────────────────
  const handleStartFreeMove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const el = blockRef.current;
    if (!el || !onUpdateStyles) return;

    const startX = e.clientX;
    const startY = e.clientY;
    const initialLeft = styles.posX ?? (el.offsetLeft || 40);
    const initialTop = styles.posY ?? (el.offsetTop || 40);

    const onMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      // Snap to 8px grid when dragging
      const rawX = Math.max(0, Math.round(initialLeft + deltaX));
      const rawY = Math.max(0, Math.round(initialTop + deltaY));
      const snappedX = Math.round(rawX / 8) * 8;
      const snappedY = Math.round(rawY / 8) * 8;

      setLiveResizeDim((prev) => ({
        ...prev,
        x: snappedX,
        y: snappedY,
      }));

      el.style.left = `${snappedX}px`;
      el.style.top = `${snappedY}px`;
      el.style.position = 'absolute';
    };

    const onMouseUp = (upEvent: MouseEvent) => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);

      const deltaX = upEvent.clientX - startX;
      const deltaY = upEvent.clientY - startY;
      const rawX = Math.max(0, Math.round(initialLeft + deltaX));
      const rawY = Math.max(0, Math.round(initialTop + deltaY));
      const finalX = Math.round(rawX / 8) * 8;
      const finalY = Math.round(rawY / 8) * 8;

      onUpdateStyles(block.id, {
        positionMode: 'floating',
        posX: finalX,
        posY: finalY,
        width: styles.width || '320px',
      });
      setLiveResizeDim(null);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. 8-POINT BOUNDING BOX RESIZERS (Top, Bottom, Left, Right, 4 Corners)
  // ─────────────────────────────────────────────────────────────────────────────
  const handleStartResize = (
    e: React.MouseEvent,
    direction: 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw'
  ) => {
    e.preventDefault();
    e.stopPropagation();
    const el = blockRef.current;
    if (!el || !onUpdateStyles) return;

    const startX = e.clientX;
    const startY = e.clientY;
    const parentWidth = el.parentElement?.clientWidth || 800;
    const initialWidth = el.getBoundingClientRect().width;
    const initialHeight = el.getBoundingClientRect().height;
    const initialLeft = styles.posX ?? (el.offsetLeft || 40);
    const initialTop = styles.posY ?? (el.offsetTop || 40);

    const onMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      let newW = initialWidth;
      let newH = initialHeight;
      let newX = initialLeft;
      let newY = initialTop;

      if (direction.includes('e')) {
        newW = Math.max(100, initialWidth + deltaX);
      }
      if (direction.includes('w')) {
        newW = Math.max(100, initialWidth - deltaX);
        newX = Math.max(0, initialLeft + deltaX);
      }
      if (direction.includes('s')) {
        newH = Math.max(40, initialHeight + deltaY);
      }
      if (direction.includes('n')) {
        newH = Math.max(40, initialHeight - deltaY);
        newY = Math.max(0, initialTop + deltaY);
      }

      if (isFloating) {
        setLiveResizeDim({
          w: `${Math.round(newW)}px`,
          h: `${Math.round(newH)}px`,
          x: Math.round(newX),
          y: Math.round(newY),
        });
        el.style.width = `${Math.round(newW)}px`;
        el.style.minHeight = `${Math.round(newH)}px`;
        if (direction.includes('w')) el.style.left = `${Math.round(newX)}px`;
        if (direction.includes('n')) el.style.top = `${Math.round(newY)}px`;
      } else {
        const ratio = Math.min(100, Math.max(20, (newW / parentWidth) * 100));
        let snappedWidth = `${Math.round(ratio)}%`;
        if (Math.abs(ratio - 100) < 4) snappedWidth = '100%';
        else if (Math.abs(ratio - 75) < 3.5) snappedWidth = '75%';
        else if (Math.abs(ratio - 50) < 3.5) snappedWidth = '50%';
        else if (Math.abs(ratio - 33.33) < 3.5) snappedWidth = '33.333%';
        else if (Math.abs(ratio - 25) < 3.5) snappedWidth = '25%';

        setLiveResizeDim({
          w: snappedWidth,
          h: `${Math.round(newH)}px`,
        });
        el.style.width = snappedWidth;
        el.style.minHeight = `${Math.round(newH)}px`;
      }
    };

    const onMouseUp = (upEvent: MouseEvent) => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);

      const deltaX = upEvent.clientX - startX;
      const deltaY = upEvent.clientY - startY;

      let finalW = initialWidth;
      let finalH = initialHeight;
      let finalX = initialLeft;
      let finalY = initialTop;

      if (direction.includes('e')) finalW = Math.max(100, initialWidth + deltaX);
      if (direction.includes('w')) {
        finalW = Math.max(100, initialWidth - deltaX);
        finalX = Math.max(0, initialLeft + deltaX);
      }
      if (direction.includes('s')) finalH = Math.max(40, initialHeight + deltaY);
      if (direction.includes('n')) {
        finalH = Math.max(40, initialHeight - deltaY);
        finalY = Math.max(0, initialTop + deltaY);
      }

      if (isFloating) {
        onUpdateStyles(block.id, {
          width: `${Math.round(finalW)}px`,
          minHeight: `${Math.round(finalH)}px`,
          height: undefined,
          posX: Math.round(finalX),
          posY: Math.round(finalY),
        });
      } else {
        const ratio = Math.min(100, Math.max(20, (finalW / parentWidth) * 100));
        let widthStr = `${Math.round(ratio)}%`;
        if (Math.abs(ratio - 100) < 4) widthStr = '100%';
        else if (Math.abs(ratio - 75) < 3.5) widthStr = '75%';
        else if (Math.abs(ratio - 50) < 3.5) widthStr = '50%';
        else if (Math.abs(ratio - 33.33) < 3.5) widthStr = '33.333%';
        else if (Math.abs(ratio - 25) < 3.5) widthStr = '25%';

        onUpdateStyles(block.id, {
          width: widthStr === '100%' ? undefined : widthStr,
          minHeight: `${Math.round(finalH)}px`,
          height: undefined,
        });
      }
      setLiveResizeDim(null);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  // Compute outer container alignment
  const alignmentWrapperClass = !isFloating
    ? styles.flexAlignment === 'center'
      ? 'mx-auto'
      : styles.flexAlignment === 'end'
      ? 'ml-auto'
      : styles.flexAlignment === 'start'
      ? 'mr-auto'
      : ''
    : '';

  return (
    <div
      ref={blockRef}
      onClick={handleBlockClick}
      onDragOver={(e) => {
        if (!previewMode && !isFloating) {
          e.preventDefault();
          e.stopPropagation();
          e.dataTransfer.dropEffect = 'move';
          const rect = e.currentTarget.getBoundingClientRect();
          const relativeY = e.clientY - rect.top;
          if (relativeY < rect.height * 0.35) {
            setDropPosition('before');
          } else {
            setDropPosition('after');
          }
        }
      }}
      onDragLeave={() => {
        setDropPosition('none');
      }}
      onDrop={(e) => {
        if (!previewMode && !isFloating) {
          e.preventDefault();
          e.stopPropagation();
          const pos = dropPosition;
          setDropPosition('none');
          try {
            const dataStr = e.dataTransfer.getData('application/json');
            if (dataStr) {
              const parsed = JSON.parse(dataStr);
              if (parsed.type === 'MOVE_BLOCK' && parsed.blockId && parsed.blockId !== block.id) {
                onMoveBlockToTarget?.(parsed.blockId, block.id, pos === 'before' ? 'before' : 'after');
              } else if (parsed.type && parsed.type !== 'MOVE_BLOCK' && onMoveBlockToTarget) {
                onMoveBlockToTarget(parsed.type, block.id, pos === 'before' ? 'before' : 'after');
              }
            }
          } catch (err) {
            console.error('Failed to parse block drop', err);
          }
        }
      }}
      style={inlineStyles}
      className={`${isFloating ? 'absolute' : 'relative'} group transition-shadow ${alignmentWrapperClass} ${paddingYClass} ${paddingXClass} ${
        !isFloating ? marginYClass : ''
      } ${radiusClass} ${
        !previewMode
          ? isSelected
            ? 'ring-2 ring-blue-600 ring-offset-2 dark:ring-offset-slate-900 shadow-lg'
            : 'hover:ring-1 hover:ring-blue-300 dark:hover:ring-blue-800'
          : ''
      }`}
    >
      {/* ─── Glowing Drop Line Indicators (Before / After in Flow Mode) ─── */}
      {!previewMode && !isFloating && dropPosition === 'before' && (
        <div className="absolute -top-1.5 left-0 right-0 z-30 flex items-center justify-center pointer-events-none">
          <div className="w-full h-1 bg-blue-600 rounded-full shadow-lg shadow-blue-500/50" />
          <span className="absolute px-2 py-0.5 rounded-full bg-blue-600 text-white text-[9px] font-bold shadow">
            Insert Above
          </span>
        </div>
      )}
      {!previewMode && !isFloating && dropPosition === 'after' && (
        <div className="absolute -bottom-1.5 left-0 right-0 z-30 flex items-center justify-center pointer-events-none">
          <div className="w-full h-1 bg-blue-600 rounded-full shadow-lg shadow-blue-500/50" />
          <span className="absolute px-2 py-0.5 rounded-full bg-blue-600 text-white text-[9px] font-bold shadow">
            Insert Below
          </span>
        </div>
      )}

      {/* ─── Action Floating Toolbar (Visible ONLY on the selected block) ─── */}
      {!previewMode && isSelected && (
        <div
          className="absolute -top-4 right-2 z-40 flex items-center gap-0.5 bg-slate-900 text-white px-1.5 py-0.5 rounded-lg shadow-xl border border-slate-700 animate-in fade-in duration-150"
        >
          {/* Free Move Handle (Hold & drag anywhere on canvas) */}
          <button
            type="button"
            onMouseDown={handleStartFreeMove}
            className="p-1 cursor-grab active:cursor-grabbing hover:bg-blue-600 text-blue-400 hover:text-white rounded transition"
            title="Click and drag anywhere to move (MS Word free-form placement)"
          >
            <Move className="w-3.5 h-3.5" />
          </button>

          {/* Flow drag handle */}
          {!isFloating && (
            <div
              draggable={!previewMode}
              onDragStart={(e) => {
                e.stopPropagation();
                e.dataTransfer.setData(
                  'application/json',
                  JSON.stringify({ type: 'MOVE_BLOCK', blockId: block.id })
                );
                e.dataTransfer.effectAllowed = 'move';
              }}
              className="p-1 cursor-grab active:cursor-grabbing hover:bg-slate-700 text-slate-300 hover:text-white rounded transition"
              title="Drag into column or reorder"
            >
              <GripVertical className="w-3.5 h-3.5" />
            </div>
          )}

          <span className="text-[9px] font-mono uppercase px-1 text-slate-300 font-bold">
            {isFloating ? 'FLOAT' : block.type.replace('CONTAINER_', '')}
          </span>

          {/* Toggle Flow / Float Mode */}
          <button
            type="button"
            title={isFloating ? 'Switch to Document Flow Mode' : 'Switch to MS Word Free-Floating Mode'}
            onClick={(e) => {
              e.stopPropagation();
              if (onUpdateStyles) {
                onUpdateStyles(block.id, {
                  positionMode: isFloating ? 'flow' : 'floating',
                  posX: isFloating ? undefined : 40,
                  posY: isFloating ? undefined : 40,
                  zIndex: isFloating ? undefined : 10,
                });
              }
            }}
            className={`p-1 rounded text-xs transition cursor-pointer ${
              isFloating ? 'bg-blue-600 text-white' : 'hover:bg-slate-700 text-slate-300'
            }`}
          >
            <Layers className="w-3 h-3" />
          </button>

          {/* Z-Index Layer Bring Forward */}
          {isFloating && onUpdateStyles && (
            <>
              <button
                type="button"
                title="Bring Forward (Layer Up)"
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdateStyles(block.id, { zIndex: (styles.zIndex || 10) + 1 });
                }}
                className="p-1 rounded hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
              >
                <BringToFront className="w-3 h-3" />
              </button>
              <button
                type="button"
                title="Send Backward (Layer Down)"
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdateStyles(block.id, { zIndex: Math.max(1, (styles.zIndex || 10) - 1) });
                }}
                className="p-1 rounded hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
              >
                <SendToBack className="w-3 h-3" />
              </button>
            </>
          )}

          {!isFloating && (
            <>
              <button
                type="button"
                title="Move Up"
                onClick={(e) => {
                  e.stopPropagation();
                  onMoveUp(block.id);
                }}
                className="p-1 rounded hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
              >
                <ArrowUp className="w-3 h-3" />
              </button>

              <button
                type="button"
                title="Move Down"
                onClick={(e) => {
                  e.stopPropagation();
                  onMoveDown(block.id);
                }}
                className="p-1 rounded hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
              >
                <ArrowDown className="w-3 h-3" />
              </button>
            </>
          )}

          <button
            type="button"
            title="Duplicate Block"
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate(block.id);
            }}
            className="p-1 rounded hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
          >
            <Copy className="w-3 h-3" />
          </button>

          <button
            type="button"
            title="Block Settings"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(block.id);
            }}
            className="p-1 rounded hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
          >
            <Settings className="w-3 h-3" />
          </button>

          <button
            type="button"
            title="Delete Block"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(block.id);
            }}
            className="p-1 rounded hover:bg-red-600 text-red-400 hover:text-white transition cursor-pointer"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* ─── 8-Point Bounding Box Interactive Handles (MS Word Sizing Points) ─── */}
      {isSelected && !previewMode && onUpdateStyles && (
        <>
          {/* Top-Left Handle */}
          <div
            onMouseDown={(e) => handleStartResize(e, 'nw')}
            className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white dark:bg-slate-900 border-2 border-blue-600 rounded-sm cursor-nwse-resize z-40 shadow-sm hover:scale-125 transition"
            title="Resize Top-Left"
          />

          {/* Top-Center Handle */}
          <div
            onMouseDown={(e) => handleStartResize(e, 'n')}
            className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white dark:bg-slate-900 border-2 border-blue-600 rounded-sm cursor-ns-resize z-40 shadow-sm hover:scale-125 transition"
            title="Resize Height (Top)"
          />

          {/* Top-Right Handle */}
          <div
            onMouseDown={(e) => handleStartResize(e, 'ne')}
            className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white dark:bg-slate-900 border-2 border-blue-600 rounded-sm cursor-nesw-resize z-40 shadow-sm hover:scale-125 transition"
            title="Resize Top-Right"
          />

          {/* Right-Center Handle */}
          <div
            onMouseDown={(e) => handleStartResize(e, 'e')}
            className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 bg-white dark:bg-slate-900 border-2 border-blue-600 rounded-sm cursor-ew-resize z-40 shadow-sm hover:scale-125 transition"
            title="Resize Width (Right)"
          />

          {/* Bottom-Right Handle */}
          <div
            onMouseDown={(e) => handleStartResize(e, 'se')}
            className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 bg-blue-600 border-2 border-white dark:border-slate-900 rounded-sm cursor-nwse-resize z-40 shadow-sm hover:scale-125 transition"
            title="Resize Corner (Width & Height)"
          />

          {/* Bottom-Center Handle */}
          <div
            onMouseDown={(e) => handleStartResize(e, 's')}
            className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white dark:bg-slate-900 border-2 border-blue-600 rounded-sm cursor-ns-resize z-40 shadow-sm hover:scale-125 transition"
            title="Resize Height (Bottom)"
          />

          {/* Bottom-Left Handle */}
          <div
            onMouseDown={(e) => handleStartResize(e, 'sw')}
            className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white dark:bg-slate-900 border-2 border-blue-600 rounded-sm cursor-nesw-resize z-40 shadow-sm hover:scale-125 transition"
            title="Resize Bottom-Left"
          />

          {/* Left-Center Handle */}
          <div
            onMouseDown={(e) => handleStartResize(e, 'w')}
            className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-3 bg-white dark:bg-slate-900 border-2 border-blue-600 rounded-sm cursor-ew-resize z-40 shadow-sm hover:scale-125 transition"
            title="Resize Width (Left)"
          />

          {/* ─── Live Dimension & Coordinate HUD Tooltip ─── */}
          <div className="absolute -bottom-5 left-2 z-40 flex items-center gap-1.5 bg-slate-900/95 backdrop-blur text-white text-[9px] font-mono px-2 py-0.5 rounded-md shadow-lg border border-slate-700 select-none pointer-events-none">
            {isFloating && (
              <>
                <span className="text-slate-400">X:</span>
                <span className="text-yellow-400 font-bold">
                  {liveResizeDim?.x !== undefined ? liveResizeDim.x : styles.posX ?? 40}px
                </span>
                <span className="text-slate-400">Y:</span>
                <span className="text-yellow-400 font-bold">
                  {liveResizeDim?.y !== undefined ? liveResizeDim.y : styles.posY ?? 40}px
                </span>
                <span className="text-slate-600">|</span>
              </>
            )}
            <span className="text-slate-400">W:</span>
            <span className="text-blue-400 font-bold">
              {liveResizeDim?.w || styles.width || (isFloating ? '320px' : '100%')}
            </span>
            <span className="text-slate-400">H:</span>
            <span className="text-emerald-400 font-bold">
              {liveResizeDim?.h || styles.minHeight || styles.height || 'Auto'}
            </span>
            {isFloating && (
              <>
                <span className="text-slate-600">|</span>
                <span className="text-slate-400">Z:</span>
                <span className="text-purple-400 font-bold">{styles.zIndex ?? 10}</span>
              </>
            )}
          </div>
        </>
      )}

      {/* Render the Block Content */}
      {renderContent()}
    </div>
  );
};
