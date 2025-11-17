"use client";

import React from 'react';

const LoadingDots: React.FC = () => {
  return (
    <div className="flex justify-center items-center gap-2">
      <span className="sr-only">Cargando...</span>
      <div className="h-3 w-3 bg-gray-900 dark:bg-gray-100 rounded-full animate-[bounce_0.6s_infinite] [animation-delay:-0.36s] translate-y-0.5"></div>
      <div className="h-3 w-3 bg-gray-900 dark:bg-gray-100 rounded-full animate-[bounce_0.6s_infinite] [animation-delay:-0.18s] translate-y-0.5"></div>
      <div className="h-3 w-3 bg-gray-900 dark:bg-gray-100 rounded-full animate-[bounce_0.6s_infinite] translate-y-0.5"></div>
    </div>
  );
};

export default LoadingDots;
