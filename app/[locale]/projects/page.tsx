import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLocale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/getDictionary';
import { alternatesFor, robotsFor } from '@/lib/i18n/metadata';
import { workSectionIsReady } from '@/content/projects';
import { StatusBar } from '@/components/StatusBar';
import { ProjectList } from '@/components/ProjectList';
import { AboutBlock } from '@/components/AboutBlock';
/**
 * LE moment 3D du site, et le seul. Ici et pas sur `/[locale]` : la page qui
 * vend tient Lighthouse ≥ 95 sur mobile, ce que Three ne permet pas. Sur cette
 * page, la personne a déjà décidé de regarder du métier.
 */
import { Hero3DSlot } from '@/components/Hero3DSlot';
import { ContactBlock } from '@/components/ContactBlock';
import styles from '../page.module.css';

const PATH = 'projects';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const { meta } = dict.work;

  // Deux conditions pour être indexable : la locale est publiée ET la page a
  // son contenu principal. Une page « travaux » sans travaux n'a rien à faire
  // dans un index — elle serait jugée sur ce qui lui manque.
  const published = robotsFor(locale);
  const robots = workSectionIsReady() ? published : { index: false, follow: false };

  return {
    title: meta.title,
    description: meta.description,
    alternates: alternatesFor(locale, PATH),
    robots,
    openGraph: {
      type: 'website',
      locale: locale === 'fr' ? 'fr_FR' : 'en_GB',
      title: meta.title,
      description: meta.description,
      siteName: 'Chạm Studio',
    },
  };
}

/**
 * La seconde et dernière page de contenu. Son travail est de répondre à
 * « est-ce qu'elle sait faire ? » : les travaux d'abord, la personne ensuite.
 *
 * Le slug reste `projects` dans les deux locales (F7). C'est le seul endroit
 * où cette règle se lit un peu à l'étroit en français ; une table de
 * correspondance d'une seule entrée coûterait plus cher en dérive.
 *
 * Pas de route `/projects/[slug]` : sous trois projets réels, une route de
 * détail qui n'en contient qu'un se lit comme un site abandonné. Le type
 * `Project` est déjà taillé pour que l'ajout soit additif.
 */
export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const { work } = dict;

  return (
    <main className={styles.page}>
      <StatusBar locale={locale} dict={dict} />
      <header className={styles.header}>
        <h1 className={styles.heading}>{work.title}</h1>
        <p className={styles.lead}>{work.lead}</p>
      </header>
      <Hero3DSlot />
      {/* Sous deux projets réels, la section n'est pas rendue du tout (F4).
          Pas d'état vide : il occuperait la place de ce qui manque. */}
      {workSectionIsReady() ? <ProjectList locale={locale} dict={dict} /> : null}
      <AboutBlock dict={dict} />
      <ContactBlock dict={dict} locale={locale} />
    </main>
  );
}
