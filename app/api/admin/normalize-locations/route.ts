import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { getAdminAuthState } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/server";

// One-off cleanup: rewrites each property's free-text location ("Lomas de
// Cabo Roig, Orihuela Costa", "Centre, Torrevieja", …) to a canonical value
// from propertyLocationGroups so the region filter and region pages match.
// Safe to re-run; already-canonical locations are reported as skipped.
// Pass ?dry=1 to preview the changes without writing.

// Checked in order — specific neighbourhoods before broader towns, so a
// title like "Villa in Los Balcones, Torrevieja" lands on Los Balcones.
const SPECIFIC_RULES: Array<[string, string]> = [
  ["la zenia", "La Zenia"],
  ["cabo roig", "Cabo Roig"],
  ["punta prima", "Punta Prima"],
  ["la mata", "La Mata"],
  ["torreblanca", "Torreblanca"],
  ["los balcones", "Los Balcones"],
  ["aguas nuevas", "Aguas Nuevas"],
  ["el chaparral", "El Chaparral"],
  ["playa del cura", "Playa del Cura"],
  ["los locos", "Los Locos"],
  ["los frutales", "Los Frutales"],
  ["acequión", "Centro"],
  ["acequion", "Centro"],
  ["centro", "Centro"],
  ["centre", "Centro"],
  ["la florida", "Orihuela Costa"],
  ["las filipinas", "Orihuela Costa"],
];

const GENERIC_RULES: Array<[string, string]> = [
  ["orihuela costa", "Orihuela Costa"],
  ["guardamar", "Guardamar del Segura"],
  ["pilar de la horadada", "Pilar de la Horadada"],
  ["quesada", "Ciudad Quesada"],
  ["benijófar", "Benijófar"],
  ["benijofar", "Benijófar"],
  ["altea", "Altea"],
  ["jávea", "Jávea"],
  ["javea", "Jávea"],
  ["xàbia", "Jávea"],
  ["xabia", "Jávea"],
  ["calpe", "Calpe"],
  ["valencia", "Valencia"],
  ["torrevieja", "Torrevieja"],
];

function matchRules(text: string, rules: Array<[string, string]>) {
  const normalized = text.toLowerCase();

  return rules.find(([token]) => normalized.includes(token))?.[1] ?? null;
}

function resolveCanonicalLocation(location: string, title: string) {
  return (
    matchRules(location, SPECIFIC_RULES) ??
    matchRules(title, SPECIFIC_RULES) ??
    matchRules(location, GENERIC_RULES) ??
    matchRules(title, GENERIC_RULES)
  );
}

export async function POST(request: Request) {
  const authState = await getAdminAuthState();

  if (authState.status === "unauthenticated") {
    return NextResponse.json({ error: "You must be signed in." }, { status: 401 });
  }

  if (authState.status === "unauthorized") {
    return NextResponse.json({ error: "This account is not allowed to run this cleanup." }, { status: 403 });
  }

  if (authState.status === "missing-config") {
    return NextResponse.json({ error: "Admin setup is incomplete." }, { status: 500 });
  }

  const supabase = createAdminClient();

  if (!supabase) {
    return NextResponse.json({ error: "Supabase service role key is missing." }, { status: 500 });
  }

  const dryRun = new URL(request.url).searchParams.get("dry") === "1";

  const { data: rows, error } = await supabase.from("properties").select("id, slug, title, location");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const changes: Array<{ slug: string; from: string; to: string }> = [];
  const unmatched: Array<{ slug: string; location: string; title: string }> = [];
  const failures: string[] = [];
  let skipped = 0;

  for (const row of rows ?? []) {
    const location = (row.location ?? "").trim();
    const title = row.title ?? "";
    const canonical = resolveCanonicalLocation(location, title);

    if (!canonical) {
      unmatched.push({ slug: row.slug, location, title });
      continue;
    }

    if (canonical === location) {
      skipped += 1;
      continue;
    }

    if (!dryRun) {
      const { error: updateError } = await supabase
        .from("properties")
        .update({ location: canonical })
        .eq("id", row.id);

      if (updateError) {
        failures.push(row.slug);
        continue;
      }
    }

    changes.push({ slug: row.slug, from: location, to: canonical });
  }

  if (!dryRun && changes.length > 0) {
    revalidatePath("/");
    revalidatePath("/properties");
  }

  return NextResponse.json({ changes, dryRun, failures, skipped, unmatched });
}
