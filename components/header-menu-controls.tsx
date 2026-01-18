// src/components/HeaderMenuControls.tsx
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  IconDownload,
  IconFileText,
  IconLogout,
  IconMoon,
  IconSettings,
  IconSun,
  IconUpload,
  IconUser
} from "@tabler/icons-react";

import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { IconBell, IconPlus, IconHelp, IconCheck, IconAlertCircle, IconChevronDown } from "@tabler/icons-react";
import { useState } from "react";

type SyncStatus = "ok" | "error" | "syncing";
interface HeaderMenuControlsProps {
  onBackup?: () => void;
  onRestore?: () => void;
  userName?: string;
  userAvatarUrl?: string;
  notifications?: Array<{ id: string; title: string; read: boolean; }>;
  onCreate?: () => void;
  workspaces?: Array<{ id: string; name: string }>;
  currentWorkspaceId?: string;
  onWorkspaceChange?: (id: string) => void;
  onHelp?: () => void;
  syncStatus?: SyncStatus;
}


export default function HeaderMenuControls({ onBackup, onRestore, notifications: notificationsProp, workspaces: workspacesProp, currentWorkspaceId: currentWorkspaceIdProp, syncStatus: syncStatusProp }: HeaderMenuControlsProps = {}) {
  const { resolvedTheme, setTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";
  const toggleDarkMode = () => setTheme(isDarkMode ? "light" : "dark");

  // Estado de notificaciones y workspace demo o prop
  const [showNotifications, setShowNotifications] = useState(false);
  const [showWorkspaces, setShowWorkspaces] = useState(false);
  const notifications = notificationsProp ?? [
    { id: "1", title: "Nueva tarea asignada", read: false },
    { id: "2", title: "Backup completado", read: true },
    { id: "3", title: "Actualización disponible", read: false },
  ];
  const unreadCount = notifications.filter(n => !n.read).length;
  const workspaces = workspacesProp ?? [
    { id: "w1", name: "Personal" },
    { id: "w2", name: "Equipo" },
  ];
  const currentWorkspaceId = currentWorkspaceIdProp ?? "w1";
  const syncStatus: SyncStatus = syncStatusProp ?? "ok";

  return (
    <div className="flex items-center justify-end gap-2 w-full">
      <div className="glass-light dark:glass-dark text-slate-900 dark:text-slate-100 rounded-xl px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 shadow-2xl text-shadow-sm min-h-[44px]">
        <div className="flex gap-1 sm:gap-2 items-center">
          {/* Indicador de sincronización */}
          <span title="Estado de sincronización">
            {syncStatus === "ok" && <IconCheck className="w-4 h-4 text-green-500" />}
            {syncStatus === "error" && <IconAlertCircle className="w-4 h-4 text-red-500" />}
            {syncStatus === "syncing" && <svg className="w-4 h-4 animate-spin text-blue-500" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /></svg>}
          </span>

          {/* Selector de workspace/proyecto */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center gap-1 px-2 text-xs font-medium">
                {workspaces.find(w => w.id === currentWorkspaceId)?.name || "Workspace"}
                <IconChevronDown className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-40">
              {workspaces.map(w => (
                <DropdownMenuItem key={w.id} onClick={() => { }} className={w.id === currentWorkspaceId ? "font-bold" : ""}>
                  {w.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Botón de acción rápida (+) */}
          <Button variant="ghost" size="icon" className="text-blue-600 hover:text-blue-800" title="Crear nuevo">
            <IconPlus className="w-5 h-5" />
          </Button>

          {/* Notificaciones */}
          <DropdownMenu open={showNotifications} onOpenChange={setShowNotifications}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative" title="Notificaciones">
                <IconBell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 bg-red-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">{unreadCount}</span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel>Notificaciones</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.slice(0, 5).map(n => (
                <DropdownMenuItem key={n.id} className={n.read ? "opacity-60" : "font-semibold"}>
                  {n.title}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-xs text-blue-600">Ver todas</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Icono de ayuda y feedback */}
          <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-900" title="Ayuda y feedback">
            <IconHelp className="w-5 h-5" />
          </Button>
          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/50 dark:hover:bg-slate-800/50 h-11 w-11 min-h-[44px] min-w-[44px] p-0 backdrop-blur-sm"
              >
                <IconUser className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-56 glass-light dark:glass-dark text-slate-900 dark:text-slate-100 shadow-lg"
            >
              <DropdownMenuLabel className="font-semibold">
                <div className="flex items-center space-x-2">
                  <IconUser className="w-4 h-4" />
                  <span>Cuenta de Usuario</span>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => { }}
                className="cursor-pointer text-slate-900 dark:text-slate-100 hover:text-slate-700 dark:hover:text-white"
              >
                <IconUser className="w-4 h-4 mr-2" />
                <span>Perfil</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => { }}
                className="cursor-pointer text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <IconLogout className="w-4 h-4 mr-2" />
                <span>Cerrar Sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Settings Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/50 dark:hover:bg-slate-800/50 h-11 w-11 min-h-[44px] min-w-[44px] p-0 backdrop-blur-sm"
              >
                <IconSettings className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 glass-light dark:glass-dark text-slate-900 dark:text-slate-100 shadow-lg"
            >
              <DropdownMenuLabel className="font-semibold">
                <div className="flex items-center space-x-2">
                  <IconSettings className="w-4 h-4" />
                  <span>Options</span>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="cursor-pointer">
                  <IconFileText className="w-4 h-4 mr-2" />
                  <span>Data & Backup</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent
                    className="glass-light dark:glass-dark text-slate-900 dark:text-slate-100 shadow"
                  >
                    {/* Full Backup & Restore - Most Important */}
                    <DropdownMenuItem
                      onClick={onBackup}
                      disabled={!onBackup}
                      className="cursor-pointer text-slate-900 dark:text-slate-100 hover:text-slate-700 dark:hover:text-white font-medium"
                    >
                      <IconDownload className="w-4 h-4 mr-2 text-blue-600" />
                      <span>Backup All Data</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={onRestore}
                      disabled={!onRestore}
                      className="cursor-pointer text-slate-900 dark:text-slate-100 hover:text-slate-700 dark:hover:text-white font-medium"
                    >
                      <IconUpload className="w-4 h-4 mr-2 text-green-600" />
                      <span>Restore Data</span>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            className="text-slate-600 dark:text-yellow-400 hover:text-slate-900 dark:hover:text-yellow-300 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 rounded-full h-11 w-11 min-h-[44px] min-w-[44px] p-0 backdrop-blur-sm"
          >
            {isDarkMode ? (
              <IconSun className="w-4 h-4 sm:w-5 sm:h-5" />
            ) : (
              <IconMoon className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
