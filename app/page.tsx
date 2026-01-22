'use client';

import { Header } from '@/app/dashboard/layout';
import { AnimatedView } from '@/components/animated-view';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { KanbanBoard } from '@/components/views/kanban/kanban-board';
import { ViewContentPlaceholder } from '@/components/views/ViewContentPlaceholder';
import useViewToggle from '@/hooks/useViewToggle';
import { kanbanMockData } from '@/lib/mocks';
import KanbanDndProvider from './kanban-dnd-provider';

export default function Page() {
  const { activeView, handleViewChange } = useViewToggle();

  return (
    <DashboardLayout>
      <Header activeView={activeView} handleViewChange={handleViewChange}>
        <AnimatedView isActive={activeView === 'kanban'}>
          <KanbanDndProvider>
            <KanbanBoard kanbanData={kanbanMockData} />
          </KanbanDndProvider>
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
      </Header>
    </DashboardLayout>
  );
}
