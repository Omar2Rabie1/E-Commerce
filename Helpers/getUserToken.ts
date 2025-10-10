"use server";
import { decode } from "next-auth/jwt";
import { cookies } from "next/headers";


export async function getUserToken() {
   try {
      const cookieStore = await cookies();
      const getTokenFromCookies = cookieStore.get("next-auth.session-token")?.value;
      
      if (!getTokenFromCookies) {
         return null;
      }

      const accessToken = await decode({
         token: getTokenFromCookies,
         secret: process.env.NEXTAUTH_SECRET!,
      });
      
      return accessToken?.token || null;
   } catch (error) {
      console.error("Error getting user token:", error);
      return null;
   }
}
