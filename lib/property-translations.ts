import { type PropertyContentFields, type PropertyContentTranslations } from "@/lib/property-shared";

const targetLocales = ["en", "es", "uk", "ru", "de"] as const;
const contentFieldKeys = ["title", "shortDescription", "description"] as const;

const deeplTargetLanguageMap: Record<(typeof targetLocales)[number], string> = {
  en: "EN",
  es: "ES",
  uk: "UK",
  ru: "RU",
  de: "DE",
};

const deeplSourceLanguageMap: Partial<Record<string, (typeof targetLocales)[number]>> = {
  EN: "en",
  ES: "es",
  UK: "uk",
  RU: "ru",
  DE: "de",
};

const deeplSourceRequestLanguageMap: Record<(typeof targetLocales)[number], string> = {
  en: "EN",
  es: "ES",
  uk: "UK",
  ru: "RU",
  de: "DE",
};

function getDeepLEnv() {
  return {
    apiKey: process.env.DEEPL_API_KEY,
    apiUrl: process.env.DEEPL_API_URL || "https://api-free.deepl.com",
  };
}

function buildFallbackTranslations(content: PropertyContentFields): PropertyContentTranslations {
  return Object.fromEntries(targetLocales.map((locale) => [locale, content])) as PropertyContentTranslations;
}

type TranslatedTextResult = {
  detectedSourceLocale: (typeof targetLocales)[number] | null;
  text: string;
};

async function translateTextWithDeepL(
  apiUrl: string,
  apiKey: string,
  text: string,
  targetLocale: (typeof targetLocales)[number],
  sourceLocale?: (typeof targetLocales)[number],
) : Promise<TranslatedTextResult | null> {
  const response = await fetch(`${apiUrl}/v2/translate`, {
    method: "POST",
    headers: {
      Authorization: `DeepL-Auth-Key ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: [text],
      ...(sourceLocale ? { source_lang: deeplSourceRequestLanguageMap[sourceLocale] } : {}),
      target_lang: deeplTargetLanguageMap[targetLocale],
      context: text,
    }),
  });

  if (!response.ok) {
    return null;
  }

  const data = (await response.json().catch(() => null)) as
    | {
        translations?: Array<{
          detected_source_language?: string;
          text?: string;
        }>;
      }
    | null;

  const translation = data?.translations?.[0];
  const translatedText = translation?.text?.trim() ?? "";
  const detectedSourceLanguage = translation?.detected_source_language ?? null;

  if (!translatedText) {
    return null;
  }

  return {
    detectedSourceLocale: detectedSourceLanguage ? deeplSourceLanguageMap[detectedSourceLanguage] ?? null : null,
    text: translatedText,
  };
}

export async function translateContentToLocale(
  content: PropertyContentFields,
  locale: (typeof targetLocales)[number],
): Promise<PropertyContentFields | null> {
  const { apiKey, apiUrl } = getDeepLEnv();

  if (!apiKey) {
    return null;
  }

  try {
    const entries = await Promise.all(
      contentFieldKeys.map(async (fieldKey) => {
        const originalText = content[fieldKey].trim();

        if (!originalText) {
          return [fieldKey, ""] as const;
        }

        const translated = await translateTextWithDeepL(apiUrl, apiKey, originalText, locale);

        if (!translated) {
          throw new Error("translation-failed");
        }

        return [fieldKey, translated.text] as const;
      }),
    );

    return Object.fromEntries(entries) as PropertyContentFields;
  } catch {
    return null;
  }
}

export async function generatePropertyTranslations(
  content: PropertyContentFields,
): Promise<PropertyContentTranslations> {
  const { apiKey, apiUrl } = getDeepLEnv();

  if (!apiKey) {
    return buildFallbackTranslations(content);
  }

  try {
    const englishFieldResults = await Promise.all(
      contentFieldKeys.map(async (fieldKey) => {
        const originalText = content[fieldKey].trim();

        if (!originalText) {
          return [
            fieldKey,
            {
              detectedSourceLocale: null,
              englishText: "",
              originalText,
            },
          ] as const;
        }

        const englishResult = await translateTextWithDeepL(apiUrl, apiKey, originalText, "en");

        return [
          fieldKey,
          {
            detectedSourceLocale: englishResult?.detectedSourceLocale ?? null,
            englishText: englishResult?.text ?? originalText,
            originalText,
          },
        ] as const;
      }),
    );

    const fieldResultMap = Object.fromEntries(englishFieldResults) as Record<
      (typeof contentFieldKeys)[number],
      {
        detectedSourceLocale: (typeof targetLocales)[number] | null;
        englishText: string;
        originalText: string;
      }
    >;

    const translations = await Promise.all(
      targetLocales.map(async (locale) => {
        const translatedEntries = await Promise.all(
          contentFieldKeys.map(async (fieldKey) => {
            const fieldResult = fieldResultMap[fieldKey];

            if (!fieldResult.originalText) {
              return [fieldKey, ""] as const;
            }

            if (fieldResult.detectedSourceLocale === locale) {
              return [fieldKey, fieldResult.originalText] as const;
            }

            if (locale === "en") {
              return [fieldKey, fieldResult.englishText] as const;
            }

            const translated = await translateTextWithDeepL(
              apiUrl,
              apiKey,
              fieldResult.originalText,
              locale,
              fieldResult.detectedSourceLocale ?? undefined,
            );

            return [fieldKey, translated?.text ?? fieldResult.originalText] as const;
          }),
        );

        return [locale, Object.fromEntries(translatedEntries)] as const;
      }),
    );

    return Object.fromEntries(translations) as PropertyContentTranslations;
  } catch {
    return buildFallbackTranslations(content);
  }
}
