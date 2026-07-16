import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { getAdminAuthState } from "@/lib/auth";
import { type PropertyContentTranslations } from "@/lib/property-shared";
import { translateContentToLocale } from "@/lib/property-translations";
import { createAdminClient } from "@/lib/supabase/server";

// One-off backfill: adds Ukrainian translations to properties saved before the
// uk locale existed. Safe to re-run — properties that already have uk content
// are skipped.
export async function POST() {
  const authState = await getAdminAuthState();

  if (authState.status === "unauthenticated") {
    return NextResponse.json({ error: "You must be signed in." }, { status: 401 });
  }

  if (authState.status === "unauthorized") {
    return NextResponse.json({ error: "This account is not allowed to run the backfill." }, { status: 403 });
  }

  if (authState.status === "missing-config") {
    return NextResponse.json({ error: "Admin setup is incomplete." }, { status: 500 });
  }

  const supabase = createAdminClient();

  if (!supabase) {
    return NextResponse.json({ error: "Supabase service role key is missing." }, { status: 500 });
  }

  const { data: rows, error } = await supabase
    .from("properties")
    .select("id, title, short_description, description, content_translations");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  let translated = 0;
  let skipped = 0;
  const failures: string[] = [];

  for (const row of rows ?? []) {
    const translations = (row.content_translations ?? {}) as PropertyContentTranslations;

    if (translations.uk?.title?.trim()) {
      skipped += 1;
      continue;
    }

    const sourceContent = {
      title: row.title ?? "",
      shortDescription: row.short_description ?? "",
      description: row.description ?? "",
    };

    if (!sourceContent.title.trim()) {
      skipped += 1;
      continue;
    }

    const ukContent = await translateContentToLocale(sourceContent, "uk");

    if (!ukContent) {
      failures.push(row.id);
      continue;
    }

    const { error: updateError } = await supabase
      .from("properties")
      .update({ content_translations: { ...translations, uk: ukContent } })
      .eq("id", row.id);

    if (updateError) {
      failures.push(row.id);
      continue;
    }

    translated += 1;
  }

  if (translated > 0) {
    revalidatePath("/");
    revalidatePath("/properties");
  }

  return NextResponse.json({ failures, skipped, translated });
}
