import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { altMeta } from "@/lib/seo";
import { fetchProducts } from "@/lib/api";
import CatalogClient from "./CatalogClient";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "catalogPage.meta" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: altMeta(locale, "/catalog"),
  };
}

export default async function CatalogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "catalogPage" });
  const products = await fetchProducts();

  return (
    <>
      {/* Hero (navy) */}
      <section className="bg-bwt-navy text-bwt-ivory">
        <div className="mx-auto flex min-h-[280px] max-w-[1440px] flex-col justify-center px-6 py-16 lg:min-h-[320px] lg:px-16">
          <p className="mb-5 font-sans text-xs uppercase tracking-[0.25em] text-bwt-gold">
            {t("eyebrow")}
          </p>
          <h1 className="font-serif text-4xl font-normal leading-[1.1] sm:text-5xl lg:text-6xl">
            {t("title")}
          </h1>
          <p className="mt-6 max-w-xl font-sans text-lg text-bwt-ivory/70">
            {t("subtitle")}
          </p>
        </div>
      </section>

      <CatalogClient products={products} locale={locale} />
    </>
  );
}
