export const publicLocales = ["en", "es", "uk", "de", "ru"] as const;

export type PublicLocale = (typeof publicLocales)[number];

export function isPublicLocale(value: string): value is PublicLocale {
  return publicLocales.includes(value as PublicLocale);
}

export function resolvePublicLocale(value?: string | null): PublicLocale {
  if (value && isPublicLocale(value)) {
    return value;
  }

  return "en";
}

export type PublicCopy = {
  brandSubtitle: string;
  buttons: {
    browseProperties: string;
    callNow: string;
    openListings: string;
    seeAllProperties: string;
    sendInquiry: string;
    sending: string;
    viewDetails: string;
    viewListing: string;
    whatsapp: string;
  };
  carousel: {
    closeZoom: string;
    enlargeImage: string;
    galleryHint: string;
    thumbnailsLabel: string;
    nextImage: string;
    previousImage: string;
    showImage: string;
    zoomHint: string;
  };
  contact: {
    availabilityLabel: string;
    availabilityValue: string;
    eyebrow: string;
    panelSummary: string;
    panelTitle: string;
    phoneLabel: string;
    summary: string;
    title: string;
    whatsappMessage: string;
  };
  coverage: {
    eyebrow: string;
    summary: string;
    title: string;
  };
  detail: {
    availability: string;
    bathrooms: string;
    bedrooms: string;
    features: string;
    interior: string;
    listingOverview: string;
    listingMode: string;
    plot: string;
    requestInfo: string;
    requestTitle: string;
    rentPrice: string;
    rentalPeriods: string;
    salePrice: string;
    type: string;
    whyPause: string;
  };
  filters: {
    availableInventory: string;
    availabilityFrom: string;
    availabilityTo: string;
    bathrooms: string;
    clearAll: string;
    emptyBody: string;
    emptyTitle: string;
    features: string;
    heading: string;
    listingMode: string;
    listView: string;
    mapView: string;
    moreFilters: string;
    lessFilters: string;
    max: string;
    min: string;
    mustHaveFeatures: string;
    minimumBedrooms: string;
    priceRange: string;
    propertyType: string;
    region: string;
    results: string;
    search: string;
    searchPlaceholder: string;
    sizeRange: string;
    sort: string;
    title: string;
    types: {
      all: string;
        any: string;
    };
    listingModeOptions: {
      both: string;
      rent: string;
      sale: string;
    };
    sortOptions: {
      latest: string;
      priceAsc: string;
      priceDesc: string;
      sizeDesc: string;
    };
  };
  hero: {
    ctaSubtitles: {
      browse: string;
      guide: string;
      owner: string;
    };
    eyebrow: string;
    text: string;
    title: string;
  };
  statement: {
    lead: string;
    tail: string;
  };
  inquiry: {
    email: string;
    emailPlaceholder: string;
    error: string;
    fullName: string;
    generalInquiry: string;
    message: string;
    messagePlaceholder: string;
    optional: string;
    phone: string;
    propertyInquiry: string;
    rateLimited: string;
    requestViewing: string;
    requestViewingPlaceholder: string;
    requestViewingTemplate: string;
    sendingAria: string;
    success: string;
    timeline: string;
    timelinePlaceholder: string;
    typeLabel: string;
    yourName: string;
  };
  languageLabel: string;
  masonry: {
    eyebrow: string;
    title: string;
  };
  footer: {
    blurb: string;
    browseLabel: string;
    copyright: string;
  };
  neighborhoods: {
    cards: Array<{
      area: string;
      summary: string;
      title: string;
    }>;
    eyebrow: string;
    title: string;
  };
  nav: {
    about: string;
    collaborate: string;
    contact: string;
    owner: string;
    home: string;
    properties: string;
    guide: string;
  };
  overview?: {
    body: string;
    eyebrow: string;
    items: Array<{
      copy: string;
      title: string;
    }>;
    title: string;
  };
  propertiesPage: {
    eyebrow: string;
    text: string;
    title: string;
  };
  seo: {
    description: string;
    ogDescription: string;
    ogTitle: string;
    title: string;
  };
  propertyMeta: {
    bathroomsShort: string;
    bedroomsShort: string;
    featuredSnapshot: string;
    homesOnline: string;
    homesOnlineValue: string;
    homesSelected: string;
    homesSelectedValue: string;
    homesSelectedLabel: string;
    targetAreasValue: string;
    updatedListings: string;
  };
  testimonials: {
    eyebrow: string;
    items: Array<{
      name: string;
      quote: string;
      rating: number;
      role: string;
    }>;
    summary: string;
    title: string;
  };
};

export const areaNames = [
  "Torrevieja",
  "La Mata",
  "Orihuela Costa",
  "Guardamar del Segura",
] as const;

export const neighborhoodImages: Record<(typeof areaNames)[number], string> = {
  Torrevieja:
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
  "La Mata":
    "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
  "Orihuela Costa":
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
  "Guardamar del Segura":
    "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
};

