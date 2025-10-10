// src/app/(pages)/categories/page.tsx
import { Card, CardContent } from '@/src/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';

interface Category {
  _id: string;
  name: string;
  slug: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

async function getCategories(): Promise<Category[]> {
  const response = await fetch('https://ecommerce.routemisr.com/api/v1/categories', {
    cache: 'no-store'
  });

  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }

  const data = await response.json();
  return data.data;
}

export default async function Categories() {
  const categories = await getCategories();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-8 transition-colors duration-300">
      <div className="container mx-auto px-4">
        {/* العنوان */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Shop by Category
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover our wide range of products organized by categories
          </p>
        </div>

        {/* شبكة الكاتيجوريز */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Link
              key={category._id}
              href={`/products?category=${category._id}`}
              className="block group"
            >
              <Card className="h-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 group-hover:scale-[1.02] overflow-hidden">
                <CardContent className="p-0 flex flex-col h-full">
                  {/* صورة الكاتيجوري */}
                  <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-700">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* Overlay خفيف */}
                    <div className="absolute inset-0 bg-black/5 dark:bg-black/10 group-hover:bg-black/10 dark:group-hover:bg-black/20 transition-colors duration-300" />
                  </div>

                  {/* معلومات الكاتيجوري */}
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                        Explore {category.name.toLowerCase()} collection
                      </p>
                    </div>

                    {/* زر Explore - تصميم مشابه للصورة */}
                    <div className="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-gray-600">
                      <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                        Shop now
                      </span>
                      <div className="w-8 h-8 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center group-hover:bg-blue-700 dark:group-hover:bg-blue-600 transition-colors">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-4 h-4 text-white"
                        >
                          <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* رسالة إذا مفيش كاتيجوريز */}
        {categories.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-300 dark:text-gray-600 text-6xl mb-4">📦</div>
            <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
              No Categories Found
            </h3>
            <p className="text-gray-500 dark:text-gray-500">
              Check back later for updated categories.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}