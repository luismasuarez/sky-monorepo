import { useDragAndDropContext } from '@/lib/drag-and-drop/DragAndDropContext';
import { useDroppable } from '@/lib/drag-and-drop/useDroppable';
import {
  KanbanCard as KanbanCardType,
  KanbanColumn as KanbanColumnType,
  TaskStatus,
} from '@/lib/kanban-types';
import * as React from 'react';
import KanbanCard from './kanban-card';

export interface KanbanColumnProps {
  column: KanbanColumnType;
  indicatorColor: string;
  onAddTask?: (columnStatus: TaskStatus) => void;
  onEditTask?: (task: KanbanCardType, columnStatus: TaskStatus) => void;
  onCardDrop?: (draggedItem: KanbanCardType, sourceColumnId: string) => void;
}

export function KanbanColumn({
  column,
  indicatorColor,
  onAddTask,
  onEditTask,
  onCardDrop,
}: KanbanColumnProps) {
  // Drop integration (hook debe ir dentro del cuerpo de la función)
  const droppableProps = useDroppable({
    type: 'kanban-card',
    targetId: column.id,
  });

  const { draggedItem, dropTarget } = useDragAndDropContext();

  // Highlight si la columna es el drop target actual
  const isDropTarget = dropTarget?.type === 'kanban-card' && dropTarget?.targetId === column.id;

  function handleDrop(e: React.DragEvent) {
    droppableProps.onDrop();
    // Si hay item arrastrado y callback, notificar al board
    if (draggedItem && draggedItem.type === 'kanban-card' && onCardDrop) {
      const item = draggedItem.item as KanbanCardType;
      // Se espera que sourceId sea el id de la columna origen
      const sourceColumnId = item.status
        .replace('in-progress', 'in-progress')
        .replace('todo', 'todo')
        .replace('review', 'review')
        .replace('done', 'done');
      onCardDrop(item, sourceColumnId);
    }
  }

  return (
    <div
      {...droppableProps}
      onDrop={handleDrop}
      className={`glass-light dark:glass-dark rounded-xl p-3 sm:p-4 shadow-xl transition-all duration-200
        ${isDropTarget ? 'ring-4 ring-blue-400/60 scale-[1.02] shadow-2xl z-10' : ''}`}
    >
      <h2 className="text-slate-900 dark:text-slate-100 font-bold text-base sm:text-lg mb-3 sm:mb-4 flex items-center text-shadow-sm">
        <div
          className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${indicatorColor} rounded-full mr-2 shadow-sm`}
        ></div>
        <span className="truncate">
          {column.title} ({column.cards.length})
        </span>
      </h2>
      <div
        className="flex-1 overflow-y-auto space-y-2 sm:space-y-3"
        style={{ maxHeight: 'var(--kanban-col-max-h, 58vh)' }}
      >
        {column.cards.map(item => (
          <KanbanCard
            key={item.id}
            item={item}
            onEdit={onEditTask ? itm => onEditTask(itm, column.status) : undefined}
          />
        ))}
        <button
          onClick={() => onAddTask?.(column.status)}
          className="w-full bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 border-2 border-dashed border-slate-300/60 dark:border-slate-600/60 rounded-lg p-2 sm:p-3 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-all duration-200 text-xs sm:text-sm font-semibold backdrop-blur-sm mt-2"
        >
          + Add Task
        </button>
      </div>
    </div>
  );
}

export default KanbanColumn;
