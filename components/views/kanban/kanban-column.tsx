import {
  KanbanCard as KanbanCardType,
  KanbanColumn as KanbanColumnType,
  TaskStatus,
} from '@/lib/kanban-types';
import { cn } from '@/lib/utils';
import { useDroppable } from '@dnd-kit/core';
import { ReactNode } from 'react';

export interface KanbanColumnProps {
  column: KanbanColumnType;
  indicatorColor: string;
  onAddTask?: (columnStatus: TaskStatus) => void;
  onEditTask?: (task: KanbanCardType, columnStatus: TaskStatus) => void;
  onCardDrop?: (draggedItem: KanbanCardType, sourceColumnId: string) => void;
  id: string;
  children?: ReactNode | ReactNode[];
}

export function KanbanColumn({ column, indicatorColor, onAddTask, children }: KanbanColumnProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: column.id,
  });

  function handleDrop() { }

  return (
    <div
      ref={setNodeRef}
      onDrop={handleDrop}
      className={cn(
        'glass-light dark:glass-dark rounded-xl p-3 sm:p-4 shadow-xl transition-all duration-200',
        isOver && 'scale-105'
      )}
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
        {children}
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
