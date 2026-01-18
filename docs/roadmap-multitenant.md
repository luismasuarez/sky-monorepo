# Dokkap – Roadmap Multi‑Tenant (Organization/Freelancer → Workspace → Project)

Este roadmap detalla cómo evolucionar Dokkap a una arquitectura multi‑tenant flexible, soportando tanto organizaciones como freelancers:

- Tenant raíz: **Organization** (pero también soporta cuentas tipo **Freelancer**)
- Jerarquía: `Organization/Freelancer → Workspace → Team → Project → Task/Links/Credentials`
- Stack actual: **Next.js (App Router) + React 19 + Prisma (con enums) + PostgreSQL + React Query + Zustand**

---

## 0. Objetivos

- Aislar datos por **Organization** (shared schema, multi‑tenant).
- Mantener una jerarquía clara y extensible:
  - Organization (quién paga)
  - Workspace (contexto de trabajo)
  - Team (quién trabaja)
  - Project (qué se construye)
  - Task / Links / Credentials (trabajo y recursos)
- Preparar la base para:
  - Permisos por organización, workspace y project.
  - Futuro billing por organización.

---

## 1. Modelo de datos (Prisma)

### 1.1. Definir tenant raíz y tipos de cuenta

- [x] `Organization` como tenant raíz, con `plan` y `limits` (usando enum `PlanType`).
- [x] Soporte para cuentas tipo **Freelancer** (`User.accountType` enum `AccountType`).
- [x] `Workspace` puede ser de una organización (`ownerType = ORGANIZATION`) o de un freelancer (`ownerType = USER`).

### 1.2. Jerarquía principal

- [x] `Workspace` pertenece a una `Organization` o a un `User` (freelancer), según `ownerType`.
- [x] `Team` pertenece a `Workspace` (solo si `ownerType = ORGANIZATION`).
- [x] `Project` pertenece a `Workspace`.
- [x] `Task`, `UsefulLink`, `Credential` pertenecen a `Project`.

```prisma
model Workspace {
  id             String       @id @default(cuid())
  organizationId String
  name           String
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt

  organization   Organization @relation(fields: [organizationId], references: [id])
  memberships    WorkspaceMembership[]
  teams          Team[]
  projects       Project[]

  @@index([organizationId])
}

model Team {
  id          String   @id @default(cuid())
  workspaceId String
  name        String
  description String?
  avatar      String?
  color       String?
  createdBy   String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  workspace   Workspace  @relation(fields: [workspaceId], references: [id])
  members     TeamMember[]
  projects    ProjectTeam[]

  @@index([workspaceId])
}

model Project {
  id          String        @id @default(cuid())
  workspaceId String
  name        String
  description String?
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt

  workspace   Workspace     @relation(fields: [workspaceId], references: [id])
  tasks       Task[]
  links       UsefulLink[]
  credentials Credential[]
  teams       ProjectTeam[]

  @@index([workspaceId])
}
```

### 1.3. Trabajo y recursos dentro del Project

- [x] `Task` ligada a `Project`.
- [x] `UsefulLink` ligada a `Project`.
- [x] `Credential` ligada a `Project`.

```prisma
model Task {
  id               String   @id @default(cuid())
  projectId        String
  title            String
  description      String?
  estimatedTime    Int?
  startTime        DateTime?
  completedTime    DateTime?
  totalTime        Int?
  pausedTime       Int?
  isPaused         Boolean  @default(false)
  lastPauseStart   DateTime?
  isOvertime       Boolean  @default(false)
  notificationSent Boolean  @default(false)
  quoteAmount      Float?

  project          Project  @relation(fields: [projectId], references: [id])

  @@index([projectId])
}

model UsefulLink {
  id          String   @id @default(cuid())
  projectId   String
  title       String
  description String
  url         String
  category    String
  createdAt   DateTime @default(now())
  createdById String?

  project     Project  @relation(fields: [projectId], references: [id])
  createdBy   User?    @relation(fields: [createdById], references: [id])

  @@index([projectId])
}

model Credential {
  id          String   @id @default(cuid())
  projectId   String
  name        String
  type        String
  host        String?
  username    String?
  password    String?
  token       String?
  notes       String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  createdById String?

  project     Project  @relation(fields: [projectId], references: [id])
  createdBy   User?    @relation(fields: [createdById], references: [id])

  @@index([projectId])
}
```

