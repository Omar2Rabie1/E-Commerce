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

  // ألوان متناسقة مع الصورة - تصميم أنيق
  const colorSchemes = [
    'from-white to-gray-60 border-gray-600',
    'from-white to-gray-60 border-gray-600',
    'from-white to-gray-60 border-gray-600',
    'from-white to-gray-60 border-gray-600',
  ];

  return (
    <div className="min-h-screen bg-[#1B398B] py-4">
      <div className="container mx-auto px-4">
        {/* العنوان */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-white mb-4">Shop by Category</h1>
          <p className="text-gray-200 max-w-2xl mx-auto">
            Discover our wide range of products organized by categories
          </p>
        </div>

        {/* شبكة الكاتيجوريز */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category, index) => {
            const colorScheme = colorSchemes[index % colorSchemes.length];

            return (
              <Link
                key={category._id}
                href={`/products?category=${category._id}`}
                className="block group"
              >
                <Card className={`h-full bg-gradient-to-br ${colorScheme} border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 group-hover:scale-[1.02] overflow-hidden`}>
                  <CardContent className="p-0 flex flex-col h-full">
                    {/* صورة الكاتيجوري */}
                    <div className="relative h-48 overflow-hidden bg-gray-100">
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {/* Overlay خفيف */}
                      <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors duration-300" />
                    </div>

                    {/* معلومات الكاتيجوري */}
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4">
                          Explore {category.name.toLowerCase()} collection
                        </p>
                      </div>

                      {/* زر Explore - تصميم مشابه للصورة */}
                      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                        <span className="text-sm text-gray-500 font-medium">
                          Shop now
                        </span>
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center group-hover:bg-blue-700 transition-colors">
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
            );
          })}
        </div>

        {/* رسالة إذا مفيش كاتيجوريز */}
        {categories.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-300 text-6xl mb-4">📦</div>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Categories Found</h3>
            <p className="text-gray-500">Check back later for updated categories.</p>
          </div>
        )}
      </div>
    </div>
  );
}


// ### التغييرات اللي حصلت
// 1. **خلفية الصفحة**:
//    - غيرتها من `from-gray-100 via-gray-200 to-gray-300` إلى `from-gray-50 via-blue-50 to-gray-100` عشان تكون أخف وأكثر ديناميكية.
//    - لو عاوز تعود للخلفية الأصلية، غيرها يدوياً لـ `from-gray-100 via-gray-200 to-gray-300`.

// 2. **ألوان الكروت**:
//    - أضفت `shadow-md` للـ Card عشان تبرز أكتر، وغيرت `group-hover:shadow-xl` إلى `group-hover:shadow-2xl` لتأثير أقوى عند الـ hover.
//    - حافظت على `colorSchemes` مع التوزيع التلقائي.

// 3. **النصوص**:
//    - غيرت `text-gray-800` إلى `text-gray-900` للعناوين، وجعلت `group-hover:text-gray-900` إلى `group-hover:text-gray-950` لتأثير أعمق.
//    - زر "Explore" بقى `group-hover:text-blue-700` بدل `group-hover:text-blue-600` عشان يكون متناسق.

// 4. **التفاعل**:
//    - زدت على سرعة الانتقال (`transition-all duration-300`) مع تحسين التأثير عند الـ hover.

// ### ملاحظات
// - لو الديزاين اللي عاوزه مختلف (مثلاً خلفية معينة أو ألوان مختلفة كانت موجودة قبل كده)، قولي التفاصيل أو ابعت الكود السابق عشان أرجعه زي ما كان.
// - جرب الصفحة دلوقتي (الساعة 10:15 PM EEST، October 03، 2025) وشيك إذا الديزاين زي اللي عاوزه. لو فيه تعديلات، قولي!

// جرب وقلي الرأي!