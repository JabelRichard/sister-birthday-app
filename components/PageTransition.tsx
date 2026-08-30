"use client";
import { motion } from "framer-motion";
import { ReactNode } from "react";

export default function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -15, scale: 0.98 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full flex flex-col items-center justify-between min-h-[75vh]"
    >
      {children}
    </motion.div>
  );
}