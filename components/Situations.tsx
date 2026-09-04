import type { Dictionary } from '@/lib/i18n/getDictionary';
import styles from './Situations.module.css';

/**
 * La seule navigation interne de la page : chaque situation mène à la
 * prestation qui y répond. Les services sont nommés par le problème du client,
 * pas par la technologie — c'est ce bloc qui rend ce choix lisible.
 *
 * L'ancre est un lien réel, donc elle fonctionne sans JavaScript ; l'ouverture
 * de l'accordéon à l'arrivée est un supplément, pas la condition.
 */
export function Situations({ dict }: { dict: Dictionary }) {
  const { situations } = dict.home;

  return (
    <section data-reveal className={styles.block} aria-labelledby="situations-title">
      <h2 id="situations-title" className={styles.title}>
        {situations.title}
      </h2>
      <ul className={styles.list}>
        {situations.items.map((item) => (
          <li key={item.service}>
            <a className="contact-link" href={`#service-${item.service}`}>
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