export const publicCopy: Record<PublicLocale, PublicCopy> = {
  en: {
    brandSubtitle: "Homes Along The Costa Blanca",
    buttons: {
      browseProperties: "Browse Properties",
      callNow: "Call Now",
      openListings: "Open Full Listings",
      seeAllProperties: "See All Properties",
      sendInquiry: "Send Inquiry",
      sending: "Sending...",
      viewDetails: "View Details",
      viewListing: "View Listing",
      whatsapp: "WhatsApp",
    },
    carousel: {
      closeZoom: "Close zoom view",
      enlargeImage: "Open enlarged image",
      galleryHint: "Swipe, use the arrows, or choose a thumbnail.",
      thumbnailsLabel: "Property gallery thumbnails",
      nextImage: "Show next image",
      previousImage: "Show previous image",
      showImage: "Show image",
      zoomHint: "Use the side arrows or your keyboard to move through the gallery.",
    },
    contact: {
      availabilityLabel: "Best for",
      availabilityValue: "Calls and WhatsApp",
      eyebrow: "Speak Directly",
      panelSummary: "A quick call or WhatsApp message is often the easiest way to confirm availability, rental timing, or the next step.",
      panelTitle: "Want quick answers on price, rent dates, or viewings?",
      phoneLabel: "Phone",
      summary: "When a property stands out, direct contact helps answer the practical questions without delay.",
      title: "Speak with your agent when you want clarity, availability, or a quick next step.",
      whatsappMessage: "Hello, I am interested in a property from Milla Homes and would like more information.",
    },
    coverage: {
      eyebrow: "A More Personal Search",
      summary:
        "Whether you are buying, renting, or comparing both, the process should feel calm, clear, and tailored to how you actually want to live on the Costa Blanca.",
      title: "Property advice feels better when it starts with your pace, your plans, and your priorities.",
    },
    detail: {
      availability: "Availability",
      bathrooms: "Bathrooms",
      bedrooms: "Bedrooms",
      features: "Features",
      interior: "Interior",
      listingOverview: "Listing Overview",
      listingMode: "Listing Type",
      plot: "Plot",
      requestInfo: "Request More Information",
      requestTitle: "Schedule a viewing or ask for more detail.",
      rentPrice: "Rent",
      rentalPeriods: "Rent Periods",
      salePrice: "Sale",
      type: "Type",
      whyPause: "Why buyers will pause on this one.",
    },
    filters: {
      availableInventory: "Available Inventory",
      availabilityFrom: "Available from",
      availabilityTo: "Available to",
      bathrooms: "Bathrooms",
      clearAll: "Clear all",
      emptyBody: "Try broadening the search or lowering the bedroom minimum.",
      emptyTitle: "No properties match those filters yet.",
      features: "Amenities",
      heading: "Property Search",
      listingMode: "Looking for",
      listView: "List",
      mapView: "Map",
      moreFilters: "More filters",
      lessFilters: "Fewer filters",
      max: "Max",
      min: "Min",
      mustHaveFeatures: "Must-have features",
      minimumBedrooms: "Minimum Bedrooms",
      priceRange: "Price (€)",
      propertyType: "Property Type",
      region: "Region",
      results: "properties currently match.",
      search: "Search",
      searchPlaceholder: "Title, location or reference",
      sizeRange: "Size (m²)",
      sort: "Sort",
      title: "Find the right listing faster.",
      types: {
        all: "All types",
        any: "Any",
      },
      listingModeOptions: {
        both: "Sale and rent",
        rent: "Rent",
        sale: "Sale",
      },
      sortOptions: {
        latest: "Latest",
        priceAsc: "Price: low to high",
        priceDesc: "Price: high to low",
        sizeDesc: "Size: largest first",
      },
    },
    hero: {
      ctaSubtitles: {
        browse: "Find your ideal home",
        guide: "Costs, steps and timelines",
        owner: "We handle it for you",
      },
      eyebrow: "Homes for sale and rent in Torrevieja and nearby coastal areas",
      text:
        "Milla Homes offers a more personal way to search across the Costa Blanca: carefully selected homes, clearer guidance, and support that stays close from the first shortlist to the first viewing.",
      title: "Find your place in the sun.",
    },
    statement: {
      lead: "Selling, buying or renting on the Costa Blanca —",
      tail: "we're with you at every step.",
    },
    inquiry: {
      email: "Email Address",
      emailPlaceholder: "you@example.com",
      error: "Something went wrong. Please try again.",
      fullName: "Full Name",
      generalInquiry: "General inquiry",
      message: "Message",
      messagePlaceholder: "Tell us what kind of property you are looking for.",
      optional: "Optional",
      phone: "Phone Number",
      propertyInquiry: "Property Inquiry",
      rateLimited: "Too many inquiries were sent just now. Please wait a few minutes and try again.",
      requestViewing: "Request viewing",
      requestViewingPlaceholder: "Add any timing details, questions, or special requests for the viewing.",
      requestViewingTemplate: "Hello, I would like to request a viewing for {title} in {location}. Please let me know the available time slots.",
      sendingAria: "Sending your property inquiry",
      success: "Inquiry sent successfully.",
      timeline: "Preferred viewing time",
      timelinePlaceholder: "For example: this week, Friday afternoon, or next Tuesday",
      typeLabel: "Inquiry type",
      yourName: "Your name",
    },
    languageLabel: "Choose language",
    masonry: {
      eyebrow: "Explore Available Homes",
      title: "Browse current sale and rental listings and open the homes that best match your timing and priorities.",
    },
    footer: {
      blurb: "Milla Homes offers a calmer, more personal way to explore homes for sale and rent in Torrevieja and the surrounding coast.",
      browseLabel: "Browse Listings",
      copyright: "© Milla Homes",
    },
    neighborhoods: {
      cards: [
        {
          area: "Torrevieja",
          title: "Year-round life by the marina",
          summary: "A broad mix of apartments, villas, and walkable neighborhoods close to the water.",
        },
        {
          area: "La Mata",
          title: "Beachfront calm with open light",
          summary: "Known for sea views, long beach walks, and homes that feel a little more relaxed.",
        },
        {
          area: "Orihuela Costa",
          title: "Resort energy with strong inventory",
          summary: "Popular with international buyers looking for polished developments and coastal access.",
        },
        {
          area: "Guardamar del Segura",
          title: "Green edges and softer pace",
          summary: "A quieter coastal rhythm with dunes, parks, and homes that feel tucked away.",
        },
      ],
      eyebrow: "Neighborhoods",
      title: "Different corners of the coast, each with its own mood.",
    },
    nav: {
      about: "About",
      contact: "Contact",
      owner: "Sell or Rent",
      home: "Home",
      properties: "Properties",
      guide: "Buying Guide",
      collaborate: "Collaborate",
    },
    overview: {
      body:
        "Clients receive honest guidance, a calmer pace, and listings explained clearly enough to compare areas, prices, and rental timing with confidence.",
      eyebrow: "What Clients Value",
      items: [
        {
          title: "A more personal approach",
          copy: "Conversations stay focused on how a client wants to live, stay, or invest, not on pushing the next viewing.",
        },
        {
          title: "Clear guidance without pressure",
          copy: "Homes, neighborhoods, price points, and rental timing are explained with more calm and less noise.",
        },
        {
          title: "Care through every step",
          copy: "From the first shortlist to the first call, the experience is designed to feel attentive, practical, and reassuring.",
        },
      ],
      title: "The right property search feels clearer when there is trust, context, and real guidance behind it.",
    },
    propertiesPage: {
      eyebrow: "Property Listings",
      text: "Browse current sale and rental listings, refine by region and dates, and open any property for more detail.",
      title: "Available homes for sale and rent in Torrevieja and across the surrounding coast.",
    },
    seo: {
      description: "Browse homes for sale and rent in Torrevieja, La Mata, Orihuela Costa, and nearby coastal areas with personal guidance from Milla Homes.",
      ogDescription: "Discover carefully presented sale and rental listings across Torrevieja and the surrounding coast.",
      ogTitle: "Milla Homes | Homes For Sale And Rent In Torrevieja",
      title: "Milla Homes | Homes For Sale And Rent In Torrevieja",
    },
    propertyMeta: {
      bathroomsShort: "bath",
      bedroomsShort: "bed",
      featuredSnapshot: "Featured Snapshot",
      homesOnline: "listings currently online",
      homesOnlineValue: "2",
      homesSelected: "featured homes right now",
      homesSelectedValue: "1",
      homesSelectedLabel: "coastal areas covered",
      targetAreasValue: "4",
      updatedListings: "current highlighted listings",
    },
    testimonials: {
      eyebrow: "Client Impressions",
      items: [
        {
          name: "James & Sarah Thornton",
          quote: "From the beginning, the search felt calm and well guided. We quickly understood which homes were genuinely right for us — and bought one within a month.",
          rating: 5,
          role: "Bought in Torrevieja · from the UK",
        },
        {
          name: "Marta Giménez",
          quote: "Availability, timing, and location were explained clearly, which made choosing the right rental period much easier. Everything was handled in Spanish and English.",
          rating: 5,
          role: "Rented in Orihuela Costa",
        },
        {
          name: "Thomas Becker",
          quote: "It felt more thoughtful than a generic portal. By the time we reached out, we already felt confident in the shortlist. Highly recommend.",
          rating: 5,
          role: "Bought a holiday home in La Zenia",
        },
      ],
      summary: "The difference shows up in the tone, the pacing, and how clearly each listing is presented before the first conversation.",
      title: "A well-guided property search leaves clients feeling informed rather than overwhelmed.",
    },
  },
  es: {
    brandSubtitle: "Viviendas En La Costa Blanca",
    buttons: {
      browseProperties: "Ver propiedades",
      callNow: "Llamar ahora",
      openListings: "Abrir propiedades",
      seeAllProperties: "Ver todas",
      sendInquiry: "Enviar consulta",
      sending: "Enviando...",
      viewDetails: "Ver detalles",
      viewListing: "Ver propiedad",
      whatsapp: "WhatsApp",
    },
    carousel: {
      closeZoom: "Cerrar vista ampliada",
      enlargeImage: "Abrir imagen ampliada",
      galleryHint: "Desliza, usa las flechas o elige una miniatura.",
      thumbnailsLabel: "Miniaturas de la galería",
      nextImage: "Mostrar la siguiente imagen",
      previousImage: "Mostrar la imagen anterior",
      showImage: "Mostrar imagen",
      zoomHint: "Usa las flechas laterales o el teclado para moverte por la galería.",
    },
    contact: {
      availabilityLabel: "Ideal para",
      availabilityValue: "Llamadas y WhatsApp",
      eyebrow: "Hablar directamente",
      panelSummary: "Una llamada o un mensaje suele ser la forma más rápida de confirmar disponibilidad, fechas de alquiler o el siguiente paso.",
      panelTitle: "¿Quieres resolver rápido precio, fechas o visitas?",
      phoneLabel: "Teléfono",
      summary: "Cuando una propiedad encaja de verdad, el contacto directo ayuda a resolver dudas prácticas sin demora.",
      title: "Habla con tu agente cuando necesites claridad, disponibilidad o un siguiente paso rápido.",
      whatsappMessage: "Hola, me interesa una propiedad de Milla Homes y me gustaría recibir más información.",
    },
    coverage: {
      eyebrow: "Una búsqueda más personal",
      summary:
        "Ya sea para comprar, alquilar o comparar ambas opciones, el proceso debería sentirse claro, cercano y adaptado a tu forma real de vivir en la Costa Blanca.",
      title: "El asesoramiento inmobiliario funciona mejor cuando empieza por tu ritmo, tus planes y tus prioridades.",
    },
    detail: {
      availability: "Disponibilidad",
      bathrooms: "Baños",
      bedrooms: "Dormitorios",
      features: "Características",
      interior: "Interior",
      listingOverview: "Resumen de la propiedad",
      listingMode: "Modalidad",
      plot: "Parcela",
      requestInfo: "Solicitar más información",
      requestTitle: "Solicita una visita o pide más detalles.",
      rentPrice: "Alquiler",
      rentalPeriods: "Modalidades de alquiler",
      salePrice: "Venta",
      type: "Tipo",
      whyPause: "Por qué esta vivienda llama la atención.",
    },
    filters: {
      availableInventory: "Propiedades disponibles",
      availabilityFrom: "Disponible desde",
      availabilityTo: "Disponible hasta",
      bathrooms: "Baños",
      clearAll: "Borrar todo",
      emptyBody: "Prueba ampliar la búsqueda o bajar el mínimo de dormitorios.",
      emptyTitle: "No hay propiedades con esos filtros.",
      features: "Comodidades",
      heading: "Búsqueda de propiedades",
      listingMode: "Busco",
      listView: "Lista",
      mapView: "Mapa",
      moreFilters: "Más filtros",
      lessFilters: "Menos filtros",
      max: "Máx",
      min: "Mín",
      mustHaveFeatures: "Características imprescindibles",
      minimumBedrooms: "Dormitorios mínimos",
      priceRange: "Precio (€)",
      propertyType: "Tipo de propiedad",
      region: "Zona",
      results: "propiedades coinciden.",
      search: "Buscar",
      searchPlaceholder: "Título, zona o referencia",
      sizeRange: "Superficie (m²)",
      sort: "Ordenar",
      title: "Encuentra la propiedad adecuada más rápido.",
      types: {
        all: "Todos los tipos",
        any: "Cualquiera",
      },
      listingModeOptions: {
        both: "Venta y alquiler",
        rent: "Alquiler",
        sale: "Venta",
      },
      sortOptions: {
        latest: "Más recientes",
        priceAsc: "Precio: menor a mayor",
        priceDesc: "Precio: mayor a menor",
        sizeDesc: "Superficie: mayor primero",
      },
    },
    hero: {
      ctaSubtitles: {
        browse: "Encuentra tu hogar ideal",
        guide: "Costes, pasos y plazos",
        owner: "Nos encargamos de todo",
      },
      eyebrow: "Viviendas en venta y alquiler en Torrevieja y la costa cercana",
      text:
        "Milla Homes ofrece una forma más personal de buscar en la Costa Blanca: viviendas bien seleccionadas, orientación más clara y acompañamiento cercano desde la primera selección hasta la visita.",
      title: "Encuentra tu lugar al sol.",
    },
    statement: {
      lead: "Vender, comprar o alquilar en la Costa Blanca:",
      tail: "estamos contigo en cada paso.",
    },
    inquiry: {
      email: "Correo electrónico",
      emailPlaceholder: "tu@correo.com",
      error: "Algo salió mal. Inténtalo de nuevo.",
      fullName: "Nombre completo",
      generalInquiry: "Consulta general",
      message: "Mensaje",
      messagePlaceholder: "Cuéntanos qué tipo de propiedad estás buscando.",
      optional: "Opcional",
      phone: "Teléfono",
      propertyInquiry: "Consulta sobre la propiedad",
      rateLimited: "Se han enviado demasiadas consultas en este momento. Espera unos minutos y vuelve a intentarlo.",
      requestViewing: "Solicitar visita",
      requestViewingPlaceholder: "Añade horarios, dudas o cualquier detalle útil para la visita.",
      requestViewingTemplate: "Hola, me gustaría solicitar una visita para {title} en {location}. Por favor, indíqueme qué horarios están disponibles.",
      sendingAria: "Enviando tu consulta sobre la propiedad",
      success: "Consulta enviada correctamente.",
      timeline: "Horario preferido para la visita",
      timelinePlaceholder: "Por ejemplo: esta semana, viernes por la tarde o el próximo martes",
      typeLabel: "Tipo de consulta",
      yourName: "Tu nombre",
    },
    languageLabel: "Elegir idioma",
    masonry: {
      eyebrow: "Explora viviendas disponibles",
      title: "Recorre la selección actual de venta y alquiler y abre las propiedades que mejor encajen con tu momento y tus prioridades.",
    },
    footer: {
      blurb: "Milla Homes ofrece una forma más tranquila y personal de explorar viviendas en venta y alquiler en Torrevieja y la costa cercana.",
      browseLabel: "Ver propiedades",
      copyright: "© Milla Homes",
    },
    neighborhoods: {
      cards: [
        {
          area: "Torrevieja",
          title: "Vida activa junto al puerto",
          summary: "Una mezcla amplia de apartamentos, villas y zonas caminables cerca del mar.",
        },
        {
          area: "La Mata",
          title: "Calma frente al mar y mucha luz",
          summary: "Conocida por sus vistas, sus paseos junto a la playa y un ritmo más sereno.",
        },
        {
          area: "Orihuela Costa",
          title: "Ambiente residencial con oferta sólida",
          summary: "Muy buscada por compradores internacionales que quieren costa y urbanizaciones cuidadas.",
        },
        {
          area: "Guardamar del Segura",
          title: "Entorno verde y ritmo más suave",
          summary: "Una zona costera más tranquila, con dunas, parques y viviendas más resguardadas.",
        },
      ],
      eyebrow: "Zonas destacadas",
      title: "Distintas partes de la costa, cada una con una forma de vivir diferente.",
    },
    nav: {
      about: "Nosotros",
      contact: "Contacto",
      owner: "Vender o alquilar",
      home: "Inicio",
      properties: "Propiedades",
      guide: "Guía de compra",
      collaborate: "Colabora",
    },
    overview: {
      body:
        "Los clientes reciben orientación honesta, un ritmo más calmado y anuncios explicados con claridad para comparar zonas, precios y fechas de alquiler con más seguridad.",
      eyebrow: "Lo que valoran los clientes",
      items: [
        {
          title: "Un trato más personal",
          copy: "Las conversaciones se centran en cómo quiere vivir, alojarse o invertir cada cliente, no en empujar la siguiente visita.",
        },
        {
          title: "Orientación clara y sin presión",
          copy: "Las viviendas, las zonas, los precios y los tiempos de alquiler se explican con más calma y menos ruido.",
        },
        {
          title: "Acompañamiento en cada paso",
          copy: "Desde la primera selección hasta la primera llamada, todo está pensado para transmitir confianza y practicidad.",
        },
      ],
      title: "La búsqueda se vuelve más clara cuando detrás hay confianza, contexto y criterio real.",
    },
    propertiesPage: {
      eyebrow: "Listado de propiedades",
      text: "Explora propiedades en venta y alquiler, filtra por zona y fechas, y abre cada anuncio con más detalle.",
      title: "Viviendas disponibles en venta y alquiler en Torrevieja y en la costa cercana.",
    },
    seo: {
      description: "Descubre propiedades en venta y alquiler en Torrevieja, La Mata, Orihuela Costa y otras zonas cercanas con la atención personal de Milla Homes.",
      ogDescription: "Explora una selección cuidada de viviendas en venta y alquiler en Torrevieja y la costa cercana.",
      ogTitle: "Milla Homes | Viviendas En Venta Y Alquiler En Torrevieja",
      title: "Milla Homes | Viviendas En Venta Y Alquiler En Torrevieja",
    },
    propertyMeta: {
      bathroomsShort: "baño",
      bedroomsShort: "hab",
      featuredSnapshot: "Propiedad destacada",
      homesOnline: "propiedades activas ahora",
      homesOnlineValue: "2",
      homesSelected: "viviendas destacadas ahora",
      homesSelectedValue: "1",
      homesSelectedLabel: "zonas costeras cubiertas",
      targetAreasValue: "4",
      updatedListings: "selección actual destacada",
    },
    testimonials: {
      eyebrow: "Experiencias",
      items: [
        {
          name: "James y Sarah Thornton",
          quote: "La búsqueda se sintió ordenada y tranquila desde el principio. Era fácil ver qué viviendas merecían de verdad una visita, y compramos en menos de un mes.",
          rating: 5,
          role: "Compra en Torrevieja · desde Reino Unido",
        },
        {
          name: "Marta Giménez",
          quote: "Tener claras las fechas disponibles y las diferencias entre zonas nos ayudó muchísimo a elegir con más seguridad. Todo se gestionó en español e inglés.",
          rating: 5,
          role: "Alquiler en Orihuela Costa",
        },
        {
          name: "Thomas Becker",
          quote: "Transmitía más cercanía que un portal genérico. Antes de escribir ya sentíamos confianza en la selección. Muy recomendable.",
          rating: 5,
          role: "Segunda residencia en La Zenia",
        },
      ],
      summary: "La diferencia se nota en el tono, en la claridad de cada anuncio y en la forma en que el proceso acompaña al cliente.",
      title: "Cuando la búsqueda está bien guiada, el cliente avanza con más calma y confianza.",
    },
  },
  uk: {
    brandSubtitle: "Нерухомість на Коста-Бланці",
    buttons: {
      browseProperties: "Дивитися об'єкти",
      callNow: "Зателефонувати",
      openListings: "Усі об'єкти",
      seeAllProperties: "Усі об'єкти",
      sendInquiry: "Надіслати запит",
      sending: "Надсилання...",
      viewDetails: "Детальніше",
      viewListing: "Дивитися об'єкт",
      whatsapp: "WhatsApp",
    },
    carousel: {
      closeZoom: "Закрити збільшене зображення",
      enlargeImage: "Відкрити збільшене зображення",
      galleryHint: "Гортайте, використовуйте стрілки або обирайте мініатюри.",
      thumbnailsLabel: "Мініатюри галереї",
      nextImage: "Показати наступне зображення",
      previousImage: "Показати попереднє зображення",
      showImage: "Показати зображення",
      zoomHint: "Використовуйте бічні стрілки або клавіатуру для перегляду галереї.",
    },
    contact: {
      availabilityLabel: "Зручно для",
      availabilityValue: "Дзвінків і WhatsApp",
      eyebrow: "Зв'язатися напряму",
      panelSummary: "Дзвінок або повідомлення у WhatsApp зазвичай допомагають швидше уточнити ціну, дати оренди та наступний крок.",
      panelTitle: "Хочете швидко уточнити ціну, дати чи перегляд?",
      phoneLabel: "Телефон",
      summary: "Коли об'єкт справді підходить, пряма розмова допомагає швидше закрити практичні питання.",
      title: "Зв'яжіться з агентом, коли вам потрібна ясність щодо об'єкта, доступності чи наступного кроку.",
      whatsappMessage: "Добрий день, мене зацікавив об'єкт на Milla Homes. Хотілося б отримати більше інформації.",
    },
    coverage: {
      eyebrow: "Більш особистий пошук",
      summary:
        "Купуєте ви, орендуєте чи порівнюєте обидва варіанти — сам процес має бути спокійним, зрозумілим і підлаштованим під ваш реальний спосіб життя на Коста-Бланці.",
      title: "Підбір нерухомості відчувається краще, коли в центрі уваги ваш ритм, ваші плани та ваші пріоритети.",
    },
    detail: {
      availability: "Доступність",
      bathrooms: "Ванні кімнати",
      bedrooms: "Спальні",
      features: "Особливості",
      interior: "Площа",
      listingOverview: "Огляд об'єкта",
      listingMode: "Формат",
      plot: "Ділянка",
      requestInfo: "Запитати інформацію",
      requestTitle: "Запитайте перегляд або додаткову інформацію.",
      rentPrice: "Оренда",
      rentalPeriods: "Формати оренди",
      salePrice: "Продаж",
      type: "Тип",
      whyPause: "Чому цей об'єкт привертає увагу.",
    },
    filters: {
      availableInventory: "Доступні об'єкти",
      availabilityFrom: "Доступно з",
      availabilityTo: "Доступно до",
      bathrooms: "Ванні кімнати",
      clearAll: "Скинути все",
      emptyBody: "Спробуйте розширити пошук або зменшити мінімум спалень.",
      emptyTitle: "За цими фільтрами поки нічого не знайдено.",
      features: "Зручності",
      heading: "Пошук нерухомості",
      listingMode: "Цікавить",
      listView: "Список",
      mapView: "Карта",
      moreFilters: "Більше фільтрів",
      lessFilters: "Менше фільтрів",
      max: "Макс",
      min: "Мін",
      mustHaveFeatures: "Обов'язкові особливості",
      minimumBedrooms: "Мінімум спалень",
      priceRange: "Ціна (€)",
      propertyType: "Тип нерухомості",
      region: "Район",
      results: "об'єктів знайдено.",
      search: "Пошук",
      searchPlaceholder: "Назва, район або код",
      sizeRange: "Площа (м²)",
      sort: "Сортування",
      title: "Знайдіть потрібний об'єкт швидше.",
      types: {
        all: "Усі типи",
        any: "Будь-який",
      },
      listingModeOptions: {
        both: "Продаж і оренда",
        rent: "Оренда",
        sale: "Продаж",
      },
      sortOptions: {
        latest: "Спочатку нові",
        priceAsc: "Ціна: за зростанням",
        priceDesc: "Ціна: за спаданням",
        sizeDesc: "Площа: спочатку більші",
      },
    },
    hero: {
      ctaSubtitles: {
        browse: "Знайдіть свій ідеальний дім",
        guide: "Витрати, кроки та строки",
        owner: "Ми подбаємо про все",
      },
      eyebrow: "Об'єкти для продажу та оренди в Торрев'єсі й поруч на узбережжі",
      text:
        "Milla Homes пропонує більш особистий підхід до пошуку на Коста-Бланці: ретельно підібрані об'єкти, зрозуміліший супровід і прямий зв'язок від першого шорт-листа до перегляду.",
      title: "Знайдіть своє місце під сонцем.",
    },
    statement: {
      lead: "Продати, купити чи орендувати на Коста-Бланці —",
      tail: "ми поруч на кожному кроці.",
    },
    inquiry: {
      email: "Електронна пошта",
      emailPlaceholder: "you@example.com",
      error: "Щось пішло не так. Спробуйте ще раз.",
      fullName: "Повне ім'я",
      generalInquiry: "Загальний запит",
      message: "Повідомлення",
      messagePlaceholder: "Розкажіть, яку нерухомість ви шукаєте.",
      optional: "Необов'язково",
      phone: "Телефон",
      propertyInquiry: "Запит щодо об'єкта",
      rateLimited: "Забагато запитів за короткий час. Зачекайте кілька хвилин і спробуйте знову.",
      requestViewing: "Запросити перегляд",
      requestViewingPlaceholder: "Додайте зручний час, запитання або будь-які деталі щодо перегляду.",
      requestViewingTemplate: "Добрий день, я хотів(ла) би записатися на перегляд об'єкта {title} у {location}. Підкажіть, будь ласка, які дати й час доступні.",
      sendingAria: "Надсилання запиту щодо об'єкта",
      success: "Запит успішно надіслано.",
      timeline: "Бажаний час перегляду",
      timelinePlaceholder: "Наприклад: цього тижня, у п'ятницю вдень або наступного вівторка",
      typeLabel: "Тип запиту",
      yourName: "Ваше ім'я",
    },
    languageLabel: "Оберіть мову",
    masonry: {
      eyebrow: "Дивитися доступні об'єкти",
      title: "Переглядайте актуальні пропозиції з продажу та оренди й відкривайте об'єкти, які найкраще підходять за термінами та пріоритетами.",
    },
    footer: {
      blurb: "Milla Homes допомагає шукати житло для купівлі та оренди в Торрев'єсі й на узбережжі поруч — спокійніше, уважніше та більш особисто.",
      browseLabel: "Дивитися об'єкти",
      copyright: "© Milla Homes",
    },
    neighborhoods: {
      cards: [
        {
          area: "Torrevieja",
          title: "Міське життя біля води",
          summary: "Широкий вибір апартаментів, вілл і районів, де зручно жити цілий рік.",
        },
        {
          area: "La Mata",
          title: "Пляжний ритм і більше світла",
          summary: "Район з морськими краєвидами, довгою набережною та спокійнішою атмосферою.",
        },
        {
          area: "Orihuela Costa",
          title: "Великий вибір біля узбережжя",
          summary: "Популярна зона серед міжнародних покупців завдяки курортній інфраструктурі та новим комплексам.",
        },
        {
          area: "Guardamar del Segura",
          title: "Зеленіша й тихіша сторона",
          summary: "Дюни, парки та м'якший темп життя для тих, хто хоче менше галасу.",
        },
      ],
      eyebrow: "Райони",
      title: "У кожної частини узбережжя свій темп, настрій і тип покупців.",
    },
    nav: {
      about: "Про нас",
      contact: "Контакти",
      owner: "Продати чи здати",
      home: "Головна",
      properties: "Об'єкти",
      guide: "Гід покупця",
      collaborate: "Співпраця",
    },
    overview: {
      body:
        "Клієнти отримують чесну підтримку, спокійніший ритм пошуку та подачу, з якою легше порівнювати райони, ціни та терміни оренди.",
      eyebrow: "Що цінують клієнти",
      items: [
        {
          title: "Більш особистий підхід",
          copy: "Розмова будується навколо того, як людина хоче жити, відпочивати чи інвестувати, а не навколо тиску та поспіху.",
        },
        {
          title: "Зрозуміло й без зайвого шуму",
          copy: "Різниця між об'єктами, районами, цінами та термінами оренди пояснюється спокійно й без зайвого шуму.",
        },
        {
          title: "Увага на кожному етапі",
          copy: "Від першого шорт-листа до першого дзвінка пошук вибудовано так, щоб людям було легше довіряти своєму вибору.",
        },
      ],
      title: "Коли за пошуком стоїть довіра, контекст і реальна допомога, ухвалювати рішення стає легше.",
    },
    propertiesPage: {
      eyebrow: "Каталог нерухомості",
      text: "Переглядайте об'єкти на продаж і в оренду, фільтруйте за районом і датами та відкривайте детальні картки.",
      title: "Доступні об'єкти для продажу та оренди в Торрев'єсі й на узбережжі поруч.",
    },
    seo: {
      description: "Переглядайте об'єкти на продаж і в оренду в Торрев'єсі, Ла-Маті, Оріуела-Кості та сусідніх прибережних районах разом із Milla Homes.",
      ogDescription: "Добірка об'єктів для продажу та оренди біля узбережжя Торрев'єхи з більш зрозумілою, особистою та спокійною подачею.",
      ogTitle: "Milla Homes | Продаж І Оренда В Торрев'єсі",
      title: "Milla Homes | Нерухомість Для Продажу Та Оренди В Торрев'єсі",
    },
    propertyMeta: {
      bathroomsShort: "ван.",
      bedroomsShort: "спал.",
      featuredSnapshot: "Обраний об'єкт",
      homesOnline: "активних об'єктів зараз",
      homesOnlineValue: "2",
      homesSelected: "виділених об'єктів зараз",
      homesSelectedValue: "1",
      homesSelectedLabel: "охоплених прибережних районів",
      targetAreasValue: "4",
      updatedListings: "актуальна добірка об'єктів",
    },
    testimonials: {
      eyebrow: "Враження клієнтів",
      items: [
        {
          name: "Джеймс і Сара Торнтон",
          quote: "Із самого початку пошук відчувався спокійним і зрозумілим. Одразу було видно, які об'єкти справді нам підходять — і ми купили за місяць.",
          rating: 5,
          role: "Купівля в Торрев'єсі · з Великої Британії",
        },
        {
          name: "Марта Хіменес",
          quote: "Дуже допомогло, що одразу були зрозумілі доступні дати й різниця між районами. Усе вели іспанською та англійською.",
          rating: 5,
          role: "Оренда в Оріуела-Кості",
        },
        {
          name: "Томас Беккер",
          quote: "Подача виглядала більш людяною, ніж на звичайних порталах. Ще до дзвінка ми були впевнені в добірці. Дуже рекомендую.",
          rating: 5,
          role: "Будинок для відпочинку в Ла-Сенії",
        },
      ],
      summary: "Коли пошук виглядає спокійним, зрозумілим і більш особистим, людям легше перейти від перегляду до реального контакту.",
      title: "Добре вибудуваний пошук запам'ятовується не менше, ніж самі об'єкти.",
    },
  },
  ru: {
    brandSubtitle: "Недвижимость на Коста-Бланке",
    buttons: {
      browseProperties: "Смотреть объекты",
      callNow: "Позвонить",
      openListings: "Все объекты",
      seeAllProperties: "Все объекты",
      sendInquiry: "Отправить запрос",
      sending: "Отправка...",
      viewDetails: "Подробнее",
      viewListing: "Смотреть объект",
      whatsapp: "WhatsApp",
    },
    carousel: {
      closeZoom: "Закрыть увеличенное изображение",
      enlargeImage: "Открыть увеличенное изображение",
      galleryHint: "Листайте, используйте стрелки или выбирайте миниатюры.",
      thumbnailsLabel: "Миниатюры галереи",
      nextImage: "Показать следующее изображение",
      previousImage: "Показать предыдущее изображение",
      showImage: "Показать изображение",
      zoomHint: "Используйте боковые стрелки или клавиатуру для просмотра галереи.",
    },
    contact: {
      availabilityLabel: "Удобно для",
      availabilityValue: "Звонков и WhatsApp",
      eyebrow: "Связаться напрямую",
      panelSummary: "Звонок или сообщение в WhatsApp обычно помогают быстрее уточнить цену, даты аренды и следующий шаг.",
      panelTitle: "Хотите быстро уточнить цену, даты или просмотр?",
      phoneLabel: "Телефон",
      summary: "Когда объект действительно подходит, прямой разговор помогает быстрее решить практические вопросы.",
      title: "Свяжитесь с нами напрямую, если нужно уточнить детали объекта, его доступность или следующий шаг.",
      whatsappMessage: "Здравствуйте, меня заинтересовал объект на Milla Homes. Хотелось бы получить больше информации.",
    },
    coverage: {
      eyebrow: "Более личный поиск",
      summary:
        "Покупаете ли вы, арендуете или сравниваете оба варианта, сам процесс должен быть спокойным, понятным и подстроенным под ваш реальный образ жизни на Коста-Бланке.",
      title: "Подбор недвижимости ощущается лучше, когда в центре внимания ваш ритм, ваши планы и ваши приоритеты.",
    },
    detail: {
      availability: "Доступность",
      bathrooms: "Ванные",
      bedrooms: "Спальни",
      features: "Особенности",
      interior: "Площадь",
      listingOverview: "Обзор объекта",
      listingMode: "Формат",
      plot: "Участок",
      requestInfo: "Запросить информацию",
      requestTitle: "Запросите просмотр или дополнительную информацию.",
      rentPrice: "Аренда",
      rentalPeriods: "Форматы аренды",
      salePrice: "Продажа",
      type: "Тип",
      whyPause: "Почему этот объект привлекает внимание.",
    },
    filters: {
      availableInventory: "Доступные объекты",
      availabilityFrom: "Доступно с",
      availabilityTo: "Доступно до",
      bathrooms: "Ванные",
      clearAll: "Сбросить всё",
      emptyBody: "Попробуйте расширить поиск или уменьшить минимум по спальням.",
      emptyTitle: "По этим фильтрам пока ничего не найдено.",
      features: "Удобства",
      heading: "Поиск недвижимости",
      listingMode: "Интересует",
      listView: "Список",
      mapView: "Карта",
      moreFilters: "Больше фильтров",
      lessFilters: "Меньше фильтров",
      max: "Макс",
      min: "Мин",
      mustHaveFeatures: "Обязательные особенности",
      minimumBedrooms: "Минимум спален",
      priceRange: "Цена (€)",
      propertyType: "Тип недвижимости",
      region: "Район",
      results: "объектов найдено.",
      search: "Поиск",
      searchPlaceholder: "Название, район или код",
      sizeRange: "Площадь (м²)",
      sort: "Сортировка",
      title: "Найдите нужный объект быстрее.",
      types: {
        all: "Все типы",
        any: "Любой",
      },
      listingModeOptions: {
        both: "Продажа и аренда",
        rent: "Аренда",
        sale: "Продажа",
      },
      sortOptions: {
        latest: "Сначала новые",
        priceAsc: "Цена: по возрастанию",
        priceDesc: "Цена: по убыванию",
        sizeDesc: "Площадь: сначала большие",
      },
    },
    hero: {
      ctaSubtitles: {
        browse: "Найдите свой идеальный дом",
        guide: "Расходы, шаги и сроки",
        owner: "Мы позаботимся обо всём",
      },
      eyebrow: "Объекты для продажи и аренды в Торревьехе и на ближайшем побережье",
      text:
        "Milla Homes — это личный подход к поиску недвижимости на Коста-Бланке: тщательно подобранные объекты, понятное сопровождение и прямая связь с нами от первой подборки до просмотра.",
      title: "Найдите своё место под солнцем.",
    },
    statement: {
      lead: "Продать, купить или арендовать на Коста-Бланке —",
      tail: "мы рядом на каждом шагу.",
    },
    inquiry: {
      email: "Электронная почта",
      emailPlaceholder: "you@example.com",
      error: "Что-то пошло не так. Попробуйте еще раз.",
      fullName: "Полное имя",
      generalInquiry: "Общий запрос",
      message: "Сообщение",
      messagePlaceholder: "Расскажите, какую недвижимость вы ищете.",
      optional: "Необязательно",
      phone: "Телефон",
      propertyInquiry: "Запрос по объекту",
      rateLimited: "Слишком много запросов за короткое время. Подождите несколько минут и попробуйте снова.",
      requestViewing: "Запросить просмотр",
      requestViewingPlaceholder: "Добавьте удобное время, вопросы или любые детали по просмотру.",
      requestViewingTemplate: "Здравствуйте, я хотел(а) бы запросить просмотр объекта {title} в {location}. Подскажите, пожалуйста, какие даты и время доступны.",
      sendingAria: "Отправка запроса по объекту",
      success: "Запрос успешно отправлен.",
      timeline: "Предпочтительное время просмотра",
      timelinePlaceholder: "Например: на этой неделе, в пятницу днем или в следующий вторник",
      typeLabel: "Тип запроса",
      yourName: "Ваше имя",
    },
    languageLabel: "Выберите язык",
    masonry: {
      eyebrow: "Смотреть доступные объекты",
      title: "Изучайте актуальные предложения по продаже и аренде и открывайте объекты, которые лучше всего подходят по срокам и приоритетам.",
    },
    footer: {
      blurb: "Milla Homes помогает покупать и арендовать жильё в Торревьехе и на ближайшем побережье — спокойно, внимательно и с личным подходом.",
      browseLabel: "Смотреть объекты",
      copyright: "© Milla Homes",
    },
    neighborhoods: {
      cards: [
        {
          area: "Torrevieja",
          title: "Городская жизнь у воды",
          summary: "Широкий выбор апартаментов, вилл и районов, где удобно жить круглый год.",
        },
        {
          area: "La Mata",
          title: "Пляжный ритм и больше света",
          summary: "Район с морскими видами, длинной набережной и более спокойной атмосферой.",
        },
        {
          area: "Orihuela Costa",
          title: "Сильный выбор у побережья",
          summary: "Популярная зона среди международных покупателей благодаря курортной инфраструктуре и новому фонду.",
        },
        {
          area: "Guardamar del Segura",
          title: "Более зеленая и тихая сторона",
          summary: "Дюны, парки и более мягкий темп жизни для тех, кто хочет меньше шума.",
        },
      ],
      eyebrow: "Районы",
      title: "У каждого участка побережья свой темп, настроение и тип покупателей.",
    },
    nav: {
      about: "О нас",
      contact: "Контакты",
      owner: "Продать или сдать",
      home: "Главная",
      properties: "Объекты",
      guide: "Гид покупателя",
      collaborate: "Сотрудничество",
    },
    overview: {
      body:
        "Клиенты получают честную поддержку, спокойный ритм поиска и понятную подачу объектов, с которой проще сравнивать районы, цены и условия аренды.",
      eyebrow: "Что ценят клиенты",
      items: [
        {
          title: "Более личный подход",
          copy: "Разговор строится вокруг того, как человек хочет жить, отдыхать или инвестировать, а не вокруг давления и спешки.",
        },
        {
          title: "Понятно и без лишнего шума",
          copy: "Мы спокойно объясняем разницу между объектами, районами, ценами и условиями аренды — без давления и информационного шума.",
        },
        {
          title: "Внимание на каждом этапе",
          copy: "От первой подборки до первого звонка мы выстраиваем поиск так, чтобы вы были уверены в своём выборе.",
        },
      ],
      title: "Когда за поиском стоит доверие, контекст и реальная помощь, принимать решение становится легче.",
    },
    propertiesPage: {
      eyebrow: "Каталог недвижимости",
      text: "Смотрите объекты на продажу и в аренду, фильтруйте по району и датам и открывайте подробные карточки.",
      title: "Объекты для продажи и аренды в Торревьехе и на ближайшем побережье.",
    },
    seo: {
      description: "Смотрите объекты на продажу и в аренду в Торревьехе, Ла Мата, Ориуэла Коста и соседних прибрежных районах вместе с Milla Homes.",
      ogDescription: "Подборка объектов для продажи и аренды на побережье Торревьехи — понятно, спокойно и с личным подходом.",
      ogTitle: "Milla Homes | Продажа и аренда недвижимости в Торревьехе",
      title: "Milla Homes | Недвижимость для продажи и аренды в Торревьехе",
    },
    propertyMeta: {
      bathroomsShort: "ван.",
      bedroomsShort: "спал.",
      featuredSnapshot: "Выбранный объект",
      homesOnline: "активных объектов сейчас",
      homesOnlineValue: "2",
      homesSelected: "выделенных объектов сейчас",
      homesSelectedValue: "1",
      homesSelectedLabel: "охваченных прибрежных районов",
      targetAreasValue: "4",
      updatedListings: "актуальная подборка объектов",
    },
    testimonials: {
      eyebrow: "Впечатления клиентов",
      items: [
        {
          name: "Джеймс и Сара Торнтон",
          quote: "С самого начала поиск ощущался спокойным и понятным. Сразу было видно, какие объекты действительно нам подходят — и мы купили за месяц.",
          rating: 5,
          role: "Покупка в Торревьехе · из Великобритании",
        },
        {
          name: "Марта Хименес",
          quote: "Очень помогло, что сразу были понятны доступные даты и разница между районами. Всё общение шло на испанском и английском.",
          rating: 5,
          role: "Аренда в Ориуэла-Коста",
        },
        {
          name: "Томас Беккер",
          quote: "Подача выглядела более человечной, чем на обычных порталах. Ещё до звонка мы были уверены в подборке. Очень рекомендую.",
          rating: 5,
          role: "Дом для отдыха в Ла-Зении",
        },
      ],
      summary: "Когда поиск устроен спокойно, понятно и по-человечески, людям проще сделать следующий шаг и связаться с нами.",
      title: "Хорошо выстроенный поиск запоминается не меньше, чем сами объекты.",
    },
  },
  de: {
    brandSubtitle: "Häuser An Der Costa Blanca",
    buttons: {
      browseProperties: "Immobilien ansehen",
      callNow: "Jetzt anrufen",
      openListings: "Alle Immobilien öffnen",
      seeAllProperties: "Alle ansehen",
      sendInquiry: "Anfrage senden",
      sending: "Wird gesendet...",
      viewDetails: "Details ansehen",
      viewListing: "Objekt ansehen",
      whatsapp: "WhatsApp",
    },
    carousel: {
      closeZoom: "Zoomansicht schließen",
      enlargeImage: "Vergrößertes Bild öffnen",
      galleryHint: "Wischen, Pfeile nutzen oder ein Vorschaubild wählen.",
      thumbnailsLabel: "Vorschaubilder der Galerie",
      nextImage: "Nächstes Bild anzeigen",
      previousImage: "Vorheriges Bild anzeigen",
      showImage: "Bild anzeigen",
      zoomHint: "Mit den seitlichen Pfeilen oder der Tastatur durch die Galerie gehen.",
    },
    contact: {
      availabilityLabel: "Am besten für",
      availabilityValue: "Anrufe und WhatsApp",
      eyebrow: "Direkt sprechen",
      panelSummary: "Ein kurzer Anruf oder eine WhatsApp-Nachricht ist oft der schnellste Weg, um Preis, Mietzeitraum oder den nächsten Schritt zu klären.",
      panelTitle: "Sie möchten Preis, Termine oder Besichtigung schnell klären?",
      phoneLabel: "Telefon",
      summary: "Wenn eine Immobilie wirklich interessant wirkt, lassen sich praktische Fragen im direkten Gespräch meist schneller klären.",
      title: "Sprechen Sie direkt mit Ihrer Ansprechpartnerin, wenn Sie Klarheit zu Objekt, Verfügbarkeit oder dem nächsten Schritt möchten.",
      whatsappMessage: "Hallo, ich interessiere mich für eine Immobilie von Milla Homes und hätte gern weitere Informationen.",
    },
    coverage: {
      eyebrow: "Eine persönlichere Suche",
      summary:
        "Ob Kauf, Miete oder beides im Vergleich: Die Suche sollte ruhig, klar und auf die tatsächlichen Lebenspläne an der Costa Blanca abgestimmt sein.",
      title: "Immobilienberatung fühlt sich besser an, wenn sie bei Ihrem Tempo, Ihren Plänen und Ihren Prioritäten beginnt.",
    },
    detail: {
      availability: "Verfügbarkeit",
      bathrooms: "Bäder",
      bedrooms: "Schlafzimmer",
      features: "Merkmale",
      interior: "Wohnfläche",
      listingOverview: "Objektüberblick",
      listingMode: "Angebotsart",
      plot: "Grundstück",
      requestInfo: "Mehr Informationen anfragen",
      requestTitle: "Fragen Sie einen Besichtigungstermin oder weitere Details an.",
      rentPrice: "Miete",
      rentalPeriods: "Mietzeiträume",
      salePrice: "Kauf",
      type: "Typ",
      whyPause: "Warum dieses Objekt im Gedächtnis bleibt.",
    },
    filters: {
      availableInventory: "Verfügbare Immobilien",
      availabilityFrom: "Verfügbar ab",
      availabilityTo: "Verfügbar bis",
      bathrooms: "Badezimmer",
      clearAll: "Alle zurücksetzen",
      emptyBody: "Versuchen Sie eine breitere Suche oder weniger Schlafzimmer als Minimum.",
      emptyTitle: "Zu diesen Filtern wurden noch keine Immobilien gefunden.",
      features: "Ausstattung",
      heading: "Immobiliensuche",
      listingMode: "Gesucht",
      listView: "Liste",
      mapView: "Karte",
      moreFilters: "Mehr Filter",
      lessFilters: "Weniger Filter",
      max: "Max",
      min: "Min",
      mustHaveFeatures: "Wichtige Merkmale",
      minimumBedrooms: "Mindestens Schlafzimmer",
      priceRange: "Preis (€)",
      propertyType: "Objektart",
      region: "Region",
      results: "Immobilien passen aktuell.",
      search: "Suche",
      searchPlaceholder: "Titel, Ort oder Referenz",
      sizeRange: "Fläche (m²)",
      sort: "Sortieren",
      title: "Schneller zur passenden Immobilie.",
      types: {
        all: "Alle Arten",
        any: "Beliebig",
      },
      listingModeOptions: {
        both: "Kauf und Miete",
        rent: "Miete",
        sale: "Kauf",
      },
      sortOptions: {
        latest: "Neueste",
        priceAsc: "Preis: aufsteigend",
        priceDesc: "Preis: absteigend",
        sizeDesc: "Fläche: größte zuerst",
      },
    },
    hero: {
      ctaSubtitles: {
        browse: "Finden Sie Ihr ideales Zuhause",
        guide: "Kosten, Schritte und Fristen",
        owner: "Wir kümmern uns um alles",
      },
      eyebrow: "Immobilien zum Kauf und zur Miete in Torrevieja und an der nahen Küste",
      text:
        "Milla Homes steht für einen persönlicheren Weg der Suche an der Costa Blanca: sorgfältig ausgewählte Angebote, klarere Begleitung und direkte Unterstützung vom ersten Shortlist-Moment bis zur Besichtigung.",
      title: "Finden Sie Ihren Platz an der Sonne.",
    },
    statement: {
      lead: "Verkaufen, kaufen oder mieten an der Costa Blanca –",
      tail: "wir begleiten Sie bei jedem Schritt.",
    },
    inquiry: {
      email: "E-Mail-Adresse",
      emailPlaceholder: "you@example.com",
      error: "Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.",
      fullName: "Vollständiger Name",
      generalInquiry: "Allgemeine Anfrage",
      message: "Nachricht",
      messagePlaceholder: "Teilen Sie uns mit, nach welcher Immobilie Sie suchen.",
      optional: "Optional",
      phone: "Telefonnummer",
      propertyInquiry: "Anfrage zur Immobilie",
      rateLimited: "Es wurden gerade zu viele Anfragen gesendet. Bitte warten Sie einige Minuten und versuchen Sie es erneut.",
      requestViewing: "Besichtigung anfragen",
      requestViewingPlaceholder: "Ergänzen Sie gewünschte Zeiten, Fragen oder Hinweise zur Besichtigung.",
      requestViewingTemplate: "Hallo, ich möchte gern eine Besichtigung für {title} in {location} anfragen. Bitte teilen Sie mir mit, welche Termine verfügbar sind.",
      sendingAria: "Ihre Immobilienanfrage wird gesendet",
      success: "Anfrage erfolgreich gesendet.",
      timeline: "Bevorzugte Besichtigungszeit",
      timelinePlaceholder: "Zum Beispiel: diese Woche, Freitag Nachmittag oder nächsten Dienstag",
      typeLabel: "Anfrageart",
      yourName: "Ihr Name",
    },
    languageLabel: "Sprache wählen",
    masonry: {
      eyebrow: "Verfügbare Immobilien entdecken",
      title: "Durchstöbern Sie aktuelle Kauf- und Mietangebote und öffnen Sie die Objekte, die am besten zu Ihrem Zeitplan und Ihren Prioritäten passen.",
    },
    footer: {
      blurb: "Milla Homes begleitet die Suche nach Kauf- und Mietimmobilien in Torrevieja und an der nahen Küste auf eine persönlichere und ruhigere Weise.",
      browseLabel: "Immobilien ansehen",
      copyright: "© Milla Homes",
    },
    neighborhoods: {
      cards: [
        {
          area: "Torrevieja",
          title: "Ganzjähriges Leben am Wasser",
          summary: "Ein breiter Mix aus Apartments, Villen und gut angebundenen Wohnlagen nahe der Promenade.",
        },
        {
          area: "La Mata",
          title: "Mehr Ruhe direkt am Strand",
          summary: "Bekannt für Meerblick, lange Strandwege und ein etwas entspannteres Wohngefühl.",
        },
        {
          area: "Orihuela Costa",
          title: "Starke Auswahl an der Küste",
          summary: "Beliebt bei internationalen Käufern, die gepflegte Anlagen und Küstennähe suchen.",
        },
        {
          area: "Guardamar del Segura",
          title: "Grüner, weicher, ruhiger",
          summary: "Eine leisere Küstenlage mit Dünen, Parks und Häusern, die etwas geschützter wirken.",
        },
      ],
      eyebrow: "Lagen",
      title: "Jeder Teil der Küste hat seine eigene Stimmung und spricht andere Käufer an.",
    },
    nav: {
      about: "Über uns",
      contact: "Kontakt",
      owner: "Verkaufen oder vermieten",
      home: "Start",
      properties: "Immobilien",
      guide: "Kaufratgeber",
      collaborate: "Zusammenarbeit",
    },
    overview: {
      body:
        "Kundinnen und Kunden erhalten ehrliche Begleitung, ein ruhigeres Tempo und eine Darstellung, die Vergleiche zwischen Lagen, Preisen und Mietzeiträumen leichter macht.",
      eyebrow: "Was Kunden schätzen",
      items: [
        {
          title: "Ein persönlicherer Umgang",
          copy: "Gespräche orientieren sich daran, wie jemand leben, wohnen oder investieren möchte, nicht nur am nächsten Besichtigungstermin.",
        },
        {
          title: "Klarheit ohne Druck",
          copy: "Objekte, Lagen, Preise und Mietzeiträume werden ruhig erklärt, damit Entscheidungen mit mehr Sicherheit getroffen werden können.",
        },
        {
          title: "Begleitung in jedem Schritt",
          copy: "Von der ersten Auswahl bis zum ersten Gespräch ist der Ablauf darauf ausgelegt, Vertrauen und Orientierung aufzubauen.",
        },
      ],
      title: "Mit Vertrauen, Kontext und echter Begleitung wird auch die Entscheidung selbst klarer.",
    },
    propertiesPage: {
      eyebrow: "Immobilienübersicht",
      text: "Durchsuchen Sie aktuelle Kauf- und Mietangebote, filtern Sie nach Region und Daten und öffnen Sie jede Immobilie im Detail.",
      title: "Verfügbare Immobilien zum Kauf und zur Miete in Torrevieja und an der umliegenden Küste.",
    },
    seo: {
      description: "Entdecken Sie Kauf- und Mietimmobilien in Torrevieja, La Mata, Orihuela Costa und weiteren Küstenlagen mit persönlicher Begleitung von Milla Homes.",
      ogDescription: "Ausgewählte Kauf- und Mietimmobilien an der Costa Blanca, klar, persönlich und hochwertig präsentiert.",
      ogTitle: "Milla Homes | Immobilien Zum Kauf Und Zur Miete In Torrevieja",
      title: "Milla Homes | Immobilien Zum Kauf Und Zur Miete In Torrevieja",
    },
    propertyMeta: {
      bathroomsShort: "Bad",
      bedroomsShort: "SZ",
      featuredSnapshot: "Ausgewähltes Objekt",
      homesOnline: "aktive Immobilien online",
      homesOnlineValue: "2",
      homesSelected: "aktuell hervorgehobene Objekte",
      homesSelectedValue: "1",
      homesSelectedLabel: "abgedeckte Küstenlagen",
      targetAreasValue: "4",
      updatedListings: "aktuell hervorgehobene Angebote",
    },
    testimonials: {
      eyebrow: "Stimmen zum Ablauf",
      items: [
        {
          name: "James & Sarah Thornton",
          quote: "Die Suche wirkte von Anfang an ruhig und gut strukturiert. Wir erkannten schnell, welche Objekte wirklich passten — und kauften innerhalb eines Monats.",
          rating: 5,
          role: "Kauf in Torrevieja · aus Großbritannien",
        },
        {
          name: "Marta Giménez",
          quote: "Besonders hilfreich waren die klaren Hinweise zu Verfügbarkeit und Lage. Alles wurde auf Spanisch und Englisch abgewickelt.",
          rating: 5,
          role: "Miete in Orihuela Costa",
        },
        {
          name: "Thomas Becker",
          quote: "Es wirkte persönlicher als auf klassischen Portalen. Schon vor der Anfrage hatten wir Vertrauen in die Auswahl. Sehr zu empfehlen.",
          rating: 5,
          role: "Ferienimmobilie in La Zenia",
        },
      ],
      summary: "Der Unterschied zeigt sich im Ton, in der Klarheit der Exposés und darin, wie ruhig der Weg zur Anfrage geführt wird.",
      title: "Eine gut geführte Immobiliensuche gibt Kundinnen und Kunden Sicherheit statt Überforderung.",
    },
  },
};

