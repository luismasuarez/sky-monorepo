// dashboard/core/components/dashboard-widget.tsx
"use client"

import { ReactNode, useState } from 'react';

interface DashboardWidgetProps {
  children?: ReactNode;
}

type WidgetView = 'clock' | 'date' | 'project';

export default function DashboardWidget({ children }: DashboardWidgetProps) {
  const [currentView, setCurrentView] = useState<WidgetView>('clock');

  const nextView = () => {
    if (currentView === 'clock') setCurrentView('date');
    else if (currentView === 'date') setCurrentView('project');
    else setCurrentView('clock');
  };

  const prevView = () => {
    if (currentView === 'clock') setCurrentView('project');
    else if (currentView === 'date') setCurrentView('clock');
    else setCurrentView('date');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'clock':
        return children; // El componente Clock
      case 'date':
        return null; // DateDisplay stub
      case 'project':
        return null; // ProjectDisplay stub
      default:
        return children;
    }
  };

  return (
    <div className="glass-light dark:glass-dark rounded-xl shadow-2xl flex items-center justify-between px-4 sm:px-5 py-3 gap-2">
      {/* Botón del Sidebar omitido */}
      {renderContent()}
    </div>
  );
}
