"use client"

import {
  IconBolt,
  IconBook,
  IconChevronRight,
  IconSettings,
  IconTerminal,
} from "@tabler/icons-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "../ui/sidebar"


const sidebarItems = [
  {
    title: "Dashboard",
    icon: "Bot",
    isActive: false,
    items: [
      { title: "Overview", url: "/dashboard" },
      { title: "Kanban", url: "/dashboard/core/kanban" },
    ],
  },
  {
    title: "Projects",
    icon: "BookOpen",
    isActive: false,
    items: [
      { title: "All Projects", url: "/projects" },
    ],
  },
  {
    title: "Workspace",
    icon: "SquareTerminal",
    isActive: false,
    items: [
      { title: "Workspace Home", url: "/workspace" },
    ],
  },
  {
    title: "Settings",
    icon: "Settings2",
    isActive: false,
    items: [
      { title: "General", url: "/pages/settings" },
    ],
  },
  {
    title: "Team",
    icon: "Badge",
    isActive: false,
    items: [
      { title: "Members", url: "/team" },
    ],
  },
  {
    title: "Auth",
    icon: "Terminal",
    isActive: false,
    items: [
      { title: "Sign In", url: "/auth/signin" },
      { title: "Logout", url: "/logout" },
    ],
  },
]

export function NavMain() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {sidebarItems.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon === "SquareTerminal" && <IconTerminal />}
                  {item.icon === "Bot" && <IconBolt />}
                  {item.icon === "BookOpen" && <IconBook />}
                  {item.icon === "Settings2" && <IconSettings />}
                  <span>{item.title}</span>
                  <IconChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
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
  )
}
