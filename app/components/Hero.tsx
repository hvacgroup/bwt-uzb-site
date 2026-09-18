"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion, type Variants } from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { imageBlurs } from "@/lib/image-blurs";
import RevealText from "./anim/RevealText";
import Magnetic from "./anim/Magnetic";
import CountUp from "./anim/CountUp";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

/* Deterministic bubble field — same on server and client. */
const BUBBLES = [
  { left: 8, size: 10, dur: 21, delay: 0, dx: 26 },
  { left: 19, size: 5, dur: 16, delay: 3.5, dx: -18 },
  { left: 31, size: 14, dur: 26, delay: 7, dx: 34 },
  { left: 44, size: 7, dur: 19, delay: 1.5, dx: -24 },
  { left: 57, size: 11, dur: 23, delay: 9, dx: 20 },
  { left: 68, size: 6, dur: 17, delay: 5, dx: -30 },
  { left: 79, size: 16, dur: 29, delay: 2.5, dx: 16 },
  { left: 90, size: 8, dur: 20, delay: 11, dx: -14 },
];

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const t = useTranslations("hero");
  const tb = useTranslations("buttons");
  const locale = useLocale();
  const facts = t.raw("facts") as { value: string; label: string }[];

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  /* Scroll-linked parallax is not covered by MotionConfig — useTransform maps
     values directly, so the ranges have to collapse by hand. */
  const reduced = useReducedMotion();
  const contentY = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [0, 120]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], reduced ? [1, 1] : [1, 0]);
  const bgY = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [0, 200]);

  return (
    <section
      ref={ref}
      className="relative isolate min-h-svh w-full overflow-hidden bg-bwt-navy"
    >
      {/* Layer 1 — animated background (scroll parallax + slow push-in) */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 -z-20">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 80% at 70% 15%, #0e2e5c 0%, #001d46 45%, #001233 100%)",
          }}
        />
        <div className="hero-kenburns absolute inset-0">
          <Image
            src="/images/hero/bwt-water-spring-hero.webp"
            alt=""
            fill
            priority
            sizes="100vw"
            placeholder="blur"
            blurDataURL={imageBlurs.heroSpring}
            className="object-cover object-center"
          />
        </div>

        {/* caustics — light moving over water */}
        <div
          className="hero-caustics absolute -inset-[10%]"
          style={{
            background:
              "radial-gradient(38% 28% at 30% 35%, rgba(207,227,251,0.55) 0%, transparent 60%), radial-gradient(30% 22% at 72% 55%, rgba(240,135,182,0.35) 0%, transparent 62%)",
          }}
        />
        <div
          className="hero-caustics-b absolute -inset-[10%]"
          style={{
            background:
              "radial-gradient(34% 26% at 62% 22%, rgba(255,255,255,0.45) 0%, transparent 58%), radial-gradient(26% 20% at 22% 72%, rgba(159,203,247,0.4) 0%, transparent 60%)",
          }}
        />

        <div className="hero-float absolute -top-1/4 right-[-10%] h-[60vh] w-[60vh] rounded-full bg-bwt-aqua/10 blur-[120px]" />
        <div className="hero-float-slow absolute bottom-[-15%] left-[-5%] h-[50vh] w-[50vh] rounded-full bg-bwt-gold/10 blur-[120px]" />
      </motion.div>

      {/* Layer 1b — bubbles rising through the frame */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {BUBBLES.map((b, i) => (
          <span
            key={i}
            className="hero-bubble absolute bottom-[-8vh] rounded-full border border-white/25 bg-white/10"
            style={
              {
                left: `${b.left}%`,
                height: b.size,
                width: b.size,
                "--dur": `${b.dur}s`,
                "--delay": `${b.delay}s`,
                "--dx": `${b.dx}px`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      {/* Layer 2a — left block keeps the headline legible over the photo */}
      <div className="absolute inset-0 bg-gradient-to-r from-bwt-navy from-0% via-bwt-navy/88 via-42% to-bwt-navy/25 to-100%" />

      {/* Layer 2b — bottom darkening under the SCROLL cue */}
      <div className="absolute inset-0 bg-gradient-to-t from-bwt-navy/60 via-transparent to-transparent" />

      {/* Layer 3 — content */}
      {/* pt clears the fixed 64px header, pb keeps the scroll cue off the facts —
          on a phone the block is taller than one screen, so it must not be centred
          into the chrome. */}
      <div className="relative z-10 mx-auto flex min-h-svh max-w-[1440px] flex-col justify-center px-6 pb-24 pt-24 sm:pb-28 lg:px-16 lg:pb-0 lg:pt-0">
        <motion.div style={{ y: contentY, opacity: contentOpacity }} className="max-w-3xl">
          <motion.div variants={container} initial="hidden" animate="show">
            <motion.div variants={fadeUp} className="mb-6 flex items-center gap-3.5">
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
                className="block h-[3px] w-10 origin-left bg-bwt-gold"
              />
              <p className="font-sans text-xs font-medium uppercase tracking-[0.25em] text-bwt-gold">
                {t("eyebrow")}
              </p>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="font-serif text-[2.7rem] font-normal leading-[1.06] text-bwt-ivory min-[400px]:text-[3.1rem] sm:text-6xl sm:leading-[1.04] md:text-7xl lg:text-[5.5rem]"
            >
              <RevealText text={t("title")} delay={0.2} stagger={0.07} />
            </motion.h1>

            {locale === "uz" && (
              <motion.p
                variants={fadeUp}
                className="mt-5 font-sans text-lg text-bwt-ivory/60 sm:text-xl"
              >
                {t("subtitleRu")}
              </motion.p>
            )}

            <motion.p
              variants={fadeUp}
              className="mt-6 max-w-xl font-sans text-base leading-relaxed text-bwt-ivory/85 sm:text-lg"
            >
              {t("body")}
            </motion.p>

            <motion.div variants={fadeUp} className="mt-8 sm:mt-10">
              <Magnetic>
                <span className="relative inline-flex">
                  <span className="hero-cta-pulse pointer-events-none absolute -inset-2 rounded-btn bg-bwt-gold/40 blur-lg" />
                  <Link
                    href="/request"
                    className="group relative inline-flex items-center gap-2.5 rounded-btn bg-bwt-gold px-8 py-[1.15rem] font-sans text-sm font-semibold uppercase tracking-wider text-bwt-navy-dark transition-colors hover:bg-bwt-gold-light"
                  >
                    {tb("submitRequest")}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </span>
              </Magnetic>
            </motion.div>

            {/* Trust strip — three facts, numbers count up on load.
                A three-column grid on phones: the old flex-wrap let long labels
                spill out of their 92px track and collide with the next fact. */}
            <motion.div
              variants={fadeUp}
              className="mt-9 grid grid-cols-3 gap-x-4 gap-y-6 border-t border-white/12 pt-6 sm:flex sm:flex-wrap sm:items-start sm:gap-x-10 lg:mt-12 lg:pt-7"
            >
              {facts.map((f) => (
                <div key={f.label} className="sm:min-w-[92px]">
                  <div className="font-sans text-2xl font-bold leading-none text-bwt-ivory sm:text-3xl">
                    <CountUp value={f.value} />
                  </div>
                  <div className="mt-2 font-sans text-[0.6rem] uppercase leading-snug tracking-[0.1em] text-bwt-ivory/55 sm:max-w-[150px] sm:text-[0.7rem] sm:tracking-[0.14em]">
                    {f.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        /* Hidden on phones: the hero already overflows there and the cue landed
           on top of the facts strip. */
        className="absolute bottom-10 left-1/2 hidden -translate-x-1/2 sm:block"
      >
        <div className="flex flex-col items-center gap-3 text-bwt-ivory/50">
          <span className="font-sans text-[0.65rem] uppercase tracking-[0.3em]">
            {t("scroll")}
          </span>
          <span className="hero-scroll-cue block h-10 w-px bg-gradient-to-b from-bwt-gold to-transparent" />
        </div>
      </motion.div>
    </section>
  );
}
