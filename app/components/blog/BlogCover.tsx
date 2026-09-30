import Image from "next/image";

/**
 * Article cover. Articles the scheduled task adds may come without a photo;
 * they get a branded navy card instead of an empty box.
 */
export default function BlogCover({
  src,
  alt,
  sizes,
  priority = false,
  className = "",
}: {
  src: string | null;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  if (src) {
    return <Image src={src} alt={alt} fill priority={priority} sizes={sizes} className={`object-cover ${className}`} />;
  }
  return (
    <div
      aria-hidden
      className={`absolute inset-0 overflow-hidden bg-gradient-to-br from-bwt-navy via-bwt-navy-light to-bwt-navy-dark ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/blog/_mark.svg"
        alt=""
        className="absolute -right-[6%] top-1/2 h-[140%] -translate-y-1/2 opacity-[0.12] invert"
      />
      <span className="absolute bottom-5 left-6 h-1 w-14 rounded-full bg-bwt-gold" />
    </div>
  );
}
