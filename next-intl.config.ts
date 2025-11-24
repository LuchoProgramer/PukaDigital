import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { i18n } from './i18n.config';

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locale || !i18n.locales.includes(locale as any)) notFound();

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default
  };
});
