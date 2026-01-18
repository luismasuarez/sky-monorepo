
"use client"


import AnimatedView from '@/components/animated-view'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Header } from '@/components/header'
import useViewToggle from '@/hooks/useViewToggle'
import { ViewContentPlaceholder } from './dashboard/core/components/ViewContentPlaceholder'
import { KanbanBoard } from '@/components/kanban/kanban-board'
import { kanbanMockData } from '@/lib/mocks'

export default function Page() {
  const { activeView, handleViewChange } = useViewToggle()
  return (
    <DashboardLayout>
      <Header activeView={activeView} handleViewChange={handleViewChange} />
      <div className="space-y-6">
        <div className="flex flex-col items-center gap-4">
          <div className="w-full max-w-2xl min-h-[320px] relative">
            <AnimatedView isActive={activeView === 'kanban'}>
              <KanbanBoard kanbanData={kanbanMockData} />
            </AnimatedView>
            <AnimatedView isActive={activeView === 'links'}>
              <ViewContentPlaceholder view="links" />
            </AnimatedView>
            <AnimatedView isActive={activeView === 'credentials'}>
              <ViewContentPlaceholder view="credentials" />
            </AnimatedView>
            <AnimatedView isActive={activeView === 'metrics'}>
              <ViewContentPlaceholder view="metrics" />
            </AnimatedView>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}