### 1.4. Membresías y roles (enums y colaboración externa)

- [x] `OrganizationMembership` (usuario interno de la organización, con enum `OrgRole`).
- [x] `WorkspaceMember` (acceso a workspace, con enum `WorkspaceRole`).
- [x] `ProjectMember` (colaboradores internos o freelancers invitados, con enum `ProjectRole`).
- [x] Todos los roles y tipos relevantes son enums de Prisma (`OrgRole`, `WorkspaceRole`, `ProjectRole`, `AccountType`, `OwnerType`, `PlanType`).
- [x] Freelancers invitados a proyectos NO requieren `OrganizationMembership`, pero cuentan para los límites de miembros activos.

---

## 2. Routing multi‑tenant en Next.js

### 2.1. Estructura de rutas por `orgSlug`

- [ ] Reorganizar `app/` a:

```text
app/
  layout.tsx           (root)
  [orgSlug]/
    layout.tsx         (layout tenant)
    page.tsx           (dashboard org / selector workspace)
    kanban/
      page.tsx
    projects/
      page.tsx
    tasks/
      page.tsx
```

### 2.2. Layout de organización

- [ ] Crear `app/[orgSlug]/layout.tsx` que:
  - Resuelve `Organization` por `slug`.
  - Envuelve con un `TenantProvider`.
  - Usa `DashboardLayout` / `app-sidebar` para UI.

```tsx
import { ReactNode } from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma/prisma.service";
import { TenantProvider } from "@/lib/tenant/tenant-context";
import { DashboardLayout } from "@/components/dashboard-layout";

interface OrgLayoutProps {
  children: ReactNode;
  params: { orgSlug: string };
}

export default async function OrgLayout({ children, params }: OrgLayoutProps) {
  const organization = await prisma.organization.findUnique({
    where: { slug: params.orgSlug },
    select: { id: true, slug: true, name: true },
  });

  if (!organization) {
    notFound();
  }

  return (
    <TenantProvider organization={organization}>
      <DashboardLayout>{children}</DashboardLayout>
    </TenantProvider>
  );
}
```

---

## 3. Contexto de Tenant

### 3.1. TenantProvider (client)

- [ ] Crear `lib/tenant/tenant-context.tsx` para exponer `organization` en el árbol de React.

```tsx
"use client";

import { createContext, useContext } from "react";

export interface TenantOrganization {
  id: string;
  slug: string;
  name: string;
}

const TenantContext = createContext<TenantOrganization | null>(null);

export function TenantProvider({
  organization,
  children,
}: {
  organization: TenantOrganization;
  children: React.ReactNode;
}) {
  return (
    <TenantContext.Provider value={organization}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const ctx = useContext(TenantContext);
  if (!ctx) {
    throw new Error("useTenant must be used within TenantProvider");
  }
  return ctx;
}
```

### 3.2. Integración con componentes

- [ ] Actualizar `app-sidebar`, `dashboard-layout`, `header` para:
  - Mostrar nombre de la organización.
  - Construir rutas con `/${orgSlug}/...`.
- [ ] Evitar rutas “planas” sin `orgSlug` para vistas de datos.

---

## 4. Acceso a datos multi‑tenant (Prisma)

### 4.1. Wrapper `orgScoped` para Prisma

- [ ] Extender `lib/prisma/prisma.service.ts` con helpers que filtren por `organizationId` vía relaciones.

```ts
import { PrismaClient, Prisma } from "@prisma/client";

export const prisma = new PrismaClient();

export function orgScoped(prismaClient: PrismaClient, organizationId: string) {
  return {
    project: {
      findMany(args: Prisma.ProjectFindManyArgs = {}) {
        return prismaClient.project.findMany({
          ...args,
          where: {
            ...args.where,
            workspace: {
              organizationId,
            },
          },
        });
      },
      findUniqueInOrg(projectId: string) {
        return prismaClient.project.findFirst({
          where: {
            id: projectId,
            workspace: { organizationId },
          },
        });
      },
    },
    task: {
      findManyByProject(
        projectId: string,
        args: Prisma.TaskFindManyArgs = {},
      ) {
        return prismaClient.task.findMany({
          ...args,
          where: {
            ...args.where,
            projectId,
            project: {
              workspace: {
                organizationId,
              },
            },
          },
        });
      },
    },
    // Extender con links, credentials, etc.
  };
}
```

