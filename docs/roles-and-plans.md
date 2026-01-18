# Dokkap – Roles, Planes y Modelo de Acceso

Este documento define cómo funcionan los tipos de cuenta, los planes y las reglas de acceso (RBAC/ABAC) en Dokkap.

Se basa en la premisa:

- Tenant raíz: **Organization** (pero también existe el modo **Freelancer**)
- Pieza central: **Workspace**
- Jerarquía de datos:
  - Workspace → Project → Task / UsefulLink / Credential
- Plan **FREE** existe tanto para `ORGANIZATION` como para `FREELANCER` y permite **trabajar** sin límites funcionales, pero no **escalar**.

---

## 1. Tipos de cuenta (AccountType)

```ts
AccountType = 'ORGANIZATION' | 'FREELANCER'
```

### 1.1. ORGANIZATION

- Representa una empresa, equipo o cliente que puede:
  - Tener múltiples usuarios y roles.
  - Crear equipos (Teams) en sus workspaces.
  - Invitar colaboradores.
  - Escalar a planes de pago (PRO, TEAM, ENTERPRISE).

### 1.2. FREELANCER

- Representa a una persona que trabaja sola.
- No tiene Teams ni invitaciones en el plan FREE.
- Puede trabajar con todos los features de proyecto:
  - Proyectos ilimitados
  - Tasks ilimitadas
  - Links ilimitados
  - Credentials
  - Kanban completo

En la base de datos, esto se modela con `User.accountType`:

```prisma
model User {
  id          String   @id @default(cuid())
  email       String   @unique
  fullName    String
  avatarUrl   String?
  accountType String   @default("FREELANCER") // 'FREELANCER' | 'ORGANIZATION'
  // ...existing code...
}
```

---

## 2. Planes (PlanType)

```ts
PlanType = 'FREE' | 'PRO' | 'TEAM' | 'ENTERPRISE'
```

- Los **planes no desbloquean features nuevas** a nivel de Project/Task.
- Los planes controlan **escala y colaboración**:
  - Número de workspaces
  - Número de usuarios
  - Número de teams

Ejemplo de límites por plan:

```ts
export interface PlanLimits {
  maxWorkspaces: number | 'UNLIMITED';
  maxMembers: number | 'UNLIMITED';
  maxTeams: number | 'UNLIMITED';
}

export const PLAN_LIMITS: Record<PlanType, PlanLimits> = {
  FREE: {
    maxWorkspaces: 1,
    maxMembers: 1,       // para freelancer; para org se puede ajustar a limitado
    maxTeams: 0,         // override por accountType
  },
  PRO: {
    maxWorkspaces: 3,
    maxMembers: 5,
    maxTeams: 3,
  },
  TEAM: {
    maxWorkspaces: 10,
    maxMembers: 20,
    maxTeams: 10,
  },
  ENTERPRISE: {
    maxWorkspaces: 'UNLIMITED',
    maxMembers: 'UNLIMITED',
    maxTeams: 'UNLIMITED',
  },
};
```

En la base de datos, el plan vive en `Organization.plan`:

```prisma
model Organization {
  id           String   @id @default(cuid())
  name         String
  slug         String   @unique
  plan         String   @default("FREE") // 'FREE' | 'PRO' | 'TEAM' | 'ENTERPRISE'
  // ...existing code...
}
```

---

## 3. Workspace (pieza central)

El **Workspace** es donde ocurre todo el trabajo:

- Contiene Projects.
- Contiene Tasks, Links y Credentials (a través de los Projects).
- Tiene un **owner**, que puede ser:
  - Una Organization
  - Un User (Freelancer)

Modelo propuesto:

```prisma
model Workspace {
  id             String   @id @default(cuid())
  name           String
  description    String?
  organizationId String?  // null cuando ownerType = 'USER'
  ownerUserId    String?  // null cuando ownerType = 'ORGANIZATION'
  ownerType      String   // 'ORGANIZATION' | 'USER'
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  organization Organization? @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  owner        User?         @relation("PersonalWorkspaces", fields: [ownerUserId], references: [id], onDelete: Cascade)
  // ...existing code...
}
```

### 3.1. Reglas de ownership

- **Organization FREE**
  - `ownerType = 'ORGANIZATION'`
  - `organizationId` no null
  - `maxWorkspaces = 1`
- **Freelancer FREE**
  - `ownerType = 'USER'`
  - `ownerUserId` no null
  - `maxWorkspaces = 1`

> Mismo límite de workspaces, distinto tipo de dueño.

---

## 4. Qué permite el Plan FREE (para ambos)

| Feature      | FREE |
| ------------ | ---- |
| Workspaces   | 1    |
| Projects     | ∞    |
| Tasks        | ∞    |
| Links        | ∞    |
| Kanban       | ✅    |
| Credentials  | ✅    |
| Files / Docs | ✅    |

No hay diferencias funcionales dentro del Workspace y del Project.

La diferencia está en:

- Colaboración (usuarios, teams)
- Multiplicidad de workspaces
- Billing

---

## 5. Teams

Los **Teams** solo existen en workspaces cuyo owner es una Organization.

Regla de negocio:

