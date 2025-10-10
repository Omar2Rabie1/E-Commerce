import AddToCart from "@/src/components/AddToCart/AddToCart";
import ProductImages from "../components/ProductImages";

async function getProduct(productId: string) {
  const response = await fetch(
    `https://ecommerce.routemisr.com/api/v1/products/${productId}`,
    { next: { revalidate: 3600 } }
  );
  const { data } = await response.json();
  return data;
}

export default async function ProductDetails({ 
  params 
}: { 
  params: Promise<{ productId: string }> 
}) {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.productId);

  return (
    <div className="min-h-screen py-8 px-4 relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/40 to-slate-900/80" />
      
      <div className="max-w-6xl mx-auto bg-slate-800/90 rounded-lg shadow-2xl overflow-hidden relative z-10 border border-slate-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
          {/* Image section */}
          <div className="flex flex-col items-center">
            <ProductImages product={product} />
          </div>

          {/* Details section */}
          <div className="flex flex-col text-slate-200">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 mb-2">
              {product.brand.name}
            </h1>
            <h2 className="text-xl font-semibold text-white mb-4">
              {product.title}
            </h2>

            <div className="flex items-center mb-4 gap-28">
              <div className="flex text-yellow-400">
                <span className="space-x-3">{product.ratingsAverage}</span>
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span>★</span>
              </div>
              <span className="ml-2 text-cyan-400">
                RatingsQuantity: {product.ratingsQuantity}
              </span>
            </div>

            <div className="mb-4">
              <span className="text-green-400 font-semibold">
                Sold: {product.sold}
              </span>
            </div>

            <div className="mb-6">
              <span className="text-3xl font-bold text-white">
                {product.price} EGP
              </span>
            </div>

            <div className="mb-8">
              <AddToCart  productId={resolvedParams.productId} />
            </div>

            <div className="border-t border-slate-700 pt-4">
              <h3 className="text-lg font-semibold text-cyan-400 mb-2">
                Category: {product.category.name}
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}