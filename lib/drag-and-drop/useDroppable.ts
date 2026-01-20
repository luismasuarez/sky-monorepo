import { useDragAndDropContext } from './DragAndDropContext';
import type { DropTargetInfo } from './types';

export function useDroppable(options: { type: string; targetId: string }) {
  const { setDropTarget } = useDragAndDropContext();

  function onDragOver(e: React.DragEvent) {
    e.preventDefault();
    setDropTarget({ targetId: options.targetId, type: options.type });
  }

  function onDrop(e: React.DragEvent) {
    setDropTarget(null);
  }

  function onDragLeave() {
    setDropTarget(null);
  }

  return {
    onDragOver,
    onDrop,
    onDragLeave,
  };
}
