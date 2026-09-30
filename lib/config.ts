/**
 * Site-wide configuration. Most values are environment-driven so the same
 * code runs on bwt-uzb.uz, a preview deployment, and localhost.
 */

export const ERP_API =
  process.env.NEXT_PUBLIC_ERP_API ?? "https://erp-bwt.uz";

export const BRAND = {
  name:        "BWT Uzbekistan",
  legalName:   "«MUHANDIS-KONSALTING» MChJ",
  tagline:     "Best Water Technology",
  phone:       "+998 77 407-87-77",
  phoneHref:   "tel:+998774078777",
  email:       "info@bwt-uzb.uz",
  telegram:    "https://t.me/bwt_uzb",
  telegramHandle: "@bwt_uzb",
  instagram:   "https://www.instagram.com/bwt_uzb/",
  instagramHandle: "@bwt_uzb",
  address: {
    ru: "г. Ташкент, Малая кольцевая дорога, 58",
    uz: "Toshkent sh., Kichik xalqa yoʻli, 58",
  },
  addressShort:{ ru: "Ташкент, Малая кольцевая дорога, 58", uz: "Toshkent, Kichik xalqa yoʻli, 58" },
  workingHours: {
    ru: { weekdays: "Понедельник — Суббота: 9:00 – 18:00", sunday: "Воскресенье — выходной" },
    uz: { weekdays: "Dushanba — Shanba: 9:00 – 18:00", sunday: "Yakshanba — dam olish kuni" },
  },
  // Office geo (Yunusabad district, Tashkent) — finalized in v6 Q4.
  geo: {
    lat: 41.332167,
    lng: 69.293616,
    yandexEmbed:
      "https://yandex.com/map-widget/v1/?ll=69.293616%2C41.332167&z=17&l=map&pt=69.293616,41.332167,pm2rdm",
    yandexLink:
      "https://yandex.ru/maps/?text=41.332167,69.293616&si=rf8498gg7xch67quycx6y8gyyw",
    googleLink: "https://maps.app.goo.gl/hhk9mys97tKhUi638",
  },
} as const;
