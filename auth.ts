import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
  clientId: process.env.AUTH_GOOGLE_ID ?? "",
  clientSecret: process.env.AUTH_GOOGLE_SECRET ?? "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        // TODO: Implementar validación real contra base de datos y bcrypt
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        // Ejemplo: usuario fijo (reemplazar por consulta real)
        const user = { id: "1", email: credentials.email, name: "User" };
        if (!user) {
          return null;
        }
        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  // Puedes añadir otros callbacks aquí si lo necesitas
});
