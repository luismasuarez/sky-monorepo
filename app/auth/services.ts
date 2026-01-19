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

export async function createUser({ name, email, accountType }: { name: string; email: string; accountType?: AccountType }) {
  // TODO: Implementar lógica real (ORM/DB)
  return { id: "user_mock_id", name, email, accountType };
}

export async function createOrganization({ name, ownerId, plan }: { name: string; ownerId: string; plan: PlanType }) {
  // TODO: Implementar lógica real (ORM/DB)
  return { id: "org_mock_id", name, ownerId, plan, slug: name.toLowerCase().replace(/\s+/g, "-") };
}

export async function createOrganizationMembership({ organizationId, userId, role }: { organizationId: string; userId: string; role: MembershipRole }) {
  // TODO: Implementar lógica real (ORM/DB)
  return { id: "membership_mock_id", organizationId, userId, role };
}

export async function createWorkspace({ ownerType, organizationId, ownerId }: { ownerType: AccountType; organizationId?: string; ownerId: string }) {
  // TODO: Implementar lógica real (ORM/DB)
  return { id: "workspace_mock_id", ownerType, organizationId, ownerId };
}
