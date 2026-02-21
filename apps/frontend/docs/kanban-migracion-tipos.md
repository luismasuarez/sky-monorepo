## 6. Procedimiento de migración Kanban (guía reutilizable)

1. **Identificar componentes legacy principales y subcomponentes**

- Ubica los archivos legacy relevantes (por ejemplo, `kanban-board.tsx`, `kanban-column.tsx`, `kanban-card.tsx`).
- Documenta las props y tipos principales de cada componente.

2. **Extraer y adaptar tipos/interfaces**

- Extrae los tipos legacy (`KanbanItem`, `KanbanData`, etc.) y compáralos con los modelos de Prisma.
- Define tipos mock alineados a Prisma para datos de UI.

3. **Crear mocks de datos**

- Genera datos mock realistas para alimentar la UI y facilitar el desarrollo/despliegue incremental.

4. **Replicar estructura de componentes en la nueva UI**

- Crea la carpeta de componentes (ej: `components/kanban/`).
- Implementa los componentes principales siguiendo atomic design (organism → molecule → atom).
- Usa los mocks y tipos modernos en los props.

5. **Integrar en la vista principal**

- Importa y renderiza el componente principal (ej: `KanbanBoard`) en la página adecuada (`/` o dashboard).
- Usa un sistema de tabs/toggle para alternar vistas (ej: `ViewToggle`).
- Renderiza el componente solo cuando la vista activa lo requiera.

6. **Convertir a Client Component si usas hooks de estado**

- Añade `"use client"` al inicio de la página si usas hooks como `useState` o `useEffect`.

7. **Validar integración y refactorizar**

- Verifica que la UI responde correctamente al cambiar de vista.
- Refactoriza y reutiliza patrones para migrar otras vistas (links, credentials, metrics) siguiendo estos mismos pasos.

---

> Sigue este procedimiento para migrar cualquier otra vista legacy a la nueva UI de forma ordenada, reutilizando mocks, tipos y estructura de componentes.
>
# Migración Kanban: Props y Tipos Principales

Este documento resume los tipos y props principales de los componentes Kanban legacy, alineados con el modelo `Task` de Prisma y siguiendo buenas prácticas (skills, atomic design).

---

## 1. Tipos principales (legacy + Prisma)

### KanbanItem (legacy)

```ts
export interface KanbanItem {
  id: string
  workspaceId: string
  projectId: string
  teamId?: string
  title: string
  description: string
  column: 'todo' | 'in-progress' | 'done'
  estimatedTime?: number
  startTime?: number
  completedTime?: number
  totalTime?: number
  pausedTime?: number
  isPaused?: boolean
  lastPauseStart?: number
  isOvertime?: boolean
  notificationSent?: boolean
  quoteAmount?: number
  assignedTo: string
  priority?: 'low' | 'medium' | 'high'
  tags?: string[]
  dueDate?: number
  createdAt: number
  updatedAt: number
  createdBy: string
  transferHistory?: TransferRecord[]
}
```

### Task (Prisma)

```prisma
model Task {
  id               String    @id @default(cuid())
  projectId        String
  workspaceId      String
  teamId           String?
  title            String
  description      String?
  status           String    @default("todo") // 'todo' | 'in-progress' | 'done'
  priority         String    @default("medium") // 'low' | 'medium' | 'high'
  assignedTo       String?
  estimatedTime    BigInt? // ms
  startTime        DateTime?
  completedTime    DateTime?
  totalTime        BigInt?
  pausedTime       BigInt?
  isPaused         Boolean   @default(false)
  lastPauseStart   DateTime?
  isOvertime       Boolean   @default(false)
  notificationSent Boolean   @default(false)
  quoteAmount      Float?
  tags             String[]  @default([])
  dueDate          DateTime?
  order            Int       @default(0)
  createdAt        DateTime  @default(now())
  updatedAt        DateTime  @updatedAt
  createdBy        String
}
```

### KanbanData (legacy)

```ts
export interface KanbanData {
  todo: KanbanItem[]
  inProgress: KanbanItem[]
  done: KanbanItem[]
}
```

---

## 2. Props principales de componentes

### KanbanBoard

