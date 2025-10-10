export interface OrderItem {
   _id: string;
   product: {
     _id: string;
     title: string;
     imageCover: string;
     price: number; // Actual unit price
   };
   quantity: number; // Actual quantity
   totalPrice: number; // Total price (quantity × price)
 }
 
 export interface ShippingAddress {
   details: string;
   phone: string;
   city: string;
 }
 
 export interface Order {
   _id: string;
   orderItems: OrderItem[];
   totalOrderPrice: number;
   paymentMethod: string;
   shippingAddress: {
     details: string;
     city: string;
   };
   user: {
     phone: string;
   };
   createdAt: string;
   isPaid: boolean;
   isDelivered: boolean;
   paidAt?: string;
   deliveredAt?: string;
   updatedAt?: string;
 }
 
 export interface OrdersResponse {
   results: number;
   metadata: {
     currentPage: number;
     numberOfPages: number;
     limit: number;
     nextPage?: number;
   };
   data: Order[];
 }