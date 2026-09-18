"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import StageHybrid from "./StageHybrid";

/* One clip per stage, public/videos/stages/<name>.mp4 + <name>.webp poster.
   The same series the desktop panel plays (FiltrationColumn). */
export const STAGE_CLIPS = [
  "stage-1-mesh",
  "stage-2-carbon",
  "stage-3-resin",
  "stage-4-membrane",
  "stage-5-magnesium",
  "stage-6-glass",
];

/* Phone-sized stage clip with the hybrid code layer on top. The poster frame
   shows at once (≈30 KB); with preload="none" the clip itself (≈0.4 MB) is
   fetched only when this stage is scrolled into view and play() is called —
   and only the active stage plays. Reduced motion or a failed clip → the
   caller's fallback (the vector scene / line icon). */
export default function StageClip({
  index,
  active,
  fallback,
}: {
  index: number;
  active: boolean;
  fallback: React.ReactNode;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);
  const name = STAGE_CLIPS[Math.min(index, STAGE_CLIPS.length - 1)];

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const sync = () => {
      if (active && !reduced && !document.hidden) void v.play().catch(() => {});
      else if (!v.paused) v.pause();
    };
    sync();
    // play() can be deferred while the tab is in the background — resume on return
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, [active, reduced]);

  if (reduced || failed) return <>{fallback}</>;

  return (
    <>
      <video
        ref={ref}
        src={`/videos/stages/${name}.mp4`}
        poster={`/videos/stages/${name}.webp`}
        muted
        loop
        playsInline
        preload="none"
        onError={() => setFailed(true)}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <StageHybrid index={index} active={active} />
    </>
  );
}