export function getLocalizedPropertyTypeLabel(locale: PublicLocale, type: string) {
  const labels = {
    en: {
      apartment: "Apartment",
      bungalow: "Bungalow",
      finca: "Finca",
      penthouse: "Penthouse",
      townhouse: "Townhouse",
      villa: "Villa",
    },
    es: {
      apartment: "Apartamento",
      bungalow: "Bungaló",
      finca: "Finca",
      penthouse: "Ático",
      townhouse: "Adosado",
      villa: "Villa",
    },
    ru: {
      apartment: "Апартаменты",
      bungalow: "Бунгало",
      finca: "Финка",
      penthouse: "Пентхаус",
      townhouse: "Таунхаус",
      villa: "Вилла",
    },
    uk: {
      apartment: "Апартаменти",
      bungalow: "Бунгало",
      finca: "Фінка",
      penthouse: "Пентхаус",
      townhouse: "Таунхаус",
      villa: "Вілла",
    },
    de: {
      apartment: "Apartment",
      bungalow: "Bungalow",
      finca: "Finca",
      penthouse: "Penthouse",
      townhouse: "Reihenhaus",
      villa: "Villa",
    },
  } as const;

  return labels[locale][type as keyof (typeof labels)[typeof locale]] ?? type;
}

export function getLocalizedPropertyStatusLabel(locale: PublicLocale, status: string) {
  const labels = {
    en: { available: "Available", draft: "Draft", reserved: "Reserved", sold: "Sold" },
    es: { available: "Disponible", draft: "Borrador", reserved: "Reservada", sold: "Vendida" },
    ru: { available: "Доступно", draft: "Черновик", reserved: "Забронировано", sold: "Продано" },
    uk: { available: "Доступно", draft: "Чернетка", reserved: "Заброньовано", sold: "Продано" },
    de: { available: "Verfügbar", draft: "Entwurf", reserved: "Reserviert", sold: "Verkauft" },
  } as const;

  return labels[locale][status as keyof (typeof labels)[typeof locale]] ?? status;
}

