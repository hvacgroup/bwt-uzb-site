"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { STAGE_ANIMATIONS, STAGE_VIDEO_OVERLAYS } from "./StageAnimations";

/* Photoreal macro loops generated for each stage (public/videos/stages/).
   18.09.2026: all six re-shot as one series — a vertical filtration layer
   right of centre, dirty water entering from the left, clean water on the
   right (Higgsfield gpt_image_2_5 frame → Kling 3.0, start frame = end frame,
   so every clip loops without a cut). 720×720, ~0.3–0.45 MB each.
   When a clip is missing or fails — or the user prefers reduced motion —
   the vector illustration takes over seamlessly. */
const STAGE_VIDEOS: (string | null)[] = [
  "/videos/stages/stage-1-mesh.mp4",
  "/videos/stages/stage-2-carbon.mp4",
  "/videos/stages/stage-3-resin.mp4",
  // 04 — same composition as the mechanical stage, pathogens instead of grit.
  "/videos/stages/stage-4-membrane.mp4",
  "/videos/stages/stage-5-magnesium.mp4",
  "/videos/stages/stage-6-glass.mp4",
];

/* ─────────────────────────────────────────────────────────────────────────
   The filtration column — an upgraded version of the original schematic.

   Left: water enters dirty at the top, passes six stages, leaves clean.
   Right: a large animated illustration of what the current stage actually
   does. Vector art throughout, so it stays crisp and weighs almost nothing.
   ───────────────────────────────────────────────────────────────────────── */

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

type Stage = { n: string; short: string };

