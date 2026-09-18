import type { MetadataRoute } from "next";
import { fetchProducts } from "@/lib/api";

const SITE = "https://bwt-uzb.uz";

// Locale-agnostic marketing routes. RU (default) is unprefixed; UZ under /uz/*.
const PATHS = ["", "/about", "/services", "/contacts", "/request", "/catalog", "/promo"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  // Product pages come from the ERP. If it is unreachable the list is simply
  // empty — the marketing routes below still ship.
  const products = await fetchProducts();
  const paths = [
    ...PATHS,
    ...products.filter((p) => p.sku).map((p) => `/catalog/${p.sku}`),
  ];

  for (const path of paths) {
    const ru = `${SITE}${path || "/"}`;
    const uz = `${SITE}/uz${path}`;
    const languages = { ru, uz, "x-default": ru };
    const priority = path === "" ? 1 : path.startsWith("/catalog/") ? 0.7 : 0.8;

    entries.push({ url: ru, lastModified: now, changeFrequency: "monthly", priority, alternates: { languages } });
    entries.push({ url: uz, lastModified: now, changeFrequency: "monthly", priority, alternates: { languages } });
  }

  return entries;
}
