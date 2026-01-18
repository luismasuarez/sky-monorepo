
"use client"
import { DashboardLayout } from '@/components/dashboard-layout'
import useViewToggle from '@/hooks/useViewToggle'
import { ViewContentPlaceholder } from './dashboard/core/components/ViewContentPlaceholder'

export default function Page() {
  const { activeView, handleViewChange } = useViewToggle()
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mb-2">Bienvenido a Dokkap - Tu plataforma de gestión de proyectos</p>
          <div className="w-full max-w-2xl">
            {/* View Toggle */}
            <div className="mb-4">
              {/* El ViewToggle ya está en el Header, pero aquí puedes ponerlo si quieres duplicar el control */}
            </div>
            {/* Contenido de la vista seleccionada */}
            <ViewContentPlaceholder view={activeView as any} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}