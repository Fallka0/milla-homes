import type { ReactNode } from "react";

import { formatEuros, formatFacturaDate, parseAmountToCents } from "@/lib/facturas";
import {
  centsToLegalWordsEs,
  formatContratoLongDate,
  type Contrato,
  type ContratoDocLocale,
  type ContratoType,
} from "@/lib/contratos";

const ORDINALES = [
  "PRIMERA", "SEGUNDA", "TERCERA", "CUARTA", "QUINTA", "SEXTA",
  "SÉPTIMA", "OCTAVA", "NOVENA", "DÉCIMA", "UNDÉCIMA", "DUODÉCIMA",
];

const BLANK = "________";

const orBlank = (value: string, blank = BLANK) => (value.trim() ? value.trim() : blank);

const shortDate = (iso: string) => (iso.trim() ? formatFacturaDate(iso) : BLANK);

// Spanish (binding) version spells amounts out; courtesy translations only
// show the figure so the legal wording exists in one language.
function legalAmount(raw: string, locale: ContratoDocLocale): string {
  const cents = parseAmountToCents(raw);
  if (cents === null) return locale === "es" ? `${BLANK} EUROS (${BLANK} €)` : `${BLANK} €`;
  return locale === "es" ? `${centsToLegalWordsEs(cents)} (${formatEuros(cents)})` : formatEuros(cents);
}

type Clause = { title: string; body: ReactNode };

// Everything on the printed page that is not user data, per language. The
// party paragraph is split into segments so the shared renderer can keep the
// name bold: pre {name} id {nif} addr {address} role «{role}» end.
type DocCopy = {
  courtesy: string | null; // null on the binding Spanish version
  title: Record<ContratoType, string>;
  roles: Record<"rent" | "sale", { a: string; b: string }>;
  placeLine: (city: string, date: string) => string;
  headParties: string;
  headRecitals: string;
  headClauses: string;
  partyIntros: [string, string];
  partySegments: { id: string; addr: string; role: string };
  capacity: string;
  exponeI: (roleA: string, address: string, city: string, ref: string) => string;
  exponeII: Record<ContratoType, string>;
  exponeIII: string;
  otherTitle: string;
  closing: string;
  clauseLabel: (index: number) => string;
  clauses: (contrato: Contrato, amount: (raw: string) => string) => Clause[];
};

