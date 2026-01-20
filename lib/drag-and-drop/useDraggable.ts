import { useDragAndDropContext } from './DragAndDropContext';

export function useDraggable<T>(item: T, options: { type: string; sourceId: string }) {
  const { setDraggedItem } = useDragAndDropContext();

  function onDragStart(e: React.DragEvent) {
    setDraggedItem({ item, sourceId: options.sourceId, type: options.type });
    e.dataTransfer.effectAllowed = 'move';
    // Transferir datos explícitos para zona de eliminar
    e.dataTransfer.setData('kanban-card-id', (item as any).id);
    e.dataTransfer.setData('kanban-source-column-id', (item as any).status || '');
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
