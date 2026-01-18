

"use client"

import { DashboardLayout } from '@/components/dashboard-layout'
import { KanbanBoard } from '@/components/kanban/kanban-board'
import { kanbanMockData } from '@/lib/mocks'
import ViewToggle, { ViewType } from '@/components/view-toggle'
import { useState } from 'react'

export default function ProjectsPage() {
  const [activeView, setActiveView] = useState<ViewType>("kanban")

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Proyectos</h1>
            <p className="text-muted-foreground">
              Gestiona y organiza tus proyectos
            </p>
          </div>
        </div>

        <div className="mt-8">
          <ViewToggle activeView={activeView} onViewChange={setActiveView} />
        </div>

        <div className="mt-8">
          {activeView === "kanban" && <KanbanBoard kanbanData={kanbanMockData} />}
          {/* Aquí puedes agregar otras vistas: links, credentials, metrics... */}
        </div>
      </div>
    </DashboardLayout>
  )
}
