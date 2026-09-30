import BlogCover from "./BlogCover";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { postText, type Post } from "@/lib/blog";

export function formatDate(iso: string, locale: string) {
  return new Intl.DateTimeFormat(locale === "uz" ? "uz-Latn-UZ" : "ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Tashkent",
  }).format(new Date(`${iso}T12:00:00+05:00`));
}

export default function PostCard({
  post,
  locale,
  readMore,
  minRead,
}: {
  post: Post;
  locale: string;
  readMore: string;
  minRead: string;
}) {
  const t = postText(post, locale);
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-card border border-bwt-silver/60 bg-white shadow-soft transition-shadow hover:shadow-card">
      <div className="relative aspect-[40/21] overflow-hidden bg-bwt-cream">
        <BlogCover
          src={post.cover}
          alt={t.coverAlt}
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="font-sans text-xs text-bwt-graphite">
          <time dateTime={post.date}>{formatDate(post.date, locale)}</time>
          <span aria-hidden> · </span>
          {post.readMin} {minRead}
        </p>
        <h2 className="mt-3 font-serif text-xl leading-snug text-bwt-charcoal">
          {/* The stretched link makes the whole card clickable with one tab stop. */}
          <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0">
            {t.title}
          </Link>
        </h2>
        <p className="mt-3 flex-1 font-sans text-[15px] leading-relaxed text-bwt-graphite">
          {t.description}
        </p>
        <span className="mt-5 inline-flex items-center gap-1.5 font-sans text-sm font-semibold text-bwt-gold-ink">
          {readMore}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
        </span>
      </div>
    </article>
  );
}