### 4.2. Uso en server components / server actions

- [ ] En páginas server (ej. `/[orgSlug]/projects/page.tsx`):
  - Resolver `orgSlug` → `org.id`.
  - Crear `const db = orgScoped(prisma, org.id)`.
  - Usar `db.project.*`, `db.task.*`, etc.

---

## 5. React Query y cache por tenant

### 5.1. Keys con tenant

- [ ] Actualizar hooks / queries para incluir `organizationId` en las keys:

```ts
["projects", organizationId]
["tasks", organizationId, projectId]
["links", organizationId, projectId]
["credentials", organizationId, projectId]
```

### 5.2. Prefetch en layouts

- [ ] Opcional: hacer prefetch de datos clave en `app/[orgSlug]/layout.tsx` o en server components y rehidratarlos en React Query.

---

## 6. Seguridad, límites y permisos

### 6.1. Membresías y colaboradores

- [x] `OrganizationMembership` define miembros internos (cuentan para límites y tienen acceso global).
- [x] `ProjectMember` permite invitar freelancers externos a proyectos concretos (también cuentan para límites de plan).
- [x] Los límites de plan (`maxMembers`) consideran todos los usuarios con acceso activo a recursos de la organización (internos y externos).

### 6.2. Validaciones y guards

- [x] Antes de acceder a recursos sensibles:
  - Verificar que el usuario tiene acceso por `OrganizationMembership`, `WorkspaceMember` o `ProjectMember`.
  - Validar límites de plan antes de invitar a nuevos colaboradores (internos o externos).
  - Roles y permisos se controlan vía enums y helpers RBAC/ABAC.

---

## 7. Migraciones y transición

### 7.1. Migración de esquema

- [ ] Actualizar `schema.prisma` con nuevos modelos/relaciones.
- [ ] Ejecutar:

```bash
npm run prisma:migrate
```

### 7.2. Migración de datos (si ya hay datos)

- [ ] Script para:
  - Crear una `Organization` por cliente actual o global (“Default Org”).
  - Crear un `Workspace` por conjunto lógico de proyectos.
  - Asignar `organizationId`/`workspaceId` a proyectos, tareas, etc.

---

## 8. Fases de entrega

### Fase 1 – Base de datos y tenant mínimo

- [ ] Definir modelos (`Organization`, `Workspace`, `Project`, etc.).
- [ ] Añadir `orgSlug` y rutas `/[orgSlug]/...`.
- [ ] Mostrar datos de una sola organización “por defecto”.

### Fase 2 – Aislamiento real por Organization

- [ ] Implementar `TenantProvider` y `orgScoped`.
- [ ] Adaptar páginas `kanban`, `projects`, `tasks` a usar `orgSlug`.
- [ ] Añadir tests básicos de aislamiento (un org no ve datos de otra).

### Fase 3 – Roles y permisos

- [ ] Añadir `OrganizationMembership` y `WorkspaceMembership`.
- [ ] Implementar chequeos de permisos en server actions.
- [ ] Restringir UI según rol (owner/admin/member).

### Fase 4 – UX multi‑tenant

- [ ] Selector de organización (si el usuario pertenece a varias).
- [ ] Selector de workspace dentro de una organización.
- [ ] Mejorar navegación lateral con contexto de tenant.

---

## 9. Futuras extensiones

- Billing por organización (planes, límites, upgrades/downgrades de freelancer a organización y viceversa).
- Auditoría por tenant (logs con `organizationId`).
- Credenciales compartidas a nivel `Workspace` u `Organization` cuando tenga sentido.
- Soporte para subdominios por organización (`org.dokkap.com` además de `/[orgSlug]`).
- Flags de archivado/borrado suave para soportar flujos de downgrade y migración de workspaces.
