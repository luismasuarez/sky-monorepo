import { KanbanCard as KanbanCardType } from '@/lib/kanban-types';
import { useDraggable } from '@dnd-kit/core';
import { ReactNode, useState } from 'react';

export interface KanbanCardProps {
  item: KanbanCardType;
  onEdit?: (item: KanbanCardType) => void;
  children?: ReactNode | ReactNode[];
}

function KanbanCard({ item }: KanbanCardProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: item.id,
  });

  const [isExpanded, setIsExpanded] = useState(false);
  const needsExpansion = item.description && item.description.length > 100;

  const style = transform
    ? {
      transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="bg-white dark:bg-slate-900 rounded shadow p-2 hover:shadow-lg transition cursor-pointer"
    >
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
