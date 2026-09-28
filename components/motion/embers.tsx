"use client";

import { useEffect, useRef } from "react";
import { useReducedMotionSafe } from "./use-reduced-motion-safe";

interface Ember {
  x: number;
  y: number;
  r: number;
  speed: number;
  drift: number;
  alpha: number;
  hue: number;
}

/**
 * Drifting ember particles (canvas) — flame-kissed warmth rising through the hero.
 * Pauses off-screen; disabled entirely with prefers-reduced-motion.
 */
export function Embers({ count = 36 }: { count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotionSafe();

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let embers: Ember[] = [];
    const resize = () => {
      canvas.width = canvas.offsetWidth * devicePixelRatio;
      canvas.height = canvas.offsetHeight * devicePixelRatio;
    };
    resize();
    window.addEventListener("resize", resize);

    const spawn = (randomY = false): Ember => ({
      x: Math.random() * canvas.width,
      y: randomY ? Math.random() * canvas.height : canvas.height + 10,
      r: 1 + Math.random() * 3,
      speed: 0.4 + Math.random() * 1.2,
      drift: (Math.random() - 0.5) * 0.6,
      alpha: 0.4 + Math.random() * 0.6,
      hue: 20 + Math.random() * 25, // burnt→honey range
    });
    embers = Array.from({ length: count }, () => spawn(true));

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < embers.length; i++) {
        const e = embers[i];
        e.y -= e.speed * devicePixelRatio;
        e.x += e.drift * devicePixelRatio;
        e.alpha -= 0.0015;
        if (e.y < -10 || e.alpha <= 0) embers[i] = spawn();
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.r * devicePixelRatio, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${e.hue}, 100%, 60%, ${Math.max(e.alpha, 0)})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [count, reduced]);

  if (reduced) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
