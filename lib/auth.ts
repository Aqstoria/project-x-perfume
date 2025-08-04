import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

const handler = (NextAuth as any)({
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    Credentials({
      id: "credentials",
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
        markup: { label: "Markup", type: "text" },
        role: { label: "Role", type: "text" },
      },
      async authorize(credentials: Record<string, unknown>) {
        if (!credentials.username || !credentials.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { username: credentials.username as string },
        });

        if (!user || !user.password) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        // Admin login flow
        if (user.role === "ADMIN") {
          return {
            id: user.id,
            username: user.username,
            role: user.role,
          };
        }

        // Buyer login flow
        if (user.role === "BUYER") {
          // For buyers, get customer info and markup
          const customer = await prisma.customer.findUnique({
            where: { id: user.customerId || "" },
          });

          if (!customer) {
            throw new Error("Customer not found");
          }

          return {
            id: user.id,
            username: user.username,
            role: user.role,
            markup: customer.generalMargin.toNumber(),
            customerId: user.customerId || undefined,
          };
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.role = user.role;
        token.customerId = user.customerId;
        token.markup = user.markup;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token) {
        session.user.id = token.id;
        session.user.username = token.username;
        session.user.role = token.role;
        session.user.customerId = token.customerId;
        session.user.markup = token.markup;
      }
      return session;
    },
    async redirect({ url, baseUrl }: any) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  pages: {
    signIn: "/login",
  },
});

export const { handlers, auth, signIn, signOut } = handler;
