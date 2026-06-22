"use client";

/* eslint-disable @next/next/no-img-element -- fixed-size A4 sheet rendered at
   natural pixels for print; next/image would break the scale/print pipeline. */

/*
  WindowSheet.tsx — Milla Homes printable A4 "window sheet".

  Ported from the provided reference/WindowSheet.jsx. The visual design (layout,
  inline styles, SVG spec icons, brand tokens, three presets) is preserved
  exactly. Repo-specific integration changes only:
    - typed for TypeScript + the SheetProperty shape
    - QR uses `import qrcode from "qrcode-generator"` instead of the window.qrcode UMD global
    - logoLight default points at the cream-tinted logo we generate in /public/logos

  Sizing: each sheet is 794 × 1123 px = 210 × 297 mm at 96dpi (A4). For PDF/print
  render at natural size with `@page { size: A4; margin: 0 }`. For preview, wrap in
  a scaled container.

  Fonts: "Cormorant Garamond" + "Mulish" must be registered (self-hosted via
  @fontsource, imported in the window-sheets layout — Google Fonts is blocked by CSP).
*/
import React, { useEffect, useRef } from "react";

import qrcode from "qrcode-generator";

import type { SheetProperty, WindowSheetPreset } from "@/lib/window-sheets";

// ---- brand tokens -------------------------------------------------
const C = {
  cream: "#f5f0e6",
  surface: "#faf5ea",
  surfaceStrong: "#fcf8f0",
  deep: "#1b4530",
  text: "#123524",
  muted: "#4d6659",
  gold: "#d4b26a",
  goldInk: "#b08a3e", // darker gold for small text on cream
  border: "rgba(18,53,36,0.12)",
};
const SERIF = "'Cormorant Garamond', serif";
const SANS = "'Mulish', sans-serif";
const SHEET_W = 794;
const SHEET_H = 1123;

// ---- QR ------------------------------------------------------------
function useQR(url: string, color: string) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const qr = qrcode(0, "M");
    qr.addData(url || "");
    qr.make();
    const n = qr.getModuleCount();
    let cells = "";
    for (let r = 0; r < n; r++)
      for (let c = 0; c < n; c++)
        if (qr.isDark(r, c)) cells += `<rect x="${c}" y="${r}" width="1.04" height="1.04"></rect>`;
    ref.current.innerHTML = `<svg viewBox="0 0 ${n} ${n}" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" shape-rendering="crispEdges" fill="${color}">${cells}</svg>`;
  }, [url, color]);
  return ref;
}

// ---- icons ---------------------------------------------------------
const ic = (size: number, sw: number) =>
  ({
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    strokeWidth: sw,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  }) as React.SVGProps<SVGSVGElement>;

