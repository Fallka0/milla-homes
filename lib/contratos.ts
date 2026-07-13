// Client-safe data layer for the contract generator (alquiler temporada,
// alquiler vivienda, reserva, arras).
//
// IMPORTANT: this module must stay free of server-only imports so it can be
// bundled into the client tool, mirroring lib/facturas.ts.

export const CONTRATO_PRINT_STORAGE_KEY = "mh-contratos-print";
export const CONTRATO_DRAFT_STORAGE_KEY = "mh-contratos-draft";

// ---- types ----------------------------------------------------------------
export type ContratoType = "short-rent" | "long-rent" | "reservation" | "arras";

export type ContratoParty = {
  name: string;
  nif: string;
  address: string;
};

// Languages the printed document exists in. Spanish is the binding original;
// the rest are courtesy translations that can be printed alongside it.
export const CONTRATO_DOC_LOCALES = ["es", "en", "ru", "de"] as const;
export type ContratoDocLocale = (typeof CONTRATO_DOC_LOCALES)[number];
export type ContratoExtraLocale = Exclude<ContratoDocLocale, "es">;
export const CONTRATO_EXTRA_LOCALES: ContratoExtraLocale[] = ["en", "ru", "de"];

export type Contrato = {
  type: ContratoType;
  city: string; // place of signing, e.g. "Orihuela Costa (Alicante)"
  date: string; // ISO yyyy-mm-dd (native <input type="date"> value)
  partyA: ContratoParty; // arrendador / vendedor
  partyB: ContratoParty; // arrendatario / comprador
  propertyAddress: string;
  propertyCity: string;
  propertyRef: string; // referencia catastral (optional)
  // rentals
  startDate: string;
  endDate: string; // short rent only (fixed season)
  rentAmount: string; // raw user input, parsed with parseAmountToCents
  rentIsMonthly: boolean; // short rent: per month instead of season total
  deposit: string; // fianza
  iban: string; // landlord account the rent is paid into
  utilitiesIncluded: boolean; // short rent only
  // sales (reservation + arras)
  price: string; // agreed sale price
  signalAmount: string; // reserva / arras amount
  deadlineDate: string; // sign arras contract / escritura before this date
  depositHeldByAgency: boolean; // reservation: money held by Milla Homes
  extraClauses: string; // free text, one paragraph per line
  extraLanguages: ContratoExtraLocale[]; // courtesy versions printed after the Spanish one
};

export const CONTRATO_TYPES: { value: ContratoType }[] = [
  { value: "short-rent" },
  { value: "long-rent" },
  { value: "reservation" },
  { value: "arras" },
];

export function blankContrato(type: ContratoType = "short-rent"): Contrato {
  return {
    type,
    city: "Orihuela Costa (Alicante)",
    date: new Date().toISOString().slice(0, 10),
    partyA: { name: "", nif: "", address: "" },
    partyB: { name: "", nif: "", address: "" },
    propertyAddress: "",
    propertyCity: "",
    propertyRef: "",
    startDate: "",
    endDate: "",
    rentAmount: "",
    rentIsMonthly: false,
    deposit: "",
    iban: "",
    utilitiesIncluded: true,
    price: "",
    signalAmount: "",
    deadlineDate: "",
    depositHeldByAgency: true,
    extraClauses: "",
    extraLanguages: [],
  };
}

const CONTRATO_FILE_SLUGS: Record<ContratoType, string> = {
  "short-rent": "temporada",
  "long-rent": "vivienda",
  reservation: "reserva",
  arras: "arras",
};

export function contratoFileName(contrato: Contrato): string {
  const who = contrato.partyB.name
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return ["contrato", CONTRATO_FILE_SLUGS[contrato.type], who || contrato.date]
    .filter(Boolean)
    .join("-");
}

// ---- dates ------------------------------------------------------------------
// "2026-07-13" -> "13 de julio de 2026" (heading of the contract).
export function formatContratoLongDate(isoDate: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
  if (!match) return isoDate;
  const months = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
  ];
  const [, year, month, day] = match;
  return `${Number(day)} de ${months[Number(month) - 1]} de ${year}`;
}

// ---- amounts in words (Spanish legal style) ---------------------------------
const UNIDADES = [
  "cero", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve",
  "diez", "once", "doce", "trece", "catorce", "quince", "dieciséis", "diecisiete",
  "dieciocho", "diecinueve", "veinte", "veintiuno", "veintidós", "veintitrés",
  "veinticuatro", "veinticinco", "veintiséis", "veintisiete", "veintiocho", "veintinueve",
];
const DECENAS = ["", "diez", "veinte", "treinta", "cuarenta", "cincuenta", "sesenta", "setenta", "ochenta", "noventa"];
const CENTENAS = ["", "ciento", "doscientos", "trescientos", "cuatrocientos", "quinientos", "seiscientos", "setecientos", "ochocientos", "novecientos"];

function threeDigitsEs(n: number): string {
  if (n === 0) return "";
  if (n === 100) return "cien";
  const hundreds = Math.floor(n / 100);
  const rest = n % 100;
  const head = hundreds ? CENTENAS[hundreds] : "";
  if (!rest) return head;
  const tail =
    rest < 30
      ? UNIDADES[rest]
      : DECENAS[Math.floor(rest / 10)] + (rest % 10 ? ` y ${UNIDADES[rest % 10]}` : "");
  return head ? `${head} ${tail}` : tail;
}

// "uno" -> "un", "veintiuno" -> "veintiún" when followed by a noun (mil, euros…).
function apocoparEs(words: string): string {
  if (words.endsWith("veintiuno")) return `${words.slice(0, -9)}veintiún`;
  if (words.endsWith("uno")) return words.slice(0, -1);
  return words;
}

export function numberToWordsEs(n: number): string {
  if (!Number.isFinite(n) || n < 0) return "";
  if (n === 0) return "cero";
  const millions = Math.floor(n / 1_000_000);
  const thousands = Math.floor((n % 1_000_000) / 1000);
  const rest = n % 1000;
  const parts: string[] = [];
  if (millions) {
    parts.push(millions === 1 ? "un millón" : `${apocoparEs(numberToWordsEs(millions))} millones`);
  }
  if (thousands) {
    parts.push(thousands === 1 ? "mil" : `${apocoparEs(threeDigitsEs(thousands))} mil`);
  }
  if (rest) parts.push(threeDigitsEs(rest));
  return parts.join(" ");
}

// 250000 -> "DOS MIL QUINIENTOS EUROS"; 250050 -> "…EUROS CON CINCUENTA CÉNTIMOS".
export function centsToLegalWordsEs(cents: number): string {
  const euros = Math.floor(cents / 100);
  const cts = cents % 100;
  // Exact millions take "de": "un millón de euros", "dos millones de euros".
  const eurosPart =
    euros === 1
      ? "un euro"
      : euros >= 1_000_000 && euros % 1_000_000 === 0
        ? `${numberToWordsEs(euros)} de euros`
        : `${apocoparEs(numberToWordsEs(euros))} euros`;
  const ctsPart =
    cts === 0 ? "" : cts === 1 ? " con un céntimo" : ` con ${apocoparEs(numberToWordsEs(cts))} céntimos`;
  return (eurosPart + ctsPart).toUpperCase();
}
