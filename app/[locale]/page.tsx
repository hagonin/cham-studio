import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLocale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/getDictionary';
import { metadataFor } from '@/lib/i18n/metadata';
import { StatusBar } from '@/components/StatusBar';
import { Hero } from '@/components/Hero';
import { Situations } from '@/components/Situations';
import { ServiceList } from '@/components/ServiceList';
import { Estimator } from '@/components/Estimator';
import { ContactLine } from '@/components/ContactLine';
import { ContactBlock } from '@/components/ContactBlock';
import styles from './page.module.css';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return {
    ...metadataFor(locale, '', dict.meta),
    openGraph: {
      type: 'website',
      locale: locale === 'fr' ? 'fr_FR' : 'en_GB',
      title: dict.meta.title,
      description: dict.meta.description,
      siteName: 'Chạm Studio',
    },
  };
}

/**
 * L'offre est à la racine. Un site de deux pages n'a pas à mettre sa page qui
 * rapporte derrière un clic : chaque visite entrante et chaque lien retour
 * arrivent directement dessus.
 *
 * Ordre : barre d'état → hero → situations → prestations → estimateur →
 * approche → contact. L'estimateur suit les cartes parce qu'il en dérive :
 * ses planchers et les leurs sortent du même `BASE`.
 */
export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <main className={styles.page}>
      <StatusBar locale={locale} dict={dict} />
      <Hero dict={dict} />
      <Situations dict={dict} />
      <ServiceList locale={locale} dict={dict} />
      <Estimator locale={locale} dict={dict} />
      <ContactLine dict={dict} />
      <ContactBlock dict={dict} locale={locale} />
    </main>
  );
}
