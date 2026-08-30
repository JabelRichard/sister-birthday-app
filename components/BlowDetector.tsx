"use client";
import { useState, useEffect, useRef } from "react";
import { Mic } from "lucide-react";

interface BlowDetectorProps {
  onBlow: () => void;
  disabled?: boolean;
}

export default function BlowDetector({ onBlow, disabled }: BlowDetectorProps) {
  const [isListening, setIsListening] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const cooldownRef = useRef(false);

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      micStreamRef.current = stream;

      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 512;

      const microphone = audioCtx.createMediaStreamSource(stream);
      microphone.connect(analyser);

      setIsListening(true);
      setPermissionDenied(false);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const detect = () => {
        if (!analyser || disabled) return;
        analyser.getByteFrequencyData(dataArray);

        let lowFreqSum = 0;
        const binCount = 15;
        for (let i = 0; i < binCount; i++) lowFreqSum += dataArray[i];
        const average = lowFreqSum / binCount;

        if (average > 48 && !cooldownRef.current) {
          cooldownRef.current = true;
          onBlow();
          setTimeout(() => {
            cooldownRef.current = false;
          }, 650);
        }

        requestAnimationFrame(detect);
      };

      detect();
    } catch {
      setPermissionDenied(true);
      setIsListening(false);
    }
  };

  useEffect(() => {
    return () => {
      micStreamRef.current?.getTracks().forEach((t) => t.stop());
      audioContextRef.current?.close();
    };
  }, []);

  if (disabled) return null;

  return (
    <div className="flex flex-col items-center gap-2">
      {!isListening && !permissionDenied && (
        <button
          onClick={startListening}
          className="inline-flex items-center gap-2 text-xs bg-pink-950/60 border border-pink-400/30 px-4 py-2 rounded-full text-pink-200 backdrop-blur-md transition active:scale-95"
        >
          <Mic size={14} className="text-pink-400" />
          Enable Microphone to Blow
        </button>
      )}
      <p className="text-[11px] text-pink-300/60 italic">
        Having trouble blowing? Tap the candles instead.
      </p>
    </div>
  );
}