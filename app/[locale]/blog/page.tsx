import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { altMeta } from "@/lib/seo";
import { sortedPosts } from "@/lib/blog";
import PostCard from "@/app/components/blog/PostCard";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog.meta" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: altMeta(locale, "/blog"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      type: "website",
      locale: locale === "uz" ? "uz_UZ" : "ru_UZ",
      images: [{ url: sortedPosts()[0].cover, width: 1600, height: 840 }],
    },
  };
}

export default async function BlogIndex({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "blog" });
  const posts = sortedPosts();

  return (
    <>
      <section className="bg-bwt-navy text-bwt-ivory">
        <div className="mx-auto max-w-[1440px] px-6 pt-28 pb-14 lg:px-16 lg:pt-36 lg:pb-16">
          <p className="mb-5 font-sans text-xs uppercase tracking-[0.25em] text-bwt-gold">
            {t("eyebrow")}
          </p>
          <h1 className="max-w-[820px] font-serif text-4xl leading-[1.1] sm:text-5xl lg:text-6xl">
            {t("title")}
          </h1>
          <p className="mt-6 max-w-2xl font-sans text-lg text-bwt-ivory/75">{t("subtitle")}</p>
        </div>
      </section>

      <section className="bg-bwt-cream py-14 lg:py-20">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-6 px-6 md:grid-cols-2 lg:gap-8 lg:px-16 xl:grid-cols-3">
          {posts.map((p) => (
            <PostCard
              key={p.slug}
              post={p}
              locale={locale}
              readMore={t("readMore")}
              minRead={t("minRead")}
            />
          ))}
        </div>
      </section>
    </>
  );
}
