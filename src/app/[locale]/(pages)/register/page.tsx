// src/app/(pages)/register/page.tsx
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

  async function handleRegister(values: registerSchemaType) {
    setIsLoading(true)
    setServerError('')

    try {
      const response = await axios.post(
        `https://ecommerce.routemisr.com/api/v1/auth/signup`,
        values
      )
      
      toast.success("Account created successfully")
      router.push('/login')
    } catch (error: unknown) {
      console.error('Registration error:', error)

      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } };
        if (axiosError.response?.data?.message) {
          setServerError(axiosError.response.data.message)
        } else if (axiosError.response?.data?.errors) {
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4 transition-colors duration-300">
      <div className="max-w-md w-full p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-6">
            Create a new account
          </h2>

          {serverError && (
            <div className="bg-red-100 dark:bg-red-900/50 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-4">
              {serverError}
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleRegister)} className="space-y-4">
              
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-300">Full Name</FormLabel>
                    <FormControl>
                      <Input 
                        type="text" 
                        {...field} 
                        className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 rounded-md py-2 px-3 placeholder-gray-500 dark:placeholder-gray-400"
                        placeholder="Enter Your Full Name"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 dark:text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-300">Email</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        {...field} 
                        className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 rounded-md py-2 px-3 placeholder-gray-500 dark:placeholder-gray-400"
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
                    <FormLabel className="text-gray-700 dark:text-gray-300">Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        {...field} 
                        className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 rounded-md py-2 px-3 placeholder-gray-500 dark:placeholder-gray-400"
                        placeholder="..........."
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 dark:text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rePassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-300">Confirm Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        {...field} 
                        className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 rounded-md py-2 px-3 placeholder-gray-500 dark:placeholder-gray-400"
                        placeholder="..........."
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 dark:text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-300">Phone Number</FormLabel>
                    <FormControl>
                      <Input 
                        type="tel"  
                        {...field} 
                        className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 rounded-md py-2 px-3 placeholder-gray-500 dark:placeholder-gray-400"
                        placeholder="Enter Phone Number"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 dark:text-red-400" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white cursor-pointer font-medium py-2.5 rounded-md transition-all duration-300 shadow hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? 'Loading ...' : 'Register'}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Do you have an account?{' '}
              <button 
                type="button"
                onClick={() => router.push('/login')}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors duration-200"
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