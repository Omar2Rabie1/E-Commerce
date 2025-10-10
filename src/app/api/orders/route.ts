import { NextResponse } from "next/server";
import { getUserToken } from "@/Helpers/getUserToken";

export async function GET() {
   try {
      const token = await getUserToken();
      if (!token) {
         return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }

      const res = await fetch(`https://ecommerce.routemisr.com/api/v1/orders`, {
         headers: { token: token + "" },
         cache: "no-store",
      });

      if (!res.ok) {
         const text = await res.text();
         return NextResponse.json({ error: text }, { status: res.status });
      }

      const data = await res.json();
      return NextResponse.json(data);
   } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch orders";
      return NextResponse.json({ error: errorMessage }, { status: 500 });
   }
}


