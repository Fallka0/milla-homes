"use client";

import { useEffect, useRef, useState } from "react";

import { FacturaSheet } from "./factura-sheet";
import {
  DRAFT_STORAGE_KEY,
  IVA_LABEL,
  PRINT_STORAGE_KEY,
  blankFactura,
  computeFacturaTotals,
  formatEuros,
  nextFacturaNumber,
  parseAmountToCents,
  type Factura,
} from "@/lib/facturas";

// ---- scaled on-screen A4 preview (same approach as the window-sheets tool) --
function FacturaPreview({ factura }: { factura: Factura }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => setScale(el.clientWidth / 794);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className="fac-preview-frame" style={{ height: 1123 * scale }}>
      <div style={{ transform: `scale(${scale})`, transformOrigin: "top left", width: 794, height: 1123 }}>
        <FacturaSheet factura={factura} />
      </div>
    </div>
  );
}

export function FacturasTool() {
  const [factura, setFactura] = useState<Factura>(() => blankFactura());

  // Restore the last draft so a reload (or coming back later) doesn't lose the
  // invoice in progress. localStorage isn't available during SSR, so this can't
  // be a lazy state initializer.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (!raw) return;
      const draft = JSON.parse(raw) as Factura;
      if (draft && Array.isArray(draft.lines) && draft.lines.length > 0) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFactura(draft);
      }
    } catch {
      // Corrupt draft: start blank.
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(factura));
    } catch {
      // Storage full/unavailable: the tool still works, just without drafts.
    }
  }, [factura]);

  function setField<K extends keyof Factura>(key: K, value: Factura[K]) {
    setFactura((current) => ({ ...current, [key]: value }));
  }

  const setLine = (index: number, patch: Partial<Factura["lines"][number]>) =>
    setFactura((current) => ({
      ...current,
      lines: current.lines.map((line, i) => (i === index ? { ...line, ...patch } : line)),
    }));

  const addLine = () =>
    setFactura((current) => ({
      ...current,
      lines: [...current.lines, { description: "", amount: "" }],
    }));

  const removeLine = (index: number) =>
    setFactura((current) => ({
      ...current,
      lines: current.lines.filter((_, i) => i !== index),
    }));

  const startNew = () =>
    setFactura((current) => blankFactura(nextFacturaNumber(current.number)));

  const exportPdf = () => {
    localStorage.setItem(PRINT_STORAGE_KEY, JSON.stringify({ factura }));
    window.open("/admin/facturas/print", "_blank");
  };

  const totals = computeFacturaTotals(factura);
  const hasAmount = totals.lineBaseCents.some((cents) => cents !== null);
  const hasBadAmount = factura.lines.some(
    (line) => line.amount.trim() !== "" && parseAmountToCents(line.amount) === null,
  );

  return (
    <div className="fac-tool">
      <div className="fac-controls">
        {/* Invoice number + date */}
        <div className="fac-card">
          <div className="fac-card-head">
            <h3 className="fac-card-title">Factura</h3>
            <button type="button" className="fac-link" onClick={startNew}>
              Nueva factura (Nº siguiente)
            </button>
          </div>
          <div className="fac-grid-2">
            <div className="fac-field">
              <label htmlFor="fac-number">Nº de factura</label>
              <input
                id="fac-number"
                value={factura.number}
                onChange={(event) => setField("number", event.target.value)}
                placeholder="002/2026"
              />
            </div>
            <div className="fac-field">
              <label htmlFor="fac-date">Fecha</label>
              <input
                id="fac-date"
                type="date"
                value={factura.date}
                onChange={(event) => setField("date", event.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Client */}
        <div className="fac-card">
          <h3 className="fac-card-title">Cliente</h3>
          <div className="fac-field">
            <label htmlFor="fac-client-name">Nombre</label>
            <input
              id="fac-client-name"
              value={factura.clientName}
              onChange={(event) => setField("clientName", event.target.value)}
              placeholder="Svitlana Buyan"
            />
          </div>
          <div className="fac-field">
            <label htmlFor="fac-client-address">Dirección</label>
            <input
              id="fac-client-address"
              value={factura.clientAddress}
              onChange={(event) => setField("clientAddress", event.target.value)}
              placeholder="C/ Concordia, 116 PL 02 PT B"
            />
          </div>
          <div className="fac-grid-2">
            <div className="fac-field">
              <label htmlFor="fac-client-city">Ciudad</label>
              <input
                id="fac-client-city"
                value={factura.clientCity}
                onChange={(event) => setField("clientCity", event.target.value)}
                placeholder="03182 Torrevieja (Alicante)"
              />
            </div>
            <div className="fac-field">
              <label htmlFor="fac-client-nif">NIE/CIF</label>
              <input
                id="fac-client-nif"
                value={factura.clientNif}
                onChange={(event) => setField("clientNif", event.target.value)}
                placeholder="X6333357H"
              />
            </div>
          </div>
        </div>

        {/* Concepts + amounts */}
        <div className="fac-card">
          <h3 className="fac-card-title">Conceptos</h3>

          <label className="fac-check">
            <input
              type="checkbox"
              checked={factura.amountsIncludeIva}
              onChange={(event) => setField("amountsIncludeIva", event.target.checked)}
            />
            <span>
              Los importes ya incluyen el IVA (la base se calcula sola, p. ej. 2.500 € →
              base 2.066,12 € + IVA 433,88 €)
            </span>
          </label>

          {factura.lines.map((line, index) => (
            <div className="fac-line" key={index}>
              <div className="fac-field fac-line-desc">
                <label htmlFor={`fac-line-desc-${index}`}>Descripción</label>
                <input
                  id={`fac-line-desc-${index}`}
                  value={line.description}
                  onChange={(event) => setLine(index, { description: event.target.value })}
                  placeholder="HONORARIOS POR INTERMEDIACIÓN EN LA VENTA"
                />
              </div>
              <div className="fac-field fac-line-amount">
                <label htmlFor={`fac-line-amount-${index}`}>
                  {factura.amountsIncludeIva ? "Importe (IVA incl.)" : "Base imponible"}
                </label>
                <input
                  id={`fac-line-amount-${index}`}
                  inputMode="decimal"
                  value={line.amount}
                  onChange={(event) => setLine(index, { amount: event.target.value })}
                  placeholder="2.500,00"
                />
              </div>
              {factura.lines.length > 1 ? (
                <button
                  type="button"
                  className="fac-line-remove"
                  onClick={() => removeLine(index)}
                  title="Quitar línea"
                >
                  ✕
                </button>
              ) : null}
            </div>
          ))}

          <button type="button" className="fac-link" onClick={addLine}>
            + Añadir línea
          </button>

          {hasBadAmount ? (
            <p className="fac-error">Hay un importe que no se entiende. Usa formato 2.500,00.</p>
          ) : null}

          <div className="fac-summary">
            <div>
              <span>Subtotal</span>
              <strong>{formatEuros(totals.subtotalCents)}</strong>
            </div>
            <div>
              <span>{IVA_LABEL}</span>
              <strong>{formatEuros(totals.ivaCents)}</strong>
            </div>
            <div>
              <span>TOTAL</span>
              <strong>{formatEuros(totals.totalCents)}</strong>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <div className="fac-card">
          <h3 className="fac-card-title">Nota al pie (opcional)</h3>
          <div className="fac-field">
            <textarea
              rows={3}
              aria-label="Nota al pie"
              value={factura.note}
              onChange={(event) => setField("note", event.target.value)}
              placeholder="Honorarios por intermediación por la venta piso sito en calle Concordia 116, 2 B, 03182 Torrevieja"
            />
          </div>
        </div>
      </div>

      {/* Preview + export */}
      <div className="fac-preview">
        <div className="fac-preview-sticky">
          <div className="fac-preview-actions">
            <button
              type="button"
              className="fac-button fac-button-primary"
              onClick={exportPdf}
              disabled={!hasAmount}
            >
              Exportar PDF
            </button>
          </div>
          <FacturaPreview factura={factura} />
        </div>
      </div>
    </div>
  );
}
