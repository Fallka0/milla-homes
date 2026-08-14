import type { SharePoolKind, ShareLocale } from "@/lib/share-property";

// Interface strings for the shareable property pages. Hand-written in all four
// languages, same as the property content — there is no translation library in
// this path and no runtime fallback to English.
//
// Strings with variables are templates rather than functions so a whole copy
// object stays serializable and can be handed straight to a client component.

/** Replaces every `{name}` in `template` with the matching value. */
export function formatShareTemplate(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}

export type ShareCopy = {
  /** Native language name — the switcher's accessible label. */
  languageName: string;
  /** Two-letter code shown in the switcher; keeps all four on one row. */
  languageCode: string;
  languageLabel: string;
  gallery: {
    /** Template placeholders: {current}, {total}. */
    counter: string;
    /** Template placeholders: {title}, {index}. */
    imageAlt: string;
    next: string;
    previous: string;
    swipeHint: string;
  };
  facts: {
    heading: string;
    bedrooms: string;
    bathrooms: string;
    built: string;
    plot: string;
    pool: string;
    beach: string;
  };
  poolValues: Record<SharePoolKind, string>;
  description: {
    heading: string;
  };
  reference: {
    label: string;
    copy: string;
    copied: string;
  };
  agent: {
    heading: string;
    role: string;
  };
  whatsapp: {
    action: string;
    /** Prefilled message body. Template placeholders: {reference}, {title}. */
    message: string;
    stickyPrompt: string;
  };
  /** Only shown when a plot exists — apartments hide the row entirely. */
  notApplicable: string;
};

export const shareCopy: Record<ShareLocale, ShareCopy> = {
  es: {
    languageName: "Español",
    languageCode: "ES",
    languageLabel: "Idioma",
    gallery: {
      counter: "{current} de {total}",
      imageAlt: "{title} — foto {index}",
      next: "Siguiente foto",
      previous: "Foto anterior",
      swipeHint: "Desliza para ver más fotos",
    },
    facts: {
      heading: "Datos principales",
      bedrooms: "Dormitorios",
      bathrooms: "Baños",
      built: "Construidos",
      plot: "Parcela",
      pool: "Piscina",
      beach: "A la playa",
    },
    poolValues: {
      private: "Privada",
      communal: "Comunitaria",
      none: "Sin piscina",
    },
    description: {
      heading: "Sobre esta propiedad",
    },
    reference: {
      label: "Referencia",
      copy: "Copiar referencia",
      copied: "Copiada",
    },
    agent: {
      heading: "Tu asesora",
      role: "Milla Homes · Torrevieja",
    },
    whatsapp: {
      action: "Preguntar por WhatsApp",
      message: "Hola, me interesa la propiedad {reference} — {title}. ¿Podemos hablar?",
      stickyPrompt: "¿Te interesa? Escríbenos",
    },
    notApplicable: "—",
  },
  en: {
    languageName: "English",
    languageCode: "EN",
    languageLabel: "Language",
    gallery: {
      counter: "{current} of {total}",
      imageAlt: "{title} — photo {index}",
      next: "Next photo",
      previous: "Previous photo",
      swipeHint: "Swipe for more photos",
    },
    facts: {
      heading: "Key facts",
      bedrooms: "Bedrooms",
      bathrooms: "Bathrooms",
      built: "Built",
      plot: "Plot",
      pool: "Pool",
      beach: "To the beach",
    },
    poolValues: {
      private: "Private",
      communal: "Communal",
      none: "No pool",
    },
    description: {
      heading: "About this property",
    },
    reference: {
      label: "Reference",
      copy: "Copy reference",
      copied: "Copied",
    },
    agent: {
      heading: "Your agent",
      role: "Milla Homes · Torrevieja",
    },
    whatsapp: {
      action: "Ask on WhatsApp",
      message: "Hello, I'm interested in property {reference} — {title}. Could we talk?",
      stickyPrompt: "Interested? Message us",
    },
    notApplicable: "—",
  },
  ru: {
    languageName: "Русский",
    languageCode: "RU",
    languageLabel: "Язык",
    gallery: {
      counter: "{current} из {total}",
      imageAlt: "{title} — фото {index}",
      next: "Следующее фото",
      previous: "Предыдущее фото",
      swipeHint: "Листайте, чтобы увидеть больше фото",
    },
    facts: {
      heading: "Основные данные",
      bedrooms: "Спальни",
      bathrooms: "Санузлы",
      built: "Площадь",
      plot: "Участок",
      pool: "Бассейн",
      beach: "До пляжа",
    },
    poolValues: {
      private: "Собственный",
      communal: "Общий",
      none: "Без бассейна",
    },
    description: {
      heading: "Об объекте",
    },
    reference: {
      label: "Референс",
      copy: "Скопировать референс",
      copied: "Скопировано",
    },
    agent: {
      heading: "Ваш агент",
      role: "Milla Homes · Торревьеха",
    },
    whatsapp: {
      action: "Написать в WhatsApp",
      message: "Здравствуйте, меня интересует объект {reference} — {title}. Можем обсудить?",
      stickyPrompt: "Заинтересовало? Напишите нам",
    },
    notApplicable: "—",
  },
  de: {
    languageName: "Deutsch",
    languageCode: "DE",
    languageLabel: "Sprache",
    gallery: {
      counter: "{current} von {total}",
      imageAlt: "{title} — Foto {index}",
      next: "Nächstes Foto",
      previous: "Vorheriges Foto",
      swipeHint: "Wischen für weitere Fotos",
    },
    facts: {
      heading: "Eckdaten",
      bedrooms: "Schlafzimmer",
      bathrooms: "Badezimmer",
      built: "Wohnfläche",
      plot: "Grundstück",
      pool: "Pool",
      beach: "Zum Strand",
    },
    poolValues: {
      private: "Privat",
      communal: "Gemeinschaft",
      none: "Kein Pool",
    },
    description: {
      heading: "Über diese Immobilie",
    },
    reference: {
      label: "Referenz",
      copy: "Referenz kopieren",
      copied: "Kopiert",
    },
    agent: {
      heading: "Ihre Beraterin",
      role: "Milla Homes · Torrevieja",
    },
    whatsapp: {
      action: "Per WhatsApp anfragen",
      message: "Hallo, ich interessiere mich für die Immobilie {reference} — {title}. Können wir sprechen?",
      stickyPrompt: "Interesse? Schreiben Sie uns",
    },
    notApplicable: "—",
  },
};
