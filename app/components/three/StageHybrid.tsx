"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useLocale } from "next-intl";

/* ─────────────────────────────────────────────────────────────────────────
   Stage "hybrid" overlay — the code layer drawn over the photoreal clip.
   Ported 1:1 from the approved standalone cards (D:\Claude\BWT\stages):
   legend (what is caught), stage tag, animated callout (pulsing ring, dashed
   pointer), caption, and fine water particles drifting toward the layer.

   Everything textual is one SVG in the cards' 760×760 coordinate space, so it
   scales with the panel (380 px desktop, ≤340 px phone) without font math.
   Particles are a canvas; the loop runs only while `active`.
   ───────────────────────────────────────────────────────────────────────── */

const PINK = "#EC4C86";
const FONT = "var(--font-sans), Inter, system-ui, sans-serif";

type Legend = { t: string; c: string; sq?: boolean };
type Copy = { legend: Legend[]; tag: string; lines: [string, string, string]; h3: string; p: string };
type Stage = { dot: [number, number]; elbow: [number, number]; membraneX: number; ru: Copy; uz: Copy };

const RUST = "#d0782f", SAND = "#d9b46a", SILT = "#9aa3b5";
const CHLOR = "#b5d34a", ODOR = "#d9a441", TASTE = "#8fb4e8";
const SALT = "#f2f4f8", SCALE = "#b8bfd0";
const BACT = "#8fd048", CYST = "#d6d24a", PLAST = "#6f96f0";
const SOFT = "#C9D2F0";

export const STAGE_HYBRID: Stage[] = [
  {
    dot: [400, 330], elbow: [520, 300], membraneX: 0.47,
    ru: { legend: [{ t: "Ржавчина", c: RUST }, { t: "Песок", c: SAND }, { t: "Взвесь · ил", c: SILT, sq: true }],
      tag: "Ступень 01 · Механика", lines: ["МЕХАНИЧЕСКИЙ БАРЬЕР", "ЗАДЕРЖИВАЕТ ЧАСТИЦЫ", "ИЗ СТАРЫХ ТРУБ"],
      h3: "Защита от ржавчины и песка", p: "механическая фильтрация" },
    uz: { legend: [{ t: "Zang", c: RUST }, { t: "Qum", c: SAND }, { t: "Loyqa", c: SILT, sq: true }],
      tag: "Bosqich 01 · Mexanika", lines: ["MEXANIK TO'SIQ", "ESKI QUVURLARDAGI", "ZARRALARNI USHLAYDI"],
      h3: "Zang va qumdan himoya", p: "mexanik tozalash" },
  },
  {
    dot: [410, 330], elbow: [520, 300], membraneX: 0.45,
    ru: { legend: [{ t: "Хлор", c: CHLOR }, { t: "Запах", c: ODOR }, { t: "Привкус", c: TASTE, sq: true }],
      tag: "Ступень 02 · Уголь", lines: ["АКТИВИРОВАННЫЙ УГОЛЬ", "УБИРАЕТ ХЛОР,", "ЗАПАХ И ПРИВКУС"],
      h3: "Без хлора и запаха", p: "активированный уголь" },
    uz: { legend: [{ t: "Xlor", c: CHLOR }, { t: "Hid", c: ODOR }, { t: "Ta'm", c: TASTE, sq: true }],
      tag: "Bosqich 02 · Ko'mir", lines: ["FAOL KO'MIR", "XLOR, HID VA", "TA'MNI YO'QOTADI"],
      h3: "Xlor va hidsiz suv", p: "faol ko'mir" },
  },
  {
    dot: [400, 330], elbow: [520, 300], membraneX: 0.42,
    ru: { legend: [{ t: "Соли жёсткости", c: SALT }, { t: "Накипь", c: SCALE, sq: true }],
      tag: "Ступень 03 · Умягчение", lines: ["ИОНООБМЕННАЯ СМОЛА", "ЗАБИРАЕТ СОЛИ ЖЁСТКОСТИ", "SLIM 3 · SLIM 4"],
      h3: "Защита от накипи", p: "кожа · волосы · техника" },
    uz: { legend: [{ t: "Qattiqlik tuzlari", c: SALT }, { t: "Cho'kma", c: SCALE, sq: true }],
      tag: "Bosqich 03 · Yumshatish", lines: ["ION ALMASHINUVCHI SMOLA", "QATTIQLIK TUZLARINI OLADI", "SLIM 3 · SLIM 4"],
      h3: "Cho'kmadan himoya", p: "teri · soch · texnika" },
  },
  {
    dot: [440, 330], elbow: [520, 300], membraneX: 0.47,
    ru: { legend: [{ t: "Бактерии · 0.5–5 µm", c: BACT }, { t: "Цисты · 4–12 µm", c: CYST }, { t: "Микропластик", c: PLAST, sq: true }],
      tag: "Ступень 04 · UF", lines: ["ПОРЫ 0.01 µm", "БАКТЕРИЯ КРУПНЕЕ", "В 50–500 РАЗ"],
      h3: "Защита от бактерий", p: "0.01 µm" },
    uz: { legend: [{ t: "Bakteriyalar · 0.5–5 µm", c: BACT }, { t: "Sistalar · 4–12 µm", c: CYST }, { t: "Mikroplastik", c: PLAST, sq: true }],
      tag: "Bosqich 04 · UF", lines: ["G'OVAKLAR 0.01 µm", "BAKTERIYA 50–500", "MARTA KATTAROQ"],
      h3: "Bakteriyalardan himoya", p: "0.01 µm" },
  },
  {
    dot: [505, 330], elbow: [560, 300], membraneX: 0.42,
    ru: { legend: [{ t: "Магний Mg²⁺", c: PINK }, { t: "Натуральный состав сохранён", c: SOFT, sq: true }],
      tag: "Ступень 05 · Магний", lines: ["МАГНИЙ Mg²⁺", "ПАТЕНТОВАННАЯ", "ТЕХНОЛОГИЯ BWT"],
      h3: "Обогащение магнием", p: "не деминерализует · Slim 4" },
    uz: { legend: [{ t: "Magniy Mg²⁺", c: PINK }, { t: "Tabiiy tarkib saqlanadi", c: SOFT, sq: true }],
      tag: "Bosqich 05 · Magniy", lines: ["MAGNIY Mg²⁺", "PATENTLANGAN", "BWT TEXNOLOGIYASI"],
      h3: "Magniy bilan boyitish", p: "deminerallashtirmaydi · Slim 4" },
  },
  {
    dot: [400, 330], elbow: [520, 300], membraneX: 0.47,
    ru: { legend: [{ t: "Остаточная взвесь", c: SILT, sq: true }, { t: "Привкус", c: ODOR }],
      tag: "Ступень 06 · Пост-фильтр", lines: ["ФИНИШНАЯ ПОЛИРОВКА", "ВКУС ПРЕМИУМ-", "МИНЕРАЛЬНОЙ ВОДЫ"],
      h3: "Вкус премиум-воды", p: "финальная ступень" },
    uz: { legend: [{ t: "Qoldiq zarralar", c: SILT, sq: true }, { t: "Ta'm", c: ODOR }],
      tag: "Bosqich 06 · Post-filtr", lines: ["YAKUNIY SAYQAL", "PREMIUM-MINERAL", "SUV TA'MI"],
      h3: "Premium suv ta'mi", p: "yakuniy bosqich" },
  },
];

