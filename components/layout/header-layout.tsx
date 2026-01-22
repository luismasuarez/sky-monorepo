import { ReactNode } from 'react';
import { Clock } from '../widgets/clock';
import { DashboardWidget } from '../widgets/dashboard-widget';
import { HeaderMenuControls } from '../widgets/header-menu-controls';
import { ViewToggle, ViewType } from '../widgets/view-toggle';

interface HeaderProps {
  children: ReactNode | ReactNode[];
  activeView: ViewType;
  handleViewChange: (view: ViewType) => void;
}

const HeaderLayout = ({ children, activeView, handleViewChange }: HeaderProps) => {
  return (
    <>
      <header className="flex items-center w-full gap-2 mt-4 mb-6 px-2 sm:px-4 lg:px-8">
        {/* IZQUIERDA - Widget con Clock */}
        <div className="flex items-center justify-start flex-none gap-3">
          <DashboardWidget className="glass-card">
            <Clock />
          </DashboardWidget>
        </div>

        {/* CENTRO */}
        <div className="flex-1 flex items-center justify-center">
          <ViewToggle activeView={activeView} onViewChange={handleViewChange} />
        </div>

        {/* DERECHA */}
        <div className="flex items-center justify-end flex-none gap-2">
          <HeaderMenuControls
            onBackup={() => { }}
            onRestore={() => { }}
            notifications={[
              { id: '1', title: 'Nueva tarea asignada', read: false },
              { id: '2', title: 'Backup completado', read: true },
              { id: '3', title: 'Actualización disponible', read: false },
            ]}
            workspaces={[
              { id: 'w1', name: 'Personal' },
              { id: 'w2', name: 'Equipo' },
            ]}
            currentWorkspaceId="w1"
            syncStatus="ok"
          />
        </div>
      </header>

      <div>{children}</div>
    </>
  );
};

export default HeaderLayout;
