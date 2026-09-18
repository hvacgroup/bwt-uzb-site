import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import RequestClient from "./RequestClient";
import { Droplet, MapPin, Send, Check, type LucideIcon } from "lucide-react";
import type { Metadata } from "next";
import { altMeta } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "requestPage.meta" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: altMeta(locale, "/request"),
  };
}

const BENEFIT_ICONS: LucideIcon[] = [Droplet, MapPin, Send];

export default async function RequestPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "requestPage" });
  const benefits = t.raw("benefits") as { title: string; text: string }[];
  const trustItems = t.raw("trustItems") as string[];

  return (
    <>
      <section id="lead" className="bg-bwt-navy text-bwt-ivory">
        <div className="mx-auto max-w-[720px] px-6 py-16 lg:px-16 lg:py-24">
          <p className="mb-5 text-center font-sans text-xs uppercase tracking-[0.25em] text-bwt-gold">
            {t("heroEyebrow")}
          </p>
          <h1 className="text-center font-serif text-4xl font-normal leading-[1.1] sm:text-5xl">
            {t("heroTitle")}
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-center font-sans text-lg text-bwt-ivory/75">
            {t("heroSubtitle")}
          </p>
          <Suspense fallback={<div className="mt-10 text-center text-bwt-ivory/50">…</div>}>
            <RequestClient />
          </Suspense>

          <ul className="mx-auto mt-8 flex max-w-[520px] flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {trustItems.map((item) => (
              <li
                key={item}
                className="inline-flex items-center gap-2 font-sans text-sm text-bwt-ivory/70"
              >
                <Check className="h-4 w-4 text-bwt-gold" strokeWidth={2.5} /> {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-bwt-ivory py-16 lg:py-[120px]">
        <div className="mx-auto max-w-[1100px] px-6 lg:px-16">
          <p className="mb-8 font-sans text-xs uppercase tracking-[0.25em] text-bwt-gold">
            {t("whatYouGet")}
          </p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {benefits.map((b, i) => {
              const Icon = BENEFIT_ICONS[i];
              return (
                <div key={b.title} className="rounded-card border border-bwt-silver/60 bg-white p-8">
                  <Icon className="h-8 w-8 text-bwt-gold" strokeWidth={1.5} />
                  <h3 className="mt-5 font-serif text-xl text-bwt-charcoal">{b.title}</h3>
                  <p className="mt-2 font-sans text-sm text-bwt-graphite">{b.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
