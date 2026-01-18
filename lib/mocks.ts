// Kanban mocks para UI moderna (alineados a Task de Prisma y legacy)
export type KanbanColumnType = 'todo' | 'in-progress' | 'done';

export interface KanbanTaskMock {
  id: string;
  workspaceId: string;
  projectId: string;
  teamId?: string;
  title: string;
  description?: string;
  column: KanbanColumnType;
  estimatedTime?: number;
  startTime?: number;
  completedTime?: number;
  totalTime?: number;
  pausedTime?: number;
  isPaused?: boolean;
  lastPauseStart?: number;
  isOvertime?: boolean;
  notificationSent?: boolean;
  quoteAmount?: number;
  assignedTo: string;
  priority?: 'low' | 'medium' | 'high';
  tags?: string[];
  dueDate?: number;
  createdAt: number;
  updatedAt: number;
  createdBy: string;
}

export interface KanbanMockData {
  todo: KanbanTaskMock[];
  inProgress: KanbanTaskMock[];
  done: KanbanTaskMock[];
}

export const kanbanMockData: KanbanMockData = {
  todo: [
    {
      id: "task-1",
      workspaceId: "ws-1",
      projectId: "prj-1",
      title: "Diseñar wireframes",
      description: "Crear wireframes para la nueva landing page",
      column: "todo",
      assignedTo: "user-1",
      priority: "high",
      tags: ["diseño", "ux"],
      dueDate: Date.now() + 86400000,
      createdAt: Date.now() - 86400000,
      updatedAt: Date.now(),
      createdBy: "user-2"
    }
  ],
  inProgress: [
    {
      id: "task-2",
      workspaceId: "ws-1",
      projectId: "prj-1",
      title: "Implementar API de usuarios",
      description: "Desarrollar endpoints para gestión de usuarios",
      column: "in-progress",
      assignedTo: "user-2",
      priority: "medium",
      tags: ["backend", "api"],
      dueDate: Date.now() + 172800000,
      createdAt: Date.now() - 172800000,
      updatedAt: Date.now(),
      createdBy: "user-1"
    }
  ],
  done: [
    {
      id: "task-3",
      workspaceId: "ws-1",
      projectId: "prj-1",
      title: "Setup inicial de proyecto",
      description: "Configurar repositorio y CI/CD",
      column: "done",
      assignedTo: "user-3",
      priority: "low",
      tags: ["devops"],
      dueDate: Date.now() - 86400000,
      createdAt: Date.now() - 259200000,
      updatedAt: Date.now() - 86400000,
      createdBy: "user-1"
    }
  ]
};
// Tipos ligeros para mocks basados en el schema de Prisma.
// No usamos los tipos generados completos para evitar acoplamiento a DefaultSelection.

export type MockUser = {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
  accountType: "FREELANCER" | "ORGANIZATION";
  createdAt: Date;
  updatedAt: Date;
};

export type MockWorkspace = {
  id: string;
  name: string;
  description: string | null;
  organizationId: string | null;
  ownerUserId: string | null;
  ownerType: "USER" | "ORGANIZATION";
  createdAt: Date;
  updatedAt: Date;
};

export type MockTeam = {
  id: string;
  workspaceId: string;
  name: string;
  description: string | null;
  color: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type MockProject = {
  id: string;
  workspaceId: string;
  teamId: string | null;
  name: string;
  description: string | null;
  status: string;
  priority: string;
  startDate: Date | null;
  dueDate: Date | null;
  completedAt: Date | null;
  progress: number;
  tags: string[];
  color: string | null;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
};

export type MockTask = {
  id: string;
  projectId: string;
  workspaceId: string;
  teamId: string | null;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  assignedTo: string | null;
  estimatedTime: bigint | null;
  startTime: Date | null;
  completedTime: Date | null;
  totalTime: bigint | null;
  pausedTime: bigint | null;
  isPaused: boolean;
  lastPauseStart: Date | null;
  isOvertime: boolean;
  notificationSent: boolean;
  quoteAmount: number | null;
  tags: string[];
  dueDate: Date | null;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
};

export type MockUsefulLink = {
  id: string;
  projectId: string;
  title: string;
  description: string;
  url: string;
  category: string;
  createdAt: Date;
  createdById: string | null;
};

export type MockCredential = {
  id: string;
  projectId: string;
  name: string;
  type: string;
  host: string | null;
  username: string | null;
  password: string | null;
  token: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  createdById: string | null;
};

// Simple helpers to generate dates
const now = new Date();
const daysFromNow = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
};

