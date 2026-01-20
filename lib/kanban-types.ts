// Tipos base para Kanban Board, inspirados en pragmatic-board

// KanbanCard representa un Task
export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done';

export type KanbanCard = {
  id: string;
  projectId: string;
  workspaceId: string;
  teamId?: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: string; // 'low' | 'medium' | 'high'
  assignedTo?: string;
  estimatedTime?: number; // ms
  startTime?: string; // ISO date
  completedTime?: string; // ISO date
  totalTime?: number;
  pausedTime?: number;
  isPaused: boolean;
  lastPauseStart?: string;
  isOvertime: boolean;
  notificationSent: boolean;
  quoteAmount?: number;
  tags: string[];
  dueDate?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
};

// KanbanColumn puede representar un agrupador por status, por ejemplo
export type KanbanColumn = {
  id: string;
  title: string;
  status: TaskStatus;
  cards: KanbanCard[];
};

// KanbanBoard puede estar asociado a un proyecto
export type KanbanBoard = {
  id: string;
  projectId: string;
  columns: KanbanColumn[];
};
