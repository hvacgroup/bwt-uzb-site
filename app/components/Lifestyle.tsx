"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { useTranslations } from "next-intl";
import RevealText from "./anim/RevealText";
import { imageBlurs } from "@/lib/image-blurs";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const VIEWPORT = { once: true, margin: "-80px" } as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

const gridContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const cardItem: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

// Layout (span + gradient) stays in the component; text comes from the catalog.
const STYLES = [
  { span: "lg:row-span-2", img: "/images/lifestyle/bwt-pouring-water.webp", key: "morning" }, // Утро
  { span: "lg:col-span-2", img: "/images/lifestyle/bwt-coffee.webp", key: "guests" }, // Чай и кофе для гостей
  { span: "", img: "/images/lifestyle/bwt-cooking-salad.webp", key: "cooking" }, // Готовка
  { span: "", img: "/images/lifestyle/kids-drinking-water.jpg", key: "kids" }, // Дети
  { span: "lg:col-span-2", img: "/images/lifestyle/bwt-hands-tap.webp", key: "calm" }, // Спокойствие
  { span: "", img: "/images/pain_points/limescale-kettle-interior.jpg", key: "limescale" }, // Техника
] as const;

export default function Lifestyle() {
  const t = useTranslations("lifestyle");
  const cards = t.raw("cards") as { title: string; text: string }[];

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
          className="border-l-4 border-bwt-gold pl-5 max-w-[720px] font-serif text-4xl font-normal leading-[1.1] text-bwt-charcoal sm:text-5xl lg:text-6xl"
        >
          <RevealText text={t("title")} />
        </motion.h2>

        <motion.div
          variants={gridContainer}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="mt-12 grid auto-rows-[180px] grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-20 lg:auto-rows-[230px] lg:grid-cols-3"
        >
          {cards.map((c, i) => {
            const st = STYLES[i];
            return (
              <motion.article
                key={c.title}
                variants={cardItem}
                className={`group relative overflow-hidden rounded-card ${st.span}`}
              >
                <Image
                  src={st.img}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  placeholder="blur"
                  blurDataURL={imageBlurs[st.key]}
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bwt-navy-dark/85 via-bwt-navy-dark/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 transition-transform duration-500 group-hover:-translate-y-1">
                  <h3 className="font-serif text-2xl text-bwt-ivory">{c.title}</h3>
                  <p className="mt-1 max-w-xs font-sans text-sm leading-relaxed text-bwt-ivory/70">
                    {c.text}
                  </p>
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
