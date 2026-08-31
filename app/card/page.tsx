// app/card/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const birthdayMessage = `Dear Dada Sophia ❤️

It’s your special day and honestly, I don’t even know where to begin because there is so much, I want to say to you. ❤️

I could sit here and write so many things about you, and I still don’t think I would be able to fully explain how much you mean to me
You are not just my sister. You have been a guide, someone I can look up to, someone who has helped me through different moments in my life, and someone who has always given me reasons to keep going and become a better version of myself.

When I look at where I am today, I realize that some of the person I’m becoming is because of the people who believed in me, encouraged me, guided me, and pushed me when I needed it and you are one of those people.
I may not always say it, I may not always know how to express it, But I notice it. I appreciate it. So, I’m truly grateful for you.
I’m honestly so lucky to have you as my sister. ❤️

So today, I don’t just wish you a happy birthday.
I pray that God gives you a long, beautiful, and blessed life
And I hope that years from now, we will still be here celebrating your birthday together ❤️

I know I could keep going forever, because I have so much more I want to say. But maybe some things don’t need to be said perfectly.

Just know that I love you.

I appreciate you.

I’m proud to call you, my sister.


Happy Birthday, Dada Sophia. 🎂❤️

I love you so, so much. ❤️`;

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
      {/* =====================================================
          BACKGROUND: PURE BLACK NIGHT SKY & TWINKLING STARS
      ====================================================== */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-black">
        {/* Ambient Glow */}
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

      {/* Decorative Inset Glowing Border */}
      <div className="card-edge" />

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
                Continue <span>→</span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
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
          background: #000000;
        }

        .card-page {
          position: relative;
          min-height: 100dvh;
          width: 100%;
          overflow-x: hidden;
          background: #000000;
          color: #ffffff;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        /* Inset Page Border */
        .card-edge {
          position: fixed;
          top: max(10px, env(safe-area-inset-top));
          bottom: max(10px, env(safe-area-inset-bottom));
          left: 10px;
          right: 10px;
          border: 1px solid rgba(244, 114, 182, 0.15);
          border-radius: 8px;
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
          color: rgba(255, 255, 255, 0.45);
          font-family: Inter, system-ui, sans-serif;
          font-size: 10px;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          text-align: center;
        }

        /* Card Symbol */
        .card-symbol {
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 8px;
          color: #f472b6;
          font-size: 17px;
        }

        .little-line {
          height: 1px;
          margin: 16px 0 22px;
          background: rgba(244, 114, 182, 0.3);
        }

        /* Letter Body */
        .letter {
          width: 100%;
        }

        .letter p {
          margin: 0 0 18px;
          color: rgba(255, 255, 255, 0.88);
          font-family: "Segoe Print", "Caveat", "Bradley Hand", cursive;
          font-size: 16px;
          line-height: 1.8;
          letter-spacing: 0.01em;
        }

        .letter p:last-child {
          margin-top: 4px;
          margin-bottom: 0;
          color: #fbcfe8;
          font-weight: 600;
        }

        /* Ending Section */
        .card-ending {
          width: 100%;
          margin-top: 30px;
          padding-top: 22px;
          border-top: 1px dashed rgba(244, 114, 182, 0.2);
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .ending-small {
          margin: 0 0 4px;
          color: rgba(255, 255, 255, 0.45);
          font-family: "Segoe Print", "Caveat", "Bradley Hand", cursive;
          font-size: 13px;
        }

        .ending-main {
          margin: 0 0 18px;
          color: #fdf2f8;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 20px;
        }

        .memories-button {
          width: 100%;
          max-width: 290px;
          border: 1px solid rgba(244, 114, 182, 0.25);
          border-radius: 999px;
          padding: 13px 22px;
          background: rgba(255, 255, 255, 0.07);
          color: #ffffff;
          font-family: Inter, system-ui, sans-serif;
          font-size: 13.5px;
          letter-spacing: 0.03em;
          cursor: pointer;
          backdrop-filter: blur(12px);
          box-shadow: 0 0 25px rgba(244, 114, 182, 0.15);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: all 0.2s ease;
        }

        .memories-button:hover {
          background: rgba(255, 255, 255, 0.12);
          border-color: rgba(244, 114, 182, 0.4);
        }

        .memories-button span {
          font-size: 1.1em;
          line-height: 1;
        }
      `}</style>
    </main>
  );
}