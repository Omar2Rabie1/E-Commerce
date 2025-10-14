"use client"
import { CartI } from '@/src/interfaces/cart';
import { useSession } from 'next-auth/react';
import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react'


export const CartContext = createContext({
   cartData: null as CartI | null,
   isloading: true as boolean,
   userId: "" as string,
   getCart: (() => { }) as () => void,
   setCartData: (() => { }) as React.Dispatch<React.SetStateAction<CartI | null>>,

});
export default function CartProvider({ children }: { children: React.ReactNode }) {
   const [cartData, setCartData] = useState<CartI | null>(null);
   const [userId, setUserId] = useState<string>("");
   const [isloading, setisLoading] = useState<boolean>(true);
   const [mounted, setMounted] = useState(false);
   const session = useSession();

   // ✅ SAFE: Hydration guard for browser APIs
   useEffect(() => {
      setMounted(true);
      if (typeof window !== "undefined") {
         setUserId(localStorage.getItem("userId") || "");
      }
   }, []);
   
   const getCart = useCallback(async () => {
      if (session.status === "authenticated" && mounted) {
         try {
            setisLoading(true);
            const res = await fetch('/api/get-cart');

            if (!res.ok) {
               throw new Error(`HTTP ${res.status}: Failed to fetch cart`);
            }

            const data: CartI = await res.json();
            console.log("Cart data:", data);

            if (data && typeof data === 'object') {
               setCartData(data);

               if (data?.data?.cartOwner) {
                  setUserId(data.data.cartOwner);
                  if (typeof window !== "undefined") {
                     localStorage.setItem("userId", data.data.cartOwner);
                  }
               }
            } else {
               console.warn("Invalid cart data received:", data);
               setCartData(null);
            }
         } catch (error) {
            console.error("Error fetching cart:", error);
            setCartData(null);
            if (typeof window !== "undefined") {
               console.error("Cart fetch failed:", error);
            }
         } finally {
            setisLoading(false);
         }
      } else if (mounted && session.status !== "loading") {
         setCartData(null);
         setisLoading(false);
      }
   }, [mounted, session.status]);
   
   useEffect(() => {
      if (mounted) {
         getCart();
      }
   }, [getCart, mounted]);

   const contextValue = useMemo(() => ({
      cartData,
      setCartData,
      getCart,
      isloading,
      userId,
   }), [cartData, getCart, isloading, userId]);

   return (
      <CartContext.Provider value={contextValue}>
         {children}
      </CartContext.Provider>
   )
}
