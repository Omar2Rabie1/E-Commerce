// src/app/(pages)/products/page.tsx
import AddToCart from '@/src/components/AddToCart/AddToCart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { ProductI } from "@/src/interfaces";
import Image from 'next/image';
import Link from 'next/link';
import ProductsPagination from './components/ProductsPagination';

interface ProductsPageProps {
  searchParams: Promise<{ 
    page?: string;
    limit?: string;
    category?: string;
    brand?: string;
  }>;
}

async function getCategories() {
  const response = await fetch('https://ecommerce.routemisr.com/api/v1/categories');
  const data = await response.json();
  return data.data;
}

async function getBrands() {
  const response = await fetch('https://ecommerce.routemisr.com/api/v1/brands');
  const data = await response.json();
  return data.data;
}

export default async function Products({ searchParams }: ProductsPageProps) {
  const resolvedParams = await searchParams;
  const currentPage = parseInt(resolvedParams.page || '1');
  const limit = parseInt(resolvedParams.limit || '15');
  const categoryId = resolvedParams.category;
  const brandId = resolvedParams.brand;

  const categories = await getCategories();
  const currentCategory = categories.find((cat: { _id: string | undefined; }) => cat._id === categoryId);

  const brands = await getBrands();
  const currentBrand = brands.find((brand: { _id: string | undefined; }) => brand._id === brandId);

  let apiUrl = `https://ecommerce.routemisr.com/api/v1/products?page=${currentPage}&limit=${limit}`;
  
  if (categoryId) {
    apiUrl = `https://ecommerce.routemisr.com/api/v1/products?category=${categoryId}&page=${currentPage}&limit=${limit}`;
  } else if (brandId) {
    apiUrl = `https://ecommerce.routemisr.com/api/v1/products?brand=${brandId}&page=${currentPage}&limit=${limit}`;
  }

  const response = await fetch(apiUrl, {
    cache: 'no-store'
  });

  const data = await response.json();
  const products: ProductI[] = data.data;

  const totalProducts = data.metadata?.total || data.results || 100;
  const totalPages = Math.ceil(totalProducts / limit);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 py-8">
      <div className="container mx-auto px-4">
        {/* العنوان */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {currentCategory 
              ? `${currentCategory.name} Products` 
              : currentBrand 
              ? `${currentBrand.name} Products` 
              : 'Our Products'
            }
          </h1>

          {(currentCategory || currentBrand) && (
            <div className="flex justify-center items-center gap-4 mb-4">
              <p className="text-gray-600 dark:text-gray-300">
                {currentCategory 
                  ? `Showing products in ${currentCategory.name} category`
                  : `Showing products from ${currentBrand?.name} brand`
                }
              </p>
              <Link
                href="/products"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium flex items-center gap-1"
              >
                View all products
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          )}

          {!currentCategory && !currentBrand && (
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Discover our wide range of high-quality products.
              Find exactly what you're looking for with our extensive collection.
            </p>
          )}
        </div>

        {/* أزرار العودة */}
        {(currentCategory || currentBrand) && (
          <div className="mb-6">
            <div className="flex gap-4 justify-center">
              {currentCategory && (
                <Link
                  href="/categories"
                  className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z" clipRule="evenodd" />
                  </svg>
                  Back to Categories
                </Link>
              )}
              {currentBrand && (
                <Link
                  href="/brands"
                  className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z" clipRule="evenodd" />
                  </svg>
                  Back to Brands
                </Link>
              )}
            </div>
          </div>
        )}

        {/* قائمة المنتجات */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-12">
          {products.map((prod) => (
            <div key={prod._id}>
              <Card className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 group-hover:scale-105 overflow-hidden'>
                <Link href={`/products/${prod._id}`}>
                  <CardHeader>
                    <Image
                      className='w-full h-48 object-cover'
                      src={prod.imageCover}
                      alt={prod.title}
                      width={300}
                      height={300}
                    />
                    <div className="text-center mt-2">
                      <CardTitle className='line-clamp-1 text-lg text-gray-900 dark:text-white'>{prod.title}</CardTitle>
                      <CardDescription className='text-sm text-gray-600 dark:text-gray-300'>
                        {prod.category?.name || 'No category'}
                        {prod.brand && ` • ${prod.brand.name}`}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className='relative'>
                    <div className='flex justify-center items-center gap-1 mb-2'>
                      <p className='text-sm font-medium text-gray-700 dark:text-gray-200'>{prod.ratingsAverage}</p>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5 text-yellow-500">
                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className='text-center text-gray-700 dark:text-gray-200'>
                      Price: <span className='font-bold text-green-600 dark:text-green-400'>{prod.price} EGP</span>
                    </p>
                  </CardContent>
                </Link>
                <div className="px-4 pb-4">
                  <AddToCart productId={prod.id} />
                </div>
              </Card>
            </div>
          ))}
        </div>

        {/* رسالة إذا مفيش منتجات */}
        {products.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-600 text-6xl mb-4">😔</div>
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">No Products Found</h3>
            <p className="text-gray-500 dark:text-gray-500 mb-4">
              {currentCategory
                ? `No products available in ${currentCategory.name} category.`
                : currentBrand
                ? `No products available from ${currentBrand.name} brand.`
                : 'No products available at the moment.'
              }
            </p>
            <div className="flex gap-4 justify-center">
              {(currentCategory || currentBrand) && (
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  View All Products
                </Link>
              )}
              {currentBrand && (
                <Link
                  href="/brands"
                  className="inline-flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Back to Brands
                </Link>
              )}
              {currentCategory && (
                <Link
                  href="/categories"
                  className="inline-flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Back to Categories
                </Link>
              )}
            </div>
          </div>
        )}

        {/* الباجينيشن */}
        {products.length > 0 && (
          <ProductsPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalProducts={totalProducts}
            limit={limit}
            categoryId={categoryId}
          />
        )}
      </div>
    </div>
  );
}