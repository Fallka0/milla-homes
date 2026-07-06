import Link from "next/link";

import { FacturasTool } from "@/components/facturas/facturas-tool";

export const dynamic = "force-dynamic";

export default function FacturasPage() {
  return (
    <div className="fac-page" lang="es">
      <header className="fac-header">
        <div>
          <p className="fac-eyebrow">Milla Homes · Herramienta interna</p>
          <h1>Facturas de comisión</h1>
          <p>
            Rellena el número, la fecha, el cliente y el importe; el IVA (21%) y los datos de
            Svitlana se añaden solos. Exporta un PDF A4 listo para enviar.
          </p>
        </div>
        <Link className="fac-back" href="/admin">
          ← Volver al panel
        </Link>
      </header>

      <FacturasTool />
    </div>
  );
}
