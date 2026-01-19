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
