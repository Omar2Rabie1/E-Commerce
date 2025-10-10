// src/auth.ts - NextAuth configuration
import { jwtDecode } from "jwt-decode";
import { AuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import NextAuth from "next-auth";
import { JWTPayload } from "@/src/types/next-auth";

export const authOptions: AuthOptions = {
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        try {
          const response = await fetch(`${process.env.URL_API}/auth/signin`, {
            method: "POST",
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
            headers: { "Content-Type": "application/json" },
          });
          
          const payload = await response.json();
          console.log("🔐 Authorize - API Response:", payload);

          if (payload.message === "success") {
            const decodedToken: JWTPayload = jwtDecode(payload.token);
            console.log("🔐 Authorize - Decoded Token:", decodedToken);

            const userId = decodedToken.id || decodedToken._id || decodedToken.userId;
            if (!userId) {
              throw new Error("User ID not found in token");
            }

            return {
              id: userId,
              user: payload.user,
              token: payload.token,
            };
          } else {
            throw new Error(payload.message || "Wrong credentials");
          }
        } catch (error) {
          console.error("🔐 Authorize - Error:", error);
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      console.log("🔄 JWT Callback - User:", user);
      console.log("🔄 JWT Callback - Token:", token);

      // إذا كان هناك user جديد (أثناء login)
      if (user) {
        return {
          ...token,
          id: user.id,
          user: user.user,
          token: user.token,
        };
      }

      // إذا كان token موجود (أثناء session)
      return token;
    },

    async session({ session, token }) {
      console.log("👤 Session Callback - Token:", token);
      console.log("👤 Session Callback - Session:", session);

      // إرجاع session مع البيانات المحدثة
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          name: token.user?.name,
          email: token.user?.email,
        },
        token: token.token as string,
      };
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

