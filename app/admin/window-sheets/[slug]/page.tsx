import Link from "next/link";

import { WindowSheetsTool } from "@/components/window-sheets/window-sheets-tool";
import { getWindowSheetData } from "@/lib/window-sheets-server";

export const dynamic = "force-dynamic";

export default async function WindowSheetEditPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { listings, sheetsById } = await getWindowSheetData();
  const match = listings.find((listing) => listing.slug === slug) ?? null;

  return (
    <div className="ws-page" lang="es">
      <header className="ws-header">
        <div>
          <p className="ws-eyebrow">Milla Homes · Herramienta interna</p>
          <h1>Fichas para escaparate</h1>
          <p>
            {match
              ? `Editando la ficha de “${match.title}”. Ajusta el diseño, los textos y las fotos.`
              : "No se encontró ese anuncio. Busca otro o empieza en modo manual."}
          </p>
        </div>
        <Link className="ws-back" href="/admin/window-sheets">
          ← Todas las fichas
        </Link>
      </header>

      <WindowSheetsTool
        listings={listings}
        sheetsById={sheetsById}
        initialSelectedId={match?.id ?? null}
      />
    </div>
  );
}
