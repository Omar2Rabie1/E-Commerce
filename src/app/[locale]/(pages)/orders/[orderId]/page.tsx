// src/app/(pages)/orders/[orderId]/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import axios from "axios";
import toast from "react-hot-toast";
import Link from "next/link";
import Image from "next/image";
import { Order, OrderItem } from "@/src/interfaces/order";
import { ArrowLeft, Package, CreditCard, MapPin, Phone, Calendar, CheckCircle, Clock, Truck } from "lucide-react";
import { Badge } from "@/src/components/ui/badge";

export default function OrderDetailsPage() {
  // ✅ SAFE: Proper useSession destructuring with fallback
  const sessionResult = useSession();
  const session = sessionResult?.data || null;
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;
  
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await axios.get(`/api/orders/${orderId}`, {
          withCredentials: true
        });
        
        console.log('Order details response:', response.data);
        
        const orderData = response.data?.data || response.data;
        if (orderData) {
          setOrder(orderData);
        } else {
          setError("Order not found");
        }
        
      } catch (error: unknown) {
        console.error("Error fetching order details:", error);
        if (error && typeof error === 'object' && 'response' in error) {
          const axiosError = error as { response?: { status?: number } };
          if (axiosError.response?.status === 404) {
            setError("Order not found");
          } else {
            setError("Failed to load order details");
            toast.error("Error loading order details");
          }
        } else {
          setError("Failed to load order details");
          toast.error("Error loading order details");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const calculateItemTotal = (item: OrderItem) => {
    const quantity = Number(item.quantity || 0);
    const unitPrice = Number(item.product?.price || 0);
    return quantity * unitPrice;
  };

  const calculateOrderTotal = () => {
    if (!order?.orderItems) return 0;
    return order.orderItems.reduce((total, item) => {
      return total + calculateItemTotal(item);
    }, 0);
  };

  const getStatusBadge = () => {
    if (order?.isDelivered) {
      return (
        <Badge className="bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-500/30">
          <Truck className="w-3 h-3 mr-1" />
          Delivered
        </Badge>
      );
    } else if (order?.isPaid) {
      return (
        <Badge className="bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/30">
          <Package className="w-3 h-3 mr-1" />
          Processing
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/30">
          <Clock className="w-3 h-3 mr-1" />
          Pending Payment
        </Badge>
      );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400 text-lg">Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-2">Order Not Found</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">{error || "The order you're looking for doesn't exist."}</p>
            <div className="flex gap-4 justify-center">
              <Link href="/allorders">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  View All Orders
                </Button>
              </Link>
              <Link href="/profile">
                <Button variant="outline" className="border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                  Back to Profile
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.back()}
              className="border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Order Details
              </h1>
              <p className="text-gray-600 dark:text-gray-300">Order #{order._id.slice(-8)}</p>
            </div>
          </div>
          {getStatusBadge()}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Items */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Order Items
              </h2>
              
              <div className="space-y-4">
                {order.orderItems?.map((item, index) => {
                  const itemTotal = calculateItemTotal(item);
                  return (
                    <div key={item._id || index} className="flex items-center gap-4 bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <div className="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center overflow-hidden">
                        {item.product?.imageCover ? (
                          <Image
                            src={item.product.imageCover}
                            alt={item.product.title || "Product"}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Package className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-gray-900 dark:text-white font-medium text-lg">
                          {item.product?.title || "Unknown Product"}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                          Unit Price: {Number(item.product?.price || 0).toFixed(2)} EGP
                        </p>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-gray-600 dark:text-gray-300 text-sm">
                          Qty: {Number(item.quantity || 0)}
                        </p>
                        <p className="text-blue-600 dark:text-blue-400 font-semibold text-lg">
                          {itemTotal.toFixed(2)} EGP
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            {/* Order Info */}
            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Order Date</p>
                    <p className="text-gray-900 dark:text-white">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <CreditCard className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Payment Method</p>
                    <p className="text-gray-900 dark:text-white">{order.paymentMethod || "N/A"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Delivery Address</p>
                    <p className="text-gray-900 dark:text-white">{order.shippingAddress?.details || "N/A"}</p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">{order.shippingAddress?.city || ""}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Contact</p>
                    <p className="text-gray-900 dark:text-white">{order.user?.phone || "N/A"}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Pricing Summary */}
            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order Summary</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between text-gray-600 dark:text-gray-300">
                  <span>Items ({order.orderItems?.length || 0})</span>
                  <span>{calculateOrderTotal().toFixed(2)} EGP</span>
                </div>
                
                <div className="flex justify-between text-gray-600 dark:text-gray-300">
                  <span>Shipping</span>
                  <span className="text-green-600 dark:text-green-400">Free</span>
                </div>
                
                <hr className="border-gray-200 dark:border-gray-600" />
                
                <div className="flex justify-between text-xl font-semibold text-gray-900 dark:text-white">
                  <span>Total</span>
                  <span className="text-blue-600 dark:text-blue-400">{calculateOrderTotal().toFixed(2)} EGP</span>
                </div>
              </div>
            </Card>

            {/* Actions */}
            <div className="space-y-3">
              <Link href="/allorders" className="block">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  View All Orders
                </Button>
              </Link>
              
              <Link href="/profile" className="block">
                <Button variant="outline" className="w-full border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                  Back to Profile
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}