const DOC_COPY: Record<ContratoDocLocale, DocCopy> = {
  // ---- Spanish (binding original) -----------------------------------------
  es: {
    courtesy: null,
    title: {
      "short-rent": "CONTRATO DE ARRENDAMIENTO DE VIVIENDA POR TEMPORADA",
      "long-rent": "CONTRATO DE ARRENDAMIENTO DE VIVIENDA",
      reservation: "DOCUMENTO DE RESERVA",
      arras: "CONTRATO DE ARRAS PENITENCIALES",
    },
    roles: {
      rent: { a: "LA PARTE ARRENDADORA", b: "LA PARTE ARRENDATARIA" },
      sale: { a: "LA PARTE VENDEDORA", b: "LA PARTE COMPRADORA" },
    },
    placeLine: (city, date) => `En ${city}, a ${date ? formatContratoLongDate(date) : BLANK}.`,
    headParties: "REUNIDOS",
    headRecitals: "EXPONEN",
    headClauses: "CLÁUSULAS",
    partyIntros: ["De una parte, D./D.ª", "De otra parte, D./D.ª"],
    partySegments: {
      id: ", mayor de edad, con documento de identidad n.º ",
      addr: " y domicilio a estos efectos en ",
      role: "; en adelante, «",
    },
    capacity:
      "Ambas partes, actuando en su propio nombre y derecho, se reconocen mutuamente la capacidad legal necesaria para otorgar el presente contrato y, a tal efecto,",
    exponeI: (roleA, address, city, ref) =>
      `Que ${roleA} es propietaria del inmueble sito en ${address}, ${city}${ref ? `, con referencia catastral ${ref}` : ""}; en adelante, «el inmueble».`,
    exponeII: {
      "short-rent":
        "Que LA PARTE ARRENDATARIA está interesada en el arrendamiento del inmueble por razón de temporada, para uso distinto del de vivienda habitual, de conformidad con el artículo 3.2 de la Ley 29/1994, de 24 de noviembre, de Arrendamientos Urbanos.",
      "long-rent":
        "Que LA PARTE ARRENDATARIA está interesada en el arrendamiento del inmueble para satisfacer su necesidad permanente de vivienda habitual.",
      reservation:
        "Que LA PARTE COMPRADORA está interesada en la adquisición del inmueble, habiendo mediado en la operación la agencia inmobiliaria MILLA HOMES.",
      arras:
        "Que LA PARTE COMPRADORA está interesada en la compra del inmueble y LA PARTE VENDEDORA en su venta, formalizando a tal fin el presente contrato de arras penitenciales conforme al artículo 1454 del Código Civil.",
    },
    exponeIII:
      "Que ambas partes han convenido formalizar el presente contrato con sujeción a las siguientes",
    otherTitle: "OTRAS ESTIPULACIONES",
    closing:
      "Y en prueba de conformidad, ambas partes firman el presente documento, por duplicado ejemplar y a un solo efecto, en el lugar y fecha indicados en el encabezamiento.",
    clauseLabel: (index) => ORDINALES[index] ?? `CLÁUSULA ${index + 1}`,
    clauses: (contrato, amount) => {
      const fuero: Clause = {
        title: "LEGISLACIÓN Y FUERO",
        body: "El presente contrato se regirá por la legislación española. Para cuantas cuestiones se susciten en relación con su interpretación o cumplimiento, las partes se someten a los juzgados y tribunales del partido judicial en que radica el inmueble.",
      };
      const iban = orBlank(contrato.iban, "________________________");
      switch (contrato.type) {
        case "short-rent":
          return [
            {
              title: "OBJETO",
              body: "LA PARTE ARRENDADORA arrienda a LA PARTE ARRENDATARIA el inmueble descrito en el expositivo I, para su uso exclusivo como vivienda de temporada. El arrendamiento se concierta expresamente por razón de temporada, sin que el inmueble vaya a constituir en ningún caso la residencia habitual y permanente de LA PARTE ARRENDATARIA, por lo que se rige por la voluntad de las partes aquí expresada y, supletoriamente, por lo dispuesto para los arrendamientos para uso distinto del de vivienda en la Ley 29/1994, de 24 de noviembre, de Arrendamientos Urbanos (LAU).",
            },
            {
              title: "DURACIÓN",
              body: `El arrendamiento tendrá una duración determinada e improrrogable: desde el día ${shortDate(contrato.startDate)} hasta el día ${shortDate(contrato.endDate)}. Llegada la fecha de finalización, LA PARTE ARRENDATARIA dejará el inmueble libre de personas y enseres y a disposición de LA PARTE ARRENDADORA, sin necesidad de requerimiento previo, quedando expresamente excluida la prórroga obligatoria.`,
            },
            {
              title: "RENTA",
              body: contrato.rentIsMonthly
                ? `La renta se fija en ${amount(contrato.rentAmount)} mensuales, que LA PARTE ARRENDATARIA abonará por adelantado dentro de los cinco primeros días de cada mes, mediante transferencia bancaria a la cuenta IBAN ${iban}.`
                : `La renta por la totalidad de la temporada se fija en ${amount(contrato.rentAmount)}, que LA PARTE ARRENDATARIA abonará mediante transferencia bancaria a la cuenta IBAN ${iban}, a la firma del presente contrato o, en su defecto, antes de la fecha de inicio del arrendamiento.`,
            },
            {
              title: "FIANZA",
              body: `A la firma del presente contrato, LA PARTE ARRENDATARIA hace entrega de la cantidad de ${amount(contrato.deposit)} en concepto de fianza. La fianza será devuelta a la finalización del arrendamiento, una vez comprobado el correcto estado del inmueble y de su mobiliario y, en su caso, la liquidación de los suministros.`,
            },
            {
              title: "SUMINISTROS",
              body: contrato.utilitiesIncluded
                ? "Los gastos por suministros del inmueble (agua, electricidad e internet, en su caso) se entienden incluidos en la renta pactada, siempre que respondan a un uso razonable de los mismos."
                : "Los gastos por suministros individualizados mediante contador (agua, electricidad, gas e internet, en su caso) serán de cuenta de LA PARTE ARRENDATARIA.",
            },
            {
              title: "USO Y CONSERVACIÓN",
              body: "LA PARTE ARRENDATARIA declara recibir el inmueble en perfecto estado de conservación y habitabilidad, y se obliga a conservarlo y devolverlo en el mismo estado. No podrá ceder ni subarrendar el inmueble, total o parcialmente, ni destinarlo a actividades molestas, insalubres, nocivas, peligrosas o ilícitas, debiendo respetar en todo momento las normas de la comunidad de propietarios.",
            },
            {
              title: "RESOLUCIÓN",
              body: "El incumplimiento por cualquiera de las partes de las obligaciones resultantes del presente contrato dará derecho a la parte que hubiere cumplido las suyas a exigir el cumplimiento de la obligación o a promover la resolución del contrato, conforme a lo dispuesto en el artículo 1124 del Código Civil.",
            },
            fuero,
          ];
        case "long-rent":
          return [
            {
              title: "OBJETO",
              body: "LA PARTE ARRENDADORA arrienda a LA PARTE ARRENDATARIA el inmueble descrito en el expositivo I, para su uso exclusivo como vivienda habitual y permanente de LA PARTE ARRENDATARIA, de conformidad con el artículo 2 de la Ley 29/1994, de 24 de noviembre, de Arrendamientos Urbanos (LAU).",
            },
            {
              title: "DURACIÓN",
              body: `El arrendamiento se pacta por el plazo de UN AÑO, a contar desde el día ${shortDate(contrato.startDate)}. Llegada la fecha de vencimiento del contrato, o de cualquiera de sus prórrogas, este se prorrogará obligatoriamente por plazos anuales hasta alcanzar una duración mínima de cinco años, salvo que LA PARTE ARRENDATARIA manifieste a LA PARTE ARRENDADORA, con al menos treinta días de antelación a la fecha de terminación del contrato o de cualquiera de las prórrogas, su voluntad de no renovarlo (artículo 9 LAU).`,
            },
            {
              title: "RENTA",
              body: `La renta se fija en ${amount(contrato.rentAmount)} mensuales, que LA PARTE ARRENDATARIA abonará por adelantado dentro de los siete primeros días de cada mes, mediante transferencia bancaria a la cuenta IBAN ${iban}. La renta se actualizará anualmente, en la fecha en que se cumpla cada año de vigencia del contrato, aplicando el índice de actualización que legalmente resulte de aplicación.`,
            },
            {
              title: "FIANZA",
              body: `A la firma del presente contrato, LA PARTE ARRENDATARIA hace entrega de la cantidad de ${amount(contrato.deposit)} en concepto de fianza legal (artículo 36 LAU), que será depositada por LA PARTE ARRENDADORA conforme a la normativa autonómica aplicable y devuelta a la finalización del arrendamiento, una vez comprobado el correcto estado del inmueble.`,
            },
            {
              title: "GASTOS Y SUMINISTROS",
              body: "Los gastos por suministros individualizados mediante contador (agua, electricidad, gas e internet, en su caso) serán de cuenta de LA PARTE ARRENDATARIA. El Impuesto sobre Bienes Inmuebles y los gastos ordinarios de la comunidad de propietarios serán de cuenta de LA PARTE ARRENDADORA.",
            },
            {
              title: "CONSERVACIÓN Y OBRAS",
              body: "LA PARTE ARRENDADORA realizará, sin derecho a elevar por ello la renta, las reparaciones necesarias para conservar la vivienda en condiciones de habitabilidad (artículo 21 LAU). Las pequeñas reparaciones que exija el desgaste por el uso ordinario de la vivienda serán de cargo de LA PARTE ARRENDATARIA, quien no podrá realizar obras sin el consentimiento previo y por escrito de LA PARTE ARRENDADORA.",
            },
            {
              title: "CESIÓN Y SUBARRIENDO",
              body: "LA PARTE ARRENDATARIA no podrá ceder el contrato ni subarrendar la vivienda, total o parcialmente, sin el consentimiento previo y por escrito de LA PARTE ARRENDADORA.",
            },
            {
              title: "RESOLUCIÓN",
              body: "El incumplimiento por cualquiera de las partes de las obligaciones resultantes del presente contrato dará derecho a la parte que hubiere cumplido las suyas a exigir el cumplimiento de la obligación o a promover la resolución del contrato, conforme a los artículos 27 de la LAU y 1124 del Código Civil.",
            },
            fuero,
          ];
        case "reservation":
          return [
            {
              title: "OBJETO Y PRECIO",
              body: `El objeto del presente documento es la reserva del inmueble descrito en el expositivo I, cuya compraventa las partes convienen en el precio de ${amount(contrato.price)}, impuestos y gastos no incluidos.`,
            },
            {
              title: "RESERVA",
              body: `En este acto, LA PARTE COMPRADORA entrega la cantidad de ${amount(contrato.signalAmount)} en concepto de reserva y señal, cantidad que se imputará íntegramente al precio de compraventa. ${
                contrato.depositHeldByAgency
                  ? "La cantidad entregada queda depositada en poder de la agencia intermediaria MILLA HOMES hasta la formalización de la operación."
                  : "La cantidad entregada ha sido recibida directamente por LA PARTE VENDEDORA."
              }`,
            },
            {
              title: "RETIRADA DEL MERCADO",
              body: "Desde la firma del presente documento, LA PARTE VENDEDORA retira el inmueble del mercado y se compromete a no ofertarlo ni venderlo a terceros mientras la reserva permanezca vigente.",
            },
            {
              title: "PLAZO",
              body: `Las partes se comprometen a formalizar el contrato de arras o, en su caso, la escritura pública de compraventa no más tarde del día ${shortDate(contrato.deadlineDate)}.`,
            },
            {
              title: "DESISTIMIENTO",
              body: "Si LA PARTE COMPRADORA desistiera de la compra o no compareciera a la formalización en el plazo pactado por causa a ella imputable, perderá la cantidad entregada en concepto de reserva. Si el desistimiento fuera imputable a LA PARTE VENDEDORA, esta devolverá a LA PARTE COMPRADORA la cantidad entregada. Si la operación no pudiera formalizarse por causa no imputable a ninguna de las partes (en particular, por denegación de la financiación solicitada, acreditada documentalmente), la cantidad entregada será devuelta a LA PARTE COMPRADORA.",
            },
            {
              title: "GASTOS E IMPUESTOS",
              body: "Los gastos e impuestos que se deriven de la compraventa serán satisfechos por las partes conforme a ley.",
            },
            fuero,
          ];
        case "arras":
          return [
            {
              title: "OBJETO Y PRECIO",
              body: `LA PARTE VENDEDORA se compromete a vender a LA PARTE COMPRADORA, que se compromete a comprar, el inmueble descrito en el expositivo I, por el precio de ${amount(contrato.price)}, impuestos y gastos no incluidos.`,
            },
            {
              title: "ARRAS PENITENCIALES",
              body: `En este acto, LA PARTE COMPRADORA entrega a LA PARTE VENDEDORA la cantidad de ${amount(contrato.signalAmount)} en concepto de arras penitenciales, conforme al artículo 1454 del Código Civil, cantidad que se imputará íntegramente al precio de compraventa en el momento del otorgamiento de la escritura pública.`,
            },
            {
              title: "DESISTIMIENTO",
              body: "Si LA PARTE COMPRADORA desistiera del contrato, perderá las arras entregadas. Si desistiera LA PARTE VENDEDORA, deberá devolverlas duplicadas a LA PARTE COMPRADORA (artículo 1454 del Código Civil).",
            },
            {
              title: "ESCRITURA PÚBLICA",
              body: `La escritura pública de compraventa se otorgará no más tarde del día ${shortDate(contrato.deadlineDate)}, ante el notario que designe LA PARTE COMPRADORA, momento en el que se abonará el resto del precio y se entregará la posesión del inmueble, libre de cargas, arrendatarios y ocupantes.`,
            },
            {
              title: "CARGAS Y ESTADO",
              body: "LA PARTE VENDEDORA manifiesta que el inmueble se encuentra libre de cargas y gravámenes, al corriente de pago de tributos y gastos de comunidad, y que no existen arrendatarios ni ocupantes. En caso de existir cargas, LA PARTE VENDEDORA se obliga a cancelarlas con anterioridad o de forma simultánea al otorgamiento de la escritura.",
            },
            {
              title: "GASTOS E IMPUESTOS",
              body: "Los gastos e impuestos derivados de la compraventa se abonarán conforme a ley. La plusvalía municipal (IIVTNU) será de cuenta de LA PARTE VENDEDORA.",
            },
            fuero,
          ];
      }
    },
  },

  // ---- English (courtesy translation) --------------------------------------
  en: {
    courtesy: "Courtesy translation. In the event of any discrepancy, the Spanish version shall prevail.",
    title: {
      "short-rent": "SEASONAL RESIDENTIAL LEASE AGREEMENT",
      "long-rent": "RESIDENTIAL LEASE AGREEMENT",
      reservation: "RESERVATION AGREEMENT",
      arras: "EARNEST MONEY CONTRACT (ARRAS PENITENCIALES)",
    },
    roles: {
      rent: { a: "THE LESSOR", b: "THE LESSEE" },
      sale: { a: "THE SELLER", b: "THE BUYER" },
    },
    placeLine: (city, date) => `In ${city}, on ${shortDate(date)}.`,
    headParties: "PARTIES",
    headRecitals: "RECITALS",
    headClauses: "CLAUSES",
    partyIntros: ["Of the one part, Mr./Ms.", "Of the other part, Mr./Ms."],
    partySegments: {
      id: ", of legal age, holding identity document no. ",
      addr: ", with address for these purposes at ",
      role: "; hereinafter, «",
    },
    capacity:
      "Both parties, acting in their own name and right, mutually acknowledge the legal capacity necessary to enter into this agreement and, to that effect,",
    exponeI: (roleA, address, city, ref) =>
      `That ${roleA} is the owner of the property located at ${address}, ${city}${ref ? `, cadastral reference ${ref}` : ""}; hereinafter, «the property».`,
    exponeII: {
      "short-rent":
        "That THE LESSEE is interested in leasing the property for reasons of season, for a use other than that of habitual residence, in accordance with Article 3.2 of Spanish Law 29/1994 of 24 November on Urban Leases (LAU).",
      "long-rent":
        "That THE LESSEE is interested in leasing the property to satisfy their permanent need for habitual housing.",
      reservation:
        "That THE BUYER is interested in acquiring the property, the estate agency MILLA HOMES having acted as intermediary in the transaction.",
      arras:
        "That THE BUYER is interested in purchasing the property and THE SELLER in selling it, for which purpose they formalise this penitential earnest money contract pursuant to Article 1454 of the Spanish Civil Code.",
    },
    exponeIII: "That both parties have agreed to formalise this contract subject to the following",
    otherTitle: "OTHER PROVISIONS",
    closing:
      "In witness whereof, both parties sign this document, in duplicate and to a single effect, at the place and on the date indicated in the heading.",
    clauseLabel: (index) => `${index + 1}`,
    clauses: (contrato, amount) => {
      const law: Clause = {
        title: "GOVERNING LAW AND JURISDICTION",
        body: "This agreement is governed by Spanish law. For any dispute arising from its interpretation or performance, the parties submit to the courts of the judicial district where the property is located.",
      };
      const termination: Clause = {
        title: "TERMINATION",
        body: "Failure by either party to comply with its obligations under this agreement shall entitle the complying party to demand performance or to terminate the agreement, in accordance with Article 1124 of the Spanish Civil Code.",
      };
      const iban = orBlank(contrato.iban, "________________________");
      switch (contrato.type) {
        case "short-rent":
          return [
            {
              title: "SUBJECT",
              body: "THE LESSOR leases to THE LESSEE the property described in Recital I, for its exclusive use as seasonal accommodation. The lease is expressly agreed for reasons of season, and the property shall in no case constitute the habitual and permanent residence of THE LESSEE; it is governed by the will of the parties expressed herein and, additionally, by the provisions of Spanish Law 29/1994 of 24 November on Urban Leases (LAU) for leases for a use other than that of a dwelling.",
            },
            {
              title: "TERM",
              body: `The lease shall have a fixed, non-extendable term: from ${shortDate(contrato.startDate)} to ${shortDate(contrato.endDate)}. On the end date, THE LESSEE shall vacate the property, free of persons and belongings, and place it at the disposal of THE LESSOR without prior demand; mandatory extension is expressly excluded.`,
            },
            {
              title: "RENT",
              body: contrato.rentIsMonthly
                ? `The rent is set at ${amount(contrato.rentAmount)} per month, payable in advance by THE LESSEE within the first five days of each month by bank transfer to IBAN ${iban}.`
                : `The rent for the entire season is set at ${amount(contrato.rentAmount)}, payable by THE LESSEE by bank transfer to IBAN ${iban} upon signature of this agreement or, failing that, before the start date of the lease.`,
            },
            {
              title: "DEPOSIT",
              body: `Upon signature of this agreement, THE LESSEE delivers the amount of ${amount(contrato.deposit)} as a security deposit. The deposit shall be returned at the end of the lease, once the correct condition of the property and its furniture has been verified and, where applicable, utilities have been settled.`,
            },
            {
              title: "UTILITIES",
              body: contrato.utilitiesIncluded
                ? "Utility costs (water, electricity and internet, where applicable) are included in the agreed rent, provided their use is reasonable."
                : "Costs for individually metered utilities (water, electricity, gas and internet, where applicable) shall be borne by THE LESSEE.",
            },
            {
              title: "USE AND CONSERVATION",
              body: "THE LESSEE declares receiving the property in perfect state of conservation and habitability, and undertakes to keep it and return it in the same condition. THE LESSEE may not assign or sublet the property, in whole or in part, nor use it for nuisance, unhealthy, harmful, dangerous or unlawful activities, and shall at all times respect the rules of the community of owners.",
            },
            termination,
            law,
          ];
        case "long-rent":
          return [
            {
              title: "SUBJECT",
              body: "THE LESSOR leases to THE LESSEE the property described in Recital I, for its exclusive use as the habitual and permanent residence of THE LESSEE, in accordance with Article 2 of Spanish Law 29/1994 of 24 November on Urban Leases (LAU).",
            },
            {
              title: "TERM",
              body: `The lease is agreed for a term of ONE YEAR from ${shortDate(contrato.startDate)}. Upon expiry of the agreement or of any of its extensions, it shall be mandatorily extended for annual periods up to a minimum duration of five years, unless THE LESSEE notifies THE LESSOR, at least thirty days before the end of the agreement or of any extension, of the intention not to renew it (Article 9 LAU).`,
            },
            {
              title: "RENT",
              body: `The rent is set at ${amount(contrato.rentAmount)} per month, payable in advance within the first seven days of each month by bank transfer to IBAN ${iban}. The rent shall be updated annually, on each anniversary of the agreement, applying the update index legally applicable.`,
            },
            {
              title: "DEPOSIT",
              body: `Upon signature of this agreement, THE LESSEE delivers the amount of ${amount(contrato.deposit)} as the legal deposit (Article 36 LAU), which THE LESSOR shall lodge in accordance with the applicable regional regulations and return at the end of the lease once the correct condition of the property has been verified.`,
            },
            {
              title: "EXPENSES AND UTILITIES",
              body: "Costs for individually metered utilities (water, electricity, gas and internet, where applicable) shall be borne by THE LESSEE. Property tax (IBI) and ordinary community fees shall be borne by THE LESSOR.",
            },
            {
              title: "CONSERVATION AND WORKS",
              body: "THE LESSOR shall carry out, without the right to increase the rent for this reason, the repairs necessary to keep the dwelling habitable (Article 21 LAU). Minor repairs required by ordinary wear and tear shall be borne by THE LESSEE, who may not carry out works without the prior written consent of THE LESSOR.",
            },
            {
              title: "ASSIGNMENT AND SUBLETTING",
              body: "THE LESSEE may not assign the agreement or sublet the dwelling, in whole or in part, without the prior written consent of THE LESSOR.",
            },
            {
              title: "TERMINATION",
              body: "Failure by either party to comply with its obligations under this agreement shall entitle the complying party to demand performance or to terminate the agreement, in accordance with Article 27 LAU and Article 1124 of the Spanish Civil Code.",
            },
            law,
          ];
        case "reservation":
          return [
            {
              title: "SUBJECT AND PRICE",
              body: `The purpose of this document is the reservation of the property described in Recital I, whose sale and purchase the parties agree at the price of ${amount(contrato.price)}, taxes and costs not included.`,
            },
            {
              title: "RESERVATION",
              body: `In this act, THE BUYER delivers the amount of ${amount(contrato.signalAmount)} as a reservation deposit, which shall be applied in full to the purchase price. ${
                contrato.depositHeldByAgency
                  ? "The amount delivered is held by the intermediary agency MILLA HOMES until the transaction is formalised."
                  : "The amount delivered has been received directly by THE SELLER."
              }`,
            },
            {
              title: "WITHDRAWAL FROM THE MARKET",
              body: "From the signature of this document, THE SELLER withdraws the property from the market and undertakes not to offer or sell it to third parties while the reservation remains in force.",
            },
            {
              title: "DEADLINE",
              body: `The parties undertake to formalise the earnest money (arras) contract or, where applicable, the public deed of sale no later than ${shortDate(contrato.deadlineDate)}.`,
            },
            {
              title: "WITHDRAWAL",
              body: "If THE BUYER withdraws from the purchase or fails to appear for the formalisation within the agreed period for reasons attributable to them, the reservation amount shall be forfeited. If the withdrawal is attributable to THE SELLER, the amount shall be returned to THE BUYER. If the transaction cannot be formalised for reasons not attributable to either party (in particular, a documented refusal of the financing applied for), the amount shall be returned to THE BUYER.",
            },
            {
              title: "COSTS AND TAXES",
              body: "The costs and taxes arising from the sale shall be paid by the parties in accordance with the law.",
            },
            law,
          ];
        case "arras":
          return [
            {
              title: "SUBJECT AND PRICE",
              body: `THE SELLER undertakes to sell to THE BUYER, who undertakes to buy, the property described in Recital I, for the price of ${amount(contrato.price)}, taxes and costs not included.`,
            },
            {
              title: "EARNEST MONEY",
              body: `In this act, THE BUYER delivers to THE SELLER the amount of ${amount(contrato.signalAmount)} as penitential earnest money (arras penitenciales) pursuant to Article 1454 of the Spanish Civil Code, which shall be applied in full to the purchase price upon execution of the public deed.`,
            },
            {
              title: "WITHDRAWAL",
              body: "If THE BUYER withdraws from the contract, the earnest money shall be forfeited. If THE SELLER withdraws, they shall return double the amount to THE BUYER (Article 1454 of the Spanish Civil Code).",
            },
            {
              title: "PUBLIC DEED",
              body: `The public deed of sale shall be executed no later than ${shortDate(contrato.deadlineDate)}, before the notary designated by THE BUYER, at which time the remainder of the price shall be paid and possession of the property delivered, free of charges, tenants and occupants.`,
            },
            {
              title: "CHARGES AND CONDITION",
              body: "THE SELLER declares that the property is free of charges and encumbrances, up to date with taxes and community fees, and that there are no tenants or occupants. Should any charges exist, THE SELLER undertakes to cancel them prior to or simultaneously with the execution of the deed.",
            },
            {
              title: "COSTS AND TAXES",
              body: "The costs and taxes arising from the sale shall be paid in accordance with the law. The municipal capital gains tax (IIVTNU) shall be borne by THE SELLER.",
            },
            law,
          ];
      }
    },
  },

  // ---- Russian (courtesy translation) ---------------------------------------
  ru: {
    courtesy: "Перевод предоставлен для удобства. При расхождениях преимущественную силу имеет испанская версия.",
    title: {
      "short-rent": "ДОГОВОР СЕЗОННОЙ АРЕНДЫ ЖИЛЬЯ",
      "long-rent": "ДОГОВОР ДОЛГОСРОЧНОЙ АРЕНДЫ ЖИЛЬЯ",
      reservation: "ДОГОВОР РЕЗЕРВИРОВАНИЯ",
      arras: "ДОГОВОР ЗАДАТКА (ARRAS PENITENCIALES)",
    },
    roles: {
      rent: { a: "АРЕНДОДАТЕЛЬ", b: "АРЕНДАТОР" },
      sale: { a: "ПРОДАВЕЦ", b: "ПОКУПАТЕЛЬ" },
    },
    placeLine: (city, date) => `Составлено в ${city}, ${shortDate(date)}.`,
    headParties: "СТОРОНЫ",
    headRecitals: "ПРЕАМБУЛА",
    headClauses: "УСЛОВИЯ",
    partyIntros: ["С одной стороны,", "С другой стороны,"],
    partySegments: {
      id: ", совершеннолетний(-яя), документ, удостоверяющий личность, № ",
      addr: ", адрес для целей настоящего договора: ",
      role: "; далее — «",
    },
    capacity:
      "Обе стороны, действуя от собственного имени, взаимно признают правоспособность, необходимую для заключения настоящего договора, и с этой целью",
    exponeI: (roleA, address, city, ref) =>
      `${roleA} является собственником объекта недвижимости, расположенного по адресу: ${address}, ${city}${ref ? `, кадастровый номер ${ref}` : ""}; далее — «объект».`,
    exponeII: {
      "short-rent":
        "АРЕНДАТОР заинтересован в сезонной аренде объекта для целей, отличных от постоянного проживания, в соответствии со статьей 3.2 Закона Испании 29/1994 от 24 ноября «Об аренде городской недвижимости» (LAU).",
      "long-rent":
        "АРЕНДАТОР заинтересован в аренде объекта для удовлетворения постоянной потребности в основном жилье.",
      reservation:
        "ПОКУПАТЕЛЬ заинтересован в приобретении объекта; посредником в сделке выступило агентство недвижимости MILLA HOMES.",
      arras:
        "ПОКУПАТЕЛЬ заинтересован в покупке объекта, а ПРОДАВЕЦ — в его продаже, для чего стороны заключают настоящий договор задатка в соответствии со статьей 1454 Гражданского кодекса Испании.",
    },
    exponeIII: "Стороны договорились заключить настоящий договор на нижеследующих условиях.",
    otherTitle: "ПРОЧИЕ УСЛОВИЯ",
    closing:
      "В подтверждение согласия стороны подписывают настоящий документ в двух экземплярах, имеющих равную силу, в месте и в дату, указанные в начале документа.",
    clauseLabel: (index) => `${index + 1}`,
    clauses: (contrato, amount) => {
      const law: Clause = {
        title: "ПРИМЕНИМОЕ ПРАВО И ПОДСУДНОСТЬ",
        body: "Настоящий договор регулируется законодательством Испании. Все споры, связанные с его толкованием или исполнением, подлежат рассмотрению в судах судебного округа по месту нахождения объекта.",
      };
      const termination: Clause = {
        title: "РАСТОРЖЕНИЕ",
        body: "Неисполнение любой из сторон обязательств по настоящему договору дает исправной стороне право требовать исполнения обязательства либо расторжения договора в соответствии со статьей 1124 Гражданского кодекса Испании.",
      };
      const iban = orBlank(contrato.iban, "________________________");
      switch (contrato.type) {
        case "short-rent":
          return [
            {
              title: "ПРЕДМЕТ",
              body: "АРЕНДОДАТЕЛЬ сдает АРЕНДАТОРУ в аренду объект, описанный в пункте I преамбулы, исключительно для сезонного проживания. Аренда заключается по сезонным основаниям; объект ни при каких обстоятельствах не является постоянным местом жительства АРЕНДАТОРА. Договор регулируется выраженной здесь волей сторон и, в дополнение, положениями Закона Испании 29/1994 от 24 ноября «Об аренде городской недвижимости» (LAU) об аренде для целей, отличных от постоянного проживания.",
            },
            {
              title: "СРОК",
              body: `Аренда имеет определенный срок без права продления: с ${shortDate(contrato.startDate)} по ${shortDate(contrato.endDate)}. По окончании срока АРЕНДАТОР освобождает объект от людей и вещей и передает его в распоряжение АРЕНДОДАТЕЛЯ без предварительного требования; обязательное продление прямо исключается.`,
            },
            {
              title: "АРЕНДНАЯ ПЛАТА",
              body: contrato.rentIsMonthly
                ? `Арендная плата устанавливается в размере ${amount(contrato.rentAmount)} в месяц и вносится АРЕНДАТОРОМ авансом в течение первых пяти дней каждого месяца банковским переводом на счет IBAN ${iban}.`
                : `Арендная плата за весь сезон устанавливается в размере ${amount(contrato.rentAmount)} и вносится АРЕНДАТОРОМ банковским переводом на счет IBAN ${iban} при подписании настоящего договора или, в ином случае, до даты начала аренды.`,
            },
            {
              title: "ЗАЛОГ",
              body: `При подписании настоящего договора АРЕНДАТОР вносит сумму ${amount(contrato.deposit)} в качестве залога. Залог возвращается по окончании аренды после проверки надлежащего состояния объекта и мебели и, при необходимости, после расчетов за коммунальные услуги.`,
            },
            {
              title: "КОММУНАЛЬНЫЕ УСЛУГИ",
              body: contrato.utilitiesIncluded
                ? "Коммунальные услуги (вода, электричество и интернет, при наличии) включены в согласованную арендную плату при условии их разумного использования."
                : "Расходы на коммунальные услуги по индивидуальным счетчикам (вода, электричество, газ и интернет, при наличии) несет АРЕНДАТОР.",
            },
            {
              title: "ИСПОЛЬЗОВАНИЕ И СОДЕРЖАНИЕ",
              body: "АРЕНДАТОР подтверждает получение объекта в надлежащем состоянии, пригодном для проживания, и обязуется сохранить и вернуть его в том же состоянии. АРЕНДАТОР не вправе передавать объект или сдавать его в субаренду, полностью или частично, а также использовать его для деятельности, создающей неудобства, вредной, опасной или незаконной, и обязан соблюдать правила сообщества собственников.",
            },
            termination,
            law,
          ];
        case "long-rent":
          return [
            {
              title: "ПРЕДМЕТ",
              body: "АРЕНДОДАТЕЛЬ сдает АРЕНДАТОРУ в аренду объект, описанный в пункте I преамбулы, исключительно для использования в качестве основного и постоянного места жительства АРЕНДАТОРА в соответствии со статьей 2 Закона Испании 29/1994 от 24 ноября «Об аренде городской недвижимости» (LAU).",
            },
            {
              title: "СРОК",
              body: `Аренда заключается сроком на ОДИН ГОД начиная с ${shortDate(contrato.startDate)}. По истечении срока договора или любого из его продлений договор в обязательном порядке продлевается на годичные периоды до достижения минимального срока в пять лет, если АРЕНДАТОР не уведомит АРЕНДОДАТЕЛЯ не менее чем за тридцать дней до окончания договора или продления о намерении не продлевать его (статья 9 LAU).`,
            },
            {
              title: "АРЕНДНАЯ ПЛАТА",
              body: `Арендная плата устанавливается в размере ${amount(contrato.rentAmount)} в месяц и вносится авансом в течение первых семи дней каждого месяца банковским переводом на счет IBAN ${iban}. Арендная плата пересматривается ежегодно, в каждую годовщину договора, с применением индекса, предусмотренного законодательством.`,
            },
            {
              title: "ЗАЛОГ",
              body: `При подписании настоящего договора АРЕНДАТОР вносит сумму ${amount(contrato.deposit)} в качестве законного залога (статья 36 LAU); АРЕНДОДАТЕЛЬ размещает залог в соответствии с применимыми региональными нормами и возвращает его по окончании аренды после проверки надлежащего состояния объекта.`,
            },
            {
              title: "РАСХОДЫ И КОММУНАЛЬНЫЕ УСЛУГИ",
              body: "Расходы на коммунальные услуги по индивидуальным счетчикам (вода, электричество, газ и интернет, при наличии) несет АРЕНДАТОР. Налог на недвижимость (IBI) и обычные платежи сообщества собственников несет АРЕНДОДАТЕЛЬ.",
            },
            {
              title: "СОДЕРЖАНИЕ И РЕМОНТ",
              body: "АРЕНДОДАТЕЛЬ выполняет, без права повышения арендной платы по этой причине, ремонт, необходимый для поддержания жилья в пригодном для проживания состоянии (статья 21 LAU). Мелкий ремонт вследствие обычного износа осуществляет АРЕНДАТОР, который не вправе проводить работы без предварительного письменного согласия АРЕНДОДАТЕЛЯ.",
            },
            {
              title: "УСТУПКА И СУБАРЕНДА",
              body: "АРЕНДАТОР не вправе уступать договор или сдавать жилье в субаренду, полностью или частично, без предварительного письменного согласия АРЕНДОДАТЕЛЯ.",
            },
            {
              title: "РАСТОРЖЕНИЕ",
              body: "Неисполнение любой из сторон обязательств по настоящему договору дает исправной стороне право требовать исполнения обязательства либо расторжения договора в соответствии со статьей 27 LAU и статьей 1124 Гражданского кодекса Испании.",
            },
            law,
          ];
        case "reservation":
          return [
            {
              title: "ПРЕДМЕТ И ЦЕНА",
              body: `Предметом настоящего документа является резервирование объекта, описанного в пункте I преамбулы; стороны согласовывают цену купли-продажи в размере ${amount(contrato.price)}, без учета налогов и расходов.`,
            },
            {
              title: "РЕЗЕРВИРОВАНИЕ",
              body: `Настоящим ПОКУПАТЕЛЬ вносит сумму ${amount(contrato.signalAmount)} в качестве резервационного платежа, которая полностью засчитывается в цену купли-продажи. ${
                contrato.depositHeldByAgency
                  ? "Внесенная сумма хранится у агентства-посредника MILLA HOMES до оформления сделки."
                  : "Внесенная сумма получена непосредственно ПРОДАВЦОМ."
              }`,
            },
            {
              title: "СНЯТИЕ С ПРОДАЖИ",
              body: "С момента подписания настоящего документа ПРОДАВЕЦ снимает объект с продажи и обязуется не предлагать и не продавать его третьим лицам, пока действует резервирование.",
            },
            {
              title: "СРОК",
              body: `Стороны обязуются оформить договор задатка (arras) или, при необходимости, нотариальный акт купли-продажи не позднее ${shortDate(contrato.deadlineDate)}.`,
            },
            {
              title: "ОТКАЗ ОТ СДЕЛКИ",
              body: "Если ПОКУПАТЕЛЬ откажется от покупки или не явится для оформления в согласованный срок по зависящим от него причинам, внесенная сумма не возвращается. Если отказ произошел по вине ПРОДАВЦА, сумма возвращается ПОКУПАТЕЛЮ. Если сделка не может быть оформлена по причинам, не зависящим ни от одной из сторон (в частности, при документально подтвержденном отказе в запрошенном финансировании), сумма возвращается ПОКУПАТЕЛЮ.",
            },
            {
              title: "РАСХОДЫ И НАЛОГИ",
              body: "Расходы и налоги, связанные с куплей-продажей, оплачиваются сторонами в соответствии с законом.",
            },
            law,
          ];
        case "arras":
          return [
            {
              title: "ПРЕДМЕТ И ЦЕНА",
              body: `ПРОДАВЕЦ обязуется продать ПОКУПАТЕЛЮ, а ПОКУПАТЕЛЬ — купить объект, описанный в пункте I преамбулы, по цене ${amount(contrato.price)}, без учета налогов и расходов.`,
            },
            {
              title: "ЗАДАТОК",
              body: `Настоящим ПОКУПАТЕЛЬ передает ПРОДАВЦУ сумму ${amount(contrato.signalAmount)} в качестве задатка (arras penitenciales) в соответствии со статьей 1454 Гражданского кодекса Испании; сумма полностью засчитывается в цену купли-продажи при подписании нотариального акта.`,
            },
            {
              title: "ОТКАЗ ОТ СДЕЛКИ",
              body: "Если от договора откажется ПОКУПАТЕЛЬ, задаток остается у ПРОДАВЦА. Если откажется ПРОДАВЕЦ, он возвращает задаток ПОКУПАТЕЛЮ в двойном размере (статья 1454 Гражданского кодекса Испании).",
            },
            {
              title: "НОТАРИАЛЬНЫЙ АКТ",
              body: `Нотариальный акт купли-продажи подписывается не позднее ${shortDate(contrato.deadlineDate)} у нотариуса, назначенного ПОКУПАТЕЛЕМ; в этот момент выплачивается остаток цены и передается владение объектом, свободным от обременений, арендаторов и жильцов.`,
            },
            {
              title: "ОБРЕМЕНЕНИЯ И СОСТОЯНИЕ",
              body: "ПРОДАВЕЦ заявляет, что объект свободен от обременений и залогов, налоги и платежи сообщества собственников оплачены, арендаторы и жильцы отсутствуют. При наличии обременений ПРОДАВЕЦ обязуется погасить их до или одновременно с подписанием акта.",
            },
            {
              title: "РАСХОДЫ И НАЛОГИ",
              body: "Расходы и налоги по купле-продаже оплачиваются в соответствии с законом. Муниципальный налог на прирост стоимости (IIVTNU) оплачивает ПРОДАВЕЦ.",
            },
            law,
          ];
      }
    },
  },

  // ---- Ukrainian (courtesy translation) --------------------------------------
  uk: {
    courtesy: "Переклад надано для зручності. У разі розбіжностей переважну силу має іспанська версія.",
    title: {
      "short-rent": "ДОГОВІР СЕЗОННОЇ ОРЕНДИ ЖИТЛА",
      "long-rent": "ДОГОВІР ДОВГОСТРОКОВОЇ ОРЕНДИ ЖИТЛА",
      reservation: "ДОГОВІР РЕЗЕРВУВАННЯ",
      arras: "ДОГОВІР ЗАВДАТКУ (ARRAS PENITENCIALES)",
    },
    roles: {
      rent: { a: "ОРЕНДОДАВЕЦЬ", b: "ОРЕНДАР" },
      sale: { a: "ПРОДАВЕЦЬ", b: "ПОКУПЕЦЬ" },
    },
    placeLine: (city, date) => `Складено в ${city}, ${shortDate(date)}.`,
    headParties: "СТОРОНИ",
    headRecitals: "ПРЕАМБУЛА",
    headClauses: "УМОВИ",
    partyIntros: ["З одного боку,", "З іншого боку,"],
    partySegments: {
      id: ", повнолітній(-я), документ, що посвідчує особу, № ",
      addr: ", адреса для цілей цього договору: ",
      role: "; далі — «",
    },
    capacity:
      "Обидві сторони, діючи від власного імені, взаємно визнають правоздатність, необхідну для укладення цього договору, і з цією метою",
    exponeI: (roleA, address, city, ref) =>
      `${roleA} є власником об'єкта нерухомості, розташованого за адресою: ${address}, ${city}${ref ? `, кадастровий номер ${ref}` : ""}; далі — «об'єкт».`,
    exponeII: {
      "short-rent":
        "ОРЕНДАР зацікавлений у сезонній оренді об'єкта для цілей, відмінних від постійного проживання, відповідно до статті 3.2 Закону Іспанії 29/1994 від 24 листопада «Про оренду міської нерухомості» (LAU).",
      "long-rent":
        "ОРЕНДАР зацікавлений в оренді об'єкта для задоволення постійної потреби в основному житлі.",
      reservation:
        "ПОКУПЕЦЬ зацікавлений у придбанні об'єкта; посередником в угоді виступило агентство нерухомості MILLA HOMES.",
      arras:
        "ПОКУПЕЦЬ зацікавлений у купівлі об'єкта, а ПРОДАВЕЦЬ — у його продажу, для чого сторони укладають цей договір завдатку відповідно до статті 1454 Цивільного кодексу Іспанії.",
    },
    exponeIII: "Сторони домовилися укласти цей договір на наведених нижче умовах.",
    otherTitle: "ІНШІ УМОВИ",
    closing:
      "На підтвердження згоди сторони підписують цей документ у двох примірниках, що мають однакову силу, у місці та в дату, зазначені на початку документа.",
    clauseLabel: (index) => `${index + 1}`,
    clauses: (contrato, amount) => {
      const law: Clause = {
        title: "ЗАСТОСОВНЕ ПРАВО ТА ПІДСУДНІСТЬ",
        body: "Цей договір регулюється законодавством Іспанії. Усі спори, пов'язані з його тлумаченням або виконанням, підлягають розгляду в судах судового округу за місцем розташування об'єкта.",
      };
      const termination: Clause = {
        title: "РОЗІРВАННЯ",
        body: "Невиконання будь-якою зі сторін зобов'язань за цим договором дає справній стороні право вимагати виконання зобов'язання або розірвання договору відповідно до статті 1124 Цивільного кодексу Іспанії.",
      };
      const iban = orBlank(contrato.iban, "________________________");
      switch (contrato.type) {
        case "short-rent":
          return [
            {
              title: "ПРЕДМЕТ",
              body: "ОРЕНДОДАВЕЦЬ здає ОРЕНДАРЮ в оренду об'єкт, описаний у пункті I преамбули, виключно для сезонного проживання. Оренда укладається на сезонних підставах; об'єкт за жодних обставин не є постійним місцем проживання ОРЕНДАРЯ. Договір регулюється вираженою тут волею сторін та, додатково, положеннями Закону Іспанії 29/1994 від 24 листопада «Про оренду міської нерухомості» (LAU) щодо оренди для цілей, відмінних від постійного проживання.",
            },
            {
              title: "СТРОК",
              body: `Оренда має визначений строк без права продовження: з ${shortDate(contrato.startDate)} по ${shortDate(contrato.endDate)}. Після закінчення строку ОРЕНДАР звільняє об'єкт від людей і речей та передає його в розпорядження ОРЕНДОДАВЦЯ без попередньої вимоги; обов'язкове продовження прямо виключається.`,
            },
            {
              title: "ОРЕНДНА ПЛАТА",
              body: contrato.rentIsMonthly
                ? `Орендна плата встановлюється в розмірі ${amount(contrato.rentAmount)} на місяць і вноситься ОРЕНДАРЕМ авансом протягом перших п'яти днів кожного місяця банківським переказом на рахунок IBAN ${iban}.`
                : `Орендна плата за весь сезон встановлюється в розмірі ${amount(contrato.rentAmount)} і вноситься ОРЕНДАРЕМ банківським переказом на рахунок IBAN ${iban} під час підписання цього договору або, в іншому випадку, до дати початку оренди.`,
            },
            {
              title: "ЗАСТАВА",
              body: `Під час підписання цього договору ОРЕНДАР вносить суму ${amount(contrato.deposit)} як заставу. Застава повертається після закінчення оренди після перевірки належного стану об'єкта та меблів і, за потреби, після розрахунків за комунальні послуги.`,
            },
            {
              title: "КОМУНАЛЬНІ ПОСЛУГИ",
              body: contrato.utilitiesIncluded
                ? "Комунальні послуги (вода, електрика та інтернет, за наявності) включені в узгоджену орендну плату за умови їх розумного використання."
                : "Витрати на комунальні послуги за індивідуальними лічильниками (вода, електрика, газ та інтернет, за наявності) несе ОРЕНДАР.",
            },
            {
              title: "ВИКОРИСТАННЯ ТА УТРИМАННЯ",
              body: "ОРЕНДАР підтверджує отримання об'єкта в належному стані, придатному для проживання, і зобов'язується зберегти та повернути його в тому самому стані. ОРЕНДАР не має права передавати об'єкт або здавати його в суборенду, повністю чи частково, а також використовувати його для діяльності, що створює незручності, є шкідливою, небезпечною чи незаконною, і зобов'язаний дотримуватися правил спільноти власників.",
            },
            termination,
            law,
          ];
        case "long-rent":
          return [
            {
              title: "ПРЕДМЕТ",
              body: "ОРЕНДОДАВЕЦЬ здає ОРЕНДАРЮ в оренду об'єкт, описаний у пункті I преамбули, виключно для використання як основного та постійного місця проживання ОРЕНДАРЯ відповідно до статті 2 Закону Іспанії 29/1994 від 24 листопада «Про оренду міської нерухомості» (LAU).",
            },
            {
              title: "СТРОК",
              body: `Оренда укладається строком на ОДИН РІК починаючи з ${shortDate(contrato.startDate)}. Після закінчення строку договору або будь-якого з його продовжень договір в обов'язковому порядку продовжується на річні періоди до досягнення мінімального строку в п'ять років, якщо ОРЕНДАР не повідомить ОРЕНДОДАВЦЯ щонайменше за тридцять днів до закінчення договору чи продовження про намір не продовжувати його (стаття 9 LAU).`,
            },
            {
              title: "ОРЕНДНА ПЛАТА",
              body: `Орендна плата встановлюється в розмірі ${amount(contrato.rentAmount)} на місяць і вноситься авансом протягом перших семи днів кожного місяця банківським переказом на рахунок IBAN ${iban}. Орендна плата переглядається щорічно, у кожну річницю договору, із застосуванням індексу, передбаченого законодавством.`,
            },
            {
              title: "ЗАСТАВА",
              body: `Під час підписання цього договору ОРЕНДАР вносить суму ${amount(contrato.deposit)} як законну заставу (стаття 36 LAU); ОРЕНДОДАВЕЦЬ розміщує заставу відповідно до застосовних регіональних норм і повертає її після закінчення оренди після перевірки належного стану об'єкта.`,
            },
            {
              title: "ВИТРАТИ ТА КОМУНАЛЬНІ ПОСЛУГИ",
              body: "Витрати на комунальні послуги за індивідуальними лічильниками (вода, електрика, газ та інтернет, за наявності) несе ОРЕНДАР. Податок на нерухомість (IBI) та звичайні платежі спільноти власників несе ОРЕНДОДАВЕЦЬ.",
            },
            {
              title: "УТРИМАННЯ ТА РЕМОНТ",
              body: "ОРЕНДОДАВЕЦЬ виконує, без права підвищення орендної плати з цієї причини, ремонт, необхідний для підтримання житла у придатному для проживання стані (стаття 21 LAU). Дрібний ремонт внаслідок звичайного зносу здійснює ОРЕНДАР, який не має права проводити роботи без попередньої письмової згоди ОРЕНДОДАВЦЯ.",
            },
            {
              title: "ВІДСТУПЛЕННЯ ТА СУБОРЕНДА",
              body: "ОРЕНДАР не має права відступати договір або здавати житло в суборенду, повністю чи частково, без попередньої письмової згоди ОРЕНДОДАВЦЯ.",
            },
            {
              title: "РОЗІРВАННЯ",
              body: "Невиконання будь-якою зі сторін зобов'язань за цим договором дає справній стороні право вимагати виконання зобов'язання або розірвання договору відповідно до статті 27 LAU та статті 1124 Цивільного кодексу Іспанії.",
            },
            law,
          ];
        case "reservation":
          return [
            {
              title: "ПРЕДМЕТ І ЦІНА",
              body: `Предметом цього документа є резервування об'єкта, описаного в пункті I преамбули; сторони узгоджують ціну купівлі-продажу в розмірі ${amount(contrato.price)}, без урахування податків і витрат.`,
            },
            {
              title: "РЕЗЕРВУВАННЯ",
              body: `Цим ПОКУПЕЦЬ вносить суму ${amount(contrato.signalAmount)} як резерваційний платіж, що повністю зараховується в ціну купівлі-продажу. ${
                contrato.depositHeldByAgency
                  ? "Внесена сума зберігається в агентства-посередника MILLA HOMES до оформлення угоди."
                  : "Внесена сума отримана безпосередньо ПРОДАВЦЕМ."
              }`,
            },
            {
              title: "ЗНЯТТЯ З ПРОДАЖУ",
              body: "З моменту підписання цього документа ПРОДАВЕЦЬ знімає об'єкт з продажу і зобов'язується не пропонувати та не продавати його третім особам, доки діє резервування.",
            },
            {
              title: "СТРОК",
              body: `Сторони зобов'язуються оформити договір завдатку (arras) або, за потреби, нотаріальний акт купівлі-продажу не пізніше ${shortDate(contrato.deadlineDate)}.`,
            },
            {
              title: "ВІДМОВА ВІД УГОДИ",
              body: "Якщо ПОКУПЕЦЬ відмовиться від купівлі або не з'явиться для оформлення в узгоджений строк із залежних від нього причин, внесена сума не повертається. Якщо відмова сталася з вини ПРОДАВЦЯ, сума повертається ПОКУПЦЮ. Якщо угоду неможливо оформити з причин, що не залежать від жодної зі сторін (зокрема, у разі документально підтвердженої відмови в запитаному фінансуванні), сума повертається ПОКУПЦЮ.",
            },
            {
              title: "ВИТРАТИ ТА ПОДАТКИ",
              body: "Витрати та податки, пов'язані з купівлею-продажем, сплачуються сторонами відповідно до закону.",
            },
            law,
          ];
        case "arras":
          return [
            {
              title: "ПРЕДМЕТ І ЦІНА",
              body: `ПРОДАВЕЦЬ зобов'язується продати ПОКУПЦЮ, а ПОКУПЕЦЬ — купити об'єкт, описаний у пункті I преамбули, за ціною ${amount(contrato.price)}, без урахування податків і витрат.`,
            },
            {
              title: "ЗАВДАТОК",
              body: `Цим ПОКУПЕЦЬ передає ПРОДАВЦЮ суму ${amount(contrato.signalAmount)} як завдаток (arras penitenciales) відповідно до статті 1454 Цивільного кодексу Іспанії; сума повністю зараховується в ціну купівлі-продажу під час підписання нотаріального акта.`,
            },
            {
              title: "ВІДМОВА ВІД УГОДИ",
              body: "Якщо від договору відмовиться ПОКУПЕЦЬ, завдаток залишається у ПРОДАВЦЯ. Якщо відмовиться ПРОДАВЕЦЬ, він повертає завдаток ПОКУПЦЮ в подвійному розмірі (стаття 1454 Цивільного кодексу Іспанії).",
            },
            {
              title: "НОТАРІАЛЬНИЙ АКТ",
              body: `Нотаріальний акт купівлі-продажу підписується не пізніше ${shortDate(contrato.deadlineDate)} у нотаріуса, призначеного ПОКУПЦЕМ; у цей момент сплачується залишок ціни та передається володіння об'єктом, вільним від обтяжень, орендарів і мешканців.`,
            },
            {
              title: "ОБТЯЖЕННЯ ТА СТАН",
              body: "ПРОДАВЕЦЬ заявляє, що об'єкт вільний від обтяжень і застав, податки та платежі спільноти власників сплачені, орендарі та мешканці відсутні. За наявності обтяжень ПРОДАВЕЦЬ зобов'язується погасити їх до або одночасно з підписанням акта.",
            },
            {
              title: "ВИТРАТИ ТА ПОДАТКИ",
              body: "Витрати та податки з купівлі-продажу сплачуються відповідно до закону. Муніципальний податок на приріст вартості (IIVTNU) сплачує ПРОДАВЕЦЬ.",
            },
            law,
          ];
      }
    },
  },

  // ---- German (courtesy translation) ----------------------------------------
  de: {
    courtesy: "Übersetzung aus Gefälligkeit. Bei Abweichungen ist die spanische Fassung maßgebend.",
    title: {
      "short-rent": "SAISONALER WOHNRAUMMIETVERTRAG",
      "long-rent": "WOHNRAUMMIETVERTRAG",
      reservation: "RESERVIERUNGSVEREINBARUNG",
      arras: "ANZAHLUNGSVERTRAG (ARRAS PENITENCIALES)",
    },
    roles: {
      rent: { a: "DER VERMIETER", b: "DER MIETER" },
      sale: { a: "DER VERKÄUFER", b: "DER KÄUFER" },
    },
    placeLine: (city, date) => `In ${city}, am ${shortDate(date)}.`,
    headParties: "PARTEIEN",
    headRecitals: "PRÄAMBEL",
    headClauses: "KLAUSELN",
    partyIntros: ["Einerseits Herr/Frau", "Andererseits Herr/Frau"],
    partySegments: {
      id: ", volljährig, Ausweisdokument Nr. ",
      addr: ", mit Anschrift für diese Zwecke in ",
      role: "; nachfolgend «",
    },
    capacity:
      "Beide Parteien, in eigenem Namen und Recht handelnd, erkennen gegenseitig die zur Unterzeichnung dieses Vertrags erforderliche Geschäftsfähigkeit an und",
    exponeI: (roleA, address, city, ref) =>
      `${roleA} ist Eigentümer der Immobilie in ${address}, ${city}${ref ? `, Katasterreferenz ${ref}` : ""}; nachfolgend «die Immobilie».`,
    exponeII: {
      "short-rent":
        "DER MIETER ist an der saisonalen Anmietung der Immobilie zu anderen Zwecken als dem des gewöhnlichen Wohnsitzes gemäß Artikel 3.2 des spanischen Gesetzes 29/1994 vom 24. November über städtische Mietverhältnisse (LAU) interessiert.",
      "long-rent":
        "DER MIETER ist an der Anmietung der Immobilie zur Deckung seines dauerhaften Wohnbedarfs interessiert.",
      reservation:
        "DER KÄUFER ist am Erwerb der Immobilie interessiert; als Vermittlerin der Transaktion war die Immobilienagentur MILLA HOMES tätig.",
      arras:
        "DER KÄUFER ist am Kauf und DER VERKÄUFER am Verkauf der Immobilie interessiert; zu diesem Zweck schließen sie diesen Anzahlungsvertrag gemäß Artikel 1454 des spanischen Zivilgesetzbuchs.",
    },
    exponeIII: "Beide Parteien haben vereinbart, diesen Vertrag zu den folgenden Bedingungen zu schließen.",
    otherTitle: "SONSTIGE BESTIMMUNGEN",
    closing:
      "Zum Zeichen des Einverständnisses unterzeichnen beide Parteien dieses Dokument in zweifacher Ausfertigung an dem eingangs genannten Ort und zu dem eingangs genannten Datum.",
    clauseLabel: (index) => `${index + 1}`,
    clauses: (contrato, amount) => {
      const law: Clause = {
        title: "RECHT UND GERICHTSSTAND",
        body: "Dieser Vertrag unterliegt spanischem Recht. Für sämtliche Streitigkeiten über seine Auslegung oder Erfüllung unterwerfen sich die Parteien den Gerichten des Gerichtsbezirks, in dem die Immobilie liegt.",
      };
      const termination: Clause = {
        title: "VERTRAGSAUFLÖSUNG",
        body: "Die Nichterfüllung der vertraglichen Pflichten durch eine Partei berechtigt die vertragstreue Partei, Erfüllung zu verlangen oder den Vertrag gemäß Artikel 1124 des spanischen Zivilgesetzbuchs aufzulösen.",
      };
      const iban = orBlank(contrato.iban, "________________________");
      switch (contrato.type) {
        case "short-rent":
          return [
            {
              title: "GEGENSTAND",
              body: "DER VERMIETER vermietet an DEN MIETER die in Ziffer I der Präambel beschriebene Immobilie zur ausschließlichen Nutzung als Saisonunterkunft. Das Mietverhältnis wird ausdrücklich saisonbedingt vereinbart; die Immobilie stellt in keinem Fall den gewöhnlichen und ständigen Wohnsitz DES MIETERS dar. Es gilt der hier zum Ausdruck gebrachte Wille der Parteien und ergänzend das spanische Gesetz 29/1994 vom 24. November über städtische Mietverhältnisse (LAU) für Mietverhältnisse zu anderen Zwecken als Wohnzwecken.",
            },
            {
              title: "LAUFZEIT",
              body: `Das Mietverhältnis hat eine feste, nicht verlängerbare Laufzeit: vom ${shortDate(contrato.startDate)} bis zum ${shortDate(contrato.endDate)}. Zum Enddatum übergibt DER MIETER die Immobilie frei von Personen und Gegenständen ohne vorherige Aufforderung an DEN VERMIETER; eine obligatorische Verlängerung ist ausdrücklich ausgeschlossen.`,
            },
            {
              title: "MIETE",
              body: contrato.rentIsMonthly
                ? `Die Miete beträgt ${amount(contrato.rentAmount)} monatlich und ist von DEM MIETER innerhalb der ersten fünf Tage eines jeden Monats im Voraus per Banküberweisung auf das Konto IBAN ${iban} zu zahlen.`
                : `Die Miete für die gesamte Saison beträgt ${amount(contrato.rentAmount)} und ist von DEM MIETER per Banküberweisung auf das Konto IBAN ${iban} bei Unterzeichnung dieses Vertrags, spätestens jedoch vor Mietbeginn, zu zahlen.`,
            },
            {
              title: "KAUTION",
              body: `Bei Unterzeichnung dieses Vertrags hinterlegt DER MIETER den Betrag von ${amount(contrato.deposit)} als Kaution. Die Kaution wird nach Beendigung des Mietverhältnisses zurückerstattet, sobald der ordnungsgemäße Zustand der Immobilie und des Mobiliars festgestellt und ggf. die Nebenkosten abgerechnet wurden.`,
            },
            {
              title: "NEBENKOSTEN",
              body: contrato.utilitiesIncluded
                ? "Die Nebenkosten (Wasser, Strom und ggf. Internet) sind bei angemessenem Verbrauch in der vereinbarten Miete enthalten."
                : "Die Kosten für einzeln gezählte Versorgungsleistungen (Wasser, Strom, Gas und ggf. Internet) trägt DER MIETER.",
            },
            {
              title: "NUTZUNG UND ERHALTUNG",
              body: "DER MIETER bestätigt, die Immobilie in einwandfreiem, bewohnbarem Zustand zu übernehmen, und verpflichtet sich, sie in demselben Zustand zu erhalten und zurückzugeben. Er darf die Immobilie weder ganz noch teilweise abtreten oder untervermieten noch für störende, gesundheitsschädliche, gefährliche oder rechtswidrige Tätigkeiten nutzen und hat die Regeln der Eigentümergemeinschaft jederzeit zu beachten.",
            },
            termination,
            law,
          ];
        case "long-rent":
          return [
            {
              title: "GEGENSTAND",
              body: "DER VERMIETER vermietet an DEN MIETER die in Ziffer I der Präambel beschriebene Immobilie zur ausschließlichen Nutzung als gewöhnlichen und ständigen Wohnsitz DES MIETERS gemäß Artikel 2 des spanischen Gesetzes 29/1994 vom 24. November über städtische Mietverhältnisse (LAU).",
            },
            {
              title: "LAUFZEIT",
              body: `Das Mietverhältnis wird für die Dauer von EINEM JAHR ab dem ${shortDate(contrato.startDate)} geschlossen. Nach Ablauf des Vertrags oder einer seiner Verlängerungen verlängert er sich zwingend um jeweils ein Jahr bis zu einer Mindestdauer von fünf Jahren, sofern DER MIETER nicht mindestens dreißig Tage vor Ablauf des Vertrags oder einer Verlängerung DEM VERMIETER mitteilt, ihn nicht verlängern zu wollen (Artikel 9 LAU).`,
            },
            {
              title: "MIETE",
              body: `Die Miete beträgt ${amount(contrato.rentAmount)} monatlich, zahlbar im Voraus innerhalb der ersten sieben Tage eines jeden Monats per Banküberweisung auf das Konto IBAN ${iban}. Die Miete wird jährlich zum Jahrestag des Vertrags anhand des gesetzlich anwendbaren Indexes angepasst.`,
            },
            {
              title: "KAUTION",
              body: `Bei Unterzeichnung dieses Vertrags hinterlegt DER MIETER den Betrag von ${amount(contrato.deposit)} als gesetzliche Kaution (Artikel 36 LAU); DER VERMIETER hinterlegt sie gemäß den geltenden regionalen Vorschriften und erstattet sie nach Vertragsende nach Prüfung des ordnungsgemäßen Zustands der Immobilie zurück.`,
            },
            {
              title: "KOSTEN UND NEBENKOSTEN",
              body: "Die Kosten für einzeln gezählte Versorgungsleistungen (Wasser, Strom, Gas und ggf. Internet) trägt DER MIETER. Die Grundsteuer (IBI) und die ordentlichen Kosten der Eigentümergemeinschaft trägt DER VERMIETER.",
            },
            {
              title: "ERHALTUNG UND UMBAUTEN",
              body: "DER VERMIETER führt ohne das Recht, deswegen die Miete zu erhöhen, die zur Bewohnbarkeit erforderlichen Reparaturen durch (Artikel 21 LAU). Kleinreparaturen infolge gewöhnlicher Abnutzung trägt DER MIETER, der ohne vorherige schriftliche Zustimmung DES VERMIETERS keine Umbauten vornehmen darf.",
            },
            {
              title: "ABTRETUNG UND UNTERVERMIETUNG",
              body: "DER MIETER darf den Vertrag ohne vorherige schriftliche Zustimmung DES VERMIETERS weder abtreten noch die Wohnung ganz oder teilweise untervermieten.",
            },
            {
              title: "VERTRAGSAUFLÖSUNG",
              body: "Die Nichterfüllung der vertraglichen Pflichten durch eine Partei berechtigt die vertragstreue Partei, Erfüllung zu verlangen oder den Vertrag gemäß Artikel 27 LAU und Artikel 1124 des spanischen Zivilgesetzbuchs aufzulösen.",
            },
            law,
          ];
        case "reservation":
          return [
            {
              title: "GEGENSTAND UND KAUFPREIS",
              body: `Gegenstand dieses Dokuments ist die Reservierung der in Ziffer I der Präambel beschriebenen Immobilie; die Parteien vereinbaren einen Kaufpreis von ${amount(contrato.price)}, zuzüglich Steuern und Kosten.`,
            },
            {
              title: "RESERVIERUNG",
              body: `DER KÄUFER übergibt hiermit den Betrag von ${amount(contrato.signalAmount)} als Reservierungsanzahlung, der vollständig auf den Kaufpreis angerechnet wird. ${
                contrato.depositHeldByAgency
                  ? "Der Betrag wird bis zum Abschluss der Transaktion von der Vermittlungsagentur MILLA HOMES verwahrt."
                  : "Der Betrag wurde direkt von DEM VERKÄUFER entgegengenommen."
              }`,
            },
            {
              title: "MARKTRÜCKNAHME",
              body: "Mit Unterzeichnung dieses Dokuments nimmt DER VERKÄUFER die Immobilie vom Markt und verpflichtet sich, sie Dritten weder anzubieten noch zu verkaufen, solange die Reservierung gilt.",
            },
            {
              title: "FRIST",
              body: `Die Parteien verpflichten sich, den Anzahlungsvertrag (Arras) oder ggf. die notarielle Kaufurkunde spätestens am ${shortDate(contrato.deadlineDate)} zu errichten.`,
            },
            {
              title: "RÜCKTRITT",
              body: "Tritt DER KÄUFER vom Kauf zurück oder erscheint er aus von ihm zu vertretenden Gründen nicht fristgerecht zur Beurkundung, verfällt der Reservierungsbetrag. Ist der Rücktritt DEM VERKÄUFER zuzurechnen, wird der Betrag DEM KÄUFER zurückerstattet. Kann die Transaktion aus von keiner Partei zu vertretenden Gründen nicht vollzogen werden (insbesondere bei nachgewiesener Ablehnung der beantragten Finanzierung), wird der Betrag DEM KÄUFER zurückerstattet.",
            },
            {
              title: "KOSTEN UND STEUERN",
              body: "Die aus dem Verkauf entstehenden Kosten und Steuern tragen die Parteien nach Maßgabe des Gesetzes.",
            },
            law,
          ];
        case "arras":
          return [
            {
              title: "GEGENSTAND UND KAUFPREIS",
              body: `DER VERKÄUFER verpflichtet sich, DEM KÄUFER die in Ziffer I der Präambel beschriebene Immobilie zum Preis von ${amount(contrato.price)}, zuzüglich Steuern und Kosten, zu verkaufen, und DER KÄUFER verpflichtet sich zum Kauf.`,
            },
            {
              title: "ANZAHLUNG (REUGELD)",
              body: `DER KÄUFER übergibt DEM VERKÄUFER hiermit den Betrag von ${amount(contrato.signalAmount)} als Reugeld (arras penitenciales) gemäß Artikel 1454 des spanischen Zivilgesetzbuchs; der Betrag wird bei der Beurkundung vollständig auf den Kaufpreis angerechnet.`,
            },
            {
              title: "RÜCKTRITT",
              body: "Tritt DER KÄUFER vom Vertrag zurück, verfällt das Reugeld. Tritt DER VERKÄUFER zurück, hat er es DEM KÄUFER in doppelter Höhe zurückzuzahlen (Artikel 1454 des spanischen Zivilgesetzbuchs).",
            },
            {
              title: "NOTARIELLE URKUNDE",
              body: `Die notarielle Kaufurkunde wird spätestens am ${shortDate(contrato.deadlineDate)} vor dem von DEM KÄUFER benannten Notar errichtet; dabei wird der Restkaufpreis gezahlt und der Besitz der lasten-, mieter- und bewohnerfreien Immobilie übergeben.`,
            },
            {
              title: "LASTEN UND ZUSTAND",
              body: "DER VERKÄUFER erklärt, dass die Immobilie frei von Lasten und Belastungen ist, Steuern und Gemeinschaftskosten bezahlt sind und keine Mieter oder Bewohner vorhanden sind. Bestehende Lasten verpflichtet er sich, vor oder gleichzeitig mit der Beurkundung zu löschen.",
            },
            {
              title: "KOSTEN UND STEUERN",
              body: "Kosten und Steuern des Verkaufs werden nach Maßgabe des Gesetzes getragen. Die gemeindliche Wertzuwachssteuer (IIVTNU) trägt DER VERKÄUFER.",
            },
            law,
          ];
      }
    },
  },
};

