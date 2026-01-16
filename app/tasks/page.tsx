import { DashboardLayout } from '@/components/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { IconChecklist } from '@tabler/icons-react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tareas - Dokkap',
  description: 'Gestiona tus tareas',
}

export default function TasksPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Tareas</h1>
            <p className="text-muted-foreground">
              Vista general de todas tus tareas
            </p>
          </div>
        </div>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconChecklist className="h-5 w-5" />
              Tareas
            </CardTitle>
            <CardDescription>
              Usa el Kanban Board para gestionar tus tareas de forma visual
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Dirígete a la sección de Kanban para ver y gestionar tus tareas.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
