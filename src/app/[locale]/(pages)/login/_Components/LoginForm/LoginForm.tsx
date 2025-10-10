// "use client";

// import { Button } from "@/src/components/ui/button";
// import { signIn } from "next-auth/react"
// import {
//    Card,
//    CardHeader,
//    CardTitle,
//    CardDescription,
//    CardContent,
// } from "@/src/components/ui/card";
// import {
//    Form,
//    FormControl,
//    FormField,
//    FormItem,
//    FormLabel,
//    FormMessage,
// } from "@/src/components/ui/form";
// import { Input } from "@/src/components/ui/input";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { z } from "zod";

// import { useState } from "react";
// import { Loader2 } from "lucide-react";
// import { useSearchParams } from "next/navigation";

// const formSchema = z.object({
//    email: z.string().email("Invalid Email"),
//    password: z.string().min(8, "Password must be at least 8 characters"),
// });

// export function LoginForm() {
//    const [isLoading, setIsLoading] = useState<boolean>(false);
//    let searchParams = useSearchParams()
//    console.log(searchParams.get('error'));


//    const form = useForm<z.infer<typeof formSchema>>({
//       resolver: zodResolver(formSchema),
//       defaultValues: { email: "", password: "" },
//    });

//    async function onSubmit(values: z.infer<typeof formSchema>) {
//       setIsLoading(true)
//       const response = await signIn("credentials", {
//          callbackUrl: "/products",
//          email: values.email,
//          password: values.password
//       })
//       setIsLoading(false)
//       console.log(response);
//    }

//    return (
//       <div
//          className="min-h-screen w-full flex items-center justify-center
//                 "
//       >
//          <Card

//             className="w-full p-8 backdrop-blur-xl
//                    bg-white/10 border border-white/20
//                    shadow-2xl rounded-3xl text-white  
//                  bg-gradient-to-br from-emerald-200 via-emerald-500 to-emerald-200

//                  animate-gradient"
//          >
//             <CardHeader className="text-center space-y-3">
//                <CardTitle className="text-3xl font-extrabold tracking-wide drop-shadow-lg">
//                   ✦ Welcome Back ✦
//                </CardTitle>
//                <CardDescription className="text-white/70 text-base">
//                   Log in to continue your journey
//                </CardDescription>
//             </CardHeader>

//             <CardContent>
//                <Form {...form}>
//                   {searchParams.get("error") ? <h1 className="text-destructive text-3xl text-center py-3">  {searchParams.get("error")} </h1> : ""}
//                   <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//                      <FormField
//                         control={form.control}
//                         name="email"
//                         render={({ field }) => (
//                            <FormItem>
//                               <FormLabel className="text-white">Email</FormLabel>
//                               <FormControl>
//                                  <Input
//                                     {...field}
//                                     type="email"
//                                     placeholder="you@example.com"
//                                     className="rounded-xl bg-white/20 border-white/30 text-white
//                                    placeholder-white/50 h-12 focus:ring-2
//                                   "
//                                  />
//                               </FormControl>
//                               <FormMessage className="text-pink-200" />
//                            </FormItem>
//                         )}
//                      />

//                      <FormField
//                         control={form.control}
//                         name="password"
//                         render={({ field }) => (
//                            <FormItem>
//                               <FormLabel className="text-white">Password</FormLabel>
//                               <FormControl>
//                                  <Input
//                                     {...field}
//                                     type="password"
//                                     placeholder="••••••••"
//                                     className="rounded-xl bg-white/20 border-white/30 text-white
//                                    placeholder-white/50 h-12 focus:ring-2
//                                   "
//                                  />
//                               </FormControl>
//                               <FormMessage className="text-pink-200" />
//                            </FormItem>
//                         )}
//                      />

//                      <Button
//                         type="submit"
//                         className="w-full bg-emerald-500 hover:bg-emerald-600 text-white
//                            cursor-pointer
//                            hover:scale-105 transition-all duration-300 shadow-lg"
//                         disabled={isLoading}
//                      >

//                         {isLoading && <Loader2 className="animate-spin" />}  Sign In
//                      </Button>
//                   </form>
//                </Form>
//             </CardContent>
//          </Card>
//       </div>
//    );
// }
