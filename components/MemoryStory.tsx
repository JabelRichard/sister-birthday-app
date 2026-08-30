// components/MemoryStory.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { memoryStory } from "@/config/birthdayData";

export default function MemoryStory({ onComplete }: { onComplete: () => void }) {
  const [index, setIndex] = useState(0);
  const current = memoryStory[index];

  const handleNext = () => {
    if (index < memoryStory.length - 1) {
      setIndex((prev) => prev + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-between min-h-[70vh]">
      <div className="w-full relative flex flex-col items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.88, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 1.05, rotate: 2 }}
            transition={{ duration: 0.45 }}
            className="w-full max-w-xs bg-gradient-to-b from-white to-pink-50 p-3.5 pb-6 rounded-2xl shadow-2xl border border-pink-200/20 text-gray-800"
          >
            <div className="flex justify-between items-center px-1 pb-2">
              <span className="text-[11px] font-medium text-pink-600 tracking-wide uppercase">
                {current.tag || "Memory"}
              </span>
              <span className="text-[10px] text-gray-400">
                {index + 1} of {memoryStory.length}
              </span>
            </div>

            <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-gray-100 mb-3 shadow-inner">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={current.image}
                alt="Memory"
                className="object-cover w-full h-full"
              />
            </div>

            <p className="text-center font-serif text-sm font-semibold text-gray-800 px-1">
              {current.subtitle}
            </p>
            <p className="text-center text-xs text-gray-600 mt-1 font-light px-2">
              "{current.caption}"
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex flex-col items-center gap-3 pt-4">
        <div className="flex gap-1.5">
          {memoryStory.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index ? "w-6 bg-pink-400" : "w-1.5 bg-pink-400/30"
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="inline-flex items-center gap-2 px-7 py-2.5 bg-pink-500/80 hover:bg-pink-500 rounded-full text-xs font-medium tracking-wide uppercase text-white border border-pink-300/30 backdrop-blur-sm shadow-md mt-2 transition active:scale-95"
        >
          <span>{index === memoryStory.length - 1 ? "One Last Thing..." : "Next Memory"}</span>
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}