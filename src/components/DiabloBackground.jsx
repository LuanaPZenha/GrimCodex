import { useEffect, useRef } from 'react';

const EMBER_COUNT = 90;
const SPARK_COUNT = 18;

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function createEmber(width, height) {
  return {
    x: rand(0, width),
    y: rand(height * 0.55, height + 40),
    vx: rand(-0.35, 0.35),
    vy: rand(-1.4, -0.35),
    size: rand(0.6, 2.8),
    baseOpacity: rand(0.15, 0.75),
    flickerSpeed: rand(0.02, 0.07),
    flickerPhase: rand(0, Math.PI * 2),
    warm: Math.random() > 0.35,
  };
}

function createSpark(width, height) {
  return {
    x: rand(width * 0.2, width * 0.8),
    y: rand(height * 0.65, height),
    vx: rand(-0.6, 0.6),
    vy: rand(-2.2, -1.1),
    life: rand(40, 90),
    maxLife: 90,
    size: rand(1.2, 3.2),
  };
}

export default function DiabloBackground({ intensity = 'default' }) {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const rafRef = useRef(null);
  const reducedMotion = useRef(false);

  useEffect(() => {
    reducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion.current) return undefined;

    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;

    const emberMultiplier = intensity === 'subtle' ? 0.65 : 1;
    const embers = Array.from({ length: Math.floor(EMBER_COUNT * emberMultiplier) }, () =>
      createEmber(width, height)
    );
    const sparks = Array.from({ length: Math.floor(SPARK_COUNT * emberMultiplier) }, () =>
      createSpark(width, height)
    );

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    const onMove = (event) => {
      mouseRef.current = { x: event.clientX, y: event.clientY };
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      const { x: mx, y: my } = mouseRef.current;
      const influence = intensity === 'subtle' ? 100 : 140;

      embers.forEach((ember) => {
        const dx = ember.x - mx;
        const dy = ember.y - my;
        const dist = Math.hypot(dx, dy);

        if (dist < influence && dist > 0) {
          const force = (1 - dist / influence) * 0.08;
          ember.vx += (dx / dist) * force;
          ember.vy += (dy / dist) * force * 0.5;
        }

        ember.vx *= 0.985;
        ember.vy = ember.vy * 0.992 - 0.002;
        ember.x += ember.vx;
        ember.y += ember.vy;
        ember.flickerPhase += ember.flickerSpeed;

        if (ember.y < -10 || ember.x < -20 || ember.x > width + 20) {
          Object.assign(ember, createEmber(width, height));
          ember.y = height + rand(0, 30);
        }

        const flicker = 0.55 + Math.sin(ember.flickerPhase) * 0.45;
        const alpha = ember.baseOpacity * flicker;

        const gradient = ctx.createRadialGradient(
          ember.x,
          ember.y,
          0,
          ember.x,
          ember.y,
          ember.size * 3
        );

        if (ember.warm) {
          gradient.addColorStop(0, `rgba(251, 191, 36, ${alpha})`);
          gradient.addColorStop(0.4, `rgba(220, 38, 38, ${alpha * 0.7})`);
          gradient.addColorStop(1, 'rgba(127, 29, 29, 0)');
        } else {
          gradient.addColorStop(0, `rgba(248, 113, 113, ${alpha})`);
          gradient.addColorStop(1, 'rgba(69, 10, 10, 0)');
        }

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(ember.x, ember.y, ember.size * 2.5, 0, Math.PI * 2);
        ctx.fill();
      });

      sparks.forEach((spark, index) => {
        spark.life -= 1;
        spark.x += spark.vx;
        spark.y += spark.vy;
        spark.vy -= 0.015;

        if (spark.life <= 0) {
          sparks[index] = createSpark(width, height);
          return;
        }

        const alpha = (spark.life / spark.maxLife) * 0.9;
        ctx.fillStyle = `rgba(255, 220, 150, ${alpha})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(220, 38, 38, 0.8)';
        ctx.beginPath();
        ctx.arc(spark.x, spark.y, spark.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      rafRef.current = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMove);
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [intensity]);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-zinc-950"
      aria-hidden="true"
    >
      {/* Névoa infernal animada */}
      <div className="diablo-fog diablo-fog-a" />
      <div className="diablo-fog diablo-fog-b" />
      <div className="diablo-fog diablo-fog-c" />

      {/* Pulso de luz carmesim (lua de sangue) */}
      <div className="diablo-blood-pulse" />

      {/* Runas / círculo ritual */}
      <div className="diablo-rune-ring" />
      <div className="diablo-rune-ring diablo-rune-ring-reverse" />

      {/* Brasas e faíscas (canvas) */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      {/* Vinheta e profundidade */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(9,9,11,0.55)_55%,rgba(9,9,11,0.92)_100%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/40 via-transparent to-zinc-950/80" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(127,29,29,0.22)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_90%,rgba(120,53,15,0.14)_0%,transparent_45%)]" />
    </div>
  );
}
