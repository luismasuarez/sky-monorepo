import { DashboardLayout } from '@/components/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { IconFolder } from '@tabler/icons-react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Proyectos - Dokkap',
  description: 'Gestiona tus proyectos',
}

export default function ProjectsPage() {
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

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconFolder className="h-5 w-5" />
              Proyectos
            </CardTitle>
            <CardDescription>
              Esta sección estará disponible próximamente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Aquí podrás crear, editar y gestionar todos tus proyectos.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
