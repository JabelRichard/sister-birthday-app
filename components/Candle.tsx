"use client";
import { motion, AnimatePresence } from "framer-motion";

interface CandleProps {
  isLit: boolean;
  onExtinguish: () => void;
  index: number;
}

export default function Candle({ isLit, onExtinguish, index }: CandleProps) {
  return (
    <div
      onClick={onExtinguish}
      className="cursor-pointer flex flex-col items-center group touch-manipulation"
    >
      <div className="h-10 flex items-center justify-center relative">
        <AnimatePresence>
          {isLit ? (
            <motion.div
              exit={{ opacity: 0, scale: 0.2 }}
              className="relative flex flex-col items-center"
            >
              <div className="absolute w-8 h-8 bg-amber-400/50 rounded-full blur-md animate-pulse" />
              <div className="w-3.5 h-6 bg-gradient-to-t from-pink-500 via-amber-400 to-yellow-100 rounded-[50%_50%_20%_20%] shadow-[0_0_12px_#f59e0b] animate-flicker" />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: [0.8, 0], y: -25, x: [0, index % 2 === 0 ? 6 : -6] }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="w-1.5 h-6 bg-gray-400/80 rounded-full blur-[1px]"
            />
          )}
        </AnimatePresence>
      </div>

      <div className="w-3 h-12 bg-gradient-to-b from-pink-300 via-rose-300 to-pink-400 rounded-t-sm shadow-sm relative overflow-hidden border border-pink-200/40">
        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_4px,rgba(255,255,255,0.4)_4px,rgba(255,255,255,0.4)_8px)]" />
      </div>
    </div>
  );
}