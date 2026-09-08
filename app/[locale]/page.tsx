import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLocale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/getDictionary';
import { metadataFor } from '@/lib/i18n/metadata';
import { SectionNav } from '@/components/SectionNav';
import { MOUNTED_SECTIONS } from '@/lib/sections';
import { StatusBar } from '@/components/StatusBar';
import { Hero } from '@/components/Hero';
import { AboutBlock } from '@/components/AboutBlock';
import { ServiceList } from '@/components/ServiceList';
import { Process } from '@/components/Process';
import { ContactLine } from '@/components/ContactLine';
import { ContactBlock } from '@/components/ContactBlock';
import { WorkSection } from '@/components/WorkSection';
import { workSectionIsReady } from '@/content/projects';
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
 * Ordre de lecture (décision 16) : nav → barre d'état → hero → travaux →
 * prestations → process → à propos → contact. La preuve d'abord, l'offre
 * ensuite, comment ça se passe, puis la personne en dernier : un client a
 * besoin de savoir ce qu'il peut confier et comment avant de savoir à qui.
 *
 * Le bloc « situations » a été retiré : aucune planche du canvas ne le dessine,
 * et il ouvrait la page sur des questions au lieu de la preuve.
 *
 * Les travaux s'insèrent quand leur contenu existe — `workSectionIsReady()`,
 * la même condition qui décide de l'ancre dans `lib/sections.ts`. Aucune
 * section vide en attendant : en production la liste est encore `[]`, donc
 * rien ne paraît ; sous `pnpm dev` la réserve la remplit et la mise en page
 * se juge sur pièce.
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
    <>
      {/* La nav est du chrome de site : hors de <main>, elle reste un repère de
          navigation. Elle n'est pas dans le layout pour autant — les études de
          cas de la phase 05 partageront ce layout et n'ont pas la même nav. */}
      <SectionNav locale={locale} dict={dict} sections={MOUNTED_SECTIONS} />
      <main className={styles.page}>
        <StatusBar locale={locale} dict={dict} />
        <Hero dict={dict} locale={locale} />
        {workSectionIsReady() && <WorkSection locale={locale} dict={dict} />}
        <ServiceList locale={locale} dict={dict} />
        {/* L'estimateur n'est PAS monté (décision 8) : une fourchette calculée
            est un chiffre, et la décision 7 n'en publie aucun. Le composant, le
            modèle et ses tests restent au dépôt — du travail testé qui vaut
            comme preuve de métier, pas comme section de page. */}
        <Process dict={dict} />
        <AboutBlock dict={dict} />
        <ContactLine dict={dict} />
        <ContactBlock dict={dict} locale={locale} />
      </main>
    </>
  );
}
