"use server";

import prisma from '@/lib/prisma/prisma.service';
import bcrypt from 'bcryptjs';

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
