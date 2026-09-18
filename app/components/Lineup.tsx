"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Check, ChevronLeft, ChevronRight, ArrowRight, RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";
import RevealText from "./anim/RevealText";
import { Link } from "@/i18n/navigation";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const VIEWPORT = { once: true, margin: "-80px" } as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

const tiersContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const tierCard: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

const TIERS_META = [
  { id: "slim2", name: "BWT Slim 2", popular: false },
  { id: "slim3", name: "BWT Slim 3", popular: false },
  { id: "slim4", name: "BWT Slim 4", popular: true },
];

const PRODUCT: Record<string, { src: string; w: number; h: number }> = {
  slim2: { src: "/images/products/slim-2.webp", w: 295, h: 418 },
  slim3: { src: "/images/products/slim-3.webp", w: 392, h: 314 },
  slim4: { src: "/images/products/slim-4.webp", w: 295, h: 418 },
};

const TOTAL = 3;

// Recommendation is driven entirely by Step 3 (what matters most).
// needs: 0=накипь, 1=кожа/волосы, 2=питьевая для детей, 3=премиум-вкус, 4=здоровье пожилых, 5=не уверен
function recommendIndex(needs: number[]): number {
  if (needs.includes(3) || needs.includes(4)) return 2; // премиум-вкус / здоровье пожилых → Slim 4
  if (needs.includes(0) || needs.includes(1)) return 1; // накипь / кожа-волосы → Slim 3
  if (needs.includes(2)) return 0; // только питьевая для детей → Slim 2
  return 2; // пусто / «не уверен» → Slim 4 (популярный)
}

