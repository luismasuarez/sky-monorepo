import { AccountType, PlanType, MembershipRole } from "../../../auth/types";
import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs';
import prisma from "@/lib/prisma/prisma.service";

try {
  const body = await req.json();
  const { accountType, email, name, password, organizationName, workspaceName, plan } = body;
  if (!accountType || !email || !name || !password) {
    return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
  }
  if (![AccountType.ORGANIZATION, AccountType.FREELANCER].includes(accountType)) {
    return NextResponse.json({ error: "Tipo de cuenta inválido" }, { status: 400 });
  }
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "El email ya está registrado" }, { status: 409 });
  }
  const hashed = await bcrypt.hash(password, 10);
  let user, organization, workspace;
  if (accountType === AccountType.ORGANIZATION) {
    if (!organizationName && !name) {
      return NextResponse.json({ error: "Nombre de organización requerido" }, { status: 400 });
    }
    user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        fullName: name,
        accountType: AccountType.ORGANIZATION,
      },
    });
    const slug = (organizationName || name).toLowerCase().replace(/\s+/g, "-");
    organization = await prisma.organization.create({
      data: {
        name: organizationName || name,
        slug,
        plan: plan || PlanType.FREE,
        createdBy: user.id,
      },
    });
    await prisma.organizationMembership.create({
      data: {
        organizationId: organization.id,
        userId: user.id,
        role: MembershipRole.OWNER,
      },
    });
    workspace = await prisma.workspace.create({
      data: {
        name: workspaceName || "Principal",
        organizationId: organization.id,
        ownerUserId: user.id,
        ownerType: "ORGANIZATION",
      },
    });
    return NextResponse.json({
      redirect: `/${organization.slug}/dashboard`,
      message: `¡Bienvenido, ${user.fullName}! Tu organización ha sido creada con el plan FREE.`,
      limits: "Puedes invitar miembros y crear equipos según el plan.",
    });
  } else {
    user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        fullName: name,
        accountType: AccountType.FREELANCER,
      },
    });
    workspace = await prisma.workspace.create({
      data: {
        name: workspaceName || "Personal",
        ownerUserId: user.id,
        ownerType: "USER",
      },
    });
    return NextResponse.json({
      redirect: `/workspace/dashboard`,
      message: `¡Bienvenido, ${user.fullName}! Tu cuenta freelancer está lista con el plan FREE.`,
      limits: "Puedes migrar a organización cuando lo desees.",
    });
  }
} catch (error: any) {
  return NextResponse.json({ error: error.message || "Error inesperado" }, { status: 400 });
}
}
