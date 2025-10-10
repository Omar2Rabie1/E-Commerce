"use client";

import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/src/components/ui/sheet";
import { LoaderIcon, Menu, ShoppingCartIcon, User2Icon, Sun, Moon, Globe } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useContext, useEffect, useRef, useState } from "react";
import { CartContext } from "../Context/CartContext";
import { useTheme } from "next-themes";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  
  useEffect(() => {
    setMounted(true);
  }, []);

  function logOut() {
    signOut({ callbackUrl: '/login' })
  }

  const switchLanguage = (newLocale: string) => {
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };
  
  const { cartData, isloading } = useContext(CartContext);
  // ✅ SAFE: Proper useSession destructuring with fallback
  const sessionResult = useSession();
  const session = sessionResult?.data || null;
  const status = sessionResult?.status || "loading";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = 64;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class GeometricShape {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      rotation: number;
      rotationSpeed: number;
      type: 'triangle' | 'square' | 'hexagon';
      color: string;

      constructor(canvas: HTMLCanvasElement) {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 15 + 8;
        this.speedX = Math.random() * 0.8 - 0.4;
        this.speedY = Math.random() * 0.8 - 0.4;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() * 0.03 - 0.015);
        
        const types: ('triangle' | 'square' | 'hexagon')[] = ['triangle', 'square', 'hexagon'];
        this.type = types[Math.floor(Math.random() * types.length)];
        
        // ألوان متوافقة مع الدارك مود
        const colors = theme === 'dark' ? [
          `rgba(59, 130, 246, ${Math.random() * 0.2 + 0.05})`, // blue-500
          `rgba(139, 92, 246, ${Math.random() * 0.2 + 0.05})`, // purple-500
          `rgba(6, 182, 212, ${Math.random() * 0.2 + 0.05})`, // cyan-500
          `rgba(99, 102, 241, ${Math.random() * 0.2 + 0.05})`, // indigo-500
        ] : [
          `rgba(37, 99, 235, ${Math.random() * 0.2 + 0.05})`, // blue-600
          `rgba(79, 70, 229, ${Math.random() * 0.2 + 0.05})`, // indigo-600
          `rgba(14, 165, 233, ${Math.random() * 0.2 + 0.05})`, // sky-500
          `rgba(124, 58, 237, ${Math.random() * 0.2 + 0.05})`, // violet-600
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update(canvas: HTMLCanvasElement) {
        this.x += this.speedX;
        this.y += this.speedY;
        this.rotation += this.rotationSpeed;

        if (this.x > canvas.width + this.size) this.x = -this.size;
        else if (this.x < -this.size) this.x = canvas.width + this.size;
        if (this.y > canvas.height + this.size) this.y = -this.size;
        else if (this.y < -this.size) this.y = canvas.height + this.size;
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 1.5;
        ctx.fillStyle = this.color.replace(')', ', 0.03)').replace('rgba', 'rgba');

        switch (this.type) {
          case 'triangle':
            this.drawTriangle(ctx);
            break;
          case 'square':
            this.drawSquare(ctx);
            break;
          case 'hexagon':
            this.drawHexagon(ctx);
            break;
        }

        ctx.restore();
      }

      drawTriangle(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.moveTo(0, -this.size);
        ctx.lineTo(this.size * 0.866, this.size * 0.5);
        ctx.lineTo(-this.size * 0.866, this.size * 0.5);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
      }

      drawSquare(ctx: CanvasRenderingContext2D) {
        const halfSize = this.size / 2;
        ctx.beginPath();
        ctx.rect(-halfSize, -halfSize, this.size, this.size);
        ctx.stroke();
        ctx.fill();
      }

      drawHexagon(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI) / 3;
          const x = Math.cos(angle) * this.size;
          const y = Math.sin(angle) * this.size;
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
      }
    }

    const shapes: GeometricShape[] = [];
    for (let i = 0; i < 15; i++) {
      shapes.push(new GeometricShape(canvas));
    }

    const drawGrid = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
      ctx.strokeStyle = theme === 'dark' 
        ? 'rgba(100, 150, 255, 0.02)' 
        : 'rgba(59, 130, 246, 0.05)';
      ctx.lineWidth = 0.5;
      
      const spacing = 30;
      for (let x = 0; x < canvas.width; x += spacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += spacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    };

    const animate = () => {
      if (!canvas || !ctx) return;
      
      // خلفية متوافقة مع الدارك مود
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      if (theme === 'dark') {
        gradient.addColorStop(0, '#0f172a'); // slate-900
        gradient.addColorStop(0.5, '#1e293b'); // slate-800
        gradient.addColorStop(1, '#334155'); // slate-700
      } else {
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(0.5, '#f8fafc'); // slate-50
        gradient.addColorStop(1, '#f1f5f9'); // slate-100
      }
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawGrid(ctx, canvas);

      shapes.forEach(shape => {
        shape.update(canvas);
        shape.draw(ctx);
      });

      ctx.strokeStyle = theme === 'dark' 
        ? 'rgba(100, 200, 255, 0.08)' 
        : 'rgba(59, 130, 246, 0.1)';
      ctx.lineWidth = 0.8;
      
      for (let i = 0; i < shapes.length; i++) {
        for (let j = i + 1; j < shapes.length; j++) {
          const dx = shapes[i].x - shapes[j].x;
          const dy = shapes[i].y - shapes[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            const alpha = 1 - (distance / 120);
            ctx.strokeStyle = theme === 'dark' 
              ? `rgba(100, 200, 255, ${alpha * 0.1})`
              : `rgba(59, 130, 246, ${alpha * 0.15})`;
            
            ctx.beginPath();
            ctx.moveTo(shapes[i].x, shapes[i].y);
            ctx.lineTo(shapes[j].x, shapes[j].y);
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [theme]); // أضفت theme ك dependency

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg transition-colors duration-300" suppressHydrationWarning>
      
      {/* Canvas Background - متوافق مع الدارك مود */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-16"
      />
      
      {/* Overlay Effects - متوافقة مع الدارك مود */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-transparent to-blue-500/5 dark:from-cyan-500/5 dark:via-transparent dark:to-blue-500/5" />
      
      <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/5 dark:bg-cyan-500/5 rounded-full mix-blend-screen filter blur-2xl"></div>
      <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/5 dark:bg-blue-500/5 rounded-full mix-blend-screen filter blur-2xl"></div>
      
      <div className="container relative mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link
       
          href={`/${locale}`}
          className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-cyan-400 dark:to-blue-500 hover:from-blue-700 hover:to-indigo-700 dark:hover:from-cyan-300 dark:hover:to-blue-400 transition-all duration-300 relative z-10"
        >
          OR-Shop
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center">
          <div className="me-72 gap-8 flex">
            <Link
           
              href={`/${locale}/products`}
              className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-cyan-300 transition-colors font-medium relative z-10 hover:scale-105 transform duration-200"
            >
              {t('products')}
            </Link>
            <Link
              href={`/${locale}/categories`}
              className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-cyan-300 transition-colors font-medium relative z-10 hover:scale-105 transform duration-200"
            >
              {t('categories')}
            </Link>
            <Link
              href={`/${locale}/brands`}
              className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-cyan-300 transition-colors font-medium relative z-10 hover:scale-105 transform duration-200"
            >
              {t('brands')}
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="hover:bg-gray-100 dark:hover:bg-gray-800 border-0 cursor-pointer relative z-10 transition-all duration-300 group"
              suppressHydrationWarning
            >
              {!mounted ? (
                <div className="h-5 w-5" />
              ) : theme === 'dark' ? (
                <Sun className="h-5 w-5 text-gray-600 dark:text-gray-300 group-hover:text-yellow-500 transition-colors" />
              ) : (
                <Moon className="h-5 w-5 text-gray-600 dark:text-gray-300 group-hover:text-blue-500 transition-colors" />
              )}
            </Button>

            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="hover:bg-gray-100 dark:hover:bg-gray-800 border-0 cursor-pointer relative z-10 transition-all duration-300 group"
                >
                  <Globe className="h-5 w-5 text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white dark:bg-gray-800 backdrop-blur-xl border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200">
                <DropdownMenuLabel className="text-gray-900 dark:text-white">
                  {t('language')}
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
                <DropdownMenuItem 
                  onClick={() => switchLanguage('en')}
                  className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer focus:bg-gray-100 dark:focus:bg-gray-700 focus:text-gray-900 dark:focus:text-white"
                >
                  {t('english')}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => switchLanguage('ar')}
                  className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer focus:bg-gray-100 dark:focus:bg-gray-700 focus:text-gray-900 dark:focus:text-white"
                >
                  {t('arabic')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="hover:bg-gray-100 dark:hover:bg-gray-800 border-0 cursor-pointer relative z-10 transition-all duration-300 group"
                >
                  <User2Icon className="h-5 w-5 text-gray-600 dark:text-gray-300 cursor-pointer group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white dark:bg-gray-800 backdrop-blur-xl border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200">
                <DropdownMenuLabel className="text-gray-900 dark:text-white">
                  {t('myAccount')}
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
                
                {!session ? (
                  <>
                    <Link href={`/${locale}/login`}>
                      <DropdownMenuItem className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer focus:bg-gray-100 dark:focus:bg-gray-700 focus:text-gray-900 dark:focus:text-white">
                        {t('login')}
                      </DropdownMenuItem>
                    </Link>

                    <Link href={`/${locale}/register`}>
                      <DropdownMenuItem className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer focus:bg-gray-100 dark:focus:bg-gray-700 focus:text-gray-900 dark:focus:text-white">
                        {t('register')}
                      </DropdownMenuItem>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href={`/${locale}/profile`}>
                      <DropdownMenuItem className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer focus:bg-gray-100 dark:focus:bg-gray-700 focus:text-gray-900 dark:focus:text-white">
                        {t('profile')}
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem 
                      className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer focus:bg-gray-100 dark:focus:bg-gray-700 focus:text-gray-900 dark:focus:text-white" 
                      onClick={logOut}
                    >
                      {t('logout')}
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Cart Icon */}
            {session && (
              <Link href={`/${locale}/cart`}>
                <div className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all duration-300 relative z-10 group">
                  <ShoppingCartIcon className="h-5 w-5 text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors" />
                  <span className="absolute -top-1 -right-1 bg-blue-600 dark:bg-gradient-to-r dark:from-cyan-500 dark:to-blue-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-lg">
                    {isloading ? (
                      <LoaderIcon className="animate-spin h-3 w-3 text-white" />
                    ) : (
                      cartData?.numOfCartItems || 0
                    )}
                  </span>
                </div>
              </Link>
            )}
          </div>
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="hover:bg-gray-100 dark:hover:bg-gray-800 border-0 cursor-pointer relative z-10 transition-all duration-300 group"
            suppressHydrationWarning
          >
            {!mounted ? (
              <div className="h-5 w-5" />
            ) : theme === 'dark' ? (
              <Sun className="h-5 w-5 text-gray-600 dark:text-gray-300 group-hover:text-yellow-500 transition-colors" />
            ) : (
              <Moon className="h-5 w-5 text-gray-600 dark:text-gray-300 group-hover:text-blue-500 transition-colors" />
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="hover:bg-gray-100 dark:hover:bg-gray-800 border-0 cursor-pointer relative z-10 transition-all duration-300 group"
              >
                <Globe className="h-5 w-5 text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white dark:bg-gray-800 backdrop-blur-xl border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200">
              <DropdownMenuLabel className="text-gray-900 dark:text-white">
                {t('language')}
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
              <DropdownMenuItem 
                onClick={() => switchLanguage('en')}
                className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer focus:bg-gray-100 dark:focus:bg-gray-700 focus:text-gray-900 dark:focus:text-white"
              >
                {t('english')}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => switchLanguage('ar')}
                className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer focus:bg-gray-100 dark:focus:bg-gray-700 focus:text-gray-900 dark:focus:text-white"
              >
                {t('arabic')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {session && (
            <Link href={`/${locale}/cart`} className="relative z-10 group">
              <ShoppingCartIcon className="h-5 w-5 text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors" />
              <span className="absolute -top-2 -right-2 bg-blue-600 dark:bg-gradient-to-r dark:from-cyan-500 dark:to-blue-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full font-bold shadow-lg">
                {isloading ? (
                  <LoaderIcon className="animate-spin h-2 w-2 text-white" />
                ) : (
                  cartData?.numOfCartItems || 0
                )}
              </span>
            </Link>
          )}
          
          {/* Mobile Menu Sheet */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-gray-100 dark:hover:bg-gray-800 border-0 relative z-10 transition-all duration-300">
                <Menu className="h-6 w-6 text-gray-600 dark:text-gray-300" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-gray-200 dark:border-gray-700">
              <div className="flex flex-col gap-6 mt-8">
                <Link href={`/${locale}`} className="text-lg font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">
                  {t('home')}
                </Link>
                <Link
                  href={`/${locale}/products`}
                  className="text-lg text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors"
                >
                  {t('products')}
                </Link>
                <Link
                  href={`/${locale}/categories`}
                  className="text-lg text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors"
                >
                  {t('categories')}
                </Link>
                <Link
                  href={`/${locale}/brands`}
                  className="text-lg text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors"
                >
                  {t('brands')}
                </Link>
                <Link
                  href={`/${locale}/cart`}
                  className="text-lg text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors"
                >
                  {t('cart')}
                </Link>
                
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                  {session ? (
                    <>
                      <Link href={`/${locale}/profile`} className="block text-lg text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors mb-3">
                        {t('profile')}
                      </Link>
                      <button 
                        onClick={logOut}
                        className="text-lg text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors"
                      >
                        {t('logout')}
                      </button>
                    </>
                  ) : (
                    <>
                      <Link href={`/${locale}/login`} className="block text-lg text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors mb-3">
                        {t('login')}
                      </Link>
                      <Link href={`/${locale}/register`} className="text-lg text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">
                        {t('register')}
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* User Greeting */}
        {session?.user?.name && (
          <div className="hidden md:block relative z-10">
            <span className="text-gray-600 dark:text-gray-300 font-medium">Hi, {session.user.name}</span>
          </div>
        )}
      </div>
    </header>
  );
}