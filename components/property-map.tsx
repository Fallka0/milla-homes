"use client";

import { useEffect, useRef } from "react";

import { TORREVIEJA_CENTER, zonesWithCounts } from "@/lib/geo";
import { zoneShapes } from "@/lib/zone-shapes";
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

      const zones = zonesWithCounts(properties);
      const bounds: [number, number][] = [];

      for (const { zone, center, count } of zones) {
        const shape = zoneShapes[zone];
        if (!shape) continue;
        const active = count > 0;

        const base = {
          color: "#1b4530",
          weight: 1.5,
          fillColor: active ? "#1b4530" : "#9aa89f",
          fillOpacity: active ? 0.3 : 0.08,
        };
        const hover = { fillColor: "#d4b26a", fillOpacity: 0.6, weight: 2 };

        const polygon = L.polygon(shape, base);
        polygon.bindTooltip(`${zone} · ${count}`, { sticky: true, direction: "top" });
        if (active) {
          bounds.push(...shape);
          polygon.on("mouseover", () => polygon.setStyle(hover));
          polygon.on("mouseout", () => polygon.setStyle(base));
          polygon.on("click", () => onSelectRef.current(zone));
        }
        polygon.addTo(layer);

        if (active) {
          const badge = L.divIcon({
            className: "map-zone-badge",
            html: `<span>${count}</span>`,
            iconSize: [30, 30],
          });
          L.marker(center, { icon: badge, interactive: false }).addTo(layer);
        }
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
