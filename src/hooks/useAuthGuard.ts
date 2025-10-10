"use client";
import { useSession } from "next-auth/react";

export function useAuthGuard() {
  // ✅ SAFE: Proper useSession destructuring with fallback
  const sessionResult = useSession();
  const session = sessionResult?.data || null;
  const status = sessionResult?.status || "loading";
  
  const requireAuth = (action: string) => {
    if (status === "loading") {
      throw new Error("Authentication check in progress");
    }
    
    if (!session) {
      throw new Error(`Please login to ${action}`);
    }
    
    return session;
  };

  const isAuthenticated = status === "authenticated" && !!session;
  const isLoading = status === "loading";

  return { 
    requireAuth, 
    session, 
    status, 
    isAuthenticated, 
    isLoading 
  };
}
