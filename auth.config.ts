import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { db } from "./lib/prisma";

export default {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      async authorize(credentials) {
        const email = credentials.email as string;

        if (!credentials) {
          throw new Error("Please enter your credentials.");
        }

        const user = await db.user.findUnique({
          where: { email },
        });

        if (!user) {
          throw new Error("Invalid email or password");
        }

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password as string,
          user.password as string
        );

        if (!isPasswordCorrect) {
          throw new Error("Invalid email or password");
        }

        return {
          id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],
} satisfies NextAuthConfig;
