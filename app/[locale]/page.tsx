import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLocale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/getDictionary';
import { metadataFor } from '@/lib/i18n/metadata';
import { SectionNav } from '@/components/SectionNav';
import { MOUNTED_SECTIONS } from '@/lib/sections';
import { Hero } from '@/components/Hero';
import { TouchPhilosophy } from '@/components/TouchPhilosophy';
import { AboutBlock } from '@/components/AboutBlock';
import { Process } from '@/components/Process';
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
 * Ordre de lecture, celui du dessin : nav → hero → scène tactile → à propos →
 * travaux → prestations → contact. La personne vient avant la preuve ; l'ancien
 * ordre (preuve, offre, méthode, personne en dernier) est abandonné, parce que
 * le dessin le contredit. Cet ordre vit à deux endroits qui bougent ensemble :
 * ce JSX et `SECTION_KEYS` dans `lib/sections.ts`, d'où la nav tire le sien.
 *
 * Le bloc « situations » a été retiré : aucune planche du canvas ne le dessine,
 * et il ouvrait la page sur des questions au lieu de la preuve.
 *
 * Les travaux s'insèrent quand leur contenu existe — `workSectionIsReady()`, la
 * même condition qui décide de l'ancre dans `lib/sections.ts`. Aucune section vide
 * en attendant : elle ne paraît qu'à partir de deux projets, et les trois projets
 * actuels la montent.
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
        <Hero dict={dict} locale={locale} />
        <TouchPhilosophy {...dict.home.touchPhilosophy} />
        <AboutBlock dict={dict} locale={locale} />
        {workSectionIsReady() && <WorkSection locale={locale} dict={dict} />}
        {/* Un seul bloc de prestations : les trois disciplines du dessin, rendues
            par `Process` sous `#services-title`. `ServiceList` n'est PAS monté,
            et l'estimateur non plus (décision 8) : une fourchette calculée est un
            chiffre, et la décision 7 n'en publie aucun. Les composants, leurs
            données (`content/services.ts`) et leurs tests restent au dépôt — du
            travail testé qui vaut comme preuve de métier, pas comme section de
            page. Les monter à côté de `Process` dupliquerait `services-title`. */}
        <Process dict={dict} />
        <ContactBlock dict={dict} locale={locale} />
      </main>
    </>
  );
}
