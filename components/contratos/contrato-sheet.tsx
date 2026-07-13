import type { ReactNode } from "react";

import { formatEuros, formatFacturaDate, parseAmountToCents } from "@/lib/facturas";
import {
  centsToLegalWordsEs,
  contratoRoles,
  contratoTitle,
  formatContratoLongDate,
  type Contrato,
} from "@/lib/contratos";

const ORDINALES = [
  "PRIMERA", "SEGUNDA", "TERCERA", "CUARTA", "QUINTA", "SEXTA",
  "SÉPTIMA", "OCTAVA", "NOVENA", "DÉCIMA", "UNDÉCIMA", "DUODÉCIMA",
];

const BLANK = "________";

const orBlank = (value: string, blank = BLANK) => (value.trim() ? value.trim() : blank);

// "2500" -> "DOS MIL QUINIENTOS EUROS (2.500,00 €)", blanks while unfilled.
function legalAmount(raw: string): string {
  const cents = parseAmountToCents(raw);
  if (cents === null) return `${BLANK} EUROS (${BLANK} €)`;
  return `${centsToLegalWordsEs(cents)} (${formatEuros(cents)})`;
}

const shortDate = (iso: string) => (iso.trim() ? formatFacturaDate(iso) : BLANK);

type Clause = { title: string; body: ReactNode };

