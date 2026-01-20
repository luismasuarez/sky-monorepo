import { useDroppable } from '@/lib/drag-and-drop/useDroppable';
import * as React from 'react';

export interface KanbanDeleteZoneProps {
  onDropCard: (cardId: string, sourceColumnId: string) => void;
  isActive?: boolean;
}

export function KanbanDeleteZone({ onDropCard, isActive }: KanbanDeleteZoneProps) {
  const droppableProps = useDroppable({
    type: 'kanban-card',
    targetId: 'delete-zone',
  });

  function handleDrop(e: React.DragEvent) {
    droppableProps.onDrop(e);
    const cardId = e.dataTransfer.getData('kanban-card-id');
    const sourceColumnId = e.dataTransfer.getData('kanban-source-column-id');
    if (cardId && sourceColumnId) {
      onDropCard(cardId, sourceColumnId);
    }
  }

  return (
    <div
      {...droppableProps}
      onDrop={handleDrop}
      className={`fixed left-0 right-0 bottom-0 z-50 flex items-center justify-center h-20 sm:h-24 transition-all duration-200 border-t-4 border-red-400 bg-red-100/90 dark:bg-red-900/80 ${isActive ? 'bg-red-200/95 dark:bg-red-800/95' : ''}`}
    >
      <span className="text-red-700 dark:text-red-200 font-bold text-lg sm:text-xl select-none flex items-center gap-2">
        <span className="text-2xl">🗑️</span> Arrastra aquí para eliminar
      </span>
    </div>
  );
}
