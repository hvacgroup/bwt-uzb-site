"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { useTranslations } from "next-intl";
import CountUp from "./anim/CountUp";

/* Photos of the buildings, keyed by the object name in messages/*.json.
   Piramit, NRG Voha and NRG Mirzo Ulugbek have no shot yet — those tiles
   fall back to a navy panel with the same geometry, so the grid never
   breaks rhythm. */
const PHOTOS: Record<string, string> = {
  NestOne: "/images/residences/nestone.webp",
  "NRG Hayot": "/images/residences/nrg-hayot.webp",
  "Mirabad Avenue": "/images/residences/mirabad-avenue.webp",
  "Modera Towers": "/images/residences/modera-towers.webp",
  "NRG Park": "/images/residences/nrg-park.webp",
  KISLOROD: "/images/residences/kislorod.webp",
  "Golden House": "/images/residences/golden-house.webp",
  "NRG Oybek": "/images/residences/nrg-oybek.webp",
  Amirsay: "/images/residences/amirsay.webp",
  Boulevard: "/images/residences/boulevard.webp",
  "First Village Residences": "/images/residences/first-village.webp",
  "Gardens Residence": "/images/residences/gardens-residence.webp",
  "Infinity Residence": "/images/residences/infinity-residence.webp",
};

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const VIEWPORT = { once: true, margin: "-80px" } as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

const gridContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04, delayChildren: 0.05 } },
};

const tileItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
};

type Stat = { num: string; unit: string; label: string };
type ResObject = { name: string; cat: string };

export default function PremiumResidences() {
  const t = useTranslations("residences");
  const stats = t.raw("stats") as ReadonlyArray<Stat>;
  const objects = t.raw("objects") as ReadonlyArray<ResObject>;

  return (
    <section className="bg-bwt-ivory py-20 lg:py-32">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-16">
        {/* Header */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="font-sans text-xs font-medium uppercase tracking-[0.25em] text-bwt-gold-ink"
        >
          {t("eyebrow")}
        </motion.p>

        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="mt-5 border-l-4 border-bwt-gold pl-5 max-w-[14ch] font-sans text-4xl font-extrabold leading-[1.05] tracking-tight text-bwt-charcoal lg:text-6xl"
        >
          {t("titleA")}{" "}
          <span className="font-serif text-[1.05em] font-medium italic text-bwt-gold-ink">
            {t("titleAccent")}
          </span>
        </motion.h2>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="mt-6 max-w-2xl font-sans text-lg leading-relaxed text-bwt-graphite"
        >
          {t("lead")}
        </motion.p>

        {/* Stat cards */}
        <motion.div
          variants={gridContainer}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4"
        >
          {stats.map((s) => (
            <motion.div
              key={s.label}
              variants={tileItem}
              className="rounded-card border-b-[3px] border-bwt-gold bg-bwt-cream p-7 shadow-[0_1px_3px_rgba(0,29,70,0.04)] transition-shadow duration-300 hover:shadow-[0_8px_30px_rgba(0,29,70,0.10)]"
            >
              <div className="font-sans text-5xl font-extrabold leading-none tracking-tight text-bwt-charcoal lg:text-6xl">
                <CountUp value={s.num} />
                <span className="text-2xl font-bold text-bwt-gold-ink lg:text-3xl">{s.unit}</span>
              </div>
              <div className="mt-3 font-sans text-sm leading-snug text-bwt-graphite">
                {s.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Objects header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="mt-16 flex flex-wrap items-baseline justify-between gap-3 lg:mt-24"
        >
          <h3 className="font-sans text-2xl font-bold tracking-tight text-bwt-charcoal lg:text-3xl">
            {t("objectsTitle")}
          </h3>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-bwt-gold-ink">
            {t("objectsMeta")}
          </span>
        </motion.div>

        {/* Objects grid */}
        <motion.div
          variants={gridContainer}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
        >
          {objects.map((o, i) => {
            const photo = PHOTOS[o.name];
            return (
              <motion.article
                key={o.name}
                variants={tileItem}
                className="group relative aspect-[4/3] overflow-hidden rounded-card bg-bwt-navy transition-transform duration-300 hover:-translate-y-1"
              >
                {photo ? (
                  <Image
                    src={photo}
                    alt={`${o.name} — жилой комплекс с установленными системами BWT`}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                ) : (
                  /* No shot yet — a navy panel keeps the tile the same size */
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "radial-gradient(120% 90% at 70% 10%, #0e2e5c 0%, #001d46 60%, #001233 100%)",
                    }}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-bwt-navy-dark via-bwt-navy-dark/45 to-transparent" />
                <div className="absolute left-4 top-3 font-mono text-xs tracking-widest text-bwt-gold">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <div className="font-sans text-base font-semibold leading-tight text-white">
                    {o.name}
                  </div>
                  <div className="mt-1 font-sans text-xs text-white/65">{o.cat}</div>
                </div>
              </motion.article>
            );
          })}

        </motion.div>

        {/* Private homes — a full-width band, so the tile grid stays a clean 4×4 */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 rounded-card border border-bwt-gold/30 bg-bwt-navy px-5 py-5 text-white"
        >
          <span className="font-mono text-xs tracking-widest text-bwt-gold">+</span>
          <span className="font-sans text-base font-semibold leading-tight">
            {t("moreName")}
          </span>
          <span className="font-sans text-xs text-white/60">{t("moreCat")}</span>
        </motion.div>
      </div>
    </section>
  );
}
