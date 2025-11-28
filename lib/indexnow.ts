// lib/indexnow.ts
// Utility for submitting URLs to IndexNow (Bing, Yandex, etc.)

const INDEXNOW_ENDPOINT = '/api/indexnow';

export interface IndexNowResponse {
  ok: boolean;
  message?: string;
  error?: string;
  status: number;
  urlsSubmitted?: number;
}

/**
 * Submit URLs to IndexNow for faster indexing
 * Use after publishing new content or updating important pages
 */
export async function submitToIndexNow(urls: string[]): Promise<IndexNowResponse> {
  try {
    const response = await fetch(INDEXNOW_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ urls }),
    });

    return await response.json();
  } catch (error) {
    return {
      ok: false,
      error: String(error),
      status: 500,
    };
  }
}

/**
 * Get all important URLs for the site
 * Call this after deploy to index all main pages
 */
export function getMainSiteUrls(): string[] {
  const baseUrl = 'https://pukadigital.com';
  const locales = ['es', 'en', 'pt'];
  
  const pages = [
    '', // homepage
    '/productos',
    '/blog',
    '/demos',
    '/contacto',
    '/nosotros',
    '/preguntas-frecuentes',
    '/chatbot-ia-whatsapp',
    '/desarrollo-web-pymes',
    '/sistema-erp-cloud',
  ];

  const urls: string[] = [];
  
  for (const locale of locales) {
    for (const page of pages) {
      urls.push(`${baseUrl}/${locale}${page}`);
    }
  }

  return urls;
}

/**
 * Submit all main site URLs to IndexNow
 * Useful after major updates or initial setup
 */
export async function submitAllMainUrls(): Promise<IndexNowResponse> {
  const urls = getMainSiteUrls();
  return submitToIndexNow(urls);
}
