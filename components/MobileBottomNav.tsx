'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { Home, Package, BookOpen, PlayCircle, Trophy } from 'lucide-react';

interface MobileBottomNavProps {
  lang?: string;
}

const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ lang = 'es' }) => {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const navItems = [
    { 
      label: 'Inicio', 
      path: `/${lang}`, 
      icon: Home 
    },
    { 
      label: 'Casos Reales', 
      path: `/${lang}/casos`, 
      icon: Trophy 
    },
    { 
      label: 'Empezar', 
      path: `/${lang}/contacto`, 
      icon: Home, // No se usa porque isPrimary usa pegaso-rojo.svg
      isPrimary: true 
    },
    { 
      label: 'Blog', 
      path: `/${lang}/blog`, 
      icon: BookOpen 
    },
    { 
      label: 'Demos', 
      path: `/${lang}/demos`, 
      icon: PlayCircle 
    }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 z-50 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <div className="flex justify-around items-end h-16 pb-2 px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          if (item.isPrimary) {
            return (
              <Link 
                key={item.path}
                href={item.path}
                className="relative -top-5 group"
              >
                <div className="bg-puka-red text-white p-4 rounded-full shadow-lg shadow-puka-red/40 transform transition-transform group-active:scale-95 border-4 border-white">
                  <div className="relative w-6 h-6">
                    <Image 
                      src="/pegaso-rojo.svg" 
                      fill
                      className="object-contain invert brightness-0 contrast-200"
                      alt="Pegaso"
                    />
                  </div>
                </div>
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-puka-red whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex flex-col items-center justify-center w-16 py-1 transition-colors duration-200 ${
                active ? 'text-puka-red' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Icon 
                size={22} 
                strokeWidth={active ? 2.5 : 2} 
                className={`mb-1 transition-transform ${active ? '-translate-y-0.5' : ''}`}
              />
              <span className={`text-[10px] font-medium leading-none ${active ? 'font-bold' : ''}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileBottomNav;