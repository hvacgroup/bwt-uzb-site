"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { useTranslations } from "next-intl";
import CountUp from "./anim/CountUp";
import RevealText from "./anim/RevealText";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const VIEWPORT = { once: true, margin: "-80px" } as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

const factsContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
};

export default function SlimReveal() {
  const ref = useRef<HTMLElement>(null);
  const t = useTranslations("slimReveal");
  const facts = t.raw("facts") as { stat: string; unit: string; text: string }[];

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const rotate = useTransform(scrollYProgress, [0, 1], [-4, 4]);
  const imgY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section
      ref={ref}
      className="overflow-hidden pb-20 pt-28 lg:pb-40 lg:pt-48"
      style={{ background: "linear-gradient(135deg, #ffffff 0%, #f0f1f4 100%)" }}
    >
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
          className="border-l-4 border-bwt-gold pl-5 max-w-[720px] font-serif text-4xl font-normal leading-[1.1] text-bwt-charcoal sm:text-5xl lg:text-6xl"
        >
          <RevealText text={t("title")} />
        </motion.h2>

        <div className="mt-12 grid grid-cols-1 items-center gap-10 lg:mt-20 lg:grid-cols-12 lg:gap-16">
          <motion.div style={{ rotate, y: imgY }} className="lg:col-span-7">
            <div className="relative mx-auto aspect-[5/6] max-w-md overflow-hidden rounded-card bg-white shadow-card">
              <Image
                src="/images/installations/bwt-slim-install-3.webp"
                alt="BWT Slim установлен под мойкой в премиум-кухне"
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
              />
              {/* Patented technology seal */}
              <Image
                src="/images/bwt-magnesium-patent.webp"
                alt="Запатентованная технология BWT — минерализация магнием"
                width={150}
                height={115}
                className="absolute right-3 top-3 h-16 w-auto rounded-full bg-white/85 p-1 shadow-md backdrop-blur-sm lg:h-20"
              />
            </div>
          </motion.div>

          <motion.div
            variants={factsContainer}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            className="lg:col-span-5"
          >
            {facts.map((f, i) => (
              <motion.div key={f.stat} variants={fadeUp}>
                {i > 0 && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={VIEWPORT}
                    transition={{ duration: 0.6, ease: EASE }}
                    className="my-7 h-px origin-left bg-bwt-silver"
                  />
                )}
                <div className="flex items-baseline gap-3">
                  <span className="font-serif text-5xl text-bwt-gold-ink lg:text-6xl"><CountUp value={f.stat} /></span>
                  <span className="font-sans text-sm uppercase tracking-wider text-bwt-graphite">
                    {f.unit}
                  </span>
                </div>
                <p className="mt-2 max-w-xs font-sans text-base text-bwt-graphite">{f.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="mt-16 max-w-[720px] lg:mt-24"
        >
          <div className="mb-8 h-px w-24 bg-bwt-gold" />
          <p className="font-sans text-xl leading-relaxed text-bwt-charcoal">{t("body")}</p>
          <a
            href="#technology"
            className="group mt-8 inline-flex items-center gap-2.5 font-sans text-sm font-semibold uppercase tracking-wider text-bwt-charcoal transition-colors hover:text-bwt-gold-ink"
          >
            {t("cta")}
            <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-1" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
