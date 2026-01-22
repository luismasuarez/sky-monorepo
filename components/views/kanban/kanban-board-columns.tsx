import { useKanbanBoardContext } from './context/kanban-board-context';
import KanbanCard from './kanban-card';
import KanbanColumn from './kanban-column';

export const KanbanBoardColumns = () => {
  const { columns } = useKanbanBoardContext();

  return (
    <>
      {columns.map(column => (
        <KanbanColumn key={column.id} column={column}>
          {column.cards.map(card => (
            <KanbanCard key={card.id} item={card} />
          ))}
        </KanbanColumn>
      ))}
    </>
  );
};