export const mockUser: MockUser = {
  id: "user_1",
  email: "founder@example.com",
  fullName: "Founding User",
  avatarUrl: null,
  accountType: "FREELANCER",
  createdAt: now,
  updatedAt: now,
};

export const mockWorkspace: MockWorkspace = {
  id: "ws_1",
  name: "Personal Workspace",
  description: "Main workspace for demos and testing",
  organizationId: null,
  ownerUserId: mockUser.id,
  ownerType: "USER",
  createdAt: now,
  updatedAt: now,
};

export const mockTeams: MockTeam[] = [
  {
    id: "team_1",
    workspaceId: mockWorkspace.id,
    name: "Product",
  description: "Product and design",
  color: "#6366F1",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "team_2",
    workspaceId: mockWorkspace.id,
    name: "Engineering",
  description: "Engineering and infrastructure",
  color: "#22C55E",
    createdAt: now,
    updatedAt: now,
  },
];

export const mockProjects: MockProject[] = [
  {
    id: "proj_1",
    workspaceId: mockWorkspace.id,
    teamId: "team_1",
    name: "Landing Page Revamp",
    description: "Redesign marketing site for better conversions",
    status: "active",
    priority: "high",
    startDate: daysFromNow(-14),
    dueDate: daysFromNow(14),
    completedAt: null,
    progress: 45,
  tags: ["marketing", "design"],
  color: "#F97316",
    createdAt: now,
    updatedAt: now,
    createdBy: mockUser.id,
  },
  {
    id: "proj_2",
    workspaceId: mockWorkspace.id,
    teamId: "team_2",
    name: "Backend Refactor",
    description: "Clean up services and introduce new architecture",
    status: "planning",
    priority: "medium",
    startDate: null,
    dueDate: daysFromNow(30),
    completedAt: null,
    progress: 10,
    tags: ["tech-debt", "api"],
    color: "#0EA5E9",
    createdAt: now,
    updatedAt: now,
    createdBy: mockUser.id,
  },
  {
    id: "proj_3",
    workspaceId: mockWorkspace.id,
    teamId: "team_2",
    name: "Infra Hardening",
    description: "Improve reliability and observability",
    status: "active",
    priority: "high",
    startDate: daysFromNow(-7),
    dueDate: daysFromNow(21),
    completedAt: null,
    progress: 30,
    tags: ["infra", "sre"],
    color: "#22C55E",
    createdAt: now,
    updatedAt: now,
    createdBy: mockUser.id,
  },
];