/* Text outline so labels stay readable over bright water. */
const OUTLINE = { paintOrder: "stroke" as const, stroke: "rgba(5,10,25,0.85)", strokeWidth: 4, strokeLinejoin: "round" as const };

/* Fine water particles drifting toward the layer — the cards' canvas layer. */
function Particles({ membraneX, active }: { membraneX: number; active: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current;
    if (!cv || !active) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    let seed = 7;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
    const P = Array.from({ length: 90 }, () => ({
      x: rnd() * 0.62, y: rnd(), r: 0.6 + rnd() * 1.6, s: 0.005 + rnd() * 0.011, ph: rnd() * 6.28, a: 0.18 + rnd() * 0.4,
    }));
    let W = 0, H = 0, DPR = 1, raf = 0;
    const t0 = performance.now();
    const resize = () => {
      const b = cv.getBoundingClientRect();
      DPR = Math.min(2, window.devicePixelRatio || 1);
      W = cv.width = Math.max(1, Math.round(b.width * DPR));
      H = cv.height = Math.max(1, Math.round(b.height * DPR));
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(cv);
    const draw = (now: number) => {
      const t = (now - t0) / 1000;
      ctx.clearRect(0, 0, W, H);
      for (const p of P) {
        p.x += p.s * 0.016;
        const y = p.y + Math.sin(t * 0.35 + p.ph) * 0.004;
        if (p.x > membraneX - 0.01) { p.x = rnd() * 0.08; p.y = rnd(); }
        const near = 1 - Math.min(1, (membraneX - p.x) / 0.12);
        const a = p.a * (0.85 + 0.15 * Math.sin(t * 0.6 + p.ph * 3)) * (0.6 + 0.6 * near);
        const X = p.x * W, Y = y * H, R = p.r * DPR * (1 + near * 0.8) * (W / (760 * DPR)) * 1.6;
        const g = ctx.createRadialGradient(X, Y, 0, X, Y, R * 3);
        g.addColorStop(0, `rgba(200,225,255,${a})`);
        g.addColorStop(1, "rgba(200,225,255,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(X, Y, R * 3, 0, 6.283);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); ctx.clearRect(0, 0, W, H); };
  }, [membraneX, active]);
  return <canvas ref={ref} className="pointer-events-none absolute inset-0 h-full w-full mix-blend-screen" />;
}

export default function StageHybrid({ index, active = true }: { index: number; active?: boolean }) {
  const locale = useLocale();
  const st = STAGE_HYBRID[Math.min(index, STAGE_HYBRID.length - 1)];
  const c = locale === "uz" ? st.uz : st.ru;
  const [dx, dy] = st.dot;
  const [ex, ey] = st.elbow;
  const END = 722;
  const id = `hy${index}`;

  return (
    <div className="pointer-events-none absolute inset-0">
      <Particles membraneX={st.membraneX} active={active} />
      <svg viewBox="0 0 760 760" className="absolute inset-0 h-full w-full" aria-hidden="true" style={{ fontFamily: FONT }}>
        <defs>
          <linearGradient id={`${id}-top`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0A1428" stopOpacity="0.6" />
            <stop offset="1" stopColor="#0A1428" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={`${id}-bot`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#08112A" stopOpacity="0" />
            <stop offset="1" stopColor="#08112A" stopOpacity="0.82" />
          </linearGradient>
          <filter id={`${id}-glow`} x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>

        {/* grading: protect the labels top and bottom */}
        <rect x="0" y="0" width="760" height="180" fill={`url(#${id}-top)`} />
        <rect x="0" y="470" width="760" height="290" fill={`url(#${id}-bot)`} />

        {/* legend — what this stage catches */}
        <g fontSize="21" fontWeight="500" letterSpacing="3" fill="rgba(214,222,245,0.9)" {...OUTLINE}>
          {c.legend.map((l, i) => {
            const y = 60 + i * 32;
            return (
              <g key={l.t}>
                {l.sq ? (
                  <rect x="46" y={y - 9} width="15" height="15" rx="2.5" fill={l.c} stroke="none" />
                ) : (
                  <>
                    <circle cx="53.5" cy={y - 1.5} r="10" fill={l.c} opacity="0.45" filter={`url(#${id}-glow)`} stroke="none" />
                    <circle cx="53.5" cy={y - 1.5} r="7.5" fill={l.c} stroke="none" />
                  </>
                )}
                <text x="74" y={y + 6} style={{ textTransform: "uppercase" }}>{l.t.toUpperCase()}</text>
              </g>
            );
          })}
        </g>

        {/* stage tag */}
        <text x="714" y="66" textAnchor="end" fontSize="19" fontWeight="500" letterSpacing="4" fill={PINK} {...OUTLINE}>
          {c.tag.toUpperCase()}
        </text>

        {/* callout: pulsing ring + dashed pointer + three lines */}
        <motion.circle cx={dx} cy={dy} fill="none" stroke={PINK} strokeWidth="1.6"
          animate={{ r: [5, 24, 24], opacity: [0.8, 0, 0] }}
          transition={{ duration: 6, times: [0, 0.7, 1], repeat: Infinity, ease: "easeOut" }} />
        <circle cx={dx} cy={dy} r="4" fill={PINK} filter={`url(#${id}-glow)`} />
        <circle cx={dx} cy={dy} r="3.4" fill={PINK} />
        <motion.path d={`M${dx} ${dy} L${ex} ${ey} L${END} ${ey}`} fill="none" stroke={PINK} strokeWidth="1.6"
          strokeDasharray="7 6" animate={{ strokeDashoffset: [0, -52] }}
          transition={{ duration: 14, repeat: Infinity, ease: "linear" }} />
        <text x={END} y={ey - 60} textAnchor="end" fontSize="24" fontWeight="600" letterSpacing="3" fill="#FFD5E4" {...OUTLINE}>{c.lines[0]}</text>
        <text x={END} y={ey - 34} textAnchor="end" fontSize="18" fontWeight="500" letterSpacing="2.5" fill="#DCE3F7" {...OUTLINE}>{c.lines[1]}</text>
        <text x={END} y={ey - 12} textAnchor="end" fontSize="18" fontWeight="500" letterSpacing="2.5" fill="#DCE3F7" {...OUTLINE}>{c.lines[2]}</text>

        {/* caption */}
        <text x="380" y="686" textAnchor="middle" fontSize="31" fontWeight="800" letterSpacing="5" fill={PINK} {...OUTLINE}>
          {c.h3.toUpperCase()}
        </text>
        <text x="380" y="720" textAnchor="middle" fontSize="20" fontWeight="500" letterSpacing="4" fill={SOFT} {...OUTLINE}>
          {c.p}
        </text>
      </svg>
    </div>
  );
}