export function getLocalizedListingModeLabel(locale: PublicLocale, mode: string) {
  const labels = {
    en: { both: "Sale and rent", rent: "Rent", sale: "Sale" },
    es: { both: "Venta y alquiler", rent: "Alquiler", sale: "Venta" },
    ru: { both: "Продажа и аренда", rent: "Аренда", sale: "Продажа" },
    uk: { both: "Продаж і оренда", rent: "Оренда", sale: "Продаж" },
    de: { both: "Kauf und Miete", rent: "Miete", sale: "Kauf" },
  } as const;

  return labels[locale][mode as keyof (typeof labels)[typeof locale]] ?? mode;
}

export function getLocalizedRentPricePeriodLabel(locale: PublicLocale, period: string) {
  const labels = {
    en: { month: "per month", night: "per night", week: "per week" },
    es: { month: "al mes", night: "por noche", week: "por semana" },
    ru: { month: "в месяц", night: "за ночь", week: "в неделю" },
    uk: { month: "на місяць", night: "за ніч", week: "на тиждень" },
    de: { month: "pro Monat", night: "pro Nacht", week: "pro Woche" },
  } as const;

  return labels[locale][period as keyof (typeof labels)[typeof locale]] ?? period;
}

export function getLocalizedRentalPeriodLabel(locale: PublicLocale, period: string) {
  const labels = {
    en: {
      long_term: "Long term",
      monthly: "Monthly",
      nightly: "Nightly",
      seasonal: "Seasonal",
      weekly: "Weekly",
    },
    es: {
      long_term: "Larga estancia",
      monthly: "Mensual",
      nightly: "Por noches",
      seasonal: "Temporada",
      weekly: "Semanal",
    },
    ru: {
      long_term: "Долгосрочно",
      monthly: "Помесячно",
      nightly: "Посуточно",
      seasonal: "По сезонам",
      weekly: "Понедельно",
    },
    uk: {
      long_term: "Довгостроково",
      monthly: "Помісячно",
      nightly: "Подобово",
      seasonal: "Посезонно",
      weekly: "Потижнево",
    },
    de: {
      long_term: "Langfristig",
      monthly: "Monatlich",
      nightly: "Nächte",
      seasonal: "Saisonal",
      weekly: "Wöchentlich",
    },
  } as const;

  return labels[locale][period as keyof (typeof labels)[typeof locale]] ?? period;
}

