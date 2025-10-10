"use server";

import { getUserToken } from "@/Helpers/getUserToken";

export async function addToCartAction(productId: string) {
   try {
      // ✅ SAFE: Validate input
      if (!productId) {
         return {
            status: "error",
            message: "Product ID is required"
         };
      }

      // ✅ SAFE: Get user token with error handling
      const userToken = await getUserToken();
      
      if (!userToken) {
         return {
            status: "error",
            message: "Authentication required. Please login."
         };
      }

      // ✅ SAFE: API call with proper error handling
      const res = await fetch("https://ecommerce.routemisr.com/api/v1/cart", {
         method: "POST",
         body: JSON.stringify({ productId }),
         headers: {
            token: userToken,
            "content-type": "application/json",
         },
      });

      if (!res.ok) {
         const errorData = await res.json().catch(() => ({}));
         return {
            status: "error",
            message: errorData.message || `HTTP ${res.status}: Failed to add to cart`
         };
      }

      const data = await res.json();
      
      // ✅ SAFE: Validate response
      if (!data) {
         return {
            status: "error",
            message: "Invalid response from server"
         };
      }

      return data;
      
   } catch (error) {
      console.error("Add to cart action error:", error);
      return {
         status: "error",
         message: error instanceof Error ? error.message : "Failed to add product to cart"
      };
   }
}
