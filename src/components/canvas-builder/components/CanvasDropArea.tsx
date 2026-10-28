import React, { useState } from 'react';
import { Plus, LayoutTemplate } from 'lucide-react';
import { CanvasBlock, CanvasBlockStyle } from '../../../types/canvasBuilder';
import { CanvasBlockRenderer } from './CanvasBlockRenderer';

interface CanvasDropAreaProps {
  blocks: CanvasBlock[];
  selectedBlockId: string | null;
  previewMode: boolean;
  device: 'desktop' | 'tablet' | 'mobile';
  onSelectBlock: (id: string) => void;
  onUpdateContent: (id: string, content: Record<string, any>) => void;
  onUpdateStyles?: (id: string, styles: Partial<CanvasBlockStyle>) => void;
  onDeleteBlock: (id: string) => void;
  onDuplicateBlock: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  onAddBlock: (block: CanvasBlock, targetColumnId?: string) => void;
  onMoveBlockToTarget?: (
    draggedId: string,
    targetId: string | null,
    position: 'before' | 'after' | 'inside-column',
    targetColumnId?: string
  ) => void;
  onSelectSectionSettings?: () => void;
}

export const CanvasDropArea: React.FC<CanvasDropAreaProps> = ({
  blocks,
  selectedBlockId,
  previewMode,
  device,
  onSelectBlock,
  onUpdateContent,
  onUpdateStyles,
  onDeleteBlock,
  onDuplicateBlock,
  onMoveUp,
  onMoveDown,
  onAddBlock,
  onMoveBlockToTarget,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  // Device width wrapper class
  const deviceWidthClass = {
    desktop: 'w-full max-w-5xl',
    tablet: 'w-full max-w-[768px]',
    mobile: 'w-full max-w-[375px]',
  }[device];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    try {
      const data = e.dataTransfer.getData('application/json');
      if (data) {
        const parsed = JSON.parse(data);
        if (parsed.type === 'MOVE_BLOCK' && parsed.blockId) {
          // Reorder / move block to the end of canvas
          onMoveBlockToTarget?.(parsed.blockId, null, 'after');
        } else {
          onAddBlock(parsed);
        }
      }
    } catch (err) {
      console.error('Failed to parse dropped block', err);
    }
  };

  return (
    <div className="flex-1 h-full overflow-y-auto bg-slate-100 dark:bg-slate-950 p-6 flex flex-col items-center">
      {/* Device Canvas Frame */}
      <div
        className={`${deviceWidthClass} relative transition-all duration-300 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 p-6 md:p-8 space-y-4`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Render Blocks */}
        <div className="space-y-4 relative">
          {blocks.map((block) => (
            <CanvasBlockRenderer
              key={block.id}
              block={block}
              isSelected={selectedBlockId === block.id}
              selectedBlockId={selectedBlockId}
              previewMode={previewMode}
              onSelect={onSelectBlock}
              onUpdateContent={onUpdateContent}
              onUpdateStyles={onUpdateStyles}
              onDelete={onDeleteBlock}
              onDuplicate={onDuplicateBlock}
              onMoveUp={onMoveUp}
              onMoveDown={onMoveDown}
              onAddBlockToColumn={onAddBlock}
              onMoveBlockToTarget={onMoveBlockToTarget}
            />
          ))}

          {/* Empty State */}
          {blocks.length === 0 && (
            <div className="py-20 text-center flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-8">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
                <LayoutTemplate className="w-7 h-7" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Your Canvas is Empty
              </h4>
              <p className="text-xs text-slate-400 max-w-sm mt-1 mb-4">
                Drag blocks from the left sidebar or click any element in the palette to start building this section.
              </p>
            </div>
          )}

          {/* Bottom Drop Zone Guideline */}
          {!previewMode && (
            <div
              className={`py-4 rounded-2xl border-2 border-dashed transition-all flex items-center justify-center gap-2 text-xs font-bold cursor-pointer ${
                isDragOver
                  ? 'border-blue-500 bg-blue-50/60 dark:bg-blue-950/40 text-blue-600 scale-[1.01]'
                  : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 hover:text-slate-600'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>
                {isDragOver ? 'Drop Element Here' : 'Drag element from left or click (+) to add'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
