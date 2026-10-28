import { useState, useCallback } from 'react';
import { CanvasBlock } from '../../../types/canvasBuilder';

export function useCanvasHistory(initialBlocks: CanvasBlock[]) {
  const [history, setHistory] = useState<CanvasBlock[][]>([initialBlocks]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const currentBlocks = history[currentIndex] || initialBlocks;

  const pushState = useCallback(
    (newBlocks: CanvasBlock[]) => {
      setHistory((prev) => {
        const sliced = prev.slice(0, currentIndex + 1);
        return [...sliced, newBlocks];
      });
      setCurrentIndex((prev) => prev + 1);
    },
    [currentIndex]
  );

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentIndex, history.length]);

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  const resetHistory = useCallback((blocks: CanvasBlock[]) => {
    setHistory([blocks]);
    setCurrentIndex(0);
  }, []);

  return {
    blocks: currentBlocks,
    setBlocks: pushState,
    undo,
    redo,
    canUndo,
    canRedo,
    resetHistory,
  };
}
