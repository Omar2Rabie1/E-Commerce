"use client";
import { useState, useEffect, useContext, useMemo } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import toast from "react-hot-toast";
import Link from "next/link";
import { CartContext } from "@/src/components/Context/CartContext";

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
}

export default function ProfilePage() {
  // ✅ SAFE: Proper useSession destructuring with fallback
  const sessionResult = useSession();
  const session = sessionResult?.data || null;
  const { cartData } = useContext(CartContext);
  const [activeTab, setActiveTab] = useState<"profile" | "orders" | "security">("profile");
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userStats, setUserStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    pendingOrders: 0,
    deliveredOrders: 0
  });

  // ✅ SAFE: Cart live stats with proper null checks
  const cartStats = useMemo(() => {
    const numItems = cartData?.numOfCartItems ?? 0;
    const cartTotal = cartData?.data?.totalCartPrice ?? 0;
    return { numItems, cartTotal };
  }, [cartData]);

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

  // جلب طلبات المستخدم
  useEffect(() => {
    const fetchUserOrders = async () => {
      // Validate session and user data
      if (!session?.user) {
        console.log('No session or user data available');
        setIsLoading(false);
        return;
      }

      if (!session.user.id) {
        console.error('User ID not found in session:', session.user);
        toast.error("User authentication error. Please login again.");
        setIsLoading(false);
        return;
      }

      if (!session.token) {
        console.error('Token not found in session');
        toast.error("Authentication token missing. Please login again.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        console.log('Fetching orders for user:', {
          userId: session.user.id,
          hasToken: !!session.token,
          userEmail: session.user.email
        });

        // Use the user-specific API endpoint with proper authentication
        const response = await axios.get(
          `https://ecommerce.routemisr.com/api/v1/orders/user/${session.user.id}`,
          {
            headers: {
              'token': session.token,
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          }
        );
        
        console.log('User orders response:', response.data);
        
        const ordersData = response.data?.data || response.data || [];
        const userOrders = Array.isArray(ordersData) ? ordersData : [];
        
        setOrders(userOrders);

        // حساب الإحصائيات
        const stats = {
          totalOrders: userOrders.length,
          totalSpent: userOrders.reduce((sum: number, order: Order) => sum + (order.totalOrderPrice || 0), 0),
          pendingOrders: userOrders.filter((order: Order) => !order.isDelivered).length,
          deliveredOrders: userOrders.filter((order: Order) => order.isDelivered).length
        };
        
        setUserStats(stats);

        if (userOrders.length === 0) {
          toast.success("No orders found for your account!");
        }
        
      } catch (error: unknown) {
        console.error("Error fetching user orders:", error);
        
        if (error && typeof error === 'object' && 'response' in error) {
          const axiosError = error as { response?: { status?: number } };
          if (axiosError.response?.status === 404) {
            setOrders([]);
            toast.success("No orders found for your account!");
          } else if (axiosError.response?.status === 401) {
            toast.error("Authentication failed. Please login again.");
          } else if (axiosError.response?.status === 403) {
            toast.error("Access denied. Please contact support.");
          } else {
            toast.error("Error loading your orders. Please try again.");
          }
        } else {
          toast.error("Error loading your orders. Please try again.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (activeTab === "orders" || activeTab === "profile") {
      fetchUserOrders();
    }
  }, [activeTab, session]);

  // تاريخ الانضمام
  const joinedDate = session?.user ? new Date().toLocaleDateString("en-US") : "";

  // Show loading state if session is not available
  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-500 mx-auto mb-4"></div>
            <p className="text-slate-400 text-lg">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* العنوان الرئيسي */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400">
            Profile Dashboard
          </h1>
          <p className="text-slate-300 mt-2 text-lg">
            Welcome back, {session?.user?.name}!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* الشريط الجانبي */}
          <Card className="bg-slate-800/90 border-slate-700 p-6 lg:col-span-1">
            <div className="space-y-4">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full mx-auto flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-lg">
                  {session?.user?.name?.charAt(0) || "U"}
                </div>
                <h3 className="text-white font-semibold text-xl">{session?.user?.name}</h3>
                <p className="text-slate-400 text-sm mt-1">{session?.user?.email}</p>
                <div className="mt-3 px-3 py-1 bg-slate-700/50 rounded-full inline-block">
                  <span className="text-cyan-400 text-sm">⭐ Premium Member</span>
                </div>
              </div>

              <nav className="space-y-3">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`w-full cursor-pointer text-right p-4 rounded-xl transition-all duration-200 flex items-center justify-end space-x-3 ${
                    activeTab === "profile"
                      ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border-r-2 border-cyan-500 shadow-lg"
                      : "text-slate-300 hover:bg-slate-700/50 hover:shadow-md"
                  }`}
                >
                  <span className="text-lg">📊</span>
                  <span className="font-medium">Dashboard</span>
                </button>
                
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`w-full cursor-pointer text-right p-4 rounded-xl transition-all duration-200 flex items-center justify-end space-x-3 ${
                    activeTab === "orders"
                      ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border-r-2 border-cyan-500 shadow-lg"
                      : "text-slate-300 hover:bg-slate-700/50 hover:shadow-md"
                  }`}
                >
                  <span className="text-lg">🛒</span>
                  <span className="font-medium">My Orders</span>
                </button>
                
                <button
                  onClick={() => setActiveTab("security")}
                  className={`w-full cursor-pointer text-right p-4 rounded-xl transition-all duration-200 flex items-center justify-end space-x-3 ${
                    activeTab === "security"
                      ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border-r-2 border-cyan-500 shadow-lg"
                      : "text-slate-300 hover:bg-slate-700/50 hover:shadow-md"
                  }`}
                >
                  <span className="text-lg">🔒</span>
                  <span className="font-medium">Account Security</span>
                </button>
              </nav>

              {/* Quick Stats في السايدبار */}
              <div className="mt-8 p-4 bg-slate-700/30 rounded-xl">
                <h4 className="text-cyan-400 font-medium mb-3">Quick Stats</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-slate-300 text-sm">
                    <span>Orders:</span>
                    <span className="text-white font-semibold">{userStats.totalOrders}</span>
                  </div>
                  <div className="flex justify-between text-slate-300 text-sm">
                    <span>Total Spent:</span>
                    <span className="text-white font-semibold">{userStats.totalSpent.toFixed(2)} EGP</span>
                  </div>
                  <div className="flex justify-between text-slate-300 text-sm">
                    <span>Cart Items:</span>
                    <span className="text-white font-semibold">{cartStats.numItems}</span>
                  </div>
                  <div className="flex justify-between text-slate-300 text-sm">
                    <span>Cart Total:</span>
                    <span className="text-white font-semibold">{cartStats.cartTotal.toFixed(2)} EGP</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* المحتوى الرئيسي */}
          <div className="lg:col-span-3">
            {/* تبويب الداشبورد */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                {/* بطاقات الإحصائيات */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/20 p-6 text-center">
                    <div className="text-3xl mb-2">📦</div>
                    <h3 className="text-white font-bold text-2xl">{userStats.totalOrders}</h3>
                    <p className="text-cyan-400 text-sm">Total Orders</p>
                  </Card>
                  
                  <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20 p-6 text-center">
                    <div className="text-3xl mb-2">💰</div>
                    <h3 className="text-white font-bold text-2xl">{userStats.totalSpent.toFixed(2)}</h3>
                    <p className="text-green-400 text-sm">Total Spent</p>
                  </Card>
                  
                  <Card className="bg-gradient-to-br from-yellow-500/10 to-amber-500/10 border-yellow-500/20 p-6 text-center">
                    <div className="text-3xl mb-2">⏳</div>
                    <h3 className="text-white font-bold text-2xl">{userStats.pendingOrders}</h3>
                    <p className="text-yellow-400 text-sm">Pending</p>
                  </Card>
                  
                  <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20 p-6 text-center">
                    <div className="text-3xl mb-2">🚚</div>
                    <h3 className="text-white font-bold text-2xl">{userStats.deliveredOrders}</h3>
                    <p className="text-purple-400 text-sm">Delivered</p>
                  </Card>
                  
                  {/* Live Cart Items */}
                  <Card className="bg-gradient-to-br from-indigo-500/10 to-blue-500/10 border-indigo-500/20 p-6 text-center">
                    <div className="text-3xl mb-2">🧺</div>
                    <h3 className="text-white font-bold text-2xl">{cartStats.numItems}</h3>
                    <p className="text-indigo-400 text-sm">Cart Items</p>
                  </Card>
                  
                  {/* Live Cart Total */}
                  <Card className="bg-gradient-to-br from-teal-500/10 to-emerald-500/10 border-teal-500/20 p-6 text-center">
                    <div className="text-3xl mb-2">🧾</div>
                    <h3 className="text-white font-bold text-2xl">{cartStats.cartTotal.toFixed(2)}</h3>
                    <p className="text-teal-400 text-sm">Cart Total (EGP)</p>
                  </Card>
                </div>

                {/* معلومات الحساب */}
                <Card className="bg-slate-800/90 border-slate-700 p-6">
                  <h2 className="text-xl font-semibold text-white mb-6">Account Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="bg-slate-700/50 rounded-lg p-4">
                        <label className="text-slate-400 text-sm block mb-2">Full Name</label>
                        <p className="text-white font-semibold text-lg">{session?.user?.name}</p>
                      </div>
                      <div className="bg-slate-700/50 rounded-lg p-4">
                        <label className="text-slate-400 text-sm block mb-2">Email Address</label>
                        <p className="text-white font-semibold text-lg">{session?.user?.email}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-slate-700/50 rounded-lg p-4">
                        <label className="text-slate-400 text-sm block mb-2">Member Since</label>
                        <p className="text-white font-semibold text-lg">{joinedDate}</p>
                      </div>
                      <div className="bg-slate-700/50 rounded-lg p-4">
                        <label className="text-slate-400 text-sm block mb-2">Account Status</label>
                        <p className="text-green-400 font-semibold text-lg">✅ Active</p>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* آخر الطلبات */}
                <Card className="bg-slate-800/90 border-slate-700 p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-white">Recent Orders</h2>
                    <Button 
                      onClick={() => setActiveTab("orders")}
                      className="bg-gradient-to-r cursor-pointer from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                    >
                      View All Orders
                    </Button>
                  </div>
                  
                  {orders.slice(0, 3).map((order) => (
                    <div key={order._id} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600 mb-4 last:mb-0">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-white font-semibold">Order #{order._id.slice(-8)}</h3>
                          <p className="text-slate-400 text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-cyan-400 font-bold text-lg">{order.totalOrderPrice.toFixed(2)} EGP</p>
                          <span className={`px-3 py-1 rounded-full text-xs ${
                            order.isPaid ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                          }`}>
                            {order.isPaid ? "Paid" : "Pending Payment"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {orders.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-slate-400 text-lg">No orders for this user</p>
                      <p className="text-slate-500 text-sm mt-2">Start shopping to see your orders here</p>
                      <Link href="/products">
                        <Button className="mt-4 cursor-pointer bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
                          Start Shopping
                        </Button>
                      </Link>
                    </div>
                  )}
                </Card>
              </div>
            )}

            {/* تبويب الطلبات */}
            {activeTab === "orders" && (
              <Card className="bg-slate-800/90 border-slate-700 p-6">
                <h2 className="text-xl font-semibold text-white mb-6">Order History</h2>

                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-500 mx-auto mb-4"></div>
                    <p className="text-slate-400 text-lg">Loading your orders...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🛒</div>
                    <p className="text-slate-400 text-xl mb-2">No orders for this user</p>
                    <p className="text-slate-500 mb-6">Start shopping to see your orders here</p>
                    <Link href="/products">
                      <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-lg px-8 py-3">
                        Explore Products
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => {
                      const shippingAddress = getShippingAddress(order);
                      return (
                        <div key={order._id} className="bg-slate-700/50 rounded-xl p-6 border border-slate-600 hover:border-cyan-500/30 transition-all duration-200">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-white font-semibold text-lg">Order #{order._id.slice(-8)}</h3>
                              <p className="text-slate-400 text-sm mt-1">
                                Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { 
                                  weekday: 'long', 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric' 
                                })}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-cyan-400 font-bold text-xl">{order.totalOrderPrice.toFixed(2)} EGP</p>
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

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-slate-400">Payment Method:</span>
                              <p className="text-white font-medium mt-1">{order.paymentMethodType}</p>
                            </div>
                            <div>
                              <span className="text-slate-400">Delivery Address:</span>
                              <p className="text-white font-medium mt-1">{shippingAddress.details}</p>
                            </div>
                            <div>
                              <span className="text-slate-400">Contact:</span>
                              <p className="text-white font-medium mt-1">{shippingAddress.phone}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card>
            )}

            {/* تبويب الأمان */}
            {activeTab === "security" && (
              <Card className="bg-slate-800/90 border-slate-700 p-6">
                <h2 className="text-xl font-semibold text-white mb-6">Account Security</h2>
                
                <div className="space-y-6">
                  <div className="bg-slate-700/50 rounded-xl p-6">
                    <h3 className="text-cyan-400 font-medium mb-4 text-lg">🔒 Password Management</h3>
                    <p className="text-slate-300 mb-4">
                      For security reasons, password changes require additional verification. 
                      Please contact support or use the password reset feature on the login page.
                    </p>
                    <div className="flex gap-4">
                      <Link href="/login" className="flex-1">
                        <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
                          Go to Login Page
                        </Button>
                      </Link>
                      <Button 
                        variant="outline" 
                        className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
                        onClick={() => toast.success("Support contact information copied!")}
                      >
                        Contact Support
                      </Button>
                    </div>
                  </div>

                  <div className="bg-slate-700/50 rounded-xl p-6">
                    <h3 className="text-green-400 font-medium mb-4 text-lg">✅ Security Status</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300">Email Verification</span>
                        <span className="text-green-400 font-semibold">Verified</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300">Account Activity</span>
                        <span className="text-green-400 font-semibold">Normal</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300">Last Login</span>
                        <span className="text-slate-300">{new Date().toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-700/50 rounded-xl p-6">
                    <h3 className="text-yellow-400 font-medium mb-4 text-lg">📧 Contact Information</h3>
                    <p className="text-slate-300">
                      If you need to update your password or have any security concerns, 
                      please reach out to our support team at:
                    </p>
                    <p className="text-cyan-400 font-semibold mt-2 text-lg">support@eshop.com</p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}