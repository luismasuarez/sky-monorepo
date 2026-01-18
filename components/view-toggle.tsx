"use client"

import { IconBookmark, IconChartBar, IconLayoutKanban, IconServer } from "@tabler/icons-react"
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs"
import { cn } from '@/lib/utils'

export type ViewType = "kanban" | "bookmarks" | "servers" | "metrics"

interface ViewToggleProps {
  activeView: ViewType
  onViewChange: (view: ViewType) => void
  notifications?: {
    kanban?: { warning: number; overtime: number }
  }
}

export default function ViewToggle({ activeView, onViewChange, notifications }: ViewToggleProps) {
  const kanbanNotifications = notifications?.kanban || { warning: 0, overtime: 0 }
  const hasNotifications = kanbanNotifications.warning > 0 || kanbanNotifications.overtime > 0

  return (
    <Tabs
      value={activeView}
      onValueChange={(value) => onViewChange(value as ViewType)}
      className="w-full flex justify-center"
    >
      <TabsList
        className="glass-light dark:glass-dark rounded-md shadow-2xl border border-slate-200/70 dark:border-slate-700/60 w-full max-w-2xl flex justify-between px-2 py-1 min-h-[44px]"
      >
        <TabsTrigger
          value="kanban"
          className={cn(
            "flex-1 flex items-center justify-center gap-1 relative text-base font-semibold transition-colors rounded-md",
            "data-[state=active]:text-white data-[state=active]:bg-blue-600 dark:data-[state=active]:bg-blue-400 data-[state=active]:shadow-sm"
          )}
        >
          <IconLayoutKanban className="w-4 h-4" stroke={1.7} />
          <span className="hidden sm:inline">Kanban</span>
          <span className="sm:hidden">Tasks</span>
          {hasNotifications && (
            <span className="absolute -top-1 -right-2 flex gap-0.5">
              {kanbanNotifications.overtime > 0 && (
                <span className="w-3 h-3 bg-red-500 dark:bg-red-400 rounded-full flex items-center justify-center text-[8px] text-white font-bold animate-pulse">
                  {kanbanNotifications.overtime > 9 ? "9+" : kanbanNotifications.overtime}
                </span>
              )}
              {kanbanNotifications.warning > 0 && (
                <span className="w-3 h-3 bg-yellow-500 dark:bg-yellow-400 rounded-full flex items-center justify-center text-[8px] text-white font-bold">
                  {kanbanNotifications.warning > 9 ? "9+" : kanbanNotifications.warning}
                </span>
              )}
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger
          value="bookmarks"
          className={cn(
            "flex-1 flex items-center justify-center gap-1 text-base font-semibold transition-colors rounded-md",
            "data-[state=active]:text-white data-[state=active]:bg-blue-600 dark:data-[state=active]:bg-blue-400 data-[state=active]:shadow-sm"
          )}
        >
          <IconBookmark className="w-4 h-4" stroke={1.7} />
          <span className="hidden sm:inline">Bookmarks</span>
          <span className="sm:hidden">Links</span>
        </TabsTrigger>
        <TabsTrigger
          value="servers"
          className={cn(
            "flex-1 flex items-center justify-center gap-1 text-base font-semibold transition-colors rounded-md",
            "data-[state=active]:text-white data-[state=active]:bg-blue-600 dark:data-[state=active]:bg-blue-400 data-[state=active]:shadow-sm"
          )}
        >
          <IconServer className="w-4 h-4" stroke={1.7} />
          <span className="hidden sm:inline">Servers</span>
          <span className="sm:hidden">Servers</span>
        </TabsTrigger>
        <TabsTrigger
          value="metrics"
          className={cn(
            "flex-1 flex items-center justify-center gap-1 text-base font-semibold transition-colors rounded-md",
            "data-[state=active]:text-white data-[state=active]:bg-blue-600 dark:data-[state=active]:bg-blue-400 data-[state=active]:shadow-sm"
          )}
        >
          <IconChartBar className="w-4 h-4" stroke={1.7} />
          <span className="hidden sm:inline">Metrics</span>
          <span className="sm:hidden">Stats</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}