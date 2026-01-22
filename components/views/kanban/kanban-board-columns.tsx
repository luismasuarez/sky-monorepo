import { useKanbanBoardContext } from './context/kanban-board-context';
import KanbanCard from './kanban-card';
import KanbanColumn from './kanban-column';

export const KanbanBoardColumns = () => {
  const { columns } = useKanbanBoardContext();

  return (
    <>
      {columns.map(column => (
        <KanbanColumn key={column.id} column={column} onAddTask={() => { }}>
          {column.cards.map(card => {
            if (column.id === card.column) {
              return <KanbanCard key={card.id} item={card} />;
            }
            return <KanbanCard key={card.id} item={card} />;
          })}
        </KanbanColumn>
      ))}
    </>
  );
};
