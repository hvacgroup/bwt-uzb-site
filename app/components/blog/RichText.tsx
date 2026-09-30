import { Fragment } from "react";
import { Link } from "@/i18n/navigation";
import type { Block } from "@/lib/blog";

const LINK = /\[([^\]]+)\]\(([^)\s]+)\)/g;

/** Turns "[text](href)" into links. "/…" stays on the site, the rest opens in a new tab. */
export function Inline({ text }: { text: string }) {
  const out: React.ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(LINK)) {
    const [whole, label, href] = m;
    const at = m.index ?? 0;
    if (at > last) out.push(text.slice(last, at));
    const cls =
      "font-medium text-bwt-gold-ink underline decoration-bwt-gold/50 underline-offset-4 transition-colors hover:decoration-bwt-gold-ink";
    if (href.startsWith("/")) {
      out.push(
        <Link key={at} href={href} className={cls}>
          {label}
        </Link>
      );
    } else {
      const external = href.startsWith("http");
      out.push(
        <a
          key={at}
          href={href}
          className={cls}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {label}
        </a>
      );
    }
    last = at + whole.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return <>{out.map((n, i) => <Fragment key={i}>{n}</Fragment>)}</>;
}

export default function RichText({ blocks }: { blocks: Block[] }) {
  return (
    <div className="font-sans text-[17px] leading-[1.75] text-bwt-graphite lg:text-lg">
      {blocks.map((b, i) => {
        switch (b.t) {
          case "h2":
            return (
              <h2
                key={i}
                className="mt-12 mb-4 border-l-4 border-bwt-gold pl-4 font-serif text-2xl leading-snug text-bwt-charcoal first:mt-0 lg:text-[28px]"
              >
                {b.text}
              </h2>
            );
          case "h3":
            return (
              <h3 key={i} className="mt-7 mb-2 font-sans text-lg font-semibold text-bwt-charcoal">
                {b.text}
              </h3>
            );
          case "p":
            return (
              <p key={i} className="mt-4">
                <Inline text={b.text} />
              </p>
            );
          case "ul":
            return (
              <ul key={i} className="mt-4 space-y-2 pl-1">
                {b.items.map((it, j) => (
                  <li key={j} className="flex gap-3">
                    <span aria-hidden className="mt-[0.7em] h-1.5 w-1.5 flex-none rounded-full bg-bwt-gold" />
                    <span>
                      <Inline text={it} />
                    </span>
                  </li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={i} className="mt-4 space-y-3">
                {b.items.map((it, j) => (
                  <li key={j} className="flex gap-4">
                    <span
                      aria-hidden
                      className="mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-full bg-bwt-navy font-sans text-sm font-semibold text-white"
                    >
                      {j + 1}
                    </span>
                    <span>
                      <Inline text={it} />
                    </span>
                  </li>
                ))}
              </ol>
            );
        }
      })}
    </div>
  );
}
