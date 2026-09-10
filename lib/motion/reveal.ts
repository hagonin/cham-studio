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
