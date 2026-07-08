"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { brand } from "@/data/brand";
import "./LoadingScreen.css";

type LoadingScreenProps = {
  onComplete: () => void;
};

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const start = Date.now();
    const duration = 3200;

    const tick = () => {
      const elapsed = Date.now() - start;
      const p = Math.min(elapsed / duration, 1);
      setProgress(p);
      if (p < 1) {
        requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          setDone(true);
          setTimeout(onComplete, 700);
        }, 350);
      }
    };

    requestAnimationFrame(tick);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="loading-screen"
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="loading-screen__glow" aria-hidden="true" />
          <div className="loading-screen__grain" aria-hidden="true" />

          <div className="loading-screen__content">
            <motion.div
              className="loading-screen__logo-wrap"
              initial={{ opacity: 0, scale: 0.9, filter: "blur(16px)" }}
              animate={{
                opacity: 1,
                scale: 1,
                filter: "blur(0px)",
              }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div
                animate={{ scale: [1, 1.015, 1] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={brand.logo.champagne}
                  alt="Zvezda Atelier"
                  className="loading-screen__logo"
                  draggable={false}
                />
              </motion.div>
            </motion.div>

            <div className="loading-screen__progress-track" aria-hidden="true">
              <motion.div
                className="loading-screen__progress-fill"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: progress }}
                transition={{ ease: "linear", duration: 0.1 }}
              />
            </div>

            <motion.p
              className="loading-screen__caption editorial-spacing"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 0.55, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
            >
              {brand.tagline}
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
