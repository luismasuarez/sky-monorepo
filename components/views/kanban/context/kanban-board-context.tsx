import { useProjectContext } from '@/lib/contexts/project-context';
import { KanbanColumn as KanbanColumnType, TKanbanCard } from '@/lib/kanban-types';
import { createContext, ReactNode, useContext, useState } from 'react';

interface AddTaskData {
  title: string;
  description?: string;
}

interface KanbanBoardContextType {
  isLoading?: boolean;
  columns: KanbanColumnType[];
  setColumns: React.Dispatch<React.SetStateAction<KanbanColumnType[]>>;
  moveCard: (cardId: string, fromColumnId: string, toColumnId: string) => void;
  addTask: (columnStatus: KanbanColumnType['status'], card: AddTaskData) => void;
}

export const KanbanBoardContext = createContext<KanbanBoardContextType | undefined>(undefined);

export function useKanbanBoardContext() {
  const ctx = useContext(KanbanBoardContext);
  if (!ctx) throw new Error('useKanbanBoardContext must be used within a KanbanBoardProvider');
  return ctx;
}

interface KanbanBoardProviderProps {
  initialColumns?: KanbanColumnType[];
  children: ReactNode;
}

export function KanbanBoardProvider({ initialColumns, children }: KanbanBoardProviderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { activeProject } = useProjectContext();

  const [columns, setColumns] = useState<KanbanColumnType[]>(
    initialColumns || [
      { id: 'todo', title: 'To Do', status: 'todo', cards: [] },
      { id: 'in-progress', title: 'In Progress', status: 'in-progress', cards: [] },
      { id: 'review', title: 'Review', status: 'review', cards: [] },
      { id: 'done', title: 'Done', status: 'done', cards: [] },
    ]
  );

  function moveCard(cardId: string, fromColumnId: string, toColumnId: string) {
    setColumns(prev =>
      prev.map(col => {
        if (col.id === fromColumnId) {
          return {
            ...col,
            cards: col.cards.filter(c => c.id !== cardId),
          };
        }
        if (col.id === toColumnId) {
          const card = prev.find(c => c.id === fromColumnId)!.cards.find(c => c.id === cardId)!;
          return {
            ...col,
            cards: [...col.cards, { ...card, status: col.status }],
          };
        }
        return col;
      })
    );
  }

  function addTask(columnStatus: KanbanColumnType['status'], card: AddTaskData) {
    if (!activeProject) return; // or throw error

    const newCard: TKanbanCard = {
      id: `card-${Date.now()}`,
      projectId: activeProject.id,
      workspaceId: 'default-workspace', // TODO: get from context
      teamId: undefined,
      title: card.title,
      description: card.description,
      column: columnStatus,
      status: columnStatus,
      priority: 'medium', // default
      assignedTo: undefined,
      estimatedTime: undefined,
      startTime: undefined,
      completedTime: undefined,
      totalTime: 0,
      pausedTime: 0,
      isPaused: false,
      lastPauseStart: undefined,
      isOvertime: false,
      notificationSent: false,
      quoteAmount: undefined,
      tags: [],
      dueDate: undefined,
      order: 0, // TODO: calculate order
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'user', // TODO: get from auth
    };

    setColumns(prev =>
      prev.map(col => {
        if (col.status === columnStatus) {
          return {
            ...col,
            cards: [...col.cards, newCard],
          };
        }
        return col;
      })
    );
  }

  return (
    <KanbanBoardContext.Provider value={{ isLoading, columns, setColumns, moveCard, addTask }}>
      {children}
    </KanbanBoardContext.Provider>
  );
}
