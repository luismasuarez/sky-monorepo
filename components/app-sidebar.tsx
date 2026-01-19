'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import { NavMain } from './sidebar/nav-main';
import { NavProjects } from './sidebar/nav-projects';
import { NavUser } from './sidebar/nav-user';
import { TeamSwitcher } from './sidebar/team-switcher';

export function AppSidebar() {
  // Datos de ejemplo sidebar-07
  const data = {
    user: {
      name: 'shadcn',
      email: 'm@example.com',
      avatar: '/avatars/shadcn.jpg',
    },
    teams: [
      {
        name: 'Acme Inc',
        logo: 'GalleryVerticalEnd', // icon name, reemplazar por import real si se usa
        plan: 'Enterprise',
      },
      {
        name: 'Acme Corp.',
        logo: 'AudioWaveform',
        plan: 'Startup',
      },
      {
        name: 'Evil Corp.',
        logo: 'Command',
        plan: 'Free',
      },
    ],
    navMain: [
      {
        title: 'Playground',
        url: '#',
        icon: 'SquareTerminal',
        isActive: true,
        items: [
          { title: 'History', url: '#' },
          { title: 'Starred', url: '#' },
          { title: 'Settings', url: '#' },
        ],
      },
      {
        title: 'Models',
        url: '#',
        icon: 'Bot',
        items: [
          { title: 'Genesis', url: '#' },
          { title: 'Explorer', url: '#' },
          { title: 'Quantum', url: '#' },
        ],
      },
      {
        title: 'Documentation',
        url: '#',
        icon: 'BookOpen',
        items: [
          { title: 'Introduction', url: '#' },
          { title: 'Get Started', url: '#' },
          { title: 'Tutorials', url: '#' },
          { title: 'Changelog', url: '#' },
        ],
      },
      {
        title: 'Settings',
        url: '#',
        icon: 'Settings2',
        items: [
          { title: 'General', url: '#' },
          { title: 'Team', url: '#' },
          { title: 'Billing', url: '#' },
          { title: 'Limits', url: '#' },
        ],
      },
    ],
    projects: [
      { name: 'Design Engineering', url: '#', icon: 'Frame' },
      { name: 'Sales & Marketing', url: '#', icon: 'PieChart' },
      { name: 'Travel', url: '#', icon: 'Map' },
    ],
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <TeamSwitcher teams={[]} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
        <NavProjects projects={[]} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
