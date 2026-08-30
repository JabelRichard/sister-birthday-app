"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const birthdayMessage = `Happy Birthday! ❤️

I hope this new chapter of your life brings you happiness, peace, love, success and many beautiful moments.

Thank you for being such a special person in my life. I hope you always remember how loved and appreciated you are.

May this year bring you closer to your dreams and give you many reasons to smile.

Happy Birthday once again, Sis! 🎂❤️`;

export default function CardPage() {
  const router = useRouter();
  const [showMessage, setShowMessage] = useState(false);
  const [showEnding, setShowEnding] = useState(false);

  useEffect(() => {
    const messageTimer = setTimeout(() => {
      setShowMessage(true);
    }, 800);

    const endingTimer = setTimeout(() => {
      setShowEnding(true);
    }, 4800);

    return () => {
      clearTimeout(messageTimer);
      clearTimeout(endingTimer);
    };
  }, []);

  return (
    <main className="card-page select-none">
      {/* Paper texture overlay across the whole screen */}
      <div className="paper-texture" />

      {/* Decorative Inset Border */}
      <div className="paper-edge" />

      <div className="page-content">
        {/* Top small label */}
        <motion.div
          className="top-label"
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          A little something for you
        </motion.div>

        {/* Small decorative heart */}
        <motion.div
          className="card-symbol"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          ♥
        </motion.div>

        {/* Greeting */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
        >
          To my amazing sister <span>❤️</span>
        </motion.h1>

        <motion.div
          className="little-line"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 45, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        />

        {/* Letter Body */}
        <AnimatePresence>
          {showMessage && (
            <motion.div
              className="letter"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
            >
              {birthdayMessage.split("\n\n").map((paragraph, index) => (
                <motion.p
                  key={index}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: index * 0.45,
                    duration: 0.7,
                    ease: "easeOut",
                  }}
                >
                  {paragraph}
                </motion.p>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Signature */}
        <AnimatePresence>
          {showEnding && (
            <motion.div
              className="signature"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="signature-line" />
              <div className="signature-text">With love ❤️</div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Card Ending / Next Action */}
        <AnimatePresence>
          {showEnding && (
            <motion.div
              className="card-ending"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <p className="ending-small">Before you go...</p>
              <p className="ending-main">There's one more thing.</p>

              <motion.button
                className="memories-button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => router.push("/memories")}
              >
                See your memories <span>→</span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom note */}
        <motion.div
          className="bottom-note"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
        >
          Made with love, just for you
        </motion.div>
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
          background: #fbf5eb;
        }

        .card-page {
          position: relative;
          min-height: 100dvh;
          width: 100%;
          overflow-x: hidden;
          background: linear-gradient(
            170deg,
            #fffdf9 0%,
            #fcf4e8 50%,
            #f7ece0 100%
          );
          color: #3f2922;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        /* Full Screen Paper Texture */
        .paper-texture {
          position: fixed;
          inset: 0;
          pointer-events: none;
          opacity: 0.35;
          background-image:
            radial-gradient(
              rgba(90, 61, 45, 0.16) 0.6px,
              transparent 0.7px
            ),
            radial-gradient(
              rgba(255, 255, 255, 0.7) 0.7px,
              transparent 0.8px
            );
          background-size:
            12px 12px,
            16px 16px;
          mix-blend-mode: multiply;
          z-index: 1;
        }

        /* Inset Page Border */
        .paper-edge {
          position: fixed;
          top: max(10px, env(safe-area-inset-top));
          bottom: max(10px, env(safe-area-inset-bottom));
          left: 10px;
          right: 10px;
          border: 1px solid rgba(112, 72, 52, 0.12);
          border-radius: 6px;
          pointer-events: none;
          z-index: 2;
        }

        .page-content {
          position: relative;
          z-index: 5;
          width: 100%;
          max-width: 500px;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: max(28px, calc(env(safe-area-inset-top) + 16px)) 24px
            max(32px, calc(env(safe-area-inset-bottom) + 20px));
        }

        /* Top Label */
        .top-label {
          margin-bottom: 12px;
          color: rgba(120, 80, 60, 0.65);
          font-family:
            Inter,
            system-ui,
            sans-serif;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          text-align: center;
        }

        /* Card Header */
        .card-symbol {
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 8px;
          color: #b35954;
          font-size: 17px;
        }

        h1 {
          margin: 0;
          color: #432820;
          font-family:
            Georgia,
            "Times New Roman",
            serif;
          font-size: 26px;
          font-weight: 500;
          line-height: 1.25;
          letter-spacing: -0.4px;
          text-align: center;
        }

        h1 span {
          display: inline-block;
          margin-left: 6px;
          font-size: 0.85em;
        }

        .little-line {
          height: 1px;
          margin: 16px 0 22px;
          background: #c58670;
        }

        /* Letter Body */
        .letter {
          width: 100%;
        }

        .letter p {
          margin: 0 0 18px;
          color: #503932;
          font-family:
            "Segoe Print",
            "Caveat",
            "Bradley Hand",
            cursive;
          font-size: 16px;
          line-height: 1.8;
          letter-spacing: 0.01em;
        }

        .letter p:last-child {
          margin-top: 4px;
          margin-bottom: 0;
          color: #432820;
          font-weight: 600;
        }

        /* Signature */
        .signature {
          width: 100%;
          margin-top: 14px;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }

        .signature-line {
          width: 65px;
          height: 1px;
          margin-bottom: 6px;
          background: rgba(108, 69, 52, 0.3);
        }

        .signature-text {
          color: #8a5a4d;
          font-family:
            "Segoe Print",
            "Caveat",
            "Bradley Hand",
            cursive;
          font-size: 14px;
          transform: rotate(-2deg);
        }

        /* Ending Section */
        .card-ending {
          width: 100%;
          margin-top: 30px;
          padding-top: 22px;
          border-top: 1px dashed rgba(112, 72, 52, 0.2);
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .ending-small {
          margin: 0 0 4px;
          color: #94756b;
          font-family:
            "Segoe Print",
            "Caveat",
            "Bradley Hand",
            cursive;
          font-size: 13px;
        }

        .ending-main {
          margin: 0 0 18px;
          color: #432820;
          font-family:
            Georgia,
            "Times New Roman",
            serif;
          font-size: 20px;
        }

        .memories-button {
          width: 100%;
          max-width: 290px;
          border: 1px solid rgba(116, 70, 54, 0.25);
          border-radius: 999px;
          padding: 13px 22px;
          background: linear-gradient(
            135deg,
            rgba(137, 76, 64, 0.98),
            rgba(110, 57, 54, 0.98)
          );
          color: #fff8f1;
          font-family:
            Inter,
            system-ui,
            sans-serif;
          font-size: 13.5px;
          letter-spacing: 0.03em;
          cursor: pointer;
          box-shadow: 0 6px 18px rgba(91, 48, 42, 0.25);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .memories-button span {
          font-size: 1.1em;
          line-height: 1;
        }

        .bottom-note {
          margin-top: 16px;
          color: rgba(120, 80, 60, 0.45);
          font-family:
            "Segoe Print",
            "Caveat",
            "Bradley Hand",
            cursive;
          font-size: 11px;
          text-align: center;
        }
      `}</style>
    </main>
  );
}