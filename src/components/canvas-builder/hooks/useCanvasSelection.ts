import { useState, useCallback } from 'react';
import { CanvasBlock, CanvasBlockStyle } from '../../../types/canvasBuilder';

export function useCanvasSelection(
  blocks: CanvasBlock[],
  setBlocks: (newBlocks: CanvasBlock[]) => void
) {
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  // Helper: Find block recursively
  const findBlockRecursive = (list: CanvasBlock[], id: string): CanvasBlock | null => {
    for (const b of list) {
      if (b.id === id) return b;
      if (b.columns) {
        for (const col of b.columns) {
          const found = findBlockRecursive(col.blocks, id);
          if (found) return found;
        }
      }
    }
    return null;
  };

  const selectedBlock = selectedBlockId ? findBlockRecursive(blocks, selectedBlockId) : null;

  // Helper: Update block recursively
  const updateBlockRecursive = (
    list: CanvasBlock[],
    id: string,
    updater: (b: CanvasBlock) => CanvasBlock
  ): CanvasBlock[] => {
    return list.map((b) => {
      if (b.id === id) {
        return updater(b);
      }
      if (b.columns) {
        return {
          ...b,
          columns: b.columns.map((col) => ({
            ...col,
            blocks: updateBlockRecursive(col.blocks, id, updater),
          })),
        };
      }
      return b;
    });
  };

  const updateBlockContent = useCallback(
    (id: string, contentUpdates: Record<string, any>) => {
      setBlocks(
        updateBlockRecursive(blocks, id, (b) => ({
          ...b,
          content: { ...b.content, ...contentUpdates },
        }))
      );
    },
    [blocks, setBlocks]
  );

  const updateBlockStyles = useCallback(
    (id: string, styleUpdates: Partial<CanvasBlockStyle>) => {
      setBlocks(
        updateBlockRecursive(blocks, id, (b) => ({
          ...b,
          styles: { ...b.styles, ...styleUpdates },
        }))
      );
    },
    [blocks, setBlocks]
  );

  // Delete a block recursively
  const deleteBlockRecursive = (list: CanvasBlock[], id: string): CanvasBlock[] => {
    return list
      .filter((b) => b.id !== id)
      .map((b) => {
        if (b.columns) {
          return {
            ...b,
            columns: b.columns.map((col) => ({
              ...col,
              blocks: deleteBlockRecursive(col.blocks, id),
            })),
          };
        }
        return b;
      });
  };

  const deleteBlock = useCallback(
    (id: string) => {
      setBlocks(deleteBlockRecursive(blocks, id));
      if (selectedBlockId === id) {
        setSelectedBlockId(null);
      }
    },
    [blocks, selectedBlockId, setBlocks]
  );

  // Duplicate a block
  const duplicateBlockRecursive = (list: CanvasBlock[], id: string): CanvasBlock[] => {
    const result: CanvasBlock[] = [];
    for (const b of list) {
      result.push(b);
      if (b.id === id) {
        const clone: CanvasBlock = {
          ...JSON.parse(JSON.stringify(b)),
          id: `blk-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        };
        result.push(clone);
      } else if (b.columns) {
        b.columns = b.columns.map((col) => ({
          ...col,
          blocks: duplicateBlockRecursive(col.blocks, id),
        }));
      }
    }
    return result;
  };

  const duplicateBlock = useCallback(
    (id: string) => {
      setBlocks(duplicateBlockRecursive(blocks, id));
    },
    [blocks, setBlocks]
  );

  // Move block up or down
  const moveBlock = useCallback(
    (id: string, direction: 'up' | 'down') => {
      const moveInList = (list: CanvasBlock[]): CanvasBlock[] => {
        const index = list.findIndex((b) => b.id === id);
        if (index !== -1) {
          const next = [...list];
          const targetIndex = direction === 'up' ? index - 1 : index + 1;
          if (targetIndex >= 0 && targetIndex < next.length) {
            const [moved] = next.splice(index, 1);
            next.splice(targetIndex, 0, moved);
            return next;
          }
          return list;
        }
        return list.map((b) => {
          if (b.columns) {
            return {
              ...b,
              columns: b.columns.map((col) => ({
                ...col,
                blocks: moveInList(col.blocks),
              })),
            };
          }
          return b;
        });
      };
      setBlocks(moveInList(blocks));
    },
    [blocks, setBlocks]
  );

  // Add block to target column or root
  const addBlock = useCallback(
    (newBlock: CanvasBlock, targetColumnId?: string) => {
      if (!targetColumnId) {
        setBlocks([...blocks, newBlock]);
        setSelectedBlockId(newBlock.id);
        return;
      }

      const addToColumn = (list: CanvasBlock[]): CanvasBlock[] => {
        return list.map((b) => {
          if (b.columns) {
            return {
              ...b,
              columns: b.columns.map((col) => {
                if (col.id === targetColumnId) {
                  return { ...col, blocks: [...col.blocks, newBlock] };
                }
                return { ...col, blocks: addToColumn(col.blocks) };
              }),
            };
          }
          return b;
        });
      };

      setBlocks(addToColumn(blocks));
      setSelectedBlockId(newBlock.id);
    },
    [blocks, setBlocks]
  );

  // Move block to specific target position (for drag and drop reordering)
  const moveBlockToTarget = useCallback(
    (
      draggedId: string,
      targetId: string | null,
      position: 'before' | 'after' | 'inside-column',
      targetColumnId?: string
    ) => {
      // Step 1: Find the dragged block
      const draggedBlock = findBlockRecursive(blocks, draggedId);
      if (!draggedBlock) return;

      // Don't do anything if dragging onto itself
      if (draggedId === targetId) return;

      // Step 2: Remove the block from the tree
      const withoutDragged = deleteBlockRecursive(blocks, draggedId);

      // Step 3: Insert at destination
      if (position === 'inside-column' && targetColumnId) {
        const insertIntoColumn = (list: CanvasBlock[]): CanvasBlock[] => {
          return list.map((b) => {
            if (b.columns) {
              return {
                ...b,
                columns: b.columns.map((col) => {
                  if (col.id === targetColumnId) {
                    return { ...col, blocks: [...col.blocks, draggedBlock] };
                  }
                  return { ...col, blocks: insertIntoColumn(col.blocks) };
                }),
              };
            }
            return b;
          });
        };
        const updated = insertIntoColumn(withoutDragged);
        setBlocks(updated);
        setSelectedBlockId(draggedId);
        return;
      }

      if (!targetId) {
        // Append to root
        setBlocks([...withoutDragged, draggedBlock]);
        setSelectedBlockId(draggedId);
        return;
      }

      const insertAdjacent = (list: CanvasBlock[]): { updatedList: CanvasBlock[]; inserted: boolean } => {
        const index = list.findIndex((b) => b.id === targetId);
        if (index !== -1) {
          const next = [...list];
          const insertIndex = position === 'before' ? index : index + 1;
          next.splice(insertIndex, 0, draggedBlock);
          return { updatedList: next, inserted: true };
        }

        let wasInserted = false;
        const nextList = list.map((b) => {
          if (b.columns && !wasInserted) {
            return {
              ...b,
              columns: b.columns.map((col) => {
                const result = insertAdjacent(col.blocks);
                if (result.inserted) {
                  wasInserted = true;
                  return { ...col, blocks: result.updatedList };
                }
                return col;
              }),
            };
          }
          return b;
        });

        return { updatedList: nextList, inserted: wasInserted };
      };

      const result = insertAdjacent(withoutDragged);
      if (result.inserted) {
        setBlocks(result.updatedList);
      } else {
        // Fallback: append to root
        setBlocks([...withoutDragged, draggedBlock]);
      }
      setSelectedBlockId(draggedId);
    },
    [blocks, setBlocks]
  );

  return {
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
  };
}
