# Modelos de Datos y Entidades (Referencia para Prisma)

## Usuarios y Autenticación

```ts
// User (core/types/user.types.ts)
interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  createdAt: number;
  updatedAt: number;
}

// User (core/types/backend-api.d.ts)
interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}
```

## Organización y Espacios de Trabajo

```ts
// Organization (features/auth/types/onboardingTypes.ts)
interface Organization {
  id: string;
  name: string;
  ownerId: string;
  contactEmail?: string;
  contactName?: string;
  phone?: string;
  createdAt: number;
  updatedAt: number;
}

// Workspace (features/auth/types/onboardingTypes.ts)
interface Workspace {
  id: string;
  organizationId?: string;
  ownerUserId?: string;
  userId?: string; // legacy
  name: string;
  createdAt: number;
  updatedAt: number;
}

// WorkspaceMembership (features/auth/types/onboardingTypes.ts)
interface WorkspaceMembership {
  id: string;
  workspaceId: string;
  userId: string;
  role: 'owner' | 'admin' | 'contributor';
  status: 'active' | 'invited' | 'revoked';
  createdAt: number;
  updatedAt: number;
}
```

## Equipos

```ts
// Team (features/teams/types/team.types.ts)
interface Team {
  id: string;
  workspaceId: string;
  name: string;
  description?: string;
  avatar?: string;
  color?: string;
  memberCount?: number;
  createdAt: number;
  updatedAt: number;
  createdBy: string;
}

// TeamMember (features/teams/types/team.types.ts)
interface TeamMember {
  id: string;
  teamId: string;
  userId: string;
  role: 'lead' | 'member';
  joinedAt: number;
  userEmail?: string;
  userName?: string;
  userAvatarUrl?: string;
}
```

## Kanban y Proyectos

```ts
// KanbanItem (core/types/index.ts)
interface KanbanItem {
  id: string;
  title: string;
  description: string;
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
  projectId?: string;
}

// KanbanData (core/types/index.ts)
interface KanbanData {
  todo: KanbanItem[];
  inProgress: KanbanItem[];
  done: KanbanItem[];
}

// Project (core/types/index.ts)
interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt: number;
  updatedAt?: number;
}
```

## Bookmarks

```ts
// Bookmark (core/types/index.ts)
interface Bookmark {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
}
```

## Servidores

```ts
// Server (core/types/index.ts)
interface Server {
  id: string;
  name: string;
  url: string;
  username: string;
  password: string;
  environment: string;
}

// BackendServer (core/types/backend-api.d.ts)
interface BackendServer {
  id: string;
  name: string;
  url: string;
  username: string;
  password: string;
  environment: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  version: number;
}
```

## Sincronización y Operaciones

```ts
// PendingOperation (core/repositories/interfaces/repository-types.ts)
interface PendingOperation {
  id: string;
  type: 'create' | 'update' | 'delete';
  entityType: 'bookmark' | 'task' | 'server';
  entityId: string;
  data: any;
  timestamp: number;
  attempts: number;
  error?: string;
  organizationId?: string;
}
```

---

> **Nota:** Estos modelos están basados en los tipos TypeScript del frontend y pueden requerir ajustes para el modelado en Prisma según las relaciones y restricciones de tu base de datos.
