"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { useTranslations } from "next-intl";
import RevealText from "./anim/RevealText";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const VIEWPORT = { once: true, margin: "-80px" } as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

/** Founder block — reuses the promo namespace content, styled in the site gold palette. */
export default function Founder() {
  const t = useTranslations("promo");

  return (
    <section className="bg-bwt-ivory py-20 lg:py-28">
      <div className="mx-auto max-w-[1100px] px-6 lg:px-16">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,420px)_1fr] lg:gap-16">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            className="relative aspect-[4/5] overflow-hidden rounded-card shadow-card"
          >
            <motion.div
              initial={{ scale: 1.07 }}
              whileInView={{ scale: 1 }}
              viewport={VIEWPORT}
              transition={{ duration: 1.1, ease: EASE }}
              className="absolute inset-0"
            >
              <Image
                src="/images/founder/founder.jpg"
                alt={t("founder.imageAlt")}
                fill
                sizes="(max-width: 1024px) 100vw, 420px"
                className="object-cover"
              />
            </motion.div>
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={VIEWPORT}>
            <p className="font-sans text-xs uppercase tracking-[0.25em] text-bwt-gold-ink">
              {t("founder.eyebrow")}
            </p>
            <h2 className="mt-4 border-l-4 border-bwt-gold pl-5 font-serif text-3xl text-bwt-charcoal lg:text-4xl">
              <RevealText text={t("founder.name")} />
            </h2>
            <p className="mt-2 font-sans text-sm uppercase tracking-wider text-bwt-graphite">
              {t("founder.role")}
            </p>
            <p className="mt-6 font-sans text-lg leading-relaxed text-bwt-graphite">
              {t("founder.bio")}
            </p>
            <blockquote className="mt-8 border-l-2 border-bwt-gold pl-5 font-serif text-xl italic text-bwt-charcoal">
              {t("founder.quote")}
            </blockquote>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
