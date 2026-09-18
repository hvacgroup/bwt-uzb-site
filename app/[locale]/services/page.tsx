import Image from "next/image";
import { getTranslations } from "next-intl/server";
import {
  Wrench,
  ShieldCheck,
  RefreshCw,
  MessageCircle,
  Check,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { imageBlurs } from "@/lib/image-blurs";
import type { Metadata } from "next";
import { altMeta } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "servicesPage.meta" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: altMeta(locale, "/services"),
  };
}

const JOURNEY_ICONS: LucideIcon[] = [Wrench, ShieldCheck, RefreshCw, MessageCircle];

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "servicesPage" });
  const journey = t.raw("journey") as { title: string; text: string }[];
  const cities = t.raw("coverageCities") as string[];
  const included = t.raw("included") as string[];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-bwt-navy text-bwt-ivory">
        <Image
          src="/images/installations/delivery-installation-team.jpg"
          alt="Команда BWT — доставка и установка системы"
          fill
          priority
          sizes="100vw"
          placeholder="blur"
          blurDataURL={imageBlurs.delivery}
          className="object-cover object-center opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-bwt-navy from-0% via-bwt-navy/85 via-45% to-bwt-navy/55 to-100%" />
        <div className="relative mx-auto flex min-h-[420px] max-w-[1440px] flex-col justify-center px-6 py-20 lg:min-h-[480px] lg:px-16">
          <p className="mb-5 font-sans text-xs uppercase tracking-[0.25em] text-bwt-gold">
            {t("heroEyebrow")}
          </p>
          <h1 className="max-w-[820px] font-serif text-4xl font-normal leading-[1.1] sm:text-5xl lg:text-6xl">
            {t("heroTitle")}
          </h1>
          <p className="mt-6 max-w-xl font-sans text-lg text-bwt-ivory/70">{t("heroSubtitle")}</p>
        </div>
      </section>

      {/* Service journey */}
      <section className="bg-bwt-ivory py-16 lg:py-[120px]">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-16">
          <p className="mb-3 font-sans text-xs uppercase tracking-[0.25em] text-bwt-gold">
            {t("journeyEyebrow")}
          </p>
          <h2 className="max-w-[640px] font-serif text-3xl text-bwt-charcoal lg:text-4xl">
            {t("journeyTitle")}
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {journey.map((s, i) => {
              const Icon = JOURNEY_ICONS[i];
              return (
                <div
                  key={s.title}
                  className="flex flex-col rounded-card border border-bwt-silver/60 bg-white p-8 transition-shadow hover:shadow-card"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-4xl text-bwt-gold">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <Icon className="h-7 w-7 text-bwt-gold" strokeWidth={1.5} />
                  </div>
                  <h3 className="mt-6 font-serif text-2xl text-bwt-charcoal">{s.title}</h3>
                  <p className="mt-3 flex-1 font-sans text-sm leading-relaxed text-bwt-graphite">
                    {s.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Coverage */}
      <section className="bg-bwt-cream py-16 lg:py-[120px]">
        <div className="mx-auto max-w-[900px] px-6 text-center lg:px-16">
          <p className="mb-5 font-sans text-xs uppercase tracking-[0.25em] text-bwt-gold">
            {t("coverageEyebrow")}
          </p>
          <h2 className="font-serif text-3xl text-bwt-charcoal lg:text-4xl">
            {t("coverageTitle")}
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-sans text-lg text-bwt-graphite">
            {t("coverageBody")}
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {cities.map((c) => (
              <span
                key={c}
                className="inline-flex items-center gap-2 rounded-full border border-bwt-silver/70 bg-white px-5 py-2.5 font-sans text-sm text-bwt-charcoal"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-bwt-gold" /> {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* What's included */}
      <section className="bg-bwt-ivory py-16 lg:py-[120px]">
        <div className="mx-auto max-w-[900px] px-6 lg:px-16">
          <p className="mb-3 font-sans text-xs uppercase tracking-[0.25em] text-bwt-gold">
            {t("includedEyebrow")}
          </p>
          <h2 className="font-serif text-3xl text-bwt-charcoal lg:text-4xl">
            {t("includedTitle")}
          </h2>
          <ul className="mt-10 grid grid-cols-1 gap-x-10 gap-y-5 sm:grid-cols-2">
            {included.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-bwt-gold/15 text-bwt-gold">
                  <Check className="h-4 w-4" strokeWidth={2.5} />
                </span>
                <span className="font-sans text-base text-bwt-charcoal">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-bwt-navy py-16 text-center text-bwt-ivory lg:py-24">
        <div className="mx-auto max-w-[720px] px-6 lg:px-16">
          <h2 className="font-serif text-3xl lg:text-4xl">{t("ctaTitle")}</h2>
          <Link
            href="/request"
            className="mt-8 inline-flex items-center gap-2.5 rounded-btn bg-bwt-gold px-7 py-4 font-sans text-sm font-semibold uppercase tracking-wider text-bwt-navy-dark transition-colors hover:bg-bwt-gold-light"
          >
            {t("ctaButton")} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
