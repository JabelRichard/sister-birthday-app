"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Firework = {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  speed: number;
  trail: { x: number; y: number }[];
};

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  decay: number;
  size: number;
  gravity: number;
  type: "spark" | "heart" | "confetti";
  rotation: number;
  rotationSpeed: number;
};

const FINAL_MESSAGE = "Happy Birthday, Sis! 🎂❤️";

function random(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function randomInt(min: number, max: number) {
  return Math.floor(random(min, max + 1));
}

export default function CelebrationPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const fireworksRef = useRef<Firework[]>([]);
  const particlesRef = useRef<Particle[]>([]);

  const lastTimeRef = useRef(0);
  const celebrationIdRef = useRef(0);

  const [nightStarted, setNightStarted] = useState(false);
  const [showFirstMessage, setShowFirstMessage] = useState(false);
  const [showBirthday, setShowBirthday] = useState(false);
  const [showFinalMessage, setShowFinalMessage] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [typedLetters, setTypedLetters] = useState(0);

  /* Reduced Motion Detection */
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const updateMotionPreference = () => {
      setReducedMotion(mediaQuery.matches);
    };

    updateMotionPreference();
    mediaQuery.addEventListener("change", updateMotionPreference);

    return () => {
      mediaQuery.removeEventListener("change", updateMotionPreference);
    };
  }, []);

  /* Canvas Sizing */
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    const context = canvas.getContext("2d");
    if (!context) return;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
  }, []);

  /* Launch Firework */
  const launchFirework = useCallback(
    (fromX?: number, targetX?: number, targetY?: number) => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      const x = fromX ?? random(width * 0.08, width * 0.92);
      const target = targetX ?? random(width * 0.1, width * 0.9);
      const targetHeight = targetY ?? random(height * 0.14, height * 0.52);

      fireworksRef.current.push({
        x,
        y: height + 10,
        targetX: target,
        targetY: targetHeight,
        speed: random(7, 11),
        trail: [],
      });
    },
    []
  );

  /* Firework Explosion */
  const explodeFirework = useCallback(
    (x: number, y: number, size: "small" | "medium" | "large" = "medium") => {
      const count = size === "small" ? 35 : size === "large" ? 90 : 60;

      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + random(-0.08, 0.08);
        const speed = size === "large" ? random(2.5, 6.5) : random(2, 5);

        particlesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          decay: random(0.012, 0.022),
          size: random(1, 2.8),
          gravity: random(0.025, 0.06),
          type: "spark",
          rotation: random(0, Math.PI),
          rotationSpeed: random(-0.08, 0.08),
        });
      }

      /* Core glow sparks */
      for (let i = 0; i < 6; i++) {
        particlesRef.current.push({
          x: x + random(-3, 3),
          y: y + random(-3, 3),
          vx: random(-1.2, 1.2),
          vy: random(-1.2, 1.2),
          alpha: 1,
          decay: random(0.02, 0.04),
          size: random(2, 3.5),
          gravity: 0.01,
          type: "spark",
          rotation: 0,
          rotationSpeed: 0,
        });
      }

      /* Subtle floating hearts */
      if (Math.random() > 0.4) {
        for (let i = 0; i < 2; i++) {
          particlesRef.current.push({
            x,
            y,
            vx: random(-2, 2),
            vy: random(-3, -1),
            alpha: 1,
            decay: random(0.008, 0.015),
            size: random(8, 12),
            gravity: 0.025,
            type: "heart",
            rotation: random(-0.3, 0.3),
            rotationSpeed: random(-0.02, 0.02),
          });
        }
      }

      /* Confetti flakes */
      if (size === "large") {
        for (let i = 0; i < 10; i++) {
          particlesRef.current.push({
            x,
            y,
            vx: random(-2.5, 2.5),
            vy: random(-3.5, 1),
            alpha: 1,
            decay: random(0.004, 0.008),
            size: random(4, 6),
            gravity: random(0.05, 0.08),
            type: "confetti",
            rotation: random(0, Math.PI),
            rotationSpeed: random(-0.1, 0.1),
          });
        }
      }
    },
    []
  );

  /* Draw Single Particle */
  const drawParticle = useCallback(
    (context: CanvasRenderingContext2D, particle: Particle) => {
      context.save();
      context.globalAlpha = Math.max(0, particle.alpha);
      context.translate(particle.x, particle.y);
      context.rotate(particle.rotation);

      if (particle.type === "spark") {
        context.beginPath();
        context.arc(0, 0, particle.size, 0, Math.PI * 2);
        context.fillStyle = "#ffe4bd";
        context.shadowBlur = 10;
        context.shadowColor = "#ffc77d";
        context.fill();
      }

      if (particle.type === "heart") {
        context.font = `${particle.size}px serif`;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.shadowBlur = 10;
        context.shadowColor = "#ff9e9e";
        context.fillStyle = "#ffb5b5";
        context.fillText("♥", 0, 0);
      }

      if (particle.type === "confetti") {
        context.fillStyle = "#f7d3a6";
        context.fillRect(
          -particle.size / 2,
          -particle.size / 2,
          particle.size,
          particle.size * 1.8
        );
      }

      context.restore();
    },
    []
  );

  /* Animation Engine */
  const startAnimation = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const animate = (time: number) => {
      const delta = Math.min(time - lastTimeRef.current, 40) / 16.67;
      lastTimeRef.current = time;

      const width = window.innerWidth;
      const height = window.innerHeight;

      context.fillStyle = "rgba(6, 6, 15, 0.22)";
      context.fillRect(0, 0, width, height);

      /* Rocket trails */
      const fireworks = fireworksRef.current;
      for (let i = fireworks.length - 1; i >= 0; i--) {
        const firework = fireworks[i];
        const dx = firework.targetX - firework.x;
        const dy = firework.targetY - firework.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 12) {
          const explosionSize =
            Math.random() > 0.72
              ? "large"
              : Math.random() > 0.45
              ? "medium"
              : "small";

          explodeFirework(firework.x, firework.y, explosionSize);
          fireworks.splice(i, 1);
          continue;
        }

        const angle = Math.atan2(dy, dx);
        firework.x += Math.cos(angle) * firework.speed * delta;
        firework.y += Math.sin(angle) * firework.speed * delta;

        firework.trail.push({ x: firework.x, y: firework.y });
        if (firework.trail.length > 7) firework.trail.shift();

        for (let t = 0; t < firework.trail.length; t++) {
          const point = firework.trail[t];
          const alpha = t / firework.trail.length;

          context.beginPath();
          context.arc(point.x, point.y, 1.2, 0, Math.PI * 2);
          context.globalAlpha = alpha;
          context.fillStyle = "#ffe2bd";
          context.shadowBlur = 8;
          context.shadowColor = "#ffbb78";
          context.fill();
        }

        context.globalAlpha = 1;
      }

      /* Particles */
      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];

        particle.x += particle.vx * delta;
        particle.y += particle.vy * delta;
        particle.vy += particle.gravity * delta;
        particle.vx *= Math.pow(0.985, delta);
        particle.alpha -= particle.decay * delta;
        particle.rotation += particle.rotationSpeed * delta;

        if (particle.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        drawParticle(context, particle);
      }

      context.globalAlpha = 1;
      context.shadowBlur = 0;

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  }, [drawParticle, explodeFirework]);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    startAnimation();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      fireworksRef.current = [];
      particlesRef.current = [];
    };
  }, [resizeCanvas, startAnimation]);

  /* Main Flow Timeline */
  useEffect(() => {
    const firstTimer = setTimeout(() => setNightStarted(true), 300);
    const messageTimer = setTimeout(
      () => setShowFirstMessage(true),
      reducedMotion ? 500 : 1200
    );
    const birthdayTimer = setTimeout(
      () => setShowBirthday(true),
      reducedMotion ? 1400 : 3400
    );
    const finalTimer = setTimeout(
      () => setShowFinalMessage(true),
      reducedMotion ? 2400 : 6200
    );

    return () => {
      clearTimeout(firstTimer);
      clearTimeout(messageTimer);
      clearTimeout(birthdayTimer);
      clearTimeout(finalTimer);
    };
  }, [reducedMotion]);

  /* Firework Show Sequences */
  useEffect(() => {
    if (!showBirthday) return;

    if (reducedMotion) {
      launchFirework(
        window.innerWidth * 0.5,
        window.innerWidth * 0.5,
        window.innerHeight * 0.3
      );
      return;
    }

    celebrationIdRef.current += 1;
    const celebrationId = celebrationIdRef.current;

    const positions = [
      [0.2, 0.42],
      [0.4, 0.26],
      [0.6, 0.36],
      [0.8, 0.24],
      [0.5, 0.18],
    ];

    positions.forEach(([x, y], index) => {
      setTimeout(() => {
        if (celebrationIdRef.current !== celebrationId) return;
        launchFirework(
          window.innerWidth * x,
          window.innerWidth * x,
          window.innerHeight * y
        );
      }, index * 220);
    });

    const interval = window.setInterval(() => {
      if (celebrationIdRef.current !== celebrationId) return;
      const amount = randomInt(1, 2);
      for (let i = 0; i < amount; i++) {
        launchFirework();
      }
    }, 750);

    return () => {
      clearInterval(interval);
    };
  }, [showBirthday, reducedMotion, launchFirework]);

  /* Typewriter Sequence */
  useEffect(() => {
    if (!showBirthday) return;

    if (reducedMotion) {
      setTypedLetters(FINAL_MESSAGE.length);
      return;
    }

    setTypedLetters(0);
    let current = 0;

    const interval = window.setInterval(() => {
      current += 1;
      setTypedLetters(current);

      if (current >= FINAL_MESSAGE.length) {
        clearInterval(interval);
      }
    }, 70);

    return () => {
      clearInterval(interval);
    };
  }, [showBirthday, reducedMotion]);

  const celebrateAgain = () => {
    if (reducedMotion) {
      launchFirework(
        window.innerWidth * 0.5,
        window.innerWidth * 0.5,
        window.innerHeight * 0.32
      );
      return;
    }

    const burstPositions = [
      [0.15, 0.38],
      [0.35, 0.22],
      [0.65, 0.24],
      [0.85, 0.36],
      [0.5, 0.18],
    ];

    burstPositions.forEach(([x, y], index) => {
      setTimeout(() => {
        launchFirework(
          window.innerWidth * x,
          window.innerWidth * x,
          window.innerHeight * y
        );
      }, index * 120);
    });
  };

  return (
    <main className="celebration-page select-none">
      <canvas ref={canvasRef} className="fireworks-canvas" aria-hidden="true" />

      {/* Ambient Twinkling Stars */}
      <div
        className={`stars ${nightStarted ? "stars-visible" : ""}`}
        aria-hidden="true"
      >
        {Array.from({ length: 45 }).map((_, index) => (
          <motion.span
            key={index}
            className="star"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
              opacity: [0.15, 0.7, 0.2],
              scale: [0.7, 1, 0.8],
            }}
            transition={{
              duration: 2.5 + (index % 5) * 0.5,
              repeat: Infinity,
              delay: (index % 15) * 0.2,
            }}
            style={{
              left: `${(index * 47) % 96}%`,
              top: `${(index * 31) % 75}%`,
            }}
          />
        ))}
      </div>

      {/* Horizon Ambient Glow */}
      <motion.div
        className="horizon-glow"
        initial={{ opacity: 0 }}
        animate={{ opacity: nightStarted ? 1 : 0 }}
        transition={{ duration: 2 }}
      />

      <div className="celebration-content">
        <AnimatePresence mode="wait">
          {!showBirthday ? (
            <motion.div
              key="opening"
              className="opening"
              initial={{ opacity: 0, y: 15 }}
              animate={{
                opacity: showFirstMessage ? 1 : 0,
                y: showFirstMessage ? 0 : 15,
              }}
              transition={{ duration: 0.9 }}
            >
              {showFirstMessage && (
                <>
                  <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9 }}
                  >
                    Here's to many more memories together. ❤️
                  </motion.p>
                  <motion.div
                    className="opening-star"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                  >
                    ✦
                  </motion.div>
                </>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="birthday"
              className="birthday-content"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Main Headline */}
              <div className="birthday-title">
                {FINAL_MESSAGE.split("").map((character, index) => (
                  <motion.span
                    key={`${character}-${index}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{
                      opacity: index < typedLetters ? 1 : 0,
                      y: index < typedLetters ? 0 : 10,
                    }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    {character === " " ? "\u00A0" : character}
                  </motion.span>
                ))}
              </div>

              {/* Signature Block */}
              <AnimatePresence>
                {showFinalMessage && (
                  <motion.div
                    className="signature"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  >
                    <div className="signature-line" />
                    <p>Made with love ❤️</p>
                    <span>From your brother.</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Celebrate Again CTA */}
              <AnimatePresence>
                {showFinalMessage && (
                  <motion.div
                    className="button-wrapper"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                  >
                    <motion.button
                      className="again-button"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={celebrateAgain}
                    >
                      Celebrate Again 🎆
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        html,
        body {
          margin: 0;
          padding: 0;
          width: 100%;
          min-height: 100%;
          background: #04040c;
        }

        .celebration-page {
          position: relative;
          width: 100%;
          min-height: 100dvh;
          overflow: hidden;
          background:
            radial-gradient(
              ellipse at 50% 70%,
              rgba(56, 42, 86, 0.32),
              transparent 50%
            ),
            linear-gradient(
              180deg,
              #03040c 0%,
              #070817 50%,
              #0a0818 100%
            );
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .fireworks-canvas {
          position: fixed;
          inset: 0;
          z-index: 5;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .stars {
          position: fixed;
          inset: 0;
          z-index: 1;
          opacity: 0;
          transition: opacity 1.8s ease;
          pointer-events: none;
        }

        .stars-visible {
          opacity: 1;
        }

        .star {
          position: absolute;
          width: 2px;
          height: 2px;
          border-radius: 50%;
          background: #fff;
          box-shadow: 0 0 6px rgba(255, 255, 255, 0.85);
        }

        .horizon-glow {
          position: fixed;
          z-index: 2;
          left: 50%;
          bottom: -150px;
          transform: translateX(-50%);
          width: min(700px, 120vw);
          height: 320px;
          border-radius: 50%;
          background: radial-gradient(
            ellipse,
            rgba(108, 72, 125, 0.18),
            transparent 65%
          );
          filter: blur(35px);
          pointer-events: none;
        }

        .celebration-content {
          position: relative;
          z-index: 20;
          width: 100%;
          max-width: 480px;
          min-height: 100dvh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: max(20px, env(safe-area-inset-top)) 16px
            max(24px, env(safe-area-inset-bottom));
          pointer-events: none;
        }

        .opening,
        .birthday-content {
          width: 100%;
          text-align: center;
          pointer-events: none;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .opening p {
          margin: 0;
          max-width: 320px;
          color: rgba(255, 246, 239, 0.95);
          font-family:
            Georgia,
            "Times New Roman",
            serif;
          font-size: clamp(24px, 6.5vw, 34px);
          font-weight: 400;
          line-height: 1.3;
          letter-spacing: -0.5px;
          text-shadow: 0 4px 25px rgba(255, 210, 180, 0.16);
        }

        .opening-star {
          margin-top: 20px;
          color: rgba(255, 211, 159, 0.75);
          font-size: 14px;
          text-shadow: 0 0 16px rgba(255, 188, 115, 0.7);
        }

        /* Birthday Headline */
        .birthday-title {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          max-width: 340px;
          color: rgba(255, 248, 241, 0.98);
          font-family:
            Georgia,
            "Times New Roman",
            serif;
          font-size: clamp(32px, 8.5vw, 48px);
          font-weight: 500;
          line-height: 1.2;
          letter-spacing: -0.6px;
          text-shadow:
            0 0 20px rgba(255, 207, 167, 0.2),
            0 8px 30px rgba(0, 0, 0, 0.4);
        }

        .birthday-title span {
          display: inline-block;
        }

        /* Signature */
        .signature {
          margin-top: clamp(28px, 6vh, 44px);
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .signature-line {
          width: 45px;
          height: 1px;
          margin-bottom: 12px;
          background: rgba(255, 220, 190, 0.35);
        }

        .signature p {
          margin: 0;
          color: rgba(255, 240, 230, 0.8);
          font-family:
            Georgia,
            "Times New Roman",
            serif;
          font-size: clamp(15px, 4vw, 18px);
        }

        .signature span {
          margin-top: 5px;
          color: rgba(255, 255, 255, 0.45);
          font-family:
            "Segoe Print",
            "Caveat",
            "Bradley Hand",
            cursive;
          font-size: 13px;
        }

        /* CTA */
        .button-wrapper {
          margin-top: clamp(20px, 4vh, 32px);
          pointer-events: auto;
        }

        .again-button {
          border: 1px solid rgba(255, 255, 255, 0.18);
          border-radius: 999px;
          padding: 12px 24px;
          background: rgba(255, 255, 255, 0.08);
          color: rgba(255, 249, 242, 0.9);
          font-family:
            Inter,
            system-ui,
            sans-serif;
          font-size: 12.5px;
          letter-spacing: 0.03em;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          cursor: pointer;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
          transition: background 0.2s ease, border-color 0.2s ease;
        }

        .again-button:active {
          transform: scale(0.96);
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </main>
  );
}