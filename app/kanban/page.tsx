import { Metadata } from 'next'
import { KanbanView } from './kanban-view'

export const metadata: Metadata = {
  title: 'Kanban Board - Dokkap',
  description: 'Gestiona tus tareas con el tablero Kanban',
}

export default function KanbanPage() {
  return <KanbanView />
}
