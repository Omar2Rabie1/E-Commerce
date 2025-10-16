"use client";
import React, { useRef } from "react";
import { Button } from "../ui/button";
import { CheckOutI } from "@/src/interfaces";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

export default function CheckOut({ cartId }: { cartId: string }) {
  const { data: session } = useSession();
  const detailsInput = useRef<HTMLInputElement | null>(null);
  const cityInput = useRef<HTMLInputElement | null>(null);
  const phoneInput = useRef<HTMLInputElement | null>(null);

  async function checkOutSession(paymentMethod: 'card' | 'cash') {
    const userToken = session?.token;
    if (!userToken) {
      toast.error("Please login to proceed to checkout");
      return;
    }
    const shippingAddress = {
      details: detailsInput.current?.value || "",
      phone: phoneInput.current?.value || "",
      city: cityInput.current?.value || "",
    };

    if (paymentMethod === 'card') {
      // الدفع بالفيزا - يذهب لصفحة الدفع
      const baseUrl = process.env.NEXTAUTH_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
      try {
        const res = await fetch(
          `https://ecommerce.routemisr.com/api/v1/orders/checkout-session/${cartId}?url=${baseUrl}`,
          {
            method: "POST",
            headers: {
              token: userToken,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ shippingAddress }),
          }
        );
        const data: CheckOutI = await res.json();
        if (data.status === "success") {
          location.href = data.session.url;
        } else {
          toast.error(data.message || "Failed to start checkout session");
        }
      } catch (error) {
        toast.error("Failed to start checkout session");
      }
    } else {
      // الدفع النقدي
      try {
        const res = await fetch(
          `https://ecommerce.routemisr.com/api/v1/orders/${cartId}`,
          {
            method: "POST",
            headers: {
              token: userToken,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ shippingAddress }),
          }
        );
        const data = await res.json();
        if (data.status === "success") {
          location.href = "/orders";
        } else {
          toast.error(data.message || "Failed to place cash order");
        }
      } catch (error) {
        toast.error("Failed to place cash order");
      }
    }
  }

  const handleSubmit = (e: React.FormEvent, paymentMethod: 'card' | 'cash') => {
    e.preventDefault();
    
    // التحقق من البيانات المدخلة
    if (!cityInput.current?.value || !detailsInput.current?.value || !phoneInput.current?.value) {
      toast.error("Please fill all shipping details");
      return;
    }

    // التحقق من صحة رقم الهاتف
    const phoneRegex = /^01[0125][0-9]{8}$/;
    if (!phoneRegex.test(phoneInput.current.value)) {
      toast.error("Please enter a valid Egyptian phone number");
      return;
    }

    checkOutSession(paymentMethod);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-gradient-to-r dark:from-cyan-500 dark:to-blue-600 dark:hover:from-cyan-600 dark:hover:to-blue-700 text-white transition-colors duration-300">
          Proceed to Checkout
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-white">Checkout</DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-300">
            Enter your shipping details to proceed with the checkout.
          </DialogDescription>
        </DialogHeader>
        
        <form>
          <div className="grid gap-4 py-4">
            <div className="grid gap-3">
              <Label htmlFor="city" className="text-gray-700 dark:text-gray-200">
                City
              </Label>
              <Input 
                ref={cityInput} 
                id="city" 
                className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-cyan-500 focus:border-blue-500 transition-colors duration-200" 
                placeholder="Enter your city"
                required
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="details" className="text-gray-700 dark:text-gray-200">
                Details
              </Label>
              <Input 
                ref={detailsInput} 
                id="details" 
                className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-cyan-500 focus:border-blue-500 transition-colors duration-200" 
                placeholder="Enter address details"
                required
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="phone" className="text-gray-700 dark:text-gray-200">
                Phone
              </Label>
              <Input 
                ref={phoneInput} 
                id="phone" 
                className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-cyan-500 focus:border-blue-500 transition-colors duration-200" 
                placeholder="01XXXXXXXXX"
                pattern="01[0125][0-9]{8}"
                required
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">Enter a valid Egyptian phone number</p>
            </div>
          </div>
          
          <DialogFooter className="flex gap-2 sm:gap-0">
            <DialogClose asChild>
              <Button 
                type="button" 
                variant="outline" 
                className="text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                Cancel
              </Button>
            </DialogClose>

            <Button 
              type="button" 
              className="bg-blue-600 hover:bg-blue-700 dark:bg-gradient-to-r dark:from-cyan-500 dark:to-blue-600 dark:hover:from-cyan-600 dark:hover:to-blue-700 text-white ms-3 cursor-pointer transition-colors duration-200"
              onClick={(e) => handleSubmit(e, 'card')}
            >
              Pay with Visa
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}