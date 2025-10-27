
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { readDB } from "@/lib/db";

// This is the core of the persistent name change.
// We wrap the NextAuth configuration in an object called authOptions.
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    // The `jwt` callback is called when a JSON Web Token is created (i.e., on sign in).
    async jwt({ token, user }) {
      // When the user first signs in, the `user` object is available.
      if (user && user.email) {
        const db = readDB();
        const customUser = db.users.find(u => u.email === user.email);
        // If we find a custom name in our database, we attach it to the token.
        if (customUser) {
          token.name = customUser.name;
        }
      }
      return token;
    },
    // The `session` callback is called whenever a session is checked.
    async session({ session, token }) {
      // The token now contains the correct name (either from Google or our DB).
      // We assign this name to the session object, which is what the client-side components will see.
      if (session.user) {
        session.user.name = token.name as string;
      }
      return session;
    },
  },
  // We need to define a session strategy
  session: {
    strategy: "jwt",
  },
};

// The handler now uses our detailed authOptions.
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
