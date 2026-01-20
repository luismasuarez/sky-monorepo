import { useDraggable } from '@/lib/drag-and-drop/useDraggable';
import { KanbanCard as KanbanCardType } from '@/lib/kanban-types';
import { formatElapsedTime, getTimeColor, isOvertime, shouldNotifyOvertime } from '@/lib/time';
import * as React from 'react';

export interface KanbanCardProps {
  item: KanbanCardType;
  onEdit?: (item: KanbanCardType) => void;
}
function KanbanCard({ item, onEdit }: KanbanCardProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [localCard, setLocalCard] = React.useState(item);
  const needsExpansion = item.description && item.description.length > 100;

  // Drag and drop integration
  const draggableProps = useDraggable(item, {
    type: 'kanban-card',
    sourceId: item.id,
  });

  // --- Time tracking logic (local, for demo; should be lifted to state manager in prod) ---
  React.useEffect(() => {
    setLocalCard(item);
  }, [item]);

  // Timer for UI update
  React.useEffect(() => {
    if (!localCard.isPaused && localCard.startTime && !localCard.completedTime) {
      const interval = setInterval(() => {
        setLocalCard(c => ({ ...c })); // trigger re-render
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [localCard.isPaused, localCard.startTime, localCard.completedTime]);

  // Handlers (should be lifted to parent/hook for real persistence)
  const handlePause = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!localCard.isPaused) {
      setLocalCard(c => ({
        ...c,
        isPaused: true,
        lastPauseStart: new Date().toISOString(),
      }));
    }
  };
  const handleResume = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (localCard.isPaused && localCard.lastPauseStart) {
      const now = new Date();
      const lastPause = new Date(localCard.lastPauseStart);
      const pauseDuration = now.getTime() - lastPause.getTime();
      setLocalCard(c => ({
        ...c,
        isPaused: false,
        pausedTime: (c.pausedTime || 0) + pauseDuration,
        lastPauseStart: undefined,
      }));
    }
  };

  // --- Notificación overtime (solo UI, real debería disparar efecto externo) ---
  React.useEffect(() => {
    if (shouldNotifyOvertime(localCard)) {
      // Aquí se podría disparar una notificación real
      // setLocalCard(c => ({ ...c, notificationSent: true }));
    }
  }, [localCard]);

  // --- Render ---
  return (
    <div
      {...draggableProps}
      className="bg-white dark:bg-slate-900 rounded shadow p-2 hover:shadow-lg transition cursor-pointer"
    >
      {/* Time tracking UI */}
      <div className="flex items-center gap-2 mt-1">
        <span
          className={`text-xs font-mono ${getTimeColor(localCard.estimatedTime ? getActiveTime(localCard) : 0)}`}
          title={
            localCard.estimatedTime ? `Estimado: ${formatDuration(localCard.estimatedTime)}` : ''
          }
        >
          {formatElapsedTime(localCard)}
        </span>
        {localCard.estimatedTime && isOvertime(localCard) && (
          <span className="text-xs text-red-500 font-bold ml-1">Overtime</span>
        )}
        {localCard.isPaused ? (
          <button
            className="text-xs px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border ml-2"
            onClick={handleResume}
          >
            Reanudar
          </button>
        ) : (
          <button
            className="text-xs px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border ml-2"
            onClick={handlePause}
          >
            Pausar
          </button>
        )}
        {/* Notificación visual (solo UI) */}
        {shouldNotifyOvertime(localCard) && (
          <span className="text-xs text-orange-500 ml-2">¡Notifica overtime!</span>
        )}
      </div>
      <div className="flex items-center justify-between mb-1">
        <div className="font-semibold text-sm truncate flex-1">{item.title}</div>
        {item.status && (
          <span className="ml-2 px-2 py-0.5 rounded text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            {item.status === 'in-progress'
              ? 'En progreso'
              : item.status === 'review'
                ? 'Revisión'
                : item.status === 'done'
                  ? 'Hecho'
                  : 'Por hacer'}
          </span>
        )}
        {onEdit && (
          <button
            className="text-xs text-blue-600 hover:underline ml-2"
            onClick={e => {
              e.stopPropagation();
              onEdit(item);
            }}
          >
            Editar
          </button>
        )}
      </div>
      {item.description && (
        <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
          {needsExpansion && !isExpanded
            ? item.description.slice(0, 100) + '...'
            : item.description}
          {needsExpansion && (
            <button
              className="ml-2 text-blue-500 hover:underline text-xs"
              onClick={e => {
                e.stopPropagation();
                setIsExpanded(v => !v);
              }}
            >
              {isExpanded ? 'Ver menos' : 'Ver más'}
            </button>
          )}
        </div>
      )}
      <div className="flex flex-wrap gap-1 items-center mt-1">
        {item.priority && (
          <span className="text-xs px-2 py-0.5 rounded bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200">
            {item.priority === 'high' ? 'Alta' : item.priority === 'medium' ? 'Media' : 'Baja'}
          </span>
        )}
        {item.tags &&
          item.tags.length > 0 &&
          item.tags.map(tag => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200"
            >
              {tag}
            </span>
          ))}
        {item.dueDate && (
          <span className="text-xs ml-2 text-slate-400">
            {typeof item.dueDate === 'string' ? new Date(item.dueDate).toLocaleDateString() : ''}
          </span>
        )}
      </div>
      {item.quoteAmount !== undefined && (
        <div className="text-xs text-slate-700 dark:text-slate-200 font-semibold mt-1">
          ${item.quoteAmount.toFixed(2)}
        </div>
      )}
    </div>
  );
}

export default KanbanCard;
