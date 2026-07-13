"use client";

import { useEffect, useState } from "react";

import { ContratoSheet } from "@/components/contratos/contrato-sheet";
import { CONTRATO_PRINT_STORAGE_KEY, contratoFileName, type Contrato } from "@/lib/contratos";

export default function ContratosPrintPage() {
  const [contrato, setContrato] = useState<Contrato | null | undefined>(undefined);

  // Read the export payload handed over by the tool (via localStorage), then clear it.
  useEffect(() => {
    let parsed: Contrato | null = null;
    try {
      const raw = localStorage.getItem(CONTRATO_PRINT_STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw) as { contrato?: Contrato };
        parsed = data.contrato ?? null;
      }
    } catch {
      parsed = null;
    }
    localStorage.removeItem(CONTRATO_PRINT_STORAGE_KEY);
    // One-time read of the export payload from localStorage on mount; this value
    // isn't available during SSR so it can't be a lazy state initializer.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setContrato(parsed);

    if (parsed) {
      // Suggested filename for "Save as PDF".
      document.title = contratoFileName(parsed);
      // No images to wait for — a short delay lets fonts settle before printing.
      const timer = window.setTimeout(() => window.print(), 300);
      return () => window.clearTimeout(timer);
    }
  }, []);

  return (
    <>
      <div className="fac-print-toolbar">
        <span>Vista de impresión · usa “Guardar como PDF” en el diálogo</span>
        <button type="button" onClick={() => window.print()}>
          Imprimir / Guardar PDF
        </button>
      </div>

      <div className="fac-print-stage">
        {contrato === undefined ? null : contrato === null ? (
          <p className="fac-print-empty">
            No hay nada que imprimir. Vuelve a la herramienta y pulsa “Exportar PDF”.
          </p>
        ) : (
          ["es" as const, ...(contrato.extraLanguages ?? [])].map((lang) => (
            <div className="con-print-page" key={lang}>
              <ContratoSheet contrato={contrato} locale={lang} />
            </div>
          ))
        )}
      </div>
    </>
  );
}
