import React from 'react';
import { AlignLeft, AlignCenter, AlignRight, AlignJustify } from 'lucide-react';
import { CanvasBlock } from '../../../types/canvasBuilder';
import { FONT_CATALOG, FONT_SIZE_PRESETS } from '../constants/fontCatalog';

interface TypographyInspectorProps {
  block: CanvasBlock;
  onUpdateStyles: (styles: Record<string, any>) => void;
  onUpdateContent: (content: Record<string, any>) => void;
}

export const TypographyInspector: React.FC<TypographyInspectorProps> = ({
  block,
  onUpdateStyles,
  onUpdateContent,
}) => {
  const styles = block.styles || {};
  const content = block.content || {};

  return (
    <div className="space-y-4">
      {/* Heading / Badge Tag (If applicable) */}
      {block.type === 'HEADING' && (
        <div className="space-y-3">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Top Badge Text (Optional)
            </label>
            <input
              type="text"
              value={content.badge || ''}
              onChange={(e) => onUpdateContent({ badge: e.target.value })}
              placeholder="e.g. Admissions 2026-27"
              className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              HTML Heading Level
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {['h1', 'h2', 'h3', 'h4'].map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => onUpdateContent({ tag: h })}
                  className={`py-1.5 rounded-lg text-xs font-bold uppercase border transition cursor-pointer ${
                    (content.tag || 'h2') === h
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {h}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Font Family Picker */}
      <div>
        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
          Font Family
        </label>
        <select
          value={styles.fontFamily || 'inherit'}
          onChange={(e) => onUpdateStyles({ fontFamily: e.target.value })}
          className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          {FONT_CATALOG.map((f) => (
            <option key={f.label} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
      </div>

      {/* Font Size & Weight Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
            Font Size
          </label>
          <select
            value={styles.fontSize || '16px'}
            onChange={(e) => onUpdateStyles({ fontSize: e.target.value })}
            className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            {FONT_SIZE_PRESETS.map((sz) => (
              <option key={sz.value} value={sz.value}>
                {sz.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
            Font Weight
          </label>
          <select
            value={styles.fontWeight || 'normal'}
            onChange={(e) => onUpdateStyles({ fontWeight: e.target.value })}
            className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="normal">Normal (400)</option>
            <option value="medium">Medium (500)</option>
            <option value="semibold">SemiBold (600)</option>
            <option value="bold">Bold (700)</option>
            <option value="extrabold">ExtraBold (800)</option>
          </select>
        </div>
      </div>

      {/* Text Alignment */}
      <div>
        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
          Text Alignment
        </label>
        <div className="grid grid-cols-4 gap-1.5">
          {[
            { align: 'left', icon: AlignLeft },
            { align: 'center', icon: AlignCenter },
            { align: 'right', icon: AlignRight },
            { align: 'justify', icon: AlignJustify },
          ].map(({ align, icon: IconComp }) => (
            <button
              key={align}
              type="button"
              onClick={() => onUpdateStyles({ alignment: align })}
              className={`p-2 rounded-xl flex items-center justify-center border transition cursor-pointer ${
                (styles.alignment || 'left') === align
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <IconComp className="w-4 h-4" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
