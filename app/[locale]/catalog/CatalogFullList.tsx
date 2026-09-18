"use client";

import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocale } from "next-intl";
import { Search, ArrowRight, Droplet, ChevronDown } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { PublicProduct } from "@/lib/types";
import { CATALOG_STRINGS } from "./strings";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function CatalogFullList({ products }: { products: PublicProduct[] }) {
  const locale = useLocale();
  const s = CATALOG_STRINGS[locale] ?? CATALOG_STRINGS.ru;

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [active, setActive] = useState(s.all);
  const headRef = useRef<HTMLDivElement>(null);

  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => set.add(p.category));
    return [s.all, ...Array.from(set)];
  }, [products, s.all]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      if (active !== s.all && p.category !== active) return false;
      if (
        q &&
        !(
          p.name.toLowerCase().includes(q) ||
          (p.sku ?? "").toLowerCase().includes(q) ||
          (p.description ?? "").toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
        )
      )
        return false;
      return true;
    });
  }, [products, active, search, s.all]);

  // ERP unavailable → hide the section entirely (curated sections stand on their own).
  if (!products.length) return null;

  const collapse = () => {
    setOpen(false);
    requestAnimationFrame(() =>
      headRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
    );
  };

  return (
    <section className="bg-bwt-ivory py-16 lg:py-24">
      <div ref={headRef} className="mx-auto max-w-[1440px] scroll-mt-24 px-6 lg:px-16">
        <p className="mb-4 font-sans text-xs uppercase tracking-[0.25em] text-bwt-gold">
          {s.fullEyebrow}
        </p>
        <h2 className="max-w-[760px] font-serif text-3xl font-normal leading-[1.1] text-bwt-charcoal sm:text-4xl lg:text-5xl">
          {s.fullTitle}
        </h2>
        <p className="mt-5 max-w-xl font-sans text-lg text-bwt-graphite">{s.fullSubtitle}</p>

        {!open && (
          <button
            onClick={() => setOpen(true)}
            className="mt-8 inline-flex items-center gap-2 rounded-btn border border-bwt-charcoal/20 px-6 py-3.5 font-sans text-sm font-semibold uppercase tracking-wider text-bwt-charcoal transition-colors hover:border-bwt-gold hover:text-bwt-gold-dark"
          >
            {s.showAll}
            <ChevronDown className="h-4 w-4" />
          </button>
        )}

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="full"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="overflow-hidden"
            >
              <div className="pt-8">
                {/* Search */}
                <div className="relative mb-6 max-w-md">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-bwt-graphite" />
                  <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={s.searchPlaceholder}
                    className="w-full rounded-btn border border-bwt-silver/70 bg-white py-3.5 pl-12 pr-4 font-sans text-base text-bwt-charcoal focus:border-bwt-gold-ink"
                  />
                </div>

                {/* Filter chips */}
                <div className="mb-8 flex flex-wrap gap-2.5">
                  {categories.map((c) => (
                    <button
                      key={c}
                      onClick={() => setActive(c)}
                      className={`rounded-full border px-4 py-2 font-sans text-sm transition-colors ${
                        active === c
                          ? "border-bwt-gold bg-bwt-gold text-bwt-navy-dark"
                          : "border-bwt-silver/70 text-bwt-charcoal hover:border-bwt-gold"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>

                {/* Grid */}
                {filtered.length === 0 ? (
                  <div className="rounded-card border border-bwt-silver/60 bg-white p-12 text-center font-sans text-bwt-graphite">
                    {s.notFound}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {filtered.map((p) => (
                      <Link
                        key={p.id}
                        href={p.sku ? `/catalog/${p.sku}` : "/request"}
                        className="group flex flex-col overflow-hidden rounded-card border border-bwt-silver/60 bg-white transition-shadow hover:shadow-card"
                      >
                        <div className="flex aspect-square items-center justify-center overflow-hidden bg-bwt-cream p-5">
                          {p.imageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={p.imageUrl}
                              alt={p.name}
                              className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <Droplet className="h-12 w-12 text-bwt-silver" strokeWidth={1} />
                          )}
                        </div>
                        <div className="flex flex-1 flex-col p-4">
                          <span className="font-sans text-[0.65rem] uppercase tracking-wider text-bwt-gold-dark">
                            {p.category}
                          </span>
                          <h3 className="mt-1.5 line-clamp-2 font-serif text-base leading-snug text-bwt-charcoal">
                            {p.name}
                          </h3>
                          {p.description && (
                            <p className="mt-1 line-clamp-1 font-sans text-xs text-bwt-graphite">
                              {p.description}
                            </p>
                          )}
                          <span className="mt-auto inline-flex items-center gap-1.5 pt-3 font-sans text-sm font-medium text-bwt-gold-dark">
                            {s.details}
                            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                <button
                  onClick={collapse}
                  className="mt-10 inline-flex items-center gap-2 font-sans text-sm font-medium uppercase tracking-wider text-bwt-graphite transition-colors hover:text-bwt-charcoal"
                >
                  {s.hide}
                  <ChevronDown className="h-4 w-4 rotate-180" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
