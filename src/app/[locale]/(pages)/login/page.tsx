// src/app/(pages)/login/page.tsx
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
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const router = useRouter();
  
  const form = useForm<loginSchemaType>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(loginSchema),
  });

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4 transition-colors duration-300">
      <div className="max-w-md w-full p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-6">
            Login to Your Account
          </h2>

          {serverError && (
            <div className="bg-red-100 dark:bg-red-900/50 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-4">
              {serverError}
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4">
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-300">Your Email</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        {...field} 
                        className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 rounded-md py-2 px-3"
                        placeholder="mail@example.com"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 dark:text-red-400" />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-300">Your Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        {...field} 
                        className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 rounded-md py-2 px-3"
                        placeholder="........"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 dark:text-red-400" />
                  </FormItem>
                )}
              />
              
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white cursor-pointer font-medium py-2.5 rounded-md transition-all duration-300 shadow hover:shadow-lg disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? 'Loading ...' : 'Login'}
              </Button>
              <p className="text-gray-600 dark:text-gray-400 text-center">
                Don&apos;t have an account? <Link href="/register" className="text-blue-600 dark:text-blue-400 hover:underline">Register</Link>
              </p>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}