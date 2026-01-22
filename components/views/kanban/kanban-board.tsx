'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useDeleteZone } from '@/hooks/useDeleteZone';
import { useMoveConfirmationModal } from '@/hooks/useMoveConfirmationModal';
import { useDragAndDropContext } from '@/lib/drag-and-drop/DragAndDropContext';
import { KanbanCard, KanbanColumn as KanbanColumnType, TaskStatus } from '@/lib/kanban-types';
import { KanbanMockData, KanbanTaskMock } from '@/lib/mocks';
import { useState } from 'react';
import { DeleteZone } from './DeleteZone';
import KanbanColumn from './kanban-column';
import KanbanColumnSkeleton from './kanban-column-skeleton';
import { MoveConfirmationModal } from './MoveConfirmationModal';

// Utilidad para mapear KanbanTaskMock a KanbanCard
function mapMockToCard(task: KanbanTaskMock): KanbanCard {
  return {
    id: task.id,
    projectId: task.projectId,
    workspaceId: task.workspaceId,
    teamId: task.teamId,
    title: task.title,
    description: task.description,
    status: task.column === 'inProgress' ? 'in-progress' : (task.column as TaskStatus),
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

export function KanbanBoard({ kanbanData, onAddTask, isLoading = false }: KanbanBoardProps) {
  // Confirmación visual para mover tareas desde 'done'
  const { showMoveModal, pendingMove, requestMove, confirmMove, cancelMove } =
    useMoveConfirmationModal();
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

  // Estado para eliminar tarea
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<{
    cardId: string;
    sourceColumnId: string;
  } | null>(null);

  // Integración del hook reutilizable para la zona de eliminación
  const {
    isDeleteZoneDragOver,
    handleDeleteZoneDragOver,
    handleDeleteZoneDragLeave,
    // handleDeleteZoneDrop, // removed because now handled by handleDeleteZoneDropModal
  } = useDeleteZone((e: React.DragEvent) => {
    // extraer datos del dataTransfer y abrir modal de confirmación
    const cardId = e.dataTransfer.getData('kanban-card-id');
    const sourceColumnId = e.dataTransfer.getData('kanban-source-column-id');
    if (cardId && sourceColumnId) {
      setPendingDelete({ cardId, sourceColumnId });
      setDeleteDialogOpen(true);
    }
  });

  const { draggedItem } = useDragAndDropContext();
  const isDragging = !!draggedItem;
  // const dragOverDeleteZone = useRef(false);

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
      // Si la tarea viene de 'done', pedir confirmación
      if (sourceColumnId === 'done') {
        requestMove(draggedItem.id, sourceColumnId, targetColumnId);
      } else {
        moveCard(draggedItem.id, sourceColumnId, targetColumnId);
      }
    }
  }

  // Eliminar tarjeta
  function deleteCard(cardId: string, fromColumnId: string) {
    setColumns(prevCols => {
      const col = prevCols.find(c => c.id === fromColumnId);
      if (!col) return prevCols;
      col.cards = col.cards.filter(c => c.id !== cardId);
      return [...prevCols];
    });
  }

  // Handler para drop en zona de eliminar
  function handleDeleteZoneDropModal(e: React.DragEvent) {
    const cardId = e.dataTransfer.getData('kanban-card-id');
    const sourceColumnId = e.dataTransfer.getData('kanban-source-column-id');
    if (cardId && sourceColumnId) {
      setPendingDelete({ cardId, sourceColumnId });
      setDeleteDialogOpen(true);
    }
  }

  return (
    <>
      <div className="flex flex-col gap-6 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 items-stretch w-full">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
              <KanbanColumnSkeleton key={i} cardCount={3} />
            ))
            : columns.map(column => (
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
                onCardDrop={(draggedItem, sourceColumnId) =>
                  handleColumnDrop(column.id, draggedItem, sourceColumnId)
                }
              />
            ))}
        </div>
      </div>
      {/* Zona de drop para eliminar (componente reutilizable, UI fiel al original) */}
      <DeleteZone
        isVisible={true}
        isDragOver={isDeleteZoneDragOver}
        isDragging={isDragging}
        onDragOver={handleDeleteZoneDragOver}
        onDragLeave={handleDeleteZoneDragLeave}
        onDrop={e => {
          handleDeleteZoneDropModal(e);
        }}
      />
      {/* Modal de confirmación de borrado */}
      {/* Modal de confirmación de mover tarea desde 'done' */}
      <MoveConfirmationModal
        open={showMoveModal}
        onCancel={cancelMove}
        onConfirm={() => {
          if (pendingMove) {
            moveCard(pendingMove.cardId, pendingMove.fromColumnId, pendingMove.toColumnId);
          }
          confirmMove(() => { }); // Limpia el estado
        }}
      />
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar tarea?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. ¿Seguro que quieres eliminar la tarea?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingDelete(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (pendingDelete) {
                  deleteCard(pendingDelete.cardId, pendingDelete.sourceColumnId);
                  setPendingDelete(null);
                }
                setDeleteDialogOpen(false);
              }}
              variant="destructive"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
