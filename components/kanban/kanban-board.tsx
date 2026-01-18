import { KanbanMockData, KanbanTaskMock } from "@/lib/mocks";
import KanbanColumn from "./kanban-column";

export interface KanbanBoardProps {
  kanbanData: KanbanMockData;
  onAddTask?: (column: keyof KanbanMockData) => void;
  onEditTask?: (task: KanbanTaskMock, column: keyof KanbanMockData) => void;
}

export function KanbanBoard({ kanbanData, onAddTask, onEditTask }: KanbanBoardProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 items-stretch w-full">
        <KanbanColumn
          title="To Do"
          items={kanbanData.todo}
          columnKey="todo"
          indicatorColor="bg-red-400"
          onAddTask={onAddTask}
          onEditTask={onEditTask}
        />
        <KanbanColumn
          title="In Progress"
          items={kanbanData.inProgress}
          columnKey="inProgress"
          indicatorColor="bg-yellow-400"
          onAddTask={onAddTask}
          onEditTask={onEditTask}
        />
        <KanbanColumn
          title="Review"
          items={kanbanData.review}
          columnKey="review"
          indicatorColor="bg-blue-400"
          onAddTask={onAddTask}
          onEditTask={onEditTask}
        />
        <KanbanColumn
          title="Done"
          items={kanbanData.done}
          columnKey="done"
          indicatorColor="bg-green-400"
          onAddTask={onAddTask}
          onEditTask={onEditTask}
        />
      </div>
    </div>
  );
}

export default KanbanBoard;
