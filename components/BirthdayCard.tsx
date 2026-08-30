// components/BirthdayCard.tsx
"use client";

import { useState } from "react";
import { Heart, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function BirthdayCard() {
  const [foundEasterEgg, setFoundEasterEgg] = useState(false);

  return (
    <div className="relative w-full bg-gradient-to-br from-[#1f112e] to-[#2c143d] border border-pink-300/30 rounded-2xl p-6 sm:p-7 shadow-2xl backdrop-blur-xl space-y-4 text-left">
      {/* 9. Hidden Easter Egg Star */}
      <button
        onClick={() => setFoundEasterEgg(true)}
        className="absolute top-4 right-4 p-1 text-pink-300/30 hover:text-amber-300 transition-colors"
        title="✨"
      >
        <Star size={14} className="animate-pulse" />
      </button>

      <div className="flex items-center gap-2 text-rose-300 text-sm font-semibold tracking-wide uppercase">
        <Heart size={16} className="fill-rose-400 text-rose-400" />
        <span>To my amazing sister</span>
      </div>

      <div className="space-y-3 text-pink-100/90 leading-relaxed text-sm font-light">
        <p className="font-serif text-lg text-pink-200">Happy Birthday! ❤️</p>
        <p>
          I hope this new chapter of your life brings you happiness, peace, love, success and many beautiful moments.
        </p>
        <p>
          Thank you for being such a special person in my life. I hope you always remember how loved and appreciated you are.
        </p>
        <p>
          May this year bring you closer to your dreams and give you many reasons to smile.
        </p>
        <p className="font-serif text-pink-200 pt-2">
          Happy Birthday once again, Sis! 🎂❤️
        </p>
      </div>

      {/* Easter Egg Popover */}
      <AnimatePresence>
        {foundEasterEgg && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-3 bg-pink-900/60 border border-amber-300/40 rounded-xl text-xs text-pink-100 space-y-1"
          >
            <p className="font-medium text-amber-300">⭐ You found the secret!</p>
            <p className="text-[11px] text-pink-200/80">
              Bonus reason you're the best: You always share your snacks (even when you pretend you don't want to) 😂❤️
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}