"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface Particle {
  x: number;
  y: number;
  color: string;
  velocity: { x: number; y: number };
  alpha: number;
  lifetime: number;
  size: number;
}

interface Firework {
  x: number;
  y: number;
  color: string;
  velocity: { x: number; y: number };
  particles: Particle[];
  exploded: boolean;
  timeToExplode: number;
}

export function FireworksBackground({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fireworksRef = useRef<Firework[]>([]);
  const animationFrameRef = useRef<number>(0);
  const lastFireworkTimeRef = useRef<number>(Date.now());

  const colors = [
    "#c9a227",
    "#d4b03a",
    "#94a3b8",
    "#0ea5e9",
    "#64748b",
    "#f59e0b",
    "#e2e8f0",
  ];

  const createFirework = (x?: number, y?: number, targetY?: number) => {
    const canvas = canvasRef.current;
    if (!canvas || canvas.width === 0 || canvas.height === 0) return;

    const startX = x ?? Math.random() * canvas.width;
    const startY = canvas.height;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const angle = (Math.random() * Math.PI) / 2 - Math.PI / 4;
    const velocity = 6 + Math.random() * 4;
    const target = targetY ?? canvas.height * (0.1 + Math.random() * 0.4);

    const firework: Firework = {
      x: startX,
      y: startY,
      color,
      velocity: {
        x: Math.sin(angle) * velocity,
        y: -Math.cos(angle) * velocity * 1.5,
      },
      particles: [],
      exploded: false,
      timeToExplode: target,
    };

    fireworksRef.current.push(firework);
  };

  const explodeFirework = (firework: Firework) => {
    const particleCount = 50 + Math.floor(Math.random() * 30);

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 4 + 1;

      firework.particles.push({
        x: firework.x,
        y: firework.y,
        color: firework.color,
        velocity: {
          x: Math.cos(angle) * velocity * (0.5 + Math.random()),
          y: Math.sin(angle) * velocity * (0.5 + Math.random()),
        },
        alpha: 1,
        lifetime: Math.random() * 25 + 25,
        size: Math.random() * 2.2 + 1.4,
      });
    }
  };

  const updateAndDraw = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx || canvas.width === 0 || canvas.height === 0) {
      animationFrameRef.current = requestAnimationFrame(updateAndDraw);
      return;
    }

    ctx.fillStyle = "rgba(15, 20, 25, 0.07)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const currentFireworks = fireworksRef.current;
    for (let i = 0; i < currentFireworks.length; i++) {
      const firework = currentFireworks[i];

      if (!firework.exploded) {
        firework.x += firework.velocity.x;
        firework.y += firework.velocity.y;
        firework.velocity.y += 0.1;

        ctx.beginPath();
        ctx.arc(firework.x, firework.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = firework.color;
        ctx.fill();

        if (
          firework.y <= firework.timeToExplode ||
          firework.velocity.y >= 0 ||
          firework.x < 0 ||
          firework.x > canvas.width
        ) {
          if (firework.y > 0 && firework.y < canvas.height) {
            explodeFirework(firework);
          }
          firework.exploded = true;
        }
      } else {
        for (let j = 0; j < firework.particles.length; j++) {
          const particle = firework.particles[j];

          particle.x += particle.velocity.x;
          particle.y += particle.velocity.y;
          particle.velocity.y += 0.04;
          particle.alpha -= 1 / particle.lifetime;

          if (particle.alpha <= 0.1) {
            firework.particles.splice(j, 1);
            j--;
            continue;
          }

          ctx.globalAlpha = particle.alpha;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fillStyle = particle.color;
          ctx.fill();
          ctx.globalAlpha = 1;
        }

        if (firework.particles.length === 0) {
          currentFireworks.splice(i, 1);
          i--;
        }
      }
    }

    const now = Date.now();
    if (now - lastFireworkTimeRef.current > 1200 + Math.random() * 2500) {
      createFirework();
      lastFireworkTimeRef.current = now;
    }

    animationFrameRef.current = requestAnimationFrame(updateAndDraw);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    for (let i = 0; i < 2; i++) {
      setTimeout(() => createFirework(), i * 400);
    }
    lastFireworkTimeRef.current = Date.now();

    animationFrameRef.current = requestAnimationFrame(updateAndDraw);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener("resize", updateCanvasSize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={cn("relative w-full h-full overflow-hidden", className)}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  );
}
