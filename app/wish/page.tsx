// app/wish/page.tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

type CandleState = {
  id: number;
  extinguished: boolean;
};

const INITIAL_CANDLES: CandleState[] = [
  { id: 1, extinguished: false },
  { id: 2, extinguished: false },
  { id: 3, extinguished: false },
];

export default function WishPage() {
  const router = useRouter();

  const [introStep, setIntroStep] = useState(0);
  const [candles, setCandles] = useState<CandleState[]>(INITIAL_CANDLES);
  const [isListening, setIsListening] = useState(false);
  const [micAvailable, setMicAvailable] = useState(true);
  const [celebrating, setCelebrating] = useState(false);
  const [showContinue, setShowContinue] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastBlowRef = useRef(0);

  const extinguishedCount = candles.filter((c) => c.extinguished).length;

  useEffect(() => {
    const t1 = setTimeout(() => setIntroStep(1), 1600);
    const t2 = setTimeout(() => setIntroStep(2), 3600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const extinguishCandle = useCallback((id: number) => {
    setCandles((current) => {
      const target = current.find((candle) => candle.id === id);
      if (!target || target.extinguished) return current;

      return current.map((candle) =>
        candle.id === id ? { ...candle, extinguished: true } : candle
      );
    });
  }, []);

  const stopMicrophone = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    analyserRef.current = null;
    setIsListening(false);
  }, []);

  const startMicrophone = useCallback(async () => {
    if (
      typeof window === "undefined" ||
      !navigator.mediaDevices ||
      !navigator.mediaDevices.getUserMedia
    ) {
      setMicAvailable(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: false,
        },
      });

      streamRef.current = stream;

      const AudioContextClass =
        window.AudioContext ||
        (
          window as typeof window & {
            webkitAudioContext?: typeof AudioContext;
          }
        ).webkitAudioContext;

      if (!AudioContextClass) {
        setMicAvailable(false);
        return;
      }

      const audioContext = new AudioContextClass();
      if (audioContext.state === "suspended") {
        await audioContext.resume();
      }

      audioContextRef.current = audioContext;
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 1024;
      analyser.smoothingTimeConstant = 0.2;

      const microphone = audioContext.createMediaStreamSource(stream);
      microphone.connect(analyser);
      analyserRef.current = analyser;

      setIsListening(true);
      setMicAvailable(true);

      const dataArray = new Uint8Array(analyser.fftSize);

      const detectBlow = () => {
        const currentAnalyser = analyserRef.current;
        if (!currentAnalyser) return;

        currentAnalyser.getByteTimeDomainData(dataArray);

        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          const normalized = (dataArray[i] - 128) / 128;
          sum += normalized * normalized;
        }

        const rms = Math.sqrt(sum / dataArray.length);
        const now = Date.now();

        if (rms > 0.075 && now - lastBlowRef.current > 1100) {
          lastBlowRef.current = now;

          setCandles((current) => {
            const nextCandle = current.find((candle) => !candle.extinguished);
            if (!nextCandle) return current;

            return current.map((candle) =>
              candle.id === nextCandle.id
                ? { ...candle, extinguished: true }
                : candle
            );
          });
        }

        animationFrameRef.current = requestAnimationFrame(detectBlow);
      };

      detectBlow();
    } catch {
      setMicAvailable(false);
      setIsListening(false);
    }
  }, []);

  useEffect(() => {
    if (introStep !== 2) return;
    startMicrophone();
    return () => {
      stopMicrophone();
    };
  }, [introStep, startMicrophone, stopMicrophone]);

  useEffect(() => {
    if (extinguishedCount !== 3) return;

    stopMicrophone();
    setCelebrating(true);

    const timer = setTimeout(() => {
      setShowContinue(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, [extinguishedCount, stopMicrophone]);

  // Warm, conversational sister-to-brother subtexts
  useEffect(() => {
    if (extinguishedCount === 0) {
      setStatusMessage("");
    } else if (extinguishedCount === 1) {
      setStatusMessage("That’s one... keep going ✨");
    } else if (extinguishedCount === 2) {
      setStatusMessage("Almost there... one last wish 💖");
    } else {
      setStatusMessage("All your wishes are sealed ❤️");
    }
  }, [extinguishedCount]);

  useEffect(() => {
    return () => {
      stopMicrophone();
    };
  }, [stopMicrophone]);

  return (
    <main className="relative min-h-[100svh] w-full overflow-hidden bg-[#060309] text-stone-100 flex flex-col items-center justify-between p-6 select-none font-sans">
      
      {/* 1. Ambient Warm Lighting */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[38%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] h-[360px] bg-amber-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-40px] left-1/2 -translate-x-1/2 w-[420px] h-[300px] bg-rose-950/25 rounded-full blur-[130px]" />

        {/* Floating golden motes */}
        {Array.from({ length: 16 }).map((_, index) => (
          <motion.span
            key={index}
            className="absolute rounded-full bg-amber-200/40"
            style={{
              width: index % 3 === 0 ? "3px" : "2px",
              height: index % 3 === 0 ? "3px" : "2px",
              left: `${10 + ((index * 23) % 80)}%`,
              top: `${30 + ((index * 19) % 50)}%`,
            }}
            animate={{
              opacity: [0.1, 0.7, 0.1],
              y: [0, -40, 0],
            }}
            transition={{
              duration: 4 + (index % 3),
              repeat: Infinity,
              delay: index * 0.4,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Top Header / Prompt Area */}
      <div className="relative z-10 w-full max-w-sm pt-4 text-center min-h-[70px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {introStep === 0 && (
            <motion.p
              key="intro-one"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.7 }}
              className="font-serif text-2xl text-rose-100/90 font-light italic"
            >
              Take a quiet breath...
            </motion.p>
          )}

          {introStep === 1 && (
            <motion.p
              key="intro-two"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.7 }}
              className="font-serif text-2xl text-rose-100 font-light"
            >
              Make a wish for this year ✨
            </motion.p>
          )}

          {introStep === 2 && !celebrating && (
            <motion.p
              key="intro-three"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-xs uppercase tracking-[0.25em] text-stone-300/75 font-medium"
            >
              Blow out your candles 🎂
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* 2. Handcrafted Illustrated Birthday Cake */}
      <section className="relative z-10 flex flex-col items-center justify-center my-auto">
        <motion.div
          className="relative w-[280px] sm:w-[320px] flex flex-col items-center justify-end pt-12 pb-4"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Flame Glow Ambient Light */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-48 h-28 bg-amber-400/20 blur-2xl pointer-events-none rounded-full" />

          {/* Candle Array */}
          <div className="absolute top-0 z-30 w-44 flex justify-between items-end px-3">
            {candles.map((candle, index) => (
              <motion.button
                key={candle.id}
                onClick={() => extinguishCandle(candle.id)}
                aria-label={`Candle ${candle.id}`}
                className="relative w-8 h-24 flex flex-col items-center justify-end outline-none cursor-pointer"
                whileHover={candle.extinguished ? {} : { scale: 1.08, y: -2 }}
                whileTap={candle.extinguished ? {} : { scale: 0.95 }}
              >
                {/* Organic Flame Animation */}
                <AnimatePresence>
                  {!candle.extinguished && (
                    <motion.div
                      className="absolute top-0 left-1/2 -translate-x-1/2 w-3.5 h-6 rounded-[50%_50%_50%_50%/60%_60%_40%_40%] bg-gradient-to-t from-amber-500 via-yellow-200 to-white shadow-[0_0_15px_rgba(251,191,36,0.95)] flex items-center justify-center origin-bottom"
                      animate={{
                        scale: [0.95, 1.08, 0.97],
                        rotate: [-3, 3, -1],
                      }}
                      exit={{ opacity: 0, scale: 0.2, y: -8 }}
                      transition={{
                        duration: 0.4 + (index % 2) * 0.15,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <div className="w-1 h-2.5 bg-white rounded-full blur-[0.4px]" />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Soft Smoke Trail */}
                <AnimatePresence>
                  {candle.extinguished && (
                    <motion.span
                      className="absolute -top-3 text-stone-300/60 text-lg font-serif pointer-events-none"
                      initial={{ opacity: 0, scale: 0.4, y: 0 }}
                      animate={{
                        opacity: [0, 0.7, 0],
                        scale: [0.5, 1.2, 1.5],
                        y: [-2, -22, -38],
                        x: [0, 4, -3],
                      }}
                      transition={{ duration: 1.3, ease: "easeOut" }}
                    >
                      〰
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Spiral Pastel Candle */}
                <div className="relative w-3 h-14 rounded-t-sm rounded-b-[2px] bg-[repeating-linear-gradient(-45deg,#fff1f2_0px,#fff1f2_4px,#f43f5e_4px,#f43f5e_8px)] shadow-md border-t border-amber-100/40">
                  <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-[1.5px] h-2 bg-stone-900" />
                </div>
              </motion.button>
            ))}
          </div>

          {/* Handcrafted Layered Cake Body */}
          <div className="relative z-20 flex flex-col items-center">
            
            {/* Strawberries / Cake Toppings */}
            <div className="relative z-30 flex items-center justify-center gap-3 -mb-2.5">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-3.5 h-4 bg-gradient-to-b from-rose-500 to-rose-700 rounded-t-full rounded-b-md shadow-sm border-t border-rose-300/40 transform hover:scale-110 transition-transform"
                />
              ))}
            </div>

            {/* Top Tier (Vanilla Velvet with Cream Drips) */}
            <div className="relative w-48 h-12 rounded-t-2xl bg-gradient-to-b from-[#fff5ea] via-[#fce7db] to-[#f7d6c8] shadow-inner flex flex-col justify-between overflow-hidden border-t border-white/60">
              {/* Organic Cream Drops */}
              <div className="flex justify-around items-start w-full px-2">
                <div className="w-3 h-3 bg-[#fffaf5] rounded-b-full shadow-sm" />
                <div className="w-2.5 h-4.5 bg-[#fffaf5] rounded-b-full shadow-sm" />
                <div className="w-3 h-2.5 bg-[#fffaf5] rounded-b-full shadow-sm" />
                <div className="w-2 h-4 bg-[#fffaf5] rounded-b-full shadow-sm" />
              </div>
            </div>

            {/* Middle Strawberry Cream Filling */}
            <div className="relative z-20 w-52 h-3.5 bg-[#f43f5e]/85 rounded-full -mt-1 shadow-sm flex items-center justify-around px-3 border-y border-rose-300/30">
              {[...Array(7)].map((_, i) => (
                <span key={i} className="w-1 h-1 rounded-full bg-white/70" />
              ))}
            </div>

            {/* Bottom Tier (Warm Cocoa Sponge) */}
            <div className="relative w-56 h-14 rounded-b-2xl bg-gradient-to-b from-[#844c45] to-[#5a2e2a] -mt-1 shadow-md flex items-center justify-center border-b border-stone-800/40">
              {/* Fine gold pearl garnish */}
              <div className="flex justify-around w-full px-4 pt-4">
                {[...Array(9)].map((_, i) => (
                  <span key={i} className="w-1.5 h-1.5 rounded-full bg-amber-200/60 shadow-[0_0_4px_rgba(253,230,138,0.4)]" />
                ))}
              </div>
            </div>

            {/* Elegant Vintage Cake Stand */}
            <div className="relative z-10 flex flex-col items-center -mt-1">
              <div className="w-64 h-3.5 bg-gradient-to-r from-[#d4af37] via-[#fef08a] to-[#b48c26] rounded-full shadow-lg border-t border-white/50" />
              <div className="w-14 h-4 bg-gradient-to-b from-[#b48c26] to-[#856417] rounded-b-sm shadow-inner" />
              <div className="w-28 h-2 bg-gradient-to-r from-[#856417] via-[#d4af37] to-[#856417] rounded-full shadow-md" />
            </div>

            {/* Soft Shadow on Table */}
            <div className="w-64 h-4 bg-black/50 blur-md rounded-full -mt-1" />
          </div>
        </motion.div>

        {/* Live Candle Whisper Status */}
        <div className="h-8 flex items-center justify-center mt-2">
          <AnimatePresence mode="wait">
            {statusMessage && !celebrating && (
              <motion.p
                key={statusMessage}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.35 }}
                className="font-serif italic text-base text-rose-200/90 tracking-wide"
              >
                {statusMessage}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Gentle Listening Indicator or Tap Hint */}
        <div className="h-6 flex items-center justify-center">
          {introStep === 2 && !celebrating && extinguishedCount < 3 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-[11px] text-stone-400/60 flex items-center gap-1.5 tracking-wide"
            >
              {isListening && micAvailable ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
                  <span>Blow into your mic or tap each candle</span>
                </>
              ) : (
                <span>Tap the candles to blow them out</span>
              )}
            </motion.div>
          )}
        </div>
      </section>

      {/* 3. Celebration Modal Overlay */}
      <AnimatePresence>
        {celebrating && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-[#060309]/90 backdrop-blur-md p-6 text-center"
          >
            <div className="text-3xl mb-3 animate-bounce">✨</div>
            <h1 className="font-serif text-3xl md:text-4xl text-rose-100 font-normal tracking-tight">
              Wishes Sent to the Stars ❤️
            </h1>
            <p className="text-stone-300/80 text-sm mt-3 tracking-wide max-w-xs leading-relaxed font-light">
              I wrote something special just for you on the next page.
            </p>

            {/* Read Card Button */}
            <div className="mt-8">
              <AnimatePresence>
                {showContinue && (
                  <motion.button
                    onClick={() => router.push("/card")}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-white/[0.08] hover:bg-white/[0.14] border border-white/20 text-stone-100 text-xs uppercase tracking-[0.2em] font-medium transition backdrop-blur-md shadow-[0_0_20px_rgba(255,255,255,0.08)]"
                  >
                    <span>Read Your Card</span>
                    <span>→</span>
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Subtle Branding / Space */}
      <div className="relative z-10 pb-4">
        <p className="text-[10px] tracking-[0.25em] text-stone-400/30 uppercase">
          Happy Birthday Sis
        </p>
      </div>

    </main>
  );
}