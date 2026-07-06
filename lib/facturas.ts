// Client-safe data layer for the factura (commission invoice) generator.
//
// IMPORTANT: this module must stay free of server-only imports so it can be
// bundled into the client tool, mirroring lib/window-sheets.ts.

// ---- fixed data (issuer + payment never change between invoices) ----------
export const FACTURA_ISSUER = {
  brand: "MILLA HOMES",
  name: "Svitlana Pantelei",
  nie: "Z0665666M",
  addressLine: "Calle Osa Mayor nº13",
  cityLine: "Orihuela Costa (Alicante)",
  phone: "+34 652 679 443",
};

export const FACTURA_PAYMENT = {
  method: "PAGO MEDIANTE TRANSFERENCIA BANCARIA",
  holder: "Svitlana Pantelei",
  iban: "ES19 0049 4284 1723 1403 8357",
};

export const IVA_RATE = 0.21;
export const IVA_LABEL = "IVA 21%";

export const PRINT_STORAGE_KEY = "mh-facturas-print";
export const DRAFT_STORAGE_KEY = "mh-facturas-draft";

// ---- types ----------------------------------------------------------------
export type FacturaLine = {
  description: string;
  amount: string; // raw user input, e.g. "2.500", "2500,00" — parsed on compute
};

export type Factura = {
  number: string; // e.g. "002/2026"
  date: string; // ISO yyyy-mm-dd (native <input type="date"> value)
  clientName: string;
  clientAddress: string;
  clientCity: string;
  clientNif: string;
  lines: FacturaLine[];
  // true: entered amounts are the final IVA-included totals (base is derived);
  // false: entered amounts are the base and IVA is added on top.
  amountsIncludeIva: boolean;
  note: string; // free-text footer, e.g. property reference of the sale
};

export function blankFactura(number?: string): Factura {
  return {
    number: number ?? defaultFacturaNumber(),
    date: new Date().toISOString().slice(0, 10),
    clientName: "",
    clientAddress: "",
    clientCity: "",
    clientNif: "",
    lines: [{ description: "HONORARIOS POR INTERMEDIACIÓN EN LA VENTA", amount: "" }],
    amountsIncludeIva: true,
    note: "",
  };
}

// ---- invoice number helpers ------------------------------------------------
export function defaultFacturaNumber(): string {
  return `001/${new Date().getFullYear()}`;
}

// "002/2026" -> "003/2026"; resets the counter when the year rolls over.
export function nextFacturaNumber(last: string): string {
  const currentYear = new Date().getFullYear();
  const match = /^(\d+)\s*\/\s*(\d{4})$/.exec(last.trim());
  if (!match) return defaultFacturaNumber();
  const [, counter, year] = match;
  if (Number(year) !== currentYear) return defaultFacturaNumber();
  return `${String(Number(counter) + 1).padStart(counter.length, "0")}/${currentYear}`;
}

export function facturaFileName(number: string): string {
  const safe = number.replace(/[^\dA-Za-z]+/g, "-").replace(/^-|-$/g, "") || "borrador";
  return `factura-${safe}-milla-homes`;
}

// ---- money ------------------------------------------------------------------
// Accepts "2500", "2500,5", "2.500,00", "2500.00", "2.500 €"… Returns cents or
// null when the input is not a readable amount.
export function parseAmountToCents(raw: string): number | null {
  const cleaned = raw.replace(/[€\s]/g, "");
  if (!cleaned || !/^[\d.,]+$/.test(cleaned)) return null;

  const lastComma = cleaned.lastIndexOf(",");
  const lastDot = cleaned.lastIndexOf(".");
  let normalized = cleaned;

  if (lastComma > -1 && lastDot > -1) {
    // Both present: the later one is the decimal separator, the other marks thousands.
    if (lastComma > lastDot) {
      normalized = cleaned.replace(/\./g, "").replace(",", ".");
    } else {
      normalized = cleaned.replace(/,/g, "");
    }
  } else if (lastComma > -1) {
    if ((cleaned.match(/,/g) ?? []).length > 1) return null;
    normalized = cleaned.replace(",", ".");
  } else if (lastDot > -1 && /^\d{1,3}(\.\d{3})+$/.test(cleaned)) {
    // Spanish thousands notation like "2.500" or "1.234.567".
    normalized = cleaned.replace(/\./g, "");
  }

  const value = Number(normalized);
  if (!Number.isFinite(value) || value < 0) return null;
  return Math.round(value * 100);
}

export function formatEuros(cents: number): string {
  return `${(cents / 100).toLocaleString("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} €`;
}

export type FacturaTotals = {
  // Per-line base amounts (what the "TOTAL" column of the table shows), aligned
  // by index with factura.lines; null when the line amount isn't parseable yet.
  lineBaseCents: (number | null)[];
  subtotalCents: number;
  ivaCents: number;
  totalCents: number;
};

// All math in integer cents. In "IVA incluido" mode each line's base is derived
// from its total so that base + IVA always adds back to the entered amount.
export function computeFacturaTotals(factura: Factura): FacturaTotals {
  let subtotal = 0;
  let iva = 0;
  let total = 0;

  const lineBaseCents = factura.lines.map((line) => {
    const cents = parseAmountToCents(line.amount);
    if (cents === null) return null;
    let base: number;
    let tax: number;
    if (factura.amountsIncludeIva) {
      base = Math.round(cents / (1 + IVA_RATE));
      tax = cents - base;
    } else {
      base = cents;
      tax = Math.round(cents * IVA_RATE);
    }
    subtotal += base;
    iva += tax;
    total += base + tax;
    return base;
  });

  return { lineBaseCents, subtotalCents: subtotal, ivaCents: iva, totalCents: total };
}

// "2026-07-03" -> "03/07/2026" (shown on the printed invoice).
export function formatFacturaDate(isoDate: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
  if (!match) return isoDate;
  const [, year, month, day] = match;
  return `${day}/${month}/${year}`;
}
