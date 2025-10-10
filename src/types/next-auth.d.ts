// src/types/next-auth.d.ts
import NextAuth from "next-auth";

// JWT Payload interface for decoded tokens
export interface JWTPayload {
  id?: string;
  _id?: string;
  userId?: string;
  name?: string;
  email?: string;
  phone?: string;
  iat?: number;
  exp?: number;
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
    token: string;
  }

  interface User {
    id: string;
    user: {
      _id?: string;
      name?: string;
      email?: string;
      phone?: string;
    };
    token: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    user: {
      _id?: string;
      name?: string;
      email?: string;
      phone?: string;
    };
    token: string;
  }
}