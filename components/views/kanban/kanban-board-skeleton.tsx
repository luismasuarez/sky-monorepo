import KanbanColumnSkeleton from './kanban-column-skeleton';

export const KanbanBoardSkeleton = () => {
  return (
    <>
      {Array.from({ length: 4 }).map((_, i) => (
        <KanbanColumnSkeleton key={i} cardCount={3} />
      ))}
    </>
  );
};
