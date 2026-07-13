"use client";

import { useEffect, useRef } from "react";

import "leaflet/dist/leaflet.css";

type PropertyDetailMapProps = {
  center: [number, number];
  label: string;
  radius?: number;
  zoom?: number;
};

export function PropertyDetailMap({ center, label, radius = 550, zoom = 14 }: PropertyDetailMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const [lat, lng] = center;

  useEffect(() => {
    let cancelled = false;

    import("leaflet").then((L) => {
      if (cancelled || !containerRef.current || mapRef.current) {
        return;
      }

      const map = L.map(containerRef.current, {
        center: [lat, lng],
        zoom,
        scrollWheelZoom: false,
        zoomControl: true,
      });
      mapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
        maxZoom: 18,
      }).addTo(map);

      // Neighbourhood-level accuracy, so show a soft catchment circle rather
      // than a precise pin the data can't back up.
      L.circle([lat, lng], {
        radius,
        color: "#1b4530",
        weight: 1.5,
        fillColor: "#1b4530",
        fillOpacity: 0.12,
      }).addTo(map);

      map.invalidateSize();
    });

    return () => {
      cancelled = true;
    };
  }, [lat, lng, radius, zoom]);

  useEffect(() => {
    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  return <div className="property-detail-map" ref={containerRef} role="application" aria-label={label} />;
}
