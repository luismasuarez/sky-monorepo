import { useDragAndDropContext } from './DragAndDropContext';
import type { DraggedItem } from './types';

export function useDraggable<T>(item: T, options: { type: string; sourceId: string }) {
  const { setDraggedItem } = useDragAndDropContext();

  function onDragStart(e: React.DragEvent) {
    setDraggedItem({ item, sourceId: options.sourceId, type: options.type });
    e.dataTransfer.effectAllowed = 'move';
  }

  function onDragEnd() {
    setDraggedItem(null);
  }

  return {
    draggable: true,
    onDragStart,
    onDragEnd,
  };
}
