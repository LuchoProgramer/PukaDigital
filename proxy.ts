import { NextRequest, NextResponse } from 'next/server';
import { i18n } from './i18n.config';
import { redireccionWww, conCabeceras } from './lib/borde';

function getLocale(request: NextRequest): string {
  // 1. Verificar si hay idioma en la URL
  const pathname = request.nextUrl.pathname;
  const pathnameLocale = i18n.locales.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  
  if (pathnameLocale) return pathnameLocale;
  
  // 2. Verificar cookie de preferencia
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  if (cookieLocale && i18n.locales.includes(cookieLocale as any)) {
    return cookieLocale;
  }
  
  // 3. Verificar Accept-Language header
  const acceptLanguage = request.headers.get('Accept-Language');
  if (acceptLanguage) {
    const browserLocale = acceptLanguage.split(',')[0].split('-')[0];
    if (i18n.locales.includes(browserLocale as any)) {
      return browserLocale;
    }
  }
  
  // 4. Default a español
  return i18n.defaultLocale;
}

export function proxy(request: NextRequest) {
  const destinoWww = redireccionWww(request.nextUrl);
  if (destinoWww) {
    return conCabeceras(NextResponse.redirect(destinoWww, 301));
  }

  const pathname = request.nextUrl.pathname;

  // Redirecciones 301 para URLs legacy/inglés detectadas en GA4
  if (pathname === '/about-us' || pathname === '/about') {
    return conCabeceras(NextResponse.redirect(new URL('/nosotros', request.url), 301));
  }
  if (pathname === '/contact' || pathname === '/contact-us') {
    return conCabeceras(NextResponse.redirect(new URL('/contacto', request.url), 301));
  }

  return conCabeceras(NextResponse.next());
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next|api|favicon.ico|.*\\..*).*)',
  ],
};
