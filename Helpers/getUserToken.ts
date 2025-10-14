// Helpers/getUserToken.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/auth";

export async function getUserToken(): Promise<string | null> {
  try {
    const session = await getServerSession(authOptions);
    
    console.log("🔑 getUserToken - Session:", session);
    
    if (!session || !session.token) {
      console.warn("⚠️ getUserToken - No token found in session");
      return null;
    }
    
    return session.token as string;
  } catch (error) {
    console.error("❌ getUserToken - Error:", error);
    return null;
  }
}