'use client';

import { AnimatedView } from '@/components/animated-view';
import { AppSidebar } from '@/components/layout/app-sidebar';
import HeaderLayout from '@/components/layout/header-layout';
import { SidebarInset } from '@/components/ui/sidebar';
import { KanbanBoard } from '@/components/views/kanban/kanban-board';
import { KanbanBoardProvider } from '@/components/views/kanban/kanban-board-context';
import { ViewContentPlaceholder } from '@/components/views/ViewContentPlaceholder';
import useViewToggle from '@/hooks/useViewToggle';
import { kanbanMockData } from '@/lib/mocks';

export default function Page() {
  const { activeView, handleViewChange } = useViewToggle();

  return (
    <>
      <AppSidebar />

      <SidebarInset className="relative overflow-hidden min-h-screen z-0">
        {/* Background SVG */}
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat -z-10 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%23003366' fillOpacity='1' d='M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,138.7C960,139,1056,117,1152,117.3C1248,117,1344,139,1392,149.3L1440,160L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z'%3E%3C/path%3E%3Cpath fill='%23004080' fillOpacity='0.8' d='M0,192L48,197.3C96,203,192,213,288,208C384,203,480,181,576,165.3C672,149,768,139,864,149.3C960,160,1056,192,1152,197.3C1248,203,1344,181,1392,170.7L1440,160L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z'%3E%3C/path%3E%3Cpath fill='%230066cc' fillOpacity='0.6' d='M0,128L48,138.7C96,149,192,171,288,165.3C384,160,480,128,576,128C672,128,768,160,864,170.7C960,181,1056,171,1152,160C1248,149,1344,139,1392,133.3L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z'%3E%3C/path%3E%3C/svg%3E")`,
          }}
        />

        <div className="flex flex-1 flex-col p-4">
          <HeaderLayout activeView={activeView} handleViewChange={handleViewChange}>
            <div className="space-y-6">
              <div className="flex flex-col items-center gap-4">
                <div className="w-full min-h-80 relative">
                  <AnimatedView isActive={activeView === 'kanban'}>
                    <KanbanBoardProvider>
                      <KanbanBoard kanbanData={kanbanMockData} />
                    </KanbanBoardProvider>
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
          </HeaderLayout>
        </div>
      </SidebarInset>
    </>
  );
}
