import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma/prisma.service";
import { compare } from "bcryptjs";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "email@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user) return null;
        const isValid = await compare(credentials.password, user.password);
        if (!isValid) return null;
        // Devuelve solo los campos necesarios para la sesión
        return {
          id: user.id,
          email: user.email,
          name: user.fullName,
          accountType: user.accountType,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        // @ts-expect-error: accountType puede no estar en el tipo base
        token.accountType = user.accountType;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        // @ts-expect-error: extendemos el tipo de user en session
        session.user.id = token.id;
        // @ts-expect-error: extendemos el tipo de user en session
        session.user.accountType = token.accountType;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
});

export { handler as GET, handler as POST };
