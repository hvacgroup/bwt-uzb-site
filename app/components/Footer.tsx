import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { BRAND } from "@/lib/config";
import { Phone, Mail, MapPin, Send, Camera } from "lucide-react";
import Certifications from "@/app/components/Certifications";

type FooterStrings = {
  tagline: string;
  cols: { title: string; links: { label: string; href: string }[] }[];
  contactsTitle: string;
  legalSuffix: string;
};

const FOOTER: Record<string, FooterStrings> = {
  ru: {
    tagline:
      "Официальный дистрибьютор BWT в Узбекистане — чистая вода для дома, офиса и производства.",
    cols: [
      {
        title: "Продукты",
        links: [
          { label: "BWT Slim 2", href: "/catalog" },
          { label: "BWT Slim 3", href: "/catalog" },
          { label: "BWT Slim 4", href: "/catalog" },
          { label: "Картриджи", href: "/catalog" },
          { label: "Колонные умягчители", href: "/catalog#whole-home" },
          { label: "Магистральные фильтры", href: "/catalog#whole-home" },
          { label: "Промышленные системы", href: "/catalog#whole-home" },
        ],
      },
      {
        title: "Сервис",
        links: [
          { label: "Установка", href: "/services" },
          { label: "Замена картриджей", href: "/services" },
          { label: "Гарантия", href: "/services" },
          { label: "Анализ воды", href: "/#lead" },
        ],
      },
      {
        title: "Компания",
        links: [
          { label: "О бренде", href: "/about" },
          { label: "Технология", href: "/#technology" },
          { label: "Блог", href: "/blog" },
          { label: "Контакты", href: "/contacts" },
          { label: "Оставить заявку", href: "/request" },
        ],
      },
    ],
    contactsTitle: "Связь",
    legalSuffix: "Конфиденциальность · Оферта · Гарантия",
  },
  uz: {
    tagline:
      "BWTning O'zbekistondagi rasmiy distribyutori — uy, ofis va ishlab chiqarish uchun toza suv.",
    cols: [
      {
        title: "Mahsulotlar",
        links: [
          { label: "BWT Slim 2", href: "/catalog" },
          { label: "BWT Slim 3", href: "/catalog" },
          { label: "BWT Slim 4", href: "/catalog" },
          { label: "Kartrijlar", href: "/catalog" },
          { label: "Kolonnali yumshatgichlar", href: "/catalog#whole-home" },
          { label: "Magistral filtrlar", href: "/catalog#whole-home" },
          { label: "Sanoat tizimlari", href: "/catalog#whole-home" },
        ],
      },
      {
        title: "Servis",
        links: [
          { label: "O'rnatish", href: "/services" },
          { label: "Kartrij almashtirish", href: "/services" },
          { label: "Kafolat", href: "/services" },
          { label: "Suv tahlili", href: "/#lead" },
        ],
      },
      {
        title: "Kompaniya",
        links: [
          { label: "Brend haqida", href: "/about" },
          { label: "Texnologiya", href: "/#technology" },
          { label: "Blog", href: "/blog" },
          { label: "Aloqa", href: "/contacts" },
          { label: "Ariza qoldirish", href: "/request" },
        ],
      },
    ],
    contactsTitle: "Aloqa",
    legalSuffix: "Maxfiylik · Oferta · Kafolat",
  },
};


export default function Footer({ locale }: { locale: string }) {
  const f = FOOTER[locale] ?? FOOTER.ru;

  return (
    <footer className="bg-bwt-navy-dark text-bwt-ivory/70">
      <div className="mx-auto max-w-[1440px] px-6 py-20 lg:px-16">
        <div className="grid grid-cols-2 gap-10 lg:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2">
            <Image
              src="/images/bwt-logo.svg"
              alt="BWT Uzbekistan"
              width={120}
              height={41}
              unoptimized
              style={{ height: "auto", objectFit: "contain", filter: "brightness(0) invert(1)" }}
            />
            <p className="mt-4 max-w-xs font-sans text-sm leading-relaxed text-bwt-ivory/60">
              {BRAND.tagline}. {f.tagline}
            </p>
          </div>

          {f.cols.map((col) => (
            <div key={col.title}>
              <h4 className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-bwt-gold">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="font-sans text-sm text-bwt-ivory/70 transition-colors hover:text-bwt-ivory"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contacts */}
          <div>
            <h4 className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-bwt-gold">
              {f.contactsTitle}
            </h4>
            <ul className="mt-4 space-y-2.5 font-sans text-sm">
              <li>
                <a href={BRAND.phoneHref} className="flex items-start gap-2 text-bwt-ivory/70 transition-colors hover:text-bwt-ivory">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-bwt-gold" /> {BRAND.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${BRAND.email}`} className="flex items-start gap-2 text-bwt-ivory/70 transition-colors hover:text-bwt-ivory">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-bwt-gold" /> {BRAND.email}
                </a>
              </li>
              <li>
                <a href={BRAND.telegram} target="_blank" rel="noopener noreferrer" className="flex items-start gap-2 text-bwt-ivory/70 transition-colors hover:text-bwt-ivory">
                  <Send className="mt-0.5 h-4 w-4 shrink-0 text-bwt-gold" /> {BRAND.telegramHandle}
                </a>
              </li>
              <li>
                <a href={BRAND.instagram} target="_blank" rel="noopener noreferrer" className="flex items-start gap-2 text-bwt-ivory/70 transition-colors hover:text-bwt-ivory">
                  <Camera className="mt-0.5 h-4 w-4 shrink-0 text-bwt-gold" /> {BRAND.instagramHandle}
                </a>
              </li>
              <li>
                <a href={BRAND.geo.googleLink} target="_blank" rel="noopener noreferrer" className="flex items-start gap-2 text-bwt-ivory/70 transition-colors hover:text-bwt-ivory">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-bwt-gold" /> {BRAND.addressShort[locale === "uz" ? "uz" : "ru"]}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-6 py-6 lg:flex-row lg:items-center lg:justify-between lg:px-16">
          <p className="font-sans text-xs text-bwt-ivory/50">
            © {new Date().getFullYear()} {BRAND.legalName} · {f.legalSuffix}
          </p>
          <Certifications compact />
        </div>
      </div>
    </footer>
  );
}
