import { KanbanColumn as KanbanColumnType, TaskStatus } from '@/lib/kanban-types';
import { cn } from '@/lib/utils';
import { useDroppable } from '@dnd-kit/core';
import { ReactNode } from 'react';
import { AddTaskDialog } from './add-task-dialog';
import ColumnTitle from './column-title';

export interface KanbanColumnProps {
  column: KanbanColumnType;
  children?: ReactNode;
}

export function KanbanColumn({ column, children }: KanbanColumnProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: column.id,
  });

  const STATUS_INDICATOR: Record<TaskStatus, string> = {
    todo: 'bg-red-400',
    'in-progress': 'bg-yellow-400',
    review: 'bg-blue-400',
    done: 'bg-green-400',
  };

  const indicatorColor = STATUS_INDICATOR[column.status];

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'glass-light dark:glass-dark rounded-xl p-3 sm:p-4 shadow-xl transition-transform duration-200',
        isOver && 'bg-slate-100 dark:bg-slate-800'
      )}
    >
      <div className="flex justify-between items-center mb-2 sm:mb-4">
        <ColumnTitle
          indicatorColor={indicatorColor}
          title={column.title}
          cardCount={column.cards.length}
        />{' '}
        <AddTaskDialog columnStatus={column.status} />
      </div>
      <div className="flex-1 space-y-2 sm:space-y-3 max-h-[58vh]">{children}</div>
    </div>
  );
}

export default KanbanColumn;
