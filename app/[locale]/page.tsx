import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { altMeta } from "@/lib/seo";
import Hero from "@/app/components/Hero";
import HiddenThreat from "@/app/components/HiddenThreat";
import PainPoints from "@/app/components/PainPoints";
import SlimReveal from "@/app/components/SlimReveal";
import Technology from "@/app/components/Technology";
import Lifestyle from "@/app/components/Lifestyle";
import Lineup from "@/app/components/Lineup";
import Installations from "@/app/components/Installations";
import ServiceGuarantees from "@/app/components/ServiceGuarantees";
import Founder from "@/app/components/Founder";
import Reviews from "@/app/components/Reviews";
import PremiumResidences from "@/app/components/PremiumResidences";
import ChangeTheWorld from "@/app/components/ChangeTheWorld";
import FinalCTA from "@/app/components/FinalCTA";

/* The home page shipped without metadata, so /ru and /uz were two indexable
   URLs with the same Russian title and no link between them. */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home.meta" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: altMeta(locale, "/"),
    openGraph: {
      title: t("ogTitle"),
      description: t("ogDescription"),
      locale: locale === "uz" ? "uz_UZ" : "ru_UZ",
      type: "website",
    },
  };
}

export default function Home() {
  return (
    <>
      {/* 1 — Hero */}
      <Hero />
      {/* 2 — Скрытая угроза */}
      <HiddenThreat />
      {/* 3 — Что страдает */}
      <PainPoints />
      {/* 4 — BWT Slim Reveal */}
      <SlimReveal />
      {/* 5 — Технология (5 ступеней) */}
      <Technology />
      {/* 6 — Жизнь с BWT */}
      <Lifestyle />
      {/* 7 — Линейка + Калькулятор */}
      <Lineup />
      {/* 7.5 — Реальные монтажи */}
      <Installations />
      {/* 8 — Гарантии и сервис */}
      <ServiceGuarantees />
      {/* 8.3 — Основатель */}
      <Founder />
      {/* 8.6 — Отзывы специалистов */}
      <Reviews />
      {/* 9 — Premium ЖК */}
      <PremiumResidences />
      {/* 9.5 — BWT Change the World (Africa CSR) */}
      <ChangeTheWorld />
      {/* 10 — Final CTA / Lead form */}
      <FinalCTA />
    </>
  );
}