// The boilerplate that never changes per type, with the variable data
// interpolated. Kept in one place so the four documents stay consistent.
function buildClauses(contrato: Contrato): Clause[] {
  const roles = contratoRoles(contrato.type);
  const rent = legalAmount(contrato.rentAmount);
  const deposit = legalAmount(contrato.deposit);
  const price = legalAmount(contrato.price);
  const signal = legalAmount(contrato.signalAmount);
  const iban = orBlank(contrato.iban, "________________________");

  const resolucion: Clause = {
    title: "RESOLUCIÓN",
    body: `El incumplimiento por cualquiera de las partes de las obligaciones resultantes del presente contrato dará derecho a la parte que hubiere cumplido las suyas a exigir el cumplimiento de la obligación o a promover la resolución del contrato, conforme a lo dispuesto en el artículo 1124 del Código Civil.`,
  };
  const fuero: Clause = {
    title: "LEGISLACIÓN Y FUERO",
    body: `El presente contrato se regirá por la legislación española. Para cuantas cuestiones se susciten en relación con su interpretación o cumplimiento, las partes se someten a los juzgados y tribunales del partido judicial en que radica el inmueble.`,
  };

  switch (contrato.type) {
    case "short-rent":
      return [
        {
          title: "OBJETO",
          body: `${roles.a} arrienda a ${roles.b} el inmueble descrito en el expositivo I, para su uso exclusivo como vivienda de temporada. El arrendamiento se concierta expresamente por razón de temporada, sin que el inmueble vaya a constituir en ningún caso la residencia habitual y permanente de ${roles.b}, por lo que se rige por la voluntad de las partes aquí expresada y, supletoriamente, por lo dispuesto para los arrendamientos para uso distinto del de vivienda en la Ley 29/1994, de 24 de noviembre, de Arrendamientos Urbanos (LAU).`,
        },
        {
          title: "DURACIÓN",
          body: `El arrendamiento tendrá una duración determinada e improrrogable: desde el día ${shortDate(contrato.startDate)} hasta el día ${shortDate(contrato.endDate)}. Llegada la fecha de finalización, ${roles.b} dejará el inmueble libre de personas y enseres y a disposición de ${roles.a}, sin necesidad de requerimiento previo, quedando expresamente excluida la prórroga obligatoria.`,
        },
        {
          title: "RENTA",
          body: contrato.rentIsMonthly
            ? `La renta se fija en ${rent} mensuales, que ${roles.b} abonará por adelantado dentro de los cinco primeros días de cada mes, mediante transferencia bancaria a la cuenta IBAN ${iban}.`
            : `La renta por la totalidad de la temporada se fija en ${rent}, que ${roles.b} abonará mediante transferencia bancaria a la cuenta IBAN ${iban}, a la firma del presente contrato o, en su defecto, antes de la fecha de inicio del arrendamiento.`,
        },
        {
          title: "FIANZA",
          body: `A la firma del presente contrato, ${roles.b} hace entrega de la cantidad de ${deposit} en concepto de fianza. La fianza será devuelta a la finalización del arrendamiento, una vez comprobado el correcto estado del inmueble y de su mobiliario y, en su caso, la liquidación de los suministros.`,
        },
        {
          title: "SUMINISTROS",
          body: contrato.utilitiesIncluded
            ? `Los gastos por suministros del inmueble (agua, electricidad e internet, en su caso) se entienden incluidos en la renta pactada, siempre que respondan a un uso razonable de los mismos.`
            : `Los gastos por suministros individualizados mediante contador (agua, electricidad, gas e internet, en su caso) serán de cuenta de ${roles.b}.`,
        },
        {
          title: "USO Y CONSERVACIÓN",
          body: `${roles.b} declara recibir el inmueble en perfecto estado de conservación y habitabilidad, y se obliga a conservarlo y devolverlo en el mismo estado. No podrá ceder ni subarrendar el inmueble, total o parcialmente, ni destinarlo a actividades molestas, insalubres, nocivas, peligrosas o ilícitas, debiendo respetar en todo momento las normas de la comunidad de propietarios.`,
        },
        resolucion,
        fuero,
      ];

    case "long-rent":
      return [
        {
          title: "OBJETO",
          body: `${roles.a} arrienda a ${roles.b} el inmueble descrito en el expositivo I, para su uso exclusivo como vivienda habitual y permanente de ${roles.b}, de conformidad con el artículo 2 de la Ley 29/1994, de 24 de noviembre, de Arrendamientos Urbanos (LAU).`,
        },
        {
          title: "DURACIÓN",
          body: `El arrendamiento se pacta por el plazo de UN AÑO, a contar desde el día ${shortDate(contrato.startDate)}. Llegada la fecha de vencimiento del contrato, o de cualquiera de sus prórrogas, este se prorrogará obligatoriamente por plazos anuales hasta alcanzar una duración mínima de cinco años, salvo que ${roles.b} manifieste a ${roles.a}, con al menos treinta días de antelación a la fecha de terminación del contrato o de cualquiera de las prórrogas, su voluntad de no renovarlo (artículo 9 LAU).`,
        },
        {
          title: "RENTA",
          body: `La renta se fija en ${rent} mensuales, que ${roles.b} abonará por adelantado dentro de los siete primeros días de cada mes, mediante transferencia bancaria a la cuenta IBAN ${iban}. La renta se actualizará anualmente, en la fecha en que se cumpla cada año de vigencia del contrato, aplicando el índice de actualización que legalmente resulte de aplicación.`,
        },
        {
          title: "FIANZA",
          body: `A la firma del presente contrato, ${roles.b} hace entrega de la cantidad de ${deposit} en concepto de fianza legal (artículo 36 LAU), que será depositada por ${roles.a} conforme a la normativa autonómica aplicable y devuelta a la finalización del arrendamiento, una vez comprobado el correcto estado del inmueble.`,
        },
        {
          title: "GASTOS Y SUMINISTROS",
          body: `Los gastos por suministros individualizados mediante contador (agua, electricidad, gas e internet, en su caso) serán de cuenta de ${roles.b}. El Impuesto sobre Bienes Inmuebles y los gastos ordinarios de la comunidad de propietarios serán de cuenta de ${roles.a}.`,
        },
        {
          title: "CONSERVACIÓN Y OBRAS",
          body: `${roles.a} realizará, sin derecho a elevar por ello la renta, las reparaciones necesarias para conservar la vivienda en condiciones de habitabilidad (artículo 21 LAU). Las pequeñas reparaciones que exija el desgaste por el uso ordinario de la vivienda serán de cargo de ${roles.b}, quien no podrá realizar obras sin el consentimiento previo y por escrito de ${roles.a}.`,
        },
        {
          title: "CESIÓN Y SUBARRIENDO",
          body: `${roles.b} no podrá ceder el contrato ni subarrendar la vivienda, total o parcialmente, sin el consentimiento previo y por escrito de ${roles.a}.`,
        },
        {
          title: "RESOLUCIÓN",
          body: `El incumplimiento por cualquiera de las partes de las obligaciones resultantes del presente contrato dará derecho a la parte que hubiere cumplido las suyas a exigir el cumplimiento de la obligación o a promover la resolución del contrato, conforme a los artículos 27 de la LAU y 1124 del Código Civil.`,
        },
        fuero,
      ];

    case "reservation":
      return [
        {
          title: "OBJETO Y PRECIO",
          body: `El objeto del presente documento es la reserva del inmueble descrito en el expositivo I, cuya compraventa las partes convienen en el precio de ${price}, impuestos y gastos no incluidos.`,
        },
        {
          title: "RESERVA",
          body: `En este acto, ${roles.b} entrega la cantidad de ${signal} en concepto de reserva y señal, cantidad que se imputará íntegramente al precio de compraventa. ${
            contrato.depositHeldByAgency
              ? "La cantidad entregada queda depositada en poder de la agencia intermediaria MILLA HOMES hasta la formalización de la operación."
              : `La cantidad entregada ha sido recibida directamente por ${roles.a}.`
          }`,
        },
        {
          title: "RETIRADA DEL MERCADO",
          body: `Desde la firma del presente documento, ${roles.a} retira el inmueble del mercado y se compromete a no ofertarlo ni venderlo a terceros mientras la reserva permanezca vigente.`,
        },
        {
          title: "PLAZO",
          body: `Las partes se comprometen a formalizar el contrato de arras o, en su caso, la escritura pública de compraventa no más tarde del día ${shortDate(contrato.deadlineDate)}.`,
        },
        {
          title: "DESISTIMIENTO",
          body: `Si ${roles.b} desistiera de la compra o no compareciera a la formalización en el plazo pactado por causa a ella imputable, perderá la cantidad entregada en concepto de reserva. Si el desistimiento fuera imputable a ${roles.a}, esta devolverá a ${roles.b} la cantidad entregada. Si la operación no pudiera formalizarse por causa no imputable a ninguna de las partes (en particular, por denegación de la financiación solicitada, acreditada documentalmente), la cantidad entregada será devuelta a ${roles.b}.`,
        },
        {
          title: "GASTOS E IMPUESTOS",
          body: `Los gastos e impuestos que se deriven de la compraventa serán satisfechos por las partes conforme a ley.`,
        },
        fuero,
      ];

    case "arras":
      return [
        {
          title: "OBJETO Y PRECIO",
          body: `${roles.a} se compromete a vender a ${roles.b}, que se compromete a comprar, el inmueble descrito en el expositivo I, por el precio de ${price}, impuestos y gastos no incluidos.`,
        },
        {
          title: "ARRAS PENITENCIALES",
          body: `En este acto, ${roles.b} entrega a ${roles.a} la cantidad de ${signal} en concepto de arras penitenciales, conforme al artículo 1454 del Código Civil, cantidad que se imputará íntegramente al precio de compraventa en el momento del otorgamiento de la escritura pública.`,
        },
        {
          title: "DESISTIMIENTO",
          body: `Si ${roles.b} desistiera del contrato, perderá las arras entregadas. Si desistiera ${roles.a}, deberá devolverlas duplicadas a ${roles.b} (artículo 1454 del Código Civil).`,
        },
        {
          title: "ESCRITURA PÚBLICA",
          body: `La escritura pública de compraventa se otorgará no más tarde del día ${shortDate(contrato.deadlineDate)}, ante el notario que designe ${roles.b}, momento en el que se abonará el resto del precio y se entregará la posesión del inmueble, libre de cargas, arrendatarios y ocupantes.`,
        },
        {
          title: "CARGAS Y ESTADO",
          body: `${roles.a} manifiesta que el inmueble se encuentra libre de cargas y gravámenes, al corriente de pago de tributos y gastos de comunidad, y que no existen arrendatarios ni ocupantes. En caso de existir cargas, ${roles.a} se obliga a cancelarlas con anterioridad o de forma simultánea al otorgamiento de la escritura.`,
        },
        {
          title: "GASTOS E IMPUESTOS",
          body: `Los gastos e impuestos derivados de la compraventa se abonarán conforme a ley. La plusvalía municipal (IIVTNU) será de cuenta de ${roles.a}.`,
        },
        fuero,
      ];
  }
}

