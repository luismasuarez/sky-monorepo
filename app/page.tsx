'use client';

import { Header, KanbanBoard, ViewContentPlaceholder } from '@/components';
import { AnimatedView } from '@/components/animated-view';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import useViewToggle from '@/hooks/useViewToggle';
import { kanbanMockData } from '@/lib/mocks';

export default function Page() {
  const { activeView, handleViewChange } = useViewToggle();
  return (
    <DashboardLayout>
      <Header activeView={activeView} handleViewChange={handleViewChange} />
      <div className="space-y-6">
        <div className="flex flex-col items-center gap-4">
          <div className="w-full min-h-80 relative">
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
  );
}
