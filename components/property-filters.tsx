"use client";

import { useDeferredValue, useMemo, useState } from "react";

import { PropertyCard } from "@/components/property-card";
import { PropertyMap } from "@/components/property-map";
import {
  listingModes,
  propertyFeatureOptions,
  propertyLocations,
  propertyTypes,
  type ListingMode,
  type PropertyFeature,
  type PropertyRecord,
  type PropertyType,
} from "@/lib/property-shared";
import {
  getLocalizedPropertyFeatureLabel,
  getLocalizedResultsLabel,
  getLocalizedPropertyTypeLabel,
  type PublicCopy,
  type PublicLocale,
} from "@/lib/public-copy";

type PropertyFiltersProps = {
  copy: PublicCopy;
  locale: PublicLocale;
  properties: PropertyRecord[];
};

type SortOption = "latest" | "price-asc" | "price-desc" | "size-desc";

const DEFAULT_STATE = {
  search: "",
  listingMode: "all" as "all" | ListingMode,
  region: "all" as string,
  type: "all" as "all" | PropertyType,
  features: [] as PropertyFeature[],
  availabilityFrom: "",
  availabilityTo: "",
  minBedrooms: "0",
  minBathrooms: "0",
  priceMin: "",
  priceMax: "",
  sizeMin: "",
  sizeMax: "",
  sort: "latest" as SortOption,
};

