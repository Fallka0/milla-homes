"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { FormEvent, useEffect, useRef, useState } from "react";

import { type PublicLocale } from "@/lib/public-copy";

type ConciergeWidgetProps = {
  locale: PublicLocale;
  propertyId: string;
  propertyTitle: string;
};

type UIStrings = {
  booked: string;
  closeAria: string;
  header: string;
  intro: string;
  openLabel: string;
  placeholder: string;
  send: string;
  working: string;
};

const strings: Record<PublicLocale, UIStrings> = {
  en: {
    booked: "Viewing request sent — the agency will confirm by email.",
    closeAria: "Close chat",
    header: "Ask about this property",
    intro: "Hi! I can answer questions about this home and book you a viewing. What would you like to know?",
    openLabel: "Ask a question",
    placeholder: "Type your question…",
    send: "Send",
    working: "Booking your viewing…",
  },
  es: {
    booked: "Solicitud de visita enviada — la agencia lo confirmará por email.",
    closeAria: "Cerrar chat",
    header: "Pregunta sobre esta propiedad",
    intro: "¡Hola! Puedo responder preguntas sobre esta vivienda y reservarte una visita. ¿Qué te gustaría saber?",
    openLabel: "Haz una pregunta",
    placeholder: "Escribe tu pregunta…",
    send: "Enviar",
    working: "Reservando tu visita…",
  },
  ru: {
    booked: "Заявка на просмотр отправлена — агентство подтвердит по email.",
    closeAria: "Закрыть чат",
    header: "Спросите об этом объекте",
    intro: "Здравствуйте! Я отвечу на вопросы об этом жилье и запишу вас на просмотр. Что хотите узнать?",
    openLabel: "Задать вопрос",
    placeholder: "Введите ваш вопрос…",
    send: "Отправить",
    working: "Записываю вас на просмотр…",
  },
  de: {
    booked: "Besichtigungsanfrage gesendet — die Agentur bestätigt per E-Mail.",
    closeAria: "Chat schließen",
    header: "Fragen zu dieser Immobilie",
    intro: "Hallo! Ich beantworte Fragen zu dieser Immobilie und buche Ihre Besichtigung. Was möchten Sie wissen?",
    openLabel: "Frage stellen",
    placeholder: "Ihre Frage eingeben…",
    send: "Senden",
    working: "Ihre Besichtigung wird gebucht…",
  },
};

export function ConciergeWidget({ locale, propertyId, propertyTitle }: ConciergeWidgetProps) {
  const t = strings[locale];
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/concierge",
      body: { propertyId, locale },
    }),
  });

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = input.trim();
    if (!text || status === "streaming" || status === "submitted") return;
    sendMessage({ text });
    setInput("");
  }

  return (
    <div className="concierge">
      {open ? (
        <div className="concierge-panel" role="dialog" aria-label={t.header}>
          <div className="concierge-head">
            <div>
              <span className="concierge-dot" aria-hidden />
              <strong>{t.header}</strong>
              <span className="concierge-sub">{propertyTitle}</span>
            </div>
            <button aria-label={t.closeAria} onClick={() => setOpen(false)} type="button">
              ✕
            </button>
          </div>

          <div className="concierge-log" ref={scrollRef}>
            <div className="concierge-msg bot">{t.intro}</div>
            {messages.map((message) => {
              const text = message.parts
                .map((p) => (p.type === "text" ? p.text : ""))
                .join("");
              const booked = message.parts.some((p) => {
                if (p.type !== "tool-book_viewing" || p.state !== "output-available") return false;
                return (p.output as { status?: string })?.status === "booked";
              });
              return (
                <div key={message.id}>
                  {text ? (
                    <div className={`concierge-msg ${message.role === "user" ? "user" : "bot"}`}>{text}</div>
                  ) : null}
                  {booked ? <div className="concierge-booked">✓ {t.booked}</div> : null}
                </div>
              );
            })}
            {status === "submitted" || status === "streaming" ? (
              <div className="concierge-msg bot typing"><span /><span /><span /></div>
            ) : null}
          </div>

          <form className="concierge-input" onSubmit={handleSubmit}>
            <input
              autoFocus
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.placeholder}
              value={input}
            />
            <button type="submit" disabled={!input.trim() || status !== "ready"}>
              {t.send}
            </button>
          </form>
        </div>
      ) : null}

      <button
        aria-expanded={open}
        className={`concierge-fab${open ? " is-open" : ""}`}
        onClick={() => setOpen((v) => !v)}
        type="button"
      >
        {open ? "✕" : (
          <>
            <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20">
              <path
                d="M4 5h16v11H8l-4 4V5Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
            </svg>
            <span>{t.openLabel}</span>
          </>
        )}
      </button>
    </div>
  );
}
