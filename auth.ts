import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "./auth.config";
import { db } from "./lib/prisma";
import { getUserByEmail } from "./app/actions/authActions";

export const { auth, handlers, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "google") {
        const user = await db.user.findUnique({
          where: { email: profile?.email as string },
        });

        if (!user) {
          const newUser = await db.user.create({
            data: {
              firstName: profile?.given_name as string,
              lastName: profile?.family_name as string,
              email: profile?.email as string,
              phone: profile?.phone_number,
              image: profile?.picture,
              emailVerified: true,
            },
          });

          await db.account.create({
            data: {
              userId: newUser.id,
              type: account.type,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              access_token: account.access_token,
              expires_at: account.expires_at,
            },
          });

          return true;
        } else {
          const existingAccount = await db.account.findUnique({
            where: {
              provider_providerAccountId: {
                provider: account.provider,
                providerAccountId: account.providerAccountId,
              },
            },
          });

          if (!existingAccount) {
            await db.account.create({
              data: {
                userId: user.id,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                access_token: account.access_token,
                refresh_token: account.refresh_token,
                expires_at: account.expires_at,
                type: account.type,
              },
            });
          }
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.image = token.picture as string;
      }

      return session;
    },
    async jwt({ token, account, user }) {
      if (account && user) {
        return {
          ...token,
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      }
      if (!token.name) {
        const User = await getUserByEmail(token.email as string);
        if (User) {
          token.name = `${User.firstName} ${User.lastName}`;
        }
      }

      return token;
    },
  },
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  ...authConfig,
});
