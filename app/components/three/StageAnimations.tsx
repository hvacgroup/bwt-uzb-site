"use client";

import { motion } from "framer-motion";
import { useLocale } from "next-intl";

/* ─────────────────────────────────────────────────────────────────────────
   Per-stage micro-animations for the filtration column — premium pass.

   Every element is shaded like a rendered object: radial gradients give
   spheres volume, glass parts get gradient walls and specular highlights,
   glows come from blurred halos. Still pure SVG — crisp at any size,
   a fraction of the weight of WebGL.

   Gradient/filter ids are prefixed per stage: both the exiting and the
   entering illustration are briefly in the DOM during the crossfade,
   and duplicated ids would corrupt paint servers.
   ───────────────────────────────────────────────────────────────────────── */

const PINK = "#f087b6";
const PINK_SOFT = "#f5a9c8";
const PINK_DEEP = "#c4527f";
const ICE = "#cfe3fb";
const MUTED = "#7b8ca6";

const VB = "0 0 220 220";

/** Deterministic pseudo-random so server and client agree. */
function rnd(seed: number) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) / 2147483647);
}

const loop = (dur: number, delay = 0) => ({
  duration: dur,
  delay,
  repeat: Infinity,
  ease: "linear" as const,
});

/* Shared: a shaded droplet with a specular dot. */
function Droplet({ id, x, r = 4 }: { id: string; x: number; r?: number }) {
  return (
    <>
      <circle cx={x} r={r} fill={`url(#${id})`} />
      <circle cx={x - r * 0.3} r={r * 0.28} fill="#ffffff" opacity={0.85} />
    </>
  );
}

