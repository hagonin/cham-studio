import { gsap } from 'gsap';

/**
 * LA fabrique de révélations. Une seule configuration, réutilisée partout :
 * le mouvement arrive dans un projet parce qu'il est disponible, pas parce
 * qu'il est nécessaire, et des tweens sur mesure éparpillés dans les
 * composants sont la forme que prend cette dérive.
 *
 * Le geste est la coupe `contact` de la Phase 2 — deux bords qui se
 * rejoignent — exprimée en `clip-path`, la même que l'animation CSS.
 */

/** L'état AU REPOS est l'état FINAL. Rien ne stationne à `opacity: 0` en
 *  attendant un ScrollTrigger : un script qui échoue doit dégrader vers une
 *  page ordinaire, jamais vers une page blanche. On part donc de l'état voulu
 *  et on remonte à l'état de départ juste avant d'animer. */
const FROM = { clipPath: 'inset(0 0 100% 0)', opacity: 1 } as const;
const TO = { clipPath: 'inset(0 0 0% 0)', opacity: 1 } as const;

export function revealOnScroll(targets: Element[]): void {
  for (const [index, target] of targets.entries()) {
    gsap.fromTo(target, FROM, {
      ...TO,
      // Sans cela, GSAP écrit l'état de DÉPART dès la création du tween : une
      // section déjà à l'écran au chargement clignoterait vers le masqué avant
      // que son déclencheur ne se rattrape. L'état au repos doit rester l'état
      // final, y compris pendant la milliseconde qui suit l'hydratation.
      immediateRender: false,
      duration: 0.62,
      ease: 'power4.inOut',
      // Décalage minime : au-delà, la page se lit comme une file d'attente.
      delay: Math.min(index, 3) * 0.06,
      scrollTrigger: {
        trigger: target,
        // Déclenché haut : l'élément est déjà lisible quand il arrive.
        start: 'top 85%',
        once: true,
      },
    });
  }
}

/**
 * Les mots d'un titre montent de leur masque, un à un (`about.js` et
 * `services.js` du prototype). Le titre est rendu par `MaskedLines`, dont chaque
 * mot est un `[data-mask]` contenant un `<span>` : c'est ce `<span>` qui monte,
 * le masque coupe.
 *
 * `from` : le tween écrit l'état caché à la création, comme le dessin. À appeler
 * seulement sous `prefers-reduced-motion: no-preference` (voir `AboutMotion`) :
 * en dehors, le titre reste tel que le HTML l'a livré.
 */
export function revealWords(heading: Element): void {
  gsap.from(heading.querySelectorAll('[data-mask] > span'), {
    yPercent: 118,
    duration: 0.9,
    ease: 'power3.out',
    stagger: 0.055,
    scrollTrigger: { trigger: heading, start: 'top 88%' },
  });
}

/**
 * Le reste entre doucement : les éléments `[data-quiet]` d'un bloc paraissent
 * par fondu et glissement, l'un après l'autre. Même règle : sous
 * reduced-motion, on n'appelle pas.
 */
export function revealQuiet(block: Element, start = 'top 82%'): void {
  const quiet = block.querySelectorAll('[data-quiet]');
  if (quiet.length === 0) return;
  gsap.from(quiet, {
    opacity: 0,
    y: 18,
    duration: 1,
    ease: 'power2.out',
    stagger: 0.12,
    scrollTrigger: { trigger: block, start },
  });
}

/**
 * Les lettres d'une `LetterLine` descendent de leur masque en SUIVANT le
 * défilement (`contact.js` du prototype, `animation-title` du site d'Olha
 * Lazarieva) : `scrub` lie le tween à la barre de défilement, donc remonter la
 * page le rejoue à l'envers et les lettres ressortent. Partagé par le titre
 * contact et la ligne « À propos » du hero : une seule configuration.
 *
 * Même règle que les autres : à n'appeler que sous
 * `prefers-reduced-motion: no-preference`.
 */
export function revealLettersOnScroll(line: Element): void {
  gsap.fromTo(
    line.querySelectorAll('[data-letter]'),
    { yPercent: -120 },
    {
      yPercent: 0,
      duration: 1,
      ease: 'power3.out',
      stagger: { each: 0.05, from: 'center' },
      scrollTrigger: {
        trigger: line,
        start: 'top 100%',
        end: 'bottom 30%',
        scrub: true,
      },
    },
  );
}
