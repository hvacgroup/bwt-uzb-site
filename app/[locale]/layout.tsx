import type { Metadata, Viewport } from "next";
import "../globals.css";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { MotionConfig } from "framer-motion";
import { getMessages, setRequestLocale } from "next-intl/server";
import { Inter } from "next/font/google";
import { BRAND } from "@/lib/config";
import { organizationSchema, websiteSchema } from "@/lib/schema";
import { routing } from "@/i18n/routing";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import SmoothScroll from "@/app/components/SmoothScroll";
import Preloader from "@/app/components/Preloader";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

/* Site-wide defaults. Individual pages override title/description via their
   own generateMetadata; what matters here is that og:locale follows the URL
   instead of claiming ru_UZ on every Uzbek page. */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const uz = locale === "uz";
  return {
    metadataBase: new URL("https://bwt-uzb.uz"),
    title: uz
      ? `${BRAND.name} — Yevropa ishlab chiqarishi suv filtrlari`
      : `${BRAND.name} — фильтры воды европейского производства`,
    description: uz
      ? "O'zbekistonda BWT rasmiy distribyutori. Filtrlar, yumshatgichlar, teskari osmos. O'rnatish va servis."
      : "Официальный дистрибьютор BWT в Узбекистане. Фильтры, умягчители, обратный осмос. Установка и сервис.",
    applicationName: BRAND.name,
    icons: {
      icon: [{ url: "/icons/bwt-192.png", sizes: "192x192", type: "image/png" }],
      apple: [{ url: "/icons/bwt-192.png", sizes: "192x192", type: "image/png" }],
      shortcut: "/icons/bwt-192.png",
    },
    manifest: "/manifest.json",
    openGraph: {
      title: uz
        ? `${BRAND.name} — uyingiz uchun toza suv`
        : `${BRAND.name} — чистая вода для вашего дома`,
      description: uz
        ? "Germaniya BWT filtrlari. 90 daqiqada o'rnatish. 3 yil kafolat."
        : "Немецкие фильтры BWT. Установка за 90 минут. Гарантия 3 года.",
      locale: uz ? "uz_UZ" : "ru_UZ",
      siteName: BRAND.name,
      type: "website",
      images: [
        {
          url: "/images/bwt-logo-1200w.png",
          width: 1200,
          height: 630,
          alt: "BWT Uzbekistan",
        },
      ],
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#001d46",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Machine-readable identity: address, phone, hours, coordinates.
            Without it a local business is invisible to the knowledge panel
            and to the local pack. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              organizationSchema(locale),
              websiteSchema(locale),
            ]),
          }}
        />
        <NextIntlClientProvider messages={messages}>
          {/* framer-motion defaults to reducedMotion:"never" — without this every
              whileInView reveal, the hero parallax and the page transitions keep
              running for readers who asked their OS for less movement. */}
          <MotionConfig reducedMotion="user">
            <a href="#main" className="skip-link">
              {locale === "uz" ? "Asosiy qismga o'tish" : "Перейти к содержимому"}
            </a>
            <Preloader />
            <SmoothScroll />
            <Header />
            <main id="main" tabIndex={-1} className="flex-1">
              {children}
            </main>
            <Footer locale={locale} />
          </MotionConfig>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
