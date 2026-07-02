"use client";

import { useEffect, useRef } from "react";

import { groupByZone, TORREVIEJA_CENTER } from "@/lib/geo";
import { type PropertyRecord } from "@/lib/property-shared";

import "leaflet/dist/leaflet.css";

type PropertyMapProps = {
  properties: PropertyRecord[];
  // Called when a zone bubble is clicked, so the page can filter to that zone.
  onSelectZone: (zone: string) => void;
};

export function PropertyMap({ properties, onSelectZone }: PropertyMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const layerRef = useRef<import("leaflet").LayerGroup | null>(null);
  // Keep the latest callback without re-running the whole effect.
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

      const zones = groupByZone(properties);
      const bounds: [number, number][] = [];

      for (const { zone, center, items } of zones) {
        bounds.push(center);
        const count = items.length;
        // Radius grows with count but stays within a sensible range.
        const radius = Math.min(34, 16 + count * 3);

        const base = { color: "#1b4530", weight: 2, fillColor: "#1b4530", fillOpacity: 0.55 };
        const hover = { fillColor: "#d4b26a", fillOpacity: 0.85 };

        const marker = L.circleMarker(center, { ...base, radius });
        // Permanent count on the bubble; label shows zone + count on hover.
        marker.bindTooltip(String(count), {
          permanent: true,
          direction: "center",
          className: "map-zone-count",
        });

        marker.on("mouseover", () => {
          marker.setStyle(hover);
          marker.setTooltipContent(zone);
        });
        marker.on("mouseout", () => {
          marker.setStyle(base);
          marker.setTooltipContent(String(count));
        });
        marker.on("click", () => onSelectRef.current(zone));
        marker.addTo(layer);
      }

      if (bounds.length > 0) {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 });
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
