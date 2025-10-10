"use client";
import { Button } from '@/src/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/src/components/ui/form';
import { Input } from '@/src/components/ui/input';
import { loginSchema, loginSchemaType } from '@/src/schema/login.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { signIn } from "next-auth/react";
import toast from 'react-hot-toast';
import Link from 'next/link';


export default function Login() {
  // حالة التحميل والأخطاء
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const router = useRouter();
  
  // تهيئة الفورم مع التحقق من البيانات
  const form = useForm<loginSchemaType>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(loginSchema),
  });

  // دالة معالجة تسجيل الدخول
  async function handleLogin(values: loginSchemaType) {
    setIsLoading(true);
    setServerError('');

    const response = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
      callbackUrl: "/",
    });
    
    if (response?.ok) {
      toast.success("تم تسجيل الدخول بنجاح");
      if (typeof window !== 'undefined') {
        window.location.href = "/";
      }
    } else {
      toast.error("البريد الإلكتروني أو كلمة المرور غير صحيحة");
      setServerError(response?.error || "حدث خطأ أثناء التسجيل");
    }
    
    setIsLoading(false);
  }

  return (
    // الخلفية العامة للصفحة - بنفس ألوان الصورة الأصلية
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      
      {/* كارد تسجيل الدخول - بنفس ألوان الصورة */}
      <div className="max-w-md w-full p-8 bg-slate-800/90 rounded-lg shadow-md relative overflow-hidden">
        
        {/* تأثير التدرج الداخلي */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/40 to-slate-900/80" />
        
        {/* المحتوى */}
        <div className="relative z-10">
          {/* العنوان الرئيسي - بنفس التدرج الأزرق */}
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 text-center mb-6">
            Login to Your Account
          </h2>

          {/* رسالة الخطأ */}
          {serverError && (
            <div className="bg-red-800/70 border border-red-700 text-red-200 px-4 py-3 rounded mb-4">
              {serverError}
            </div>
          )}

          {/* الفورم */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4">
              
              {/* حقل الإيميل */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-200"> Your Email</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        {...field} 
                        className="bg-slate-700 text-white border-slate-600 focus:ring-cyan-500 focus:border-cyan-500 rounded-md py-2 px-3"
                        placeholder="mail:59239@gmail.com"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              
              {/* حقل كلمة المرور */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-200">Your Password </FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        {...field} 
                        className="bg-slate-700 text-white border-slate-600 focus:ring-cyan-500 focus:border-cyan-500 rounded-md py-2 px-3"
                        placeholder="........"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              
              {/* زر التسجيل - بنفس التدرج الأزرق */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white cursor-pointer font-medium py-2.5 rounded-md transition-all duration-300 shadow hover:shadow-lg disabled:opacity-50"
                disabled={isLoading}
                
              >
                {isLoading ? 'Loading ...'  : ' Login'}
              </Button>
              <p className="text-slate-300">Don&apos;t have an account?   <Link href="/register">Register</Link> </p>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}