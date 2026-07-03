"use client";

import { useEffect, useRef } from "react";

import { TORREVIEJA_CENTER, zonesWithCounts } from "@/lib/geo";
import { type PropertyRecord } from "@/lib/property-shared";

import "leaflet/dist/leaflet.css";

type PropertyMapProps = {
  properties: PropertyRecord[];
  // Called when a zone with listings is clicked, so the page can filter to it.
  onSelectZone: (zone: string) => void;
};

export function PropertyMap({ properties, onSelectZone }: PropertyMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const layerRef = useRef<import("leaflet").LayerGroup | null>(null);
  const onSelectRef = useRef(onSelectZone);
  useEffect(() => {
    onSelectRef.current = onSelectZone;
  }, [onSelectZone]);

  useEffect(() => {
    let cancelled = false;

    import("leaflet").then((L) => {
      if (cancelled || !containerRef.current) return;

      if (!mapRef.current) {
        mapRef.current = L.map(containerRef.current, {
          center: TORREVIEJA_CENTER,
          zoom: 11,
          scrollWheelZoom: false,
        });
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "&copy; OpenStreetMap contributors",
          maxZoom: 18,
        }).addTo(mapRef.current);
        layerRef.current = L.layerGroup().addTo(mapRef.current);
      }

      const map = mapRef.current;
      const layer = layerRef.current;
      if (!map || !layer) return;
      layer.clearLayers();

      // Only zones that actually hold listings — keeps the map calm.
      const zones = zonesWithCounts(properties).filter(({ count }) => count > 0);
      const bounds: [number, number][] = [];

      for (const { zone, center, count } of zones) {
        bounds.push(center);

        // A readable pill label: zone name + count, never obscured.
        const icon = L.divIcon({
          className: "map-zone-pill-wrap",
          html: `<button type="button" class="map-zone-pill"><span>${escapeHtml(zone)}</span><b>${count}</b></button>`,
          iconSize: undefined,
        });

        const marker = L.marker(center, { icon, keyboard: false });
        marker.on("click", () => onSelectRef.current(zone));
        marker.addTo(layer);
      }

      if (bounds.length > 0) {
        map.fitBounds(bounds, { padding: [70, 70], maxZoom: 13 });
      } else {
        map.setView(TORREVIEJA_CENTER, 11);
      }
      map.invalidateSize();
    });

    return () => {
      cancelled = true;
    };
  }, [properties]);

  useEffect(() => {
    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
      layerRef.current = null;
    };
  }, []);

  return <div className="property-map" ref={containerRef} role="application" aria-label="Map" />;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
