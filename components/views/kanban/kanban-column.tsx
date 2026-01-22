import { KanbanColumn as KanbanColumnType, TaskStatus, TKanbanCard } from '@/lib/kanban-types';
import { cn } from '@/lib/utils';
import { useDroppable } from '@dnd-kit/core';
import { ReactNode } from 'react';
import { AddTaskDialog } from './add-task-dialog';
import ColumnTitle from './column-title';

export interface KanbanColumnProps {
  column: KanbanColumnType;
  onAddTask?: (columnStatus: TaskStatus) => void;
  onEditTask?: (task: TKanbanCard, columnStatus: TaskStatus) => void;
  children?: ReactNode | ReactNode[];
}

export function KanbanColumn({ column, children }: KanbanColumnProps) {
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
      <div className="flex justify-between items-center mb-2 sm:mb-4">
        <ColumnTitle
          indicatorColor={indicatorColor}
          title={column.title}
          cardCount={column.cards.length}
        />{' '}
        <AddTaskDialog />
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