export function PropertyFilters({ copy, locale, properties }: PropertyFiltersProps) {
  const [search, setSearch] = useState(DEFAULT_STATE.search);
  const [selectedListingMode, setSelectedListingMode] = useState(DEFAULT_STATE.listingMode);
  const [selectedRegion, setSelectedRegion] = useState(DEFAULT_STATE.region);
  const [selectedType, setSelectedType] = useState(DEFAULT_STATE.type);
  const [selectedFeatures, setSelectedFeatures] = useState<PropertyFeature[]>(DEFAULT_STATE.features);
  const [availabilityFrom, setAvailabilityFrom] = useState(DEFAULT_STATE.availabilityFrom);
  const [availabilityTo, setAvailabilityTo] = useState(DEFAULT_STATE.availabilityTo);
  const [minimumBedrooms, setMinimumBedrooms] = useState(DEFAULT_STATE.minBedrooms);
  const [minimumBathrooms, setMinimumBathrooms] = useState(DEFAULT_STATE.minBathrooms);
  const [priceMin, setPriceMin] = useState(DEFAULT_STATE.priceMin);
  const [priceMax, setPriceMax] = useState(DEFAULT_STATE.priceMax);
  const [sizeMin, setSizeMin] = useState(DEFAULT_STATE.sizeMin);
  const [sizeMax, setSizeMax] = useState(DEFAULT_STATE.sizeMax);
  const [sort, setSort] = useState<SortOption>(DEFAULT_STATE.sort);
  const [view, setView] = useState<"list" | "map">("list");
  const [showMore, setShowMore] = useState(false);

  const deferredSearch = useDeferredValue(search);
  const normalizedSearch = deferredSearch.trim().toLowerCase();

  const locationMatches = (property: PropertyRecord, region: string) =>
    property.location === region || property.location.toLowerCase().includes(region.toLowerCase());

  // Only show locations that actually have listings.
  const availableRegions = useMemo(
    () => propertyLocations.filter((region) => properties.some((property) => locationMatches(property, region))),
    [properties],
  );
  const availableFeatures = propertyFeatureOptions.filter((feature) =>
    properties.some((property) => property.features.includes(feature)),
  );

  const getSortablePrice = (property: PropertyRecord) =>
    selectedListingMode === "rent" ? property.rentPriceEuro ?? property.priceEuro : property.priceEuro;
  const toggleFeature = (feature: PropertyFeature) =>
    setSelectedFeatures((current) =>
      current.includes(feature) ? current.filter((entry) => entry !== feature) : [...current, feature],
    );

  const resetFilters = () => {
    setSearch(DEFAULT_STATE.search);
    setSelectedListingMode(DEFAULT_STATE.listingMode);
    setSelectedRegion(DEFAULT_STATE.region);
    setSelectedType(DEFAULT_STATE.type);
    setSelectedFeatures(DEFAULT_STATE.features);
    setAvailabilityFrom(DEFAULT_STATE.availabilityFrom);
    setAvailabilityTo(DEFAULT_STATE.availabilityTo);
    setMinimumBedrooms(DEFAULT_STATE.minBedrooms);
    setMinimumBathrooms(DEFAULT_STATE.minBathrooms);
    setPriceMin(DEFAULT_STATE.priceMin);
    setPriceMax(DEFAULT_STATE.priceMax);
    setSizeMin(DEFAULT_STATE.sizeMin);
    setSizeMax(DEFAULT_STATE.sizeMax);
    setSort(DEFAULT_STATE.sort);
  };

  const priceMinValue = Number(priceMin) || 0;
  const priceMaxValue = Number(priceMax) || Infinity;
  const sizeMinValue = Number(sizeMin) || 0;
  const sizeMaxValue = Number(sizeMax) || Infinity;

  const filteredProperties = properties
    .filter((property) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        property.title.toLowerCase().includes(normalizedSearch) ||
        property.location.toLowerCase().includes(normalizedSearch) ||
        property.referenceCode.toLowerCase().includes(normalizedSearch);

      const matchesRegion = selectedRegion === "all" || locationMatches(property, selectedRegion);
      const matchesListingMode =
        selectedListingMode === "all" ||
        property.listingMode === selectedListingMode ||
        property.listingMode === "both";
      const matchesType = selectedType === "all" || property.type === selectedType;
      const matchesBedrooms = property.bedrooms >= Number(minimumBedrooms);
      const matchesBathrooms = property.bathrooms >= Number(minimumBathrooms);

      const price = getSortablePrice(property);
      const matchesPrice = price >= priceMinValue && price <= priceMaxValue;

      const size = property.interiorSqm ?? 0;
      const matchesSize =
        (sizeMinValue === 0 || size >= sizeMinValue) && (sizeMaxValue === Infinity || size <= sizeMaxValue);

      const matchesFeatures =
        selectedFeatures.length === 0 || selectedFeatures.every((feature) => property.features.includes(feature));
      const matchesAvailability =
        selectedListingMode !== "rent" ||
        ((!availabilityFrom && !availabilityTo) ||
          (property.availabilityStart &&
            property.availabilityEnd &&
            (!availabilityFrom || property.availabilityStart <= availabilityFrom) &&
            (!availabilityTo || property.availabilityEnd >= availabilityTo)));

      return (
        matchesSearch &&
        matchesRegion &&
        matchesListingMode &&
        matchesType &&
        matchesBedrooms &&
        matchesBathrooms &&
        matchesPrice &&
        matchesSize &&
        matchesFeatures &&
        matchesAvailability
      );
    })
    .sort((left, right) => {
      if (sort === "price-asc") {
        return getSortablePrice(left) - getSortablePrice(right);
      }

      if (sort === "price-desc") {
        return getSortablePrice(right) - getSortablePrice(left);
      }

      if (sort === "size-desc") {
        return (right.interiorSqm ?? 0) - (left.interiorSqm ?? 0);
      }

      return right.updatedAt.localeCompare(left.updatedAt);
    });

  // Active-filter chips (label + reset handler for each set filter).
  const activeChips: Array<{ key: string; label: string; onClear: () => void }> = [];
  if (normalizedSearch) {
    activeChips.push({ key: "search", label: `"${search.trim()}"`, onClear: () => setSearch("") });
  }
  if (selectedRegion !== "all") {
    activeChips.push({ key: "region", label: selectedRegion, onClear: () => setSelectedRegion("all") });
  }
  if (selectedListingMode !== "all") {
    activeChips.push({
      key: "mode",
      label: copy.filters.listingModeOptions[selectedListingMode],
      onClear: () => setSelectedListingMode("all"),
    });
  }
  if (selectedType !== "all") {
    activeChips.push({
      key: "type",
      label: getLocalizedPropertyTypeLabel(locale, selectedType),
      onClear: () => setSelectedType("all"),
    });
  }
  if (Number(minimumBedrooms) > 0) {
    activeChips.push({ key: "beds", label: `${minimumBedrooms}+ ${copy.propertyMeta.bedroomsShort}`, onClear: () => setMinimumBedrooms("0") });
  }
  if (Number(minimumBathrooms) > 0) {
    activeChips.push({ key: "baths", label: `${minimumBathrooms}+ ${copy.propertyMeta.bathroomsShort}`, onClear: () => setMinimumBathrooms("0") });
  }
  if (priceMin || priceMax) {
    const label = `${copy.filters.priceRange}: ${priceMin || "0"}–${priceMax || "∞"} €`;
    activeChips.push({ key: "price", label, onClear: () => { setPriceMin(""); setPriceMax(""); } });
  }
  if (sizeMin || sizeMax) {
    const label = `${copy.filters.sizeRange}: ${sizeMin || "0"}–${sizeMax || "∞"} m²`;
    activeChips.push({ key: "size", label, onClear: () => { setSizeMin(""); setSizeMax(""); } });
  }
  for (const feature of selectedFeatures) {
    activeChips.push({
      key: `feature-${feature}`,
      label: getLocalizedPropertyFeatureLabel(locale, feature),
      onClear: () => toggleFeature(feature),
    });
  }

  return (
    <div className="listing-page">
      <form className="filters-bar" onSubmit={(event) => event.preventDefault()}>
        <div className="filters-bar-main">
          <input
            className="filters-bar-search"
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={copy.filters.searchPlaceholder}
            aria-label={copy.filters.search}
          />

          <select
            value={selectedRegion}
            onChange={(event) => setSelectedRegion(event.target.value)}
            aria-label={copy.filters.region}
          >
            <option value="all">{copy.filters.region}</option>
            {availableRegions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>

          <select
            value={selectedListingMode}
            onChange={(event) => setSelectedListingMode(event.target.value as "all" | ListingMode)}
            aria-label={copy.filters.listingMode}
          >
            <option value="all">{copy.filters.listingMode}</option>
            {listingModes.map((mode) => (
              <option key={mode} value={mode}>
                {copy.filters.listingModeOptions[mode]}
              </option>
            ))}
          </select>

          <select
            value={selectedType}
            onChange={(event) => setSelectedType(event.target.value as "all" | PropertyType)}
            aria-label={copy.filters.propertyType}
          >
            <option value="all">{copy.filters.propertyType}</option>
            {propertyTypes.map((type) => (
              <option key={type} value={type}>
                {getLocalizedPropertyTypeLabel(locale, type)}
              </option>
            ))}
          </select>

          <input
            className="filters-bar-num"
            type="number"
            min={0}
            inputMode="numeric"
            value={priceMin}
            onChange={(event) => setPriceMin(event.target.value)}
            placeholder={`€ ${copy.filters.min}`}
            aria-label={`${copy.filters.priceRange} ${copy.filters.min}`}
          />
          <input
            className="filters-bar-num"
            type="number"
            min={0}
            inputMode="numeric"
            value={priceMax}
            onChange={(event) => setPriceMax(event.target.value)}
            placeholder={`€ ${copy.filters.max}`}
            aria-label={`${copy.filters.priceRange} ${copy.filters.max}`}
          />

          <select
            value={minimumBedrooms}
            onChange={(event) => setMinimumBedrooms(event.target.value)}
            aria-label={copy.filters.minimumBedrooms}
          >
            <option value="0">{copy.filters.minimumBedrooms}</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
          </select>

          <button
            type="button"
            className={`filters-more-toggle${showMore ? " is-open" : ""}`}
            aria-expanded={showMore}
            onClick={() => setShowMore((open) => !open)}
          >
            {showMore ? copy.filters.lessFilters : copy.filters.moreFilters}
          </button>

          {activeChips.length > 0 ? (
            <button className="filters-reset" type="button" onClick={resetFilters}>
              {copy.filters.clearAll}
            </button>
          ) : null}
        </div>

        {showMore ? (
          <div className="filters-bar-more">
            <label className="filters-inline">
              {copy.filters.bathrooms}
              <select value={minimumBathrooms} onChange={(event) => setMinimumBathrooms(event.target.value)}>
                <option value="0">{copy.filters.types.any}</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
              </select>
            </label>

            <label className="filters-inline">
              {copy.filters.sizeRange}
              <span className="filters-range-inputs">
                <input
                  type="number"
                  min={0}
                  inputMode="numeric"
                  value={sizeMin}
                  onChange={(event) => setSizeMin(event.target.value)}
                  placeholder={copy.filters.min}
                  aria-label={`${copy.filters.sizeRange} ${copy.filters.min}`}
                />
                <span aria-hidden>–</span>
                <input
                  type="number"
                  min={0}
                  inputMode="numeric"
                  value={sizeMax}
                  onChange={(event) => setSizeMax(event.target.value)}
                  placeholder={copy.filters.max}
                  aria-label={`${copy.filters.sizeRange} ${copy.filters.max}`}
                />
              </span>
            </label>

            {selectedListingMode === "rent" ? (
              <>
                <label className="filters-inline">
                  {copy.filters.availabilityFrom}
                  <input type="date" value={availabilityFrom} onChange={(event) => setAvailabilityFrom(event.target.value)} />
                </label>
                <label className="filters-inline">
                  {copy.filters.availabilityTo}
                  <input type="date" value={availabilityTo} onChange={(event) => setAvailabilityTo(event.target.value)} />
                </label>
              </>
            ) : null}

            {availableFeatures.length > 0 ? (
              <div className="filters-pill-group">
                {availableFeatures.map((feature) => {
                  const isActive = selectedFeatures.includes(feature);
                  return (
                    <button
                      className={`filters-pill-button${isActive ? " active" : ""}`}
                      key={feature}
                      onClick={() => toggleFeature(feature)}
                      type="button"
                    >
                      {getLocalizedPropertyFeatureLabel(locale, feature)}
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>
        ) : null}
      </form>

      {activeChips.length > 0 ? (
        <div className="filters-active-chips">
          {activeChips.map((chip) => (
            <button className="filters-chip" key={chip.key} type="button" onClick={chip.onClear}>
              {chip.label}
              <span aria-hidden>×</span>
            </button>
          ))}
        </div>
      ) : null}

      <div className="results-bar">
        <p className="results-count">{getLocalizedResultsLabel(locale, filteredProperties.length)}</p>
        <div className="results-bar-actions">
          <div className="view-toggle" role="tablist" aria-label="View">
            <button
              type="button"
              role="tab"
              aria-selected={view === "list"}
              className={view === "list" ? "is-active" : ""}
              onClick={() => setView("list")}
            >
              {copy.filters.listView}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={view === "map"}
              className={view === "map" ? "is-active" : ""}
              onClick={() => setView("map")}
            >
              {copy.filters.mapView}
            </button>
          </div>
          <select
            className="results-sort"
            value={sort}
            onChange={(event) => setSort(event.target.value as SortOption)}
            aria-label={copy.filters.sort}
          >
            <option value="latest">{copy.filters.sortOptions.latest}</option>
            <option value="price-asc">{copy.filters.sortOptions.priceAsc}</option>
            <option value="price-desc">{copy.filters.sortOptions.priceDesc}</option>
            <option value="size-desc">{copy.filters.sortOptions.sizeDesc}</option>
          </select>
        </div>
      </div>

      {view === "map" ? (
        <PropertyMap
          properties={filteredProperties}
          onSelectZone={(zone) => {
            setSelectedRegion(zone);
            setView("list");
          }}
        />
      ) : filteredProperties.length > 0 ? (
        <div className="property-grid">
          {filteredProperties.map((property) => (
            <PropertyCard
              bathroomsLabel={copy.propertyMeta.bathroomsShort}
              bedroomsLabel={copy.propertyMeta.bedroomsShort}
              buttonLabel={copy.buttons.viewDetails}
              key={property.id}
              locale={locale}
              property={property}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h3>{copy.filters.emptyTitle}</h3>
          <p>{copy.filters.emptyBody}</p>
        </div>
      )}
    </div>
  );
}
