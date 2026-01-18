
import { AppSidebar } from '@/components/app-sidebar'
import { Header } from '@/components/header'
import { SidebarInset } from '@/components/ui/sidebar'
import { ReactNode } from 'react'

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <>
      <AppSidebar />
      <SidebarInset className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-slate-900 dark:to-slate-800">
        {/* Top Bar */}
        <Header />

        {/* Main Content */}
        <div className="flex flex-1 flex-col p-4">
          {children}
        </div>
      </SidebarInset>
    </>
  )
}
