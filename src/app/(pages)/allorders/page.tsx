// app/allorders/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import axios from "axios";
import toast from "react-hot-toast";
import Link from "next/link";

// واجهة بيانات الطلب
interface Order {
  _id: string;
  totalOrderPrice: number;
  isPaid: boolean;
  isDelivered: boolean;
  createdAt: string;
  paymentMethodType: string;
  shippingAddress?: {
    details?: string;
    city?: string;
    phone?: string;
  };
  cartItems: Array<{
    product: {
      _id: string;
      title: string;
      imageCover: string;
      price: number;
    };
    quantity: number;
    price: number;
  }>;
}

export default function AllOrdersPage() {
  // ✅ SAFE: Proper useSession destructuring with fallback
  const sessionResult = useSession();
  const session = sessionResult?.data || null;
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "paid" | "unpaid" | "delivered" | "pending">("all");

  // جلب جميع طلبات المستخدم
  useEffect(() => {
    const fetchAllOrders = async () => {
      if (session?.user) {
        try {
          setIsLoading(true);
          
          // استخدام الـ user ID من السيشن
          const userId = session.user.id;
          
          if (!userId) {
            console.log('No user ID found in session');
            return;
          }

          console.log('Fetching all orders for user:', userId);
          
          const response = await axios.get(
            `https://ecommerce.routemisr.com/api/v1/orders/user/${userId}`
          );
          
          console.log('All orders response:', response.data);
          
          const ordersData = response.data?.data || response.data || [];
          setOrders(Array.isArray(ordersData) ? ordersData : []);
          
        } catch (error: unknown) {
          console.error("Error fetching orders:", error);
          if (error && typeof error === 'object' && 'response' in error) {
            const axiosError = error as { response?: { status?: number } };
            if (axiosError.response?.status === 404) {
              setOrders([]);
              toast.success("No orders found yet!");
            } else {
              toast.error("Error loading orders");
            }
          } else {
            toast.error("Error loading orders");
          }
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchAllOrders();
  }, [session]);

  // تصفية الطلبات بناءً على الحالة المختارة
  const filteredOrders = orders.filter((order) => {
    switch (filter) {
      case "paid":
        return order.isPaid;
      case "unpaid":
        return !order.isPaid;
      case "delivered":
        return order.isDelivered;
      case "pending":
        return !order.isDelivered;
      default:
        return true; // all
    }
  });

  // دالة مساعدة للحصول على عنوان الشحن بشكل آمن
  const getShippingAddress = (order: Order) => {
    if (!order.shippingAddress) {
      return {
        details: "No address provided",
        city: "Unknown",
        phone: "N/A"
      };
    }
    return {
      details: order.shippingAddress.details || "No address details",
      city: order.shippingAddress.city || "Unknown city",
      phone: order.shippingAddress.phone || "N/A"
    };
  };

  // إحصائيات الطلبات
  const orderStats = {
    total: orders.length,
    paid: orders.filter(order => order.isPaid).length,
    unpaid: orders.filter(order => !order.isPaid).length,
    delivered: orders.filter(order => order.isDelivered).length,
    pending: orders.filter(order => !order.isDelivered).length,
    totalSpent: orders.reduce((sum, order) => sum + order.totalOrderPrice, 0)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* العنوان الرئيسي */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400">
            Order History
          </h1>
          <p className="text-slate-300 mt-2 text-lg">
            Track and manage all your orders in one place
          </p>
        </div>

        {/* بطاقات الإحصائيات */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card className="bg-slate-800/90 border-slate-700 p-4 text-center">
            <div className="text-2xl text-white font-bold">{orderStats.total}</div>
            <div className="text-cyan-400 text-sm">Total Orders</div>
          </Card>
          <Card className="bg-slate-800/90 border-slate-700 p-4 text-center">
            <div className="text-2xl text-green-400 font-bold">{orderStats.paid}</div>
            <div className="text-green-400 text-sm">Paid</div>
          </Card>
          <Card className="bg-slate-800/90 border-slate-700 p-4 text-center">
            <div className="text-2xl text-red-400 font-bold">{orderStats.unpaid}</div>
            <div className="text-red-400 text-sm">Unpaid</div>
          </Card>
          <Card className="bg-slate-800/90 border-slate-700 p-4 text-center">
            <div className="text-2xl text-green-400 font-bold">{orderStats.delivered}</div>
            <div className="text-green-400 text-sm">Delivered</div>
          </Card>
          <Card className="bg-slate-800/90 border-slate-700 p-4 text-center">
            <div className="text-2xl text-yellow-400 font-bold">{orderStats.pending}</div>
            <div className="text-yellow-400 text-sm">Pending</div>
          </Card>
          <Card className="bg-slate-800/90 border-slate-700 p-4 text-center">
            <div className="text-2xl text-white font-bold">{orderStats.totalSpent.toFixed(2)}</div>
            <div className="text-cyan-400 text-sm">Total Spent (EGP)</div>
          </Card>
        </div>

        {/* أزرار التصفية */}
        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          {[
            { key: "all", label: "All Orders", icon: "📦" },
            { key: "paid", label: "Paid", icon: "✅" },
            { key: "unpaid", label: "Unpaid", icon: "❌" },
            { key: "delivered", label: "Delivered", icon: "🚚" },
            { key: "pending", label: "Pending", icon: "⏳" }
          ].map(({ key, label, icon }) => (
            <Button
              key={key}
              onClick={() => setFilter(key as "all" | "paid" | "unpaid" | "delivered" | "pending")}
              className={`flex items-center gap-2 ${
                filter === key
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
            >
              <span>{icon}</span>
              {label}
              {filter === key && (
                <span className="bg-white/20 px-2 py-1 rounded text-xs">
                  {key === "all" ? orderStats.total : 
                   key === "paid" ? orderStats.paid :
                   key === "unpaid" ? orderStats.unpaid :
                   key === "delivered" ? orderStats.delivered : orderStats.pending}
                </span>
              )}
            </Button>
          ))}
        </div>

        {/* محتوى الطلبات */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-500 mx-auto mb-4"></div>
            <p className="text-slate-400 text-lg">Loading your orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <Card className="bg-slate-800/90 border-slate-700 p-8 text-center">
            <div className="text-6xl mb-4">
              {filter === "all" ? "📦" : 
               filter === "paid" ? "✅" :
               filter === "unpaid" ? "❌" :
               filter === "delivered" ? "🚚" : "⏳"}
            </div>
            <h3 className="text-xl font-semibold text-slate-200 mb-2">
              {filter === "all" ? "No Orders Yet" : 
               filter === "paid" ? "No Paid Orders" :
               filter === "unpaid" ? "No Unpaid Orders" :
               filter === "delivered" ? "No Delivered Orders" : "No Pending Orders"}
            </h3>
            <p className="text-slate-400 mb-6">
              {filter === "all" 
                ? "Start shopping to see your orders here" 
                : `No ${filter} orders found in your history`
              }
            </p>
            <Link href="/products">
              <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-lg px-6 py-3">
                Start Shopping
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => {
              const shippingAddress = getShippingAddress(order);
              return (
                <Card key={order._id} className="bg-slate-800/90 border-slate-700 overflow-hidden">
                  {/* رأس الطلب */}
                  <div className="bg-slate-700/50 p-6 border-b border-slate-600">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div>
                        <h3 className="text-white font-semibold text-xl">
                          Order #{order._id.slice(-8)}
                        </h3>
                        <p className="text-slate-400 text-sm">
                          Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </p>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <div className="text-right">
                          <p className="text-cyan-400 font-bold text-2xl">
                            {order.totalOrderPrice.toFixed(2)} EGP
                          </p>
                          <div className="flex gap-2 mt-2">
                            <span className={`px-3 py-1 rounded-full text-xs ${
                              order.isPaid ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                            }`}>
                              {order.isPaid ? "✅ Paid" : "❌ Unpaid"}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs ${
                              order.isDelivered ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
                            }`}>
                              {order.isDelivered ? "🚚 Delivered" : "⏳ Processing"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* معلومات الشحن والدفع */}
                  <div className="p-6 border-b border-slate-600">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <h4 className="text-cyan-400 font-medium mb-2">Payment Method</h4>
                        <p className="text-white">{order.paymentMethodType}</p>
                      </div>
                      <div>
                        <h4 className="text-cyan-400 font-medium mb-2">Delivery Address</h4>
                        <p className="text-white">{shippingAddress.details}</p>
                        <p className="text-slate-400 text-sm">{shippingAddress.city}</p>
                      </div>
                      <div>
                        <h4 className="text-cyan-400 font-medium mb-2">Contact</h4>
                        <p className="text-white">{shippingAddress.phone}</p>
                      </div>
                    </div>
                  </div>

                  {/* المنتجات في الطلب */}
                  <div className="p-6">
                    <h4 className="text-cyan-400 font-medium mb-4">Order Items</h4>
                    <div className="space-y-3">
                      {order.cartItems?.map((item, index) => (
                        <div key={index} className="flex items-center gap-4 bg-slate-700/30 rounded-lg p-3">
                          <div className="w-12 h-12 bg-white rounded flex items-center justify-center">
                            <span className="text-slate-800 font-bold text-sm">#{index + 1}</span>
                          </div>
                          <div className="flex-1">
                            <p className="text-white font-medium">{item.product?.title || "Product"}</p>
                            <p className="text-slate-400 text-sm">
                              Qty: {item.quantity} × {item.price} EGP
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-green-400 font-semibold">
                              {(item.quantity * item.price).toFixed(2)} EGP
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* زر العودة للبروفايل */}
        <div className="text-center mt-8">
          <Link href="/profile">
            <Button 
              variant="outline" 
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              ← Back to Profile
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}