export const mockTasks: MockTask[] = [
  {
    id: "task_1",
    projectId: "proj_1",
    workspaceId: mockWorkspace.id,
    teamId: "team_1",
    title: "Define new hero section",
    description: "Work with design to define new hero layout",
    status: "todo",
    priority: "high",
    assignedTo: mockUser.id,
    estimatedTime: BigInt(3 * 60 * 60 * 1000),
    startTime: null,
    completedTime: null,
    totalTime: null,
    pausedTime: null,
    isPaused: false,
    lastPauseStart: null,
    isOvertime: false,
    notificationSent: false,
    quoteAmount: 500,
  tags: ["design", "copy"],
    dueDate: daysFromNow(3),
    order: 1,
    createdAt: now,
    updatedAt: now,
    createdBy: mockUser.id,
  },
  {
    id: "task_2",
    projectId: "proj_1",
    workspaceId: mockWorkspace.id,
    teamId: "team_1",
    title: "Implement pricing section",
    description: "Responsive pricing table with tiers",
    status: "in-progress",
    priority: "medium",
    assignedTo: mockUser.id,
    estimatedTime: BigInt(5 * 60 * 60 * 1000),
    startTime: daysFromNow(-1),
    completedTime: null,
    totalTime: null,
    pausedTime: null,
    isPaused: false,
    lastPauseStart: null,
    isOvertime: false,
    notificationSent: false,
    quoteAmount: 800,
    tags: ["frontend"],
    dueDate: daysFromNow(5),
    order: 2,
    createdAt: now,
    updatedAt: now,
    createdBy: mockUser.id,
  },
  {
    id: "task_3",
    projectId: "proj_1",
    workspaceId: mockWorkspace.id,
    teamId: "team_1",
    title: "Copy review",
    description: "Finalize marketing copy",
    status: "done",
    priority: "low",
    assignedTo: mockUser.id,
    estimatedTime: BigInt(60 * 60 * 1000),
    startTime: daysFromNow(-3),
    completedTime: daysFromNow(-1),
    totalTime: BigInt(2 * 60 * 60 * 1000),
    pausedTime: BigInt(30 * 60 * 1000),
    isPaused: false,
    lastPauseStart: null,
    isOvertime: false,
    notificationSent: true,
    quoteAmount: 200,
    tags: ["copy"],
    dueDate: daysFromNow(-1),
    order: 3,
    createdAt: now,
    updatedAt: now,
    createdBy: mockUser.id,
  },
  {
    id: "task_4",
    projectId: "proj_2",
    workspaceId: mockWorkspace.id,
    teamId: "team_2",
    title: "Map current services",
    description: "Inventory of existing microservices",
    status: "todo",
    priority: "medium",
    assignedTo: mockUser.id,
    estimatedTime: BigInt(2 * 60 * 60 * 1000),
    startTime: null,
    completedTime: null,
    totalTime: null,
    pausedTime: null,
    isPaused: false,
    lastPauseStart: null,
    isOvertime: false,
    notificationSent: false,
    quoteAmount: 300,
    tags: ["backend"],
    dueDate: daysFromNow(10),
    order: 1,
    createdAt: now,
    updatedAt: now,
    createdBy: mockUser.id,
  },
  {
    id: "task_5",
    projectId: "proj_3",
    workspaceId: mockWorkspace.id,
    teamId: "team_2",
    title: "Set up monitoring",
    description: "Add metrics and dashboards",
    status: "in-progress",
    priority: "high",
    assignedTo: mockUser.id,
    estimatedTime: BigInt(4 * 60 * 60 * 1000),
    startTime: daysFromNow(-2),
    completedTime: null,
    totalTime: null,
    pausedTime: null,
    isPaused: false,
    lastPauseStart: null,
    isOvertime: true,
    notificationSent: true,
    quoteAmount: 900,
    tags: ["infra", "monitoring"],
    dueDate: daysFromNow(1),
    order: 1,
    createdAt: now,
    updatedAt: now,
    createdBy: mockUser.id,
  },
];

export const mockLinks: MockUsefulLink[] = [
  {
    id: "link_1",
    projectId: "proj_1",
    title: "Figma design file",
    description: "Main design source of truth",
    url: "https://figma.com/file/example",
    category: "design",
    createdAt: now,
    createdById: mockUser.id,
  },
  {
    id: "link_2",
    projectId: "proj_2",
    title: "API guidelines",
    description: "Internal API design guidelines",
    url: "https://docs.example.com/api-guidelines",
    category: "docs",
    createdAt: now,
    createdById: mockUser.id,
  },
  {
    id: "link_3",
    projectId: "proj_3",
    title: "SRE runbook",
    description: "Playbooks for incidents",
    url: "https://docs.example.com/sre-runbook",
    category: "infra",
    createdAt: now,
    createdById: mockUser.id,
  },
];

export const mockCredentials: MockCredential[] = [
  {
    id: "cred_1",
    projectId: "proj_3",
    name: "Production VPS",
    type: "vps",
    host: "prod.example.com",
    username: "dokkap",
    password: null,
    token: null,
    notes: "Main production server",
    createdAt: now,
    updatedAt: now,
    createdById: mockUser.id,
  },
  {
    id: "cred_2",
    projectId: "proj_3",
    name: "Staging VPS",
    type: "vps",
    host: "staging.example.com",
    username: "dokkap",
    password: null,
    token: null,
    notes: "Staging environment",
    createdAt: now,
    updatedAt: now,
    createdById: mockUser.id,
  },
  {
    id: "cred_3",
    projectId: "proj_2",
    name: "GitHub PAT",
    type: "api",
    host: "github.com",
    username: null,
    password: null,
    token: "ghp_example",
    notes: "Token for CI",
    createdAt: now,
    updatedAt: now,
    createdById: mockUser.id,
  },
];
