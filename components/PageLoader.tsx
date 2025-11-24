'use client';

import React from 'react';
import { Rocket } from 'lucide-react';

const PageLoader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full py-20 animate-in fade-in duration-300">
      <div className="relative">
        <div className="absolute inset-0 bg-puka-red/20 rounded-full animate-ping"></div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-full shadow-lg relative z-10">
          <Rocket className="text-puka-red animate-pulse" size={32} />
        </div>
      </div>
      <p className="mt-4 text-sm font-bold text-gray-400 uppercase tracking-widest animate-pulse">
        Cargando...
      </p>
    </div>
  );
};

export default PageLoader;