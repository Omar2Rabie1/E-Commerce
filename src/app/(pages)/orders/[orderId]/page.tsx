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

  // Fetch order details
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

  // Calculate dynamic pricing for each item
  const calculateItemTotal = (item: OrderItem) => {
    const quantity = Number(item.quantity || 0);
    const unitPrice = Number(item.product?.price || 0);
    return quantity * unitPrice;
  };

  // Calculate total order price dynamically
  const calculateOrderTotal = () => {
    if (!order?.orderItems) return 0;
    return order.orderItems.reduce((total, item) => {
      return total + calculateItemTotal(item);
    }, 0);
  };

  // Get status badge
  const getStatusBadge = () => {
    if (order?.isDelivered) {
      return (
        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
          <Truck className="w-3 h-3 mr-1" />
          Delivered
        </Badge>
      );
    } else if (order?.isPaid) {
      return (
        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
          <Package className="w-3 h-3 mr-1" />
          Processing
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
          <Clock className="w-3 h-3 mr-1" />
          Pending Payment
        </Badge>
      );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-500 mx-auto mb-4"></div>
            <p className="text-slate-400 text-lg">Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-semibold text-slate-200 mb-2">Order Not Found</h2>
            <p className="text-slate-400 mb-6">{error || "The order you're looking for doesn't exist."}</p>
            <div className="flex gap-4 justify-center">
              <Link href="/allorders">
                <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
                  View All Orders
                </Button>
              </Link>
              <Link href="/profile">
                <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.back()}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400">
                Order Details
              </h1>
              <p className="text-slate-300">Order #{order._id.slice(-8)}</p>
            </div>
          </div>
          {getStatusBadge()}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Items */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-slate-800/90 border-slate-700 p-6">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <Package className="w-5 h-5 text-cyan-400" />
                Order Items
              </h2>
              
              <div className="space-y-4">
                {order.orderItems?.map((item, index) => {
                  const itemTotal = calculateItemTotal(item);
                  return (
                    <div key={item._id || index} className="flex items-center gap-4 bg-slate-700/30 rounded-lg p-4">
                      <div className="w-16 h-16 bg-slate-600 rounded-lg flex items-center justify-center overflow-hidden">
                        {item.product?.imageCover ? (
                          <Image
                            src={item.product.imageCover}
                            alt={item.product.title || "Product"}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Package className="w-8 h-8 text-slate-400" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-white font-medium text-lg">
                          {item.product?.title || "Unknown Product"}
                        </h3>
                        <p className="text-slate-400 text-sm">
                          Unit Price: {Number(item.product?.price || 0).toFixed(2)} EGP
                        </p>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-slate-300 text-sm">
                          Qty: {Number(item.quantity || 0)}
                        </p>
                        <p className="text-cyan-400 font-semibold text-lg">
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
            <Card className="bg-slate-800/90 border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Order Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-cyan-400" />
                  <div>
                    <p className="text-slate-400 text-sm">Order Date</p>
                    <p className="text-white">
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
                  <CreditCard className="w-4 h-4 text-cyan-400" />
                  <div>
                    <p className="text-slate-400 text-sm">Payment Method</p>
                    <p className="text-white">{order.paymentMethod || "N/A"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  <div>
                    <p className="text-slate-400 text-sm">Delivery Address</p>
                    <p className="text-white">{order.shippingAddress?.details || "N/A"}</p>
                    <p className="text-slate-400 text-sm">{order.shippingAddress?.city || ""}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-cyan-400" />
                  <div>
                    <p className="text-slate-400 text-sm">Contact</p>
                    <p className="text-white">{order.user?.phone || "N/A"}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Pricing Summary */}
            <Card className="bg-slate-800/90 border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Order Summary</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between text-slate-300">
                  <span>Items ({order.orderItems?.length || 0})</span>
                  <span>{calculateOrderTotal().toFixed(2)} EGP</span>
                </div>
                
                <div className="flex justify-between text-slate-300">
                  <span>Shipping</span>
                  <span className="text-green-400">Free</span>
                </div>
                
                <hr className="border-slate-600" />
                
                <div className="flex justify-between text-xl font-semibold text-white">
                  <span>Total</span>
                  <span className="text-cyan-400">{calculateOrderTotal().toFixed(2)} EGP</span>
                </div>
              </div>
            </Card>

            {/* Actions */}
            <div className="space-y-3">
              <Link href="/allorders" className="block">
                <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
                  View All Orders
                </Button>
              </Link>
              
              <Link href="/profile" className="block">
                <Button variant="outline" className="w-full border-slate-600 text-slate-300 hover:bg-slate-700">
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
