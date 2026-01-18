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

interface HeaderMenuControlsProps {
  onBackup?: () => void;
  onRestore?: () => void;
}

export default function HeaderMenuControls({ onBackup, onRestore }: HeaderMenuControlsProps = {}) {
  const { resolvedTheme, setTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";
  const toggleDarkMode = () => setTheme(isDarkMode ? "light" : "dark");

  return (
    <div className="flex items-center justify-end gap-2 w-full">
      <div className="
        glass-light dark:glass-dark
        text-slate-900 dark:text-slate-100
        rounded-xl px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3
        shadow-2xl text-shadow-sm
      ">
        <div className="flex gap-2">
          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/50 dark:hover:bg-slate-800/50 h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 backdrop-blur-sm"
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
                className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/50 dark:hover:bg-slate-800/50 h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 backdrop-blur-sm"
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
            className="text-slate-600 dark:text-yellow-400 hover:text-slate-900 dark:hover:text-yellow-300 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 rounded-full h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 backdrop-blur-sm"
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
