import React, { useState } from 'react';
import { CustomCanvasContent, CanvasBlock } from '../../types/canvasBuilder';
import { useCanvasHistory } from './hooks/useCanvasHistory';
import { useCanvasSelection } from './hooks/useCanvasSelection';
import { CanvasTopBar } from './components/CanvasTopBar';
import { BlockPaletteSidebar } from './components/BlockPaletteSidebar';
import { CanvasDropArea } from './components/CanvasDropArea';
import { BlockPropertyInspector } from './inspectors/BlockPropertyInspector';
import { INITIAL_CANVAS_STARTER } from './constants/defaultBlocks';
import { PanelLeftOpen, PanelRightOpen, Plus, SlidersHorizontal } from 'lucide-react';

interface VisualCanvasEditorProps {
  initialContent?: CustomCanvasContent | Record<string, any>;
  onSaveContent: (content: CustomCanvasContent) => void;
  onSyncFromLayout?: () => void;
  sectionTitle?: string;
  isSaving?: boolean;
  availablePages?: { id?: string | number; title: string; slug: string }[];
}

export const VisualCanvasEditor: React.FC<VisualCanvasEditorProps> = ({
  initialContent,
  onSaveContent,
  onSyncFromLayout,
  sectionTitle,
  isSaving = false,
  availablePages = [],
}) => {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [previewMode, setPreviewMode] = useState<boolean>(false);
  const [showLeftSidebar, setShowLeftSidebar] = useState<boolean>(true);
  const [showRightSidebar, setShowRightSidebar] = useState<boolean>(true);

  // Initialize blocks from content or starter
  const initialBlocks: CanvasBlock[] =
    initialContent && Array.isArray(initialContent.blocks) && initialContent.blocks.length > 0
      ? initialContent.blocks
      : INITIAL_CANVAS_STARTER;

  // History hook (undo/redo)
  const { blocks, setBlocks, undo, redo, canUndo, canRedo } = useCanvasHistory(initialBlocks);

  // Selection & Tree mutations hook
  const {
    selectedBlockId,
    selectedBlock,
    setSelectedBlockId,
    updateBlockContent,
    updateBlockStyles,
    deleteBlock,
    duplicateBlock,
    moveBlock,
    addBlock,
    moveBlockToTarget,
  } = useCanvasSelection(blocks, setBlocks);

  // Sync blocks and canvas payload to parent in real-time
  React.useEffect(() => {
    const payload: CustomCanvasContent = {
      canvasVersion: '1.0',
      containerWidth: initialContent?.containerWidth || 'standard',
      backgroundColor: initialContent?.backgroundColor || undefined,
      gradient: initialContent?.gradient || undefined,
      blocks,
    };
    onSaveContent(payload);
  }, [blocks]);

  const handleSave = () => {
    const payload: CustomCanvasContent = {
      canvasVersion: '1.0',
      containerWidth: initialContent?.containerWidth || 'standard',
      backgroundColor: initialContent?.backgroundColor || undefined,
      gradient: initialContent?.gradient || undefined,
      blocks,
    };
    onSaveContent(payload);
  };

  const handleSelectBlock = (id: string | null) => {
    setSelectedBlockId(id);
    if (id) {
      setShowRightSidebar(true);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 overflow-hidden select-none">
      {/* 1. Top Bar */}
      <CanvasTopBar
        device={device}
        onDeviceChange={setDevice}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={undo}
        onRedo={redo}
        previewMode={previewMode}
        onTogglePreview={() => setPreviewMode(!previewMode)}
        showLeftPanel={showLeftSidebar}
        onToggleLeftPanel={() => setShowLeftSidebar(!showLeftSidebar)}
        showRightPanel={showRightSidebar}
        onToggleRightPanel={() => setShowRightSidebar(!showRightSidebar)}
        onSave={handleSave}
        onSyncFromLayout={onSyncFromLayout}
        isSaving={isSaving}
        sectionTitle={sectionTitle}
      />

      {/* 2. 3-Panel Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Block Library (Hidden in preview mode, Collapsible in edit mode) */}
        {!previewMode && (
          <>
            {showLeftSidebar ? (
              <div className="w-72 shrink-0 h-full overflow-hidden border-r border-slate-200 dark:border-slate-800 transition-all duration-300">
                <BlockPaletteSidebar
                  onAddBlock={(b) => addBlock(b)}
                  onClose={() => setShowLeftSidebar(false)}
                />
              </div>
            ) : (
              <div className="w-11 shrink-0 h-full bg-slate-50 dark:bg-slate-900/90 border-r border-slate-200 dark:border-slate-800 flex flex-col items-center py-3 gap-3 transition-all duration-300 select-none">
                <button
                  type="button"
                  onClick={() => setShowLeftSidebar(true)}
                  className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 border border-blue-200 dark:border-blue-800 transition shadow-2xs cursor-pointer"
                  title="Open Block Elements Panel"
                >
                  <PanelLeftOpen className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setShowLeftSidebar(true)}
                  className="flex-1 flex flex-col items-center justify-center text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer gap-2 py-4 group"
                  title="Open Block Elements"
                >
                  <Plus className="w-3.5 h-3.5 group-hover:scale-125 transition duration-200" />
                  <span className="text-[10px] font-bold tracking-widest uppercase [writing-mode:vertical-lr] rotate-180">
                    Add Blocks
                  </span>
                </button>
              </div>
            )}
          </>
        )}

        {/* Center Panel: Live Droppable Canvas */}
        <CanvasDropArea
          blocks={blocks}
          selectedBlockId={selectedBlockId}
          previewMode={previewMode}
          device={device}
          onSelectBlock={handleSelectBlock}
          onUpdateContent={updateBlockContent}
          onUpdateStyles={updateBlockStyles}
          onDeleteBlock={deleteBlock}
          onDuplicateBlock={duplicateBlock}
          onMoveUp={(id) => moveBlock(id, 'up')}
          onMoveDown={(id) => moveBlock(id, 'down')}
          onAddBlock={(b) => addBlock(b)}
          onMoveBlockToTarget={moveBlockToTarget}
        />

        {/* Right Panel: Style & Typography Inspector (Hidden in preview mode, Collapsible in edit mode) */}
        {!previewMode && (
          <>
            {showRightSidebar ? (
              <div className="w-80 shrink-0 h-full overflow-hidden border-l border-slate-200 dark:border-slate-800 transition-all duration-300">
                <BlockPropertyInspector
                  block={selectedBlock}
                  onUpdateContent={updateBlockContent}
                  onUpdateStyles={updateBlockStyles}
                  onDelete={deleteBlock}
                  onDuplicate={duplicateBlock}
                  onMoveUp={(id) => moveBlock(id, 'up')}
                  onMoveDown={(id) => moveBlock(id, 'down')}
                  onClose={() => setShowRightSidebar(false)}
                  availablePages={availablePages}
                />
              </div>
            ) : (
              <div className="w-11 shrink-0 h-full bg-slate-50 dark:bg-slate-900/90 border-l border-slate-200 dark:border-slate-800 flex flex-col items-center py-3 gap-3 transition-all duration-300 select-none">
                <button
                  type="button"
                  onClick={() => setShowRightSidebar(true)}
                  className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 border border-blue-200 dark:border-blue-800 transition shadow-2xs cursor-pointer"
                  title="Open Properties Inspector"
                >
                  <PanelRightOpen className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setShowRightSidebar(true)}
                  className="flex-1 flex flex-col items-center justify-center text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer gap-2 py-4 group"
                  title="Open Properties Inspector"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 group-hover:scale-125 transition duration-200" />
                  <span className="text-[10px] font-bold tracking-widest uppercase [writing-mode:vertical-lr] rotate-180">
                    Properties
                  </span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
