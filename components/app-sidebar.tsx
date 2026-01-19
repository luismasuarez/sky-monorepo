'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { NavMain } from "./sidebar-07/nav-main"
import { NavProjects } from "./sidebar-07/nav-projects"
import { NavUser } from "./sidebar-07/nav-user"
import { TeamSwitcher } from "./sidebar-07/team-switcher"

export function AppSidebar() {
  // Datos de ejemplo sidebar-07
  const data = {
    user: {
      name: "shadcn",
      email: "m@example.com",
      avatar: "/avatars/shadcn.jpg",
    },
    teams: [
      {
        name: "Acme Inc",
        logo: "GalleryVerticalEnd", // icon name, reemplazar por import real si se usa
        plan: "Enterprise",
      },
      {
        name: "Acme Corp.",
        logo: "AudioWaveform",
        plan: "Startup",
      },
      {
        name: "Evil Corp.",
        logo: "Command",
        plan: "Free",
      },
    ],
    navMain: [
      {
        title: "Playground",
        url: "#",
        icon: "SquareTerminal",
        isActive: true,
        items: [
          { title: "History", url: "#" },
          { title: "Starred", url: "#" },
          { title: "Settings", url: "#" },
        ],
      },
      {
        title: "Models",
        url: "#",
        icon: "Bot",
        items: [
          { title: "Genesis", url: "#" },
          { title: "Explorer", url: "#" },
          { title: "Quantum", url: "#" },
        ],
      },
      {
        title: "Documentation",
        url: "#",
        icon: "BookOpen",
        items: [
          { title: "Introduction", url: "#" },
          { title: "Get Started", url: "#" },
          { title: "Tutorials", url: "#" },
          { title: "Changelog", url: "#" },
        ],
      },
      {
        title: "Settings",
        url: "#",
        icon: "Settings2",
        items: [
          { title: "General", url: "#" },
          { title: "Team", url: "#" },
          { title: "Billing", url: "#" },
          { title: "Limits", url: "#" },
        ],
      },
    ],
    projects: [
      { name: "Design Engineering", url: "#", icon: "Frame" },
      { name: "Sales & Marketing", url: "#", icon: "PieChart" },
      { name: "Travel", url: "#", icon: "Map" },
    ],
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
