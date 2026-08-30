"use client";
import Candle from "./Candle";

interface BirthdayCakeProps {
  candles: boolean[];
  onExtinguish: (index: number) => void;
}

export default function BirthdayCake({ candles, onExtinguish }: BirthdayCakeProps) {
  return (
    <div className="relative flex flex-col items-center justify-center pt-8">
      <div className="flex justify-center gap-6 mb-[-6px] z-20">
        {candles.map((isLit, idx) => (
          <Candle
            key={idx}
            index={idx}
            isLit={isLit}
            onExtinguish={() => onExtinguish(idx)}
          />
        ))}
      </div>

      {/* Cake Top Layer */}
      <div className="w-48 h-16 bg-gradient-to-r from-pink-300 via-rose-200 to-pink-300 rounded-t-2xl relative shadow-inner z-10 border-t-4 border-pink-100 flex items-start justify-around px-2 overflow-hidden">
        <div className="w-full flex justify-between absolute top-0">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-6 h-5 bg-pink-100 rounded-b-full shadow-sm" />
          ))}
        </div>
      </div>

      {/* Cake Bottom Layer */}
      <div className="w-64 h-20 bg-gradient-to-r from-rose-400 via-pink-400 to-rose-400 rounded-b-xl relative shadow-2xl flex flex-col justify-between overflow-hidden border-t-2 border-pink-300">
        <div className="w-full h-3 bg-pink-200/50 my-auto" />
      </div>

      {/* Cake Stand */}
      <div className="w-72 h-4 bg-gradient-to-r from-gray-200 via-white to-gray-200 rounded-full shadow-xl mt-[-2px]" />
      <div className="w-24 h-5 bg-gradient-to-r from-gray-300 via-white to-gray-300 rounded-b-md shadow-lg" />
    </div>
  );
}