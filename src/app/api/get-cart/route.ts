import { getUserToken } from "@/Helpers/getUserToken";
import { CartI } from "@/src/interfaces/cart";
import { NextResponse } from "next/server";

export async function GET() {
   try {
      const userToken = await getUserToken();
      
      if (!userToken) {
         return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }

      const baseUrl = process.env.URL_API || 'https://ecommerce.routemisr.com/api/v1';
      const res = await fetch(`${baseUrl}/cart`, {
         method: 'GET',
         headers: {
            token: userToken + "",
         },
         cache: "no-store",
      });

      if (!res.ok) {
         const text = await res.text();
         return NextResponse.json({ error: text }, { status: res.status });
      }

      const data: CartI = await res.json();
      return NextResponse.json(data);
   } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch cart";
      return NextResponse.json({ error: errorMessage }, { status: 500 });
   }
}