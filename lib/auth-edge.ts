import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

// Edge-compatible auth config — NO Mongoose/Node.js imports
// Used ONLY in middleware.ts for JWT session checks
export const { auth: authEdge } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  secret: process.env.NEXTAUTH_SECRET,
});
