import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // Persist the OAuth access_token and or the user id to the token right after signin
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      // You can customize sign in behavior here
      return true;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  debug: process.env.NODE_ENV === "development",
};
