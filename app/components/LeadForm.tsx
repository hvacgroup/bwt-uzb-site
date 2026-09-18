"use client";

import { useState } from "react";
import { ERP_API } from "@/lib/config";
import { CheckCircle2, Loader2 } from "lucide-react";

const PROPERTY_TYPES = [
  "Квартира", "Частный дом", "Офис", "Кафе/ресторан", "Производство", "Другое",
] as const;

const CITIES = [
  "Ташкент", "Самарканд", "Бухара", "Наманган", "Андижан",
  "Фергана", "Нукус", "Карши", "Термез", "Гулистан",
  "Навои", "Ургенч", "Джизак", "Коканд", "Чирчик", "Алмалык", "Ангрен",
  "Другой город",
] as const;

type Props = {
  /** Pre-fill productSku — used on product detail pages. */
  productSku?:  string;
  productName?: string;
  /** Heading shown above the form. */
  title?:   string;
  /** Subheading shown above the form. */
  subtitle?: string;
  /** Compact mode (smaller paddings, no card chrome). */
  compact?:  boolean;
};

export default function LeadForm({
  productSku, productName,
  title    = "Подобрать фильтр для вашей задачи",
  subtitle = "Оставьте заявку — наш менеджер свяжется в течение часа.",
  compact = false,
}: Props) {
  const [name, setName]         = useState("");
  const [phone, setPhone]       = useState("");
  const [email, setEmail]       = useState("");
  const [city, setCity]         = useState<string>("Ташкент");
  const [cityCustom, setCityCustom] = useState("");
  const [propertyType, setPropertyType] = useState<string>("");
  const [message, setMessage]   = useState(productName ? `Интересует: ${productName}` : "");
  const [sending, setSending]   = useState(false);
  const [done, setDone]         = useState(false);
  const [error, setError]       = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setError("Укажите имя и телефон");
      return;
    }
    setSending(true);
    setError(null);
    try {
      const finalCity = city === "Другой город" ? cityCustom : city;
      const res = await fetch(`${ERP_API}/api/public/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, phone, email,
          city: finalCity || "Ташкент",
          propertyType: propertyType || undefined,
          productSku,
          productInterest: productName,
          message,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setSending(false);
    }
  };

  if (done) {
    return (
      <div className={`${compact ? "" : "bg-white rounded-2xl shadow-md p-6 sm:p-8"} text-center`}>
        <CheckCircle2 className="w-14 h-14 text-green-600 mx-auto mb-3" />
        <h3 className="text-xl font-bold text-gray-900 mb-1">Спасибо!</h3>
        <p className="text-gray-600 mb-5">
          Ваша заявка принята. Менеджер свяжется в течение часа.
        </p>
        <button onClick={() => {
            setDone(false); setName(""); setPhone(""); setEmail("");
            setMessage(""); setPropertyType("");
          }}
          className="text-sm text-[color:var(--primary)] hover:underline font-medium">
          Отправить ещё одну
        </button>
      </div>
    );
  }

  const wrapperCls = compact ? "" : "bg-white rounded-2xl shadow-md p-6 sm:p-8";
  const inp = "w-full border border-gray-300 rounded-lg px-3 py-3 text-base focus:ring-2 focus:ring-[color:var(--accent)] bg-white";

  return (
    <form onSubmit={submit} className={wrapperCls}>
      {!compact && (
        <>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{title}</h2>
          <p className="text-sm text-gray-500 mb-5">{subtitle}</p>
        </>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Имя *</label>
          <input className={inp} value={name} onChange={e => setName(e.target.value)}
            required placeholder="Как к вам обращаться?" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Телефон *</label>
          <input className={inp} value={phone} onChange={e => setPhone(e.target.value)}
            required placeholder="+998 90 000-00-00" type="tel" inputMode="tel" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
          <input className={inp} value={email} onChange={e => setEmail(e.target.value)}
            placeholder="email@example.com" type="email" inputMode="email" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Город</label>
          <select className={inp} value={city} onChange={e => setCity(e.target.value)}>
            {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          {city === "Другой город" && (
            <input className={inp + " mt-2"} placeholder="Введите название города"
              value={cityCustom} onChange={e => setCityCustom(e.target.value)} />
          )}
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-xs font-medium text-gray-500 mb-2">Тип объекта</label>
        <div className="flex flex-wrap gap-2">
          {PROPERTY_TYPES.map(p => (
            <button type="button" key={p}
              onClick={() => setPropertyType(propertyType === p ? "" : p)}
              className={`px-3 py-2 rounded-full text-sm border transition ${
                propertyType === p
                  ? "bg-[color:var(--primary)] text-white border-transparent shadow-sm"
                  : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"
              }`}>
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-xs font-medium text-gray-500 mb-1">
          Сообщение {productName ? `(интересует: ${productName})` : ""}
        </label>
        <textarea className={inp + " resize-y min-h-[90px]"} rows={3}
          value={message} onChange={e => setMessage(e.target.value)}
          placeholder="Расскажите кратко о задаче, какая вода у вас сейчас, есть ли пожелания..." />
      </div>

      {error && <div className="mt-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">{error}</div>}

      <div className="mt-5">
        <button type="submit" disabled={sending}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-white font-semibold shadow-md hover:shadow-lg transition disabled:opacity-60"
          style={{ background: "var(--primary)" }}>
          {sending ? <><Loader2 className="w-5 h-5 animate-spin" /> Отправляем...</> : "Отправить заявку"}
        </button>
        <p className="text-[11px] text-gray-400 mt-3 leading-relaxed">
          Нажимая кнопку, вы соглашаетесь с обработкой персональных данных в целях обработки заявки.
        </p>
      </div>
    </form>
  );
}
