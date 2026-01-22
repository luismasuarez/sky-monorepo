'use client';

import { DndContext } from '@dnd-kit/core';
import { useKanbanBoardContext } from './context/kanban-board-context';
import { KanbanBoardColumns } from './kanban-board-columns';
import { KanbanBoardSkeleton } from './kanban-board-skeleton';

export function KanbanBoard() {
  const { isLoading, handleDragEnd } = useKanbanBoardContext();

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full">
        {isLoading ? (
          <KanbanBoardSkeleton />
        ) : (
          <DndContext onDragEnd={handleDragEnd}>
            <KanbanBoardColumns />
          </DndContext>
        )}
      </div>
    </div>
  );
}
