"use client";

import { useEffect, useRef } from "react";

import { getListingCoordinates, TORREVIEJA_CENTER } from "@/lib/geo";
import { formatPrice, type PropertyRecord } from "@/lib/property-shared";

import "leaflet/dist/leaflet.css";

type PropertyMapProps = {
  properties: PropertyRecord[];
  viewLabel: string;
};

function priceLabel(property: PropertyRecord) {
  if (property.listingMode === "rent" && property.rentPriceEuro) {
    return formatPrice(property.rentPriceEuro);
  }
  return formatPrice(property.priceEuro);
}

export function PropertyMap({ properties, viewLabel }: PropertyMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  // Hold the Leaflet map instance and the current marker layer between renders.
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const layerRef = useRef<import("leaflet").LayerGroup | null>(null);

  useEffect(() => {
    let cancelled = false;

    // Leaflet touches `window`, so load it only in the browser.
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

      const bounds: [number, number][] = [];
      for (const property of properties) {
        const coords = getListingCoordinates({ id: property.id, location: property.location });
        bounds.push(coords);

        const href = `/properties/${property.slug}`;
        const marker = L.circleMarker(coords, {
          radius: 9,
          color: "#1b4530",
          weight: 2,
          fillColor: "#d4b26a",
          fillOpacity: 0.9,
        });
        marker.bindPopup(
          `<div class="map-popup">
            <strong>${escapeHtml(property.title)}</strong>
            <span class="map-popup-price">${escapeHtml(priceLabel(property))}</span>
            <span class="map-popup-meta">${property.bedrooms} · ${property.bathrooms} · ${property.location ? escapeHtml(property.location) : ""}</span>
            <a href="${href}">${escapeHtml(viewLabel)}</a>
          </div>`,
        );
        marker.addTo(layer);
      }

      if (bounds.length > 0) {
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
      }
      // The container may have been hidden (list view) when created; recalc size.
      map.invalidateSize();
    });

    return () => {
      cancelled = true;
    };
  }, [properties, viewLabel]);

  // Destroy the map only when the component unmounts.
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
