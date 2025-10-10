import React from 'react'

export default function loading() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900 px-4 relative overflow-hidden transition-colors duration-300">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/40 to-white/80 dark:from-transparent dark:via-gray-900/40 dark:to-gray-900/80" />
      
      {/* Spinner */}
      <div className="flex flex-col items-center gap-4 relative z-10">
        <div className="w-14 h-14 border-4 border-gray-300 dark:border-gray-600 border-t-blue-600 dark:border-t-cyan-400 rounded-full animate-spin"></div>
        <p className="text-gray-700 dark:text-cyan-200 text-lg font-medium animate-pulse">
          Loading....
        </p>
      </div>

      {/* Skeleton Preview */}
      <div className="mt-10 w-full max-w-3xl space-y-4 relative z-10">
        <div className="h-6 w-1/3 bg-gray-200 dark:bg-gray-700/50 rounded-lg animate-pulse"></div>
        <div className="h-32 w-full bg-gray-200 dark:bg-gray-700/50 rounded-lg animate-pulse"></div>
        <div className="h-20 w-full bg-gray-200 dark:bg-gray-700/50 rounded-lg animate-pulse"></div>
        <div className="h-10 w-1/2 bg-gray-200 dark:bg-gray-700/50 rounded-lg animate-pulse"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-8 h-8 bg-blue-200 dark:bg-blue-800/30 rounded-full animate-bounce"></div>
      <div className="absolute top-40 right-20 w-6 h-6 bg-indigo-200 dark:bg-indigo-800/30 rounded-full animate-bounce delay-150"></div>
      <div className="absolute bottom-40 left-20 w-10 h-10 bg-cyan-200 dark:bg-cyan-800/30 rounded-full animate-bounce delay-300"></div>
    </section>
  )
}