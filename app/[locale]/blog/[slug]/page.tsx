import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft, ArrowRight, Send } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { altMeta } from "@/lib/seo";
import { POSTS, getPost, postText, sortedPosts } from "@/lib/blog";
import { BRAND } from "@/lib/config";
import RichText from "@/app/components/blog/RichText";
import PostCard, { formatDate } from "@/app/components/blog/PostCard";

const SITE = "https://bwt-uzb.uz";

// Only the slugs listed in lib/blog.ts exist; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

type Params = Promise<{ locale: string; slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  const t = postText(post, locale);
  return {
    title: `${t.seoTitle} | BWT`,
    description: t.description,
    alternates: altMeta(locale, `/blog/${slug}`),
    openGraph: {
      title: t.title,
      description: t.description,
      type: "article",
      publishedTime: post.date,
      locale: locale === "uz" ? "uz_UZ" : "ru_UZ",
      siteName: BRAND.name,
      images: [{ url: post.cover, width: 1600, height: 840, alt: t.coverAlt }],
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function BlogPost({ params }: { params: Params }) {
  const { locale, slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "blog" });
  const text = postText(post, locale);
  const uz = locale === "uz";
  const base = uz ? `${SITE}/uz` : SITE;
  const url = `${base}/blog/${slug}`;
  const others = sortedPosts().filter((p) => p.slug !== slug).slice(0, 3);

  // Article + breadcrumbs for rich results. Everything here is also visible on the page.
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: text.title,
      description: text.description,
      image: `${SITE}${post.cover}`,
      datePublished: post.date,
      dateModified: post.date,
      inLanguage: uz ? "uz-UZ" : "ru-UZ",
      mainEntityOfPage: url,
      url,
      author: { "@id": `${SITE}/#organization` },
      publisher: { "@id": `${SITE}/#organization` },
      citation: post.sources.filter((s) => s.url).map((s) => s.url),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: t("home"), item: base },
        { "@type": "ListItem", position: 2, name: t("eyebrow"), item: `${base}/blog` },
        { "@type": "ListItem", position: 3, name: text.title, item: url },
      ],
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="bg-bwt-navy text-bwt-ivory">
        <div className="mx-auto max-w-[880px] px-6 pt-28 pb-12 lg:pt-36 lg:pb-14">
          <nav aria-label="Breadcrumb" className="mb-8 font-sans text-sm text-bwt-ivory/60">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="hover:text-bwt-gold">
                  {t("home")}
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link href="/blog" className="hover:text-bwt-gold">
                  {t("eyebrow")}
                </Link>
              </li>
            </ol>
          </nav>
          <h1 className="font-serif text-3xl leading-[1.15] sm:text-4xl lg:text-5xl">{text.title}</h1>
          <p className="mt-6 font-sans text-lg leading-relaxed text-bwt-ivory/80">{text.lead}</p>
          <p className="mt-6 font-sans text-sm text-bwt-ivory/60">
            {t("published")} <time dateTime={post.date}>{formatDate(post.date, locale)}</time>
            <span aria-hidden> · </span>
            {post.readMin} {t("minRead")}
          </p>
        </div>
      </section>

      <div className="bg-white">
        <div className="mx-auto max-w-[880px] px-6 pt-8 lg:pt-12">
          <div className="relative aspect-[40/21] overflow-hidden rounded-card shadow-card">
            <Image
              src={post.cover}
              alt={text.coverAlt}
              fill
              priority
              sizes="(max-width: 928px) 100vw, 880px"
              className="object-cover"
            />
          </div>
        </div>

        <article className="mx-auto max-w-[720px] px-6 pt-10 pb-16 lg:pt-14 lg:pb-20">
          <RichText blocks={text.body} />

          <aside className="mt-12 rounded-card bg-bwt-cream p-6">
            <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-bwt-gold-ink">
              {t("sources")}
            </h2>
            <ul className="mt-3 space-y-2 font-sans text-sm leading-relaxed text-bwt-graphite">
              {post.sources.map((s) => (
                <li key={s.label}>
                  {s.url ? (
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline decoration-bwt-silver underline-offset-4 hover:text-bwt-charcoal"
                    >
                      {s.label}
                    </a>
                  ) : (
                    s.label
                  )}
                </li>
              ))}
            </ul>
          </aside>

          <a
            href={post.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 flex items-center gap-4 rounded-card border border-bwt-silver/70 p-5 transition-colors hover:border-bwt-gold"
          >
            <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-bwt-navy text-bwt-gold">
              <Send className="h-5 w-5" aria-hidden />
            </span>
            <span className="font-sans text-sm text-bwt-graphite">
              {t("telegram")}
              <span className="mt-0.5 block font-semibold text-bwt-charcoal">
                {t("telegramLink")} · {BRAND.telegramHandle}
              </span>
            </span>
          </a>

          <div className="mt-10 rounded-card bg-bwt-navy p-8 text-bwt-ivory">
            <h2 className="font-serif text-2xl leading-snug">{t("ctaTitle")}</h2>
            <p className="mt-3 font-sans text-base text-bwt-ivory/75">{t("ctaBody")}</p>
            <Link
              // The title rides along as "interested in", so the lead in the ERP shows which article sent it.
              href={`/request?name=${encodeURIComponent(text.title)}`}
              className="mt-6 inline-flex items-center gap-2 rounded-btn bg-bwt-gold px-6 py-3.5 font-sans text-sm font-semibold uppercase tracking-[0.06em] text-bwt-navy-dark transition-colors hover:bg-bwt-gold-light"
            >
              {t("ctaButton")}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>

          <Link
            href="/blog"
            className="mt-10 inline-flex items-center gap-1.5 font-sans text-sm text-bwt-graphite transition-colors hover:text-bwt-gold-ink"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden /> {t("back")}
          </Link>
        </article>
      </div>

      {others.length > 0 && (
        <section className="bg-bwt-cream py-14 lg:py-20">
          <div className="mx-auto max-w-[1440px] px-6 lg:px-16">
            <h2 className="mb-8 border-l-4 border-bwt-gold pl-4 font-serif text-2xl text-bwt-charcoal lg:text-3xl">
              {t("related")}
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8 xl:grid-cols-3">
              {others.map((p) => (
                <PostCard
                  key={p.slug}
                  post={p}
                  locale={locale}
                  readMore={t("readMore")}
                  minRead={t("minRead")}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
