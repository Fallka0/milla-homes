// sampleProperty.js — demo data shape for <WindowSheet />.
// In the real app, map a Supabase listing row into this shape.
export const sampleProperty = {
  status: "En venta",                 // badge text: "En venta" | "En alquiler"
  location: "Punta Prima · Torrevieja",
  title: "Apartamento de planta baja de 2 dormitorios en Amay",
  price: "240.000 €",                 // formatted string; the € is kept non-breaking internally
  beds: 2,
  baths: 2,
  area: 71,                           // built m²
  desc:
    "Elegante apartamento de planta baja en el complejo Amay, a pocos minutos a pie de la playa, tiendas y restaurantes. Salón-cocina de concepto abierto, aire acondicionado, trastero y plaza de aparcamiento privada. Urbanización cerrada con piscina comunitaria, sauna y amplias zonas ajardinadas.",
  phone: "+34 652 679 443",
  web: "milla-homes.com",
  listingUrl:
    "https://milla-homes.com/properties/modern-2-bedroom-ground-floor-apartment-in-amay",
  // ordered; photos[0] is the hero. Use the listing's Supabase public URLs.
  photos: [
    "https://piamegynhnofnrvqqzkm.supabase.co/storage/v1/object/public/property-images/modern-2-bedroom-ground-floor-apartment-in-amay/1778951647591-s2bdvu59koa.jpeg",
    "https://piamegynhnofnrvqqzkm.supabase.co/storage/v1/object/public/property-images/modern-2-bedroom-ground-floor-apartment-in-amay/1778951910468-0fofcs3k1j9f.jpeg",
    "https://piamegynhnofnrvqqzkm.supabase.co/storage/v1/object/public/property-images/modern-2-bedroom-ground-floor-apartment-in-amay/1778951911524-7ygdl3zilu2.jpeg",
    "https://piamegynhnofnrvqqzkm.supabase.co/storage/v1/object/public/property-images/modern-2-bedroom-ground-floor-apartment-in-amay/1778951912566-pr9cb7lfma.jpeg",
  ],
};
