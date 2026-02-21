import { Skeleton } from '@/components/ui/skeleton';

export function KanbanCardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded shadow p-2 mb-2">
      <div className="flex items-center gap-2 mb-2">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-4 w-10 ml-auto" />
      </div>
      <Skeleton className="h-3 w-2/3 mb-1" />
      <Skeleton className="h-3 w-1/2 mb-1" />
      <div className="flex gap-1 mt-2">
        <Skeleton className="h-4 w-10 rounded" />
        <Skeleton className="h-4 w-10 rounded" />
      </div>
    </div>
  );
}

export default KanbanCardSkeleton;
