import Link from "next/link";

import { WindowSheetsTool } from "@/components/window-sheets/window-sheets-tool";
import { getWindowSheetData } from "@/lib/window-sheets-server";

export const dynamic = "force-dynamic";

export default async function WindowSheetsPage() {
  const { listings, sheetsById } = await getWindowSheetData();

  return (
    <div className="ws-page" lang="es">
      <header className="ws-header">
        <div>
          <p className="ws-eyebrow">Milla Homes · Herramienta interna</p>
          <h1>Fichas para escaparate</h1>
          <p>
            Elige un anuncio, ajusta el diseño y exporta una ficha A4 lista para imprimir y colocar
            en el escaparate.
          </p>
        </div>
        <Link className="ws-back" href="/admin">
          ← Volver al panel
        </Link>
      </header>

      <WindowSheetsTool listings={listings} sheetsById={sheetsById} />
    </div>
  );
}
