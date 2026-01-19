// Servicios de autenticación adaptados a Auth.js v5 y Next.js 16
// Aquí solo se definen helpers si necesitas lógica adicional fuera de Auth.js

import { signIn, signOut } from "next-auth/react";
import type { LoginRequest } from "./types";

export const login = async (credentials: LoginRequest) => {
  // Utiliza el provider de credenciales de Auth.js
  return await signIn("credentials", {
    ...credentials,
    redirect: false,
  });
};

export const logout = async () => {
  await signOut({ redirect: true, callbackUrl: "/auth/signin" });
};

// Si necesitas registro, implementa vía API y luego signIn

// Multi-tenant onboarding stubs
import { AccountType, PlanType, MembershipRole, RegisterPayload } from "./types";

// Simulación de base de datos en memoria para validaciones preliminares
const mockDb = {
  users: [] as Array<{ id: string; name: string; email: string; accountType?: AccountType }>,
  organizations: [] as Array<{ id: string; name: string; ownerId: string; plan: PlanType; slug: string }>,
};

function isValidEmail(email: string) {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
}

export async function createUser({ name, email, accountType }: { name: string; email: string; accountType?: AccountType }) {
  if (!isValidEmail(email)) throw new Error("Email inválido");
  if (!name || name.length < 2) throw new Error("Nombre requerido");
  if (mockDb.users.find(u => u.email === email)) throw new Error("Email ya registrado");
  // Simula creación
  const user = { id: `user_${Date.now()}`, name, email, accountType };
  mockDb.users.push(user);
  return user;
}

export async function createOrganization({ name, ownerId, plan }: { name: string; ownerId: string; plan: PlanType }) {
  if (!name || name.length < 2) throw new Error("Nombre de organización requerido");
  const slug = name.toLowerCase().replace(/\s+/g, "-");
  if (mockDb.organizations.find(o => o.slug === slug)) throw new Error("Nombre de organización ya existe");
  // Limite de organizaciones por plan FREE (ejemplo: 1)
  const orgsByOwner = mockDb.organizations.filter(o => o.ownerId === ownerId && o.plan === PlanType.FREE);
  if (plan === PlanType.FREE && orgsByOwner.length >= 1) throw new Error("Solo puedes crear una organización FREE");
  const org = { id: `org_${Date.now()}`, name, ownerId, plan, slug };
  mockDb.organizations.push(org);
  return org;
}

export async function createOrganizationMembership({ organizationId, userId, role }: { organizationId: string; userId: string; role: MembershipRole }) {
  if (!organizationId || !userId || !role) throw new Error("Datos de membresía incompletos");
  // Simula creación
  return { id: `membership_${Date.now()}`, organizationId, userId, role };
}

export async function createWorkspace({ ownerType, organizationId, ownerId }: { ownerType: AccountType; organizationId?: string; ownerId: string }) {
  if (!ownerType || !ownerId) throw new Error("Datos de workspace incompletos");
  // Limite de workspaces por usuario/organización en plan FREE (ejemplo: 1)
  // Aquí podrías consultar mockDb si lo deseas
  return { id: `workspace_${Date.now()}`, ownerType, organizationId, ownerId };
}
