// src/app/(pages)/brands/page.tsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';

interface Brand {
  _id: string;
  name: string;
  slug: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

async function getBrands() {
  const response = await fetch('https://ecommerce.routemisr.com/api/v1/brands', {
    cache: 'no-store'
  });
  const data = await response.json();
  return data.data;
}

export default async function Brands() {
  const brands: Brand[] = await getBrands();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 py-8">
      <div className="container mx-auto px-4">
        {/* العنوان الرئيسي */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Our Brands
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover products from your favorite brands. Each brand offers unique quality and style.
          </p>
        </div>

        {/* قائمة البراندز */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-12">
          {brands.map((brand) => (
            <Link key={brand._id} href={`/products?brand=${brand._id}`}>
              <Card className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 cursor-pointer'>
                <CardHeader className='pb-2'>
                  <div className='w-full h-40 relative bg-gray-100 dark:bg-gray-700 rounded-lg p-4 flex items-center justify-center'>
                    <Image
                      className='w-full h-full object-contain'
                      src={brand.image}
                      alt={brand.name}
                      width={200}
                      height={160}
                    />
                  </div>
                </CardHeader>
                <CardContent className='text-center pt-2'>
                  <CardTitle className='text-lg text-gray-900 dark:text-white'>{brand.name}</CardTitle>
                  <p className='text-gray-500 dark:text-gray-400 text-sm mt-1'>Explore products</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* رسالة إذا مفيش براندز */}
        {brands.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-600 text-6xl mb-4">🏷️</div>
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">No Brands Available</h3>
            <p className="text-gray-500 dark:text-gray-500">
              We&apos;re working on adding more brands to our collection.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}