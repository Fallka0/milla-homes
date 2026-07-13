"use client";

import { useEffect, useRef, useState } from "react";

import { ContratoSheet } from "./contrato-sheet";
import { parseAmountToCents } from "@/lib/facturas";
import {
  CONTRATO_DRAFT_STORAGE_KEY,
  CONTRATO_PRINT_STORAGE_KEY,
  CONTRATO_TYPES,
  blankContrato,
  contratoPartyLabels,
  type Contrato,
  type ContratoParty,
  type ContratoType,
} from "@/lib/contratos";

// ---- scaled on-screen A4 preview (same approach as the facturas tool, but
// the contract grows with its text, so the natural height is observed too) ---
function ContratoPreview({ contrato }: { contrato: Contrato }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);
  const [sheetHeight, setSheetHeight] = useState(1123);

  useEffect(() => {
    const wrap = wrapRef.current;
    const sheet = sheetRef.current;
    if (!wrap || !sheet) return;
    const update = () => {
      setScale(wrap.clientWidth / 794);
      setSheetHeight(sheet.offsetHeight);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(wrap);
    ro.observe(sheet);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className="fac-preview-frame" style={{ height: sheetHeight * scale }}>
      <div style={{ transform: `scale(${scale})`, transformOrigin: "top left", width: 794 }}>
        <div ref={sheetRef}>
          <ContratoSheet contrato={contrato} />
        </div>
      </div>
    </div>
  );
}

export function ContratosTool() {
  const [contrato, setContrato] = useState<Contrato>(() => blankContrato());

  // Restore the last draft so a reload doesn't lose the contract in progress.
  // localStorage isn't available during SSR, so this can't be a lazy initializer.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(CONTRATO_DRAFT_STORAGE_KEY);
      if (!raw) return;
      const draft = JSON.parse(raw) as Contrato;
      if (draft && CONTRATO_TYPES.some((option) => option.value === draft.type)) {
        // Spread over a blank so drafts saved before newer fields still work.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setContrato({ ...blankContrato(draft.type), ...draft });
      }
    } catch {
      // Corrupt draft: start blank.
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(CONTRATO_DRAFT_STORAGE_KEY, JSON.stringify(contrato));
    } catch {
      // Storage full/unavailable: the tool still works, just without drafts.
    }
  }, [contrato]);

  function setField<K extends keyof Contrato>(key: K, value: Contrato[K]) {
    setContrato((current) => ({ ...current, [key]: value }));
  }

  const setParty = (key: "partyA" | "partyB", patch: Partial<ContratoParty>) =>
    setContrato((current) => ({ ...current, [key]: { ...current[key], ...patch } }));

  const resetForm = () => setContrato(blankContrato(contrato.type));

  const exportPdf = () => {
    localStorage.setItem(CONTRATO_PRINT_STORAGE_KEY, JSON.stringify({ contrato }));
    window.open("/admin/contratos/print", "_blank");
  };

  const isRent = contrato.type === "short-rent" || contrato.type === "long-rent";
  const partyLabels = contratoPartyLabels(contrato.type);

  const moneyFields = isRent
    ? [contrato.rentAmount, contrato.deposit]
    : [contrato.price, contrato.signalAmount];
  const hasBadAmount = moneyFields.some(
    (raw) => raw.trim() !== "" && parseAmountToCents(raw) === null,
  );

  const partyFields = (key: "partyA" | "partyB", label: string) => (
    <div className="fac-card">
      <h3 className="fac-card-title">{label}</h3>
      <div className="fac-grid-2">
        <div className="fac-field">
          <label htmlFor={`con-${key}-name`}>Nombre completo</label>
          <input
            id={`con-${key}-name`}
            value={contrato[key].name}
            onChange={(event) => setParty(key, { name: event.target.value })}
            placeholder="Nombre y apellidos"
          />
        </div>
        <div className="fac-field">
          <label htmlFor={`con-${key}-nif`}>DNI/NIE/Pasaporte</label>
          <input
            id={`con-${key}-nif`}
            value={contrato[key].nif}
            onChange={(event) => setParty(key, { nif: event.target.value })}
            placeholder="X6333357H"
          />
        </div>
      </div>
      <div className="fac-field">
        <label htmlFor={`con-${key}-address`}>Domicilio</label>
        <input
          id={`con-${key}-address`}
          value={contrato[key].address}
          onChange={(event) => setParty(key, { address: event.target.value })}
          placeholder="C/ Concordia 116, 2 B, 03182 Torrevieja (Alicante)"
        />
      </div>
    </div>
  );

  return (
    <div className="fac-tool">
      <div className="fac-controls">
        {/* Contract type + place/date of signing */}
        <div className="fac-card">
          <div className="fac-card-head">
            <h3 className="fac-card-title">Tipo de contrato</h3>
            <button type="button" className="fac-link" onClick={resetForm}>
              Vaciar formulario
            </button>
          </div>
          <div className="con-type-grid" role="radiogroup" aria-label="Tipo de contrato">
            {CONTRATO_TYPES.map((option) => (
              <label
                key={option.value}
                className={`con-type-option${contrato.type === option.value ? " is-active" : ""}`}
              >
                <input
                  type="radio"
                  name="con-type"
                  value={option.value}
                  checked={contrato.type === option.value}
                  onChange={() => setField("type", option.value as ContratoType)}
                />
                <span className="con-type-label">{option.label}</span>
                <span className="con-type-hint">{option.hint}</span>
              </label>
            ))}
          </div>
          <div className="fac-grid-2">
            <div className="fac-field">
              <label htmlFor="con-city">Lugar de firma</label>
              <input
                id="con-city"
                value={contrato.city}
                onChange={(event) => setField("city", event.target.value)}
                placeholder="Orihuela Costa (Alicante)"
              />
            </div>
            <div className="fac-field">
              <label htmlFor="con-date">Fecha de firma</label>
              <input
                id="con-date"
                type="date"
                value={contrato.date}
                onChange={(event) => setField("date", event.target.value)}
              />
            </div>
          </div>
        </div>

        {partyFields("partyA", partyLabels.a)}
        {partyFields("partyB", partyLabels.b)}

        {/* Property */}
        <div className="fac-card">
          <h3 className="fac-card-title">Inmueble</h3>
          <div className="fac-field">
            <label htmlFor="con-prop-address">Dirección</label>
            <input
              id="con-prop-address"
              value={contrato.propertyAddress}
              onChange={(event) => setField("propertyAddress", event.target.value)}
              placeholder="Calle Osa Mayor 13, bajo A"
            />
          </div>
          <div className="fac-grid-2">
            <div className="fac-field">
              <label htmlFor="con-prop-city">Ciudad</label>
              <input
                id="con-prop-city"
                value={contrato.propertyCity}
                onChange={(event) => setField("propertyCity", event.target.value)}
                placeholder="03189 Orihuela Costa (Alicante)"
              />
            </div>
            <div className="fac-field">
              <label htmlFor="con-prop-ref">Ref. catastral (opcional)</label>
              <input
                id="con-prop-ref"
                value={contrato.propertyRef}
                onChange={(event) => setField("propertyRef", event.target.value)}
                placeholder="9872023VH5797S0001WX"
              />
            </div>
          </div>
        </div>

        {/* Economic terms, per type */}
        <div className="fac-card">
          <h3 className="fac-card-title">Condiciones</h3>

          {isRent ? (
            <>
              <div className="fac-grid-2">
                <div className="fac-field">
                  <label htmlFor="con-start">Inicio del alquiler</label>
                  <input
                    id="con-start"
                    type="date"
                    value={contrato.startDate}
                    onChange={(event) => setField("startDate", event.target.value)}
                  />
                </div>
                {contrato.type === "short-rent" ? (
                  <div className="fac-field">
                    <label htmlFor="con-end">Fin del alquiler</label>
                    <input
                      id="con-end"
                      type="date"
                      value={contrato.endDate}
                      onChange={(event) => setField("endDate", event.target.value)}
                    />
                  </div>
                ) : (
                  <div className="fac-field">
                    <label>Duración</label>
                    <input value="1 año, prorrogable hasta 5 (LAU)" disabled />
                  </div>
                )}
              </div>

              {contrato.type === "short-rent" ? (
                <label className="fac-check">
                  <input
                    type="checkbox"
                    checked={contrato.rentIsMonthly}
                    onChange={(event) => setField("rentIsMonthly", event.target.checked)}
                  />
                  <span>La renta es mensual (en lugar de un importe total por la temporada)</span>
                </label>
              ) : null}

              <div className="fac-grid-2">
                <div className="fac-field">
                  <label htmlFor="con-rent">
                    {contrato.type === "long-rent" || contrato.rentIsMonthly
                      ? "Renta mensual (€)"
                      : "Renta total temporada (€)"}
                  </label>
                  <input
                    id="con-rent"
                    inputMode="decimal"
                    value={contrato.rentAmount}
                    onChange={(event) => setField("rentAmount", event.target.value)}
                    placeholder="1.200,00"
                  />
                </div>
                <div className="fac-field">
                  <label htmlFor="con-deposit">Fianza (€)</label>
                  <input
                    id="con-deposit"
                    inputMode="decimal"
                    value={contrato.deposit}
                    onChange={(event) => setField("deposit", event.target.value)}
                    placeholder={contrato.type === "long-rent" ? "1 mensualidad" : "1.200,00"}
                  />
                </div>
              </div>

              <div className="fac-field">
                <label htmlFor="con-iban">IBAN para el pago de la renta</label>
                <input
                  id="con-iban"
                  value={contrato.iban}
                  onChange={(event) => setField("iban", event.target.value)}
                  placeholder="ES00 0000 0000 0000 0000 0000"
                />
              </div>

              {contrato.type === "short-rent" ? (
                <label className="fac-check">
                  <input
                    type="checkbox"
                    checked={contrato.utilitiesIncluded}
                    onChange={(event) => setField("utilitiesIncluded", event.target.checked)}
                  />
                  <span>Suministros (agua, luz, internet) incluidos en la renta</span>
                </label>
              ) : null}
            </>
          ) : (
            <>
              <div className="fac-grid-2">
                <div className="fac-field">
                  <label htmlFor="con-price">Precio de compraventa (€)</label>
                  <input
                    id="con-price"
                    inputMode="decimal"
                    value={contrato.price}
                    onChange={(event) => setField("price", event.target.value)}
                    placeholder="185.000,00"
                  />
                </div>
                <div className="fac-field">
                  <label htmlFor="con-signal">
                    {contrato.type === "arras" ? "Importe de las arras (€)" : "Importe de la reserva (€)"}
                  </label>
                  <input
                    id="con-signal"
                    inputMode="decimal"
                    value={contrato.signalAmount}
                    onChange={(event) => setField("signalAmount", event.target.value)}
                    placeholder={contrato.type === "arras" ? "18.500,00" : "3.000,00"}
                  />
                </div>
              </div>
              <div className="fac-field">
                <label htmlFor="con-deadline">
                  {contrato.type === "arras"
                    ? "Fecha límite para la escritura pública"
                    : "Fecha límite para arras / escritura"}
                </label>
                <input
                  id="con-deadline"
                  type="date"
                  value={contrato.deadlineDate}
                  onChange={(event) => setField("deadlineDate", event.target.value)}
                />
              </div>
              {contrato.type === "reservation" ? (
                <label className="fac-check">
                  <input
                    type="checkbox"
                    checked={contrato.depositHeldByAgency}
                    onChange={(event) => setField("depositHeldByAgency", event.target.checked)}
                  />
                  <span>La reserva queda depositada en Milla Homes (si no, la recibe el vendedor)</span>
                </label>
              ) : null}
            </>
          )}

          {hasBadAmount ? (
            <p className="fac-error">Hay un importe que no se entiende. Usa formato 2.500,00.</p>
          ) : null}
        </div>

        {/* Extra clauses */}
        <div className="fac-card">
          <h3 className="fac-card-title">Otras estipulaciones (opcional)</h3>
          <div className="fac-field">
            <textarea
              rows={4}
              aria-label="Otras estipulaciones"
              value={contrato.extraClauses}
              onChange={(event) => setField("extraClauses", event.target.value)}
              placeholder={
                "Una cláusula por línea, p. ej.:\nSe permite la estancia de una mascota de pequeño tamaño.\nEl inmueble se entrega amueblado según inventario anexo."
              }
            />
          </div>
        </div>
      </div>

      {/* Preview + export */}
      <div className="fac-preview">
        <div className="fac-preview-sticky">
          <div className="fac-preview-actions">
            <button type="button" className="fac-button fac-button-primary" onClick={exportPdf}>
              Exportar PDF
            </button>
          </div>
          <ContratoPreview contrato={contrato} />
        </div>
      </div>
    </div>
  );
}