export default function FiltrationColumn({
  active,
  stages,
  waterIn,
  waterOut,
  near = true,
}: {
  active: number;
  stages: Stage[];
  waterIn: string;
  waterOut: string;
  /** The section is close to the viewport — start fetching every clip. */
  near?: boolean;
}) {
  const reduced = useReducedMotion();
  const [videoFailed, setVideoFailed] = useState<Set<number>>(new Set());
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const i = Math.min(active, STAGE_ANIMATIONS.length - 1);
  const Illustration = STAGE_ANIMATIONS[i];
  const src = STAGE_VIDEOS[i];
  const useVideo = !reduced && !!src && !videoFailed.has(i);
  const Overlay = STAGE_VIDEO_OVERLAYS[i];
  const progress = (active + 1) / stages.length;

  /* Only the visible clip runs; the others hold their first frame ready.
     autoPlay starts them, this keeps exactly one running — and retries on the
     next frame, since a ref may still be attaching when the effect fires. */
  useEffect(() => {
    const sync = () =>
      videoRefs.current.forEach((v, idx) => {
        if (!v) return;
        if (idx === i && useVideo) void v.play().catch(() => {});
        else if (!v.paused) v.pause();
      });
    sync();
    const t = window.setTimeout(sync, 120);
    return () => window.clearTimeout(t);
  }, [i, useVideo, near]);

  return (
    <div className="flex h-full w-full items-center justify-center gap-8 lg:gap-10">
      {/* ── stage rail ─────────────────────────────────────────────── */}
      <div className="w-[205px] shrink-0">
        <div className="flex flex-col items-center gap-1.5 text-bwt-ivory/45">
          <DropIcon dirty />
          <span className="font-sans text-[0.58rem] uppercase tracking-[0.25em]">{waterIn}</span>
        </div>

        <div className="relative my-3 overflow-hidden rounded-[1.5rem] border border-white/12">
          {/* water level filling as the reader descends the stages */}
          <motion.div
            className="pointer-events-none absolute inset-x-0 top-0 bg-gradient-to-b from-bwt-gold/16 to-bwt-gold/4"
            initial={false}
            animate={{ height: `${progress * 100}%` }}
            transition={{ duration: reduced ? 0 : 0.7, ease: EASE }}
          />
          {stages.map((s, i) => {
            const on = active === i;
            const done = i < active;
            return (
              <div
                key={s.n}
                className={`relative flex h-[62px] items-center gap-3.5 px-4 transition-colors duration-500 ${
                  i > 0 ? "border-t border-white/10" : ""
                } ${on ? "bg-bwt-gold/12" : ""}`}
              >
                <motion.span
                  className="absolute left-0 top-0 h-full w-[3px] origin-top bg-bwt-gold"
                  initial={false}
                  animate={{ scaleY: on ? 1 : 0 }}
                  transition={{ duration: reduced ? 0 : 0.45, ease: EASE }}
                />
                <span
                  className={`font-sans text-lg font-bold tabular-nums transition-colors duration-500 ${
                    on ? "text-bwt-gold" : done ? "text-bwt-ivory/55" : "text-bwt-ivory/25"
                  }`}
                >
                  {s.n}
                </span>
                <span
                  className={`font-sans text-[0.72rem] uppercase leading-tight tracking-wider transition-colors duration-500 ${
                    on ? "text-bwt-ivory" : done ? "text-bwt-ivory/50" : "text-bwt-ivory/25"
                  }`}
                >
                  {s.short}
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col items-center gap-1.5 text-bwt-gold">
          <DropIcon />
          <span className="font-sans text-[0.58rem] uppercase tracking-[0.25em]">{waterOut}</span>
        </div>
      </div>

      {/* ── stage illustration ─────────────────────────────────────── */}
      <div className="relative hidden aspect-square w-[380px] shrink-0 xl:block">
        <div className="pointer-events-none absolute inset-6 rounded-full bg-bwt-gold/10 blur-3xl" />
        <div className="absolute inset-0 rounded-[2rem] border border-white/10 bg-white/[0.03]" />

        {/* Vector scene — only for stages without footage (04, reduced motion,
            a clip that failed). Never under a clip: the owner must not see the
            old drawing flash before the approved video takes over. */}
        <AnimatePresence mode="wait">
          {!useVideo && (
            <motion.div
              key={active}
              initial={reduced ? false : { opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, scale: 0.97, y: -8 }}
              transition={{ duration: reduced ? 0 : 0.45, ease: EASE }}
              className="absolute inset-4"
            >
              <Illustration />
            </motion.div>
          )}
        </AnimatePresence>

        {/* All clips live in one stack: they are fetched together once the
            section approaches the viewport, so switching stages is instant.
            Only the active one plays — the rest stay paused. */}
        {near && (
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2rem]">
            {STAGE_VIDEOS.map((v, idx) =>
              v && !videoFailed.has(idx) ? (
                <video
                  key={v}
                  ref={(el) => {
                    videoRefs.current[idx] = el;
                  }}
                  src={v}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  onError={() => setVideoFailed((s) => new Set(s).add(idx))}
                  className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
                  style={{ opacity: useVideo && idx === i ? 1 : 0 }}
                />
              ) : null,
            )}
          </div>
        )}

        {/* didactic vector layer over the footage */}
        {useVideo && Overlay && (
          <AnimatePresence mode="wait">
            <motion.div
              key={`ov-${active}`}
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduced ? undefined : { opacity: 0 }}
              transition={{ duration: reduced ? 0 : 0.35, ease: EASE }}
              className="pointer-events-none absolute inset-0"
            >
              <Overlay />
            </motion.div>
          </AnimatePresence>
        )}

        {/* blend the clip into the navy panel */}
        {useVideo && (
          <>
            <div className="pointer-events-none absolute inset-0 rounded-[2rem] shadow-[inset_0_0_60px_rgba(0,18,51,0.85)]" />
            <div className="pointer-events-none absolute inset-0 rounded-[2rem] bg-gradient-to-t from-bwt-navy/45 via-transparent to-bwt-navy/30" />
          </>
        )}
      </div>
    </div>
  );
}

function DropIcon({ dirty = false }: { dirty?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" strokeWidth={1.5} stroke="currentColor">
      <path d="M12 3s-6 7.2-6 12a6 6 0 0 0 12 0c0-4.8-6-12-6-12z" strokeLinejoin="round" />
      {dirty && (
        <>
          <circle cx="10.5" cy="14" r="1.1" fill="currentColor" stroke="none" />
          <circle cx="13.6" cy="16.6" r="0.9" fill="currentColor" stroke="none" />
          <circle cx="13" cy="12" r="0.7" fill="currentColor" stroke="none" />
        </>
      )}
    </svg>
  );
}
