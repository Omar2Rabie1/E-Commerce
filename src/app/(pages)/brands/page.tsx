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
    <div className="px-4 py-8 relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/40 to-slate-900/80" />
      
      {/* العنوان الرئيسي */}
      <div className="text-center mb-8 relative z-10">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 mb-2">
          Our Brands
        </h1>
        <p className="text-slate-200 max-w-2xl mx-auto">
          Discover products from your favorite brands. Each brand offers unique quality and style.
        </p>
      </div>

      {/* قائمة البراندز */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-12 relative z-10">
        {brands.map((brand) => (
          <Link key={brand._id} href={`/products?brand=${brand._id}`}>
            <Card className='bg-slate-800/90 py-4 hover:shadow-lg transition-all duration-300 border border-slate-700 hover:border-cyan-500/50 hover:scale-105 cursor-pointer'>
              <CardHeader className='pb-2'>
                <div className='w-full h-40 relative bg-white rounded-lg p-4 flex items-center justify-center'>
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
                <CardTitle className='text-lg text-white'>{brand.name}</CardTitle>
                <p className='text-slate-400 text-sm mt-1'>Explore products</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* رسالة إذا مفيش براندز */}
      {brands.length === 0 && (
        <div className="text-center py-12 relative z-10">
          <div className="text-slate-400 text-6xl mb-4">🏷️</div>
          <h3 className="text-xl font-semibold text-slate-200 mb-2">No Brands Available</h3>
          <p className="text-slate-400 mb-4">
            We&apos;re working on adding more brands to our collection.
          </p>
        </div>
      )}
    </div>
  );
}