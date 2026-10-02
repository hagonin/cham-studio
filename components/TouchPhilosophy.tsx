'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Matter from 'matter-js';
import { prefersReducedMotion } from '@/lib/motion/prefs';
import { colors } from '@/lib/tokens';
import styles from './TouchPhilosophy.module.css';

type Glyph = {
  body: Matter.Body;
  char: string;
  homeX: number;
  homeY: number;
  color: string;
};

type Mode = 'assembled' | 'falling' | 'reassembling';

// Une couleur par ligne, celles du dessin : deux lignes en retrait, deux
// claires, la dernière en accent. Le canevas ne lit pas les variables CSS : ses
// couleurs viennent du miroir TS, que tests/tokens.test.ts garde égal à la
// feuille de style.
const LINE_COLORS = [
  colors.dim,
  colors.dim,
  colors['paper-warm'],
  colors['paper-warm'],
  colors['touch-hot'],
];

/**
 * La scène tactile du dessin (`whole-page.js` du prototype), constante pour
 * constante : la phrase est posée en lettres Matter.js ; un défilement la
 * lâche, elle tombe, le pointeur repousse les lettres tant qu'elles tombent, et
 * elles se recomposent quand on remonte.
 *
 * Le texte est du texte RÉEL dans le HTML servi (le <h2>), lisible sans
 * JavaScript. Le canevas le recouvre une fois la scène montée, et le <h2> passe
 * alors hors écran (`data-enhanced` sur la section) : le texte d'abord,
 * l'amélioration ensuite.
 *
 * Sous reduced-motion rien ne se monte : la section reste une page, la phrase
 * en texte statique, sans canevas ni rideau.
 *
 * C'est la chose la plus coûteuse de la page. Le rendu s'arrête dès que la
 * scène n'est plus à l'écran, que l'onglet est caché, ou que rien ne bouge.
 */
