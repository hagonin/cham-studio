import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import { locales, isLocale, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/getDictionary';
import { metadataFor } from '@/lib/i18n/metadata';
import { fontVariables } from '@/lib/fonts';
import { MotionProvider } from '@/components/MotionProvider';
import { Loader } from '@/components/Loader';
import { loaderGateScript } from '@/lib/motion/loader-gate';
import { Clock } from '@/components/Clock';
// Feuille de Lenis, livrée par le paquet. Sans elle, `html.lenis` n'a pas sa
// règle `height: auto` et les gardes `data-lenis-prevent` sont inertes : le
// défilement lissé se comporte alors de façon imprévisible selon la page.
import 'lenis/dist/lenis.css';
import '../globals.css';
import styles from './layout.module.css';

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
      {/* `#top` : l'ancre du lien « haut de page » du pied de page, comme le <body id="top"> du dessin. */}
      <body id="top">
        {/* Doit décider AVANT la première peinture si le rideau se joue : en
            `beforeInteractive`, Next.js l'injecte dans le HTML initial, avant
            tout JS de page. Voir `loaderGateScript()`. */}
        <Script id="loader-gate" strategy="beforeInteractive">
          {loaderGateScript()}
        </Script>
        <a className="skip-link contact-link" href="#content">
          {dict.nav.skipToContent}
        </a>
        <div id="content">{children}</div>
        {/* Aucun des deux ne rend le contenu du hero : ils décident comment
            le HTML déjà servi arrive, ou ajoutent un rideau par-dessus.
            Montés après lui, donc jamais sur son chemin. */}
        <MotionProvider />
        <Loader dict={dict} />
        <footer className={styles.footer}>
          <div className={styles.row}>
            <span>{dict.footer.location}</span>
            <Clock locale={locale} label={dict.home.status.clockLabel} />
          </div>
        </footer>
      </body>
    </html>
  );
}
