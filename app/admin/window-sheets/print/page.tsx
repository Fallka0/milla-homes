"use client";

import { useEffect, useRef, useState } from "react";

import { WindowSheet } from "@/components/window-sheets/window-sheet";
import { PRINT_STORAGE_KEY, sheetFileName, type WindowSheetJob } from "@/lib/window-sheets";

export default function WindowSheetsPrintPage() {
  const [jobs, setJobs] = useState<WindowSheetJob[] | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  // Read the export payload handed over by the tool (via localStorage), then clear it.
  useEffect(() => {
    let parsed: WindowSheetJob[] = [];
    try {
      const raw = localStorage.getItem(PRINT_STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw) as { jobs?: WindowSheetJob[] };
        parsed = Array.isArray(data.jobs) ? data.jobs : [];
      }
    } catch {
      parsed = [];
    }
    localStorage.removeItem(PRINT_STORAGE_KEY);
    // One-time read of the export payload from localStorage on mount; this value
    // isn't available during SSR so it can't be a lazy state initializer.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setJobs(parsed);

    // Suggested filename for "Save as PDF": single sheet gets the per-sheet name.
    if (parsed.length === 1) {
      document.title = sheetFileName(parsed[0].slug, parsed[0].preset);
    } else if (parsed.length > 1) {
      document.title = "milla-homes-fichas";
    }
  }, []);

  // Wait for QR + all images before opening the print dialog so the PDF is complete.
  useEffect(() => {
    if (!jobs || jobs.length === 0) return;
    const stage = stageRef.current;
    if (!stage) return;

    const images = Array.from(stage.querySelectorAll("img"));
    const waitFor = (image: HTMLImageElement) =>
      image.complete
        ? Promise.resolve()
        : new Promise<void>((resolve) => {
            image.addEventListener("load", () => resolve(), { once: true });
            image.addEventListener("error", () => resolve(), { once: true });
          });

    let cancelled = false;
    Promise.all(images.map(waitFor)).then(() => {
      if (cancelled) return;
      // Small delay lets the injected QR SVG paint before printing.
      window.setTimeout(() => window.print(), 200);
    });

    return () => {
      cancelled = true;
    };
  }, [jobs]);

  // Batch export always uses a single preset, so the whole document shares one
  // orientation: landscape for "panorama", portrait for the rest. This @page
  // override wins over the base rule in window-sheets.css.
  const landscape = jobs !== null && jobs.length > 0 && jobs[0].preset === "panorama";

  return (
    <>
      {landscape ? <style>{"@media print { @page { size: A4 landscape; } }"}</style> : null}
      <div className="ws-print-toolbar">
        <span>Vista de impresión · usa “Guardar como PDF” en el diálogo</span>
        <button type="button" onClick={() => window.print()}>
          Imprimir / Guardar PDF
        </button>
      </div>

      <div className="ws-print-stage" ref={stageRef}>
        {jobs === null ? null : jobs.length === 0 ? (
          <p className="ws-print-empty">
            No hay nada que imprimir. Vuelve a la herramienta y pulsa “Exportar PDF”.
          </p>
        ) : (
          jobs.map((job, index) => (
            <div className="ws-print-page" key={`${job.slug}-${index}`}>
              <WindowSheet property={job.sheet} preset={job.preset} />
            </div>
          ))
        )}
      </div>
    </>
  );
}
