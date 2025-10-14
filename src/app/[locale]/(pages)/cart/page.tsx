// src/app/(pages)/cart/page.tsx
"use client";
import ChackOut from "@/src/components/CheckOut/ChackOut";
import { CartContext } from "@/src/components/Context/CartContext";
import { Button } from "@/src/components/ui/button";
import { CartI, Product } from "@/src/interfaces/cart";
import { Loader2, ShoppingCartIcon, Trash2Icon, RefreshCw } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";

import { getUserToken } from "@/Helpers/getUserToken";
import LoadingPage from "@/src/app/loading";

export default function Cart() {
  const { cartData, isloading, getCart } = useContext(CartContext);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [clearingCart, setClearingCart] = useState<boolean>(false);
  const [localCart, setLocalCart] = useState(cartData);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const imageLoadTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const toastShownRef = useRef(false);

  useEffect(() => {
    if (cartData) {
      setLocalCart(cartData);
    }
  }, [cartData]);

  // Avoid infinite refetch loops when cart is empty
  const hasRequestedRef = useRef(false);
  useEffect(() => {
    if (hasRequestedRef.current) return;
    if (!isloading && (!cartData || !cartData?.data?.products?.length)) {
      hasRequestedRef.current = true;
      getCart();
    }
  }, [cartData, getCart, isloading]);

  const handleImageLoad = () => {
    setImagesLoaded(true);
    if (imageLoadTimeoutRef.current) {
      clearTimeout(imageLoadTimeoutRef.current);
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.currentTarget;
    if (target.src !== '/default-product.jpg') {
      target.src = '/default-product.jpg';
    } else {
      target.style.display = 'none';
      const parent = target.parentElement;
      if (parent) {
        const fallbackDiv = document.createElement('div');
        fallbackDiv.className = 'w-20 h-20 rounded-lg border bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 text-xs text-center p-2';
        fallbackDiv.textContent = 'No Image';
        parent.appendChild(fallbackDiv);
      }
    }
  };

  async function removeItem(productId: string) {
    const userToken = await getUserToken();
    setRemovingId(productId);
    try {
      const res = await fetch(
        `https://ecommerce.routemisr.com/api/v1/cart/${productId}`,
        {
          method: "DELETE",
          headers: {
            token: userToken + "",
          },
        }
      );
      const data: CartI = await res.json();

      if (data.status === "success") {
        toast.success("Product removed from cart");
        getCart();
      } else {
        toast.error(data.message || "Failed to remove product");
      }
    } catch {
      toast.error("Failed to remove product");
    } finally {
      setRemovingId(null);
    }
  }

  async function updateItem(productId: string, count: number) {
    const userToken = await getUserToken();
    if (count <= 0) return;

    setUpdatingId(productId);
    try {
      const res = await fetch(
        `https://ecommerce.routemisr.com/api/v1/cart/${productId}`,
        {
          method: "PUT",
          body: JSON.stringify({ count }),
          headers: {
            token: userToken + "",
            "Content-Type": "application/json",
          },
        }
      );

      const data: CartI = await res.json();

      if (data.status === "success") {
        toast.success("Quantity updated");
        getCart();
      } else {
        toast.error(data.message || "Failed to update quantity");
      }
    } catch {
      toast.error("Error while updating item");
    } finally {
      setUpdatingId(null);
    }
  }

  async function clearCart() {
    const userToken = await getUserToken();
    setClearingCart(true);
    try {
      const res = await fetch(`https://ecommerce.routemisr.com/api/v1/cart`, {
        method: "DELETE",
        headers: {
          token: userToken + "",
        },
      });
      const data: CartI = await res.json();

      if (data.message === "success") {
        getCart();
      } else {
        toast.error(data.message || "Failed to clear cart");
      }
    } catch {
      toast.error("Failed to clear cart");
    } finally {
      setClearingCart(false);
    }
  }

  const getCategoryName = (product: Product['product']) => {
    if (!product?.category) {
      return "No category";
    }
    return product.category.name || "Uncategorized";
  };

  const displayData = localCart || cartData;

  return (
    <>
      {isloading ? (
        <LoadingPage />
      ) : displayData?.data?.products?.length ? (
        <section className="bg-white dark:bg-gray-900 min-h-screen py-10 transition-colors duration-300">
          <div className="max-w-6xl mx-auto px-4 grid lg:grid-cols-3 gap-8">
            {/* Left Side - Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Shopping Cart</h1>
              <p className="text-gray-600 dark:text-gray-300">
                {displayData?.numOfCartItems} Items in your cart
              </p>

              {displayData.data.products.map((product) => (
                <div
                  key={product._id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex items-center justify-between border border-gray-200 dark:border-gray-700"
                >
                  {/* Product Info */}
                  <div className="flex items-center gap-4">
                    {product.product.imageCover ? (
                      <div className="relative">
                        <Image
                          src={product.product.imageCover}
                          alt={product.product.title || "Product image"}
                          width={80}
                          height={80}
                          className="rounded-lg border bg-gray-100 dark:bg-gray-700 object-cover"
                          unoptimized={true}
                          onLoad={handleImageLoad}
                          onError={handleImageError}
                        />
                      </div>
                    ) : (
                      <div className="w-20 h-20 rounded-lg border bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 text-xs text-center p-2">
                        No Image
                      </div>
                    )}
                    <div>
                      <h2 className="font-semibold text-lg text-gray-900 dark:text-white">
                        {product.product.title}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {getCategoryName(product.product)}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3 mt-3">
                        <button
                          onClick={() =>
                            updateItem(product.product.id, product.count - 1)
                          }
                          disabled={updatingId === product.product.id}
                          className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 text-gray-700 dark:text-gray-200"
                        >
                          −
                        </button>
                        <span className="text-lg font-medium text-gray-900 dark:text-white">
                          {updatingId === product.product.id ? (
                            <Loader2 className="animate-spin text-blue-500" />
                          ) : (
                            product.count
                          )}
                        </span>
                        <button
                          onClick={() =>
                            updateItem(product.product.id, product.count + 1)
                          }
                          disabled={updatingId === product.product.id}
                          className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 cursor-pointer disabled:opacity-50"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Price & Remove */}
                  <div className="flex flex-col items-end gap-3">
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      {`EGP ${product.price}`}
                    </span>
                    <button
                      onClick={() => removeItem(product.product.id)}
                      aria-label="remove"
                      className="text-red-500 dark:text-red-400 flex items-center gap-2 cursor-pointer hover:text-red-600 dark:hover:text-red-300"
                      disabled={removingId === product.product.id}
                    >
                      {removingId === product.product.id ? (
                        <span className="w-4 h-4 border-2 border-red-500 dark:border-red-400 border-t-transparent rounded-full animate-spin"></span>
                      ) : (
                        "Remove"
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Side - Order Summary */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 h-fit border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 text-gray-600 dark:text-gray-400">
                <div className="flex justify-between">
                  <span>Subtotal {displayData?.numOfCartItems}</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {displayData?.data.totalCartPrice} EGP
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600 dark:text-green-400">Free</span>
                </div>
              </div>

              <hr className="my-4 border-gray-200 dark:border-gray-700" />

              <div className="flex justify-between text-lg font-semibold text-gray-900 dark:text-white mb-6">
                <span>Total</span>
                <span>{displayData?.data.totalCartPrice} EGP</span>
              </div>

              <ChackOut cartId={displayData.cartId} />

              <Link href="/products">
                <Button className="w-full cursor-pointer mt-3 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition">
                  Continue Shopping
                </Button>
              </Link>
              
              {/* زر refresh يدوي */}
              <Button
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.location.reload();
                  }
                }}
                variant="outline"
                className="text-blue-600 dark:text-blue-400 cursor-pointer hover:text-blue-700 dark:hover:text-blue-300 mt-3 w-full border border-blue-600 dark:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Page
              </Button>

              <Button
                onClick={() => clearCart()}
                variant="outline"
                className="text-red-600 dark:text-red-400 cursor-pointer hover:text-red-700 dark:hover:text-red-300 mt-3 w-full border border-red-600 dark:border-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                disabled={clearingCart}
              >
                {clearingCart ? (
                  <span className="w-4 h-4 cursor-pointer border-2 border-red-600 dark:border-red-400 border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    <Trash2Icon className="w-4 h-4 mr-2" /> Clear Cart
                  </>
                )}
              </Button>
            </div>
          </div>
        </section>
      ) : (
        <section className="bg-white dark:bg-gray-900 min-h-screen py-10 flex items-center justify-center transition-colors duration-300">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-300 text-xl">Your Cart&apos;s Empty</p>
            <Link href="/products">
              <Button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white">
                Shopping Now <ShoppingCartIcon />
              </Button>
            </Link>
          </div>
        </section>
      )}
    </>
  );
}