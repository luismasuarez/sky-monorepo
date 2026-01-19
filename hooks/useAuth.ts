import { signOut, useSession } from "next-auth/react";

/**
 * Hook para operaciones de autenticación usando Auth.js v5
 * Adaptado a Next.js 16: usa session y signOut de next-auth
 */
export const useAuth = () => {
  const { data: session, status } = useSession();

  // Logout usando Auth.js
  const logout = async () => {
    await signOut({ redirect: true, callbackUrl: "/auth/signin" });
  };

  return {
    session,
    isAuthenticated: !!session,
    status,
    logout,
  };
};
