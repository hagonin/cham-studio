import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { locales, isLocale, type Locale } from '@/lib/i18n';
import '../globals.css';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  metadataBase: new URL('https://cham-studio.fr'),
  title: 'Chạm Studio',
  description: 'Design et développement de produits numériques — Montpellier.',
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // le segment vient de l'URL : on le valide contre la liste blanche
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <html lang={locale satisfies Locale}>
      <body>{children}</body>
    </html>
  );
}
