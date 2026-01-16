'use client'

import { useState } from 'react'
import { AppSidebar } from '@/components/app-sidebar'
import { SidebarInset, SidebarTrigger, useSidebar } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { IconLayoutSidebarLeftCollapse, IconLayoutSidebarLeftExpand, IconPlus } from '@tabler/icons-react'

export function KanbanView() {
  const { open, setOpen } = useSidebar()
  const [selectedProject, setSelectedProject] = useState<string | null>(null)

  return (
    <>
      <AppSidebar />
      <SidebarInset className="relative overflow-hidden">
        {/* Fondo con patrón SVG */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
          <svg
            className="absolute inset-0 h-full w-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="grid-pattern"
                width="32"
                height="32"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M0 32V.5H32"
                  fill="none"
                  stroke="currentColor"
                  strokeOpacity="0.05"
                  className="text-slate-400 dark:text-slate-600"
                />
              </pattern>
              <pattern
                id="dot-pattern"
                width="16"
                height="16"
                patternUnits="userSpaceOnUse"
              >
                <circle
                  cx="2"
                  cy="2"
                  r="1"
                  fill="currentColor"
                  fillOpacity="0.1"
                  className="text-slate-400 dark:text-slate-600"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-pattern)" />
            <rect width="100%" height="100%" fill="url(#dot-pattern)" />
          </svg>
        </div>

        {/* Contenido */}
        <div className="relative z-10 flex h-full flex-col">
          {/* Header con controles */}
          <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4 glass-panel">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(!open)}
                className="h-8 w-8"
              >
                {open ? (
                  <IconLayoutSidebarLeftCollapse className="h-5 w-5" />
                ) : (
                  <IconLayoutSidebarLeftExpand className="h-5 w-5" />
                )}
              </Button>

              <div className="flex flex-col">
                <h1 className="text-lg font-semibold">Kanban Board</h1>
                <p className="text-xs text-muted-foreground">
                  {selectedProject ? 'Proyecto: ' + selectedProject : 'Selecciona un proyecto'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Stats */}
              <div className="hidden md:flex items-center gap-4 text-sm mr-4">
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-red-400" />
                  <span className="text-muted-foreground">0 pending</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-yellow-400" />
                  <span className="text-muted-foreground">0 in progress</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-green-400" />
                  <span className="text-muted-foreground">0 completed</span>
                </div>
              </div>

              <Button className="glass-button">
                <IconPlus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </div>
          </header>

          {/* Kanban Board */}
          <div className="flex-1 overflow-auto p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* To Do Column */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-red-400" />
                    <h2 className="font-semibold text-sm">To Do</h2>
                    <span className="text-xs text-muted-foreground">(0)</span>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <IconPlus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-3 min-h-[500px] rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-700 p-4 glass-panel">
                  <p className="text-center text-sm text-muted-foreground py-8">
                    No tasks yet
                  </p>
                </div>
              </div>

              {/* In Progress Column */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-yellow-400" />
                    <h2 className="font-semibold text-sm">In Progress</h2>
                    <span className="text-xs text-muted-foreground">(0)</span>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <IconPlus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-3 min-h-[500px] rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-700 p-4 glass-panel">
                  <p className="text-center text-sm text-muted-foreground py-8">
                    No tasks yet
                  </p>
                </div>
              </div>

              {/* Done Column */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-400" />
                    <h2 className="font-semibold text-sm">Done</h2>
                    <span className="text-xs text-muted-foreground">(0)</span>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <IconPlus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-3 min-h-[500px] rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-700 p-4 glass-panel">
                  <p className="text-center text-sm text-muted-foreground py-8">
                    No tasks yet
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </>
  )
}
