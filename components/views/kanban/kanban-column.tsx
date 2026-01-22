import {
  KanbanCard as KanbanCardType,
  KanbanColumn as KanbanColumnType,
  TaskStatus,
} from '@/lib/kanban-types';
import { cn } from '@/lib/utils';
import { useDroppable } from '@dnd-kit/core';
import { ReactNode } from 'react';
import ColumnAction from './column-action';
import ColumnTitle from './column-title';

export interface KanbanColumnProps {
  column: KanbanColumnType;
  onAddTask?: (columnStatus: TaskStatus) => void;
  onEditTask?: (task: KanbanCardType, columnStatus: TaskStatus) => void;
  children?: ReactNode | ReactNode[];
}

export function KanbanColumn({ column, onAddTask, children }: KanbanColumnProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: column.id,
  });

  const indicatorColor =
    column.status === 'todo'
      ? 'bg-red-400'
      : column.status === 'in-progress'
        ? 'bg-yellow-400'
        : column.status === 'review'
          ? 'bg-blue-400'
          : 'bg-green-400';

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
      <div className="flex justify-between items-start mb-2">
        <ColumnTitle
          indicatorColor={indicatorColor}
          title={column.title}
          cardCount={column.cards.length}
        />
        <ColumnAction onAddTask={() => onAddTask && onAddTask(column.status)} />
      </div>
      <div
        className="flex-1 space-y-2 sm:space-y-3"
        style={{ maxHeight: 'var(--kanban-col-max-h, 58vh)' }}
      >
        {children}
      </div>
    </div>
  );
}

export default KanbanColumn;
