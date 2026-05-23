import { resolvePublicLocale, type PublicLocale } from "@/lib/public-copy";

export const adminLocales: PublicLocale[] = ["en", "es", "ru"];

export type AdminCopy = {
  accessibility: {
    title: string;
    body: string;
    items: string[];
  };
  dashboard: {
    actions: {
      createFirst: string;
      newListing: string;
      viewPublicSite: string;
    };
    emptyBody: string;
    emptyTitle: string;
    heroBody: string;
    heroEyebrow: string;
    heroTitle: (count: number) => string;
    inquiries: {
      email: string;
      empty: string;
      eyebrow: string;
      message: string;
      phone: string;
      preferredTime: string;
      property: string;
      reply: string;
      title: string;
    };
    listingsEyebrow: string;
    listingsTitle: string;
    stats: {
      drafts: string;
      draftsBody: string;
      featured: string;
      featuredBody: string;
      public: string;
      publicBody: string;
    };
    table: {
      listing: string;
      location: string;
      price: string;
      status: string;
      type: string;
    };
  };
  form: {
    actions: {
      create: string;
      delete: string;
      save: string;
      viewPublicPage: string;
    };
    checkboxFeatured: string;
    editBody: string;
    editEyebrow: string;
    featureLabels: Record<string, string>;
    fields: {
      availabilityEnd: string;
      availabilityStart: string;
      bathrooms: string;
      bedrooms: string;
      description: string;
      features: string;
      galleryImages: string;
      interior: string;
      internalNotes: string;
      listingMode: string;
      location: string;
      mainImage: string;
      plot: string;
      price: string;
      reference: string;
      rentPrice: string;
      rentPricePeriod: string;
      rentalPeriods: string;
      shortDescription: string;
      slug: string;
      status: string;
      title: string;
      type: string;
    };
    fieldNotes: {
      availability: string;
      features: string;
      galleryImages: string;
      internalNotes: string;
      mainImage: string;
      reference: string;
      rentalPeriods: string;
      slug: string;
    };
    importer: {
      body: string;
      cta: string;
      placeholder: string;
      reset: string;
      title: string;
    };
    listingModeLabels: Record<string, string>;
    newBody: string;
    newEyebrow: string;
    newTitle: string;
    placeholders: {
      description: string;
      imageUrl: string;
      internalNotes: string;
      location: string;
      shortDescription: string;
      title: string;
    };
    rentPricePeriodLabels: Record<string, string>;
    rentalPeriodLabels: Record<string, string>;
  };
  languageLabel: string;
  layout: {
    adminLabel: string;
    dashboard: string;
    missingConfigBody: string;
    missingConfigTitle: string;
    newListing: string;
    signOut: string;
    title: string;
    viewSite: string;
  };
  login: {
    body: string;
    email: string;
    emailPlaceholder: string;
    envError: string;
    loginErrorFallback: string;
    password: string;
    privateAdmin: string;
    setupBody: string;
    setupTitle: string;
    signingIn: string;
    submit: string;
    title: string;
    unauthorized: string;
  };
  statusLabels: {
    available: string;
    draft: string;
    reserved: string;
    sold: string;
  };
  typeLabels: {
    apartment: string;
    bungalow: string;
    finca: string;
    penthouse: string;
    townhouse: string;
    villa: string;
  };
  upload: {
    compressingImage: string;
    convertingImage: string;
    fileTooLarge: string;
    galleryPlaceholder: string;
    imagePlaceholder: string;
    imageUploaded: string;
    uploadFailed: string;
    uploadGallery: string;
    uploadImage: string;
    uploading: string;
    uploadedCount: string;
    videoTooLarge: string;
  };
};

export function resolveAdminLocale(value?: string | null): PublicLocale {
  const locale = resolvePublicLocale(value);

  return adminLocales.includes(locale) ? locale : "en";
}

