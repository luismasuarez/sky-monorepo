'use client';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import {
  IconChevronRight,
  IconFolder,
  IconGauge,
  IconLayoutKanban,
  IconLogin,
  IconLogout,
  IconSettings,
  IconTerminal,
  IconUsers,
} from '@tabler/icons-react';

const sidebarItems = [
  {
    title: 'Dashboard',
    icon: 'Gauge',
    isActive: false,
    items: [
      { title: 'Overview', url: '/dashboard', icon: 'Gauge' },
      { title: 'Kanban', url: '/dashboard/core/kanban', icon: 'LayoutKanban' },
    ],
  },
  {
    title: 'Projects',
    icon: 'Folder',
    isActive: false,
    items: [{ title: 'All Projects', url: '/projects', icon: 'Folder' }],
  },
  {
    title: 'Workspace',
    icon: 'Terminal',
    isActive: false,
    items: [{ title: 'Workspace Home', url: '/workspace', icon: 'Terminal' }],
  },
  {
    title: 'Settings',
    icon: 'Settings',
    isActive: false,
    items: [{ title: 'General', url: '/pages/settings', icon: 'Settings' }],
  },
  {
    title: 'Team',
    icon: 'Users',
    isActive: false,
    items: [{ title: 'Members', url: '/team', icon: 'Users' }],
  },
];

export function NavMain() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {sidebarItems.map(item => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon === 'Gauge' && <IconGauge />}
                  {item.icon === 'Folder' && <IconFolder />}
                  {item.icon === 'Users' && <IconUsers />}
                  {item.icon === 'Settings' && <IconSettings />}
                  {item.icon === 'Terminal' && <IconTerminal />}
                  {item.icon === 'LayoutKanban' && <IconLayoutKanban />}
                  {item.icon === 'Login' && <IconLogin />}
                  {item.icon === 'Logout' && <IconLogout />}
                  <span>{item.title}</span>
                  <IconChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map(subItem => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton asChild>
                        <a href={subItem.url}>
                          <span>{subItem.title}</span>
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
