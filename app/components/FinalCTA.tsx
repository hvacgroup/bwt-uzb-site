"use client";

import { useEffect, useRef, useState } from "react";
import { motion, type Variants } from "framer-motion";
import { CheckCircle2, Loader2, Phone, Send, MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { BRAND, ERP_API } from "@/lib/config";
import RevealText from "./anim/RevealText";
import Magnetic from "./anim/Magnetic";
import Certifications from "@/app/components/Certifications";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const VIEWPORT = { once: true, margin: "-80px" } as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

const waHref = `https://wa.me/${BRAND.phoneHref.replace(/[^0-9]/g, "")}`;

export default function FinalCTA() {
  const t = useTranslations("finalCta");
  const methods = t.raw("methods") as string[];

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [method, setMethod] = useState<string>(methods[0]);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setError(t("error"));
      return;
    }
    setSending(true);
    setError(null);
    try {
      const res = await fetch(`${ERP_API}/api/public/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          message: `Бесплатный анализ воды. Удобный способ связи: ${method}.`,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      setDone(true);
    } catch (err) {
      /* `HTTP 500` means nothing to a visitor — log the detail, show a way out. */
      console.error("lead submit failed", err);
      setError(t("errorNetwork"));
    } finally {
      setSending(false);
    }
  };

  /* The form is replaced wholesale on success, which leaves focus on a button
     that no longer exists. Park it on the confirmation heading instead. */
  const successRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (done) successRef.current?.focus();
  }, [done]);

  const inputCls =
    "w-full border-b border-bwt-ivory/30 bg-transparent py-3 font-sans text-base text-bwt-ivory placeholder:text-bwt-ivory/40 focus:border-bwt-gold transition-colors";

  return (
    <section id="lead" className="relative overflow-hidden bg-bwt-navy py-20 lg:py-40">
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="hero-float absolute -right-20 top-0 h-[60vh] w-[60vh] rounded-full bg-bwt-aqua/5 blur-[120px]" />
        <div className="hero-float-slow absolute -left-20 bottom-0 h-[50vh] w-[50vh] rounded-full bg-bwt-gold/5 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-[720px] px-6 lg:px-16">
        {/* Pink rule — the КП signature, centred here because the block is centred */}
        <motion.span
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.7, ease: EASE }}
          className="mx-auto mb-8 block h-[3px] w-14 bg-bwt-gold"
        />
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="text-center font-serif text-4xl font-normal leading-[1.1] text-bwt-ivory sm:text-5xl"
        >
          <RevealText text={t("title")} />
        </motion.h2>
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="mx-auto mt-6 max-w-[540px] text-center font-sans text-lg leading-relaxed text-bwt-ivory/75"
        >
          {t("subtitle")}
        </motion.p>

        {done ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="mt-12 rounded-card border border-bwt-gold/30 bg-white/[0.04] p-10 text-center"
            role="status"
            aria-live="polite"
          >
            <CheckCircle2 className="mx-auto h-14 w-14 text-bwt-gold" strokeWidth={1.5} />
            <h3
              ref={successRef}
              tabIndex={-1}
              className="mt-4 font-serif text-2xl text-bwt-ivory focus-visible:outline-none"
            >
              {t("successTitle")}
            </h3>
            <p className="mt-2 font-sans text-bwt-ivory/70">{t("successText")}</p>
          </motion.div>
        ) : (
          <motion.form
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            onSubmit={submit}
            className="mx-auto mt-12 max-w-[520px] space-y-6"
          >
            <div>
              <label htmlFor="cta-name" className="mb-1.5 block font-sans text-xs font-medium uppercase tracking-wider text-bwt-ivory/60">
                {t("nameLabel")}
              </label>
              <input
                id="cta-name"
                name="name"
                autoComplete="name"
                className={inputCls}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("namePlaceholder")}
                required
                aria-invalid={Boolean(error) && !name.trim()}
                aria-describedby={error ? "cta-error" : undefined}
              />
            </div>
            <div>
              <label htmlFor="cta-phone" className="mb-1.5 block font-sans text-xs font-medium uppercase tracking-wider text-bwt-ivory/60">
                {t("phoneLabel")}
              </label>
              <input
                id="cta-phone"
                name="tel"
                autoComplete="tel"
                className={inputCls}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t("phonePlaceholder")}
                type="tel"
                inputMode="tel"
                required
                aria-invalid={Boolean(error) && !phone.trim()}
                aria-describedby={error ? "cta-error" : undefined}
              />
            </div>
            {/* fieldset + aria-pressed: colour alone did not say which one is on */}
            <fieldset className="border-0 p-0 pt-2">
              <legend className="mb-2 font-sans text-xs font-medium uppercase tracking-wider text-bwt-ivory/60">
                {t("methodLabel")}
              </legend>
              <div className="flex flex-wrap gap-3">
                {methods.map((m) => (
                  <button
                    type="button"
                    key={m}
                    aria-pressed={method === m}
                    onClick={() => setMethod(m)}
                    className={`min-h-[44px] rounded-btn border px-5 py-2.5 font-sans text-sm transition-colors ${
                      method === m
                        ? "border-bwt-gold bg-bwt-gold/15 text-bwt-gold"
                        : "border-bwt-ivory/25 text-bwt-ivory/70 hover:border-bwt-ivory/50"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </fieldset>

            {error && (
              <p
                id="cta-error"
                role="alert"
                className="font-sans text-sm text-bwt-danger"
              >
                {error}
              </p>
            )}

            {/* w-full on the wrapper keeps the inline-block magnetic shell the
                full width of the form, so the button below still fills it. */}
            <Magnetic className="w-full" strength={0.14}>
              <button
                type="submit"
                disabled={sending}
                className="flex h-14 w-full items-center justify-center gap-2.5 rounded-btn bg-bwt-gold font-sans text-sm font-semibold uppercase tracking-wider text-bwt-navy-dark transition-colors hover:bg-bwt-gold-light disabled:opacity-60"
              >
                {sending ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" /> {t("sending")}
                  </>
                ) : (
                  t("submit")
                )}
              </button>
            </Magnetic>
            <p className="text-center font-sans text-xs text-bwt-ivory/50">{t("reassurance")}</p>
          </motion.form>
        )}

        <div className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          <a href={BRAND.phoneHref} className="inline-flex items-center gap-2 font-sans text-sm text-bwt-ivory/80 transition-colors hover:text-bwt-gold">
            <Phone className="h-4 w-4 text-bwt-gold" /> {BRAND.phone}
          </a>
          <a href={BRAND.telegram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-sans text-sm text-bwt-ivory/80 transition-colors hover:text-bwt-gold">
            <Send className="h-4 w-4 text-bwt-gold" /> {BRAND.telegramHandle}
          </a>
          <a href={waHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-sans text-sm text-bwt-ivory/80 transition-colors hover:text-bwt-gold">
            <MessageCircle className="h-4 w-4 text-bwt-gold" /> WhatsApp
          </a>
        </div>

        {/* Last thing before the footer: the certificates that back the promise */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="mt-12 border-t border-white/10 pt-10"
        >
          <Certifications compact />
        </motion.div>
      </div>
    </section>
  );
}