export function TouchPhilosophy({
  meta,
  hint,
  lines,
}: {
  meta: string[];
  hint: string;
  lines: string[];
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    const curtain = curtainRef.current;
    if (!section || !stage || !canvas || !curtain || prefersReducedMotion()) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    const { Engine, Bodies, Body, Composite } = Matter;
    const engine = Engine.create({ positionIterations: 8, velocityIterations: 6 });
    engine.gravity.y = 3;

    let glyphs: Glyph[] = [];
    let width = 0;
    let height = 0;
    let fontSize = 0;
    let mode: Mode = 'assembled';
    let lastTime = performance.now();
    let releaseTimer: ReturnType<typeof setTimeout> | undefined;
    // Lu par `buildScene`, créé plus bas : un objet plutôt qu'un `let` écrit une fois.
    const scene: { trigger?: ScrollTrigger } = {};
    let accumulator = 0;
    let visible = false;
    let frame = 0;
    let disposed = false;

    // La famille réellement chargée par `next/font`, lue sur le canevas : il ne
    // peut pas lire `var(--font-display-stack)`, et un nom écrit en dur
    // dériverait de `lib/fonts.ts`.
    const family = getComputedStyle(canvas).fontFamily;

    const clearScene = () => {
      Composite.clear(engine.world, false, true);
      glyphs = [];
    };

    const release = () => {
      if (mode === 'falling') return;
      mode = 'falling';
      for (const { body } of glyphs) {
        Body.setStatic(body, false);
        Body.applyForce(body, body.position, {
          x: (Math.random() - 0.5) * 0.02,
          y: Math.random() * 0.003,
        });
      }
    };

    const reassemble = () => {
      clearTimeout(releaseTimer);
      if (mode !== 'falling') return;
      mode = 'reassembling';
      for (const { body } of glyphs) {
        Body.setStatic(body, true);
        Body.setVelocity(body, { x: 0, y: 0 });
        Body.setAngularVelocity(body, 0);
      }
    };

    const reset = () => {
      clearTimeout(releaseTimer);
      accumulator = 0;
      mode = 'assembled';
      for (const { body, homeX, homeY } of glyphs) {
        if (!body.isStatic) Body.setStatic(body, true);
        Body.setPosition(body, { x: homeX, y: homeY });
        Body.setAngle(body, 0);
        Body.setVelocity(body, { x: 0, y: 0 });
        Body.setAngularVelocity(body, 0);
      }
    };

    const buildScene = () => {
      const shouldRelease = mode === 'falling';
      clearScene();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const rect = stage.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);

      const padding = width < 700 ? 24 : Math.max(48, width * 0.06);
      // Alignée à gauche avec un retrait, comme le site d'Olha Lazarieva
      // (décision du 2026-10-02) : au-delà de 1100px le texte part à 580/1920
      // de la largeur (~30 %) ; en dessous, au bord du rembourrage.
      const left = width > 1100 ? width * (580 / 1920) : padding;
      const available = width - left - padding;
      context.font = `700 100px ${family}`;
      const longest = Math.max(...lines.map((line) => context.measureText(line).width));
      fontSize = Math.min(width < 700 ? 68 : 118, (available / longest) * 100);
      context.font = `700 ${fontSize}px ${family}`;
      context.textBaseline = 'middle';
      context.textAlign = 'center';

      const lineHeight = fontSize * 0.95;
      const blockHeight = lineHeight * lines.length;
      const top = Math.max(145, height * 0.49 - blockHeight / 2);

      lines.forEach((line, lineIndex) => {
        const widths = [...line].map((char) => context.measureText(char).width);
        const tracking = -fontSize * 0.05;
        let cursor = left;

        [...line].forEach((char, charIndex) => {
          const charWidth = widths[charIndex];
          if (char !== ' ') {
            const x = cursor + charWidth / 2;
            const y = top + lineIndex * lineHeight;
            const body = Bodies.rectangle(
              x,
              y,
              Math.max(1, charWidth + tracking),
              fontSize * (150 / 170),
              {
                restitution: 0.1,
                friction: 0.01,
                frictionAir: 0.01,
                density: 0.0005,
                render: { visible: false },
              },
            );
            Body.setStatic(body, true);
            glyphs.push({
              body,
              char,
              homeX: x,
              homeY: y,
              color: LINE_COLORS[lineIndex] ?? colors['paper-warm'],
            });
            Composite.add(engine.world, body);
          }
          cursor += charWidth + tracking;
        });
      });

      const wall = 50;
      Composite.add(engine.world, [
        Bodies.rectangle(width / 2, height + wall / 2, width * 2, wall, {
          isStatic: true,
          restitution: 0,
          friction: 1,
          frictionStatic: 1,
        }),
        Bodies.rectangle(-wall / 2, height / 2, wall, height * 2, { isStatic: true }),
        Bodies.rectangle(width + wall / 2, height / 2, wall, height * 2, {
          isStatic: true,
        }),
      ]);

      mode = 'assembled';
      if (shouldRelease || (scene.trigger && scene.trigger.progress > 0)) release();
    };

    // Le rendu s'arrête hors écran : c'est la garde qui rend la scène supportable.
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    observer.observe(stage);

    const render = (now: number) => {
      if (disposed) return;
      frame = requestAnimationFrame(render);
      if (!visible || document.hidden) {
        lastTime = now;
        return;
      }
      const delta = Math.min(25, Math.max(1, now - lastTime));
      lastTime = now;
      if (mode === 'falling') {
        accumulator += delta;
        while (accumulator >= 1000 / 60) {
          Engine.update(engine, 1000 / 60);
          accumulator -= 1000 / 60;
        }
      }

      if (mode === 'reassembling') {
        let complete = true;
        for (const { body, homeX, homeY } of glyphs) {
          const x = body.position.x + (homeX - body.position.x) * 0.18;
          const y = body.position.y + (homeY - body.position.y) * 0.18;
          const angle = body.angle * 0.82;
          Body.setPosition(body, { x, y });
          Body.setAngle(body, angle);
          if (
            Math.abs(x - homeX) > 0.3 ||
            Math.abs(y - homeY) > 0.3 ||
            Math.abs(angle) > 0.005
          )
            complete = false;
        }
        if (complete) reset();
      }

      context.fillStyle = colors.ink;
      context.fillRect(0, 0, width, height);
      context.font = `700 ${fontSize}px ${family}`;
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      for (const { body, char, color } of glyphs) {
        context.save();
        context.translate(body.position.x, body.position.y);
        context.rotate(body.angle);
        context.fillStyle = color;
        context.fillText(char, 0, 0);
        context.restore();
      }
    };

    // Le pointeur repousse les lettres, et seulement tant qu'elles tombent : une
    // phrase posée ne se laisse pas pousser.
    const repel = (event: PointerEvent) => {
      if (mode !== 'falling') return;
      const rect = canvas.getBoundingClientRect();
      const x = ((event.clientX - rect.left) * width) / rect.width;
      const y = ((event.clientY - rect.top) * height) / rect.height;
      for (const { body } of glyphs) {
        const dx = body.position.x - x;
        const dy = body.position.y - y;
        const distance = Math.hypot(dx, dy) || 1;
        if (distance > 120) continue;
        const force = (width > 768 ? 0.4 : 0.05) * (1 - distance / 400);
        Body.applyForce(body, body.position, {
          x: (dx / distance) * force,
          y: (dy / distance) * force,
        });
      }
    };
    canvas.addEventListener('pointermove', repel);
    canvas.addEventListener('pointerdown', repel);

    gsap.registerPlugin(ScrollTrigger);
    // Posé directement sur le DOM, pas par un état React : la hauteur de la
    // section (350svh) doit être celle que ScrollTrigger mesure, tout de suite.
    section.dataset.enhanced = 'true';
    buildScene();
    gsap.set(curtain, { y: 0, yPercent: -100 });
    scene.trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top -50%',
      end: 'top -200%',
      onEnter() {
        reset();
        releaseTimer = setTimeout(release, 40);
      },
      onLeaveBack: reassemble,
    });
    const curtainTween = gsap.to(curtain, {
      yPercent: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top -150%',
        end: 'top -250%',
        scrub: true,
      },
    });
    window.addEventListener('resize', buildScene);
    // La police n'est pas là au premier passage : on recompose dès qu'elle l'est,
    // sous-ensemble vietnamien compris (le « Ạ » de la ligne 4).
    void Promise.all([
      document.fonts.load(`700 100px ${family}`, lines.join(' ')),
      document.fonts.ready,
    ]).then(() => {
      if (disposed) return;
      buildScene();
      ScrollTrigger.refresh();
    });
    frame = requestAnimationFrame(render);

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      clearTimeout(releaseTimer);
      observer.disconnect();
      canvas.removeEventListener('pointermove', repel);
      canvas.removeEventListener('pointerdown', repel);
      window.removeEventListener('resize', buildScene);
      scene.trigger?.kill();
      curtainTween.scrollTrigger?.kill();
      curtainTween.kill();
      clearScene();
      Engine.clear(engine);
      delete section.dataset.enhanced;
    };
  }, [lines]);

  const [number, label, cue] = meta;

  return (
    <section
      id="touch"
      ref={sectionRef}
      className={styles.section}
      aria-labelledby="touch-philosophy-title"
    >
      <div ref={stageRef} className={styles.stage}>
        <div className={styles.meta} aria-hidden="true">
          <span>{number}</span>
          <span>{label}</span>
          <span>{cue}</span>
        </div>
        <h2
          id="touch-philosophy-title"
          className={styles.copy}
          aria-label={lines.join(' ')}
        >
          {lines.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h2>
        <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
        <div className={styles.hint} aria-hidden="true">
          {hint}
        </div>
        <div ref={curtainRef} className={styles.curtain} aria-hidden="true" />
      </div>
    </section>
  );
}
