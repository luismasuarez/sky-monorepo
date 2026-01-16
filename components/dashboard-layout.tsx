import { ReactNode } from 'react'
import { AppSidebar } from '@/components/app-sidebar'
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <>
      <AppSidebar />
      <SidebarInset className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-slate-900 dark:to-slate-800">
        {/* Top Bar */}
        <header className="flex h-16 shrink-0 items-center gap-2 border-b glass-panel">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            {/* TODO: Aquí irán los selectores de Organization y Project */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Workspace Selector</span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex flex-1 flex-col p-4">
          {children}
        </div>
      </SidebarInset>
    </>
  )
}
