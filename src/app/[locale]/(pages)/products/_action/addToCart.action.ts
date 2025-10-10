"use server";

import { getUserToken } from "@/Helpers/getUserToken";
import { decode } from "next-auth/jwt";
import { cookies } from "next/headers";

export async function addToCartAction(productId: string) {
   const x = await getUserToken()
   const res = await fetch("https://ecommerce.routemisr.com/api/v1/cart", {
      method: "POST",
      body: JSON.stringify({ productId }),
      headers: {
         token:
            x + "",
         "content-type": "application/json",
      },
   });

   const data = await res.json();
   return data;
}
