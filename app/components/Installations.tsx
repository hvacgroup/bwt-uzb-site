"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { useTranslations } from "next-intl";
import RevealText from "./anim/RevealText";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const VIEWPORT = { once: true, margin: "-80px" } as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};
const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const PHOTOS = [
  "/images/installations/bwt-slim-install-1.webp",
  "/images/installations/bwt-slim-install-2.webp",
  "/images/installations/bwt-slim-install-4.webp",
  "/images/installations/bwt-slim-install-3.webp",
];

/** Real BWT Slim under-sink installations gallery. */
export default function Installations() {
  const t = useTranslations("installations");

  return (
    <section className="bg-bwt-ivory py-20 lg:py-28">
      <div className="mx-auto max-w-[1180px] px-6 lg:px-16">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="max-w-[760px]"
        >
          <p className="font-sans text-xs uppercase tracking-[0.25em] text-bwt-gold-ink">
            {t("eyebrow")}
          </p>
          <h2 className="mt-4 border-l-4 border-bwt-gold pl-5 font-serif text-3xl font-normal leading-[1.15] text-bwt-charcoal lg:text-4xl">
            <RevealText text={t("title")} />
          </h2>
          <p className="mt-5 font-sans text-lg leading-relaxed text-bwt-graphite">{t("lead")}</p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="mt-10 grid grid-cols-2 gap-4 lg:mt-14 lg:grid-cols-4 lg:gap-6"
        >
          {PHOTOS.map((src, i) => (
            <motion.div
              key={src}
              variants={fadeUp}
              className="relative aspect-[3/4] overflow-hidden rounded-card shadow-card"
            >
              <Image
                src={src}
                alt={`Реальный монтаж BWT Slim под мойкой — пример ${i + 1}`}
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 hover:scale-105"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
