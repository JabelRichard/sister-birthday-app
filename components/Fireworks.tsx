// components/Fireworks.tsx
"use client";

import { useEffect, useRef } from "react";

interface Rocket {
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetY: number;
  color: string;
  trail: Array<{ x: number; y: number; alpha: number }>;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  decay: number;
  color: string;
  size: number;
  trail: Array<{ x: number; y: number }>;
}

const FIREWORK_PALETTES = [
  "#ff4b8b", // Hot Rose
  "#f472b6", // Light Pink
  "#fb7185", // Rose
  "#ec4899", // Vibrant Pink
  "#fbcfe8", // Blush
  "#fbbf24", // Golden Amber
  "#c084fc", // Purple Glow
  "#38bdf8", // Sky Blue
  "#ffffff", // Shimmer White
];

export default function Fireworks() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let rockets: Rocket[] = [];
    let particles: Particle[] = [];
    let lastLaunchTime = 0;
    let nextLaunchDelay = 1000 + Math.random() * 1000;

    // --- Web Audio API Synthesizers ---
    const getAudioContext = (): AudioContext | null => {
      if (typeof window === "undefined") return null;
      if (!audioCtxRef.current) {
        const AudioContextClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioContextClass) {
          audioCtxRef.current = new AudioContextClass();
        }
      }
      if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }
      return audioCtxRef.current;
    };

    const playLaunchSound = () => {
      const actx = getAudioContext();
      if (!actx) return;

      try {
        const osc = actx.createOscillator();
        const gain = actx.createGain();
        const now = actx.currentTime;

        osc.type = "sine";
        osc.frequency.setValueAtTime(280, now);
        osc.frequency.exponentialRampToValueAtTime(850, now + 0.22);
        osc.frequency.exponentialRampToValueAtTime(550, now + 0.38);

        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.07, now + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.38);

        osc.connect(gain);
        gain.connect(actx.destination);

        osc.start(now);
        osc.stop(now + 0.4);
      } catch {
        // Silent fallback if autoplay is restricted
      }
    };

    const playExplosionSound = () => {
      const actx = getAudioContext();
      if (!actx) return;

      try {
        const now = actx.currentTime;
        const duration = 0.7;

        // 1. Crackle/Burst Noise
        const bufferSize = actx.sampleRate * duration;
        const buffer = actx.createBuffer(1, bufferSize, actx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }

        const noise = actx.createBufferSource();
        noise.buffer = buffer;

        const filter = actx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(750, now);
        filter.frequency.exponentialRampToValueAtTime(60, now + duration);

        const noiseGain = actx.createGain();
        noiseGain.gain.setValueAtTime(0.18, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(actx.destination);

        // 2. Low-end Sub Punch
        const subOsc = actx.createOscillator();
        const subGain = actx.createGain();

        subOsc.type = "sine";
        subOsc.frequency.setValueAtTime(130, now);
        subOsc.frequency.exponentialRampToValueAtTime(30, now + 0.3);

        subGain.gain.setValueAtTime(0.2, now);
        subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

        subOsc.connect(subGain);
        subGain.connect(actx.destination);

        noise.start(now);
        noise.stop(now + duration);
        subOsc.start(now);
        subOsc.stop(now + 0.3);
      } catch {
        // Silent fallback
      }
    };

    // --- Responsive Canvas Handling ---
    const handleResize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    // --- Explosion & Particle Generation ---
    const createExplosion = (x: number, y: number, color: string) => {
      playExplosionSound();

      const particleCount = 40 + Math.floor(Math.random() * 40); // 40-80 particles
      for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4.5 + 1.5;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          decay: Math.random() * 0.015 + 0.012,
          color,
          size: Math.random() * 2 + 1.5,
          trail: [],
        });
      }
    };

    const launchRocket = () => {
      playLaunchSound();

      const startX = window.innerWidth * (0.15 + Math.random() * 0.7);
      const targetY = window.innerHeight * (0.15 + Math.random() * 0.35);
      const color = FIREWORK_PALETTES[Math.floor(Math.random() * FIREWORK_PALETTES.length)];
      
      const vy = -(Math.random() * 3 + 10);
      const vx = (Math.random() - 0.5) * 2;

      rockets.push({
        x: startX,
        y: window.innerHeight,
        vx,
        vy,
        targetY,
        color,
        trail: [],
      });
    };

    // Launch the first firework
    launchRocket();

    // --- Animation Loop ---
    const loop = (timestamp: number) => {
      if (!ctx || !canvas) return;

      // Transparent clear keeps background colors and gradients visible
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (timestamp - lastLaunchTime > nextLaunchDelay) {
        launchRocket();
        lastLaunchTime = timestamp;
        nextLaunchDelay = 1000 + Math.random() * 1000;
      }

      // 1. Update & Render Rockets
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.x += r.vx;
        r.y += r.vy;
        r.vy += 0.08; // Gravity

        r.trail.push({ x: r.x, y: r.y, alpha: 1 });
        if (r.trail.length > 6) r.trail.shift();

        for (let j = 0; j < r.trail.length; j++) {
          const pt = r.trail[j];
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = r.color;
          ctx.globalAlpha = (j + 1) / r.trail.length;
          ctx.shadowBlur = 8;
          ctx.shadowColor = r.color;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(r.x, r.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 12;
        ctx.shadowColor = r.color;
        ctx.fill();

        if (r.vy >= -1.5 || r.y <= r.targetY) {
          createExplosion(r.x, r.y, r.color);
          rockets.splice(i, 1);
        }
      }

      // 2. Update & Render Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > 4) p.trail.shift();

        if (p.trail.length > 1) {
          ctx.beginPath();
          ctx.moveTo(p.trail[0].x, p.trail[0].y);
          for (let t = 1; t < p.trail.length; t++) {
            ctx.lineTo(p.trail[t].x, p.trail[t].y);
          }
          ctx.strokeStyle = p.color;
          ctx.lineWidth = p.size;
          ctx.globalAlpha = p.alpha * 0.6;
          ctx.shadowBlur = 6;
          ctx.shadowColor = p.color;
          ctx.stroke();
        }

        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.06;
        p.vx *= 0.98;
        p.vy *= 0.98;
        p.alpha -= p.decay;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fill();

        if (p.alpha <= 0) {
          particles.splice(i, 1);
        }
      }

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[1] pointer-events-none w-full h-full"
      style={{ background: "transparent" }}
    />
  );
}