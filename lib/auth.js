import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  // Stay signed in for 30 days
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: "/login", error: "/login" },
  callbacks: {
    // Expose the user's id on the session (Week 3 admin will build on this)
    async session({ session, token }) {
      if (session.user) session.user.id = token.sub;
      return session;
    },
  },
};
