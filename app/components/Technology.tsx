"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { motion, type Variants } from "framer-motion";
import { Droplet } from "lucide-react";
import { useTranslations } from "next-intl";
import RevealText from "./anim/RevealText";
import Certifications from "@/app/components/Certifications";
import SlimSceneMount from "@/app/components/three/SlimSceneMount";
import StageClip from "@/app/components/three/StageClip";

/* Phones never mount the filtration column. They get the same stage clips
   (StageClip, poster first, clip on reach); the vector stage art is only the
   fallback for reduced motion or a clip that failed to load. */
const StageArt = dynamic(() => import("@/app/components/three/StageArt"), {
  ssr: false,
});

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const VIEWPORT = { once: true, margin: "-80px" } as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};


// Minimalist gold outline icons, one per stage (B6).
const IC = "h-28 w-28";
const STAGE_ICONS = [
  // 01 Механика — sieve grid + particles
  <svg key="0" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={IC}>
    <rect x="9" y="9" width="30" height="30" rx="4" />
    <path d="M9 19h30M9 29h30M19 9v30M29 9v30" />
    <circle cx="14" cy="14" r="1.3" fill="currentColor" stroke="none" />
    <circle cx="34" cy="14" r="1.3" fill="currentColor" stroke="none" />
    <circle cx="34" cy="34" r="1.3" fill="currentColor" stroke="none" />
  </svg>,
  // 02 Уголь — granules
  <svg key="1" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={IC}>
    <circle cx="17" cy="19" r="5" />
    <circle cx="30" cy="15" r="4" />
    <circle cx="25" cy="29" r="6" />
    <circle cx="35" cy="31" r="3.5" />
    <circle cx="14" cy="32" r="3" />
  </svg>,
  // 03 Умягчение — ion exchange (opposing arrows + ions)
  <svg key="2" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={IC}>
    <path d="M10 18h22M27 13l5 5-5 5" />
    <path d="M38 30H16m5-5-5 5 5 5" />
    <circle cx="11" cy="30" r="2.5" />
    <circle cx="37" cy="18" r="2.5" />
  </svg>,
  // 04 Мембрана — layered membrane + droplet
  <svg key="3" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={IC}>
    <path d="M18 8v32M23 8v32M28 8v32" />
    <path d="M10 16c2 1 4 1 6 0M10 24c2 1 4 1 6 0M10 32c2 1 4 1 6 0" />
    <path d="M37 18s-4 5-4 8a4 4 0 0 0 8 0c0-3-4-8-4-8z" />
  </svg>,
  // 05 Магний — Mg in circle
  <svg key="4" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={IC}>
    <circle cx="24" cy="24" r="15" />
    <text x="24" y="29" textAnchor="middle" fontSize="13" fontFamily="serif" fill="currentColor" stroke="none">Mg</text>
  </svg>,
  // 06 Вкус — droplet + sparkle
  <svg key="5" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={IC}>
    <path d="M22 10s-9 11-9 18a9 9 0 0 0 18 0c0-7-9-18-9-18z" />
    <path d="M35 12l1.3 3.2 3.2 1.3-3.2 1.3L35 22l-1.3-3.2L30.5 17.5l3.2-1.3z" fill="currentColor" stroke="none" />
  </svg>,
];

type Stage = { n: string; short: string; title: string; text: string; badge?: string };

