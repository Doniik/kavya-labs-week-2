
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },

  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: "/login",
    error: "/login",
  },

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "google" || !user.email) {
        return false;
      }

      const email = user.email.toLowerCase();
      const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();

      try {
        const existingUser = await prisma.user.findUnique({
          where: { email },
        });

        if (existingUser?.status === "SUSPENDED") {
          return false;
        }

        if (existingUser) {
          await prisma.user.update({
            where: { email },
            data: {
              name: user.name,
              image: user.image,
              lastLoginAt: new Date(),
              ...(adminEmail === email ? { role: "ADMIN" } : {}),
            },
          });
        } else {
          await prisma.user.create({
            data: {
              email,
              name: user.name,
              image: user.image,
              lastLoginAt: new Date(),
              role: adminEmail === email ? "ADMIN" : "USER",
            },
          });
        }

        return true;
      } catch (error) {
        console.error("Google sign-in database error:", error);
        return false;
      }
    },

    async jwt({ token }) {
      if (token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email.toLowerCase() },
          select: {
            id: true,
            role: true,
            status: true,
          },
        });

        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
          token.status = dbUser.status;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.status = token.status;
      }

      return session;
    },
  },
};
