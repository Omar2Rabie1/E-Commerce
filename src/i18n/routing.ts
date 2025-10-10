import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['en', 'ar'],
  defaultLocale: 'en',
  localePrefix: 'always',
  pathnames: {
    '/': '/',
    '/products': '/products',
    '/cart': '/cart',
    '/profile': '/profile',
    '/login': '/login',
    '/register': '/register',
    '/categories': '/categories',
    '/brands': '/brands',
    '/orders': '/orders',
    '/allorders': '/allorders'
  }
});

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);