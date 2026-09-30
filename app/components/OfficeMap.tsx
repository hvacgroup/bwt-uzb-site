import { getLocale, getTranslations } from "next-intl/server";
import { MapPin, Clock, Phone } from "lucide-react";
import { BRAND } from "@/lib/config";

/** Last block of the home page: where the showroom is, with the map. */
export default async function OfficeMap() {
  const locale = await getLocale();
  const loc = locale === "uz" ? "uz" : "ru";
  const t = await getTranslations("officeMap");
  const hours = BRAND.workingHours[loc];
  const link =
    "inline-flex items-center justify-center rounded-btn border border-bwt-navy/20 px-5 py-3 font-sans text-sm font-semibold text-bwt-charcoal transition-colors hover:border-bwt-gold-ink hover:text-bwt-gold-ink";

  return (
    <section id="map" className="bg-white py-16 lg:py-24">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-16">
        <p className="mb-4 font-sans text-xs uppercase tracking-[0.25em] text-bwt-gold-ink">{t("eyebrow")}</p>
        <h2 className="border-l-4 border-bwt-gold pl-5 font-serif text-3xl leading-[1.15] text-bwt-charcoal lg:text-4xl">
          {t("title")}
        </h2>

        <div className="mt-10 grid gap-8 lg:grid-cols-[360px_1fr] lg:gap-12">
          <ul className="space-y-6 font-sans text-bwt-graphite">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 h-5 w-5 flex-none text-bwt-gold-ink" aria-hidden />
              <span>
                <span className="block text-xs uppercase tracking-[0.15em]">{t("address")}</span>
                <span className="mt-1 block text-lg font-medium text-bwt-charcoal">{BRAND.address[loc]}</span>
              </span>
            </li>
            <li className="flex gap-3">
              <Clock className="mt-0.5 h-5 w-5 flex-none text-bwt-gold-ink" aria-hidden />
              <span>
                <span className="block text-xs uppercase tracking-[0.15em]">{t("hours")}</span>
                <span className="mt-1 block text-base text-bwt-charcoal">{hours.weekdays}</span>
                <span className="block text-sm">{hours.sunday}</span>
              </span>
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 h-5 w-5 flex-none text-bwt-gold-ink" aria-hidden />
              <span>
                <span className="block text-xs uppercase tracking-[0.15em]">{t("phone")}</span>
                <a href={BRAND.phoneHref} className="mt-1 block text-lg font-medium text-bwt-charcoal hover:text-bwt-gold-ink">
                  {BRAND.phone}
                </a>
              </span>
            </li>
            <li className="flex flex-wrap gap-3 pt-2">
              <a href={BRAND.geo.googleLink} target="_blank" rel="noopener noreferrer" className={link}>
                {t("google")}
              </a>
              <a href={BRAND.geo.yandexLink} target="_blank" rel="noopener noreferrer" className={link}>
                {t("yandex")}
              </a>
            </li>
          </ul>

          <div className="overflow-hidden rounded-card border border-bwt-navy/15 shadow-card">
            <iframe
              src={BRAND.geo.yandexEmbed}
              title={t("mapTitle")}
              className="block h-[360px] w-full lg:h-[440px]"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