function IconBed({ size = 22, stroke = C.goldInk }: { size?: number; stroke?: string }) {
  return (
    <svg {...ic(size, 1.4)} stroke={stroke}>
      <path d="M2 17v-4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4" />
      <path d="M2 17h20" />
      <path d="M2 17v3M22 17v3" />
      <path d="M5 11V8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3" />
    </svg>
  );
}
function IconBath({ size = 22, stroke = C.goldInk }: { size?: number; stroke?: string }) {
  return (
    <svg {...ic(size, 1.4)} stroke={stroke}>
      <path d="M5 12V6.5a2.5 2.5 0 0 1 5 0" />
      <path d="M3 12h18v2a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5z" />
      <path d="M7 19l-1.5 2M17 19l1.5 2" />
    </svg>
  );
}
function IconArea({ size = 22, stroke = C.goldInk }: { size?: number; stroke?: string }) {
  return (
    <svg {...ic(size, 1.4)} stroke={stroke}>
      <path d="M3 8V3h5" />
      <path d="M21 8V3h-5" />
      <path d="M3 16v5h5" />
      <path d="M21 16v5h-5" />
    </svg>
  );
}
function IconPhone({ size = 15, stroke = C.goldInk }: { size?: number; stroke?: string }) {
  return (
    <svg {...ic(size, 1.6)} stroke={stroke}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}
function IconGlobe({ size = 15, stroke = C.goldInk }: { size?: number; stroke?: string }) {
  return (
    <svg {...ic(size, 1.6)} stroke={stroke}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
    </svg>
  );
}

// ---- helpers -------------------------------------------------------
const nb = (s: string) => (s || "").replace(/\s+/g, " "); // keep price on one line
const up = (s: string) => (s || "").toUpperCase();
const img: React.CSSProperties = { width: "100%", height: "100%", objectFit: "cover", display: "block" };

// ================================================================
//  PRESET 1 — PÓSTER SERENO (minimal / editorial)
// ================================================================
function Poster({ p, logoDark }: { p: SheetProperty; logoDark: string }) {
  const photos = p.photos || [];
  const qr = useQR(p.listingUrl, C.text);
  return (
    <div style={{ width: SHEET_W, height: SHEET_H, background: C.cream, padding: "56px 56px 48px", display: "flex", flexDirection: "column", fontFamily: SANS, color: C.text, boxSizing: "border-box" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <img src={logoDark} alt="Milla Homes" style={{ height: 78, width: "auto", display: "block" }} />
        <div style={{ width: 64, height: 2, background: C.gold, marginTop: 18 }} />
      </div>

      <div style={{ marginTop: 34, height: 392, borderRadius: 3, overflow: "hidden", boxShadow: `0 1px 0 ${C.border}` }}>
        <img src={photos[0]} alt="" style={img} />
      </div>

      <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginTop: 30 }}>
        <div style={{ fontSize: 12, letterSpacing: 3, textTransform: "uppercase", color: C.goldInk, fontWeight: 700 }}>{p.location}</div>
        <div style={{ flex: 1, height: 1, background: C.border }} />
        <div style={{ fontSize: 11, letterSpacing: 2.5, textTransform: "uppercase", color: C.muted, fontWeight: 700 }}>{up(p.status)}</div>
      </div>

      <div style={{ fontFamily: SERIF, fontSize: 35, lineHeight: 1.12, color: C.text, fontWeight: 600, marginTop: 12 }}>{p.title}</div>

      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginTop: 20 }}>
        <div style={{ fontFamily: SERIF, fontSize: 46, fontWeight: 700, color: C.text, lineHeight: 1, whiteSpace: "nowrap" }}>{nb(p.price)}</div>
        <div style={{ display: "flex", gap: 26, color: C.text }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 16, fontWeight: 600 }}><IconBed /><span>{p.beds}</span></div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 16, fontWeight: 600 }}><IconBath /><span>{p.baths}</span></div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 16, fontWeight: 600 }}><IconArea /><span>{p.area} m²</span></div>
        </div>
      </div>

      <div style={{ fontSize: 15, lineHeight: 1.65, color: C.muted, marginTop: 22 }}>{p.desc}</div>

      <div style={{ flex: 1 }} />

      <div style={{ height: 1, background: C.border, marginBottom: 22 }} />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: C.text, fontSize: 15, fontWeight: 700 }}>
            <IconPhone /><span>{p.phone}</span><span style={{ color: C.goldInk }}>· WhatsApp</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: C.muted, fontSize: 15, fontWeight: 600 }}>
            <IconGlobe /><span>{p.web}</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ textAlign: "right", maxWidth: 130 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.text, lineHeight: 1.3 }}>Escanea para ver la ficha completa</div>
            <div style={{ fontSize: 11, color: "#8a857c", marginTop: 2 }}>Fotos e información</div>
          </div>
          <div ref={qr} style={{ width: 96, height: 96, flex: "none" }} />
        </div>
      </div>
    </div>
  );
}