export const adminCopy: Record<PublicLocale, AdminCopy> = {
  en: {
    accessibility: {
      title: "For an easier daily workflow",
      body: "The admin panel is designed so she can use buttons, uploads, and clear form labels instead of touching URLs or technical settings.",
      items: [
        "Use New listing to add a property from one guided form.",
        "Type the title first; the reference and public URL are created automatically.",
        "Upload images from the computer instead of pasting image links.",
      ],
    },
    dashboard: {
      actions: { createFirst: "Create first listing", newListing: "New listing", viewPublicSite: "View public site" },
      emptyBody: "Create the first property, add images, and mark it available when it is ready for the public site.",
      emptyTitle: "No listings yet",
      heroBody:
        "Keep the public site fresh from one calmer workspace. Drafts stay private, while available and reserved homes can appear across the live property pages.",
      heroEyebrow: "Inventory Overview",
      heroTitle: (count) => `${count} properties in the system`,
      inquiries: {
        email: "Email",
        empty: "New customer messages and viewing requests will appear here.",
        eyebrow: "Customer Contact",
        message: "Message",
        phone: "Phone",
        preferredTime: "Preferred viewing time",
        property: "Property",
        reply: "Reply",
        title: "Recent inquiries",
      },
      listingsEyebrow: "Listings",
      listingsTitle: "Manage inventory",
      stats: {
        drafts: "Drafts",
        draftsBody: "Private listings in progress.",
        featured: "Featured",
        featuredBody: "Eligible for homepage highlights.",
        public: "Public",
        publicBody: "Available or reserved listings.",
      },
      table: { listing: "Listing", location: "Location", price: "Price", status: "Status", type: "Type" },
    },
    form: {
      actions: { create: "Create property", delete: "Delete property", save: "Save changes", viewPublicPage: "View Public Page" },
      checkboxFeatured: "Feature this listing on the homepage",
      editBody: "Update the public presentation, pricing, status, or gallery. Changes flow through to the public site after save.",
      editEyebrow: "Edit Listing",
      featureLabels: {
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
      fields: {
        availabilityEnd: "Available Until",
        availabilityStart: "Available From",
        bathrooms: "Bathrooms",
        bedrooms: "Bedrooms",
        description: "Full Description",
        features: "Feature Pills",
        galleryImages: "Gallery Media",
        interior: "Interior m²",
        internalNotes: "Private Notes",
        listingMode: "Sale / Rent Mode",
        location: "Location",
        mainImage: "Main Image",
        plot: "Plot m²",
        price: "Sale Price (EUR)",
        reference: "Reference Code",
        rentPrice: "Rent Price From (EUR)",
        rentPricePeriod: "Rent Price Period",
        rentalPeriods: "Rent Periods",
        shortDescription: "Short Description",
        slug: "Slug",
        status: "Status",
        title: "Title",
        type: "Property Type",
      },
      fieldNotes: {
        availability: "Used for public rent-date filtering.",
        features: "Shown publicly as feature pills.",
        galleryImages: "Upload photos or videos, or paste one media URL per line.",
        internalNotes: "Private admin notes. Never shown on the public website.",
        mainImage: "This is the first photo buyers see.",
        reference: "Generated from the title. You can still edit it.",
        rentalPeriods: "Choose the rental arrangements this property can support.",
        slug: "Used in the public page URL.",
      },
      importer: {
        body: "Paste a public property link and we will prefill the form with title, pricing, rooms, description, and media when the source allows it.",
        cta: "Import from link",
        placeholder: "https://info-home.link/app/whatsapp/...",
        reset: "Clear imported draft",
        title: "Start from a source link",
      },
      listingModeLabels: { both: "Sale and rent", rent: "Rent only", sale: "Sale only" },
      newBody:
        "Start with the title, then add sale or rent settings, availability dates, descriptions, and photos. Mark it available only when it is ready to show.",
      newEyebrow: "New Listing",
      newTitle: "Add a property to the live inventory.",
      placeholders: {
        description: "Full listing description for the property detail page.",
        imageUrl: "Upload an image or paste an image URL",
        internalNotes: "Owner preferences, key notes, rental reminders, or follow-up context.",
        location: "Torrevieja",
        shortDescription: "One concise paragraph used in cards and previews.",
        title: "Stylish villa near the salt lakes",
      },
      rentPricePeriodLabels: { month: "Per month", night: "Per night", week: "Per week" },
      rentalPeriodLabels: {
        long_term: "Long term",
        monthly: "Monthly",
        nightly: "Nightly",
        seasonal: "Seasonal",
        weekly: "Weekly",
      },
    },
    languageLabel: "Admin language",
    layout: {
      adminLabel: "Admin",
      dashboard: "Dashboard",
      missingConfigBody:
        "Add the Supabase environment variables, run the property migrations, and create the admin user in Supabase Auth.",
      missingConfigTitle: "Admin setup incomplete",
      newListing: "New Listing",
      signOut: "Sign out",
      title: "Property management",
      viewSite: "View Site",
    },
    login: {
      body: "Add new homes, update prices, mark properties reserved, and keep the site inventory current from one place.",
      email: "Email",
      emailPlaceholder: "admin@example.com",
      envError: "Supabase environment variables are missing.",
      loginErrorFallback: "Sign in failed. Please check the email and password.",
      password: "Password",
      privateAdmin: "Private Admin",
      setupBody: "Add Supabase environment variables to `.env.local`, then create the admin user in Supabase Auth.",
      setupTitle: "Admin setup still needed",
      signingIn: "Signing in...",
      submit: "Sign in to admin",
      title: "Sign in to manage property listings.",
      unauthorized: "This account signed in successfully, but it is not listed in `ADMIN_EMAILS`.",
    },
    statusLabels: { available: "Available", draft: "Draft", reserved: "Reserved", sold: "Sold" },
    typeLabels: { apartment: "Apartment", bungalow: "Bungalow", finca: "Finca", penthouse: "Penthouse", townhouse: "Townhouse", villa: "Villa" },
    upload: {
      compressingImage: "Compressing large image before upload...",
      convertingImage: "Converting HEIC image...",
      fileTooLarge: "Files must be 50 MB or smaller after compression.",
      galleryPlaceholder: "Upload images or videos, or paste one media URL per line.",
      imagePlaceholder: "Upload an image or paste an image URL",
      imageUploaded: "Image uploaded.",
      uploadFailed: "Media upload failed.",
      uploadGallery: "Upload gallery media",
      uploadImage: "Upload image",
      uploading: "Uploading...",
      uploadedCount: "{count} files uploaded.",
      videoTooLarge: "Videos must be 50 MB or smaller. Please compress the video before uploading.",
    },
  },
  es: {
    accessibility: {
      title: "Para que el trabajo diario sea más fácil",
      body: "El panel evita que tenga que tocar URLs o ajustes técnicos: todo se hace con botones, campos claros y subida de fotos.",
      items: [
        "Usar Nueva propiedad para añadir una vivienda desde un formulario guiado.",
        "Escribir primero el título; la referencia y la URL pública se crean solas.",
        "Subir imágenes desde el ordenador en vez de pegar enlaces.",
      ],
    },
    dashboard: {
      actions: { createFirst: "Crear primera propiedad", newListing: "Nueva propiedad", viewPublicSite: "Ver web pública" },
      emptyBody: "Crea la primera propiedad, añade imágenes y márcala como disponible cuando esté lista para la web pública.",
      emptyTitle: "Todavía no hay propiedades",
      heroBody:
        "Mantén la web pública actualizada desde un espacio más sencillo. Los borradores son privados; las viviendas disponibles o reservadas pueden aparecer en la web.",
      heroEyebrow: "Resumen del inventario",
      heroTitle: (count) => `${count} propiedades en el sistema`,
      inquiries: {
        email: "Correo",
        empty: "Aquí aparecerán los nuevos mensajes de clientes y las solicitudes de visita.",
        eyebrow: "Contacto de clientes",
        message: "Mensaje",
        phone: "Teléfono",
        preferredTime: "Horario preferido",
        property: "Propiedad",
        reply: "Responder",
        title: "Consultas recientes",
      },
      listingsEyebrow: "Propiedades",
      listingsTitle: "Gestionar inventario",
      stats: {
        drafts: "Borradores",
        draftsBody: "Propiedades privadas en preparación.",
        featured: "Destacadas",
        featuredBody: "Pueden aparecer en la portada.",
        public: "Públicas",
        publicBody: "Disponibles o reservadas.",
      },
      table: { listing: "Propiedad", location: "Ubicación", price: "Precio", status: "Estado", type: "Tipo" },
    },
    form: {
      actions: { create: "Crear propiedad", delete: "Eliminar propiedad", save: "Guardar cambios", viewPublicPage: "Ver página pública" },
      checkboxFeatured: "Destacar esta propiedad en la portada",
      editBody: "Actualiza la presentación, precio, estado o galería. Los cambios aparecerán en la web pública al guardar.",
      editEyebrow: "Editar propiedad",
      featureLabels: {
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
      fields: {
        availabilityEnd: "Disponible hasta",
        availabilityStart: "Disponible desde",
        bathrooms: "Baños",
        bedrooms: "Dormitorios",
        description: "Descripción completa",
        features: "Características",
        galleryImages: "Galería multimedia",
        interior: "Interior m²",
        internalNotes: "Notas privadas",
        listingMode: "Venta / alquiler",
        location: "Ubicación",
        mainImage: "Imagen principal",
        plot: "Parcela m²",
        price: "Precio de venta (EUR)",
        reference: "Referencia",
        rentPrice: "Precio de alquiler desde (EUR)",
        rentPricePeriod: "Periodo del alquiler",
        rentalPeriods: "Modalidades de alquiler",
        shortDescription: "Descripción breve",
        slug: "URL corta",
        status: "Estado",
        title: "Título",
        type: "Tipo de propiedad",
      },
      fieldNotes: {
        availability: "Se usa en el filtro público de fechas para alquiler.",
        features: "Se muestran públicamente como etiquetas rápidas.",
        galleryImages: "Sube fotos o vídeos, o pega un enlace por línea.",
        internalNotes: "Notas privadas para gestión interna. Nunca se muestran en la web pública.",
        mainImage: "Es la primera foto que verán los compradores.",
        reference: "Se genera desde el título. También se puede editar.",
        rentalPeriods: "Elige las modalidades de alquiler que admite esta propiedad.",
        slug: "Se usa en la URL pública de la propiedad.",
      },
      importer: {
        body: "Pega un enlace público de una propiedad y rellenaremos el formulario con título, precio, habitaciones, descripción y medios cuando la fuente lo permita.",
        cta: "Importar desde enlace",
        placeholder: "https://info-home.link/app/whatsapp/...",
        reset: "Borrar borrador importado",
        title: "Empezar desde un enlace",
      },
      listingModeLabels: { both: "Venta y alquiler", rent: "Solo alquiler", sale: "Solo venta" },
      newBody: "Empieza con el título, luego añade venta o alquiler, fechas disponibles, descripciones y fotos. Márcala disponible solo cuando esté lista.",
      newEyebrow: "Nueva propiedad",
      newTitle: "Añadir una propiedad al inventario.",
      placeholders: {
        description: "Descripción completa para la página de detalle.",
        imageUrl: "Sube una imagen o pega una URL",
        internalNotes: "Preferencias del propietario, recordatorios de llaves o contexto de seguimiento.",
        location: "Torrevieja",
        shortDescription: "Un párrafo breve para tarjetas y vistas previas.",
        title: "Villa elegante cerca de las salinas",
      },
      rentPricePeriodLabels: { month: "Por mes", night: "Por noche", week: "Por semana" },
      rentalPeriodLabels: {
        long_term: "Larga estancia",
        monthly: "Mensual",
        nightly: "Noches",
        seasonal: "Temporada",
        weekly: "Semanal",
      },
    },
    languageLabel: "Idioma del panel",
    layout: {
      adminLabel: "Admin",
      dashboard: "Panel",
      missingConfigBody: "Añade las variables de Supabase, ejecuta las migraciones y crea el usuario administrador.",
      missingConfigTitle: "Configuración incompleta",
      newListing: "Nueva propiedad",
      signOut: "Cerrar sesión",
      title: "Gestión de propiedades",
      viewSite: "Ver web",
    },
    login: {
      body: "Añade viviendas, actualiza precios, marca propiedades reservadas y mantén el inventario desde un solo lugar.",
      email: "Email",
      emailPlaceholder: "admin@example.com",
      envError: "Faltan las variables de entorno de Supabase.",
      loginErrorFallback: "No se pudo iniciar sesión. Revisa el email y la contraseña.",
      password: "Contraseña",
      privateAdmin: "Admin privado",
      setupBody: "Añade las variables de Supabase a `.env.local` y crea el usuario administrador en Supabase Auth.",
      setupTitle: "Falta configurar el admin",
      signingIn: "Entrando...",
      submit: "Entrar al panel",
      title: "Entrar para gestionar propiedades.",
      unauthorized: "La cuenta inició sesión, pero no está incluida en `ADMIN_EMAILS`.",
    },
    statusLabels: { available: "Disponible", draft: "Borrador", reserved: "Reservada", sold: "Vendida" },
    typeLabels: { apartment: "Apartamento", bungalow: "Bungaló", finca: "Finca", penthouse: "Ático", townhouse: "Adosado", villa: "Villa" },
    upload: {
      compressingImage: "Comprimiendo imagen grande antes de subir...",
      convertingImage: "Convirtiendo imagen HEIC...",
      fileTooLarge: "Los archivos deben quedar en 50 MB o menos después de la compresión.",
      galleryPlaceholder: "Sube imágenes o vídeos, o pega una URL por línea.",
      imagePlaceholder: "Sube una imagen o pega una URL",
      imageUploaded: "Imagen subida.",
      uploadFailed: "No se pudo subir el archivo.",
      uploadGallery: "Subir galería",
      uploadImage: "Subir imagen",
      uploading: "Subiendo...",
      uploadedCount: "{count} archivos subidos.",
      videoTooLarge: "Los vídeos deben pesar 50 MB o menos. Comprímelo antes de subirlo.",
    },
  },
  ru: {
    accessibility: {
      title: "Чтобы маме было проще работать",
      body: "Админ-панель сделана так, чтобы не нужно было менять ссылки вручную: все основные действия доступны через кнопки, поля и загрузку фото.",
      items: [
        "Нажмите Новая недвижимость, чтобы добавить объект через понятную форму.",
        "Сначала введите название; ссылка и референс создаются автоматически.",
        "Загружайте фотографии с компьютера вместо вставки ссылок.",
      ],
    },
    dashboard: {
      actions: { createFirst: "Создать первый объект", newListing: "Новая недвижимость", viewPublicSite: "Открыть сайт" },
      emptyBody: "Создайте первый объект, добавьте фотографии и отметьте его доступным, когда он готов для сайта.",
      emptyTitle: "Объектов пока нет",
      heroBody:
        "Обновляйте сайт из одного спокойного рабочего места. Черновики остаются приватными, а доступные и зарезервированные объекты могут появляться на сайте.",
      heroEyebrow: "Обзор каталога",
      heroTitle: (count) => `${count} объектов в системе`,
      inquiries: {
        email: "Email",
        empty: "Здесь будут появляться новые сообщения клиентов и запросы на просмотр.",
        eyebrow: "Контакты клиентов",
        message: "Сообщение",
        phone: "Телефон",
        preferredTime: "Предпочтительное время",
        property: "Объект",
        reply: "Ответить",
        title: "Последние запросы",
      },
      listingsEyebrow: "Объекты",
      listingsTitle: "Управление каталогом",
      stats: {
        drafts: "Черновики",
        draftsBody: "Приватные объекты в подготовке.",
        featured: "На главной",
        featuredBody: "Могут показываться на главной странице.",
        public: "Публичные",
        publicBody: "Доступные или зарезервированные.",
      },
      table: { listing: "Объект", location: "Локация", price: "Цена", status: "Статус", type: "Тип" },
    },
    form: {
      actions: { create: "Создать объект", delete: "Удалить объект", save: "Сохранить", viewPublicPage: "Открыть страницу" },
      checkboxFeatured: "Показать этот объект на главной странице",
      editBody: "Обновите описание, цену, статус или галерею. После сохранения изменения появятся на сайте.",
      editEyebrow: "Редактировать объект",
      featureLabels: {
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
      fields: {
        availabilityEnd: "Доступно до",
        availabilityStart: "Доступно с",
        bathrooms: "Ванные",
        bedrooms: "Спальни",
        description: "Полное описание",
        features: "Особенности",
        galleryImages: "Галерея медиа",
        interior: "Площадь м²",
        internalNotes: "Внутренние заметки",
        listingMode: "Продажа / аренда",
        location: "Локация",
        mainImage: "Главное фото",
        plot: "Участок м²",
        price: "Цена продажи (EUR)",
        reference: "Референс",
        rentPrice: "Аренда от (EUR)",
        rentPricePeriod: "Период аренды",
        rentalPeriods: "Форматы аренды",
        shortDescription: "Краткое описание",
        slug: "Короткая ссылка",
        status: "Статус",
        title: "Название",
        type: "Тип недвижимости",
      },
      fieldNotes: {
        availability: "Используется в публичном поиске аренды по датам.",
        features: "Показываются публично как теги объекта.",
        galleryImages: "Загрузите фото или видео либо вставьте по одной ссылке в строку.",
        internalNotes: "Приватные заметки для управления. Никогда не показываются на сайте.",
        mainImage: "Это первое фото, которое увидят покупатели.",
        reference: "Создается из названия. Можно изменить вручную.",
        rentalPeriods: "Выберите форматы аренды, которые поддерживает объект.",
        slug: "Используется в публичной ссылке объекта.",
      },
      importer: {
        body: "Вставьте публичную ссылку на объект, и мы заполним форму названием, ценой, комнатами, описанием и медиа, если источник это позволяет.",
        cta: "Импортировать по ссылке",
        placeholder: "https://info-home.link/app/whatsapp/...",
        reset: "Очистить импортированный черновик",
        title: "Начать со ссылки",
      },
      listingModeLabels: { both: "Продажа и аренда", rent: "Только аренда", sale: "Только продажа" },
      newBody: "Начните с названия, затем добавьте продажу или аренду, даты доступности, описания и фото. Отмечайте доступным только готовый объект.",
      newEyebrow: "Новая недвижимость",
      newTitle: "Добавить объект в каталог.",
      placeholders: {
        description: "Полное описание для страницы объекта.",
        imageUrl: "Загрузите фото или вставьте URL",
        internalNotes: "Предпочтения владельца, заметки по ключам, аренде или напоминания для себя.",
        location: "Torrevieja",
        shortDescription: "Короткий абзац для карточек и превью.",
        title: "Стильная вилла рядом с солеными озерами",
      },
      rentPricePeriodLabels: { month: "В месяц", night: "За ночь", week: "За неделю" },
      rentalPeriodLabels: {
        long_term: "Долгосрочно",
        monthly: "Помесячно",
        nightly: "Посуточно",
        seasonal: "По сезонам",
        weekly: "Понедельно",
      },
    },
    languageLabel: "Язык админ-панели",
    layout: {
      adminLabel: "Админ",
      dashboard: "Панель",
      missingConfigBody: "Добавьте переменные Supabase, выполните миграции и создайте администратора.",
      missingConfigTitle: "Настройка не завершена",
      newListing: "Новая недвижимость",
      signOut: "Выйти",
      title: "Управление недвижимостью",
      viewSite: "Открыть сайт",
    },
    login: {
      body: "Добавляйте объекты, обновляйте цены, отмечайте резервы и поддерживайте каталог из одного места.",
      email: "Email",
      emailPlaceholder: "admin@example.com",
      envError: "Не хватает переменных окружения Supabase.",
      loginErrorFallback: "Не удалось войти. Проверьте email и пароль.",
      password: "Пароль",
      privateAdmin: "Приватный админ",
      setupBody: "Добавьте переменные Supabase в `.env.local` и создайте администратора в Supabase Auth.",
      setupTitle: "Нужно настроить админ-панель",
      signingIn: "Вход...",
      submit: "Войти в админ-панель",
      title: "Войдите, чтобы управлять объектами.",
      unauthorized: "Вход выполнен, но этот email не добавлен в `ADMIN_EMAILS`.",
    },
    statusLabels: { available: "Доступно", draft: "Черновик", reserved: "Забронировано", sold: "Продано" },
    typeLabels: { apartment: "Апартаменты", bungalow: "Бунгало", finca: "Финка", penthouse: "Пентхаус", townhouse: "Таунхаус", villa: "Вилла" },
    upload: {
      compressingImage: "Сжимаем большое изображение перед загрузкой...",
      convertingImage: "Конвертируем HEIC-фото...",
      fileTooLarge: "Файл должен быть не больше 50 МБ после сжатия.",
      galleryPlaceholder: "Загрузите фото или видео либо вставьте по одной ссылке в строку.",
      imagePlaceholder: "Загрузите фото или вставьте URL",
      imageUploaded: "Фото загружено.",
      uploadFailed: "Не удалось загрузить файл.",
      uploadGallery: "Загрузить медиа",
      uploadImage: "Загрузить фото",
      uploading: "Загрузка...",
      uploadedCount: "Загружено файлов: {count}.",
      videoTooLarge: "Видео должно быть не больше 50 МБ. Сожмите его перед загрузкой.",
    },
  },
  de: {} as AdminCopy,
};

adminCopy.de = adminCopy.en;
