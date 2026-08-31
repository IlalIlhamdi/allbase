"use client";

import { useState, useEffect } from "react";
import { Layers } from "lucide-react";
import styles from "./LoadingScreen.module.css";

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // Disable body scrolling during initial loading screen
    document.body.style.overflow = "hidden";

    // Smooth simulated loading progression
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Accelerate smoothly towards 100%
        const remaining = 100 - prev;
        const jump = Math.max(2, Math.floor(remaining * 0.18 + Math.random() * 8));
        return Math.min(100, prev + jump);
      });
    }, 45);

    return () => {
      clearInterval(interval);
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      // Hold 100% briefly, then trigger smooth fade-out animation
      const fadeTimeout = setTimeout(() => {
        setIsFading(true);
        document.body.style.overflow = "";
      }, 160);

      // Unmount completely from DOM after transition completes
      const doneTimeout = setTimeout(() => {
        setIsDone(true);
      }, 680);

      return () => {
        clearTimeout(fadeTimeout);
        clearTimeout(doneTimeout);
      };
    }
  }, [progress]);

  if (isDone) return null;

  return (
    <div
      className={`${styles.loadingOverlay} ${isFading ? styles.loadingOverlayHidden : ""}`}
      aria-hidden={isFading}
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {/* Ambient background glows */}
      <div className={styles.ambientBackdrop} aria-hidden="true">
        <div className={styles.glowOrb1} />
        <div className={styles.glowOrb2} />
      </div>

      {/* Main card box */}
      <div className={styles.contentBox}>
        {/* Animated Brand Logo */}
        <div className={styles.logoWrapper}>
          <div className={styles.logoRing} />
          <div className={styles.logoInner}>
            <Layers size={32} />
          </div>
        </div>

        {/* Brand Name */}
        <h2 className={styles.brandName}>
          ALLBASE <span className={styles.brandHighlight}>HUB</span>
        </h2>

        {/* Subtitle */}
        <p className={styles.subtitle}>Network • Technology • Development</p>

        {/* Progress Bar System */}
        <div className={styles.progressContainer}>
          <div className={styles.progressBarBg}>
            <div
              className={styles.progressBarFill}
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className={styles.progressText}>{progress}%</span>
        </div>
      </div>
    </div>
  );
}
