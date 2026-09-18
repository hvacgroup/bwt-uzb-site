import type { Metadata } from "next";

/**
 * Builds per-page canonical + hreflang alternates.
 * RU is the default locale (served unprefixed); UZ lives under /uz/*.
 * Relative URLs resolve against `metadataBase` (set in the locale layout).
 *
 * @param locale current request locale ("ru" | "uz")
 * @param path   locale-agnostic path, e.g. "/about" or "/" for home
 */
export function altMeta(locale: string, path: string): Metadata["alternates"] {
  const ru = path;
  const uz = path === "/" ? "/uz" : `/uz${path}`;
  return {
    canonical: locale === "uz" ? uz : ru,
    /* x-default tells Google what to serve everyone the two tags don't cover.
       Without it the choice for any other language/region is arbitrary. */
    languages: {
      ru,
      "ru-UZ": ru,
      uz,
      "uz-UZ": uz,
      "x-default": ru,
    },
  };
}
