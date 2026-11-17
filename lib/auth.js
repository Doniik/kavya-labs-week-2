
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";

const hasDatabaseConfig = () => Boolean(process.env.DATABASE_URL && process.env.DIRECT_URL);

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

      if (!hasDatabaseConfig()) {
        return true;
      }

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
        console.warn("Google sign-in database unavailable; continuing with a session-only fallback.", error?.message || "unknown DB error");
        return true;
      }
    },

    async jwt({ token }) {
      if (token.email) {
        const email = token.email.toLowerCase();

        token.id = email;
        token.role = "USER";
        token.status = "ACTIVE";

        if (!hasDatabaseConfig()) {
          return token;
        }

        try {
          const dbUser = await prisma.user.findUnique({
            where: { email },
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
        } catch (error) {
          console.warn("JWT user lookup unavailable; keeping the session at the default user role.", error?.message || "unknown DB error");
          token.id = email;
          token.role = "USER";
          token.status = "ACTIVE";
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id || session.user.email;
        session.user.role = token.role || "USER";
        session.user.status = token.status || "ACTIVE";
      }

      return session;
    },
  },
};