// ================================================================
//  PRESET 2 — GALERÍA (classic agency, multi-photo)
// ================================================================
function Gallery({ p, logoLight }: { p: SheetProperty; logoLight: string }) {
  const photos = p.photos || [];
  const qr = useQR(p.listingUrl, C.text);
  const chip: React.CSSProperties = { display: "flex", alignItems: "center", gap: 9, background: C.surfaceStrong, border: `1px solid ${C.border}`, borderRadius: 3, padding: "11px 16px", color: C.text, fontSize: 15, fontWeight: 700 };
  const chipLabel: React.CSSProperties = { fontWeight: 500, color: C.muted };
  return (
    <div style={{ width: SHEET_W, height: SHEET_H, background: C.cream, display: "flex", flexDirection: "column", fontFamily: SANS, color: C.text, boxSizing: "border-box" }}>
      <div style={{ background: C.deep, padding: "26px 44px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <img src={logoLight} alt="Milla Homes" style={{ height: 54, width: "auto", display: "block" }} />
        <div style={{ textAlign: "right" }}>
          <div style={{ display: "inline-block", fontSize: 11, letterSpacing: 2.5, textTransform: "uppercase", color: C.deep, fontWeight: 700, background: C.gold, padding: "4px 12px", borderRadius: 2 }}>{up(p.status)}</div>
          <div style={{ fontFamily: SERIF, fontSize: 38, fontWeight: 700, color: C.surfaceStrong, lineHeight: 1.05, marginTop: 8, whiteSpace: "nowrap" }}>{nb(p.price)}</div>
        </div>
      </div>

      <div style={{ padding: 6, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gridTemplateRows: "300px 132px", gap: 6 }}>
        <div style={{ gridColumn: "1 / 4", overflow: "hidden" }}><img src={photos[0]} alt="" style={img} /></div>
        <div style={{ overflow: "hidden" }}><img src={photos[1]} alt="" style={img} /></div>
        <div style={{ overflow: "hidden" }}><img src={photos[2]} alt="" style={img} /></div>
        <div style={{ overflow: "hidden" }}><img src={photos[3]} alt="" style={img} /></div>
      </div>

      <div style={{ padding: "26px 44px 0", display: "flex", flexDirection: "column", flex: 1 }}>
        <div style={{ fontSize: 12, letterSpacing: 3, textTransform: "uppercase", color: C.goldInk, fontWeight: 700 }}>{p.location}</div>
        <div style={{ fontFamily: SERIF, fontSize: 31, lineHeight: 1.12, color: C.text, fontWeight: 600, marginTop: 6 }}>{p.title}</div>
        <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
          <div style={chip}><IconBed size={20} /><span>{p.beds} <span style={chipLabel}>dorm.</span></span></div>
          <div style={chip}><IconBath size={20} /><span>{p.baths} <span style={chipLabel}>baños</span></span></div>
          <div style={chip}><IconArea size={20} /><span>{p.area} <span style={chipLabel}>m²</span></span></div>
        </div>
        <div style={{ fontSize: 15, lineHeight: 1.65, color: C.muted, marginTop: 20 }}>{p.desc}</div>
      </div>

      <div style={{ background: C.surfaceStrong, borderTop: `1px solid ${C.border}`, padding: "20px 44px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div ref={qr} style={{ width: 84, height: 84, flex: "none" }} />
          <div style={{ maxWidth: 150 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.text, lineHeight: 1.3 }}>Escanea para ver más fotos</div>
            <div style={{ fontSize: 12, color: "#8a857c", marginTop: 2 }}>Ficha completa online</div>
          </div>
        </div>
        <div style={{ textAlign: "right", display: "flex", flexDirection: "column", gap: 7 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8, color: C.text, fontSize: 15, fontWeight: 700 }}><span>{p.phone}</span><IconPhone /></div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8, color: C.muted, fontSize: 14, fontWeight: 600 }}><span>WhatsApp · {p.web}</span><IconGlobe /></div>
        </div>
      </div>
    </div>
  );
}

// ================================================================
//  PRESET 3 — BOUTIQUE ENMARCADA (premium / centered, gold frame)
// ================================================================
function Boutique({ p, logoDark }: { p: SheetProperty; logoDark: string }) {
  const photos = p.photos || [];
  const qr = useQR(p.listingUrl, C.text);
  const divider = <div style={{ width: 1, height: 22, background: "rgba(18,53,36,.18)" }} />;
  const spec: React.CSSProperties = { display: "flex", alignItems: "center", gap: 8, fontSize: 15, fontWeight: 600, padding: "0 22px" };
  return (
    <div style={{ position: "relative", width: SHEET_W, height: SHEET_H, background: C.cream, fontFamily: SANS, color: C.text, boxSizing: "border-box" }}>
      <div style={{ position: "absolute", inset: 16, border: `1.5px solid rgba(212,178,106,.9)`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: 22, border: `1px solid rgba(212,178,106,.4)`, pointerEvents: "none" }} />

      <div style={{ position: "relative", height: "100%", padding: "50px 54px 46px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", boxSizing: "border-box" }}>
        <img src={logoDark} alt="Milla Homes" style={{ height: 66, width: "auto", display: "block" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 16 }}>
          <div style={{ width: 30, height: 1, background: C.gold }} />
          <div style={{ fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: C.goldInk, fontWeight: 700 }}>{up(p.status)}</div>
          <div style={{ width: 30, height: 1, background: C.gold }} />
        </div>

        <div style={{ marginTop: 24, width: "100%", height: 372, padding: 7, background: "#fff", border: `1px solid rgba(212,178,106,.55)`, overflow: "hidden", boxSizing: "border-box" }}>
          <img src={photos[0]} alt="" style={img} />
        </div>

        <div style={{ fontSize: 12, letterSpacing: 3, textTransform: "uppercase", color: C.goldInk, fontWeight: 700, marginTop: 26 }}>{p.location}</div>
        <div style={{ fontFamily: SERIF, fontSize: 32, lineHeight: 1.14, color: C.text, fontWeight: 600, marginTop: 8, maxWidth: 560 }}>{p.title}</div>

        <div style={{ fontFamily: SERIF, fontSize: 44, fontWeight: 700, color: C.text, marginTop: 18, padding: "4px 30px", borderTop: `1px solid rgba(212,178,106,.6)`, borderBottom: `1px solid rgba(212,178,106,.6)`, lineHeight: 1.25, whiteSpace: "nowrap" }}>{nb(p.price)}</div>

        <div style={{ display: "flex", alignItems: "center", marginTop: 22, color: C.text }}>
          <div style={spec}><IconBed size={20} /><span>{p.beds} dorm.</span></div>
          {divider}
          <div style={spec}><IconBath size={20} /><span>{p.baths} baños</span></div>
          {divider}
          <div style={spec}><IconArea size={20} /><span>{p.area} m²</span></div>
        </div>

        <div style={{ fontSize: 14, lineHeight: 1.6, color: C.muted, marginTop: 18, maxWidth: 540 }}>{p.desc}</div>

        <div style={{ flex: 1 }} />

        <div style={{ width: "100%", background: C.deep, borderRadius: 3, padding: "18px 26px", display: "flex", alignItems: "center", justifyContent: "space-between", boxSizing: "border-box" }}>
          <div style={{ textAlign: "left" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: C.surfaceStrong, fontSize: 16, fontWeight: 700 }}><IconPhone stroke={C.gold} /><span>{p.phone}</span></div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#cdd8d0", fontSize: 14, fontWeight: 600, marginTop: 8 }}><IconGlobe stroke={C.gold} /><span>WhatsApp · {p.web}</span></div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ textAlign: "right", maxWidth: 120, color: "#cdd8d0", fontSize: 12, fontWeight: 600, lineHeight: 1.35 }}>Escanea para ver la ficha completa</div>
            <div style={{ background: C.surfaceStrong, padding: 6, borderRadius: 2 }}><div ref={qr} style={{ width: 78, height: 78 }} /></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ================================================================
export const SHEET_WIDTH = SHEET_W;
export const SHEET_HEIGHT = SHEET_H;

export const PRESETS: { id: WindowSheetPreset; label: string }[] = [
  { id: "poster", label: "Póster sereno" },
  { id: "gallery", label: "Galería" },
  { id: "boutique", label: "Boutique enmarcada" },
];

export function WindowSheet({
  property,
  preset = "poster",
  logoDark = "/logos/mh-logo.png",
  logoLight = "/logos/mh-logo-cream.png",
}: {
  property: SheetProperty | null;
  preset?: WindowSheetPreset;
  logoDark?: string;
  logoLight?: string;
}) {
  if (!property) return null;
  if (preset === "gallery") return <Gallery p={property} logoLight={logoLight} />;
  if (preset === "boutique") return <Boutique p={property} logoDark={logoDark} />;
  return <Poster p={property} logoDark={logoDark} />;
}

export default WindowSheet;
