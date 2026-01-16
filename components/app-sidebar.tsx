'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import {
  IconHome,
  IconFolder,
  IconUsers,
  IconChecklist,
  IconBookmark,
  IconServer,
  IconSettings,
  IconBuilding,
  IconStack2,
  IconCreditCard,
  IconUserCircle,
} from '@tabler/icons-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function AppSidebar() {
  const pathname = usePathname()

  // TODO: Esta lógica vendrá del contexto de workspace cuando lo implementemos
  const isOrgWorkspace = false
  const permissions = {
    isOwner: true,
    isAdmin: false,
  }

  // Base navigation (always available)
  const baseNavigation = [
    {
      title: 'General',
      items: [
        { title: 'Dashboard', icon: IconHome, href: '/' },
      ],
    },
    {
      title: 'Workspace',
      items: [
        { title: 'Proyectos', icon: IconFolder, href: '/projects' },
        ...(isOrgWorkspace
          ? [{ title: 'Equipos', icon: IconUsers, href: '/teams' }]
          : []
        ),
        { title: 'Kanban', icon: IconChecklist, href: '/kanban' },
        { title: 'Bookmarks', icon: IconBookmark, href: '/bookmarks' },
        { title: 'Servidores', icon: IconServer, href: '/servers' },
      ],
    },
  ]

  // Settings section varies based on workspace type and permissions
  let settingsSection = []

  if (isOrgWorkspace && (permissions.isOwner || permissions.isAdmin)) {
    settingsSection = [
      {
        title: 'Administración',
        items: [
          ...(permissions.isOwner
            ? [{ title: 'Organización', icon: IconBuilding, href: '/settings/organization' }]
            : []
          ),
          { title: 'Workspaces', icon: IconStack2, href: '/settings/workspaces' },
          { title: 'Miembros', icon: IconUsers, href: '/settings/members' },
          ...(permissions.isOwner
            ? [{ title: 'Facturación', icon: IconCreditCard, href: '/settings/billing' }]
            : []
          ),
        ],
      },
    ]
  } else {
    settingsSection = [
      {
        title: 'Mi Cuenta',
        items: [
          { title: 'Perfil', icon: IconUserCircle, href: '/settings/profile' },
          { title: 'Preferencias', icon: IconSettings, href: '/settings/preferences' },
        ],
      },
    ]
  }

  const navigation = [...baseNavigation, ...settingsSection]

  return (
    <Sidebar className="glass-sidebar border-r">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <IconStack2 className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Dokkap</span>
            <span className="text-xs text-muted-foreground">Project Management</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="gap-2">
        {navigation.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel className="text-muted-foreground">
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={isActive}>
                        <Link href={item.href}>
                          <Icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  )
}
