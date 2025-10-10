import { Category } from "./category";


export interface ProductI {
   sold: number; // ملاحظة: في المثال التاني القيمة كبيرة جدًا (scientific notation)، فالأفضل نخليها number
   images: string[];
   subcategory: Category[];
   ratingsQuantity: number;
   _id: string;
   title: string;
   slug: string;
   description: string;
   quantity: number;
   price: number;
   imageCover: string;
   category: Category;
   brand: Category;
   ratingsAverage: number;
   createdAt: string; // ISO date string
   updatedAt: string; // ISO date string
   id: string;
}