function exponeII(contrato: Contrato): string {
  const roles = contratoRoles(contrato.type);
  switch (contrato.type) {
    case "short-rent":
      return `Que ${roles.b} está interesada en el arrendamiento del inmueble por razón de temporada, para uso distinto del de vivienda habitual, de conformidad con el artículo 3.2 de la Ley 29/1994, de 24 de noviembre, de Arrendamientos Urbanos.`;
    case "long-rent":
      return `Que ${roles.b} está interesada en el arrendamiento del inmueble para satisfacer su necesidad permanente de vivienda habitual.`;
    case "reservation":
      return `Que ${roles.b} está interesada en la adquisición del inmueble, habiendo mediado en la operación la agencia inmobiliaria MILLA HOMES.`;
    case "arras":
      return `Que ${roles.b} está interesada en la compra del inmueble y ${roles.a} en su venta, formalizando a tal fin el presente contrato de arras penitenciales conforme al artículo 1454 del Código Civil.`;
  }
}

function PartyParagraph({ intro, party, role }: { intro: string; party: Contrato["partyA"]; role: string }) {
  return (
    <p>
      {intro} D./D.ª <strong>{orBlank(party.name)}</strong>, mayor de edad, con documento de
      identidad n.º {orBlank(party.nif)} y domicilio a estos efectos en {orBlank(party.address)};
      en adelante, «{role}».
    </p>
  );
}

