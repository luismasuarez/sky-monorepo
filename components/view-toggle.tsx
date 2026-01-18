"use client"

import {
  IconBookmark,
  IconChartBar,
  IconLayoutKanban,
  IconServer
} from "@tabler/icons-react"

export type ViewType = "kanban" | "bookmarks" | "servers" | "metrics"

interface ViewToggleProps {
  activeView: ViewType
  onViewChange: (view: ViewType) => void
  notifications?: {
    kanban?: { warning: number; overtime: number }
  }
}

export default function ViewToggle({ activeView, onViewChange, notifications }: ViewToggleProps) {
  const getActivePosition = () => {
    switch (activeView) {
      case "kanban":
        return "translate-x-0"
      case "bookmarks":
        return "translate-x-full"
      case "servers":
        return "translate-x-[200%]"
      case "metrics":
        return "translate-x-[300%]"
      default:
        return "translate-x-0"
    }
  }

  const kanbanNotifications = notifications?.kanban || { warning: 0, overtime: 0 }
  const hasNotifications = kanbanNotifications.warning > 0 || kanbanNotifications.overtime > 0

  return (
    <div className="flex justify-center w-full">
      <div className="glass-light dark:glass-dark rounded-xl p-1.5 shadow-2xl relative w-full max-w-2xl">
        <div className="flex space-x-1 relative">
          {/* Active indicator background */}
          <div
            className={`
              absolute top-1.5 bottom-1.5 left-1.5 rounded-lg transition-transform duration-300 ease-out shadow-lg
              bg-gradient-to-r from-blue-500/90 to-blue-600/90 dark:from-blue-400/90 dark:to-blue-500/90
              border border-blue-400/30 dark:border-blue-300/30
              ${getActivePosition()}
            `}
            style={{ width: "calc(25% - 0.1875rem)" }}
          />

          <button
            onClick={() => onViewChange("kanban")}
            className={`
              relative z-10 flex items-center px-2 sm:px-3 md:px-4 py-2.5 sm:py-3 md:py-3.5
              rounded-lg text-xs sm:text-sm font-bold transition-all duration-200 flex-1 justify-center
              ${activeView === "kanban"
                ? "text-white transform scale-[1.02] text-shadow"
                : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
              }
            `}
          >
            <div className="relative flex items-center">
              <IconLayoutKanban
                className={`w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 transition-all duration-200 flex-shrink-0 ${activeView === "kanban" ? "scale-110" : ""}`}
              />
              <span className="hidden sm:inline">Kanban</span>
              <span className="sm:hidden">Tasks</span>

              {/* Notification Badges */}
              {hasNotifications && (
                <div className="absolute -top-1 -right-1 flex space-x-1">
                  {kanbanNotifications.overtime > 0 && (
                    <div className="relative">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 bg-red-500 dark:bg-red-400 rounded-full flex items-center justify-center shadow-lg border border-white/20 animate-pulse">
                        <span className="text-white text-[8px] sm:text-[10px] font-bold leading-none">
                          {kanbanNotifications.overtime > 9 ? "9+" : kanbanNotifications.overtime}
                        </span>
                      </div>
                      <div className="absolute inset-0 w-4 h-4 sm:w-5 sm:h-5 bg-red-500/30 rounded-full animate-ping" />
                    </div>
                  )}

                  {kanbanNotifications.warning > 0 && (
                    <div className="relative">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 bg-yellow-500 dark:bg-yellow-400 rounded-full flex items-center justify-center shadow-lg border border-white/20">
                        <span className="text-white text-[8px] sm:text-[10px] font-bold leading-none">
                          {kanbanNotifications.warning > 9 ? "9+" : kanbanNotifications.warning}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </button>

          <button
            onClick={() => onViewChange("bookmarks")}
            className={`
              relative z-10 flex items-center px-2 sm:px-3 md:px-4 py-2.5 sm:py-3 md:py-3.5
              rounded-lg text-xs sm:text-sm font-bold transition-all duration-200 flex-1 justify-center
              ${activeView === "bookmarks"
                ? "text-white transform scale-[1.02] text-shadow"
                : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
              }
            `}
          >
            <IconBookmark
              className={`w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 transition-all duration-200 flex-shrink-0 ${activeView === "bookmarks" ? "scale-110" : ""}`}
            />
            <span className="hidden sm:inline">Bookmarks</span>
            <span className="sm:hidden">Links</span>
          </button>

          <button
            onClick={() => onViewChange("servers")}
            className={`
              relative z-10 flex items-center px-2 sm:px-3 md:px-4 py-2.5 sm:py-3 md:py-3.5
              rounded-lg text-xs sm:text-sm font-bold transition-all duration-200 flex-1 justify-center
              ${activeView === "servers"
                ? "text-white transform scale-[1.02] text-shadow"
                : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
              }
            `}
          >
            <IconServer
              className={`w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 transition-all duration-200 flex-shrink-0 ${activeView === "servers" ? "scale-110" : ""}`}
            />
            <span className="hidden sm:inline">Servers</span>
            <span className="sm:hidden">Servers</span>
          </button>

          <button
            onClick={() => onViewChange("metrics")}
            className={`
              relative z-10 flex items-center px-2 sm:px-3 md:px-4 py-2.5 sm:py-3 md:py-3.5
              rounded-lg text-xs sm:text-sm font-bold transition-all duration-200 flex-1 justify-center
              ${activeView === "metrics"
                ? "text-white transform scale-[1.02] text-shadow"
                : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
              }
            `}
          >
            <IconChartBar
              className={`w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 transition-all duration-200 flex-shrink-0 ${activeView === "metrics" ? "scale-110" : ""}`}
            />
            <span className="hidden sm:inline">Metrics</span>
            <span className="sm:hidden">Stats</span>
          </button>
        </div>

        {/* Notification Tooltip */}
        {hasNotifications && activeView !== "kanban" && (
          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 z-[9999] pointer-events-none">
            <div className="relative">
              <div className="absolute inset-0 bg-black/20 dark:bg-black/40 rounded-lg blur-sm scale-110" />
              <div className="relative bg-white/98 dark:bg-slate-900/98 backdrop-blur-xl rounded-lg px-4 py-3 shadow-2xl border-2 border-slate-200/80 dark:border-slate-700/80 text-sm whitespace-nowrap">
                <div className="flex items-center space-x-3 text-slate-800 dark:text-slate-200 font-semibold">
                  {kanbanNotifications.overtime > 0 && (
                    <span className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-lg" />
                      <span className="text-red-600 dark:text-red-400 font-bold">
                        {kanbanNotifications.overtime} overtime
                      </span>
                    </span>
                  )}
                  {kanbanNotifications.warning > 0 && (
                    <span className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full shadow-lg" />
                      <span className="text-yellow-600 dark:text-yellow-400 font-bold">
                        {kanbanNotifications.warning} near limit
                      </span>
                    </span>
                  )}
                </div>
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  <div className="w-4 h-4 bg-white dark:bg-slate-900 border-l-2 border-t-2 border-slate-200/80 dark:border-slate-700/80 rotate-45" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
