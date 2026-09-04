import { gsap } from 'gsap';

/**
 * PROBLÈME ──────●────── SOLUTION, scrubbé au défilement : les deux extrémités
 * voyagent l'une vers l'autre et le point prend `--seal` à l'instant du
 * contact. Le set-piece du site, et il n'arrive QU'UNE FOIS — répété par
 * projet ou par section, un énoncé devient un tic.
 *
 * Trois règles, dans l'ordre :
 * 1. L'animation ne révèle RIEN. Les deux libellés et la prose sont dans le
 *    DOM et visibles sans JavaScript ; on ne change que la façon dont les
 *    extrémités arrivent.
 * 2. L'état au repos est l'état JOINT. D'où `fromTo` et non `to` : l'état de
 *    départ n'est écrit qu'au moment d'animer, donc JS coupé, hydratation
 *    ratée ou reduced-motion rendent la ligne déjà touchée.
 * 3. Transformations uniquement ; le point est le seul élément qui change de
 *    couleur.
 */
export function scrubContactLine(line: HTMLElement): void {
  const ends = line.querySelectorAll<HTMLElement>('[data-contact-end]');
  const dot = line.querySelector<HTMLElement>('[data-contact-dot]');
  if (ends.length !== 2 || !dot) return;

  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: line,
      start: 'top 80%',
      end: 'center 55%',
      scrub: true,
    },
  });

  // Les extrémités partent écartées et se rejoignent. `xPercent` : une
  // transformation, donc pas de recalcul de mise en page par frame.
  timeline
    .fromTo(ends[0], { xPercent: -18 }, { xPercent: 0, ease: 'none', duration: 1 }, 0)
    .fromTo(ends[1], { xPercent: 18 }, { xPercent: 0, ease: 'none', duration: 1 }, 0)
    // Le point ne grossit qu'au dernier quart : c'est le contact, pas le trajet.
    .fromTo(dot, { scale: 0.4 }, { scale: 1, ease: 'none', duration: 0.25 }, 0.75);
}
