'use client';

import { DndContext } from '@dnd-kit/core';
import { useKanbanBoardContext } from './context/kanban-board-context';
import KanbanCard from './kanban-card';
import KanbanColumn from './kanban-column';
import KanbanColumnSkeleton from './kanban-column-skeleton';

export function KanbanBoard() {
  const { isLoading, columns, moveCard } = useKanbanBoardContext();

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
              <KanbanColumn key={column.id} column={column} onAddTask={() => { }}>
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
