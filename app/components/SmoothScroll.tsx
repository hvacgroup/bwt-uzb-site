"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Mounts Lenis once at the app root to drive smooth, inertial scrolling.
 * Renders nothing; it only manages the scroll lifecycle.
 */
export default function SmoothScroll() {
  useEffect(() => {
    /* Inertial scroll is the single most nauseating thing on the page for
       someone with vestibular sensitivity — it keeps moving after the finger
       has stopped. Leave native scrolling alone when they've asked for less. */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return null;
}
