
"use client"

import { DashboardLayout } from '@/components/dashboard-layout'
import useViewToggle from '@/hooks/useViewToggle'
import { ViewContentPlaceholder } from './dashboard/core/components/ViewContentPlaceholder'
import { Header } from '@/components/header'

export default function Page() {
  const { activeView, handleViewChange } = useViewToggle()
  return (
    <DashboardLayout>
      <Header activeView={activeView} handleViewChange={handleViewChange} />
      <div className="space-y-6">
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mb-2">Bienvenido a Dokkap - Tu plataforma de gestión de proyectos</p>
          <div className="w-full max-w-2xl">
            <ViewContentPlaceholder view={activeView as any} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}