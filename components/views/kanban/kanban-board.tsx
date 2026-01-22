'use client';

import { TaskStatus, type KanbanCard as TKanbanCard } from '@/lib/kanban-types';
import { KanbanMockData, KanbanTaskMock } from '@/lib/mocks';
import { DndContext } from '@dnd-kit/core';
import { useKanbanBoardContext } from './kanban-board-context';
import KanbanCard from './kanban-card';
import KanbanColumn from './kanban-column';
import KanbanColumnSkeleton from './kanban-column-skeleton';

// Utilidad para mapear KanbanTaskMock a KanbanCard
function mapMockToCard(task: KanbanTaskMock): TKanbanCard {
  return {
    id: task.id,
    projectId: task.projectId,
    workspaceId: task.workspaceId,
    teamId: task.teamId,
    title: task.title,
    description: task.description,
    column: task.column,
    status: task.column as TaskStatus,
    priority: task.priority || 'medium',
    assignedTo: task.assignedTo,
    estimatedTime: task.estimatedTime,
    startTime: task.startTime ? new Date(task.startTime).toISOString() : undefined,
    completedTime: task.completedTime ? new Date(task.completedTime).toISOString() : undefined,
    totalTime: task.totalTime,
    pausedTime: task.pausedTime,
    isPaused: !!task.isPaused,
    lastPauseStart: task.lastPauseStart ? new Date(task.lastPauseStart).toISOString() : undefined,
    isOvertime: !!task.isOvertime,
    notificationSent: !!task.notificationSent,
    quoteAmount: task.quoteAmount,
    tags: task.tags || [],
    dueDate: task.dueDate ? new Date(task.dueDate).toISOString() : undefined,
    order: 0,
    createdAt: new Date(task.createdAt).toISOString(),
    updatedAt: new Date(task.updatedAt).toISOString(),
    createdBy: task.createdBy,
  };
}

export interface KanbanBoardProps {
  kanbanData: KanbanMockData;
  onAddTask?: (column: TaskStatus) => void;
  onEditTask?: (task: KanbanTaskMock, column: TaskStatus) => void;
  isLoading?: boolean;
}

export function KanbanBoard({ onAddTask, isLoading = false }: KanbanBoardProps) {
  const { columns, moveCard } = useKanbanBoardContext();

  return (
    <DndContext
      onDragEnd={({ active, over }) => {
        if (!over) return;

        const cardId = active.id;
        const targetColumnId = over.id;
        const sourceColumnId = columns.find(col => col.cards.some(card => card.id === cardId))?.id;

        if (!sourceColumnId) return;

        if (sourceColumnId !== targetColumnId) {
          moveCard(cardId.toString(), sourceColumnId, targetColumnId.toString());
        }
      }}
    >
      <div className="flex flex-col gap-6 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 items-stretch w-full">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
              <KanbanColumnSkeleton key={i} cardCount={3} />
            ))
            : columns.map(column => (
              <KanbanColumn key={column.id} column={column} onAddTask={onAddTask}>
                {column.cards.map(card => {
                  if (column.id === card.column) {
                    return <KanbanCard key={card.id} item={card} />;
                  }
                  return <KanbanCard key={card.id} item={card} />;
                })}
              </KanbanColumn>
            ))}
        </div>
      </div>
    </DndContext>
  );
}
