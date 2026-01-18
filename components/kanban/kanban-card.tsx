import * as React from "react";
import { KanbanTaskMock } from "@/lib/mocks";

export interface KanbanCardProps {
  item: KanbanTaskMock;
  onEdit?: (item: KanbanTaskMock) => void;
}

export function KanbanCard({ item, onEdit }: KanbanCardProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const needsExpansion = item.description && item.description.length > 100;

  return (
    <div className="bg-white dark:bg-slate-900 rounded shadow p-2 hover:shadow-lg transition cursor-pointer">
      <div className="flex items-center justify-between mb-1">
        <div className="font-semibold text-sm truncate">{item.title}</div>
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
            ? item.description.slice(0, 100) + "..."
            : item.description}
          {needsExpansion && (
            <button
              className="ml-2 text-blue-500 hover:underline text-xs"
              onClick={e => {
                e.stopPropagation();
                setIsExpanded(v => !v);
              }}
            >
              {isExpanded ? "Ver menos" : "Ver más"}
            </button>
          )}
        </div>
      )}
      {item.quoteAmount !== undefined && (
        <div className="text-xs text-slate-700 dark:text-slate-200 font-semibold mt-1">${item.quoteAmount.toFixed(2)}</div>
      )}
    </div>
  );
}

export default KanbanCard;
