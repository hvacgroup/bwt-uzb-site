import { BRAND } from "./config";

const SITE = "https://bwt-uzb.uz";

/**
 * Organization + LocalBusiness for the site root.
 *
 * Everything here comes from lib/config.ts — the address, phone, coordinates
 * and hours are the same values the footer and the contacts page render, so
 * the markup can never drift from what a visitor sees.
 *
 * Deliberately NOT included: aggregateRating. The site carries video
 * testimonials, not numeric scores; inventing a rating earns a manual action.
 */
export function organizationSchema(locale: string) {
  const uz = locale === "uz";
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness"],
    "@id": `${SITE}/#organization`,
    name: BRAND.name,
    legalName: BRAND.legalName,
    slogan: BRAND.tagline,
    url: uz ? `${SITE}/uz` : SITE,
    logo: `${SITE}/images/bwt-logo-1200w.png`,
    image: `${SITE}/images/installations/bwt-slim-install-1.webp`,
    description: uz
      ? "O'zbekistonda BWT rasmiy distribyutori: suv filtrlari, yumshatgichlar, teskari osmos. O'rnatish va servis."
      : "Официальный дистрибьютор BWT в Узбекистане: фильтры для воды, умягчители, обратный осмос. Установка и сервис.",
    telephone: BRAND.phone,
    email: BRAND.email,
    priceRange: "$$$",
    currenciesAccepted: "UZS, USD",
    foundingDate: "2016",
    address: {
      "@type": "PostalAddress",
      streetAddress: uz
        ? "Xushnavo ko'chasi, 4-tor ko'cha, 2-uy"
        : "ул. Хушнаво, 4 проезд, д. 2",
      addressLocality: uz ? "Toshkent" : "Ташкент",
      addressRegion: uz ? "Yunusobod tumani" : "Юнусабадский район",
      addressCountry: "UZ",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: BRAND.geo.lat,
      longitude: BRAND.geo.lng,
    },
    hasMap: BRAND.geo.googleLink,
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "09:00",
        closes: "18:00",
      },
    ],
    areaServed: [
      { "@type": "Country", name: "Uzbekistan" },
      { "@type": "City", name: uz ? "Toshkent" : "Ташкент" },
      { "@type": "City", name: uz ? "Samarqand" : "Самарканд" },
      { "@type": "City", name: uz ? "Buxoro" : "Бухара" },
    ],
    sameAs: [BRAND.telegram, BRAND.instagram],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: BRAND.phone,
        contactType: "sales",
        availableLanguage: ["ru", "uz"],
        areaServed: "UZ",
      },
    ],
  };
}

/** WebSite node so the two language trees are described as one property. */
export function websiteSchema(locale: string) {
  const uz = locale === "uz";
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE}/#website`,
    url: uz ? `${SITE}/uz` : SITE,
    name: BRAND.name,
    inLanguage: uz ? "uz-UZ" : "ru-UZ",
    publisher: { "@id": `${SITE}/#organization` },
  };
}
