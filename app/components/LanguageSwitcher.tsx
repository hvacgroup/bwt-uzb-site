"use client";

import { useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

const LOCALES = [
  { code: "ru", label: "RU" },
  { code: "uz", label: "UZ" },
] as const;

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();

  return (
    /* Two 24px targets sitting flush against each other was a coin toss on a
       phone. 44px each, with a gap, and the current one announced. */
    <div
      className="inline-flex items-center gap-1 rounded-full border border-bwt-ivory/25 p-1"
      role="group"
      aria-label="RU / UZ"
    >
      {LOCALES.map((l) => (
        <Link
          key={l.code}
          href={pathname}
          locale={l.code}
          aria-current={locale === l.code ? "true" : undefined}
          className={`flex min-h-[40px] min-w-[44px] items-center justify-center rounded-full px-3 font-sans text-xs font-semibold uppercase tracking-wider transition-colors ${
            locale === l.code
              ? "bg-bwt-gold text-bwt-navy-dark"
              : "text-bwt-ivory/70 hover:text-bwt-ivory"
          }`}
        >
          {l.label}
        </Link>
      ))}
    </div>
  );
}