// Printable A4 contract (794px wide at 96dpi; height flows over as many
// pages as the text needs — pagination is handled by print CSS).
export function ContratoSheet({ contrato }: { contrato: Contrato }) {
  const roles = contratoRoles(contrato.type);
  const clauses = buildClauses(contrato);
  const extraParagraphs = contrato.extraClauses
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <div className="con-sheet" lang="es">
      <p className="con-brand">MILLA HOMES · Intermediación inmobiliaria</p>
      <h1 className="con-title">{contratoTitle(contrato.type)}</h1>
      <p className="con-place">
        En {orBlank(contrato.city)}, a {contrato.date ? formatContratoLongDate(contrato.date) : BLANK}.
      </p>

      <h2 className="con-heading">REUNIDOS</h2>
      <PartyParagraph intro="De una parte," party={contrato.partyA} role={roles.a} />
      <PartyParagraph intro="De otra parte," party={contrato.partyB} role={roles.b} />
      <p>
        Ambas partes, actuando en su propio nombre y derecho, se reconocen mutuamente la capacidad
        legal necesaria para otorgar el presente contrato y, a tal efecto,
      </p>

      <h2 className="con-heading">EXPONEN</h2>
      <p>
        <strong>I.</strong> Que {roles.a} es propietaria del inmueble sito en{" "}
        {orBlank(contrato.propertyAddress)}, {orBlank(contrato.propertyCity)}
        {contrato.propertyRef.trim() ? `, con referencia catastral ${contrato.propertyRef.trim()}` : ""}
        ; en adelante, «el inmueble».
      </p>
      <p>
        <strong>II.</strong> {exponeII(contrato)}
      </p>
      <p>
        <strong>III.</strong> Que ambas partes han convenido formalizar el presente contrato con
        sujeción a las siguientes
      </p>

      <h2 className="con-heading">CLÁUSULAS</h2>
      {clauses.map((clause, index) => (
        <p className="con-clause" key={clause.title}>
          <strong>
            {ORDINALES[index] ?? `CLÁUSULA ${index + 1}`}. {clause.title}.
          </strong>{" "}
          {clause.body}
        </p>
      ))}
      {extraParagraphs.length > 0 ? (
        <div className="con-clause">
          <p>
            <strong>
              {ORDINALES[clauses.length] ?? `CLÁUSULA ${clauses.length + 1}`}. OTRAS ESTIPULACIONES.
            </strong>{" "}
            {extraParagraphs[0]}
          </p>
          {extraParagraphs.slice(1).map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      ) : null}

      <p className="con-closing">
        Y en prueba de conformidad, ambas partes firman el presente documento, por duplicado
        ejemplar y a un solo efecto, en el lugar y fecha indicados en el encabezamiento.
      </p>

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
