import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

// Full auth config — runs in Node.js runtime only (API routes, Server Components)
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          await connectDB();
          const existingUser = await User.findOne({ email: user.email });
          if (!existingUser) {
            await User.create({
              name: user.name,
              email: user.email,
              image: user.image,
              xp: 0,
              streak: 0,
              level: 1,
              lastActive: new Date(),
              achievements: [],
            });
          } else {
            const now = new Date();
            const last = new Date(existingUser.lastActive);
            const diffDays = Math.floor(
              (now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24)
            );
            if (diffDays === 1) {
              await User.updateOne(
                { email: user.email },
                { $inc: { streak: 1 }, $set: { lastActive: now } }
              );
            } else if (diffDays > 1) {
              await User.updateOne(
                { email: user.email },
                { $set: { streak: 1, lastActive: now } }
              );
            }
          }
        } catch (err) {
          console.error("SignIn callback error:", err);
          return false;
        }
      }
      return true;
    },

    async jwt({ token, user, account }) {
      // On first sign-in, user object is available
      if (account && user) {
        token.email = user.email;
      }
      return token;
    },

    async session({ session, token }) {
      // Enrich session from DB using the JWT token (Node.js runtime only)
      try {
        await connectDB();
        const dbUser = await User.findOne({ email: token.email }).lean();
        if (dbUser) {
          session.user.id = String(dbUser._id);
          session.user.xp = dbUser.xp ?? 0;
          session.user.streak = dbUser.streak ?? 0;
          session.user.level = dbUser.level ?? 1;
        }
      } catch (err) {
        console.error("Session callback error:", err);
      }
      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  secret: process.env.NEXTAUTH_SECRET,
});
