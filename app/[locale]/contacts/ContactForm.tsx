"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { ERP_API } from "@/lib/config";

export default function ContactForm() {
  const t = useTranslations("contactsPage");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setError(t("formError"));
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
          message: message.trim()
            ? `Сообщение со страницы контактов: ${message}`
            : "Заявка со страницы контактов.",
        }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || `HTTP ${res.status}`);
      }
      setDone(true);
    } catch (err) {
      console.error("contact submit failed", err);
      setError(t("errorNetwork"));
    } finally {
      setSending(false);
    }
  };

  const successRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (done) successRef.current?.focus();
  }, [done]);

  const inputCls =
    "w-full border-b border-bwt-ivory/30 bg-transparent py-3 font-sans text-base text-bwt-ivory placeholder:text-bwt-ivory/40 focus:border-bwt-gold transition-colors";

  if (done) {
    return (
      <div
        className="rounded-card border border-bwt-gold/30 bg-white/[0.04] p-8 text-center"
        role="status"
        aria-live="polite"
      >
        <CheckCircle2 className="mx-auto h-12 w-12 text-bwt-gold" strokeWidth={1.5} />
        <h3
          ref={successRef}
          tabIndex={-1}
          className="mt-4 font-serif text-xl text-bwt-ivory focus-visible:outline-none"
        >
          {t("formSuccessTitle")}
        </h3>
        <p className="mt-2 font-sans text-sm text-bwt-ivory/70">{t("formSuccessText")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div>
        <label htmlFor="contact-name" className="mb-1.5 block font-sans text-xs font-medium uppercase tracking-wider text-bwt-ivory/60">
          {t("nameLabel")}
        </label>
        <input
          id="contact-name"
          name="name"
          autoComplete="name"
          className={inputCls}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t("formName")}
          required
          aria-invalid={Boolean(error) && !name.trim()}
          aria-describedby={error ? "contact-error" : undefined}
        />
      </div>
      <div>
        <label htmlFor="contact-phone" className="mb-1.5 block font-sans text-xs font-medium uppercase tracking-wider text-bwt-ivory/60">
          {t("phoneLabel")}
        </label>
        <input
          id="contact-phone"
          name="tel"
          autoComplete="tel"
          className={inputCls}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder={t("formPhone")}
          type="tel"
          inputMode="tel"
          required
          aria-invalid={Boolean(error) && !phone.trim()}
          aria-describedby={error ? "contact-error" : undefined}
        />
      </div>
      <div>
        <label htmlFor="contact-message" className="mb-1.5 block font-sans text-xs font-medium uppercase tracking-wider text-bwt-ivory/60">
          {t("messageLabel")}
        </label>
        <textarea
          id="contact-message"
          name="message"
          className={`${inputCls} resize-none`}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={t("formMessage")}
          rows={3}
        />
      </div>
      {error && (
        <p id="contact-error" role="alert" className="font-sans text-sm text-bwt-danger">
          {error}
        </p>
      )}
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
          t("formSubmit")
        )}
      </button>
    </form>
  );
}
