import { getTranslations } from "next-intl/server";
import { BRAND } from "@/lib/config";
import { Phone, Mail, Send, MessageCircle, Camera, MapPin, Clock, type LucideIcon } from "lucide-react";
import ContactForm from "./ContactForm";
import type { Metadata } from "next";
import { altMeta } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contactsPage.meta" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: altMeta(locale, "/contacts"),
  };
}

const waHref = `https://wa.me/${BRAND.phoneHref.replace(/[^0-9]/g, "")}`;

export default async function ContactsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const loc = locale === "uz" ? "uz" : "ru";
  const t = await getTranslations({ locale, namespace: "contactsPage" });
  const hours = BRAND.workingHours[loc];

  const rows: { icon: LucideIcon; label: string; value: string; href: string }[] = [
    { icon: Phone, label: t("labels.phone"), value: BRAND.phone, href: BRAND.phoneHref },
    { icon: Mail, label: t("labels.email"), value: BRAND.email, href: `mailto:${BRAND.email}` },
    { icon: Send, label: t("labels.telegram"), value: BRAND.telegramHandle, href: BRAND.telegram },
    { icon: MessageCircle, label: t("labels.whatsapp"), value: t("whatsappValue"), href: waHref },
    { icon: Camera, label: t("labels.instagram"), value: BRAND.instagramHandle, href: BRAND.instagram },
    { icon: MapPin, label: t("labels.office"), value: BRAND.address[loc], href: BRAND.geo.googleLink },
  ];

  return (
    <>
      {/* Hero */}
      <section className="bg-bwt-navy text-bwt-ivory">
        <div className="mx-auto flex min-h-[280px] max-w-[1440px] flex-col justify-center px-6 py-16 lg:min-h-[320px] lg:px-16">
          <p className="mb-5 font-sans text-xs uppercase tracking-[0.25em] text-bwt-gold">
            {t("heroEyebrow")}
          </p>
          <h1 className="font-serif text-4xl font-normal leading-[1.1] sm:text-5xl lg:text-6xl">
            {t("heroTitle")}
          </h1>
        </div>
      </section>

      {/* Info + form + map */}
      <section className="bg-bwt-ivory py-16 lg:py-[120px]">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-16">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Left — contact info */}
            <div className="rounded-card border border-bwt-silver/60 bg-white p-8 lg:p-10">
              <h2 className="font-serif text-2xl text-bwt-charcoal">{t("infoTitle")}</h2>
              <ul className="mt-6 space-y-1">
                {rows.map((r) => {
                  const Icon = r.icon;
                  return (
                    <li key={r.label}>
                      <a
                        href={r.href}
                        target={r.href.startsWith("http") ? "_blank" : undefined}
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 rounded-btn px-2 py-2.5 transition-colors hover:bg-bwt-cream"
                      >
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-btn bg-bwt-cream text-bwt-gold">
                          <Icon className="h-5 w-5" />
                        </span>
                        <span>
                          <span className="block font-sans text-xs uppercase tracking-wider text-bwt-graphite">
                            {r.label}
                          </span>
                          <span className="block font-sans text-base font-medium text-bwt-charcoal">
                            {r.value}
                          </span>
                        </span>
                      </a>
                    </li>
                  );
                })}
                {/* Working hours (not a link) */}
                <li className="flex items-start gap-4 px-2 py-2.5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-btn bg-bwt-cream text-bwt-gold">
                    <Clock className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block font-sans text-xs uppercase tracking-wider text-bwt-graphite">
                      {t("labels.hours")}
                    </span>
                    <span className="block font-sans text-base font-medium text-bwt-charcoal">
                      {hours.weekdays}
                    </span>
                    <span className="block font-sans text-sm text-bwt-graphite">{hours.sunday}</span>
                  </span>
                </li>
              </ul>
              <span className="mt-8 inline-block rounded-full border border-bwt-gold/40 bg-bwt-cream px-5 py-2.5 font-sans text-sm font-medium text-bwt-charcoal">
                {t("badge")}
              </span>
            </div>

            {/* Right — compact lead form (navy card) */}
            <div className="rounded-card bg-bwt-navy p-8 text-bwt-ivory lg:p-10">
              <h2 className="font-serif text-2xl">{t("formTitle")}</h2>
              <div className="mt-6">
                <ContactForm />
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="mt-8 overflow-hidden rounded-[12px] border border-bwt-navy/20">
            <iframe
              src={BRAND.geo.yandexEmbed}
              title="BWT Uzbekistan"
              className="block h-[400px] w-full"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
            <a
              href={BRAND.geo.yandexLink}
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-sm text-bwt-graphite underline-offset-4 transition-colors hover:text-bwt-gold-dark hover:underline"
            >
              {t("mapYandex")}
            </a>
            <a
              href={BRAND.geo.googleLink}
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-sm text-bwt-graphite underline-offset-4 transition-colors hover:text-bwt-gold-dark hover:underline"
            >
              {t("mapGoogle")}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
