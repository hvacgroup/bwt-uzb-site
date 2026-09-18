"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { useTranslations } from "next-intl";
import RevealText from "./anim/RevealText";
import CountUp from "./anim/CountUp";
import { useFocusTrap } from "@/app/hooks/useFocusTrap";
import { ArrowUpRight, Play, X } from "lucide-react";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const VIEWPORT = { once: true, margin: "-80px" } as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};
const grid: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const IMAGES = [
  "/images/mission/fatima-pink-tap.webp",
  "/images/mission/technician.webp",
  "/images/mission/africa-village.webp",
];

const VIDEOS = [
  {
    src: "/videos/aqua-pearls-mission.mp4",
    poster: "/images/mission/aqua-pearls-mission-poster.webp",
  },
  {
    src: "/videos/best-water-run-2025.mp4",
    poster: "/images/mission/best-water-run-2025-poster.webp",
  },
  {
    src: "/videos/best-water-run-2026.mp4",
    poster: "/images/mission/best-water-run-2026-poster.webp",
  },
];

export default function ChangeTheWorld() {
  const t = useTranslations("changeWorld");
  const stats = t.raw("stats") as { num: string; label: string }[];
  const imgAlts = t.raw("imgAlts") as string[];
  const videoTitles = t.raw("videoTitles") as string[];
  const [active, setActive] = useState<string | null>(null);

  const close = useCallback(() => setActive(null), []);
  const dialogRef = useFocusTrap(Boolean(active), close);

  return (
    <section className="bg-bwt-navy py-20 text-bwt-ivory lg:py-32">
      <div className="mx-auto max-w-[1100px] px-6 lg:px-16">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="max-w-[760px]"
        >
          <p className="font-sans text-xs uppercase tracking-[0.25em] text-bwt-gold">{t("eyebrow")}</p>
          <h2 className="mt-5 border-l-4 border-bwt-gold pl-5 font-serif text-3xl font-normal leading-[1.15] lg:text-5xl">
            <RevealText text={t("title")} />
          </h2>
          <p className="mt-6 font-sans text-lg leading-relaxed text-bwt-ivory/70">{t("lead")}</p>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:mt-16"
        >
          {stats.map((s) => (
            <div key={s.label} className="border-l-2 border-bwt-gold/40 pl-6">
              <div className="font-serif text-5xl text-bwt-gold lg:text-6xl"><CountUp value={s.num} /></div>
              <p className="mt-2 font-sans text-sm uppercase tracking-wider text-bwt-ivory/65">
                {s.label}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Image gallery — mission in action */}
        <p className="mt-16 font-sans text-xs uppercase tracking-[0.25em] text-bwt-gold/80">
          {t("mediaImagesTitle")}
        </p>
        <motion.div
          variants={grid}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-6"
        >
          {IMAGES.map((src, i) => (
            <motion.div
              key={src}
              variants={fadeUp}
              className={`relative aspect-[4/3] overflow-hidden rounded-card ${
                i === 2 ? "col-span-2 lg:col-span-1" : ""
              }`}
            >
              <Image
                src={src}
                alt={imgAlts[i] ?? "BWT water mission"}
                fill
                sizes="(max-width: 1024px) 50vw, 33vw"
                className="object-cover"
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Video gallery */}
        <p className="mt-12 font-sans text-xs uppercase tracking-[0.25em] text-bwt-gold/80">
          {t("mediaVideosTitle")}
        </p>
        <motion.div
          variants={grid}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3 lg:gap-6"
        >
          {VIDEOS.map((v, i) => (
            <motion.button
              key={v.src}
              type="button"
              variants={fadeUp}
              onClick={() => setActive(v.src)}
              aria-label={`${t("watch")} — ${videoTitles[i]}`}
              className="group relative aspect-video overflow-hidden rounded-card text-left"
            >
              <Image
                src={v.poster}
                alt={videoTitles[i] ?? "BWT video"}
                fill
                sizes="(max-width: 640px) 100vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute inset-0 bg-bwt-navy-dark/35 transition-colors group-hover:bg-bwt-navy-dark/20" />
              <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-bwt-gold text-bwt-navy-dark shadow-lg transition-transform duration-300 group-hover:scale-110">
                <Play className="h-6 w-6 translate-x-[1px] fill-current" />
              </span>
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-bwt-navy-dark/85 to-transparent p-4 pt-10 font-sans text-sm font-medium text-bwt-ivory">
                {videoTitles[i]}
              </span>
            </motion.button>
          ))}
        </motion.div>

        {/* Links + brand line */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="mt-12 flex flex-col items-start gap-6 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex flex-wrap gap-4">
            <a
              href="https://www.aquapearls.org/en/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-btn border border-bwt-gold/40 px-6 py-3 font-sans text-sm font-semibold uppercase tracking-wider text-bwt-ivory transition-colors hover:border-bwt-gold hover:text-bwt-gold"
            >
              {t("linkProject")} <ArrowUpRight className="h-4 w-4" />
            </a>
            <a
              href="https://ewater.services/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-btn border border-bwt-ivory/20 px-6 py-3 font-sans text-sm font-semibold uppercase tracking-wider text-bwt-ivory/80 transition-colors hover:border-bwt-gold hover:text-bwt-gold"
            >
              {t("linkMonitor")} <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
          <p className="shrink-0 font-serif text-lg italic text-bwt-gold">{t("brandLine")}</p>
        </motion.div>
      </div>

      {/* Video lightbox */}
      {active && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-bwt-navy-dark/92 p-4"
          onClick={close}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={t("dialogLabel")}
            className="relative w-full max-w-[1000px]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={close}
              aria-label={t("close")}
              className="absolute -top-14 right-0 flex h-11 w-11 items-center justify-center rounded-full border border-bwt-ivory/30 text-bwt-ivory transition-colors hover:border-bwt-gold hover:text-bwt-gold"
            >
              <X className="h-5 w-5" />
            </button>
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <video
              src={active}
              controls
              autoPlay
              playsInline
              preload="none"
              className="mx-auto max-h-[85vh] w-auto max-w-full rounded-card bg-black"
            />
          </div>
        </div>
      )}
    </section>
  );
}
