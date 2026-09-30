/**
 * Blog articles. Each one grows out of a carousel published in the @bwt_uzb
 * Telegram channel and keeps the same sources.
 *
 * Two sources, merged by slug:
 *  1. lib/blog-posts.json — articles committed with the code (the backlog up to
 *     30.09.2026). Reviewed by hand, versioned in git.
 *  2. Supabase table public.site_blog_posts — articles the scheduled task writes
 *     after each new channel post. The site reads published rows with the
 *     publishable key (RLS allows only `status = 'published'`), so a new article
 *     appears without a deploy. A committed article wins over a row with the
 *     same slug.
 *
 * Inline links use [text](href). "/…" stays on the site, anything else opens
 * in a new tab.
 */
import STATIC_POSTS from "./blog-posts.json";

export type Block =
  | { t: "h2"; text: string }
  | { t: "h3"; text: string }
  | { t: "p"; text: string }
  | { t: "ul"; items: string[] }
  | { t: "ol"; items: string[] };

export type PostText = {
  /** On-page H1 and card title. */
  title: string;
  /** <title> tag. Kept under ~60 characters. */
  seoTitle: string;
  /** Meta description and card teaser. */
  description: string;
  lead: string;
  body: Block[];
  coverAlt: string;
};

export type Source = { label: string; url?: string };

export type Post = {
  slug: string;
  /** ISO date the topic went out in the channel. */
  date: string;
  /** Telegram message the article grew from. */
  telegram: string;
  /** 1600×840 image; null falls back to a branded card. */
  cover: string | null;
  readMin: number;
  sources: Source[];
  ru: PostText;
  uz: PostText;
};

const SUPABASE_URL = "https://jhmgiesujeaythjtkltt.supabase.co";
// Publishable key: safe to ship, RLS limits it to published blog rows. Read on
// the server only, so it never reaches the browser bundle anyway.
const SUPABASE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY ?? "sb_publishable_jYc8NPsSw4y480G8BtYgKw_OLbjbNQL";

/** How often a page re-checks the table for new articles, seconds. */
export const BLOG_REVALIDATE = 600;

const committed = STATIC_POSTS as unknown as Post[];

function isText(x: unknown): x is PostText {
  const t = x as PostText;
  return !!t && typeof t.title === "string" && typeof t.lead === "string" && Array.isArray(t.body);
}

type Row = {
  slug: string;
  date: string;
  telegram: string;
  cover: string | null;
  read_min: number;
  sources: Source[];
  ru: PostText;
  uz: PostText;
};

async function fetchDbPosts(): Promise<Post[]> {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/site_blog_posts?status=eq.published&select=slug,date,telegram,cover,read_min,sources,ru,uz`,
      {
        headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
        next: { revalidate: BLOG_REVALIDATE, tags: ["blog"] },
      }
    );
    if (!res.ok) return [];
    const rows = (await res.json()) as Row[];
    return rows
      .filter((r) => r.slug && r.date && isText(r.ru) && isText(r.uz))
      .map((r) => ({
        slug: r.slug,
        date: r.date,
        telegram: r.telegram,
        cover: r.cover || null,
        readMin: r.read_min || 3,
        sources: Array.isArray(r.sources) ? r.sources : [],
        ru: { ...r.ru, coverAlt: r.ru.coverAlt ?? "" },
        uz: { ...r.uz, coverAlt: r.uz.coverAlt ?? "" },
      }));
  } catch {
    // Table unreachable: the committed articles still render.
    return [];
  }
}

/** All published articles, newest first. */
export async function getAllPosts(): Promise<Post[]> {
  const db = await fetchDbPosts();
  const known = new Set(committed.map((p) => p.slug));
  return [...committed, ...db.filter((p) => !known.has(p.slug))].sort((a, b) =>
    b.date.localeCompare(a.date)
  );
}

export async function getPost(slug: string): Promise<Post | undefined> {
  return (await getAllPosts()).find((p) => p.slug === slug);
}

export function postText(post: Post, locale: string): PostText {
  return locale === "uz" ? post.uz : post.ru;
}
