"use client";
import Link from "next/link";
import { Button } from "../../components/ui/button";
import { useEffect, useRef } from "react";
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';

export default function Home() {
  const t = useTranslations();
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof window === 'undefined') return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to cover full screen
    const resizeCanvas = () => {
      if (!canvas || typeof window === 'undefined') return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Product icon configuration
    class ProductIcon {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      rotation: number;
      rotationSpeed: number;
      type: 'cart' | 'tag' | 'box';
      color: string;

      constructor(canvas: HTMLCanvasElement) {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 30 + 20;
        this.speedX = Math.random() * 0.6 - 0.4;
        this.speedY = Math.random() * 0.6 - 0.4;
        this.rotation = Math.random() * Math.PI * 4;
        this.rotationSpeed = (Math.random() * 0.01 - 0.005);
        
        const types: ('cart' | 'tag' | 'box')[] = ['cart', 'tag', 'box'];
        this.type = types[Math.floor(Math.random() * types.length)];
        
        // E-commerce-friendly colors that work in both themes
        const colors = theme === 'dark' ? [
          `rgba(59, 130, 246, ${Math.random() * 0.3 + 0.2})`, // blue-500
          `rgba(6, 182, 212, ${Math.random() * 0.3 + 0.2})`,  // cyan-500
          `rgba(139, 92, 246, ${Math.random() * 0.3 + 0.2})`, // purple-500
        ] : [
          `rgba(37, 99, 235, ${Math.random() * 0.3 + 0.2})`, // blue-600
          `rgba(14, 165, 233, ${Math.random() * 0.3 + 0.2})`, // sky-500
          `rgba(124, 58, 237, ${Math.random() * 0.3 + 0.2})`, // violet-600
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
        ctx.lineWidth = 2;
        ctx.fillStyle = this.color.replace(')', ', 0.05)').replace('rgba', 'rgba');

        switch (this.type) {
          case 'cart':
            this.drawCart(ctx);
            break;
          case 'tag':
            this.drawTag(ctx);
            break;
          case 'box':
            this.drawBox(ctx);
            break;
        }

        ctx.restore();
      }

      drawCart(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.moveTo(-this.size / 2, 0);
        ctx.lineTo(-this.size / 4, -this.size / 2);
        ctx.lineTo(this.size / 4, -this.size / 2);
        ctx.lineTo(this.size / 2, 0);
        ctx.lineTo(this.size / 4, this.size / 4);
        ctx.lineTo(-this.size / 4, this.size / 4);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
      }

      drawTag(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.moveTo(-this.size / 2, -this.size / 2);
        ctx.lineTo(this.size / 2, -this.size / 2);
        ctx.lineTo(this.size / 2, this.size / 2);
        ctx.lineTo(-this.size / 2, this.size / 2);
        ctx.lineTo(-this.size / 4, 0);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
      }

      drawBox(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        const halfSize = this.size / 2;
        ctx.rect(-halfSize, -halfSize, this.size, this.size);
        ctx.moveTo(-halfSize, -halfSize);
        ctx.lineTo(halfSize, halfSize);
        ctx.moveTo(halfSize, -halfSize);
        ctx.lineTo(-halfSize, halfSize);
        ctx.stroke();
        ctx.fill();
      }
    }

    // Create product icons
    const icons: ProductIcon[] = [];
    for (let i = 0; i < 15; i++) {
      icons.push(new ProductIcon(canvas));
    }

    // Grid lines
    const drawGrid = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
      ctx.strokeStyle = theme === 'dark' 
        ? 'rgba(100, 150, 255, 0.03)' 
        : 'rgba(59, 130, 246, 0.05)';
      ctx.lineWidth = 1;
      
      const spacing = 60;
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

    // Animation loop
    const animate = () => {
      if (!canvas || !ctx) return;
      
      // Dynamic gradient background based on theme
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

      // Draw grid
      drawGrid(ctx, canvas);

      // Update and draw icons
      icons.forEach(icon => {
        icon.update(canvas);
        icon.draw(ctx);
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [theme]); // Add theme as dependency

  return (
    <div className="min-h-screen relative overflow-hidden bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Product Icon Background Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/40 to-white/80 dark:from-transparent dark:via-gray-900/40 dark:to-gray-900/80" />
      
      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col justify-center items-center px-4 text-center">
        
        {/* Main heading with distinctive effect */}
        <div className="mb-8">
          <h1 className="font-bold text-7xl md:text-8xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:via-cyan-300 dark:to-indigo-400 mb-6 drop-shadow-2xl">
            {t('welcome')}
          </h1>
          <div className="h-1 w-32 bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-cyan-400 dark:to-blue-500 mx-auto mb-4 rounded-full"></div>
      
        </div>
        
        {/* Description */}
        <p className="text-gray-600 dark:text-gray-200 text-xl md:text-2xl text-center max-w-4xl mx-auto leading-relaxed mb-12 font-light">
          &quot;Discover the latest technology, fashion, and lifestyle products. 
          <span className="block mt-2 text-blue-600 dark:text-cyan-200 font-medium">
            Quality guaranteed with fast shipping and excellent customer service.&quot;
          </span>
        </p>
        
        {/* Buttons */}
        <div className="flex justify-center gap-8 flex-wrap">
          <Button className="group relative w-52 h-16 cursor-pointer overflow-hidden bg-blue-600 hover:bg-blue-700 dark:bg-gradient-to-r dark:from-cyan-500 dark:to-blue-600 dark:hover:from-cyan-600 dark:hover:to-blue-700 text-white font-bold text-lg shadow-2xl transform hover:scale-105 transition-all duration-300 border-0">
            <div className="absolute inset-0 bg-white/20 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            <Link href={'/products'} className="relative z-10 w-full h-full flex items-center justify-center">
              {t('products')}
            </Link>
          </Button>
          
          <Button className="group relative w-64 h-16 bg-transparent text-gray-800 dark:text-white font-bold text-lg shadow-2xl transform hover:scale-105 transition-all duration-300 cursor-pointer border-2 border-blue-500/50 dark:border-cyan-400/50 hover:border-blue-600 dark:hover:border-cyan-400 backdrop-blur-sm">
            <div className="absolute inset-0 bg-blue-500/10 dark:bg-cyan-500/10 transform scale-0 group-hover:scale-100 transition-transform duration-300"></div>
            <Link href={'/categories'} className="relative z-10 w-full h-full flex items-center justify-center">
              {t('categories')}
            </Link>
          </Button>
        </div>

        {/* Floating stats */}
        <div className="mt-16 flex gap-12 text-center">
          <div className="text-blue-600 dark:text-cyan-200">
            <div className="text-3xl font-bold">500+</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">{t('products')}</div>
          </div>
          <div className="text-blue-500 dark:text-blue-200">
            <div className="text-3xl font-bold">24/7</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Support</div>
          </div>
          <div className="text-indigo-600 dark:text-indigo-200">
            <div className="text-3xl font-bold">50K+</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Customers</div>
          </div>
        </div>
      </div>
    </div>
  );
}