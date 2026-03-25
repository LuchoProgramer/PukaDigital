'use client';

// ConditionalShell — envuelve el contenido del root layout.
// Oculta Navbar, Footer, MobileBottomNav y SmartChatbot en rutas de landing
// que tienen su propio navbar/footer embebido (ej. /ledgerxpertz).
//
// Para agregar una nueva landing independiente, añadir su ruta a STANDALONE_ROUTES.

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MobileBottomNav from '@/components/MobileBottomNav';
import SmartChatbot from '@/components/SmartChatbot';

const STANDALONE_ROUTES = [
  '/ledgerxpertz',
  '/pukahealth',
];

export default function ConditionalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isStandalone = STANDALONE_ROUTES.some((route) => pathname.startsWith(route));

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300 pb-20 md:pb-0">
      {!isStandalone && <Navbar />}
      <main className="flex-grow">
        {children}
      </main>
      {!isStandalone && <Footer />}
      {!isStandalone && <MobileBottomNav />}
      {!isStandalone && <SmartChatbot />}
    </div>
  );
}
