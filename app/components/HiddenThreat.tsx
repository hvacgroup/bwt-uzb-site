"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { useTranslations } from "next-intl";
import RevealText from "./anim/RevealText";
import { imageBlurs } from "@/lib/image-blurs";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const VIEWPORT = { once: true, margin: "-80px" } as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

const listContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const fromLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: EASE } },
};

export default function HiddenThreat() {
  const t = useTranslations("hiddenThreat");
  const bullets = t.raw("bullets") as { label: string; text: string }[];
  const imgRef = useRef<HTMLDivElement>(null);
  const imgInView = useInView(imgRef, { once: true, margin: "-80px" });

  return (
    <section className="bg-bwt-ivory py-20 lg:py-40">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-16">
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="mb-6 font-sans text-xs font-medium uppercase tracking-[0.25em] text-bwt-gold-ink"
        >
          {t("eyebrow")}
        </motion.p>

        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="border-l-4 border-bwt-gold pl-5 max-w-[800px] font-serif text-4xl font-normal leading-[1.1] text-bwt-charcoal sm:text-5xl lg:text-6xl"
        >
          <RevealText text={t("title")} />
        </motion.h2>

        <div ref={imgRef} className="mt-12 grid grid-cols-1 gap-10 lg:mt-20 lg:grid-cols-2 lg:gap-16">
          {/* Left — image (clip-path reveal; observed via the unclipped grid parent,
              because a fully clipped element never intersects the viewport) */}
          <motion.div
            initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
            animate={{ clipPath: imgInView ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)" }}
            transition={{ duration: 0.9, ease: EASE }}
            className="relative aspect-[4/5] overflow-hidden rounded-img shadow-card"
          >
            <Image
              src="/images/pain_points/limescale-kettle-interior.jpg"
              alt="Накипь и отложения внутри чайника от жёсткой воды"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              placeholder="blur"
              blurDataURL={imageBlurs.limescale}
              className="object-cover object-center"
            />
          </motion.div>

          {/* Right — microcopy + bullets */}
          <div className="flex flex-col justify-center">
            <motion.p
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
              className="font-sans text-lg leading-relaxed text-bwt-graphite"
            >
              {t("intro")}
            </motion.p>

            <motion.ul
              variants={listContainer}
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
              className="mt-8 space-y-px"
            >
              {bullets.map((b) => (
                <motion.li
                  key={b.label}
                  variants={fromLeft}
                  className="flex items-start gap-4 border-b border-bwt-silver/50 py-4"
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-bwt-gold" />
                  <p className="font-sans text-base text-bwt-charcoal">
                    <span className="font-semibold">{b.label}</span>
                    <span className="text-bwt-graphite"> — {b.text}</span>
                  </p>
                </motion.li>
              ))}
            </motion.ul>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
              className="mt-8 font-serif text-xl italic text-bwt-gold-ink"
            >
              {t("closer")}
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}
