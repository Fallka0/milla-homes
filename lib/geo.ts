// Approximate centre coordinates for each canonical location zone. Used to plot
// listings on the map without needing exact per-property coordinates — accuracy
// is neighbourhood-level, which is standard (and often deliberate) for agency
// map search. Falls back to the Torrevieja centre for anything unmatched.
export const TORREVIEJA_CENTER: [number, number] = [37.978, -0.682];

export const zoneCoordinates: Record<string, [number, number]> = {
  Centro: [37.9785, -0.6822],
  "Playa del Cura": [37.977, -0.686],
  "Los Locos": [37.986, -0.694],
  "La Mata": [38.02, -0.653],
  Torreblanca: [37.965, -0.703],
  "Los Balcones": [37.949, -0.719],
  "Aguas Nuevas": [37.955, -0.699],
  "El Chaparral": [37.945, -0.735],
  "Punta Prima": [37.938, -0.716],
  "Orihuela Costa": [37.925, -0.752],
  "La Zenia": [37.928, -0.74],
  "Cabo Roig": [37.912, -0.752],
  "Guardamar del Segura": [38.089, -0.655],
  "Pilar de la Horadada": [37.865, -0.789],
};

// Deterministic small offset so multiple listings in the same zone don't stack
// on one pixel. Derived from the id so it's stable across renders.
function jitterFromId(id: string): [number, number] {
  let hash = 0;
  for (let index = 0; index < id.length; index += 1) {
    hash = (hash * 31 + id.charCodeAt(index)) | 0;
  }
  const lat = (((hash % 1000) / 1000) - 0.5) * 0.012;
  const lng = ((((hash >> 10) % 1000) / 1000) - 0.5) * 0.012;
  return [lat, lng];
}

// Resolve a free-text/canonical location to the zone it belongs to (one of the
// zoneCoordinates keys), or null if nothing matches.
export function resolveZoneName(location: string): string | null {
  const normalized = (location ?? "").trim();
  if (!normalized) return null;
  if (zoneCoordinates[normalized]) return normalized;
  return (
    Object.keys(zoneCoordinates).find((zone) =>
      normalized.toLowerCase().includes(zone.toLowerCase()),
    ) ?? null
  );
}

// Group listings into zone buckets with counts and centre coordinates.
export function groupByZone<T extends { location: string }>(items: T[]) {
  const buckets = new Map<string, { zone: string; center: [number, number]; items: T[] }>();
  for (const item of items) {
    const zone = resolveZoneName(item.location);
    if (!zone) continue;
    const existing = buckets.get(zone);
    if (existing) {
      existing.items.push(item);
    } else {
      buckets.set(zone, { zone, center: zoneCoordinates[zone], items: [item] });
    }
  }
  return Array.from(buckets.values());
}

// Resolve a listing's map coordinates from its (canonical or free-text) location.
export function getListingCoordinates(input: { id: string; location: string }): [number, number] {
  const normalized = input.location?.trim() ?? "";
  let base: [number, number] | undefined = zoneCoordinates[normalized];

  // Free-text / legacy locations: match the first zone whose name is contained.
  if (!base) {
    const match = Object.keys(zoneCoordinates).find(
      (zone) => normalized.toLowerCase().includes(zone.toLowerCase()),
    );
    base = match ? zoneCoordinates[match] : TORREVIEJA_CENTER;
  }

  const [dLat, dLng] = jitterFromId(input.id);
  return [base[0] + dLat, base[1] + dLng];
}
