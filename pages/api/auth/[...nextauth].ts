import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import { prisma } from "@/lib/prisma";
import * as bcrypt from "bcrypt";
import { Role } from "@prisma/client";
import {
  checkLoginRateLimit,
  getClientIP,
  resetLoginAttempts,
} from "@/lib/rate-limit";

// Validate NEXTAUTH_SECRET is set
if (!process.env.NEXTAUTH_SECRET) {
  console.error(
    "❌ NEXTAUTH_SECRET is not set! Please add it to your environment variables."
  );
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "NEXTAUTH_SECRET is required in production. Please add it to Vercel environment variables."
    );
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        // Rate limiting: use email + IP for tracking
        const clientIP = req ? getClientIP(req) : "unknown";
        const identifier = `${credentials.email}:${clientIP}`;
        const rateLimit = checkLoginRateLimit(identifier);

        if (!rateLimit.allowed) {
          if (rateLimit.lockedUntil) {
            const minutesLeft = Math.ceil(
              (rateLimit.lockedUntil - Date.now()) / 60000
            );
            throw new Error(
              `Too many failed attempts. Account locked for ${minutesLeft} minute(s).`
            );
          }
          throw new Error(
            "Too many login attempts. Please try again in 15 minutes."
          );
        }

        try {
          // Find user by email
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user) {
            // Don't reveal if user exists - generic error
            throw new Error("Invalid email or password");
          }

          // Verify password
          const isValidPassword = await bcrypt.compare(
            credentials.password,
            user.passwordHash
          );

          if (!isValidPassword) {
            throw new Error("Invalid email or password");
          }

          // Reset rate limit on successful login
          resetLoginAttempts(identifier);

          // Return user object (will be encoded in JWT)
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error: any) {
          console.error("Auth error:", error);
          // Generic error message to prevent user enumeration
          throw new Error("Invalid email or password");
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Redirect to admin dashboard after login
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return `${baseUrl}/admin`;
    },
  },
  pages: {
    signIn: "/admin-access",
    error: "/admin-access",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);

