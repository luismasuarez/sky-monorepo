import { AccountType, PlanType, MembershipRole, RegisterPayload } from "../../../auth/types";
import { createUser, createOrganization, createOrganizationMembership, createWorkspace } from "../../../auth/services";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const payload: RegisterPayload = await req.json();

    // Guard: Validaciones básicas
    if (!payload.accountType || !payload.email || !payload.name) {
      return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
    }

    // Guard: Solo se permite ORGANIZATION o FREELANCER
    if (![AccountType.ORGANIZATION, AccountType.FREELANCER].includes(payload.accountType)) {
      return NextResponse.json({ error: "Tipo de cuenta inválido" }, { status: 400 });
    }

    let user, organization, workspace;

    if (payload.accountType === AccountType.ORGANIZATION) {
      // Guard: Nombre de organización requerido
      if (!payload.organizationName && !payload.name) {
        return NextResponse.json({ error: "Nombre de organización requerido" }, { status: 400 });
      }
      user = await createUser({ name: payload.name, email: payload.email });
      organization = await createOrganization({
        name: payload.organizationName || payload.name,
        ownerId: user.id,
        plan: payload.plan || PlanType.FREE,
      });
      await createOrganizationMembership({
        organizationId: organization.id,
        userId: user.id,
        role: MembershipRole.OWNER,
      });
      workspace = await createWorkspace({
        ownerType: AccountType.ORGANIZATION,
        organizationId: organization.id,
        ownerId: user.id,
      });
      return NextResponse.json({
        redirect: `/${organization.slug}/dashboard`,
        message: `¡Bienvenido, ${user.name}! Tu organización ha sido creada con el plan FREE.`,
        limits: "Puedes invitar miembros y crear equipos según el plan.",
      });
    } else {
      user = await createUser({
        name: payload.name,
        email: payload.email,
        accountType: AccountType.FREELANCER,
      });
      workspace = await createWorkspace({
        ownerType: AccountType.FREELANCER,
        ownerId: user.id,
      });
      return NextResponse.json({
        redirect: `/workspace/dashboard`,
        message: `¡Bienvenido, ${user.name}! Tu cuenta freelancer está lista con el plan FREE.`,
        limits: "Puedes migrar a organización cuando lo desees.",
      });
    }
  } catch (error: any) {
    // Guard: Manejo de errores de validación y lógica
    return NextResponse.json({ error: error.message || "Error inesperado" }, { status: 400 });
  }
}
