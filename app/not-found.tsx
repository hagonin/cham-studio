import Link from 'next/link';
import { fr } from '@/lib/i18n/dictionaries/fr';
import { localeHref } from '@/lib/i18n/config';
import './globals.css';

/**
 * Le not-found de l'export statique vit à la racine, hors du segment
 * `[locale]` : il n'a donc pas de locale à lire. Il est rendu en français,
 * la seule locale publiée, et sert de cible à `ErrorDocument 404`.
 */
export default function NotFound() {
  return (
    <html lang="fr">
      <body>
        <main>
          <h1>{fr.notFound.title}</h1>
          <p>{fr.notFound.body}</p>
          <Link className="contact-link" href={localeHref('fr')}>
            {fr.notFound.back}
          </Link>
        </main>
      </body>
    </html>
  );
}
