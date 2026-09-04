import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { locales, isLocale, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/getDictionary';
import { metadataFor } from '@/lib/i18n/metadata';
import { fontVariables } from '@/lib/fonts';
import { LangSwitch } from '@/components/LangSwitch';
import { MotionProvider } from '@/components/MotionProvider';
import { ContactCursor } from '@/components/ContactCursor';
import '../globals.css';

export function generateStaticParams() {
  // Les deux locales sont CONSTRUITES ; seules les locales publiées sont
  // indexables. La publication est une bascule, pas une branche de code.
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  return metadataFor(locale, '', dict.meta);
}

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
  const dict = getDictionary(locale);

  return (
    <html lang={locale satisfies Locale} className={fontVariables}>
      <body>
        <a className="skip-link contact-link" href="#content">
          {dict.nav.skipToContent}
        </a>
        <header>
          <LangSwitch current={locale} dict={dict} />
        </header>
        <div id="content">{children}</div>
        {/* Aucun des deux ne rend de contenu : ils décident comment le HTML
            déjà servi arrive. Montés après lui, donc jamais sur son chemin. */}
        <MotionProvider />
        <ContactCursor dict={dict} />
        <footer>
          <p>{dict.footer.location}</p>
        </footer>
      </body>
    </html>
  );
}
