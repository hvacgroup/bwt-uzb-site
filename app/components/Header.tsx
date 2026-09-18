"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { useFocusTrap } from "@/app/hooks/useFocusTrap";
import { BRAND } from "@/lib/config";
import { Menu, X, Phone } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";
import Magnetic from "./anim/Magnetic";

const NAV = [
  { href: "/", key: "home" },
  { href: "/catalog", key: "catalog" },
  { href: "/services", key: "services" },
  { href: "/about", key: "about" },
  { href: "/contacts", key: "contacts" },
] as const;

export default function Header() {
  const [open, setOpen] = useState(false);
  /* The drawer used to leave the page behind it in the tab order and had no
     Escape. Same hook the video dialogs use. */
  const closeMenu = useCallback(() => setOpen(false), []);
  const drawerRef = useFocusTrap(open, closeMenu);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const t = useTranslations("nav");
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const transparent = isHome && !scrolled;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
          transparent
            ? "bg-transparent"
            : "border-b border-white/10 bg-bwt-navy/95 shadow-soft backdrop-blur"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-6 lg:h-[88px] lg:px-16">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/bwt-logo.svg"
              alt="BWT Uzbekistan"
              width={120}
              height={41}
              priority
              unoptimized
              style={{
                height: "auto",
                objectFit: "contain",
                filter: "brightness(0) invert(1)",
              }}
            />
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {NAV.map((n) => {
              const active = n.href === "/" ? pathname === "/" : pathname.startsWith(n.href);
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className={`relative font-sans text-sm font-medium transition-colors hover:text-bwt-gold ${
                    active ? "text-bwt-gold" : "text-bwt-ivory/80"
                  }`}
                >
                  {t(n.key)}
                  {active && (
                    <span className="absolute -bottom-1.5 left-0 h-px w-full bg-bwt-gold" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <a
              href={BRAND.phoneHref}
              className="hidden items-center gap-2 font-sans text-sm font-medium text-bwt-ivory/90 transition-colors hover:text-bwt-gold lg:inline-flex"
            >
              <Phone className="h-4 w-4" />
              {BRAND.phone}
            </a>
            <Magnetic className="hidden sm:inline-block">
              <Link
                href="/request"
                className="inline-flex rounded-btn bg-bwt-gold px-5 py-2.5 font-sans text-sm font-semibold uppercase tracking-wider text-bwt-navy-dark transition-colors hover:bg-bwt-gold-light"
              >
                {t("request")}
              </Link>
            </Magnetic>
            <button
              onClick={() => setOpen(true)}
              className="flex h-11 w-11 items-center justify-center rounded-btn text-bwt-ivory hover:bg-white/10 lg:hidden"
              aria-label={t("openMenu")}
              aria-expanded={open}
              aria-controls="mobile-nav"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Spacer keeps content below the fixed header on non-home routes. */}
      {!isHome && <div className="h-16 lg:h-[88px]" />}

      {/* Mobile drawer */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/50 lg:hidden"
          onClick={() => setOpen(false)}
        >
          <div
            ref={drawerRef}
            id="mobile-nav"
            role="dialog"
            aria-modal="true"
            aria-label={t("menuLabel")}
            className="absolute bottom-0 right-0 top-0 flex w-72 max-w-[85vw] flex-col bg-bwt-navy shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 p-4">
              <LanguageSwitcher />
              <button
                onClick={closeMenu}
                className="flex h-11 w-11 items-center justify-center rounded-btn text-bwt-ivory hover:bg-white/10"
                aria-label={t("closeMenu")}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 p-2">
              {NAV.map((n) => {
                const active = n.href === "/" ? pathname === "/" : pathname.startsWith(n.href);
                return (
                  <Link
                    key={n.href}
                    href={n.href}
                    onClick={() => setOpen(false)}
                    className={`block rounded-btn px-4 py-3 font-sans text-base font-medium transition-colors hover:bg-white/5 hover:text-bwt-gold ${
                      active ? "text-bwt-gold" : "text-bwt-ivory/85"
                    }`}
                  >
                    {t(n.key)}
                  </Link>
                );
              })}
            </nav>
            <div className="space-y-2 border-t border-white/10 p-4">
              <a
                href={BRAND.phoneHref}
                className="flex items-center gap-2 rounded-btn bg-white/5 px-4 py-3 font-sans font-medium text-bwt-ivory"
              >
                <Phone className="h-5 w-5" /> {BRAND.phone}
              </a>
              <Link
                href="/request"
                onClick={() => setOpen(false)}
                className="block rounded-btn bg-bwt-gold px-4 py-3 text-center font-sans font-semibold uppercase tracking-wider text-bwt-navy-dark"
              >
                {t("request")}
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
