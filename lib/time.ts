// Import KanbanItem type or declare it here if necessary
// For example: import { KanbanItem } from './path/to/KanbanItem';

export const formatDuration = (milliseconds: number): string => {
  const seconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)

  if (hours > 0) {
    const remainingMinutes = minutes % 60
    return `${hours}h ${remainingMinutes}m`
  } else if (minutes > 0) {
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  } else {
    return `${seconds}s`
  }
}

export const getActiveTime = (item: any): number => {
  // Assuming KanbanItem is not declared, using any as a placeholder
  if (!item.startTime) return 0

  const now = Date.now()
  let activeTime = now - item.startTime

  // Subtract paused time
  if (item.pausedTime) {
    activeTime -= item.pausedTime
  }

  // If currently paused, subtract current pause duration
  if (item.isPaused && item.lastPauseStart) {
    activeTime -= now - item.lastPauseStart
  }

  return Math.max(0, activeTime)
}

export const formatElapsedTime = (item: any): string => {
  // Assuming KanbanItem is not declared, using any as a placeholder
  const activeTime = getActiveTime(item)
  return formatDuration(activeTime)
}

export const getTimeColor = (milliseconds: number): string => {
  const minutes = milliseconds / (1000 * 60)

  if (minutes < 30) {
    return "text-green-600 dark:text-green-400"
  } else if (minutes < 120) {
    return "text-yellow-600 dark:text-yellow-400"
  } else {
    return "text-red-600 dark:text-red-400"
  }
}
