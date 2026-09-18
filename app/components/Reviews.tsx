"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { useTranslations } from "next-intl";
import { Play, X, ArrowRight } from "lucide-react";
import RevealText from "./anim/RevealText";
import { useFocusTrap } from "@/app/hooks/useFocusTrap";

type Review = { id: string; name: string; role: string; caption: string; short: boolean };

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const VIEWPORT = { once: true, margin: "-80px" } as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};
const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

/* hqdefault is 480×360 — a 4:3 canvas with the 16:9 frame letterboxed inside.
   Dropped into a 16:9 card with object-cover it gets scaled up until the black
   bars are gone, and that overscan is what cuts people's foreheads off.
   maxresdefault is the true 16:9 frame: it fills the card with nothing cropped.
   It only exists for HD uploads, so the <Image> below falls back on error. */
const YT_THUMB = (id: string) => `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;
const YT_THUMB_FALLBACK = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
const YT_EMBED = (id: string) =>
  `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;

/** Specialist video reviews — reuses promo namespace content in the site gold palette. */
export default function Reviews() {
  const t = useTranslations("promo");
  const reviews = t.raw("reviews.items") as Review[];
  const [active, setActive] = useState<string | null>(null);

  const close = useCallback(() => setActive(null), []);
  /* Escape, the scroll lock and the focus cycle all live in the hook now. */
  const dialogRef = useFocusTrap(Boolean(active), close);

  return (
    <section className="bg-bwt-cream py-20 lg:py-28">
      <div className="mx-auto max-w-[1180px] px-6 lg:px-16">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="max-w-[760px]"
        >
          <p className="font-sans text-xs font-medium uppercase tracking-[0.25em] text-bwt-gold-ink">
            {t("reviews.eyebrow")}
          </p>
          <h2 className="mt-4 border-l-4 border-bwt-gold pl-5 font-serif text-3xl font-normal leading-[1.15] text-bwt-charcoal lg:text-4xl">
            <RevealText text={t("reviews.titleA")} />{" "}
            <span className="italic text-bwt-gold-ink">
              <RevealText text={t("reviews.titleAccent")} delay={0.12} />
            </span>{" "}
            <RevealText text={t("reviews.titleB")} delay={0.2} />
          </h2>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4"
        >
          {reviews.map((r) => (
            <motion.article
              key={r.id}
              variants={fadeUp}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="group flex flex-col overflow-hidden rounded-card border border-bwt-silver/50 bg-white transition-shadow hover:shadow-card"
            >
              <button
                type="button"
                onClick={() => setActive(r.id)}
                className="relative aspect-video w-full overflow-hidden"
                aria-label={`${t("reviews.watch")} — ${r.name}`}
              >
                {/* Blurred copy fills the card, the sharp frame sits on top
                    uncropped — so a portrait or 4:3 clip keeps the whole head
                    in shot instead of being overscanned to fit 16:9. */}
                <Image
                  src={YT_THUMB(r.id)}
                  alt=""
                  aria-hidden
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="scale-110 object-cover blur-xl saturate-125"
                  unoptimized
                  onError={(e) => {
                    const img = e.currentTarget;
                    if (!img.src.endsWith("hqdefault.jpg")) img.src = YT_THUMB_FALLBACK(r.id);
                  }}
                />
                <Image
                  src={YT_THUMB(r.id)}
                  alt={r.caption}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-contain transition-transform duration-500 group-hover:scale-105"
                  unoptimized
                  onError={(e) => {
                    const img = e.currentTarget;
                    if (!img.src.endsWith("hqdefault.jpg")) img.src = YT_THUMB_FALLBACK(r.id);
                  }}
                />
                <span className="absolute inset-0 bg-bwt-navy/10 transition-colors group-hover:bg-bwt-navy/0" />
                <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-bwt-gold text-bwt-navy-dark shadow-lg transition-transform duration-300 group-hover:scale-110">
                  <Play className="h-6 w-6 translate-x-[1px] fill-current" />
                </span>
              </button>

              <div className="flex flex-1 flex-col p-5">
                <div className="font-serif text-lg text-bwt-charcoal">{r.name}</div>
                <div className="mt-1 font-sans text-[0.7rem] uppercase tracking-wider text-bwt-gold-ink">
                  {r.role}
                </div>
                <p className="mt-3 flex-1 font-sans text-sm leading-relaxed text-bwt-graphite">
                  {r.caption}
                </p>
                <button
                  type="button"
                  onClick={() => setActive(r.id)}
                  className="-mx-2 mt-4 inline-flex min-h-[44px] items-center gap-2 px-2 font-sans text-sm font-semibold uppercase tracking-wider text-bwt-charcoal transition-colors hover:text-bwt-gold-ink"
                >
                  {t("reviews.watch")} <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>

      {active && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-bwt-navy-dark/90 p-4"
          onClick={close}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={`${t("reviews.dialogLabel")} — ${
              reviews.find((r) => r.id === active)?.name ?? ""
            }`}
            className="relative w-full max-w-[900px]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={close}
              aria-label={t("reviews.close")}
              className="absolute -top-14 right-0 flex h-11 w-11 items-center justify-center rounded-full border border-bwt-ivory/30 text-bwt-ivory transition-colors hover:border-bwt-gold hover:text-bwt-gold"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="relative aspect-video w-full overflow-hidden rounded-card bg-black">
              <iframe
                src={YT_EMBED(active)}
                title={`${t("reviews.dialogLabel")} — ${reviews.find((r) => r.id === active)?.name ?? ""}`}
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                loading="lazy"
                className="absolute inset-0 h-full w-full"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
