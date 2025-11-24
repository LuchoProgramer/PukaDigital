import { NextRequest, NextResponse } from 'next/server';
import { i18n } from './i18n.config';

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
  const pathname = request.nextUrl.pathname;
  
  // Ignorar archivos estáticos y API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') // archivos con extensión
  ) {
    return NextResponse.next();
  }
  
  // Verificar si la URL ya tiene idioma
  const pathnameHasLocale = i18n.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  
  if (pathnameHasLocale) {
    return NextResponse.next();
  }
  
  // Redirigir a la URL con idioma
  const locale = getLocale(request);
  const newUrl = new URL(`/${locale}${pathname}`, request.url);
  
  const response = NextResponse.redirect(newUrl);
  // Guardar preferencia en cookie
  response.cookies.set('NEXT_LOCALE', locale, { maxAge: 31536000 }); // 1 año
  
  return response;
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next|api|favicon.ico|.*\\..*).*)',
  ],
};
