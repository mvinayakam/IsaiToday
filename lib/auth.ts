import { type AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { storage } from "./storage";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: string;
    role?: string;
  }
}

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await storage.getUserByEmail(credentials.email);
        if (!user?.passwordHash) return null; // Google-only account
        const valid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!valid) return null;
        return { id: user.id, email: user.email ?? "", name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/auth" },
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (account?.provider === "google" && profile) {
        const p = profile as any;
        await storage.upsertUser({
          id: p.sub,
          email: p.email ?? "",
          firstName: p.given_name ?? null,
          lastName: p.family_name ?? null,
          profileImageUrl: p.picture ?? null,
        });
        const dbUser = await storage.getUser(p.sub);
        token.userId = p.sub;
        token.role = dbUser?.role ?? "user";
      }
      if (account?.provider === "credentials" && user) {
        const dbUser = await storage.getUser(user.id);
        token.userId = user.id;
        token.role = dbUser?.role ?? "user";
      }
      return token;
    },
    async session({ session, token }) {
      if (token.userId) {
        session.user.id = token.userId;
        session.user.role = token.role ?? "user";
      }
      return session;
    },
  },
};

// Route handler auth helpers
import { getServerSession } from "next-auth/next";

export async function requireUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { userId: null, role: null, error: Response.json({ message: "Unauthorized" }, { status: 401 }) };
  }
  return { userId: session.user.id, role: session.user.role, error: null };
}

export async function requireAdmin() {
  const { userId, role, error } = await requireUser();
  if (error) return { userId: null, error };
  if (role !== "admin") {
    return { userId: null, error: Response.json({ message: "Forbidden" }, { status: 403 }) };
  }
  return { userId: userId!, error: null };
}
