// src/components/dashboard-widget.tsx
"use client"

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSidebar } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { IconCheck, IconChevronDown, IconChevronLeft, IconChevronRight, IconFolder, IconMenu2, IconX } from '@tabler/icons-react';
import { ReactNode, useEffect, useState } from 'react';

interface DashboardWidgetProps {
  children?: ReactNode;
}

type WidgetView = 'clock' | 'date' | 'project';

export default function DashboardWidget({ children }: DashboardWidgetProps) {
  const { open, toggleSidebar } = useSidebar();
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
        return <DateDisplay />;
      case 'project':
        return <ProjectDisplay />;
      default:
        return children;
    }
  };

  return (
    <div className="glass-light dark:glass-dark rounded-xl shadow-2xl flex items-center justify-between px-4 sm:px-5 py-3 gap-2">
      {/* Botón del Sidebar */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        className="h-7 w-7 hover:bg-white/30 dark:hover:bg-slate-700/30 text-slate-700 dark:text-slate-300 transition-colors flex-shrink-0"
        title={open ? 'Ocultar menú' : 'Mostrar menú'}
      >
        {open ? <IconX className="h-4 w-4" /> : <IconMenu2 className="h-4 w-4" />}
      </Button>

      {/* Separador */}
      <div className="h-8 w-px bg-slate-300/50 dark:bg-slate-600/50 flex-shrink-0" />

      {/* Chevron Izquierdo */}
      <Button
        variant="ghost"
        size="icon"
        onClick={prevView}
        className="h-7 w-7 hover:bg-white/30 dark:hover:bg-slate-700/30 text-slate-600 dark:text-slate-400 transition-colors flex-shrink-0"
        title="Vista anterior"
      >
        <IconChevronLeft className="h-4 w-4" />
      </Button>

      {/* Contenido Principal (Clock, Date o Project) - Con ancho fijo */}
      <div className="w-28 sm:w-32 flex items-center justify-center flex-shrink-0">
        {renderContent()}
      </div>

      {/* Chevron Derecho */}
      <Button
        variant="ghost"
        size="icon"
        onClick={nextView}
        className="h-7 w-7 hover:bg-white/30 dark:hover:bg-slate-700/30 text-slate-600 dark:text-slate-400 transition-colors flex-shrink-0"
        title="Vista siguiente"
      >
        <IconChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

// Componente para mostrar la fecha
function DateDisplay() {
  const [currentDate] = useState(new Date());

  const formattedDate = currentDate.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="text-center w-full" title="Fecha actual">
      <p className="text-base sm:text-lg font-semibold text-slate-700 dark:text-slate-200 capitalize truncate">
        {formattedDate}
      </p>
    </div>
  );
}

// Componente para mostrar el proyecto actual
function ProjectDisplay() {
  const { activeProject, projects, setActiveProject, isLoadingProjects } = useProjectContext();
  const [isOpen, setIsOpen] = useState(false);

  // Log para debugging
  useEffect(() => {
    console.log('ProjectDisplay - activeProject:', activeProject);
    console.log('ProjectDisplay - projects:', projects);
  }, [activeProject, projects]);

  const handleProjectSelect = (projectId: string | null) => {
    console.log('Selecting project:', projectId);
    setActiveProject(projectId);
    setIsOpen(false);
  };

  if (isLoadingProjects) {
    return (
      <div className="text-center w-full" title="Cargando proyectos...">
        <p className="text-sm sm:text-base font-medium text-slate-600 dark:text-slate-400 truncate">
          Cargando...
        </p>
      </div>
    );
  }

  // Si no hay proyectos disponibles, mostrar mensaje
  if (projects.length === 0) {
    return (
      <div className="text-center w-full" title="No hay proyectos">
        <p className="text-sm sm:text-base font-medium text-slate-600 dark:text-slate-400 truncate">
          Sin proyectos
        </p>
      </div>
    );
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-auto py-1 px-2 hover:bg-white/30 dark:hover:bg-slate-700/30 w-full"
          title="Seleccionar proyecto"
        >
          <div className="flex items-center gap-1.5 min-w-0 w-full justify-center">
            <IconFolder className="h-3.5 w-3.5 shrink-0 text-slate-600 dark:text-slate-400" />
            <span className="text-sm sm:text-base font-semibold text-slate-700 dark:text-slate-200 truncate">
              {activeProject?.name || 'Sin proyecto'}
            </span>
            <IconChevronDown className="h-3.5 w-3.5 shrink-0 text-slate-600 dark:text-slate-400" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-[200px]">
        <DropdownMenuLabel>Proyectos</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Opción: Sin proyecto */}
        <DropdownMenuItem
          onClick={() => handleProjectSelect(null)}
          className={cn('cursor-pointer', !activeProject && 'bg-accent')}
        >
          <IconCheck
            className={cn('mr-2 h-4 w-4', !activeProject ? 'opacity-100' : 'opacity-0')}
          />
          Sin proyecto
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Lista de proyectos */}
        {projects.map((project) => (
          <DropdownMenuItem
            key={project.id}
            onClick={() => handleProjectSelect(project.id)}
            className={cn('cursor-pointer', activeProject?.id === project.id && 'bg-accent')}
          >
            <IconCheck
              className={cn(
                'mr-2 h-4 w-4',
                activeProject?.id === project.id ? 'opacity-100' : 'opacity-0'
              )}
            />
            <span className="truncate">{project.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
