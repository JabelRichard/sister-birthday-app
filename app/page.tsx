// app/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Music2, Sparkles } from "lucide-react";

/*
  SURPRISE SINGING VERSES:
  Cycles smoothly and repeats continuously like a crowd singing around her.
*/
const singingVerses = [
  "Haaapppy birthdaaaay to youuu 🎵",
  "Haaapppy birthdaaaay to youuu ❤️",
  "Happy birthdaaaay, Dada Sophia ✨",
  "Happy birthday to youuu! 🎂🎉",
];

const flowers = ["🌸", "🌷", "🌺", "🌼", "💮", "🌹"];

export default function Home() {
  const router = useRouter();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [stage, setStage] = useState<0 | 1 | 2 | 3>(0);
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
  const [hasCompletedFirstCycle, setHasCompletedFirstCycle] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  /*
    --------------------------------------------------------
    INTIMATE SURPRISE ENTRANCE TIMELINE (Paced & Relaxed)
    --------------------------------------------------------
  */
  useEffect(() => {
    const timers = [
      // 1. Stage 0 -> 1: "Wait... quiet everyone 🤫" stays for ~3.5s
      setTimeout(() => setStage(1), 3500),

      // 2. Stage 1 -> 2: "I have a little surprise just for you... ❤️" stays for ~4.5s
      setTimeout(() => setStage(2), 8000),

      // 3. Stage 2 -> 3: "Close your eyes... Ready? ✨" stays for ~4.5s before singing starts
      setTimeout(() => setStage(3), 12500),
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  /*
    --------------------------------------------------------
    CONTINUOUS REPEATING SINGING CHOREOGRAPHY
    --------------------------------------------------------
  */
  useEffect(() => {
    if (stage !== 3) return;

    // Start background music loop
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = 0;
      audio
        .play()
        .then(() => setMusicPlaying(true))
        .catch(() => setMusicPlaying(false));
    }

    // Cycles lyrics every 4.8s so each sung line can be comfortably read
    const lyricInterval = setInterval(() => {
      setCurrentVerseIndex((prev) => {
        const nextIndex = (prev + 1) % singingVerses.length;
        if (nextIndex === singingVerses.length - 1) {
          setHasCompletedFirstCycle(true);
        }
        return nextIndex;
      });
    }, 4800);

    return () => clearInterval(lyricInterval);
  }, [stage]);

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (musicPlaying) {
      audio.pause();
      setMusicPlaying(false);
    } else {
      audio
        .play()
        .then(() => setMusicPlaying(true))
        .catch(() => {});
    }
  };

  const handleContinue = () => {
    if (isNavigating) return;
    setIsNavigating(true);

    setTimeout(() => {
      router.push("/wish");
    }, 700);
  };

  return (
    <main className="relative min-h-[100dvh] w-full overflow-hidden bg-black text-white select-none flex flex-col justify-between">
      {/* Audio Element with Loop */}
      <audio ref={audioRef} src="/music/birthday.mp3" loop preload="auto" />

      {/* =====================================================
          BACKGROUND: PURE BLACK NIGHT SKY & STARS
      ====================================================== */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-black">
        {/* Soft, deep ambient glow highlights on pure black */}
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

      {/* =====================================================
          1. SUSPENSE INTRO (Paced Smooth Entrances & Exits)
      ====================================================== */}
      <AnimatePresence mode="wait">
        {stage === 0 && (
          <motion.div
            key="stage-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black p-6"
          >
            <div className="text-center max-w-xs">
              <motion.div
                animate={{
                  opacity: [0.3, 1, 0.3],
                  scale: [0.9, 1.1, 0.9],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="mb-6 flex justify-center"
              >
                <Sparkles className="h-7 w-7 text-pink-200" />
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 1.2 }}
                className="text-xs font-light tracking-[0.32em] text-white/40 uppercase"
              >
               Today is all about you
              </motion.p>
            </div>
          </motion.div>
        )}

        {stage === 1 && (
          <motion.div
            key="stage-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black p-6"
          >
            <div className="text-center max-w-sm">
              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.3 }}
                className="font-serif text-2xl italic text-white/80 sm:text-3xl leading-snug"
              >
                I have a little surprise
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.0, duration: 1.4 }}
                className="mt-2 font-serif text-2xl italic text-pink-200 sm:text-3xl leading-snug"
              >
                just for you... ❤️
              </motion.p>
            </div>
          </motion.div>
        )}

        {stage === 2 && (
          <motion.div
            key="stage-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black p-6"
          >
            <div className="text-center max-w-sm">
              <motion.p
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="font-serif text-3xl italic text-white/90 sm:text-4xl leading-tight"
              >
                Close your eyes...
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0, duration: 1.3 }}
                className="mt-3 font-serif text-4xl italic text-pink-200 sm:text-5xl leading-tight"
              >
                Ready? ✨
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =====================================================
          2. FALLING FLOWER PETALS (Edge-to-Edge Responsive)
      ====================================================== */}
      <AnimatePresence>
        {stage >= 3 && (
          <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
            {Array.from({ length: 20 }).map((_, index) => {
              const flower = flowers[index % flowers.length];
              const initialX = (index * 5) % 92;

              return (
                <motion.div
                  key={index}
                  initial={{
                    y: "-12vh",
                    x: `${initialX}vw`,
                    rotate: 0,
                    opacity: 0,
                  }}
                  animate={{
                    y: "110vh",
                    x: `${initialX + (index % 2 ? -4 : 4)}vw`,
                    rotate: index % 2 === 0 ? 360 : -360,
                    opacity: [0, 0.8, 0.65, 0],
                  }}
                  transition={{
                    duration: 9 + (index % 5),
                    delay: index * 0.45,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute text-base sm:text-lg md:text-xl select-none"
                >
                  {flower}
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>

      {/* =====================================================
          3. MAIN CELEBRATION SCENE (Pure-Black Responsive)
      ====================================================== */}
      <AnimatePresence>
        {stage >= 3 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.4 }}
            className="relative z-20 flex min-h-[100dvh] w-full flex-col justify-between px-4 sm:px-6 pb-[max(20px,env(safe-area-inset-bottom))] pt-[max(16px,env(safe-area-inset-top))]"
          >
            {/* Top Bar: Music Toggle */}
            <div className="flex w-full justify-end max-w-2xl mx-auto">
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                onClick={toggleMusic}
                aria-label={musicPlaying ? "Pause music" : "Play music"}
                className={`rounded-full border p-3 backdrop-blur-xl transition active:scale-95 ${
                  musicPlaying
                    ? "border-pink-300/20 bg-pink-400/10 text-pink-100 shadow-[0_0_15px_rgba(244,114,182,0.15)]"
                    : "border-white/10 bg-white/[0.04] text-white/50 hover:text-white"
                }`}
              >
                <Music2
                  className={`h-4 w-4 ${
                    musicPlaying ? "animate-pulse text-pink-200" : ""
                  }`}
                />
              </motion.button>
            </div>

            {/* Center Area: Animated Repeating Singing Text */}
            <section className="flex flex-1 flex-col items-center justify-center text-center px-2 sm:px-4 my-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 180 }}
                className="mb-4 sm:mb-6"
              >
                <span className="text-xl sm:text-2xl">✨</span>
              </motion.div>

              {/* Dynamic Animated Lyric Transitions */}
              <div className="w-full max-w-lg min-h-[110px] sm:min-h-[140px] flex items-center justify-center px-2">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentVerseIndex}
                    initial={{ opacity: 0, y: 18, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -18, scale: 0.95 }}
                    transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                    className="flex flex-col items-center text-center"
                  >
                    <p
                      className={`font-serif leading-tight tracking-tight text-balance ${
                        currentVerseIndex === 2
                          ? "text-2xl sm:text-3xl md:text-4xl text-pink-100 font-normal drop-shadow-[0_0_25px_rgba(244,114,182,0.35)]"
                          : currentVerseIndex === 3
                          ? "text-2xl sm:text-3xl md:text-4xl text-rose-100 font-normal"
                          : "text-xl sm:text-2xl md:text-3xl text-white/95 font-light italic"
                      }`}
                    >
                      {singingVerses[currentVerseIndex]}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </section>

            {/* Bottom Action: Proceed Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="flex w-full flex-col items-center pb-2 max-w-xs mx-auto"
            >
              <motion.button
                onClick={handleContinue}
                disabled={isNavigating || (!hasCompletedFirstCycle && currentVerseIndex < 2)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                animate={{
                  boxShadow: [
                    "0 0 0 rgba(244,114,182,0)",
                    "0 0 30px rgba(244,114,182,0.18)",
                    "0 0 0 rgba(244,114,182,0)",
                  ],
                }}
                transition={{
                  boxShadow: {
                    duration: 3.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
                className="w-full group flex items-center justify-center gap-3 rounded-full border border-pink-300/20 bg-white/[0.07] px-6 py-3.5 text-xs sm:text-sm font-medium text-white/90 backdrop-blur-xl transition hover:border-pink-200/40 hover:bg-white/[0.1] disabled:opacity-0"
              >
                <span>There's more</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 text-pink-300 flex-shrink-0" />
              </motion.button>

             
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}