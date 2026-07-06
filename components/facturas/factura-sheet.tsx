import {
  FACTURA_ISSUER,
  FACTURA_PAYMENT,
  IVA_LABEL,
  computeFacturaTotals,
  formatEuros,
  formatFacturaDate,
  type Factura,
} from "@/lib/facturas";

const formatLineBase = (baseCents: number | null | undefined) =>
  baseCents === null || baseCents === undefined ? "—" : formatEuros(baseCents);

// Printable A4 invoice (794×1123 px at 96dpi), matching the layout of the
// facturas Svetlana already sends: issuer block, FACTURA header, client box,
// description/total table, subtotal + IVA + total, bank transfer details.
export function FacturaSheet({ factura }: { factura: Factura }) {
  const totals = computeFacturaTotals(factura);

  const clientRows = [
    { label: "Nombre", value: factura.clientName },
    { label: "Dirección", value: factura.clientAddress },
    { label: "Ciudad", value: factura.clientCity },
    { label: "NIE/CIF", value: factura.clientNif },
  ];

  return (
    <div className="fac-sheet" lang="es">
      <header className="fac-head">
        <div className="fac-issuer">
          <p className="fac-brand">{FACTURA_ISSUER.brand}</p>
          <p>{FACTURA_ISSUER.name}</p>
          <p>NIE: {FACTURA_ISSUER.nie}</p>
          <p>{FACTURA_ISSUER.addressLine}</p>
          <p>{FACTURA_ISSUER.cityLine}</p>
          <p>{FACTURA_ISSUER.phone}</p>
        </div>
        <div className="fac-meta">
          <p className="fac-doc-title">FACTURA</p>
          <p>
            <span>Nº</span> {factura.number || "—"}
          </p>
          <p>
            <span>Fecha:</span> {formatFacturaDate(factura.date) || "—"}
          </p>
        </div>
      </header>

      <section className="fac-client">
        <h2>Cliente</h2>
        <dl>
          {clientRows.map((row) => (
            <div key={row.label}>
              <dt>{row.label}</dt>
              <dd>{row.value || " "}</dd>
            </div>
          ))}
        </dl>
      </section>

      <table className="fac-lines">
        <thead>
          <tr>
            <th>Descripción</th>
            <th>TOTAL</th>
          </tr>
        </thead>
        <tbody>
          {factura.lines.map((line, index) => (
            <tr key={index}>
              <td>{line.description || " "}</td>
              <td>{formatLineBase(totals.lineBaseCents[index])}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="fac-totals">
        <div>
          <span>Subtotal</span>
          <strong>{formatEuros(totals.subtotalCents)}</strong>
        </div>
        <div>
          <span>{IVA_LABEL}</span>
          <strong>{formatEuros(totals.ivaCents)}</strong>
        </div>
        <div className="fac-totals-final">
          <span>TOTAL</span>
          <strong>{formatEuros(totals.totalCents)}</strong>
        </div>
      </div>

      <section className="fac-payment">
        <p className="fac-payment-title">{FACTURA_PAYMENT.method}</p>
        <p>Titular: {FACTURA_PAYMENT.holder}</p>
        <p>IBAN: {FACTURA_PAYMENT.iban}</p>
      </section>

      {factura.note.trim() ? <p className="fac-note">{factura.note}</p> : null}
    </div>
  );
}
