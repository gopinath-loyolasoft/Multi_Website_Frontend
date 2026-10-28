import React from 'react';
import { CanvasBlock } from '../../../types/canvasBuilder';
import { FileUploadInput } from '../../../UI_Componentes/ui/Form/FileUploadInput';

interface ActionLinkInspectorProps {
  block: CanvasBlock;
  onUpdateContent: (content: Record<string, any>) => void;
  onUpdateStyles: (styles: Record<string, any>) => void;
}

export const ActionLinkInspector: React.FC<ActionLinkInspectorProps> = ({
  block,
  onUpdateContent,
  onUpdateStyles,
}) => {
  const content = block.content || {};
  const styles = block.styles || {};

  return (
    <div className="space-y-4">
      {/* BUTTON CONFIGURATION */}
      {block.type === 'BUTTON' && (
        <>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Button Label Text
            </label>
            <input
              type="text"
              value={content.label || ''}
              onChange={(e) => onUpdateContent({ label: e.target.value })}
              placeholder="e.g. Apply for Admissions"
              className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Destination URL / Link
            </label>
            <input
              type="text"
              value={content.url || ''}
              onChange={(e) => onUpdateContent({ url: e.target.value })}
              placeholder="e.g. /courses or https://..."
              className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-mono"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Open in New Browser Tab
              </span>
              <p className="text-[10px] text-slate-400">target="_blank" rel="noopener"</p>
            </div>
            <button
              type="button"
              onClick={() => onUpdateContent({ openInNewTab: !content.openInNewTab })}
              className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                content.openInNewTab ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform ${
                  content.openInNewTab ? 'left-4.5' : 'left-1'
                }`}
              />
            </button>
          </div>
        </>
      )}

      {/* IMAGE CONFIGURATION */}
      {block.type === 'IMAGE' && (
        <>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Photo Image File / URL
            </label>
            <FileUploadInput
              value={content.imageUrl || ''}
              onChange={(url) => onUpdateContent({ imageUrl: url })}
              placeholder="Upload image or paste link..."
              accept="image/*"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Caption (Optional)
            </label>
            <input
              type="text"
              value={content.caption || ''}
              onChange={(e) => onUpdateContent({ caption: e.target.value })}
              placeholder="e.g. Main Academic Quadrangle"
              className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Aspect Ratio
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { label: '16:9', val: '16:9' },
                { label: '4:3', val: '4:3' },
                { label: 'Square', val: '1:1' },
                { label: 'Circle', val: 'circle' },
              ].map(({ label, val }) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => onUpdateStyles({ aspectRatio: val })}
                  className={`py-1.5 rounded-lg text-xs font-bold border transition cursor-pointer ${
                    (styles.aspectRatio || '16:9') === val
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* DOCUMENT / PDF CONFIGURATION */}
      {block.type === 'DOCUMENT_PDF' && (
        <>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Document Title *
            </label>
            <input
              type="text"
              value={content.title || ''}
              onChange={(e) => onUpdateContent({ title: e.target.value })}
              placeholder="e.g. Academic Regulation 2026-27"
              className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Description / Details
            </label>
            <textarea
              rows={2}
              value={content.description || ''}
              onChange={(e) => onUpdateContent({ description: e.target.value })}
              placeholder="Brief summary of document..."
              className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              PDF Document File / URL *
            </label>
            <FileUploadInput
              value={content.fileUrl || ''}
              onChange={(url) => onUpdateContent({ fileUrl: url })}
              placeholder="Upload PDF or paste document URL..."
              accept=".pdf,.doc,.docx,.xlsx"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Format Badge
              </label>
              <input
                type="text"
                value={content.fileType || 'PDF'}
                onChange={(e) => onUpdateContent({ fileType: e.target.value })}
                placeholder="PDF, DOCX"
                className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                File Size
              </label>
              <input
                type="text"
                value={content.fileSize || '2.4 MB'}
                onChange={(e) => onUpdateContent({ fileSize: e.target.value })}
                placeholder="e.g. 2.4 MB"
                className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
              />
            </div>
          </div>
        </>
      )}

      {/* STAT COUNTER CONFIGURATION */}
      {block.type === 'STAT_COUNTER' && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Metric Value
              </label>
              <input
                type="text"
                value={content.value || '98'}
                onChange={(e) => onUpdateContent({ value: e.target.value })}
                placeholder="e.g. 98, 1500"
                className="w-full px-3 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Suffix
              </label>
              <input
                type="text"
                value={content.suffix || '%'}
                onChange={(e) => onUpdateContent({ suffix: e.target.value })}
                placeholder="%, +, /100"
                className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Metric Label
            </label>
            <input
              type="text"
              value={content.label || ''}
              onChange={(e) => onUpdateContent({ label: e.target.value })}
              placeholder="e.g. Campus Placement Rate"
              className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
            />
          </div>
        </>
      )}

      {/* VIDEO SHOWCASE / POPUP CONFIGURATION */}
      {block.type === 'VIDEO_POPUP' && (
        <>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Video Title
            </label>
            <input
              type="text"
              value={content.title || ''}
              onChange={(e) => onUpdateContent({ title: e.target.value })}
              placeholder="e.g. Campus Virtual Tour 2026"
              className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Video URL (YouTube / Vimeo / MP4) *
            </label>
            <input
              type="text"
              value={content.videoUrl || ''}
              onChange={(e) => onUpdateContent({ videoUrl: e.target.value })}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Cover Poster Image
            </label>
            <FileUploadInput
              value={content.coverImageUrl || ''}
              onChange={(url) => onUpdateContent({ coverImageUrl: url })}
              placeholder="Upload poster or paste image URL..."
              accept="image/*"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Badge / Tag
              </label>
              <input
                type="text"
                value={content.badge || ''}
                onChange={(e) => onUpdateContent({ badge: e.target.value })}
                placeholder="Virtual Tour"
                className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Duration Tag
              </label>
              <input
                type="text"
                value={content.duration || ''}
                onChange={(e) => onUpdateContent({ duration: e.target.value })}
                placeholder="3:45 Min"
                className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
              />
            </div>
          </div>
        </>
      )}

      {/* COUNTDOWN TIMER CONFIGURATION */}
      {block.type === 'COUNTDOWN_TIMER' && (
        <>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Event / Headline Title
            </label>
            <input
              type="text"
              value={content.eventTitle || ''}
              onChange={(e) => onUpdateContent({ eventTitle: e.target.value })}
              placeholder="e.g. Admissions Closing In"
              className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Event Subtitle
            </label>
            <input
              type="text"
              value={content.eventSubtitle || ''}
              onChange={(e) => onUpdateContent({ eventSubtitle: e.target.value })}
              placeholder="e.g. Final round applications closing soon"
              className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Target Deadline Date & Time *
            </label>
            <input
              type="datetime-local"
              value={content.targetDate ? content.targetDate.substring(0, 16) : ''}
              onChange={(e) => onUpdateContent({ targetDate: e.target.value })}
              className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                CTA Button Text
              </label>
              <input
                type="text"
                value={content.ctaButtonText || ''}
                onChange={(e) => onUpdateContent({ ctaButtonText: e.target.value })}
                placeholder="Apply Online Now"
                className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                CTA Button Link
              </label>
              <input
                type="text"
                value={content.ctaButtonUrl || ''}
                onChange={(e) => onUpdateContent({ ctaButtonUrl: e.target.value })}
                placeholder="/admissions"
                className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-mono"
              />
            </div>
          </div>
        </>
      )}

      {/* ACCORDION CONFIGURATION */}
      {block.type === 'ACCORDION' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Accordion Items ({(content.items || []).length})
            </label>
            <button
              type="button"
              onClick={() => {
                const current = Array.isArray(content.items) ? content.items : [];
                onUpdateContent({
                  items: [
                    ...current,
                    {
                      id: `acc-${Date.now()}`,
                      title: 'New Question / Header',
                      content: 'Enter detailed content narrative here...',
                      badge: 'General',
                    },
                  ],
                });
              }}
              className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              + Add Item
            </button>
          </div>

          {(content.items || []).map((it: any, idx: number) => (
            <div
              key={it.id || idx}
              className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-2"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold text-slate-400">Item #{idx + 1}</span>
                <button
                  type="button"
                  onClick={() => {
                    const filtered = (content.items || []).filter((_: any, i: number) => i !== idx);
                    onUpdateContent({ items: filtered });
                  }}
                  className="text-[10px] font-bold text-red-500 hover:text-red-700 cursor-pointer"
                >
                  Delete
                </button>
              </div>

              <input
                type="text"
                value={it.title || ''}
                onChange={(e) => {
                  const updated = [...(content.items || [])];
                  updated[idx] = { ...updated[idx], title: e.target.value };
                  onUpdateContent({ items: updated });
                }}
                placeholder="Header / Question"
                className="w-full px-2.5 py-1.5 rounded-lg text-xs font-bold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
              />

              <textarea
                rows={2}
                value={it.content || ''}
                onChange={(e) => {
                  const updated = [...(content.items || [])];
                  updated[idx] = { ...updated[idx], content: e.target.value };
                  onUpdateContent({ items: updated });
                }}
                placeholder="Details / Answer..."
                className="w-full px-2.5 py-1.5 rounded-lg text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
