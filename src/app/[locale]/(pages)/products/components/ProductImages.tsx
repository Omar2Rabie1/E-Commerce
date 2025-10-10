// components/ProductImages.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { ProductI } from "@/src/interfaces";


export default function ProductImages({ product }: { product: ProductI }) {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* الصورة الرئيسية */}
      <div className="w-full max-w-md h-80 relative rounded-lg overflow-hidden">
        <Image
          src={product.images[selectedImage]}
          alt={product.title}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* الصور المصغرة */}
      {product.images.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto">
          {product.images.map((image: string, index: number) => (
            <button
              key={index}
              className={`w-16 h-16 relative rounded-md overflow-hidden border-2 ${
                selectedImage === index ? "border-blue-500" : "border-gray-300"
              }`}
              onClick={() => setSelectedImage(index)}
            >
              <Image
                src={image}
                alt={`${product.title} ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}