function PartyParagraph({
  copy,
  intro,
  party,
  role,
}: {
  copy: DocCopy;
  intro: string;
  party: Contrato["partyA"];
  role: string;
}) {
  return (
    <p>
      {intro} <strong>{orBlank(party.name)}</strong>
      {copy.partySegments.id}
      {orBlank(party.nif)}
      {copy.partySegments.addr}
      {orBlank(party.address)}
      {copy.partySegments.role}
      {role}».
    </p>
  );
}

// Printable A4 contract (794px wide at 96dpi; height flows over as many pages
// as the text needs — pagination is handled by print CSS). `locale` selects
// the document language; Spanish is the binding original, everything else
// carries a courtesy-translation note.
export function ContratoSheet({
  contrato,
  locale = "es",
}: {
  contrato: Contrato;
  locale?: ContratoDocLocale;
}) {
  const copy = DOC_COPY[locale];
  const roleGroup = contrato.type === "reservation" || contrato.type === "arras" ? "sale" : "rent";
  const roles = copy.roles[roleGroup];
  const amount = (raw: string) => legalAmount(raw, locale);
  const clauses = copy.clauses(contrato, amount);
  const extraParagraphs = contrato.extraClauses
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <div className="con-sheet" lang={locale}>
      <p className="con-brand">MILLA HOMES · Intermediación inmobiliaria</p>
      <h1 className="con-title">{copy.title[contrato.type]}</h1>
      {copy.courtesy ? <p className="con-courtesy">{copy.courtesy}</p> : null}
      <p className="con-place">{copy.placeLine(orBlank(contrato.city), contrato.date)}</p>

      <h2 className="con-heading">{copy.headParties}</h2>
      <PartyParagraph copy={copy} intro={copy.partyIntros[0]} party={contrato.partyA} role={roles.a} />
      <PartyParagraph copy={copy} intro={copy.partyIntros[1]} party={contrato.partyB} role={roles.b} />
      <p>{copy.capacity}</p>

      <h2 className="con-heading">{copy.headRecitals}</h2>
      <p>
        <strong>I.</strong>{" "}
        {copy.exponeI(
          roles.a,
          orBlank(contrato.propertyAddress),
          orBlank(contrato.propertyCity),
          contrato.propertyRef.trim(),
        )}
      </p>
      <p>
        <strong>II.</strong> {copy.exponeII[contrato.type]}
      </p>
      <p>
        <strong>III.</strong> {copy.exponeIII}
      </p>

      <h2 className="con-heading">{copy.headClauses}</h2>
      {clauses.map((clause, index) => (
        <p className="con-clause" key={clause.title}>
          <strong>
            {copy.clauseLabel(index)}. {clause.title}.
          </strong>{" "}
          {clause.body}
        </p>
      ))}
      {extraParagraphs.length > 0 ? (
        <div className="con-clause">
          <p>
            <strong>
              {copy.clauseLabel(clauses.length)}. {copy.otherTitle}.
            </strong>{" "}
            {extraParagraphs[0]}
          </p>
          {extraParagraphs.slice(1).map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      ) : null}

      <p className="con-closing">{copy.closing}</p>

      <div className="con-signatures">
        <div className="con-signature">
          <div className="con-signline" />
          <p className="con-signature-role">{roles.a}</p>
          <p>{orBlank(contrato.partyA.name, " ")}</p>
        </div>
        <div className="con-signature">
          <div className="con-signline" />
          <p className="con-signature-role">{roles.b}</p>
          <p>{orBlank(contrato.partyB.name, " ")}</p>
        </div>
      </div>
    </div>
  );
}
