import type { MockProject, MockTask, MockUser } from "@/lib/mocks";

export type KanbanColumnId = "todo" | "in-progress" | "done";

export interface KanbanTaskCard {
  id: string;
  title: string;
  projectName: string;
  status: KanbanColumnId;
  priority: "low" | "medium" | "high";
  tags: string[];
  dueDate?: Date;
  assigneeName?: string;
}

export interface KanbanColumn {
  id: KanbanColumnId;
  title: string;
  tasks: KanbanTaskCard[];
}

export function buildKanbanColumns(
  projects: MockProject[],
  tasks: MockTask[],
  users: MockUser[],
): KanbanColumn[] {
  const userById = new Map(users.map((u) => [u.id, u] as const));
  const projectById = new Map(projects.map((p) => [p.id, p] as const));

  const base: Record<KanbanColumnId, KanbanColumn> = {
    todo: { id: "todo", title: "To Do", tasks: [] },
    "in-progress": { id: "in-progress", title: "In Progress", tasks: [] },
    done: { id: "done", title: "Done", tasks: [] },
  };

  for (const task of tasks) {
    const colId = (task.status as KanbanColumnId) ?? "todo";
    const project = projectById.get(task.projectId);
    const assignee = task.assignedTo ? userById.get(task.assignedTo) : undefined;

    const card: KanbanTaskCard = {
      id: task.id,
      title: task.title,
      projectName: project?.name ?? "Unknown project",
      status: colId,
      priority: (task.priority as KanbanTaskCard["priority"]) ?? "medium",
      tags: task.tags,
      dueDate: task.dueDate ?? undefined,
      assigneeName: assignee?.fullName,
    };

    base[colId].tasks.push(card);
  }

  // sort each column by task.order (ascending)
  for (const col of Object.values(base)) {
    col.tasks.sort((a, b) => {
      const ta = tasks.find((t) => t.id === a.id)?.order ?? 0;
      const tb = tasks.find((t) => t.id === b.id)?.order ?? 0;
      return ta - tb;
    });
  }

  return [base.todo, base["in-progress"], base.done];
}