export default function Lineup() {
  const t = useTranslations("lineup");
  const tiersText = t.raw("tiers") as { tagline: string; features: string[] }[];
  const steps = t.raw("steps") as { q: string; options: string[] }[];
  const needsList = t.raw("needs") as string[];

  const [step, setStep] = useState(0);
  const [single, setSingle] = useState<number[]>([]);
  const [needs, setNeeds] = useState<number[]>([]);
  const finished = step >= TOTAL;

  const pickSingle = (i: number) => {
    const next = [...single];
    next[step] = i;
    setSingle(next);
    setStep(step + 1);
  };
  const toggleNeed = (i: number) =>
    setNeeds((cur) => (cur.includes(i) ? cur.filter((x) => x !== i) : [...cur, i]));
  const reset = () => {
    setSingle([]);
    setNeeds([]);
    setStep(0);
  };

  const resultIdx = finished ? recommendIndex(needs) : 0;
  const meta = TIERS_META[resultIdx];

  return (
    <section className="bg-bwt-cream py-20 lg:py-40">
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

        {/* Tier cards */}
        <motion.div
          variants={tiersContainer}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="mt-12 grid grid-cols-1 gap-6 lg:mt-16 lg:grid-cols-3"
        >
          {TIERS_META.map((tier, i) => (
            <motion.div
              key={tier.id}
              variants={tierCard}
              className={`relative flex flex-col rounded-card border border-b-[3px] border-b-bwt-gold bg-bwt-ivory p-8 transition-shadow hover:shadow-card ${
                /* margin, not translate: framer-motion owns this element's
                   transform while the card animates in */
                tier.popular ? "border-bwt-gold shadow-card lg:-mt-3 lg:mb-3" : "border-bwt-silver/60"
              }`}
            >
              {tier.popular && (
                <span className="absolute -top-3 left-8 rounded-btn bg-bwt-gold px-3 py-1 font-sans text-[0.65rem] font-semibold uppercase tracking-wider text-bwt-navy-dark">
                  {t("popular")}
                </span>
              )}
              <div className="mb-6 flex h-[200px] items-center justify-center">
                <Image
                  src={PRODUCT[tier.id].src}
                  alt={tier.name}
                  width={PRODUCT[tier.id].w}
                  height={PRODUCT[tier.id].h}
                  sizes="360px"
                  className="max-h-[200px] w-auto object-contain"
                />
              </div>
              <div className="flex items-baseline gap-2">
                <h3 className="font-serif text-3xl text-bwt-charcoal">{tier.name}</h3>
              </div>
              <p className="mt-1 font-sans text-sm uppercase tracking-wider text-bwt-graphite">
                {tiersText[i].tagline}
              </p>
              <ul className="mt-6 flex-1 space-y-3">
                {tiersText[i].features.map((f) => (
                  <li key={f} className="flex items-start gap-3 font-sans text-sm text-bwt-charcoal">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-bwt-gold-ink" strokeWidth={2.5} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/request"
                className={`mt-8 inline-flex items-center justify-center gap-2 rounded-btn px-6 py-3.5 font-sans text-sm font-semibold uppercase tracking-wider transition-colors ${
                  tier.popular
                    ? "bg-bwt-gold text-bwt-navy-dark hover:bg-bwt-gold-light"
                    : "border border-bwt-charcoal/20 text-bwt-charcoal hover:border-bwt-gold hover:text-bwt-gold-ink"
                }`}
              >
                {t("learnPrice")}
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Calculator */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="mt-20 lg:mt-32"
        >
          <div className="mx-auto max-w-[760px] text-center">
            <h3 className="font-serif text-3xl text-bwt-charcoal lg:text-4xl">{t("calcTitle")}</h3>
            <p className="mt-3 font-sans text-lg text-bwt-graphite">{t("calcSubtitle")}</p>
          </div>

          <div className="mx-auto mt-10 max-w-[640px] overflow-hidden rounded-card border border-bwt-silver/60 bg-white p-6 shadow-card lg:p-10">
            <AnimatePresence mode="wait">
              {step < 2 ? (
                <motion.div
                  key={`single-${step}`}
                  initial={{ x: 40, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -40, opacity: 0 }}
                  transition={{ duration: 0.35, ease: EASE }}
                >
                  <p className="font-sans text-xs uppercase tracking-[0.2em] text-bwt-gold-ink">
                    {t("stepOf", { step: step + 1, total: TOTAL })}
                  </p>
                  <h4 className="mt-3 font-serif text-2xl text-bwt-charcoal">{steps[step].q}</h4>
                  <div className="mt-6 space-y-3">
                    {steps[step].options.map((opt, i) => (
                      <button
                        key={opt}
                        onClick={() => pickSingle(i)}
                        className="flex w-full items-center justify-between rounded-btn border border-bwt-silver/70 px-5 py-4 text-left font-sans text-base text-bwt-charcoal transition-colors hover:border-bwt-gold hover:bg-bwt-cream"
                      >
                        {opt}
                        <ChevronRight className="h-4 w-4 shrink-0 text-bwt-gold-ink" />
                      </button>
                    ))}
                  </div>
                  {step > 0 && (
                    <button
                      onClick={() => setStep(step - 1)}
                      className="mt-6 inline-flex items-center gap-1.5 font-sans text-sm text-bwt-graphite transition-colors hover:text-bwt-charcoal"
                    >
                      <ChevronLeft className="h-4 w-4" /> {t("back")}
                    </button>
                  )}
                </motion.div>
              ) : step === 2 ? (
                <motion.div
                  key="multi"
                  initial={{ x: 40, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -40, opacity: 0 }}
                  transition={{ duration: 0.35, ease: EASE }}
                >
                  <p className="font-sans text-xs uppercase tracking-[0.2em] text-bwt-gold-ink">
                    {t("stepOf", { step: 3, total: TOTAL })}
                  </p>
                  <h4 className="mt-3 font-serif text-2xl text-bwt-charcoal">{t("needsTitle")}</h4>
                  <p className="mt-1 font-sans text-sm text-bwt-graphite">{t("needsHint")}</p>
                  <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {needsList.map((need, i) => {
                      const on = needs.includes(i);
                      return (
                        <button
                          key={need}
                          onClick={() => toggleNeed(i)}
                          aria-pressed={on}
                          className={`flex items-center gap-3 rounded-btn border px-4 py-3.5 text-left font-sans text-sm transition-colors ${
                            on
                              ? "border-bwt-gold bg-bwt-cream text-bwt-charcoal"
                              : "border-bwt-silver/70 text-bwt-charcoal hover:border-bwt-gold/60"
                          }`}
                        >
                          <span
                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-[3px] border transition-colors ${
                              on ? "border-bwt-gold bg-bwt-gold text-bwt-navy-dark" : "border-bwt-silver"
                            }`}
                          >
                            {on && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                          </span>
                          {need}
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-8 flex items-center justify-between">
                    <button
                      onClick={() => setStep(1)}
                      className="inline-flex items-center gap-1.5 font-sans text-sm text-bwt-graphite transition-colors hover:text-bwt-charcoal"
                    >
                      <ChevronLeft className="h-4 w-4" /> {t("back")}
                    </button>
                    <button
                      onClick={() => setStep(TOTAL)}
                      disabled={needs.length === 0}
                      className="inline-flex items-center gap-2 rounded-btn bg-bwt-gold px-6 py-3 font-sans text-sm font-semibold uppercase tracking-wider text-bwt-navy-dark transition-colors hover:bg-bwt-gold-light disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {t("pickSystem")}
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="result"
                  initial={{ scale: 0.96, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className="text-center"
                >
                  <p className="font-sans text-xs uppercase tracking-[0.2em] text-bwt-gold-ink">
                    {t("resultEyebrow")}
                  </p>
                  <h4 className="mt-3 font-serif text-4xl text-bwt-charcoal">
                    {meta.name}
                  </h4>
                  <p className="mt-2 font-sans text-base text-bwt-graphite">
                    {tiersText[resultIdx].tagline} — {t("resultTagline")}
                  </p>
                  {needs.length > 0 && (
                    <div className="mt-5 flex flex-wrap justify-center gap-2">
                      {needs.map((i) => (
                        <span
                          key={i}
                          className="rounded-full border border-bwt-gold/40 bg-bwt-cream px-3 py-1 font-sans text-xs text-bwt-charcoal"
                        >
                          {needsList[i]}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="mt-6">
                    <p className="font-sans text-xs uppercase tracking-[0.2em] text-bwt-graphite">
                      {t("altLabel")}
                    </p>
                    <div className="mt-3 flex flex-wrap justify-center gap-3">
                      {[0, 1, 2]
                        .filter((i) => i !== resultIdx)
                        .map((i) => (
                          <Link
                            key={TIERS_META[i].id}
                            href={`/request?model=${TIERS_META[i].id}`}
                            className="rounded-btn border border-bwt-silver/70 px-4 py-2 font-sans text-sm text-bwt-charcoal transition-colors hover:border-bwt-gold hover:text-bwt-gold-ink"
                          >
                            {TIERS_META[i].name} · {tiersText[i].tagline}
                          </Link>
                        ))}
                    </div>
                  </div>
                  <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                    <Link
                      href={`/request?model=${meta.id}&region=${single[0] ?? ""}&source=${single[1] ?? ""}&needs=${needs.join(",")}`}
                      className="inline-flex items-center gap-2.5 rounded-btn bg-bwt-gold px-7 py-4 font-sans text-sm font-semibold uppercase tracking-wider text-bwt-navy-dark transition-colors hover:bg-bwt-gold-light"
                    >
                      {t("analysisCta")}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={reset}
                      className="inline-flex items-center gap-1.5 font-sans text-sm text-bwt-graphite transition-colors hover:text-bwt-charcoal"
                    >
                      <RefreshCw className="h-4 w-4" /> {t("reset")}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-8 flex justify-center gap-2">
              {Array.from({ length: TOTAL }).map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === step && !finished
                      ? "w-6 bg-bwt-gold"
                      : i < step || finished
                        ? "w-1.5 bg-bwt-gold"
                        : "w-1.5 bg-bwt-silver"
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
