"use client";

import { useEffect, useRef } from "react";
import { Delaunay } from "d3-delaunay";

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

      const zones = zonesWithCounts(properties);

      // Voronoi partition over the zone centres (x = lng, y = lat), clipped to a
      // padded bounding box so every zone becomes a contiguous cell.
      const points: [number, number][] = zones.map(({ center }) => [center[1], center[0]]);
      const lngs = points.map((p) => p[0]);
      const lats = points.map((p) => p[1]);
      const pad = 0.06;
      const bbox: [number, number, number, number] = [
        Math.min(...lngs) - pad,
        Math.min(...lats) - pad,
        Math.max(...lngs) + pad,
        Math.max(...lats) + pad,
      ];
      const voronoi = Delaunay.from(points).voronoi(bbox);

      const allBounds: [number, number][] = [];

      zones.forEach(({ zone, center, count }, index) => {
        const cell = voronoi.cellPolygon(index);
        if (!cell) return;
        const latlngs = cell.map(([lng, lat]) => [lat, lng] as [number, number]);
        const active = count > 0;

        const base = {
          color: "#1b4530",
          weight: 1,
          fillColor: active ? "#1b4530" : "#9aa89f",
          fillOpacity: active ? 0.28 : 0.06,
        };
        const hover = { fillColor: "#d4b26a", fillOpacity: 0.55, weight: 2 };

        const polygon = L.polygon(latlngs, base);
        polygon.bindTooltip(`${zone} · ${count}`, { sticky: true, direction: "top" });
        if (active) {
          allBounds.push(center);
          polygon.on("mouseover", () => polygon.setStyle(hover));
          polygon.on("mouseout", () => polygon.setStyle(base));
          polygon.on("click", () => onSelectRef.current(zone));
        }
        polygon.addTo(layer);

        // Count badge at the zone centre (only where there are listings).
        if (active) {
          const badge = L.divIcon({
            className: "map-zone-badge",
            html: `<span>${count}</span>`,
            iconSize: [30, 30],
          });
          const marker = L.marker(center, { icon: badge, interactive: false });
          marker.addTo(layer);
        }
      });

      if (allBounds.length > 0) {
        map.fitBounds(allBounds, { padding: [60, 60], maxZoom: 12 });
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
