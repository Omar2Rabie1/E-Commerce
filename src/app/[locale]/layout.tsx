
import { Toaster } from "react-hot-toast";
import Footer from "../../components/Footer/footer";
import CartProvider from "../../components/Context/CartContext";
import MySessionProvider from "../../MySessionProvider/MySessionProvider";
import Navbar from "../../components/Navbar/Navbar";
import { ThemeProvider } from "../../providers/ThemeProvider";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import ErrorBoundary from "../../components/ErrorBoundary/ErrorBoundary";

import { Geist, Geist_Mono } from "next/font/google";
import { routing } from "@/src/i18n/routing";
import type { Metadata } from "next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  
  return {
    title: locale === 'ar' ? 'متجر - متجرك الإلكتروني' : 'E-Shop - Your Online Store',
    description: locale === 'ar' 
      ? 'اكتشف متجرنا الإلكتروني مع مجموعة واسعة من المنتجات باللغات المتعددة'
      : 'Explore our e-commerce store with a wide range of products in multiple languages',
    keywords: 'e-commerce, shop, categories, products, multilingual',
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale: string) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: Props) {
  const { locale } = await params;

  // تحقق من صحة الـ locale
  if (!routing.locales.includes(locale as "ar" | "en")) {
    console.error(`Invalid locale: ${locale}. Valid locales are: ${routing.locales.join(', ')}`);
    notFound();
  }

  // جلب الرسائل للـ client
  const messages = await getMessages();

  return (
    <html 
      lang={locale} 
      dir={locale === 'ar' ? 'rtl' : 'ltr'} 
      suppressHydrationWarning
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <NextIntlClientProvider messages={messages} locale={locale}>
          <ErrorBoundary>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <MySessionProvider>
                <CartProvider>
                  <Navbar />
                  <div suppressHydrationWarning>
                    <Toaster />
                    {children}
                  </div>
                  <Footer />
                </CartProvider>
              </MySessionProvider>
            </ThemeProvider>
          </ErrorBoundary>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}