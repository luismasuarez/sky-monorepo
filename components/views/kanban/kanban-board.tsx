import { KanbanCard, KanbanColumn as KanbanColumnType, TaskStatus } from '@/lib/kanban-types';
import { KanbanMockData, KanbanTaskMock } from '@/lib/mocks';
import { useState } from 'react';
import KanbanColumn from './kanban-column';

// Utilidad para mapear KanbanTaskMock a KanbanCard
function mapMockToCard(task: KanbanTaskMock): KanbanCard {
  return {
    id: task.id,
    projectId: task.projectId,
    workspaceId: task.workspaceId,
    teamId: task.teamId,
    title: task.title,
    description: task.description,
    status: (task.column === 'inProgress' ? 'in-progress' : task.column) as TaskStatus,
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
}

export function KanbanBoard({ kanbanData, onAddTask }: KanbanBoardProps) {
  // Estado local para columnas y tarjetas
  const [columns, setColumns] = useState<KanbanColumnType[]>([
    {
      id: 'todo',
      title: 'To Do',
      status: 'todo',
      cards: kanbanData.todo.map(mapMockToCard),
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      status: 'in-progress',
      cards: kanbanData.inProgress.map(mapMockToCard),
    },
    {
      id: 'review',
      title: 'Review',
      status: 'review',
      cards: kanbanData.review.map(mapMockToCard),
    },
    {
      id: 'done',
      title: 'Done',
      status: 'done',
      cards: kanbanData.done.map(mapMockToCard),
    },
  ]);

  // Mover tarjeta entre columnas
  function moveCard(cardId: string, fromColumnId: string, toColumnId: string) {
    setColumns(prevCols => {
      const fromCol = prevCols.find(col => col.id === fromColumnId);
      const toCol = prevCols.find(col => col.id === toColumnId);
      if (!fromCol || !toCol) return prevCols;
      const cardIdx = fromCol.cards.findIndex(c => c.id === cardId);
      if (cardIdx === -1) return prevCols;
      const [card] = fromCol.cards.splice(cardIdx, 1);
      card.status = toCol.status;
      toCol.cards.push(card);
      return [...prevCols];
    });
  }

  // Handler para drop en columna
  function handleColumnDrop(
    targetColumnId: string,
    draggedItem: KanbanCard,
    sourceColumnId: string
  ) {
    if (targetColumnId !== sourceColumnId) {
      moveCard(draggedItem.id, sourceColumnId, targetColumnId);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 items-stretch w-full">
        {columns.map(column => (
          <KanbanColumn
            key={column.id}
            column={column}
            indicatorColor={
              column.status === 'todo'
                ? 'bg-red-400'
                : column.status === 'in-progress'
                  ? 'bg-yellow-400'
                  : column.status === 'review'
                    ? 'bg-blue-400'
                    : 'bg-green-400'
            }
            onAddTask={onAddTask}
            // Nuevo prop para manejar drop
            onCardDrop={(draggedItem, sourceColumnId) =>
              handleColumnDrop(column.id, draggedItem, sourceColumnId)
            }
          />
        ))}
      </div>
    </div>
  );
}
