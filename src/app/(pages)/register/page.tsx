"use client"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/src/components/ui/form'
import { Input } from '@/src/components/ui/input'
import { registerSchema, registerSchemaType } from '@/src/schema/register.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { Button } from '@/src/components/ui/button'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function Register() {
  
  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState('')
  const router = useRouter()
  
  // تهيئة الفورم مع Zod للتحقق من البيانات
  const form = useForm<registerSchemaType>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      rePassword: '',
      phone: ''
    },
    resolver: zodResolver(registerSchema)
  })

  // دالة معالجة التسجيل
  async function handleRegister(values: registerSchemaType) {
    setIsLoading(true)
    setServerError('')

    try {
      // إرسال طلب التسجيل إلى API
      const response = await axios.post(
        `https://ecommerce.routemisr.com/api/v1/auth/signup`,
        values
      )
      
      // عرض رسالة نجاح
      toast.success("Account created successfully")
      
      // توجيه المستخدم لصفحة Login
      router.push('/login')
    } catch (error: unknown) {
      console.error('Registration error:', error)

      // معالجة الأخطاء من السيرفر
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } };
        if (axiosError.response?.data?.message) {
          setServerError(axiosError.response.data.message)
        } else if (axiosError.response?.data?.errors) {
          // معالجة الأخطاء المتعددة
          const errors = axiosError.response.data.errors
          const errorMessages = Object.values(errors).flat().join(', ')
          setServerError(errorMessages)
        } else {
          setServerError('An error occurred during registration. Please try again.')
        }
      } else {
        setServerError('An error occurred during registration. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    // الخلفية العامة بنفس ألوان Login
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      
      {/* كارد التسجيل - بنفس تصميم Login */}
      <div className="max-w-md w-full p-8 bg-slate-800/90 rounded-lg shadow-md relative overflow-hidden">
        
        {/* تأثير التدرج الداخلي */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/40 to-slate-900/80" />
        
        {/* المحتوى */}
        <div className="relative z-10">
          {/* العنوان بنفس التدرج الأزرق */}
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 text-center mb-6">
            Create a new account
          </h2>

          {/* رسالة الخطأ */}
          {serverError && (
            <div className="bg-red-800/70 border border-red-700 text-red-200 px-4 py-3 rounded mb-4">
              {serverError}
            </div>
          )}

          {/* الفورم */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleRegister)} className="space-y-4">
              
              {/* حقل الاسم الكامل */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-200">Full Name</FormLabel>
                    <FormControl>
                      <Input 
                        type="text" 
                        {...field} 
                        className="bg-slate-700 text-white border-slate-600 focus:ring-cyan-500 focus:border-cyan-500 rounded-md py-2 px-3 placeholder-slate-400"
                        placeholder="Enter Your Full Name"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              {/* حقل البريد الإلكتروني */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-200">Email</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        {...field} 
                        className="bg-slate-700 text-white border-slate-600 focus:ring-cyan-500 focus:border-cyan-500 rounded-md py-2 px-3 placeholder-slate-400"
                                placeholder="mail:example@gmail.com"
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
                    <FormLabel className="text-slate-200">Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        {...field} 
                        className="bg-slate-700 text-white border-slate-600 focus:ring-cyan-500 focus:border-cyan-500 rounded-md py-2 px-3 placeholder-slate-400"
                        placeholder="..........."
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              {/* حقل تأكيد كلمة المرور */}
              <FormField
                control={form.control}
                name="rePassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-200">Confirm Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        {...field} 
                        className="bg-slate-700 text-white border-slate-600 focus:ring-cyan-500 focus:border-cyan-500 rounded-md py-2 px-3 placeholder-slate-400"
                        placeholder="..........."
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              {/* حقل رقم الهاتف */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-200">Phone Number</FormLabel>
                    <FormControl>
                      <Input 
                        type="tel"  
                        {...field} 
                        className="bg-slate-700 text-white border-slate-600 focus:ring-cyan-500 focus:border-cyan-500 rounded-md py-2 px-3 placeholder-slate-400"
                        placeholder="Enter Phone Number"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              {/* زر التسجيل - بنفس تدرج ألوان Login */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white cursor-pointer font-medium py-2.5 rounded-md transition-all duration-300 shadow hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? 'Loading ...' : 'Register'}
              </Button>
            </form>
          </Form>

          {/* رابط للانتقال لصفحة Login */}
          <div className="mt-6 text-center">
            <p className="text-slate-300">
              Do you have an account?{' '}
              <button 
                type="button"
                onClick={() => router.push('/login')}
                className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors duration-200"
              >
                Login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}