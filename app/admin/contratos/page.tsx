import Link from "next/link";

import { ContratosTool } from "@/components/contratos/contratos-tool";

export const dynamic = "force-dynamic";

export default function ContratosPage() {
  return (
    <div className="fac-page" lang="es">
      <header className="fac-header">
        <div>
          <p className="fac-eyebrow">Milla Homes · Herramienta interna</p>
          <h1>Contratos</h1>
          <p>
            Alquiler de temporada, alquiler de vivienda, reserva o arras: elige el tipo, rellena
            las partes y los importes, y exporta un PDF A4 listo para firmar.
          </p>
        </div>
        <Link className="fac-back" href="/admin">
          ← Volver al panel
        </Link>
      </header>

      <ContratosTool />
    </div>
  );
}