```ts
interface KanbanBoardProps {
  kanbanData: KanbanData
  draggedItem: DraggedItem<KanbanItem> | null
  setDraggedItem: React.Dispatch<React.SetStateAction<DraggedItem<KanbanItem> | null>>
  onDragStart: (e: React.DragEvent, item: KanbanItem, sourceColumn: keyof KanbanData) => void
  onDragOver: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent, targetColumn: keyof KanbanData) => Promise<void>
  onDeleteTask: (e: React.DragEvent) => Promise<void>
  onTogglePause: (itemId: string) => void
  onNotifyOvertime: (itemId: string) => void
  onAddTask?: (targetColumn: keyof KanbanData) => void
  onEditTask?: (item: KanbanItem, sourceColumn: keyof KanbanData) => void
}
```

### AddTaskModal

```ts
interface AddTaskModalProps {
  isOpen: boolean
  onClose: () => void
  onAddTask: () => void // refresh data
  targetColumn: keyof KanbanData
}
```

### EditTaskModal

```ts
interface EditTaskModalProps {
  isOpen: boolean
  onClose: () => void
  onEditTask: (task: KanbanItem, targetColumn: keyof KanbanData) => void
  task: KanbanItem | null
  currentColumn: keyof KanbanData
}
```

### AnimatedView

```ts
interface AnimatedViewProps {
  isActive: boolean
  children: React.ReactNode
}
```

---

## 3. Notas para migración

- Usar tipos alineados a Prisma para los mocks y la UI moderna.
- Seguir atomic design: KanbanBoard (organism), KanbanColumn (molecule), KanbanCard (atom), modales (organism/molecule).
- Aplicar skills: typescript, react-19, nextjs-15, tailwind-4.

---

## 4. Tipos mock alineados a Prisma y legacy

```ts
// KanbanColumnType: para tipar las columnas
export type KanbanColumnType = 'todo' | 'in-progress' | 'done';

// KanbanTaskMock: tipo alineado a Prisma y legacy
export interface KanbanTaskMock {
  id: string;
  workspaceId: string;
  projectId: string;
  teamId?: string;
  title: string;
  description?: string;
  column: KanbanColumnType;
  estimatedTime?: number;
  startTime?: number;
  completedTime?: number;
  totalTime?: number;
  pausedTime?: number;
  isPaused?: boolean;
  lastPauseStart?: number;
  isOvertime?: boolean;
  notificationSent?: boolean;
  quoteAmount?: number;
  assignedTo: string;
  priority?: 'low' | 'medium' | 'high';
  tags?: string[];
  dueDate?: number;
  createdAt: number;
  updatedAt: number;
  createdBy: string;
}

// KanbanMockData: estructura para datos mock de Kanban
export interface KanbanMockData {
  todo: KanbanTaskMock[];
  inProgress: KanbanTaskMock[];
  done: KanbanTaskMock[];
}
```

> Estos tipos mock permiten crear datos de ejemplo para la UI, manteniendo compatibilidad con el modelo de datos real y facilitando la migración progresiva.

---

## 5. Mocks de datos Kanban (ejemplo)

```ts
import { KanbanMockData } from "./kanban-migracion-tipos";

export const kanbanMockData: KanbanMockData = {
  todo: [
    {
      id: "task-1",
      workspaceId: "ws-1",
      projectId: "prj-1",
      title: "Diseñar wireframes",
      description: "Crear wireframes para la nueva landing page",
      column: "todo",
      assignedTo: "user-1",
      priority: "high",
      tags: ["diseño", "ux"],
      dueDate: Date.now() + 86400000,
      createdAt: Date.now() - 86400000,
      updatedAt: Date.now(),
      createdBy: "user-2"
    }
  ],
  inProgress: [
    {
      id: "task-2",
      workspaceId: "ws-1",
      projectId: "prj-1",
      title: "Implementar API de usuarios",
      description: "Desarrollar endpoints para gestión de usuarios",
      column: "in-progress",
      assignedTo: "user-2",
      priority: "medium",
      tags: ["backend", "api"],
      dueDate: Date.now() + 172800000,
      createdAt: Date.now() - 172800000,
      updatedAt: Date.now(),
      createdBy: "user-1"
    }
  ],
  done: [
    {
      id: "task-3",
      workspaceId: "ws-1",
      projectId: "prj-1",
      title: "Setup inicial de proyecto",
      description: "Configurar repositorio y CI/CD",
      column: "done",
      assignedTo: "user-3",
      priority: "low",
      tags: ["devops"],
      dueDate: Date.now() - 86400000,
      createdAt: Date.now() - 259200000,
      updatedAt: Date.now() - 86400000,
      createdBy: "user-1"
    }
  ]
};
```

> Puedes copiar este mock a `/lib/mocks.ts` para usarlo en la UI Kanban moderna.