function FilterViz({
  active,
  stages,
  waterIn,
  waterOut,
}: {
  active: number;
  stages: Stage[];
  waterIn: string;
  waterOut: string;
}) {
  return (
    <div className="w-48">
      <div className="flex flex-col items-center gap-1 text-bwt-ivory/40">
        <Droplet className="h-6 w-6" strokeWidth={1.5} />
        <span className="font-sans text-[0.6rem] uppercase tracking-[0.25em]">{waterIn}</span>
      </div>

      <div className="my-4 overflow-hidden rounded-[1.75rem] border border-white/15">
        {stages.map((s, i) => {
          const on = active === i;
          return (
            <div
              key={s.n}
              className={`relative flex h-20 items-center gap-4 px-5 transition-colors duration-500 ${
                on ? "bg-bwt-gold/15" : "bg-white/[0.02]"
              } ${i > 0 ? "border-t border-white/10" : ""}`}
            >
              <span
                className={`absolute left-0 top-0 h-full w-1 origin-top bg-bwt-gold transition-transform duration-500 ${
                  on ? "scale-y-100" : "scale-y-0"
                }`}
              />
              <span
                className={`font-serif text-2xl transition-colors duration-500 ${
                  on ? "text-bwt-gold" : "text-bwt-ivory/30"
                }`}
              >
                {s.n}
              </span>
              <span
                className={`font-sans text-xs uppercase tracking-wider transition-colors duration-500 ${
                  on ? "text-bwt-ivory" : "text-bwt-ivory/30"
                }`}
              >
                {s.short}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col items-center gap-1 text-bwt-gold">
        <Droplet className="h-6 w-6" strokeWidth={1.5} />
        <span className="font-sans text-[0.6rem] uppercase tracking-[0.25em]">{waterOut}</span>
      </div>
    </div>
  );
}

export default function Technology() {
  const [active, setActive] = useState(0);
  const t = useTranslations("technology");
  const raw = t.raw("stages") as { short: string; title: string; text: string; badge?: string }[];
  const stages: Stage[] = raw.map((s, i) => ({ ...s, n: String(i + 1).padStart(2, "0") }));

  return (
    <section id="technology" className="bg-bwt-navy text-bwt-ivory">
      <div className="mx-auto max-w-[1440px] px-6 pt-20 lg:px-16 lg:pt-40">
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="mb-6 font-sans text-xs font-medium uppercase tracking-[0.25em] text-bwt-gold"
        >
          {t("eyebrow")}
        </motion.p>
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="border-l-4 border-bwt-gold pl-5 max-w-[720px] font-serif text-4xl font-normal leading-[1.1] text-bwt-ivory sm:text-5xl lg:text-6xl"
        >
          <RevealText text={t("title")} />
        </motion.h2>

        <div className="mt-12 lg:mt-16 lg:grid lg:grid-cols-2 lg:gap-16">
          <div className="hidden lg:block">
            <div className="sticky top-24 h-[calc(100vh-6rem)]">
              {/* Animated filtration schematic; ?viz=3d and ?viz=photo swap in
                  the WebGL scene / product photo. FilterViz is the static
                  fallback for reduced motion. */}
              <SlimSceneMount
                active={active}
                schema={{ stages, waterIn: t("waterIn"), waterOut: t("waterOut") }}
                fallback={
                  <div className="flex h-full items-center justify-center">
                    <FilterViz
                      active={active}
                      stages={stages}
                      waterIn={t("waterIn")}
                      waterOut={t("waterOut")}
                    />
                  </div>
                }
              />
            </div>
          </div>

          <div>
            {stages.map((s, i) => (
              <motion.div
                key={s.n}
                onViewportEnter={() => setActive(i)}
                viewport={{ margin: "-45% 0px -45% 0px" }}
                className={`flex min-h-[55vh] flex-col justify-center border-t border-white/10 py-10 transition-opacity duration-500 first:border-t-0 lg:min-h-[90vh] lg:border-t-0 ${
                  active === i ? "lg:opacity-100" : "lg:opacity-40"
                }`}
              >
                <span className="font-sans text-sm uppercase tracking-[0.25em] text-bwt-gold">
                  {t("stepLabel")} {s.n}
                </span>
                <h3 className="mt-4 font-serif text-3xl text-bwt-ivory lg:text-4xl">{s.title}</h3>
                <p className="mt-4 max-w-md font-sans text-lg leading-relaxed text-bwt-ivory/70">
                  {s.text}
                </p>
                {s.badge && (
                  <span className="mt-5 inline-flex w-fit items-center rounded-full border border-bwt-gold/40 bg-bwt-gold/10 px-3.5 py-1 font-sans text-xs font-medium uppercase tracking-wider text-bwt-gold">
                    {s.badge}
                  </span>
                )}
                {/* Mobile gets the same stage clips as the desktop panel: the
                    poster frame shows at once, the clip loads and plays only for
                    the stage in view. Without video (reduced motion / load error)
                    the active stage animates as SVG, the rest hold a line icon. */}
                <div className="relative mt-9 aspect-square w-full max-w-[340px] overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.03] lg:hidden">
                  <div className="pointer-events-none absolute inset-8 rounded-full bg-bwt-gold/10 blur-2xl" />
                  <StageClip
                    index={i}
                    active={active === i}
                    fallback={
                      active === i ? (
                        <div className="absolute inset-3">
                          <StageArt index={i} />
                        </div>
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-bwt-gold/50">
                          {STAGE_ICONS[i]}
                        </div>
                      )
                    }
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="mx-auto max-w-[820px] py-20 text-center font-serif text-2xl italic leading-snug text-bwt-ivory lg:py-32 lg:text-4xl"
        >
          {t("closer")}
        </motion.p>

        <Certifications className="pb-20 lg:pb-32" />
      </div>
    </section>
  );
}
