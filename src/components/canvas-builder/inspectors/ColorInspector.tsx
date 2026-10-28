import React from 'react';
import { CanvasBlock } from '../../../types/canvasBuilder';
import {
  TEXT_COLOR_PRESETS,
  BACKGROUND_COLOR_PRESETS,
  GRADIENT_PRESETS,
} from '../constants/colorPresets';

interface ColorInspectorProps {
  block: CanvasBlock;
  onUpdateStyles: (styles: Record<string, any>) => void;
}

export const ColorInspector: React.FC<ColorInspectorProps> = ({ block, onUpdateStyles }) => {
  const styles = block.styles || {};

  return (
    <div className="space-y-4">
      {/* 1. Text Color */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Text Color
          </label>
          <span className="text-[10px] font-mono text-slate-400">
            {styles.color || '#0f172a'}
          </span>
        </div>

        {/* Color Palette Swatches */}
        <div className="flex flex-wrap gap-1.5 mb-2">
          {TEXT_COLOR_PRESETS.map((c) => (
            <button
              key={c.name}
              type="button"
              title={c.name}
              onClick={() => onUpdateStyles({ color: c.value })}
              className={`w-6 h-6 rounded-full border border-slate-300 dark:border-slate-600 transition transform hover:scale-110 cursor-pointer shadow-2xs ${
                styles.color === c.value ? 'ring-2 ring-blue-500 ring-offset-2' : ''
              }`}
              style={{ backgroundColor: c.value }}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="color"
            value={styles.color?.startsWith('#') ? styles.color : '#0f172a'}
            onChange={(e) => onUpdateStyles({ color: e.target.value })}
            className="w-8 h-8 rounded-lg cursor-pointer border border-slate-200 dark:border-slate-700 bg-transparent p-0.5"
          />
          <input
            type="text"
            value={styles.color || ''}
            onChange={(e) => onUpdateStyles({ color: e.target.value })}
            placeholder="#0f172a or rgba(...)"
            className="flex-1 px-3 py-1.5 rounded-xl text-xs font-mono border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
          />
        </div>
      </div>

      {/* 2. Background Color / Fill */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Background Fill
          </label>
          <span className="text-[10px] font-mono text-slate-400">
            {styles.backgroundColor || 'transparent'}
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-2">
          {BACKGROUND_COLOR_PRESETS.map((c) => (
            <button
              key={c.name}
              type="button"
              title={c.name}
              onClick={() => onUpdateStyles({ backgroundColor: c.value, gradient: '' })}
              className={`w-6 h-6 rounded-full border border-slate-300 dark:border-slate-600 transition transform hover:scale-110 cursor-pointer shadow-2xs ${
                styles.backgroundColor === c.value && !styles.gradient
                  ? 'ring-2 ring-blue-500 ring-offset-2'
                  : ''
              }`}
              style={{ backgroundColor: c.value === 'transparent' ? '#ffffff' : c.value }}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="color"
            value={styles.backgroundColor?.startsWith('#') ? styles.backgroundColor : '#ffffff'}
            onChange={(e) => onUpdateStyles({ backgroundColor: e.target.value, gradient: '' })}
            className="w-8 h-8 rounded-lg cursor-pointer border border-slate-200 dark:border-slate-700 bg-transparent p-0.5"
          />
          <input
            type="text"
            value={styles.backgroundColor || ''}
            onChange={(e) => onUpdateStyles({ backgroundColor: e.target.value, gradient: '' })}
            placeholder="transparent or #ffffff"
            className="flex-1 px-3 py-1.5 rounded-xl text-xs font-mono border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
          />
        </div>
      </div>

      {/* 3. Modern Gradient Presets */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
          Background Gradient Presets
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {GRADIENT_PRESETS.map((g) => (
            <button
              key={g.name}
              type="button"
              onClick={() => onUpdateStyles({ gradient: g.value })}
              className={`h-8 rounded-xl border p-1 text-[9px] font-bold flex items-center justify-center text-center transition cursor-pointer ${
                styles.gradient === g.value
                  ? 'ring-2 ring-blue-500 border-blue-500'
                  : 'border-slate-200 dark:border-slate-700 hover:opacity-90'
              }`}
              style={{ background: g.value || '#f1f5f9' }}
            >
              <span className={g.value ? 'text-white drop-shadow-xs' : 'text-slate-600'}>
                {g.name.split(' ')[0]}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
