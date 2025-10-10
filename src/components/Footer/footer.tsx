import React from "react";

export default function Footer() {
   return (
      <>
         <footer className="bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 py-12 px-4 md:px-8 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
            <div className="container mx-auto">
               {/* العنوان والشعار */}
               <div className="mb-8 text-center">
                  <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:via-cyan-300 dark:to-indigo-400 mb-3">
                     ShopMart
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed max-w-2xl mx-auto">
                     Your one-stop destination for the latest technology, fashion, and
                     lifestyle products. Quality guaranteed with fast shipping and
                     excellent customer service.
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center items-center gap-6 text-gray-500 dark:text-gray-400">
                     <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-600 dark:bg-cyan-400 rounded-full"></span>
                        <span>123 Shop Street, October City, DC 12345</span>
                     </div>
                     <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full"></span>
                        <span>(+20) 01093333333</span>
                     </div>
                     <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-purple-600 dark:bg-indigo-400 rounded-full"></span>
                        <span>support@shopmart.com</span>
                     </div>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  {/* قسم المتجر */}
                  <div>
                     <h3 className="text-lg font-semibold mb-4 pb-2 text-blue-600 dark:text-cyan-400 border-b border-gray-300 dark:border-gray-700">
                        SHOP
                     </h3>
                     <div className="mb-4">
                        <h4 className="font-medium mb-3 text-blue-700 dark:text-cyan-300">Categories</h4>
                        <ul className="space-y-2">
                           {["Electronics", "Fashion", "Home & Garden", "Sports", "Beauty", "Toys"].map(
                              (item, index) => (
                                 <li
                                    key={index}
                                    className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-cyan-300 cursor-pointer transition-colors duration-200"
                                 >
                                    {item}
                                 </li>
                              )
                           )}
                        </ul>
                     </div>
                  </div>

                  {/* قسم خدمة العملاء */}
                  <div>
                     <h3 className="text-lg font-semibold mb-4 pb-2 text-blue-600 dark:text-cyan-400 border-b border-gray-300 dark:border-gray-700">
                        CUSTOMER SERVICE
                     </h3>
                     <ul className="space-y-2">
                        {[
                           "Contact Us",
                           "Help Center",
                           "Track Your Order",
                           "Returns & Exchanges",
                           "Shipping Info",
                           "Size Guide",
                        ].map((item, index) => (
                           <li
                              key={index}
                              className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-cyan-300 cursor-pointer transition-colors duration-200"
                           >
                              {item}
                           </li>
                        ))}
                     </ul>
                  </div>

                  {/* قسم الشركة */}
                  <div>
                     <h3 className="text-lg font-semibold mb-4 pb-2 text-blue-600 dark:text-cyan-400 border-b border-gray-300 dark:border-gray-700">
                        COMPANY
                     </h3>
                     <ul className="space-y-2">
                        {[
                           "About Us",
                           "Careers",
                           "Press",
                           "Investor Relations",
                           "Sustainability",
                           "Affiliate Program",
                        ].map((item, index) => (
                           <li
                              key={index}
                              className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-cyan-300 cursor-pointer transition-colors duration-200"
                           >
                              {item}
                           </li>
                        ))}
                     </ul>
                  </div>

                  {/* قسم الاشتراك في النشرة البريدية */}
                  <div>
                     <h3 className="text-lg font-semibold mb-4 pb-2 text-blue-600 dark:text-cyan-400 border-b border-gray-300 dark:border-gray-700">
                        NEWSLETTER
                     </h3>
                     <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm">
                        Subscribe to get special offers, free giveaways, and exclusive deals.
                     </p>
                     <div className="flex flex-col gap-3">
                        <input
                           type="email"
                           placeholder="Enter your email"
                           className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200"
                        />
                        <button className="bg-blue-600 hover:bg-blue-700 dark:bg-gradient-to-r dark:from-cyan-500 dark:to-blue-600 dark:hover:from-cyan-600 dark:hover:to-blue-700 text-white py-2 px-4 rounded-lg transition-colors duration-200 font-medium">
                           Subscribe
                        </button>
                     </div>
                  </div>
               </div>

               {/* وسائل التواصل الاجتماعي وطرق الدفع */}
               <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                     {/* وسائل التواصل */}
                     <div className="flex gap-4">
                        {[
                           { icon: "📘", label: "Facebook", color: "hover:text-blue-600 dark:hover:text-blue-400" },
                           { icon: "📷", label: "Instagram", color: "hover:text-pink-600 dark:hover:text-pink-400" },
                           { icon: "🐦", label: "Twitter", color: "hover:text-blue-500 dark:hover:text-cyan-400" },
                           { icon: "💼", label: "LinkedIn", color: "hover:text-blue-700 dark:hover:text-indigo-400" }
                        ].map((social, index) => (
                           <button
                              key={index}
                              className={`w-10 h-10 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-md ${social.color}`}
                              title={social.label}
                           >
                              <span className="text-lg text-gray-600 dark:text-gray-200">{social.icon}</span>
                           </button>
                        ))}
                     </div>

                     {/* طرق الدفع */}
                     <div className="flex items-center gap-4">
                        <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">We Accept:</span>
                        <div className="flex gap-2">
                           {["💳", "🏦", "📱", "🔗"].map((method, index) => (
                              <span key={index} className="text-xl text-gray-600 dark:text-gray-200" title={`Payment Method ${index + 1}`}>
                                 {method}
                              </span>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>

               {/* حقوق النشر */}
               <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
                  <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 dark:text-gray-500 text-sm">
                     <p>
                        &copy; {new Date().getFullYear()} ShopMart. All rights reserved.
                     </p>
                     <div className="flex gap-6">
                        <span className="hover:text-blue-600 dark:hover:text-cyan-400 cursor-pointer transition-colors">Privacy Policy</span>
                        <span className="hover:text-blue-600 dark:hover:text-cyan-400 cursor-pointer transition-colors">Terms of Service</span>
                        <span className="hover:text-blue-600 dark:hover:text-cyan-400 cursor-pointer transition-colors">Cookie Policy</span>
                     </div>
                  </div>
               </div>
            </div>
         </footer>
      </>
   );
}