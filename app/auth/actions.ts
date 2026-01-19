"use server";


import { OrgRole, OwnerType, WorkspaceRole } from '@/lib/generated/prisma/enums';
import prisma from '@/lib/prisma/prisma.service';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';
import { AccountType, PlanType } from './types';

export async function registerUser(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const fullName = formData.get('fullName') as string;

  if (!email || !password || !fullName) {
    return { error: 'Todos los campos son obligatorios' };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: 'El usuario ya existe' };
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, password: hashed, fullName },
    select: { id: true, email: true, fullName: true }
  });

  return { user };
}

export async function loginUser(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email y contraseña requeridos' };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return { error: 'Usuario no encontrado' };
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return { error: 'Contraseña incorrecta' };
  }

  // Aquí deberías iniciar sesión con NextAuth o devolver el usuario
  return { user: { id: user.id, email: user.email, fullName: user.fullName } };
}

// Server Actions para Onboarding Multi-tenant

export async function createOrganizationOnboarding(formData: FormData) {
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const organizationName = formData.get('organizationName') as string;
    const workspaceName = formData.get('workspaceName') as string;
    const contactName = formData.get('contactName') as string;
    const phone = formData.get('phone') as string;

    // Validaciones básicas
    if (!email || !password || !organizationName || !workspaceName) {
      return { error: 'Campos requeridos faltantes' };
    }

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return { error: 'El email ya está registrado' };
    }

    // Generar slug único para la organización
    const baseSlug = organizationName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    let slug = baseSlug;
    let counter = 1;
    while (await prisma.organization.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Crear usuario
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName: contactName || email.split('@')[0],
        accountType: AccountType.ORGANIZATION,
      },
    });

    // Crear organización
    const organization = await prisma.organization.create({
      data: {
        name: organizationName,
        slug,
        plan: PlanType.FREE,
        contactEmail: email,
        contactName: contactName || null,
        phone: phone || null,
        createdBy: user.id,
      },
    });

    // Crear membresía de organización
    await prisma.organizationMembership.create({
      data: {
        organizationId: organization.id,
        userId: user.id,
        role: OrgRole.OWNER,
        status: 'active',
        joinedAt: new Date(),
      },
    });

    // Crear workspace
    const workspace = await prisma.workspace.create({
      data: {
        name: workspaceName,
        organizationId: organization.id,
        ownerType: OwnerType.ORGANIZATION,
      },
    });

    // Crear membresía de workspace
    await prisma.workspaceMember.create({
      data: {
        workspaceId: workspace.id,
        userId: user.id,
        role: WorkspaceRole.OWNER,
        status: 'active',
        joinedAt: new Date(),
      },
    });

    // Revalidar y redirigir
    revalidatePath('/');
    return { success: true, redirectUrl: `/${organization.slug}/dashboard` };

  } catch (error) {
    console.error('Error en onboarding de organización:', error);
    return { error: 'Error al crear la organización. Inténtalo de nuevo.' };
  }
}

export async function createFreelancerOnboarding(formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // Validaciones básicas
    if (!name || !email || !password) {
      return { error: 'Todos los campos son obligatorios' };
    }

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return { error: 'El email ya está registrado' };
    }

    // Crear usuario
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName: name,
        accountType: AccountType.FREELANCER,
      },
    });

    // Crear workspace personal
    const workspace = await prisma.workspace.create({
      data: {
        name: 'Personal',
        ownerUserId: user.id,
        ownerType: OwnerType.USER,
      },
    });

    // Crear membresía de workspace
    await prisma.workspaceMember.create({
      data: {
        workspaceId: workspace.id,
        userId: user.id,
        role: WorkspaceRole.OWNER,
        status: 'active',
        joinedAt: new Date(),
      },
    });

    // Revalidar y redirigir
    revalidatePath('/');
    return { success: true, redirectUrl: '/workspace/dashboard' };

  } catch (error) {
    console.error('Error en onboarding de freelancer:', error);
    return { error: 'Error al crear la cuenta. Inténtalo de nuevo.' };
  }
}
