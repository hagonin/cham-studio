'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Matter from 'matter-js';
import { colors } from '@/lib/tokens';
import styles from './TouchPhilosophy.module.css';

type Glyph = {
  body: Matter.Body;
  char: string;
  homeX: number;
  homeY: number;
  color: string;
  hidden: boolean;
  fadeStartedAt: number;
};

type SceneMode = 'assembled' | 'falling' | 'reassembling';

// Le canevas ne lit pas les variables CSS : ses couleurs viennent du miroir TS,
// que tests/tokens.test.ts garde égal à la feuille de style.
const INK = colors.ink;
const PAPER = colors.paper;
const MUTED = colors.muted;
const RELEASE_AT = 0.12;
const CURTAIN_AT = 0.78;

export function TouchPhilosophy({
  label,
  hint,
  lines,
}: {
  label: string;
  hint: string;
  lines: string[];
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  const [enhanced, setEnhanced] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    const curtain = curtainRef.current;
    if (
      !section ||
      !canvas ||
      !curtain ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    )
      return;

    const context = canvas.getContext('2d');
    if (!context) return;

    gsap.registerPlugin(ScrollTrigger);
    setEnhanced(true);

    let disposed = false;
    let frame: number | null = null;
    let lastTime = performance.now();
    let cssWidth = 0;
    let cssHeight = 0;
    let fontSize = 0;
    let fontFamily = '';
    let mode: SceneMode = 'assembled';
    let glyphs: Glyph[] = [];
    let walls: Matter.Body[] = [];

    const engine = Matter.Engine.create({
      positionIterations: 8,
      velocityIterations: 6,
    });
    engine.gravity.y = 3;

    const clearScene = () => {
      Matter.Composite.clear(engine.world, false, true);
      glyphs = [];
      walls = [];
    };

    const assembleImmediately = () => {
      mode = 'assembled';
      for (const glyph of glyphs) {
        glyph.hidden = false;
        glyph.fadeStartedAt = 0;
        glyph.body.collisionFilter.mask = 0xffffffff;
        Matter.Body.setStatic(glyph.body, true);
        Matter.Body.setPosition(glyph.body, { x: glyph.homeX, y: glyph.homeY });
        Matter.Body.setAngle(glyph.body, 0);
        Matter.Body.setVelocity(glyph.body, { x: 0, y: 0 });
        Matter.Body.setAngularVelocity(glyph.body, 0);
      }
    };

    const beginReassembly = () => {
      if (mode === 'assembled' || mode === 'reassembling') return;
      mode = 'reassembling';
      for (const glyph of glyphs) {
        glyph.hidden = false;
        glyph.fadeStartedAt = 0;
        glyph.body.collisionFilter.mask = 0xffffffff;
        Matter.Body.setStatic(glyph.body, true);
        Matter.Body.setVelocity(glyph.body, { x: 0, y: 0 });
        Matter.Body.setAngularVelocity(glyph.body, 0);
      }
    };

    const release = () => {
      if (mode === 'falling') return;
      mode = 'falling';
      for (const glyph of glyphs) {
        if (glyph.hidden) continue;
        Matter.Body.setStatic(glyph.body, false);
        Matter.Body.applyForce(glyph.body, glyph.body.position, {
          x: (Math.random() - 0.5) * 0.02,
          y: Math.random() * 0.003,
        });
      }
    };

    const layout = () => {
      const wasFalling = mode === 'falling';
      clearScene();

      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      cssWidth = Math.max(1, rect.width);
      cssHeight = Math.max(1, rect.height);
      canvas.width = Math.round(cssWidth * ratio);
      canvas.height = Math.round(cssHeight * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);

      const padding = cssWidth < 700 ? 24 : Math.max(40, cssWidth * 0.055);
      const available = cssWidth - padding * 2;
      fontFamily = getComputedStyle(canvas).fontFamily;
      context.font = `800 100px ${fontFamily}`;
      const longest = Math.max(...lines.map((line) => context.measureText(line).width));
      fontSize = Math.min(cssWidth < 700 ? 72 : 150, (available / longest) * 100);
      context.font = `800 ${fontSize}px ${fontFamily}`;
      context.textBaseline = 'middle';

      const top = cssHeight < 760 ? 142 : Math.max(170, cssHeight * 0.24);
      const lineHeight = fontSize * 0.88;

      lines.forEach((line, lineIndex) => {
        const widths = [...line].map((char) => context.measureText(char).width);
        const naturalWidth = widths.reduce((sum, width) => sum + width, 0);
        const tracking = Math.max(
          -fontSize * 0.055,
          (available - naturalWidth) / Math.max(1, line.length - 1),
        );
        const lineWidth = naturalWidth + tracking * Math.max(0, line.length - 1);
        let cursor = padding + Math.max(0, (available - lineWidth) * 0.02);
        const color = lineIndex === 0 || lineIndex >= lines.length - 2 ? PAPER : MUTED;

        [...line].forEach((char, charIndex) => {
          const width = widths[charIndex];
          if (char !== ' ') {
            const homeX = cursor + width / 2;
            const homeY = top + lineIndex * lineHeight;
            const body = Matter.Bodies.rectangle(
              homeX,
              homeY,
              Math.max(2, width - fontSize * 0.045),
              fontSize * 0.72,
              {
                isStatic: true,
                restitution: 0.1,
                friction: 0.01,
                frictionAir: 0.01,
                density: 0.0005,
                render: { visible: false },
              },
            );
            glyphs.push({
              body,
              char,
              homeX,
              homeY,
              color,
              hidden: false,
              fadeStartedAt: 0,
            });
            Matter.Composite.add(engine.world, body);
          }
          cursor += width + tracking;
        });
      });

      const wallThickness = 40;
      walls = [
        Matter.Bodies.rectangle(
          cssWidth / 2,
          cssHeight + wallThickness / 2,
          cssWidth * 2,
          wallThickness,
          { isStatic: true, restitution: 0, friction: 1, render: { visible: false } },
        ),
        Matter.Bodies.rectangle(
          -wallThickness / 2,
          cssHeight / 2,
          wallThickness,
          cssHeight * 2,
          { isStatic: true, render: { visible: false } },
        ),
        Matter.Bodies.rectangle(
          cssWidth + wallThickness / 2,
          cssHeight / 2,
          wallThickness,
          cssHeight * 2,
          { isStatic: true, render: { visible: false } },
        ),
      ];
      Matter.Composite.add(engine.world, walls);

      mode = 'assembled';
      if (wasFalling) release();
    };

    const draw = (now: number) => {
      const delta = Math.min(25, Math.max(1, now - lastTime));
      lastTime = now;

      if (mode === 'falling') Matter.Engine.update(engine, delta);
      if (mode === 'reassembling') {
        let settled = true;
        for (const glyph of glyphs) {
          const { body } = glyph;
          const x = body.position.x + (glyph.homeX - body.position.x) * 0.18;
          const y = body.position.y + (glyph.homeY - body.position.y) * 0.18;
          const angle = body.angle + (0 - body.angle) * 0.18;
          Matter.Body.setPosition(body, { x, y });
          Matter.Body.setAngle(body, angle);
          if (
            Math.abs(x - glyph.homeX) > 0.3 ||
            Math.abs(y - glyph.homeY) > 0.3 ||
            Math.abs(angle) > 0.005
          )
            settled = false;
        }
        if (settled) assembleImmediately();
      }

      context.fillStyle = INK;
      context.fillRect(0, 0, cssWidth, cssHeight);
      context.font = `800 ${fontSize}px ${fontFamily}`;
      context.textAlign = 'center';
      context.textBaseline = 'middle';

      for (const glyph of glyphs) {
        const opacity = glyph.hidden
          ? Math.max(0, 1 - (now - glyph.fadeStartedAt) / 150)
          : 1;
        if (opacity <= 0) continue;
        context.save();
        context.globalAlpha = opacity;
        context.translate(glyph.body.position.x, glyph.body.position.y);
        context.rotate(glyph.body.angle);
        context.fillStyle = glyph.color;
        context.fillText(glyph.char, 0, 0);
        context.restore();
      }

      if (!disposed) frame = requestAnimationFrame(draw);
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const pointer = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
      const now = performance.now();

      for (const glyph of glyphs) {
        if (glyph.hidden) continue;
        const dx = glyph.body.position.x - pointer.x;
        const dy = glyph.body.position.y - pointer.y;
        const distance = Math.hypot(dx, dy) || 1;
        if (distance > 70) continue;
        glyph.hidden = true;
        glyph.fadeStartedAt = now;
        glyph.body.collisionFilter.mask = 0;
        Matter.Body.setStatic(glyph.body, true);
        Matter.Body.setVelocity(glyph.body, { x: 0, y: 0 });
        Matter.Body.setAngularVelocity(glyph.body, 0);
      }
    };

    layout();
    gsap.set(curtain, { yPercent: -100 });

    const physicsTrigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        if (
          self.direction > 0 &&
          self.progress >= RELEASE_AT &&
          self.progress < CURTAIN_AT
        )
          release();
        if (self.direction < 0 && self.progress <= RELEASE_AT) beginReassembly();
      },
      onLeaveBack: assembleImmediately,
    });

    const curtainTween = gsap.to(curtain, {
      yPercent: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: '78% top',
        end: 'bottom bottom',
        scrub: true,
      },
    });

    if (physicsTrigger.progress >= RELEASE_AT && physicsTrigger.progress < CURTAIN_AT)
      release();

    frame = requestAnimationFrame(draw);
    canvas.addEventListener('pointermove', onPointerMove);
    window.addEventListener('resize', layout);
    ScrollTrigger.refresh();

    return () => {
      disposed = true;
      canvas.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', layout);
      physicsTrigger.kill();
      curtainTween.scrollTrigger?.kill();
      curtainTween.kill();
      if (frame !== null) cancelAnimationFrame(frame);
      clearScene();
      Matter.Engine.clear(engine);
    };
  }, [lines]);

  return (
    <section
      id="touch"
      ref={sectionRef}
      className={styles.section}
      data-enhanced={enhanced ? 'true' : 'false'}
      aria-labelledby="touch-philosophy-title"
    >
      <div className={styles.stage}>
        <div className={styles.meta} aria-hidden="true">
          <span>02 / 05</span>
          <span>{label}</span>
          <span>CHẠM / TOUCH</span>
        </div>
        <h2
          id="touch-philosophy-title"
          className={styles.staticText}
          aria-label={lines.join(' ')}
        >
          {lines.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h2>
        <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
        <p className={styles.hint} aria-hidden="true">
          {hint}
        </p>
        <div ref={curtainRef} className={styles.curtain} aria-hidden="true" />
      </div>
    </section>
  );
}
