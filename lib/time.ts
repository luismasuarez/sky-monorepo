// Import KanbanItem type or declare it here if necessary
// For example: import { KanbanItem } from './path/to/KanbanItem';

export const formatDuration = (milliseconds: number): string => {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  } else if (minutes > 0) {
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  } else {
    return `${seconds}s`;
  }
};

// Calcula el tiempo activo real de la tarea, considerando pausas y reanudaciones
export const getActiveTime = (item: {
  startTime?: string;
  completedTime?: string;
  pausedTime?: number;
  isPaused: boolean;
  lastPauseStart?: string;
}): number => {
  if (!item.startTime) return 0;
  const start = new Date(item.startTime).getTime();
  const now = item.completedTime ? new Date(item.completedTime).getTime() : Date.now();
  let activeTime = now - start;
  // Sumar tiempo total en pausa
  if (item.pausedTime) {
    activeTime -= item.pausedTime;
  }
  // Si está actualmente pausada, restar la pausa en curso
  if (item.isPaused && item.lastPauseStart) {
    activeTime -= now - new Date(item.lastPauseStart).getTime();
  }
  return Math.max(0, activeTime);
};

export const formatElapsedTime = (item: {
  startTime?: string;
  completedTime?: string;
  pausedTime?: number;
  isPaused: boolean;
  lastPauseStart?: string;
}): string => {
  const activeTime = getActiveTime(item);
  return formatDuration(activeTime);
};
// Determina si la tarea está en overtime según estimatedTime
export const isOvertime = (item: {
  estimatedTime?: number;
  startTime?: string;
  completedTime?: string;
  pausedTime?: number;
  isPaused: boolean;
  lastPauseStart?: string;
}): boolean => {
  if (!item.estimatedTime || !item.startTime) return false;
  const elapsed = getActiveTime(item);
  return elapsed > item.estimatedTime;
};

// Notificación simple: retorna true si está en overtime y no se notificó aún
export const shouldNotifyOvertime = (item: {
  notificationSent: boolean;
  estimatedTime?: number;
  startTime?: string;
  completedTime?: string;
  pausedTime?: number;
  isPaused: boolean;
  lastPauseStart?: string;
}): boolean => {
  return isOvertime(item) && !item.notificationSent;
};

export const getTimeColor = (milliseconds: number): string => {
  const minutes = milliseconds / (1000 * 60);

  if (minutes < 30) {
    return 'text-green-600 dark:text-green-400';
  } else if (minutes < 120) {
    return 'text-yellow-600 dark:text-yellow-400';
  } else {
    return 'text-red-600 dark:text-red-400';
  }
};
