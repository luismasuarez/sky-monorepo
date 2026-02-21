import { useDragAndDropContext } from './DragAndDropContext';

export function useDroppable(options: { type: string; targetId: string }) {
  const { setDropTarget } = useDragAndDropContext();

  function onDragOver(e: React.DragEvent) {
    e.preventDefault();
    setDropTarget({ targetId: options.targetId, type: options.type });
  }

  function onDrop() {
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
