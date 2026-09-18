import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { imageBlurs } from "@/lib/image-blurs";
import type { Metadata } from "next";
import { altMeta } from "@/lib/seo";
import ChangeTheWorld from "@/app/components/ChangeTheWorld";
import Founder from "@/app/components/Founder";
import Certifications from "@/app/components/Certifications";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about.meta" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: altMeta(locale, "/about"),
  };
}

// Brand-story rows pair with these photos (same order as the `story` array).
const STORY_IMAGES = [
  {
    src: "/images/lifestyle/glass-with-ice-water.jpg",
    blur: imageBlurs.cooking,
    alt: "Чистая вода BWT в стакане — наследие качества с 1823 года",
  },
  {
    src: "/images/lifestyle/lab-scientist-water-sample.jpg",
    blur: imageBlurs.calm,
    alt: "Лаборатория BWT — немецкая инженерия и контроль качества воды",
  },
  {
    src: "/images/installations/delivery-installation-team.jpg",
    blur: imageBlurs.delivery,
    alt: "Команда BWT Uzbekistan на установке системы",
  },
];


export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  const story = t.raw("story") as { title: string; body: string }[];
  const trust = t.raw("trust") as { stat: string; label: string }[];
  const milestones = t.raw("milestones") as { year: string; text: string }[];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-bwt-navy text-bwt-ivory">
        <Image
          src="/images/installations/bwt-under-sink-install.jpg"
          alt="Профессиональная установка системы BWT под мойкой"
          fill
          priority
          sizes="100vw"
          placeholder="blur"
          blurDataURL={imageBlurs.installAbout}
          className="object-cover object-center opacity-25"
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
          <p className="mt-4 font-serif text-lg italic text-bwt-gold">{t("heroTagline")}</p>
        </div>
      </section>

      {/* Brand story — alternating image/text rows */}
      <section className="bg-bwt-ivory py-16 lg:py-[120px]">
        <div className="mx-auto max-w-[1180px] px-6 lg:px-16">
          <p className="mb-12 font-sans text-xs uppercase tracking-[0.25em] text-bwt-gold">
            {t("storyEyebrow")}
          </p>
          <div className="space-y-16 lg:space-y-24">
            {story.map((s, i) => {
              const img = STORY_IMAGES[i];
              const flip = i % 2 === 1;
              return (
                <div
                  key={s.title}
                  className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-16"
                >
                  <div
                    className={`relative aspect-[4/3] overflow-hidden rounded-card shadow-card ${
                      flip ? "lg:order-2" : ""
                    }`}
                  >
                    {img && (
                      <Image
                        src={img.src}
                        alt={img.alt}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        placeholder="blur"
                        blurDataURL={img.blur}
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className={flip ? "lg:order-1" : ""}>
                    <h2 className="font-serif text-3xl text-bwt-charcoal lg:text-4xl">{s.title}</h2>
                    <p className="mt-5 font-sans text-lg leading-relaxed text-bwt-graphite">
                      {s.body}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Founder — local distributor */}
      <Founder />

      {/* Trust block (replaces team section) */}
      <section className="bg-bwt-navy py-16 text-bwt-ivory lg:py-[120px]">
        <div className="mx-auto max-w-[1180px] px-6 text-center lg:px-16">
          <p className="mb-5 font-sans text-xs uppercase tracking-[0.25em] text-bwt-gold">
            {t("trustEyebrow")}
          </p>
          <h2 className="font-serif text-3xl lg:text-4xl">{t("trustTitle")}</h2>

          <div className="mt-12 grid grid-cols-2 gap-x-8 gap-y-12 lg:grid-cols-3">
            {trust.map((tr) => (
              <div key={tr.label}>
                <div className="font-serif text-3xl text-bwt-gold sm:text-4xl">{tr.stat}</div>
                <p className="mx-auto mt-2 max-w-[200px] font-sans text-sm text-bwt-ivory/65">
                  {tr.label}
                </p>
              </div>
            ))}
          </div>

          {/* Certifications */}
          <div className="mt-16 border-t border-white/10 pt-10">
            <p className="mb-6 font-sans text-xs uppercase tracking-[0.25em] text-bwt-gold/80">
              {t("certsTitle")}
            </p>
            <Certifications className="mt-2" />
          </div>
        </div>
      </section>

      {/* Milestones timeline */}
      <section className="bg-bwt-ivory py-16 lg:py-[120px]">
        <div className="mx-auto max-w-[1180px] px-6 lg:px-16">
          <p className="mb-3 font-sans text-xs uppercase tracking-[0.25em] text-bwt-gold">
            {t("milestonesEyebrow")}
          </p>
          <h2 className="font-serif text-3xl text-bwt-charcoal lg:text-4xl">
            {t("milestonesTitle")}
          </h2>
          <ol className="mt-12 flex gap-6 overflow-x-auto pb-4 lg:grid lg:grid-cols-5 lg:gap-8 lg:overflow-visible lg:pb-0">
            {milestones.map((m) => (
              <li
                key={`${m.year}-${m.text}`}
                className="relative min-w-[210px] shrink-0 border-t-2 border-bwt-gold/25 pt-5 lg:min-w-0 lg:shrink"
              >
                <span className="absolute -top-[5px] left-0 h-2.5 w-2.5 rounded-full bg-bwt-gold" />
                <div className="font-serif text-2xl text-bwt-gold">{m.year}</div>
                <p className="mt-2 font-sans text-sm leading-relaxed text-bwt-graphite">{m.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* BWT Change the World (Africa CSR) */}
      <ChangeTheWorld />

      {/* Mission quote */}
      <section className="bg-bwt-cream py-16 text-center lg:py-[120px]">
        <div className="mx-auto max-w-[860px] px-6 lg:px-16">
          <p className="mb-6 font-sans text-xs uppercase tracking-[0.25em] text-bwt-gold">
            {t("missionEyebrow")}
          </p>
          <p className="font-serif text-2xl italic leading-snug text-bwt-charcoal lg:text-[2rem] lg:leading-[1.4]">
            «{t("missionQuote")}»
          </p>
          <p className="mt-6 font-sans text-sm font-medium text-bwt-graphite">
            {t("missionAttribution")}
          </p>
          <p className="mt-10 font-serif text-xl text-bwt-gold lg:text-2xl">
            {t("missionBrandLine")}
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-bwt-navy py-16 text-center text-bwt-ivory lg:py-24">
        <div className="mx-auto max-w-[720px] px-6 lg:px-16">
          <h2 className="font-serif text-3xl lg:text-4xl">{t("ctaTitle")}</h2>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/request"
              className="inline-flex items-center gap-2.5 rounded-btn bg-bwt-gold px-7 py-4 font-sans text-sm font-semibold uppercase tracking-wider text-bwt-navy-dark transition-colors hover:bg-bwt-gold-light"
            >
              {t("ctaPrimary")} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2.5 rounded-btn border border-bwt-ivory/30 px-7 py-4 font-sans text-sm font-semibold uppercase tracking-wider text-bwt-ivory transition-colors hover:border-bwt-gold hover:text-bwt-gold"
            >
              {t("ctaSecondary")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