/* 01 — Mechanical: grit and rust caught by a steel mesh. */
function MechanicalStage() {
  const r = rnd(11);
  const grit = Array.from({ length: 10 }, () => ({
    x: 28 + r() * 164,
    d: r() * 2.6,
    s: 3 + r() * 4,
    rot: r() * 120,
    rust: r() > 0.6,
  }));
  return (
    <svg viewBox={VB} className="h-full w-full">
      <defs>
        <linearGradient id="m1-steel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f9b9d3" />
          <stop offset="0.5" stopColor={PINK} />
          <stop offset="1" stopColor={PINK_DEEP} />
        </linearGradient>
        <radialGradient id="m1-drop" cx="0.35" cy="0.3" r="0.9">
          <stop offset="0" stopColor="#f2f8ff" />
          <stop offset="0.55" stopColor={ICE} />
          <stop offset="1" stopColor="#8fb4dd" />
        </radialGradient>
        <radialGradient id="m1-rust" cx="0.35" cy="0.3" r="0.9">
          <stop offset="0" stopColor="#e0a878" />
          <stop offset="1" stopColor="#8a5a34" />
        </radialGradient>
        <radialGradient id="m1-dirt" cx="0.35" cy="0.3" r="0.9">
          <stop offset="0" stopColor="#a8b6c9" />
          <stop offset="1" stopColor="#5e6d82" />
        </radialGradient>
        <filter id="m1-blur" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>

      {/* haze of incoming dirty water */}
      <ellipse cx="110" cy="42" rx="86" ry="26" fill="#5e6d82" opacity="0.14" filter="url(#m1-blur)" />

      {/* falling particles */}
      {grit.map((g, i) => (
        <motion.g key={i} animate={{ y: [8, 116], opacity: [0, 1, 1, 0.9] }} transition={loop(2.6, g.d)}>
          <rect
            x={g.x}
            y={0}
            width={g.s}
            height={g.s * 0.85}
            rx={g.s * 0.3}
            fill={g.rust ? "url(#m1-rust)" : "url(#m1-dirt)"}
            transform={`rotate(${g.rot} ${g.x} 0)`}
          />
        </motion.g>
      ))}

      {/* sediment accumulated on the mesh */}
      {Array.from({ length: 16 }, (_, i) => {
        const rr = rnd(i * 7 + 3);
        return (
          <circle
            key={i}
            cx={26 + i * 10.8 + rr() * 4}
            cy={125 - (i % 3) * 2.4}
            r={2.2 + rr() * 1.8}
            fill={i % 4 === 0 ? "url(#m1-rust)" : "url(#m1-dirt)"}
          />
        );
      })}

      {/* steel mesh — two woven layers with depth */}
      <g>
        <rect x="20" y="130" width="180" height="4.5" rx="2.2" fill="url(#m1-steel)" />
        <rect x="20" y="141" width="180" height="4.5" rx="2.2" fill="url(#m1-steel)" opacity="0.75" />
        {Array.from({ length: 13 }, (_, i) => (
          <rect key={i} x={24 + i * 14} y="126" width="3.4" height="23" rx="1.7" fill="url(#m1-steel)" opacity="0.9" />
        ))}
        {/* specular sweep on the mesh */}
        <motion.rect
          x="20"
          y="129"
          width="34"
          height="17"
          fill="#ffffff"
          opacity="0.25"
          animate={{ x: [20, 168, 20] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </g>

      {/* clean droplets below */}
      {[58, 110, 162].map((x, i) => (
        <motion.g key={x} animate={{ y: [152, 206], opacity: [0, 1, 0] }} transition={loop(2.2, i * 0.6)}>
          <Droplet id="m1-drop" x={x} />
        </motion.g>
      ))}

      <text x="110" y="182" textAnchor="middle" fill={MUTED} fontSize="12" letterSpacing="2">
        5 µm
      </text>
    </svg>
  );
}

/* 02 — Carbon: chlorine drawn into a bed of shaded granules. */
function CarbonStage() {
  const r = rnd(29);
  const granules = Array.from({ length: 26 }, () => ({
    cx: 26 + r() * 168,
    cy: 96 + r() * 92,
    rr: 8 + r() * 10,
    o: 0.85 + r() * 0.15,
  }));
  const mols = Array.from({ length: 5 }, (_, i) => ({ x: 38 + i * 37, d: i * 0.55 }));
  return (
    <svg viewBox={VB} className="h-full w-full">
      <defs>
        <radialGradient id="c2-gran" cx="0.32" cy="0.28" r="1">
          <stop offset="0" stopColor="#8d99ab" />
          <stop offset="0.45" stopColor="#525d6d" />
          <stop offset="1" stopColor="#262c36" />
        </radialGradient>
        <radialGradient id="c2-cl" cx="0.35" cy="0.3" r="0.9">
          <stop offset="0" stopColor="#d6f5e2" />
          <stop offset="0.5" stopColor="#8fd3a6" />
          <stop offset="1" stopColor="#4d8f66" />
        </radialGradient>
        <filter id="c2-glow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>

      {/* warm halo behind the bed */}
      <ellipse cx="110" cy="142" rx="88" ry="52" fill={PINK} opacity="0.1" filter="url(#c2-glow)" />

      {/* granule bed */}
      {granules.map((g, i) => (
        <g key={i} opacity={g.o}>
          <circle cx={g.cx} cy={g.cy} r={g.rr} fill="url(#c2-gran)" />
          {/* porous speckle */}
          <circle cx={g.cx + g.rr * 0.25} cy={g.cy + g.rr * 0.2} r={g.rr * 0.1} fill="#1c2129" />
          <circle cx={g.cx - g.rr * 0.15} cy={g.cy + g.rr * 0.4} r={g.rr * 0.08} fill="#1c2129" />
          {/* specular */}
          <ellipse
            cx={g.cx - g.rr * 0.32}
            cy={g.cy - g.rr * 0.38}
            rx={g.rr * 0.3}
            ry={g.rr * 0.2}
            fill="#cdd6e2"
            opacity="0.55"
          />
        </g>
      ))}

      {/* chlorine molecules — twin atoms sinking in and dissolving */}
      {mols.map((m, i) => (
        <motion.g key={i} animate={{ y: [0, 88], opacity: [0, 1, 1, 0] }} transition={loop(2.8, m.d)}>
          <circle cx={m.x - 4} cy={16} r={6.5} fill="url(#c2-cl)" />
          <circle cx={m.x + 5} cy={12} r={5} fill="url(#c2-cl)" />
          <circle cx={m.x - 6.5} cy={13.5} r={1.8} fill="#ffffff" opacity="0.8" />
          <text x={m.x} y={31} textAnchor="middle" fontSize="7.5" fill="#8fd3a6" fontWeight="700" letterSpacing="0.5">
            Cl₂
          </text>
        </motion.g>
      ))}

      {/* adsorption ring */}
      <motion.ellipse
        cx="110"
        cy="142"
        rx="94"
        ry="56"
        fill="none"
        stroke={PINK}
        strokeWidth="1.5"
        strokeDasharray="4 8"
        animate={{ opacity: [0.15, 0.6, 0.15], rotate: 360 }}
        transition={{ opacity: { duration: 3, repeat: Infinity }, rotate: loop(24) }}
        style={{ transformOrigin: "110px 142px" }}
      />
    </svg>
  );
}

/* 03 — Softening: glossy resin beads swap Ca/Mg for Na. */
function ResinStage() {
  const r = rnd(53);
  const beads = Array.from({ length: 22 }, () => ({
    cx: 28 + r() * 164,
    cy: 88 + r() * 98,
    rr: 9 + r() * 8,
  }));
  return (
    <svg viewBox={VB} className="h-full w-full">
      <defs>
        <radialGradient id="r3-bead" cx="0.32" cy="0.26" r="1">
          <stop offset="0" stopColor="#fbeecf" />
          <stop offset="0.45" stopColor="#ecc98f" />
          <stop offset="1" stopColor="#b98a4e" />
        </radialGradient>
        <radialGradient id="r3-ion" cx="0.35" cy="0.3" r="0.9">
          <stop offset="0" stopColor="#fbc9de" />
          <stop offset="0.5" stopColor={PINK} />
          <stop offset="1" stopColor={PINK_DEEP} />
        </radialGradient>
        <radialGradient id="r3-na" cx="0.35" cy="0.3" r="0.9">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.5" stopColor={ICE} />
          <stop offset="1" stopColor="#8fb4dd" />
        </radialGradient>
        <filter id="r3-glow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>

      <ellipse cx="110" cy="140" rx="90" ry="54" fill="#e2b06a" opacity="0.1" filter="url(#r3-glow)" />

      {/* resin bed */}
      {beads.map((b, i) => (
        <g key={i}>
          <circle cx={b.cx} cy={b.cy} r={b.rr} fill="url(#r3-bead)" />
          <ellipse cx={b.cx - b.rr * 0.32} cy={b.cy - b.rr * 0.38} rx={b.rr * 0.32} ry={b.rr * 0.2} fill="#ffffff" opacity="0.75" />
        </g>
      ))}

      {/* hardness ions dropping in and docking */}
      {[
        { x: 60, label: "Ca²⁺", d: 0 },
        { x: 150, label: "Mg²⁺", d: 0.9 },
      ].map((ion) => (
        <motion.g key={ion.label} animate={{ y: [0, 80], opacity: [0, 1, 1, 0.2] }} transition={loop(3, ion.d)}>
          <circle cx={ion.x} cy={18} r={12} fill="url(#r3-ion)" />
          <circle cx={ion.x} cy={18} r={12} fill="none" stroke="#ffffff" strokeOpacity="0.35" />
          <text x={ion.x} y={22} textAnchor="middle" fontSize="8.5" fontWeight="700" fill="#47102a">
            {ion.label}
          </text>
        </motion.g>
      ))}

      {/* sodium released */}
      {[100, 178].map((x, i) => (
        <motion.g key={x} animate={{ y: [0, -60], opacity: [0, 0.95, 0] }} transition={loop(3, 0.6 + i * 0.8)}>
          <circle cx={x} cy={150} r={9.5} fill="url(#r3-na)" />
          <text x={x} y={154} textAnchor="middle" fontSize="8.5" fontWeight="700" fill="#0b2c4e">
            Na⁺
          </text>
        </motion.g>
      ))}
    </svg>
  );
}

/* 04 — UF membrane: the mechanical stage, one-to-one, with pathogens in
   place of grit and rust. Same haze, same mesh, same sweep, same droplets —
   only the weave is far denser and what it stops is alive. */
function MembraneStage() {
  const locale = useLocale();
  const shield = locale === "uz" ? "BAKTERIYALARDAN HIMOYA" : "ЗАЩИТА ОТ БАКТЕРИЙ";
  const r = rnd(11);
  /* same layout maths as the mechanical grit, so the two scenes read as a pair */
  const incoming = Array.from({ length: 8 }, (_, i) => ({
    x: 28 + r() * 164,
    d: r() * 2.6,
    rot: (r() - 0.5) * 60,
    virus: i % 2 === 0,
  }));
  const caught = Array.from({ length: 9 }, (_, i) => {
    const rr = rnd(i * 7 + 3);
    return {
      x: 26 + i * 21 + rr() * 6,
      y: 120 - (i % 3) * 2.6,
      virus: i % 2 === 0,
      s: 0.62 + rr() * 0.22,
      rot: (rr() - 0.5) * 40,
    };
  });
  return (
    <svg viewBox={VB} className="h-full w-full">
      <MicrobeDefs p="f4" />
      <defs>
        <linearGradient id="f4-steel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f9b9d3" />
          <stop offset="0.5" stopColor={PINK} />
          <stop offset="1" stopColor={PINK_DEEP} />
        </linearGradient>
        <radialGradient id="f4-drop" cx="0.35" cy="0.3" r="0.9">
          <stop offset="0" stopColor="#f2f8ff" />
          <stop offset="0.55" stopColor={ICE} />
          <stop offset="1" stopColor="#8fb4dd" />
        </radialGradient>
        <filter id="f4-blur" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>

      {/* haze of contaminated water coming in */}
      <ellipse cx="110" cy="42" rx="86" ry="26" fill="#4f7f5e" opacity="0.16" filter="url(#f4-blur)" />

      {/* pathogens falling onto the membrane */}
      {incoming.map((g, i) => (
        <motion.g key={i} animate={{ y: [8, 108], opacity: [0, 1, 1, 0.9] }} transition={loop(2.8, g.d)}>
          {g.virus ? (
            <Virus cx={g.x} cy={0} r={7} p="f4" />
          ) : (
            <Bacterium cx={g.x} cy={0} rot={g.rot} s={0.7} p="f4" />
          )}
        </motion.g>
      ))}

      {/* pathogens already caught, piled on the membrane */}
      {caught.map((c, i) =>
        c.virus ? (
          <Virus key={i} cx={c.x} cy={c.y} r={7.5 * c.s + 2} p="f4" />
        ) : (
          <Bacterium key={i} cx={c.x} cy={c.y + 2} rot={c.rot} s={c.s} p="f4" />
        ),
      )}

      {/* the membrane — the mechanical weave, but nothing over 0.01 µm passes */}
      <g>
        <rect x="20" y="130" width="180" height="4.5" rx="2.2" fill="url(#f4-steel)" />
        <rect x="20" y="141" width="180" height="4.5" rx="2.2" fill="url(#f4-steel)" opacity="0.75" />
        {Array.from({ length: 27 }, (_, i) => (
          <rect key={i} x={23 + i * 6.6} y="126" width="2.2" height="23" rx="1.1" fill="url(#f4-steel)" opacity="0.9" />
        ))}
        {/* specular sweep on the membrane */}
        <motion.rect
          x="20"
          y="129"
          width="34"
          height="17"
          fill="#ffffff"
          opacity="0.25"
          animate={{ x: [20, 168, 20] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </g>

      {/* clean droplets below */}
      {[58, 110, 162].map((x, i) => (
        <motion.g key={x} animate={{ y: [152, 206], opacity: [0, 1, 0] }} transition={loop(2.2, i * 0.6)}>
          <Droplet id="f4-drop" x={x} />
        </motion.g>
      ))}

      <text
        x="110"
        y="176"
        textAnchor="middle"
        fill={PINK_SOFT}
        fontSize="11"
        fontWeight="700"
        letterSpacing="1.6"
      >
        {shield}
      </text>
      <text x="110" y="195" textAnchor="middle" fill={MUTED} fontSize="11" letterSpacing="2">
        0.01 µm
      </text>
    </svg>
  );
}

/* 05 — Magnesium: a luminous mineral core charging the stream. */
function MagnesiumStage() {
  const r = rnd(97);
  const sparks = Array.from({ length: 8 }, (_, i) => ({ x: 36 + r() * 148, d: i * 0.38, s: 3.5 + r() * 2.5 }));
  return (
    <svg viewBox={VB} className="h-full w-full">
      <defs>
        <radialGradient id="g5-core" cx="0.4" cy="0.35" r="0.95">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.35" stopColor={PINK_SOFT} />
          <stop offset="0.75" stopColor={PINK} />
          <stop offset="1" stopColor={PINK_DEEP} />
        </radialGradient>
        <radialGradient id="g5-halo" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={PINK} stopOpacity="0.55" />
          <stop offset="1" stopColor={PINK} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="g5-ion" cx="0.35" cy="0.3" r="0.9">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.5" stopColor={PINK_SOFT} />
          <stop offset="1" stopColor={PINK_DEEP} />
        </radialGradient>
      </defs>

      {/* pulsing halo */}
      <motion.circle
        cx="110"
        cy="110"
        r="86"
        fill="url(#g5-halo)"
        animate={{ opacity: [0.5, 1, 0.5], scale: [0.94, 1.05, 0.94] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "110px 110px" }}
      />

      {/* mineral core */}
      <motion.g
        animate={{ scale: [1, 1.045, 1] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "110px 110px" }}
      >
        <circle cx="110" cy="110" r="40" fill="url(#g5-core)" />
        <ellipse cx="97" cy="94" rx="14" ry="8" fill="#ffffff" opacity="0.65" />
        <text x="110" y="121" textAnchor="middle" fontSize="30" fontWeight="700" fill="#5c1436">
          Mg
        </text>
      </motion.g>

      {/* tilted orbit rings */}
      {[{ ry: 22, dur: 7 }, { ry: 30, dur: 10 }].map((o, i) => (
        <g key={i}>
          <ellipse cx="110" cy="110" rx={62 + i * 14} ry={o.ry} fill="none" stroke={PINK} strokeOpacity="0.35" strokeWidth="1.3" />
          <motion.g animate={{ rotate: 360 }} transition={loop(o.dur)} style={{ transformOrigin: "110px 110px" }}>
            <circle cx={110 + 62 + i * 14} cy="110" r="4" fill="url(#g5-ion)" />
          </motion.g>
        </g>
      ))}

      {/* mineral ions carried down by the stream */}
      {sparks.map((s, i) => (
        <motion.circle
          key={i}
          cx={s.x}
          r={s.s}
          fill="url(#g5-ion)"
          animate={{ cy: [12, 208], opacity: [0, 1, 1, 0] }}
          transition={loop(3.4, s.d)}
        />
      ))}
    </svg>
  );
}

/* 06 — Polishing: a crystal stream filling a shaded glass. */
function PolishStage() {
  const r = rnd(71);
  const bubbles = Array.from({ length: 6 }, (_, i) => ({ x: 92 + r() * 36, d: i * 0.5, s: 1.6 + r() * 1.6 }));
  return (
    <svg viewBox={VB} className="h-full w-full">
      <defs>
        <linearGradient id="p6-glass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="0.15" stopColor="#dcebfb" stopOpacity="0.18" />
          <stop offset="0.85" stopColor="#dcebfb" stopOpacity="0.18" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id="p6-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={ICE} stopOpacity="0.85" />
          <stop offset="1" stopColor="#7ea9d8" stopOpacity="0.65" />
        </linearGradient>
        <linearGradient id="p6-stream" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="1" stopColor={ICE} stopOpacity="0.6" />
        </linearGradient>
        <filter id="p6-glow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>

      {/* stream */}
      <rect x="106" y="8" width="8" height="132" rx="4" fill="url(#p6-stream)" />
      <motion.rect
        x="107.5"
        width="2"
        height="26"
        rx="1"
        fill="#ffffff"
        animate={{ y: [8, 120], opacity: [0, 1, 0] }}
        transition={loop(1.1)}
      />

      {/* splash where the stream meets the water */}
      <motion.ellipse
        cx="110"
        cy="146"
        rx="10"
        ry="3"
        fill="#ffffff"
        opacity="0.5"
        animate={{ rx: [8, 13, 8], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 1.4, repeat: Infinity }}
      />

      {/* glass with water */}
      <g>
        <path d="M70 112 L150 112 L142 198 Q141 207 132 207 L88 207 Q79 207 78 198 Z" fill="url(#p6-glass)" stroke="#eaf3ff" strokeOpacity="0.8" strokeWidth="2" />
        <motion.path
          d="M74 146 L146 146 L141 198 Q140 206 132 206 L88 206 Q80 206 79 198 Z"
          fill="url(#p6-water)"
          animate={{ opacity: [0.85, 1, 0.85] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        {/* meniscus */}
        <motion.ellipse
          cx="110"
          cy="146"
          rx="36"
          ry="4"
          fill="#ffffff"
          opacity="0.45"
          animate={{ ry: [3.4, 4.6, 3.4] }}
          transition={{ duration: 2.6, repeat: Infinity }}
        />
        {/* rising bubbles */}
        {bubbles.map((b, i) => (
          <motion.circle
            key={i}
            cx={b.x}
            r={b.s}
            fill="#ffffff"
            opacity="0.7"
            animate={{ cy: [200, 150], opacity: [0, 0.8, 0] }}
            transition={loop(2.4, b.d)}
          />
        ))}
        {/* glass specular */}
        <rect x="80" y="118" width="5" height="80" rx="2.5" fill="#ffffff" opacity="0.5" transform="rotate(4 80 118)" />
      </g>

      {/* sparkles */}
      {[
        { x: 164, y: 96, s: 1, d: 0 },
        { x: 52, y: 128, s: 0.7, d: 1.1 },
      ].map((sp, i) => (
        <motion.path
          key={i}
          d={`M ${sp.x} ${sp.y - 12 * sp.s} l ${3.4 * sp.s} ${8.6 * sp.s} ${8.6 * sp.s} ${3.4 * sp.s} -${8.6 * sp.s} ${3.4 * sp.s} -${3.4 * sp.s} ${8.6 * sp.s} -${3.4 * sp.s} -${8.6 * sp.s} -${8.6 * sp.s} -${3.4 * sp.s} ${8.6 * sp.s} -${3.4 * sp.s} z`}
          fill={PINK}
          filter="url(#p6-glow)"
          animate={{ opacity: [0.15, 1, 0.15], scale: [0.8, 1.15, 0.8] }}
          transition={{ duration: 2.6, delay: sp.d, repeat: Infinity }}
          style={{ transformOrigin: `${sp.x}px ${sp.y}px` }}
        />
      ))}
    </svg>
  );
}


/* ── Video overlays ──────────────────────────────────────────────────────────
   Didactic vector layers drawn ON TOP of the photoreal stage clips.
   Only magnesium needs one for now: labelled Mg²⁺ ions drifting up through
   the footage make the mineralisation legible at a glance. */

function MgIonsOverlay() {
  const r = rnd(41);
  const ions = Array.from({ length: 5 }, (_, i) => ({
    x: 26 + r() * 168,
    d: i * 0.9,
    rr: 10 + r() * 4,
    drift: (r() - 0.5) * 22,
  }));
  return (
    <svg viewBox={VB} className="h-full w-full">
      <defs>
        <radialGradient id="ov-mg" cx="0.35" cy="0.3" r="0.9">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.45" stopColor={PINK_SOFT} />
          <stop offset="1" stopColor={PINK_DEEP} />
        </radialGradient>
        <filter id="ov-glow" x="-90%" y="-90%" width="280%" height="280%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>
      {ions.map((ion, i) => (
        <motion.g
          key={i}
          animate={{ y: [30, -230], x: [0, ion.drift], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 4.6, delay: ion.d, repeat: Infinity, ease: "linear" }}
        >
          <circle cx={ion.x} cy={220} r={ion.rr * 1.7} fill={PINK} opacity={0.35} filter="url(#ov-glow)" />
          <circle cx={ion.x} cy={220} r={ion.rr} fill="url(#ov-mg)" />
          <circle cx={ion.x - ion.rr * 0.3} cy={220 - ion.rr * 0.35} r={ion.rr * 0.26} fill="#ffffff" opacity={0.85} />
          <text
            x={ion.x}
            y={224}
            textAnchor="middle"
            fontSize={ion.rr * 0.72}
            fontWeight="700"
            fill="#47102a"
          >
            Mg²⁺
          </text>
        </motion.g>
      ))}
    </svg>
  );
}


/* A caption chip: chemical symbol + the plain-language name, so the viewer
   reads what is happening without any prior chemistry. */
function Chip({
  x = 8,
  y = 188,
  w = 96,
  symbol,
  name,
}: {
  x?: number;
  y?: number;
  w?: number;
  symbol: string;
  name?: string;
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={name ? 24 : 19} rx={name ? 12 : 9.5} fill="#001233" opacity={0.74} />
      <text
        x={x + 11}
        y={y + (name ? 16 : 13.5)}
        fontSize={name ? 10 : 11}
        letterSpacing="0.4"
        fill={PINK_SOFT}
        fontWeight="700"
      >
        {symbol}
      </text>
      {name && (
        <text x={x + w - 10} y={y + 16} textAnchor="end" fontSize="8" letterSpacing="1.1" fill="#ffffff" opacity="0.8">
          {name}
        </text>
      )}
    </g>
  );
}

/* Reusable microbes drawn from the owner's reference images:
   a virus is a green sphere with knob-tipped radial spikes,
   a bacterium is a blue-violet rounded rod. */
function Virus({ cx, cy, r = 9, p }: { cx: number; cy: number; r?: number; p: string }) {
  const spikes = Array.from({ length: 12 }, (_, i) => (i * Math.PI * 2) / 12);
  return (
    <g>
      {spikes.map((a, i) => {
        const x1 = cx + Math.cos(a) * (r - 0.5);
        const y1 = cy + Math.sin(a) * (r - 0.5);
        const x2 = cx + Math.cos(a) * (r + 4.2);
        const y2 = cy + Math.sin(a) * (r + 4.2);
        return (
          <g key={i}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#3d8f52" strokeWidth={1.5} strokeLinecap="round" />
            <circle cx={x2} cy={y2} r={1.9} fill={`url(#${p}-vknob)`} />
          </g>
        );
      })}
      <circle cx={cx} cy={cy} r={r} fill={`url(#${p}-virus)`} />
      <circle cx={cx - r * 0.3} cy={cy - r * 0.35} r={r * 0.24} fill="#ffffff" opacity={0.55} />
      <circle cx={cx + r * 0.28} cy={cy + r * 0.22} r={r * 0.2} fill="#2b6b3d" opacity={0.45} />
    </g>
  );
}

function Bacterium({ cx, cy, rot = 0, s = 1, p }: { cx: number; cy: number; rot?: number; s?: number; p: string }) {
  const w = 26 * s;
  const h = 12 * s;
  return (
    <g transform={`rotate(${rot} ${cx} ${cy})`}>
      <rect x={cx - w / 2} y={cy - h / 2} width={w} height={h} rx={h / 2} fill={`url(#${p}-bac)`} />
      <rect
        x={cx - w / 2 + 2}
        y={cy - h / 2 + 1.4}
        width={w - 4}
        height={h * 0.3}
        rx={h * 0.15}
        fill="#ffffff"
        opacity={0.35}
      />
      <ellipse cx={cx - w * 0.16} cy={cy + h * 0.1} rx={w * 0.12} ry={h * 0.18} fill="#1d2a6b" opacity={0.5} />
      <ellipse cx={cx + w * 0.18} cy={cy - h * 0.05} rx={w * 0.1} ry={h * 0.16} fill="#1d2a6b" opacity={0.5} />
    </g>
  );
}

function MicrobeDefs({ p }: { p: string }) {
  return (
    <defs>
      <radialGradient id={`${p}-virus`} cx="0.34" cy="0.28" r="0.95">
        <stop offset="0" stopColor="#e2fbd0" />
        <stop offset="0.45" stopColor="#8ed96a" />
        <stop offset="1" stopColor="#2f7a3f" />
      </radialGradient>
      <radialGradient id={`${p}-vknob`} cx="0.35" cy="0.3" r="0.9">
        <stop offset="0" stopColor="#dcf7c4" />
        <stop offset="1" stopColor="#4b9a4f" />
      </radialGradient>
      <linearGradient id={`${p}-bac`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#bcd0ff" />
        <stop offset="0.45" stopColor="#5f77dd" />
        <stop offset="1" stopColor="#2c3a95" />
      </linearGradient>
    </defs>
  );
}

/* Membrane overlay: built like the mechanical stage — a real barrier as the
   hero element, pathogens landing on it and piling up, only water below. */
function MembraneOverlay() {
  const falling = [
    { x: 44, kind: "v" as const, d: 0, rot: -12 },
    { x: 96, kind: "b" as const, d: 1.0, rot: 14 },
    { x: 150, kind: "v" as const, d: 2.0, rot: 0 },
    { x: 186, kind: "b" as const, d: 2.8, rot: -22 },
  ];
  return (
    <svg viewBox={VB} className="h-full w-full">
      <MicrobeDefs p="ovm" />
      <defs>
        <linearGradient id="ovm-steel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f9b9d3" />
          <stop offset="0.5" stopColor={PINK} />
          <stop offset="1" stopColor={PINK_DEEP} />
        </linearGradient>
        <radialGradient id="ovm-drop" cx="0.35" cy="0.3" r="0.9">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.55" stopColor={ICE} />
          <stop offset="1" stopColor="#8fb4dd" />
        </radialGradient>
        <filter id="ovm-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>

      {/* pathogens already caught, resting on the membrane */}
      <g opacity="0.95">
        <Virus cx={30} cy={116} r={7} p="ovm" />
        <Bacterium cx={70} cy={120} rot={-8} s={0.8} p="ovm" />
        <Virus cx={116} cy={115} r={8} p="ovm" />
        <Bacterium cx={162} cy={119} rot={6} s={0.9} p="ovm" />
        <Virus cx={198} cy={117} r={6.5} p="ovm" />
      </g>

      {/* the membrane itself — same construction as the steel mesh, but the
          weave is far denser: nothing bigger than 0.01 µm gets through */}
      <g>
        <ellipse cx="110" cy="137" rx="96" ry="16" fill={PINK} opacity="0.16" filter="url(#ovm-glow)" />
        <rect x="14" y="130" width="192" height="4.5" rx="2.2" fill="url(#ovm-steel)" />
        <rect x="14" y="141" width="192" height="4.5" rx="2.2" fill="url(#ovm-steel)" opacity="0.75" />
        {Array.from({ length: 33 }, (_, i) => (
          <rect key={i} x={16 + i * 5.8} y="126" width="2" height="23" rx="1" fill="url(#ovm-steel)" opacity="0.9" />
        ))}
        <motion.rect
          x="14"
          y="129"
          width="34"
          height="17"
          fill="#ffffff"
          opacity="0.25"
          animate={{ x: [14, 172, 14] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </g>

      {/* new pathogens dive in, hit the membrane, settle */}
      {falling.map((f, i) => (
        <motion.g
          key={i}
          animate={{ y: [-120, 0, -4, 0], opacity: [0, 1, 1, 0] }}
          transition={{
            duration: 4.2,
            delay: f.d,
            repeat: Infinity,
            ease: "easeIn",
            times: [0, 0.55, 0.68, 1],
          }}
        >
          {f.kind === "v" ? (
            <Virus cx={f.x} cy={112} r={8} p="ovm" />
          ) : (
            <Bacterium cx={f.x} cy={116} rot={f.rot} s={0.85} p="ovm" />
          )}
        </motion.g>
      ))}

      {/* only clean droplets continue below the barrier */}
      {[52, 110, 168].map((x, i) => (
        <motion.g key={x} animate={{ y: [152, 210], opacity: [0, 1, 0] }} transition={loop(2, i * 0.55)}>
          <circle cx={x} r={3.6} fill="url(#ovm-drop)" />
          <circle cx={x - 1.1} r={1} fill="#ffffff" opacity={0.9} />
        </motion.g>
      ))}

      <Chip symbol="0.01 µm" w={70} />
    </svg>
  );
}

/* Carbon overlay: chlorine, named and labelled, sinking into the bed. */
function CarbonOverlay() {
  const locale = useLocale();
  const name = locale === "uz" ? "XLOR" : "ХЛОР";
  const mols = [
    { x: 44, d: 0 },
    { x: 96, d: 0.9 },
    { x: 148, d: 1.8 },
    { x: 190, d: 2.6 },
  ];
  return (
    <svg viewBox={VB} className="h-full w-full">
      <defs>
        <radialGradient id="ovc-cl" cx="0.34" cy="0.28" r="0.95">
          <stop offset="0" stopColor="#f6ffc4" />
          <stop offset="0.45" stopColor="#d5ec52" />
          <stop offset="1" stopColor="#7e9a14" />
        </radialGradient>
        <filter id="ovc-glow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>

      {mols.map((m, i) => (
        <motion.g
          key={i}
          animate={{ y: [0, 104], opacity: [0, 1, 1, 0], scale: [1, 1, 0.9, 0.5] }}
          transition={{ duration: 3.6, delay: m.d, repeat: Infinity, ease: "easeIn", times: [0, 0.2, 0.75, 1] }}
          style={{ transformOrigin: `${m.x}px 40px` }}
        >
          <circle cx={m.x} cy={40} r={17} fill="#d5ec52" opacity="0.22" filter="url(#ovc-glow)" />
          <circle cx={m.x - 5} cy={40} r={9} fill="url(#ovc-cl)" />
          <circle cx={m.x + 6} cy={36} r={7} fill="url(#ovc-cl)" />
          <circle cx={m.x - 7.5} cy={36.5} r={2.4} fill="#ffffff" opacity="0.85" />
          <text x={m.x - 5} y={43.5} textAnchor="middle" fontSize="9" fontWeight="800" fill="#2f3d05">
            Cl
          </text>
          <text x={m.x + 6} y={39} textAnchor="middle" fontSize="7.5" fontWeight="800" fill="#2f3d05">
            Cl
          </text>
        </motion.g>
      ))}

      <Chip symbol="Cl₂" name={name} w={96} />
    </svg>
  );
}

/* Ion-exchange overlay: hardness ions captured, sodium released — named. */
function ResinOverlay() {
  const locale = useLocale();
  const hardness = locale === "uz" ? "QATTIQLIK" : "ЖЁСТКОСТЬ";
  return (
    <svg viewBox={VB} className="h-full w-full">
      <defs>
        <radialGradient id="ovr-hard" cx="0.34" cy="0.28" r="0.95">
          <stop offset="0" stopColor="#fbd3e5" />
          <stop offset="0.45" stopColor={PINK} />
          <stop offset="1" stopColor={PINK_DEEP} />
        </radialGradient>
        <radialGradient id="ovr-na" cx="0.35" cy="0.3" r="0.9">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.5" stopColor={ICE} />
          <stop offset="1" stopColor="#7ea9d8" />
        </radialGradient>
        <filter id="ovr-glow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>

      {/* hardness ions sink into the resin and stay there */}
      {[
        { x: 52, label: "Ca²⁺", d: 0 },
        { x: 118, label: "Mg²⁺", d: 1.1 },
        { x: 178, label: "Ca²⁺", d: 2.1 },
      ].map((ion, i) => (
        <motion.g
          key={i}
          animate={{ y: [0, 96], opacity: [0, 1, 1, 0], scale: [1, 1, 0.92, 0.6] }}
          transition={{ duration: 4, delay: ion.d, repeat: Infinity, ease: "easeIn", times: [0, 0.22, 0.78, 1] }}
          style={{ transformOrigin: `${ion.x}px 38px` }}
        >
          <circle cx={ion.x} cy={38} r={20} fill={PINK} opacity="0.22" filter="url(#ovr-glow)" />
          <circle cx={ion.x} cy={38} r={13} fill="url(#ovr-hard)" />
          <circle cx={ion.x - 4} cy={34} r={3} fill="#ffffff" opacity="0.8" />
          <text x={ion.x} y={42} textAnchor="middle" fontSize="9" fontWeight="800" fill="#47102a">
            {ion.label}
          </text>
        </motion.g>
      ))}

      {/* sodium released in exchange */}
      {[80, 150].map((x, i) => (
        <motion.g
          key={x}
          animate={{ y: [0, -72], opacity: [0, 0.95, 0] }}
          transition={{ duration: 3.6, delay: 0.7 + i * 1.4, repeat: Infinity, ease: "easeOut" }}
        >
          <circle cx={x} cy={158} r={10.5} fill="url(#ovr-na)" />
          <circle cx={x - 3} cy={154.5} r={2.4} fill="#ffffff" opacity="0.9" />
          <text x={x} y={162} textAnchor="middle" fontSize="8.5" fontWeight="800" fill="#0b2c4e">
            Na⁺
          </text>
        </motion.g>
      ))}

      <Chip symbol="Ca²⁺ · Mg²⁺" name={hardness} w={152} />
    </svg>
  );
}

/* ── Chip-only overlays for the 18.09.2026 clip series ──────────────────────
   The new footage already shows the process (left: what is caught, centre:
   the layer, right: clean water), so the vector particles that used to fall
   top-to-bottom would contradict it. Each stage keeps only the caption chip:
   the chemical symbol + plain-language name in the reader's language. */
function MeshChip() {
  const locale = useLocale();
  return (
    <svg viewBox={VB} className="h-full w-full">
      <Chip symbol="Fe₂O₃ · SiO₂" name={locale === "uz" ? "ZANG · QUM" : "РЖАВЧИНА · ПЕСОК"} w={192} />
    </svg>
  );
}
function CarbonChip() {
  const locale = useLocale();
  return (
    <svg viewBox={VB} className="h-full w-full">
      <Chip symbol="Cl₂" name={locale === "uz" ? "XLOR" : "ХЛОР"} w={96} />
    </svg>
  );
}
function ResinChip() {
  const locale = useLocale();
  return (
    <svg viewBox={VB} className="h-full w-full">
      <Chip symbol="Ca²⁺ · Mg²⁺" name={locale === "uz" ? "QATTIQLIK" : "ЖЁСТКОСТЬ"} w={152} />
    </svg>
  );
}
function MembraneChip() {
  const locale = useLocale();
  return (
    <svg viewBox={VB} className="h-full w-full">
      <Chip symbol="0.01 µm" name={locale === "uz" ? "BAKTERIYALAR" : "БАКТЕРИИ"} w={160} />
    </svg>
  );
}
function MgChip() {
  const locale = useLocale();
  return (
    <svg viewBox={VB} className="h-full w-full">
      <Chip symbol="Mg²⁺" name={locale === "uz" ? "MAGNIY" : "МАГНИЙ"} w={104} />
    </svg>
  );
}

/** Overlay per stage index; null = video plays clean. */
export const STAGE_VIDEO_OVERLAYS: (null | (() => React.ReactElement))[] = [
  MeshChip,
  CarbonChip,
  ResinChip,
  MembraneChip,
  MgChip,
  null, // 06 — the polished water speaks for itself
];

/** The previous overlays, drawn for the old top-to-bottom clips. Kept for
    reference; wire them back in only with footage that flows downward. */
export const LEGACY_VIDEO_OVERLAYS: (null | (() => React.ReactElement))[] = [
  null,
  CarbonOverlay,
  ResinOverlay,
  MembraneOverlay,
  MgIonsOverlay,
  null,
];

export const STAGE_ANIMATIONS = [
  MechanicalStage,
  CarbonStage,
  ResinStage,
  MembraneStage,
  MagnesiumStage,
  PolishStage,
];
