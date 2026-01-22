import { Skeleton } from '@/components/ui/skeleton';
import { KanbanCardSkeleton } from './kanban-card-skeleton';

export function KanbanColumnSkeleton({ cardCount = 3 }: { cardCount?: number }) {
  return (
    <div className="glass-light dark:glass-dark rounded-xl p-3 sm:p-4 shadow-xl min-w-65 max-w-xs">
      <div className="flex items-center mb-3">
        <Skeleton className="w-3 h-3 rounded-full mr-2" />
        <Skeleton className="h-5 w-1/2" />
      </div>
      <div className="space-y-2">
        {Array.from({ length: cardCount }).map((_, i) => (
          <KanbanCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export default KanbanColumnSkeleton;
