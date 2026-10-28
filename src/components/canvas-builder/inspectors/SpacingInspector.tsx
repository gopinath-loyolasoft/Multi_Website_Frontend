import React from 'react';
import { CanvasBlock } from '../../../types/canvasBuilder';
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  Maximize2,
  MoveHorizontal,
  MoveVertical,
  Move,
  Layers,
  BringToFront,
  SendToBack,
  RotateCw,
} from 'lucide-react';

interface SpacingInspectorProps {
  block: CanvasBlock;
  onUpdateStyles: (styles: Record<string, any>) => void;
}

export const SpacingInspector: React.FC<SpacingInspectorProps> = ({ block, onUpdateStyles }) => {
  const styles = block.styles || {};
  const isFloating = styles.positionMode === 'floating';

  return (
    <div className="space-y-5">
      {/* 0. MS Word Positioning Mode (Flow vs Free Floating) */}
      <div>
        <label className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
          <span className="flex items-center gap-1.5">
            <Move className="w-3.5 h-3.5 text-blue-600" />
            <span>Positioning Mode</span>
          </span>
          <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400 font-bold">
            {isFloating ? 'Free Floating (MS Word)' : 'Document Flow'}
          </span>
        </label>
        <div className="grid grid-cols-2 gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl">
          <button
            type="button"
            onClick={() =>
              onUpdateStyles({
                positionMode: 'flow',
                posX: undefined,
                posY: undefined,
                zIndex: undefined,
              })
            }
            className={`py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              !isFloating
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <AlignLeft className="w-3.5 h-3.5" />
            <span>Document Flow</span>
          </button>
          <button
            type="button"
            onClick={() =>
              onUpdateStyles({
                positionMode: 'floating',
                posX: styles.posX ?? 40,
                posY: styles.posY ?? 40,
                zIndex: styles.zIndex ?? 10,
                width: styles.width || '320px',
              })
            }
            className={`py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              isFloating
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Move className="w-3.5 h-3.5" />
            <span>Free Floating</span>
          </button>
        </div>
      </div>

      {/* 0B. Coordinates & Layer Controls (When Floating) */}
      {isFloating && (
        <div className="p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/50 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-900 dark:text-blue-300">
              Coordinates (X, Y)
            </span>
            <span className="text-[10px] font-mono text-slate-500">
              Drag on canvas or enter px
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1">
                X Position (Left)
              </label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={styles.posX ?? 40}
                  onChange={(e) => onUpdateStyles({ posX: Number(e.target.value) })}
                  className="w-full px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                />
                <span className="text-xs text-slate-400">px</span>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1">
                Y Position (Top)
              </label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={styles.posY ?? 40}
                  onChange={(e) => onUpdateStyles({ posY: Number(e.target.value) })}
                  className="w-full px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                />
                <span className="text-xs text-slate-400">px</span>
              </div>
            </div>
          </div>

          {/* Layer Depth / Z-Index */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1">
              Layer Order (Z-Index)
            </label>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() =>
                  onUpdateStyles({ zIndex: Math.max(1, (styles.zIndex || 10) - 1) })
                }
                className="flex-1 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 flex items-center justify-center gap-1 cursor-pointer"
              >
                <SendToBack className="w-3.5 h-3.5" />
                <span>Send Back</span>
              </button>
              <div className="w-14 px-2 py-1.5 rounded-lg text-xs font-mono font-bold text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                {styles.zIndex ?? 10}
              </div>
              <button
                type="button"
                onClick={() => onUpdateStyles({ zIndex: (styles.zIndex || 10) + 1 })}
                className="flex-1 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 flex items-center justify-center gap-1 cursor-pointer"
              >
                <BringToFront className="w-3.5 h-3.5" />
                <span>Bring Front</span>
              </button>
            </div>
          </div>

          {/* Rotation */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="flex items-center gap-1 text-[10px] font-bold text-slate-500">
                <RotateCw className="w-3 h-3 text-blue-600" />
                <span>Rotation</span>
              </label>
              <span className="text-[10px] font-mono font-bold text-blue-600">
                {styles.rotation || 0}°
              </span>
            </div>
            <div className="grid grid-cols-5 gap-1">
              {[0, 45, 90, 180, 270].map((deg) => (
                <button
                  key={deg}
                  type="button"
                  onClick={() => onUpdateStyles({ rotation: deg === 0 ? undefined : deg })}
                  className={`py-1 rounded-md text-[10px] font-bold border transition cursor-pointer ${
                    (styles.rotation || 0) === deg
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800'
                  }`}
                >
                  {deg}°
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 1. Block Width Controls */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            <MoveHorizontal className="w-3.5 h-3.5 text-blue-600" />
            <span>Block Width</span>
          </label>
          <span className="text-[11px] font-mono text-blue-600 dark:text-blue-400 font-semibold">
            {styles.width || 'Auto (100%)'}
          </span>
        </div>

        <div className="grid grid-cols-6 gap-1 mb-2">
          {[
            { label: 'Auto', val: 'auto' },
            { label: '25%', val: '25%' },
            { label: '33%', val: '33.333%' },
            { label: '50%', val: '50%' },
            { label: '75%', val: '75%' },
            { label: '100%', val: '100%' },
          ].map(({ label, val }) => (
            <button
              key={val}
              type="button"
              onClick={() => onUpdateStyles({ width: val === 'auto' ? undefined : val })}
              className={`py-1.5 rounded-lg text-[10px] font-bold border transition cursor-pointer ${
                (styles.width || 'auto') === val || (!styles.width && val === 'auto')
                  ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="e.g. 450px or 60%"
            value={styles.width || ''}
            onChange={(e) => onUpdateStyles({ width: e.target.value })}
            className="flex-1 px-3 py-1.5 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500/20"
          />
          {styles.width && (
            <button
              type="button"
              onClick={() => onUpdateStyles({ width: undefined })}
              className="px-2.5 py-1.5 rounded-xl text-[10px] font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-700"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* 2. Block Height / Min-Height Controls */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            <MoveVertical className="w-3.5 h-3.5 text-blue-600" />
            <span>Height / Min-Height</span>
          </label>
          <span className="text-[11px] font-mono text-blue-600 dark:text-blue-400 font-semibold">
            {styles.minHeight || styles.height || 'Auto'}
          </span>
        </div>

        <div className="grid grid-cols-6 gap-1 mb-2">
          {[
            { label: 'Auto', val: 'auto' },
            { label: '100px', val: '100px' },
            { label: '180px', val: '180px' },
            { label: '260px', val: '260px' },
            { label: '380px', val: '380px' },
            { label: '500px', val: '500px' },
          ].map(({ label, val }) => (
            <button
              key={val}
              type="button"
              onClick={() => onUpdateStyles({ minHeight: val === 'auto' ? undefined : val, height: undefined })}
              className={`py-1.5 rounded-lg text-[10px] font-bold border transition cursor-pointer ${
                (styles.minHeight || 'auto') === val || (!styles.minHeight && !styles.height && val === 'auto')
                  ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="e.g. 250px or 40vh"
            value={styles.minHeight || styles.height || ''}
            onChange={(e) => onUpdateStyles({ minHeight: e.target.value })}
            className="flex-1 px-3 py-1.5 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500/20"
          />
          {(styles.minHeight || styles.height) && (
            <button
              type="button"
              onClick={() => onUpdateStyles({ minHeight: undefined, height: undefined })}
              className="px-2.5 py-1.5 rounded-xl text-[10px] font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-700"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* 3. Block Horizontal Position & Self Alignment */}
      <div>
        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
          Block Alignment & Position
        </label>
        <div className="grid grid-cols-4 gap-1">
          {[
            { label: 'Left', val: 'start', icon: AlignLeft },
            { label: 'Center', val: 'center', icon: AlignCenter },
            { label: 'Right', val: 'end', icon: AlignRight },
            { label: 'Stretch', val: 'stretch', icon: Maximize2 },
          ].map(({ label, val, icon: Icon }) => (
            <button
              key={val}
              type="button"
              onClick={() => onUpdateStyles({ flexAlignment: val })}
              className={`py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 border transition cursor-pointer ${
                (styles.flexAlignment || 'stretch') === val
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Divider */}
      <hr className="border-slate-100 dark:border-slate-800" />

      {/* 4. Inside Padding (Y & X) */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
            Padding Top/Bottom
          </label>
          <select
            value={styles.paddingY || 'none'}
            onChange={(e) => onUpdateStyles({ paddingY: e.target.value })}
            className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
          >
            <option value="none">None (0px)</option>
            <option value="sm">Small (12px)</option>
            <option value="md">Medium (24px)</option>
            <option value="lg">Large (40px)</option>
            <option value="xl">Extra Large (64px)</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
            Padding Left/Right
          </label>
          <select
            value={styles.paddingX || 'none'}
            onChange={(e) => onUpdateStyles({ paddingX: e.target.value })}
            className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
          >
            <option value="none">None (0px)</option>
            <option value="sm">Small (12px)</option>
            <option value="md">Medium (24px)</option>
            <option value="lg">Large (40px)</option>
            <option value="xl">Extra Large (64px)</option>
          </select>
        </div>
      </div>

      {/* 5. Outside Margin (Y) */}
      <div>
        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
          Spacing Margin (Top & Bottom)
        </label>
        <select
          value={styles.marginY || 'sm'}
          onChange={(e) => onUpdateStyles({ marginY: e.target.value })}
          className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
        >
          <option value="none">None (0px)</option>
          <option value="sm">Small (8px)</option>
          <option value="md">Medium (20px)</option>
          <option value="lg">Large (36px)</option>
          <option value="xl">Extra Large (56px)</option>
        </select>
      </div>

      {/* 6. Corner Rounding (Border Radius) */}
      <div>
        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
          Corner Rounding (Radius)
        </label>
        <div className="grid grid-cols-5 gap-1">
          {[
            { label: 'Sharp', val: 'none' },
            { label: 'SM', val: 'sm' },
            { label: 'MD', val: 'md' },
            { label: '2XL', val: '2xl' },
            { label: 'Pill', val: 'full' },
          ].map(({ label, val }) => (
            <button
              key={val}
              type="button"
              onClick={() => onUpdateStyles({ borderRadius: val })}
              className={`py-1.5 rounded-lg text-[11px] font-bold border transition cursor-pointer ${
                (styles.borderRadius || 'none') === val
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* 7. Drop Shadow Elevation */}
      <div>
        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
          Drop Shadow Elevation
        </label>
        <div className="grid grid-cols-5 gap-1">
          {[
            { label: 'None', val: 'none' },
            { label: 'Soft', val: 'sm' },
            { label: 'Card', val: 'md' },
            { label: 'Lift', val: 'lg' },
            { label: 'Glow', val: 'xl' },
          ].map(({ label, val }) => (
            <button
              key={val}
              type="button"
              onClick={() => onUpdateStyles({ shadow: val })}
              className={`py-1.5 rounded-lg text-[11px] font-bold border transition cursor-pointer ${
                (styles.shadow || 'none') === val
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
