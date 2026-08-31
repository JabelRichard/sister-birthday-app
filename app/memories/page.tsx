// app/memories/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

const memories = [
  {
    image: "/memories/number3.jpeg",
    caption: "One of many beautiful memories ❤️",
  },
  {
    image: "/memories/number2.jpeg",
    caption: "Some moments never get old.",
  },
  {
    image: "/memories/number1.jpeg",
    caption: "And hopefully many more to come.",
  },
];

export default function MemoriesPage() {
  const router = useRouter();

  const [started, setStarted] = useState(false);
  const [currentMemory, setCurrentMemory] = useState(0);
  const [showCaption, setShowCaption] = useState(false);
  const [finished, setFinished] = useState(false);

  const current = memories[currentMemory];
  const isLastMemory = currentMemory === memories.length - 1;

  /* Reveal the caption shortly after each image appears */
  useEffect(() => {
    setShowCaption(false);

    const timer = setTimeout(() => {
      setShowCaption(true);
    }, 650);

    return () => clearTimeout(timer);
  }, [currentMemory]);

  /* Opening sequence */
  useEffect(() => {
    const timer = setTimeout(() => {
      setStarted(true);
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  const nextMemory = () => {
    if (isLastMemory) {
      setFinished(true);
      return;
    }

    setCurrentMemory((previous) => previous + 1);
  };

  return (
    <main className="memories-page select-none">
      {/* =====================================================
          BACKGROUND: PURE BLACK NIGHT SKY & STARS
      ====================================================== */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-black">
        {/* Ambient Glows */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.15, 0.3, 0.15],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-1/2 top-1/2 h-[min(500px,90vw)] w-[min(500px,90vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-500/[0.06] blur-[120px]"
        />

        {/* Twinkling Stars */}
        {Array.from({ length: 45 }).map((_, index) => (
          <motion.span
            key={index}
            className="absolute rounded-full bg-white"
            style={{
              width: index % 5 === 0 ? 2 : 1,
              height: index % 5 === 0 ? 2 : 1,
              left: `${(index * 37.7) % 96}%`,
              top: `${(index * 61.3) % 92}%`,
            }}
            animate={{
              opacity: [0.08, 0.8, 0.08],
              scale: [0.8, 1.25, 0.8],
            }}
            transition={{
              duration: 3 + (index % 4),
              repeat: Infinity,
              delay: (index % 8) * 0.45,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="memory-content">
        <AnimatePresence mode="wait">
          {!started ? (
            /* OPENING SEQUENCE */
            <motion.div
              key="opening"
              className="opening"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.9 }}
            >
              <motion.div
                className="opening-line"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.3 }}
              >
                Let's go back for a moment... ❤️
              </motion.div>

              <motion.div
                className="opening-subtitle"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 1.1 }}
              >
                Some memories are worth keeping forever.
              </motion.div>

              <motion.div
                className="opening-dot"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.9, duration: 0.5 }}
              >
                ✦
              </motion.div>
            </motion.div>
          ) : !finished ? (
            /* MEMORY GALLERY */
            <motion.div
              key="memory-story"
              className="story"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Top Heading */}
              <motion.div
                className="story-heading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                A few moments worth remembering
              </motion.div>

              {/* Memory Counter Line */}
              <div className="memory-counter">
                <span>{String(currentMemory + 1).padStart(2, "0")}</span>

                <div className="counter-line">
                  <motion.div
                    className="counter-progress"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${((currentMemory + 1) / memories.length) * 100}%`,
                    }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>

                <span>{String(memories.length).padStart(2, "0")}</span>
              </div>

              {/* Photo Viewport */}
              <div className="memory-image-container">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentMemory}
                    className="image-wrapper"
                    initial={{ opacity: 0, scale: 1.05, x: 30 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.96, x: -30 }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {/* Slow Ken-Burns zoom */}
                    <motion.img
                      src={current.image}
                      alt={current.caption}
                      className="memory-image"
                      initial={{ scale: 1.02 }}
                      animate={{ scale: 1.1 }}
                      transition={{ duration: 8, ease: "linear" }}
                    />

                    <div className="image-overlay" />

                    <div className="image-number">{currentMemory + 1}</div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Caption Area */}
              <div className="caption-area">
                <AnimatePresence mode="wait">
                  {showCaption && (
                    <motion.div
                      key={`caption-${currentMemory}`}
                      className="caption"
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                      <span className="caption-mark">“</span>
                      <p>{current.caption}</p>
                      <span className="caption-heart">❤️</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Next Action Button */}
              <div className="action-area">
                <motion.button
                  className="next-button"
                  onClick={nextMemory}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{
                    opacity: showCaption ? 1 : 0,
                    y: showCaption ? 0 : 10,
                  }}
                  transition={{ duration: 0.4 }}
                  disabled={!showCaption}
                >
                  <span>{isLastMemory ? "Continue" : "Next memory"}</span>
                  <span className="arrow">→</span>
                </motion.button>
              </div>
            </motion.div>
          ) : (
            /* ENDING SCREEN */
            <motion.div
              key="ending"
              className="ending"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div
                className="ending-symbol"
                initial={{ opacity: 0, scale: 0.5, rotate: -15 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, duration: 0.7 }}
              >
                ❤️
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                And now…
                <br />
                let’s make another beautiful memory.
                <span>❤️</span>
              </motion.h1>

              <motion.div
                className="ending-divider"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 50, opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.6 }}
              />

              <motion.p
                className="last-thing"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.7 }}
              >
                One last thing...
              </motion.p>

              <motion.button
                className="celebrate-button"
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 1.6, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => router.push("/celebration")}
              >
                Celebrate 🎉
              </motion.button>
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
          background: #000000;
        }

        .memories-page {
          position: relative;
          min-height: 100dvh;
          width: 100%;
          overflow: hidden;
          background: #000000;
          color: #fff;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        /* Content Container */
        .memory-content {
          position: relative;
          z-index: 5;
          width: 100%;
          height: 100dvh;
          max-width: 480px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: max(16px, env(safe-area-inset-top)) 16px max(20px, env(safe-area-inset-bottom));
        }

        /* Opening */
        .opening {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 0 12px;
        }

        .opening-line {
          color: rgba(255, 255, 255, 0.95);
          font-family:
            Georgia,
            "Times New Roman",
            serif;
          font-size: clamp(26px, 7vw, 38px);
          line-height: 1.25;
          letter-spacing: -0.5px;
        }

        .opening-subtitle {
          margin-top: 14px;
          color: rgba(255, 255, 255, 0.55);
          font-family:
            "Segoe Print",
            "Caveat",
            "Bradley Hand",
            cursive;
          font-size: clamp(14px, 4vw, 16px);
          line-height: 1.6;
        }

        .opening-dot {
          margin-top: 28px;
          color: #f472b6;
          font-size: 14px;
          text-shadow: 0 0 16px rgba(244, 114, 182, 0.6);
        }

        /* Story Container */
        .story {
          width: 100%;
          height: 100%;
          max-height: 720px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          padding: 4px 0;
        }

        .story-heading {
          color: rgba(255, 255, 255, 0.45);
          font-size: 9.5px;
          font-family:
            Inter,
            system-ui,
            sans-serif;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          text-align: center;
        }

        .memory-counter {
          width: 100%;
          max-width: 320px;
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 4px;
          margin-bottom: 8px;
          color: rgba(255, 255, 255, 0.45);
          font-size: 10px;
          font-family:
            Inter,
            system-ui,
            sans-serif;
          letter-spacing: 0.08em;
        }

        .counter-line {
          position: relative;
          height: 1.5px;
          flex: 1;
          background: rgba(255, 255, 255, 0.12);
          overflow: hidden;
          border-radius: 2px;
        }

        .counter-progress {
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          background: rgba(244, 114, 182, 0.85);
        }

        /* Responsive Photo Frame */
        .memory-image-container {
          position: relative;
          width: 100%;
          flex: 1 1 auto;
          min-height: 220px;
          max-height: 52vh;
          overflow: hidden;
          border-radius: 16px;
          background: #111111;
          box-shadow:
            0 20px 45px rgba(0, 0, 0, 0.6),
            0 4px 15px rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(244, 114, 182, 0.18);
        }

        .image-wrapper {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }

        .memory-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          will-change: transform;
        }

        .image-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            rgba(0, 0, 0, 0.04),
            transparent 50%,
            rgba(0, 0, 0, 0.4)
          );
          pointer-events: none;
        }

        .image-number {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255, 255, 255, 0.9);
          background: rgba(0, 0, 0, 0.45);
          border: 1px solid rgba(244, 114, 182, 0.25);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          font-size: 11px;
          font-weight: 500;
        }

        /* Captions */
        .caption-area {
          width: 100%;
          min-height: 64px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          margin-top: 6px;
        }

        .caption {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0 24px;
        }

        .caption-mark {
          position: absolute;
          top: -10px;
          left: 0;
          color: rgba(244, 114, 182, 0.45);
          font-family: Georgia, serif;
          font-size: 32px;
          line-height: 1;
        }

        .caption p {
          margin: 0;
          color: rgba(255, 255, 255, 0.92);
          font-family:
            "Segoe Print",
            "Caveat",
            "Bradley Hand",
            cursive;
          font-size: clamp(14px, 4vw, 16px);
          line-height: 1.5;
        }

        .caption-heart {
          margin-top: 4px;
          font-size: 11px;
          opacity: 0.75;
        }

        /* Next Button Area */
        .action-area {
          width: 100%;
          display: flex;
          justify-content: center;
          min-height: 48px;
          margin-top: 6px;
        }

        .next-button {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border: 1px solid rgba(244, 114, 182, 0.22);
          border-radius: 999px;
          padding: 10px 22px;
          background: rgba(255, 255, 255, 0.06);
          color: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          cursor: pointer;
          font-size: 12.5px;
          letter-spacing: 0.02em;
          box-shadow: 0 0 20px rgba(244, 114, 182, 0.12);
          transition: transform 0.15s ease, background 0.2s ease, border-color 0.2s ease;
        }

        .next-button:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(244, 114, 182, 0.4);
        }

        .next-button:active {
          transform: scale(0.96);
        }

        .next-button:disabled {
          opacity: 0;
          pointer-events: none;
        }

        .arrow {
          font-size: 14px;
          color: #f472b6;
        }

        /* Ending Screen */
        .ending {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 0 12px;
        }

        .ending-symbol {
          margin-bottom: 18px;
          font-size: 32px;
          filter: drop-shadow(0 0 16px rgba(244, 114, 182, 0.4));
        }

        .ending h1 {
          margin: 0;
          color: rgba(255, 255, 255, 0.95);
          font-family:
            Georgia,
            "Times New Roman",
            serif;
          font-size: clamp(24px, 6.5vw, 36px);
          font-weight: 500;
          line-height: 1.25;
          letter-spacing: -0.5px;
        }

        .ending h1 span {
          font-size: 0.8em;
          margin-left: 5px;
        }

        .ending-divider {
          height: 1px;
          margin: 20px 0;
          background: rgba(244, 114, 182, 0.4);
        }

        .last-thing {
          margin: 0;
          color: rgba(255, 255, 255, 0.5);
          font-family:
            "Segoe Print",
            "Caveat",
            "Bradley Hand",
            cursive;
          font-size: 15px;
        }

        .celebrate-button {
          margin-top: 24px;
          padding: 13px 28px;
          border: 1px solid rgba(244, 114, 182, 0.25);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.08);
          color: #ffffff;
          backdrop-filter: blur(12px);
          box-shadow: 0 0 25px rgba(244, 114, 182, 0.18);
          cursor: pointer;
          font-size: 13px;
          letter-spacing: 0.03em;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .celebrate-button:hover {
          background: rgba(255, 255, 255, 0.12);
          border-color: rgba(244, 114, 182, 0.4);
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