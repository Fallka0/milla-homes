"use client";

import { useDeferredValue, useMemo, useState } from "react";

import { PropertyCard } from "@/components/property-card";
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
    <div className="listing-layout">
      <aside className="filters-panel">
        <div className="section-heading compact">
          <p className="eyebrow">{copy.filters.heading}</p>
          <h2>{copy.filters.title}</h2>
        </div>

        <div className="filters-grid">
          <label>
            {copy.filters.search}
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={copy.filters.searchPlaceholder}
            />
          </label>

          <label>
            {copy.filters.region}
            <select value={selectedRegion} onChange={(event) => setSelectedRegion(event.target.value)}>
              <option value="all">{copy.filters.types.all}</option>
              {availableRegions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </label>

          <label>
            {copy.filters.listingMode}
            <select
              value={selectedListingMode}
              onChange={(event) => setSelectedListingMode(event.target.value as "all" | ListingMode)}
            >
              <option value="all">{copy.filters.types.all}</option>
              {listingModes.map((mode) => (
                <option key={mode} value={mode}>
                  {copy.filters.listingModeOptions[mode]}
                </option>
              ))}
            </select>
          </label>

          <label>
            {copy.filters.propertyType}
            <select
              value={selectedType}
              onChange={(event) => setSelectedType(event.target.value as "all" | PropertyType)}
            >
              <option value="all">{copy.filters.types.all}</option>
              {propertyTypes.map((type) => (
                <option key={type} value={type}>
                  {getLocalizedPropertyTypeLabel(locale, type)}
                </option>
              ))}
            </select>
          </label>

          <div className="filters-range">
            <span className="filters-group-label">{copy.filters.priceRange}</span>
            <div className="filters-range-inputs">
              <input
                type="number"
                min={0}
                inputMode="numeric"
                value={priceMin}
                onChange={(event) => setPriceMin(event.target.value)}
                placeholder={copy.filters.min}
                aria-label={`${copy.filters.priceRange} ${copy.filters.min}`}
              />
              <span aria-hidden>–</span>
              <input
                type="number"
                min={0}
                inputMode="numeric"
                value={priceMax}
                onChange={(event) => setPriceMax(event.target.value)}
                placeholder={copy.filters.max}
                aria-label={`${copy.filters.priceRange} ${copy.filters.max}`}
              />
            </div>
          </div>

          <div className="filters-range">
            <span className="filters-group-label">{copy.filters.sizeRange}</span>
            <div className="filters-range-inputs">
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
            </div>
          </div>

          <label>
            {copy.filters.minimumBedrooms}
            <select value={minimumBedrooms} onChange={(event) => setMinimumBedrooms(event.target.value)}>
              <option value="0">{copy.filters.types.any}</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
            </select>
          </label>

          <label>
            {copy.filters.bathrooms}
            <select value={minimumBathrooms} onChange={(event) => setMinimumBathrooms(event.target.value)}>
              <option value="0">{copy.filters.types.any}</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
            </select>
          </label>

          {availableFeatures.length > 0 ? (
            <div className="filters-feature-group">
              <span className="filters-group-label">{copy.filters.mustHaveFeatures}</span>
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
            </div>
          ) : null}

          {selectedListingMode === "rent" ? (
            <>
              <label>
                {copy.filters.availabilityFrom}
                <input type="date" value={availabilityFrom} onChange={(event) => setAvailabilityFrom(event.target.value)} />
              </label>

              <label>
                {copy.filters.availabilityTo}
                <input type="date" value={availabilityTo} onChange={(event) => setAvailabilityTo(event.target.value)} />
              </label>
            </>
          ) : null}

          <label>
            {copy.filters.sort}
            <select value={sort} onChange={(event) => setSort(event.target.value as SortOption)}>
              <option value="latest">{copy.filters.sortOptions.latest}</option>
              <option value="price-asc">{copy.filters.sortOptions.priceAsc}</option>
              <option value="price-desc">{copy.filters.sortOptions.priceDesc}</option>
              <option value="size-desc">{copy.filters.sortOptions.sizeDesc}</option>
            </select>
          </label>
        </div>
      </aside>

      <section className="listing-results">
        <div className="results-header">
          <div>
            <p className="eyebrow">{copy.filters.availableInventory}</p>
            <h2>{getLocalizedResultsLabel(locale, filteredProperties.length)}</h2>
          </div>
          {activeChips.length > 0 ? (
            <button className="filters-clear-all" type="button" onClick={resetFilters}>
              {copy.filters.clearAll}
            </button>
          ) : null}
        </div>

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

        {filteredProperties.length > 0 ? (
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
      </section>
    </div>
  );
}
