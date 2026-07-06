"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { WindowSheet } from "./window-sheet";
import {
  PRINT_STORAGE_KEY,
  WINDOW_SHEET_PRESETS,
  blankSheet,
  sheetSize,
  type SheetListItem,
  type SheetProperty,
  type WindowSheetJob,
  type WindowSheetPreset,
} from "@/lib/window-sheets";

type Props = {
  listings: SheetListItem[];
  sheetsById: Record<string, SheetProperty>;
  initialSelectedId?: string | null;
};

const clone = (sheet: SheetProperty): SheetProperty => JSON.parse(JSON.stringify(sheet));

// ---- scaled on-screen A4 preview -----------------------------------
function SheetPreview({ sheet, preset }: { sheet: SheetProperty; preset: WindowSheetPreset }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);
  const { width, height } = sheetSize(preset);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => setScale(el.clientWidth / width);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [width]);

  return (
    <div ref={wrapRef} className="ws-preview-frame" style={{ height: height * scale }}>
      <div style={{ transform: `scale(${scale})`, transformOrigin: "top left", width, height }}>
        <WindowSheet property={sheet} preset={preset} />
      </div>
    </div>
  );
}

export function WindowSheetsTool({ listings, sheetsById, initialSelectedId = null }: Props) {
  // initialSelectedId comes from the server route and never changes for this
  // mounted component, so lazy initializers preselect cleanly (no effect, no
  // cascading render). Falls back to a blank sheet when there's no match.
  const preselected = initialSelectedId && sheetsById[initialSelectedId] ? initialSelectedId : null;

  const [mode, setMode] = useState<"listing" | "manual">("listing");
  const [query, setQuery] = useState(
    () => (preselected ? listings.find((l) => l.id === preselected)?.title ?? "" : ""),
  );
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(preselected);
  const [preset, setPreset] = useState<WindowSheetPreset>("panorama");
  const [sheet, setSheet] = useState<SheetProperty>(() =>
    preselected ? clone(sheetsById[preselected]) : blankSheet(),
  );
  const [batch, setBatch] = useState<Set<string>>(new Set());
  const dragIndex = useRef<number | null>(null);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Close the picker dropdown on outside click.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setPickerOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return listings;
    return listings.filter((l) =>
      `${l.title} ${l.location} ${l.reference}`.toLowerCase().includes(q),
    );
  }, [query, listings]);

  const selectListing = (item: SheetListItem) => {
    setMode("listing");
    setSelectedId(item.id);
    setSheet(clone(sheetsById[item.id]));
    setQuery(item.title);
    setPickerOpen(false);
  };

  const startManual = () => {
    setMode("manual");
    setSelectedId(null);
    setSheet(blankSheet());
    setQuery("");
  };

  const startListing = () => {
    setMode("listing");
  };

  function setField<K extends keyof SheetProperty>(key: K, value: SheetProperty[K]) {
    setSheet((current) => ({ ...current, [key]: value }));
  }

  const setNumber = (key: "beds" | "baths" | "area", raw: string) => {
    const value = Math.max(0, Math.round(Number(raw) || 0));
    setField(key, value);
  };

  // ---- photos --------------------------------------------------------
  const reorderPhotos = (from: number, to: number) =>
    setSheet((current) => {
      const photos = [...current.photos];
      const [moved] = photos.splice(from, 1);
      photos.splice(to, 0, moved);
      return { ...current, photos };
    });

  const removePhoto = (index: number) =>
    setSheet((current) => ({ ...current, photos: current.photos.filter((_, i) => i !== index) }));

  const makeHero = (index: number) =>
    setSheet((current) => {
      if (index === 0) return current;
      const photos = [...current.photos];
      const [moved] = photos.splice(index, 1);
      photos.unshift(moved);
      return { ...current, photos };
    });

  const addFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const urls = Array.from(files).map((file) => URL.createObjectURL(file));
    setSheet((current) => ({ ...current, photos: [...current.photos, ...urls] }));
  };

  // ---- export --------------------------------------------------------
  const openPrint = (jobs: WindowSheetJob[]) => {
    if (jobs.length === 0) return;
    localStorage.setItem(PRINT_STORAGE_KEY, JSON.stringify({ jobs }));
    window.open("/admin/window-sheets/print", "_blank");
  };

  const exportSingle = () => {
    const slug = selectedId
      ? listings.find((l) => l.id === selectedId)?.slug ?? "ficha"
      : "ficha-manual";
    openPrint([{ slug, preset, sheet }]);
  };

  const toggleBatch = (id: string) =>
    setBatch((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const toggleBatchAll = () =>
    setBatch((current) => (current.size === listings.length ? new Set() : new Set(listings.map((l) => l.id))));

  const exportBatch = () => {
    const jobs: WindowSheetJob[] = listings
      .filter((l) => batch.has(l.id))
      .map((l) => ({ slug: l.slug, preset, sheet: sheetsById[l.id] }));
    openPrint(jobs);
  };

  return (
    <div className="ws-tool">
      <div className="ws-controls">
        {/* Mode toggle */}
        <div className="ws-card">
          <div className="ws-segmented" role="tablist" aria-label="Modo">
            <button
              type="button"
              className={mode === "listing" ? "is-active" : ""}
              onClick={startListing}
            >
              Desde un anuncio
            </button>
            <button
              type="button"
              className={mode === "manual" ? "is-active" : ""}
              onClick={startManual}
            >
              Manual
            </button>
          </div>

          {mode === "listing" ? (
            <div className="ws-field" ref={pickerRef}>
              <label htmlFor="ws-search">Buscar anuncio</label>
              <div className="ws-combobox">
                <input
                  id="ws-search"
                  type="text"
                  autoComplete="off"
                  placeholder="Escribe título, zona o referencia…"
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setPickerOpen(true);
                  }}
                  onFocus={() => setPickerOpen(true)}
                />
                {pickerOpen ? (
                  <ul className="ws-combobox-list">
                    {filtered.length === 0 ? (
                      <li className="ws-combobox-empty">Sin resultados</li>
                    ) : (
                      filtered.map((item) => (
                        <li key={item.id}>
                          <button type="button" onClick={() => selectListing(item)}>
                            <strong>{item.title}</strong>
                            <span>
                              {item.location} · {item.reference}
                            </span>
                          </button>
                        </li>
                      ))
                    )}
                  </ul>
                ) : null}
              </div>
              <p className="ws-hint">
                Selecciona un anuncio y la ficha se rellena sola. Puedes ajustar el texto y las fotos
                más abajo.
              </p>
            </div>
          ) : (
            <p className="ws-hint">
              Modo manual: rellena los campos y añade fotos para una ficha puntual (las fotos
              subidas se usan solo para esta impresión).
            </p>
          )}
        </div>

        {/* Preset */}
        <div className="ws-card">
          <h3 className="ws-card-title">Diseño</h3>
          <div className="ws-segmented ws-segmented-presets" role="tablist" aria-label="Diseño">
            {WINDOW_SHEET_PRESETS.map((option) => (
              <button
                key={option.id}
                type="button"
                className={preset === option.id ? "is-active" : ""}
                onClick={() => setPreset(option.id)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Text fields */}
        <div className="ws-card">
          <h3 className="ws-card-title">Textos</h3>

          <div className="ws-grid-2">
            <div className="ws-field">
              <label htmlFor="ws-status">Estado</label>
              <input
                id="ws-status"
                list="ws-status-options"
                value={sheet.status}
                onChange={(event) => setField("status", event.target.value)}
              />
              <datalist id="ws-status-options">
                <option value="En venta" />
                <option value="En alquiler" />
              </datalist>
            </div>
            <div className="ws-field">
              <label htmlFor="ws-location">Zona</label>
              <input
                id="ws-location"
                value={sheet.location}
                onChange={(event) => setField("location", event.target.value)}
                placeholder="Punta Prima · Torrevieja"
              />
            </div>
          </div>

          <div className="ws-field">
            <label htmlFor="ws-title">Título</label>
            <input
              id="ws-title"
              value={sheet.title}
              onChange={(event) => setField("title", event.target.value)}
            />
          </div>

          <div className="ws-grid-2">
            <div className="ws-field">
              <label htmlFor="ws-price">Precio</label>
              <input
                id="ws-price"
                value={sheet.price}
                onChange={(event) => setField("price", event.target.value)}
                placeholder="240.000 €"
              />
            </div>
            <div className="ws-grid-3">
              <div className="ws-field">
                <label htmlFor="ws-beds">Dorm.</label>
                <input
                  id="ws-beds"
                  type="number"
                  min={0}
                  value={sheet.beds}
                  onChange={(event) => setNumber("beds", event.target.value)}
                />
              </div>
              <div className="ws-field">
                <label htmlFor="ws-baths">Baños</label>
                <input
                  id="ws-baths"
                  type="number"
                  min={0}
                  value={sheet.baths}
                  onChange={(event) => setNumber("baths", event.target.value)}
                />
              </div>
              <div className="ws-field">
                <label htmlFor="ws-area">m²</label>
                <input
                  id="ws-area"
                  type="number"
                  min={0}
                  value={sheet.area}
                  onChange={(event) => setNumber("area", event.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="ws-field">
            <label htmlFor="ws-desc">Descripción</label>
            <textarea
              id="ws-desc"
              rows={4}
              value={sheet.desc}
              onChange={(event) => setField("desc", event.target.value)}
            />
          </div>

          <div className="ws-grid-2">
            <div className="ws-field">
              <label htmlFor="ws-phone">Teléfono</label>
              <input
                id="ws-phone"
                value={sheet.phone}
                onChange={(event) => setField("phone", event.target.value)}
              />
            </div>
            <div className="ws-field">
              <label htmlFor="ws-web">Web</label>
              <input
                id="ws-web"
                value={sheet.web}
                onChange={(event) => setField("web", event.target.value)}
              />
            </div>
          </div>

          <div className="ws-field">
            <label htmlFor="ws-url">Enlace de la ficha (QR)</label>
            <input
              id="ws-url"
              value={sheet.listingUrl}
              onChange={(event) => setField("listingUrl", event.target.value)}
              placeholder="https://milla-homes.com/properties/…"
            />
          </div>
        </div>

        {/* Photos */}
        <div className="ws-card">
          <h3 className="ws-card-title">Fotos</h3>
          <p className="ws-hint">
            Arrastra para reordenar. La primera foto es la principal (hero). Usa “Principal” para
            moverla al frente.
          </p>

          {sheet.photos.length === 0 ? (
            <p className="ws-hint">Aún no hay fotos.</p>
          ) : (
            <ul className="ws-photo-grid">
              {sheet.photos.map((url, index) => (
                <li
                  key={`${url}-${index}`}
                  className="ws-photo"
                  draggable
                  onDragStart={() => {
                    dragIndex.current = index;
                  }}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={() => {
                    const from = dragIndex.current;
                    if (from !== null && from !== index) reorderPhotos(from, index);
                    dragIndex.current = null;
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" />
                  {index === 0 ? <span className="ws-photo-badge">Principal</span> : null}
                  <div className="ws-photo-actions">
                    {index !== 0 ? (
                      <button type="button" onClick={() => makeHero(index)} title="Hacer principal">
                        ★
                      </button>
                    ) : null}
                    <button type="button" onClick={() => removePhoto(index)} title="Quitar">
                      ✕
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <label className="ws-upload">
            Añadir fotos
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(event) => {
                addFiles(event.target.files);
                event.target.value = "";
              }}
            />
          </label>
        </div>

        {/* Batch */}
        {listings.length > 0 ? (
          <div className="ws-card">
            <h3 className="ws-card-title">Exportar en lote</h3>
            <p className="ws-hint">
              Marca varios anuncios para generar un único PDF con una página A4 por anuncio, usando
              el diseño seleccionado arriba.
            </p>
            <div className="ws-batch-head">
              <button type="button" className="ws-link" onClick={toggleBatchAll}>
                {batch.size === listings.length ? "Quitar todo" : "Seleccionar todo"}
              </button>
              <span>{batch.size} seleccionados</span>
            </div>
            <ul className="ws-batch-list">
              {listings.map((item) => (
                <li key={item.id}>
                  <label>
                    <input
                      type="checkbox"
                      checked={batch.has(item.id)}
                      onChange={() => toggleBatch(item.id)}
                    />
                    <span>
                      <strong>{item.title}</strong>
                      <em>
                        {item.location} · {item.reference}
                      </em>
                    </span>
                  </label>
                </li>
              ))}
            </ul>
            <button
              type="button"
              className="ws-button ws-button-secondary"
              disabled={batch.size === 0}
              onClick={exportBatch}
            >
              Exportar lote (PDF)
            </button>
          </div>
        ) : null}
      </div>

      {/* Preview + primary export */}
      <div className="ws-preview">
        <div className="ws-preview-sticky">
          <div className="ws-preview-actions">
            <button type="button" className="ws-button ws-button-primary" onClick={exportSingle}>
              Exportar PDF
            </button>
          </div>
          <SheetPreview sheet={sheet} preset={preset} />
        </div>
      </div>
    </div>
  );
}
