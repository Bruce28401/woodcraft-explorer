import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { defaultLocale, locales } from '@/app/i18n/settings';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
    return NextResponse.redirect(
      new URL(
        `/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`,
        request.url
      )
    );
  }
}

export const config = {
  matcher: ['/((?!_next).*)'],
};

function getLocale(request: NextRequest) {
  const acceptLanguage = request.headers.get('accept-language') || '';
  const supportedLocales = locales;
  const detectedLocale = acceptLanguage
    .split(',')
    .map((locale) => locale.split('-')[0])
    .find((locale) => supportedLocales.includes(locale));
  return detectedLocale || defaultLocale;
}