export function getLocalizedPropertyFeatureLabel(locale: PublicLocale, feature: string) {
  const labels = {
    en: {
      air_conditioning: "Air conditioning",
      furnished: "Furnished",
      garage: "Garage",
      garden: "Garden",
      gated_community: "Gated community",
      heating: "Heating",
      lift: "Lift",
      new_build: "New build",
      parking: "Parking",
      pet_friendly: "Pet friendly",
      pool: "Pool",
      sauna: "Sauna",
      sea_view: "Sea view",
      terrace: "Terrace",
      tourist_license: "Tourist license",
    },
    es: {
      air_conditioning: "Aire acondicionado",
      furnished: "Amueblado",
      garage: "Garaje",
      garden: "Jardín",
      gated_community: "Urbanización cerrada",
      heating: "Calefacción",
      lift: "Ascensor",
      new_build: "Obra nueva",
      parking: "Parking",
      pet_friendly: "Acepta mascotas",
      pool: "Piscina",
      sauna: "Sauna",
      sea_view: "Vistas al mar",
      terrace: "Terraza",
      tourist_license: "Licencia turística",
    },
    uk: {
      air_conditioning: "Кондиціонер",
      furnished: "З меблями",
      garage: "Гараж",
      garden: "Сад",
      gated_community: "Закрита урбанізація",
      heating: "Опалення",
      lift: "Ліфт",
      new_build: "Новобудова",
      parking: "Паркінг",
      pet_friendly: "Можна з тваринами",
      pool: "Басейн",
      sauna: "Сауна",
      sea_view: "Вид на море",
      terrace: "Тераса",
      tourist_license: "Туристична ліцензія",
    },
    ru: {
      air_conditioning: "Кондиционер",
      furnished: "С мебелью",
      garage: "Гараж",
      garden: "Сад",
      gated_community: "Закрытая урбанизация",
      heating: "Отопление",
      lift: "Лифт",
      new_build: "Новостройка",
      parking: "Парковка",
      pet_friendly: "Можно с животными",
      pool: "Бассейн",
      sauna: "Сауна",
      sea_view: "Вид на море",
      terrace: "Терраса",
      tourist_license: "Туристическая лицензия",
    },
    de: {
      air_conditioning: "Klimaanlage",
      furnished: "Möbliert",
      garage: "Garage",
      garden: "Garten",
      gated_community: "Geschlossene Anlage",
      heating: "Heizung",
      lift: "Aufzug",
      new_build: "Neubau",
      parking: "Stellplatz",
      pet_friendly: "Haustierfreundlich",
      pool: "Pool",
      sauna: "Sauna",
      sea_view: "Meerblick",
      terrace: "Terrasse",
      tourist_license: "Touristenlizenz",
    },
  } as const;

  return labels[locale][feature as keyof (typeof labels)[typeof locale]] ?? feature;
}

export function getLocalizedResultsLabel(locale: PublicLocale, count: number) {
  if (locale === "uk") {
    const mod10 = count % 10;
    const mod100 = count % 100;

    if (mod10 === 1 && mod100 !== 11) {
      return `${count} об'єкт знайдено`;
    }

    if (mod10 >= 2 && mod10 <= 4 && !(mod100 >= 12 && mod100 <= 14)) {
      return `${count} об'єкти знайдено`;
    }

    return `${count} об'єктів знайдено`;
  }

  if (locale === "ru") {
    const mod10 = count % 10;
    const mod100 = count % 100;

    if (mod10 === 1 && mod100 !== 11) {
      return `${count} объект найден`;
    }

    if (mod10 >= 2 && mod10 <= 4 && !(mod100 >= 12 && mod100 <= 14)) {
      return `${count} объекта найдено`;
    }

    return `${count} объектов найдено`;
  }

  if (locale === "es") {
    return count === 1 ? "1 propiedad coincide." : `${count} propiedades coinciden.`;
  }

  if (locale === "de") {
    return count === 1 ? "1 Immobilie passt aktuell." : `${count} Immobilien passen aktuell.`;
  }

  return count === 1 ? "1 property currently matches." : `${count} properties currently match.`;
}
