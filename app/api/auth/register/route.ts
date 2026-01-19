import { AccountType, PlanType, MembershipRole, RegisterPayload } from "../../../auth/types";
import { createUser, createOrganization, createOrganizationMembership, createWorkspace } from "../../../auth/services";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const payload: RegisterPayload = await req.json();

  // Validaciones básicas
  if (!payload.accountType || !payload.email || !payload.name) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  let user, organization, workspace;

  if (payload.accountType === AccountType.ORGANIZATION) {
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
}
