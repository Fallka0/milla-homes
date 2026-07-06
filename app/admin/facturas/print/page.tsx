"use client";

import { useEffect, useState } from "react";

import { FacturaSheet } from "@/components/facturas/factura-sheet";
import { PRINT_STORAGE_KEY, facturaFileName, type Factura } from "@/lib/facturas";

export default function FacturasPrintPage() {
  const [factura, setFactura] = useState<Factura | null | undefined>(undefined);

  // Read the export payload handed over by the tool (via localStorage), then clear it.
  useEffect(() => {
    let parsed: Factura | null = null;
    try {
      const raw = localStorage.getItem(PRINT_STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw) as { factura?: Factura };
        parsed = data.factura ?? null;
      }
    } catch {
      parsed = null;
    }
    localStorage.removeItem(PRINT_STORAGE_KEY);
    // One-time read of the export payload from localStorage on mount; this value
    // isn't available during SSR so it can't be a lazy state initializer.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFactura(parsed);

    if (parsed) {
      // Suggested filename for "Save as PDF".
      document.title = facturaFileName(parsed.number);
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
        {factura === undefined ? null : factura === null ? (
          <p className="fac-print-empty">
            No hay nada que imprimir. Vuelve a la herramienta y pulsa “Exportar PDF”.
          </p>
        ) : (
          <div className="fac-print-page">
            <FacturaSheet factura={factura} />
          </div>
        )}
      </div>
    </>
  );
}