```ts
Team.workspace.ownerType === 'ORGANIZATION'
```

- Freelancer → no tiene Teams.
- Organization → puede tener Teams (limitados por plan).

A nivel Prisma, `Team` sigue ligado a `Workspace`:

```prisma
model Team {
  id          String   @id @default(cuid())
  workspaceId String
  name        String
  description String?
  color       String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  workspace   Workspace  @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  // ...existing code...
}
```

La restricción `workspace.ownerType === 'ORGANIZATION'` se aplica en la capa de lógica (guards), no en el esquema.

---

## 6. RBAC por nivel

### 6.1. Organization (tenant)

Roles (vía `OrganizationMembership`):

- `owner`
- `admin`
- `member`

Responsabilidades:

- `owner`:
  - Gestiona billing y plan.
  - Puede borrar la organización.
  - Puede ascender a otros usuarios a `admin`.
- `admin`:
  - Gestiona workspaces, teams y miembros dentro de la organización.
- `member`:
  - Puede trabajar en los workspaces/proyectos donde esté asignado.

### 6.2. Workspace

Roles (vía `WorkspaceMember`):

- `owner`
- `admin`
- `contributor`
- `viewer`

Uso típico:

- `owner` / `admin`:
  - Gestionan proyectos y teams del workspace.
- `contributor`:
  - Crea y edita proyectos y tasks.
- `viewer`:
  - Solo lectura.

### 6.3. Project

Roles (vía `ProjectMember`):

- `manager`
- `contributor`
- `viewer`

Uso típico:

- `manager`:
  - Configura el proyecto.
  - Gestiona credenciales y links.
  - Gestiona miembros del proyecto.
- `contributor`:
  - Crea/edita tasks.
  - Crea/edita links.
  - Acceso controlado a credenciales.
- `viewer`:
  - Solo lectura de tasks, links y metadatos de credenciales.

---

## 7. ABAC (atributos para refinar permisos)

Además de roles (RBAC), se usan atributos (ABAC) para decisiones más finas.

### 7.1. Ejemplos de atributos

- Usuario:
  - `user.id`, `user.accountType`.
- Membresías:
  - `OrganizationMembership.role`, `status`.
  - `WorkspaceMember.role`, `status`.
  - `ProjectMember.role`.
- Recursos:
  - `Project.workspace.organizationId`.
  - `Task.createdBy`, `Task.assignedTo`.
  - `Credential.type` (e.g. `'vps' | 'ssh' | 'api'`).

### 7.2. Reglas ABAC de ejemplo

- **Editar Task**:
  - Permitido si:
    - `Task.createdBy === user.id`, o
    - `Task.assignedTo === user.id`, o
    - `ProjectMember.role === 'manager'`.

- **Ver secretos de Credential (password/token)**:
  - Solo si:
    - `ProjectMember.role === 'manager'`.

- **Ver metadatos de Credential (name/type/host/username)**:
  - Permitido si:
    - `ProjectMember.role in ['manager', 'contributor', 'viewer']`.

---

## 8. Guards de negocio (helpers)

La lógica de límites y permisos se implementa con helpers reutilizables.

### 8.1. Workspaces por plan

```ts
import { AccountType, PlanType, PLAN_LIMITS } from './plans';

export function canCreateWorkspace(params: {
  accountType: AccountType;
  plan: PlanType;
  currentWorkspaceCount: number;
}): boolean {
  const limits = PLAN_LIMITS[params.plan];

  if (limits.maxWorkspaces === 'UNLIMITED') return true;

  // FREE: 1 workspace tanto para ORG como para FREELANCER
  if (params.currentWorkspaceCount >= limits.maxWorkspaces) {
    return false;
  }

  return true;
}
```

### 8.2. Crear Team

```ts
export function canCreateTeam(params: {
  accountType: AccountType;
  plan: PlanType;
  workspaceOwnerType: 'ORGANIZATION' | 'USER';
  currentTeamCount: number;
}): boolean {
  // Freelancer -> no teams
  if (params.accountType === 'FREELANCER') return false;
  // Solo workspaces de ORGANIZATION pueden tener teams
  if (params.workspaceOwnerType !== 'ORGANIZATION') return false;

  const limits = PLAN_LIMITS[params.plan];
  if (limits.maxTeams === 'UNLIMITED') return true;

  return params.currentTeamCount < limits.maxTeams;
}
```

### 8.3. Invitar usuarios

```ts
export function canInviteUser(params: {
  accountType: AccountType;
  plan: PlanType;
  currentMemberCount: number;
}): boolean {
  // Freelancer FREE: sin invitaciones
  if (params.accountType === 'FREELANCER') return false;

  const limits = PLAN_LIMITS[params.plan];
  if (limits.maxMembers === 'UNLIMITED') return true;

  return params.currentMemberCount < limits.maxMembers;
}
```

---

## 9. Regla de oro

> **FREE = trabajar**  
> **PAID = colaborar y escalar**

- FREE (Organization o Freelancer) tiene:
  - 1 Workspace
  - Proyectos/Tasks/Links/Credentials ilimitados.
- Planes de pago amplían:
  - Número de workspaces.
  - Número de usuarios.
