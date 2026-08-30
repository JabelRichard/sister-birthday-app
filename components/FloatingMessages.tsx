// components/FloatingMessages.tsx
"use client";

import { useEffect, useState } from "react";
import { floatingMessages } from "@/config/birthdayData";

export default function FloatingMessages() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative w-full h-80 my-4 flex flex-col items-center justify-center overflow-hidden">
      {/* Soft gradient masks at top & bottom so cards fade in/out smoothly */}
      <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-[#090514] via-[#090514]/60 to-transparent z-20 pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-[#090514] via-[#090514]/60 to-transparent z-20 pointer-events-none" />

      {/* Message Cards */}
      <div className="relative w-full h-full flex items-center justify-center">
        {floatingMessages.map((msg, index) => {
          // Horizontal offsets to spread messages across the screen
          const xPositions = ["-18px", "14px", "-8px", "16px", "-12px", "10px"];
          const xPos = xPositions[index % xPositions.length];
          const delay = index * 2.5; // 2.5s stagger between each message

          return (
            <div
              key={index}
              className="absolute text-center max-w-[90%] px-5 py-2.5 rounded-full bg-pink-950/70 border border-pink-400/30 backdrop-blur-md shadow-[0_0_15px_rgba(244,114,182,0.2)] text-pink-100 text-sm font-light italic"
              style={{
                left: `calc(50% + ${xPos})`,
                transform: "translateX(-50%)",
                animation: `floatUpLoop 15s linear infinite`,
                animationDelay: `${delay}s`,
                opacity: 0,
              }}
            >
              "{msg}"
            </div>
          );
        })}
      </div>

      {/* Injected Pure CSS Keyframe Animation */}
      <style jsx>{`
        @keyframes floatUpLoop {
          0% {
            transform: translate(-50%, 140px) scale(0.9);
            opacity: 0;
          }
          15% {
            opacity: 1;
            transform: translate(-50%, 70px) scale(1);
          }
          85% {
            opacity: 1;
            transform: translate(-50%, -70px) scale(1);
          }
          100% {
            transform: translate(-50%, -140px) scale(0.95);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}