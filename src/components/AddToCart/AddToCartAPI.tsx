"use client"

import React, { useContext, useState } from 'react'
import { Button } from '../ui/button'
import { Loader2, ShoppingCartIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import { CartContext } from '../Context/CartContext'
import { CardFooter } from '../ui/card'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function AddToCartAPI({ productId }: { productId?: string }) {
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState("");
   const { getCart } = useContext(CartContext);
   
   // ✅ SAFE: Proper useSession destructuring with fallback
   const sessionResult = useSession();
   const session = sessionResult?.data || null;
   const status = sessionResult?.status || "loading";
   const router = useRouter()
   
   async function addProductToCart() {
      // ✅ SAFE: Authentication state checking
      if (status === "loading") {
         setError("Please wait, checking authentication...");
         return;
      }

      if (!session) {
         setError("Please login to add items to cart");
         toast.error("Please login to add items to cart");
         router.push('/login');
         return;
      }

      if (!productId) {
         setError("Product ID is missing");
         toast.error("Product ID is missing");
         return;
      }

      setIsLoading(true);
      setError("");

      try {
         // ✅ SAFE: Use API route instead of server action
         const response = await fetch("/api/cart/add", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               productId,
               quantity: 1
            })
         });

         const result = await response.json();

         if (!response.ok) {
            throw new Error(result.message || "Failed to add to cart");
         }

         if (result.status === "success") {
            toast.success("Product added to cart");
            // Refresh cart data
            getCart();
         } else {
            throw new Error(result.message || "Failed to add to cart");
         }

         console.log("Product added to cart:", result);
         
      } catch (err) {
         const errorMessage = err instanceof Error ? err.message : "Failed to add product to cart";
         setError(errorMessage);
         toast.error(errorMessage);
         console.error("Add to cart error:", err);
      } finally {
         setIsLoading(false);
      }
   }

   return <>
      <CardFooter className='relative'>
         <Button 
            disabled={isLoading || status === "loading"} 
            onClick={addProductToCart} 
            className='w-full cursor-pointer bg-white dark:bg-gray-800 text-blue-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-700 dark:hover:text-blue-400 transition-all duration-300 shadow-sm hover:shadow-md'
         >
            {isLoading ? (
               <Loader2 className='animate-spin w-4 h-4 mr-2' />
            ) : (
               <ShoppingCartIcon className='w-4 h-4 mr-2' />
            )}
            {isLoading ? "Adding..." : "Add to Cart"}
         </Button>
         
         {/* ✅ SAFE: Error display with login option */}
         {error && (
            <div className="text-red-500 text-sm mt-2 text-center">
               {error}
               {!session && (
                  <button 
                     onClick={() => router.push('/login')}
                     className="ml-2 text-blue-500 underline hover:text-blue-700"
                  >
                     Login
                  </button>
               )}
            </div>
         )}
      </CardFooter>
   </>
}
